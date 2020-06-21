import { json } from '../common/functions.js';

/**
 * Base for all Glyph Elements
 */
export default class GlyphElement {
  /** Yay! */
  constructor() {}

  /**
   * Any change that updates the shape of any part of a glyph
   * gets bubbled up through the GlyphElement hierarchy
   */
  changed() {
    // let status = 'changed ' + this.objType;

    if (this.cache) {
      this.cache = {};
    }

    if (this.parent) {
      // debug(status + ' - calling parent.changed()');
      this.parent.changed();
    } else {
      // debug(status + ' - No Parent!');
    }
  }

  /**
   * Find out what type of Element this is
   */
  get objType() {
    return this._objType || this.constructor.name;
  }

  /**
   * Find out what type of Element this is
   * @param {string} type
   * @returns {string}
   */
  set objType(type) {
    this._objType = type;
    return this._objType;
  }

  /**
   * get the cache
   * @returns {object}
   */
  get cache() {
    if (!this._cache) this._cache = {};
    return this._cache;
  }

  /**
   * set the cache
   * @param {object} cache
   * @returns {object}
   */
  set cache(cache = {}) {
    this._cache = cache;
    return this._cache;
  }

  /**
   * Export object properties that need to be saved to a project file
   * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
   * @returns {*}
   */
  save(verbose = false) {
    const re = clone(this);
    re.objType = this.objType;

    if (verbose) re.objType = this.objType;
    if (re.cache) delete re.cache;

    return re;
  }

  /**
   * String representation of this object
   * Uses .save() to only get defaults
   * @returns {string}
   */
  toString() {
    return json(this.save());
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

    let re = `${ind}{${this.objType} ${num ? num : ''}\n`;
    ind += '  ';

    const safeObj = this.save();
    let elem;

    for (const key in safeObj) {
      if (safeObj.hasOwnProperty(key)) {
        elem = this[key];
        if (elem.print) {
          re += `${ind}${key}: ${elem.print(level + 1)}\n`;
        } else {
          if (typeof elem !== 'function') {
            if (typeof elem === 'object') {
              re += `${ind}${key}: ${JSON.stringify(elem)}\n`;
            } else {
              re += `${ind}${key}: ${elem}\n`;
            }
          }
        }
      }
    }

    re += `${ind.substring(2)}}/${this.objType} ${num ? num : ''}`;

    return re;
  }

  /**
   * Figures out the center of the bounding box
   */
  get center() {
    if (this.maxes) {
      return {
        x: (this.maxes.xMax - this.maxes.xMin) / 2 + this.maxes.xMin,
        y: (this.maxes.yMax - this.maxes.yMin) / 2 + this.maxes.yMin,
      };
    }

    return false;
  }
}
