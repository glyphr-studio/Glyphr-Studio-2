import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import {
	closeEveryTypeOfDialog,
	hideMountedComponent,
	showMountedComponent,
	showToast,
} from '../controls/dialogs/dialogs.js';
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
	getCurrentProject,
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from './main.js';
import { makePage_OpenProject } from './open_project.js';
import { clearAutoSaves, getAutoSave, getAutoSaves, setAutoSave } from './project_storage.js';
import { makeProjectHash, parseAppHash } from './routing.js';

const APP_UI_FONTS = {
	'fira-sans': "FiraGo, 'Fira Sans', Tahoma, sans-serif",
	'google-sans-flex': "'Google Sans Flex', 'Google Sans', Arial, sans-serif",
	'open-sans': "'Open Sans', Arial, sans-serif",
	system: "system-ui, -apple-system, 'Segoe UI', sans-serif",
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
				currentPage: false, // {Sentence case page name} navigate straight to a page
				currentGlyphID: false, // {glyph id} select a glyph
				currentPanel: false, // {Sentence case panel name} navigate straight to a panel
				currentTool: false, // {Tool name} select a tool
				stopPageNavigation: false, // {bool} overwrite project-level setting
				autoSave: false, // {bool} trigger auto saves
				selectFirstShape: false, // {bool} select the first shape
				selectFirstPoint: false, // {bool} select the first path point
				testActions: [], // {name: '', onClick: ()=>{}} adds test actions to the Glyph card
				testOnLoad: function () {}, // code to run on load
				testOnRedraw: function () {}, // code to run on Edit Canvas redraw
			},
			telemetry: false, // Load Google Analytics only after the user opts in
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
		this._applyingHashRoute = false;
		this._lastAppliedHash = '';
		this._autoSaveQueues = new Map();
		this.temp = {};
	}

	/**
	 * Starts up the app
	 */
	async setUp() {
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

		await this.migrateAutoSavesToIndexedDB();
		this.settings.telemetry = this.getLocalStorage()?.googleTelemetry === true;
		this.applyUIFont(this.getLocalStorage()?.openProjectUIFont || 'fira-sans');
		if (this.settings.telemetry) {
			addTelemetry();
		}

		this.startHashRouting();
		if (!window.location.hash) this.setHash('#/', true);
		await this.applyHashRoute();
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
		const wrapper = /** @type {HTMLElement | null} */ (document.querySelector('#app__wrapper'));
		if (!wrapper) return;
		// App pages sit above the editor, so drop the editor's chrome grid
		wrapper.classList.remove('app__wrapper--editor');
		[...wrapper.children].forEach((child) =>
			hideMountedComponent(/** @type {HTMLElement} */ (child))
		);
		wrapper.prepend(mainContent);
		showMountedComponent(mainContent);
	}

	setHash(hash, replace = false) {
		if (window.location.hash === hash) return;
		const method = replace ? 'replaceState' : 'pushState';
		window.history[method](null, '', hash);
	}

	navigateHome(replace = false, page = 'my-fonts') {
		this.appPageNavigate(() => makePage_OpenProject(false, page));
		const hash = page === 'my-fonts' ? '#/' : `#/${page}`;
		this.setHash(hash, replace);
		this._lastAppliedHash = hash;
	}

	syncHashFromEditor(editor = this.selectedProjectEditor, replace = false) {
		if (this._applyingHashRoute || !editor?.project) return;
		const hash = makeProjectHash(editor);
		this.setHash(hash, replace);
		this._lastAppliedHash = hash;
	}

	async applyHashRoute() {
		const hash = window.location.hash || '#/';
		const route = parseAppHash(hash);
		this._applyingHashRoute = true;

		try {
			if (route.type === 'home') {
				this.navigateHome(hash !== '#/');
				return;
			}
			if (route.type === 'library') {
				this.navigateHome(false, route.page);
				return;
			}

			let editor = this.projectEditors.find(
				(candidate) => candidate.project.settings.project.id === route.projectID
			);
			if (!editor) {
				let savedProject;
				try {
					savedProject = await getAutoSave(route.projectID);
				} catch {
					this.navigateHome(true);
					return;
				}
				if (!savedProject?.project) {
					this.navigateHome(true);
					showToast(`Failed to load project because it doesn't exist.`);
					return;
				}
				editor = this.projectEditors[0] || new ProjectEditor();
				if (!this.projectEditors.includes(editor)) this.projectEditors.push(editor);
				editor.project = importGlyphrProjectFromText(savedProject.project);
				editor.project.settings.app.autoSave = this.getLocalStorage().openProjectAutoSave !== false;
			}

			this.selectedProjectEditor = editor;
			editor.nav.page = route.page;
			if (route.page === 'Characters') editor.characterView = route.glyphID ? 'edit' : 'overview';
			if (route.page === 'Ligatures') {
				editor.ligatureView = route.ligatureID ? 'edit' : 'overview';
				if (route.ligatureID) editor.selectedLigatureID = route.ligatureID;
			}
			if (route.page === 'Components') {
				editor.componentView = route.componentID ? 'edit' : 'overview';
				if (route.componentID) editor.selectedComponentID = route.componentID;
			}
			if (route.page === 'Variable sets') {
				editor.variableSetsView = route.alternateID ? 'alternate' : 'overview';
				editor.selectedStylisticSetID = route.stylisticSetID || false;
				if (route.alternateID) editor.selectedAlternateID = route.alternateID;
			}
			if (route.glyphID) editor.selectedGlyphID = route.glyphID;
			editor.navigate();
			this._lastAppliedHash = hash;
		} finally {
			this._applyingHashRoute = false;
		}
	}

	startHashRouting() {
		if (this._hashRouteHandler) return;
		this._hashRouteHandler = () => {
			if (window.location.hash === this._lastAppliedHash) return;
			this.applyHashRoute();
		};
		window.addEventListener('hashchange', this._hashRouteHandler);
		window.addEventListener('popstate', this._hashRouteHandler);
		window.addEventListener('glyphr:route-selection-change', (event) => {
			const routeEvent = /** @type {CustomEvent} */ (event);
			if (routeEvent.detail?.editor === this.selectedProjectEditor) {
				this.syncHashFromEditor(routeEvent.detail.editor);
			}
		});
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
	 * @param {*} newData - value to set
	 */
	setLocalStorage(key, newData) {
		// log(`GlyphrStudioApp.setLocalStorage`, 'start');
		// log(`key: ${key}`);
		// log(`\n⮟data⮟`);
		// log(newData);

		const data = this.getLocalStorage();
		data[key] = newData;
		try {
			window.localStorage.setItem('GlyphrStudio', JSON.stringify(data));
		} catch {
			showToast(`Failed to update settings. Please try again.`);
		}

		// log(`\n⮟window.localStorage⮟`);
		// log(window.localStorage);
		// log(`GlyphrStudioApp.setLocalStorage`, 'end');
	}

	/**
	 * Enables or disables the optional Google telemetry integration.
	 * @param {Boolean} enabled - whether telemetry is allowed
	 */
	setGoogleTelemetry(enabled) {
		this.settings.telemetry = !!enabled;
		this.setLocalStorage('googleTelemetry', this.settings.telemetry);

		if (this.settings.telemetry) addTelemetry();
		else disableTelemetry();
	}

	applyUIFont(fontID = 'fira-sans') {
		const fontFamily = APP_UI_FONTS[fontID] || APP_UI_FONTS['fira-sans'];
		document.documentElement.style.setProperty('--app-ui-font', fontFamily);
		document.documentElement.style.setProperty('--font-library-font', fontFamily);
	}

	/**
	 * Moves legacy project backups to IndexedDB without moving app settings.
	 */
	async migrateAutoSavesToIndexedDB() {
		const localData = this.getLocalStorage();
		const localSaves = localData?.autoSaves;
		if (!localSaves || typeof localSaves !== 'object') return;

		try {
			await Promise.all(Object.values(localSaves).map((saveData) => setAutoSave(saveData)));
			delete localData.autoSaves;
			window.localStorage.setItem('GlyphrStudio', JSON.stringify(localData));
		} catch (error) {
			console.error('Could not migrate auto-saved projects to IndexedDB.', error);
			showToast('Failed to migrate auto-saved projects to IndexedDB.');
		}
	}

	/**
	 * Counts how many projects are saved locally
	 * @returns {Promise<Number>}
	 */
	async countAutoSavedProjects() {
		return countItems(await getAutoSaves());
	}

	getAutoSaves() {
		return getAutoSaves();
	}

	clearAutoSaves() {
		return clearAutoSaves();
	}

	/**
	 * Automatically writes the current project state to IndexedDB.
	 */
	async addAutoSaveState(project = getCurrentProject()) {
		// log(`addAutoSaveState`, 'start');
		const projectData = project.save();
		const metadata = projectData.settings.project;
		const saveData = {
			time: new Date().getTime(),
			name: metadata.name,
			id: metadata.id,
			project: projectData,
		};
		// log(`metadata.name: ${metadata.name}`);
		// log(`metadata.id: ${metadata.id}`);
		const previousSave = this._autoSaveQueues.get(metadata.id) || Promise.resolve();
		const pendingSave = previousSave.catch(() => undefined).then(() => setAutoSave(saveData));
		this._autoSaveQueues.set(metadata.id, pendingSave);
		try {
			await pendingSave;
		} catch {
			showToast(
				`Failed to save project data. Please try again or check your storage settings. The auto-save option has been turned off in Settings > App.`
			);
			project.settings.app.autoSave = false;
		} finally {
			if (this._autoSaveQueues.get(metadata.id) === pendingSave) {
				this._autoSaveQueues.delete(metadata.id);
			}
		}
		// log(`\n⮟newSaves⮟`);
		// log(`addAutoSaveState`, 'end');
	}
}

/**
 * Conditionally load Google Telemetry when user setting is on
 */
function addTelemetry() {
	window['ga-disable-G-L8S3D8WCC9'] = false;
	if (document.querySelector('#glyphr-studio-google-telemetry')) return;

	let gScript = document.createElement('script');
	gScript.setAttribute('id', 'glyphr-studio-google-telemetry');
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

/**
 * Stops Google telemetry for the current page.
 */
function disableTelemetry() {
	window['ga-disable-G-L8S3D8WCC9'] = true;
	document.querySelector('#glyphr-studio-google-telemetry')?.remove();
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
	} else if (project.settings.app.stopPageNavigation) {
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
