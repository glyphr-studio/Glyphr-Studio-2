import { getCurrentProject } from '../../app/main.js';
import { decToHex } from '../../common/character_ids.js';
import {  makeElement } from '../../common/dom.js';
import { remove } from '../../common/functions.js';
import { showToast } from '../../controls/dialogs/dialogs.js';
import { getUnicodeBlockByName } from '../../lib/unicode/unicode_blocks.js';
import {
	findMappedValue,
	unicodeLowercaseMap,
} from '../../lib/unicode/unicode_mappings.js';
import { CharacterRange } from '../../project_data/character_range.js';
import { Glyph } from '../../project_data/glyph.js';
import {
	insertComponentInstance,
} from '../../project_editor/cross_item_actions.js';
import { addRangeToSelectedFilterInputs, glyphIterator } from './page.js';
import { addCharacterRangeToCurrentProject } from '../settings_project.js';

// --------------------------------------------------------------
// Monospace
// --------------------------------------------------------------
/**
 * Makes the content for the Monospace global action card.
 * @returns {Element}
 */
export function makeCard_Monospace() {
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
			<pre title="Expected value type" class="value-type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', attributes: {'secondary': ''}, content: 'Convert project to Monospace' });
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
				includeComponents: false,
				action: (glyph) => {
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
export function makeCard_AllCaps() {
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
			'Capital letters will be added as Component Instances to their lowercase counterparts in the selected ranges. The lowercase letters will also have their Advance Width updated to match their uppercase counterparts.',
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

	let button = makeElement({ tag: 'fancy-button', attributes: {'secondary': ''}, content: 'Convert project to All Caps' });
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
				includeComponents: false,
				includeLigatures: false,
				// filter: { begin: range.begin, end: range.end }, // TODO fix filtering
				action: (item) => {
					const hexID = Number(remove(item.id, 'glyph-'));
					if (range.isWithinRange(hexID)) {
						// log(`glyphIterator>ConvertToAllCaps>Action`, 'start');
						let destinationItemHex = findMappedValue(unicodeLowercaseMap, item.id.substring(6));
						// log(`destinationItemHex: ${destinationItemHex}`);
						destinationItemHex = decToHex(parseInt(destinationItemHex));
						// log(`destinationItemHex: ${destinationItemHex}`);
						if (destinationItemHex) {
							insertComponentInstance(item.id, `glyph-${destinationItemHex}`, true);
						}
						// log(`glyphIterator>ConvertToAllCaps>Action`, 'end');
					}
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
			if (range) {
				range = new CharacterRange(range);
				addCharacterRangeToCurrentProject(range);
				addRangeToSelectedFilterInputs(range);
				await convertRangeToAllCaps(range);
			}
		}

		// Latin-1 Supplement range
		/** @type {HTMLInputElement} */
		const allCapsSupplementBox = document.querySelector('#allCapsSupplement');
		if (allCapsSupplementBox.checked) {
			// log(`Converting range: allCapsSupplement`);
			let range = getUnicodeBlockByName('Latin-1 Supplement');
			if (range) {
				range = new CharacterRange(range);
				addCharacterRangeToCurrentProject(range);
				addRangeToSelectedFilterInputs(range);
				await convertRangeToAllCaps(range);
			}
		}

		// Latin Extended-A range
		/** @type {HTMLInputElement} */
		const allCapsLatinABox = document.querySelector('#allCapsLatinA');
		if (allCapsLatinABox.checked) {
			// log(`Converting range: allCapsLatinA`);
			let range = getUnicodeBlockByName('Latin Extended-A');
			if (range) {
				range = new CharacterRange(range);
				addCharacterRangeToCurrentProject(range);
				addRangeToSelectedFilterInputs(range);
				await convertRangeToAllCaps(range);
			}
		}

		// Latin Extended-B range
		/** @type {HTMLInputElement} */
		const allCapsLatinBBox = document.querySelector('#allCapsLatinB');
		if (allCapsLatinBBox.checked) {
			// log(`Converting range: allCapsLatinB`);
			let range = getUnicodeBlockByName('Latin Extended-B');
			if (range) {
				range = new CharacterRange(range);
				addCharacterRangeToCurrentProject(range);
				addRangeToSelectedFilterInputs(range);
				await convertRangeToAllCaps(range);
			}
		}

		// log('convertProjectToAllCaps', 'end');
	});
	card.appendChild(button);

	return card;
}
