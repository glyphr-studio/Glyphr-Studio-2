import {makeElement} from '../controls.js';

/**
 * Shows an icon that is either selected or unselected,
 * pressing the button toggles the state
 */
export default class ButtonToggle extends HTMLElement {
    /**
     * Create an ButtonToggle
     */
    constructor() {
        super();

        this.size = this.getAttribute('size') || 24;
        this.gutterSize = Math.round(this.size * 0.05);
        this.iconSize = this.size - (this.gutterSize * 2);
        this.selected = this.hasAttribute('selected');
        this.disabled = this.hasAttribute('disabled');

        this.wrapper = makeElement({className: 'wrapper', tabindex: !this.disabled});
        this.wrapper.innerHTML = this.getIcon(this.getAttribute('icon'), this.iconSize);

        this.colors = {
            selected: 'rgb(0, 140, 210)',
            unselected: 'rgba(0, 0, 0, 0.5)',
            active: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.1)',
        };

        this.restingOpacity = 0.9;

        let style = makeElement({tag: 'style', content: `
            .wrapper {
                box-sizing: border-box;
                margin: 0;
                border: 0;
                padding: ${this.gutterSize}px;
                width: ${this.size}px;
                height: ${this.size}px;
                overflow: hidden;
                user-select: none;
                opacity: ${this.disabled? '1' : this.restingOpacity};
            }

            .wrapper:hover,
            .wrapper *:hover {
                opacity: 1;
                cursor: ${this.disabled? 'normal' : 'pointer'};
            }

            .wrapper:focus {
                outline: 1px dashed ${this.colors.selected};
                outline-offset: 2px;
            }
        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);
        shadow.appendChild(this.wrapper);

        this.updateFillColor();

        this.addEventListener('click', this.toggle);
        this.addEventListener('keypress', this.keyPress);
    }

    /**
     * Handle keypress events
     * @param {object} ev - event
     */
    keyPress(ev) {
        // space or enter key
        if (ev.which === 32 || ev.which === 13) this.toggle();
    }

    /**
     * Flips the state of this button
     */
    toggle() {
        this.selected = !this.selected;
        this.updateFillColor();
    }

    /**
     * Colors the icon appropriately based on state
     */
    updateFillColor() {
        let icon = this.wrapper.getElementsByTagName('svg')[0];

        if (this.disabled) {
            icon.style.fill = this.colors.disabled;
        } else if (this.selected) {
            icon.style.fill = this.colors.selected;
            this.setAttribute('selected', '');
        } else {
            icon.style.fill = this.colors.unselected;
            this.removeAttribute('selected');
        }
    }

    /**
     * Generates an SVG icon
     * @param {string} id - which icon to get
     * @param {number} size - how big the icon should be
     * @returns {string} - full SVG
     */
    getIcon(id, size = '24') {
        let header = ` version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
            x="0px" y="0px" width="${size}px" height="${size}px"`;

        switch (id) {
            case 'lock':
                return `<svg ${header}
                viewBox="0 0 26 26" enable-background="new 0 0 26 26">
                <path d="M17,12V8h-1V7h-1V6h-4v1h-1v1H9v4H8v8h10v-8H17z M15,12h-4V9h1V8h2v1h1V12z"/>
                </svg>`;

            default:
                return `<svg ${header}
                viewBox="0 0 12 12" enable-background="new 0 0 12 12">
                <rect width="12" height="12"/>
                </svg>`;
        }
    }
}

customElements.define('button-toggle', ButtonToggle);
