import { ProjectEditor } from '../project_editor/project_editor.js';
import { getCurrentProjectEditor, getGlyphrStudioApp, GSApp, log } from './main.js';
import { addAsChildren, insertAfter, makeElement } from '../common/dom.js';
import { closeAllDialogs, makeContextMenu } from '../controls/dialogs/dialogs.js';
import { ioSVG_exportSVGfont } from '../io/svg_font_export.js';
import { ioFont_exportFont } from '../io/font_export.js';
import logoHorizontal from '../common/graphics/logo-wordmark-horizontal-small.svg?raw';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import versionTwoTestProject from '../samples/versionTwoTestProject.json';

/**
 * Creates a new Glyphr Studio Application
 */
export class GlyphrStudioApp {
	/**
	 * Initialize the Glyphr Studio App, with defaults
	 */
	constructor() {
		// Version
		this.versionName = 'Version 2: Beta-1';
		this.version = '2.0.0-beta.1';
		this.versionDate = false;
		this.projectEditors = [];
		this.selectedProjectEditor = 0;

		this.settings = {
			dev: {
				// Internal Dev Stuff
				mode: true, // global switch for all the stuff below
				overwriteTitle: false, // Use a 'Dev Mode' window title
				sampleProject: true, // Load the sample project
				currentPage: 'Glyph edit', // navigate straight to a page
				currentGlyphID: false, // select a glyph
				currentPanel: false, // navigate straight to a panel
				currentTool: false, // select a tool
				selectFirstPath: true, // select a shape
				selectFirstPoint: true, // select a path point
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

		this.projectEditors[0] = new ProjectEditor();
		const editor = this.getCurrentProjectEditor();

		// Dev mode stuff
		const dev = this.settings.dev;
		if (dev.mode) {
			if (dev.overwriteTitle) document.title = '⡄⡆⡇🄳🄴🅅 🄼🄾🄳🄴⡇⡆⡄';

			// Test Function
			if (dev.testOnLoad) dev.testOnLoad();

			// Navigation & selection
			if (dev.sampleProject)
				editor.project = importGlyphrProjectFromText(versionTwoTestProject);
			if (dev.currentGlyphID) editor.selectedGlyphID = dev.currentGlyphID;
			if (dev.currentPage) editor.nav.page = dev.currentPage;
			if (dev.currentPanel) editor.nav.panel = dev.currentPanel;
			if (dev.currentTool) editor.selectedTool = dev.currentTool;
			if (dev.selectFirstPath) editor.multiSelect.paths.select(editor.selectedGlyph.paths[0]);
			if (dev.selectFirstPoint)
				editor.multiSelect.points.select(editor.selectedGlyph.paths[0].pathPoints[0]);
		}

		if (this.settings.telemetry) {
			addTelemetry();
		}

		// log(editor);
		// log(editor.nav.page);
		this.fadeOutLandingPage();
		editor.navigate();
		if (dev.mode && (dev.selectFirstPath || dev.selectFirstPoint)) editor.editCanvas.redraw();

		log(`GlyphrStudioApp.setUp`, 'end');
	}

	/**
	 * Fades out the initial load screen to show the App
	 * @param {number} delay - override default fadeout time
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

export function showAppErrorPage(friendlyMessage = '', errorObject = { message: '', stack: '' }) {
	const wrapper = document.querySelector('#app__wrapper');
	closeAllDialogs();
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
		window.dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-L8S3D8WCC9');
}

export function makeAppTopBar() {
	let topBar = makeElement({ tag: 'div', id: 'app__top-bar' });

	let logo = makeElement({ innerHTML: logoHorizontal, className: 'top-bar__logo' });

	let menus = makeElement({ className: 'top-bar__menus' });
	menus.appendChild(makeMenu('File'));
	menus.appendChild(makeMenu('Project'));
	menus.appendChild(makeMenu('Help'));

	let bugContact = makeElement({
		className: 'top-bar__bug-contact',
		innerHTML: `Found a bug? Have some feedback? ${emailLink()}`,
	});

	addAsChildren(topBar, [logo, menus, bugContact]);

	return topBar;
}

function makeMenu(menuName) {
	let entryPoint = makeElement({
		tag: 'button',
		innerHTML: menuName,
		className: 'menu-entry-point',
	});

	entryPoint.addEventListener('mouseover', closeAllDialogs);

	if (menuName === 'File') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeAllDialogs();
			insertAfter(
				entryPoint,
				makeContextMenu(
					[
						{
							name: 'Save Glyphr Studio Project File',
							icon: 'command_save',
							shortcut: ['Ctrl', 's'],
							onClick: () => {
								getCurrentProjectEditor().saveGlyphrProjectFile();
							},
						},
						{ name: 'hr' },
						{
							name: 'Export OTF File',
							icon: 'command_export',
							shortcut: ['Ctrl', 'e'],
							onClick: ioFont_exportFont,
						},
						{
							name: 'Export SVG Font File',
							icon: 'command_export',
							shortcut: ['Ctrl', 'g'],
							onClick: ioSVG_exportSVGfont,
						},
					],
					rect.x,
					rect.y + rect.height
				)
			);
		});
	}

	if (menuName === 'Project') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeAllDialogs();
			insertAfter(
				entryPoint,
				makeContextMenu(
					[
						{
							name: 'Open another project',
							icon: 'command_newTab',
							shortcut: ['Ctrl', 'o'],
							onClick: () => {
								window.open('https://glyphrstudio.com/v2/app/', '_blank');
							},
						},
					],
					rect.x,
					rect.y + rect.height
				)
			);
		});
	}

	if (menuName === 'Help') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeAllDialogs();
			insertAfter(
				entryPoint,
				makeContextMenu(
					[
						{
							name: 'External Help & Documentation site',
							icon: 'command_newTab',
							onClick: () => {
								window.open('https://glyphrstudio.com/v2/help/', '_blank');
							},
						},
						{ name: 'hr' },
						{
							name: 'In-app help',
							icon: 'command_help',
							onClick: () => {
								let editor = getCurrentProjectEditor();
								editor.nav.page = 'Help';
								editor.navigate();
							},
						},
						{
							name: 'About Glyphr Studio',
							icon: 'command_info',
							onClick: () => {
								let editor = getCurrentProjectEditor();
								editor.nav.page = 'About';
								editor.navigate();
							},
						},
					],
					rect.x,
					rect.y + rect.height
				)
			);
		});
	}

	return entryPoint;
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
