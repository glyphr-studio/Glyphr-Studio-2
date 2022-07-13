import GlyphElement from './glyph_element.js';
import ControlPoint from './control_point.js';
import { round, rotate, pointsAreEqual, isVal } from '../common/functions.js';

/**
 * Glyph Element > Path Point
 * A collection of these units make up a Path,
 * they have position and handles (or control
 * points). There are a few Path Point types, and
 * individual handles can be shown or hidden.
 */
export default class PathPoint extends GlyphElement {
  /**
   * Create a PathPoint
   * @param {ControlPoint} p - Main control point
   * @param {ControlPoint} h1 - First handle
   * @param {ControlPoint} h2 - Second handle
   * @param {string} type - corner, flat, or symmetric
   * @param {object} parent - link to the parent Path object
   */
  constructor({ p, h1, h2, type = 'corner', parent = false } = {}) {
    super();
    this.parent = parent;
    this.p = p;
    this.h1 = h1;
    this.h2 = h2;
    this.type = type;

    this.objType = 'PathPoint';
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
      p: this.p.save(verbose),
      type: this.type,
    };

    if (this.h1.use) re.h1 = this.h1.save(verbose);
    if (this.h2.use) re.h2 = this.h2.save(verbose);

    if (verbose) re.objType = this.objType;

