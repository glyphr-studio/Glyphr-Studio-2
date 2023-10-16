import { getCurrentProject, getGlyphrStudioApp } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { makeElement } from '../common/dom.js';
import { caseCamelToKebab, clone, makeCrisp, round } from '../common/functions.js';
import style from './display-canvas.css?inline';
import { drawGlyph } from './draw_paths.js';
import { TextBlock } from './text_block.js';
import { TextBlockOptions } from './text_block_options.js';

/**
 * DisplayCanvas takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
// const displayCanvas = {};
export class DisplayCanvas extends HTMLElement {
	/**
	 * Create an DisplayCanvas
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`DisplayCanvas.constructor`, 'start');
		super();
		// log('attributes');
		// log(attributes);
		this.textBlockOptions = new TextBlockOptions();
		Object.keys(attributes).forEach((key) => {
			if (key !== '_text') {
				if (key !== 'width' && key !== 'height') {
					this.setAttribute(caseCamelToKebab(key), attributes[key]);
				}
				if (this.textBlockOptions[key]) {
					this.textBlockOptions[key] = attributes[key];
				}
			} else {
				this.textBlockOptions.text = attributes._text;
				this.setAttribute('text', this.textBlockOptions.text);
			}
		});
		this.isSetUp = false;
		// log(this);
		// log(`DisplayCanvas.constructor`, 'end');
	}

	/**
	 * Draw the canvas when it's loaded
	 */
	connectedCallback() {
		// log(`DisplayCanvas.connectedCallback`, 'start');
		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.canvas = makeElement({ tag: 'canvas', id: 'mainDisplayCanvas' });
		shadow.appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
		this.drawCrisp = false;

		// Finish
		this.isSetUp = true;
		this.resizeAndRedraw();
		// log(`DisplayCanvas.connectedCallback`, 'end');
	}

	resizeAndRedraw() {
		// log(`DisplayCanvas.resizeAndRedraw`, 'start');
		if (!this.isSetUp) {
			// log('DisplayCanvas.redraw', 'end');
			return;
		}
		this.updateTextBlock();
		this.updateCanvasSize();
		this.redraw();
		// log(`DisplayCanvas.resizeAndRedraw`, 'end');
	}

	updateCanvasSize() {
		// log(`updateCanvasSize`, 'start');
		// log(`this.textBlockOptions`);
		// log(this.textBlockOptions);
		// log(`this.parentElement`);
		// log(this.parentElement);
		const clientRect = this?.parentElement?.getClientRects()[0];
		// log(clientRect);
		const pageHeight = this.textBlockOptions.pageHeight;
		const pageWidth = this.textBlockOptions.pageWidth;
		// log(`pageHeight: ${pageHeight}`);
		// log(`pageWidth: ${pageWidth}`);

		let newHeight = 1000;
		let newWidth = 1000;

		// Heights
		if (pageHeight === 'auto') {
			newHeight = this.textBlock.pixelHeight;
			newHeight += this.textBlockOptions.pagePadding;
		} else if (pageHeight === 'fit') {
			newHeight = clientRect.height;
		} else if (!isNaN(parseInt(pageHeight))) {
			newHeight = parseInt(pageHeight);
		}

		// Widths
		if (pageWidth === 'fit') {
			newWidth = clientRect.width;
		} else if (!isNaN(parseInt(pageWidth))) {
			newWidth = parseInt(pageWidth);
		}
		if (this.widthAdjustment) newWidth += this.widthAdjustment;

		// Assign new values
		// log(`newHeight: ${newHeight}`);
		// log(`newWidth: ${newWidth}`);
		this.height = newHeight;
		this.width = newWidth;
		this.canvas.height = newHeight;
		this.canvas.width = newWidth;

		// log(this);
		// log(`updateCanvasSize`, 'end');
	}

	updateTextBlock() {
		// log(`DisplayCanvas.updateTextBlock`, 'start');
		// log(`this.textBlockOptions:`);
		// log(this.textBlockOptions);
		let pageMaxes = this.calculatePageMaxes();
		let proj = false;
		let editorID = parseInt(this.getAttribute('project-editor'));
		if (!isNaN(editorID)) {
			proj = getGlyphrStudioApp().projectEditors[editorID].project;
		}
		this.textBlock = new TextBlock({
			options: this.textBlockOptions,
			canvasMaxes: pageMaxes,
			ctx: this.ctx,
			drawPageExtras: this.drawDisplayPageExtras,
			drawLineExtras: this.drawDisplayLineExtras,
			drawCharacterExtras: this.drawDisplayCharacterExtras,
			drawCharacter: this.drawDisplayCharacter,
			project: proj,
		});
		// log(`DisplayCanvas.updateTextBlock`, 'end');
	}

	calculatePageMaxes() {
		// log(`DisplayCanvas.calculatePageMaxes`, 'start');
		const clientRect = this?.parentElement?.getClientRects()[0];
		const pagePadding = this.textBlockOptions.pagePadding;
		const pageHeight = this.textBlockOptions.pageHeight;
		const pageWidth = this.textBlockOptions.pageWidth;

		const maxes = {
			xMin: pagePadding,
			yMin: pagePadding,
			xMax: 1000,
			yMax: 1000,
		};

		// Heights
		if (pageHeight === 'auto') {
			maxes.yMax = Infinity;
		} else if (pageHeight === 'fit') {
			maxes.yMax = clientRect.height - pagePadding;
		} else if (!isNaN(parseInt(pageHeight))) {
			maxes.yMax = parseInt(pageHeight);
		}

		// Widths
		if (pageWidth === 'fit') {
			maxes.xMax = clientRect.width - pagePadding;
		} else if (!isNaN(parseInt(pageWidth))) {
			maxes.xMax = parseInt(pageWidth);
		}

		if (this.widthAdjustment) maxes.xMax += this.widthAdjustment;

		// log(`DisplayCanvas.calculatePageMaxes`, 'end');
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
			'show-page-extras',
			'show-line-extras',
			'show-character-extras',
			'show-placeholder-message',
			'width-adjustment',
		];
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`DisplayCanvas.attributeChangeCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);
		// log(this);

		if (attributeName === 'text') {
			this.textBlockOptions.text = newValue;
			this.resizeAndRedraw();
		}

		if (attributeName === 'font-size') {
			this.textBlockOptions.fontSize = Math.max(parseInt(newValue), 1);
			this.resizeAndRedraw();
		}

		if (attributeName === 'line-gap') {
			this.textBlockOptions.lineGap = Math.max(parseInt(newValue), 0);
			this.resizeAndRedraw();
		}

		if (attributeName === 'page-padding') {
			this.textBlockOptions.pagePadding = Math.max(parseInt(newValue), 0);
			this.resizeAndRedraw();
		}

		if (attributeName === 'show-page-extras') {
			this.textBlockOptions.showPageExtras = newValue === 'true';
			this.redraw();
		}

		if (attributeName === 'show-line-extras') {
			this.textBlockOptions.showLineExtras = newValue === 'true';
			this.redraw();
		}

		if (attributeName === 'show-character-extras') {
			this.textBlockOptions.showCharacterExtras = newValue === 'true';
			this.redraw();
		}

		if (attributeName === 'show-placeholder-message') {
			this.textBlockOptions.showPlaceholderMessage = newValue === 'true';
			this.redraw();
		}

		if (attributeName === 'width-adjustment') {
			this.widthAdjustment = parseInt(newValue);
			this.resizeAndRedraw();
		}

		// if (this.isSetUp) {
		// 	this.resizeAndRedraw();
		// }

		// log(`DisplayCanvas.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		// log('DisplayCanvas.redraw', 'start');
		if (!this.isSetUp) {
			// log('DisplayCanvas.redraw', 'end');
			return;
		}
		// log(`THIS CONTEXT`);
		// log(this.ctx);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.textBlock.hasDrawableCharacters) {
			this.textBlock.draw({
				showPageExtras: this.textBlockOptions.showPageExtras,
				showLineExtras: this.textBlockOptions.showLineExtras,
				showCharacterExtras: this.textBlockOptions.showCharacterExtras,
				showCharacter: true,
			});
		} else {
			if (this.textBlockOptions.showPlaceholderMessage) {
				this.ctx.fillStyle = uiColors.disabled.text;
				this.ctx.font = '14px sans-serif';
				this.ctx.textBaseline = 'middle';
				let x = this.textBlock.canvasMaxes.xMin;
				let y = this.height / 2;
				this.ctx.fillText('Project preview text will be shown here.', x, y);
			}
		}

		// log('DisplayCanvas.redraw', 'end');
	}

	iterator(drawFunction) {
		const data = this.textBlock.data;
		for (let block = 0; block < data.length; block++) {
			for (let item = 0; item < data[block].length; item++) {
				drawFunction(data[block][item], this);
			}
		}
	}

	// --------------------------------------------------------------
	// Draw functions for individual pieces
	// --------------------------------------------------------------

	drawDisplayPageExtras(ctx, textBlock) {
		// log(`displayCanvas.drawDisplayPageExtras`, 'start');
		const canvasMaxes = textBlock.canvasMaxes;
		// log(textBlock);
		const top = canvasMaxes.yMin || 0;
		const bottom = canvasMaxes.yMax === Infinity ? textBlock.pixelHeight : canvasMaxes.yMax;
		const left = canvasMaxes.xMin || 0;
		const right = canvasMaxes.xMax || 1000;
		const width = right - left;
		const height = bottom - top;

		// log(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

		ctx.fillStyle = 'transparent';
		ctx.strokeStyle = accentColors.gray.l90;
		ctx.lineWidth = 1;

		ctx.strokeRect(makeCrisp(left), makeCrisp(top), round(width), round(height));

		// log(`displayCanvas.drawDisplayPageExtras`, 'end');
	}

	drawDisplayLineExtras(ctx, charData, textBlock) {
		// log(`displayCanvas.drawDisplayLineExtras`, 'start');
		ctx.strokeStyle = accentColors.gray.l85;
		ctx.beginPath();
		ctx.moveTo(textBlock.canvasMaxes.xMin, charData.view.dy);
		ctx.lineTo(textBlock.canvasMaxes.xMax, charData.view.dy);
		ctx.closePath();
		ctx.stroke();
		// log(`displayCanvas.drawDisplayLineExtras`, 'end');
	}

	drawDisplayCharacterExtras(ctx, charData) {
		// log(`displayCanvas.drawDisplayCharacterExtras`, 'start');
		const project = getCurrentProject();
		const settings = project.settings.font;
		const scale = charData.view.dz;
		let drawWidth = charData.widths.advance * scale;
		let drawHeight = project.totalVertical * scale;
		let drawY = charData.view.dy - settings.ascent * scale;
		let drawX = charData.view.dx;
		const drawK = charData.widths.kern * scale * -1;

		// log(`\t drawing ${charData.char}`);

		if (charData.widths.kern) {
			ctx.fillStyle = 'orange';
			ctx.globalAlpha = 0.3;
			ctx.fillRect(drawX + drawWidth - drawK, drawY, drawK, drawHeight);
			ctx.globalAlpha = 1;
		}

		ctx.fillStyle = 'transparent';
		ctx.strokeStyle = accentColors.blue.l85;
		ctx.lineWidth = 1;

		if (this.drawCrisp) {
			drawX = makeCrisp(drawX);
			drawY = makeCrisp(drawY);
			drawWidth = round(drawWidth);
			drawHeight = round(drawHeight);
		}

		ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

		// log(`displayCanvas.drawDisplayCharacterExtras`, 'end');
	}

	drawDisplayCharacter(ctx, charData) {
		// log(`displayCanvas.drawDisplayCharacter`, 'start');
		// log(this);
		// log(charData);
		// log(`THIS CONTEXT`);
		// log(ctx);
		// const settings = getCurrentProject().settings.font;
		const item = charData.item;

		// log(`charData.view`);
		// log(`dx: ${charData.view.dx}, dy: ${charData.view.dy}, dz: ${charData.view.dz}`);
		const view = clone(charData.view);
		// log(`cloned view`);
		// log(`dx: ${view.dx}, dy: ${view.dy}, dz: ${view.dz}`);

		if (item) {
			ctx.fillStyle = uiColors.enabled.resting.text;
			ctx.strokeStyle = 'transparent';
			drawGlyph(item, ctx, view, 1, true);
		}

		// log(`displayCanvas.drawDisplayCharacter`, 'end');
	}
}
