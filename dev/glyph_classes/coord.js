/* exported Coord coordsAreEqual */

/**
 * A single x/y coordinate
 */
class Coord {
    /**
     * Create a coordinate
     * @param {number} x - The X value
     * @param {number} y - The Y value
     * @param {boolean} xLock - if the X value is locked
     * @param {boolean} yLock - if the Y value is locked
     */
    constructor({x = 0, y = 0, xLock = false, yLock = false} = {}) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        if (xLock) this.xLock = xLock;
        if (yLock) this.yLock = yLock;
    }

    /* GETTERS */

    /** Gets the xLock property */
    get xLock() {
        return this.xLock? true : false;
    }

    /** Gets the yLock property */
    get yLock() {
        return this.yLock? true : false;
    }

    /**
     * Make sure x is a number
     * @return {number}
     */
    get x() {
        if (!isNaN(this.x)) {
            return this.x;
        } else {
            this.x = 0;
            console.warn('Coord.x was NaN, setting to 0');
            return 0;
        }
    }

    /**
     * Make sure y is a number
     * @return {number}
     */
    get y() {
        if (!isNaN(this.y)) {
            return this.y;
        } else {
            this.y = 0;
            console.warn('Coord.y was NaN, setting to 0');
            return 0;
        }
    }

    /* SETTERS */

    /**
     * Sets if the x value can be moved
     * @param {boolean} lock
     */
    set xLock(lock) {
        if (lock) this.xLock = true;
        else {
            if (this.xLock) delete this.xLock;
        }
    }

    /**
     * Sets if the y value can be moved
     * @param {boolean} lock
     */
    set yLock(lock) {
        if (lock) this.yLock = true;
        else {
            if (this.yLock) delete this.yLock;
        }
    }
}

/**
 * Compare two coordinates within a margin of rounding
 * @param {Coord} c1 - First coordinate to compare
 * @param {Coord} c2 - Second coordinate to compare
 * @param {number} threshold - how close to compare positions
 * @return {boolean}
 */
function coordsAreEqual(c1, c2, threshold = 1) {
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
