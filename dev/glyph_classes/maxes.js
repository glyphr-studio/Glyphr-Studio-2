/* exported Maxes maxesOverlap getOverallMaxes */

/**
 * Maxes
 * Standard way of defining a bounding box
 */
class Maxes {
    /**
     * Create a Maxes object
     * @param {number} xmax - largest x value
     * @param {number} xmin - smallest x value
     * @param {number} ymax - largest y value
     * @param {number} ymin - smallest y value
     */
    constructor({
        xmax = -Infinity,
        xmin = Infinity,
        ymax = -Infinity,
        ymin = Infinity,
    } = {}) {
        this.xmax = xmax;
        this.xmin = xmin;
        this.ymax = ymax;
        this.ymin = ymin;
    }

    /**
     * Generic smallest box
     * @return {object}
     */
    get minBounds() {
        return {
            xmax: -Infinity,
            xmin: Infinity,
            ymax: -Infinity,
            ymin: Infinity,
        };
    }

    /**
     * Generic largest box
     * @return {object}
     */
    get maxBounds() {
        return {
            xmax: Infinity,
            xmin: -Infinity,
            ymax: Infinity,
            ymin: -Infinity,
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

    if (exclusive) re = (m1.xmin < m2.xmax && m1.xmax > m2.xmin && m1.ymin < m2.ymax && m1.ymax > m2.ymin);
    else re = (m1.xmin <= m2.xmax && m1.xmax >= m2.xmin && m1.ymin <= m2.ymax && m1.ymax >= m2.ymin);

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
        re.xmax = Math.max(re.xmax, tm.xmax);
        re.xmin = Math.min(re.xmin, tm.xmin);
        re.ymax = Math.max(re.ymax, tm.ymax);
        re.ymin = Math.min(re.ymin, tm.ymin);
        // debug([re]);
    }

    // debug(' getOverallMaxes - END\n');

    return re;
}
