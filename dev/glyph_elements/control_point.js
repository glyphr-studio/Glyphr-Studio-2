import GlyphElement from './glyph_element.js';
import Coord from './coord.js';
import {calculateAngle, calculateLength, angleToNiceAngle} from '../common/functions.js';

/**
 * Glyph Element > ControlPoint
 * Either the central Point in a Path Point, or one of it's Handles
 */
export default class ControlPoint extends GlyphElement {
  /**
   * Create a ControlPoint
   * @param {Coord} coord - position of the handle
   * @param {boolean} use - show or hide the handle
   * @param {PathPoint} parent - link to the parent Path object
   */
  constructor({
    coord = {x: 0, y: 0},
    use = true,
    xLock = false,
    yLock = false,
    parent = false,
  } = {}) {
    super();
    this.parent = parent;
    this.coord = coord;
    this.use = use;
    this.xLock = xLock;
    this.yLock = yLock;
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
      coord: this.coord.save(verbose),
    };

    if (this.use) re.use = true;
    if (this.xLock) re.xLock = true;
    if (this.yLock) re.yLock = true;

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

    let re = `${ind}{ControlPoint\n`;
    ind += '  ';

    re += `${ind}coord: ${this.coord.print(level+1)}\n`;
    re += `${ind}use: ${this.use}\n`;

    re += `${ind.substring(2)}}`;

    return re;
  }

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  /**
   * Get the x coordinate
   * @returns {number}
   */
  get x() {
    return this._use? this._coord.x : this.parent.p.x;
  }

  /**
   * Get the y coordinate
   * @returns {number}
   */
  get y() {
    return this._use? this._coord.y : this.parent.p.y;
  }

  /**
   * Get the x/y Coord
   * @returns {Coord}
   */
  get coord() {
    return this._coord;
  }

  /**
   * Get the show/hide value
   * @returns {boolean}
   */
  get use() {
    return this._use? true : false;
  }

  /**
   * Is the handle locked in the x dimension
   * @returns {boolean}
   */
  get xLock() {
    return this._xLock;
  }

  /**
   * Is the handle locked in the y dimension
   * @returns {boolean}
   */
  get yLock() {
    return this._yLock;
  }

  /**
   * Handle angle relative to Root Point
   * @returns {number}
   */
  get angle() {
    return calculateAngle(this.coord, this.parent.p.coord);
  }

  /**
   * Handle "Nice Angle" for UI
   * @returns {number}
   */
  get niceAngle() {
    return angleToNiceAngle(this.angle);
  }

  /**
   * Handle Length
   * @returns {number}
   */
  get length() {
    return calculateLength(this.coord, this.parent.p.coord);
  }


  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  /**
   * Set the X position
   * @param {number} position
   */
  set x(position) {
    this.coord.x = position;
    this.use = true;
  }

  /**
   * Set the Y position
   * @param {number} position
   */
  set y(position) {
    this.coord.y = position;
    this.use = true;
  }

  /**
   * Set the x/y Coord
   * @param {Coord} pt
   */
  set coord(pt) {
    pt.parent = this;
    this._coord = new Coord(pt);
    this.use = true;
  }

  /**
   * Show or hide the handle
   * @param {boolean} show
   */
  set use(show) {
    this._use = !!show;
    this.changed();
  }

  /**
   * Set the handle lock in the x dimension
   * @param {boolean} lock
   */
  set xLock(lock) {
    this._xLock = !!lock;
  }

  /**
   * Set the handle lock in the y dimension
   * @param {boolean} lock
   */
  set yLock(lock) {
    this._yLock = !!lock;
  }
}
