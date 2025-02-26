import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { remove } from '../common/functions.js';
import {
	closeAllModalDialogs,
	showError,
	showModalDialog,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { CharacterRange } from '../project_data/character_range.js';
import { glyphChanged } from '../project_editor/cross_item_actions.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import {
	makeCard_AllCaps,
	makeCard_Diacritics,
	makeCard_DiacriticsAdvanced,
	makeCard_Flatten,
	makeCard_Monospace,
	makeCard_Move,
	makeCard_RemoveItems,
	makeCard_Resize,
	makeCard_Round,
	makeCard_ScaleHorizontal,
	makeCard_ScaleVertical,
	makeCard_SideBearings,
} from './global_actions_cards.js';
/**
 * Page > Global Actions
 * Various actions that can be applied to all glyphs.
 * @returns {Element} - page content
 */
export function makePage_GlobalActions() {
	// Start things off by defaulting to selecting all ranges
	selectAllRanges();

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Global actions' })}
				</div>
				<div id="content-page__panel">
				<span class="panel__card">
					<h3>Filters</h3>
					<p class="full-width">
						By default, global actions affect all characters, ligatures, and components. The
						filters below can be used to target more specific ranges.
						<br><br>
					</p>
					<span id="globalActionsCharacterRangesDisplay">
						${itemFilterInputs.characterRanges.length} ranges selected
					</span>
						<fancy-button id="showFilterDialogButton" secondary>Select character ranges</fancy-button>
						<label for="globalActionsSelectLigaturesCheckbox">Ligatures</label>
						<input type="checkbox" checked id="globalActionsSelectLigaturesCheckbox" />
						<label for="globalActionsSelectComponentsCheckbox">Components</label>
						<input type="checkbox" checked id="globalActionsSelectComponentsCheckbox" />
					</span>
					<span class="panel__card full-width">
						<h3>Some notes</h3>
						Global Actions are actions that affect many items at once.
						<ul>
							<li>Actions taken here will not carry forward to items that haven't been created yet.</li>
							<li>Global actions to not affect hidden character ranges.</li>
							<li>Changes will be grouped together in one History entry. Hitting 'Undo' will undo all changes made by the global action.</li>
							<li>Components or Characters that are used as Component Roots in selected
								ranges may be linked to Component Instances outside of selected ranges. Moving or scaling Component
								Roots may have effects outside of selected ranges.</li>
						</ul>
					</span>
					<span class="panel__card full-width">
						Have an idea for a new global action?  They are easy for us to add - email us your idea!
						<a href="mailto:mail@glyphrstudio.com">mail@glyphrstudio.com</a>
					</span>
				</div>
			</div>
			<div class="content-page__right-area">
			</div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const rightArea = content.querySelector('.content-page__right-area');
	rightArea.innerHTML += ``;

	let showFilterDialogButton = content.querySelector('#showFilterDialogButton');
	showFilterDialogButton.addEventListener('click', showFilterDialog);

	/** @type {HTMLInputElement} */
	let ligatureCheckbox = content.querySelector('#globalActionsSelectLigaturesCheckbox');
	ligatureCheckbox.addEventListener('change', () => {
		itemFilterInputs.ligatures = ligatureCheckbox.checked;
		// log(`itemFilterInputs.ligatures is now ${itemFilterInputs.ligatures}`);
	});

	/** @type {HTMLInputElement} */
	let componentCheckbox = content.querySelector('#globalActionsSelectComponentsCheckbox');
	componentCheckbox.addEventListener('change', () => {
		itemFilterInputs.components = componentCheckbox.checked;
		// log(`itemFilterInputs.components is now ${itemFilterInputs.components}`);
	});

	addAsChildren(rightArea, [
		makeElement({ tag: 'h1', content: 'Move and resize' }),
		makeCard_Move(),
		makeCard_ScaleHorizontal(),
		makeCard_ScaleVertical(),
		makeCard_Resize(),
		makeCard_Flatten(),
		makeCard_SideBearings(),
		makeCard_Round(),
		makeCard_RemoveItems(),
		makeElement({ tag: 'h1', content: 'Font types' }),
		makeCard_Monospace(),
		makeCard_AllCaps(),
		makeElement({ tag: 'h1', content: 'Diacritics' }),
		makeCard_Diacritics(),
		makeCard_DiacriticsAdvanced(),
	]);

	return content;
}

