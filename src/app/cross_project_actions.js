import { makeElement } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { getUnicodeBlockByName } from '../lib/unicode/unicode_blocks';
import { copyShapesFromTo } from '../panels/actions';
import { CharacterRange } from '../project_data/character_range';
import { getCurrentProjectEditor, getGlyphrStudioApp } from './main';

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

	const closeButton = content.querySelector('#cross-project-actions__close-button');
	closeButton.addEventListener('click', () => {
		getCurrentProjectEditor().navigate();
	});

	makeContent_copyShapes(content.querySelector('#cross-project-actions__page-content'));
	makeFooter_copyShapes(content.querySelector('#cross-project-actions__page-footer'));

	return content;
}

function makeContent_copyShapes(parent) {
	parent.innerHTML = '';
	parent.appendChild(
		makeElement({
			content: 'Copy glyph shapes from one project to another',
		})
	);

	const table = makeElement({
		className: 'cross-project-actions__column-layout',
		id: 'cross-project-actions__character-copy',
		// innerHTML: `
		// 	<span>&nbsp;</span>
		// 	<h2 class="source">Source ID</h2>
		// 	<h2 class="source">Name</h2>
		// 	<span>&nbsp;</span>
		// 	<span>&nbsp;</span>
		// 	<span>&nbsp;</span>
		// `,
	});

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
	const app = getGlyphrStudioApp();
	const sourceEditor = app.otherProjectEditor;
	const destinationEditor = app.selectedProjectEditor;
	const checkboxes = document.querySelectorAll('.copy-shapes-checkbox');
	let count = 0;
	checkboxes.forEach((box) => {
		if (box.checked) {
			const id = box.id.substring('checkbox-'.length);
			log(`id: ${id}`);
			const sourceItem = sourceEditor.project.getItem(`glyph-${id}`);
			const destinationItem = destinationEditor.project.getItem(`glyph-${id}`, true);
			copyShapesFromTo(sourceItem, destinationItem);
			count++;
		}
	});
	showToast(`Copied shapes from ${count} items`);
	makeContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
	log(`Cross Project Actions - copyShapes`, 'end');
}

function makeRows(range, parent) {
	const app = getGlyphrStudioApp();
	const sourceEditor = app.otherProjectEditor;
	const destinationEditor = app.selectedProjectEditor;

	range.array.forEach((id) => {
		const sourceItem = sourceEditor.project.getItem(`glyph-${id}`);
		const destinationItem = destinationEditor.project.getItem(`glyph-${id}`);
		if (sourceItem) {
			let wrapper = makeElement({ className: 'checkbox-wrapper' });
			wrapper.appendChild(
				makeElement({
					tag: 'input',
					attributes: { type: 'checkbox', style: 'grid-column: 1;' },
					className: 'copy-shapes-checkbox',
					id: `checkbox-${id}`,
				})
			);
			parent.appendChild(wrapper);

			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${id}` },
					content: sourceItem.name,
					className: 'glyph-name',
				})
			);
			parent.appendChild(
				makeElement({
					tag: 'label',
					attributes: { for: `checkbox-${id}` },
					content: `glyph-${id}`,
					className: 'glyph-id',
				})
			);

			parent.appendChild(
				makeElement({
					className: 'thumbnail',
					innerHTML: sourceEditor.project.makeItemThumbnail(sourceItem),
					attributes: { style: 'grid-column: 4;' },
				})
			);
			parent.appendChild(makeElement({ content: ' ➔ ', attributes: { style: 'grid-column: 5;' } }));
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
