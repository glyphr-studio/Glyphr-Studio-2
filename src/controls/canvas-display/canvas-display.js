import { makeElement } from '../../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { glyphToHex } from '../../common/unicode.js';
import { drawGlyph } from '../../edit_canvas/draw_paths.js';
import { linkCSS } from '../controls.js';


/**
 * CanvasDisplay takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
export class CanvasDisplay extends HTMLElement {
	/**
	 * Create an CanvasDisplay
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`CanvasDisplay.constructor`, 'start');

		super();

		Object.keys(attributes).forEach((key) =>
			this.setAttribute(key, attributes[key])
		);

		this.canvas = makeElement({ tag: 'canvas' });
		this.ctx = this.canvas.getContext('2d');

		this.glyphs = this.getAttribute('glyphs') || '';
		this.width = this.getAttribute('width') || 1000;
		this.height = this.getAttribute('height') || 1100;
		this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
		this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(linkCSS('canvas-display'));

		shadow.appendChild(this.canvas);

		this.canvas.height = this.height;
		this.canvas.width = this.width;

		this.redraw();
		// log(`CanvasDisplay.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	 static get observedAttributes() {
		return ['glyphs', 'height', 'width', 'vertical-align', 'horizontal-align'];
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`CanvasDisplay.attributeChangeCallback`, 'start');
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
		// log(`CanvasDisplay.attributeChangeCallback`, 'end');
	}

	/**
	 * Updates the canvas
	 */
	redraw() {
		// log('CanvasDisplay.redraw', 'start');
		const editor = getCurrentProjectEditor();
		let glyph = editor.selectedGlyph;
		let settings = getCurrentProject().projectSettings;
		let gutterSize = 20;
		let contentWidth = this.width - (2*gutterSize);
		let contentHeight = this.height - (2*gutterSize);
		let upm = settings.upm;
		let ascent = settings.ascent;
		let zoom = Math.min(contentWidth, contentHeight) / upm;
		let advanceWidth = glyph.advanceWidth;

		let view = {
			dx: gutterSize + ((contentWidth - (zoom * advanceWidth))/2),
			dy: gutterSize + (zoom * (ascent)),
			dz: zoom,
		};

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = accentColors.gray.l95;
		this.ctx.fillRect(view.dx, 0, 1, 1000);
		this.ctx.fillRect(0, view.dy, 1000, 1);

		let glyphHex = glyphToHex(this.glyphs.charAt(0));

		let sg = getCurrentProject().getGlyph(glyphHex);
		// log(sg);
		drawGlyph(sg, this.ctx, view);
		// log('CanvasDisplay.redraw', 'end');
	}
}
