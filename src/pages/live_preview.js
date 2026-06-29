import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
// import { DisplayCanvas } from '../display_canvas/display_canvas.js';
import { FontPreviewBuilder } from '../formats_io/otf/font_preview.js';
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
	// canvasWrapper.appendChild(new DisplayCanvas(livePreviewOptions));
	canvasWrapper.appendChild(makeNativeFontPreview(livePreviewOptions));

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
	// Native text preview reflows automatically, so a resize redraw is not needed.
	// const wrapper = document.querySelector('.live-preview-page__canvas-wrapper');
	// /** @type {DisplayCanvas} */
	// const displayCanvas = wrapper.querySelector('display-canvas');
	// displayCanvas.resizeAndRedraw();
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
		const livePreviewOptions = editor.livePreviewPageOptions;
		// canvasWrapper.appendChild(new DisplayCanvas(livePreviewOptions));
		canvasWrapper.appendChild(makeNativeFontPreview(livePreviewOptions));
	}
}

let nativeFontPreviewCounter = 0;

/**
 * Builds a native-text live preview backed by an on-the-fly generated font binary
 * of the current project. Editing the text rebuilds the font so that any newly
 * typed glyphs are included.
 * @param {Object} textBlockOptions - TextBlockOptions for the preview (text, fontSize, lineGap)
 * @returns {Element} - wrapper element containing the preview textarea
 */
function makeNativeFontPreview(textBlockOptions) {
	const wrapper = makeElement({
		tag: 'div',
		className: 'live-preview-page__native-wrapper',
	});

	const styleTag = makeElement({ tag: 'style' });
	const textArea = makeElement({
		tag: 'textarea',
		className: 'live-preview-page__native-textarea',
		attributes: { spellcheck: 'false' },
	});
	// @ts-expect-error textarea value
	textArea.value = textBlockOptions.text || '';

	const fontSize = textBlockOptions.fontSize ?? 48;
	const lineGap = textBlockOptions.lineGap ?? 12;
	textArea.style.fontSize = `${fontSize}px`;
	textArea.style.lineHeight = `${fontSize + lineGap}px`;

	function rebuildFont() {
		// @ts-expect-error textarea value
		const text = textArea.value || '';
		const project = getCurrentProject();
		const fontFamily = `LivePreviewFont-${++nativeFontPreviewCounter}`;
		try {
			const builder = new FontPreviewBuilder(project);
			const buffer = builder.buildFontBuffer(text);
			styleTag.textContent = builder.makeFontFaceCSS(buffer, fontFamily);
			textArea.style.fontFamily = `"${fontFamily}", sans-serif`;
		} catch (error) {
			console.warn('Live preview font generation failed', error);
		}
	}

	textArea.addEventListener('input', () => {
		const editor = getCurrentProjectEditor();
		// @ts-expect-error textarea value
		textBlockOptions.text = textArea.value;
		editor.livePreviewPageOptions = textBlockOptions;
		rebuildFont();
	});

	rebuildFont();
	addAsChildren(wrapper, [styleTag, textArea]);
	return wrapper;
}
