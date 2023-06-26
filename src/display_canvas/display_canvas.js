import { makeElement } from '../common/dom.js';
import { CharacterSequence } from './character_sequence.js';
import { getCurrentProject } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { drawGlyph } from './draw_paths.js';
import { clone, json, makeCrisp, round } from '../common/functions.js';
// import { livePreviewPageWindowResize } from '../pages/live_preview.js';
import { livePreviewOptions } from '../panels/live_preview.js';
import style from './display-canvas.css?inline';

/**
 * DisplayCanvas takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
export class DisplayCanvas extends HTMLElement {
	/**
	 * Create an DisplayCanvas
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		log(`DisplayCanvas.constructor`, 'start');
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

		this.CharacterSequence = false;

		this.showPageExtras = attributes.showPageExtras || livePreviewOptions.showPageExtras;
		this.showLineExtras = attributes.showLineExtras || livePreviewOptions.showLineExtras;
		this.showGlyphExtras = attributes.showGlyphExtras || livePreviewOptions.showGlyphExtras;
		this.drawCrisp = false;

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });
		shadow.appendChild(this.canvas);
		// livePreviewPageWindowResize();
		this.updateCharacterSequence();
		this.ctx = shadow.getElementById('mainDisplayCanvas').getContext('2d');
		this.canvas.height = this.height;
		this.canvas.width = this.width;

		// this.redraw();
		log(this);
		log(`DisplayCanvas.constructor`, 'end');
	}

	updateCharacterSequence() {
		log(`DisplayCanvas.updateCharacterSequence`, 'start');
		log(`this.width: ${this.width}`);
		log(`this.height: ${this.height}`);
		this.CharacterSequence = new CharacterSequence({
			characterString: this.glyphs,
			fontSize: this.fontSize,
			areaMaxes: this.calculatePageMaxes(),
			lineGap: this.lineGap,
			pagePadding: this.pagePadding,
			ctx: this.ctx,
			drawPageExtras: this.drawDisplayPageExtras,
			drawLineExtras: this.drawDisplayLineExtras,
			drawCharacterExtras: this.drawDisplayCharacterExtras,
			drawCharacter: this.drawDisplayCharacter,
		});
		log(`DisplayCanvas.updateCharacterSequence`, 'end');
	}

	calculatePageMaxes() {
		log(`DisplayCanvas.calculatePageMaxes`, 'start');
		log(`this.width: ${this.width}`);
		log(`this.height: ${this.height}`);

		const contentWidth = this.width - 2 * this.pagePadding;
		const contentHeight = this.height - 2 * this.pagePadding;
		log(`contentWidth: ${contentWidth}`);
		log(`contentHeight: ${contentHeight}`);

		const maxes = {
			xMin: this.pagePadding,
			xMax: this.pagePadding + contentWidth,
			yMin: this.pagePadding,
			yMax: this.pagePadding + contentHeight,
		};

		log(`DisplayCanvas.calculatePageMaxes`, 'end');
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
		log(`DisplayCanvas.connectedCallback`, 'start');
		this.redraw();
		log(`DisplayCanvas.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		log(`DisplayCanvas.attributeChangeCallback`, 'start');
		log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

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

		this.updateCharacterSequence();
		this.redraw();

		log(`DisplayCanvas.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		log('DisplayCanvas.redraw', 'start');
		log(`THIS CONTEXT`);
		log(this.ctx);

		log(`this.width: ${this.width}`);
		log(`this.height: ${this.height}`);

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.CharacterSequence.draw({
			showPageExtras: this.showPageExtras,
			showLineExtras: this.showLineExtras,
			showCharacterExtras: this.showCharacterExtras,
			showCharacter: true,
		});

		log('DisplayCanvas.redraw', 'end');
	}

	iterator(drawFunction) {
		const data = this.CharacterSequence.data;
		for (let block = 0; block < data.length; block++) {
			for (let glyph = 0; glyph < data[block].length; glyph++) {
				drawFunction(data[block][glyph], this);
			}
		}
	}
	// --------------------------------------------------------------
	// Draw functions for individual pieces
	// --------------------------------------------------------------

	drawDisplayPageExtras() {
		log(`displayCanvas.drawPageExtras`, 'start');
		log(maxes);
		const maxes = this.calculatePageMaxes();
		const top = maxes.yMin || 0;
		const bottom = maxes.yMax === Infinity ? this.canvas.height : maxes.yMax || this.canvas.height;
		const left = maxes.xMin || 0;
		const right = maxes.xMax === Infinity ? this.canvas.width : maxes.xMax || this.canvas.width;
		const width = right - left;
		const height = bottom - top;

		log(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

		this.ctx.fillStyle = 'transparent';
		this.ctx.strokeStyle = accentColors.gray.l90;
		this.ctx.lineWidth = 1;

		this.ctx.strokeRect(makeCrisp(left), makeCrisp(top), round(width), round(height));

		log(`displayCanvas.drawPageExtras`, 'end');
	}

	drawDisplayLineExtras(charData) {
		log(`displayCanvas.drawLineExtras`, 'start');
		this.ctx.strokeStyle = accentColors.gray.l85;
		this.ctx.beginPath();
		this.ctx.moveTo(this.CharacterSequence.areaMaxes.xMin, charData.view.dy + this.pagePadding);
		this.ctx.lineTo(this.CharacterSequence.areaMaxes.xMax, charData.view.dy + this.pagePadding);
		this.ctx.closePath();
		this.ctx.stroke();
		log(`displayCanvas.drawLineExtras`, 'end');
	}

	drawDisplayCharacterExtras(charData) {
		log(`displayCanvas.drawCharacterExtras`, 'start');
		const project = getCurrentProject();
		const settings = project.settings.font;
		const scale = charData.view.dz;
		let drawWidth = charData.widths.advance * scale;
		let drawHeight = project.totalVertical * scale;
		let drawY = charData.view.dy + this.pagePadding - settings.ascent * scale;
		let drawX = charData.view.dx + this.pagePadding;
		const drawK = charData.widths.kern * scale * -1;

		log(`\t drawing ${charData.char}`);

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

		log(`displayCanvas.drawCharacterExtras`, 'end');
	}

	drawDisplayCharacter(charData) {
		log(`displayCanvas.drawCharacter`, 'start');
		log(this);
		log(charData);
		log(`THIS CONTEXT`);
		log(this.ctx);
		// const settings = getCurrentProject().settings.font;
		const glyph = charData.glyph;

		// TODO combineAllPaths
		// const combineAllPaths = td.combineAllPaths || false;
		// const combineAllPaths = false;

		log(`charData.view`);
		log(`dx: ${charData.view.dx}, dy: ${charData.view.dy}, dz: ${charData.view.dz}`);
		const view = clone(charData.view);
		log(`cloned view`);
		log(`dx: ${view.dx}, dy: ${view.dy}, dz: ${view.dz}`);

		log(`this.pagePadding: ${this.pagePadding}`);

		// view.dx *= view.dz;
		view.dx += this.pagePadding;
		// view.dy += settings.ascent + this.pagePadding;
		// view.dy *= view.dz;
		view.dy += this.pagePadding;

		log(`\t drawing ${charData.char}`);
		log(`dx: ${view.dx}, dy: ${view.dy}, dz: ${view.dz}`);

		if (glyph) {
			this.ctx.fillStyle = uiColors.enabled.resting.text;
			this.ctx.strokeStyle = 'transparent';

			// TODO combineAllPaths
			// if (combineAllPaths) {
			// 	if (!this.cache[charData.char]) {
			// 		this.cache[charData.char] = glyph.clone().combineAllShapes(true);
			// 	}

			// 	this.cache[charData.char].drawGlyph(this.ctx, view, 1, true);
			// } else {
			// 	drawGlyph(glyph, this.ctx, view, 1, true);
			// }

			drawGlyph(glyph, this.ctx, view, 1, true);
		}

		log(`displayCanvas.drawCharacter`, 'end');
	}

	// --------------------------------------------------------------
	// Update options
	// --------------------------------------------------------------

	createImage() {
		const imageData = this.canvas.toDataURL();

		const win = window.open(document.location.href, 'Glyphr Test Drive');

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
