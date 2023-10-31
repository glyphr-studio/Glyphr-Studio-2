import { makeElement } from '../../common/dom';
import { showToast } from '../../controls/dialogs/dialogs';
import { copyShapesFromTo } from '../../panels/actions';
import { makeSingleLabel } from '../../panels/cards';
import { makeGlyphWithResolvedLinks } from '../../project_editor/cross_item_actions';
import {
	clearAllSelections,
	destinationEditor,
	makeItemAndRangeChooser,
	makeProjectFlipper,
	selectedItemIDs,
	selectedRange,
	sourceEditor,
	toggleCheckboxes,
	updateSelectedIDs,
} from './cross_project_actions';

export function updateContent_copyShapes(parent) {
	parent.innerHTML = '';
	parent.appendChild(
		makeElement({
			tag: 'p',
			content: `This action will take a copy of each path (or paths from a resolved component link)
			from the source project and insert them into the same character in the destination project.&nbsp;&nbsp;`,
		})
	);

	parent.appendChild(makeProjectFlipper('Copy shapes from'));

	let emRatio =
		destinationEditor.project.settings.font.upm / sourceEditor.project.settings.font.upm;

	if (emRatio !== 1) {
		parent.appendChild(
			makeElement({
				tag: 'input',
				attributes: { type: 'checkbox' },
				id: 'checkbox-scale',
			})
		);
		parent.appendChild(
			makeSingleLabel(
				`Scale items to match destination Em size. The destination font is ${Math.round(
					emRatio * 100
				)}% ${emRatio < 1 ? 'smaller' : 'larger'}
				than the source font.`,
				false,
				'checkbox-scale'
			)
		);
		parent.appendChild(makeElement({ tag: 'br' }));
	}
	parent.appendChild(
		makeElement({
			tag: 'input',
			attributes: { type: 'checkbox' },
			id: 'checkbox-advance-width',
		})
	);
	parent.appendChild(
		makeSingleLabel(
			'Update advance width to maintain right-side bearing',
			false,
			'checkbox-advance-width'
		)
	);
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(
		makeElement({
			tag: 'input',
			attributes: { type: 'checkbox' },
			id: 'checkbox-reverse-windings',
		})
	);
	parent.appendChild(makeSingleLabel('Reverse shape windings', false, 'checkbox-reverse-windings'));

	// Range chooser
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(
		makeItemAndRangeChooser({ showLigatures: true }, () => {
			let table = document.getElementById('cross-project-actions__character-copy-table');
			updateCharacterCopyTable(table);
		})
	);

	// Table
	const table = makeElement({
		className: 'cross-project-actions__column-layout',
		id: 'cross-project-actions__character-copy-table',
	});
	parent.appendChild(updateCharacterCopyTable(table));
}

export function updateCharacterCopyTable(table) {
	table.innerHTML = '';
	// Table column headers
	let wrapper = makeElement({
		className: 'checkbox-wrapper',
		attributes: { style: 'padding: 4px;	border-bottom: 1px solid var(--blue-l20);' },
	});

	wrapper.appendChild(
		makeElement({
			tag: 'input',
			attributes: { type: 'checkbox', style: 'grid-column: 1;' },
			className: 'item-select-checkbox',
			id: 'toggle-all-checkbox',
			title: 'Toggle selection for all rows',
			onClick: toggleCheckboxes,
		})
	);
	table.appendChild(wrapper);

	table.appendChild(
		makeElement({
			className: 'cross-project-actions__column-header',
			innerHTML: 'toggle selection for all rows',
		})
	);

	table.appendChild(
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'glyph id' })
	);

	table.appendChild(
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'from' })
	);

	table.appendChild(makeElement({ className: 'cross-project-actions__column-header' }));

	table.appendChild(
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'to' })
	);

	// Table Rows
	makeRows(selectedRange, table);

	return table;
}

