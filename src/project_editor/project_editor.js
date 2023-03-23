import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';

import { History } from './history.js';
import { Navigator } from './navigator.js';
import { saveFile, makeDateStampSuffix } from '../project_editor/saving.js';
import { json, getFirstID, clone, round } from '../common/functions.js';
import { MultiSelectPoints, MultiSelectPaths } from './multiselect.js';
import { Glyph } from '../project_data/glyph.js';
import { decToHex, isHex, validateAsHex } from '../common/character_ids.js';
import { publish, subscribe, unsubscribe } from './pub-sub.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { log } from '../app/main.js';
import { HKern } from '../project_data/h_kern.js';
import { areGlyphRangesEqual } from '../pages/settings.js';
import { getUnicodeBlockByName } from '../lib/unicode_blocks.js';
import { basicLatinOrder, GlyphRange } from '../project_data/glyph_range.js';

/**
 * Creates a new Glyphr Studio Project Editor.
 * An Editor is all the UI it takes to edit a project,
 * including Pages, Panels, History, Saved State,
 * Import/Export, etc.
 *
 * Many Project Editors can be run side-by-side,
 * editing many Glyphr Studio Projects. Could be
 * in tabs or separate windows, but the App has
 * access to all the Project Editors, enabling
 * cross-project features like glyph copy/paste.
 */
export class ProjectEditor {
	/**
	 * Initialize a project editor, with defaults
	 * @param {object} newProjectEditor
	 */
	constructor(newProjectEditor = {}) {
		// log('ProjectEditor.constructor', 'start');

		// History
		this.history = new History();

		// Project
		this.project = newProjectEditor.project;

		// Saving
		this.projectSaved = true;
		this.stopPageNavigation = true;

		// PubSub
		this.subscribers = {};
		this.publish = publish;
		this.subscribe = subscribe;
		this.unsubscribe = unsubscribe;

		// Selections
		this.selectedGlyphID = '0x41';
		this.selectedComponentID = false;
		this.selectedLigatureID = false;
		this.selectedKernID = false;
		this.selectedGlyphRange = false;

		// Navigation
		this.nav = new Navigator();

		// Canvas
		this.editCanvas = false;

		// Views
		this._views = {};
		this.defaultView = { dx: 200, dy: 500, dz: 0.5, default: true };
		this.defaultKernView = { dx: 500, dy: 500, dz: 0.5, default: true };

		// Ghost Canvas
		this.canvasSize = 2000;
		this.ghostCanvas = document.createElement('canvas');
		this.ghostCanvas.width = this.canvasSize;
		this.ghostCanvas.height = this.canvasSize;
		this.ghostCTX = this.ghostCanvas.getContext('2d', {
			alpha: false,
			willReadFrequently: true,
		});

		// Canvas Event handlers
		this.eventHandlers = {};
		this.selectedTool = 'resize';

		// MultiSelect
		this.multiSelect = {
			points: new MultiSelectPoints(),
			paths: new MultiSelectPaths(),
		};

		// Clipboard
		this.clipboard = false;

		// Dialogs
		this.closeAllDialogsOverride = false;

		// log(this);
		// log('ProjectEditor.constructor', 'end');
	}

	// --------------------------------------------------------------
	// Navigate
	// --------------------------------------------------------------
	navigate() {
		// log(`ProjectEditor.navigate`, 'start');

		this.nav.navigate();
		this.autoFitIfViewIsDefault();
		// if (this.nav.isOnEditCanvasPage) {
		// 	this.history.addState(`Navigated to ${this.nav.page}`);
		// }

		// log(`ProjectEditor.navigate`, 'end');
	}

	// --------------------------------------------------------------
	// Project
	// --------------------------------------------------------------

