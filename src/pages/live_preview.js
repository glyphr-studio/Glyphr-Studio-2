import { addAsChildren, makeElement } from '../common/dom.js';
import { makeNavButton } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { livePreviewOptions, makePanel_LivePreview } from '../panels/live_preview.js';

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
			<div class="live-preview-page__canvas-wrapper">
				<display-canvas id="live-preview-page__canvas"
					text="${livePreviewOptions.text}"
					font-size="${livePreviewOptions.fontSize}"
					line-gap="${livePreviewOptions.lineGap}"
					page-padding="${livePreviewOptions.pagePadding}"
				></display-canvas>
			</div>
		</div>
	`,
	});

	// Subscriber
	// editor.subscribe({
	// 	topic: 'livePreview',
	// 	subscriberID: 'livePreviewPage',
	// 	callback: () => {
	// 		let displayCanvas = document.getElementById('live-preview-page__canvas');
	// 		displayCanvas.TextBlock = displayCanvas.updateTextBlock();
	// 		displayCanvas.redraw();
	// 	}
	// });

	window.addEventListener('resize', livePreviewPageWindowResize);

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	let panelArea = content.querySelector('#content-page__panel');
	addAsChildren(panelArea, makePanel_LivePreview());

	// log(`makePage_LivePreview`, 'end');
	return content;
}

export function livePreviewPageWindowResize() {
	// log(`livePreviewPageWindowResize`, 'start');

	const wrapper = document.querySelector('.live-preview-page__canvas-wrapper');
	const displayCanvas = document.querySelector('#live-preview-page__canvas');
	const clientRect = wrapper.getClientRects()[0];
	// log(`clientRect.width: ${clientRect.width}`);
	// log(`clientRect.height: ${clientRect.height}`);

	// displayCanvas.width = clientRect.width;
	// displayCanvas.height = clientRect.height;
	displayCanvas.setAttribute('width', clientRect.width);
	displayCanvas.setAttribute('height', clientRect.height);
	displayCanvas.updateTextBlock();
	displayCanvas.redraw();
	// log(`livePreviewPageWindowResize`, 'end');
}
