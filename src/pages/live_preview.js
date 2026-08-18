import { getCurrentProjectEditor } from '../app/main.js';
import { editorText } from '../app/editor_i18n.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { FontPreview } from '../controls/font-preview/font_preview.js';
import { DisplayCanvas } from '../display_canvas/display_canvas.js';
import { makePanel_LivePreview } from '../panels/live_preview.js';

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
		className: 'live-preview-page',
		innerHTML: `
		<header class="editor-content-header">
			<div>
				<span>${editorText('preview')}</span>
				<h1>${editorText('livePreviewTitle')}</h1>
				<p>${editorText('livePreviewBody')}</p>
			</div>
		</header>
		<div class="live-preview-page__workspace">
			<section class="live-preview-page__stage liquid-glass" aria-label="${editorText('previewCanvas')}">
				<div class="live-preview-page__stage-header">
					<div>
						<span>${editorText('previewCanvas')}</span>
						<strong>${editorText('livePreview')}</strong>
					</div>
					<span class="live-preview-page__status">${editorText('updatesLive')}</span>
				</div>
				<div class="live-preview-page__canvas-wrapper"></div>
			</section>
			<aside class="live-preview-page__settings liquid-glass" aria-label="${editorText(
				'previewSettings'
			)}">
				<div class="live-preview-page__settings-header">
					<span>${editorText('preview')}</span>
					<h2>${editorText('previewSettings')}</h2>
					<p>${editorText('previewSettingsBody')}</p>
				</div>
				<div id="content-page__panel"></div>
			</aside>
		</div>
		`,
	});

	let canvasWrapper = content.querySelector('.live-preview-page__canvas-wrapper');
	const editor = getCurrentProjectEditor();
	const livePreviewOptions = editor.livePreviewPageOptions;
	canvasWrapper.appendChild(makeLivePreviewRenderer(livePreviewOptions));

	window.addEventListener('resize', livePreviewPageWindowResize);

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
