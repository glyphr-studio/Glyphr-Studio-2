import { makeElement } from '../../common/dom.js';
import { hexesToChars } from '../../common/character_ids.js';
import { lookUpGlyphName } from '../../lib/unicode_names.js';
import { getCurrentProject, log } from '../../app/main.js';
import { drawGlyph } from '../../display_canvas/draw_paths.js';
import style from './glyph-tile.css?inline';

/**
 * A clickable mini-preview tile of a single glyph
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

		const displayedItemID = this.getAttribute('displayed-item-id');
		this.glyph = getCurrentProject().getItem(displayedItemID);
		const chars = this.glyph.chars || hexesToChars(displayedItemID);
		const name = this.glyph?.name || lookUpGlyphName(displayedItemID, true);
		this.view = {};

		// log(`displayedItemID: ${displayedItemID}`);
		// log(`chars: ${chars}`);
		// log(`name: ${name}`);
		// log(this.glyph);

		const project = getCurrentProject();
		const fontSettings = project.settings.font;
		const overallSize = 50;
		const gutterSize = 2;
		const contentSize = overallSize - 2 * gutterSize;
		const zoom = contentSize / project.totalVertical;
		let advanceWidth;

		// log(`contentSize: ${contentSize}`);
		// log(`zoom: ${zoom}`);

		this.setAttribute('title', `${name}\n${displayedItemID}`);

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.backgroundSize = `auto ${overallSize}px`;

		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');

		if (this.glyph && this.glyph.paths.length) {
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
			advanceWidth = this.glyph.advanceWidth;

			this.view = {
				dx: gutterSize + (contentSize - zoom * advanceWidth) / 2,
				dy: gutterSize + zoom * fontSettings.ascent,
				dz: zoom,
			};

			// log(`view is ${this.view.dx}, ${this.view.dy}, ${this.view.dz}`);
		} else {
			this.thumbnail = makeElement({
				className: 'thumbnail',
				content: chars,
			});
			// log(`no glyph`);
		}

		this.name = makeElement({ className: 'name' });
		this.name.innerHTML = displayedItemID === '0x20' ? 'Space' : chars;

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.wrapper.appendChild(this.thumbnail);
		this.wrapper.appendChild(this.name);

		shadow.appendChild(this.wrapper);
		redraw(this);

		// log(`GlyphTile.constructor`, 'end');
	}

	attributeChangedCallback() {
		// log(`GlyphTile.attributeChangedCallback`, 'start');
		// log(`name: ${name}`);
		// log(`oldValue: ${oldValue}`);
		// log(`newValue: ${newValue}`);

		const wrapper = this.shadowRoot ? this.shadowRoot.querySelector('.wrapper') : false;

		if (wrapper) {
			if (this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}

		redraw(this);
		// log(`GlyphTile.attributeChangedCallback`, 'end');
	}
}

function redraw(tile) {
	if (tile.glyph && tile.ctx) {
		tile.ctx.clearRect(0, 0, tile.thumbnail.width, tile.thumbnail.height);
		drawGlyph(tile.glyph, tile.ctx, tile.view);
	}
}
