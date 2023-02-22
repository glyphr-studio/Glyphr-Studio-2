import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { lookUpGlyphName } from '../lib/unicode_names.js';
import { hexToChars } from '../common/unicode.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { Glyph } from '../project_data/glyph.js';
import { closeAllDialogs, showError, showModalDialog } from '../controls/dialogs/dialogs.js';

/**
 * Page > Ligatures
 * Edit surface for Ligatures
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Ligatures() {
	log(`makePage_Ligatures`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	log(`editor.selectedLigatureID: ${editor.selectedLigatureID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const selectedLigatureID = editor.selectedLigatureID;

	const editingContent = `
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`;

	const firstRunContent = `<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>`;

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Ligatures' })}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${selectedLigatureID ? editingContent : firstRunContent}
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const navArea = content.querySelector('.editor-page__nav-area');
	const canvasArea = content.querySelector('.editor-page__edit-canvas-wrapper');

	if (!selectedLigatureID) {
		// Early return for project with zero ligatures
		addAsChildren(canvasArea, makeLigaturesFirstRunContent());
		navArea.style.display = 'block';
		l1.style.width = '100%';
		l1.style.borderRadius = '4px';
		log(`makePage_Ligatures`, 'end');
		return content;
	}

	const selectedLigature = editor.selectedLigature;
	const l2Button = makeNavButton({
		level: 'l2',
		superTitle: 'EDITING',
		title: selectedLigature.name,
	});
	const l3Button = makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel });

	navArea.appendChild(textToNode(l2Button));
	navArea.appendChild(textToNode(l3Button));

	const editCanvas = makeElement({
		tag: 'edit-canvas',
		id: 'editor-page__edit-canvas',
		attributes: { 'editing-item-id': editor.selectedLigatureID },
	});

	canvasArea.appendChild(editCanvas);

	// Ligature Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichLigatureIsSelected',
		subscriberID: 'nav.ligatureChooserButton',
		callback: (newLigatureID) => {
			l2.innerHTML = makeNavButtonContent(lookUpGlyphName(newLigatureID, true), 'EDITING');
		},
	});

	// Panel Selector
	let l3 = content.querySelector('#nav-button-l3');
	l3.addEventListener('click', function () {
		toggleNavDropdown(l3);
	});

	// Panel
	content.querySelector('#editor-page__panel').appendChild(makePanel());
	editor.subscribe({
		topic: ['whichLigatureIsSelected', 'whichPathIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			let panelContent = content.querySelector('#editor-page__panel');
			panelContent.innerHTML = '';
			// panelContent.appendChild(makePanel());
			refreshPanel();
		},
	});

	// Tools
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeEditToolsButtons();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichLigatureIsSelected',
		subscriberID: 'editCanvas.selectedLigature',
		callback: (newLigatureID) => {
			// log(`Main Canvas subscriber callback`, 'start');
			removeStopCreatingNewPathButton();
			// log(`new id ${newLigatureID} on the main canvas`);
			content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', newLigatureID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	editor.subscribe({
		topic: 'whichPathIsSelected',
		subscriberID: 'editCanvas.selectedPath',
		callback: () => {
			removeStopCreatingNewPathButton();
			editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPath' });
		},
	});

	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'editCanvas.selectedPathPoint',
		callback: () => {
			editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPathPoint' });
		},
	});

	log(`makePage_Ligatures`, 'end');
	return content;
}

function makeLigaturesFirstRunContent() {
	let commonLigatureTable = '';
	ligaturesWithCodePoints.forEach((lig) => {
		commonLigatureTable += `
			<span class="ligature-display-wrapper">
					<pre>${lig.display}</pre>
					<span> ➞ </span>
					<pre>&#${parseInt(lig.point)};</pre>
			</span>
		`;
	});

	const content = makeElement({
		className: 'editor-page__first-run',
		innerHTML: `
			<h1>There are no ligatures in your project</h1>
			<p>
				Ligatures are a feature of fonts where a specified sequence of characters
				is recognized and replaced with a single new character that you design.
				In Latin, there are some common ligatures:
				<div class="ligatures-page__common-ligature-table">
				${commonLigatureTable}
				</div>
			</p>
			<p>
				These are just some examples. <strong>Ligatures can have any sequence of two
				or more characters.</strong> In a text editing program that has ligatures enabled,
				this sequence of characters is recognized, then replaced with the custom ligature
				character that you design.
			</p>
		`,
	});

	const addOneLigatureButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Create a new ligature',
		onClick: showAddLigatureDialog,
	});

	const addCommonLigaturesButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Add the common Latin ligatures to your project',
		attributes: { secondary: '' },
		onClick: addCommonLigaturesToProject,
	});

	content.appendChild(addOneLigatureButton);
	content.appendChild(addCommonLigaturesButton);
	return content;
}

// The 'display' property intentionally have zero-width
// invisible characters between the 'chars' to prevent
// triggering a ligature
const ligaturesWithCodePoints = [
	{ chars: 'ae', display: 'ae', point: '0x00E6' },
	{ chars: 'AE', display: 'AE', point: '0x00C6' },
	{ chars: 'ff', display: 'f‌f', point: '0xFB00' },
	{ chars: 'fi', display: 'f‌i', point: '0xFB01' },
	{ chars: 'fl', display: 'f‌l', point: '0xFB02' },
	{ chars: 'oe', display: 'oe', point: '0x0153' },
	{ chars: 'OE', display: 'OE', point: '0x0152' },
	{ chars: 'st', display: 'st', point: '0xFB06' },
	{ chars: 'ffi', display: 'f‌f‌i', point: '0xFB03' },
	{ chars: 'ffl', display: 'f‌f‌l', point: '0xFB04' },
];

function addCommonLigaturesToProject() {
	ligaturesWithCodePoints.forEach((lig) => addLigature(lig.chars));
	getCurrentProjectEditor().navigate('Ligatures');
}

function addLigature(sequence) {
	if (sequence.length < 2) {
		return 'Ligature sequences need to be two or more characters.';
	}

	const newID = makeLigatureID(sequence);
	const project = getCurrentProject();
	if (project.ligatures[newID]) {
		return 'Ligature already exists';
	}

	project.ligatures[newID] = new Glyph({
		name: `Ligature ${sequence}`,
		id: newID,
		ligature: sequence.split('').map((char) => char.codePointAt(0)),
	});

	return project.ligatures[newID];
}

function makeLigatureID(sequence) {
	return sequence.split('').reduce((acc, value) => `${acc}-${value}`, 'liga');
}

export function makeCard_ligatureActions() {
	let actions = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Ligature actions</h3>',
	});

	const addButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Create new ligature',
	});

	const deleteButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Delete this ligature',
		attributes: { danger: '' },
	});

	addAsChildren(actions, [addButton, deleteButton]);
	return actions;
}

export function showAddLigatureDialog() {
	const content = makeElement({
		innerHTML: `
			<h2>Add a new ligature</h2>
				Create a new ligature by specifying two or more individual glyphs that will make up the ligature (like <code>ff</code>).
				<br><br>
				Ligature glyphs can also be specified in Unicode format (like <code>U+0066U+0066</code>) or hexadecimal format (like <code>0x00660x0066</code>).
				<br><br>
				Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!
				<br><br>

				<h3>Ligature Glyphs</h3>
				<input id="ligatures__new-ligature-input" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<fancy-button disabled id="ligatures__add-new-ligature-button">Add new ligature to project</fancy-button>
		`,
	});

	const submitButton = content.querySelector('#ligatures__add-new-ligature-button');
	const newLigatureInput = content.querySelector('#ligatures__new-ligature-input');

	newLigatureInput.addEventListener('keyup', () => {
		if (newLigatureInput.value.length < 2) {
			submitButton.setAttribute('disabled', '');
		} else {
			submitButton.removeAttribute('disabled');
		}
	});

	submitButton.addEventListener('click', () => {
		const result = addLigature(newLigatureInput.value);
		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.selectedLigatureID = result.id;
			editor.nav.navigate();
			closeAllDialogs();
		}
	});

	showModalDialog(content, 500);
}
/*
function showNewLigatureDialog() {
	var con = '<h1>New Ligature</h1>';
	con += '<div style="width:500px;">';
	con +=
		'Create a new ligature by specifying two or more individual glyphs that will make up the ligature (like ff).<br><br>';
	con +=
		'Ligature glyphs can also be specified in Unicode format (like <pre>U+0066U+0066</pre>) or hexadecimal format (like <pre>0x00660x0066</pre>). ';
	con +=
		'Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!<br><br>';
	con += '<h3>Ligature Glyphs</h3>';
	con += '<input type="text" id="newligatureinput" style="font-size:24px; padding:8px;"/><br>';
	con += makeErrorMessageBox();
	con += '<br>';
	con += '<button class="buttonsel" onclick="createNewLigature();">create new ligature</button>';
	con += '</div>';

	openDialog(con);
}

function createNewLigature() {
	// debug('\n createNewLigature - START');
	var inlig = document.getElementById('newligatureinput').value;
	// debug('\t retrieved ' + lid);
	var ligID = inlig.replace(/\s/gi, '');
	ligID = parseUnicodeInput(ligID);
	// debug('\t parsed ' + ligID);

	// Do checks
	if (!ligID || ligID.length < 2) {
		showErrorMessageBox('Ligatures must be at least two glyphs.');
		return;
	}

	ligID = ligID.join('');

	if (_GP.ligatures[ligID]) {
		showErrorMessageBox('Ligature already exists.');
		return;
	}

	// Everything checks out
	_GP.ligatures[ligID] = new Glyph({ glyphhex: ligID, name: 'Ligature ' + inlig });
	sortLigatures();
	_UI.selectedligature = ligID;
	history_put('Created ' + getSelectedWorkItemName());
	navigate();
	closeDialog();
}



function doesLigatureHaveCodePoint(id) {
	// debug('\n doesLigatureHaveCodePoint - START');
	// debug('\t passed ' + id);

	if (id.indexOf('0x', 2) === -1) return false;

	var ch = hexToChars(id);

	for (var i = 0; i < ligaturesWithCodePoints.length; i++) {
		if (ligaturesWithCodePoints[i].chars === ch) return ligaturesWithCodePoints[i];
	}

	return false;
}

function addCommonLigatures() {
	var lig, id;
	for (var i = 0; i < ligaturesWithCodePoints.length; i++) {
		lig = ligaturesWithCodePoints[i];
		id = parseUnicodeInput(lig.chars).join('');
		if (!_GP.ligatures[id]) _GP.ligatures[id] = new Glyph({ glyphhex: id });
	}

	_UI.selectedglyph = getFirstID(_GP.ligatures);
	redraw({ calledby: 'addCommonLigatures' });
}

function deleteLigatureConfirm() {
	var content = '<h1>Delete Ligature</h1>';
	content +=
		'<b style="color:' + _UI.colors.error.medium + ';">This action cannot be undone!</b><br>';
	content += 'Are you sure you want to delete this Ligature?<br><br>';

	var uia = getSelectedWorkItem().usedin;
	if (uia.length > 0) {
		content += 'This Ligature is linked to the following Glyphs as a Component Instance:<br><ul>';

		for (var ssu = 0; ssu < uia.length; ssu++) {
			content += '<li>' + getGlyphName(uia[ssu]).replace(/LATIN /gi, '') + '</li>';
		}

		content += '</ul>';
		// content += '<br>The Component Instances in these Glyphs will also be deleted.<br><br>';
	}

	content +=
		'<br><br><button class="buttonsel" onclick="deleteLigature();">delete this ligature</button> &nbsp; <button onclick="closeDialog();">cancel</button>';

	openDialog(content);
}

function deleteLigature() {
	// debug('\n deleteLigature - START');
	// debug('\t deleting ' + _UI.selectedligature);

	closeDialog();

	if (_GP.ligatures[_UI.selectedligature]) {
		// Delete upstream Component Instances
		_GP.ligatures[_UI.selectedligature].deleteLinks(_UI.selectedligature);

		// Delete it
		delete _GP.ligatures[_UI.selectedligature];
		_UI.selectedligature = getFirstID(_GP.ligatures);
	}

	// debug('\t after delete ' + _GP.ligatures);
	redraw({ calledby: 'deleteLigature' });

	// debug('deleteLigature - END\n');
}

function sortLigatures() {
	var temp;
	var sortarr = [];

	for (var n in _GP.ligatures) {
		if (_GP.ligatures[n]) {
			temp = _GP.ligatures[n];
			sortarr.push({ id: n, ligature: temp });
		}
	}

	sortarr.sort(function (a, b) {
		if (a.id && b.id) {
			if (a.id.length === b.id.length) {
				if (a.id > b.id) return 1;
				if (a.id < b.id) return -1;
			} else {
				return b.id.length - a.id.length;
			}
		} else return 0;
	});

	_GP.ligatures = {};

	for (var s = 0; s < sortarr.length; s++) {
		temp = sortarr[s];
		_GP.ligatures[temp.id] = temp.ligature;
	}

	return sortarr;
}
*/
