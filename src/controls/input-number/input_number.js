import { makeElement } from '../../common/dom.js';
import { round } from '../../common/functions.js';
import { cancelDefaultEventActions } from '../../edit_canvas/events.js';
import style from './input-number.css?inline';

/**
 * A numeric input field, with up/down arrows for increment/decrement
 */
export class InputNumber extends HTMLElement {
	/**
	 * Create an InputNumber
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor() {
		// log(`InputNumber.constructor`, 'start');
		super();

		const isDisabled = this.hasAttribute('disabled');

		// this.wrapper = makeElement({ className: 'wrapper' });
		// this.wrapper.elementRoot = this;
		// this.wrapper.style.borderWidth = attributes.hideBorder ? '0px' : '1px';

		// Input element
		this.numberInput = makeElement({
			tag: 'input',
			className: 'numberInput',
			tabIndex: !isDisabled,
			attributes: { type: 'text', value: this.sanitizeValue(this.getAttribute('value')) },
		});
		this.numberInput.elementRoot = this;

		// Arrows
		this.arrowWrapper = makeElement({
			className: 'arrowWrapper',
			tabIndex: !isDisabled,
		});
		this.arrowWrapper.elementRoot = this;

		const arrowSeparator = makeElement({
			className: 'arrowSeparator',
		});

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

		// Lock
		this.iconLocked = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="m11,4h-2c-1.66,0-3,1.34-3,3v8c0,1,1,2,2,2h4c1,0,2-1,2-2V7c0-1.66-1.34-3-3-3Zm-.5,11h-1v-3h1v3Zm-3.5-5v-3c0-1.1.9-2,2-2h2c1.1,0,2,.9,2,2v3h-6Z"/>
			</svg>
		`;

		this.iconUnlocked = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="m14,7v-1c0-1.66-1.34-3-3-3h-2c-1.66,0-3,1.34-3,3v9c0,1,1,2,2,2h4c1,0,2-1,2-2v-5h-7v-4c0-1.1.9-2,2-2h2c1.1,0,2,.9,2,2v1h1Zm-1,4v5h-6v-5h6Z"/>
			</svg>
		`;

		this.padlock = makeElement({
			className: 'lock',
			attributes: { tabIndex: 0 },
			content: this.iconUnlocked,
		});
		this.padlock.elementRoot = this;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.arrowWrapper.appendChild(this.upArrow);
		this.arrowWrapper.appendChild(arrowSeparator);
		this.arrowWrapper.appendChild(this.downArrow);

		shadow.appendChild(this.numberInput);
		shadow.appendChild(this.arrowWrapper);
		shadow.appendChild(this.padlock);

		if (isDisabled) {
			this.numberInput.setAttribute('disabled', '');
			this.setAttribute('disabled', '');
		} else {
			this.addAllEventListeners();
		}

		// log(this);
		// log(`InputNumber.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'value', 'locked', 'unlocked'];
	}

	/**
	 * Initialize the component once it's being used
	 */
	connectedCallback() {
		// log(`InputNumber.connectedCallback`, 'start');

		if (this.getAttribute('is-locked') === 'true') {
			this.padlock.style.display = 'block';
			this.setToLocked(true);
		}

		if (this.getAttribute('is-locked') === 'false') {
			this.padlock.style.display = 'block';
			this.upArrow.style.borderRadius = '0px';
			this.downArrow.style.borderRadius = '0px';
			this.setToUnlocked(true);
		}

		this.padlock.addEventListener('click', () => {
			// log(`InputNumber.padlock Click handler`, 'start');

			// log(this.padlock);
			// Toggle the lock state
			if (this.getAttribute('is-locked') === 'true') {
				this.setToUnlocked();
			} else {
				this.setToLocked();
			}

			// log(`InputNumber.padlock Click handler`, 'end');
		});
		this.padlock.addEventListener('keydown', this.lockButtonKeyboardPress);

		// log(`InputNumber.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`InputNumber.attributeChangedCallback`, 'start');
		// log(`for < ${this.getAttribute('class')} >`);
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		if (attributeName === 'value') {
			// log(`setting internal numberInput. PRE  ${this.numberInput.getAttribute('value')}`);
			this.numberInput.setAttribute('value', newValue);
			this.value = newValue;
			this.numberInput.value = newValue;
			// log(`setting internal numberInput. POST ${this.numberInput.getAttribute('value')}`);
		}

		if (attributeName === 'is-locked') {
			if (newValue === 'true') {
				// locked
				this.setToLocked();
			} else if (oldValue === '') {
				// unlocked
				this.setToUnlocked();
			}
		}

		if (attributeName === 'disabled') {
			if (newValue === '') {
				// disabled
				this.setToDisabled();
			} else if (oldValue === '') {
				// enabled
				this.setToEnabled();
			}
		}

		// log(`InputNumber.attributeChangedCallback`, 'end');
	}

