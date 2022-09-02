import { ProjectEditor } from '../project/project_editor.js';
import { importGlyphrProjectFromText } from '../project/import.js';
import { log } from '../common/functions.js';
import { getGlyphrStudioApp } from './main.js';
import { showNavDropdown } from './nav.js';

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
				selectedShape: false, // automatically select a shape
				debugAutoGroup: false, // try to console.group based on text strings
				debugTableObjects: false, // Show objects in tables in the console
				testActions: [],
				testOnLoad: function () {},
				testOnRedraw: function () {},
			},
			telemetry: true, // Load google analytics
		};
	}

	/**
	 * Starts up the app
	 */
	setUp(sampleProject = false) {
		log(`GlyphrStudioApp.setUp`, 'start');

		let gsProject = {};

		// Dev mode stuff
		if (this.settings.dev.mode) {
			log('DEV NAV - to ' + this.settings.dev.currentPage);
			document.title = '⡄⡆⡇ ⃨G⃨S⃨2⃨D⃨E⃨V⃨M⃨O⃨D⃨E⃨ ⡇⡆⡄';

			// Sample Project
			if (sampleProject) {
				log('Using sample project');
				gsProject = importGlyphrProjectFromText(sampleProject);
			}

			// Test Function
			if (this.settings.dev.testOnLoad) this.settings.dev.testOnLoad();
		}

		this.projectEditors[0] = new ProjectEditor({
			project: gsProject,
			nav: {
				page: this.settings.dev.currentPage,
				panel: this.settings.dev.currentPanel
			}
		});

		log(this.getCurrentProjectEditor());
		this.fadeOutLoadScreen();
		this.navigate();

		log(`GlyphrStudioApp.setUp`, 'end');
	}

	/**
	 * Draws the current Project Editor to the document
	 * @param {string} pageName - what page to navigate to
	 */
	navigate(pageName) {
		log(`GlyphrStudioApp.navigate`, 'start');
		log(`nav to ${pageName}`);
		this.getCurrentProjectEditor().navigate(pageName);
		log(`GlyphrStudioApp.navigate`, 'end');
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