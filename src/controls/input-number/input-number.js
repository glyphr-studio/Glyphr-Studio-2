import { makeElement } from '../../common/dom.js';
import { uiColors, flashUIElementAsActive } from '../../common/colors.js';
import { round } from '../../common/functions.js';

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

		// Object.keys(attributes).forEach((key) =>
		// 	this.setAttribute(key, attributes[key])
		// );

		this._value = 99999999;

		this.precision = this.getAttribute('precision') || 3;
		this.disabled = this.hasAttribute('disabled');

		this.wrapper = makeElement({ className: 'wrapper' });
		this.wrapper.elementRoot = this;

		this.numberInput = makeElement({
			tag: 'input',
			className: 'numberInput',
			tabIndex: !this.disabled,
			attributes: { type: 'text' },
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

		// log('upArrow');
		// log(this.upArrow);

		let style = makeElement({
			tag: 'style',
			content: `
						* {
							box-sizing: border-box;
							transition: all 100ms easeOutExpo;
						}

						.wrapper {
							margin: 0px;
							padding: 0px;
							display: grid;
							grid-template-columns: 1fr 24px;
							border-style: solid;
							border-width: ${attributes.hideBorder? '0px' : '1px'};
							border-color: ${uiColors.enabled.restingLight.border};
							background-color: ${uiColors.enabled.restingLight.background};
							border-radius: 4px;
						}

						.wrapper:hover,
						.wrapper *:hover,
						.wrapper:focus,
						.wrapper *:focus {
							border-color: ${uiColors.enabled.focus.border};
						}

						.wrapper[disabled],
						.wrapper:hover[disabled],
						.wrapper:focus[disabled],
						.wrapper:active[disabled] {
							background-color: ${uiColors.disabled.background};
							border-color: ${uiColors.disabled.border};
						}

						.numberInput {
							background-color: transparent;
							border: 0;
							margin: 0;
							color: ${uiColors.enabled.resting.text};
							grid-column-start: 1;
							min-width: 50px;
							height: 24px;
							padding: 0px 8px 0px 2px;
							text-align: right;
							font-family: monospace;
						}

						.numberInput:hover,
						.numberInput:active {
							background-color: white;
						}

						.numberInput:focus {
							outline: var(--global-focus-style);
						}

						.numberInput[disabled],
						.numberInput:hover[disabled],
						.numberInput:focus[disabled],
						.numberInput:active[disabled] {
							background-color: ${uiColors.disabled.background};
							border-color: ${uiColors.disabled.border};
							color: ${uiColors.disabled.text};
							text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
						}

						.arrowWrapper {
							grid-column-start: 2;
							display: grid;
							grid-template-rows: 1fr 1fr;
							border-left: 1px solid ${uiColors.enabled.restingLight.border};
							width: 24px;
							height: 24px;
							margin: 0;
						}

						.wrapper:hover .arrowWrapper,
						.arrowWrapper:hover {
							border-left-color: ${uiColors.enabled.focus.border};
						}

						.arrowWrapper:focus {
							outline: var(--global-focus-style);
						}

						.arrowWrapper[disabled],
						.arrowWrapper:hover[disabled],
						.arrowWrapper:focus[disabled],
						.arrowWrapper:active[disabled] {
							border-color: ${uiColors.disabled.border};
						}

						.wrapper .upArrow,
						.wrapper .downArrow,
						.upArrow,
						.downArrow {
							-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;
							padding: 0;
							margin: 0;
							border-width: 1px;
							text-align: center;
							line-height: 10px;
							height: 12px;
							font-size: 0.9em;
							cursor: pointer;
							color: ${uiColors.enabled.restingLight.fill};
							outline: 0;
						}

						.upArrow {
							grid-row-start: 1;
							vertical-align: bottom;
						}

						.downArrow {
							grid-row-start: 2;
							vertical-align: top;
						}

						.wrapper:hover .upArrow,
						.wrapper:hover .downArrow,
						.upArrow:hover,
						.downArrow:hover {
							color: ${uiColors.enabled.focus.fill};
							background-color: ${uiColors.enabled.resting.background};
						}

						.upArrow:active,
						.downArrow:active {
							color: ${uiColors.enabled.active.fill};
							background-color: ${uiColors.enabled.active.background};
						}

						.upArrow[disabled],
						.downArrow[disabled],
						.upArrow:hover[disabled],
						.downArrow:hover[disabled],
						.upArrow:focus[disabled],
						.downArrow:focus[disabled],
						.upArrow:active[disabled],
						.downArrow:active[disabled] {
							cursor: default;
							color: ${uiColors.disabled.fill};
							background-color: ${uiColors.disabled.background};
						}
				`,
		});

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(style);

		this.arrowWrapper.appendChild(this.upArrow);
		this.arrowWrapper.appendChild(this.downArrow);

		this.wrapper.appendChild(this.numberInput);
		this.wrapper.appendChild(this.arrowWrapper);

		if (!this.disabled) this.addAllEventListeners();

		shadow.appendChild(this.wrapper);

		// log(this);
		// log(`InputNumber.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled'];
	}

	/**
	 * Initialize the component once it's being used
	 */
	 connectedCallback() {
		// log(`InputNumber.connectedCallback`, 'start');
		let myValue = this.getAttribute('value');
		// log(`myValue: ${myValue}`);
		this.value = myValue;
		if (this.disabled) this.wrapper.setAttribute('disabled', '');
		if (this.disabled) this.numberInput.setAttribute('disabled', '');
		if (this.disabled) this.upArrow.setAttribute('disabled', '');
		if (this.disabled) this.downArrow.setAttribute('disabled', '');
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
				this.numberInput.removeAttribute('tabIndex');
				this.numberInput.setAttribute('disabled', '');
				this.arrowWrapper.removeAttribute('tabIndex');
				this.arrowWrapper.setAttribute('disabled', '');
				this.upArrow.setAttribute('disabled', '');
				this.downArrow.setAttribute('disabled', '');
				this.removeAllEventListeners();
			} else if (oldValue === '') {
				// enabled
				this.wrapper.removeAttribute('disabled');
				this.numberInput.setAttribute('tabIndex', '0');
				this.numberInput.removeAttribute('disabled');
				this.arrowWrapper.setAttribute('tabIndex', '0');
				this.arrowWrapper.removeAttribute('disabled');
				this.upArrow.removeAttribute('disabled');
				this.downArrow.removeAttribute('disabled');
				this.addAllEventListeners();
			}
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
		this.arrowWrapper.addEventListener('mouseout', (event) => {
			this.removeArrowStyle(this.upArrow, this.downArrow);
		});
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
	 * Up and down arrows get CSS injected during interaction, this
	 * removes that
	 */
	removeArrowStyle(upArrow, downArrow) {
		upArrow.setAttribute('style', '');
		downArrow.setAttribute('style', '');
	}

	/**
	 * Get the main value
	 * @returns {number}
	 */
	get value() {
		// log(`InputNumber.get value`, 'start');
		// log(`this._value: ${this._value}`);
		// log(`InputNumber.get value`, 'end');
		return this._value;
	}

	/**
	 * Set the main numberValue
	 * @param {number} number - new main value
	 */
	set value(number) {
		// log(`InputNumber.set value`, 'start');
		// log(`passed ${number}`);
		this._value = round(parseFloat(number), this.precision) || 0;
		// log(`this._value is now ${this._value}`);
		// log(`this.value is now ${this.value}`);
		this.numberInput.setAttribute('value', this._value);
		this.setAttribute('value', this._value);
		// log(`InputNumber.set value`, 'end');
	}

	/**
	 * Handle onChange event
	 */
	numberInputChanged(ev) {
		this.elementRoot.value = this.elementRoot.numberInput.value;
		let changeEvent = new Event('change', {'bubbles':true, 'composed':true});
		setTimeout(() => this.elementRoot.dispatchEvent(changeEvent));
		flashUIElementAsActive(this);
	}

	/**
	 * Increment the value
	 * @param {object} ev - event
	 */
	increment(ev) {
		// log(`InputNumber.increment`, 'start');
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		// log(`this.elementRoot.value BEFORE: ${this.elementRoot.value}`);
		this.elementRoot.value += mod ? 10 : 1;
		// log(`this.elementRoot.value AFTERS: ${this.elementRoot.value}`);
		let changeEvent = new Event('change', {'bubbles':true, 'composed':true});
		setTimeout(() => this.elementRoot.dispatchEvent(changeEvent));
		flashUIElementAsActive(this);
		// log(`InputNumber.increment`, 'end');
	}

	/**
	 * Decrement the value
	 * @param {object} ev - event
	 */
	decrement(ev) {
		// log(`InputNumber.decrement`, 'start');
		let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
		// log(`this.elementRoot.value BEFORE: ${this.elementRoot.value}`);
		this.elementRoot.value -= mod ? 10 : 1;
		// log(`this.elementRoot.value AFTERS: ${this.elementRoot.value}`);
		let changeEvent = new Event('change', {'bubbles':true, 'composed':true});
		setTimeout(() => this.elementRoot.dispatchEvent(changeEvent));
		flashUIElementAsActive(this);
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
