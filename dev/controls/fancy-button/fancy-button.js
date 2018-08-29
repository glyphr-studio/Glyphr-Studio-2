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

        let fast = this.hasAttribute('fast');

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

            :host(:active) {
                position: relative;
                top: 1px;
                left: 1px;
            }

            :host(:active) .wrapper {
                box-shadow: none;
            }

            :host([disabled]:active) {
                top: 0px;
                left: 0px;
            }

            .wrapper {
                display: inline-block;
                margin: 0px;
                padding: 2px;
                height: 100%;
                border-style: solid;
                border-width: 0px;
                border-radius: 5px;
                box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);

                background: linear-gradient(320deg,
                    ${accentColors.blue.l55},
                    ${accentColors.purple.l55},
                    ${accentColors.orange.l55},
                    ${accentColors.purple.l55},
                    ${accentColors.blue.l55},
                    ${accentColors.purple.l55}
                );
                background-size: 500% 500%;
                animation: gradFade ${fast? '20s' : '600'} linear infinite;
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
                position: relative;
                top: 0px;
                left: 0px;
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
                background: linear-gradient(320deg,
                    ${accentColors.blue.l45},
                    ${accentColors.purple.l45},
                    ${accentColors.orange.l45},
                    ${accentColors.purple.l45},
                    ${accentColors.blue.l45},
                    ${accentColors.purple.l45}
                );
                background-size: 500% 500%;
                animation: gradFade ${fast? '20s' : '600'} linear infinite;

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
                background: ${uiColors.disabled.background};
                background-clip: none;
                -webkit-text-fill-color: ${uiColors.disabled.border};
                color: ${uiColors.disabled.border};
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
                this.wrapper.setAttribute('disabled', '');
            } else if (oldValue === '') {
                // enabled
                this.wrapper.removeAttribute('disabled');
            }
        }
    }
}

customElements.define('fancy-button', FancyButton);
