import { makeElement } from '../common/dom.js';
import { log } from '../common/functions.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../app/nav.js';
import { showNavDropdown } from '../app/nav.js';
import { lookUpGlyphName } from '../lib/unicode_names.js';
import { hexToChars } from '../common/unicode.js';
import { makePanel } from '../panels/panels.js';
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
	pageLoader() {
		log(`PageGlyphEdit.pageLoader`, 'start');
		let editor = getCurrentProjectEditor();
		log('current ProjectEditor');
		log(editor);
		log(editor.selectedGlyph);

		let canvasGlyph = hexToChars(editor.selectedGlyphID);
		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="glyph-edit__page">
				<div class="glyph-edit__left-area">
					<div class="glyph-edit__nav-area">
						${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Glyph edit'})}
						${makeNavButton({level: 'l2', superTitle: 'EDITING', title: lookUpGlyphName(editor.selectedGlyphID, true)})}
						${makeNavButton({level: 'l3', superTitle: 'PANEL', title: editor.nav.panel})}
					</div>
					<div class="left-area__panel"></div>
				</div>
				<div class="glyph-edit__tools-area"></div>
				<div class="glyph-edit__right-area">
					<canvas-edit id="glyph-edit__main-canvas" glyphs="${canvasGlyph}"></canvas-edit>
				</div>
				<div class="glyph-edit__zoom-area"></div>
			</div>
		`,
		});

		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ showNavDropdown(l1); });

		// Glyph Selector
		let l2 = content.querySelector('#nav-button-l2');
		l2.addEventListener('click', function(){ showNavDropdown(l2); });
		editor.subscribe({
			topic: 'whichGlyphIsSelected',
			subscriberName: 'EDITING nav button',
			callback: (newGlyphID) => {
				l2.innerHTML = makeNavButtonContent(lookUpGlyphName(newGlyphID, true), 'EDITING');
			}
		});

		// Panel Selector
		let l3 = content.querySelector('#nav-button-l3');
		l3.addEventListener('click', function(){ showNavDropdown(l3); });

		// Panel
		content.querySelector('.left-area__panel').appendChild(makePanel());
		editor.subscribe({
			topic: ['whichGlyphIsSelected', 'whichShapeIsSelected'],
			subscriberName: 'Attributes panel',
			callback: (newSelection) => {
				let panelContent = content.querySelector('.left-area__panel');
				panelContent.innerHTML = '';
				panelContent.appendChild(makePanel());
			}
		});

		// Tools
		let toolsArea = content.querySelector('.glyph-edit__tools-area');
		toolsArea.innerHTML = '';
		toolsArea.appendChild(makeEditToolsButtons());

		let zoomArea = content.querySelector('.glyph-edit__zoom-area');
		zoomArea.innerHTML = '';
		zoomArea.appendChild(makeViewToolsButtons());

		// Canvas
		editor.subscribe({
			topic: 'whichGlyphIsSelected',
			subscriberName: 'Main edit canvas',
			callback: (newGlyphID) => {
				log(`Main Canvas subscriber callback`, 'start');
				let newChar = hexToChars(newGlyphID);
				log(`new id ${newGlyphID} results in ${newChar} on the main canvas`);
				content.querySelector('#glyph-edit__main-canvas').setAttribute('glyphs', newChar);
				log(`Main Canvas subscriber callback`, 'end');
			}
		});

		editor.subscribe({
			topic: 'whichShapeIsSelected',
			subscriberName: 'Main edit canvas',
			callback: () => {
				editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedShape'});
			}
		});

		const callback = function () {};

		log(`PageGlyphEdit.pageLoader`, 'end');

		return { content: content, callback: callback };
	}
}
