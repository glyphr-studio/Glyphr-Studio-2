import { getCurrentProject, getCurrentProjectEditor } from '../app/main';
import { decToHex, hexesToChars } from '../common/character_ids';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { closeEveryTypeOfDialog, showError, showModalDialog, showToast } from '../controls/dialogs/dialogs.js';
import { unicodeBlocksBMP } from '../lib/unicode/unicode_blocks_0_bmp.js';
import { unicodeBlocksSMP } from '../lib/unicode/unicode_blocks_1_smp.js';
import { unicodeBlocksSIP } from '../lib/unicode/unicode_blocks_2_sip.js';
import { unicodeBlocksTIP } from '../lib/unicode/unicode_blocks_3_tip.js';
import { getUnicodeName } from '../lib/unicode/unicode_names.js';
import { CharacterRange } from '../project_data/character_range.js';
import { makeOneSettingsRow } from './settings.js';

export function makeSettingsTabContentProject() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__project',
		innerHTML: `
			<h1>Project settings</h1>
			<p>These settings affect how this Glyphr Studio Project behaves.</p>
		`,
	});

	const settingsArea = makeElement({
		tag: 'div',
		className: 'settings-table',
	});

	addAsChildren(settingsArea, [
		makeOneSettingsRow('project', 'name'),
		makeOneSettingsRow('project', 'latestVersion'),
		makeOneSettingsRow('project', 'initialVersion'),
		makeOneSettingsRow('project', 'id'),
		textToNode('<br>'),
	]);

	const rangesArea = makeElement({
		tag: 'div',
		innerHTML: `
			<h2>Glyph ranges</h2>
			<p>
				Glyph ranges are based on the <a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">Unicode Standard</a>,
				which assigns a <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">hexadecimal number</a>
				to all possible glyphs in a font.
				<a href="https://en.wikipedia.org/wiki/Unicode_block" target="_blank">Wikipedia's Unicode Block page</a>
				is a good place to get familiar with all the different glyphs it's possible to have in a font.
				<br><br>
				The character ranges below will be visible on the Characters page, and they will be exported to fonts.
				<br><br>
				Removing a character range <strong>will not</strong> delete individual glyphs from the project.
			</p>
		`,
	});

	const addStandardRangeButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Add standard character ranges from Unicode',
		onClick: showUnicodeCharacterRangeDialog,
	});
	// Have to add attribute after the button is created
	addStandardRangeButton.setAttribute('secondary', '');

	const addCustomRangeButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Add a custom character range',
		onClick: showCustomCharacterRangeDialog,
	});
	// Have to add attribute after the button is created
	addCustomRangeButton.setAttribute('secondary', '');

	addAsChildren(rangesArea, [
		addStandardRangeButton,
		textToNode('<span>&emsp;</span>'),
		addCustomRangeButton,
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Current ranges</h3>'),
		textToNode('<div class="glyph-range-table__wrapper"></div>'),
	]);

	addAsChildren(rangesArea.querySelector('.glyph-range-table__wrapper'), makeCurrentRangesTable());

	addAsChildren(tabContent, [settingsArea, rangesArea]);

	return tabContent;
}

// --------------------------------------------------------------
// Current Ranges
// --------------------------------------------------------------

function makeCurrentRangesTable() {
	const rangeTable = makeElement({
		tag: 'div',
		className: 'glyph-range-table__list-area',
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
		textToNode('<span class="list__column-header">&nbsp;</span>'),
	]);

	const ranges = getCurrentProject().settings.project.characterRanges;

	if (ranges.length) {
		ranges.forEach((range, index) => {
			addAsChildren(rangeTable, [
				textToNode(`<span>${range.name}</span>`),
				textToNode(`<code>${decToHex(range.begin)}</code>`),
				textToNode(`<code>${decToHex(range.end)}</code>`),
				makeElement({
					tag: 'a',
					innerHTML: 'Edit',
					onClick: () => {
						showCustomCharacterRangeDialog(index);
					},
				}),
			]);
		});
	} else {
		addAsChildren(
			rangeTable,
			textToNode(`
			<em>No ranges are visible in this project.<br>Defaulting to the Basic Latin range.</em>
		`)
		);
	}

	return rangeTable;
}

function updateCurrentRangesTable() {
	const wrapper = document.querySelector('.glyph-range-table__wrapper');
	wrapper.innerHTML = '';
	addAsChildren(wrapper, makeCurrentRangesTable());
}

