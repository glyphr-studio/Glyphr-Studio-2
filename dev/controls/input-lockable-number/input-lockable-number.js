import {makeElement} from '../controls.js';
import ButtonToggle from './button-toggle.js';

/**
 * A numeric input field, with up/down arrows for increment/decrement,
 * and also a lock control that toggles a locked state.
 * Primarily used for a ControlPoint x/y input.
 */
export default class InputLockableNumber extends HTMLElement {
    /**
     * Create an InputLockableNumber
     */
    constructor() {
        super();

        customElements.define('button-toggle', ButtonToggle);

        this.wrapper = makeElement({className: 'wrapper'});
        this.numberInput = makeElement({tag: 'input', className: 'numberInput', tabindex: true});
        this.setInputValue(this.getAttribute('value'));

        this.arrowWrapper = makeElement({className: 'arrowWrapper', tabindex: true});
        this.upArrow = makeElement({className: 'upArrow', content: '⏶'});
        this.downArrow = makeElement({className: 'downArrow', content: '⏷'});

        this.locked = this.hasAttribute('locked');

        this.padlockWrapper = makeElement({className: 'padlockWrapper', tabindex: true});
        this.padlock = document.createElement('botton-toggle');
        this.padlock.setAttribute('class', 'padlock');
        this.padlock.setAttribute('icon', 'lock');
        this.padlock.setAttribute('size', '20');

        if (this.locked) {
            this.numberInput.setAttribute('disabled', '');
            this.padlock.setAttribute('selected', '');
        }

        this.restingOpacity = '0.8';

        this.colors = {
            accent: 'rgb(0, 140, 210);',
            unlocked: {
                selected:   'rgba(0, 0, 0, 0.5)',
                unselected: 'rgba(0, 0, 0, 0.4)',
                border:     'rgba(0, 0, 0, 0.2)',
                background: 'white',
            },
            locked: {
                selected:   'rgba(0, 0, 0, 0.4)',
                unselected: 'rgba(0, 0, 0, 0.3)',
                border:     'rgba(0, 0, 0, 0.06)',
                background: 'rgba(0, 0, 0, 0.05)',
            },
        };

        let style = makeElement({tag: 'style', content: `
            .wrapper {
                margin: 0px;
                padding: 0px;
                opacity: ${this.restingOpacity};
                display: grid;
                grid-template-columns: 1fr 24px 24px;
                height: 100%;
                border-style: solid;
                border-width: 1px;
                border-color: ${this.locked? this.colors.locked.border : this.colors.unlocked.border};
                background-color: ${this.locked? this.colors.locked.background : this.colors.unlocked.background};
            }

            .wrapper:hover,
            .wrapper *:hover {
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

        // this.padlockWrapper.appendChild(this.padlock);

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
        console.log(`input-lockable-number.focus() - START`);
        // this.wrapper.style.opacity = 1;

        let borderColor = this.locked? this.colors.locked.border : this.colors.accent;
        console.log(`\t border color is ${borderColor}`);

        this.wrapper.style.borderColor = borderColor;
        this.arrowWrapper.style.borderColor = borderColor;
        this.padlockWrapper.style.borderColor = borderColor;
        console.log(`input-lockable-number.focus() - END`);
    }

    /**
     * Remove focus from the element
     * @param {object} ev - event
     */
    blur(ev) {
        console.log(`input-lockable-number.blur() - START`);
        // this.wrapper.style.opacity = this.restingOpacity;

        let borderColor = this.locked? this.colors.locked.border : this.colors.unlocked.border;
        console.log(`\t border color is ${borderColor}`);

        this.wrapper.style.borderColor = borderColor;
        this.arrowWrapper.style.borderColor = borderColor;
        this.padlockWrapper.style.borderColor = borderColor;
        console.log(`input-lockable-number.blur() - END`);
    }
}
