import { getCurrentProject, getCurrentProjectEditor } from '../app/main';
import { decToHex, hexesToChars } from '../common/character_ids';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { remove } from '../common/functions.js';
import {
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { unicodeBlocksBMP } from '../lib/unicode/unicode_blocks_0_bmp.js';
import { unicodeBlocksSMP } from '../lib/unicode/unicode_blocks_1_smp.js';
import { unicodeBlocksSIP } from '../lib/unicode/unicode_blocks_2_sip.js';
import { unicodeBlocksTIP } from '../lib/unicode/unicode_blocks_3_tip.js';
import { getUnicodeName } from '../lib/unicode/unicode_names.js';
import { makeDirectCheckbox } from '../panels/cards';
import { CharacterRange } from '../project_data/character_range.js';
import { resolveItemLinks } from '../project_editor/cross_item_actions';
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
			<h2>Character ranges</h2>
			<p>
				Character ranges are based on the <a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">Unicode Standard</a>,
				which assigns a <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">hexadecimal number</a>
				to all possible characters in a font.
				<a href="https://en.wikipedia.org/wiki/Unicode_block" target="_blank">Wikipedia's Unicode Block page</a>
				is a good place to get familiar with all the different characters it's possible to have in a font.
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
		onClick: () => showEditCharacterRangeDialog(),
	});
	// Have to add attribute after the button is created
	addCustomRangeButton.setAttribute('minimal', '');

	addAsChildren(rangesArea, [
		addStandardRangeButton,
		textToNode('<span>&emsp;</span>'),
		addCustomRangeButton,
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Enabled character ranges</h3>'),
		textToNode(`
			<p>
				These character ranges will be visible on the Characters page,
				and they will be exported to fonts.
				<br>
				Hiding a character range <strong>will not</strong>
				delete individual glyphs from the project.
			</p>
		`),
		textToNode('<div id="enabled-range-table__wrapper"></div>'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Hidden character ranges</h3>'),
		textToNode(`
			<p>
				These are ranges with characters that are saved in your project,
				but are not part of enabled character ranges.
				<br>
				These will be saved to your Glyphr Studio Project File, but
				will not be exported to fonts.
			</p>
		`),
		textToNode('<div id="hidden-range-table__wrapper"></div>'),
	]);

	sortCharacterRanges();

	addAsChildren(
		rangesArea.querySelector('#enabled-range-table__wrapper'),
		makeEnabledRangesTable()
	);
	addAsChildren(rangesArea.querySelector('#hidden-range-table__wrapper'), makeHiddenRangesTable());

	addAsChildren(tabContent, [settingsArea, rangesArea]);

	return tabContent;
}

function updateRangesTables() {
	const enabled = document.querySelector('#enabled-range-table__wrapper');
	const hidden = document.querySelector('#hidden-range-table__wrapper');
	enabled.innerHTML = '';
	hidden.innerHTML = '';
	addAsChildren(enabled, makeEnabledRangesTable());
	addAsChildren(hidden, makeHiddenRangesTable());
}

// --------------------------------------------------------------
// Current Ranges
// --------------------------------------------------------------

function makeEnabledRangesTable() {
	const rangeTable = makeElement({
		tag: 'div',
		className: 'range-table__list-area',
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
		textToNode('<span class="list__column-header">Characters</span>'),
		textToNode('<span class="list__column-header">Actions</span>'),
	]);

	const project = getCurrentProject();
	const projectRanges = project.settings.project.characterRanges;
	if (projectRanges.length === 0) {
		projectRanges.unshift(
			new CharacterRange({
				name: 'Basic Latin',
				begin: '0x20',
				end: '0x7F',
				enabled: true,
			})
		);
	}

	let displayRanges = projectRanges.filter((range) => range.enabled);

	// log(`\n⮟displayRanges⮟`);
	// log(displayRanges);

	displayRanges.forEach((range) => {
		let actions = makeElement();
		addAsChildren(actions, [
			makeElement({
				tag: 'a',
				innerHTML: 'Edit',
				onClick: () => {
					showEditCharacterRangeDialog(range);
				},
			}),
			textToNode('<span>&nbsp;&nbsp;</span>'),
		]);
		if (displayRanges.length <= 1) {
			actions.appendChild(
				textToNode(`
				<span disabled="disabled" title="At least one character range must be enabled">Hide</span>
			`)
			);
		} else {
			actions.appendChild(
				makeElement({
					tag: 'a',
					innerHTML: 'Hide',
					onClick: () => hideCharacterRange(range),
				})
			);
		}
		addAsChildren(rangeTable, [
			textToNode(`<span>${range.name}</span>`),
			textToNode(`<code>${decToHex(range.begin)}</code>`),
			textToNode(`<code>${decToHex(range.end)}</code>`),
			textToNode(`<span>${range.count}</span>`),
			actions,
		]);
	});

	return rangeTable;
}

