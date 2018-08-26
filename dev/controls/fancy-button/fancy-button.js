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

        this.buttonContent = makeElement({tag: 'slot', className: 'buttonContent'});

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
                position: relative;
                top: 0px;
                left: 0px;
                margin: 0px;
                padding: 0px 3.5px 3px 0px;
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
                position: relative;
                top: 1.5px;
                left: 1.5px;
                padding: 4px 12px;
                margin: 0px;
                border-radius: 3px;
                text-align: center;
                vertical-align: middle;
                background-color: transparent;
                width: 100%;
                height: 100%;
                color: white;
            }

            .wrapper:hover .buttonContent,
            .wrapper:active .buttonContent {
                background-color: rgba(255, 255, 255, 0.1);
            }

            :host:active .buttonContent {
                text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.9);
            }

            .wrapper[secondary] .buttonContent {
                background-color: rgba(255, 255, 255, 0.95);
                color: ${accentColors.blue.l45};
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
            }

            .wrapper[disabled] .buttonContent,
            .wrapper[disabled]:hover .buttonContent,
            .wrapper[disabled]:focus .buttonContent,
            .wrapper[disabled]:active .buttonContent {
                background-color: ${uiColors.disabled.background};
                color: ${uiColors.disabled.border};
                cursor: default;
            }
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);
        // this.buttonContent.appendChild(document.createTextNode(this.text));
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