	/**
	 * Get the project for this editor
	 * @returns {GlyphrStudioProject}
	 */
	get project() {
		if (!this._project || this._project === {}) {
			// log(`Calling new GlyphrStudioProject from ProjectEditor GET .project`);
			this._project = new GlyphrStudioProject();
			this.initializeHistory(this._project);
		}
		return this._project;
	}

	/**
	 * Set the project for this editor
	 * @param {GlyphrStudioProject} gsp - project to set
	 * @returns {GlyphrStudioProject}
	 */
	set project(gsp) {
		if (!gsp) return;
		// log(`Calling new GlyphrStudioProject from ProjectEditor SET .project`);
		this._project = new GlyphrStudioProject(gsp);
		this.initializeHistory(gsp);
	}

	initializeHistory(project) {
		this.history = new History();
		this.history.queue = [];
		this.history.initialTimeStamp = new Date().getTime();
		this.history.initialProject = project;
	}

	// --------------------------------------------------------------
	// Get Individual Selected Work Items
	// --------------------------------------------------------------

	/**
	 * Returns the appropriate Glyph, Ligature, or Component
	 * based on the current page
	 */
	get selectedItem() {
		// log(`ProjectEditor GET selectedItem`, 'start');

		if (this.nav.page === 'Glyph edit') {
			// log(`this.selectedGlyph: ${this.selectedGlyph}`);
			// log(`ProjectEditor GET selectedItem`, 'end');
			return this.selectedGlyph;
		} else if (this.nav.page === 'Components') {
			// log(`this.selectedComponent: ${this.selectedComponent}`);
			// log(`ProjectEditor GET selectedItem`, 'end');
			return this.selectedComponent;
		} else if (this.nav.page === 'Ligatures') {
			// log(`this.selectedLigature: ${this.selectedLigature}`);
			// log(`ProjectEditor GET selectedItem`, 'end');
			return this.selectedLigature;
		} else {
			// log(`Nav page not detected`);
			// log(`ProjectEditor GET selectedItem`, 'end');
			return false;
		}
	}

	/**
	 * Returns the appropriate Glyph, Ligature or Component
	 * ID based on the current page
	 */
	get selectedItemID() {
		if (this.nav.page === 'Glyph edit') return this.selectedGlyphID;
		else if (this.nav.page === 'Components') return this.selectedComponentID;
		else if (this.nav.page === 'Ligatures') return this.selectedLigatureID;
		else if (this.nav.page === 'Kerning') return this.selectedKernID;
		else return false;
	}

	/**
	 * Returns the selected glyph
	 * @returns {object}
	 */
	get selectedGlyph() {
		// log('ProjectEditor GET selectedGlyph', 'start');
		const selectedID = this.selectedGlyphID;
		// log(`selectedGlyphID ${selectedID}`);
		const re = this.project.glyphs[selectedID];
		// log(re);
		// log('ProjectEditor GET selectedGlyph', 'end');
		return re;
	}

	/**
	 * Returns the selected glyph ID
	 * @returns {string}
	 */
	get selectedGlyphID() {
		// log('ProjectEditor GET selectedGlyphID', 'start');

		if (!this._selectedGlyphID) {
			this._selectedGlyphID = getFirstID(this.project.glyphs);
		}
		// log(`RETURNING this._selectedGlyphID: ${this._selectedGlyphID}`);
		// log('ProjectEditor GET selectedGlyphID', 'end');
		return this._selectedGlyphID;
	}

	/**
	 * Returns the selected ligature
	 * @returns {object}
	 */
	get selectedLigature() {
		// log(`ProjectEditor GET selectedLigature`, 'start');
		const selectedID = this.selectedLigatureID;
		const re = this.project.ligatures[selectedID];
		// log(`ProjectEditor GET selectedLigature`, 'end');
		return re;
	}

	/**
	 * Returns the selected ligature ID
	 * @returns {string}
	 */
	get selectedLigatureID() {
		// log(`ProjectEditor GET selectedLigatureID`, 'start');
		if (!this._selectedLigatureID) {
			this._selectedLigatureID = getFirstID(this.project.ligatures);
		}
		// log(`ProjectEditor GET selectedLigatureID`, 'end');
		return this._selectedLigatureID;
	}

