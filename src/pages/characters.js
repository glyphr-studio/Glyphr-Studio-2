import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { closeAllInfoBubbles } from '../controls/dialogs/dialogs.js';
import { EditCanvas } from '../edit_canvas/edit_canvas.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import {
	makeNavButton,
	makeNavButtonContent,
	toggleNavDropdown,
} from '../project_editor/navigator.js';
import { ProjectEditor } from '../project_editor/project_editor.js';

/**
 * Page > Characters
 * The main edit surface for Glyphr Studio
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Characters() {
	// log(`makePage_Characters`, 'start');
	/** @type {ProjectEditor} */
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedGlyphID: ${editor.selectedGlyphID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Characters' })}
					${makeNavButton({
						level: 'l2',
						superTitle: 'EDITING',
						title: editor.project.getItemName(editor.selectedGlyphID, true),
					})}
					${makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel })}
				</div>
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

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});
	// Glyph Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichGlyphIsSelected',
		subscriberID: 'nav.glyphChooserButton',
		callback: (newGlyphID) => {
			l2.innerHTML = makeNavButtonContent(editor.project.getItemName(newGlyphID, true), 'EDITING');
		},
	});

	// Panel Selector
	let l3 = content.querySelector('#nav-button-l3');
	l3.addEventListener('click', function () {
		toggleNavDropdown(l3);
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

	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: 'editCanvas.selectedPath',
		callback: () => {
			removeStopCreatingNewPathButton();
			/** @type {EditCanvas} */
			const canvas = editor.editCanvas;
			if (canvas.redraw) canvas.redraw();
		},
	});

	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'editCanvas.selectedPathPoint',
		callback: () => {
			/** @type {EditCanvas} */
			const canvas = editor.editCanvas;
			if (canvas.redraw) canvas.redraw();
		},
	});

	// log(`makePage_Characters`, 'end');
	return content;
}
