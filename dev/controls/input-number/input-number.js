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
        super();
        this.precision = this.getAttribute('precision') || 3;

        this.wrapper = makeElement({className: 'wrapper'});
        this.numberInput = makeElement({tag: 'input', className: 'numberInput', tabindex: true, attributes: [['type', 'text']]});

        this.numberValue = parseFloat(this.getAttribute('value'));

        this.arrowWrapper = makeElement({className: 'arrowWrapper', tabindex: true});
        this.upArrow = makeElement({className: 'upArrow', content: '⏶'});
        this.downArrow = makeElement({className: 'downArrow', content: '⏷'});

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
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.enabled.resting.background};
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                opacity: 1;
                border-color: ${uiColors.enabled.active.border};
            }

            .wrapper button,
            .wrapper input {
                background-color: transparent;
                border: 0;
                margin: 0;
            }

            .numberInput {
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

            .arrowWrapper {
                user-select: none;
                grid-column-start: 2;
                display: grid;
                grid-template-rows: 1fr 1fr;
                border-left: 1px solid ${uiColors.enabled.resting.border};
                width: 24px;
                height: 24px;
                margin: 0;
            }

            .numberInput:focus,
            .arrowWrapper:focus {
                outline: 1px dashed ${uiColors.accent};
                outline-offset: 0px;
            }

            .arrowWrapper:hover {
                border-left-color: ${uiColors.enabled.active.border};
            }

            .upArrow,
            .downArrow {
                user-select: none;
                padding: 0;
                text-align: center;
                line-height: 10px;
                font-size: 0.9em;
                cursor: pointer;
                color: ${uiColors.enabled.resting.fill};
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
                color: ${uiColors.enabled.active.fill};
                background-color: ${uiColors.enabled.active.background};
            }
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.upArrow.addEventListener('click', this.increment);
        this.downArrow.addEventListener('click', this.decrement);
        this.arrowWrapper.addEventListener('keydown', this.arrowKeyboardPressed);
        this.arrowWrapper.appendChild(this.upArrow);
        this.arrowWrapper.appendChild(this.downArrow);

        this.numberInput.addEventListener('change', this.numberInputChanged);

        this.wrapper.appendChild(this.numberInput);
        this.wrapper.appendChild(this.arrowWrapper);

        shadow.appendChild(this.wrapper);
    }

    /**
     * Get the main value
     */
    get numberValue() {
        return this._numberValue;
    }

    /**
     * Set the main numberValue
     * @param {number} number - new main value
     */
    set numberValue(number) {
        console.log(`InputNumber.set value - START`);
        console.log(`\t passed ${number}`);
        this._numberValue = round(parseFloat(number), this.precision) || 0;
        console.log(`\t this._numberValue is now ${this._numberValue}`);
        console.log(`\t this.numberValue is now ${this.numberValue}`);

        this.numberInput.value = this.numberValue;
        this.setAttribute('value', this.numberValue);
        console.log(`InputNumber.set value - END`);
    }

    /**
     * Handle onChange event
     * @param {object} ev - event
     */
    numberInputChanged(ev) {
        this.numberValue = this.numberInput.value;
    }

    /**
     * Increment the value
     * @param {object} ev - event
     */
    increment(ev) {
        console.log(`InputNumber.increment - START`);
        let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
        console.log(`\t mod = ${mod}`);
        console.log(`\t this.numberValue before: ${this.numberValue}`);
        this.numberValue += mod? 10 : 1;
        console.log(`\t this.numberValue afterz: ${this.numberValue}`);
        console.log(`InputNumber.increment - END`);
    }

    /**
     * Decrement the value
     * @param {object} ev - event
     */
    decrement(ev) {
        let mod = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;

        this.numberValue -= mod? 10 : 1;
    }

    /**
     * Handle keypress event
     * @param {object} ev - event
     */
    arrowKeyboardPressed(ev) {
        switch (ev.keyCode) {
            case 38: // d-pad up
            case 39: // d-pad right
            case 104: // ten key up
            case 102: // ten key right
            case 107: // ten key +
                this.upArrow.dispatchEvent('click');
                break;

            case 40: // d-pad down
            case 37: // d-pad left
            case 98: // ten key down
            case 100: // ten key left
            case 109: // ten key -
                this.downArrow.dispatchEvent('click');
                break;

            default:
                break;
        }
    }
}

customElements.define('input-number', InputNumber);
