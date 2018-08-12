import {makeElement} from '../controls.js';
import {uiColors} from '../../app/colors.js';
import {round} from '../../app/functions.js';

/**
 * A numeric input field, with up/down arrows for increment/decrement
 */
export default class InputNumber extends HTMLElement {
    /**
     * Create an InputNumber
     */
    constructor() {
        // console.log(`InputNumber.constructor - START`);
        super();
        this.precision = this.getAttribute('precision') || 3;
        this.disabled = this.hasAttribute('disabled');

        this.wrapper = makeElement({className: 'wrapper'});
        this.numberInput = makeElement({tag: 'input', className: 'numberInput', tabindex: !this.disabled, attributes: [['type', 'text']]});
        if (this.disabled) this.numberInput.setAttribute('disabled', '');

        this.value = this.getAttribute('value');

        this.arrowWrapper = makeElement({className: 'arrowWrapper', tabindex: !this.disabled});
        this.upArrow = makeElement({className: 'upArrow', content: '⏶'});
        this.downArrow = makeElement({className: 'downArrow', content: '⏷'});

        // console.log('upArrow');
        // console.log(this.upArrow);

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
            }

            .wrapper {
                margin: 0px;
                padding: 0px;
                opacity: ${uiColors.restingOpacity};
                display: grid;
                grid-template-columns: 1fr 24px;
                height: 100%;
                border-style: solid;
                border-width: 1px;
                border-color: ${this.disabled? uiColors.disabled.border : uiColors.enabled.resting.border};
                background-color: ${this.disabled? uiColors.disabled.background : uiColors.enabled.resting.background};
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                opacity: 1;
                border-color: ${this.disabled? uiColors.disabled.border : uiColors.enabled.active.border};
            }

            .wrapper button,
            .wrapper input {
                background-color: transparent;
                border: 0;
                margin: 0;
            }

            .numberInput {
                color: ${this.disabled? uiColors.disabled.text : uiColors.enabled.resting.text};
                grid-column-start: 1;
                min-width: 80px;
                height: 24px;
                padding: 0px 8px 0px 2px;
                text-align: right;
                font-family: monospace;
            }

            .numberInput:hover,
            .numberInput:active {
                background-color: white;
            }

            .numberInput:focus {
                outline: 1px dashed ${uiColors.accent};
                outline-offset: 0px;
            }

            .numberInput:disabled {
                background-color: ${uiColors.disabled.background};
                border-color: ${uiColors.disabled.border};
            }

            .arrowWrapper {
                grid-column-start: 2;
                display: grid;
                grid-template-rows: 1fr 1fr;
                border-left: 1px solid ${this.disabled? uiColors.disabled.border : uiColors.enabled.resting.border};
                width: 24px;
                height: 24px;
                margin: 0;
            }

            .arrowWrapper:hover {
                border-left-color: ${this.disabled? uiColors.disabled.border : uiColors.enabled.active.border};
            }

            .arrowWrapper:focus {
                outline: 1px dashed ${uiColors.accent};
                outline-offset: 0px;
            }

            .upArrow,
            .downArrow {
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                padding: 0;
                text-align: center;
                line-height: 10px;
                font-size: 0.9em;
                cursor: ${this.disabled? 'default' : 'pointer'};
                color: ${this.disabled? uiColors.disabled.fill : uiColors.enabled.resting.fill};
            }

            .upArrow {
                grid-row-start: 1;
                height: 12px;
                vertical-align: bottom;
            }

            .downArrow {
                grid-row-start: 2;
                height: 12px;
                vertical-align: top;
            }

            .upArrow:hover,
            .downArrow:hover {
                color: ${this.disabled? uiColors.disabled.fill : uiColors.enabled.active.fill};
                background-color: ${this.disabled? 'transparent' : uiColors.enabled.active.background};
            }
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.arrowWrapper.appendChild(this.upArrow);
        this.arrowWrapper.appendChild(this.downArrow);

        this.wrapper.appendChild(this.numberInput);
        this.wrapper.appendChild(this.arrowWrapper);

