import { makeElement } from '../../common/dom.js';
import { uiColors, accentColors } from '../../common/colors.js';
import { hexToChars } from '../../common/unicode.js';
import { lookUpGlyphName } from '../../lib/unicode_names.js';
import Glyph from '../../glyph_elements/glyph.js';
import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { log } from '../../common/functions.js';

/**
 * description
 */
export default class GlyphTile extends HTMLElement {
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() { return ['selected']; }

	/**
	 * Create an GlyphTile
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		log(`GlyphTile.constructor`, 'start');
		log(attributes);
		super();

		Object.keys(attributes).forEach((key) =>
			this.setAttribute(key, attributes[key])
		);

		this.glyphHex = this.getAttribute('glyph');
		this.glyphChar = hexToChars(this.glyphHex);
		this.glyphObject = getCurrentProject().getGlyph(this.glyphHex);
		this.view = {};

		log(`this.glyphHex: ${this.glyphHex}`);

		let settings = getCurrentProject().projectSettings;
		let overallSize = 50;
		let gutterSize = 2;
		let contentSize = overallSize - (2*gutterSize);
		let upm = settings.upm;
		let ascent = settings.ascent;
		let zoom = contentSize / upm;
		let glyphWidth;

		this.setAttribute(
			'title',
			`${lookUpGlyphName(this.glyphHex, true)}\n${this.glyphHex}`
		);

		this.wrapper = makeElement({ className: 'wrapper' });
		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');

		if (this.glyphObject) {
			this.thumbnail = makeElement({ tag: 'canvas', className: 'thumbnail' });
			this.ctx = this.thumbnail.getContext('2d');
			this.thumbnail.width = overallSize;
			this.thumbnail.height = overallSize;
			glyphWidth = this.glyphObject.advanceWidth;

			this.view = {
				dx: gutterSize + ((contentSize - (zoom * glyphWidth))/2),
				dy: gutterSize + (zoom * (ascent)),
				dz: zoom,
			};

			log(`view is ${this.view.dx}, ${this.view.dy}, ${this.view.dz}`);

		} else {
			this.thumbnail = makeElement({
				className: 'thumbnail',
				content: this.glyphChar,
			});
			log(`no glyphObject`);
		}

		this.name = makeElement({ className: 'name' });
		this.name.innerHTML = this.glyphHex === '0x20'? 'Space' : this.glyphChar;
		let style = makeElement({ tag: 'style'});

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(style);

		this.wrapper.appendChild(this.thumbnail);
		this.wrapper.appendChild(this.name);

		shadow.appendChild(this.wrapper);

		updateStyle(this, overallSize);
		redrawGlyph(this);


		log(`GlyphTile.constructor`, 'end');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		log(`GlyphTile.attributeChangedCallback`, 'start');
		log(`name: ${name}`);
		log(`oldValue: ${oldValue}`);
		log(`newValue: ${newValue}`);

		let wrapper = this.shadowRoot? this.shadowRoot.querySelector('.wrapper') : false;

		if(wrapper){
			if(this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}

		redrawGlyph(this);
		log(`GlyphTile.attributeChangedCallback`, 'end');
	}
}

function redrawGlyph(tile){
	if (tile.glyphObject) {
		tile.ctx.clearRect(0, 0, tile.thumbnail.width, tile.thumbnail.height);
		tile.glyphObject.drawGlyph(
			tile.ctx, tile.view, 1, false,
			tile.hasAttribute('selected') ? accentColors.blue.l35 : accentColors.gray.l05
		);
	}
}

function updateStyle(tile, overallSize){
	const shadow = tile.shadowRoot;
	shadow.querySelector('style').textContent = `
		* {
				box-sizing: border-box;
				user-select: none;
				-moz-user-select: none;
				-webkit-user-select: none;
				-ms-user-select: none;
		}

		:host {
				box-sizing: border-box;
				width: 52px;
				height: 75px;
				overflow-y: hidden;
				overflow-x: hidden;
				margin: 0px;
				padding: 0px;
				background-color: rgba(255, 255, 255, 0.4);
				box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04);
				border-radius: 2px;
		}

		.wrapper {
				transition: border-color 2s easeOutExpo;
				display: inline-block;
				margin: 0px;
				padding: 1px;
				height: 100%;
				width: 52px;
				text-align: center;
				overflow-x: hidden;
				overflow-y: hidden;
				background-repeat: no-repeat;
				background-size: auto ${overallSize}px;
		}

		.wrapper:hover,
		.wrapper:focus {
				background: linear-gradient(${uiColors.accent}, transparent);
				background-repeat: no-repeat;
				background-size: auto ${overallSize}px;
				cursor: pointer;
		}

		.wrapper[selected] {
				background: linear-gradient(${uiColors.accent}, transparent);
				background-repeat: no-repeat;
				background-size: auto ${overallSize}px;
		}

		.wrapper[selected]:hover,
		.wrapper[selected]:focus {
				cursor: default;
		}

		.thumbnail {
				display: block;
				background-color: white;
				opacity: 0.8;
				font-size: 36px;
				padding-top: 2px;
				color: ${uiColors.disabled.background};
				margin: auto;
				width: ${overallSize}px;
				height: ${overallSize}px;
				box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
				border-radius: 1px;
		}

		.wrapper:hover .thumbnail,
		.wrapper:focus .thumbnail {
				opacity: 1;
				background-color: white;
				box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
				color: ${uiColors.enabled.active.lightText};
		}

		.wrapper[selected] .thumbnail {
				opacity: 1;
				background-color: white;
				box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
				color: ${uiColors.enabled.active.lightText};
		}

		.wrapper[selected]:hover .thumbnail {
				cursor: default;
		}

		.name {
				display: block;
				text-align: left;
				width: 300px;
				height: 28px;
				padding: 2px 0px 0px 4px;
				color: #6D6D6D;
		}

		.wrapper[selected] .name,
		.wrapper:hover .name {
				color: ${accentColors.blue.l40};
				background-color: ${accentColors.blue.l90};
		}
	`;
}


/**
 * This is just for testing, in real life this will call
 * a global project function
 * @param {string} gid - glyph id
 * @returns {Glyph}
 */
function getTestGlyph(gid) {
	if (gid === '0x41') {
		return new Glyph({
			id: gid,
			shapes: [
				{
					path: {
						pathPoints: [
							{ p: { coord: { x: 0, y: 0 } } },
							{ p: { coord: { x: 200, y: 700 } } },
							{ p: { coord: { x: 300, y: 700 } } },
							{ p: { coord: { x: 500, y: 0 } } },
							{ p: { coord: { x: 400, y: 0 } } },
							{ p: { coord: { x: 300, y: 300 } } },
							{ p: { coord: { x: 200, y: 300 } } },
							{ p: { coord: { x: 100, y: 0 } } },
						],
					},
				},
				{
					path: {
						pathPoints: [
							{ p: { coord: { x: 200, y: 350 } } },
							{ p: { coord: { x: 300, y: 350 } } },
							{ p: { coord: { x: 250, y: 600 } } },
						],
					},
				},
				{
					path: {
						pathPoints: [
							{ p: { coord: { x: 0, y: 700 } } },
							{ p: { coord: { x: 100, y: 700 } } },
							{ p: { coord: { x: 0, y: 600 } } },
						],
					},
				},
				{
					path: {
						pathPoints: [
							{ p: { coord: { x: 0, y: -300 } } },
							{ p: { coord: { x: 100, y: -300 } } },
							{ p: { coord: { x: 0, y: -200 } } },
						],
					},
				},
			],
		});
	} else {
		return false;
	}
}
