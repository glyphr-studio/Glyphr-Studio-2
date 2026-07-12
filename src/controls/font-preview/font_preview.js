/* global Buffer */
import { FontFlux } from 'font-flux-js';
import { getCurrentProject } from '../../app/main.js';
import { charToHex } from '../../common/character_ids.js';
import { makeElement } from '../../common/dom.js';
import { caseCamelToKebab, caseKebabToCamel, round } from '../../common/functions.js';
import { findAndMergeLigatures } from '../../display_canvas/text_block.js';
import { TextBlockOptions } from '../../display_canvas/text_block_options.js';
import {
	createOptionsObject,
	getUniqueGlyphName,
	glyphToContours,
} from '../../formats_io/otf/font_export.js';
import { writeGposKernDataToFont } from '../../formats_io/otf/tables/gpos.js';

const DEFAULT_FLAVOR = 'otf';
const FLAVOR_TO_FONTFLUX_FORMAT = {
	otf: 'sfnt',
	ttf: 'ttf',
	woff: 'woff',
	woff2: 'woff2',
};
const FLAVOR_TO_CSS_FORMAT = {
	otf: 'opentype',
	ttf: 'truetype',
	woff: 'woff',
	woff2: 'woff2',
};

export class FontPreviewBuilder {
	constructor(project, options = {}) {
		this.project = project;
		this.flavor = options.flavor || DEFAULT_FLAVOR;
		this.familyNameOverride = options.familyName;
		this.styleNameOverride = options.styleName;
		this.includeKerning = options.includeKerning ?? true;
		this.includeLigatures = options.includeLigatures ?? true;
	}

	buildFontFlux(text = '') {
		const project = this.project;
		if (!project) throw new Error('FontPreviewBuilder requires a project');

		const options = createOptionsObject(project);
		if (this.familyNameOverride) options.familyName = this.familyNameOverride;
		if (this.styleNameOverride) options.styleName = this.styleNameOverride;

		const { glyphMap, ligatures } = collectPreviewItems(project, text, this.includeLigatures);
		const font = FontFlux.create({
			family: options.familyName,
			unitsPerEm: options.unitsPerEm,
			ascender: options.ascender,
			descender: options.descender,
		});

		font.info.styleName = options.styleName;
		font.info.copyright = options.copyright;
		font.info.version = options.version;
		font.info.weight = options.weightClass;
		font.info.italicAngle = options.italicAngle;
		font.info.ascender = options.ascender;
		font.info.descender = options.descender;
		font.info.lineGap = options.lineGap;
		font.info.capHeight = options.capHeight;
		font.info.xHeight = options.xHeight;
		font.info.description = options.description;
		font.info.designer = options.designer;
		font.info.designerURL = options.designerURL;
		font.info.manufacturer = options.manufacturer;
		font.info.vendorURL = options.manufacturerURL;
		font.info.license = options.license;
		font.info.licenseURL = options.licenseURL;
		font.info.trademark = options.trademark;

		const previewGlyphs = buildPreviewGlyphObjects(project, glyphMap, ligatures);
		previewGlyphs.forEach((glyph) => font.addGlyph(glyph));

		if (this.includeKerning && project.settings.app.exportKerning) {
			writeGposKernDataToFont(font, project);
		}

		if (this.includeLigatures && ligatures.length > 0) {
			ligatures.forEach((lig) => {
				font.addSubstitution({
					type: 'ligature',
					feature: 'liga',
					substitution: {
						components: lig.gsub.map((unicode) => getUniqueGlyphName(unicode)),
						ligature: generateLigatureExportName(lig),
					},
				});
			});
		}

		return font;
	}

	buildFontBuffer(text = '') {
		const font = this.buildFontFlux(text);
		const format =
			FLAVOR_TO_FONTFLUX_FORMAT[this.flavor] || FLAVOR_TO_FONTFLUX_FORMAT[DEFAULT_FLAVOR];
		return font.export({ format });
	}

	makeFontFaceCSS(
		buffer,
		fontFamily = this.familyNameOverride || this.project.settings.font.family || 'PreviewFont'
	) {
		const format = this.flavor || DEFAULT_FLAVOR;
		const cssFormat = FLAVOR_TO_CSS_FORMAT[format] || FLAVOR_TO_CSS_FORMAT[DEFAULT_FLAVOR];
		return (
			`@font-face {\n` +
			`  font-family: "${fontFamily}";\n` +
			`  src: url("${fontBufferToDataURI(buffer, format)}") format("${cssFormat}");\n` +
			`  font-weight: 400;\n` +
			`  font-style: normal;\n` +
			`}`
		);
	}
}

