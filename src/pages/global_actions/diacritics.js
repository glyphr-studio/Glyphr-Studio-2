import { getCurrentProject } from '../../app/main.js';
import { decToHex, validateAsHex } from '../../common/character_ids.js';
import { makeElement } from '../../common/dom.js';
import { showToast } from '../../controls/dialogs/dialogs.js';
import { getUnicodeBlockByName } from '../../lib/unicode/unicode_blocks.js';
import {
	findMappedValue,
	unicodeDiacriticsMapAdvanced,
	unicodeDiacriticsMapSimple,
} from '../../lib/unicode/unicode_mappings.js';
import {
	insertComponentInstance,
} from '../../project_editor/cross_item_actions.js';
import { addCharacterRangeToCurrentProject } from '../settings_project.js';


// --------------------------------------------------------------
// Diacritics
// --------------------------------------------------------------
/**
 * Makes the content for the Diacritics global action card.
 * @returns {Element}
 */
export function makeCard_Diacritics() {
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

	let button = makeElement({ tag: 'fancy-button', attributes: {'secondary': ''}, content: 'Generate Diacritical Glyphs' });
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
				showToast('Done!', 1000);
			}
		}

		showToast('Starting to assemble Diacritical Glyphs', 10000);

		addCharacterRangeToCurrentProject(range);

		setTimeout(processOneDiacriticItem, 500);
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Diacritics Advanced
// --------------------------------------------------------------
/**
 * Makes the content for the Diacritics Advanced global action card.
 * @returns {Element}
 */
export function makeCard_DiacriticsAdvanced() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical glyph generator (advanced)' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `The Latin Supplement and Latin Extended A character ranges are mostly made up of Latin-based diacritical glyphs.  There is also a character range called Combining Diacritical Marks <code>0x300</code> to <code>0x36F</code>. This range is designed to be used in combination with base glyphs from other ranges.  This action will combine glyphs from the Basic Latin range with their appropriate counterparts in the Combining Diacritical Marks range to yield the Latin Supplement and Latin Extended A ranges.<br><br><b>Before you begin</b> - Add the Combining Diacritical Marks range to your project, and design them.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `The Latin Supplement and Latin Extended A character ranges will be enabled, and diacritical glyphs will be assembled as Component Instances from their respective glyphs from Basic Latin and Combining Diacritical Marks ranges.`,
	});
	card.appendChild(effect);

	let button = makeElement({ tag: 'fancy-button', attributes: {'secondary': ''}, content: 'Generate Diacritical Glyphs' });
	button.addEventListener('click', () => {
		let project = getCurrentProject();
		let rangeSupplement = getUnicodeBlockByName('Latin-1 Supplement');
		addCharacterRangeToCurrentProject(rangeSupplement);
		let rangeExtendedA = getUnicodeBlockByName('Latin Extended-A');
		addCharacterRangeToCurrentProject(rangeExtendedA);
		let range = { begin: 0, end: 0 };
		if (rangeSupplement && rangeExtendedA)
			range = { begin: rangeSupplement.begin, end: rangeExtendedA.end };
		let currentItemDec = range.begin;
		/** @type {String} */
		let currentItemHex = decToHex(range.begin) || '0x0';
		let sourceArray;
		let targetCenter, currCenter;

		function processOneItem() {
			// log(`processOneItem - currentItemHex = ${currentItemHex}`);
			sourceArray = findMappedValue(unicodeDiacriticsMapAdvanced, currentItemHex);
			let currentItemID = `glyph-${currentItemHex}`;
			let sourceID1 = `glyph-${validateAsHex(sourceArray[0])}`;
			let sourceID2 = `glyph-${validateAsHex(sourceArray[1])}`;

			if (sourceArray) {
				showToast(`Adding diacritical ${currentItemHex}`, 10000);
				insertComponentInstance(sourceID1, currentItemID, true);
				insertComponentInstance(sourceID2, currentItemID, false);
				targetCenter = project.getItem(sourceID1).maxes.centerX;
				currCenter = project.getItem(sourceID2).maxes.centerX;
				project.getItem(currentItemID).shapes[1].updateShapePosition(targetCenter - currCenter, 0);
			}

			currentItemDec++;

			if (currentItemDec <= range.end) {
				currentItemHex = decToHex(currentItemDec) || '0x0';
				setTimeout(processOneItem, 10);
			} else {
				showToast('Done!', 1000);
			}
		}

		showToast('Starting to assemble Diacritical Glyphs', 10000);
		setTimeout(processOneItem, 500);
	});
	card.appendChild(button);

	return card;
}
