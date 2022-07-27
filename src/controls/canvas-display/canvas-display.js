import { makeElement } from '../../common/dom.js';
import { log } from '../../common/functions.js';
import { samples } from '../../samples/samples.js';
import Glyph from '../../glyph_elements/glyph.js';
import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { glyphToHex } from '../../common/unicode.js';
// import { getGlyphrStudioApp } from '../app/main.js';
// import { log } from '../../common/functions.js';

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
    this.width = this.getAttribute('width') || 1000;
    this.height = this.getAttribute('height') || 1100;
    this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
    this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

    let style = makeElement({
      tag: 'style',
      content: `
            * {
                box-sizing: border-box;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
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
    console.log(`canvas-display.attributeChangeCallback`);
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
    log('CanvasDisplay.redraw', 'start');
    // let project = getCurrentProject();
    // let settings = project.projectSettings;
    // let upm = settings.upm;
    let editor = getCurrentProjectEditor();
    let glyph = editor.selectedGlyph;
    // let zoom = this.height / (upm * 1.2);
    let settings = getCurrentProject().projectSettings;
    let gutterSize = 20;
    let contentWidth = this.width - (2*gutterSize);
    let contentHeight = this.height - (2*gutterSize);
    let upm = settings.upm;
    let ascent = settings.ascent;
    let zoom = Math.min(contentWidth, contentHeight) / upm;
    let glyphWidth = glyph.advanceWidth;

    let view = {
      dx: gutterSize + ((contentWidth - (zoom * glyphWidth))/2),
      dy: gutterSize + (zoom * (ascent)),
      dz: zoom,
    };

    // log(`this.height: ${this.height}`);
    // log(`this.width: ${this.width}`);
    // log(`upm: ${upm}`);

    // log(`zoom: ${zoom}`);
    // log(`glyph.width: ${glyph.width}`);

    // log(`this.width - (glyph.width*zoom): ${this.width - (glyph.width*zoom)}`);
    // log(`settings.descent: ${settings.descent}`);
    // log(`settings.descent*zoom: ${settings.descent*zoom}`);

    // log(`(settings.descent*zoom) + this.height: ${(settings.descent*zoom) + this.height}`);



    // let view = {
    //   dx: (this.width - (glyph.width * zoom))/2,
    //   dy: (settings.descent*zoom) + (1*this.height),
    //   dz: zoom
    // };

    // const app = getGlyphrStudioApp();
    this.ctx.fillStyle = accentColors.gray.l95;
    this.ctx.fillRect(view.dx, 0, 1, 1000);
    this.ctx.fillRect(0, view.dy, 1000, 1);

    // let cp = GlyphrStudio.getCurrentProject();
    // let sg = cp.getGlyph('0x41', true);
    // log(sg);

    let glyphHex = glyphToHex(this.glyphs.charAt(0));

    let sg = getCurrentProject().getGlyph(glyphHex);
    log(sg);
    sg.drawGlyph(this.ctx, view);
    log('CanvasDisplay.redraw', 'end');
  }
}