// --------------------------------------------------------------
// Hidden Ranges
// --------------------------------------------------------------

function makeHiddenRangesTable() {
	// log(`makeHiddenRagesTable`, 'start');
	const rangeTable = makeElement({
		tag: 'div',
		className: 'range-table__list-area',
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
		textToNode('<span class="list__column-header">Characters</span>'),
		textToNode('<span class="list__column-header">Action</span>'),
	]);

	const project = getCurrentProject();
	let displayRanges = project.settings.project.characterRanges.filter((range) => !range.enabled);

	// log(`\n⮟displayRanges⮟`);
	// log(displayRanges);

	if (displayRanges.length > 0) {
		displayRanges.forEach((range) => {
			let actions = makeElement();
			addAsChildren(actions, [
				makeElement({
					tag: 'a',
					innerHTML: 'Show',
					onClick: () => enableCharacterRange(range),
				}),
				textToNode('<span>&nbsp;&nbsp;</span>'),
			]);

			if (range.count <= 0) {
				actions.appendChild(
					makeElement({
						tag: 'a',
						innerHTML: 'Remove',
						onClick: () => removeCharacterRange(range),
					})
				);
			} else {
				actions.appendChild(
					makeElement({
						tag: 'a',
						innerHTML: 'Delete',
						attributes: { danger: '' },
						onClick: () => showDeleteCharacterRangeDialog(range),
					})
				);
			}

			addAsChildren(rangeTable, [
				textToNode(`<span>${range.name}</span>`),
				textToNode(`<code>${decToHex(range.begin)}</code>`),
				textToNode(`<code>${decToHex(range.end)}</code></span>`),
				textToNode(`<span>${range.count}</span>`),
				actions,
			]);
		});
	} else {
		addAsChildren(
			rangeTable,
			textToNode(`
			<em class="span-all-columns" style="padding-top: 10px;">
				All characters in this project are members of enabled character ranges.
			</em>
		`)
		);
	}

	// log(`makeHiddenRagesTable`, 'end');
	return rangeTable;
}

// --------------------------------------------------------------
// Remove and delete ranges
// --------------------------------------------------------------

function removeCharacterRange(range, manageDialogs = true) {
	const editor = getCurrentProjectEditor();
	const fallback = areCharacterRangesEqual(range, editor.selectedCharacterRange);
	const projectRanges = editor.project.settings.project.characterRanges;
	let index = projectRanges.indexOf(range);
	if (index > -1) {
		let name = range.name;
		projectRanges.splice(index, 1);
		if (fallback) {
			editor.selectedCharacterRange = false;
			editor.selectFallbackItem('Characters');
		}
		let newRanges = enableRangesForOrphanedItems();
		updateRangesTables();
		if (manageDialogs) {
			closeEveryTypeOfDialog();
			let duration = 3000;
			let message = `Removed character range:<br>${name}<br>No glyph data was deleted.`;
			if (newRanges > 0) {
				message += `<br><br>
					Created ${newRanges} new hidden range${newRanges === 1 ? '' : 's'} to cover orphaned characters.
				`;
				duration = 6000;
			}
			showToast(message, duration);
		}
	} else {
		if (manageDialogs) {
			closeEveryTypeOfDialog();
			showToast(`Something went wrong with removing this character range.`);
		}
	}
}

