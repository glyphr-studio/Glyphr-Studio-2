import GlyphElement from './glyph_element.js';
import Path from './path.js';
import {strSan} from '../common/functions.js';


/**
 * Glyph Element > Shape
 * The Shape object is the high level object that
 * represents an outline.  The Glyph object treats
 * Shape objects and Component Instance objects
 * interchangeably - any method added to Shape
 * should also be added to Component Instance.
 */
export default class Shape extends GlyphElement {
  /**
     * Create a Shape
     * @param {string} name
     * @param {Path} path
     * @param {boolean} xLock
     * @param {boolean} yLock
     * @param {boolean} wLock
     * @param {boolean} hLock
     * @param {boolean} ratioLock
     * @param {object} parent
     */
  constructor({
    name = 'Shape',
    path = [],
    visible = true,
    xLock = false,
    yLock = false,
    wLock = false,
    hLock = false,
    ratioLock = false,
    parent = false,
  } = {}) {
    // debug(`\n Shape.constructor - START`);
    super();
    this.parent = parent;
    this.name = name;
    this.path = path;
    this.visible = visible;
    this.xLock = xLock;
    this.yLock = yLock;
    this.wLock = wLock;
    this.hLock = hLock;
    this.ratioLock = ratioLock;
    // debug(` Shape.constructor - END\n\n`);
  }


  // --------------------------------------------------------------
  // Common Glyphr Studio object methods
  // --------------------------------------------------------------

  /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @returns {*}
     */
  save(verbose = false) {
    const re = {
      objType: this.objType,
      path: this.path.save(verbose),
    };

    if (this.name !== 'Shape') re.name = this.name;
    // if (!this.visible) re.visible = this.visible;
    if (this.xLock) re.xLock = this.xLock;
    if (this.yLock) re.yLock = this.yLock;
    if (this.wLock) re.wLock = this.wLock;
    if (this.hLock) re.hLock = this.hLock;
    if (this.ratioLock) re.ratioLock = this.ratioLock;

    if (!verbose) delete re.objType;

    return re;
  }

  /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @returns {string}
     */
  print(level = 0) {
    let ind = '';
    for (let i=0; i<level; i++) ind += '  ';

    let re = `${ind}{Shape\n`;
    ind += '  ';

    if (this.name !== 'Shape') re += `${ind}name: ${this.name}\n`;
    if (this.xLock) re += `${ind}xLock: ${this.xLock}\n`;
    if (this.yLock) re += `${ind}yLock: ${this.yLock}\n`;
    if (this.wLock) re += `${ind}wLock: ${this.wLock}\n`;
    if (this.hLock) re += `${ind}hLock: ${this.hLock}\n`;
    if (this.ratioLock) re += `${ind}ratioLock: ${this.ratioLock}\n`;

    re += `${ind}path: ${this.path.print(level+1)}\n`;

    re += `${ind}maxes: ${this.maxes.print(level+1)}\n`;

    re += `${ind.substring(2)}}/Shape`;

    return re;
  }

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  /**
     * get name
     * @returns {string}
     */
  get name() {
    return this._name;
  }

  /**
     * get path
     * @returns {Path}
     */
  get path() {
    return this._path;
  }

  /**
     * get visible
     * @returns {boolean}
     */
  get visible() {
    return this._visible;
  }

  /**
     * get xLock
     * @returns {boolean}
     */
  get xLock() {
    return this._xLock;
  }

  /**
     * get yLock
     * @returns {boolean}
     */
  get yLock() {
    return this._yLock;
  }

  /**
     * get wLock
     * @returns {boolean}
     */
  get wLock() {
    return this._wLock;
  }

  /**
     * get hLock
     * @returns {boolean}
     */
  get hLock() {
    return this._hLock;
  }

  /**
     * get ratioLock
     * @returns {boolean}
     */
  get ratioLock() {
    return this._ratioLock;
  }

  // computed properties

  /**
     * Get X position
     * @returns {number}
     */
  get x() {
    return this.maxes.xMin;
  }

  /**
     * Get Y position
     * @returns {number}
     */
  get y() {
    return this.maxes.yMax;
  }

  /**
     * Get Width
     * @returns {number}
     */
  get width() {
    const w = this.maxes.xMax - this.maxes.xMin;
    return Math.max(w, 0);
  }

  /**
     * Get Height
     * @returns {number}
     */
  get height() {
    const h = this.maxes.yMax - this.maxes.yMin;
    return Math.max(h, 0);
  }

  /**
     * get maxes
     * @returns {boolean}
     */
  get maxes() {
    return this.path.maxes;
  }


  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  /**
     * set name
     * @param {string} name
     * @returns {Shape} - reference to this Shape
     */
  set name(name) {
    name = strSan(name);
    // debug('\t sanitized: ' + name);
    if (name !== '') {
      this._name = name;
    } else {
      showToast('Invalid shape name - shape names must only contain alphanumeric characters or spaces.');
    }

    return this;
  }

