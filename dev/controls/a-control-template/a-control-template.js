import { makeElement } from '../controls.js';
import { uiColors } from '../../common/colors.js';

/**
 * description
 */
export default class AControlTemplate extends HTMLElement {
  /**
   * Create an AControlTemplate
   * @param {object} attributes - collection of key: value pairs to set as attributes
   */
  constructor(attributes = {}) {
    super();

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    this.wrapper = makeElement({ className: 'wrapper' });

    let style = makeElement({
      tag: 'style',
      content: `
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
        `,
    });

    // Put it all together
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);

    /*
        this.observer = new MutationObserver(this.childAttributeChanged);
        this.observer.elementRoot = this;
        this.observer.observe(this.ELEMENT, {attributes: true, attributeOldValue: true});
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
      if (
        mutation.type == 'attributes' &&
        mutation.attributeName === 'disabled'
      ) {
        console.log(
          'The ' + mutation.attributeName + ' attribute was modified.'
        );
        console.log(mutation);

        if (mutation.oldValue === '') {
          // enabled
          this.elementRoot.ELEMENT.removeAttribute('disabled');
        } else {
          // disabled
          this.elementRoot.ELEMENT.setAttribute('disabled', '');
        }
      }
    }
  }
}

customElements.define('a-control-template', AControlTemplate);
