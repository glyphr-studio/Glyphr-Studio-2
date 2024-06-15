import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { charToHex, charsToHexArray, hexesToChars } from '../common/character_ids.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import {
	closeAllInfoBubbles,
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
} from '../controls/dialogs/dialogs.js';
import { makeKernToolButton, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { getUnicodeName } from '../lib/unicode/unicode_names.js';
import { makeOneKernGroupRow } from '../panels/item_chooser.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { KernGroup } from '../project_data/kern_group.js';
import {
	makeNavButton,
	makeNavButtonContent,
	toggleNavDropdown,
} from '../project_editor/navigator.js';

/**
 * Page > Kerning
 * Edit surface for Kerning, comprised of Panels of tools, and the Edit Canvas.
 * @returns {Element} - page content
 */
export function makePage_Kerning() {
	// log(`makePage_Kerning`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedKernGroupID: ${editor.selectedKernGroupID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const selectedKernGroupID = editor.selectedKernGroupID;

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
			${selectedKernGroupID ? editingContent : firstRunContent}
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

	if (!selectedKernGroupID) {
		// Early return for project with zero Kern Groups
		addAsChildren(canvasArea, makeKerningFirstRunContent());
		navArea.style.display = 'block';
		l1.style.width = '100%';
		l1.style.borderRadius = '4px';
		// log(`makePage_Kerning`, 'end');
		return content;
	}

	const selectedKernGroup = editor.selectedKernGroup;
	const l2Button = makeNavButton({
		level: 'l2',
		superTitle: 'EDITING',
		title: selectedKernGroup.name,
	});
	const l3Button = makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel });

	navArea.appendChild(textToNode(l2Button));
	navArea.appendChild(textToNode(l3Button));

	const editCanvas = makeElement({
		tag: 'edit-canvas',
		id: 'editor-page__edit-canvas',
		attributes: { 'editing-item-id': editor.selectedKernGroupID },
	});

	canvasArea.appendChild(editCanvas);

	// Kern Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichKernGroupIsSelected',
		subscriberID: 'nav.kernChooserButton',
		callback: () => {
			if (editor.selectedKernGroup) {
				l2.innerHTML = makeNavButtonContent(editor.selectedKernGroup?.name, 'EDITING');
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
		topic: ['whichKernGroupIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	editor.selectedTool = 'kern';
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeKernToolButton();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichKernGroupIsSelected',
		subscriberID: 'editCanvas.selectedKernGroup',
		callback: (newKernID) => {
			// log(`Main Canvas subscriber callback`, 'start');
			// log(`new id ${newKernID} on the main canvas`);
			content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', newKernID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	// log(`makePage_Kerning`, 'end');
	return content;
}

/**
 * Makes the first run / get started content
 * @returns {Element}
 */
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
		innerHTML: 'Create a new kern group',
		onClick: () => showAddEditKernGroupDialog(false),
	});

	content.appendChild(addOneKernButton);
	return content;
}

/**
 * New kern group dialog handler
 * @param {Array} leftGroup - left kern members
 * @param {Array} rightGroup - right kern members
 * @param {Number} value - kern value
 * @returns {KernGroup}
 */
function addKernGroup(leftGroup, rightGroup, value) {
	// log(`addKernGroup`, 'start');
	// log(leftGroup);
	// log(rightGroup);
	// log(value);
	// Finish up creating new ID and Kern
	const newID = makeKernGroupID();
	// log(`newID: ${newID}`);

	const project = getCurrentProject();

	project.addItemByType(
		new KernGroup({
			leftGroup: leftGroup,
			rightGroup: rightGroup,
			value: value,
		}),
		'KernGroup',
		newID
	);

	// log(`addKernGroup`, 'end');
	return project.kerning[newID];
}

/**
 * Makes a new Kern Group ID, without colliding with old ones.
 * @param {Object} kernGroups - current kern groups
 * @returns {String}
 */
