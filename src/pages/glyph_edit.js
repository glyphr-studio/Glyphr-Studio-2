import { addAsChildren, makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { lookUpGlyphName } from '../lib/unicode_names.js';
import { hexToChars } from '../common/unicode.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';

/**
 * Page > Glyph Edit
 * The main edit surface for Glyphr Studio
 * Comprised of Panels of tools, and the Edit Canvas
 */
export class PageGlyphEdit {
	/**
	 * Initialize this page
	 */
	constructor() {}

	/**
	 * Load the Open Project page
	 * @returns {object} HTML Element + callback function
	 */
	makePageContent() {
		// log(`PageGlyphEdit.makePageContent`, 'start');
		const editor = getCurrentProjectEditor();
		// log('current ProjectEditor');
		// log(editor);
		// log(editor.nav);
		// log(editor.selectedGlyph);

		let canvasGlyph = hexToChars(editor.selectedGlyphID);
		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="editor__page">
				<div class="editor-page__left-area">
					<div class="left-area__navigation">
						${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Glyph edit'})}
						${makeNavButton({level: 'l2', superTitle: 'EDITING', title: lookUpGlyphName(editor.selectedGlyphID, true)})}
						${makeNavButton({level: 'l3', superTitle: 'PANEL', title: editor.nav.panel})}
					</div>
					<div class="left-area__panel"></div>
				</div>
				<div class="editor-page__tools-area"></div>
				<div class="editor-page__edit-canvas-wrapper">
					<edit-canvas id="editor-page__edit-canvas" glyphs="${canvasGlyph}"></edit-canvas>
				</div>
				<div class="editor-page__zoom-area"></div>
			</div>
		`,
		});

		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ toggleNavDropdown(l1); });

		// Glyph Selector
		let l2 = content.querySelector('#nav-button-l2');
		l2.addEventListener('click', function(){ toggleNavDropdown(l2); });
		editor.subscribe({
			topic: 'whichGlyphIsSelected',
			subscriberID: 'nav.glyphChooserButton',
			callback: (newGlyphID) => {
				l2.innerHTML = makeNavButtonContent(lookUpGlyphName(newGlyphID, true), 'EDITING');
			}
		});

		// Panel Selector
		let l3 = content.querySelector('#nav-button-l3');
		l3.addEventListener('click', function(){ toggleNavDropdown(l3); });

		// Panel
		content.querySelector('.left-area__panel').appendChild(makePanel());
		editor.subscribe({
			topic: ['whichGlyphIsSelected', 'whichPathIsSelected'],
			subscriberID: 'nav.panelChooserButton',
			callback: (newSelection) => {
				let panelContent = content.querySelector('.left-area__panel');
				panelContent.innerHTML = '';
				// panelContent.appendChild(makePanel());
				refreshPanel();
			}
		});

		// Tools
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
				let newChar = hexToChars(newGlyphID);
				// log(`new id ${newGlyphID} results in ${newChar} on the main canvas`);
				content.querySelector('#editor-page__edit-canvas').setAttribute('glyphs', newChar);
				// log(`Main Canvas subscriber callback`, 'end');
			}
		});

		editor.subscribe({
			topic: 'whichPathIsSelected',
			subscriberID: 'editCanvas.selectedPath',
			callback: () => {
				editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPath'});
			}
		});

		editor.subscribe({
			topic: 'whichPathPointIsSelected',
			subscriberID: 'editCanvas.selectedPathPoint',
			callback: () => {
				editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPathPoint'});
			}
		});


		// log(`PageGlyphEdit.makePageContent`, 'end');
		return content;
	}
}
