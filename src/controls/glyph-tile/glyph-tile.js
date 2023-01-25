import { makeElement } from '../../common/dom.js';
import { uiColors, accentColors } from '../../common/colors.js';
import { hexToChars } from '../../common/unicode.js';
import { lookUpGlyphName } from '../../lib/unicode_names.js';
import { Glyph } from '../../project_data/glyph.js';
import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { drawGlyph } from '../../display_canvas/draw_paths.js';
import style from './glyph-tile.css?inline';

/**
 * description
 */
export class GlyphTile extends HTMLElement {
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() {
		return ['selected'];
	}

	/**
	 * Create an GlyphTile
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`GlyphTile.constructor`, 'start');
		// log(attributes);
		super();

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		this.glyphHex = this.getAttribute('glyph');
		this.glyphChar = hexToChars(this.glyphHex);
		this.glyphObject = getCurrentProject().getGlyph(this.glyphHex);
		this.view = {};

		// log(`this.glyphHex: ${this.glyphHex}`);

		const project = getCurrentProject();
		const fontSettings = project.settings.font;
		const overallSize = 50;
		const gutterSize = 2;
		const contentSize = overallSize - 2 * gutterSize;
		const zoom = contentSize / project.totalVertical;
		let advanceWidth;

		// log(`contentSize: ${contentSize}`);
		// log(`zoom: ${zoom}`);

		this.setAttribute('title', `${lookUpGlyphName(this.glyphHex, true)}\n${this.glyphHex}`);

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.backgroundSize = `auto ${overallSize}px`;

		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');

		if (this.glyphObject && this.glyphObject.paths.length) {
			this.thumbnail = makeElement({
				tag: 'canvas',
				className: 'thumbnail',
				style: `
					width: ${overallSize}px;
					height: ${overallSize}px;
				`,
			});
			this.ctx = this.thumbnail.getContext('2d');
			this.thumbnail.width = overallSize;
			this.thumbnail.height = overallSize;
			advanceWidth = this.glyphObject.advanceWidth;

			this.view = {
				dx: gutterSize + (contentSize - zoom * advanceWidth) / 2,
				dy: gutterSize + zoom * fontSettings.ascent,
				dz: zoom,
			};

			// log(`view is ${this.view.dx}, ${this.view.dy}, ${this.view.dz}`);
		} else {
			this.thumbnail = makeElement({
				className: 'thumbnail',
				content: this.glyphChar,
			});
			// log(`no glyphObject`);
		}

		this.name = makeElement({ className: 'name' });
		this.name.innerHTML = this.glyphHex === '0x20' ? 'Space' : this.glyphChar;

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.wrapper.appendChild(this.thumbnail);
		this.wrapper.appendChild(this.name);

		shadow.appendChild(this.wrapper);
		redrawGlyph(this);

		// log(`GlyphTile.constructor`, 'end');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// log(`GlyphTile.attributeChangedCallback`, 'start');
		// log(`name: ${name}`);
		// log(`oldValue: ${oldValue}`);
		// log(`newValue: ${newValue}`);

		const wrapper = this.shadowRoot ? this.shadowRoot.querySelector('.wrapper') : false;

		if (wrapper) {
			if (this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}

		redrawGlyph(this);
		// log(`GlyphTile.attributeChangedCallback`, 'end');
	}
}

function redrawGlyph(tile) {
	if (tile.glyphObject && tile.ctx) {
		tile.ctx.clearRect(0, 0, tile.thumbnail.width, tile.thumbnail.height);
		drawGlyph(tile.glyphObject, tile.ctx, tile.view);
	}
}
