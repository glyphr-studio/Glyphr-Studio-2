import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { closeEveryTypeOfDialog, showToast } from '../controls/dialogs/dialogs.js';
import { parseSemVer } from '../formats_io/validate_file_input.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import { ProjectEditor } from '../project_editor/project_editor.js';
import boolTestProject from '../samples/boolean_tests.gs2?raw';
import obleggSampleProject from '../samples/oblegg.gs2?raw';
import simpleExampleProject from '../samples/simpleExampleProject.json';
/** @type {Object} */
import * as config from './app_config.json';
import { _DEV } from './dev_mode_includes.js';
import {
	addProjectEditorAndSetAsImportTarget,
	getConfigGroup,
	getCurrentProject,
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from './main.js';
import { makePage_OpenProject } from './open_project.js';

// Do some extra stuff during config assignments
let timeoutId;
const configHandler = {
	set(target, key, value) {
		// Storage saving with debouncing
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			getGlyphrStudioApp().saveAppSettings();
		}, 1000);

		// log(`"${key}" changed from ${target[key]} to ${value}`);
		return Reflect.set(target, key, value);
	},
};

/**
 * Creates a new Glyphr Studio Application
 */
export class GlyphrStudioApp {
	constructor() {
		// Settings
		this.settings = {
			dev: {
				// Internal Dev Stuff
				mode: config.devMode, // {bool} global switch for all the stuff below
				overwriteTitle: true, // {bool} Use a 'Dev Mode' window title
				sampleProject: 'oblegg', // {true/false, 'oblegg', 'bool'} Load the sample project
				twoSampleProjects: false, // {bool} Load two sample projects
				currentPage: 'Characters', // {Sentence case page name} navigate straight to a page
				currentGlyphID: false, // {glyph id} select a glyph
				currentPanel: 'Guides', // {Sentence case panel name} navigate straight to a panel
				currentTool: false, // {Tool name} select a tool
				stopPageNavigation: false, // {bool} overwrite project-level setting
				autoSave: false, // {bool} trigger auto saves
				selectFirstShape: false, // {bool} select the first shape
				selectFirstPoint: false, // {bool} select the first path point
				testActions: [], // {name: '', onClick: ()=>{}} adds test actions to the Glyph card
				testOnLoad: function () {}, // code to run on load
				testOnRedraw: function () {}, // code to run on Edit Canvas redraw
			},
			telemetry: true, // Load google analytics
			storageWriteEnabled: true,
			app: new Proxy(
				{
					stopPageNavigation: true,
					formatSaveFile: false,
					saveLivePreviews: true,
					autoSave: true,
					savePreferences: false,
					unlinkComponentInstances: true,
					directlyDragCurves: true,
					canvasDisplayModeFilled: true,
					showNonCharPoints: false,
					itemChooserPageSize: 256,
					previewText: false,
					exportLigatures: true,
					exportKerning: true,
					exportUneditedItems: true,
					moveShapesOnSVGDragDrop: false,
					autoSideBearingsOnSVGDragDrop: 50,
					autoRightBearingOnFirstShape: 50,
					highlightPointsNearPoints: 2,
					highlightPointsNearHandles: 2,
					highlightPointsNearXZero: 2,
					highlightPointsNearYZero: 2,
					contextCharacters: {
						showCharacters: false,
						characterTransparency: 20,
						showGuides: true,
						guidesTransparency: 70,
					},
					livePreviews: [],
				},
				configHandler
			),
		};

		// Version
		this.version = config.version;
		this.versionDate = config.versionDate;
		const semVer = parseSemVer(config.version);
		this.versionName = `Version ${semVer.major}.${semVer.minor}`;

		// Project Editors
		this.projectEditors = [];
		this._selectedProjectEditor = undefined;

		// Current import target
		this._editorImportTarget = undefined;
		this.temp = {};
	}