const FONT_PREVIEW_OBSERVED_ATTRIBUTES = [
	'text',
	'font-size',
	'line-gap',
	'preview-flavor',
	'enable-ligatures',
	'enable-kerning',
];

// Font formats this component can generate and render natively via FontFlux.
// The 'gs' (Glyphr Studio) flavor is handled by the display-canvas renderer,
// not this component, so it falls back to the default font format here.
const FONT_PREVIEW_FLAVORS = ['otf', 'ttf'];
const FONT_PREVIEW_DEFAULT_FLAVOR = 'otf';

/**
 * Resolves a previewFlavor value to a font format this component can build,
 * independent of the project's configured export format.
 * @param {String} previewFlavor - requested preview flavor (e.g. 'gs', 'otf', 'ttf')
 * @returns {String} - a font format supported by FontPreviewBuilder
 */
function resolvePreviewFlavor(previewFlavor) {
	return FONT_PREVIEW_FLAVORS.includes(previewFlavor) ? previewFlavor : FONT_PREVIEW_DEFAULT_FLAVOR;
}

const FONT_PREVIEW_STYLE = `
	:host {
		display: block;
	}

	.font-preview__text {
		display: block;
		box-sizing: border-box;
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		resize: none;
		overflow: hidden;
		white-space: pre-wrap;
		overflow-wrap: break-word;
		word-break: break-word;
	}

	.font-preview__text:focus {
		outline: none;
	}
`;

let fontPreviewInstanceCounter = 0;

/**
 * FontPreview is a Web Component that renders a string of text using a font
 * binary generated on-the-fly from the current project. It mirrors the shape
 * and API of the `display-canvas` control, but renders native text instead of
 * drawing glyphs to a canvas.
 */
