import { addAsChildren, makeElement } from '../../common/dom.js';
import style from './option-chooser.css?inline';
import { closeAllDialogs, showContextMenu } from '../dialogs/dialogs.js';

/**
 * An options group / dropdown control
 * HTML like this:
 *
 * <option-chooser selected="first" selected-prefix="Category:">
 * 		<option note="[123, 456]">first</option>
 * 		<option note="[123, 456]">second</option>
 * 		<option note="[123, 456]">3rd</option>
 * </option-chooser>
 */
export class OptionChooser extends HTMLElement {
	/**
	 * Create an OptionChooser
	 */
	constructor() {
		// log(`OptionChooser.constructor`, 'start');
		super();

		this.wrapper = makeElement({
			className: 'wrapper',
			tabIndex: !this.disabled,
		});
		this.wrapper.elementRoot = this;

		// this.options = makeElement({ tag: 'slot', className: 'options' });
		// this.selectionDisplay.innerHTML = displayText;

		this.selectionDisplay = makeElement({
			className: 'selectionDisplay',
			attributes: { tabIndex: -1 },
			innerHTML: this.getDisplayName(),
		});
		this.selectionDisplay.elementRoot = this;

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

		this.wrapper.appendChild(this.selectionDisplay);
		this.wrapper.appendChild(this.downArrow);

		if (!this.disabled) this.addAllEventListeners();

		shadow.appendChild(this.wrapper);

		// log(this);
		// log(`OptionChooser.constructor`, 'end');
	}

	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['disabled', 'selected'];
	}

	/**
	 * Initialize the component once it's being used
	 */
	connectedCallback() {
		// log(`OptionChooser.connectedCallback`, 'start');
		if (this.disabled) this.wrapper.setAttribute('disabled', '');
		// log(`OptionChooser.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`OptionChooser.attributeChangedCallback`, 'start');
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

		if (attributeName === 'selected') {
			this.selectionDisplay.innerHTML = this.getDisplayName();
			this.dispatchEvent('changed');
		}

		// log(`OptionChooser.attributeChangedCallback`, 'end');
	}

	getDisplayName() {
		let displayText = this.getAttribute('selected');
		let prefix = this.getAttribute('selected-prefix');
		// log(`prefix: ${prefix}`);

		if (prefix) displayText = `<span class="prefix">${prefix}</span> ${displayText}`;
		// log(`displayText: ${displayText}`);

		return displayText;
	}

	showOptions() {
		// log(`OptionsChooser.showOptions`, 'start');

		const currentSelection = this.getAttribute('selected');
		let optionRows = [];
		[...this.children].forEach((child) => {
			// log(child);
			if (child.tagName.toLowerCase() === 'option') {
				optionRows.push({
					name: child.innerText,
					icon: currentSelection === child.innerText ? 'selected' : 'notSelected',
					shortcut: JSON.parse(child.getAttribute('note')),
					onClick: () => {
						this.setAttribute('selected', child.innerText);
						closeAllDialogs();
					},
				});
			}
		});

		let entryPointRect = this.getBoundingClientRect();
		let left = entryPointRect.x;
		let top = entryPointRect.y + entryPointRect.height;

		if (left < 0 || top < 0) this.pointer.style.display = 'none';
		left = Math.max(left, 0);
		top = Math.max(top, 0);

		// log(`showing options at ${left} / ${top}`);

		this.style.borderRadius = '4px 4px 0px 0px';
		showContextMenu(optionRows, left, top - 4, entryPointRect.width, true);

		// log(`OptionsChooser.showOptions`, 'end');
	}

	/**
	 * Add all event listeners to elements
	 */
	addAllEventListeners() {
		// log('addAllEventListeners');
		this.addEventListener('click', this.showOptions);
		this.addEventListener('keydown', this.keyboardPress);
	}

	/**
	 * Add all event listeners to elements
	 */
	removeAllEventListeners() {
		// log('removeAllEventListeners');
		this.removeEventListener('click', this.showOptions);
		this.removeEventListener('keydown', this.keyboardPress);
	}

	/**
	 * Handle keypress event
	 * @param {object} ev - event
	 */
	keyboardPress(ev) {
		switch (ev.keyCode) {
			case 40: // d-pad down
			case 98: // ten key down
			case 109: // ten key -
				this.showOptions();
				break;

			default:
				break;
		}
	}
}
