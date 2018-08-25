import {makeElement} from '../controls.js';
import {uiColors} from '../../app/colors.js';

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
        if (this.hasAttribute('disabled')) this.wrapper.setAttribute('disabled', '');

        this.buttonContent = makeElement({className: 'buttonContent'});

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
            }

            .wrapper {
                display: inline-block;
                margin: 0px;
                padding: 0px 4px 0px 0px;
                height: 100%;
                border-style: solid;
                border-width: 0px;
                border-radius: 5px;
                background-image: linear-gradient(to bottom right, blue, darkgreen);
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                cursor: pointer;
            }

            .buttonContent {
                display: inline-block;
                padding: 4px 12px;
                margin: 2px;
                border-radius: 3px;
                text-align: center;
                vertical-align: middle;
                background-color: transparent;
                width: 100%;
                height: 100%;
                color: white;
            }

            .wrapper[secondary] .buttonContent {
                background-color: white;
                color: navy;
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
        this.buttonContent.appendChild(document.createTextNode(this.text));
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
            } else if (oldValue === '') {
                // enabled
            }
        }
    }
}

customElements.define('fancy-button', FancyButton);