export class FontPreview extends HTMLElement {
	/**
	 * Create a FontPreview
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`FontPreview.constructor`, 'start');
		super();

		this.isSetUp = false;
		this.initialAttributes = attributes;
		this.project = attributes.project || false;
		this.observedAttrs = FONT_PREVIEW_OBSERVED_ATTRIBUTES;

		// log(`FontPreview.constructor`, 'end');
	}

	/**
	 * Build the preview when it's loaded into the DOM
	 */
	connectedCallback() {
		// log(`FontPreview.connectedCallback`, 'start');

		// Firefox bug, custom element's prototype is lost when used across frames
		if (this.constructor.name !== 'FontPreview') {
			this.__proto__ = customElements.get('font-preview').prototype;
		}

		// Initialize passed attributes. Only the attributes that actually apply to
		// this live-text control are reflected; canvas-only display-canvas options
		// (page sizing, character/line/page extras, width adjustment, etc.) are
		// ignored here.
		this.textBlockOptions = new TextBlockOptions();
		Object.keys(this.initialAttributes).forEach((key) => {
			if (key === 'project') return;

			// `text` is stored as `_text` on a TextBlockOptions instance
			const propName = key === '_text' ? 'text' : key;
			const attrName = caseCamelToKebab(propName);
			if (!this.observedAttrs.includes(attrName)) return;

			const value = this.initialAttributes[key];
			this.textBlockOptions[propName] = value;
			this.setAttribute(attrName, value);
		});

		// Page padding is not an interactive attribute on this control, but it is
		// honored (applied as textarea padding in applyStyles) so the live text
		// lines up with the Glyphr Studio (canvas) renderer, which insets its text
		// by the same amount, when switching between flavors.
		if (this.initialAttributes.pagePadding !== undefined) {
			this.textBlockOptions.pagePadding = this.initialAttributes.pagePadding;
		}

		// Pull attributes from element
		this.observedAttrs.forEach((key) => {
			if (this.hasAttribute(key)) {
				/** @type {String | Boolean | Number} */
				let value = this.getAttribute(key);
				if (key === 'enable-ligatures' || key === 'enable-kerning') {
					value = value !== 'false';
				} else if (key === 'font-size' || key === 'line-gap') {
					value = parseFloat(value);
				}
				this.textBlockOptions[caseKebabToCamel(key)] = value;
			}
		});

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: FONT_PREVIEW_STYLE });
		shadow.appendChild(styles);

		this.textElement = makeElement({
			tag: 'textarea',
			className: 'font-preview__text',
			attributes: { spellcheck: 'false' },
		});
		this.textElement.addEventListener('input', () => this.handleInput());
		shadow.appendChild(this.textElement);

		this.fontFamilyName = `FontPreview-${++fontPreviewInstanceCounter}`;

		// Finish
		this.isSetUp = true;
		this.rebuildAndRedraw();

		// log(`FontPreview.connectedCallback`, 'end');
	}

	/**
	 * Regenerates the preview font binary, then redraws the text
	 */
	rebuildAndRedraw() {
		// log(`FontPreview.rebuildAndRedraw`, 'start');
		if (this.isSetUp) {
			this.rebuildFont();
			this.redraw();
		}
		// log(`FontPreview.rebuildAndRedraw`, 'end');
	}

	/**
	 * Alias for rebuildAndRedraw, to match the display-canvas API
	 */
	resizeAndRedraw() {
		this.rebuildAndRedraw();
	}

	/**
	 * Builds a font binary from the current project and applies it as an
	 * @font-face rule scoped to this component's shadow DOM
	 */
	rebuildFont() {
		// log(`FontPreview.rebuildFont`, 'start');
		const project = this.project || getCurrentProject();
		if (!project) {
			console.warn(`${this.constructor.name}: no project available to build preview font`);
			return;
		}

		try {
			const builder = new FontPreviewBuilder(project, {
				flavor: resolvePreviewFlavor(this.textBlockOptions.previewFlavor),
				includeLigatures: this.textBlockOptions.enableLigatures,
				includeKerning: this.textBlockOptions.enableKerning,
			});
			const buffer = builder.buildFontBuffer(this.textBlockOptions.text);

			// Use a fresh family name each build so the browser reloads the font,
			// picking up any glyphs that were just typed into the live preview.
			this.fontFamilyName = `FontPreview-${++fontPreviewInstanceCounter}`;

			// @font-face rules defined inside a shadow root are ignored by the
			// browser, so register the generated font at the document level via the
			// FontFace API instead. Fonts added to document.fonts are visible to
			// content rendered inside this component's shadow DOM.
			//
			// Register against this element's OWN document (e.g. the pop-out
			// window), not the main window's document. A font added to one
			// document's font set is not visible in another document, so using the
			// global `document` here would leave a pop-out preview rendering in a
			// fallback font.
			const targetDocument = this.ownerDocument || document;
			const targetWindow = targetDocument.defaultView || window;
			const FontFaceCtor = targetWindow.FontFace || FontFace;
			const { source, cleanup } = createFontFaceSource(buffer, resolvePreviewFlavor(this.textBlockOptions.previewFlavor), targetDocument);
			const fontFace = new FontFaceCtor(this.fontFamilyName, source);
			targetDocument.fonts.add(fontFace);
			fontFace.load().then(
				() => {
					cleanup();
					// Drop the previous preview font and re-apply styling so the
					// freshly-loaded font metrics are reflected.
					if (this.currentFontFace && this.currentFontFace !== fontFace) {
						targetDocument.fonts.delete(this.currentFontFace);
					}
					this.currentFontFace = fontFace;
					this.applyStyles();
					this.autoGrow();
				},
				(error) => {
					cleanup();
					targetDocument.fonts.delete(fontFace);
					console.warn(`${this.constructor.name}: preview font load failed`, error);
				}
			);
		} catch (error) {
			console.warn(`${this.constructor.name}: preview font generation failed`, error);
		}
		// log(`FontPreview.rebuildFont`, 'end');
	}

	/**
	 * Handles live editing of the preview text. Rebuilds the font so newly
	 * typed glyphs are included, reapplies styling without resetting the
	 * caret, and notifies external listeners of the new text.
	 */
	handleInput() {
		// log(`FontPreview.handleInput`, 'start');
		// @ts-expect-error 'property does exist'
		this.textBlockOptions.text = this.textElement.value;
		this.rebuildFont();
		this.applyStyles();
		this.autoGrow();
		this.dispatchEvent(
			new CustomEvent('text-change', {
				bubbles: true,
				composed: true,
				detail: { text: this.textBlockOptions.text },
			})
		);
		// log(`FontPreview.handleInput`, 'end');
	}

	/**
	 * Sets the text value and typographic styling. Used for initial render and
	 * external (attribute / API) updates; not called during live typing so the
	 * caret position is preserved.
	 */
	redraw() {
		// log(`FontPreview.redraw`, 'start');
		if (!this.isSetUp) return;

		// @ts-expect-error 'property does exist'
		this.textElement.value = this.textBlockOptions.text || '';
		this.applyStyles();
		this.autoGrow();
		// log(`FontPreview.redraw`, 'end');
	}

	/**
	 * Applies the generated font family and typographic sizing to the textarea
	 */
	applyStyles() {
		if (!this.isSetUp) return;
		const fontSize = this.textBlockOptions.fontSize ?? 48;
		const lineGap = this.textBlockOptions.lineGap ?? 12;
		const pagePadding = this.textBlockOptions.pagePadding ?? 10;
		this.textElement.style.fontFamily = `"${this.fontFamilyName}", sans-serif`;
		this.textElement.style.fontSize = `${fontSize}px`;
		this.textElement.style.lineHeight = `${fontSize + lineGap}px`;
		this.textElement.style.padding = `${pagePadding}px`;
	}

	/**
	 * Grows the textarea height to fit its content
	 */
	autoGrow() {
		if (!this.textElement) return;
		this.textElement.style.height = 'auto';
		this.textElement.style.height = `${this.textElement.scrollHeight}px`;
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return FONT_PREVIEW_OBSERVED_ATTRIBUTES;
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`FontPreview.attributeChangedCallback`, 'start');
		if (this.constructor.name !== 'FontPreview') return;
		if (!this.isSetUp) return;

		if (attributeName === 'text') {
			this.textBlockOptions.text = newValue;
			this.rebuildAndRedraw();
		}

		if (attributeName === 'font-size') {
			this.textBlockOptions.fontSize = Math.max(parseFloat(newValue), 1);
			this.redraw();
		}

		if (attributeName === 'line-gap') {
			this.textBlockOptions.lineGap = Math.max(parseFloat(newValue), 0);
			this.redraw();
		}

		if (attributeName === 'preview-flavor') {
			this.textBlockOptions.previewFlavor = newValue;
			this.rebuildAndRedraw();
		}

		if (attributeName === 'enable-ligatures') {
			this.textBlockOptions.enableLigatures = newValue !== 'false';
			this.rebuildAndRedraw();
		}

		if (attributeName === 'enable-kerning') {
			this.textBlockOptions.enableKerning = newValue !== 'false';
			this.rebuildAndRedraw();
		}
		// log(`FontPreview.attributeChangedCallback`, 'end');
	}
}

