import { makeElement } from '../../common/dom.js';
import { uiColors, accentColors } from '../../common/colors.js';
import { linkCSS } from '../controls.js';

/**
 * It's a button... only fancier!
 */
export class FancyButton extends HTMLElement {
	/**
	 * Create an FancyButton
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		super();

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		let fast = this.hasAttribute('fast');
		let fastSpeed = '18s';
		let slowSpeed = '90s';
		let speed = fast ? fastSpeed : slowSpeed;

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.style.animation = `gradFade ${speed} linear infinite;`;

		this.buttonContent = makeElement({ className: 'buttonContent' });
		this.buttonText = makeElement({ tag: 'slot', className: 'buttonText' });

		if (this.hasAttribute('secondary')) this.wrapper.setAttribute('secondary', '');
		this.buttonText.style.animation = `gradFade ${speed} linear infinite;`;

		if (this.hasAttribute('dark')) {
			this.wrapper.setAttribute('dark', '');
			this.dark = true;
		}
		if (this.hasAttribute('disabled')) {
			this.wrapper.setAttribute('disabled', '');
			this.disabled = true;
		} else {
			this.wrapper.setAttribute('tabIndex', '0');
			this.disabled = false;
		}

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(linkCSS('fancy-button'));
		this.buttonContent.appendChild(this.buttonText);
		this.wrapper.appendChild(this.buttonContent);
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
		return ['disabled'];
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
	}

	/**
	 * Handle keypress events
	 * @param {object} ev - event
	 */
	keyPress(ev) {
		if (ev.keyCode === 13) {
			let click = new MouseEvent('click', {
				shiftKey: ev.shiftKey,
				ctrlKey: ev.ctrlKey,
				altKey: ev.altKey,
				metaKey: ev.metaKey,
			});
			this.dispatchEvent(click);
			this.flashAsPressed(this);
		}
	}

	/**
	 * Fake pressed state for keyboard event
	 * @param {object} elem - element that got pressed
	 */
	flashAsPressed(elem) {
		elem.wrapper.style.top = '1px';
		elem.wrapper.style.left = '1px';
		elem.wrapper.style.boxShadow = 'none';

		setTimeout(function () {
			elem.wrapper.style.top = '0px';
			elem.wrapper.style.left = '0px';
			elem.wrapper.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.3)';
		}, 100);
	}
}
