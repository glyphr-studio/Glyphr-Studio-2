import { makeElement } from '../../common/dom.js';
import { uiColors, accentColors } from '../../common/colors.js';
import { hexToChars } from '../../common/unicode.js';
import { lookUpGlyphName } from '../../lib/unicode_names.js';
import { Glyph } from '../../project_data/glyph.js';
import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { drawGlyph } from '../../edit_canvas/draw_paths.js';
import { linkCSS } from '../controls.js';

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

		let settings = getCurrentProject().projectSettings;
		let overallSize = 50;
		let gutterSize = 2;
		let contentSize = overallSize - 2 * gutterSize;
		let upm = settings.upm;
		let ascent = settings.ascent;
		let zoom = contentSize / upm;
		let advanceWidth;

		this.setAttribute('title', `${lookUpGlyphName(this.glyphHex, true)}\n${this.glyphHex}`);

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.backgroundSize = `auto ${overallSize}px`;

		if (this.hasAttribute('selected')) this.wrapper.setAttribute('selected', '');

		if (this.glyphObject) {
			this.thumbnail = makeElement({
				tag: 'canvas',
				className: 'thumbnail',
				attributes: {
					style: `
						width: ${overallSize}px;
						height: ${overallSize}px;
					`,
				},
			});
			this.ctx = this.thumbnail.getContext('2d');
			this.thumbnail.width = overallSize;
			this.thumbnail.height = overallSize;
			advanceWidth = this.glyphObject.advanceWidth;

			this.view = {
				dx: gutterSize + (contentSize - zoom * advanceWidth) / 2,
				dy: gutterSize + zoom * ascent,
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
		let style = makeElement({ tag: 'style' });

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// shadow.appendChild(linkCSS('glyph-tile'));
		shadow.appendChild(makeCSS());

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

		let wrapper = this.shadowRoot ? this.shadowRoot.querySelector('.wrapper') : false;

		if (wrapper) {
			if (this.hasAttribute('selected')) wrapper.setAttribute('selected', '');
			else wrapper.removeAttribute('selected');
		}

		redrawGlyph(this);
		// log(`GlyphTile.attributeChangedCallback`, 'end');
	}
}

function redrawGlyph(tile) {
	if (tile.glyphObject) {
		tile.ctx.clearRect(0, 0, tile.thumbnail.width, tile.thumbnail.height);
		drawGlyph(tile.glyphObject, tile.ctx, tile.view);
	}
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
			paths: [
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

/**
 * In-lines CSS
 */

function makeCSS() {
	let cssElement = makeElement({ tag: 'style' });

	cssElement.innerHTML = `
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
	box-shadow: var(--l1-shadow);
	border-radius: 2px;
	transition: opacity 500ms ease-in;
}

.wrapper {
	display: inline-block;
	margin: 0px;
	padding: 1px;
	height: 100%;
	width: 52px;
	text-align: center;
	overflow-x: hidden;
	overflow-y: hidden;
	background-repeat: no-repeat;
}

.wrapper:hover,
.wrapper:focus {
	background: linear-gradient(var(--accent-color), transparent);
	background-repeat: no-repeat;
	cursor: pointer;
}

.wrapper[selected] {
	background: linear-gradient(var(--accent-color), transparent);
	background-repeat: no-repeat;
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
	color: var(--disabled-background);
	margin: auto;
	width: 50px;
	height: 50px;
	box-shadow: var(--l1-shadow);
	border-radius: 1px;
}

.wrapper:hover .thumbnail,
.wrapper:focus .thumbnail {
	opacity: 1;
	background-color: white;
	box-shadow: var(--l1-shadow);
	color: var(--enabled-active-lightText);
}

.wrapper[selected] .thumbnail {
	opacity: 1;
	background-color: white;
	box-shadow: var(--l1-shadow);
	color: var(--enabled-active-lightText);
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
	color: var(--gray-45);
	position: relative;
	left: -1px;
}

.wrapper[selected] .name,
.wrapper:hover .name {
	color: var(--blue-l40);
	background-color: var(--blue-l90);
}

	`;

	return cssElement;
}
