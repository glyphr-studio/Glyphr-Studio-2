import { ProjectEditor } from '../project_editor/project_editor.js';
import { importGlyphrProjectFromText } from '../project_editor/import.js';
import { getGlyphrStudioApp } from './main.js';

export { makeAppTopBar };

/**
 * Creates a new Glyphr Studio Application
 */
export class GlyphrStudioApp {
	/**
	 * Initialize the Glyphr Studio App, with defaults
	 */
	constructor() {
		// Version
		this.versionName = 'Version 2 alpha';
		this.version = '2.0.0';
		this.versionDate = 0;
		this.projectEditors = [];
		this.selectedProjectEditor = 0;

		this.settings = {
			dev: {
				// Internal Dev Stuff
				mode: true, // global switch for all the stuff below
				currentPage: false, // navigate straight to a page
				currentPanel: false, // navigate straight to a panel
				selectedPath: false, // automatically select a path
				debugAutoGroup: false, // try to console.group based on text strings
				debugTableObjects: false, // Show objects in tables in the console
				testActions: [],
				testOnLoad: function () {},
				testOnRedraw: function () {},
			},
			telemetry: false, // Load google analytics
		};
	}

	/**
	 * Starts up the app
	 */
	setUp(sampleProject = false) {
		log(`GlyphrStudioApp.setUp`, 'start');

		this.projectEditors[0] = new ProjectEditor();
		let editor = this.getCurrentProjectEditor();

		// Dev mode stuff
		let dev = this.settings.dev;
		if (dev.mode) {
			log('DEV NAV - to ' + dev.currentPage);
			document.title = '⡄⡆⡇ ⃨G⃨S⃨2⃨D⃨E⃨V⃨M⃨O⃨D⃨E⃨ ⡇⡆⡄';

			// Sample Project
			if (sampleProject) {
				log('Using sample project');
				editor.project = importGlyphrProjectFromText(sampleProject);
			}

			// Test Function
			if (dev.testOnLoad) dev.testOnLoad();

			// Navigation
			if(dev.currentPage) editor.nav.page = dev.currentPage;
			if(dev.currentPanel) editor.nav.panel = dev.currentPanel;
		}

		log(editor);
		log(editor.nav);
		this.fadeOutLoadScreen();
		editor.nav.navigate();

		log(`GlyphrStudioApp.setUp`, 'end');
	}

	/**
	 * Fades out the initial load screen to show the App
	 * @param {number} delay - override default fadeout time
	 */
	fadeOutLoadScreen(delay = 700) {
		const loadScreen = document.getElementById('loadScreen');
		if (loadScreen) {
			loadScreen.style.opacity = 0;

			setTimeout(function () {
				// loadScreen.style.visibility = 'hidden';
				// loadScreen.style.display = 'none';
				document.body.removeChild(loadScreen);
			}, delay);
		}
	}

	/**
	 * Returns the project that is currently being edited
	 * @returns {GlyphrStudioProject}
	 */
	getCurrentProject() {
		return this.getCurrentProjectEditor().project;
	}

	/**
	 * Returns the current Project Editor
	 * @returns {ProjectEditor}
	 */
	getCurrentProjectEditor() {
		if (!this.projectEditors[this.selectedProjectEditor]) {
			this.projectEditors[this.selectedProjectEditor] = new ProjectEditor();
		}

		return this.projectEditors[this.selectedProjectEditor];
	}
}

function makeAppTopBar() {
	let app = getGlyphrStudioApp();
	return `<div id="app__top-bar">Glyphr Studio&emsp;<span style="font-size: 0.6em; opacity: 60%;">${app.versionName} - ${app.version}</span></div>`;
}

// --------------------------------------------------------------
// Issue email
// --------------------------------------------------------------

/**
 * Generates the content for the "email us" link
 * @returns {string}
 */
export function makeEmailContent() {
	const con = `Have a feature idea or ran into an issue%3F We'd be happy to help!
	%0A%0A%0A%0A___________________________________________%0A
	version %09Glyphr Studio  ${getGlyphrStudioApp().version} %0A
	user agent %09 ${encodeURIComponent(navigator.userAgentData)} %0A`;

	// log(con);

	return con;
}
