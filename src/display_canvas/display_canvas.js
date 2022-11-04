import { makeElement } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { glyphToHex } from '../common/unicode.js';
import { drawGlyph } from './draw_paths.js';
import { linkCSS } from '../controls/controls.js';

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

		this.canvas = makeElement({ tag: 'canvas' });
		this.ctx = this.canvas.getContext('2d');

		this.glyphs = this.getAttribute('glyphs') || '';
		this.width = this.getAttribute('width') || 1000;
		this.height = this.getAttribute('height') || 1100;
		this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// shadow.appendChild(linkCSS('display-canvas'));
		shadow.appendChild(makeCSS());

		shadow.appendChild(this.canvas);

		this.canvas.height = this.height;
		this.canvas.width = this.width;

		// this.redraw();
		// log(`DisplayCanvas.constructor`, 'end');
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
		const editor = getCurrentProjectEditor();
		let glyph = editor.selectedGlyph;
		let settings = getCurrentProject().projectSettings;
		let gutterSize = 20;
		let contentWidth = this.width - 2 * gutterSize;
		let contentHeight = this.height - 2 * gutterSize;
		let upm = settings.upm;
		let ascent = settings.ascent;
		let zoom = Math.min(contentWidth, contentHeight) / upm;
		let advanceWidth = glyph.advanceWidth;

		let view = {
			dx: gutterSize + (contentWidth - zoom * advanceWidth) / 2,
			dy: gutterSize + zoom * ascent,
			dz: zoom,
		};

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = accentColors.gray.l95;
		this.ctx.fillRect(view.dx, 0, 1, 1000);
		this.ctx.fillRect(0, view.dy, 1000, 1);

		let glyphHex = glyphToHex(this.glyphs.charAt(0));

		let sg = getCurrentProject().getGlyph(glyphHex);
		log(sg);
		drawGlyph(sg, this.ctx, view);
		log('DisplayCanvas.redraw', 'end');

		/*
			_UI.redrawing = true;
	let td = this.settings;

	if (_UI.current_panel === 'npAttributes') changeFontScale(td.fontsize);
	document.getElementById('livePreviewTextArea').value = td.sampleText;

	td.glyphSequence.setString(td.sampleText);
	td.ctx.clearRect(0, 0, 10000, 10000);

	let lastChar = td.glyphSequence.getLastChar();
	let tdHeight = Math.max(580, lastChar.view ? lastChar.view.dy * lastChar.view.dz : 0);
	td.canvas.height = tdHeight + 20;

	td.glyphSequence.draw();

	_UI.redrawing = false;
	*/
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
