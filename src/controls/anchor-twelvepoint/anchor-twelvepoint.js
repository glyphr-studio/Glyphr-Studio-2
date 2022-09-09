import { makeElement } from '../../common/dom.js';
import { uiColors } from '../../common/colors.js';


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

		Object.keys(attributes).forEach((key) =>
			this.setAttribute(key, attributes[key])
		);

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
		this.anchorNames.forEach((anchor) =>
			this.wrapper.appendChild(this[anchor.id])
		);

		let style = makeElement({
			tag: 'style',
			content: `
						* {
								box-sizing: border-box;
								user-select: none;
								-moz-user-select: none;
								-webkit-user-select: none;
								-ms-user-select: none;
						}

						.wrapper {
								margin: 0px;
								padding: 0px;
								border-style: solid;
								border-width: 0px;
								border-color: ${uiColors.enabled.resting.border};
								background-color: ${uiColors.enabled.resting.background};

								display: grid;
								grid-template-columns: 3;
								grid-template-rows: 4;
								grid-gap: 3px;
								padding: 3px;
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

						#topLeft {          grid-row: 1;    grid-column: 1; }
						#topCenter {        grid-row: 1;    grid-column: 2; }
						#topRight {         grid-row: 1;    grid-column: 3; }
						#middleLeft {       grid-row: 2;    grid-column: 1; }
						#middleCenter {     grid-row: 2;    grid-column: 2; }
						#middleRight {      grid-row: 2;    grid-column: 3; }
						#baselineLeft {     grid-row: 3;    grid-column: 1; }
						#baselineCenter {   grid-row: 3;    grid-column: 2; }
						#baselineRight {    grid-row: 3;    grid-column: 3; }
						#bottomLeft {       grid-row: 4;    grid-column: 1; }
						#bottomCenter {     grid-row: 4;    grid-column: 2; }
						#bottomRight {      grid-row: 4;    grid-column: 3; }

						.anchor {
								height: 5px;
								width: 5px;
								border-style: solid;
								border-width: 1px;
								border-color: ${uiColors.disabled.background};
								background-color: ${uiColors.disabled.background};
								cursor: pointer;
						}

						.anchor[checked] {
								background-color: ${uiColors.accent};
								border-color: ${uiColors.accent};
						}

						.anchor:hover {
								border-color: ${uiColors.accent};
						}

						.anchor:focus {
							outline: var(--global-focus-style);
						}
				`,
		});

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(style);

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
		// console.log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		if (attributeName === 'disabled') {
			if (newValue === '') {
				// disabled
				this.anchorNames.forEach((anchor) =>
					this[anchor.id].setAttribute('disabled', '')
				);
			} else if (oldValue === '') {
				// enabled
				this.anchorNames.forEach((anchor) =>
					this[anchor.id].removeAttribute('disabled', '')
				);
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
		// console.log(`setValue ${newAnchor}`);

		this.anchorNames.forEach((anchor) =>
			this[anchor.id].removeAttribute('checked', '')
		);

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
