import {makeElement} from '../controls.js';
import {uiColors} from '../../common/colors.js';

/**
 * description
 */
export default class AnchorTwelvepoint extends HTMLElement {
    /**
     * Create an AnchorTwelvepoint
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.topLeft = makeElement({tag: 'input', id: 'topLeft', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.topCenter = makeElement({tag: 'input', id: 'topCenter', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.topRight = makeElement({tag: 'input', id: 'topRight', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.middleLeft = makeElement({tag: 'input', id: 'middleLeft', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.middleCenter = makeElement({tag: 'input', id: 'middleCenter', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.middleRight = makeElement({tag: 'input', id: 'middleRight', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.baselineLeft = makeElement({tag: 'input', id: 'baselineLeft', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.baselineCenter = makeElement({tag: 'input', id: 'baselineCenter', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.baselineRight = makeElement({tag: 'input', id: 'baselineRight', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.bottomLeft = makeElement({tag: 'input', id: 'bottomLeft', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.bottomCenter = makeElement({tag: 'input', id: 'bottomCenter', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});
        this.bottomRight = makeElement({tag: 'input', id: 'bottomRight', tabIndex: true, attributes: {type: 'radio', name: 'marker'}});

        this.baselineLeft.setAttribute('checked', '');
        this.wrapper = makeElement({className: 'wrapper'});

        this.wrapper.appendChild(this.topLeft);
        this.wrapper.appendChild(this.topCenter);
        this.wrapper.appendChild(this.topRight);
        this.wrapper.appendChild(this.middleLeft);
        this.wrapper.appendChild(this.middleCenter);
        this.wrapper.appendChild(this.middleRight);
        this.wrapper.appendChild(this.baselineLeft);
        this.wrapper.appendChild(this.baselineCenter);
        this.wrapper.appendChild(this.baselineRight);
        this.wrapper.appendChild(this.bottomLeft);
        this.wrapper.appendChild(this.bottomCenter);
        this.wrapper.appendChild(this.bottomRight);


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
                border-style: solid;
                border-width: 0px;
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.enabled.resting.background};

                display: grid;
                grid-template-columns: 3;
                grid-template-rows: 4;
                grid-gap: 2px;
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

            radio {
                width: 20px;
                height: 20px;
            }

        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

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

customElements.define('anchor-twelvepoint', AnchorTwelvepoint);
