import {json} from '../app/functions.js';

/**
 * Base for all Glyph Elements
 */
export default class GlyphElement {
    /** Yay! */
    constructor() {}


    /**
     * Find out what type of Element this is
     */
    get objType() {
        return this._objType || this.constructor.name;
    }

    /**
     * Find out what type of Element this is
     * @param {string} type
     */
    set objType(type) {
        return this._objType = type;
    }

    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @returns {*}
     */
    save(verbose = false) {
        let re = clone(this);
        re.objType = this.objType;

        if (!verbose) delete re.objType;
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
     * @returns {string}
     */
    print(level = 0) {
        let ind = '';
        for (let i=0; i<level; i++) ind += '  ';

        let re = `${ind}{${this.objType}\n`;
        ind += '  ';

        let safeObj = this.save();
        let elem;

        for (let key in safeObj) {
            if (safeObj.hasOwnProperty(key)) {
                elem = this[key];
                if (elem.print) {
                    re += `${ind}${key}: ${elem.print(level+1)}\n`;
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

        re += `${ind.substring(2)}}`;

        return re;
    }

    /**
     * Figures out the center of the bounding box
     */
    get center() {
        if (this.maxes ) {
            return {
                x: ((this.maxes.xMax - this.maxes.xMin) / 2) + this.maxes.xMin,
                y: ((this.maxes.yMax - this.maxes.yMin) / 2) + this.maxes.yMin,
            };
        }

        return false;
    }
}