	/**
	 * Locked state
	 */
	setToLocked(internalEvent = false) {
		// log(`InputNumber.setToLocked`, 'start');
		this.setAttribute('is-locked', 'true');
		this.padlock.setAttribute('selected', '');
		this.setToDisabled();
		this.padlock.innerHTML = this.iconLocked;
		if (!internalEvent) {
			this.dispatchEvent(new CustomEvent('lock', { detail: { isLocked: true } }));
		}
		// log(`InputNumber.setToLocked`, 'end');
	}

	setToUnlocked(internalEvent = false) {
		// log(`InputNumber.setToUnlocked`, 'start');
		this.setAttribute('is-locked', 'false');
		this.padlock.removeAttribute('selected');
		this.setToEnabled();
		this.padlock.innerHTML = this.iconUnlocked;
		if (!internalEvent) {
			this.dispatchEvent(new CustomEvent('lock', { detail: { isLocked: false } }));
		}
		// log(`InputNumber.setToUnlocked`, 'end');
	}

	/**
	 * Enabled or disabled
	 */
	setToDisabled() {
		// log(`InputNumber.setToDisabled`, 'start');
		// this.setAttribute('disabled', '');
		this.numberInput.setAttribute('disabled', '');
		this.numberInput.removeAttribute('tabIndex');
		this.arrowWrapper.setAttribute('disabled', '');
		this.arrowWrapper.removeAttribute('tabIndex');
		this.removeAllEventListeners();
		// log(`InputNumber.setToDisabled`, 'end');
	}

	setToEnabled() {
		// log(`InputNumber.setToEnabled`, 'start');
		// this.removeAttribute('disabled');
		this.numberInput.removeAttribute('disabled');
		this.numberInput.setAttribute('tabIndex', '0');
		this.arrowWrapper.removeAttribute('disabled');
		this.arrowWrapper.setAttribute('tabIndex', '0');
		this.addAllEventListeners();
		// log(`InputNumber.setToEnabled`, 'end');
	}

	/**
	 * Event Listeners
	 */
	addAllEventListeners() {
		// log('addAllEventListeners');
		this.upArrow.addEventListener('click', this.increment);
		this.downArrow.addEventListener('click', this.decrement);
		this.arrowWrapper.addEventListener('keydown', this.arrowButtonsKeyboardPressed);
		this.numberInput.addEventListener('change', this.numberInputChanged);
		this.numberInput.addEventListener('keydown', this.numberInputKeyboardPress);
	}

