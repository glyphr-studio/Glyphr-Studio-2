import { makeElement } from '../../common/dom.js';
import { round } from '../../common/functions.js';
import style from './input-number.css?inline';

/**
 * A numeric input field, with up/down arrows for increment/decrement
 */
export class InputNumber extends HTMLElement {
	/**
	 * Create an InputNumber
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`InputNumber.constructor`, 'start');
		// log(JSON.stringify(attributes));
		super();

		if (this.getAttribute('precision')) this.precision = this.getAttribute('precision');
		this.disabled = this.hasAttribute('disabled');

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.elementRoot = this;
		this.wrapper.style.borderWidth = attributes.hideBorder ? '0px' : '1px';

		this.numberInput = makeElement({
			tag: 'input',
			className: 'numberInput',
			tabIndex: !this.disabled,
			attributes: { type: 'text', value: this.sanitizeValue(this.getAttribute('value')) },
		});
		this.numberInput.elementRoot = this;

		this.arrowWrapper = makeElement({
			className: 'arrowWrapper',
			tabIndex: !this.disabled,
		});
		this.arrowWrapper.elementRoot = this;

		this.upArrow = makeElement({
			className: 'upArrow',
			content: '⏶',
			attributes: { tabIndex: -1 },
		});
		this.upArrow.elementRoot = this;

		this.downArrow = makeElement({
			className: 'downArrow',
			content: '⏷',
			attributes: { tabIndex: -1 },
		});
		this.downArrow.elementRoot = this;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.arrowWrapper.appendChild(this.upArrow);
		this.arrowWrapper.appendChild(this.downArrow);

		this.wrapper.appendChild(this.numberInput);
		this.wrapper.appendChild(this.arrowWrapper);

		if (this.disabled) {
			this.numberInput.setAttribute('disabled', '');
			this.wrapper.setAttribute('disabled', '');
		} else {
			this.addAllEventListeners();
		}

		shadow.appendChild(this.wrapper);

		// log(this);
		// log(`InputNumber.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'value'];
	}

	/**
	 * Initialize the component once it's being used
	 */
	connectedCallback() {
		// log(`InputNumber.connectedCallback`, 'start');
		// log(`InputNumber.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`InputNumber.attributeChangedCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		if (attributeName === 'disabled') {
			if (newValue === '') {
				// disabled
				this.wrapper.setAttribute('disabled', '');
				this.numberInput.setAttribute('disabled', '');
				this.numberInput.removeAttribute('tabIndex');
				this.arrowWrapper.removeAttribute('tabIndex');
				this.removeAllEventListeners();
			} else if (oldValue === '') {
				// enabled
				this.wrapper.removeAttribute('disabled');
				this.numberInput.removeAttribute('disabled');
				this.numberInput.setAttribute('tabIndex', '0');
				this.arrowWrapper.setAttribute('tabIndex', '0');
				this.addAllEventListeners();
			}
		}

		if (attributeName === 'value') {
			this.numberInput.setAttribute('value', newValue);
			this.numberInput.value = newValue;
			let changeEvent = new Event('change', { bubbles: true, composed: true });
			this.dispatchEvent(changeEvent);
		}

		// log(`InputNumber.attributeChangedCallback`, 'end');
	}

	/**
	 * Add all event listeners to elements
	 */
	addAllEventListeners() {
		// log('addAllEventListeners');
		this.upArrow.addEventListener('click', this.increment);
		this.downArrow.addEventListener('click', this.decrement);
		this.arrowWrapper.addEventListener('keydown', this.arrowKeyboardPressed);
		this.numberInput.addEventListener('change', this.numberInputChanged);
		this.numberInput.addEventListener('keydown', this.numberInputKeyboardPress);
	}

	/**
	 * Add all event listeners to elements
	 */
	removeAllEventListeners() {
		// log('removeAllEventListeners');
		this.upArrow.removeEventListener('click', this.increment);
		this.downArrow.removeEventListener('click', this.decrement);
		this.arrowWrapper.removeEventListener('keydown', this.arrowKeyboardPressed);
		this.numberInput.removeEventListener('change', this.numberInputChanged);
		this.numberInput.removeEventListener('keydown', this.numberInputKeyboardPress);
		this.arrowWrapper.removeEventListener('mouseout', (event) => {
			// log(event);
		});
	}

	/**
	 * Make sure new values are good
	 * @param {Number} input - new value
	 */
	sanitizeValue(input) {
		let newValue = parseFloat(input) || 0;
		if (this.precision) newValue = round(newValue, this.precision);
		return newValue;
	}

	/**
	 * Handle onChange event
	 */
	numberInputChanged(ev) {
		// log(`InputNumber.numberInputChanged`, 'start');
		let newValue = this.elementRoot.sanitizeValue(ev.target.value);
		this.elementRoot.value = newValue;
		this.elementRoot.setAttribute('value', newValue);
		// log(`InputNumber.numberInputChanged`, 'end');
	}

	/**
	 * Increment the value
	 * @param {object} ev - event
	 */
	increment(ev) {
		// log(`InputNumber.increment`, 'start');
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		let currentValue = parseFloat(this.elementRoot.getAttribute('value'));
		let newValue = this.elementRoot.sanitizeValue(currentValue += mod ? 10 : 1);
		this.elementRoot.value = newValue;
		this.elementRoot.setAttribute('value', newValue);
		// log(`InputNumber.increment`, 'end');
	}

	/**
	 * Decrement the value
	 * @param {object} ev - event
	 */
	decrement(ev) {
		// log(`InputNumber.decrement`, 'start');
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		let currentValue = parseFloat(this.elementRoot.getAttribute('value'));
		let newValue = this.elementRoot.sanitizeValue(currentValue -= mod ? 10 : 1);
		this.elementRoot.value = newValue;
		this.elementRoot.setAttribute('value', newValue);
		// log(`InputNumber.decrement`, 'end');
	}

	/**
	 * Handle keypress event
	 * @param {object} ev - event
	 */
	arrowKeyboardPressed(ev) {
		let click = new MouseEvent('click', {
			shiftKey: ev.shiftKey,
			ctrlKey: ev.ctrlKey,
			altKey: ev.altKey,
			metaKey: ev.metaKey,
		});

		switch (ev.keyCode) {
			case 38: // d-pad up
			case 39: // d-pad right
			case 104: // ten key up
			case 102: // ten key right
			case 107: // ten key +
				this.elementRoot.upArrow.dispatchEvent(click);
				break;

			case 40: // d-pad down
			case 37: // d-pad left
			case 98: // ten key down
			case 100: // ten key left
			case 109: // ten key -
				this.elementRoot.downArrow.dispatchEvent(click);
				break;

			default:
				break;
		}
	}

	/**
	 * Handle keypress event
	 * @param {object} ev - event
	 */
	numberInputKeyboardPress(ev) {
		let click = new MouseEvent('click', {
			shiftKey: ev.shiftKey,
			ctrlKey: ev.ctrlKey,
			altKey: ev.altKey,
			metaKey: ev.metaKey,
		});

		switch (ev.keyCode) {
			case 38: // d-pad up
			case 104: // ten key up
			case 107: // ten key +
				this.elementRoot.upArrow.dispatchEvent(click);
				break;

			case 40: // d-pad down
			case 98: // ten key down
			case 109: // ten key -
				this.elementRoot.downArrow.dispatchEvent(click);
				break;

			default:
				break;
		}
	}
}