//	------------------
//	Glyph Iterator
//	------------------

/**
 * Centralized way to iterate over specific items in the
 * project, applying changes from a callback function, and
 * optionally collecting errors.
 * @param {Object} oa - options argument
 */
export function glyphIterator(oa) {
	// log(`glyphIterator`, 'start');
	// log(oa);
	// log(itemFilterInputs);

	const project = getCurrentProject();
	let listOfItemIDs = [];
	let itemNumber = 0;
	let title = oa.title || 'Iterating on Glyph';
	const includeGlyphs = oa.includeGlyphs || true;
	const includeLigatures = oa.includeLigatures || true;
	const includeComponents = oa.includeComponents || true;
	let callback = oa.callback || false;
	let currentItem, currentItemID;

	function processOneItem() {
		// log(`glyphIterator>processOneItem`, 'start');
		let failures = [];
		// log(`itemNumber: ${itemNumber}`);
		currentItemID = listOfItemIDs[itemNumber];
		currentItem = project.getItem(currentItemID, true);
		// log(`Got glyph: ${currentItem.name}`);

		showToast(title + '<br>' + currentItem.name, 10000);

		try {
			oa.action(currentItem, listOfItemIDs);
			glyphChanged(currentItem);
		} catch (error) {
			failures.push({
				itemID: currentItemID,
				item: currentItem,
				error: error.message,
			});
		}

		if (itemNumber < listOfItemIDs.length - 1) {
			itemNumber++;
			setTimeout(processOneItem, 10);
		} else {
			showToast(title + '<br>Done!', 1000);
			if (failures.length) {
				showError(
					`Some items were skipped due to errors. Check the browser console for more information.`
				);
				console.warn(`\n⮟Global Action failures⮟`);
				console.warn(failures);
			}
			getCurrentProjectEditor().history.addWholeProjectChangePreState(
				`Global action: ${title.replace('ing', 'ed')} (${listOfItemIDs.length} items)`
			);
			if (callback) callback();
		}
		// log(`glyphIterator>processOneItem`, 'end');
	}

	function makeItemList() {
		// log(`makeItemList`, 'start');
		// log(`\n⮟itemFilterInputs⮟`);
		// log(itemFilterInputs);
		// Components
		if (includeComponents && itemFilterInputs.components) {
			Object.keys(project.components).forEach((componentID) => listOfItemIDs.push(componentID));
		}

		// Ligatures
		if (includeLigatures && itemFilterInputs.ligatures) {
			Object.keys(project.ligatures).forEach((ligatureID) => listOfItemIDs.push(ligatureID));
		}

		// Glyphs
		if (includeGlyphs) {
			const selectedCharacterRanges = itemFilterInputs.characterRanges.map((rangeID) =>
				getRangeById(rangeID)
			);
			// log(`\n⮟selectedCharacterRanges⮟`);
			// log(selectedCharacterRanges);
			Object.keys(project.glyphs).forEach((glyphID) => {
				for (let i = 0; i < selectedCharacterRanges.length; i++) {
					const range = selectedCharacterRanges[i];
					const hexID = Number(remove(glyphID, 'glyph-'));
					if (range.isWithinRange(hexID)) {
						listOfItemIDs.push(glyphID);
						break;
					}
				}
			});
		}

		// log('item list');
		// log(listOfItemIDs);
		getCurrentProjectEditor().history.addWholeProjectChangePostState();
		// Kick off the process
		setTimeout(processOneItem, 10);
		// log(`makeItemList`, 'end');
	}

	// Do Stuff

	showToast(title + '<br>Starting...', 10000);
	setTimeout(makeItemList, 500);
	// log(`glyphIterator`, 'end');
}

const itemFilterInputs = {
	characterRanges: [],
	ligatures: true,
	components: true,
};

function selectAllRanges() {
	itemFilterInputs.characterRanges = [];
	getCurrentProject().settings.project.characterRanges.forEach((range) => {
		if (range.enabled) itemFilterInputs.characterRanges.push(range.id);
	});
}

