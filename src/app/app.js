import { closeEveryTypeOfDialog } from '../controls/dialogs/dialogs.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import obleggSampleProject from '../samples/oblegg.gs2?raw';
import simpleExampleProject from '../samples/simpleExampleProject.json';
import { _DEV } from './dev_mode_includes.js';
import {
	GSApp,
	addProjectEditorAndSetAsImportTarget,
	getCurrentProject,
	getGlyphrStudioApp,
} from './main.js';

/**
 * Creates a new Glyphr Studio Application
 */
export class GlyphrStudioApp {
	/**
	 * Initialize the Glyphr Studio App, with defaults
	 */
	constructor() {
		// Version
		this.versionName = 'Version 2';
		this.version = '2.0.0';
		this.versionDate = false;

		// Project Editors
		this.projectEditors = [];
		this.selectedProjectEditor = false;

		// Current import target
		this.editorImportTarget = false;

		// Settings
		this.settings = {
			dev: {
				// Internal Dev Stuff
				mode: true, // global switch for all the stuff below
				overwriteTitle: true, // Use a 'Dev Mode' window title
				sampleProject: false, // Load the sample project, true or 'oblegg'
				currentPage: false, // navigate straight to a page (sentence case names)
				currentGlyphID: false, // select a glyph
				currentPanel: false, // navigate straight to a panel (title case names)
				currentTool: false, // select a tool
				stopPageNavigation: false, // overwrite project-level setting
				autoSave: false, // trigger auto saves
				selectFirstShape: false, // select a shape
				selectFirstPoint: false, // select a path point
				testActions: [],
				testOnLoad: function () {},
				testOnRedraw: function () {},
			},
			telemetry: false, // Load google analytics
		};

		this.temp = {};
	}

	/**
	 * Starts up the app
	 */
	setUp() {
		log(`GlyphrStudioApp.setUp`, 'start');
		const editor = addProjectEditorAndSetAsImportTarget();

		// Dev mode stuff
		const dev = this.settings.dev;
		if (dev.mode) {
			if (dev.overwriteTitle) document.title = '⡄⡆⡇🄳🄴🅅 🄼🄾🄳🄴⡇⡆⡄';
			window._DEV = _DEV;

			// Test Function
			if (dev.testOnLoad) dev.testOnLoad();

			// Navigation & selection
			if (dev.sampleProject) {
				let proj = simpleExampleProject;
				if (dev.sampleProject === 'oblegg') proj = obleggSampleProject;
				// if (dev.sampleProject === 'test') proj = test;
				editor.project = importGlyphrProjectFromText(proj);
			}
			if (dev.currentGlyphID) editor.selectedGlyphID = dev.currentGlyphID;
			if (dev.currentPage) editor.nav.page = dev.currentPage;
			if (dev.currentPanel) editor.nav.panel = dev.currentPanel;
			if (dev.currentTool) editor.selectedTool = dev.currentTool;
			if (dev.selectFirstShape) editor.multiSelect.shapes.select(editor.selectedItem.shapes[0]);
			if (dev.selectFirstPoint)
				editor.multiSelect.points.select(editor.selectedItem.shapes[0].pathPoints[0]);
		}

		if (this.settings.telemetry) {
			addTelemetry();
		}

		// log(editor);
		// log(editor.nav.page);
		this.fadeOutLandingPage();
		editor.navigate();
		if (dev.mode && (dev.selectFirstShape || dev.selectFirstPoint)) editor.editCanvas.redraw();

		log(`GlyphrStudioApp.setUp`, 'end');
	}

	/**
	 * Fades out the initial load screen to show the App
	 * @param {Number} delay - override default fadeout time
	 */
	fadeOutLandingPage(delay = 700) {
		const landingPage = document.getElementById('app__landing-page');
		if (landingPage) {
			landingPage.style.opacity = 0;

			setTimeout(function () {
				// landingPage.style.visibility = 'hidden';
				// landingPage.style.display = 'none';
				document.body.removeChild(landingPage);
			}, delay);
		}
	}

	/**
	 * An epoch date number that looks nice
	 * @param {Number} dayOffset - how many days to add to the result
	 * @returns - nice number for the day a version was shipped
	 */
	getShipDate(dayOffset = 0) {
		const msOffset = dayOffset * 24 * 60 * 60 * 1000;
		const shipDate = new Date();
		shipDate.setHours(12, 0, 0, 0);
		shipDate.setTime(shipDate.getTime() + msOffset);
		let result = '' + shipDate.getTime();
		result = result.substring(0, 5);
		result = `${result}00000000`;
		return result;
	}

	// --------------------------------------------------------------
	// Local Storage and Auto-saves
	// --------------------------------------------------------------

	getLocalStorage() {
		log(`GlyphrStudioApp.getLocalStorage`, 'start');
		if (!window.localStorage.getItem('GlyphrStudio')) {
			window.localStorage.setItem('GlyphrStudio', '{}');
		}
		const jsonData = window.localStorage.getItem('GlyphrStudio');
		log(`jsonData: ${jsonData}`);
		let data = {};
		if (jsonData) data = JSON.parse(jsonData);
		log(`\n⮟data⮟`);
		log(data);
		log(`GlyphrStudioApp.getLocalStorage`, 'end');
		return data;
	}

	setLocalStorage(key, newData) {
		log(`GlyphrStudioApp.setLocalStorage`, 'start');
		log(`key: ${key}`);
		log(`\n⮟data⮟`);
		log(newData);

		const data = this.getLocalStorage();
		data[key] = newData;
		window.localStorage.setItem('GlyphrStudio', JSON.stringify(data));

		log(`\n⮟window.localStorage⮟`);
		log(window.localStorage);
		log(`GlyphrStudioApp.setLocalStorage`, 'end');
	}

	addAutoSaveState() {
		log(`addAutoSaveState`, 'start');
		const projectData = getCurrentProject().save();
		const metadata = projectData.settings.project;
		const saveData = {
			time: new Date().getTime(),
			name: metadata.name,
			id: metadata.id,
			project: projectData,
		};
		log(`metadata.name: ${metadata.name}`);
		log(`metadata.id: ${metadata.id}`);
		let newSaves = this.getLocalStorage()?.autoSaves || {};
		newSaves[metadata.id] = saveData;
		log(`\n⮟newSaves⮟`);
		log(newSaves);
		this.setLocalStorage('autoSaves', newSaves);
		log(`addAutoSaveState`, 'end');
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

	window.dataLayer = window.dataLayer || [];
	function gtag() {
		window.dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-L8S3D8WCC9');
}

// --------------------------------------------------------------
// Window unload behavior
// --------------------------------------------------------------

export function updateWindowUnloadEvent() {
	const project = getCurrentProject();
	const app = getGlyphrStudioApp();

	if (app.settings.dev.mode) {
		if (app.settings.dev.stopPageNavigation) {
			window.onbeforeunload = showBeforeUnloadConfirmation;
		} else {
			window.onbeforeunload = '';
		}
	} else if (project.settings.app.stopPageNavigation) {
		window.onbeforeunload = showBeforeUnloadConfirmation;
	} else {
		window.onbeforeunload = '';
	}
}

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
					href="mailto:mail@glyphrstudio.com&subject=[${GSApp.version}] Feedback"
					>mail@glyphrstudio.com</a>
				<br><br><br>
				<pre>${errorObject.stack.replaceAll('<', '&lt;')}</pre>
			</div>
		</div>
	`;

	wrapper.innerHTML = content;
}

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
	user agent %09 ${encodeURIComponent(navigator.userAgentData)} %0A`;

	// log(con);

	return con;
}
