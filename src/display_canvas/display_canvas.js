import { makeElement } from '../common/dom.js';
import { GlyphSequence } from './glyph_sequence.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { glyphToHex } from '../common/unicode.js';
import { drawGlyph } from './draw_paths.js';
import { clone, makeCrisp, round } from '../common/functions.js';
import { livePreviewPageWindowResize } from '../pages/live_preview.js';
import { livePreviewOptions } from '../panels/live_preview.js';
import style from './display-canvas.css';

/**
 * DisplayCanvas takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
export class DisplayCanvas extends HTMLElement {
	/**
	 * Create an DisplayCanvas
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`DisplayCanvas.constructor`, 'start');
		super();
		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		const clientRect = this.parentElement.getClientRects()[0];
		this.width = clientRect.width;
		this.height = clientRect.height;

		this.glyphs = this.getAttribute('glyphs') || '';

		this.fontSize = parseInt(this.getAttribute('font-size')) || 48;
		this.pagePadding = parseInt(this.getAttribute('page-padding')) || 5;
		this.lineGap = parseInt(this.getAttribute('line-gap')) || 12;
		this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

		this.glyphSequence = false;

		this.showPageExtras = attributes.showPageExtras || livePreviewOptions.showPageExtras;
		this.showLineExtras = attributes.showLineExtras || livePreviewOptions.showLineExtras;
		this.showGlyphExtras = attributes.showGlyphExtras || livePreviewOptions.showGlyphExtras;
		this.drawCrisp = false;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });
		shadow.appendChild(this.canvas);
		// livePreviewPageWindowResize();
		this.updateGlyphSequence();
		this.ctx = shadow.getElementById('mainDisplayCanvas').getContext('2d');
		this.canvas.height = this.height;
		this.canvas.width = this.width;

		// this.redraw();
		// log(`DisplayCanvas.constructor`, 'end');
	}

	updateGlyphSequence() {
		// log(`DisplayCanvas.updateGlyphSequence`, 'start');
		// log(`this.width: ${this.width}`);
		// log(`this.height: ${this.height}`);
		this.glyphSequence = new GlyphSequence({
			glyphString: this.glyphs,
			fontSize: this.fontSize,
			areaMaxes: this.calculatePageMaxes(),
			lineGap: this.lineGap,
		});
		// log(`DisplayCanvas.updateGlyphSequence`, 'end');
	}

	calculatePageMaxes() {
		// log(`DisplayCanvas.calculatePageMaxes`, 'start');
		// log(`this.width: ${this.width}`);
		// log(`this.height: ${this.height}`);

		let contentWidth = this.width - 2 * this.pagePadding;
		let contentHeight = this.height - 2 * this.pagePadding;
		// log(`contentWidth: ${contentWidth}`);
		// log(`contentHeight: ${contentHeight}`);

		let maxes = {
			xMin: this.pagePadding,
			xMax: this.pagePadding + contentWidth,
			yMin: this.pagePadding,
			yMax: this.pagePadding + contentHeight,
		};

		// log(`DisplayCanvas.calculatePageMaxes`, 'end');
		return maxes;
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return [
			'glyphs',
			'font-size',
			'line-gap',
			'page-padding',
			'height',
			'width',
			'vertical-align',
			'horizontal-align',
		];
	}

	/**
	 * Draw the canvas when it's loaded
	 */
	connectedCallback() {
		// log(`DisplayCanvas.connectedCallback`, 'start');
		this.redraw();
		// log(`DisplayCanvas.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`DisplayCanvas.attributeChangeCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		switch (attributeName) {
			case 'glyphs':
				this.glyphs = newValue;
				break;

			case 'font-size':
				this.fontSize = Math.max(parseInt(newValue), 1);
				break;

			case 'line-gap':
				this.lineGap = Math.max(parseInt(newValue), 0);
				break;

			case 'page-padding':
				this.pagePadding = Math.max(parseInt(newValue), 0);
				break;

			case 'height':
				this.height = parseInt(newValue);
				// this.setAttribute('height', parseInt(newValue));
				this.canvas.height = parseInt(newValue);
				break;

			case 'width':
				this.width = parseInt(newValue);
				// this.setAttribute('width', parseInt(newValue));
				this.canvas.width = parseInt(newValue);
				break;

			case 'vertical-align':
				this.vertical = newValue;
				break;

			case 'horizontal-align':
				this.horizontal = newValue;
				break;

			default:
				break;
		}

		this.updateGlyphSequence();
		this.redraw();

		// log(`DisplayCanvas.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		// log('DisplayCanvas.redraw', 'start');
		// log(`THIS CONTEXT`);
		// log(this.ctx);

		// log(`this.width: ${this.width}`);
		// log(`this.height: ${this.height}`);

		this.ctx.clearRect(0, 0, this.width, this.height);

		// let glyphHex = glyphToHex(this.glyphs.charAt(0));
		// let sg = getCurrentProject().getGlyph(glyphHex);
		// log(sg);
		// // drawGlyph(sg, this.ctx, view);

		if (this.showPageExtras) {
			// log(`DRAW PAGE EXTRAS`);
			this.drawPageExtras();
		}

		if (this.glyphString === '') return;

		let currentLine = -1;
		if (this.showLineExtras) {
			// log('DRAW LINE EXTRAS');
			this.iterator((char) => {
				if (char.lineNumber !== currentLine) {
					this.drawLineExtras(char);
					currentLine = char.lineNumber;
				}
			});
		}

		if (this.showGlyphExtras) {
			// log('DRAW GLYPH EXTRAS');
			this.iterator((char) => {
				if (char.isVisible) this.drawGlyphExtras(char);
			});
		}

		// log('DRAW GLYPHS');
		this.iterator((char) => {
			if (char.isVisible) this.drawGlyph(char);
		});

		// log('DisplayCanvas.redraw', 'end');
	}

	iterator(drawFunction) {
		let data = this.glyphSequence.data;
		for (let block = 0; block < data.length; block++) {
			for (let glyph = 0; glyph < data[block].length; glyph++) {
				drawFunction(data[block][glyph], this);
			}
		}
	}

	// --------------------------------------------------------------
	// Draw functions for individual pieces
	// --------------------------------------------------------------

	drawPageExtras() {
		// log(`displayCanvas.drawPageExtras`, 'start');
		// log(maxes);
		const maxes = this.calculatePageMaxes();
		let top = maxes.yMin || 0;
		let bottom = maxes.yMax === Infinity ? this.canvas.height : maxes.yMax || this.canvas.height;
		let left = maxes.xMin || 0;
		let right = maxes.xMax === Infinity ? this.canvas.width : maxes.xMax || this.canvas.width;
		let width = right - left;
		let height = bottom - top;

		// log(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

		this.ctx.fillStyle = 'transparent';
		this.ctx.strokeStyle = accentColors.gray.l90;
		this.ctx.lineWidth = 1;

		this.ctx.strokeRect(makeCrisp(left), makeCrisp(top), round(width), round(height));

		// log(`displayCanvas.drawPageExtras`, 'end');
	}

	drawLineExtras(charData) {
		// log(`displayCanvas.drawLineExtras`, 'start');
		this.ctx.strokeStyle = accentColors.gray.l85;
		this.ctx.beginPath();
		this.ctx.moveTo(this.glyphSequence.areaMaxes.xMin, charData.view.dy + this.pagePadding);
		this.ctx.lineTo(this.glyphSequence.areaMaxes.xMax, charData.view.dy + this.pagePadding);
		this.ctx.closePath();
		this.ctx.stroke();
		// log(`displayCanvas.drawLineExtras`, 'end');
	}

	drawGlyphExtras(charData) {
		// log(`displayCanvas.drawGlyphExtras`, 'start');
		const settings = getCurrentProject().settings.font;
		const scale = charData.view.dz;
		let drawWidth = charData.widths.advance * scale;
		let drawHeight = settings.upm * scale;
		let drawY = charData.view.dy + this.pagePadding - settings.ascent * scale;
		let drawX = charData.view.dx + this.pagePadding;
		let drawK = charData.widths.kern * scale * -1;

		// log(`\t drawing ${charData.char}`);
		// log(`\t scaled view \t ${json(scaledView, true)}`);

		if (charData.widths.kern) {
			this.ctx.fillStyle = 'orange';
			this.ctx.globalAlpha = 0.3;
			this.ctx.fillRect(drawX + drawWidth - drawK, drawY, drawK, drawHeight);
			this.ctx.globalAlpha = 1;
		}

		this.ctx.fillStyle = 'transparent';
		this.ctx.strokeStyle = accentColors.blue.l85;
		this.ctx.lineWidth = 1;

		if (this.drawCrisp) {
			drawX = makeCrisp(drawX);
			drawY = makeCrisp(drawY);
			drawWidth = round(drawWidth);
			drawHeight = round(drawHeight);
		}

		this.ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

		// log(`displayCanvas.drawGlyphExtras`, 'end');
	}

	drawGlyph(charData) {
		// log(`displayCanvas.drawGlyph`, 'start');
		// log(charData);
		// log(`THIS CONTEXT`);
		// log(this.ctx);
		// const settings = getCurrentProject().settings.font;
		let glyph = charData.glyph;
		// TODO flattenGlyphs
		// let flattenGlyphs = td.flattenGlyphs || false;
		let flattenGlyphs = false;
		let view = clone(charData.view);
		// view.dx *= view.dz;
		view.dx += this.pagePadding;
		// view.dy += settings.ascent + this.pagePadding;
		// view.dy *= view.dz;
		view.dy += this.pagePadding;

		// log(`\t drawing ${charData.char}`);
		// log(view);

		if (glyph) {
			this.ctx.fillStyle = uiColors.enabled.resting.text;
			this.ctx.strokeStyle = 'transparent';

			// TODO flattenGlyphs
			// if (flattenGlyphs) {
			// 	if (!this.cache.hasOwnProperty(charData.char)) {
			// 		this.cache[charData.char] = glyph.clone().combineAllShapes(true);
			// 	}

			// 	this.cache[charData.char].drawGlyph(this.ctx, view, 1, true);
			// } else {
			// 	drawGlyph(glyph, this.ctx, view, 1, true);
			// }

			drawGlyph(glyph, this.ctx, view, 1, true);
		}

		// log(`displayCanvas.drawGlyph`, 'end');
	}

	// --------------------------------------------------------------
	// Update options
	// --------------------------------------------------------------

	createImage() {
		let imageData = this.canvas.toDataURL();

		let win = window.open(document.location.href, 'Glyphr Test Drive');

		win.document.write(
			'<!DOCTYPE html><html>' +
				'<head><title>Glyphr - Test Drive Image</title></head>' +
				'<body style="padding:40px; text-align:center;">' +
				'<img src="' +
				imageData +
				'" title="Glyphr Test Drive" style="border:1px solid #f6f6f6;">' +
				'</html>'
		);
	}
}
