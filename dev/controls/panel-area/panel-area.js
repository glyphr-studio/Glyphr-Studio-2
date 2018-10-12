import {makeElement} from '../controls.js';
import {uiColors, accentColors} from '../../common/colors.js';

/**
 * description
 */
export default class PanelArea extends HTMLElement {
    /**
     * Create an PanelArea
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.wrapper = makeElement({className: 'wrapper'});

        let style = makeElement({tag: 'style', content: `
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
                height: 100%;
                width: 100%;
                border-style: solid;
                border-width: 0px;
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.enabled.resting.background};
                display: grid;
                grid-template-rows: 30px 1fr;
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

            #header {
                width: 100%;
                grid-row: 1;
                background-color: ${accentColors.gray.l25};
                color: ${accentColors.blue.l95};
                cursor: pointer;
            }

            #content {
                grid-row: 2;
                background-color: ${accentColors.gray.l90};
                overflow-y: scroll;
            }
        `});

        let panelName = this.getAttribute('panel') || 'panel';

        let header = makeElement({id: 'header', innerHTML: panelName});
        let content = makeElement({id: 'content', innerHTML: 'hello!'});

        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);
        this.wrapper.appendChild(header);
        this.wrapper.appendChild(content);
        /*
        this.observer = new MutationObserver(this.childAttributeChanged);
        this.observer.elementRoot = this;
        this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
        */

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

    /**
     * Listen for changes on child elements
     * @param {object} mutationsList - collection of changes
     */
    childAttributeChanged(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type == 'attributes' && mutation.attributeName === 'disabled') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                console.log(mutation);

                if (mutation.oldValue === '') {
                    // enabled
                    this.elementRoot.inputNumber.removeAttribute('disabled');
                } else {
                    // disabled
                    this.elementRoot.inputNumber.setAttribute('disabled', '');
                }
            }
        }
    }
}

customElements.define('panel-area', PanelArea);
