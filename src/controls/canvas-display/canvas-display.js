import { makeElement } from '../controls.js';
import { samples } from '../../samples/samples.js';
import Glyph from '../../glyph_elements/glyph.js';
// import { getGlyphrStudioApp } from '../app/main.js';
import { debug } from '../../common/functions.js';

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

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    this.canvas = makeElement({ tag: 'canvas' });
    this.ctx = this.canvas.getContext('2d');

    this.glyphs = this.getAttribute('glyphs') || '';
    this.width = this.getAttribute('width') || 2000;
    this.height = this.getAttribute('height') || 1100;
    this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
    this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

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

            canvas {
                background-color: white;
            }
        `,
    });

    // Put it all together
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);

    /*
    this.observer = new MutationObserver(this.childAttributeChanged);
    this.observer.elementRoot = this;
    this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
    */

    shadow.appendChild(this.canvas);

    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.redraw();
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
    console.log(` canvas-display.attributeChangeCallback`);
    console.log(
      `\t Attribute ${attributeName} was ${oldValue}, is now ${newValue}`
    );

    switch (attributeName) {
      case 'glyphs':
        this.glyphs = newValue;
        this.redraw();
        break;

      case 'height':
        this.height = newValue;
        this.redraw();
        break;

      case 'width':
        this.width = newValue;
        this.redraw();
        break;

      case 'vertical-align':
        this.vertical = newValue;
        this.redraw();
        break;

      case 'horizontal-align':
        this.horizontal = newValue;
        this.redraw();
        break;

      default:
        break;
    }
    if (attributeName === 'glyphs') {
      this.redraw();
    }
  }

  /**
   * Updates the canvas
   */
  redraw() {
    console.log(` canvas-display.redraw`);
    let view = { dx: 100, dy: 800, dz: 1 };
    // const app = getGlyphrStudioApp();
    this.ctx.fillStyle = 'lime';
    this.ctx.fillRect(view.dx, 0, 1, 1000);
    this.ctx.fillRect(0, view.dy, 1000, 1);

    // let cp = GlyphrStudio.getCurrentProject();
    // let sg = cp.getGlyph('0x41', true);
    // console.log(sg);

    let sg = new Glyph(samples.glyphBox);
    debug(sg);
    sg.drawGlyph(this.ctx, view);
  }
}

// customElements.define('canvas-display', CanvasDisplay);