	/**
	 * Starts up the app
	 */
	setUp() {
		this.loadAppSettings();

		// log(`GlyphrStudioApp.setUp`, 'start');
		let editor = addProjectEditorAndSetAsImportTarget();

		// Dev mode stuff
		const dev = this.settings.dev;
		if (dev.mode) {
			if (dev.overwriteTitle) document.title = '⡄⡆⡇🄳🄴🅅 🄼🄾🄳🄴⡇⡆⡄';
			// @ts-expect-error 'property does exist'
			window._DEV = _DEV;

			// Test Function
			if (dev.testOnLoad) dev.testOnLoad();

			// Navigation & selection
			if (dev.twoSampleProjects) {
				editor.project = importGlyphrProjectFromText(obleggSampleProject);
				addProjectEditorAndSetAsImportTarget();
				editor = getProjectEditorImportTarget();
				setCurrentProjectEditor(editor);
				editor.project = importGlyphrProjectFromText(simpleExampleProject);
				// editor.project = importGlyphrProjectFromText(obleggSampleProject);
				if (typeof dev.currentPage === 'string') editor.nav.page = dev.currentPage;
				updateWindowUnloadEvent();
			} else if (typeof dev.sampleProject === 'boolean' && dev.sampleProject) {
				importGlyphrProjectFromText(simpleExampleProject);
			} else if (typeof dev.sampleProject === 'string') {
				let proj;
				if (dev.sampleProject === 'oblegg') proj = obleggSampleProject;
				if (dev.sampleProject === 'bool') proj = boolTestProject;
				// if (dev.sampleProject === 'test') proj = test;
				editor.project = importGlyphrProjectFromText(proj);
			}
			if (typeof dev.currentGlyphID === 'string') editor.selectedGlyphID = dev.currentGlyphID;
			if (typeof dev.currentPage === 'string') editor.nav.page = dev.currentPage;
			if (typeof dev.currentPanel === 'string') editor.nav.panel = dev.currentPanel;
			if (dev.currentTool) editor.selectedTool = dev.currentTool;
			if (dev.selectFirstShape) editor.multiSelect.shapes.select(editor.selectedItem.shapes[0]);
			if (dev.selectFirstPoint)
				editor.multiSelect.points.select(editor.selectedItem.shapes[0].pathPoints[0]);
		}
		// log(editor);
		// log(editor.nav.page);

		if (this.settings.telemetry && !dev.mode) {
			addTelemetry();
		}

		// Load the Open Project page
		if (dev.mode && dev.currentPage) {
			editor.navigate();
		} else {
			this.appPageNavigate(makePage_OpenProject);
		}
		this.fadeOutLandingPage();

		// Final dev mode stuff
		if (dev.mode && (dev.selectFirstShape || dev.selectFirstPoint))
			editor.editCanvas.redraw('dev mode select first shape');
		console.log(this);
		// log(`GlyphrStudioApp.setUp`, 'end');
	}

	/**
	 * Returns the selected Project Editor
	 * @returns {ProjectEditor}
	 */
	get selectedProjectEditor() {
		if (!this._selectedProjectEditor) {
			if (this.projectEditors.length === 0) this.projectEditors[0] = new ProjectEditor();
			this.selectedProjectEditor = this.projectEditors[0];
		}

		return this._selectedProjectEditor;
	}

	/**
	 * Sets the selected Project Editor
	 * @param {ProjectEditor} editor
	 */
	set selectedProjectEditor(editor) {
		if (!editor) return;
		// Make sure the editor is tracked in the projectEditors list,
		// then select it. Previously this only worked for editors that
		// were already at index 0 or 1, silently ignoring any other editor.
		if (!this.projectEditors.includes(editor)) {
			this.projectEditors.push(editor);
		}
		this._selectedProjectEditor = editor;
	}

	/**
	 * Returns the selected Project Editor Import Target
	 * @returns {ProjectEditor}
	 */
	get editorImportTarget() {
		if (!this._editorImportTarget) {
			this._editorImportTarget = this.selectedProjectEditor;
		}

		return this._editorImportTarget;
	}

	/**
	 * Sets the selected Project Editor Import Target
	 * @param {ProjectEditor} editor
	 */
	set editorImportTarget(editor) {
		if (this.projectEditors[0] === editor) {
			this._editorImportTarget = this.projectEditors[0];
		}
		if (this.projectEditors[1] === editor) {
			this._editorImportTarget = this.projectEditors[1];
		}
	}

