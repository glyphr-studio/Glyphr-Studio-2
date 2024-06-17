import { addAsChildren, makeElement } from '../../common/dom.js';
import { showToast } from '../../controls/dialogs/dialogs.js';
import { makeKernGroupCharChips } from '../../pages/kerning.js';
import { makeSingleLabel } from '../../panels/cards.js';
import { KernGroup } from '../../project_data/kern_group.js';
import {
	clearAllSelections,
	destinationEditor,
	makeProjectFlipper,
	selectedItemIDs,
	sourceEditor,
	toggleCheckboxes,
	updateSelectedIDs,
} from './cross_project_actions.js';

export function updateContent_addKernGroups(parent) {
	parent.innerHTML = '';
	parent.appendChild(
		makeElement({
			tag: 'p',
			content: `This action will duplicate the selected kern groups from the source project, and add them to the destination as new kern groups. If the destination project already has an identical kern group, then the value will <strong>not</strong> be copied over.`,
		})
	);

	parent.appendChild(makeProjectFlipper('Add kern groups from'));

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
				`Scale kern values to match destination Em size. The destination font is ${Math.round(
					emRatio * 100
				)}% ${emRatio < 1 ? 'smaller' : 'larger'}
				than the source font.`,
				false,
				'checkbox-scale'
			)
		);
		parent.appendChild(makeElement({ tag: 'br' }));
	}

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
		makeElement({ className: 'cross-project-actions__column-header', innerHTML: 'value' })
	);

	// Table Rows
	makeRows(table);

	return table;
}

function makeRows(parent) {
	// log(`makeRows`, 'start');
	let count = 0;

	for (let group of Object.keys(sourceEditor.project.kerning)) {
		makeOneRow(group);
	}

	function makeOneRow(itemID) {
		const sourceItem = sourceEditor.project.getItem(itemID);
		const title = `Select ${itemID}`;
		if (sourceItem) {
			// Checkbox
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

			// Label with kern chips
			let kernLabel = makeElement({
				tag: 'label',
				attributes: { for: `checkbox-${itemID}` },
				title: title,
				className: 'kern-chip-wrapper',
			});
			const leftMembers = makeElement({
				className: 'kern-group-chooser__left-members',
			});
			leftMembers.appendChild(makeKernGroupCharChips(sourceItem.leftGroup));
			const rightMembers = makeElement({
				className: 'kern-group-chooser__right-members',
			});
			rightMembers.appendChild(makeKernGroupCharChips(sourceItem.rightGroup));
			addAsChildren(kernLabel, [
				leftMembers,
				makeElement({
					className: 'kern-group-chooser__members-divider',
					content: '&emsp;|&emsp;',
				}),
				rightMembers,
			]);
			parent.appendChild(kernLabel);

			// ID
			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${itemID}` },
					content: itemID,
					className: 'text-value',
					title: title,
				})
			);

			// Value
			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${itemID}` },
					content: sourceItem.value,
					className: 'text-value',
					title: title,
				})
			);
			count++;
		}
	}

	// log(`count: ${count}`);
	if (!count) {
		parent.appendChild(
			makeElement({
				content: 'No kern groups exist in the source project',
				className: 'span-all-columns',
			})
		);
	}

	// log(`makeRows`, 'end');
}

export function updateFooter_addKernGroups(parent) {
	parent.appendChild(
		makeElement({
			tag: 'fancy-button',
			content: 'Add kern groups',
			onClick: addKernGroups,
		})
	);
}

function addKernGroups() {
	// log(`Cross Project Actions - addKernGroups`, 'start');

	if (selectedItemIDs.length === 0) {
		showToast(
			`
			No items selected.<br>Use the checkboxes on each row to select items,
			or use the checkbox at the top of the column to select all.`,
			6000
		);
		return;
	}

	let emRatio =
		destinationEditor.project.settings.font.upm / sourceEditor.project.settings.font.upm;
	// log(`emRatio: ${emRatio}`);

	let scaleItems = document.getElementById('checkbox-scale')?.checked;
	// log(`scaleItems: ${scaleItems}`);

	destinationEditor.history.addWholeProjectChangePreState(
		`Cross-project action: from ${sourceEditor.project.settings.project.name}<br>
		Added ${selectedItemIDs.length} kern groups`
	);
	selectedItemIDs.forEach((itemID) => {
		// log(`itemID: ${itemID}`);
		const sourceItem = sourceEditor.project.getItem(itemID);
		const newItem = new KernGroup(sourceItem);
		if (scaleItems) newItem.value *= emRatio;

		// log(`\n⮟newItem⮟`);
		// log(newItem);
		destinationEditor.project.addItemByType(newItem, 'KernGroup');
	});

	destinationEditor.history.addWholeProjectChangePostState();
	showToast(`Added ${selectedItemIDs.length} kern groups`);
	updateContent_addKernGroups(document.querySelector('#cross-project-actions__page-content'));
	clearAllSelections();
	// log(`Cross Project Actions - addKernGroups`, 'end');
}