// --------------------------------------------------------------
// Edit Range or Add Custom Range
// --------------------------------------------------------------
function showCustomCharacterRangeDialog(rangeIndex) {
	rangeIndex = parseInt(rangeIndex);
	const isNew = isNaN(rangeIndex);
	const unicodeHelp = `
		Start and End inputs are Unicode or number IDs for the characters on each end of the range. Glyphr Studio accepts three flavors of this ID number:<br>
		<ul>
			<li><b>Unicode Number</b> - a base-16 number with a U+&nbsp;prefix. For example, <code>U+4E</code> corresponds to Capital&nbsp;N.</li>
			<li><b>Hexadecimal Number</b> - a base-16 number with a 0x&nbsp;prefix. For example, <code>0x4E</code> corresponds to Capital&nbsp;N.</li>
			<li><b>Decimal Number</b> - a base-10 number. For example, <code>78</code> corresponds to Capital&nbsp;N.</li>
		</ul>
	`;

	const content = makeElement({
		className: 'glyph-range-editor__wrapper',
		innerHTML: `
			<h1>${isNew ? 'Add' : 'Edit'} character range</h1>
		`,
	});

	const inputName = makeElement({
		tag: 'input',
		id: 'glyph-range-editor__name',
		attributes: { type: 'text' },
	});
	inputName.addEventListener('change', (event) => {
		event.target.value = sanitizeUnicodeInput(event.target.value);
	});

	const inputBegin = makeElement({
		tag: 'input',
		id: 'glyph-range-editor__begin',
		attributes: { type: 'text' },
	});
	inputBegin.addEventListener('change', (event) => {
		event.target.value = sanitizeUnicodeInput(event.target.value);
	});

	const inputEnd = makeElement({
		tag: 'input',
		id: 'glyph-range-editor__end',
		attributes: { type: 'text' },
	});
	inputEnd.addEventListener('change', (event) => {
		event.target.value = sanitizeUnicodeInput(event.target.value);
	});

	if (!isNew) {
		let range = getCurrentProject().settings.project.characterRanges[rangeIndex];
		inputName.value = range.name;
		inputBegin.value = '' + decToHex(range.begin);
		inputEnd.value = '' + decToHex(range.end);
	}

	const buttonBar = makeElement({ className: 'glyph-range-editor__footer' });

	const buttonSave = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Save',
		onClick: saveCharacterRange,
	});

	const buttonCancel = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		innerHTML: 'Cancel',
		onClick: closeEveryTypeOfDialog,
	});

	let buttonRemove;
	if (isNew) buttonRemove = textToNode('<span></span>');
	else
		buttonRemove = makeElement({
			tag: 'fancy-button',
			attributes: { secondary: '', danger: '' },
			innerHTML: 'Remove range',
			onClick: () => {
				removeCharacterRange(rangeIndex);
			},
		});

	addAsChildren(buttonBar, [buttonSave, buttonCancel, textToNode('<span></span>'), buttonRemove]);

	addAsChildren(content, [
		textToNode('<label>Range name</label>'),
		textToNode('<span></span>'),
		inputName,
		textToNode('<label>Start</label>'),
		makeElement({ tag: 'info-bubble', innerHTML: unicodeHelp }),
		inputBegin,
		textToNode('<label>End</label>'),
		makeElement({ tag: 'info-bubble', innerHTML: unicodeHelp }),
		inputEnd,
		buttonBar,
	]);

	showModalDialog(content, 500);
}

function saveCharacterRange(index = false) {
	let newName = document.getElementById('glyph-range-editor__name').value;
	let newBegin = parseInt(document.getElementById('glyph-range-editor__begin').value);
	let newEnd = parseInt(document.getElementById('glyph-range-editor__end').value);

	if (isNaN(newBegin)) {
		showError(`Start must be a number, a Unicode code point, or a Hexadecimal number.`);
		return;
	} else if (isNaN(newEnd)) {
		showError(`End must be a number, a Unicode code point, or a Hexadecimal number.`);
		return;
	} else if (newName === '') {
		showError(`Name must not be blank.`);
		return;
	}

	if (newBegin > newEnd) {
		let temp = newEnd;
		newEnd = newBegin;
		newBegin = temp;
	}

	let newRange = {
		begin: newBegin,
		end: newEnd,
		name: newName,
	};

	const ranges = getCurrentProject().settings.project.characterRanges;
	if (ranges[index]) {
		ranges[index] = newRange;
		ranges.sort((a, b) => parseInt(a.begin) - parseInt(b.begin));
		updateCurrentRangesTable();
		showToast(`Saved changes to ${newRange.name}.`);
	} else {
		addCharacterRangeToCurrentProject(newRange, () => {
			closeEveryTypeOfDialog();
			updateCurrentRangesTable();
		});
	}
}

function removeCharacterRange(index) {
	const editor = getCurrentProjectEditor();
	const ranges = editor.project.settings.project.characterRanges;

	if (ranges[index]) {
		if (areCharacterRangesEqual(ranges[index], editor.selectedCharacterRange)) {
			editor.selectedCharacterRange = false;
		}
		let oldRangeName = ranges[index].name;
		ranges.splice(index, 1);
		ranges.sort((a, b) => parseInt(a.begin) - parseInt(b.begin));
		updateCurrentRangesTable();
		closeEveryTypeOfDialog();
		showToast(`Removed ${oldRangeName}.`);
	}
}

