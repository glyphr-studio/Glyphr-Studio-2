import GlyphElement from './glyphelement.js';
import {numSan} from '../app/functions.js';

/**
 * Coordinate
 * A single x/y coordinate
 */
export default class Coord extends GlyphElement {
    /**
     * Create a coordinate
     * @param {number} x - The X value
     * @param {number} y - The Y value
     * @param {boolean} xLock - if the X value is locked
     * @param {boolean} yLock - if the Y value is locked
     */
    constructor({x = 0, y = 0, xLock = false, yLock = false} = {}) {
        super();
        this._x = numSan(x);
        this._y = numSan(y);
        if (xLock) this._xLock = xLock;
        if (yLock) this._yLock = yLock;
    }


    // --------------------------------------------------------------
    // Common Glyphr Studio object methods
    // --------------------------------------------------------------

    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @return {*}
     */
    save(verbose = false) {
        let re = {
            x: this.x,
            y: this.y,
        };

        if (this._xLock) re.xLock = true;
        if (this._yLock) re.yLock = true;

        if (verbose) re.objType = this.objType;

        return re;
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /** Gets the xLock property */
    get xLock() {
        return this._xLock? true : false;
    }

    /** Gets the yLock property */
    get yLock() {
        return this._yLock? true : false;
    }

    /**
     * Make sure x is a number
     * @return {number}
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
     * @return {number}
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
        position = parseFloat(position);
        if (isNaN(position)) this._x = 0;
        else this._x = position;
    }

    /**
     * Set the y position of the point
     * @param {number} position
     */
    set y(position = 0) {
        position = parseFloat(position);
        if (isNaN(position)) this._y = 0;
        else this._y = position;
    }

    /**
     * Sets if the x value can be moved
     * @param {boolean} lock
     */
    set xLock(lock) {
        if (lock) this._xLock = true;
        else {
            if (this._xLock) delete this._xLock;
        }
    }

    /**
     * Sets if the y value can be moved
     * @param {boolean} lock
     */
    set yLock(lock) {
        if (lock) this._yLock = true;
        else {
            if (this._yLock) delete this._yLock;
        }
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
 * @return {boolean}
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