  /**
     * set path
     * @param {boolean} path
     * @returns {Shape} - reference to this Shape
     */
  set path(path) {
    this._path = new Path(path);
    this._path.parent = this;
    return this;
  }

  /**
     * set visible
     * @param {boolean} visible
     * @returns {Shape} - reference to this Shape
     */
  set visible(visible) {
    this._visible = !!visible;
    return this;
  }

  /**
     * set xLock
     * @param {boolean} xLock
     * @returns {Shape} - reference to this Shape
     */
  set xLock(xLock) {
    this._xLock = !!xLock;
    return this;
  }

  /**
     * set yLock
     * @param {boolean} yLock
     * @returns {Shape} - reference to this Shape
     */
  set yLock(yLock) {
    this._yLock = !!yLock;
    return this;
  }

  /**
     * set wLock
     * @param {boolean} wLock
     * @returns {Shape} - reference to this Shape
     */
  set wLock(wLock) {
    this._wLock = !!wLock;
    return this;
  }

  /**
     * set hLock
     * @param {boolean} hLock
     * @returns {Shape} - reference to this Shape
     */
  set hLock(hLock) {
    this._hLock = !!hLock;
    return this;
  }

  /**
     * set ratioLock
     * @param {boolean} ratioLock
     * @returns {Shape} - reference to this Shape
     */
  set ratioLock(ratioLock) {
    this._ratioLock = !!ratioLock;
    return this;
  }

  // computed properties

  /**
     * Set X position
     * @param {number} x
     * @returns {Shape} - reference to this Shape
     */
  set x(x) {
    this.setShapePosition(x, false);
    return this;
  }

  /**
     * Set Y position
     * @param {number} y
     * @returns {Shape} - reference to this Shape
     */
  set y(y) {
    this.setShapePosition(false, y);
    return this;
  }

  /**
     * Set Width
     * @param {number} w
     * @returns {Shape} - reference to this Shape
     */
  set width(w) {
    this.setShapeSize(w, false);
    return this;
  }

  /**
     * Set Height
     * @param {number} h
     * @returns {Shape} - reference to this Shape
     */
  set height(h) {
    this.setShapeSize(false, h);
    return this;
  }

  /**
     * set maxes
     * @param {Maxes} maxes
     * @returns {Shape} - reference to this Shape
     */
  set maxes(maxes) {
    this.path.maxes = maxes;
    return this;
  }

  // --------------------------------------------------------------
  // Export to different languages
  // --------------------------------------------------------------

  /**
     * Make SVG from this Shape
     * @param {number} size - how big
     * @param {number} gutter - margin
     * @param {number} upm - project UPM size
     * @param {number} descender - project descender size
     * @returns {string} - svg
     */
  makeSVG(size = 50, gutter = 5, upm = 1000, descender = 300) {
    const charScale = (size - (gutter * 2)) / size;
    const gutterScale = (gutter / size) * upm;
    const vbSize = upm - (gutter * 2);
    let re = '<svg version="1.1" ';
    re += 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
    re += 'width="' + size + '" height="' + size + '" viewBox="0,0,' + vbSize + ',' + vbSize + '">';
    re += '<g transform="translate(' + (gutterScale) + ',' + (upm - descender - (gutterScale / 2)) + ') scale(' + charScale + ',-' + charScale + ')">';
    // re += '<rect x="0" y="-'+descender+'" height="'+descender+'" width="1000" fill="lime"/>';
    // re += '<rect x="0" y="0" height="'+(upm-descender)+'" width="1000" fill="cyan"/>';
    re += '<path d="';
    re += this.path.svgPathData;
    re += '"/>';
    re += '</g>';
    re += '</svg>';
    return re;
  }

  /**
     * Make a PostScript path from this shape
     * PostScript paths use relative MoveTo commands, so
     * this shape must know about where the last shape left off
     * @param {number} lastX - x from previous path
     * @param {number} lastY - y from previous path
     * @returns {string} - PostScript path data
     */
  makePostScript(lastX = 0, lastY = 0) {
    return this.path ? this.path.makePathPostScript(lastX, lastY) : {re: '', lastX: lastX, lastY: lastY};
  }

  /**
     * Make an OpenType.js Path
     * @param {OpenType.js.Path} otPath
     * @returns {OpenType.js.Path}
     */
  makeOpenTypeJSPath(otPath) {
    return this.path.makeOpenTypeJSPath(otPath);
  }


  // --------------------------------------------------------------
  // Parity methods, shared between Shapes and ComponentInstances
  // --------------------------------------------------------------

  /**
     * Call path.updatePathPosition
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     * @returns {Shape} - reference to this shape
     */
  updateShapePosition(dx = 0, dy = 0) {
    this.path.updatePathPosition(dx, dy);
    return this;
  }

