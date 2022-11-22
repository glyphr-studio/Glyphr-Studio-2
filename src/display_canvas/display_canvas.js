import { makeElement } from '../common/dom.js';
import { GlyphSequence } from './glyph_sequence.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { glyphToHex } from '../common/unicode.js';
import { drawGlyph } from './draw_paths.js';
import { linkCSS } from '../controls/controls.js';
import { clone, makeCrisp, round } from '../common/functions.js';

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
		log(`DisplayCanvas.constructor`, 'start');
		super();
		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		this.glyphs = this.getAttribute('glyphs') || '';
		this.width = this.getAttribute('width') || 200;
		this.height = this.getAttribute('height') || 500;
		this.fontSize = 48;
		this.pageMargin = 5;
		this.lineGap = 12;
		this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';
		this.glyphSequence = this.updateGlyphSequence();

		this.showPageExtras = true;
		this.showLineExtras = true;
		this.showGlyphExtras = true;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// shadow.appendChild(linkCSS('display-canvas'));
		shadow.appendChild(makeCSS());

		this.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });
		shadow.appendChild(this.canvas);
		this.ctx = shadow.getElementById('mainDisplayCanvas').getContext('2d');
		this.canvas.height = this.height;
		this.canvas.width = this.width;

		// this.redraw();
		log(`DisplayCanvas.constructor`, 'end');
	}

	updateGlyphSequence() {
		return new GlyphSequence({
			glyphString: this.glyphs,
			fontSize: this.fontSize,
			areaMaxes: this.calculatePageMaxes(),
			lineGap: this.lineGap,
		});
	}

	// calculateView() {
	// 	let settings = getCurrentProject().projectSettings;
	// 	let contentWidth = this.width - 2 * this.pageMargin;
	// 	let contentHeight = this.height - 2 * this.pageMargin;
	// 	let upm = settings.upm;
	// 	let ascent = settings.ascent;
	// 	let zoom = Math.min(contentWidth, contentHeight) / upm;

	// 	let view = {
	// 		dx: this.pageMargin,
	// 		dy: this.pageMargin + zoom * ascent,
	// 		dz: zoom,
	// 	};

	// 	return view;
	// }

	calculatePageMaxes() {
		let contentWidth = this.width - 2 * this.pageMargin;
		let contentHeight = this.height - 2 * this.pageMargin;
		let settings = getCurrentProject().projectSettings;
		const scale = this.fontSize / settings.upm;

		let maxes = {
			xMin: this.pageMargin,
			xMax: this.pageMargin + contentWidth,
			yMin: this.pageMargin,
			yMax: this.pageMargin + contentHeight,
		};

		return maxes;
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['glyphs', 'height', 'width', 'vertical-align', 'horizontal-align'];
	}

	/**
	 * Draw the canvas when it's loaded
	 */
	connectedCallback() {
		log(`DisplayCanvas.connectedCallback`, 'start');
		this.redraw();
		log(`DisplayCanvas.connectedCallback`, 'end');
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
				this.glyphSequence = this.updateGlyphSequence();
				this.redraw();
				break;

			case 'height':
				this.height = newValue;
				this.glyphSequence = this.updateGlyphSequence();
				this.redraw();
				break;

			case 'width':
				this.width = newValue;
				this.glyphSequence = this.updateGlyphSequence();
				this.redraw();
				break;

			case 'vertical-align':
				this.vertical = newValue;
				this.glyphSequence = this.updateGlyphSequence();
				this.redraw();
				break;

			case 'horizontal-align':
				this.horizontal = newValue;
				this.glyphSequence = this.updateGlyphSequence();
				this.redraw();
				break;

			default:
				break;
		}

		if (attributeName === 'glyphs') {
			this.redraw();
		}
		// log(`DisplayCanvas.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		// log('DisplayCanvas.redraw', 'start');
		// log(`THIS CONTEXT`);
		// log(this.ctx);

		this.ctx.clearRect(0, 0, this.width, this.height);

		// let glyphHex = glyphToHex(this.glyphs.charAt(0));
		// let sg = getCurrentProject().getGlyph(glyphHex);
		// log(sg);
		// // drawGlyph(sg, this.ctx, view);

		if (this.showPageExtras) {
			// log(`DRAW PAGE EXTRAS`);
			this.drawPageExtras(this.calculatePageMaxes());
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

	drawPageExtras(maxes) {
		// log(`displayCanvas.drawPageExtras`, 'start');
		// log(maxes);

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
		this.ctx.moveTo(this.glyphSequence.areaMaxes.xMin, charData.view.dy + this.pageMargin);
		this.ctx.lineTo(this.glyphSequence.areaMaxes.xMax, charData.view.dy + this.pageMargin);
		this.ctx.closePath();
		this.ctx.stroke();
		// log(`displayCanvas.drawLineExtras`, 'end');
	}

	drawGlyphExtras(charData) {
		// log(`displayCanvas.drawGlyphExtras`, 'start');
		const projectSettings = getCurrentProject().projectSettings;
		const scale = charData.view.dz;
		let drawWidth = charData.widths.advance * scale;
		let drawHeight = projectSettings.upm * scale;
		let drawY = charData.view.dy + this.pageMargin - projectSettings.ascent * scale;
		let drawX = charData.view.dx + this.pageMargin;
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

		this.ctx.strokeRect(makeCrisp(drawX), makeCrisp(drawY), round(drawWidth), round(drawHeight));

		// log(`displayCanvas.drawGlyphExtras`, 'end');
	}

	drawGlyph(charData) {
		// log(`displayCanvas.drawGlyph`, 'start');
		// log(charData);
		// log(`THIS CONTEXT`);
		// log(this.ctx);
		const settings = getCurrentProject().projectSettings;
		let glyph = charData.glyph;
		// TODO flattenGlyphs
		// let flattenGlyphs = td.flattenGlyphs || false;
		let flattenGlyphs = false;
		let view = clone(charData.view);
		// view.dx *= view.dz;
		view.dx += this.pageMargin;
		// view.dy += settings.ascent + this.pageMargin;
		// view.dy *= view.dz;
		view.dy += this.pageMargin;

		// log(`\t drawing ${charData.char}`);
		// log(view);

		if (glyph) {
			this.ctx.fillStyle = uiColors.enabled.resting.text;
			this.ctx.strokeStyle = 'transparent';

			// TODO flattenGlyphs
			// if (flattenGlyphs) {
			// 	if (!this.cache.hasOwnProperty(charData.char)) {
			// 		this.cache[charData.char] = new Glyph(clone(glyph)).combineAllShapes(true);
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
	updateFontSize(newValue) {
		this.fontSize = newValue * 1;
		this.glyphSequence.setMaxes(this.calculatePageMaxes());
		// document.getElementById('roughPointSize').value = newValue * 0.75;
		// document.getElementById('livePreviewTextArea').style.fontSize = newValue * 0.75 + 'pt';
	}

	updateLineGap(newValue) {
		this.lineGap = newValue * 1;
		this.glyphSequence.setLineGap(this.lineGap);
	}

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

/**
 * In-lines CSS
 */

function makeCSS() {
	let cssElement = makeElement({ tag: 'style' });

	cssElement.innerHTML = `
* {
	box-sizing: border-box;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

canvas {
	background-color: white;
	z-index: 100;
}
`;

	return cssElement;
}
