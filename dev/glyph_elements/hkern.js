import GlyphElement from './glyphelement.js';
import {hexToChars} from '../app/unicode.js';


/**
 * Horizontal Kern
 * An object for storing two groups of glyphs, and
 * the kern value that applies to them.
 */
export default class HKern extends GlyphElement {
    /**
     * Set up the HKern object
     * @param {array} leftGroup - Collection of Unicode values
     * @param {array} rightGroup - Collection of Unicode values
     * @param {number} value - Amount to move leftGroup to the right
     */
    constructor({leftGroup = [], rightGroup = [], value = 0} = {}) {
        super();
        this.leftGroup = leftGroup;
        this.rightGroup = rightGroup;
        this.value = value;
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
        let re = {
            objType: this.objType,
            leftGroup: this.leftGroup.slice(),
            rightGroup: this.rightGroup.slice(),
            value: this._value,
        };

        if (!verbose) delete re.objType;

        return re;
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Return the value for this kern
     * @returns {number}
     */
    get value() {
        return this._value || 0;
    }

    /**
     * Creates a display name for this kern group
     * @returns {string}
     */
    get name() {
        let left = hexToChars(this.leftGroup.join(''));
        let right = hexToChars(this.rightGroup.join(''));
        return '' + left + ' | ' + right;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * Set the value for this kern
     * @param {number} val
     */
    set value(val) {
        this._value = parseInt(val) || 0;
    }
}
