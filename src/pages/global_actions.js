import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
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
					<span class="panel__card full-width">
						Global Actions are actions that affect many glyphs at once.
						Actions taken here will not carry forward to glyphs that haven't been created yet.
					</span>
					<span class="panel__card full-width">
						<h3>Filters</h3>
						By default, global actions affect all characters, ligatures, and components. The
						filters below can be used to target more specific ranges.
						<br><br>
						<span id="globalActionsCharacterRangesDisplay">
							${filters.characterRanges.length} character ranges selected.
						</span>
						<fancy-button
							id="showFilterDialogButton"
							secondary
						>Select character ranges</fancy-button>
						<input type="checkbox" checked id="globalActionsSelectLigaturesCheckbox" />
						<label for="globalActionsSelectLigaturesCheckbox">Ligatures</label>
						<input type="checkbox" checked id="globalActionsSelectComponentsCheckbox" />
						<label for="globalActionsSelectComponentsCheckbox">Components</label>
					</span>
					<span class="panel__card full-width">
						Have an idea for a new global action?  They are easy for us to add - email us your idea!
						<a href="mailto:mail@glyphrstudio.com">mail@glyphrstudio.com</a>
						<br /> <br />
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

	let ligatureCheckbox = content.querySelector('#globalActionsSelectLigatureCheckbox');
	ligatureCheckbox.addEventListener('change', () => {
		filters.ligatures = ligatureCheckbox.hasAttribute('checked');
	});

	let componentCheckbox = content.querySelector('#globalActionsSelectComponentCheckbox');
	componentCheckbox.addEventListener('change', () => {
		filters.components = componentCheckbox.hasAttribute('checked');
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

	const project = getCurrentProject();
	let listOfItemIDs = [];
	let itemNumber = 0;
	let title = oa.title || 'Iterating on Glyph';

	/**
	 * Filter function that gets overwritten by various things
	 * to include or not include items in Global Actions
	 * @param {String} itemID - check this ID against a filter function
	 * @returns {Boolean} - include this Item or not
	 */
	let filter = (itemID = '') => {
		return !!itemID;
	};

	let callback = oa.callback || false;
	let currentItem, currentItemID;

	// Translate range notation to filter function
	if (oa.filter) {
		if (oa.filter.begin && oa.filter.end) {
			let begin = parseInt(oa.filter.begin);
			let end = parseInt(oa.filter.end);
			let itemIntegerID;

			filter = (itemID) => {
				if (itemID.startsWith('glyph-')) {
					itemIntegerID = parseInt(itemID.substring(6), 16);
					return itemIntegerID >= begin && itemIntegerID <= end;
				} else {
					return false;
				}
			};
		} else {
			filter = oa.filter;
		}
	}

	// Functions

	function processOneItem() {
		// log(`glyphIterator>processOneItem`, 'start');
		let failures = [];
		// log(`itemNumber: ${itemNumber}`);
		currentItemID = listOfItemIDs[itemNumber];
		currentItem = project.getItem(currentItemID, true);
		// log(`Got glyph: ${currentItem.name}`);

		showToast(title + '<br>' + currentItem.name, 10000);

		try {
			oa.action(currentItem, currentItemID);
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
		// Components
		Object.keys(project.components).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// Ligatures
		Object.keys(project.ligatures).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// Glyphs
		Object.keys(project.glyphs).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// log('item list');
		// log(listOfItemIDs);
		getCurrentProjectEditor().history.addWholeProjectChangePostState();
		// Kick off the process
		setTimeout(processOneItem, 10);
	}

	// Do Stuff

	showToast(title + '<br>Starting...', 10000);
	setTimeout(makeItemList, 500);
	// log(`glyphIterator`, 'end');
}

const filters = {
	characterRanges: [],
	ligatures: true,
	components: true,
};

function updateFilterCard() {
	const ligatureCheckbox = document.getElementById('globalActionsSelectLigaturesCheckbox');
	const componentsCheckbox = document.getElementById('globalActionsSelectComponentsCheckbox');
	const characterRangesDisplay = document.getElementById('globalActionsCharacterRangesDisplay');

	if (filters.ligatures) {
		ligatureCheckbox.setAttribute('checked', '');
	} else {
		ligatureCheckbox.removeAttribute('checked');
	}

	if (filters.components) {
		componentsCheckbox.setAttribute('checked', '');
	} else {
		componentsCheckbox.removeAttribute('checked');
	}

	characterRangesDisplay.innerHTML = `${filters.characterRanges.length} character ranges selected.`;
}

function showFilterDialog() {
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
		log(filters.characterRanges.includes(range.id));
		const rangeCheckbox = makeElement({
			tag: 'input',
			attributes: {
				type: 'checkbox',
			},
		});

		rangeCheckbox.addEventListener('change', () => {
			const index = filters.characterRanges.indexOf(range.id);
			/**@ts-ignore */
			if (index === -1 && rangeCheckbox.checked) {
				filters.characterRanges.push(range.id);
			} else {
				filters.characterRanges.splice(index, 1);
			}
		});

		if (filters.characterRanges.includes(range.id)) {
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

	addAsChildren(dialogContent, [rangeTable, textToNode('<br>'), saveButton]);

	showModalDialog(dialogContent);
}
