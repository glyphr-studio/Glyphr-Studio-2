import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { FontPreview } from '../controls/font-preview/font_preview.js';
import { DisplayCanvas } from '../display_canvas/display_canvas.js';
import { makePanel_LivePreview } from '../panels/live_preview.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > Live preview
 * Preview text blocks made up of the font currently being edited.
 * @returns {Element} - page content
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
	canvasWrapper.appendChild(makeLivePreviewRenderer(livePreviewOptions));

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

/**
 * Event handler for when the page gets resized.
 */
export function livePreviewPageWindowResize() {
	// log(`livePreviewPageWindowResize`, 'start');
	// The display-canvas renderer needs to refit to the new parent size; the
	// font-preview renderer reflows automatically. Both expose resizeAndRedraw.
	const wrapper = document.querySelector('.live-preview-page__canvas-wrapper');
	const renderer = wrapper?.firstElementChild;
	// @ts-expect-error resizeAndRedraw exists on the renderer web components
	if (renderer && typeof renderer.resizeAndRedraw === 'function') renderer.resizeAndRedraw();
	// log(`livePreviewPageWindowResize`, 'end');
}

/**
 * Redraws the Live Preview
 */
export function redrawLivePreviewPageDisplayCanvas() {
	const editor = getCurrentProjectEditor();
	if (editor.nav.page === 'Live preview') {
		let canvasWrapper = document.querySelector('.live-preview-page__canvas-wrapper');
		canvasWrapper.innerHTML = '';
		canvasWrapper.appendChild(makeLivePreviewRenderer(editor.livePreviewPageOptions));
	}
}

/**
 * Builds the live preview renderer for the page based on the selected render
 * flavor. 'gs' (Glyphr Studio) uses the canvas-drawn display-canvas control;
 * 'otf' / 'ttf' use the font-preview control, which renders editable native
 * text backed by an on-the-fly generated font binary.
 * @param {Object} livePreviewOptions - TextBlockOptions for the preview
 * @returns {Element} - the renderer web component
 */
function makeLivePreviewRenderer(livePreviewOptions) {
	const flavor = livePreviewOptions.previewFlavor || 'gs';

	if (flavor === 'otf' || flavor === 'ttf') {
		const fontPreview = new FontPreview(livePreviewOptions);
		// The font-preview control is the live text input for native flavors,
		// so keep the shared options text in sync as the user types.
		fontPreview.addEventListener('text-change', (event) => {
			// @ts-expect-error CustomEvent detail
			livePreviewOptions.text = event.detail.text;
		});
		return fontPreview;
	}

	return new DisplayCanvas(livePreviewOptions);
}