function sanitizeUnicodeInput(inputString) {
	let sanString = inputString.replace(/U\+/gi, '0x');
	let sanInt = parseInt(sanString);

	if (!isNaN(sanInt)) return decToHex(Math.abs(sanInt));
	else return inputString;
}

// --------------------------------------------------------------
// Range Chooser
// --------------------------------------------------------------

function showUnicodeCharacterRangeDialog() {
	const content = makeElement({
		className: 'glyph-range-chooser__wrapper',
		innerHTML: `
			<h1>Add character ranges from Unicode</h1>
			<h3>Preview</h3>
			<h3>Blocks</h3>
			<div class="glyph-range-chooser__preview-area">
				<div class="glyph-range-chooser__preview">
					Select a character range from the right to preview it here.
				</div>
				<h4 id="glyph-range-chooser__preview-selected"></h4>
				<span id="glyph-range-chooser__add-button-wrapper">
					<fancy-button disabled id="glyph-range-chooser__add-button">Add range to project</fancy-button>
				</span>
			</div>
			<div class="glyph-range-chooser__list-area"></div>
		`,
	});

	const listArea = content.querySelector('.glyph-range-chooser__list-area');

	addAsChildren(listArea, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
	]);

	let rowWrapper;
	unicodeBlocksBMP.forEach(processOneBlock);
	unicodeBlocksSMP.forEach(processOneBlock);
	unicodeBlocksSIP.forEach(processOneBlock);
	unicodeBlocksTIP.forEach(processOneBlock);

	function processOneBlock(block) {
		if (!block.name.includes('Controls')) {
			rowWrapper = makeElement({
				className: 'list__row-wrapper',
				onClick: () => {
					previewCharacterRange(block);
				},
			});

			addAsChildren(rowWrapper, [
				textToNode(`<span>${block.name}</span>`),
				textToNode(`<code>${decToHex(block.begin)}</code>`),
				textToNode(`<code>${decToHex(block.end)}</code>`),
			]);

			addAsChildren(listArea, rowWrapper);
		}
	}

	showModalDialog(content);
}

function previewCharacterRange(range) {
	// log(`previewCharacterRange`, 'start');
	// log(range);
	document.querySelector('#glyph-range-chooser__preview-selected').innerHTML = range.name;

	const addButton = makeElement({
		tag: 'fancy-button',
		id: 'glyph-range-chooser__add-button',
		content: 'Add range to project',
	});
	addButton.addEventListener('click', () => {
		addCharacterRangeToCurrentProject(range, updateCurrentRangesTable);
	});

	const addButtonWrapper = document.querySelector('#glyph-range-chooser__add-button-wrapper');
	addButtonWrapper.innerHTML = '';
	addButtonWrapper.appendChild(addButton);

	const previewArea = document.querySelector('.glyph-range-chooser__preview');
	previewArea.innerHTML = '';

	let hexString;
	let name;
	for (let g = range.begin; g <= range.end; g++) {
		hexString = '' + decToHex(g);
		name = getUnicodeName(hexString);
		previewArea.appendChild(
			makeElement({
				className: 'glyph-range-chooser__preview-tile',
				title: `${hexString}\n${name}`,
				innerHTML: hexesToChars(hexString),
			})
		);
	}
	// log(`previewCharacterRange`, 'end');
}

export function addCharacterRangeToCurrentProject(range, successCallback, showNotification = true) {
	// log(`addCharacterRangeToCurrentProject`, 'start');
	// log(`\n⮟range⮟`);
	// log(range);
	// log(`showNotification: ${showNotification}`);
	if (isCharacterRangeUnique(range)) {
		let ranges = getCurrentProject().settings.project.characterRanges;
		ranges.push(new CharacterRange(range));
		ranges.sort((a, b) => parseInt(a.begin) - parseInt(b.begin));
		if (showNotification) showToast(`Added ${range.name} to your project.`);
		if (successCallback) successCallback();
	} else {
		if (showNotification) showToast(`Glyph range is already added to your project.`);
	}
	// log(`addCharacterRangeToCurrentProject`, 'end');
}

function isCharacterRangeUnique(range) {
	const ranges = getCurrentProject().settings.project.characterRanges;

	for (let r = 0; r < ranges.length; r++) {
		if (ranges[r].begin === range.begin && ranges[r].end === range.end) return false;
	}

	return true;
}

export function areCharacterRangesEqual(range1, range2) {
	// log(`areCharacterRangesEqual`, 'start');
	// log(`range1: ${json(range1)}`);
	// log(`range2: ${json(range2)}`);

	const result =
		parseInt(range1.begin) === parseInt(range2.begin) &&
		parseInt(range1.end) === parseInt(range2.end);
	// log(`result: ${result}`);

	// log(`areCharacterRangesEqual`, 'end');
	return result;
}