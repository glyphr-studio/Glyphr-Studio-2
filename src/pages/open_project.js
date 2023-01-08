import { addAsChildren, makeElement } from '../common/dom.js';
import { makeGlyphrStudioLogo } from '../common/graphics.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { projects } from '../samples/samples.js';
import { uiColors, accentColors } from '../common/colors.js';
import { ioFont_importFont } from '../io/font_import.js';
import { ioSVG_importSVGfont } from '../io/svg_font_import.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { cancelDefaultEventActions } from '../edit_canvas/events.js';
import { getVersionTwoTestProject } from '../samples/versionTwoTestProject.js';
import { json } from '../common/functions.js';
import { makeProgressIndicator } from '../controls/progress-indicator/progress-indicator.js';
import { closeAllDialogs, showError } from '../controls/dialogs.js';
import { validateFileInput } from '../io/validate_file_input.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 * HTML and associated functions for this page.
 */

let importRange = {
	begin: 0x0020,
	end: 0x024f,
};

export const importOverflowCount = 326;

export function makePage_OpenProject() {
	// log(`makePage_OpenProject`, 'start');
	const recent = 1000 * 60 * 60 * 24 * 7; // seven days in milliseconds
	let recentMessage = '';
	const app = getGlyphrStudioApp();
	if (Date.now() - app.versionDate < recent) {
		recentMessage = ` - <a href="http://glyphrstudio.com/help/overview_updates.html" target="_blank">recently updated!</a>`;
	}

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="open-project__page">
				<div id="open-project__left-area" vertical-align="middle">
					<div id="open-project__logo">${makeGlyphrStudioLogo()}</div>
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
	tableRight.appendChild(makeTabs());
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
 * makeTabs creates all tab content as display:hidden
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
	tableRight.appendChild(makeTabs());
	showDefaultTab(document);
}

/**
 * Create the tabs for the load project page
 * @returns {Object} DOM node
 */
function makeTabs() {
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
		innerHTML:
			'<h2>Load an example project</h2>\nVersion 2 Sample is a project that shows off some basic and new features:\n<br><br>',
		style: 'display: none;',
	});

	const buttonLoadExample = makeElement({
		tag: 'fancy-button',
		innerHTML: 'v2 sample project',
		onClick: () => handleLoadSample('v2Sample'),
	});

	addAsChildren(tabContentExamples, buttonLoadExample);

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
 * @param {object} event - drop event
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
}

function importProjectDataAndNavigate(glyphrStudioProjectFile = new GlyphrStudioProject()) {
	closeAllDialogs();
	const editor = getCurrentProjectEditor();
	editor.project = importGlyphrProjectFromText(glyphrStudioProjectFile);
	editor.nav.page = 'Overview';
	editor.navigate();
}

/**
 * Handle Message event
 * @param {object} event - event
 */
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

// --------------------------------------------------------------
// Drag Events
// --------------------------------------------------------------

/**
 * Handle DragOver event
 * @param {object} event - event
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
 * @param {object} event - event
 */
function handleDragLeave(event) {
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
	setTimeout(importProjectDataAndNavigate, 10);
}

/**
 * Load a project sample
 * @param {string} name - which sample to load
 */
function handleLoadSample(name) {
	document.getElementById('tab-content__examples').innerHTML =
		'<h2>Load an Example project</h2>Loading example project...';

	setTimeout(function () {
		importProjectDataAndNavigate(getVersionTwoTestProject());
	}, 100);
}

/*
















*/
// --------------------------------------------------------------
// OLD IMPORT STUFF
// --------------------------------------------------------------
export function isOutOfBounds(uni) {
	if (!uni.length) return true;

	for (let u = 0; u < uni.length; u++) {
		if (parseInt(uni[u]) > importRange.end || parseInt(uni[u]) < importRange.begin) return true;
	}

	return false;
}

function make_ImportFilter(chars, kerns, functionName) {
	let re =
		'<div class="openproject_tile" style="width:500px; height:auto;">' +
		'<h2>Whoa, there...</h2><br>' +
		"The font you're trying to import has <b>" +
		chars +
		' glyphs</b>';
	if (kerns) re += ' and <b>' + kerns + ' kern pairs</b>.  ';
	else re += '.  ';
	re +=
		'Glyphr Studio has a hard time with super-large fonts like this.  ' +
		'We recommend pairing it down a little:<br><br>';

	re += '<table>';

	re +=
		'<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'basic\');" id="basic" checked/></td><td>';
	re +=
		'<h3>Only import Latin glyphs</h3>' +
		'This includes Latin and Latin Extended Unicode ranges<br>(0x0020 - 0x024F).<br><br>';
	re += '</td></tr>';

	re +=
		'<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'custom\');" id="custom"/></td><td>';
	re +=
		'<h3>Import a custom range of glyphs</h3>' +
		'A nice overview of glyph ranges can be found at<br><a href="https://en.wikipedia.org/wiki/Unicode_block" target="_blank">Wikipedia\'s Unicode Block page</a>.<br>' +
		'<table class="settingstable"><tr>' +
		"<td>begin:<br><input type=\"text\" onchange=\"checkFilter('custom');document.getElementById('import-font-button').disabled = 'disabled';\" value=\"" +
		decToHex(importRange.begin) +
		'" id="custom-range-begin"></td>' +
		"<td>end:<br><input type=\"text\" onchange=\"checkFilter('custom');document.getElementById('import-font-button').disabled = 'disabled';\" value=\"" +
		decToHex(importRange.end) +
		'" id="custom-range-end"></td>' +
		'<td><br><button onclick="checkFilter(\'custom\');">Set Range</button></td>' +
		'<td style="padding-top:20px;">' +
		'</td>' +
		'<td><br><div id="custom-range-error">bad range input</div></td>' +
		'</tr></table><br>';
	re += '</td></tr>';

	re +=
		'<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'everything\');" id="everything"/></td><td>';
	re += '<h3>Import all the glyphs</h3>' + "Don't say we did't try to warn you.";
	re += '</td></tr>';

	re += '</table>';

	re +=
		'<br><br><button class="button__call-to-action" id="import-font-button" onclick="' +
		functionName +
		'(true);">Import Font</button>';

	return re;
}

function setFontImportRange() {
	const range = getCustomRange(false);
	if (range) {
		importRange = range;
		document.getElementById('custom-range-begin').value = range.begin;
		document.getElementById('custom-range-end').value = range.end;
	}
}

function checkFilter(id) {
	if (id === 'basic') {
		document.getElementById('basic').checked = true;
		document.getElementById('custom').checked = false;
		document.getElementById('everything').checked = false;
		importRange.begin = 0x0020;
		importRange.end = 0x024f;
	} else if (id === 'custom') {
		document.getElementById('basic').checked = false;
		document.getElementById('custom').checked = true;
		document.getElementById('everything').checked = false;
		setFontImportRange();
	} else if (id === 'everything') {
		document.getElementById('basic').checked = false;
		document.getElementById('custom').checked = false;
		document.getElementById('everything').checked = true;
		importRange.begin = 0x0000;
		importRange.end = 0xffff;
	}

	document.getElementById('import-font-button').disabled = false;
}
