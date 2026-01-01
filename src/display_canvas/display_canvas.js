import { makeElement } from '../common/dom.js';
import { TextBlock } from './text_block.js';
import { getCurrentProject } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { drawGlyph } from './draw_paths.js';
import { clone, makeCrisp, round } from '../common/functions.js';
// import { livePreviewPageWindowResize } from '../pages/live_preview.js';
import { livePreviewOptions } from '../panels/live_preview.js';
import style from './display-canvas.css?inline';

/**
 * DisplayCanvas takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
const displayCanvas = {};
export class DisplayCanvas extends HTMLElement {
	/**
	 * Create an DisplayCanvas
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		log(`DisplayCanvas.constructor`, 'start');
		super();
		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));
		this.isSetUp = false;
		log(`DisplayCanvas.constructor`, 'end');
	}

	setUp() {
		log(`DisplayCanvas.setUp`, 'start');

		// Extra Fancy Super Codez
		displayCanvas.calculatePageMaxes = this.calculatePageMaxes;

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		displayCanvas.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });
		shadow.appendChild(displayCanvas.canvas);
		// livePreviewPageWindowResize();
		// this.updateTextBlock();
		displayCanvas.ctx = shadow.getElementById('mainDisplayCanvas').getContext('2d');
		displayCanvas.canvas.height = displayCanvas.height;
		displayCanvas.canvas.width = displayCanvas.width;

		// Finish
		this.isSetUp = true;
		log(`DisplayCanvas.setUp`, 'end');
	}

	updateCanvasSize() {
		log(`updateCanvasSize`, 'start');
		log(`this.parentElement`);
		log(this.parentElement);
		const clientRect = this?.parentElement?.getClientRects()[0];
		displayCanvas.width = clientRect?.width || 1000;
		displayCanvas.height = clientRect?.height || 1000;
		displayCanvas.canvas.height = displayCanvas.height;
		displayCanvas.canvas.width = displayCanvas.width;

		displayCanvas.text = this.getAttribute('text') || '';
		displayCanvas.fontSize = parseInt(this.getAttribute('font-size')) || 48;
		displayCanvas.pagePadding = parseInt(this.getAttribute('page-padding')) || 5;
		displayCanvas.lineGap = parseInt(this.getAttribute('line-gap')) || 12;
		displayCanvas.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		displayCanvas.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

		displayCanvas.textBlock = false;

		this.showPageExtras = this.attributes.showPageExtras || livePreviewOptions.showPageExtras;
		this.showLineExtras = this.attributes.showLineExtras || livePreviewOptions.showLineExtras;
		this.showCharacterExtras =
			this.attributes.showCharacterExtras || livePreviewOptions.showCharacterExtras;
		this.drawCrisp = false;
		log(`updateCanvasSize`, 'end');
	}

	/**
	 * Draw the canvas when it's loaded
	 */
	connectedCallback() {
		log(`DisplayCanvas.connectedCallback`, 'start');
		window.setTimeout(() => {
			log(`DisplayCanvas.connectedCallback SETTIMEOUT HANDLER`, 'start');
			log(`this.parentElement`);
			log(this.parentElement);
			log(`this.parentElement.clientRects`);
			log(this.parentElement.getClientRects()[0]);

			this.setUp();
			this.updateCanvasSize();
			this.updateTextBlock();
			this.redraw();
			log(`DisplayCanvas.connectedCallback SETTIMEOUT HANDLER`, 'end');
		}, 10);
		log(`DisplayCanvas.connectedCallback`, 'end');
	}

	updateTextBlock() {
		log(`DisplayCanvas.updateTextBlock`, 'start');
		log(`displayCanvas.width: ${displayCanvas.width}`);
		log(`displayCanvas.height: ${displayCanvas.height}`);
		displayCanvas.textBlock = new TextBlock({
			characterString: displayCanvas.text,
			fontSize: displayCanvas.fontSize,
			canvasMaxes: this.calculatePageMaxes(),
			lineGap: displayCanvas.lineGap,
			drawPageExtras: drawDisplayPageExtras,
			drawLineExtras: drawDisplayLineExtras,
			drawCharacterExtras: drawDisplayCharacterExtras,
			drawCharacter: drawDisplayCharacter,
		});
		log(`DisplayCanvas.updateTextBlock`, 'end');
	}

	calculatePageMaxes() {
		log(`DisplayCanvas.calculatePageMaxes`, 'start');
		log(`displayCanvas.width: ${displayCanvas.width}`);
		log(`displayCanvas.height: ${displayCanvas.height}`);

		const contentWidth = displayCanvas.width - 2 * displayCanvas.pagePadding;
		const contentHeight = displayCanvas.height - 2 * displayCanvas.pagePadding;
		log(`contentWidth: ${contentWidth}`);
		log(`contentHeight: ${contentHeight}`);

		const maxes = {
			xMin: displayCanvas.pagePadding,
			xMax: displayCanvas.pagePadding + contentWidth,
			yMin: displayCanvas.pagePadding,
			yMax: displayCanvas.pagePadding + contentHeight,
		};

		log(`DisplayCanvas.calculatePageMaxes`, 'end');
		return maxes;
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return [
			'text',
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
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		log(`DisplayCanvas.attributeChangeCallback`, 'start');
		log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		switch (attributeName) {
			case 'text':
				displayCanvas.text = newValue;
				break;

			case 'font-size':
				displayCanvas.fontSize = Math.max(parseInt(newValue), 1);
				break;

			case 'line-gap':
				displayCanvas.lineGap = Math.max(parseInt(newValue), 0);
				break;

			case 'page-padding':
				displayCanvas.pagePadding = Math.max(parseInt(newValue), 0);
				break;

			case 'height':
				displayCanvas.height = parseInt(newValue);
				// this.setAttribute('height', parseInt(newValue));
				displayCanvas.canvas.height = parseInt(newValue);
				break;

			case 'width':
				displayCanvas.width = parseInt(newValue);
				// this.setAttribute('width', parseInt(newValue));
				displayCanvas.canvas.width = parseInt(newValue);
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

		if (this.isSetUp) {
			this.updateTextBlock();
			this.redraw();
		}

		log(`DisplayCanvas.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		log('DisplayCanvas.redraw', 'start');

		log(`THIS CONTEXT`);
		log(displayCanvas.ctx);

		log(`displayCanvas.width: ${displayCanvas.width}`);
		log(`displayCanvas.height: ${displayCanvas.height}`);

		displayCanvas.ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

		displayCanvas.textBlock.draw({
			showPageExtras: this.showPageExtras,
			showLineExtras: this.showLineExtras,
			showCharacterExtras: this.showCharacterExtras,
			showCharacter: true,
		});

		log('DisplayCanvas.redraw', 'end');
	}

	iterator(drawFunction) {
		const data = displayCanvas.textBlock.data;
		for (let block = 0; block < data.length; block++) {
			for (let item = 0; item < data[block].length; item++) {
				drawFunction(data[block][item], this);
			}
		}
	}
}
// --------------------------------------------------------------
// Draw functions for individual pieces
// --------------------------------------------------------------

function drawDisplayPageExtras() {
	log(`displayCanvas.drawDisplayPageExtras`, 'start');
	const maxes = displayCanvas.calculatePageMaxes();
	log(maxes);
	const top = maxes.yMin || 0;
	const bottom =
		maxes.yMax === Infinity
			? displayCanvas.canvas.height
			: maxes.yMax || displayCanvas.canvas.height;
	const left = maxes.xMin || 0;
	const right =
		maxes.xMax === Infinity ? displayCanvas.canvas.width : maxes.xMax || displayCanvas.canvas.width;
	const width = right - left;
	const height = bottom - top;

	log(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

	displayCanvas.ctx.fillStyle = 'transparent';
	displayCanvas.ctx.strokeStyle = accentColors.gray.l90;
	displayCanvas.ctx.lineWidth = 1;

	displayCanvas.ctx.strokeRect(makeCrisp(left), makeCrisp(top), round(width), round(height));

	log(`displayCanvas.drawDisplayPageExtras`, 'end');
}

function drawDisplayLineExtras(charData) {
	log(`displayCanvas.drawDisplayLineExtras`, 'start');
	displayCanvas.ctx.strokeStyle = accentColors.gray.l85;
	displayCanvas.ctx.beginPath();
	displayCanvas.ctx.moveTo(displayCanvas.textBlock.canvasMaxes.xMin, charData.view.dy);
	displayCanvas.ctx.lineTo(displayCanvas.textBlock.canvasMaxes.xMax, charData.view.dy);
	displayCanvas.ctx.closePath();
	displayCanvas.ctx.stroke();
	log(`displayCanvas.drawDisplayLineExtras`, 'end');
}

function drawDisplayCharacterExtras(charData) {
	log(`displayCanvas.drawDisplayCharacterExtras`, 'start');
	const project = getCurrentProject();
	const settings = project.settings.font;
	const scale = charData.view.dz;
	let drawWidth = charData.widths.advance * scale;
	let drawHeight = project.totalVertical * scale;
	let drawY = charData.view.dy - settings.ascent * scale;
	let drawX = charData.view.dx;
	const drawK = charData.widths.kern * scale * -1;

	log(`\t drawing ${charData.char}`);

	if (charData.widths.kern) {
		displayCanvas.ctx.fillStyle = 'orange';
		displayCanvas.ctx.globalAlpha = 0.3;
		displayCanvas.ctx.fillRect(drawX + drawWidth - drawK, drawY, drawK, drawHeight);
		displayCanvas.ctx.globalAlpha = 1;
	}

	displayCanvas.ctx.fillStyle = 'transparent';
	displayCanvas.ctx.strokeStyle = accentColors.blue.l85;
	displayCanvas.ctx.lineWidth = 1;

	if (this.drawCrisp) {
		drawX = makeCrisp(drawX);
		drawY = makeCrisp(drawY);
		drawWidth = round(drawWidth);
		drawHeight = round(drawHeight);
	}

	displayCanvas.ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

	log(`displayCanvas.drawDisplayCharacterExtras`, 'end');
}

function drawDisplayCharacter(charData) {
	// log(`displayCanvas.drawDisplayCharacter`, 'start');
	// log(this);
	// log(charData);
	// log(`THIS CONTEXT`);
	// log(displayCanvas.ctx);
	// const settings = getCurrentProject().settings.font;
	const item = charData.item;

	// TODO combineAllShapes
	// const combineAllShapes = td.combineAllShapes || false;
	// const combineAllShapes = false;

	// log(`charData.view`);
	// log(`dx: ${charData.view.dx}, dy: ${charData.view.dy}, dz: ${charData.view.dz}`);
	const view = clone(charData.view);
	// log(`cloned view`);
	// log(`dx: ${view.dx}, dy: ${view.dy}, dz: ${view.dz}`);

	// log(`displayCanvas.pagePadding: ${displayCanvas.pagePadding}`);

	// view.dx *= view.dz;
	// view.dx += displayCanvas.pagePadding;
	// view.dy += settings.ascent + displayCanvas.pagePadding;
	// view.dy *= view.dz;
	// view.dy += displayCanvas.pagePadding;

	// log(`\t drawing ${charData.char}`);
	// log(`dx: ${view.dx}, dy: ${view.dy}, dz: ${view.dz}`);

	if (item) {
		displayCanvas.ctx.fillStyle = uiColors.enabled.resting.text;
		displayCanvas.ctx.strokeStyle = 'transparent';

		// TODO combineAllShapes
		// if (combineAllShapes) {
		// 	if (!this.cache[charData.char]) {
		// 		this.cache[charData.char] = item.clone().combineAllShapes(true);
		// 	}

		// 	this.cache[charData.char].drawGlyph(displayCanvas.ctx, view, 1, true);
		// } else {
		// 	drawGlyph(item, displayCanvas.ctx, view, 1, true);
		// }

		drawGlyph(item, displayCanvas.ctx, view, 1, true);
	}

	// log(`displayCanvas.drawDisplayCharacter`, 'end');
}

// --------------------------------------------------------------
// Update options
// --------------------------------------------------------------

// function createImage() {
// 	const imageData = displayCanvas.canvas.toDataURL();

// 	const win = window.open(document.location.href, 'Glyphr Test Drive');

// 	win.document.write(
// 		'<!DOCTYPE html><html>' +
// 			'<head><title>Glyphr - Test Drive Image</title></head>' +
// 			'<body style="padding:40px; text-align:center;">' +
// 			'<img src="' +
// 			imageData +
// 			'" title="Glyphr Test Drive" style="border:1px solid #f6f6f6;">' +
// 			'</html>'
// 	);
// }
