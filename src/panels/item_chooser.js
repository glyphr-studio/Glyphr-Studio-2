import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { GlyphTile } from '../controls/glyph-tile/glyph_tile.js';
import { showAddComponentDialog } from '../pages/components.js';
import { showAddLigatureDialog } from '../pages/ligatures.js';

/**
	Panel > Item Chooser
	Shows a list of all the Items to choose from
	for whatever the current page is.  Also has
	the logic for creating chooser dialogs.
**/

// --------------------------------------------------------------
// Item Chooser
// --------------------------------------------------------------

let savedClickHandler;
let savedRegisterSubscriptions;

export function makeAllItemTypeChooserContent(clickHandler, registerSubscriptions = true) {
	// log(`makeAllItemTypeChooserContent`, 'start');
	const editor = getCurrentProjectEditor();
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = registerSubscriptions;

	let wrapper = makeElement({ tag: 'div', className: 'item-chooser__wrapper' });
	let header = makeElement({ tag: 'div', className: 'item-chooser__header' });
	header.appendChild(makeRangeAndItemTypeChooser());
	wrapper.appendChild(header);

	if (editor.nav.page === 'Ligatures') {
		// Ligature Chooser
		wrapper.appendChild(makeLigatureChooserTileGrid());
	} else if (editor.nav.page === 'Components') {
		// Component Chooser
		wrapper.appendChild(makeComponentChooserTileGrid());
	} else {
		// Overview and Characters = Character Chooser
		wrapper.appendChild(makeCharacterChooserTileGrid());
	}

	// log(`makeAllItemTypeChooserContent`, 'end');
	return wrapper;
}

export function makeSingleItemTypeChooserContent(itemType, clickHandler) {
	// log(`makeSingleItemTypeChooserContent`, 'start');
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = true;
	let wrapper = makeElement({ tag: 'div', className: 'item-chooser__wrapper' });

	if (itemType === 'Ligatures') {
		// Ligature Chooser
		wrapper.appendChild(makeLigatureChooserTileGrid());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create new ligature',
				onClick: showAddLigatureDialog,
			})
		);
	} else if (itemType === 'Components') {
		// Component Chooser
		wrapper.appendChild(makeComponentChooserTileGrid());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create new component',
				onClick: showAddComponentDialog,
			})
		);
	} else {
		// Character Chooser
		let header = makeElement({ tag: 'div', className: 'item-chooser__header' });
		wrapper.appendChild(header);
		header.appendChild(makeRangeChooser());
		wrapper.appendChild(makeCharacterChooserTileGrid());
	}

	// log(`makeSingleItemTypeChooserContent`, 'end');
	return wrapper;
}

function makeRangeAndItemTypeChooser() {
	// log(`makeRangeAndItemTypeChooser`, 'start');

	const editor = getCurrentProjectEditor();
	let selectedRange = editor.selectedCharacterRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': selectedRange.name,
			'selected-id': selectedRange.id,
		},
	});
	let option;

	let ligatureCount = countItems(editor.project.ligatures);
	let componentCount = countItems(editor.project.components);

	if (ligatureCount) {
		// log(`range.name: Ligatures`);
		option = makeElement({
			tag: 'option',
			innerHTML: 'Ligatures',
			attributes: { note: `${ligatureCount}&nbsp;items` },
		});

		option.addEventListener('click', () => {
			getCurrentProjectEditor().selectedCharacterRange = 'Ligatures';
			let tileGrid = document.querySelector('.item-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.item-chooser__wrapper');
			wrapper.appendChild(makeLigatureChooserTileGrid());
		});

		optionChooser.appendChild(option);
	}

	if (componentCount) {
		// log(`range.name: Components`);
		option = makeElement({
			tag: 'option',
			innerHTML: 'Components',
			attributes: { note: `${componentCount}&nbsp;items` },
		});

		option.addEventListener('click', () => {
			getCurrentProjectEditor().selectedCharacterRange = 'Components';
			let tileGrid = document.querySelector('.item-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.item-chooser__wrapper');
			wrapper.appendChild(makeComponentChooserTileGrid());
		});

		optionChooser.appendChild(option);
	}

	if (ligatureCount || componentCount) optionChooser.appendChild(makeElement({ tag: 'hr' }));

	addRangeOptionsToOptionChooser(optionChooser);

	// log(`makeRangeAndItemTypeChooser`, 'end');
	return optionChooser;
}

