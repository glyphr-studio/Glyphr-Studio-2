import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeKernToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { Glyph } from '../project_data/glyph.js';
import {
	closeAllInfoBubbles,
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
} from '../controls/dialogs/dialogs.js';
import { charToHex } from '../common/character_ids.js';
import { normalizePrefixes } from '../common/character_ids.js';
import { validateDecOrHexSuffix } from '../common/character_ids.js';
import { hexesToChars } from '../common/character_ids.js';

/**
 * Page > Kerning
 * Edit surface for Kerning
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Kerning() {
	// log(`makePage_Kerning`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedKernID: ${editor.selectedKernID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const selectedKernID = editor.selectedKernID;

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
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Kerning' })}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${selectedKernID ? editingContent : firstRunContent}
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

	if (!selectedKernID) {
		// Early return for project with zero kerns
		addAsChildren(canvasArea, makeKerningFirstRunContent());
		navArea.style.display = 'block';
		l1.style.width = '100%';
		l1.style.borderRadius = '4px';
		// log(`makePage_Kerning`, 'end');
		return content;
	}

	const selectedKern = editor.selectedKern;
	const l2Button = makeNavButton({
		level: 'l2',
		superTitle: 'EDITING',
		title: selectedKern.name,
	});
	const l3Button = makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel });

	navArea.appendChild(textToNode(l2Button));
	navArea.appendChild(textToNode(l3Button));

	const editCanvas = makeElement({
		tag: 'edit-canvas',
		id: 'editor-page__edit-canvas',
		attributes: { 'editing-item-id': editor.selectedKernID },
	});

	canvasArea.appendChild(editCanvas);

	// Kern Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichKernIsSelected',
		subscriberID: 'nav.ligatureChooserButton',
		callback: () => {
			l2.innerHTML = makeNavButtonContent(editor.selectedKern.name, 'EDITING');
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
		topic: ['whichKernIsSelected', 'whichPathIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeKernToolsButtons();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichKernIsSelected',
		subscriberID: 'editCanvas.selectedKern',
		callback: (newKernID) => {
			// log(`new id ${newKernID} on the main canvas`);
			content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', newKernID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	// log(`makePage_Kerning`, 'end');
	return content;
}

function makeKerningFirstRunContent() {
	const content = makeElement({
		className: 'editor-page__first-run',
		innerHTML: `
			<h1>There are no kern pairs in your project</h1>
			<p>
				Kerning is an advanced feature of fonts that recognizes a pair of characters, then
				adjusts the spacing between them to some custom value. The default spacing between
				characters is zero - which is to say, the white space (side bearings) within each
				character are the only space shown.
			</p>
			<p>
				Some letter combinations, like <code>VA</code>
				as an example, if the default side bearing spacing
				is used, the letters visually look very far apart. Kerning can help the visual flow of
				character pairs look more well considered. Many character pairs may need either negative
				or positive kern values to make them "look right".
			</p>
			<h2>Class-based kerning</h2>
			<p>
				Font files encode kerning values as three pieces of information: a left character, a right
				character, and a horizontal adjustment value. Fonts with many characters can end up having
				a huge amount of kern pairs. Glyphr Studio uses a system called Class-based Kerning, where
				groups of characters with similar edges (like
					<code>V</code><code>v</code><code>W</code><code>w</code>
					)
				can be treated as a single left-hand group, and a group of right-hand characters (for example,
				<code>A</code><code>/</code>) can be treated as single group - which can be given a single value.
				When a font is exported, the permutations are saved as individual kern pairs. But, while
				editing, grouping common characters often simplifies the overall kerning process.
			</p>
		`,
	});

	const addOneKernButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Create a new kern pair',
		onClick: showAddKernDialog,
	});

	content.appendChild(addOneKernButton);
	return content;
}

function addKern(sequence) {
	// log(`addKern`, 'start');

	if (sequence.length < 2) {
		// log(`addKern`, 'end');
		return 'Kern sequences need to be two or more characters.';
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
				// log(`addKern`, 'end');
				return `Invalid Hex or Unicode format: ${prefix}${id}.`;
			}
		}
	}

	// log(`sequence: ${sequence}`);

	// Finish up creating new ID and Kern
	const newID = makeKernID(sequence);
	// log(`newID: ${newID}`);

	const project = getCurrentProject();
	if (project.ligatures[newID]) {
		// log(`addKern`, 'end');
		return 'Kern already exists';
	}

	project.addNewItem(
		new Glyph({
			id: newID,
			parent: project,
			objType: 'Kern',
			gsub: sequence.split('').map((char) => char.codePointAt(0)),
		}),
		'Kern',
		newID
	);

	// log(`addKern`, 'end');
	return project.ligatures[newID];
}

export function makeKernID(sequence) {
	// log(`makeKernID`, 'start');
	// log(`sequence: ${sequence}`);

	let newID = 'kern';
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

	// log(`makeKernID`, 'end');
	return newID;
}

export function showAddKernDialog() {
	const content = makeElement({
		innerHTML: `
			<h2>Add a new kern group</h2>
				Create a new ligature by specifying two or more individual glyphs that will make up the ligature (like <code>ff</code>).
				<br><br>
				Kern glyphs can also be specified in Unicode format (like <code>U+0066U+0066</code>) or hexadecimal format (like <code>0x00660x0066</code>).
				<br><br>
				Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!
				<br><br>

				<h3>Kern Glyphs</h3>
				<input id="ligatures__new-ligature-input" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<fancy-button disabled id="ligatures__add-new-ligature-button">Add new ligature to project</fancy-button>
		`,
	});

	const submitButton = content.querySelector('#ligatures__add-new-ligature-button');
	const newKernInput = content.querySelector('#ligatures__new-ligature-input');

	newKernInput.addEventListener('keyup', () => {
		if (newKernInput.value.length < 2) {
			submitButton.setAttribute('disabled', '');
		} else {
			submitButton.removeAttribute('disabled');
		}
	});

	submitButton.addEventListener('click', () => {
		// log(`showAddKernDialog button click handler`, 'start');
		const result = addKern(newKernInput.value);
		// log(`result: ${result}`);

		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.selectedKernID = result.id;
			editor.navigate();
			closeEveryTypeOfDialog();
		}
		// log(`showAddKernDialog button click handler`, 'end');
	});

	showModalDialog(content, 500);
}