export function makeKernGroupID(kernGroups = getCurrentProject().kerning) {
	// log(`makeKernGroupID`, 'start');
	let counter = countItems(kernGroups);
	while (kernGroups[`kern-${counter}`]) counter++;
	const newID = `kern-${counter}`;
	// log(`newID: ${newID}`);
	// log(`makeKernGroupID`, 'end');
	return newID;
}

/**
 * Shows an edit dialog for a given Kern Group - or, if
 * one is not provided, used as a 'create new' Kern Group dialog.
 * @param {KernGroup | false =} kernGroup
 */
export function showAddEditKernGroupDialog(kernGroup) {
	// log(`showAddEditKernGroupDialog`, 'start');
	// log(`kernGroup`);
	// log(kernGroup);

	const content = makeElement({
		innerHTML: `
		<h2>${kernGroup ? 'Edit this' : 'Create a new'} kern group</h2>
		Specify which characters should be in the left-side group,
		the right-side group, then what distance in <code>Em</code>
		units should be used for the kern value.
		<br><br>

		<h3>Left group</h3>
		<input id="kerning__add-new-kern-group__left-group" type="text"
		value="${kernGroup ? kernGroup.leftGroupAsString : ''}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Right group</h3>
		<input id="kerning__add-new-kern-group__right-group" type="text"
		value="${kernGroup ? kernGroup.rightGroupAsString : ''}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Value</h3>
		<input id="kerning__add-new-kern-group__value" type="text"
			value="${kernGroup ? kernGroup.value : ''}"
			autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<fancy-button disabled id="kerning__add-new-kern-group__submit-button">
			${kernGroup ? 'Save changes' : 'Add new kern group'}
		</fancy-button>
		`,
	});

	const submitButton = content.querySelector('#kerning__add-new-kern-group__submit-button');
	/** @type {HTMLInputElement} */
	const leftGroupInput = content.querySelector('#kerning__add-new-kern-group__left-group');
	/** @type {HTMLInputElement} */
	const rightGroupInput = content.querySelector('#kerning__add-new-kern-group__right-group');
	/** @type {HTMLInputElement} */
	const valueInput = content.querySelector('#kerning__add-new-kern-group__value');

	leftGroupInput.addEventListener('change', inputChange);
	rightGroupInput.addEventListener('change', inputChange);
	valueInput.addEventListener('change', inputChange);
	leftGroupInput.addEventListener('keyup', inputChange);
	rightGroupInput.addEventListener('keyup', inputChange);
	valueInput.addEventListener('keyup', inputChange);

	if (kernGroup) {
		submitButton.removeAttribute('disabled');
		submitButton.addEventListener('click', addEditDialogSubmit);
	}

	function inputChange() {
		if (leftGroupInput.value !== '' && rightGroupInput.value !== '' && valueInput.value) {
			submitButton.removeAttribute('disabled');
			submitButton.addEventListener('click', addEditDialogSubmit);
		} else {
			submitButton.setAttribute('disabled', '');
			submitButton.removeEventListener('click', addEditDialogSubmit);
		}
	}

	function addEditDialogSubmit() {
		// log(`showAddEditKernGroupDialog button click handler`, 'start');
		const editor = getCurrentProjectEditor();
		let leftNew = charsToHexArray(leftGroupInput.value);
		// log(`leftNew: ${leftNew}`);
		let rightNew = charsToHexArray(rightGroupInput.value);
		// log(`rightNew: ${rightNew}`);
		let valueNew = parseInt(valueInput.value);
		// log(`valueNew: ${valueNew}`);

		if (kernGroup) {
			// log(kernGroup.print());
			kernGroup.leftGroup = leftNew;
			kernGroup.rightGroup = rightNew;
			kernGroup.value = valueNew;
			// log(kernGroup.print());
			editor.history.addState('Edited kern group: ' + editor.selectedKernGroupID);
			editor.publish('currentKernGroup', editor.selectedKernGroup);
			editor.navigate();
			closeEveryTypeOfDialog();
		} else {
			const result = addKernGroup(leftNew, rightNew, valueNew);
			// log(`result: ${result}`);

			if (typeof result === 'string') {
				showError(result);
			} else {
				editor.selectedItemID = result.id;
				editor.navigate();
				editor.history.addWholeProjectChangePostState();
				closeEveryTypeOfDialog();
			}
		}
		// log(`showAddEditKernGroupDialog button click handler`, 'end');
	}

	showModalDialog(content, 500);
	// log(`showAddEditKernGroupDialog`, 'end');
}

