import { getCurrentProjectEditor } from '../app/main.js';
import { editorText } from '../app/editor_i18n.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { closeAllInfoBubbles } from '../controls/dialogs/dialogs.js';
import { EditCanvas } from '../edit_canvas/edit_canvas.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeAllItemTypeChooserContent } from '../panels/item_chooser.js';
import { ProjectEditor } from '../project_editor/project_editor.js';

/**
 * Page > Characters
 * The main edit surface for Glyphr Studio, comprised of Panels of tools, and the Edit Canvas.
 * @returns {Element} - page content
 */
export function makePage_Characters() {
	/** @type {ProjectEditor} */
	const editor = getCurrentProjectEditor();
	if (editor.characterView !== 'edit') return makeCharacterOverview(editor);

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="editor__page">
			<div class="editor-page__context-bar liquid-glass">
				<button type="button" class="editor-page__back-button" aria-label="${editorText(
					'backToCharacters'
				)}">&#8592;<span>${editorText('backToCharacters')}</span></button>
				<div class="editor-page__context-copy">
					<span>${editorText('editCharacter')}</span>
					<strong>${getItemNameWithFallback(editor.selectedGlyphID)}</strong>
				</div>
			</div>
			<div class="editor-page__left-area">
				<h2 class="editor-page__panel-title">${editorText('properties')}</h2>
				<div id="editor-page__panel"></div>
			</div>
			<div class="editor-page__tools-area"></div>
			<div class="editor-page__edit-canvas-wrapper">
				<edit-canvas id="editor-page__edit-canvas" editing-item-id="${
					editor.selectedGlyphID
				}"></edit-canvas>
			</div>
			<div class="editor-page__zoom-area"></div>
		</div>
	`,
	});

	if (editor.showPageTransitions) content.classList.add('app__page-animation');

	content.querySelector('.editor-page__back-button').addEventListener('click', () => {
		editor.characterView = 'overview';
		editor.navigate();
	});

	// Panel
	const panel = content.querySelector('#editor-page__panel');

	panel.appendChild(makePanel());
	panel.addEventListener('scroll', closeAllInfoBubbles);
	editor.subscribe({
		topic: ['whichGlyphIsSelected', 'whichShapeIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	if (editor.selectedTool === 'kern') editor.selectedTool = 'resize';
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeEditToolsButtons();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichGlyphIsSelected',
		subscriberID: 'editCanvas.selectedGlyph',
		callback: (newGlyphID) => {
			// log(`Main Canvas subscriber callback`, 'start');
			removeStopCreatingNewPathButton();
			// log(`new id ${newGlyphID} on the main canvas`);
			content
				.querySelector('#editor-page__edit-canvas')
				.setAttribute('editing-item-id', newGlyphID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	const simpleRedraws = ['whichShapeIsSelected', 'whichPathPointIsSelected', 'qualityChecks'];

	simpleRedraws.forEach((topic) => {
		editor.subscribe({
			topic: topic,
			subscriberID: `editCanvas.${topic}`,
			callback: () => {
				/** @type {EditCanvas} */
				const canvas = editor.editCanvas;
				if (canvas.redraw) canvas.redraw('subscription:simpleRedraws');
			},
		});
	});

	return content;
}

/**
 * Character browsing is a separate page state from glyph editing. This keeps
 * the Characters destination useful as an overview instead of immediately
 * dropping users into whichever glyph happened to be selected last.
 * @param {ProjectEditor} editor - current project editor
 * @returns {HTMLElement}
 */
function makeCharacterOverview(editor) {
	const content = makeElement({ tag: 'div', id: 'app__page', className: 'characters-overview' });
	const heading = makeElement({
		tag: 'header',
		className: 'editor-content-header',
		innerHTML: `<div><span>${editorText('characters')}</span><h1>${editorText(
			'characterOverviewTitle'
		)}</h1><p>${editorText('characterOverviewBody')}</p></div>`,
	});

	const browser = makeElement({ className: 'characters-overview__browser liquid-glass' });
	browser.appendChild(
		makeAllItemTypeChooserContent(
			(itemID) => {
				editor.characterView = 'edit';
				editor.selectedGlyphID = itemID;
			},
			'Characters',
			editor
		)
	);

	content.append(heading, browser);
	if (editor.showPageTransitions) content.classList.add('app__page-animation');
	return content;
}

/**
 *
 * @param {String | false} itemID - ID of the item
 * @returns {String} - name of the item
 */
export function getItemNameWithFallback(itemID) {
	// log(`getItemNameWithFallback`, 'start');
	// log(`itemID: ${itemID}`);
	if (!itemID) return '[no id]';
	const editor = getCurrentProjectEditor();
	let charName = editor.project.getItemName(itemID, true);

	// log(`charName: ${charName}`);
	// log(`getItemNameWithFallback`, 'end');
	return charName;
}
