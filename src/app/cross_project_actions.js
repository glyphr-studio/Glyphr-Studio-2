import { makeElement } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { getUnicodeBlockByName } from '../lib/unicode/unicode_blocks';
import { copyShapesFromTo } from '../panels/actions';
import { CharacterRange } from '../project_data/character_range';
import { makeGlyphWithResolvedLinks } from '../project_editor/cross_item_actions';
import { getCurrentProjectEditor, getGlyphrStudioApp } from './main';


let sourceEditor;
let destinationEditor;
export function makePage_CrossProjectActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="cross-project-actions__page">
				<div class="cross-project-actions__page-header">
					<h1>Cross-project actions</h1>
					<span id="cross-project-actions__close-button">✖</span>
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

function makeProjectFlipper() {
	const wrapper = makeElement({
		tag: 'div',
		id: 'cross-project-actions__project-flipper',
		innerHTML: `
			From project
			<code id="project-flipper-source-name">${sourceEditor.project.settings.project.name}</code>
			to
			<code id="project-flipper-destination-name">${destinationEditor.project.settings.project.name}</code>
		`,
	});

	const flipButton = makeElement({
		className: 'flip-button',
		innerHTML: '⇄',
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
	// document.getElementById('project-flipper-source-name').innerHTML =
	// 	sourceEditor.project.settings.project.name;
	// document.getElementById('project-flipper-destination-name').innerHTML =
	// 	destinationEditor.project.settings.project.name;

	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
}

function updateContent_copyShapes(parent) {
	parent.innerHTML = '';
	parent.appendChild(
		makeElement({
			content: 'Copy glyph shapes from one project to another.',
		})
	);

	parent.appendChild(makeProjectFlipper());

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
	log(`Cross Project Actions - copyShapes`, 'start');

	const checkboxes = document.querySelectorAll('.item-select-checkbox');
	let count = 0;
	checkboxes.forEach((box) => {
		if (box.checked) {
			const id = box.id.substring('checkbox-'.length);
			log(`id: ${id}`);
			const sourceItem = sourceEditor.project.getItem(`glyph-${id}`);
			const destinationItem = destinationEditor.project.getItem(`glyph-${id}`, true);
			const resolvedGlyph = makeGlyphWithResolvedLinks(sourceItem);
			copyShapesFromTo(resolvedGlyph, destinationItem);
			count++;
		}
	});
	showToast(`Copied shapes from ${count} items`);
	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
	log(`Cross Project Actions - copyShapes`, 'end');
}

function toggleCheckboxes() {
	let state = document.getElementById('toggle-all-checkbox').checked;
	const checkboxes = document.querySelectorAll('.item-select-checkbox');
	checkboxes.forEach((box) => (box.checked = state));
}

function makeRows(range, parent) {
	range.array.forEach((id) => {
		const sourceItem = sourceEditor.project.getItem(`glyph-${id}`);
		const destinationItem = destinationEditor.project.getItem(`glyph-${id}`);
		const title = `Select glyph-${id}`;
		if (sourceItem) {
			let wrapper = makeElement({ className: 'checkbox-wrapper' });
			wrapper.appendChild(
				makeElement({
					tag: 'input',
					attributes: { type: 'checkbox', style: 'grid-column: 1;' },
					className: 'item-select-checkbox',
					id: `checkbox-${id}`,
					title: title,
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
					content: `glyph-${id}`,
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
