import { addAsChildren, makeElement } from '../common/dom.js';
import logoVertical from '../common/graphics/logo-wordmark-vertical.svg?raw';
import { closeEveryTypeOfDialog, showError, showToast } from '../controls/dialogs/dialogs.js';
import { makeProgressIndicator, updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { cancelDefaultEventActions } from '../edit_canvas/events.js';
import { ioFont_importFont } from '../formats_io/otf/font_import.js';
import { ioSVG_importSVGfont } from '../formats_io/svg_font/svg_font_import.js';
import { validateSingleFileInput } from '../formats_io/validate_file_input.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import obleggExampleProject from '../samples/oblegg.gs2?raw';
import simpleExampleProject from '../samples/simpleExampleProject.json';
import { updateWindowUnloadEvent } from './app.js';
import {
	addProjectEditorAndSetAsImportTarget,
	getCurrentProjectEditor,
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from './main.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 */
let isSecondProject;

/**
 * Page Maker for the Open Project page
 * @param {Boolean} secondProjectFlag - true if it's not the currently selected project
 * @returns {Element}
 */
export function makePage_OpenProject(secondProjectFlag = false) {
	// log(`makePage_OpenProject`, 'start');
	// log(`secondProjectFlag: ${secondProjectFlag}`);
	isSecondProject = secondProjectFlag;
	const recent = 1000 * 60 * 60 * 24 * 7; // seven days in milliseconds
	let recentMessage = '';
	const app = getGlyphrStudioApp();
	if (Date.now() - app.versionDate < recent) {
		recentMessage = ` - <a href="https://www.glyphrstudio.com/help/about/updates.html" target="_blank">recently updated!</a>`;
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

	dropNote.addEventListener('drop', (/** @type {DragEvent} */ event) => {
		cancelDefaultEventActions(event);
		handleOpenProjectPageFileInput(event?.dataTransfer?.items || []);
	});
	dropNote.addEventListener('dragleave', handleDragLeave);

	// log(`makePage_OpenProject`, 'end');
	return content;
}

/**
 * makeOpenProjectTabs creates all tab content as display:hidden
 * this function selects the default tab and content
 * @param {Document | HTMLElement} node - wrapper for the tab
 */
function showDefaultTab(node) {
	if (isSecondProject) {
		/** @type {HTMLElement} */
		const loadArea = node.querySelector('#tab-content__load');
		loadArea.style.display = 'block';
		node.querySelector('#open-project__tab-load').setAttribute('selected', '');
	} else {
		/** @type {HTMLElement} */
		const newArea = node.querySelector('#tab-content__new');
		newArea.style.display = 'block';
		node.querySelector('#open-project__tab-new').setAttribute('selected', '');
	}
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
 * @returns {Element} DOM node
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
		onClick: async () => {
			getFilesFromFilePicker(handleOpenProjectPageFileInput);
		},
	});

	addAsChildren(tabContentLoad, [dropTarget, openFileChooser]);

	// Auto-saved backups
	const tabContentAutoSaves = makeElement({
		id: 'tab-content__auto-saves',
		className: 'open-project__tab-content',
		innerHTML: `<h2>Restore from auto-saved backup</h2>`,
		style: 'display: none;',
	});

	const contentAutoSavesList = makeElement({
		tag: 'div',
		id: 'auto-saves__list',
	});

	const saves = getGlyphrStudioApp().getLocalStorage().autoSaves;
	let hasContent = false;
	for (let id in saves) {
		contentAutoSavesList.appendChild(makeRestoreProjectRow(id));
		hasContent = true;
	}

	function makeRestoreProjectRow(id) {
		let row = makeElement({ tag: 'div', className: 'auto-saves__list-row' });
		addAsChildren(row, [
			makeElement({ className: 'name', content: saves[id].name }),
			makeElement({ className: 'project-id', content: `(${id})` }),
			makeElement({
				tag: 'fancy-button',
				innerHTML: '⇨',
				onClick: () => loadProjectFromAutoSave(id),
			}),
			makeElement({ className: 'time-stamp', content: new Date(saves[id].time).toLocaleString() }),
		]);
		return row;
	}

	if (!hasContent)
		contentAutoSavesList.appendChild(
			makeElement({ tag: 'i', innerHTML: 'No auto-saves exist yet' })
		);

	addAsChildren(tabContentAutoSaves, [contentAutoSavesList]);

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
		innerHTML: 'Oblegg',
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

	const tabAutoSaves = makeElement({
		tag: 'button',
		id: 'open-project__tab-auto-saves',
		className: 'open-project__tab',
		innerHTML: 'Restore',
		onClick: () => {
			deselectAllTabs();
			tabAutoSaves.setAttribute('selected', '');
			tabContentAutoSaves.style.display = 'block';
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
	let tabControls = [tabNew, tabLoad, tabExamples];
	if (!isSecondProject) tabControls.splice(2, 0, tabAutoSaves);
	addAsChildren(tabs, tabControls);

	const tabWrapper = makeElement({ className: 'open-project__tab-wrapper' });
	let tabContents = [tabs, tabContentNew, tabContentLoad, tabContentExamples];
	if (!isSecondProject) tabContents.splice(3, 0, tabContentAutoSaves);
	addAsChildren(tabWrapper, tabContents);
	return tabWrapper;
}

/**
 * Shows an OS File Picker, then returns the selected files
 * to a provided callback function.
 * @param {Function} callback - what to do with the files
 * @param {Object} pickerOptions - OS File Picker Options Object
 */
export async function getFilesFromFilePicker(callback, pickerOptions = {}) {
	/** @ts-ignore */
	if (window.showOpenFilePicker) {
		/** @ts-ignore */
		const files = await window.showOpenFilePicker(pickerOptions);
		callback(files);
	} else {
		// showError(`Can't open OS File Picker. Try dragging and dropping a file instead.`);
		/** @type {any} */
		const fallbackFileChooser = makeElement({ tag: 'input', attributes: { type: 'file' } });
		fallbackFileChooser.addEventListener('change', (event) => {
			// log(fallbackFileChooser.files);
			cancelDefaultEventActions(event);
			callback(fallbackFileChooser.files);
		});
		fallbackFileChooser.click();
	}
}

/**
 * Sets all the tabs to deselected and hides all the tab contents
 */
function deselectAllTabs() {
	const tabs = document.querySelectorAll('.open-project__tab');
	tabs.forEach((tab) => tab.removeAttribute('selected'));

	const tabContents = document.querySelectorAll('.open-project__tab-content');
	tabContents.forEach((/** @type {HTMLElement} */ content) => (content.style.display = 'none'));
}

/**
 * Handle file input or drop
 * @param {Object} files - event from drop, or fileHandle from showOpenFilePicker
 */
async function handleOpenProjectPageFileInput(files) {
	// log('handleOpenProjectPageFileInput', 'start');
	// log(`\n⮟files⮟`);
	// log(files);

	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
	dropNote.style.display = 'none';
	const rightArea = document.querySelector('#open-project__right-area');
	rightArea.innerHTML = '';
	rightArea.appendChild(makeProgressIndicator());

	let fileInput;
	let fileResult;
	if (files.length) {
		fileInput = files[0];
		// log(fileInput);
		if (fileInput.getAsFileSystemHandle) fileResult = await fileInput.getAsFileSystemHandle();
		else if (fileInput.getAsFile) fileResult = await fileInput.getAsFile();
		else fileResult = fileInput;
	} else {
		showError(`No files were found that could be imported.`);
	}

	// log(fileResult);
	validateSingleFileInput(fileResult, postValidationCallback);

	// log('handleOpenProjectPageFileInput', 'end');
}

/**
 * What to do after a file has been validated
 * @param {Object} validationResult - validation object
 */
function postValidationCallback(validationResult) {
	// log(`postValidationCallback`, 'start');
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	if (validationResult.content) {
		if (validationResult.fileType === 'font') {
			ioFont_importFont(validationResult.content);
		} else if (validationResult.fileType === 'svg') {
			ioSVG_importSVGfont(validationResult.content);
		} else if (validationResult.fileType === 'project') {
			getCurrentProjectEditor().loadedFileHandle = validationResult.fileHandle;
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

/**
 * Do all the stuff necessary to import a text file and
 * get the UI to the right page.
 * @param {GlyphrStudioProject | Object} glyphrStudioProjectFile
 */
export function importProjectDataAndNavigate(glyphrStudioProjectFile) {
	// log(`importProjectDataAndNavigate`, 'start');
	closeEveryTypeOfDialog();
	const editor = getProjectEditorImportTarget();
	setCurrentProjectEditor(editor);
	if (!glyphrStudioProjectFile) {
		editor.project = new GlyphrStudioProject({});
		/** @type {HTMLInputElement} */
		const nameInput = document.querySelector('#input__new-project-name');
		const name = nameInput?.value || 'My Font';
		editor.project.settings.project.name = name;
		editor.project.settings.font.family = name;
	} else {
		editor.project = importGlyphrProjectFromText(glyphrStudioProjectFile);
	}

	editor.project.resetSessionStateForAllItems();
	editor.nav.page = 'Overview';
	if (isSecondProject) showToast(`Switched to<br>${editor.project.settings.project.name}`);
	updateWindowUnloadEvent();
	editor.navigate();
	// log(`importProjectDataAndNavigate`, 'end');
}

/**
 * Finds and loads a project by ID from local storage
 * @param {String} projectID - internal Glyphr Studio Project ID
 * @returns nothing
 */
function loadProjectFromAutoSave(projectID) {
	const saves = getGlyphrStudioApp().getLocalStorage().autoSaves;
	for (let id in saves) {
		if (id === projectID) {
			importProjectDataAndNavigate(saves[id].project);
			showToast(`Restored project from auto-save:<br>${saves[id].name}`);
			return;
		}
	}
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
	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
	dropNote.style.animation = 'var(--animate-fade-in)';
	dropNote.style.opacity = '1';
	dropNote.innerHTML = `Drop it!`;
	dropNote.style.display = 'block';
	// log(`handleDragEnter`, 'end');
}

/**
 * Handle DragLeave event
 */
function handleDragLeave() {
	// log(`handleDragLeave`, 'start');
	// cancelDefaultEventActions(event);
	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
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
	document.querySelector('#tab-content__examples').innerHTML =
		'<h2>Load an example project</h2>Loading example project...';

	let project = simpleExampleProject;
	if (name === 'oblegg') project = obleggExampleProject;
	setTimeout(function () {
		// log(`Loading sample project ${name}`);

		importProjectDataAndNavigate(project);
	}, 100);
}