  /**
     * Call path.setPathPosition
     * @param {number} nx - new x value
     * @param {number} ny - new y value
     * @returns {Shape} - reference to this shape
     */
  setShapePosition(nx = false, ny = false) {
    this.path.setPathPosition(nx, ny);
    return this;
  }

  /**
     * Call path.updatePathSize
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratioLock - maintain aspect ratio
     * @returns {Shape} - reference to this shape
     */
  updateShapeSize(dw = 0, dh = 0, ratioLock = false) {
    this.path.updatePathSize(dw, dh, ratioLock);
    return this;
  }

  /**
     * Call path.setPathSize
     * @param {number} nw - new width
     * @param {number} nh - new height
     * @param {boolean} ratioLock - maintain aspect ratio
     * @returns {Shape} - reference to this shape
     */
  setShapeSize(nw = false, nh = false, ratioLock = false) {
    this.path.setPathSize(nw, nh, ratioLock);
    return this;
  }

  /**
     * Call path.isOverControlPoint
     * @param {number} x - x value to check
     * @param {number} y - y value to check
     * @param {number} targetSize - radius around the point to return true
     * @param {boolean} noHandles - true = only check points
     * @returns {object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
     */
  isOverControlPoint(x, y, targetSize, noHandles) {
    return this.path.isOverControlPoint(x, y, targetSize, noHandles);
  }

  /**
     * Call path.flipEW
     * @param {number} mid - x value about which to flip
     * @returns {Shape} - reference to this shape
     */
  flipEW(mid = this.center.x) {
    this.path.flipEW(mid);
    return this;
  }

  /**
     * Call path.flipNS
     * @param {number} mid - y value about which to flip
     * @returns {Shape} - reference to this shape
     */
  flipNS(mid = this.center.y) {
    this.path.flipNS(mid);
    return this;
  }

  /**
     * Call path.rotate
     * @param {number} angle - how much to rotate (radians)
     * @param {XYPoint} about - x/y center of rotation
     * @returns {Shape} - reference to this shape
     */
  rotate(angle, about) {
    // debug('\n Shape.rotate - START');
    about = about || this.center;
    // debug('\t first p[0].p.x ' + this.path.pathPoints[0].p.x);
    // debug(' Shape.rotate - END\n');
    this.path.rotate(angle, about);
    return this;
  }

  /**
     * Call path.reverseWinding
     */
  reverseWinding() {
    this.path.reverseWinding();
  }

  // /**
  //  * Call path.calcMaxes
  //  */
  // calcMaxes() {
  //     this.path.calcMaxes();
  // }

  /**
     * Call path.getSegment
     * @param {number} num - which segment to get
     * @returns {Segment}
     */
  getSegment(num) {
    return this.path.getSegment(num);
  }

  /**
     * Call path.isHere
     * @param {number} px - check x
     * @param {number} py - check y
     * @returns {boolean}
     */
  isHere(px, py) {
    return this.path.isHere(px, py);
  }


  // --------------------------------------------------------------
  // Drawing
  // --------------------------------------------------------------

  /**
     * Draw this Shape to a canvas
     * @param {object} ctx - canvas context
     * @param {view} view
     * @returns {boolean}
     */
  drawShape(ctx, view) {
    // debug('\n Shape.drawShape - START');
    // debug('\t view ' + json(view, true));
    if (this.visible) {
      this.path.drawPath(ctx, view);
    }
    // debug(' Shape.drawShape - returning true by default - END\n');
    return true;
  }

  /**
     * Draws the segment version of this shape
     * for debugging purposes
     */
  drawSegments() {
    const segments = this.path.getPolySegment();
    segments.slowlyDrawSegments();
  }


  // --------------------------------------------------------------
  // Checking
  // --------------------------------------------------------------

  /**
     * Checks for any NaN
     * @returns {boolean}
     */
  checkForNaN() {
    return this.path.checkForNaN();
  }


/* NEEDS REFACTORING - NO NEED TO DUPLICATE THESE METHODS HERE

    draw_PathOutline(accent = '#000', thickness = 1) {
        // debug('\n Shape.draw_PathOutline - START');
        draw_PathOutline(this, accent, thickness);
    }

    draw_BoundingBox(accent = '#000', thickness = 1) {
        // debug('\n Shape.draw_BoundingBox - START');
        draw_BoundingBox(this.path.maxes, accent, thickness);
    }

    draw_BoundingBoxHandles(accent = '#000', thickness = 1) {
        // debug('\n Shape.draw_BoundingBoxHandles - START');
        draw_BoundingBoxHandles(this.path.maxes, accent, thickness);
    }

    isOverBoundingBoxHandle(px, py) {
        // debug('\n Shape.isOverBoundingBoxHandle - START');
        let c = isOverBoundingBoxHandle(px, py, this.maxes);
        // debug('\t Shape.isOverBoundingBoxHandle returning ' + c);
        return c;
    }
*/
}
