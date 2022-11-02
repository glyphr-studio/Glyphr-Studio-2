import { ProjectEditor } from '../project_editor/project_editor.js';
import { importGlyphrProjectFromText } from '../project_editor/import.js';
import { getGlyphrStudioApp } from './main.js';

/**
 * Creates a new Glyphr Studio Application
 */
export class GlyphrStudioApp {
	/**
	 * Initialize the Glyphr Studio App, with defaults
	 */
	constructor() {
		// Version
		this.versionName = 'Version 2: Alpha-1';
		this.version = '2.0.0-alpha.1';
		this.versionDate = 1667350000000;
		this.projectEditors = [];
		this.selectedProjectEditor = 0;

		this.settings = {
			dev: {
				// Internal Dev Stuff
				mode: true, // global switch for all the stuff below
				overwriteTitle: false, // Use a 'Dev Mode' window title
				currentPage: false, // navigate straight to a page
				currentItemID: false, // select a glyph
				currentPanel: false, // navigate straight to a panel
				currentTool: false, // select a tool
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

		this.projectEditors[0] = new ProjectEditor();
		const editor = this.getCurrentProjectEditor();

		// Dev mode stuff
		const dev = this.settings.dev;
		if (dev.mode) {
			if (dev.overwriteTitle) document.title = '⡄⡆⡇🄳🄴🅅 🄼🄾🄳🄴⡇⡆⡄';

			// Sample Project
			if (sampleProject) {
				// log('Using sample project');
				editor.project = importGlyphrProjectFromText(sampleProject);
			}

			// Selected canvas stuff
			// editor.multiSelect.paths.select(editor.selectedGlyph.paths[0]);
			// editor.multiSelect.points.select(editor.selectedGlyph.paths[0].pathPoints[0]);

			// Test Function
			if (dev.testOnLoad) dev.testOnLoad();

			// Navigation
			if (dev.selectedItemID) editor.selectedItemID = dev.selectedItemID;
			if (dev.currentPage) editor.nav.page = dev.currentPage;
			if (dev.currentPanel) editor.nav.panel = dev.currentPanel;
			if (dev.currentTool) editor.selectedTool = dev.currentTool;
		}

		if (this.settings.telemetry) {
			addTelemetry();
		}

		// log(editor);
		// log(editor.nav.page);
		this.fadeOutLoadScreen();
		editor.navigate();

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

function addTelemetry() {
	/*
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-L8S3D8WCC9"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-L8S3D8WCC9');
	</script>
	*/

	let gScript = document.createElement('script');
	gScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-L8S3D8WCC9');
	gScript.setAttribute('async', '');
	document.head.appendChild(gScript);

	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-L8S3D8WCC9');
}

export function makeAppTopBar() {
	let app = getGlyphrStudioApp();
	return `
		<div id="app__top-bar">
			Glyphr Studio&emsp;
			<span class="versionInfo">
				${app.versionName} - ${app.version}
			</span>
			<span class='alphaBugContact'>
				Found a bug? Have some feedback?
				${emailLink()}
			</span>
		</div>
	`;
}

// --------------------------------------------------------------
// Issue email
// --------------------------------------------------------------

export function emailLink() {
	let app = getGlyphrStudioApp();
	return `
		<a class="mailto" href="mailto:mail@glyphrstudio.com?subject=[${app.version}] Feedback">mail@glyphrstudio.com</a>
	`;
}
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
