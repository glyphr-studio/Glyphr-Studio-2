import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';

import { History } from './history.js';
import { Navigator } from './navigator.js';
import { makeElement } from '../common/dom.js';
import { saveFile, makeDateStampSuffix } from '../project_editor/saving.js';
import { json, getFirstID, clone } from '../common/functions.js';
import { MultiSelectPoints, MultiSelectPaths } from './multiselect.js';
import { Glyph } from '../project_data/glyph.js';
import { normalizeHex } from '../common/unicode.js';

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

		// Canvas
		// Views per work item ID
		this._views = {};
		this.defaultView = {dx: 200, dy: 500, dz: 0.5};
		this.defaultKernView = {dx: 500, dy: 500, dz: 0.5};

		// Canvas
		// Ghost Canvas
		this.canvasSize = 2000;
		this.ghostCanvas = document.createElement('canvas');
		this.ghostCanvas.width = this.canvasSize;
		this.ghostCanvas.height = this.canvasSize;
		this.ghostCTX = this.ghostCanvas.getContext('2d');

		// Canvas
		// Event handlers
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
	// PubSub
	// --------------------------------------------------------------

	/**
	 * Sends a new piece of data concerning a topic area that
	 * triggers changes for subscribers
	 * @param {string} topic - keyword to trigger changes
	 * 		'view' - change to the edit canvas view.
	 * 		'whichToolIsSelected' - change to which edit tool is selected.
	 * 		'whichGlyphIsSelected' - change to which glyph is being edited.
	 * 		'whichPathIsSelected' - change to which path is being edited.
	 * 		'currentGlyph' - edits to the current glyph.
	 * 		'currentPath' - edits to the current path.
	 * @param {object} data - whatever the new state is
	 */
	publish(topic, data) {
		log(`ProjectEditor.publish`, 'start');
		log(`topic: ${topic}`);
		log(data);
		log(this.subscribers[topic]);

		if (this.subscribers[topic]) {
			// Handle some things centrally
			if(topic === 'whichToolIsSelected') {}
			if(topic === 'view') {}
			if(topic === 'whichGlyphIsSelected') {
				this.multiSelect.paths.clear();
				this.multiSelect.points.clear();
			}
			if(topic === 'whichPathIsSelected') {}
			if(topic === 'currentGlyph') {}
			if(topic === 'currentPath') {}

			// Iterate through all the callbacks
			Object.keys(this.subscribers[topic]).forEach((subscriberID) => {
				log(`Calling callback for ${subscriberID}`);
				this.subscribers[topic][subscriberID](data);
			});

		} else {
			// console.warn(`Nobody subscribed to topic ${topic}`);
		}
		log(`ProjectEditor.publish`, 'end');
	}

	/**
	 * Sets up an intent to listen for changes based on a keyword, and
	 * provides a callback function in case a change is published
	 * @param {string or array} topic - what keyword to listen for
	 * 		'view' - change to the edit canvas view.
	 * 		'whichToolIsSelected' - change to which edit tool is selected.
	 * 		'whichGlyphIsSelected' - change to which glyph is being edited.
	 * 		'whichPathIsSelected' - change to which path is being edited.
	 * 		'currentGlyph' - edits to the current glyph.
	 * 		'currentPath' - edits to the current path.
	 * @param {string} subscriberID - the name of the thing listening
	 * @param {function} callback - what to do when a change is triggered
	 * @returns nothing
	 */
	subscribe({topic = false, subscriberID = '', callback = false}) {
		// log(`ProjectEditor.subscribe`, 'start');
		// log(`topic: ${topic}`);
		// log(`subscriberID: ${subscriberID}`);

		if(!topic) {
			console.warn(`Subscriber was not provided a topic`);
			return;
		}

		if(!callback){
			console.warn(`Subscriber was not provided a callback`);
			return;
		}

		if(!subscriberID){
			console.warn(`Subscriber was not provided a subscriberID`);
			return;
		}

		// Support string for single topic, array for multi topic
		let topicList = (typeof topic === 'string') ? [topic] : topic;

		topicList.forEach((thisTopic) => {
			if (!this.subscribers[thisTopic]) this.subscribers[thisTopic] = {};
			this.subscribers[thisTopic][subscriberID] = callback;
		});

			// log(`ProjectEditor.subscribe`, 'end');
	}

	unsubscribe({topicToRemove = false, idToRemove = false}) {
		log(`ProjectEditor.unsubscribe`, 'start');
		log(`topicToRemove: ${topicToRemove}`);
		log(`idToRemove: ${idToRemove}`);

		if(topicToRemove && this.subscribers[topicToRemove]) {
			log(`removing topic: ${topicToRemove}`);
			delete this.subscribers[topicToRemove];
		}

		if(idToRemove) {
			Object.keys(this.subscribers).forEach((topic) => {
				Object.keys(this.subscribers[topic]).forEach((subscriberID) => {
					if(subscriberID.indexOf(idToRemove) > -1) {
						log(`removing subscriber: ${subscriberID} (matched to ${idToRemove})`);
						delete this.subscribers[topic][subscriberID];
					}
				});
			});
		}

		log(`ProjectEditor.unsubscribe`, 'end');
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
	// History
	// --------------------------------------------------------------

	// /**
	//  * Adds to the history queue
	//  * @param {string} description
	//  */
	// historyPut(description) {
	//   if (this.nav.isOnEditCanvasPage) {
	//     const queue =
	//       this.nav.page === 'import svg' ? 'Glyph edit' : this.nav.page;
	//     this.history[queue].put(description);
	//   }
	// }

	// /**
	//  * Moves backwards in time in the history queue
	//  */
	// historyPull() {
	//   if (this.nav.isOnEditCanvasPage) {
	//     this.closeDialog();
	//     this.closeNotation();
	//     this.history[this.nav.page].pull();
	//   }
	// }

	// /**
	//  * Get the length of the current history queue
	//  * @returns {number}
	//  */
	// historyLength() {
	//   if (this.nav.isOnEditCanvasPage) {
	//     return this.history[this.nav.page].queue.length || 0;
	//   }

	//   return 0;
	// }


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

		// log(`set as ${JSON.stringify(this._views[wid])}`);
		// log(`ProjectEditor SET view`, 'end');
		return this._views[wid];
	}

	/**
	 * Gets the current view for the current work item on the current page
	 */
	get view(){
		// log(`ProjectEditor GET view`, 'start');

		var wid = this.selectedItemID;
		var re = false;

		if(this._views[wid]){
			re = this._views[wid];
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


	// --------------------------------------------------------------
	// Panels
	// --------------------------------------------------------------

	/**
	 * List of panels the editor supports
	 */
	 get listOfPanels() {
		return {
			'Chooser': {
				name: 'Chooser',
				panelMaker: false,
				iconName: 'panel_chooser',
			},
			'Layers': {
				name: 'Layers',
				panelMaker: false,
				iconName: 'panel_layers',
			},
			'Guides': {
				name: 'Guides',
				panelMaker: false,
				iconName: 'panel_guides',
			},
			'History': {
				name: 'History',
				panelMaker: false,
				iconName: 'panel_history',
			},
			'Attributes': {
				name: 'Attributes',
				panelMaker: false,
				iconName: 'panel_attributes',
			},
		};
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


/*
// ---------------------------------------------------------------------
//    Global Get Selected Glyph and Path
// ---------------------------------------------------------------------
		/**
		 * Get the selected glyph's left side bearing
		 * @returns {number}
		 *
		getSelectedGlyphLeftSideBearing() {
				// log('getSelectedGlyphLeftSideBearing');
				let sc = getSelectedItem();
				if (!sc) return 0;
				if (sc.objType === 'component') return 0;
				if (!sc.isAutoWide) return 0;
				return sc.leftSideBearing || this.project.projectSettings.defaultLSB;
		}

		/**
		 * Get the selected glyph's right side bearing
		 * @returns {number}
		 *
		getSelectedGlyphRightSideBearing() {
				// log('getSelectedGlyphLeftSideBearing');
				let sc = getSelectedItem();
				if (!sc) return 0;
				if (sc.objType === 'component') return 0;
				if (!sc.isAutoWide) return 0;
				return sc.rightSideBearing || this.project.projectSettings.defaultRSB;
		}

		/**
		 * Updates the selected glyphs width
		 *
		updateCurrentGlyphWidth() {
				let sc = getSelectedItem();
				if (!sc) return;
				if (editor.nav.page === 'Glyph edit') {
						glyphChanged(sc);
				} else if (editor.nav.page === 'components' && sc) {
						let lsarr = sc.usedIn;
						if (lsarr) for (let c=0; c<lsarr.length; c++) {
							glyphChanged(getGlyph(lsarr[c]));
						}
				}
		}

function existingItem() {
		let len = 0;
		let nph = _UI.currentPanel;

		if (editor.nav.page === 'ligatures') {
				len = Object.keys(getCurrentProject().ligatures).length;
				if (!len) {
						_UI.selectedLigature = false;
						if (nph !== 'npNav') nph = 'npChooser';
						return false;
				}
		} else if (editor.nav.page === 'components') {
				len = Object.keys(getCurrentProject().components).length;
				if (!len) {
						_UI.selectedComponent = false;
						if (nph !== 'npNav') nph = 'npChooser';
						return false;
				}
		} else if (editor.nav.page === 'kerning') {
				len = Object.keys(getCurrentProject().kerning).length;
				if (!len) {
						_UI.selectedKern = false;
						if (nph !== 'npNav') nph = 'npAttributes';
						return false;
				}
		}

		return true;
}

function getSelectedItem() {
		// log('getSelectedItem', 'start');
		// log('currentPage: ' + editor.nav.page);
		let re;

		switch (editor.nav.page) {
				case 'Glyph edit':
						if (!_UI.selectedGlyph) _UI.selectedGlyph = '0x0041';
						re = getGlyph(_UI.selectedGlyph, true);
						// log('case glyph edit, returning ' + re.name);
						return re;
				case 'import svg':
						if (!_UI.selectedSVGImportTarget) _UI.selectedSVGImportTarget = '0x0041';
						re = getGlyph(_UI.selectedSVGImportTarget, true);
						// log('case import svg, returning ' + re.name);
						return re;
				case 'ligatures':
						re = getGlyph(_UI.selectedLigature, true);
						// log('case glyph edit, returning ' + re.name);
						return re;
				case 'components':
						re = getGlyph(_UI.selectedComponent, false);
						// log('case components, returning ' + re.name);
						return re;
				case 'kerning':
						// log('case KERN - selkern = ' + _UI.selectedKern);
						if (!_UI.selectedKern) _UI.selectedKern = getFirstID(getCurrentProject().kerning);
						re = getCurrentProject().kerning[_UI.selectedKern] || false;
						// log('case kerning, returning ' + re);
						return re;
		}

		return false;
}

function getSelectedItemID() {
		switch (editor.nav.page) {
				case 'Glyph edit': return _UI.selectedGlyph;
				case 'import svg': return _UI.selectedSVGImportTarget;
				case 'ligatures': return _UI.selectedLigature;
				case 'components': return _UI.selectedComponent;
				case 'kerning': return _UI.selectedKern;
		}

		return false;
}

function getSelectedItemChar() {
		let swiid = getSelectedItemID();
		return hexToChars(swiid);
}

function getSelectedItemName() {
		// log('getSelectedItemName', 'start');
		let wi = getSelectedItem();
		// log('wi = '+wi);
		return wi.name || wi.getName() || '[name not found]';
}

function getSelectedItemPaths() {
		// log('GETSELECTEDGLYPHSHAPES');
		let rechar = getSelectedItem();
		return rechar? rechar.paths : [];
}

function markSelectedItemAsChanged() {
		// log('markSelectedItemAsChanged', 'start');
		let wi = getSelectedItem();

		if (wi && wi.changed) {
				// log('marking as changed');
				wi.changed(true, true);
		}

		// log('markSelectedItemAsChanged', 'end');
}

function selectGlyph(c, dontnavigate) {
		// log('selectGlyph', 'start');
		// log('selecting ' + getGlyph(c, true).name + ' from value ' + c);

		_UI.selectedGlyph = c;
		clickEmptySpace();
		markSelectedItemAsChanged();

		if (!dontnavigate) {
				// log('selecting ' + getCurrentProject().glyphs[c].glyphhtml + ' and navigating.');
				navigate({panel: 'npAttributes'});
		}

		// log('selectGlyph', 'end');
}

function selectComponent(c, dontnavigate) {
		// log('SELECTCOMPONENT - selecting ' + getGlyph(c, true).name + ' from value ' + c);

		_UI.selectedComponent = c;
		clickEmptySpace();
		markSelectedItemAsChanged();

		if (!dontnavigate) {
				// log('SELECTCOMPONENT: selecting ' + getCurrentProject().components[c].name + ' and navigating.');
				navigate({panel: 'npAttributes'});
		}
}

function selectLigature(c, dontnavigate) {
		// log('SELECTLIGATURE - selecting ' + getGlyph(c, true).name + ' from value ' + c);

		_UI.selectedLigature = c;
		clickEmptySpace();
		markSelectedItemAsChanged();

		if (!dontnavigate) {
				// log('SELECTLIGATURE: selecting ' + getCurrentProject().ligatures[c].glyphhtml + ' and navigating.');
				navigate({panel: 'npAttributes'});
		}
}

function selectSVGImportTarget(c, dontnavigate) {
		// log('SELECTSVGIMPORTTARGET - selecting ' + getGlyph(c, true).name + ' from value ' + c);

		_UI.selectedSVGImportTarget = c;

		if (!dontnavigate) {
				// log('SELECTSVGIMPORTTARGET: selecting ' + c + ' and navigating.');
				navigate({panel: 'npAttributes'});
		}
}
*/
