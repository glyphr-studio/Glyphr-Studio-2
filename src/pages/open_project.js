import { updateWindowUnloadEvent } from '../app/app.js';
import {
	addProjectEditorAndSetAsImportTarget,
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import logoVertical from '../common/graphics/logo-wordmark-vertical.svg?raw';
import { closeEveryTypeOfDialog, showError, showToast } from '../controls/dialogs/dialogs.js';
import { makeProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { cancelDefaultEventActions } from '../edit_canvas/events.js';
import { ioFont_importFont } from '../io/font_import.js';
import { ioSVG_importSVGfont } from '../io/svg_font_import.js';
import { validateFileInput } from '../io/validate_file_input.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import obleggExampleProject from '../samples/oblegg-0-2.gs2?raw';
import simpleExampleProject from '../samples/simpleExampleProject.json';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 * HTML and associated functions for this page.
 */

export const importOverflowCount = 326;
let isSecondProject;

export function makePage_OpenProject(secondProjectFlag = false) {
	// log(`makePage_OpenProject`, 'start');
	// log(`secondProjectFlag: ${secondProjectFlag}`);
	isSecondProject = secondProjectFlag;
	const recent = 1000 * 60 * 60 * 24 * 7; // seven days in milliseconds
	let recentMessage = '';
	const app = getGlyphrStudioApp();
	if (Date.now() - app.versionDate < recent) {
		recentMessage = ` - <a href="https://www.glyphrstudio.com/v2/help/about/updates.html" target="_blank">recently updated!</a>`;
	}

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="open-project__page">
				<div id="open-project__left-area" vertical-align="middle">
					<div id="open-project__logo">${logoVertical}</div>
					<span class="open-project__version-name">${app.versionName}</span>
					<span class="open-project__version-number">${app.version}${recentMessage}</span>
					<div class="open-project__blurb">
						For more information visit <a href="http://www.glyphrstudio.com" target="_blank">www.glyphrstudio.com</a><br>
						Glyphr Studio is licensed under a <a href="https://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License</a>,
						which is a free / open source "copyleft" license. You are free to use, distribute, and modify Glyphr Studio as long as
						this license and its freeness stays intact.
					</div>
				</div>
				<div id="open-project__right-area" vertical-align="middle"></div>
				<div id="open-project__drop-note"></div>
				<input id="open-project__file-chooser" type="file" style="display: none;"/>
			</div>
		`,
	});

	// Tabs
	const tableRight = content.querySelector('#open-project__right-area');
	tableRight.appendChild(makeOpenProjectTabs());
	showDefaultTab(content);

	// Drag over handlers
	const page = content.querySelector('#open-project__page');
	page.addEventListener('dragenter', handleDragEnter);
	page.addEventListener('dragover', cancelDefaultEventActions);

	// Drop and Drag Leave handlers
	const dropNote = content.querySelector('#open-project__drop-note');
	dropNote.addEventListener('drop', handleDrop);
	dropNote.addEventListener('dragleave', handleDragLeave);

	// File chooser handler
	content
		.querySelector('#open-project__file-chooser')
		.addEventListener('change', handleDrop, false);
	// log(`makePage_OpenProject`, 'end');
	return content;
}

/**
 * makeOpenProjectTabs creates all tab content as display:hidden
 * this function selects the default tab and content
 */
function showDefaultTab(node) {
	node.querySelector('#tab-content__examples').style.display = 'block';
	node.querySelector('#open-project__tab-examples').setAttribute('selected', '');
}

/**
 * Import OTF/SVG/Project functions can call this if import fails and
 * the user needs a second try to specify how to start their project.
 */
export function resetOpenProjectTabs() {
	const tableRight = document.querySelector('#open-project__right-area');
	tableRight.innerHTML = '';
	tableRight.appendChild(makeOpenProjectTabs());
	showDefaultTab(document);
}

/**
 * Create the tabs for the load project page
 * @returns {Object} DOM node
 */
export function makeOpenProjectTabs() {
	// --------------------------------------------------------------
	// Make contents for each tab
	// --------------------------------------------------------------

	// Content for New Project tab
	const tabContentNew = makeElement({
		id: 'tab-content__new',
		className: 'open-project__tab-content',
		innerHTML: '<h2>Start a new Glyphr Studio project</h2>\nProject name: &nbsp;',
		style: 'display: none;',
	});

	const inputProjectName = makeElement({
		tag: 'input',
		id: 'input__new-project-name',
		attributes: { type: 'text', value: 'My Font', autofocus: 'true' },
	});

	const buttonStartNewProject = makeElement({
		tag: 'fancy-button',
		id: 'button__create-new-project',
		innerHTML: 'Create a new font from scratch',
		onClick: handleNewProject,
	});

	const br = makeElement({ tag: 'br' });
	addAsChildren(tabContentNew, [inputProjectName, br, br, buttonStartNewProject]);

	// Content for Load tab
	const tabContentLoad = makeElement({
		id: 'tab-content__load',
		className: 'open-project__tab-content',
		innerHTML: '<h2>Load a file</h2>\nDrag and drop one of the following:<br>',
		style: 'display: none;',
	});

	const dropTarget = makeElement({
		id: 'open-project__drop-target',
		innerHTML: `
			Glyphr Studio Project &ensp;(.gs2, .txt)<br>
			Open Type, True Type, or WOFF&ensp;(.otf, .ttf, .woff)<br>
			SVG Font &ensp;(.svg)
		`,
	});

	const openFileChooser = makeElement({
		tag: 'fancy-button',
		attributes: { dark: '' },
		innerHTML: 'or, open file chooser...',
		onClick: () => {
			document.getElementById('open-project__file-chooser').click();
		},
	});

	addAsChildren(tabContentLoad, [dropTarget, openFileChooser]);

	// Content for Examples tab
	const tabContentExamples = makeElement({
		id: 'tab-content__examples',
		className: 'open-project__tab-content',
		innerHTML: `<h2>Load an example project</h2>`,
		style: 'display: none;',
	});

	const contentSimpleProject = makeElement({
		tag: 'div',
		innerHTML: `The Simple v2 Project has a few characters and things to show off basic functionality:<br><br>`,
	});

	const buttonSimpleProject = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Simple v2 project',
		onClick: () => handleLoadSample('simpleProject'),
	});

	const contentOblegg = makeElement({
		tag: 'div',
		innerHTML: `Oblegg is the GSv2 project we use to test all the various Glyphr Studio features:<br><br>`,
	});

	const buttonOblegg = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Oblegg (v0.3)',
		onClick: () => handleLoadSample('oblegg'),
	});

	addAsChildren(tabContentExamples, [
		contentOblegg,
		buttonOblegg,
		contentSimpleProject,
		buttonSimpleProject,
	]);

	// --------------------------------------------------------------
	// Make tabs, hook it all up
	// --------------------------------------------------------------
	// Tabs
	const tabNew = makeElement({
		tag: 'button',
		id: 'open-project__tab-new',
		className: 'open-project__tab',
		innerHTML: 'New',
		onClick: () => {
			deselectAllTabs();
			tabNew.setAttribute('selected', '');
			tabContentNew.style.display = 'block';
		},
	});

	const tabLoad = makeElement({
		tag: 'button',
		id: 'open-project__tab-load',
		className: 'open-project__tab',
		innerHTML: 'Load',
		onClick: () => {
			deselectAllTabs();
			tabLoad.setAttribute('selected', '');
			tabContentLoad.style.display = 'block';
		},
	});

	const tabExamples = makeElement({
		tag: 'button',
		id: 'open-project__tab-examples',
		className: 'open-project__tab',
		innerHTML: 'Examples',
		onClick: () => {
			deselectAllTabs();
			tabExamples.setAttribute('selected', '');
			tabContentExamples.style.display = 'block';
		},
	});

	const tabs = makeElement({ className: 'open-project__tabs' });
	addAsChildren(tabs, [tabNew, tabLoad, tabExamples]);

	const tabWrapper = makeElement({ className: 'open-project__tab-wrapper' });
	addAsChildren(tabWrapper, [tabs, tabContentNew, tabContentLoad, tabContentExamples]);
	return tabWrapper;
}

/**
 * Sets all the tabs to deselected and hides all the tab contents
 */
function deselectAllTabs() {
	const tabs = document.querySelectorAll('.open-project__tab');
	tabs.forEach((tab) => tab.removeAttribute('selected'));
	const tabContents = document.querySelectorAll('.open-project__tab-content');
	tabContents.forEach((content) => (content.style.display = 'none'));
}

/**
 * Handle file drop
 * @param {Object} event - drop event
 */
function handleDrop(event) {
	// log('handleDrop', 'start');
	cancelDefaultEventActions(event);
	// log(event);

	const dropNote = document.getElementById('open-project__drop-note');
	dropNote.style.display = 'none';
	const rightArea = document.getElementById('open-project__right-area');
	rightArea.innerHTML = '';
	rightArea.appendChild(makeProgressIndicator());

	const fileChooser = document.getElementById('open-project__file-chooser');
	const filesData = event.dataTransfer || fileChooser;
	// log(filesData);

	validateFileInput(filesData, postValidationCallback);

	// log('handleDrop', 'end');
}

function postValidationCallback(validationResult) {
	// log(`postValidationCallback`, 'start');
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	if (validationResult.content) {
		if (validationResult.fileType === 'font') {
			ioFont_importFont(validationResult.content);
		} else if (validationResult.fileType === 'svg') {
			ioSVG_importSVGfont(validationResult.content);
		} else if (validationResult.fileType === 'project') {
			importProjectDataAndNavigate(validationResult.content);
		}
	} else {
		if (validationResult.errorMessage) {
			showError(validationResult.errorMessage);
		} else {
			showError(`Some unknown error happened when loading the file.`);
		}

		resetOpenProjectTabs();
	}
	// log(`postValidationCallback`, 'end');
}

function importProjectDataAndNavigate(glyphrStudioProjectFile) {
	closeEveryTypeOfDialog();
	const editor = getProjectEditorImportTarget();
	setCurrentProjectEditor(editor);
	editor.project = importGlyphrProjectFromText(glyphrStudioProjectFile);
	editor.nav.page = 'Overview';
	if (isSecondProject) showToast(`Switched to<br>${editor.project.settings.project.name}`);
	updateWindowUnloadEvent();
	editor.navigate();
}

/**
 * Handle Message event
 * @param {Object} event - event
 */
// TODO Paste handler on open project page
/*
function handleMessage(event) {
	const app = getGlyphrStudioApp();
	// assume strings are SVG fonts
	app.temp.droppedFileContent = event.data;

	if (typeof event.data === 'string') {
		// ioSVG_importSVGfont(false);
		// assume array buffers are otf fonts
	} else if (event.data instanceof ArrayBuffer) {
		// ioFont_importFont(false);
	}
}
*/
// --------------------------------------------------------------
// Drag Events
// --------------------------------------------------------------

/**
 * Handle DragOver event
 * @param {Object} event - event
 */
function handleDragEnter(event) {
	// log(`handleDragEnter`, 'start');
	// cancelDefaultEventActions(event);
	event.dataTransfer.dropEffect = 'copy';
	const dropNote = document.getElementById('open-project__drop-note');
	dropNote.style.animation = 'var(--animate-fade-in)';
	dropNote.style.opacity = '1';
	dropNote.innerHTML = `Drop it!`;
	dropNote.style.display = 'block';
	// log(`handleDragEnter`, 'end');
}

/**
 * Handle DragLeave event
 * @param {Object} event - event
 */
function handleDragLeave() {
	// log(`handleDragLeave`, 'start');
	// cancelDefaultEventActions(event);
	const dropNote = document.getElementById('open-project__drop-note');
	dropNote.style.animation = 'var(--animate-fade-out)';
	window.setTimeout(() => {
		dropNote.style.display = 'none';
		dropNote.style.opacity = '0';
	}, 170);
	// log(`handleDragLeave`, 'end');
}

// --------------------------------------------------------------
// Loading projects
// --------------------------------------------------------------

/**
 * Create a new project from scratch
 */
function handleNewProject() {
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	setTimeout(importProjectDataAndNavigate, 10);
}

/**
 * Load a project sample
 * @param {String} name - which sample to load
 */
function handleLoadSample(name) {
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	document.getElementById('tab-content__examples').innerHTML =
		'<h2>Load an example project</h2>Loading example project...';

	let project = simpleExampleProject;
	if (name === 'oblegg') project = obleggExampleProject;
	setTimeout(function () {
		// log(`Loading sample project ${name}`);

		importProjectDataAndNavigate(project);
	}, 100);
}
