import {makeElement} from '../controls.js';
import ButtonToggle from '../button-toggle/button-toggle.js';
import {uiColors} from '../../app/colors.js';

/**
 * A numeric input field, with up/down arrows for increment/decrement,
 * and also a lock control that toggles a locked state.
 * Primarily used for a ControlPoint x/y input.
 */
export default class InputNumberLockable extends HTMLElement {
    /**
     * Create an InputNumberLockable
     */
    constructor() {
        super();

        this.wrapper = makeElement({className: 'wrapper'});
        this.numberInput = makeElement({tag: 'input', className: 'numberInput', tabindex: true});
        this.setInputValue(this.getAttribute('value'));

        this.arrowWrapper = makeElement({className: 'arrowWrapper', tabindex: true});
        this.upArrow = makeElement({className: 'upArrow', content: '⏶'});
        this.downArrow = makeElement({className: 'downArrow', content: '⏷'});

        this.locked = this.hasAttribute('locked');

        this.padlockWrapper = makeElement({className: 'padlockWrapper', tabindex: true});
        this.padlock = new ButtonToggle([
            ['class', 'padlock'],
            ['icon', 'lock'],
            ['size', '20'],
        ]);

        if (this.locked) {
            this.numberInput.setAttribute('disabled', '');
            this.padlock.setAttribute('selected', '');
        }

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
            }

            .wrapper {
                margin: 0px;
                padding: 0px;
                opacity: ${uiColors.restingOpacity};
                display: grid;
                grid-template-columns: 1fr 24px 24px;
                height: 100%;
                border-style: solid;
                border-width: 1px;
                border-color: ${uiColors.locked? uiColors.colors.locked.border : uiColors.colors.unlocked.border};
                background-color: ${uiColors.locked? uiColors.colors.locked.background : uiColors.colors.unlocked.background};
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                opacity: 1;
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

            .arrowWrapper,
            .padlockWrapper {
                border-left: 1px solid ${this.locked? this.colors.locked.border : this.colors.unlocked.border};
                display: inline-block;
                width: 24px;
                height: 24px;
                margin: 0;
            }

            .arrowWrapper {
                grid-column-start: 2;
                display: grid;
                grid-template-rows: 1fr 1fr;
            }

            .upArrow,
            .downArrow {
                padding: 0;
                text-align: center;
                line-height: 10px;
                font-size: 0.9em;
                cursor: pointer;
                color: ${this.locked? this.colors.locked.unselected : this.colors.unlocked.unselected};
            }

            .upArrow:hover,
            .downArrow:hover {
                color: ${this.locked? this.colors.locked.selected : this.colors.unlocked.selected};
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

            .padlockWrapper {
                grid-column-start: 3;
                padding: 2px 0px 0px 1px;
                text-align: center;
                vertical-align: middle;
                cursor: pointer
            }

            .padlockWrapper svg {
                fill: ${this.locked? this.colors.accent : this.colors.unlocked.unselected};
                margin-top: 2px;
            }


        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.arrowWrapper.appendChild(this.upArrow);
        this.arrowWrapper.appendChild(this.downArrow);

        this.padlockWrapper.appendChild(this.padlock);

        this.wrapper.appendChild(this.numberInput);
        this.wrapper.appendChild(this.arrowWrapper);
        this.wrapper.appendChild(this.padlockWrapper);

        shadow.appendChild(this.wrapper);

        // this.addEventListener('mouseover', this.focus);
        this.addEventListener('focus', this.focus);

        // this.addEventListener('mouseout', this.blur);
        this.addEventListener('blur', this.blur);

        // this.numberInput.addEventListener('focus', this.focus);
    }

    /**
     * Update the main value
     * @param {number} number - new value for the input
     */
    setInputValue(number) {
        let val = parseFloat(number);
        this.numberInput.value = val || 0;
    }

    /**
     * Focus on the element
     * @param {object} ev - event
     */
    focus(ev) {
        console.log(`input-number-lockable.focus() - START`);
        // this.wrapper.style.opacity = 1;

        let borderColor = this.locked? this.colors.locked.border : this.colors.accent;
        console.log(`\t border color is ${borderColor}`);

        this.wrapper.style.borderColor = borderColor;
        this.arrowWrapper.style.borderColor = borderColor;
        this.padlockWrapper.style.borderColor = borderColor;
        console.log(`input-number-lockable.focus() - END`);
    }

    /**
     * Remove focus from the element
     * @param {object} ev - event
     */
    blur(ev) {
        console.log(`input-number-lockable.blur() - START`);
        // this.wrapper.style.opacity = this.restingOpacity;

        let borderColor = this.locked? this.colors.locked.border : this.colors.unlocked.border;
        console.log(`\t border color is ${borderColor}`);

        this.wrapper.style.borderColor = borderColor;
        this.arrowWrapper.style.borderColor = borderColor;
        this.padlockWrapper.style.borderColor = borderColor;
        console.log(`input-number-lockable.blur() - END`);
    }
}

customElements.define('input-number-lockable', InputNumberLockable);
