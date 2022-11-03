import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > Live preview
 * Preview text blocks made up of the font
 * currently being edited.
 */
export function makePage_LivePreview() {
	log(`makePage_LivePreview`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(editor.selectedGlyph);

	let previewString = 'A Pack my box with five dozen liquor jugs!';
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Live preview' })}
				</div>
				<div class="content-page__panel"></div>
			</div>
			<div class="content-page__preview-canvas-wrapper">
				<display-canvas id="content-page__preview-canvas" glyphs="${previewString}"></display-canvas>
			</div>
		</div>
	`,
	});

	editor.previewCanvas = content.querySelector('#content-page__preview-canvas');
	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	let panelArea = content.querySelector('.content-page__panel');
	panelArea.appendChild(
		makeElement({
			tag: 'div',
			className: 'panel__card full-width',
			innerHTML: '<button id="livePreviewRefresh">Refresh</button>',
		})
	);

	panelArea.querySelector('#livePreviewRefresh').addEventListener('click', () => {
		getCurrentProjectEditor().previewCanvas.redraw();
	});

	log(`makePage_LivePreview`, 'end');
	return content;
}
