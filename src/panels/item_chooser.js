import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { GlyphTile } from '../controls/glyph-tile/glyph_tile.js';
import { showAddComponentDialog } from '../pages/components.js';
import { makeKernGroupCharChips, showAddEditKernGroupDialog } from '../pages/kerning.js';
import { showAddLigatureDialog } from '../pages/ligatures.js';

// --------------------------------------------------------------
// Chooser panels
// --------------------------------------------------------------

// --------------------------------------------------------------
// Glyph chooser
// --------------------------------------------------------------

let savedClickHandler;
let savedRegisterSubscriptions;

export function makeAllItemTypeChooserContent(clickHandler, type = false, editor = getCurrentProjectEditor()) {
	// log(`makeAllItemTypeChooserContent`, 'start');
	// log(`\n⮟editor⮟`);
	// log(editor);
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = true;

	let wrapper = makeElement({ tag: 'div', className: 'glyph-chooser__wrapper' });
	let header = makeElement({ tag: 'div', className: 'glyph-chooser__header' });
	header.appendChild(makeRangeAndItemTypeChooser(editor));
	wrapper.appendChild(header);

	let show = type || editor.nav.page;
	if (show === 'Ligatures') {
		// Ligature Chooser
		wrapper.appendChild(makeLigatureChooserTileGrid(editor));
	} else if (show === 'Components') {
		// Component Chooser
		wrapper.appendChild(makeComponentChooserTileGrid(editor));
	} else {
		// Overview and Glyph = Glyph Chooser
		wrapper.appendChild(makeGlyphChooserTileGrid(editor));
	}

	// log(`makeAllItemTypeChooserContent`, 'end');
	return wrapper;
}

export function makeSingleItemTypeChooserContent(itemPageName, clickHandler) {
	// log(`makeSingleItemTypeChooserContent`, 'start');
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = true;
	let wrapper = makeElement({ tag: 'div', className: 'glyph-chooser__wrapper' });

	if (itemPageName === 'Ligatures') {
		// Ligature Chooser
		wrapper.appendChild(makeLigatureChooserTileGrid());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create new ligature',
				onClick: showAddLigatureDialog,
			})
		);
	} else if (itemPageName === 'Components') {
		// Component Chooser
		wrapper.appendChild(makeComponentChooserTileGrid());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create new component',
				onClick: showAddComponentDialog,
			})
		);
	} else if (itemPageName === 'Kerning') {
		// Component Chooser
		wrapper.appendChild(makeKernGroupChooserList());
		wrapper.appendChild(
			makeElement({
				tag: 'fancy-button',
				innerHTML: 'Create a new kern group',
				onClick: () => showAddEditKernGroupDialog(false),
			})
		);
	} else {
		// Glyph Chooser
		let header = makeElement({ tag: 'div', className: 'glyph-chooser__header' });
		wrapper.appendChild(header);
		header.appendChild(makeRangeChooser());
		wrapper.appendChild(makeGlyphChooserTileGrid());
	}

	// log(`makeSingleItemTypeChooserContent`, 'end');
	return wrapper;
}

export function makeRangeAndItemTypeChooser(editor = getCurrentProjectEditor()) {
	// log(`makeRangeAndItemTypeChooser`, 'start');

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
			editor.selectedCharacterRange = 'Ligatures';
			let tileGrid = document.querySelector('.glyph-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.glyph-chooser__wrapper');
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
			editor.selectedCharacterRange = 'Components';
			let tileGrid = document.querySelector('.glyph-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.glyph-chooser__wrapper');
			wrapper.appendChild(makeComponentChooserTileGrid());
		});

		optionChooser.appendChild(option);
	}

	if (ligatureCount || componentCount) optionChooser.appendChild(makeElement({ tag: 'hr' }));

	addRangeOptionsToOptionChooser(optionChooser, editor);

	// log(`makeRangeAndItemTypeChooser`, 'end');
	return optionChooser;
}