    return re;
  }

  /**
   * Create a nicely-formatted string for this object
   * @param {number} level - how far down we are
   * @param {number} num - increment designator for arrays
   * @returns {string}
   */
  print(level = 0, num = false) {
    let ind = '';
    for (let i = 0; i < level; i++) ind += '  ';

    let re = `${ind}{PathPoint ${isVal(num) ? num : ''}\n`;
    ind += '  ';

    re += `${ind}type: ${this.type}\n`;
    re += `${ind}p: ${this.p.print(level + 1)}\n`;
    re += `${ind}h1: ${this.h1.print(level + 1)}\n`;
    re += `${ind}h2: ${this.h2.print(level + 1)}\n`;

    re += `${ind.substring(2)}}/PathPoint ${isVal(num) ? num : ''}`;

    return re;
  }

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  /**
   * Get the main point
   * @returns {ControlPoint}
   */
  get p() {
    return this._p;
  }

  /**
   * Get the first handle
   * @returns {ControlPoint}
   */
  get h1() {
    return this._h1;
  }

  /**
   * Get the second handle
   * @returns {ControlPoint}
   */
  get h2() {
    return this._h2;
  }

  /**
   * Get a point's type
   * @returns {string} type - symmetric / flat / corner
   */
  get type() {
    return this._type;
  }

  /**
   * Figure out where this point is in the overall path
   * @returns {number}
   */
  get pointNumber() {
    if (!this.parent) return false;

    const pp = this.parent.pathPoints;
    if (!pp) return false;

    for (let p = 0; p < pp.length; p++) {
      if (pp[p] === this) return p;
    }

    return false;
  }

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  /**
   * set the main point
   * @param {ControlPoint} newPoint
   */
  set p(newPoint = {}) {
    newPoint.parent = this;
    this._p = new ControlPoint(newPoint);
  }

  /**
   * set the first handle
   * @param {ControlPoint} newPoint
   */
  set h1(newPoint = {}) {
    if (!newPoint.coord) {
      newPoint.coord = { x: this.p.x - 100, y: this.p.y };
      newPoint.use = false;
    }
    newPoint.parent = this;
    this._h1 = new ControlPoint(newPoint);
  }

  /**
   * set the second handle
   * @param {ControlPoint} newPoint
   */
  set h2(newPoint = {}) {
    if (!newPoint.coord) {
      newPoint.coord = { x: this.p.x + 100, y: this.p.y };
      newPoint.use = false;
    }
    newPoint.parent = this;
    this._h2 = new ControlPoint(newPoint);
  }

  /**
   * Change a point's type
   * @param {string} type - symmetric / flat / corner
   */
  set type(type) {
    if (type === 'symmetric') this.makeSymmetric();
    else if (type === 'flat') this.makeFlat();
    else this._type = 'corner';
  }

  // --------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------

  /**
   * Updates position based on deltas
   * @param {string} controlPoint - p / h1 / h2
   * @param {number} dx - delta x
   * @param {number} dy - delta y
   */
  updatePathPointPosition(controlPoint = 'p', dx = 0, dy = 0) {
    // log(`PathPoint.updatePathPointPosition`, 'start');
    // log(`control point ${controlPoint} dx ${dx} dy ${dy}`);

    dx = parseFloat(dx);
    dy = parseFloat(dy);

    switch (controlPoint) {
      case 'p':
        // Should this honor xLock / yLock?
        // Should this be _x/_y instead of x/y?
        this.p.coord._x += dx;
        this.p.coord.y += dy;
        // this.p.coord.changed();

        this.h1.coord.x += dx;
        this.h1.coord.y += dy;
        // this.h1.coord.changed();

        this.h2.coord.x += dx;
        this.h2.coord.y += dy;
        // this.h2.coord.changed();
        break;

      case 'h1':
        // Should this honor xLock / yLock?
        // Should this be _x/_y instead of x/y?
        this.h1.coord.x += dx;
        this.h1.coord.y += dy;
        if (this.type === 'symmetric') this.makeSymmetric('h1');
        else if (this.type === 'flat') this.makeFlat('h1');
        // this.h1.coord.changed();
        break;

      case 'h2':
        // Should this honor xLock / yLock?
        // Should this be _x/_y instead of x/y?
        this.h2.coord.x += dx;
        this.h2.coord.y += dy;
        if (this.type === 'symmetric') this.makeSymmetric('h2');
        else if (this.type === 'flat') this.makeFlat('h2');
        // this.h2.coord.changed();
        break;
    }

    // log(`PathPoint.updatePathPointPosition`, 'end');
  }

  /**
   * Checks to see if there is a control point where the mouse is
   * @param {number} x - mouse x position
   * @param {number} y - mouse y position
   * @param {number} targetSize - radius around the point to return true
   * @param {boolean} noHandles - Eliminates checking for handles in multi-select situations
   * @returns {object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
   */
  isOverControlPoint(x = 0, y = 0, targetSize = 3, noHandles = false) {
    const test = { x: x, y: y };
    if (pointsAreEqual(this.p, test, targetSize)) {
      // log('PathPoint.isOverControlPoint - Returning P1');
      return { point: this, type: 'p' };
    }

    if (this.h1.use && !noHandles) {
      if (pointsAreEqual(this.h1, test, targetSize)) {
        // log('PathPoint.isOverControlPoint - Returning h1');
        return { point: this, type: 'h1' };
      }
    }

    if (this.h2.use && !noHandles) {
      if (pointsAreEqual(this.h2, test, targetSize)) {
        // log('PathPoint.isOverControlPoint - Returning h2');
        return { point: this, type: 'h2' };
      }
    }

    return false;
  }

  /**
   * Moves one handle to be symmetrical with the other
   * @param {string} hold - Handle to not move while making symmetric
   * @returns {PathPoint}
   */
  makeSymmetric(hold) {
    // log('PathPoint.makeSymmetric - hold ' + hold + ' starts as ' + JSON.stringify(this));

    if (!hold) {
      hold = this.h1.use ? 'h1' : 'h2';
      if (!(this.h1.use || this.h2.use)) {
        if (
          (this.h2.x + this.p.x + this.h1.x) / 3 === this.p.x &&
          (this.h2.y + this.p.y + this.h1.y) / 3 === this.p.y
        ) {
          // Handles and points are all in the same place
          this.h2.x -= 200;
          this.h1.x += 200;
          this.h1.use = true;
          this.h2.use = true;
          return;
        }
      }
    }

    switch (hold) {
      case 'h1':
        this.h2.x = this.p.x - this.h1.x + this.p.x;
        this.h2.y = this.p.y - this.h1.y + this.p.y;
        break;
      case 'h2':
        this.h1.x = this.p.x - this.h2.x + this.p.x;
        this.h1.y = this.p.y - this.h2.y + this.p.y;
        break;
    }

    this._type = 'symmetric';
    this.h1.use = true;
    this.h2.use = true;

    // this.roundAll();
    // log('PathPoint.makeSymmetric - returns ' + JSON.stringify(this));

    return this;
  }

  /**
   * Moves one handle to be inline with the other, while maintaining handle length
   * @param {string} hold - handle to not move
   * @returns {PathPoint}
   */
  makeFlat(hold) {
    // log('PathPoint.makeFlat', 'start');
    // log('hold passed ' + hold);

    if (this.isFlat()) {
      this._type = 'flat';
      return;
    }

    if (!hold) {
      hold = this.h1.use ? 'h1' : 'h2';
      if (!(this.h1.use || this.h2.use)) {
        if (
          (this.h2.x + this.p.x + this.h1.x) / 3 === this.p.x &&
          (this.h2.y + this.p.y + this.h1.y) / 3 === this.p.y
        ) {
          // Handles and points are all in the same place
          this.h2.x -= 300;
          this.h1.x += 100;
          this.h1.use = true;
          this.h2.use = true;
          return;
        }
      }
    }

    const angle1 = this.h1.angle;
    const angle2 = this.h2.angle;
    const hyp1 = this.h1.length;
    const hyp2 = this.h2.length;

    // new values
    let newHx;
    let newHy;
    let newAdj;
    let newOpp;

    if (hold === 'h1') {
      // get new x and y for h2
      newAdj = Math.cos(angle1) * hyp2;
      newOpp = Math.tan(angle1) * newAdj;

      // Set values
      newHx = this.p.x + newAdj * -1;
      newHy = this.p.y + newOpp * -1;

      if (!isNaN(newHx) && !isNaN(newHy)) {
        this.h2.x = newHx;
        this.h2.y = newHy;
      }
    } else if (hold === 'h2') {
      // get new x and y for h2
      newAdj = Math.cos(angle2) * hyp1;
      newOpp = Math.tan(angle2) * newAdj;

      // Set values
      newHx = this.p.x + newAdj * -1;
      newHy = this.p.y + newOpp * -1;

      if (!isNaN(newHx) && !isNaN(newHy)) {
        this.h1.x = newHx;
        this.h1.y = newHy;
      }
    }

    this._type = 'flat';

    // log('PathPoint.makeFlat', 'end');

    return this;
  }

  /**
   * Checks to see if two handles are flat
   * @returns {boolean}
   * */
  isFlat() {
    if (this.p.x === this.h1.x && this.p.x === this.h2.x) return true;
    if (this.p.y === this.h1.y && this.p.y === this.h2.y) return true;

    const a1 = this.h1.angle;
    const a2 = this.h2.angle;
    // log('comparing ' + a1 + ' / ' + a2);

    return round(Math.abs(a1) + Math.abs(a2), 2) === 3.14;
  }

  /**
   * Figures out what type a point is based on handle positions
   * @returns {string}
   */
  resolvePointType() {
    // log('PathPoint.resolvePointType', 'start');

    if (this.isFlat()) {
      if (this.h1.length === this.h2.length) {
        // log('resolvePointType - setting to Symmetric');
        this._type = 'symmetric';
      } else {
        // log('resolvePointType - setting to Flat');
        this._type = 'flat';
      }
    } else {
      // log('resolvePointType - setting to Corner');
      this._type = 'corner';
    }

    return this.type;
    // log('pathPoint.resolvePointType', 'end');
  }

  /**
   * Makes handles pointed at a specific point
   * @param {number} px - X value to point at
   * @param {number} py - Y value to point at
   * @param {number} length - Length the handle should end up
   * @param {string} handle - Which handle to move
   * @param {boolean} doNotResolvePointType - After updating, skip auto-resolving the point type
   * @returns {PathPoint}
   */
  makePointedTo(
    px,
    py,
    length = false,
    handle = 'h2',
    doNotResolvePointType = false
  ) {
    // figure out angle
    const adj1 = this.p.x - px;
    const opp1 = this.p.y - py;

    const yMod = opp1 >= 0 ? -1 : 1;
    const xMod = -1;

    const hyp1 = Math.sqrt(adj1 * adj1 + opp1 * opp1);
    const angle1 = Math.acos(adj1 / hyp1);

    length = length || hyp1 / 3;

    // log('PathPoint.makePointedTo - x/y/l ' + px + ' ' + py + ' ' + length + ' - Before H1x/y ' + this.h1.x + ' ' + this.h1.y);
    this[handle].x = this.p.x + Math.cos(angle1) * length * xMod;
    this[handle].y = this.p.y + Math.sin(angle1) * length * yMod;
    // log('PathPoint.makePointedTo - after H1x/y ' + this.h1.x + ' ' + this.h1.y);

    if (!doNotResolvePointType) {
      if (this.type === 'corner') this.makeFlat(handle);
      else this.makeSymmetric(handle);
      // log('PathPoint.makePointedTo - after make symmetric H1x/y ' + this.h1.x + ' ' + this.h1.y);
    }

    return this;
  }

  /**
   * Rotate Point and Handles around a center of rotation
   * @param {number} angle - how much to rotate (radians)
   * @param {XYPoint} about - x/y point center of rotation
   * @returns {PathPoint}
   */
  rotate(angle, about) {
    // log('PathPoint.rotate', 'start');
    rotate(this.p, angle, about);
    rotate(this.h1, angle, about);
    rotate(this.h2, angle, about);
    // log('this.p ' + json(this.p, true));
    // log('PathPoint.rotate', 'end');

    return this;
  }

  /**
   * Resets handles to defaults
   * @returns {PathPoint}
   */
  resetHandles() {
    this.type = 'corner';
    this.h1.use = true;
    this.h2.use = true;
    this.h2.x = this.p.x - 100;
    this.h2.y = this.p.y;
    this.h1.x = this.p.x + 100;
    this.h1.y = this.p.y;

    return this;
  }

  /**
   * Rounds all the Point and Handle data to a precision
   * @param {number} i - precision
   * @returns {PathPoint}
   */
  roundAll(i = 9) {
    this.p.x = round(this.p.x, i);
    this.p.y = round(this.p.y, i);
    this.h1.x = round(this.h1.x, i);
    this.h1.y = round(this.h1.y, i);
    this.h2.x = round(this.h2.x, i);
    this.h2.y = round(this.h2.y, i);

    return this;
  }

  // --------------------------------------------------------------
  // Alignment
  // --------------------------------------------------------------

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignY(pathPoint) {
    this.p.y = pathPoint.p.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignX(pathPoint) {
    this.p.x = pathPoint.p.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHV() {
    this.h1.x = this.p.x;
    this.h2.x = this.p.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHH() {
    this.h1.y = this.p.y;
    this.h2.y = this.p.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH1X(pathPoint) {
    this.h1.x = pathPoint.h1.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH1XCross(pathPoint) {
    this.h1.x = pathPoint.h2.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH1Y(pathPoint) {
    this.h1.y = pathPoint.h1.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH1YCross(pathPoint) {
    this.h1.y = pathPoint.h2.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH2X(pathPoint) {
    this.h2.x = pathPoint.h2.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH2XCross(pathPoint) {
    this.h2.x = pathPoint.h1.x;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH2Y(pathPoint) {
    this.h2.y = pathPoint.h2.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH2YCross(pathPoint) {
    this.h2.y = pathPoint.h1.y;
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHY(pathPoint) {
    this.alignH1Y(pathPoint);
    this.alignH2Y(pathPoint);
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHYCross(pathPoint) {
    this.alignH1YCross(pathPoint);
    this.alignH2YCross(pathPoint);
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHXCross(pathPoint) {
    this.alignH1XCross(pathPoint);
    this.alignH2XCross(pathPoint);
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignHX(pathPoint) {
    this.alignH1X(pathPoint);
    this.alignH2X(pathPoint);
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH1(pathPoint) {
    this.alignH1X(pathPoint);
    this.alignH1Y(pathPoint);
  }

  /**
   * Align
   * @param {PathPoint} pathPoint - other point with which to align
   */
  alignH2(pathPoint) {
    this.alignH2X(pathPoint);
    this.alignH2Y(pathPoint);
  }

  /**
   * Find the offset between two points
   * @param {PathPoint} pathPoint - other point with which to align
   * @returns {number}
   */
  getMutualOffset(pathPoint) {
    if (this.p.x === pathPoint.p.x) {
      return Math.abs(this.p.y - pathPoint.p.y);
    } else if (this.p.y === pathPoint.p.y) {
      return Math.abs(this.p.x - pathPoint.p.x);
    } else {
      const dX = Math.abs(this.p.x - pathPoint.p.x);
      const dY = Math.abs(this.p.y - pathPoint.p.y);
      return Math.sqrt(Math.abs(dX ^ (2 + dY) ^ 2));
    }
  }

  /**
   * Align by Mutual Offset
   * @param {number} p1 - first point
   * @param {number} p2 - second point
   * @param {number} p3 - third point
   */
  alignMutualOffsetXY(p1, p2, p3) {
    this.alignMutualOffsetY(p1, p2, p3);
    this.alignMutualOffsetX(p1, p2, p3);
  }

  /**
   * Align by Mutual Offset X
   * @param {number} p1 - first point
   * @param {number} p2 - second point
   * @param {number} p3 - third point
   */
  alignMutualOffsetX(p1, p2, p3) {
    const dRef = Math.abs(p1.p.x - p2.p.x);
    const dCur = Math.abs(this.p.x - (p3.p.x || p2.p.x));
    const delta = dRef - dCur;

    if (this.p.x > p3.p.x || this.p.x == p3.p.x) this.p.x += delta;
    else if (this.p.x < p3.p.x) this.p.x -= delta;
    else if (this.p.x > p2.p.x || this.p.x == p2.p.x) this.p.x += delta;
    else if (this.p.x < p2.p.x) this.p.x -= delta;
  }

  /**
   * Align by Mutual Offset Y
   * @param {number} p1 - first point
   * @param {number} p2 - second point
   * @param {number} p3 - third point
   */
  alignMutualOffsetY(p1, p2, p3) {
    const dRef = Math.abs(p1.p.y - p2.p.y);
    const dCur = Math.abs(this.p.y - (p3.p.y || p2.p.y));
    const delta = dRef - dCur;

    if (this.p.y > p3.p.y || this.p.y == p3.p.y) this.p.y += delta;
    else if (this.p.y < p3.p.y) this.p.y -= delta;
    else if (this.p.y > p2.p.y || this.p.y == p2.p.y) this.p.y += delta;
    else if (this.p.y < p2.p.y) this.p.y -= delta;
  }
}