        if (!this.disabled) this.addEventListeners();

        shadow.appendChild(this.wrapper);

        // console.log(this);
        // console.log(`InputNumber.constructor - END`);
    }

    /**
     * Add all event listeners to elements
     */
    addEventListeners() {
        let elementRoot = this;

        this.upArrow.addEventListener('click', function(ev) {
            elementRoot.increment(ev, elementRoot);
        });

        this.downArrow.addEventListener('click', function(ev) {
            elementRoot.decrement(ev, elementRoot);
        });

        this.arrowWrapper.addEventListener('keydown', function(ev) {
            elementRoot.arrowKeyboardPressed(ev, elementRoot);
        });

        this.numberInput.addEventListener('change', function(ev) {
            elementRoot.numberInputChanged(ev, elementRoot);
        });

        this.numberInput.addEventListener('keydown', function(ev) {
            elementRoot.numberInputKeyboardPress(ev, elementRoot);
        });
    }

    /**
     * Get the main value
     * @returns {number}
     */
    get value() {
        return this._numberValue;
    }

    /**
     * Set the main numberValue
     * @param {number} number - new main value
     */
    set value(number) {
        // console.log(`InputNumber.set value - START`);
        // console.log(`\t passed ${number}`);
        this._numberValue = round(parseFloat(number), this.precision) || 0;
        // console.log(`\t this._numberValue is now ${this._numberValue}`);
        // console.log(`\t this.value is now ${this.value}`);

        this.numberInput.value = this._numberValue;
        this.setAttribute('value', this._numberValue);
        // console.log(`InputNumber.set value - END`);
    }

    /**
     * Handle onChange event
     * @param {object} ev - event
     * @param {object} elementRoot - context
     */
    numberInputChanged(ev, elementRoot) {
        elementRoot.value = elementRoot.numberInput.value;
    }

    /**
     * Increment the value
     * @param {object} ev - event
     * @param {object} elementRoot - context
     */
    increment(ev, elementRoot) {
        let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
        elementRoot.value += mod? 10 : 1;
    }

    /**
     * Decrement the value
     * @param {object} ev - event
     * @param {object} elementRoot - context
     */
    decrement(ev, elementRoot) {
        let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
        elementRoot.value -= mod? 10 : 1;
    }

    /**
     * Handle keypress event
     * @param {object} ev - event
     * @param {object} elementRoot - context
     */
    arrowKeyboardPressed(ev, elementRoot) {
        let click = new MouseEvent('click', {
            shiftKey: ev.shiftKey,
            ctrlKey: ev.ctrlKey,
            altKey: ev.altKey,
            metaKey: ev.metaKey,
        });

        switch (ev.keyCode) {
            case 38: // d-pad up
            case 39: // d-pad right
            case 104: // ten key up
            case 102: // ten key right
            case 107: // ten key +
                elementRoot.upArrow.dispatchEvent(click);
                break;

            case 40: // d-pad down
            case 37: // d-pad left
            case 98: // ten key down
            case 100: // ten key left
            case 109: // ten key -
                elementRoot.downArrow.dispatchEvent(click);
                break;

            default:
                break;
        }
    }

    /**
     * Handle keypress event
     * @param {object} ev - event
     * @param {object} elementRoot - context
     */
    numberInputKeyboardPress(ev, elementRoot) {
        let click = new MouseEvent('click', {
            shiftKey: ev.shiftKey,
            ctrlKey: ev.ctrlKey,
            altKey: ev.altKey,
            metaKey: ev.metaKey,
        });

        switch (ev.keyCode) {
            case 38: // d-pad up
            case 104: // ten key up
            case 107: // ten key +
                elementRoot.upArrow.dispatchEvent(click);
                break;

            case 40: // d-pad down
            case 98: // ten key down
            case 109: // ten key -
                elementRoot.downArrow.dispatchEvent(click);
                break;

            default:
                break;
        }
    }
}

customElements.define('input-number', InputNumber);