/**
 * Makes the content for the Find Single Letter Pair dialog, and shows it.
 */
export function showFindSingleLetterPairDialog() {
	const content = makeElement({
		innerHTML: `
		<h2>Find a letter pair</h2>
		Specify a pair of letters below, and search will return all the Kern Groups
		that contain that pair. Clicking on a search result will select that Kern Group
		behind the dialog box.
		<br><br>
		It is good to not have duplicate values for a letter pair - the value that actually
		gets used may not be the expected one.
		<br><br>

		<div class="list__two-column" style="max-width: 100px;">
			<div class="list__column-header">Left group letter</div>
			<div class="list__column-header">Right group letter</div>
			<input
				id="kerning__letter-pair__left-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
			<input
				id="kerning__letter-pair__right-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
		</div>
		<br>

		<fancy-button disabled id="kerning__letter-pair__search-button">
			Search
		</fancy-button>
		<br><br>
		<hr/>
		<br>
		<div id="kerning__letter-pair__results">
			<i>Search results...</i>
		</div>
		`,
	});

	const leftSearch = content.querySelector('#kerning__letter-pair__left-group');
	leftSearch.addEventListener('change', updateSearchButton);
	leftSearch.addEventListener('keyup', updateSearchButton);
	const rightSearch = content.querySelector('#kerning__letter-pair__right-group');
	rightSearch.addEventListener('change', updateSearchButton);
	rightSearch.addEventListener('keyup', updateSearchButton);

	const searchButton = content.querySelector('#kerning__letter-pair__search-button');
	searchButton.addEventListener('click', searchForLetterPairs);
	showModalDialog(content, 800);
}

/**
 * Makes the content for the Delete Single Letter Pair dialog, and shows it.
 */
export function showDeleteSingleLetterPairDialog() {
	const content = makeElement({
		innerHTML: `
		<h2>Delete letter pairs</h2>
		Specify a pair of letters below, and search will find and attempt to delete all
		the letter pairs from the applicable Kern Groups.
		<br><br>
		<b>Note</b>: This will only affect Kern Groups where either the left group or the right group has only one member. Kern Groups affect all possible permutations of left group / right group.
		Because of this, if a left group and a right group both have multiple members, including
		the specified letter pair, removing the letters from the letter pair would remove more
		than just the kern value for those two letters.
		<br><br>

		<div class="list__two-column" style="max-width: 100px;">
			<div class="list__column-header">Left group letter</div>
			<div class="list__column-header">Right group letter</div>
			<input
				id="kerning__letter-pair__left-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
			<input
				id="kerning__letter-pair__right-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
		</div>
		<br>

		<fancy-button disabled danger id="kerning__letter-pair__search-button">
			Find and delete
		</fancy-button>
		<div id="kerning__result-message"></div>
		`,
	});

	const leftSearch = content.querySelector('#kerning__letter-pair__left-group');
	leftSearch.addEventListener('change', updateSearchButton);
	leftSearch.addEventListener('keyup', updateSearchButton);
	const rightSearch = content.querySelector('#kerning__letter-pair__right-group');
	rightSearch.addEventListener('change', updateSearchButton);
	rightSearch.addEventListener('keyup', updateSearchButton);

	const searchButton = content.querySelector('#kerning__letter-pair__search-button');
	searchButton.addEventListener('click', deleteLetterPairs);
	showModalDialog(content, 800);
}

/**
 * Enables or disables the search button based on input fields.
 */