function showDeleteCharacterRangeDialog(range) {
	const wrapper = makeElement({
		id: 'delete-character-range__wrapper',
		innerHTML: '<h1>Delete character range</h1>',
	});

	const deleteData = findCharactersToDelete(range);

	const rangeBlurb = `
	<p>
		Character ranges are a simple grouping mechanism with beginning and end points.
		They are useful to group characters with IDs that fall within that range.
		Character ranges can be created before actual character objects exist within that range.
		Alternately, character ranges can be created that overlap other character ranges.
		<br><br>
		When deleting a character range, you will have two options:
	</p>
	`;

	// Checkbox grid
	const checkboxes = makeElement({
		tag: 'div',
		className: 'character-range-delete__checkboxes',
	});

	addAsChildren(checkboxes, [
		makeDirectCheckbox(characterRangeDeleteOptions, 'removeRange', updateDeleteButtonText),
		textToNode('<label>Remove character range</label'),
		textToNode('<span></span>'),
		textToNode(
			'<p>Data for this character range (name, begin, end) will be removed from the project.</p>'
		),
		textToNode('<span></span>'),
		makeElement({
			tag: 'div',
			className: 'character-range-delete__preview-area',
			content: `
				&quot;${range.name}&quot;&emsp;
				<code>${decToHex(range.begin)}</code>
				through
				<code>${decToHex(range.end)}</code>`,
		}),
		textToNode('<span>&nbsp;</span>'),
		textToNode('<span>&nbsp;</span>'),
		makeDirectCheckbox(characterRangeDeleteOptions, 'deleteCharacters', updateDeleteButtonText),
		textToNode('<label>Delete characters</label>'),
		textToNode('<span></span>'),
		textToNode(
			'<p>Characters with IDs that fall within this range will have their project data deleted.</p>'
		),
		textToNode('<span></span>'),
		makeElement({
			tag: 'div',
			className: 'character-range-delete__preview-area',
			content: `${deleteData.map((id) => `<code>glyph-${id}</code>`).join('')}`,
		}),
		textToNode('<span>&nbsp;</span>'),
		textToNode('<span>&nbsp;</span>'),
	]);

	// Footer buttons
	const buttonBar = makeElement({ className: 'glyph-range-editor__footer' });

	const buttonSave = makeElement({
		tag: 'fancy-button',
		id: 'character-range-delete__button',
		innerHTML: 'Delete selected items',
		attributes: { danger: '' },
		onClick: () => deleteCharactersFromRange(range, deleteData),
	});

	const buttonCancel = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		innerHTML: 'Cancel',
		onClick: closeEveryTypeOfDialog,
	});

	addAsChildren(buttonBar, [
		buttonSave,
		buttonCancel,
		makeElement({
			className: 'delete-note',
			content: `<span class="info-icon">i</span>Don't worry, this action can be undone`,
		}),
		textToNode(`<span></span>`),
	]);

	// Put it all together
	addAsChildren(wrapper, [textToNode(rangeBlurb), checkboxes, buttonBar]);

	showModalDialog(wrapper);
}

const characterRangeDeleteOptions = {
	removeRange: true,
	deleteCharacters: false,
};

function updateDeleteButtonText() {
	const button = document.getElementById('character-range-delete__button');
	if (characterRangeDeleteOptions.removeRange || characterRangeDeleteOptions.deleteCharacters) {
		button.removeAttribute('disabled');
		button.addEventListener('click', deleteCharactersFromRange);
	} else {
		button.setAttribute('disabled', '');
		button.removeEventListener('click', deleteCharactersFromRange);
	}
}

function findCharactersToDelete(range) {
	const result = [];
	const project = getCurrentProject();

	const ids = range.getMemberIDs();
	range.count = 0;
	ids.forEach((id) => {
		if (project.glyphs[`glyph-${id}`]) result.push(id);
	});

	return result;
}

function deleteCharactersFromRange(range, deleteList = []) {
	// log(`deleteCharactersFromRange`, 'start');
	// log(`\n⮟deleteList⮟`);
	// log(deleteList);
	const removeInfo = characterRangeDeleteOptions.removeRange;
	const removeChars = characterRangeDeleteOptions.deleteCharacters;
	const editor = getCurrentProjectEditor();
	const name = range.name;

	if (removeChars && deleteList.length) {
		const message = `Deleted ${deleteList.length} characters and removed character range: ${name}`;
		editor.history.addWholeProjectChangePreState(message);
		deleteList.forEach((id) => {
			const item = editor.project.getItem(`glyph-${id}`);
			resolveItemLinks(item, true);
			delete editor.project.glyphs[`glyph-${id}`];
		});
		editor.history.addWholeProjectChangePostState();
		editor.project.updateAllCharacterRangeCounts();
		updateRangesTables();
		closeEveryTypeOfDialog();
		showToast(message);
	}

	if (removeInfo) {
		removeCharacterRange(range, removeInfo && !removeChars);
	}

	// log(`deleteCharactersFromRange`, 'end');
}

