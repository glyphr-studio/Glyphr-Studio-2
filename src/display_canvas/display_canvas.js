import { makeElement } from '../common/dom.js';
import { GlyphSequence } from './glyph_sequence.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { glyphToHex } from '../common/unicode.js';
import { drawGlyph } from './draw_paths.js';
import { linkCSS } from '../controls/controls.js';
import { clone } from '../common/functions.js';

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

		this.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });

		this.glyphs = this.getAttribute('glyphs') || '';
		this.width = this.getAttribute('width') || 1000;
		this.height = this.getAttribute('height') || 1100;
		this.gutterSize = 20;
		this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

		this.showPageExtras = false;
		this.showLineExtras = false;
		this.showGlyphExtras = false;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// shadow.appendChild(linkCSS('display-canvas'));
		shadow.appendChild(makeCSS());

		shadow.appendChild(this.canvas);
		this.ctx = shadow.getElementById('mainDisplayCanvas').getContext('2d');
		log(`THIS CONTEXT`);
		log(this.ctx);
		this.canvas.height = this.height;
		this.canvas.width = this.width;

		this.glyphSequence = new GlyphSequence({
			glyphString: this.glyphs,
			maxes: this.calculatePageMaxes(),
		});

		// this.redraw();
		log(`DisplayCanvas.constructor`, 'end');
	}

	calculateView() {
		let settings = getCurrentProject().projectSettings;
		let contentWidth = this.width - 2 * this.gutterSize;
		let contentHeight = this.height - 2 * this.gutterSize;
		let upm = settings.upm;
		let ascent = settings.ascent;
		let zoom = Math.min(contentWidth, contentHeight) / upm;

		let view = {
			dx: this.gutterSize,
			dy: this.gutterSize + zoom * ascent,
			dz: zoom,
		};

		return view;
	}

	calculatePageMaxes() {
		let contentWidth = this.width - 2 * this.gutterSize;
		let contentHeight = this.height - 2 * this.gutterSize;
		let settings = getCurrentProject().projectSettings;

		let maxes = {
			xMin: this.gutterSize,
			xMax: this.gutterSize + contentWidth,
			yMin: this.gutterSize + settings.ascent,
			yMax: this.gutterSize + contentHeight,
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
				this.redraw();
				break;

			case 'height':
				this.height = newValue;
				this.redraw();
				break;

			case 'width':
				this.width = newValue;
				this.redraw();
				break;

			case 'vertical-align':
				this.vertical = newValue;
				this.redraw();
				break;

			case 'horizontal-align':
				this.horizontal = newValue;
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
		log('DisplayCanvas.redraw', 'start');
		log(`THIS CONTEXT`);
		log(this.ctx);

		this.ctx.clearRect(0, 0, this.width, this.height);

		// let glyphHex = glyphToHex(this.glyphs.charAt(0));
		// let sg = getCurrentProject().getGlyph(glyphHex);
		// log(sg);
		// // drawGlyph(sg, this.ctx, view);

		if (this.showPageExtras) {
			// log(`DRAW PAGE EXTRAS`);
			this.drawPageExtras(this.maxes, this.scale);
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

		log('DisplayCanvas.redraw', 'end');
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

	drawPageExtras(maxes, scale) {
		// log(`displayCanvas.drawPageExtras`, 'start');
		let tdc = livePreviewData.canvas;

		// let top = (maxes.yMin - (_GP.projectSettings.ascent * scale)) || 0;
		let top = maxes.yMin || 0;
		let bottom = maxes.yMax === Infinity ? tdc.height : maxes.yMax || tdc.height;
		let left = maxes.xMin || 0;
		let right = maxes.xMax === Infinity ? tdc.width : maxes.xMax || tdc.width;
		let width = right - left;
		let height = bottom - top;

		// debug(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

		this.ctx.fillStyle = 'transparent';
		this.ctx.strokeStyle = _UI.colors.green.l85;
		this.ctx.lineWidth = 1;

		this.ctx.strokeRect(left.makeCrisp(), top.makeCrisp(), round(width), round(height));

		// log(`displayCanvas.drawPageExtras`, 'end');
	}

	drawLineExtras(charData) {
		// log(`displayCanvas.drawLineExtras`, 'start');
		// log(`\t at ' + (charData.view.dy * charData.view.dz));
		drawHorizontalLine(
			charData.view.dy * charData.view.dz,
			livePreviewData.ctx,
			_UI.colors.green.l85
		);
		// log(`displayCanvas.drawLineExtras`, 'end');
	}

	drawGlyphExtras(charData) {
		// log(`displayCanvas.drawGlyphExtras`, 'start');
		let drawWidth = charData.width * charData.view.dz;
		let drawHeight = _GP.projectSettings.upm * charData.view.dz;
		let drawY = (charData.view.dy - _GP.projectSettings.ascent) * charData.view.dz;
		let drawW = charData.view.dx * charData.view.dz;
		let drawK = charData.kern * charData.view.dz * -1;

		// debug(`\t drawing ${charData.char}`);
		// debug(`\t scaled view \t ${json(scaledView, true)}`);

		if (charData.kern) {
			this.ctx.fillStyle = 'orange';
			this.ctx.globalAlpha = 0.3;
			this.ctx.fillRect(drawW + drawWidth - drawK, drawY, drawK, drawHeight);
			this.ctx.globalAlpha = 1;
		}

		this.ctx.fillStyle = 'transparent';
		this.ctx.strokeStyle = _UI.colors.blue.l85;
		this.ctx.lineWidth = 1;

		this.ctx.strokeRect(drawW.makeCrisp(), drawY.makeCrisp(), round(drawWidth), round(drawHeight));

		// log(`displayCanvas.drawGlyphExtras`, 'end');
	}

	drawGlyph(charData) {
		log(`displayCanvas.drawGlyph`, 'start');
		log(charData);
		log(`THIS CONTEXT`);
		log(this.ctx);
		let glyph = charData.glyph;
		// TODO flattenGlyphs
		// let flattenGlyphs = td.flattenGlyphs || false;
		let flattenGlyphs = false;
		let view = clone(charData.view, 'displayCanvas.drawGlyph');
		view.dx *= view.dz;
		view.dy *= view.dz;

		// debug(`\t drawing ${charData.char}`);
		// debug(`\t view \t ${json(view, true)}`);

		// setTimeout(function () {
		if (glyph) {
			this.ctx.fillStyle = uiColors.enabled.resting.text;
			this.ctx.strokeStyle = 'transparent';
			if (flattenGlyphs) {
				if (!livePreviewData.cache.hasOwnProperty(charData.char)) {
					livePreviewData.cache[charData.char] = new Glyph(
						clone(glyph, 'displayCanvas.drawGlyph')
					).combineAllShapes(true);
				}

				livePreviewData.cache[charData.char].drawGlyph(this.ctx, view, 1, true);
			} else {
				drawGlyph(glyph, this.ctx, view, 1, true);
			}
		}
		// }, 10);

		log(`displayCanvas.drawGlyph`, 'end');
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
}

	`;

	return cssElement;
}

function changeFontScale(newValue) {
	let td = this.settings;

	td.fontsize = newValue * 1;
	td.fontScale = newValue / _GP.projectSettings.upm;
	td.glyphSequence.setScale(td.fontScale);
	td.glyphSequence.setMaxes({
		xMin: 10,
		xMax: 790,
		yMin: 10 + _GP.projectSettings.ascent * td.fontScale,
		yMax: false,
	});
	document.getElementById('roughPointSize').value = newValue * 0.75;
	document.getElementById('livePreviewTextArea').style.fontSize = newValue * 0.75 + 'pt';
}

function changeLineGap(newValue) {
	let td = this.settings;

	td.lineGap = newValue * 1;
	td.glyphSequence.setLineGap(td.lineGap);
}

function createImage() {
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