function collectPreviewItems(project, text, includeLigatures) {
	const glyphMap = new Map();
	const ligatureMap = new Map();
	const lines = String(text || '').split('\n');

	for (const line of lines) {
		const tokens = findAndMergeLigatures([...line], project);
		for (const token of tokens) {
			if (token?.startsWith('liga-')) {
				const ligature = project.getItem(token);
				if (!ligature) continue;
				// Always include the ligature's component glyphs so the typed
				// sequence renders from the project's individual character glyphs
				// (rather than a fallback font), even when ligature substitution is
				// disabled. `gsub` holds the component code points as numbers.
				ligature.gsub.forEach((codePoint) => {
					const hex = charToHex(String.fromCodePoint(Number(codePoint)));
					if (hex) addGlyphKey(hex, project, glyphMap);
				});
				// Only register the ligature glyph + substitution when enabled.
				if (includeLigatures) ligatureMap.set(token, ligature);
			} else if (token) {
				const hex = charToHex(token);
				if (hex) addGlyphKey(hex, project, glyphMap);
			}
		}
	}

	return { glyphMap, ligatures: Array.from(ligatureMap.values()) };
}

function addGlyphKey(hex, project, glyphMap) {
	if (!hex || hex === '0x0') return;
	if (glyphMap.has(hex)) return;
	const item = project.getItem(`glyph-${hex}`) || null;
	glyphMap.set(hex, item);
}

