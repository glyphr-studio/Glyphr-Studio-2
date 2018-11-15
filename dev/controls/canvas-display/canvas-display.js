import {makeElement} from '../controls.js';
import GlyphrStudioApp from '../../app/app.js';

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
        this.width = this.getAttribute('width') || 2000;
        this.height = this.getAttribute('height') || 1100;
        this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
        this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            canvas {
                background-color: white;
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

        this.canvas.height = this.height;
        this.canvas.width = this.width;
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
        console.log(` canvs-display.attributeChangeCallback`);
        console.log(`\t Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

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
        console.log(` canvas-display.redraw`);
        this.ctx.fillStyle = 'lime';
        this.ctx.fillRect(0, 0, 100, 100);
        this.ctx.fillRect(100, 100, 100, 100);
        this.ctx.fillRect(200, 200, 100, 100);
        console.log(` THREE SQUARES >>>>>>>>>>>>>>>>>>>>>>>`);

        let cp = GlyphrStudio.getCurrentProject();
        let sg = cp.getGlyph('0x22', true);

        console.log(sg);

        sg.drawGlyph(this.ctx);
    }
}

customElements.define('canvas-display', CanvasDisplay);
