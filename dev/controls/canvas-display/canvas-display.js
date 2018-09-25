import {makeElement} from '../controls.js';

/**
 * CanvasDisplay takes a string of glyphs and displays them on the canvas
 * No editing involved
 */
export default class CanvasDisplay extends HTMLElement {
    /**
     * Create an CanvasDisplay
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.canvas = makeElement({tag: 'canvas'});
        this.ctx = this.canvas.getContext('2d');

        this.glyphs = this.getAttribute('glyphs') || '';
        this.width = this.getAttribute('width') || 800;
        this.height = this.getAttribute('height') || 600;
        this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
        this.horozontalAlign = this.getAttribute('horizontal-align') || 'center';

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
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

        shadow.appendChild(this.canvas);
    }

    /**
     * Specify which attributes are observed and trigger attributeChangedCallback
     */
    static get observedAttributes() {
        return ['glyphs, height, width, vertical-align, horizontal-align'];
    }

    /**
     * Listens for attribute changes on this element
     * @param {string} attributeName - which attribute was changed
     * @param {string} oldValue - value before the change
     * @param {string} newValue - value after the change
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
        // console.log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

        switch (attributeName) {
            case 'glyphs':
                this.glyphs = newValue;
                redraw();
                break;

            case 'height':
                this.height = newValue;
                redraw();
                break;

            case 'width':
                this.width = newValue;
                redraw();
                break;

            case 'vertical-align':
                this.vertical = newValue;
                redraw();
                break;

            case 'horizontal-align':
                this.horizontal = newValue;
                redraw();
                break;

            default:
                break;
        }
        if (attributeName === 'glyphs') {
            redraw();
        }
    }


    /**
     * Updates the canvas
     */
    redraw() {

    }
}

customElements.define('canvas-display', CanvasDisplay);
