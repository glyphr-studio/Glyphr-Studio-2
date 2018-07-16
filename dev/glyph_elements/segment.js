import GlyphElement from './glyphelement.js';
import XYPoint from './xypoint.js';
import Maxes from './maxes.js';
import {clone, numSan, isVal, round, hasNonValues, pointsAreEqual} from '../app/functions.js';

/**
 * Glyph Element > Segment
 * A Segment stores and acts on a piece of a Path
 * according to the mathematical definition of a
 * Bezier curve.
 *
 * Paths in Glyphr Studio are a collection of
 * Path Points, which themselves contain a point
 * and two handles.  Bezier curves, on the other
 * hand, are represented as two points, with two
 * handles between them.
 *
 * This Segment object is basically here just to
 * make Bezier math easier for Paths.
 */
export default class Segment extends GlyphElement {
    /**
     * Create a Segment
     * @param {number} p1x - First point x
     * @param {number} p1y - First point y
     * @param {number} p2x - First handle x
     * @param {number} p2y - First handle y
     * @param {number} p3x - Second handle x
     * @param {number} p3y - Second handle y
     * @param {number} p4x - Second point x
     * @param {number} p4y - Second point y
     */
    constructor({p1x = 0, p1y = 0, p2x, p2y, p3x, p3y, p4x = 0, p4y = 0} = {}) {
        super();
        this.p1x = numSan(p1x);
        this.p1y = numSan(p1y);
        this.p4x = numSan(p4x);
        this.p4y = numSan(p4y);
        // For lines, it's better to default p2 to p1 values, and p3 to p4 values
        this.p2x = isVal(p2x) ? numSan(p2x) : this.p1x;
        this.p2y = isVal(p2y) ? numSan(p2y) : this.p1y;
        this.p3x = isVal(p3x) ? numSan(p3x) : this.p4x;
        this.p3y = isVal(p3y) ? numSan(p3y) : this.p4y;

        this.calcMaxes();
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
            p1x: this.p1x,
            p1y: this.p1y,
            p2x: this.p2x,
            p2y: this.p2y,
            p3x: this.p3x,
            p3y: this.p3y,
            p4x: this.p4x,
            p4y: this.p4y,
        };

        if (!verbose) delete re.objType;

