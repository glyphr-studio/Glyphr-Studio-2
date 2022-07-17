/**
 * description
 */
export default class PanelArea extends HTMLElement {
  /**
   * Create an PanelArea
   * @param {object} attributes - collection of key: value pairs to set as attributes
   */
  constructor(attributes = {}) {
    super();

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    let panelName = this.getAttribute('panel') || 'panel';

    // Put it all together
    let shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.querySelector("#control__panel-area");
    const instance = template.content.cloneNode(true);
    instance.querySelector('#header').innerHTML = panelName;
    shadowRoot.appendChild(instance);
    /*
    this.observer = new MutationObserver(this.childAttributeChanged);
    this.observer.elementRoot = this;
    this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
    */
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
          this.elementRoot.inputNumber.removeAttribute('disabled');
        } else {
          // disabled
          this.elementRoot.inputNumber.setAttribute('disabled', '');
        }
      }
    }
  }
}

// customElements.define('panel-area', PanelArea);