function buildPreviewGlyphObjects(project, glyphMap, ligatures) {
	const glyphObjects = [];
	const notdefGlyph = buildNotdefGlyph(project);
	glyphObjects.push(notdefGlyph);

	const sortedHexes = Array.from(glyphMap.keys()).sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
	for (const hex of sortedHexes) {
		const unicode = parseInt(hex, 16);
		if (!Number.isFinite(unicode) || unicode === 0) continue;
		const sourceGlyph = glyphMap.get(hex);
		const glyphObject = {
			name: getUniqueGlyphName(unicode),
			unicode,
			advanceWidth: sourceGlyph?.advanceWidth || project.defaultAdvanceWidth,
			leftSideBearing: round(sourceGlyph?.leftSideBearing || 0),
			contours: sourceGlyph ? glyphToContours(sourceGlyph) : [],
		};
		glyphObjects.push(glyphObject);
	}

	ligatures.forEach((ligature) => {
		if (!ligature) return;
		glyphObjects.push({
			name: generateLigatureExportName(ligature),
			advanceWidth: ligature.advanceWidth,
			leftSideBearing: round(ligature.leftSideBearing || 0),
			contours: glyphToContours(ligature),
		});
	});

	return glyphObjects;
}

function buildNotdefGlyph(project) {
	const notdef = project.getItem('glyph-0x0');
	if (notdef) {
		return {
			name: '.notdef',
			unicode: 0,
			advanceWidth: notdef.advanceWidth,
			leftSideBearing: round(notdef.leftSideBearing || 0),
			contours: glyphToContours(notdef),
		};
	}

	const capHeight = project.settings.font.capHeight;
	const notDefGlyphPaths = [
		{
			name: 'Outer Phi Rectangle',
			pathPoints: [
				{ p: { coord: { x: 0, y: 700 } } },
				{ p: { coord: { x: 432, y: 700 } } },
				{ p: { coord: { x: 432, y: 0 } } },
				{ p: { coord: { x: 0, y: 0 } } },
			],
		},
		{
			name: 'Inner Phi Rectangle',
			pathPoints: [
				{ p: { coord: { x: 50, y: 50 } } },
				{ p: { coord: { x: 382, y: 50 } } },
				{ p: { coord: { x: 382, y: 650 } } },
				{ p: { coord: { x: 50, y: 650 } } },
			],
		},
	];
	const glyph = {
		advanceWidth: 432,
		leftSideBearing: 0,
		shapes: notDefGlyphPaths,
	};

	if (capHeight !== 700) {
		const delta = capHeight - 700;
		glyph.shapes = notDefGlyphPaths.map((shape) => ({
			name: shape.name,
			translateY: delta,
			pathPoints: shape.pathPoints,
		}));
	}

	return {
		name: '.notdef',
		unicode: 0,
		advanceWidth: glyph.advanceWidth,
		leftSideBearing: round(glyph.leftSideBearing || 0),
		contours: glyphToContours(glyph),
	};
}

function generateLigatureExportName(ligature) {
	let result = 'lig';
	ligature.gsub.forEach((char) => {
		result += '.' + getUniqueGlyphName(char).replace(/^uni?/, '');
	});
	return result;
}

export function createFontFaceSource(buffer, flavor = DEFAULT_FLAVOR, targetDocument = document) {
	const bytes = ensureFontBytes(buffer);
	const mime = flavor === 'ttf' ? 'font/truetype' : 'font/opentype';
	const targetWindow = targetDocument?.defaultView || window;
	const urlCreator = targetWindow?.URL?.createObjectURL;

	if (typeof urlCreator === 'function' && typeof Blob !== 'undefined') {
		const blob = new Blob([bytes], { type: mime });
		const source = urlCreator(blob);
		return {
			source,
			cleanup: () => {
				if (typeof targetWindow?.URL?.revokeObjectURL === 'function') {
					targetWindow.URL.revokeObjectURL(source);
				}
			},
		};
	}

	return {
		source: bytes,
		cleanup: () => {},
	};
}

function ensureFontBytes(buffer) {
	if (buffer instanceof ArrayBuffer) return buffer;
	if (ArrayBuffer.isView(buffer)) return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	if (typeof buffer === 'string') return new TextEncoder().encode(buffer).buffer;
	return new Uint8Array(buffer).buffer;
}

function fontBufferToDataURI(buffer, flavor = DEFAULT_FLAVOR) {
	const base64 = arrayBufferToBase64(buffer);
	const mime = flavor === 'ttf' ? 'font/truetype' : 'font/opentype';
	return `data:${mime};base64,${base64}`;
}

function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	if (typeof btoa === 'function') {
		let binary = '';
		const chunkSize = 0x8000;
		for (let i = 0; i < bytes.length; i += chunkSize) {
			binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
		}
		return btoa(binary);
	}
	return Buffer.from(bytes).toString('base64');
}