function makeRangeChooser() {
	// log(`makeRangeChooser`, 'start');

	const editor = getCurrentProjectEditor();
	let selectedRange = editor.selectedCharacterRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': selectedRange.name,
			'selected-id': selectedRange.id,
		},
	});

	addRangeOptionsToOptionChooser(optionChooser);

	return optionChooser;
}

function addRangeOptionsToOptionChooser(optionChooser) {
	const project = getCurrentProject();
	let ranges = project.settings.project.characterRanges;
	let option;
	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);

		option = makeElement({
			tag: 'option',
			innerHTML: range.name,
			attributes: { note: range.note },
		});

		option.addEventListener('click', () => {
			// log(`OPTION.click - range: ${range.name}`);

			getCurrentProjectEditor().selectedCharacterRange = range;
			let tileGrid = document.querySelector('.item-chooser__tile-grid');
			// log(tileGrid);
			tileGrid.remove();
			let wrapper = document.querySelector('.item-chooser__wrapper');
			// log(wrapper);
			wrapper.appendChild(makeCharacterChooserTileGrid());
		});

		optionChooser.appendChild(option);
	});
}

function makeCharacterChooserTileGrid() {
	// log(`makeCharacterChooserTileGrid`, 'start');
	// console.time('makeCharacterChooserTileGrid');
	const editor = getCurrentProjectEditor();
	// log(editor.project.settings.project.characterRanges);
	// log(editor.selectedCharacterRange);

	let tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });
	let rangeArray = editor.selectedCharacterRange.array;
	if (rangeArray?.length) {
		rangeArray.forEach((baseHexID) => {
			const charID = `char-${baseHexID}`;
			// log(`charID: ${charID}`);
			let oneTile = new GlyphTile({ 'displayed-item-id': charID });
			if (editor.selectedCharID === charID) oneTile.setAttribute('selected', '');

			oneTile.addEventListener('click', () => savedClickHandler(charID));

			if (savedRegisterSubscriptions) {
				editor.subscribe({
					topic: 'whichGlyphIsSelected',
					subscriberID: `glyphTile.${charID}`,
					callback: (newCharID) => {
						// log('whichGlyphIsSelected subscriber callback');
						// log(`checking if ${glyph.id} === ${charID}`);
						if (parseInt(newCharID) === parseInt(charID)) {
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
	}

	// console.timeEnd('makeCharacterChooserTileGrid');
	// log(`makeCharacterChooserTileGrid`, 'end');
	return tileGrid;
}

function makeLigatureChooserTileGrid() {
	// log(`makeLigatureChooserTileGrid`, 'start');
	const editor = getCurrentProjectEditor();

	let tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });
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

function makeComponentChooserTileGrid() {
	// log(`makeComponentChooserTileGrid`, 'start');
	const editor = getCurrentProjectEditor();

	let tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });

	Object.keys(editor.project.components).forEach((componentID) => {
		let oneTile = new GlyphTile({ 'displayed-item-id': componentID });
		if (editor.selectedComponentID === componentID) oneTile.setAttribute('selected', '');

		oneTile.addEventListener('click', () => savedClickHandler(componentID));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichComponentIsSelected',
				subscriberID: `glyphTile.${componentID}`,
				callback: (newComponentID) => {
					// log('whichComponentIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${Component}`);
					if (newComponentID === componentID) {
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

	// log(`makeComponentChooserTileGrid`, 'end');
	return tileGrid;
}