// --------------------------------------------------------------
// Edit Range or Add Custom Range
// --------------------------------------------------------------
function showEditCharacterRangeDialog(range = false) {
	// log(`showEditCharacterRangeDialog`, 'start');
	// log(`\n⮟range⮟`);
	// log(range);
	const unicodeHelp = `
		Start and End inputs are Unicode or number IDs for the characters on each end of the range. Glyphr Studio accepts three flavors of this ID number:<br>
		<ul>
			<li><b>Unicode Number</b> - a base-16 number with a U+&nbsp;prefix. For example, <code>U+4E</code> corresponds to Capital&nbsp;N.</li>
			<li><b>Hexadecimal Number</b> - a base-16 number with a 0x&nbsp;prefix. For example, <code>0x4E</code> corresponds to Capital&nbsp;N.</li>
			<li><b>Decimal Number</b> - a base-10 number. For example, <code>78</code> corresponds to Capital&nbsp;N.</li>
		</ul>
	`;

	const rangeNote = !range
		? '<span></span>'
		: `
	<p>
		Note: All characters must have at least one parent character range.
		If you edit a range to be smaller, a new hidden character range may be created to
		contain orphaned characters.
	</p>
	`;

	const content = makeElement({
		className: 'glyph-range-editor__wrapper',
		innerHTML: `
			<h1>${range ? 'Edit' : 'Add'} character range</h1>
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

	if (range) {
		inputName.value = range.name;
		inputBegin.value = '' + decToHex(range.begin);
		inputEnd.value = '' + decToHex(range.end);
	}

	const buttonBar = makeElement({ className: 'glyph-range-editor__footer' });

	const buttonSave = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Save',
		onClick: () => validateAndSaveCharacterRange(range),
	});

	const buttonCancel = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		innerHTML: 'Cancel',
		onClick: closeEveryTypeOfDialog,
	});

	addAsChildren(buttonBar, [buttonSave, buttonCancel, textToNode('<span></span><span></span>')]);

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
		textToNode(rangeNote),
		buttonBar,
	]);

	showModalDialog(content, 500);

	// log(`showEditCharacterRangeDialog`, 'end');
}

function validateAndSaveCharacterRange(range = false) {
	// log(`validateAndSaveCharacterRange`, 'start');
	// log(`\n⮟range⮟`);
	// log(range);
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

	const checkForOrphans = range && (newBegin > range.begin || newEnd < range.end);

	// Make the update
	if (range) {
		range.begin = newBegin;
		range.end = newEnd;
		range.name = newName;
		showToast(`Saved changes to character range:<br>${range.name}`);
	} else {
		addCharacterRangeToCurrentProject(
			{
				begin: newBegin,
				end: newEnd,
				name: newName,
			},
			false,
			false
		);
	}

	// If there are orphaned glyphs, we need to create hidden ranges for them
	let newRanges = 0;
	if (checkForOrphans) {
		newRanges = enableRangesForOrphanedItems();
	}

	// Finish up
	closeEveryTypeOfDialog();
	if (newRanges > 0) {
		showToast(`
		All characters must be in at least one character range.<br>
		Created ${newRanges} new hidden range${newRanges === 1 ? '' : 's'} to cover orphaned characters.
		`);
	} else {
		getCurrentProject().updateAllCharacterRangeCounts();
		sortCharacterRanges();
	}
	updateRangesTables();
	// log(`validateAndSaveCharacterRange`, 'end');
}

function enableRangesForOrphanedItems() {
	const project = getCurrentProject();
	let newRanges = 0;
	for (const glyphID in project.glyphs) {
		let hasParent = false;
		let hex = remove(glyphID, 'glyph-');
		// log(`hex: ${hex}`);
		for (const range of project.settings.project.characterRanges) {
			if (range.isWithinRange(hex)) {
				hasParent = true;
				break;
			}
		}
		if (!hasParent) {
			project.createRangeForHex(hex, true);
			newRanges++;
		}
	}
	if (newRanges > 0) {
		getCurrentProject().updateAllCharacterRangeCounts();
		sortCharacterRanges();
	}
	return newRanges;
}

function hideCharacterRange(range) {
	const editor = getCurrentProjectEditor();
	if (areCharacterRangesEqual(range, editor.selectedCharacterRange)) {
		editor.selectedCharacterRange = false;
	}
	range.enabled = false;

	if (range.getMemberIDs().indexOf(editor.selectedGlyphID.substring(6)) > -1) {
		editor.selectFallbackItem('Characters');
	}

	updateRangesTables();
	closeEveryTypeOfDialog();
	showToast(`Hid character range:<br>${range.name}`);
}

function enableCharacterRange(range) {
	range.enabled = true;
	updateRangesTables();
	closeEveryTypeOfDialog();
	showToast(`Enabled character range:<br>${range.name}`);
}

function sanitizeUnicodeInput(inputString) {
	let sanString = inputString.replace(/U\+/gi, '0x');
	let sanInt = parseInt(sanString);

	if (!isNaN(sanInt)) return decToHex(Math.abs(sanInt));
	else return inputString;
}

function sortCharacterRanges() {
	const ranges = getCurrentProject().settings.project.characterRanges;
	ranges.sort((a, b) => parseInt(a.begin) - parseInt(b.begin));
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
		addCharacterRangeToCurrentProject(range, updateRangesTables);
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
	if (isCharacterRangeNotEnabled(range)) {
		const project = getCurrentProject();
		let ranges = project.settings.project.characterRanges;
		const newRange = new CharacterRange(range);
		ranges.push(newRange);

		if (newRange.name.includes('Controls')) project.settings.app.showNonCharPoints = true;
		if (showNotification) showToast(`Enabled character range:<br>${range.name}`);
		project.updateCharacterRangeCount(newRange);
		sortCharacterRanges();
		updateRangesTables();
		if (successCallback) successCallback();
	} else {
		if (showNotification) showToast(`Glyph range is already enabled for your project.`);
	}
	// log(`addCharacterRangeToCurrentProject`, 'end');
}

function isCharacterRangeNotEnabled(range) {
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
