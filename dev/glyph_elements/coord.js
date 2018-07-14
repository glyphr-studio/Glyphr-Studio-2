import GlyphElement from './glyphelement.js';
import {numSan, isVal} from '../app/functions.js';

/**
 * Glyph Element > Coordinate
 * A single x/y coordinate with fancy GlyphElement stuff, used as a child of ControlPoint
 * For simple x/y object, use XYPoint
 */
export default class Coord extends GlyphElement {
    /**
     * Create a coordinate
     * @param {number} x - The X value
     * @param {number} y - The Y value
     * @param {object} parent - link to the parent ControlPoint object
     */
    constructor({x = 0, y = 0, parent = false} = {}) {
        super();
        this.x = x;
        this.y = y;
        this.parent = parent;
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
        this.changed();
    }

    /**
     * Set the y position of the point
     * @param {number} position
     */
    set y(position = 0) {
        position = numSan(position);
        if (isNaN(position)) this._y = 0;
        else this._y = position;
        this.changed();
    }
}
