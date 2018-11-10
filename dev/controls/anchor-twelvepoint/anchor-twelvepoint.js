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

        this.anchorNames = [
            'topLeft',
            'topCenter',
            'topRight',
            'middleLeft',
            'middleCenter',
            'middleRight',
            'baselineLeft',
            'baselineCenter',
            'baselineRight',
            'bottomLeft',
            'bottomCenter',
            'bottomRight',
        ];

        this.defaultAnchor = 'baselineLeft';

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        // Create radio button HTML for each anchor
        this.anchorNames.forEach((anchorName) => this[anchorName] = makeElement({tag: 'input', id: anchorName, tabIndex: true, attributes: {type: 'radio', name: 'marker', title: anchorName}}));
        this.anchorNames.forEach((anchorName) => this[anchorName].elementRoot = this);

        // Default selection
        this.setValue(this.getAttribute('value'));

        // Append to wrapper
        this.wrapper = makeElement({className: 'wrapper'});
        this.anchorNames.forEach((anchorName) => this.wrapper.appendChild(this[anchorName]));

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

        // Add onclick handlers
        this.anchorNames.forEach((anchorName) => this[anchorName].addEventListener('click', function() {
            this.elementRoot.setValue(anchorName);
        }));
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
                this.anchorNames.forEach((anchorName) => this[anchorName].setAttribute('disabled', ''));
            } else if (oldValue === '') {
                // enabled
                this.anchorNames.forEach((anchorName) => this[anchorName].removeAttribute('disabled', ''));
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
        console.log(`setValue ${newAnchor}`);

        this.anchorNames.forEach((anchorName) => this[anchorName].removeAttribute('checked', ''));

        if (this.anchorNames.indexOf(newAnchor) > -1) {
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

customElements.define('anchor-twelvepoint', AnchorTwelvepoint);
