import { makeElement } from '../common/dom';
import { duplicates } from '../common/functions';
import { showToast } from '../controls/dialogs/dialogs';
import { getUnicodeBlockByName } from '../lib/unicode/unicode_blocks';
import { copyShapesFromTo } from '../panels/actions';
import { CharacterRange } from '../project_data/character_range';
import { makeGlyphWithResolvedLinks } from '../project_editor/cross_item_actions';
import { getCurrentProjectEditor, getGlyphrStudioApp } from './main';

let sourceEditor;
let destinationEditor;
let selectedItemIDs = [];

export function makePage_CrossProjectActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="cross-project-actions__page">
				<div class="cross-project-actions__page-header">
					<h1>Cross&#8209;project&nbsp;actions</h1><span></span><span id="cross-project-actions__close-button">✖</span>
					<option-chooser selected-id="Copy shapes " selected-name="Copy shapes">
						<option selected>Copy shapes</option>
					</option-chooser>
					<span id="cross-project-actions__item-count"></span>
					<span></span>
				</div>
				<div id="cross-project-actions__page-content">
				</div>
				<div id="cross-project-actions__page-footer">
				</div>
			</div>
		`,
	});

	// Set up projects
	const app = getGlyphrStudioApp();
	sourceEditor = app.otherProjectEditor;
	destinationEditor = app.selectedProjectEditor;

	// Set up window
	const closeButton = content.querySelector('#cross-project-actions__close-button');
	closeButton.addEventListener('click', () => {
		getCurrentProjectEditor().navigate();
	});

	// Make content
	updateContent_copyShapes(content.querySelector('#cross-project-actions__page-content'));
	makeFooter_copyShapes(content.querySelector('#cross-project-actions__page-footer'));

	return content;
}

function makeProjectFlipper(textPrefix = 'From') {
	let sourceProject = sourceEditor.project.settings.project;
	let destinationProject = destinationEditor.project.settings.project;
	const wrapper = makeElement({
		tag: 'span',
		id: 'cross-project-actions__project-flipper',
		innerHTML: `
			${textPrefix} project
			<code id="project-flipper-source-name"
				title="${sourceProject.name}\n${sourceProject.id}">
				${sourceProject.name}
			</code>
			to
			<code id="project-flipper-destination-name"
				title="${destinationProject.name}\n${destinationProject.id}">
				${destinationProject.name}
			</code>
		`,
	});

	const flipButton = makeElement({
		className: 'flip-button',
		innerHTML: '⮀',
		title: 'Flip from/to projects',
		onClick: flipProjects,
	});
	wrapper.appendChild(flipButton);
	return wrapper;
}

function flipProjects() {
	let temp = sourceEditor;
	sourceEditor = destinationEditor;
	destinationEditor = temp;

	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
}

function toggleCheckboxes() {
	let state = document.getElementById('toggle-all-checkbox').checked;
	const checkboxes = document.querySelectorAll('.item-select-checkbox');
	checkboxes.forEach((box) => {
		box.checked = state;
		updateSelectedIDs(box.getAttribute('item-id'), box.checked);
	});
}

function clearAllSelections() {
	selectedItemIDs = [];
	document.getElementById('cross-project-actions__item-count').innerHTML = '';
}

function updateSelectedIDs(itemID, add = true) {
	if (add) selectedItemIDs.push(itemID);
	else selectedItemIDs.splice(selectedItemIDs.indexOf(itemID), 1);
	selectedItemIDs = selectedItemIDs.filter(duplicates);
	selectedItemIDs = selectedItemIDs.filter(item => !!item);
	document.getElementById('cross-project-actions__item-count').innerHTML = `
		${selectedItemIDs.length} item${selectedItemIDs.length === 1 ? '' : 's'} selected
	`;
}

// --------------------------------------------------------------
// Copy Shapes
// --------------------------------------------------------------

function updateContent_copyShapes(parent) {
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
				tag: 'div',
				className: 'cross-project-actions__scale-warning',
				innerHTML: `
				Warning: the Em sizes for these two projects are different.
				The destination font is ${Math.round(emRatio * 100)}% ${emRatio < 1 ? 'smaller' : 'larger'}
				than the source font.
			`,
			})
		);
	}

	const table = makeElement({
		className: 'cross-project-actions__column-layout',
		id: 'cross-project-actions__character-copy',
	});

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
	makeRows(new CharacterRange(getUnicodeBlockByName('Basic Latin')), table);
	parent.appendChild(table);
}

function makeFooter_copyShapes(parent) {
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
	selectedItemIDs.forEach(itemID => {
		// log(`itemID: ${itemID}`);
		const sourceItem = sourceEditor.project.getItem(itemID);
		const destinationItem = destinationEditor.project.getItem(itemID, true);
		const resolvedGlyph = makeGlyphWithResolvedLinks(sourceItem);
		copyShapesFromTo(resolvedGlyph, destinationItem);
	});
	showToast(`Copied shapes from ${selectedItemIDs.length} items`);
	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
	clearAllSelections();
	// log(`Cross Project Actions - copyShapes`, 'end');
}

function makeRows(range, parent) {
	range.array.forEach((id) => {
		const itemID = `glyph-${id}`;
		const sourceItem = sourceEditor.project.getItem(itemID);
		const destinationItem = destinationEditor.project.getItem(itemID);
		const title = `Select glyph-${id}`;
		if (sourceItem) {
			let wrapper = makeElement({ className: 'checkbox-wrapper' });
			wrapper.appendChild(
				makeElement({
					tag: 'input',
					attributes: { type: 'checkbox', style: 'grid-column: 1;', 'item-id': itemID },
					className: 'item-select-checkbox',
					id: `checkbox-${id}`,
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
					attributes: { for: `checkbox-${id}` },
					content: sourceItem.name,
					className: 'glyph-name',
					title: title,
				})
			);
			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${id}` },
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
		}
	});
}
