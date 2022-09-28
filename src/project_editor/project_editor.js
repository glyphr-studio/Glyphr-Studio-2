import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';

import { History } from './history.js';
import { Navigator } from './navigator.js';
import { makeElement } from '../common/dom.js';
import { saveFile, makeDateStampSuffix } from '../project_editor/saving.js';
import { json, getFirstID, clone, round } from '../common/functions.js';
import { MultiSelectPoints, MultiSelectPaths } from './multiselect.js';
import { Glyph } from '../project_data/glyph.js';
import { normalizeHex } from '../common/unicode.js';
import { publish, subscribe, unsubscribe } from './pubSub.js';

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
	 * @param {object} newEditor - Glyphr Studio Project File JSON
	 */
	constructor(newProjectEditor = {}) {
		// log('ProjectEditor.constructor', 'start');
		// log('passed > newProjectEditor');
		// log(newProjectEditor);

		// Saving
		this.projectSaved = true;
		this.stopPageNavigation = true;

		// PubSub
		this.subscribers = {};
		this.publish = publish;
		this.subscribe = subscribe;
		this.unsubscribe = unsubscribe;

		// Selections
		this.project = newProjectEditor.project;
		this.selectedGlyphID = '0x0042';
		this.selectedComponentID = false;
		this.selectedLigatureID = false;
		this.selectedKernID = false;

		// Navigation
		this.nav = new Navigator();

		// Canvas
		this.editCanvas = false;

		// Views
		this._views = {};
		this.defaultView = {dx: 200, dy: 500, dz: 0.5, default: true};
		this.defaultKernView = {dx: 500, dy: 500, dz: 0.5, default: true};

		// Ghost Canvas
		this.canvasSize = 2000;
		this.ghostCanvas = document.createElement('canvas');
		this.ghostCanvas.width = this.canvasSize;
		this.ghostCanvas.height = this.canvasSize;
		this.ghostCTX = this.ghostCanvas.getContext('2d');

		// Canvas Event handlers
		this.eventHandlers = {};
		this.selectedTool = 'resize';

		// History
		// this.history = {};
		// this.history['Glyph edit'] = new History('glyphs', this);
		// this.history.components = new History('components', this);
		// this.history.ligatures = new History('ligatures', this);
		// this.history.kerning = new History('kerning', this);

		// MultiSelect
		this.multiSelect = {
			points: new MultiSelectPoints(),
			paths: new MultiSelectPaths(),
		};

		// log(this);
		// log('ProjectEditor.constructor', 'end');
	}


	// --------------------------------------------------------------
	// Navigate
	// --------------------------------------------------------------
	navigate(pageName) {
		log(`ProjectEditor.navigate`, 'start');
		log(`pageName: ${pageName}`);
		this.nav.navigate(pageName);
		this.autoFitIfViewIsDefault();
		log(`ProjectEditor.navigate`, 'end');
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
			this._project = new GlyphrStudioProject();
		}
		return this._project;
	}

	/**
	 * Set the project for this editor
	 * @param {GlyphrStudioProject} gsp - project to set
	 * @returns {GlyphrStudioProject}
	 */
	set project(gsp) {
		this._project = new GlyphrStudioProject(gsp);
	}


	// --------------------------------------------------------------
	// Get Individual Selected Work Items
	// --------------------------------------------------------------

	/**
	 * Returns the appropriate Glyph, Ligature, or Component
	 * based on the current page
	 */
	get selectedItem() {
		if(this.nav.page === 'Glyph edit') return this.selectedGlyph;
		else if (this.nav.page === 'Components') return this.selectedComponent;
		else if (this.nav.page === 'Ligatures') return this.selectedLigature;
		else return false;
	}

	/**
	 * Returns the appropriate Glyph, Ligature or Component
	 * ID based on the current page
	 */
	get selectedItemID() {
		if(this.nav.page === 'Glyph edit') return this.selectedGlyphID;
		else if (this.nav.page === 'Components') return this.selectedComponentID;
		else if (this.nav.page === 'Ligatures') return this.selectedLigatureID;
		else return false;
	}

	/**
	 * Returns the selected glyph
	 * @returns {object}
	 */
	get selectedGlyph() {
		// log('ProjectEditor GET selectedGlyph', 'start');
		const id = this.selectedGlyphID;
		// log(`selectedGlyphID ${id}`);
		const re = this.project.getGlyph(id);
		// log('ProjectEditor GET selectedGlyph', 'end');
		return re || new Glyph();
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

		// log('ProjectEditor GET selectedGlyphID', 'end');
		return this._selectedGlyphID;
	}

	/**
	 * Returns the selected ligature
	 * @returns {object}
	 */
	get selectedLigature() {
		const re = this.ligatures[this.selectedLigatureID];
		return re;
	}

	/**
	 * Returns the selected ligature ID
	 * @returns {string}
	 */
	get selectedLigatureID() {
		if (!this._selectedLigatureID) {
			this._selectedLigatureID = getFirstID(this.project.ligatures);
		}
		return this._selectedLigatureID;
	}

	/**
	 * Returns the selected kern
	 * @returns {object}
	 */
	get selectedKern() {
		const re = this.kerns[this.selectedKernID];
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
	 * Returns the selected component
	 * @returns {object}
	 */
	get selectedComponent() {
		const re = this.components[this.selectedComponentID];
		return re;
	}

	/**
	 * Returns the selected component ID
	 * @returns {string}
	 */
	get selectedComponentID() {
		if (!this._selectedComponentID) {
			this._selectedComponentID = getFirstID(this.project.components);
		}
		return this._selectedComponentID;
	}


	// --------------------------------------------------------------
	// Set Selected Work Items
	// --------------------------------------------------------------

	/**
	 * Sets the selected glyph
	 * @param {string} id - ID to select
	 */
	set selectedGlyphID(id) {
		// log(`ProjectEditor SET selectedGlyphID`, 'start');
		// log(`id: ${id}`);
		// Validate ID!
		this._selectedGlyphID = normalizeHex(id);
		this.publish('whichGlyphIsSelected', this.selectedGlyphID);
		// log(`ProjectEditor SET selectedGlyphID`, 'end');
	}

	/**
	 * Sets the selected ligature
	 * @param {string} id - ID to select
	 */
	set selectedLigatureID(id) {
		// Validate ID!
		this._selectedLigatureID = id;
	}

	/**
	 * Sets the selected kern
	 * @param {string} id - ID to select
	 */
	set selectedKernID(id) {
		// Validate ID!
		this._selectedKernID = id;
	}

	/**
	 * Sets the selected component
	 * @param {string} id - ID to select
	 */
	set selectedComponentID(id) {
		// Validate ID!
		this._selectedComponentID = id;
	}


	// --------------------------------------------------------------
	// Views
	// --------------------------------------------------------------
	/**
	 * Sets the view for the current work item on the current page
	 */
	set view(oa){
		// log(`ProjectEditor SET view`, 'start');
		var wid = this.selectedItemID;

		// Ensure there are at least defaults
		if(!this._views[wid]){
			// log(`\t no view, getting default`);
			this._views[wid] = this.view;
		}
		// log(`\t setting ${JSON.stringify(oa)}`);

		// Check for which to set
		if(isFinite(oa.dx)){
			// log(`oa.dx: ${oa.dx}`);
			this._views[wid].dx = oa.dx;
		}

		if(isFinite(oa.dy)){
			// log(`oa.dy: ${oa.dy}`);
			this._views[wid].dy = oa.dy;
		}

		if(isFinite(oa.dz)){
			// log(`oa.dz: ${oa.dz}`);
			this._views[wid].dz = oa.dz;
		}

		if(this._views[wid].default) delete this._views[wid].default;
		// log(`set as ${JSON.stringify(this._views[wid])}`);
		// log(`ProjectEditor SET view`, 'end');
		return this._views[wid];
	}

	/**
	 * Gets the current view for the current work item on the current page
	 */
	get view(){
		// log(`ProjectEditor GET view`, 'start');

		var id = this.selectedItemID;
		var re = false;

		if(this._views[id]){
			re = this._views[id];
		} else if(this.nav.page === 'Kerning') {
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
	viewExists(id){
		return !!this._views[id];
	}

	setViewZoom(zoomInput) {
		let newValue = parseFloat(zoomInput) / 100;
		this.view = {dz: newValue};
		this.publish('view', this.view);
	}

	makeAutoFitView(rect = false) {
		// log(`ProjectEditor.makeAutoFitView`, 'start');
		// log(`rect: ${rect}`);


		let ps = this.project.projectSettings;

		//Zoom
		let newZ = Math.min(
			(rect.height / (ps.upm * 1.2)),
			(rect.width / (this.selectedItem.advanceWidth * 1.5))
			);

			// Vertical
		let visibleGlyphHeight = ps.upm * newZ;
		let topSpace = (rect.height - visibleGlyphHeight) / 2;
		let newY = topSpace + (ps.ascent * newZ);

		// Horizontal
		let visibleGlyphWidth = this.selectedItem.advanceWidth * newZ;
		let newX = (rect.width - visibleGlyphWidth) / 2;

		let newView = {dx: round(newX, 3), dy: round(newY, 3), dz: round(newZ, 3)};

		// log(`newView: ${JSON.stringify(newView)}`);
		// log(`ProjectEditor.makeAutoFitView`, 'end');
		return newView;
	}

	autoFitView() {
		// log(`ProjectEditor.autoFitView`, 'start');
		let bounds = this.getEditCanvasWrapperBounds();
		if(bounds) {
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
		if(this.nav.isOnEditCanvasPage) {
			if(this.view.default) {
					this.autoFitView();
					this.publish('view', this.view);
			}
		}
	}

	getEditCanvasWrapperBounds() {
		// log(`getEditCanvasWrapperBounds`, 'start');

		let wrapper = document.getElementsByClassName('editor-page__edit-canvas-wrapper');
		if(wrapper && wrapper[0]) {
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
	saveGlyphrProjectFile(overwrite) {
		// log('SAVEGLYPHRPROJECTVILE');
		// log('' + this.project.projectSettings.formatSaveFile);

		// desktop overwrite / save as logic
		if (window && window.process && window.process.type) {
			if (overwrite) {
				window.saveFileOverwrite = true;
			} else {
				window.saveFileOverwrite = false;
			}
		}

		let saveData = this.project.save();

		if (this.project.projectSettings.formatSaveFile) saveData = json(saveData);
		else saveData = JSON.stringify(saveData);

		// log('saveGlyphrProjectFile - \n'+saveData);
		const fileName =
			this.project.projectSettings.name +
			' - Glyphr Project - ' +
			makeDateStampSuffix() +
			'.txt';

		saveFile(fileName, saveData);

		this.closeDialog();
		this.setProjectAsSaved();
	}
}
