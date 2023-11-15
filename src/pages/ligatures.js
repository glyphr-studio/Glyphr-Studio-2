import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import {
	charToHex,
	hexesToChars,
	normalizePrefixes,
	validateDecOrHexSuffix,
} from '../common/character_ids.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import {
	closeAllInfoBubbles,
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
} from '../controls/dialogs/dialogs.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { Glyph } from '../project_data/glyph.js';
import {
	makeNavButton,
	makeNavButtonContent,
	toggleNavDropdown,
} from '../project_editor/navigator.js';

/**
 * Page > Ligatures
 * Edit surface for Ligatures
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Ligatures() {
	// log(`makePage_Ligatures`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedLigatureID: ${editor.selectedLigatureID}`);
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
		// log(`makePage_Ligatures`, 'end');
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
		callback: () => {
			l2.innerHTML = makeNavButtonContent(editor.selectedLigature.name, 'EDITING');
		},
	});

	// Panel Selector
	let l3 = content.querySelector('#nav-button-l3');
	l3.addEventListener('click', function () {
		toggleNavDropdown(l3);
	});

	// Panel
	const panel = content.querySelector('#editor-page__panel');
	panel.appendChild(makePanel());
	panel.addEventListener('scroll', closeAllInfoBubbles);
	editor.subscribe({
		topic: ['whichLigatureIsSelected', 'whichShapeIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	if (editor.selectedTool === 'kern') editor.selectedTool = 'resize';
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
			content
				.querySelector('#editor-page__edit-canvas')
				.setAttribute('editing-item-id', newLigatureID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	editor.subscribe({
		topic: 'whichShapeIsSelected',
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

	// log(`makePage_Ligatures`, 'end');
	return content;
}

function makeLigaturesFirstRunContent() {
	let commonLigatureTable = '';
	ligaturesWithCodePoints.forEach((lig) => {
		commonLigatureTable += `
			<span class="first-run__example-wrapper">
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
				<div class="first-run__examples-table">
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
	{ chars: 'ae', display: 'ae', point: '0xE6' },
	{ chars: 'AE', display: 'AE', point: '0xC6' },
	{ chars: 'ff', display: 'f‌f', point: '0xFB00' },
	{ chars: 'fi', display: 'f‌i', point: '0xFB01' },
	{ chars: 'fl', display: 'f‌l', point: '0xFB02' },
	{ chars: 'oe', display: 'oe', point: '0x153' },
	{ chars: 'OE', display: 'OE', point: '0x152' },
	{ chars: 'st', display: 'st', point: '0xFB06' },
	{ chars: 'ffi', display: 'f‌f‌i', point: '0xFB03' },
	{ chars: 'ffl', display: 'f‌f‌l', point: '0xFB04' },
];

function addCommonLigaturesToProject() {
	ligaturesWithCodePoints.forEach((lig) => addLigature(lig.chars));
	getCurrentProjectEditor().navigate('Ligatures');
}

function addLigature(sequence) {
	// log(`addLigature`, 'start');

	if (sequence.length < 2) {
		// log(`addLigature`, 'end');
		return 'Ligature sequences need to be two or more characters.';
	}

	// Test to see if Unicode or Hex notation is being used
	let prefix = false;
	let workingSequence = normalizePrefixes(sequence);
	if (workingSequence.startsWith('U+')) {
		workingSequence = workingSequence.split('U+');
		workingSequence = workingSequence.slice(1);
		prefix = 'U+';
	} else if (workingSequence.startsWith('0x')) {
		workingSequence = workingSequence.split('0x');
		workingSequence = workingSequence.slice(1);
		prefix = '0x';
	}

	// log(`prefix: ${prefix}`);
	// log(`workingSequence: ${workingSequence}`);

	if (prefix && workingSequence.length > 1) {
		sequence = '';
		for (let i = 0; i < workingSequence.length; i++) {
			let id = workingSequence[i];
			// log(`id: ${id}`);
			let validatedSuffix = validateDecOrHexSuffix(id);
			// log(`validatedSuffix: ${validatedSuffix}`);

			if (validatedSuffix) sequence += hexesToChars(`0x${validatedSuffix}`);
			else {
				// log(`addLigature`, 'end');
				return `Invalid Hex or Unicode format: ${prefix}${id}.`;
			}
		}
	}

	// log(`sequence: ${sequence}`);

	// Finish up creating new ID and Ligature
	const newID = makeLigatureID(sequence);
	// log(`newID: ${newID}`);

	const project = getCurrentProject();
	if (project.ligatures[newID]) {
		// log(`addLigature`, 'end');
		return 'Ligature already exists';
	}

	project.addItemByType(
		new Glyph({
			id: newID,
			parent: project,
			objType: 'Ligature',
			gsub: sequence.split('').map((char) => char.codePointAt(0)),
		}),
		'Ligature',
		newID
	);

	// log(`addLigature`, 'end');
	return project.ligatures[newID];
}

export function makeLigatureID(sequence) {
	// log(`makeLigatureID`, 'start');
	// log(`sequence: ${sequence}`);

	let newID = 'liga';
	let chars = sequence.split('');
	chars.forEach((char) => {
		// If basic latin letter, use the letter
		let code = char.charCodeAt(0);
		if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
			newID += '-' + char;
		} else {
			newID += '-' + charToHex(char);
		}
	});
	// log(`newID: ${newID}`);

	// log(`makeLigatureID`, 'end');
	return newID;
}

export function showAddLigatureDialog() {
	const content = makeElement({
		innerHTML: `
			<h2>Add a new ligature</h2>
				Create a new ligature by specifying two or more individual glyphs that will make up the ligature (like <code>ff</code>).
				<br><br>
				Ligature glyphs can also be specified in Unicode format (like <code>U+66U+66</code>) or hexadecimal format (like <code>0x660x66</code>).
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
		// log(`showAddLigatureDialog button click handler`, 'start');
		const result = addLigature(newLigatureInput.value);
		// log(`result: ${result}`);

		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.selectedLigatureID = result.id;
			editor.navigate();
			closeEveryTypeOfDialog();
		}
		// log(`showAddLigatureDialog button click handler`, 'end');
	});

	showModalDialog(content, 500);
}