	/**
	 * Returns the selected component
	 * @returns {object}
	 */
	get selectedComponent() {
		const re = this.project.components[this.selectedComponentID];
		return re;
	}

	/**
	 * Returns the selected component ID
	 * @returns {string}
	 */
	get selectedComponentID() {
		if (!this.selectedComponentID) {
			this._selectedComponentID = getFirstID(this.project.components);
		}
		return this._selectedComponentID;
	}

	/**
	 * Returns the selected kern
	 * @returns {object}
	 */
	get selectedKern() {
		const re = this.project.kerns[this.selectedKernID];
		return re;
	}

	/**
	 * Returns the selected kern ID
	 * @returns {string}
	 */
	get selectedKernID() {
		if (!this._selectedKernID) {
			this._selectedKernID = getFirstID(this.project.kerning);
		}
		return this._selectedKernID;
	}

	/**
	 * Returns the selected Glyph Range
	 * @returns {Object}
	 */
	get selectedGlyphRange() {
		// log(`ProjectEditor.selectedGlyphRange`, 'start');
		// log('current ranges');
		const ranges = this.project.settings.project.glyphRanges;
		// log(ranges);
		// log('currently selected');
		// log(this._selectedGlyphRange);

		if (!this._selectedGlyphRange || !this._selectedGlyphRange.isValid) {
			// log('detected none selected');
			if (ranges.length) {
				// log('was false, returning first range');
				this._selectedGlyphRange = ranges[0];
			} else {
				// log('was false, and no ranges, returning default');
				this._selectedGlyphRange = new GlyphRange({ end: 0x7f, name: 'Basic Latin (default)' });
			}
		}

		// log(`returning`);
		// log(this._selectedGlyphRange);
		// log(`ProjectEditor.selectedGlyphRange`, 'end');
		return this._selectedGlyphRange;
	}

	// --------------------------------------------------------------
	// Set Selected Work Items
	// --------------------------------------------------------------

	/**
	 * Sets the appropriate Glyph, Ligature, or Component
	 * based on the current page
	 */
	set selectedItem(newItem) {
		// log(`ProjectEditor SET selectedItem`, 'start');

		if (this.nav.page === 'Glyph edit') {
			// log(`this.selectedGlyph: ${this.selectedGlyph}`);
			// log(`ProjectEditor SET selectedItem`, 'end');
			this.selectedGlyph = newItem;
		} else if (this.nav.page === 'Components') {
			// log(`this.selectedComponent: ${this.selectedComponent}`);
			// log(`ProjectEditor SET selectedItem`, 'end');
			this.selectedComponent = newItem;
		} else if (this.nav.page === 'Ligatures') {
			// log(`this.selectedLigature: ${this.selectedLigature}`);
			// log(`ProjectEditor SET selectedItem`, 'end');
			this.selectedLigature = newItem;
		}
	}

	/**
	 * Sets the selected item based on nav.page
	 * @param {string} id - ID to select
	 */
	set selectedItemID(newID) {
		// should this detect ID format?
		if (this.nav.page === 'Glyph edit') this.selectedGlyphID = newID;
		else if (this.nav.page === 'Components') this.selectedComponentID = newID;
		else if (this.nav.page === 'Ligatures') this.selectedLigatureID = newID;
		else if (this.nav.page === 'Kerning') this.selectedKernID = newID;
	}

	/**
	 * Replaces the current Glyph
	 * @param {Glyph} newGlyph - new glyph to set
	 */
	set selectedGlyph(newGlyph = {}) {
		let id = this.selectedGlyphID;
		newGlyph = new Glyph(newGlyph);
		newGlyph.parent = this.project;
		this.project.glyphs[id] = newGlyph;
	}

