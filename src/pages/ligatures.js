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
 * Edit surface for Ligatures, comprised of Panels of tools, and the Edit Canvas.
 * @returns {Element} - page content
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

	if (editor.showPageTransitions) content.classList.add('app__page-animation');

	// Page Selector
	/** @type {HTMLElement} */
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	/** @type {HTMLElement} */
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
			if (editor.selectedLigature) {
				l2.innerHTML = makeNavButtonContent(editor.selectedLigature?.name, 'EDITING');
			}
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
			editor.editCanvas.redraw();
		},
	});

	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'editCanvas.selectedPathPoint',
		callback: () => {
			editor.editCanvas.redraw();
		},
	});

	// log(`makePage_Ligatures`, 'end');
	return content;
}

/**
 * Makes the first run / get started content
 * @returns {Element}
 */
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

/**
 * Adds the list of common ligatures to the current project
 */
function addCommonLigaturesToProject() {
	ligaturesWithCodePoints.forEach((lig) => addLigature(lig.chars));
	const editor = getCurrentProjectEditor();
	editor.nav.page = 'Ligatures';
	editor.navigate();
	editor.history.addWholeProjectChangePostState();
}

/**
 * Given a text sequence of characters, creates a Ligature object,
 * and adds it to the current project.
 * @param {String} sequence - characters that make up this Ligature
 * @returns {String | Glyph}
 */
function addLigature(sequence) {
	// log(`addLigature`, 'start');

	if (sequence.length < 2) {
		// log(`addLigature`, 'end');
		return 'Ligature sequences need to be two or more characters.';
	}

	// Test to see if Unicode or Hex notation is being used
	let prefix = '';
	const workingSequence = normalizePrefixes(sequence);
	let workingArr = [];
	if (workingSequence.startsWith('U+')) {
		workingArr = workingSequence.split('U+');
		workingArr = workingArr.slice(1);
		prefix = 'U+';
	} else if (workingSequence.startsWith('0x')) {
		workingArr = workingSequence.split('0x');
		workingArr = workingArr.slice(1);
		prefix = '0x';
	}

	// log(`prefix: ${prefix}`);
	// log(`workingArr: ${workingArr}`);

	if (prefix && workingArr.length > 1) {
		sequence = '';
		for (let i = 0; i < workingArr.length; i++) {
			let id = workingArr[i];
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
		return 'Ligature already exists.';
	}

	if (newID === false) {
		return 'Characters could not be read for the ligature sequence.';
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

/**
 * Given an input sequence of ligature source characters, creates a
 * new unique ligature project id.
 * @param {String} sequence - characters that make up this ligature
 * @returns {String | false}
 */
export function makeLigatureID(sequence = '') {
	// log(`makeLigatureID`, 'start');
	// log(`sequence: ${sequence}`);
	if (sequence === '') return false;
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

/**
 * Makes the Add Ligature dialog and shows it.
 */
export function showAddLigatureDialog() {
	const content = makeElement({
		innerHTML: `
			<h2 id="ligatures__new-ligature-title">Create a new ligature</h2>
			Create a new ligature by specifying two or more individual characters.
			<br>
			<div class="panel__card no-card">
				<input type="checkbox" id="ligatures__multi-input-checkbox" style="margin: 0 0 15px 0;"/>
				<label for="ligatures__multi-input-checkbox" style="grid-column-start: 2;">Create many ligatures at once with a comma separated list.<br>Ligatures cannot contain commas or spaces if you use this option.</label>
			</div>
			<input id="ligatures__new-ligature-input" type="text" style="width: 90%;"
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
			/>
			<info-bubble style="display: inline-block; margin-left: 10px;">
				Ligature characters can be specified in three different formats:
				<ul>
					<li>By just typing characters: <code>ff</code></li>
					<li>Specifying Unicode code points: <code>U+66U+66</code></li>
					<li>Specifying Hexadecimal format: <code>0x660x66</code></li>
				</ul>
				<br><br>
				Hexadecimal, Unicode, and regular character formats cannot be mixed - choose one type!
				<br><br>
				<b>Warning!</b><br>
				Specifying ligature characters beyond the Basic Multilingual Plane
				(above Unicode <code>U+FFFF</code>) will cause errors!
			</info-bubble>
			<br><br>
			<fancy-button disabled id="ligatures__add-new-ligature-button">Create ligature</fancy-button>
		`,
	});

	/** @type {HTMLElement} */
	const submitButton = content.querySelector('#ligatures__add-new-ligature-button');
	/** @type {HTMLInputElement} */
	const newLigatureInput = content.querySelector('#ligatures__new-ligature-input');
	/** @type {HTMLInputElement} */
	const multiLigatureCheckbox = content.querySelector('#ligatures__multi-input-checkbox');
	/** @type {HTMLInputElement} */
	const title = content.querySelector('#ligatures__new-ligature-title');

	newLigatureInput.addEventListener('keyup', () => {
		if (newLigatureInput.value.length < 2) {
			submitButton.setAttribute('disabled', '');
		} else {
			submitButton.removeAttribute('disabled');
		}
	});

	multiLigatureCheckbox.addEventListener('change', () => {
		if (multiLigatureCheckbox.checked) {
			title.innerHTML = 'Create new ligatures';
			submitButton.innerHTML = 'Create ligatures';
		} else {
			title.innerHTML = 'Create a new ligature';
			submitButton.innerHTML = 'Create ligature';
		}
	});

	submitButton.addEventListener('click', () => {
		// log(`showAddLigatureDialog button click handler`, 'start');
		let result;
		let latestID;

		if (multiLigatureCheckbox.checked) {
			const sanitizedString = newLigatureInput.value.replaceAll(' ', '');
			const inputList = sanitizedString.split(',');
			inputList.forEach((input) => {
				let oneResult = addLigature(input);
				if (typeof oneResult === 'string') {
					if (typeof result !== 'string') result = 'One or more ligature could not be created:<br><br>';
					result = '' + result + oneResult + '<br><br>';
				} else {
					oneResult.hasChangedThisSession = false;
					oneResult.wasCreatedThisSession = true;
					latestID = oneResult.id;
				}
			});
		} else {
			result = addLigature(newLigatureInput.value);
			if (typeof result !== 'string') {
				result.hasChangedThisSession = false;
				result.wasCreatedThisSession = true;
				latestID = result.id;
			}
		}
		// log(`result: ${result}`);

		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.selectedLigatureID = latestID;
			editor.navigate();
			editor.history.addWholeProjectChangePostState();
			closeEveryTypeOfDialog();
		}
		// log(`showAddLigatureDialog button click handler`, 'end');
	});

	showModalDialog(content, 500);
}