	/**
	 * Returns the project editor that isn't the selected project editor
	 * @returns {ProjectEditor}
	 */
	get otherProjectEditor() {
		if (this.selectedProjectEditor === this.projectEditors[0]) {
			return this.projectEditors[1];
		} else {
			return this.projectEditors[0];
		}
	}

	/**
	 * App Pages are 'above' Project Editor Pages, so we need a custom navigation
	 * handler for Open Project and Cross Project Actions pages
	 * @param {Function} pageMaker - function that creates app page content
	 */
	appPageNavigate(pageMaker) {
		const mainContent = makeElement({
			tag: 'div',
			id: 'app__main-content',
		});
		mainContent.appendChild(pageMaker());
		const wrapper = document.querySelector('#app__wrapper');
		wrapper.innerHTML = '';
		wrapper.appendChild(mainContent);
	}

	/**
	 * Fades out the initial load screen to show the App
	 * @param {Number} delay - override default fadeout time
	 */
	fadeOutLandingPage(delay = 700) {
		/** @type {HTMLElement} */
		const landingPage = document.querySelector('#app__landing-page');
		if (landingPage) {
			landingPage.style.opacity = '0';

			setTimeout(function () {
				// landingPage.style.visibility = 'hidden';
				// landingPage.style.display = 'none';
				document.body.removeChild(landingPage);
			}, delay);
		}
	}

	// --------------------------------------------------------------
	// Local Storage and Auto-saves
	// --------------------------------------------------------------

	/**
	 * Wrapper for getting the Glyphr Studio area of local storage
	 * @returns {Object} - current data
	 */
	getLocalStorage() {
		// log(`GlyphrStudioApp.getLocalStorage`, 'start');
		if (!window.localStorage.getItem('GlyphrStudio')) {
			window.localStorage.setItem('GlyphrStudio', '{}');
		}
		const jsonData = window.localStorage.getItem('GlyphrStudio');
		let data = {};
		if (jsonData) data = JSON.parse(jsonData);
		// log(`\n⮟data⮟`);
		// log(data);
		// log(`GlyphrStudioApp.getLocalStorage`, 'end');
		return data;
	}

	/**
	 * Wrapper to write a key/value pair to the
	 * Glyphr Studio area of local storage
	 * @param {String} key - what part to set
	 * @param {String} newData - value to set
	 */
	setLocalStorage(key, newData) {
		// log(`GlyphrStudioApp.setLocalStorage`, 'start');
		// log(`key: ${key}`);
		// log(`\n⮟data⮟`);
		// log(newData);
		// log(`Storage writing enabled: ${this.settings.storageWriteEnabled}`);
		if (!this.settings.storageWriteEnabled) {
			return new Error('Storage writes are disabled');
		}

		const data = this.getLocalStorage();
		data[key] = newData;
		try {
			window.localStorage.setItem('GlyphrStudio', JSON.stringify(data));
		} catch {
			showToast(
				`There is not enough space in local storage. Auto-saves have been turned off in Settings > App and app setting changes will not persist.`
			);
			this.settings.app.autoSave = false;
			this.settings.storageWriteEnabled = false;
			return new Error('Unable to write to storage');
		}

		// log(`\n⮟window.localStorage⮟`);
		// log(window.localStorage);
		// log(`GlyphrStudioApp.setLocalStorage`, 'end');
		return true;
	}

	/**
	 * Counts how many projects are saved locally
	 * @returns {Number}
	 */
	countLocalStorageProjects() {
		const data = this.getLocalStorage();
		return countItems(data.autoSaves);
	}

	/**
	 * Automatically writes the current state to the
	 * local storage for the current project
	 */
	addAutoSaveState() {
		// log(`addAutoSaveState`, 'start');
		const projectData = getCurrentProject().save();
		const metadata = projectData.settings.project;
		const saveData = {
			time: new Date().getTime(),
			name: metadata.name,
			id: metadata.id,
			project: projectData,
		};
		// log(`metadata.name: ${metadata.name}`);
		// log(`metadata.id: ${metadata.id}`);
		let newSaves = this.getLocalStorage()?.autoSaves || {};
		newSaves[metadata.id] = saveData;
		// log(`\n⮟newSaves⮟`);
		// log(newSaves);
		this.setLocalStorage('autoSaves', newSaves);
		// log(`addAutoSaveState`, 'end');
	}