	/**
	 * Sets the selected glyph
	 * @param {string} id - ID to select
	 */
	set selectedGlyphID(id) {
		// log(`ProjectEditor SET selectedGlyphID`, 'start');
		// log(`id: ${id}`);
		if (typeof id !== 'string') return;
		if (!isHex(id)) {
			this._selectedGlyphID = false;
			return;
		}
		if (this.project.glyphs[id]) {
			this._selectedGlyphID = id;
		} else if (isHex(id)) {
			id = validateAsHex(id);
			this.project.glyphs[id] = new Glyph({ id: id, parent: this.project });
			this._selectedGlyphID = id;
		}
		this.publish('whichGlyphIsSelected', this.selectedGlyphID);
		// log(`ProjectEditor SET selectedGlyphID`, 'end');
	}

	/**
	 * Replaces the current Ligature
	 * @param {Glyph} newLigature - new ligature to set
	 */
	set selectedLigature(newLigature = {}) {
		let id = this.selectedLigatureID;
		newLigature = new Glyph(newLigature);
		newLigature.parent = this.project;
		this.project.ligatures[id] = newLigature;
	}

	/**
	 * Sets the selected ligature
	 * @param {string} id - ID to select
	 */
	set selectedLigatureID(id) {
		if (typeof id !== 'string') return;
		if (this.project.ligatures[id]) {
			this._selectedLigatureID = id;
		} else {
			console.warn(`Ligature ID ${id} does not exist in the project.`);
			this._selectedLigatureID = getFirstID(this.project.ligatures);
		}
		this.publish('whichLigatureIsSelected', this.selectedLigatureID);
	}

	/**
	 * Replaces the current Component
	 * @param {Glyph} newComponent - new component to set
	 */
	set selectedComponent(newComponent = {}) {
		let id = this.selectedComponentID;
		newComponent = new Glyph(newComponent);
		newComponent.parent = this.project;
		this.project.components[id] = newComponent;
	}

	/**
	 * Sets the selected component
	 * @param {string} id - ID to select
	 */
	set selectedComponentID(id) {
		if (typeof id !== 'string') return;
		if (this.project.components[id]) {
			this._selectedComponentID = id;
		} else {
			console.warn(`Component ID ${id} does not exist in the project.`);
			this._selectedComponentID = getFirstID(this.project.components);
		}

		this.publish('whichComponentIsSelected', this.selectedComponentID);
	}

	/**
	 * Replaces the current Kern
	 * @param {HKern} newKern - new kern to set
	 */
	set selectedKern(newKern = {}) {
		let id = this.selectedKernID;
		newKern = new HKern(newKern);
		this.project.kerns[id] = newKern;
	}

	/**
	 * Sets the selected kern
	 * @param {string} id - ID to select
	 */
	set selectedKernID(id) {
		if (typeof id !== 'string') return;
		if (this.project.kerns[id]) {
			this._selectedKernID = id;
		} else {
			console.warn(`Kern ID ${id} does not exist in the project.`);
			this._selectedKernID = getFirstID(this.project.kerns);
		}

		this.publish('whichKernIsSelected', this.selectedKernID);
	}

	/**
	 * Sets the selected glyph range
	 * @param {Object} newRange - range object
	 */
	set selectedGlyphRange(newRange) {
		this._selectedGlyphRange = new GlyphRange(newRange);
	}

	// --------------------------------------------------------------
	// Project-level actions
	// --------------------------------------------------------------

