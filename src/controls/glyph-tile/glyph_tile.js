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

		Object.keys(attributes).forEach((key) => {
			if (key !== 'project') this.setAttribute(key, attributes[key]);
		});
		this.project = attributes.project || getCurrentProject();
		const displayedItemID = this.getAttribute('displayed-item-id');
		this.glyph = this.project.getItem(displayedItemID);
		const chars = this.glyph?.chars || hexesToChars(remove(displayedItemID, 'glyph-'));

		const name = this.glyph?.name || this.project.getItemName(displayedItemID, true);
		this.view = {};

		// log(this.project);
		// log(this.glyph);
		// log(`displayedItemID: ${displayedItemID}`);
		// log(`chars: ${chars}`);
		// log(`name: ${name}`);

		const overallSize = 50;

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.backgroundSize = `auto ${overallSize}px`;

		// Session-state information
		let sessionState = 'notCreated';
		if (attributes['session-state']) {
			sessionState = attributes['session-state'];
		} else if (this?.glyph?.sessionState) {
			sessionState = this?.glyph?.sessionState;
		}

		let sessionMessage = '';
		this.wrapper.setAttribute('session-state', sessionState);
		if (sessionState === 'notCreated')
			sessionMessage = '\n\nItem does not exist yet, click to create';
		if (sessionState === 'new')
			sessionMessage = '\n\nItem was created, but has not yet been edited';
		if (sessionState === 'changed') sessionMessage = '\n\nItem was recently edited';

		// Selection
		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');

		if (this.glyph && this.glyph.hasChangedThisSession === true) {
			this.setAttribute('title', `${name}\n${displayedItemID}${sessionMessage}`);
			this.thumbnail = makeElement({
				tag: 'span',
				className: 'thumbnail',
			});
			// @ts-ignore
			this.thumbnail.width = overallSize;
			// @ts-ignore
			this.thumbnail.height = overallSize;
		} else {
			this.setAttribute('title', `${name}\n${displayedItemID}${sessionMessage}`);
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

	/**
	 * what to do when an attribute is changed
	 */
	attributeChangedCallback() {
		// log(`GlyphTile.attributeChangedCallback`, 'start');
		const wrapper = this.shadowRoot ? this.shadowRoot.querySelector('.wrapper') : false;
		// log(wrapper);
		if (wrapper) {
			if (this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}
		// log(`GlyphTile.attributeChangedCallback`, 'end');
	}

	/**
	 * redraw this thumbnail
	 */
	redraw() {
		if (getCurrentProject().settings.app.displaySVGGlyphs && this.glyph.svgColorGlyph) {
			const img = this.glyph.svgColorGlyph.img;
			this.thumbnail.innerHTML = '';
			const offsets = this.project.computeThumbnailOffsets(this.glyph);
			const leftAdj = offsets.translateX - 2 * offsets.padding;
			img.style.left = `${leftAdj}px`;
			this.thumbnail.appendChild(img);
		} else if (this.glyph?.shapes?.length) {
			this.thumbnail.innerHTML = this.project.makeItemThumbnail(this.glyph);
		}
	}
}
