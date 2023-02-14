import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { areHexValuesEqual, basicLatinOrder, decToHex } from '../common/unicode.js';
import { GlyphTile } from '../controls/glyph-tile/glyph_tile.js';
import { isControlChar } from '../lib/unicode_blocks.js';

/**
		Panel > Chooser
		Shows a list of all the Glyphs to choose from
		for whatever the current page is.  Also has
		the logic for creating Glyph chooser dialogs.
**/

// --------------------------------------------------------------
// Glyph chooser
// --------------------------------------------------------------

let savedClickHandler;
let savedRegisterSubscriptions;

export function makeGlyphChooserContent(clickHandler, registerSubscriptions = true) {
	// log(`makeGlyphChooserContent`, 'start');
	const editor = getCurrentProjectEditor();

	let wrapper = makeElement({ tag: 'div', className: 'glyph-chooser__wrapper' });

	if (editor.nav.page !== 'Ligatures') {
		if (editor.project.settings.project.glyphRanges.length > 1) {
			let header = makeElement({ tag: 'div', className: 'glyph-chooser__header' });
			header.appendChild(makeGlyphRangeChooser());
			wrapper.appendChild(header);
		}
	}
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = registerSubscriptions;

	if (editor.nav.page !== 'Ligatures') {
		wrapper.appendChild(makeGlyphChooserTileGrid());
	} else {
		wrapper.appendChild(makeLigatureChooserTileGrid());
		wrapper.appendChild(makeElement({
			tag: 'fancy-button',
			innerHTML: 'Create new ligature',
		}));
	}

	// log(`makeGlyphChooserContent`, 'end');
	return wrapper;
}

function makeGlyphChooserTileGrid() {
	// log(`makeGlyphChooserTileGrid`, 'start');
	const editor = getCurrentProjectEditor();
	// log(json(editor.selectedGlyphRange));

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	let rangeList = glyphRangeToList(editor.selectedGlyphRange);

	rangeList.forEach((glyphID) => {
		let oneTile = new GlyphTile({ glyph: glyphID });
		if (editor.selectedGlyphID === glyphID) oneTile.setAttribute('selected', '');

		oneTile.addEventListener('click', () => savedClickHandler(glyphID));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichGlyphIsSelected',
				subscriberID: `glyphTile.${glyphID}`,
				callback: (newGlyphID) => {
					// log('whichGlyphIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${glyphID}`);
					if (areHexValuesEqual(newGlyphID, glyphID)) {
						// log(`Callback: setting ${oneTile.getAttribute('glyph')} attribute to selected`);
						oneTile.setAttribute('selected', '');
					} else {
						// log(`Callback: removing ${oneTile.getAttribute('glyph')} attribute selected`);
						oneTile.removeAttribute('selected');
					}
				},
			});
		}

		tileGrid.appendChild(oneTile);
	});

	// log(`makeGlyphChooserTileGrid`, 'end');
	return tileGrid;
}

function glyphRangeToList(range) {
	if ((range.begin === 0 || range.begin === 0x21) && range.end === 0x7f) {
		return basicLatinOrder;
	}

	let showControls = getCurrentProject().settings.app.showNonCharPoints;
	let result = [];
	for (let i = range.begin; i < range.end; i++) {
		if (showControls) {
			result.push('' + decToHex(i));
		} else {
			if (!isControlChar(i)) result.push('' + decToHex(i));
		}
	}

	return result;
}

function makeGlyphRangeChooser() {
	// log(`makeGlyphRangeChooser`, 'start');

	let ranges = getCurrentProject().settings.project.glyphRanges;
	let selectedRange = getCurrentProjectEditor().selectedGlyphRange;
	let optionChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': selectedRange.name,
			'selected-id': makeRangeID(selectedRange),
		},
	});

	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);

		let option = makeElement({
			tag: 'option',
			innerHTML: range.name,
			attributes: { note: `["${decToHex(range.begin)}", "${decToHex(range.end)}"]` },
		});

		option.addEventListener('click', () => {
			// log(`OPTION.click - range: ${range.name}`);

			getCurrentProjectEditor().selectedGlyphRange = range;
			let tileGrid = document.querySelector('.glyph-chooser__tile-grid');
			// log(tileGrid);
			tileGrid.remove();
			let wrapper = document.querySelector('.glyph-chooser__wrapper');
			// log(wrapper);
			wrapper.appendChild(makeGlyphChooserTileGrid());
		});

		optionChooser.appendChild(option);
	});

	// log(`makeGlyphRangeChooser`, 'end');
	return optionChooser;
}

export function makeRangeID(range) {
	return `${range.name} ["${decToHex(range.begin)}", "${decToHex(range.end)}"]`;
}

function makeLigatureChooserTileGrid() {
	// log(`makeLigatureChooserTileGrid`, 'start');
	const editor = getCurrentProjectEditor();

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	let sortedLigatures = editor.project.sortedLigatures;

	sortedLigatures.forEach((ligature) => {
		let oneTile = new GlyphTile({ glyph: ligature.id });
		if (editor.selectedLigatureID === ligature.id) oneTile.setAttribute('selected', '');

		oneTile.addEventListener('click', () => savedClickHandler(ligature.id));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichLigatureIsSelected',
				subscriberID: `glyphTile.${ligature.id}`,
				callback: (newLigatureID) => {
					// log('whichLigatureIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${ligature}`);
					if (newLigatureID === ligature.id) {
						// log(`Callback: setting ${oneTile.getAttribute('glyph')} attribute to selected`);
						oneTile.setAttribute('selected', '');
					} else {
						// log(`Callback: removing ${oneTile.getAttribute('glyph')} attribute selected`);
						oneTile.removeAttribute('selected');
					}
				},
			});
		}

		tileGrid.appendChild(oneTile);
	});

	// log(`makeLigatureChooserTileGrid`, 'end');
	return tileGrid;
}