	/**
	 * Loads the app settings saved in storage.
	 */
	loadAppSettings() {
		// log(`getAppSettings`, 'start');
		let newSettings = this.getLocalStorage()?.appSettings || {};
		// log(`\n⮟newSettings⮟`);
		// log(newSettings);
		Object.assign(this.settings.app, newSettings);
	}

	/**
	 * Updates the saved app settings.
	 */
	saveAppSettings() {
		// log(`saveAppSettings`, 'start');
		const settings = this.settings.app;
		// log(`\n⮟oldSettings⮟`);
		// log(settings);
		let newSettings = this.getLocalStorage()?.appSettings || {};
		newSettings = settings;
		// log(`\n⮟newSettings⮟`);
		// log(newSettings);
		this.setLocalStorage('appSettings', newSettings);
	}
}

/**
 * Conditionally load Google Telemetry
 */
function addTelemetry() {
	let gScript = document.createElement('script');
	gScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-L8S3D8WCC9');
	gScript.setAttribute('async', '');
	document.head.appendChild(gScript);

	// @ts-expect-error 'property does exist'
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		// @ts-expect-error 'property does exist'
		window.dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-L8S3D8WCC9');
}

// --------------------------------------------------------------
// Window behavior
// --------------------------------------------------------------

/**
 * Sets the appropriate window unload event
 */
export function updateWindowUnloadEvent() {
	const project = getCurrentProject();
	const app = getGlyphrStudioApp();

	if (app.settings.dev.mode) {
		if (app.settings.dev.stopPageNavigation) {
			window.onbeforeunload = showBeforeUnloadConfirmation;
		} else {
			window.onbeforeunload = () => {};
		}
	} else if (getConfigGroup('app').stopPageNavigation) {
		window.onbeforeunload = showBeforeUnloadConfirmation;
	} else {
		window.onbeforeunload = () => {};
	}
}

/**
 * handler for onBeforeUnload
 * @param {Event} event - original event
 * @returns {String} - message to show
 */
function showBeforeUnloadConfirmation(event) {
	// console.log(`event.type: ${event.type}`);
	event.preventDefault();
	event.stopPropagation();
	let message = 'Are you sure you want to exit? Any unsaved data may be lost.';
	return message;
}

// --------------------------------------------------------------
// Issues
// --------------------------------------------------------------

/**
 * Catch an error and show this 'nice' page instead
 * @param {String} friendlyMessage - What human-readable message to show
 * @param {Object} errorObject - Error data
 */
export function showAppErrorPage(friendlyMessage = '', errorObject = { message: '', stack: '' }) {
	const wrapper = document.querySelector('#app__wrapper');
	closeEveryTypeOfDialog();
	let content = `
		<div id="app__landing-page">
		<div class="error-page__wrapper">
			<div class="error-page__table-flip">(╯°▢°）╯︵ ┻━┻</div>
				<h1>${friendlyMessage || 'Glyphr Studio ran into a problem'}</h1>
				<br>
				Please send us an email, hopefully we'll be able to help:
				<a
					href="mailto:mail@glyphrstudio.com&subject=[${getGlyphrStudioApp().version}] Feedback"
					>mail@glyphrstudio.com</a>
				<br><br><br>
				<pre>${errorObject.stack.replaceAll('<', '&lt;')}</pre>
			</div>
		</div>
	`;

	wrapper.innerHTML = content;
}

/**
 * Makes a mailto link
 * @param {String} displayText - what text to show
 * @returns {String} - mailto link
 */
export function emailLink(displayText = 'mail@glyphrstudio.com') {
	let app = getGlyphrStudioApp();
	return `
		<a class="mailto" href="mailto:mail@glyphrstudio.com?subject=[${app.version}] Feedback">${displayText}</a>
	`;
}

/**
 * Generates the content for the "email us" link
 * @returns {String}
 */
export function makeEmailContent() {
	const con = `Have a feature idea or ran into an issue%3F We'd be happy to help!
	%0A%0A%0A%0A___________________________________________%0A
	version %09Glyphr Studio  ${getGlyphrStudioApp().version} %0A
	user agent %09 ${encodeURIComponent(navigator.userAgent)} %0A`;

	// log(con);
	return con;
}
