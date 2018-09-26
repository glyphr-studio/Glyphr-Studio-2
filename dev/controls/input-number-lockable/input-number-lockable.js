import {makeElement} from '../controls.js';
import ButtonToggle from '../button-toggle/button-toggle.js';
import InputNumber from '../input-number/input-number.js';
import {uiColors} from '../../common/colors.js';

/**
 * A numeric input field, with up/down arrows for increment/decrement,
 * and also a lock control that toggles a locked state.
 * Primarily used for a ControlPoint x/y input.
 */
export default class InputNumberLockable extends HTMLElement {
    /**
     * Create an InputNumberLockable
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.locked = this.hasAttribute('locked');

        this.wrapper = makeElement({className: 'wrapper'});

        this.inputNumber = new InputNumber({hideRightBorder: ''});

        this.padlock = new ButtonToggle({class: 'padlock', icon: 'lock', size: '26'});

        if (this.locked) {
            this.inputNumber.setAttribute('disabled', '');
            this.padlock.setAttribute('selected', '');
        }

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                transition: all 100ms easeOutExpo;
            }

            .wrapper {
                margin: 0px;
                padding: 0px;
                display: grid;
                grid-template-columns: 1fr 24px;
                height: 100%;
                border-style: solid;
                border-width: 0px;
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.enabled.resting.background};
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
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.observer = new MutationObserver(this.childAttributeChanged);
        this.observer.elementRoot = this;
        this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});

        this.wrapper.appendChild(this.inputNumber);
        this.wrapper.appendChild(this.padlock);

        shadow.appendChild(this.wrapper);
    }

    /**
     * Listen for changes on child elements
     * @param {object} mutationsList - collection of changes
     */
    childAttributeChanged(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type == 'attributes' && mutation.attributeName === 'selected') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                console.log(mutation);

                if (mutation.oldValue === '') {
                    // unlock
                    this.elementRoot.inputNumber.removeAttribute('disabled');
                } else {
                    // lock
                    this.elementRoot.inputNumber.setAttribute('disabled', '');
                }
            }
        }
    }
}

customElements.define('input-number-lockable', InputNumberLockable);
