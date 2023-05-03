import { makeElement } from '../../common/dom.js';
import style from './option-toggle.css?inline';

/**
 * A two-state toggle control
 * HTML like this:
 *
 * <option-toggle selected-value="first" selected-name="First thing">
 * 		<option value="first">First thing</option>
 * 		<option value="second">Second thing</option>
 * </option-toggle>
 */
export class OptionToggle extends HTMLElement {
	/**
	 * Create an OptionToggle
	 */
	constructor() {
		// log(`OptionToggle.constructor`, 'start');
		super();

		this.wrapper = makeElement({
			className: 'wrapper',
			tabIndex: !this.disabled,
		});
		this.wrapper.elementRoot = this;

		this.selectionDisplay = makeElement({
			className: 'selectionDisplay',
			attributes: { tabIndex: -1 },
			innerHTML: this.getDisplayName(),
		});
		this.selectionDisplay.elementRoot = this;

		this.toggleIcon = makeElement({
			className: 'toggleIcon',
			content: this.makeIcon(),
			attributes: { tabIndex: -1 },
		});
		this.toggleIcon.elementRoot = this;

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		this.wrapper.appendChild(this.selectionDisplay);
		this.wrapper.appendChild(this.toggleIcon);

		if (!this.disabled) this.addAllEventListeners();
		shadow.appendChild(this.wrapper);

		// log(this);
		// log(`OptionToggle.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'selected-value'];
	}

	/**
	 * Initialize the component once it's being used
	 */
	connectedCallback() {
		// log(`OptionToggle.connectedCallback`, 'start');
		if (this.disabled) this.wrapper.setAttribute('disabled', '');
		this.options = [];

		[...this.children].forEach((child) => {
			let tag = child.tagName.toLowerCase();
			if (tag === 'option') {
				let name = child.innerText;
				let value = child.getAttribute('value');
				if (!value) value = name;

				this.options.push({ name: name, value: value });
			}
		});

		this.selectionDisplay.innerHTML = this.getDisplayName();
		this.toggleIcon.innerHTML = this.makeIcon(this.isFirstOptionSelected());
		// log(`OptionToggle.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`OptionToggle.attributeChangedCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		if (attributeName === 'disabled') {
			if (newValue === '') {
				// disabled
				this.wrapper.setAttribute('disabled', '');
				this.wrapper.removeAttribute('tabIndex');
				this.removeAllEventListeners();
			} else if (oldValue === '') {
				// enabled
				this.wrapper.removeAttribute('disabled');
				this.wrapper.setAttribute('tabIndex', '0');
				this.addAllEventListeners();
			}
		}

		if (attributeName === 'selected-value') {
			this.dispatchEvent(new Event('change'));
		}

		// log(`OptionToggle.attributeChangedCallback`, 'end');
	}

	getDisplayName() {
		let displayText = this.getAttribute('selected-name');
		if (!displayText) return '';
		displayText = displayText.replace(/ /gi, '&nbsp;');
		return displayText;
	}

	toggle() {
		// log(`OptionToggle.toggle`, 'start');

		if (this.isFirstOptionSelected()) {
			this.setAttribute('selected-value', this.options[1].value);
			this.setAttribute('selected-name', this.options[1].name);
			this.selectionDisplay.innerHTML = this.options[1].name;
			this.toggleIcon.innerHTML = this.makeIcon(false);
		} else {
			this.setAttribute('selected-value', this.options[0].value);
			this.setAttribute('selected-name', this.options[0].name);
			this.selectionDisplay.innerHTML = this.options[0].name;
			this.toggleIcon.innerHTML = this.makeIcon(true);
		}
		// this.dispatchEvent(new Event('change'));
		// log(`OptionToggle.toggle`, 'end');
	}

	isFirstOptionSelected() {
		const currentName = this.getAttribute('selected-name');
		// log(`currentName: ${currentName}`);
		return currentName === this.options[0].name;
	}

	/**
	 * Add all event listeners to elements
	 */
	addAllEventListeners() {
		// log('addAllEventListeners');
		this.addEventListener('click', this.toggle);
		this.addEventListener('keydown', this.keyPress);
	}

	/**
	 * Add all event listeners to elements
	 */
	removeAllEventListeners() {
		// log('removeAllEventListeners');
		this.removeEventListener('click', this.toggle);
		this.removeEventListener('keydown', this.keyPress);
	}

	/**
	 * Handle keypress event
	 * @param {object} ev - event
	 */
	keyPress(ev) {
		switch (ev.keyCode) {
			case 13: // enter
			case 32: // space
			case 37: // d-pad left
			case 38: // d-pad up
			case 39: // d-pad right
			case 40: // d-pad down
			case 98: // ten key down
			case 102: // ten key right
			case 104: // ten key up
			case 107: // ten key +
			case 109: // ten key -
			case 100: // ten key left
				// this.toggle();
				this.dispatchEvent(new Event('click'));
				break;

			default:
				break;
		}
	}

	makeIcon(left = false) {
		let svg = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path id="outline" d="m15,6.09c2.15,0,3.9,1.75,3.9,3.91s-1.75,3.9-3.9,3.9H5c-2.15,0-3.9-1.75-3.9-3.91s1.75-3.9,3.9-3.9h10m0-1.1H5C2.24,5,0,7.23,0,10h0c0,2.77,2.24,5,5,5h10c2.76,0,5-2.24,5-5h0c0-2.77-2.24-5-5-5h0Z"/>
			<circle id="right-dot" style="display:${left ? 'none' : 'block'};" cx="15" cy="10" r="3"/>
			<circle id="left-dot" style="display:${!left ? 'none' : 'block'};" cx="5" cy="10" r="3"/>
		</svg>
		`;
		return svg;
	}
}
