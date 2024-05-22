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

export function makeAllItemTypeChooserContent(
	clickHandler,
	type = false,
	editor = getCurrentProjectEditor()
) {
	// log(`makeAllItemTypeChooserContent`, 'start');
	// log(`\n⮟editor⮟`);
	// log(editor);
	savedClickHandler = clickHandler;
	savedRegisterSubscriptions = true;

	let wrapper = makeElement({ tag: 'div', className: 'item-chooser__wrapper' });
	let header = makeElement({ tag: 'div', className: 'item-chooser__header' });
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
	let wrapper = makeElement({ tag: 'div', className: 'item-chooser__wrapper' });

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
		let header = makeElement({ tag: 'div', className: 'item-chooser__header' });
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
			editor.selectedCharacterRange = 'Components';
			let tileGrid = document.querySelector('.item-chooser__tile-grid');
			tileGrid.remove();
			let wrapper = document.querySelector('.item-chooser__wrapper');
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
		if (range.enabled) {
			// log(`range.name: ${range.name}`);

			option = makeElement({
				tag: 'option',
				innerHTML: range.name,
				attributes: { note: range.note },
			});

			option.addEventListener('click', () => {
				// log(`OPTION.click - range: ${range.name}`);

				editor.selectedCharacterRange = range;
				let tileGrid = document.querySelector('.item-chooser__tile-grid');
				// log(tileGrid);
				tileGrid.remove();
				let wrapper = document.querySelector('.item-chooser__wrapper');
				// log(wrapper);
				wrapper.appendChild(makeGlyphChooserTileGrid());
			});

			optionChooser.appendChild(option);
		}
	});
}

function makeGlyphChooserTileGrid(editor = getCurrentProjectEditor()) {
	// log(`makeGlyphChooserTileGrid`, 'start');
	// console.time('makeGlyphChooserTileGrid');
	// log(editor.project.settings.project.characterRanges);
	// log(editor.selectedCharacterRange);

	let tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });
	let rangeArray = editor.selectedCharacterRange.getMemberIDs(
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

	const tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });
	const sortedLigatures = editor.project.sortedLigatures;
	const pagedLigatures = getItemsFromPage(sortedLigatures, editor.chooserPage.ligatures, editor);

	if (sortedLigatures.length > pagedLigatures.length) {
		tileGrid.appendChild(makePageControl('ligatures', sortedLigatures, editor));
	}

	pagedLigatures.forEach((ligature) => {
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

	let tileGrid = makeElement({ tag: 'div', className: 'item-chooser__tile-grid' });
	const sortedComponents = editor.project.sortedComponents;
	const pagedComponents = getItemsFromPage(sortedComponents, editor.chooserPage.components, editor);

	if (sortedComponents.length > pagedComponents.length) {
		tileGrid.appendChild(makePageControl('components', sortedComponents, editor));
	}

	pagedComponents.forEach((component) => {
		let oneTile = new GlyphTile({ 'displayed-item-id': component.id });
		if (editor.selectedComponentID === component.id) oneTile.setAttribute('selected', '');

		oneTile.addEventListener('click', () => savedClickHandler(component.id));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichComponentIsSelected',
				subscriberID: `glyphTile.${component.id}`,
				callback: (newComponentID) => {
					// log('whichComponentIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${Component}`);
					if (newComponentID === component.id) {
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
	const sortedKernGroups = editor.project.sortedKernGroups;
	const pagedComponents = getItemsFromPage(sortedKernGroups, editor.chooserPage.kerning, editor);

	// log(`\n⮟pagedComponents⮟`);
	// log(pagedComponents);

	if (sortedKernGroups.length > pagedComponents.length) {
		kernGroupRows.appendChild(makePageControl('kerning', sortedKernGroups, editor));
	}

	pagedComponents.forEach((kernGroup) => {
		// log(kernGroup);
		let oneRow = makeOneKernGroupRow(kernGroup.id);
		if (editor.selectedKernGroupID === kernGroup.id) oneRow.setAttribute('selected', '');

		oneRow.addEventListener('click', () => savedClickHandler(kernGroup.id));

		if (savedRegisterSubscriptions) {
			editor.subscribe({
				topic: 'whichKernGroupIsSelected',
				subscriberID: `kernGroupRow.${kernGroup.id}`,
				callback: (newKernGroupID) => {
					// log('whichKernGroupIsSelected subscriber callback');
					if (newKernGroupID === kernGroup.id) {
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

// --------------------------------------------------------------
// Paging
// --------------------------------------------------------------

function getItemsFromPage(itemsArray = [], pageNumber = 0, editor = getCurrentProjectEditor()) {
	const pageSize = parseInt(editor.project.settings.app.itemChooserPageSize) || 256;
	if (itemsArray.length < pageSize) return itemsArray;
	const startIndex = pageNumber * pageSize;
	const endIndex = startIndex + pageSize;
	let resultArray = itemsArray.slice(startIndex, endIndex);
	return resultArray;
}

function makePageControl(area, allItems = [], editor = getCurrentProjectEditor()) {
	const refreshFunctions = {
		ligatures: makeLigatureChooserTileGrid,
		components: makeComponentChooserTileGrid,
		kerning: makeKernGroupChooserList,
	};

	const pageSize = parseInt(editor.project.settings.app.itemChooserPageSize) || 256;
	const currentPage = editor.chooserPage[area];
	const totalPages = Math.ceil(allItems.length / pageSize);
	const previousButton = makeElement({
		tag: 'button',
		className: 'editor-page__tool',
		content: '◁',
	});
	if (editor.chooserPage[area] === 0) {
		previousButton.setAttribute('disabled', '');
	} else {
		previousButton.addEventListener('click', () => {
			editor.chooserPage[area] -= 1;
			editor.chooserPage[area] = Math.max(editor.chooserPage[area], 0);
			let tileGrid;
			if (area === 'kerning') tileGrid = document.querySelector('.kern-group-chooser__list');
			else tileGrid = document.querySelector('.item-chooser__tile-grid');
			tileGrid.innerHTML = '';
			tileGrid.appendChild(refreshFunctions[area]());
		});
	}

	const nextButton = makeElement({
		tag: 'button',
		className: 'editor-page__tool',
		content: '▷',
	});
	if (editor.chooserPage[area] === totalPages - 1) {
		nextButton.setAttribute('disabled', '');
	} else {
		nextButton.addEventListener('click', () => {
			editor.chooserPage[area] += 1;
			editor.chooserPage[area] = Math.min(editor.chooserPage[area], totalPages - 1);
			let tileGrid;
			if (area === 'kerning') tileGrid = document.querySelector('.kern-group-chooser__list');
			else tileGrid = document.querySelector('.item-chooser__tile-grid');
			tileGrid.innerHTML = '';
			tileGrid.appendChild(refreshFunctions[area]());
		});
	}

	const pageControlWrapper = makeElement({ tag: 'div', className: 'item-chooser__page-control' });
	addAsChildren(pageControlWrapper, [
		previousButton,
		makeElement({ content: `Page ${currentPage + 1} of ${totalPages}` }),
		nextButton,
	]);

	return pageControlWrapper;
}
