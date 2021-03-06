import { makeElement } from '../controls.js';
import { uiColors, flashUIElementAsActive } from '../../common/colors.js';

/**
 * Shows an icon that is either selected or unselected,
 * pressing the button toggles the state
 */
export default class ButtonToggle extends HTMLElement {
  /**
   * Create an ButtonToggle
   * @param {object} attributes - collection of key: value pairs to set as attributes
   */
  constructor(attributes = {}) {
    // console.log(`ButtonToggle.constructor() - START`);
    super();

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    this.size = this.getAttribute('size') || 24;
    this.gutterSize = Math.round(this.size * 0.05);
    this.iconSize = this.size - this.gutterSize * 2 - 2;
    this.selected = this.hasAttribute('selected');
    this.disabled = this.hasAttribute('disabled');

    this.wrapper = makeElement({
      tag: 'div',
      className: 'wrapper',
      tabIndex: !this.disabled,
    });
    if (this.disabled) this.wrapper.setAttribute('disabled', '');
    if (this.selected) this.wrapper.setAttribute('selected', '');
    this.wrapper.innerHTML = this.getIcon(
      this.getAttribute('icon'),
      this.iconSize
    );

    let style = makeElement({
      tag: 'style',
      content: `
            :host {
                box-sizing: border-box;
                margin: 0;
                border: 0;
                width: ${this.size}px;
                height: ${this.size}px;
            }

            * {
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            .wrapper {
                box-sizing: border-box;
                margin: 0;
                border-width: 1px;
                border-style: solid;
                padding: ${this.gutterSize}px;
                width: ${this.size}px;
                height: ${this.size}px;
                vertical-align: top;
                text-align: left;
                overflow: hidden;
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.enabled.resting.background};
            }

            .wrapper svg {
                fill: ${uiColors.enabled.resting.fill};
            }

            .wrapper:hover {
                cursor: pointer;
                border-color: ${uiColors.enabled.active.border};
                background-color: ${uiColors.enabled.active.background};
            }

            .wrapper:hover svg {
                fill: ${uiColors.enabled.active.fill};
            }

            .wrapper:focus {
                outline: 1px dashed ${uiColors.accent};
                fill: ${uiColors.enabled.active.fill};
                outline-offset: -1px;
            }


            .wrapper[selected] {
                border-color: ${uiColors.accent};
                background-color: ${uiColors.enabled.active.background};
            }

            .wrapper[selected]:hover {
                cursor: pointer;
                border-color: ${uiColors.enabled.active.border};
                background-color: ${uiColors.enabled.resting.background};
            }

            .wrapper[selected]:focus {
                border-color: ${uiColors.enabled.resting.border};
                outline: 1px dashed ${uiColors.accent};
                outline-offset: -1px;
            }

            .wrapper[selected] svg {
                fill: ${uiColors.accent};
            }


            .wrapper[disabled],
            .wrapper:hover[disabled],
            .wrapper:focus[disabled],
            .wrapper:active[disabled] {
                cursor: default;
                border-color: ${uiColors.disabled.border};
                background-color: ${uiColors.disabled.background};
            }

            .wrapper[disabled] svg,
            .wrapper:hover[disabled] svg,
            .wrapper:focus[disabled] svg,
            .wrapper:active[disabled] svg {
                fill: ${uiColors.disabled.fill};
            }

        `,
    });

    // Put it all together
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);
    shadow.appendChild(this.wrapper);

    if (!this.disabled) {
      this.addEventListener('click', this.toggle);
      this.addEventListener('keydown', this.keyPress);
    }
  }

  /**
   * Specify which attributes are observed and trigger attributeChangedCallback
   */
  static get observedAttributes() {
    return ['disabled', 'selected'];
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

    if (attributeName === 'selected') {
      if (newValue === '') {
        // selected
        this.wrapper.setAttribute('selected', '');
      } else if (oldValue === '') {
        // not selected
        this.wrapper.removeAttribute('selected');
      }
    }
  }

  /**
   * Handle keypress events
   * @param {object} ev - event
   */
  keyPress(ev) {
    switch (ev.keyCode) {
      case 13: // enter
      case 32: // spacebar
      case 37: // d-pad left
      case 38: // d-pad up
      case 39: // d-pad right
      case 40: // d-pad down
      case 98: // ten key down
      case 100: // ten key left
      case 102: // ten key right
      case 104: // ten key up
      case 107: // ten key +
      case 109: // ten key -
        this.toggle();
        break;

      default:
        break;
    }
  }

  /**
   * Flips the state of this button
   */
  toggle() {
    this.selected = !this.selected;

    if (this.selected) {
      this.setAttribute('selected', '');
      this.wrapper.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
      this.wrapper.removeAttribute('selected');
    }

    flashUIElementAsActive(this);
  }

  /**
   * Generates an SVG icon
   * @param {string} id - which icon to get
   * @param {number} size - how big the icon should be
   * @returns {string} - full SVG
   */
  getIcon(id, size = '24') {
    // console.log(`getIcon - passed ${id} at size ${size}`);
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