	removeAllEventListeners() {
		// log('removeAllEventListeners');
		this.upArrow.removeEventListener('click', this.increment);
		this.downArrow.removeEventListener('click', this.decrement);
		this.arrowWrapper.removeEventListener('keydown', this.arrowButtonsKeyboardPressed);
		this.numberInput.removeEventListener('change', this.numberInputChanged);
		this.numberInput.removeEventListener('keydown', this.numberInputKeyboardPress);
		// this.arrowWrapper.removeEventListener('mouseout', (event) => {
		// log(event);
		// });
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
	 * Update all the internal stuff to reflect a new value
	 */
	updateToNewValue(newValue, dispatch = true) {
		// log(`updateToNewValue`, 'start');
		// log(`newValue: ${newValue}`);
		this.setAttribute('value', newValue);
		this.value = newValue;
		if (dispatch) this.dispatchEvent(new Event('change'));
		this.numberInput.value = newValue;
		// log(`updateToNewValue`, 'end');
	}

	/**
	 * Handle onChange event
	 */
	numberInputChanged(ev) {
		// log(`InputNumber.numberInputChanged`, 'start');
		// log(`for < ${this.elementRoot.getAttribute('class')} >`);
		let newValue = this.elementRoot.sanitizeValue(ev.target.value);
		this.elementRoot.updateToNewValue(newValue);
		// log(`InputNumber.numberInputChanged`, 'end');
	}

	/**
	 * Increment the value
	 * @param {Object} ev - event
	 */
	increment(ev) {
		// log(`InputNumber.increment`, 'start');
		// log(`for < ${this.elementRoot.getAttribute('class')} >`);
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		let currentValue = parseFloat(this.elementRoot.getAttribute('value'));
		let newValue = this.elementRoot.sanitizeValue((currentValue += mod ? 10 : 1));
		this.elementRoot.updateToNewValue(newValue);
		// log(`InputNumber.increment`, 'end');
	}

	/**
	 * Decrement the value
	 * @param {Object} ev - event
	 */
	decrement(ev) {
		// log(`InputNumber.decrement`, 'start');
		// log(`for < ${this.elementRoot.getAttribute('class')} >`);
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		let currentValue = parseFloat(this.elementRoot.getAttribute('value'));
		let newValue = this.elementRoot.sanitizeValue((currentValue -= mod ? 10 : 1));
		this.elementRoot.updateToNewValue(newValue);
		// log(`InputNumber.decrement`, 'end');
	}

	/**
	 * Detects if a key should increment
	 * @param {Number} keyCode - what key was pressed
	 * @returns {Boolean}
	 */
	isIncrement(keyCode, includeTenKey = true) {
		if (keyCode === 38) return true; // d-pad up
		if (keyCode === 39) return true; // d-pad right
		if (keyCode === 102 && includeTenKey) return true; // ten key right
		if (keyCode === 104 && includeTenKey) return true; // ten key up
		if (keyCode === 107 && includeTenKey) return true; // ten key +
		return false;
	}

	/**
	 * Detects if a key should decrement
	 * @param {Number} keyCode - what key was pressed
	 * @returns {Boolean}
	 */
	isDecrement(keyCode, includeTenKey = true) {
		if (keyCode === 37) return true; // d-pad left
		if (keyCode === 40) return true; // d-pad down
		if (keyCode === 98 && includeTenKey) return true; // ten key down
		if (keyCode === 100 && includeTenKey) return true; // ten key left
		if (keyCode === 109 && includeTenKey) return true; // ten key -
		return false;
	}

	/**
	 * Handle keypress event
	 * @param {Object} ev - event
	 */
	arrowButtonsKeyboardPressed(ev) {
		let click = new MouseEvent('click', {
			shiftKey: ev.shiftKey,
			ctrlKey: ev.ctrlKey,
			altKey: ev.altKey,
			metaKey: ev.metaKey,
		});

		if (this.elementRoot.isIncrement(ev.keyCode)) {
			cancelDefaultEventActions(ev);
			this.elementRoot.upArrow.dispatchEvent(click);
		}

		if (this.elementRoot.isDecrement(ev.keyCode)) {
			cancelDefaultEventActions(ev);
			this.elementRoot.downArrow.dispatchEvent(click);
		}
	}

	/**
	 * Handle keypress event
	 * @param {Object} ev - event
	 */
	numberInputKeyboardPress(ev) {
		let click = new MouseEvent('click', {
			shiftKey: ev.shiftKey,
			ctrlKey: ev.ctrlKey,
			altKey: ev.altKey,
			metaKey: ev.metaKey,
		});

		const noModifier = ev.shiftKey && ev.ctrlKey && ev.altKey && ev.metaKey;

		if (this.elementRoot.isIncrement(ev.keyCode, false)) {
			cancelDefaultEventActions(ev);
			this.elementRoot.upArrow.dispatchEvent(click);
		} else if (this.elementRoot.isDecrement(ev.keyCode, false)) {
			cancelDefaultEventActions(ev);
			this.elementRoot.downArrow.dispatchEvent(click);
		} else if (noModifier) {
			this.elementRoot.numberInputChanged(ev);
		}
	}

	/**
	 * Handle lock keypress event
	 * @param {Object} ev - event
	 */
	lockButtonKeyboardPress(ev) {
		let click = new MouseEvent('click', {
			shiftKey: ev.shiftKey,
			ctrlKey: ev.ctrlKey,
			altKey: ev.altKey,
			metaKey: ev.metaKey,
		});

		switch (ev.keyCode) {
			case 13: // enter
			case 32: // space
			case 37: // d-pad left
			case 38: // d-pad up
			case 39: // d-pad right
			case 40: // d-pad down
				cancelDefaultEventActions(ev);
				this.elementRoot.padlock.dispatchEvent(click);
				break;

			default:
				break;
		}
	}
}
