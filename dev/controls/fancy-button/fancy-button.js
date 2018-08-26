import {makeElement} from '../controls.js';
import {uiColors, accentColors} from '../../app/colors.js';

/**
 * description
 */
export default class FancyButton extends HTMLElement {
    /**
     * Create an FancyButton
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.text = this.innerText || 'fancy button';

        this.wrapper = makeElement({className: 'wrapper'});
        if (this.hasAttribute('secondary')) this.wrapper.setAttribute('secondary', '');
        if (this.hasAttribute('disabled')) {
            this.wrapper.setAttribute('disabled', '');
        } else {
            this.wrapper.setAttribute('tabindex', '0');
        }

        this.buttonContent = makeElement({className: 'buttonContent'});
        this.buttonText = makeElement({tag: 'slot', className: 'buttonText'});

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            .wrapper {
                display: inline-block;
                margin: 0px;
                padding: 2px;
                height: 100%;
                border-style: solid;
                border-width: 0px;
                border-radius: 5px;
                background-image: linear-gradient(to bottom right, ${accentColors.blue.l60}, ${accentColors.purple.l40});
                box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
            }

            :host:active .wrapper {
                box-shadow: none;
                top: 2px;
                left: 2px;
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                cursor: pointer;
            }

            .wrapper:focus {
                outline: 1px dashed ${uiColors.accent};
            }


            .buttonContent {
                display: inline-block;
                padding: 0px;
                margin: 0px;
                border-radius: 3px;
                background-color: transparent;
                width: 100%;
                height: 100%;
            }

            .buttonText {
                display: inline-block;
                text-align: center;
                vertical-align: middle;
                color: white;
                margin: 4px 12px;
                background-color: transparent;
            }

            .wrapper[secondary] .buttonContent {
                background-color: rgba(255, 255, 255, 0.95);
            }

            .wrapper[secondary] .buttonText {
                background: linear-gradient(to bottom right, ${accentColors.blue.l60}, ${accentColors.purple.l40});
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
                background-image: linear-gradient(to bottom right, ${uiColors.disabled.background}, ${uiColors.disabled.border});
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
                background-clip: none;
                -webkit-text-fill-color: ${uiColors.disabled.border};
                color: transparent;
                cursor: default;
            }
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);
        this.buttonContent.appendChild(this.buttonText);
        this.wrapper.appendChild(this.buttonContent);
        shadow.appendChild(this.wrapper);
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
                this.setAttribute('disabled', '');
                this.wrapper.setAttribute('disabled', '');
            } else if (oldValue === '') {
                // enabled
                this.removeAttribute('disabled');
                this.wrapper.removeAttribute('disabled');
            }
        }
    }
}

customElements.define('fancy-button', FancyButton);