function makeRangeChooser(editor = getCurrentProjectEditor()) {

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

function addRangeOptionsToOptionChooser(optionChooser, editor = getCurrentProjectEditor()) {
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

			editor.selectedCharacterRange = range;
			let tileGrid = document.querySelector('.glyph-chooser__tile-grid');
			// log(tileGrid);
			tileGrid.remove();
			let wrapper = document.querySelector('.glyph-chooser__wrapper');
			// log(wrapper);
			wrapper.appendChild(makeGlyphChooserTileGrid());
		});

		optionChooser.appendChild(option);
	});
}

function makeGlyphChooserTileGrid(editor = getCurrentProjectEditor()) {
	// log(`makeGlyphChooserTileGrid`, 'start');
	// console.time('makeGlyphChooserTileGrid');
	// log(editor.project.settings.project.characterRanges);
	// log(editor.selectedCharacterRange);

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });
	let rangeArray = editor.selectedCharacterRange.getMembers(
		editor.project.settings.app.showNonCharPoints
	);
	if (rangeArray?.length) {
		rangeArray.forEach((charID) => {
			const glyphID = `glyph-${charID}`;
			// log(`glyphID: ${glyphID}`);
			let oneTile = new GlyphTile({ 'displayed-item-id': glyphID, project: editor.project });
			if (editor.selectedGlyphID === glyphID) oneTile.setAttribute('selected', '');

			oneTile.addEventListener('click', () => savedClickHandler(glyphID));

			if (savedRegisterSubscriptions) {
				editor.subscribe({
					topic: 'whichGlyphIsSelected',
					subscriberID: `glyphTile.${glyphID}`,
					callback: (newGlyphID) => {
						// log('whichGlyphIsSelected subscriber callback');
						// log(`checking if ${newGlyphID} === ${glyphID}`);
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
	}

	// console.timeEnd('makeGlyphChooserTileGrid');
	// log(`makeGlyphChooserTileGrid`, 'end');
	return tileGrid;
}

function makeLigatureChooserTileGrid(editor = getCurrentProjectEditor()) {
	// log(`makeLigatureChooserTileGrid`, 'start');

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

function makeComponentChooserTileGrid(editor = getCurrentProjectEditor()) {
	// log(`makeComponentChooserTileGrid`, 'start');

	let tileGrid = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });

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

function makeKernGroupChooserList(editor = getCurrentProjectEditor()) {
	// log(`makeKernGroupChooserList`, 'start');

	let kernGroupRows = makeElement({ tag: 'div', className: 'kern-group-chooser__list' });

	Object.keys(editor.project.kerning).forEach((kernID) => {
		let oneRow = makeOneKernGroupRow(kernID);
		if (editor.selectedKernGroupID === kernID) oneRow.setAttribute('selected', '');

		oneRow.addEventListener('click', () => savedClickHandler(kernID));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichKernGroupIsSelected',
				subscriberID: `kernGroupRow.${kernID}`,
				callback: (newKernGroupID) => {
					// log('whichKernGroupIsSelected subscriber callback');
					if (newKernGroupID === kernID) {
						oneRow.setAttribute('selected', '');
					} else {
						oneRow.removeAttribute('selected');
					}
				},
			});
		}

		kernGroupRows.appendChild(oneRow);
	});

	// log(`makeKernGroupChooserList`, 'end');
	return kernGroupRows;
}

export function makeOneKernGroupRow(kernID, project = getCurrentProject()) {
	// log(`makeOneKernGroupRow`, 'start');
	// log(`kernID: ${kernID}`);

	const kernGroup = project.getItem(kernID);
	const rowWrapper = makeElement({ className: 'kern-group-chooser__row' });
	const leftMembers = makeElement({
		className: 'kern-group-chooser__left-members',
	});
	leftMembers.appendChild(makeKernGroupCharChips(kernGroup.leftGroup));
	const rightMembers = makeElement({
		className: 'kern-group-chooser__right-members',
	});
	rightMembers.appendChild(makeKernGroupCharChips(kernGroup.rightGroup));

	addAsChildren(rowWrapper, [
		makeElement({ content: kernID }),
		leftMembers,
		makeElement({ className: 'kern-group-chooser__members-divider', content: '&emsp;|&emsp;' }),
		rightMembers,
	]);

	// log(rowWrapper);
	// log(`makeOneKernGroupRow`, 'end');
	return rowWrapper;
}
