import { makeElement } from '../../common/dom';
import { showToast } from '../../controls/dialogs/dialogs';
import { makeSingleLabel } from '../../panels/cards';
import { makeGlyphWithResolvedLinks } from '../../project_editor/cross_item_actions';
import {
	clearAllSelections,
	destinationEditor,
	makeProjectFlipper,
	selectedItemIDs,
	sourceEditor,
	toggleCheckboxes,
	updateSelectedIDs,
} from './cross_project_actions';

export function updateContent_addComponents(parent) {
	parent.innerHTML = '';
	parent.appendChild(
		makeElement({
			tag: 'p',
			content: `This action will duplicate the selected components from the source project and add them to the destination project, ensuring they have unique IDs. `,
		})
	);

	parent.appendChild(makeProjectFlipper('Add components from'));

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
			id: 'checkbox-reverse-windings',
		})
	);
	parent.appendChild(makeSingleLabel('Reverse shape windings', false, 'checkbox-reverse-windings'));

	// Table
	const table = makeElement({
		className: 'cross-project-actions__column-layout',
		id: 'cross-project-actions__add-item-table',
	});
	parent.appendChild(updateAddItemTable(table));
}

export function updateAddItemTable(table) {
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
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'source id' })
	);

	table.appendChild(
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'source' })
	);

	// Table Rows
	makeRows(table);

	return table;
}

function makeRows(parent) {
	// log(`makeRows`, 'start');
	let count = 0;

	for (let comp of Object.keys(sourceEditor.project.components)) {
		makeOneRow(comp);
	}

	function makeOneRow(itemID) {
		const sourceItem = sourceEditor.project.getItem(itemID);
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
			count++;
		}
	}

	// log(`count: ${count}`);
	if (!count) {
		// parent.appendChild(makeElement());
		parent.appendChild(
			makeElement({
				content: 'No components exist in the source project',
				className: 'span-all-columns',
			})
		);
	}

	// log(`makeRows`, 'end');
}

export function updateFooter_addComponents(parent) {
	parent.appendChild(
		makeElement({
			tag: 'fancy-button',
			content: 'Add components',
			onClick: addComponents,
		})
	);
}

function addComponents() {
	// log(`Cross Project Actions - addComponents`, 'start');
	let emRatio =
		destinationEditor.project.settings.font.upm / sourceEditor.project.settings.font.upm;
	// log(`emRatio: ${emRatio}`);

	let scaleItems = document.getElementById('checkbox-scale')?.checked;
	// log(`scaleItems: ${scaleItems}`);

	let reverseWindings = document.getElementById('checkbox-reverse-windings')?.checked;
	// log(`reverseWindings: ${reverseWindings}`);

	selectedItemIDs.forEach((itemID) => {
		// log(`itemID: ${itemID}`);
		const sourceItem = sourceEditor.project.getItem(itemID);
		const resolvedGlyph = makeGlyphWithResolvedLinks(sourceItem);
		resolvedGlyph.name = sourceItem.name;
		resolvedGlyph.usedIn = [];
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

		// log(`\n⮟resolvedGlyph⮟`);
		// log(resolvedGlyph);
		destinationEditor.project.addNewItem(resolvedGlyph, 'Component');
	});

	showToast(`Added ${selectedItemIDs.length} components`);
	updateContent_addComponents(document.querySelector('#cross-project-actions__page-content'));
	clearAllSelections();
	// log(`Cross Project Actions - addComponents`, 'end');
}
