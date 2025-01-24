import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { closeAllModalDialogs, showError, showModalDialog, showToast } from '../controls/dialogs/dialogs.js';
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

	let showFilterDialogButton = content.querySelector(
		'#showFilterDialogButton'
	);
	showFilterDialogButton.addEventListener(
		'click',
		showFilterDialog
	);

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

	if(filters.ligatures) {
		ligatureCheckbox.setAttribute('checked', '');
	} else {
		ligatureCheckbox.removeAttribute('checked');
	}

	if(filters.components) {
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
		}
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
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Monospace
// --------------------------------------------------------------
/**
 * Makes the content for the Monospace global action card.
 * @returns {Element}
 */
function makeCard_Monospace() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Monospace font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Monospace fonts are fonts where each glyph has the same width. This is useful for coding fonts, and fonts used for textual output. The width value must be greater than zero.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Each ligature and glyph's advance width property will be set to the value provided.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="monospaceWidth">Glyph&nbsp;Width:</label>
			<input-number id="monospaceWidth" type="number" value="500"></input-number>
			<pre title="Expected value type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to Monospace' });
	button.addEventListener('click', () => {
		// log('convertProjectToMonospace', 'start');

		/** @type {HTMLInputElement} */
		const widthInput = document.querySelector('#monospaceWidth');
		const width = parseFloat(widthInput.value);
		// log(`width input: ${width}`);

		if (isNaN(width) || width === 0) {
			// log(`width is NaN or zero`);
			showToast('Monospace width must be<br>a number greater than zero');
		} else {
			glyphIterator({
				title: 'Converting to Monospace',
				filter: function (itemID) {
					return itemID.startsWith('glyph-') || itemID.startsWith('liga-');
				},
				action: function (glyph) {
					glyph.advanceWidth = width;
				},
			});
		}

		// log('convertProjectToMonospace', 'end');
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// All Caps
// --------------------------------------------------------------
/**
 * Makes the content for the All Caps global action card.
 * @returns {Element}
 */
function makeCard_AllCaps() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'All-caps font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `All-caps fonts have no lowercase letters. To make things easy, the lowercase letters in these fonts contain duplicates of their uppercase form. Select the ranges where you would like to add uppercase Component Instances to lowercase letters.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content:
			'Capital letters will be added as Component Instances to their lowercase counterparts in the selected ranges. The lowercase characters will also have their Advance Width property updated to match the uppercase character.',
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<input type="checkbox" id="allCapsBasic" checked="true"/>
			<label for="allCapsBasic">Basic Latin</label>
			<span></span>
			<input type="checkbox" id="allCapsSupplement"/>
			<label for="allCapsSupplement">Latin Supplement</label>
			<span></span>
			<input type="checkbox" id="allCapsLatinA"/>
			<label for="allCapsLatinA">Latin Extended A</label>
			<span></span>
			<input type="checkbox" id="allCapsLatinB"/>
			<label for="allCapsLatinB">Latin Extended B</label>
			<span></span>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to All Caps' });
	button.addEventListener('click', async () => {
		// log('convertProjectToAllCaps', 'start');
		const project = getCurrentProject();

		async function convertRangeToAllCaps(range, callback) {
			// Make sure all glyphs exist
			for (let gid = range.begin; gid < range.end; gid++) {
				let itemID = `glyph-${decToHex(gid)}`;
				let item = project.getItem(itemID);
				if (!item) {
					project.addItemByType(new Glyph(), 'Glyph', itemID);
				}
			}

			glyphIterator({
				title: 'Converting ' + range.name + ' to All Caps',
				filter: { begin: range.begin, end: range.end },
				action: function (item, itemID) {
					// log(`glyphIterator>ConvertToAllCaps>Action`, 'start');
					let destinationItemHex = findMappedValue(unicodeLowercaseMap, itemID.substring(6));
					// log(`destinationItemHex: ${destinationItemHex}`);
					destinationItemHex = decToHex(parseInt(destinationItemHex));
					// log(`destinationItemHex: ${destinationItemHex}`);
					if (destinationItemHex) {
						insertComponentInstance(itemID, `glyph-${destinationItemHex}`, true);
					}
					// log(`glyphIterator>ConvertToAllCaps>Action`, 'end');
				},
				callback: callback,
			});
		}

		// Basic Latin range
		/** @type {HTMLInputElement} */
		const allCapsBasicBox = document.querySelector('#allCapsBasic');
		if (allCapsBasicBox.checked) {
			// log(`Converting range: allCapsBasic`);
			let range = getUnicodeBlockByName('Basic Latin');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin-1 Supplement range
		/** @type {HTMLInputElement} */
		const allCapsSupplementBox = document.querySelector('#allCapsSupplement');
		if (allCapsSupplementBox.checked) {
			// log(`Converting range: allCapsSupplement`);
			let range = getUnicodeBlockByName('Latin-1 Supplement');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		/** @type {HTMLInputElement} */
		const allCapsLatinABox = document.querySelector('#allCapsLatinA');
		if (allCapsLatinABox.checked) {
			// log(`Converting range: allCapsLatinA`);
			let range = getUnicodeBlockByName('Latin Extended-A');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		/** @type {HTMLInputElement} */
		const allCapsLatinBBox = document.querySelector('#allCapsLatinB');
		if (allCapsLatinBBox.checked) {
			// log(`Converting range: allCapsLatinB`);
			let range = getUnicodeBlockByName('Latin Extended-B');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// log('convertProjectToAllCaps', 'end');
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Diacritics
// --------------------------------------------------------------
/**
 * Makes the content for the Diacritics global action card.
 * @returns {Element}
 */
function makeCard_Diacritics() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical glyph generator (basic)' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `The Latin Supplement character range is mostly made up of Latin-based diacritical (or accented) glyphs.  These are basically normal Latin glyphs, with accents.  Since most of the accents exist as stand-alone glyphs themselves in the Basic Latin range, diacritics in the Latin Supplement range are easy to create from merging two existing glyphs.<br><br><b>Please note</b> - The diacritical glyphs that are in the Basic Latin range are usually designed to be stand-alone. Simply combining them with base glyphs is a good start, but work will be needed to make the resulting character look nice. The "Advanced" Diacritical Glyph Generator below takes a little more work up front, but will probably yield better results.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `The Latin Supplement character range will be enabled, and diacritical glyphs will be assembled as Component Instances from their respective glyphs in the Basic Latin range.`,
	});
	card.appendChild(effect);

	let button = makeElement({ tag: 'fancy-button', content: 'Generate Diacritical Glyphs' });
	button.addEventListener('click', () => {
		let range = getUnicodeBlockByName('Latin-1 Supplement');
		let rangeBeginHex = '0x0';
		let currentItemDec = 0;
		if (range && range.begin) {
			rangeBeginHex = range.beginHex;
			currentItemDec = range.begin;
		}
		let currentItemHex = rangeBeginHex;
		let rangeEndDec = 0;
		if (range && range.end) rangeEndDec = Number(decToHex(range.end));
		let sourceArray;
		// const project = getCurrentProject();

		function processOneDiacriticItem() {
			// log(`processOneDiacriticItem - currentItemHex = ${currentItemHex}`);
			sourceArray = findMappedValue(unicodeDiacriticsMapSimple, '' + currentItemHex);
			let currentItemID = `glyph-${currentItemHex}`;

			if (sourceArray) {
				showToast(`Adding diacritical ${currentItemHex}`, 10000);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[0])}`, currentItemID, true);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[1])}`, currentItemID, false);
			}

			currentItemDec++;

			if (currentItemDec <= rangeEndDec) {
				currentItemDec = Number(currentItemHex);
				setTimeout(processOneDiacriticItem, 10);
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
