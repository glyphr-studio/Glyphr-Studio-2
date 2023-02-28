import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { makeElement } from '../common/dom.js';
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
	const editor = getCurrentProjectEditor();
	// log(editor.project.settings.project.glyphRanges);
	// log(editor.selectedGlyphRange);

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	editor.selectedGlyphRange.array.forEach((glyphID) => {
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

	// log(`makeGlyphChooserTileGrid`, 'end');
	return tileGrid;
}

function makeGlyphRangeChooser() {
	// log(`makeGlyphRangeChooser`, 'start');

	let ranges = getCurrentProject().settings.project.glyphRanges;
	let selectedRange = getCurrentProjectEditor().selectedGlyphRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': selectedRange.name,
			'selected-id': selectedRange.id,
		},
	});

	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);

		let option = makeElement({
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

	// log(`makeGlyphRangeChooser`, 'end');
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
