import { makeElement } from '../../common/dom.js';
import { uiColors, flashUIElementAsActive } from '../../common/colors.js';
import { linkCSS } from '../controls.js';

/**
 * Shows an icon that is either selected or unselected,
 * pressing the button toggles the state
 */
export class ButtonToggle extends HTMLElement {
	/**
	 * Create an ButtonToggle
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`ButtonToggle.constructor()`, 'start');
		super();

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		this.size = this.getAttribute('size') || 24;
		this.style.width = `${this.size}px`;
		this.style.height = `${this.size}px`;

		this.gutterSize = Math.round(this.size * 0.05);
		this.iconSize = this.size - this.gutterSize * 2;
		this.selected = this.hasAttribute('selected');
		this.disabled = this.hasAttribute('disabled');

		this.wrapper = makeElement({
			tag: 'div',
			className: 'wrapper',
			tabIndex: !this.disabled,
			attributes: {
				style: `
					border-width: ${attributes.hideBorder ? '0px' : '1px'};
					padding: ${this.gutterSize}px;
					width: ${this.size}px;
					height: ${this.size}px;
				`,
			},
		});
		if (this.disabled) this.wrapper.setAttribute('disabled', '');
		if (this.selected) this.wrapper.setAttribute('selected', '');
		this.wrapper.innerHTML = this.getIcon(this.getAttribute('icon'), this.iconSize);

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// shadow.appendChild(linkCSS('button-toggle'));
		shadow.appendChild(makeCSS());
		shadow.appendChild(this.wrapper);

		if (!this.disabled) {
			this.addEventListener('click', this.toggle);
			this.addEventListener('keydown', this.keyPress);
		}
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'selected'];
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		if (attributeName === 'disabled') {
			if (newValue === '') {
				// disabled
				this.wrapper.setAttribute('disabled', '');
			} else if (oldValue === '') {
				// enabled
				this.wrapper.removeAttribute('disabled');
			}
		}

		if (attributeName === 'selected') {
			if (newValue === '') {
				// selected
				this.wrapper.setAttribute('selected', '');
			} else if (oldValue === '') {
				// not selected
				this.wrapper.removeAttribute('selected');
			}
		}
	}

	/**
	 * Handle keypress events
	 * @param {object} ev - event
	 */
	keyPress(ev) {
		switch (ev.keyCode) {
			case 13: // enter
			case 32: // spacebar
			case 37: // d-pad left
			case 38: // d-pad up
			case 39: // d-pad right
			case 40: // d-pad down
			case 98: // ten key down
			case 100: // ten key left
			case 102: // ten key right
			case 104: // ten key up
			case 107: // ten key +
			case 109: // ten key -
				this.toggle();
				break;

			default:
				break;
		}
	}

	/**
	 * Flips the state of this button
	 */
	toggle() {
		this.selected = !this.selected;

		if (this.selected) {
			this.setAttribute('selected', '');
			this.wrapper.setAttribute('selected', '');
		} else {
			this.removeAttribute('selected');
			this.wrapper.removeAttribute('selected');
		}

		flashUIElementAsActive(this);
	}

	/**
	 * Generates an SVG icon
	 * @param {string} id - which icon to get
	 * @param {number} size - how big the icon should be
	 * @returns {string} - full SVG
	 */
	getIcon(id, size = '24') {
		// log(`getIcon - passed ${id} at size ${size}`);
		let header = ` version="1.1" xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
						x="0px" y="0px" width="${size}px" height="${size}px"`;

		switch (id) {
			case 'lock':
				return `<svg ${header}
								viewBox="0 0 26 26" enable-background="new 0 0 26 26">
								<path d="M17,12V8h-1V7h-1V6h-4v1h-1v1H9v4H8v8h10v-8H17z M15,12h-4V9h1V8h2v1h1V12z"/>
								</svg>`;

			default:
				return `<svg ${header}
								viewBox="0 0 12 12" enable-background="new 0 0 12 12">
								<rect width="12" height="12"/>
								</svg>`;
		}
	}
}

/**
 * In-lines CSS
 */

function makeCSS() {
	let cssElement = makeElement({ tag: 'style' });

	cssElement.innerHTML = `
:host {
	box-sizing: border-box;
	margin: 0;
	border: 0;
	border-radius: 4px;
}

* {
	user-select: none;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
}

.wrapper {
	box-sizing: border-box;
	margin: 0;
	border-radius: 4px;
	border-style: solid;
	vertical-align: top;
	text-align: left;
	overflow: hidden;
	border-color: var(--enabled-restingLight-border);
	background-color: var(--enabled-restingLight-background);
}

.wrapper svg {
	fill: var(--enabled-restingLight-fill);
}

.wrapper:hover {
	cursor: pointer;
	border-color: var(--enabled-focus-border);
	background-color: var(--enabled-focus-background);
}

.wrapper:hover svg {
	fill: var(--enabled-focus-fill);
}

.wrapper:focus {
	outline: var(--global-focus-style);
	outline-offset: -1px;
}

.wrapper[selected] {
	border-color: var(--accent-color);
	background-color: var(--enabled-active-background);
}

.wrapper[selected]:hover {
	cursor: pointer;
	border-color: var(--enabled-active-border);
	background-color: var(--enabled-resting-background);
}

.wrapper[selected]:focus {
	outline: var(--global-focus-style);
}

.wrapper[selected] svg {
	fill: var(--accent-color);
}

.wrapper[disabled],
.wrapper:hover[disabled],
.wrapper:focus[disabled],
.wrapper:active[disabled] {
	cursor: default;
	border-color: var(--disabled-border);
	background-color: var(--disabled-background);
}

.wrapper[disabled] svg,
.wrapper:hover[disabled] svg,
.wrapper:focus[disabled] svg,
.wrapper:active[disabled] svg {
	fill: var(--disabled-fill);
}

	`;

	return cssElement;
}