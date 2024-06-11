import { makeElement } from '../../common/dom.js';
import style from './fancy-button.css?inline';

/**
 * It's a button... only fancier!
 */
export class FancyButton extends HTMLElement {
	/**
	 * Create an FancyButton
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		super();
		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		this.wrapper = makeElement({ className: 'wrapper' });
		this.buttonContent = makeElement({ className: 'buttonContent' });
		this.buttonText = makeElement({ tag: 'slot', className: 'buttonText' });

		if (this.hasAttribute('secondary')) {
			this.wrapper.setAttribute('secondary', '');
		}
		if (this.hasAttribute('danger')) {
			this.wrapper.setAttribute('danger', '');
		}
		if (this.hasAttribute('minimal')) {
			this.wrapper.setAttribute('minimal', '');
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
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.buttonContent.appendChild(this.buttonText);
		this.wrapper.appendChild(this.buttonContent);
		shadow.appendChild(this.wrapper);

		if (!this.disabled) {
			this.addEventListener('keydown', this.keyPress);
		}
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'secondary', 'danger', 'minimal'];
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
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
		if (attributeName === 'secondary') {
			if (newValue === '') {
				// secondary
				this.wrapper.setAttribute('secondary', '');
			} else if (oldValue === '') {
				// primary
				this.wrapper.removeAttribute('secondary');
			}
		}
		if (attributeName === 'danger') {
			if (newValue === '') {
				// danger
				this.wrapper.setAttribute('danger', '');
			} else if (oldValue === '') {
				// safe
				this.wrapper.removeAttribute('danger');
			}
		}
		if (attributeName === 'minimal') {
			if (newValue === '') {
				// minimal
				this.wrapper.setAttribute('minimal', '');
			} else if (oldValue === '') {
				// primary
				this.wrapper.removeAttribute('minimal');
			}
		}
	}

	/**
	 * Handle keypress events
	 * @param {Object} ev - event
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
	 * @param {Object} elem - element that got pressed
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
