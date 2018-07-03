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
        return this.constructor.name;
    }


    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @returns {*}
     */
    save(verbose = false) {
        let re = clone(this);

        if (verbose) re.objType = this.objType;

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
     * @param {string} indentChar - what to use for indention
     * @returns {string}
     */
    print(level = 0, indentChar = '  ') {
        let re = '';
        let ind = '';
        for (let i=0; i<level; i++) ind += indentChar;

        let safeObj = this.save();

        for (let key in safeObj) {
            if (safeObj.hasOwnProperty(key)) {
                if (this[key].print) {
                    re += `${ind}${key}: ${this[key].print(level+1, indentChar)}\n`;
                } else {
                    re += `${ind}${key}: ${JSON.stringify(this[key])}\n`;
                }
            }
        }

        return re;
    }
}
