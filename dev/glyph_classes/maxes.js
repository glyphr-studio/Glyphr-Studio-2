export {Maxes, maxesOverlap, getOverallMaxes};

/**
 * Maxes
 * Standard way of defining a bounding box
 */
class Maxes {
    /**
     * Create a Maxes object
     * @param {number} xMin - smallest x value
     * @param {number} xMax - largest x value
     * @param {number} yMin - smallest y value
     * @param {number} yMax - largest y value
     */
    constructor({
        xMin = Infinity,
        xMax = -Infinity,
        yMin = Infinity,
        yMax = -Infinity,
    } = {}) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
    }

    /**
     * Export object to a project file
     * @return {object}
     */
    save() {
        return {
            xMin: this.xMin,
            xMax: this.xMax,
            yMin: this.yMin,
            yMax: this.yMax,
        };
    }

    /**
     * Generic smallest box
     * @return {object}
     */
    get minBounds() {
        return {
            xMin: Infinity,
            xMax: -Infinity,
            yMin: Infinity,
            yMax: -Infinity,
        };
    }

    /**
     * Generic largest box
     * @return {object}
     */
    get maxBounds() {
        return {
            xMin: -Infinity,
            xMax: Infinity,
            yMin: -Infinity,
            yMax: Infinity,
        };
    }
}


/**
 * Given two Maxes, check if they overlap
 * @param {Maxes} m1 - first maxes
 * @param {Maxes} m2 - second maxes
 * @param {boolean} exclusive - 'inclusive' or 'exclusive'
 * @return {boolean}
 */
function maxesOverlap(m1, m2, exclusive = true) {
    let re;

    if (exclusive) re = (m1.xMin < m2.xMax && m1.xMax > m2.xMin && m1.yMin < m2.yMax && m1.yMax > m2.yMin);
    else re = (m1.xMin <= m2.xMax && m1.xMax >= m2.xMin && m1.yMin <= m2.yMax && m1.yMax >= m2.yMin);

    return re;
}


/**
 * This takes an array of maxes objects, and returns a maxes
 * object that represents the extremes of all the passed objects
 * @param {array} maxarr - array of 'maxes' objects
 * @return {Maxes}
 */
function getOverallMaxes(maxarr) {
    // debug('\n getOverallMaxes - START');
    // debug('\t start');
    // debug(maxarr);

    let re = new Maxes();
    let tm;

    for (let m=0; m<maxarr.length; m++) {
        // debug('\t pass ' + m);
        tm = maxarr[m];

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