	deleteSelectedItemFromProject(page = false) {
		const itemType = page || this.nav.page;
		let id;
		let historyTitle;
		if (itemType === 'Glyph edit') {
			// log(`deleting selectedGlyphID: ${this.selectedGlyphID}`);
			id = this.selectedGlyphID;
			historyTitle = `Deleted Glyph ${id} : ${this.selectedGlyph.name}`;
			this.history.addState(historyTitle, { itemWasDeleted: true });
			delete this.project.glyphs[id];
		} else if (itemType === 'Components') {
			// log(`deleting selectedComponentID: ${this.selectedComponentID}`);
			id = this.selectedComponentID;
			historyTitle = `Deleted Component ${id} : ${this.selectedComponent.name}`;
			this.history.addState(historyTitle, { itemWasDeleted: true });
			delete this.project.components[id];
		} else if (itemType === 'Ligatures') {
			// log(`deleting selectedLigatureID: ${this.selectedLigatureID}`);
			id = this.selectedLigatureID;
			historyTitle = `Deleted Ligature ${id} : ${this.selectedLigature.name}`;
			this.history.addState(historyTitle, { itemWasDeleted: true });
			delete this.project.ligatures[id];
		} else if (itemType === 'Kerning') {
			// log(`deleting selectedKernID: ${this.selectedKernID}`);
			id = this.selectedKernID;
			historyTitle = `Deleted Kern ${id} : ${this.selectedKern.name}`;
			this.history.addState(historyTitle, { itemWasDeleted: true });
			delete this.project.kerning[id];
		}

		this.selectFallbackItem();
	}

	/**
	 * When an item is deleted, this finds the next best item to select.
	 * For Glyphs, there is additional logic to stay within the current
	 * selected range, and to special case Basic Latin order.
	 * For Ligatures, Components, and Kerns, it's just the first item.
	 */
	selectFallbackItem(page = false) {
		// log(`ProjectEditor.selectFallbackItem`, 'start');
		const itemType = page || this.nav.page;

		if (itemType === 'Glyph edit') {
			const selectedRange = this.selectedGlyphRange;
			if (selectedRange) {
				if (areGlyphRangesEqual(getUnicodeBlockByName('Basic Latin'), selectedRange)) {
					// log(`Selected range detected as BASIC LATIN`);

					for (let i = 0; i < basicLatinOrder.length; i++) {
						// log(`checking id ${basicLatinOrder[i]}`);
						if (this.project.glyphs[basicLatinOrder[i]]) {
							this.selectedGlyphID = decToHex(basicLatinOrder[i]);
							break;
						}
					}
				} else {
					// log(`Selected Range detected as ${selectedRange.name}`);

					for (let id = selectedRange.begin; id <= selectedRange.end; id++) {
						if (this.project.glyphs[id]) {
							this.selectedGlyphID = decToHex(id);
							break;
						}
					}
				}
			}
			// log(`new selectedGlyphID: ${this.selectedGlyphID}`);
		} else if (itemType === 'Components') {
			this.selectedComponentID = getFirstID(this.project.components);
			// log(`new selectedComponentID: ${this.selectedComponentID}`);
		} else if (itemType === 'Ligatures') {
			this.selectedLigatureID = getFirstID(this.project.ligatures);
			// log(`new selectedLigatureID: ${this.selectedLigatureID}`);
		} else if (itemType === 'Kern') {
			this.selectedKernID = getFirstID(this.project.kerning);
			// log(`new selectedKernID: ${this.selectedKernID}`);
		}
		// log(`ProjectEditor.selectFallbackItem`, 'end');
	}

	// --------------------------------------------------------------
	// Multi-select
	// --------------------------------------------------------------

	/**
	 * Syncs changes to multiselected paths from path point selections
	 * @returns nothing
	 */
	selectPathsThatHaveSelectedPoints() {
		// log('ProjectEditor.selectPathsThatHaveSelectedPoints', 'start');
		const msPoints = this.multiSelect.points;
		const selectedPoints = msPoints.members;
		if (selectedPoints.length === 0) return;

		const msPaths = this.multiSelect.paths;
		const selectedItemPaths = this.selectedItem.paths;

		let parentPath;
		let changed = false;

		for (let p = 0; p < selectedPoints.length; p++) {
			parentPath = selectedPoints[p].parent;
			// if(!msPaths.isSelected(parentPath)) {
			// log(`selecting path`);
			// 	msPaths.add(parentPath);
			// 	changed = true;
			// }
			for (let p = 0; p < selectedItemPaths.length; p++) {
				if (selectedItemPaths[p].objType !== 'ComponentInstance') {
					if (parentPath === selectedItemPaths[p]) {
						// log(`selecting path!`);
						msPaths.add(selectedItemPaths[p]);
						changed = true;
					}
				}
			}
		}

		if (changed) msPaths.publishChanges();
		// log('ProjectEditor.selectPathsThatHaveSelectedPoints', 'end');
	}

