import { getCurrentProject } from '../../app/main.js';
import { hexesToChars } from '../../common/character_ids.js';
import { makeElement } from '../../common/dom.js';
import { remove } from '../../common/functions.js';
import { isWhitespace } from '../../lib/unicode/unicode_names.js';
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
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		super();
		// log(`GlyphTile.constructor`, 'start');
		// log(attributes);

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));
		this.project = attributes.project || getCurrentProject();
		this.showingOtherProject = !!attributes.project;
		const displayedItemID = this.getAttribute('displayed-item-id');
		this.glyph = this.project.getItem(displayedItemID);
		const chars = this.glyph?.chars || hexesToChars(remove(displayedItemID, 'glyph-'));

		const name = this.glyph?.name || this.project.getItemName(displayedItemID, true);
		this.view = {};

		// log(`displayedItemID: ${displayedItemID}`);
		// log(`chars: ${chars}`);
		// log(`name: ${name}`);
		// log(this.glyph);

		const overallSize = 50;

		this.setAttribute('title', `${name}\n${displayedItemID}`);

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.backgroundSize = `auto ${overallSize}px`;

		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');
		if (this.showingOtherProject) this.removeAttribute('selected');

		if (this.glyph && this.glyph.advanceWidth) {
			this.thumbnail = makeElement({
				tag: 'span',
				className: 'thumbnail',
			});
			this.thumbnail.width = overallSize;
			this.thumbnail.height = overallSize;
		} else {
			this.thumbnail = makeElement({
				className: 'thumbnail',
			});
			if (isWhitespace(remove(displayedItemID, 'glyph-'))) {
				this.thumbnail.innerHTML = `
					<div class="whitespace-char-thumbnail">white space</div>
				`;
			} else {
				if (chars) {
					this.thumbnail.innerHTML = chars;
				} else {
					this.thumbnail.innerHTML = `
						<div class="whitespace-char-thumbnail">${displayedItemID}</div>
					`;
				}
			}
			// log(`no glyph`);
		}

		this.name = makeElement({ className: 'name' });
		if (chars) this.name.innerHTML = displayedItemID === 'glyph-0x20' ? 'Space' : chars;
		else this.name.innerHTML = name.replaceAll('Component ', 'comp-');

		// Put it all together
		const shadow = this.attachShadow({ mode: 'open' });
		const styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.wrapper.appendChild(this.thumbnail);
		this.wrapper.appendChild(this.name);

		shadow.appendChild(this.wrapper);
		this.redraw();

		// log(`GlyphTile.constructor`, 'end');
	}

	attributeChangedCallback() {
		// log(`GlyphTile.attributeChangedCallback`, 'start');
		const wrapper = this.shadowRoot ? this.shadowRoot.querySelector('.wrapper') : false;
		if (wrapper && !this.showingOtherProject) {
			if (this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}
		// log(`GlyphTile.attributeChangedCallback`, 'end');
	}

	redraw() {
		if (this.glyph?.shapes?.length) {
			// const project = getCurrentProject();
			this.thumbnail.innerHTML = this.project.makeItemThumbnail(this.glyph);
		}
	}
}
