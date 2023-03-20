import { getCurrentProjectEditor, log } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { GlyphTile } from '../controls/glyph-tile/glyph_tile.js';
import { showAddLigatureDialog } from '../pages/ligatures.js';

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

export function makeGlyphChooserContent(
	clickHandler,
	registerSubscriptions = true,
	includeItemTypeChooser = false
) {
	// log(`makeGlyphChooserContent`, 'start');
	const editor = getCurrentProjectEditor();
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = registerSubscriptions;

	let wrapper = makeElement({ tag: 'div', className: 'glyph-chooser__wrapper' });

	if (editor.nav.page !== 'Ligatures') {
		if (editor.project.settings.project.glyphRanges.length > 1) {
			let header = makeElement({ tag: 'div', className: 'glyph-chooser__header' });
			header.appendChild(makeRangeAndItemTypeChooser(includeItemTypeChooser));
			wrapper.appendChild(header);
		}
		wrapper.appendChild(makeGlyphChooserTileGrid());
	} else {
		wrapper.appendChild(makeLigatureChooserTileGrid());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create new ligature',
				onClick: showAddLigatureDialog,
			})
		);
	}

	// log(`makeGlyphChooserContent`, 'end');
	return wrapper;
}

function makeGlyphChooserTileGrid() {
	// log(`makeGlyphChooserTileGrid`, 'start');
	// console.time('makeGlyphChooserTileGrid');
	const editor = getCurrentProjectEditor();
	// log(editor.project.settings.project.glyphRanges);
	// log(editor.selectedGlyphRange);

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	editor.selectedGlyphRange.array.forEach((glyphID) => {
		// log(`glyphID: ${glyphID}`);
		let oneTile = new GlyphTile({ 'displayed-item-id': glyphID });
		if (editor.selectedGlyphID === glyphID) oneTile.setAttribute('selected', '');

		oneTile.addEventListener('click', () => savedClickHandler(glyphID));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichGlyphIsSelected',
				subscriberID: `glyphTile.${glyphID}`,
				callback: (newGlyphID) => {
					// log('whichGlyphIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${glyphID}`);
					if (parseInt(newGlyphID) === parseInt(glyphID)) {
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

	// console.timeEnd('makeGlyphChooserTileGrid');
	// log(`makeGlyphChooserTileGrid`, 'end');
	return tileGrid;
}

function makeRangeAndItemTypeChooser(includeItemTypeChooser = false) {
	// log(`makeRangeAndItemTypeChooser`, 'start');

	const editor = getCurrentProjectEditor();
	let ranges = editor.project.settings.project.glyphRanges;
	let selectedRange = editor.selectedGlyphRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': selectedRange.name,
			'selected-id': selectedRange.id,
		},
	});
	let option;

	if (includeItemTypeChooser) {
		// log(`range.name: Ligatures`);
		option = makeElement({
			tag: 'option',
			innerHTML: 'Ligatures',
			attributes: { note: `${countItems(editor.project.ligatures)}&nbsp;items` },
		});

		option.addEventListener('click', () => {
			getCurrentProjectEditor().selectedGlyphRange = 'Ligatures';
			let tileGrid = document.querySelector('.glyph-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.glyph-chooser__wrapper');
			wrapper.appendChild(makeLigatureChooserTileGrid());
		});

		optionChooser.appendChild(option);
		optionChooser.appendChild(makeElement({ tag: 'hr' }));
	}

	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);

		option = makeElement({
			tag: 'option',
			innerHTML: range.name,
			attributes: { note: range.note },
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

	// log(`makeRangeAndItemTypeChooser`, 'end');
	return optionChooser;
}

function makeLigatureChooserTileGrid() {
	// log(`makeLigatureChooserTileGrid`, 'start');
	const editor = getCurrentProjectEditor();

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	let sortedLigatures = editor.project.sortedLigatures;

	sortedLigatures.forEach((ligature) => {
		let oneTile = new GlyphTile({ 'displayed-item-id': ligature.id });
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
