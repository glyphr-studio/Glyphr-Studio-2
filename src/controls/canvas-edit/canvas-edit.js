import { makeElement } from '../../common/dom.js';
import { log } from '../../common/functions.js';
import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { glyphToHex } from '../../common/unicode.js';

/**
 * CanvasEdit takes a string of glyphs and displays them on the canvas
 * And has a bunch of controls and interactions that allow for editing
 */
export default class CanvasEdit extends HTMLElement {
  /**
   * Specify which attributes are observed and trigger attributeChangedCallback
   */
   static get observedAttributes() {
    return ['glyphs', 'height', 'width', 'vertical-align', 'horizontal-align'];
  }

  /**
   * Create an CanvasEdit
   * @param {object} attributes - collection of key: value pairs to set as attributes
   */
  constructor(attributes = {}) {
    log(`CanvasEdit.constructor`, 'start');

    super();

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    // element attributes
    this.glyphs = this.getAttribute('glyphs') || '';
    this.width = this.getAttribute('width') || 2000;
    this.height = this.getAttribute('height') || 2000;
    this.verticalAlign = this.getAttribute('vertical-align') || 'middle';
    this.horizontalAlign = this.getAttribute('horizontal-align') || 'center';

    // internal properties
    this.canvas = makeElement({ tag: 'canvas' });
    this.ctx = this.canvas.getContext('2d');
    this.view = {dx:0, dy:0, dz:1};



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

    shadow.appendChild(this.canvas);

    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.redraw();
    log(`CanvasEdit.constructor`, 'end');
  }

  /**
   * Listens for attribute changes on this element
   * @param {string} attributeName - which attribute was changed
   * @param {string} oldValue - value before the change
   * @param {string} newValue - value after the change
   */
  attributeChangedCallback(attributeName, oldValue, newValue) {
    log(`CanvasEdit.attributeChangeCallback`, 'start');
    log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

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

    }

    if (attributeName === 'glyphs') {
      this.redraw();
    }
    log(`CanvasEdit.attributeChangeCallback`, 'end');
  }

  /**
   * Updates the canvas
   */
  redraw() {
    log('CanvasEdit.redraw', 'start');
    let editor = getCurrentProjectEditor();
    let glyph = editor.selectedGlyph;
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

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = accentColors.purple.l60;
    this.ctx.fillRect(view.dx, 0, 1, 1000);
    this.ctx.fillRect(0, view.dy, 1000, 1);

    let glyphHex = glyphToHex(this.glyphs.charAt(0));

    let sg = getCurrentProject().getGlyph(glyphHex);
    log(sg);
    sg.drawGlyph(this.ctx, view);
    log('CanvasEdit.redraw', 'end');
  }
}



// -------------------
// VIEW
// -------------------

function setView(oa) {
	const sc =
	  editor.nav.page === 'kerning'
		? getSelectedKernID()
		: getSelectedWorkItemID();
	const v = _UI.views || {};

	// Ensure there are at least defaults
	if (!isVal(v[sc])) {
	  v[sc] = getView('setView');
	}

	// Check for which to set
	if (isVal(oa.dx)) v[sc].dx = oa.dx;
	if (isVal(oa.dy)) v[sc].dy = oa.dy;
	if (isVal(oa.dz)) v[sc].dz = oa.dz;
}

function getView(calledBy) {
	// log('getView', 'start');
	// log('calledBy: ' + calledBy);

	const onkern = editor.nav.page === 'kerning';
	const sc = onkern ? getSelectedKernID() : getSelectedWorkItemID();
	const v = _UI.views || {};
	let re;

	if (isVal(v[sc])) {
	  re = clone(v[sc]);
	} else {
	  re = onkern ? clone(_UI.defaultKernView) : clone(_UI.defaultView);
	}

	// log('returning ' + json(re));
	// log('getView', 'end');

	return re;
}

function getDefaultView() {}

function viewZoom(zfactor, center) {
	const v = getView('viewZoom');
	const mx = _UI.eventhandlers.mousex;
	const my = _UI.eventhandlers.mousey;

	setView({
	  dz: round((v.dz *= zfactor), 2),
	  dx: center ? v.dx : mx - (mx - v.dx) * zfactor,
	  dy: center ? v.dy : my - (my - v.dy) * zfactor,
	});

	redraw({ calledBy: 'viewZoom', redrawPanels: false });
}

function setViewZoom(zoom) {
	zoom /= 100;
	const v = getView('setViewZoom');

	setView({
	  dz: round(zoom, 2),
	  dx: v.dx,
	  dy: v.dy,
	});

	redraw({ calledBy: 'setViewZoom', redrawPanels: false });
}



// --------------------------------------------------------------------------
// Convert between Saved values and Canvas values
// --------------------------------------------------------------------------
// convert stored x-y point to canvas x-y
export function sXcX(sx, view = getView('sXcX')) {
	let canvasx = view.dx;
	canvasx += sx * view.dz;
	return canvasx || view.dx;
}

export function sYcY(sy, view = getView('sYcY')) {
	let canvasy = view.dy;
	canvasy -= sy * view.dz;
	return canvasy || view.dy;
}

// convert canvas x-y inputs to saved shape x-y
export function cXsX(cx, view = getView('cXsX')) {
	return (cx - view.dx) / view.dz;
}

export function cYsY(cy, view = getView('cYsY')) {
	return (view.dy - cy) / view.dz;
}