function updateSearchButton() {
	/** @type {HTMLInputElement} */
	const leftSearch = document.querySelector('#kerning__letter-pair__left-group');
	/** @type {HTMLInputElement} */
	const rightSearch = document.querySelector('#kerning__letter-pair__right-group');
	const searchButton = document.querySelector('#kerning__letter-pair__search-button');

	if (leftSearch.value.length && rightSearch.value.length) {
		searchButton.removeAttribute('disabled');
	} else {
		searchButton.setAttribute('disabled', '');
	}
}

/**
 * Does the search for letter pairs
 */
function searchForLetterPairs() {
	// log(`searchForLetterPairs`, 'start');
	/** @type {HTMLInputElement} */
	const leftGroup = document.querySelector('#kerning__letter-pair__left-group');
	const leftLetter = leftGroup.value.charAt(0);
	// log(`leftLetter: ${leftLetter} : ${charToHex(leftLetter)}`);
	/** @type {HTMLInputElement} */
	const rightGroup = document.querySelector('#kerning__letter-pair__right-group');
	const rightLetter = rightGroup.value.charAt(0);
	// log(`rightLetter: ${rightLetter} : ${charToHex(rightLetter)}`);

	const groups = getCurrentProject().kerning;
	const results = [];

	Object.keys(groups).forEach((id) => {
		// log(`checking ${groups[id].leftGroup}`);
		// log(`checking ${groups[id].rightGroup}`);
		if (
			groups[id].leftGroup.includes(charToHex(leftLetter)) &&
			groups[id].rightGroup.includes(charToHex(rightLetter))
		) {
			results.push(id);
		}
	});

	// log(`\n⮟results⮟`);
	// log(results);
	const resultsArea = document.querySelector('#kerning__letter-pair__results');
	resultsArea.innerHTML = '';

	if (results.length) {
		const selectedKernGroupID = getCurrentProjectEditor().selectedKernGroupID;
		results.forEach((id) => {
			let row = makeOneKernGroupRow(id);
			row.addEventListener('click', () => {
				const editor = getCurrentProjectEditor();
				editor.selectedItemID = id;
				editor.history.addState(`Navigated to ${editor.project.getItemName(id, true)}`);
				let resultRows = document.querySelectorAll('.kern-group-chooser__row');
				resultRows.forEach((result) => result.removeAttribute('selected'));
				row.setAttribute('selected', '');
			});
			if (id === selectedKernGroupID) row.setAttribute('selected', '');
			resultsArea.appendChild(row);
		});
	} else {
		resultsArea.innerHTML = '<i>No Kern Groups exist with that letter pair</i>';
	}
	// log(`searchForLetterPairs`, 'end');
}

/**
 * Deletes letter pairs
 */
function deleteLetterPairs() {
	// log(`deleteLetterPairs`, 'start');
	/** @type {HTMLInputElement} */
	const leftGroup = document.querySelector('#kerning__letter-pair__left-group');
	const leftLetter = leftGroup.value.charAt(0);
	// log(`leftLetter: ${leftLetter} : ${charToHex(leftLetter)}`);
	/** @type {HTMLInputElement} */
	const rightGroup = document.querySelector('#kerning__letter-pair__right-group');
	const rightLetter = rightGroup.value.charAt(0);
	// log(`rightLetter: ${rightLetter} : ${charToHex(rightLetter)}`);

	const resultMessage = document.querySelector('#kerning__result-message');
	resultMessage.innerHTML = '';

	const groups = getCurrentProject().kerning;
	let result;
	let errors = [];
	let success = [];

	Object.keys(groups).forEach((id) => {
		// log(`checking ${groups[id].leftGroup} | ${groups[id].rightGroup}`);
		if (
			groups[id].leftGroup.includes(charToHex(leftLetter)) &&
			groups[id].rightGroup.includes(charToHex(rightLetter))
		) {
			result = deleteLetterPair(leftLetter, rightLetter, id);
			if (result) success.push(id);
			else errors.push(id);
		}
	});

	// log(`After search`);
	// log(`success.toString(): ${success.toString()}`);
	// log(`errors.toString(): ${errors.toString()}`);

	if (errors.length) {
		resultMessage.innerHTML = `
			<br><br>
			<b>Warning</b><br>
			The following Kern Groups contain the specified letter pair, but
			the letters could not be removed because both the left group and
			the right group contain multiple members.
			<br><br>
			${errors.join(', ')}
			<br><br>
			<hr>
		`;
	}

	if (success.length > 0) {
		resultMessage.innerHTML += `
			<br>
			Successfully removed letter pair from Kern Group${success.length > 1 ? 's:' : ':'}
			<br><br>
			${success.join(', ')}
		`;
		getCurrentProjectEditor().navigate();
	} else {
		if (!errors.length) {
			resultMessage.innerHTML += `
				<br>
				<i>No Kern Groups with the specified letter pair was found.</i>
			`;
		}
	}

	// log(`deleteLetterPairs`, 'end');
}