function makeRows(range, parent) {
	// log(`makeRows`, 'start');
	let count = 0;

	if (range === 'Components') {
		for (let comp of Object.keys(sourceEditor.project.components)) {
			makeOneRow(comp);
		}
	} else if (range === 'Ligatures') {
		for (let liga of Object.keys(sourceEditor.project.ligatures)) {
			makeOneRow(liga);
		}
	} else {
		range.array.forEach((id) => {
			const itemID = `glyph-${id}`;
			makeOneRow(itemID);
		});
	}

	function makeOneRow(itemID) {
		const sourceItem = sourceEditor.project.getItem(itemID);
		const destinationItem = destinationEditor.project.getItem(itemID);
		const title = `Select ${itemID}`;
		if (sourceItem) {
			let wrapper = makeElement({ className: 'checkbox-wrapper' });
			wrapper.appendChild(
				makeElement({
					tag: 'input',
					attributes: { type: 'checkbox', style: 'grid-column: 1;', 'item-id': itemID },
					className: 'item-select-checkbox',
					id: `checkbox-${itemID}`,
					title: title,
					onClick: (event) => {
						updateSelectedIDs(itemID, event.target.checked);
					},
				})
			);
			parent.appendChild(wrapper);

			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${itemID}` },
					content: sourceItem.name,
					className: 'glyph-name',
					title: title,
				})
			);
			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${itemID}` },
					content: itemID,
					className: 'glyph-id',
					title: title,
				})
			);

			parent.appendChild(
				makeElement({
					className: 'thumbnail',
					innerHTML: sourceEditor.project.makeItemThumbnail(sourceItem),
					attributes: { style: 'grid-column: 4;' },
				})
			);
			parent.appendChild(makeElement({ className: 'connector', innerHTML: '➔' }));
			parent.appendChild(
				makeElement({
					className: 'thumbnail',
					innerHTML: destinationEditor.project.makeItemThumbnail(destinationItem),
					attributes: { style: 'grid-column: 6;' },
				})
			);
			count++;
		}
	}

	// log(`count: ${count}`);
	if (!count) {
		// parent.appendChild(makeElement());
		parent.appendChild(
			makeElement({ content: 'No items exist in this range', className: 'span-all-columns' })
		);
	}

	// log(`makeRows`, 'end');
}

export function updateFooter_copyShapes(parent) {
	parent.appendChild(
		makeElement({
			tag: 'fancy-button',
			content: 'Copy shapes from selected items',
			onClick: copyShapes,
		})
	);
}

function copyShapes() {
	// log(`Cross Project Actions - copyShapes`, 'start');
	// log(`\n⮟selectedItemIDs⮟`);
	// log(selectedItemIDs);
	let emRatio =
		destinationEditor.project.settings.font.upm / sourceEditor.project.settings.font.upm;
	// log(`emRatio: ${emRatio}`);

	let updateAdvanceWidth = document.getElementById('checkbox-advance-width').checked;
	// log(`updateAdvanceWidth: ${updateAdvanceWidth}`);

	let scaleItems = document.getElementById('checkbox-scale')?.checked;
	// log(`scaleItems: ${scaleItems}`);

	let reverseWindings = document.getElementById('checkbox-reverse-windings')?.checked;
	// log(`reverseWindings: ${reverseWindings}`);

	selectedItemIDs.forEach((itemID) => {
		// log(`itemID: ${itemID}`);
		const sourceItem = sourceEditor.project.getItem(itemID);
		const destinationItem = destinationEditor.project.getItem(itemID, true);
		const resolvedGlyph = makeGlyphWithResolvedLinks(sourceItem);
		// log(resolvedGlyph);

		if (scaleItems) {
			let deltaWidth = resolvedGlyph.advanceWidth * emRatio - resolvedGlyph.advanceWidth;
			// log(`deltaWidth: ${deltaWidth}`);
			resolvedGlyph.updateGlyphSize({
				width: deltaWidth,
				ratioLock: true,
				transformOrigin: 'baseline-left',
			});
		}

		if (reverseWindings) resolvedGlyph.reverseWinding();
		let oldRSB = destinationItem.rightSideBearing;

		// log(`\n⮟resolvedGlyph⮟`);
		// log(resolvedGlyph);
		// log(`\n⮟destinationItem⮟`);
		// log(destinationItem);
		copyShapesFromTo(resolvedGlyph, destinationItem);
		if (updateAdvanceWidth) destinationItem.rightSideBearing = oldRSB;
	});

	showToast(`Copied shapes from ${selectedItemIDs.length} items`);
	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
	clearAllSelections();
	// log(`Cross Project Actions - copyShapes`, 'end');
}
