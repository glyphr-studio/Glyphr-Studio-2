import GlyphElement from './glyphelement.js';
import {numSan, isVal} from '../app/functions.js';

/**
 * Glyph Element > Coordinate
 * A single x/y coordinate
 */
export default class Coord extends GlyphElement {
    /**
     * Create a coordinate
     * @param {number} x - The X value
     * @param {number} y - The Y value
     */
    constructor({x = 0, y = 0} = {}) {
        super();
        this.x = x;
        this.y = y;
    }


    // --------------------------------------------------------------
    // Common Glyphr Studio object methods
    // --------------------------------------------------------------

    /**
     * Export object properties that need to be saved to a project file
     * @returns {*}
     */
    save() {
        let re = {
            x: this.x,
            y: this.y,
        };

        return re;
    }

    /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @returns {string}
     */
    print(level = 0) {
        let re = `{`;
        re += `x: ${isVal(this._x)? this._x : '--'}  `;
        re += `y: ${isVal(this._y)? this._y : '--'}`;
        re += `}`;

        return re;
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Make sure x is a number
     * @returns {number}
     */
    get x() {
        if (!isNaN(this._x)) {
            return this._x;
        } else {
            this._x = 0;
            console.warn('Coord.x was NaN, setting to 0');
            return 0;
        }
    }

    /**
     * Make sure y is a number
     * @returns {number}
     */
    get y() {
        if (!isNaN(this._y)) {
            return this._y;
        } else {
            this._y = 0;
            console.warn('Coord.y was NaN, setting to 0');
            return 0;
        }
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * Set the x position of the point
     * @param {number} position
     */
    set x(position = 0) {
        position = numSan(position);
        if (isNaN(position)) this._x = 0;
        else this._x = position;
    }

    /**
     * Set the y position of the point
     * @param {number} position
     */
    set y(position = 0) {
        position = numSan(position);
        if (isNaN(position)) this._y = 0;
        else this._y = position;
    }
}


// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Compare two coordinates within a margin of rounding
 * @param {Coord} c1 - First coordinate to compare
 * @param {Coord} c2 - Second coordinate to compare
 * @param {number} threshold - how close to compare positions
 * @returns {boolean}
 */
export function coordsAreEqual(c1, c2, threshold = 1) {
    // debug('\n coordsAreEqual - START');
    // debug('\t c1 ' + json(c1, true));
    // debug('\t c2 ' + json(c2, true));
    // debug('\t threshold ' + threshold);

    if (c1.x === c2.x && c1.y === c2.y) {
        // debug('\t exact match');
        return true;
    }

    let dx = Math.abs(c1.x - c2.x);
    let dy = Math.abs(c1.y - c2.y);

    // debug('\t dx ' + dx + '\tdy ' + dy);

    if (dx <= threshold && dy <= threshold) {
        // debug('\t below threshold match');
        return true;
    }

    // debug('\t not a match');
    // debug(' coordsAreEqual - END\n');

    return false;
}
