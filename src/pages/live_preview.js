import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { DisplayCanvas } from '../display_canvas/display_canvas.js';
import { makePanel_LivePreview } from '../panels/live_preview.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > Live preview
 * Preview text blocks made up of the font
 * currently being edited.
 */

export function makePage_LivePreview() {
	// log(`makePage_LivePreview`, 'start');
	// const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(editor.selectedGlyph);

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Live preview' })}
				</div>
				<div id="content-page__panel"></div>
			</div>
			<div class="live-preview-page__canvas-wrapper"></div>
		</div>
		`,
	});

	let canvasWrapper = content.querySelector('.live-preview-page__canvas-wrapper');
	const editor = getCurrentProjectEditor();
	const livePreviewOptions = editor.livePreviewPageOptions;
	canvasWrapper.appendChild(new DisplayCanvas(livePreviewOptions));

	window.addEventListener('resize', livePreviewPageWindowResize);

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	let panelArea = content.querySelector('#content-page__panel');
	addAsChildren(panelArea, makePanel_LivePreview(editor.livePreviewPageOptions));

	// log(`makePage_LivePreview`, 'end');
	return content;
}

export function livePreviewPageWindowResize() {
	// log(`livePreviewPageWindowResize`, 'start');
	const wrapper = document.querySelector('.live-preview-page__canvas-wrapper');
	/** @type {DisplayCanvas} */
	const displayCanvas = wrapper.querySelector('display-canvas');
	displayCanvas.resizeAndRedraw();
	// log(`livePreviewPageWindowResize`, 'end');
}

export function redrawLivePreviewPageDisplayCanvas() {
	const editor = getCurrentProjectEditor();
	if (editor.nav.page === 'Live preview') {
		let canvasWrapper = document.querySelector('.live-preview-page__canvas-wrapper');
		canvasWrapper.innerHTML = '';
		const livePreviewOptions = editor.livePreviewPageOptions;
		canvasWrapper.appendChild(new DisplayCanvas(livePreviewOptions));
	}
}