        return re;
    }

    /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @returns {string}
     */
    print(level = 0) {
        let ind = '';
        for (let i=0; i<level; i++) ind += '  ';

        let re = `${ind}{Segment\n`;
        ind += '  ';

        re += `${ind+'  '}line: ${this.lineType}\n`;
        re += `${ind+'  '}p1: ${this.p1x}/${this.p1y}\n`;
        re += `${ind+'  '}p2: ${this.p2x}/${this.p2y}\n`;
        re += `${ind+'  '}p3: ${this.p3x}/${this.p3y}\n`;
        re += `${ind+'  '}p4: ${this.p4x}/${this.p4y}\n`;
        re += `${ind+'  '}maxes: ${this.maxes.print(level+1)}\n`;
        re += `${ind.substring(2)}}`;

        return re;
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Vertical, Horizontal, Diagonal, or boolean False
     * @returns {*} - Line Type
     */
    get lineType() {
        if (!isVal(this._lineType)) this.determineLineType();
        return this._lineType;
    }

    /**
     * Returns the length of this curve
     */
    get length() {
        if (this.cache && this.cache.length) return this.cache.length;

        this.cache.length = this.calculateLength();

        return this.cache.length;
    }

    /**
     * Gets the length between p1 and p4
     * @returns {number}
     */
    get baseLength() {
        return getLineLength(
            this.p1x, this.p1y,
            this.p4x, this.p4y
        );
    }

    /**
     * Gets the length between p1/p2/p3/p4
     * @returns {number}
     */
    get topLength() {
        let a = getLineLength(
            this.p1x, this.p1y,
            this.p2x, this.p2y
        );
        let b = getLineLength(
            this.p2x, this.p2y,
            this.p3x, this.p3y
        );
        let c = getLineLength(
            this.p3x, this.p3y,
            this.p4x, this.p4y
        );

        return a+b+c;
    }

    /**
     * A rough way of determining length without doing
     * calculus or recursion. quickLength will almost always
     * be greater than the actual length.
     * @returns {number}
     */
    get quickLength() {
        return Math.max(this.topLength, this.baseLength);
    }

    /**
     * Get Maxes
     * @returns {Maxes}
     */
    get maxes() {
        if (hasNonValues(this._maxes)) {
            this.calcMaxes();
        }

        return new Maxes(this._maxes);
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * Set Maxes
     * @param {Maxes} maxes
     * @returns {Path} - reference to this Segment
     */
    set maxes(maxes) {
        this._maxes = new Maxes(maxes);
        return this;
    }


    // --------------------------------------------------------------
    // Drawing
    // --------------------------------------------------------------

    /**
     * Draws this segment to the Edit Canvas
     * @param {object} ctx - canvas context
     * @param {string} color
     * @param {number} dx - delta offset
     * @param {number} dy - delta offset
     */
    drawSegmentOutline(ctx, color = '#000', dx = 0, dy = 0) {
        ctx.strokeStyle = getColorFromRGBA((color), 0.9);
        let p1x = sXcX(this.p1x + dx);
        let p1y = sYcY(this.p1y + dy);
        let p2x = sXcX(this.p2x + dx);
        let p2y = sYcY(this.p2y + dy);
        let p3x = sXcX(this.p3x + dx);
        let p3y = sYcY(this.p3y + dy);
        let p4x = sXcX(this.p4x + dx);
        let p4y = sYcY(this.p4y + dy);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.bezierCurveTo(p2x, p2y, p3x, p3y, p4x, p4y);
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Draws the control points for this Segment
     * @param {object} ctx - canvas context
     * @param {string} color
     * @param {string} txt - text to display at the first point
     */
    drawSegmentPoints(ctx, color = '#000', txt = '•') {
        let p1x = sXcX(this.p1x);
        let p1y = sYcY(this.p1y);
        let p2x = sXcX(this.p2x);
        let p2y = sYcY(this.p2y);
        let p3x = sXcX(this.p3x);
        let p3y = sYcY(this.p3y);
        let p4x = sXcX(this.p4x);
        let p4y = sYcY(this.p4y);
        color = getColorFromRGBA(color, 0.4);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.font = '48px sans-serif';
        ctx.fillText(txt, p1x, p1y);
        // ctx.fillText(txt, p2x, p2y);
        // ctx.fillText(txt, p3x, p3y);
        // ctx.fillText(txt, p4x, p4y);
        ctx.fillRect(p1x, p1y, 5, 5);
        ctx.strokeRect(p2x, p2y, 5, 5);
        ctx.strokeRect(p3x, p3y, 5, 5);
        ctx.fillRect(p4x, p4y, 5, 5);
        // else draw_CircleHandle({'x':sXcX(this.p4x), 'y':sYcY(this.p4y)});
    }


    // --------------------------------------------------------------
    // Splitting
    // --------------------------------------------------------------

    /**
     * Splits a segment at either an x/y value or a decimal %
     * @param {*} sp - decimal or x/y object
     * @returns {array} - Array with two segments resulting from the split
     */
    split(sp = 0.5) {
        if (typeof sp === 'object' && isVal(sp.x) && isVal(sp.y)) {
            return this.splitAtPoint(sp);
        } else if (!isNaN(sp)) {
            return this.splitAtTime(sp);
        }
        return false;
    }

    /**
     * Splits a segment at a specific x/y position
     * @param {XYPoint} co - x/y point where to split
     * @returns {array} - Array with two segments resulting from the split
     */
    splitAtPoint(co) {
        // debug('\n Segment.splitAtPoint - START');
        // debug(`\t splitting at ${co.x} ${co.y}`);
        if (this.containsTerminalPoint(co, 0.1)) return false;

        if (this.lineType === 'horizontal' || this.lineType === 'vertical') {
            let newX;
            let newY;
            let online = false;
            if (this.lineType === 'horizontal') {
                if (round(co.y, 2) === round(this.p1y, 2)) {
                    if ((co.x > Math.min(this.p1x, this.p4x)) && (co.x < Math.max(this.p1x, this.p4x))) {
                        newX = co.x;
                        newY = this.p1y;
                        online = true;
                    }
                }
            } else if (this.lineType === 'vertical') {
                if (round(co.x, 2) === round(this.p1x, 2)) {
                    if ((co.y > Math.min(this.p1y, this.p4y)) && (co.y < Math.max(this.p1y, this.p4y))) {
                        newX = this.p1x;
                        newY = co.y;
                        online = true;
                    }
                }
            }
            if (!online) {
                // debug('\t not on the line');
                // debug(' Segment.splitAtPoint - END\n');
                return false;
            }
            // debug('\t returning simple line split');
            // debug(' Segment.splitAtPoint - END\n');
            return [
                new Segment({
                    'p1x': this.p1x,
                    'p1y': this.p1y,
                    'p4x': newX,
                    'p4y': newY,
                }),
                new Segment({
                    'p1x': newX,
                    'p1y': newY,
                    'p4x': this.p4x,
                    'p4y': this.p4y,
                }),
            ];
        } else if (this.pointIsWithinMaxes(co)) {
            let threshold = 0.1;
            let sp = this.getSplitFromXYPoint(co, threshold);
            // debug('\t distance is ' + sp.distance);
            if (sp && sp.distance < threshold) {
                // debug('\t splitting at ' + sp.split);
                return this.splitAtTime(sp.split);
            }
        }
        // debug(' Segment.splitAtPoint - returning false - END\n');
        return false;
    }

    /**
     * Splits a segment based on a decimal value ("time" is a metaphor here, from 0 to 1 second)
     * @param {number} t - decimal from 0 to 1 representing how far along the curve to split
     * @returns {array} - Array with two segments resulting from the split
     */
    splitAtTime(t = 0.5) {
        // debug('\n Segment.splitAtTime - START');
        let rs = (1 - t);
        // Do some math
        let x12 = (this.p1x * rs) + (this.p2x * t);
        let y12 = (this.p1y * rs) + (this.p2y * t);
        let x23 = (this.p2x * rs) + (this.p3x * t);
        let y23 = (this.p2y * rs) + (this.p3y * t);
        let x34 = (this.p3x * rs) + (this.p4x * t);
        let y34 = (this.p3y * rs) + (this.p4y * t);
        let x123 = (x12 * rs) + (x23 * t);
        let y123 = (y12 * rs) + (y23 * t);
        let x234 = (x23 * rs) + (x34 * t);
        let y234 = (y23 * rs) + (y34 * t);
        let x1234 = (x123 * rs) + (x234 * t);
        let y1234 = (y123 * rs) + (y234 * t);
        // Return two new Segments
        return [
            new Segment({
                'p1x': this.p1x,
                'p1y': this.p1y,
                'p2x': x12,
                'p2y': y12,
                'p3x': x123,
                'p3y': y123,
                'p4x': x1234,
                'p4y': y1234,
            }),
            new Segment({
                'p1x': x1234,
                'p1y': y1234,
                'p2x': x234,
                'p2y': y234,
                'p3x': x34,
                'p3y': y34,
                'p4x': this.p4x,
                'p4y': this.p4y,
            }),
        ];
    }

    /**
     * Splits a segment at many x/y points
     * @param {array} points - collection of many XYPoint objects where to split
     * @param {number} threshold - precision to look for a control point
     * @returns {array} - Array with many segments resulting from the split
     */
    splitAtManyPoints(points, threshold) {
        // debug('\n Segment.splitAtManyPoints - START');
        let segments = [new Segment(clone(this))];
        let tr;
        for (let x = 0; x < points.length; x++) {
            for (let s = 0; s < segments.length; s++) {
                if (!segments[s].containsTerminalPoint(points[x], threshold)) {
                    tr = segments[s].splitAtPoint(points[x]);
                    if (tr) {
                        segments.splice(s, 1, tr[0], tr[1]);
                    }
                }
            }
        }
        // debug('\t split into ' + segments.length);
        // debug(' Segment.splitAtManyPoints - END\n');
        return segments;
    }

    /**
     * Checks to see if a point is inside the bounding box of this Segment
     * @param {object} co - x/y point to check
     * @returns {boolean}
     */
    pointIsWithinMaxes(co) {
        let m = this.maxes;
        let re = (co.x <= m.xMax &&
            co.x >= m.xMin &&
            co.y <= m.yMax &&
            co.y >= m.yMin);
        return re;
    }

    /**
     * Removes the "handle" control points, effectively making this a straight line
     * @returns {Segment}
     */
    convertToLine() {
        return new Segment({p1x: this.p1x, p1y: this.p1y, p4x: this.p4x, p4y: this.p4y});
    }

    /**
     * Given an x/y point, find the equivalent split distance t
     * @param {XYPoint} point - place to look
     * @param {number} threshold - how close to look
     * @returns {object} - collection of results
     */
    getSplitFromXYPoint(point, threshold = 1) {
        // debug(`\n getSplitFromXYPoint - START`);

        let grains = this.quickLength * 1000;
        let minDistance = 999999999;
        let re = false;
        let check;
        let d;

        for (let t = 0; t < 1; t += (1 / grains)) {
            check = this.getXYPointFromSplit(t);
            // debug(`\t checking x:${check.x}\ty:${check.y}\tt${t}`);

            d = Math.sqrt(((check.x - point.x) * (check.x - point.x)) + ((check.y - point.y) * (check.y - point.y)));

            if (d < minDistance) {
                minDistance = d;
                re = {
                    'split': t,
                    'distance': d,
                    'x': check.x,
                    'y': check.y,
                };
                if (threshold && re.distance < threshold) return re;
            }
        }
        // debug(` getSplitFromXYPoint - END\n\n`);
        return re;
    }

    /**
     * Find the length of a curve, recursively
     * At small enough sizes, straight lines approximate a curve
     * @returns {number}
     */
    calculateLength() {
        // this function is only used as an approximation
        // threshold in em units

        if (this.lineType) return this.baseLength;

        let re;
        let threshold = 10;

        if (this.quickLength < threshold) {
            return this.quickLength;
        } else {
            let s = this.split();
            re = s[0].calculateLength() + s[1].calculateLength();
            return re;
        }
    }

    /**
     * Given a percent distance, return a x/y value
     * @param {number} t - between 0 and 1
     * @returns {XYPoint}
     */
    getXYPointFromSplit(t = 0.5) {
        let rs = (1 - t);
        // Do some math
        let x12 = (this.p1x * rs) + (this.p2x * t);
        let y12 = (this.p1y * rs) + (this.p2y * t);
        let x23 = (this.p2x * rs) + (this.p3x * t);
        let y23 = (this.p2y * rs) + (this.p3y * t);
        let x34 = (this.p3x * rs) + (this.p4x * t);
        let y34 = (this.p3y * rs) + (this.p4y * t);
        let x123 = (x12 * rs) + (x23 * t);
        let y123 = (y12 * rs) + (y23 * t);
        let x234 = (x23 * rs) + (x34 * t);
        let y234 = (y23 * rs) + (y34 * t);
        let x1234 = (x123 * rs) + (x234 * t);
        let y1234 = (y123 * rs) + (y234 * t);
        return new XYPoint(x1234, y1234);
    }

    /**
     * Reverses the 'winding' of this segment
     * @returns {Segment}
     */
    getReverse() {
        return new Segment({
            'p1x': this.p4x,
            'p1y': this.p4y,
            'p2x': this.p3x,
            'p2y': this.p3y,
            'p3x': this.p2x,
            'p3y': this.p2y,
            'p4x': this.p1x,
            'p4y': this.p1y,
        });
    }

    /**
     * Given a control point number, return a xy point
     * 1 - first 'PathPoint'
     * 2 - first 'Handle'
     * 3 - second 'Handle'
     * 4 - second 'PathPoint'
     * @param {number} pt - Which point to return
     * @returns {XYPoint}
     */
    getXYPoint(pt) {
        if (pt === 1) return new XYPoint(this.p1x, this.p1y);
        else if (pt === 2) return new XYPoint(this.p2x, this.p2y);
        else if (pt === 3) return new XYPoint(this.p3x, this.p3y);
        else if (pt === 4) return new XYPoint(this.p4x, this.p4y);
    }


    // --------------------------------------------------------------
    // Bounds
    // --------------------------------------------------------------

    /**
     * A Bezier Segment can never be outside the bounding box
     * created by all 4 of it's control points
     * @returns {Maxes}
     */
    getFastMaxes() {
        let bounds = {
            'xMin': Math.min(this.p1x, Math.min(this.p2x, Math.min(this.p3x, this.p4x))),
            'yMin': Math.min(this.p1y, Math.min(this.p2y, Math.min(this.p3y, this.p4y))),
            'xMax': Math.max(this.p1x, Math.max(this.p2x, Math.max(this.p3x, this.p4x))),
            'yMax': Math.max(this.p1y, Math.max(this.p2y, Math.max(this.p3y, this.p4y))),
        };
        // debug(`\t Segment.getFastMaxes - returning`);
        // debug(bounds);

        return new Maxes(bounds);
    }

    /**
     * Calculate the bounding box for this Segment
     * @returns {Maxes}
     */
    calcMaxes() {
        // debug('\n Segment.calcMaxes - START');
        // debug(this);

        /**
         * Takes a value and updates a maxes object if that value falls outside the current maxes
         * @param {Maxes} maxes - maxes object to check against
         * @param {number} value - new value that may fall outside the current maxes object
         */
        function checkXBounds(maxes, value) {
            if (maxes.xMin > value) {
                maxes.xMin = value;
            } else if (maxes.xMax < value) {
                maxes.xMax = value;
            }
        }

        /**
         * Takes a value and updates a maxes object if that value falls outside the current maxes
         * @param {Maxes} maxes - maxes object to check against
         * @param {number} value - new value that may fall outside the current maxes object
         */
        function checkYBounds(maxes, value) {
            if (maxes.yMin > value) {
                maxes.yMin = value;
            } else if (maxes.yMax < value) {
                maxes.yMax = value;
            }
        }

        /**
         * Some crazy Bezier math sh*t goin' down in this helper function
         * @param {number} t
         * @param {number} p0
         * @param {number} p1
         * @param {number} p2
         * @param {number} p3
         * @returns {number}
         */
        function getBezierValue(t, p0, p1, p2, p3) {
            let mt = (1-t);
            return (mt*mt*mt*p0) + (3*mt*mt*t*p1) + (3*mt*t*t*p2) + (t*t*t*p3);
        }

        let bounds = {
            'xMin': Math.min(this.p1x, this.p4x),
            'yMin': Math.min(this.p1y, this.p4y),
            'xMax': Math.max(this.p1x, this.p4x),
            'yMax': Math.max(this.p1y, this.p4y),
        };

        if (this.lineType) {
            this.maxes = bounds;
            // debug(this.maxes.print());
            // debug(' Segment.calcMaxes - returning fast maxes for line - END\n');
            return this.maxes;
        }

        let d1x = this.p2x - this.p1x;
        let d1y = this.p2y - this.p1y;
        let d2x = this.p3x - this.p2x;
        let d2y = this.p3y - this.p2y;
        let d3x = this.p4x - this.p3x;
        let d3y = this.p4y - this.p3y;
        let numerator;
        let denominator;
        let quadRoot;
        let root;
        let t1;
        let t2;

        // X bounds
        if (this.p2x < bounds.xMin || this.p2x > bounds.xMax || this.p3x < bounds.xMin || this.p3x > bounds.xMax) {
            if (d1x + d3x !== 2 * d2x) {
                d2x += 0.01;
            }
            numerator = 2 * (d1x - d2x);
            denominator = 2 * (d1x - 2 * d2x + d3x);
            quadRoot = (2 * d2x - 2 * d1x) * (2 * d2x - 2 * d1x) - 2 * d1x * denominator;
            root = Math.sqrt(quadRoot);
            t1 = (numerator + root) / denominator;
            t2 = (numerator - root) / denominator;
            if (0 < t1 && t1 < 1) {
                checkXBounds(bounds, getBezierValue(t1, this.p1x, this.p2x, this.p3x, this.p4x));
            }
            if (0 < t2 && t2 < 1) {
                checkXBounds(bounds, getBezierValue(t2, this.p1x, this.p2x, this.p3x, this.p4x));
            }
        }

        // Y bounds
        if (this.p2y < bounds.yMin || this.p2y > bounds.yMax || this.p3y < bounds.yMin || this.p3y > bounds.yMax) {
            if (d1y + d3y !== 2 * d2y) {
                d2y += 0.01;
            }
            numerator = 2 * (d1y - d2y);
            denominator = 2 * (d1y - 2 * d2y + d3y);
            quadRoot = (2 * d2y - 2 * d1y) * (2 * d2y - 2 * d1y) - 2 * d1y * denominator;
            root = Math.sqrt(quadRoot);
            t1 = (numerator + root) / denominator;
            t2 = (numerator - root) / denominator;
            if (0 < t1 && t1 < 1) {
                checkYBounds(bounds, getBezierValue(t1, this.p1y, this.p2y, this.p3y, this.p4y));
            }
            if (0 < t2 && t2 < 1) {
                checkYBounds(bounds, getBezierValue(t2, this.p1y, this.p2y, this.p3y, this.p4y));
            }
        }
        // debug([this.getFastMaxes(), bounds]);
        // debug(' Segment.calcMaxes - END\n');
        this.maxes = bounds;
        return this.maxes;
    }


    // --------------------------------------------------------------
    // Curve Checking
    // --------------------------------------------------------------

    /**
     * Checks to see if this (line) Segment is overlapped by
     * a larger (line) Segment.
     * Returning true basically means we can get rid of this Segment
     * @param {Segment} largeSegment - Larger segment to check against
     * @returns {boolean}
     */
    isLineOverlappedByLine(largeSegment) {
        // debug(`\n Segment.isLineOverlappedByLine - START`);

        if (!this.lineType || !largeSegment.lineType) {
            // debug(`\t this.lineType: ${this.lineType} and largeSegment.lineType: ${largeSegment.lineType}`);
            // debug(` Segment.isLineOverlappedByLine - END - returning false\n\n`);
            return false;
        }

        let c1 = largeSegment.containsPointOnLine(this.getXYPoint(1));
        let c4 = largeSegment.containsPointOnLine(this.getXYPoint(4));

        // debug(`\t this.p1 / p4 is on largeSegment: ${c1} / ${c4}`);

        // debug(` Segment.isLineOverlappedByLine - END - returning ${c1&&c4}\n\n`);
        return (c1 && c4);
    }

    /**
     * Checks to see if an x/y value is one of the points of this Segment
     * @param {XYPoint} pt - point to check
     * @param {number} threshold - how close to check
     * @returns {boolean} - kind of
     */
    containsTerminalPoint(pt, threshold = 1) {
        if (this.containsStartPoint(pt, threshold)) return 'start';
        else if (this.containsEndPoint(pt, threshold)) return 'end';
        else return false;
    }

    /**
     * Checks to see if an x/y value is the start of this Segment
     * @param {XYPoint} pt - point to check
     * @param {number} threshold - how close to check
     * @returns {boolean}
     */
    containsStartPoint(pt, threshold = 1) {
        return pointsAreEqual(this.getXYPoint(1), pt, threshold);
    }
    /**
     * Checks to see if an x/y value is the end of this Segment
     * @param {XYPoint} pt - point to check
     * @param {number} threshold - how close to check
     * @returns {boolean}
     */
    containsEndPoint(pt, threshold = 1) {
        return pointsAreEqual(this.getXYPoint(4), pt, threshold);
    }

    /**
     * Checks to see if an x/y value is anywhere on this Segment
     * @param {XYPoint} pt - point to check
     * @param {number} threshold - how close to check
     * @returns {boolean}
     */
    containsPointOnCurve(pt, threshold) {
        if (this.containsTerminalPoint(pt, threshold)) return true;

        if (this.lineType) return this.containsPointOnLine(pt);

        threshold = isVal(threshold) ? threshold : 0.1;
        let t = this.getSplitFromXYPoint(pt, threshold);

        if (t && t.distance < threshold) return true;
        else return false;
    }

    /**
     * Checks to see if an x/y value is on this Line Segment
     * @param {XYPoint} pt - point to check
     * @returns {boolean}
     */
    containsPointOnLine(pt) {
        // debug('\n Segment.containsPointOnLine - START');
        // debug('\t checking ' + pt.x + ' \t' + pt.y);
        if (!this.lineType) {
            // debug('\t this is not a line, returning false');
            return false;
        }
        if (this.containsTerminalPoint(pt)) {
            // debug('\t this segment contains the point as an end point, returning false');
            return false;
        }

        /**
         * Checks to see if a middle value is between two other values
         * @param {number} l - left point
         * @param {number} m - middle point
         * @param {number} r - right point
         * @returns {boolean}
         */
        function within(l, m, r) {
            return ((l <= m) && (m <= r)) || ((r <= m) && (m <= l));
        }

        if (within(this.p1x, pt.x, this.p4x) &&
            within(this.p1y, pt.y, this.p4y) &&
            pointsAreCollinear(this.getXYPoint(1), this.getXYPoint(4), pt)) {
            // debug('\t returning true');
            return true;
        }

        // debug('\t fallthrough returning false');
        return false;
    }

    /**
     * Checks to see if this segment's last point is another Segment's first point
     * @param {Segment} s2 - other segment to check
     * @param {number} threshold - how close to check
     * @returns {boolean}
     */
    precedes(s2, threshold = 1) {
        let s1c4 = this.getXYPoint(4);
        let s2c1 = s2.getXYPoint(1);

        return pointsAreEqual(s1c4, s2c1, threshold);
    }

    /**
     * Determines if this Segment is actually a Line Segment
     * and if so, what kind
     * @param {number} precision - how close to look
     * @returns {string}
     */
    determineLineType(precision) {
        precision = isVal(precision) ? precision : 1;
        let type = false;

        let rex = (round(this.p1x, precision) === round(this.p2x, precision) &&
            round(this.p1x, precision) === round(this.p3x, precision) &&
            round(this.p1x, precision) === round(this.p4x, precision));

        if (rex) type = 'vertical';

        let rey = (round(this.p1y, precision) === round(this.p2y, precision) &&
            round(this.p1y, precision) === round(this.p3y, precision) &&
            round(this.p1y, precision) === round(this.p4y, precision));
        if (rey) type = 'horizontal';

        let red = (pointsAreCollinear(this.getXYPoint(1), this.getXYPoint(4), this.getXYPoint(2)) &&
            pointsAreCollinear(this.getXYPoint(1), this.getXYPoint(4), this.getXYPoint(3)));
        if (red) type = 'diagonal';

        this._lineType = type;
        return type;
    }

    /**
     * Rounds all the values in this Segment
     * @param {number} precision - how many decimal places to round
     * @returns {Segment} - reference to this segment
     */
    roundAll(precision = 3) {
        this.p1x = round(this.p1x, precision);
        this.p1y = round(this.p1y, precision);
        this.p2x = round(this.p2x, precision);
        this.p2y = round(this.p2y, precision);
        this.p3x = round(this.p3x, precision);
        this.p3y = round(this.p3y, precision);
        this.p4x = round(this.p4x, precision);
        this.p4y = round(this.p4y, precision);

        return this;
    }
}


// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Find the length between two points
 * @param {number} p1x
 * @param {number} p1y
 * @param {number} p2x
 * @param {number} p2y
 * @returns {number}
 */
export function getLineLength(p1x, p1y, p2x, p2y) {
    let a = Math.abs(p1x - p2x);
    let b = Math.abs(p1y - p2y);
    let c = Math.sqrt((a * a) + (b * b));
    return c;
}

/**
 * Returns true if three points are in a straight line
 * @param {XYPoint} a - point to evaluate
 * @param {XYPoint} b - point to evaluate
 * @param {XYPoint} c - point to evaluate
 * @param {number} precision - how close to compare
 * @returns {boolean}
 */
export function pointsAreCollinear(a, b, c, precision) {
    precision = isVal(precision)? precision : 3;

    let s1 = (b.x - a.x) * (c.y - a.y);
    let s2 = (c.x - a.x) * (b.y - a.y);

    return round(s1, precision) === round(s2, precision);
}
