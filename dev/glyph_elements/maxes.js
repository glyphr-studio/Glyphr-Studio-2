import GlyphElement from './glyphelement.js';
import {isVal} from '../app/functions.js';

/**
 * Maxes
 * Standard way of defining a bounding box
 */
export default class Maxes extends GlyphElement {
    /**
     * Create a Maxes object
     * @param {number} xMin - smallest x value
     * @param {number} xMax - largest x value
     * @param {number} yMin - smallest y value
     * @param {number} yMax - largest y value
     */
    constructor({xMin, xMax, yMin, yMax} = {}) {
        super();
        // debug(`\n Maxes.constructor - START`);

        this.xMin = xMin; // use setter for hydration
        this.xMax = xMax; // use setter for hydration
        this.yMin = yMin; // use setter for hydration
        this.yMax = yMax; // use setter for hydration

        // debug(`\t maxes is now`);
        // debug(this);
        // debug(` Maxes.constructor - END\n\n`);
        return this;
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
        // debug(`\n Maxes.save - START`);

        let re = {};

        if (isVal(this._xMin)) re.xMin = this._xMin;
        if (isVal(this._xMax)) re.xMax = this._xMax;
        if (isVal(this._yMin)) re.yMin = this._yMin;
        if (isVal(this._yMax)) re.yMax = this._yMax;

        if (verbose) re.objType = this.objType;

        // debug(`\t returning`);
        // debug(re);
        // debug(` Maxes.save - END\n\n`);
        return re;
    }

    /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @returns {string}
     */
    print(level = 0) {
        let re = `{`;
        re += `xMin: ${this._xMin || '--'} `;
        re += `xMax: ${this._xMax || '--'} `;
        re += `yMin: ${this._yMin || '--'} `;
        re += `yMax: ${this._yMax || '--'}`;
        re += `}`;

        return re;
    }

    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Get xMin
     * @returns {number} value
     */
    get xMin() {
        if (isVal(this._xMin)) return this._xMin;
        else return Number.MAX_SAFE_INTEGER;
    }

    /**
     * Get xMax
     * @returns {number} value
     */
    get xMax() {
        if (isVal(this._xMax)) return this._xMax;
        else return Number.MIN_SAFE_INTEGER;
    }

    /**
     * Get yMin
     * @returns {number} value
     */
    get yMin() {
        if (isVal(this._yMin)) return this._yMin;
        else return Number.MAX_SAFE_INTEGER;
    }

    /**
     * Get yMax
     * @returns {number} value
     */
    get yMax() {
        if (isVal(this._yMax)) return this._yMax;
        else return Number.MIN_SAFE_INTEGER;
    }


    /**
     * Generic smallest box
     * @returns {object}
     */
    get minBounds() {
        return {
            xMin: Number.MAX_SAFE_INTEGER,
            xMax: Number.MIN_SAFE_INTEGER,
            yMin: Number.MAX_SAFE_INTEGER,
            yMax: Number.MIN_SAFE_INTEGER,
        };
    }

    /**
     * Generic largest box
     * @returns {object}
     */
    get maxBounds() {
        return {
            xMin: Number.MIN_SAFE_INTEGER,
            xMax: Number.MAX_SAFE_INTEGER,
            yMin: Number.MIN_SAFE_INTEGER,
            yMax: Number.MAX_SAFE_INTEGER,
        };
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * Set xMin
     * @param {number} x - new value
     * @returns {Maxes}
     */
    set xMin(x) {
        x = parseFloat(x);
        if (!isNaN(x)) this._xMin = x;
        else delete this._xMin;
        return this;
    }

    /**
     * Set xMax
     * @param {number} x - new value
     * @returns {Maxes}
     */
    set xMax(x) {
        x = parseFloat(x);
        if (!isNaN(x)) this._xMax = x;
        else delete this._xMax;
        return this;
    }

    /**
     * Set yMin
     * @param {number} y - new value
     * @returns {Maxes}
     */
    set yMin(y) {
        y = parseFloat(y);
        if (!isNaN(y)) this._yMin = y;
        else delete this._yMin;
        return this;
    }

    /**
     * Set yMax
     * @param {number} y - new value
     * @returns {Maxes}
     */
    set yMax(y) {
        y = parseFloat(y);
        if (!isNaN(y)) this._yMax = y;
        else delete this._yMax;
        return this;
    }
}


// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Given two Maxes, check if they overlap
 * @param {Maxes} m1 - first maxes
 * @param {Maxes} m2 - second maxes
 * @param {boolean} exclusive - 'inclusive' or 'exclusive'
 * @returns {boolean}
 */
export function maxesOverlap(m1, m2, exclusive = true) {
    // debug(`\n maxesOverlap - START`);
    // debug(`\t passed m1 / m2`);
    // debug(m1.save());
    // debug(m2.save());

    let re;

    if (exclusive) re = (m1.xMin < m2.xMax && m1.xMax > m2.xMin && m1.yMin < m2.yMax && m1.yMax > m2.yMin);
    else re = (m1.xMin <= m2.xMax && m1.xMax >= m2.xMin && m1.yMin <= m2.yMax && m1.yMax >= m2.yMin);

    // debug(` maxesOverlap - END returning ${re} \n\n`);
    return re;
}


/**
 * This takes an array of maxes objects, and returns a maxes
 * object that represents the extremes of all the passed objects
 * @param {array} maxarr - array of 'maxes' objects
 * @returns {Maxes}
 */
export function getOverallMaxes(maxarr) {
    // debug('\n getOverallMaxes - START');
    // debug('\t start');
    // debug(maxarr);

    let re = new Maxes();
    let tm;

    for (let m=0; m<maxarr.length; m++) {
        // debug('\t pass ' + m);
        tm = new Maxes(maxarr[m]);

        // find
        re.xMin = Math.min(re.xMin, tm.xMin);
        re.xMax = Math.max(re.xMax, tm.xMax);
        re.yMin = Math.min(re.yMin, tm.yMin);
        re.yMax = Math.max(re.yMax, tm.yMax);
        // debug([re]);
    }

    // debug(' getOverallMaxes - END\n');

    return re;
}