	// --------------------------------------------------------------
	// Tool
	// --------------------------------------------------------------

	set selectedTool(newTool) {
		// log(`ProjectEditor.selectedTool SET to ${newTool}`);
		this._selectedTool = newTool;
	}

	get selectedTool() {
		return this._selectedTool;
	}

	// --------------------------------------------------------------
	// Views
	// --------------------------------------------------------------
	/**
	 * Sets the view for the current work item on the current page
	 */
	set view(oa) {
		// log(`ProjectEditor SET view`, 'start');
		let wid = this.selectedItemID;

		// Ensure there are at least defaults
		if (!this._views[wid]) {
			// log(`\t no view, getting default`);
			this._views[wid] = this.view;
		}
		// log(`\t setting ${JSON.stringify(oa)}`);

		// Check for which to set
		if (Number.isFinite(oa.dx)) {
			// log(`oa.dx: ${oa.dx}`);
			this._views[wid].dx = oa.dx;
		}

		if (Number.isFinite(oa.dy)) {
			// log(`oa.dy: ${oa.dy}`);
			this._views[wid].dy = oa.dy;
		}

		if (Number.isFinite(oa.dz)) {
			// log(`oa.dz: ${oa.dz}`);
			this._views[wid].dz = oa.dz;
		}

		if (this._views[wid].default) delete this._views[wid].default;
		// log(`set as ${JSON.stringify(this._views[wid])}`);
		// log(`ProjectEditor SET view`, 'end');
	}

	/**
	 * Gets the current view for the current work item on the current page
	 */
	get view() {
		// log(`ProjectEditor GET view`, 'start');

		let id = this.selectedItemID;
		let re = false;

		if (this._views[id]) {
			re = this._views[id];
		} else if (this.nav.page === 'Kerning') {
			re = clone(this.defaultKernView);
		} else {
			re = clone(this.defaultView);
		}

		// log(`returning ${JSON.stringify(re)}`);
		// log(`ProjectEditor GET view`, 'end');

		return re;
	}

	/**
	 * Check to see if a work item has a view set already
	 * @param {string} id - work item id to check
	 * @returns boolean
	 */
	viewExists(id) {
		return !!this._views[id];
	}

	updateViewZoom(zoomInput, center = {}) {
		// log(`updateViewZoom`, 'start');
		// log(`zoomInput: ${zoomInput}`);
		// log(`center: ${center.x}, ${center.y}`);

		zoomInput = parseFloat(zoomInput);
		const v = this.view;
		const cx = center.x;
		const cy = center.y;

		this.view = {
			dz: zoomInput * v.dz,
			dx: cx ? cx - (cx - v.dx) * zoomInput : v.dx,
			dy: cy ? cy - (cy - v.dy) * zoomInput : v.dy,
		};

		this.publish('view', this.view);
		// log(`updateViewZoom`, 'end');
	}

	setViewZoom(zoomInput) {
		const newValue = parseFloat(zoomInput) / 100;
		this.view = { dz: newValue };
		this.publish('view', this.view);
	}

