import { getCurrentProjectEditor } from '../app/main.js';
import { editorText } from '../app/editor_i18n.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { closeAllInfoBubbles } from '../controls/dialogs/dialogs.js';
import { EditCanvas } from '../edit_canvas/edit_canvas.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeSingleItemTypeChooserContent } from '../panels/item_chooser.js';

const COLLECTIONS = {
	Ligatures: {
		viewProperty: 'ligatureView',
		selectedIDProperty: 'selectedLigatureID',
		selectedItemProperty: 'selectedLigature',
		selectionTopic: 'whichLigatureIsSelected',
		overviewTitleKey: 'ligatureOverviewTitle',
		overviewBodyKey: 'ligatureOverviewBody',
		backKey: 'backToLigatures',
		editingKey: 'editLigature',
	},
	Components: {
		viewProperty: 'componentView',
		selectedIDProperty: 'selectedComponentID',
		selectedItemProperty: 'selectedComponent',
		selectionTopic: 'whichComponentIsSelected',
		overviewTitleKey: 'componentOverviewTitle',
		overviewBodyKey: 'componentOverviewBody',
		backKey: 'backToComponents',
		editingKey: 'editComponent',
	},
};

export function makePage_LigaturesModern() {
	return makeCollectionPage('Ligatures');
}

export function makePage_ComponentsModern() {
	return makeCollectionPage('Components');
}

function makeCollectionPage(type) {
	const editor = getCurrentProjectEditor();
	const config = COLLECTIONS[type];
	if (editor[config.viewProperty] !== 'edit' || !editor[config.selectedItemProperty]) {
		editor[config.viewProperty] = 'overview';
		return makeCollectionOverview(editor, type, config);
	}
	return makeCollectionEditor(editor, type, config);
}

function makeCollectionOverview(editor, type, config) {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		className: 'collection-overview',
	});
	const heading = makeElement({ tag: 'header', className: 'editor-content-header' });
	const headingCopy = makeElement({ tag: 'div' });
	headingCopy.append(
		makeElement({ tag: 'span', content: editorText(type.toLowerCase()) }),
		makeElement({ tag: 'h1', content: editorText(config.overviewTitleKey) }),
		makeElement({ tag: 'p', content: editorText(config.overviewBodyKey) })
	);
	heading.appendChild(headingCopy);

	const browser = makeElement({ className: 'collection-overview__browser liquid-glass' });
	browser.appendChild(
		makeSingleItemTypeChooserContent(type, (itemID) => {
			editor[config.viewProperty] = 'edit';
			editor[config.selectedIDProperty] = itemID;
			editor.navigate();
		})
	);

	content.append(heading, browser);
	if (editor.showPageTransitions) content.classList.add('app__page-animation');
	return content;
}

function makeCollectionEditor(editor, type, config) {
	const selectedID = editor[config.selectedIDProperty];
	const selectedItem = editor[config.selectedItemProperty];
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div class="editor__page">
				<div class="editor-page__context-bar liquid-glass">
					<button type="button" class="editor-page__back-button"></button>
					<div class="editor-page__context-copy"></div>
				</div>
				<div class="editor-page__left-area">
					<h2 class="editor-page__panel-title"></h2>
					<div id="editor-page__panel"></div>
				</div>
				<div class="editor-page__tools-area"></div>
				<div class="editor-page__edit-canvas-wrapper">
					<edit-canvas id="editor-page__edit-canvas"></edit-canvas>
				</div>
				<div class="editor-page__zoom-area"></div>
			</div>`,
	});

	const backButton = content.querySelector('.editor-page__back-button');
	backButton.setAttribute('aria-label', editorText(config.backKey));
	backButton.innerHTML = `&#8592;<span>${editorText(config.backKey)}</span>`;
	backButton.addEventListener('click', () => {
		editor[config.viewProperty] = 'overview';
		editor.navigate();
	});
	const contextCopy = content.querySelector('.editor-page__context-copy');
	contextCopy.append(
		makeElement({ tag: 'span', content: editorText(config.editingKey) }),
		makeElement({ tag: 'strong', content: selectedItem.name || selectedID })
	);
	content.querySelector('.editor-page__panel-title').textContent = editorText('properties');
	content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', selectedID);

	const panel = content.querySelector('#editor-page__panel');
	panel.appendChild(makePanel());
	panel.addEventListener('scroll', closeAllInfoBubbles);
	editor.subscribe({
		topic: [config.selectionTopic, 'whichShapeIsSelected'],
		subscriberID: `${type}.modernPanel`,
		callback: () => refreshPanel(),
	});

	if (editor.selectedTool === 'kern') editor.selectedTool = 'resize';
	addAsChildren(content.querySelector('.editor-page__tools-area'), makeEditToolsButtons());
	addAsChildren(content.querySelector('.editor-page__zoom-area'), makeViewToolsButtons());

	editor.subscribe({
		topic: config.selectionTopic,
		subscriberID: `${type}.modernEditCanvas`,
		callback: (itemID) => {
			removeStopCreatingNewPathButton();
			content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', itemID);
		},
	});
	['whichShapeIsSelected', 'whichPathPointIsSelected', 'qualityChecks'].forEach((topic) => {
		editor.subscribe({
			topic,
			subscriberID: `${type}.modernEditCanvas.${topic}`,
			callback: () => {
				/** @type {EditCanvas} */
				const canvas = editor.editCanvas;
				if (canvas?.redraw) canvas.redraw(`subscription:${topic}`);
			},
		});
	});

	if (editor.showPageTransitions) content.classList.add('app__page-animation');
	return content;
}
