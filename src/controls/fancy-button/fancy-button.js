import { makeElement } from '../../common/dom.js';
import { uiColors, accentColors } from '../../common/colors.js';

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

		Object.keys(attributes).forEach((key) =>
			this.setAttribute(key, attributes[key])
		);

		let fast = this.hasAttribute('fast');
		let fastSpeed = '18s';
		let slowSpeed = '90s';

		this.wrapper = makeElement({ className: 'wrapper' });
		if (this.hasAttribute('secondary'))
			this.wrapper.setAttribute('secondary', '');

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

		this.buttonContent = makeElement({ className: 'buttonContent' });
		this.buttonText = makeElement({ tag: 'slot', className: 'buttonText' });

		let style = makeElement({
			tag: 'style',
			content: `
						* {
								box-sizing: border-box;
								user-select: none;
								-webkit-user-select: none;
								-moz-user-select: none;
								-ms-user-select: none;
								user-select: none;
						}

						:host {
								margin-right: 8px;
								display: inline-block;
								width: max-content;
								min-width: 40px;
						}

						:host(:active) .wrapper {
								top: 1px;
								left: 1px;
								box-shadow: none;
						}

						:host([disabled]:active) .wrapper {
								top: 0px;
								left: 0px;
						}

						.wrapper {
								display: inline-block;
								position: relative;
								top: 0px;
								left: 0px;
								margin: 0px;
								padding: 2px;
								height: 100%;
								width: 100%;
								border-style: solid;
								border-width: 0px;
								border-radius: 5px;
								box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);

								background: linear-gradient(135deg,
										${accentColors.blue.l55},
										${accentColors.purple.l45},
										${accentColors.orange.l55},
										${accentColors.purple.l45},
										${accentColors.blue.l55},
										${accentColors.purple.l45}
								);
								background-size: 500% 500%;
								animation: gradFade ${
									fast ? fastSpeed : slowSpeed
								} linear infinite;
						}

						@keyframes gradFade {
								0%  {background-position:0% 0%}
								100% {background-position:100% 100%}
						}

						.wrapper:hover,
						.wrapper *:hover,
						.wrapper:focus,
						.wrapper *:focus {
								cursor: pointer;
						}

						.wrapper:focus {
							outline: var(--global-focus-style);
						}

						.buttonContent {
								display: flex;
								align-items: center;
								padding: 0px;
								border-radius: 3px;
								background-color: transparent;
								width: 100%;
								height: 100%;
						}

						.buttonText {
								display: inline-block;
								width: max-content;
								height: max-content;
								margin: 5px 10px;
								color: white;
								background-color: transparent;
						}

						.wrapper[secondary] .buttonContent {
								background-color: rgba(255, 255, 255, 0.95);
						}

						.wrapper[dark] .buttonContent {
								background-color: ${accentColors.gray.l05};
						}

						.wrapper[secondary] .buttonText {
								background: linear-gradient(135deg,
										${accentColors.blue.l45},
										${accentColors.purple.l45},
										${accentColors.orange.l45},
										${accentColors.purple.l45},
										${accentColors.blue.l45},
										${accentColors.purple.l45}
								);
								background-size: 500% 500%;
								animation: gradFade ${
									fast ? fastSpeed : slowSpeed
								} linear infinite;

								-webkit-background-clip: text;
								background-clip: text;
								-webkit-text-fill-color: transparent;
						}



						.wrapper:hover .buttonContent,
						.wrapper:active .buttonContent {
								background-color: rgba(255, 255, 255, 0.1);
						}

						.wrapper[secondary]:hover .buttonContent,
						.wrapper[secondary]:active .buttonContent {
								background-color: white;
						}


						.wrapper[disabled],
						.wrapper[disabled]:hover,
						.wrapper[disabled]:focus,
						.wrapper[disabled]:active {
								background-image: none;
								background-color: ${uiColors.disabled.border};
								cursor: default;
								box-shadow: none;
						}

						.wrapper[disabled] .buttonContent,
						.wrapper[disabled]:hover .buttonContent,
						.wrapper[disabled]:focus .buttonContent,
						.wrapper[disabled]:active .buttonContent {
								background-color: ${uiColors.disabled.background};
								cursor: default;
						}

						.wrapper[disabled] .buttonText,
						.wrapper[disabled]:hover .buttonText,
						.wrapper[disabled]:focus .buttonText,
						.wrapper[disabled]:active .buttonText {
								background: ${uiColors.disabled.background};
								background-clip: none;
								-webkit-text-fill-color: ${uiColors.disabled.border};
								color: ${uiColors.disabled.border};
								cursor: default;
						}
				`,
		});

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(style);
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
		// console.log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

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