	makeAutoFitView(rect = false) {
		// log(`ProjectEditor.makeAutoFitView`, 'start');
		// log(`rect: ${rect}`);

		//Zoom
		const newZ = Math.min(
			rect.height / (this.project.totalVertical * 1.2),
			rect.width / (this.selectedItem.advanceWidth * 1.5)
		);

		// Vertical
		const visibleGlyphHeight = this.project.totalVertical * newZ;
		const topSpace = (rect.height - visibleGlyphHeight) / 2;
		const newY = topSpace + this.project.settings.font.ascent * newZ;

		// Horizontal
		let visibleGlyphWidth = this.selectedItem.advanceWidth * newZ;
		if (visibleGlyphWidth === 0) visibleGlyphWidth = rect.width / 3;
		const newX = (rect.width - visibleGlyphWidth) / 2;

		const newView = { dx: round(newX, 3), dy: round(newY, 3), dz: round(newZ, 3) };

		// log(`newView: ${JSON.stringify(newView)}`);
		// log(`ProjectEditor.makeAutoFitView`, 'end');
		return newView;
	}

	autoFitView() {
		// log(`ProjectEditor.autoFitView`, 'start');
		const bounds = this.getEditCanvasWrapperBounds();
		if (bounds) {
			this.view = this.makeAutoFitView(bounds);
			this.publish('view', this.view);
		} else {
			console.warn('autoFitView called before DOM was ready');
			this.view = clone(this.defaultView);
		}
		// log(`ProjectEditor.autoFitView`, 'end');
		return this.view;
	}

	autoFitIfViewIsDefault() {
		if (this.nav.isOnEditCanvasPage && this.selectedWorkItemID) {
			if (this.view.default) {
				this.autoFitView();
				this.publish('view', this.view);
			}
		}
	}

	getEditCanvasWrapperBounds() {
		// log(`getEditCanvasWrapperBounds`, 'start');

		let wrapper = document.getElementsByClassName('editor-page__edit-canvas-wrapper');
		if (wrapper && wrapper[0]) {
			// log(`wrapper[0]: ${wrapper[0]}`);
			// log(`getEditCanvasWrapperBounds`, 'end');
			return wrapper[0].getBoundingClientRect();
		}

		// log(`getEditCanvasWrapperBounds`, 'end');
		return false;
	}

	// --------------------------------------------------------------
	// Save
	// --------------------------------------------------------------

	/**
	 * Save a Glyphr Project Text File
	 * @param {boolean} overwrite - for Electron app, overwrite current working file
	 */
	saveGlyphrProjectFile() {
		// log(`ProjectEditor.saveGlyphrProjectFile`, 'start');

		// log('' + this.project.settings.app.formatSaveFile);

		let saveData = this.project.save();

		// log(`Calling new GlyphrStudioProject from saveGlyphrProjectFile`);
		const defaultValues = new GlyphrStudioProject();
		saveData = removeDefaultValues(saveData, defaultValues, 'settings');

		if (this.project.settings.app.formatSaveFile) saveData = json(saveData);
		else saveData = JSON.stringify(saveData);

		// log('saveGlyphrProjectFile - \n'+saveData);
		const fileName =
			this.project.settings.project.name +
			' - Glyphr Studio Project - ' +
			makeDateStampSuffix() +
			'.gs2';

		saveFile(fileName, saveData);
		showToast('Saved Glyphr Studio Project File');
		this.setProjectAsSaved();
		// log(`ProjectEditor.saveGlyphrProjectFile`, 'end');
	}

	setProjectAsSaved() {}
	setProjectAsUnsaved() {}
}

function removeDefaultValues(target, defaults, filterName) {
	Object.keys(target[filterName]).forEach((key) => {
		if (target[filterName][key] === defaults[filterName][key]) {
			delete target[filterName][key];
		}
	});

	return target;
}

// https://en.wikipedia.org/wiki/Typographic_ligature
export const ligatureToUnicode = {
	ff: '0xFB00',
	fi: '0xFB01',
	fl: '0xFB02',
	ft: '0xFB05',
	ffi: '0xFB03',
	ffl: '0xFB04',
};