export function addRangeToSelectedFilterInputs(range) {
	// log(`addCharacterRangesToSelectedRanges`, 'start');
	// log(`\n⮟range⮟`);
	// log(range);
	itemFilterInputs.characterRanges.push(range.id);
	// log(`\n⮟itemFilterInputs.characterRanges⮟`);
	// log(itemFilterInputs.characterRanges);
	// log(`addCharacterRangesToSelectedRanges`, 'end');
}

function getRangeById(id) {
	return getCurrentProject().settings.project.characterRanges.find((range) => range.id === id);
}

function updateFilterCard() {
	const ligatureCheckbox = document.getElementById('globalActionsSelectLigaturesCheckbox');
	const componentsCheckbox = document.getElementById('globalActionsSelectComponentsCheckbox');
	const characterRangesDisplay = document.getElementById('globalActionsCharacterRangesDisplay');

	if (itemFilterInputs.ligatures) {
		ligatureCheckbox.setAttribute('checked', '');
	} else {
		ligatureCheckbox.removeAttribute('checked');
	}

	if (itemFilterInputs.components) {
		componentsCheckbox.setAttribute('checked', '');
	} else {
		componentsCheckbox.removeAttribute('checked');
	}

	characterRangesDisplay.innerHTML = `${itemFilterInputs.characterRanges.length} ranges selected`;
}

function showFilterDialog() {
	// log(`showFilterDialog`, 'start');
	// log(`\n⮟itemFilterInputs⮟`);
	// log(itemFilterInputs);

	const dialogContent = makeElement({
		tag: 'div',
		innerHTML: `
		<h1>Select character ranges</h1>
		<p>
			The selected character ranges below will be included
			in the global actions that you perform. If you want
			different character ranges than what are shown here, you can
			add or edit character ranges on the Settings > Project page.
		</p>
		<br>
		`,
	});

	const rangeTable = makeElement({
		tag: 'div',
		className: 'range-table__list-area',
	});

	rangeTable.classList.add('range-selection');

	const saveButton = makeElement({
		tag: 'fancy-button',
		content: 'Close',
		onClick: () => {
			closeAllModalDialogs();
			updateFilterCard();
		},
	});

	const selectAllButton = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Select all',
		onClick: () => {
			selectAllRanges();
			showFilterDialog();
		},
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="list__column-header">&emsp;</span>'),
		textToNode('<span class="list__column-header">&emsp;Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
		textToNode('<span class="list__column-header">Characters</span>'),
	]);

	const project = getCurrentProject();
	const projectRanges = project.settings.project.characterRanges;
	if (projectRanges.length === 0) {
		projectRanges.unshift(
			new CharacterRange({
				name: 'Basic Latin',
				begin: 0x20,
				end: 0x7f,
				enabled: true,
			})
		);
	}

	projectRanges.forEach((range) => {
		if (!range.enabled) return;
		// log(itemFilterInputs.characterRanges.includes(range.id));
		const rangeCheckbox = makeElement({
			tag: 'input',
			attributes: {
				type: 'checkbox',
			},
		});

		rangeCheckbox.addEventListener('change', () => {
			const index = itemFilterInputs.characterRanges.indexOf(range.id);
			/**@ts-ignore */
			if (index === -1 && rangeCheckbox.checked) {
				itemFilterInputs.characterRanges.push(range.id);
			} else {
				itemFilterInputs.characterRanges.splice(index, 1);
			}
		});

		if (itemFilterInputs.characterRanges.includes(range.id)) {
			rangeCheckbox.setAttribute('checked', '');
		}

		addAsChildren(rangeTable, [
			rangeCheckbox,
			textToNode(`<span>&emsp;${range.name}</span>`),
			textToNode(`<code>${decToHex(range.begin)}</code>`),
			textToNode(`<code>${decToHex(range.end)}</code>`),
			textToNode(`<span>${range.count}</span>`),
		]);
	});

	addAsChildren(dialogContent, [
		rangeTable,
		textToNode('<br>'),
		saveButton,
		textToNode('<span>&emsp;</span>'),
		selectAllButton,
	]);

	showModalDialog(dialogContent, 850);
	// log(`showFilterDialog`, 'end');
}
