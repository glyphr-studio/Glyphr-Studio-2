/**
 * XYPoint
 * A single x/y point, without the fancy GlyphElement crud (like Coord)
 */
export default class XYPoint {
    /**
     * Create a XYPoint
     * @param {number} x - The X value
     * @param {number} y - The Y value
     */
    constructor({x = 0, y = 0} = {}) {
        this.x = x;
        this.y = y;
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
            console.warn('XYPoint.x was NaN, setting to 0');
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
            console.warn('XYPoint.y was NaN, setting to 0');
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
}