/**
 * Given a Kern ID, removes a letter pair from it.
 * @param {String} leftLetter - left letter
 * @param {String} rightLetter - right letter
 * @param {String} kernID - which Kern Group to use
 * @returns {Boolean} - successful or not
 */
function deleteLetterPair(leftLetter = '', rightLetter = '', kernID = '') {
	// log(`deleteLetterPair`, 'start');
	let list = {};
	let leftHex = charToHex(leftLetter);
	let rightHex = charToHex(rightLetter);
	const editor = getCurrentProjectEditor();
	let success = false;

	if (kernID) {
		let selected = editor.project.getItem(kernID);
		if (selected) list[kernID] = selected;
	} else {
		list = editor.project.kerning;
	}
	// log(`\n⮟list⮟`);
	// log(list);

	Object.keys(list).forEach((id) => {
		// log(`id: ${id}`);
		let leftGroup = list[id].leftGroup;
		let rightGroup = list[id].rightGroup;
		if (leftGroup.includes(leftHex) && rightGroup.includes(rightHex)) {
			if (leftGroup.length === 1 && rightGroup.length === 1) {
				// log(`Removing the Kern Group ${id}`);
				editor.deleteItem(id, editor.project.kerning);
				success = true;
			} else if (leftGroup.length === 1) {
				// log(`Removing ${rightHex} from the right group`);
				rightGroup.splice(rightGroup.indexOf(rightHex), 1);
				success = true;
			} else if (rightGroup.length === 1) {
				// log(`Removing ${leftHex} from the left group`);
				leftGroup.splice(leftGroup.indexOf(leftHex), 1);
				success = true;
			}
		}
	});

	// log(`success: ${success}`);
	// log(`deleteLetterPair`, 'end');
	return success;
}

/**
 * Makes a small collection of character 'chips' for half
 * of a kern group's membership (left or right).
 * @param {Array} group - list of character IDs
 * @returns {Element}
 */
export function makeKernGroupCharChips(group) {
	// log(`makeKernGroupCharChips`, 'start');
	// log(`group: ${group}`);

	const wrapper = makeElement();
	group.forEach((charID) => {
		// log(`charID: ${charID}`);
		wrapper.appendChild(makeCharChip(charID));
	});
	// log(`makeKernGroupCharChips`, 'end');
	return wrapper;
}

/**
 * Makes a small element that represents a single character.
 * @param {String} charID - char to make a chip for
 * @returns {Element}
 */
export function makeCharChip(charID) {
	// log(`makeCharChip`, 'start');
	// log(`charID: ${charID}`);

	let char = hexesToChars(charID) || '';
	let name = getUnicodeName(charID);
	let title = charID;
	if (name) title = `${name}\n${charID}`;
	// log(`char: ${char}`);
	// log(`name: ${name}`);
	// log(`title: ${title}`);

	let chip = makeElement({
		tag: 'code',
		innerHTML: char,
		attributes: { title: title },
	});
	// log(`makeCharChip`, 'end');
	return chip;
}
