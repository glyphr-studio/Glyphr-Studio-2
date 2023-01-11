import { makeElement } from '../../common/dom.js';
import style from './anchor-twelvepoint.css?inline';

/**
 * description
 */
export class AnchorTwelvepoint extends HTMLElement {
	/**
	 * Create an AnchorTwelvepoint
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		super();

		this.anchorNames = [
			{ id: 'topLeft', name: 'top left' },
			{ id: 'topCenter', name: 'top center' },
			{ id: 'topRight', name: 'top right' },
			{ id: 'middleLeft', name: 'middle left' },
			{ id: 'middleCenter', name: 'middle center' },
			{ id: 'middleRight', name: 'middle right' },
			{ id: 'baselineLeft', name: 'baseline left' },
			{ id: 'baselineCenter', name: 'baseline center' },
			{ id: 'baselineRight', name: 'baseline right' },
			{ id: 'bottomLeft', name: 'bottom left' },
			{ id: 'bottomCenter', name: 'bottom center' },
			{ id: 'bottomRight', name: 'bottom right' },
		];

		this.defaultAnchor = 'baselineLeft';

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		// Create radio button HTML for each anchor
		this.anchorNames.forEach((anchor) => {
			this[anchor.id] = makeElement({
				id: anchor.id,
				className: 'anchor',
				tabIndex: true,
				attributes: { title: anchor.name },
			});
			this[anchor.id].elementRoot = this;
		});

		// Default selection
		this.setValue(this.getAttribute('value'));

		// Append to wrapper
		this.wrapper = makeElement({ className: 'wrapper' });
		this.anchorNames.forEach((anchor) => this.wrapper.appendChild(this[anchor.id]));

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		/*
		this.observer = new MutationObserver(this.childAttributeChanged);
		this.observer.elementRoot = this;
		this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
		*/

		shadow.appendChild(this.wrapper);

		// Add onclick handlers
		this.anchorNames.forEach((anchor) =>
			this[anchor.id].addEventListener('click', function () {
				this.elementRoot.setValue(anchor.id);
			})
		);
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
				this.anchorNames.forEach((anchor) => this[anchor.id].setAttribute('disabled', ''));
			} else if (oldValue === '') {
				// enabled
				this.anchorNames.forEach((anchor) => this[anchor.id].removeAttribute('disabled', ''));
			}
		}

		if (attributeName === 'value') {
			this.setValue(newValue);
		}
	}

	/**
	 * Selects a new anchor
	 * @param {string} newAnchor - name of the anchor to select
	 */
	setValue(newAnchor) {
		// log(`setValue ${newAnchor}`);

		this.anchorNames.forEach((anchor) => this[anchor.id].removeAttribute('checked', ''));

		if (newAnchor) {
			this[newAnchor].setAttribute('checked', '');
			this.value = newAnchor;
			this.setAttribute('value', newAnchor);
		} else {
			this.baselineLeft.setAttribute('checked', '');
			this.value = 'baselineLeft';
			this.setAttribute('value', 'baselineLeft');
		}
	}
}
