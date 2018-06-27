import Maxes from './maxes.js';
import Coord from './coord.js';
import {coordsAreEqual} from './coord.js';
import {clone, numSan, duplicates, isVal, round} from '../app/functions.js';

export {findSegmentIntersections, ixToCoord, segmentsAreEqual};

/**
    Object > Segment
    A Segment stores and acts on a piece of a Path
    according to the mathmatical definition of a
    Bezier curve.

    Paths in Glyphr Studio are a collection of
    Path Points, which themselves contain a point
    and two handles.  Bezier curves, on the other
    hand, are represented as two points, with two
    handles between them.

    This Segment object is basically here just to
    make Bezier math easier for Paths.
**/
export default class Segment {
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
    constructor({p1x = 0, p1y = 0, p2x = 0, p2y = 0, p3x = 0, p3y = 0, p4x = 0, p4y = 0} = {}) {
        this.p1x = numSan(p1x);
        this.p1y = numSan(p1y);
        this.p4x = numSan(p4x);
        this.p4y = numSan(p4y);
        this.p2x = isVal(p2x) ? numSan(p2x) : this.p1x;
        this.p2y = isVal(p2y) ? numSan(p2y) : this.p1y;
        this.p3x = isVal(p3x) ? numSan(p3x) : this.p3x;
        this.p3y = isVal(p3y) ? numSan(p3y) : this.p3y;

        // cache
        this.cache = {};

        this.line = this.isLine();

        this._maxes = this.calcMaxes();
    }

    /**
     * Export object to a project file
     * @return {object}
     */
    save() {
        return {
            p1x: this.p1x,
            p1y: this.p1y,
            p2x: this.p2x,
            p2y: this.p2y,
            p3x: this.p3x,
            p3y: this.p3y,
            p4x: this.p4x,
            p4y: this.p4y,
        };
    }

    /**
     * Reset the cache
     */
    changed() {
        this.cache = {};
        this.line = this.isLine();
        this._maxes = this.calcMaxes();
    }


    //    -----------------------------------
    //    Getters
    //    -----------------------------------

    /**
     * Returns the length of this curve
     */
    get length() {
        if (this.cache && this.cache.length) return this.cache.length;

        this.cache.length = this.calculateLength();

        return this.cache.length;
    }

    /**
     * Get the Maxes object for this Segment
     */
    get maxes() {
        return new Maxes(this._maxes);
    }


    //    -----------------------------------
    //    Drawing
    //    -----------------------------------

    /**
     * Draws this segment to the Edit Canvas
     * @param {string} color
     * @param {number} dx - delta offset
     * @param {number} dy - delta offset
     */
    drawSegmentOutline(color, dx, dy) {
        if (!_UI.glyphEditCTX) setupEditCanvas();

        let ctx = _UI.glyphEditCTX;
        ctx.strokeStyle = getRGBfromRGBA((color || _UI.colors.green.l65), 0.9);
        dx = dx || 0;
        dy = dy || 0;
        let p1x = sx_cx(this.p1x + dx);
        let p1y = sy_cy(this.p1y + dy);
        let p2x = sx_cx(this.p2x + dx);
        let p2y = sy_cy(this.p2y + dy);
        let p3x = sx_cx(this.p3x + dx);
        let p3y = sy_cy(this.p3y + dy);
        let p4x = sx_cx(this.p4x + dx);
        let p4y = sy_cy(this.p4y + dy);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.bezierCurveTo(p2x, p2y, p3x, p3y, p4x, p4y);
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Draws the control points for this Segment
     * @param {string} color
     * @param {string} txt - text to display at the first point
     */
    drawSegmentPoints(color, txt) {
        if (!_UI.glyphEditCTX) setupEditCanvas();

        let ctx = _UI.glyphEditCTX;
        txt = isVal(txt) ? txt : '•';
        let p1x = sx_cx(this.p1x);
        let p1y = sy_cy(this.p1y);
        let p2x = sx_cx(this.p2x);
        let p2y = sy_cy(this.p2y);
        let p3x = sx_cx(this.p3x);
        let p3y = sy_cy(this.p3y);
        let p4x = sx_cx(this.p4x);
        let p4y = sy_cy(this.p4y);
        color = getRGBfromRGBA((color || _UI.colors.green.l65), 0.4);
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
        // else draw_CircleHandle({'x':sx_cx(this.p4x), 'y':sy_cy(this.p4y)});
    }


    //    -----------------------------------
    //    Splitting
    //    -----------------------------------
    /**
     * Splits a segment at either an x/y value or a decimal %
     * @param {*} sp - decimal or x/y object
     * @return {array} - Array with two segments resulting from the split
     */
    split(sp = 0.5) {
        if (typeof sp === 'object' && isVal(sp.x) && isVal(sp.y)) {
            return this.splitAtCoord(sp);
        } else if (!isNaN(sp)) {
            return this.splitAtTime(sp);
        }
        return false;
    }

    /**
     * Splits a segment at a specific x/y position
     * @param {object} co - x/y coordinate where to split
     * @return {array} - Array with two segments resulting from the split
     */
    splitAtCoord(co) {
        // debug('\n Segment.splitAtCoord - START');
        // debug('\t splitting at ' + json(co, true));
        if (this.containsTerminalPoint(co, 0.1)) return false;

        if (this.line && this.line !== 'diagonal') {
            let newx;
            let newy;
            let online = false;
            if (this.line === 'horizontal') {
                if (round(co.y, 2) === round(this.p1y, 2)) {
                    if ((co.x > Math.min(this.p1x, this.p4x)) && (co.x < Math.max(this.p1x, this.p4x))) {
                        newx = co.x;
                        newy = this.p1y;
                        online = true;
                    }
                }
            } else if (this.line === 'vertical') {
                if (round(co.x, 2) === round(this.p1x, 2)) {
                    if ((co.y > Math.min(this.p1y, this.p4y)) && (co.y < Math.max(this.p1y, this.p4y))) {
                        newx = this.p1x;
                        newy = co.y;
                        online = true;
                    }
                }
            }
            if (!online) {
                // debug('\t not on the line');
                // debug(' Segment.splitAtCoord - END\n');
                return false;
            }
            // debug('\t returning simple line split');
            // debug(' Segment.splitAtCoord - END\n');
            return [
                new Segment({
                    'p1x': this.p1x,
                    'p1y': this.p1y,
                    'p4x': newx,
                    'p4y': newy,
                }),
                new Segment({
                    'p1x': newx,
                    'p1y': newy,
                    'p4x': this.p4x,
                    'p4y': this.p4y,
                }),
            ];
        } else if (this.pointIsWithinMaxes(co)) {
            let threshold = 0.1;
            let sp = this.getSplitFromCoord(co, threshold);
            // debug('\t distance is ' + sp.distance);
            if (sp && sp.distance < threshold) {
                // debug('\t splitting at ' + sp.split);
                return this.splitAtTime(sp.split);
            }
        }
        // debug(' Segment.splitAtCoord - returning false - END\n');
        return false;
    }

    /**
     * Splits a segment based on a decmial value ("time" is a metaphor here, from 0 to 1 second)
     * @param {number} t - decimal from 0 to 1 representing how far along the curve to split
     * @return {array} - Array with two segments resulting from the split
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
     * @param {array} coords - collection of many Coords objects where to split
     * @param {number} threshold - precision to look for a control point
     * @return {array} - Array with many segments resulting from the split
     */
    splitSegmentAtProvidedCoords(coords, threshold) {
        // debug('\n Segment.splitSegmentAtProvidedCoords - START');
        let segs = [new Segment(clone(this))];
        let tr;
        for (let x = 0; x < coords.length; x++) {
            for (let s = 0; s < segs.length; s++) {
                if (!segs[s].containsTerminalPoint(coords[x], threshold)) {
                    tr = segs[s].splitAtCoord(coords[x]);
                    if (tr) {
                        segs.splice(s, 1, tr[0], tr[1]);
                        // s++;
                        // break;
                    }
                }
            }
        }
        // debug('\t split into ' + segs.length);
        // debug(' Segment.splitSegmentAtProvidedCoords - END\n');
        return segs;
    }

    /**
     * Checks to see if a point is inside the bounding box of this Segment
     * @param {object} co - x/y point to check
     * @return {boolean}
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
     * @return {Segment}
     */
    convertToLine() {
        return new Segment({p1x: this.p1x, p1y: this.p1y, p4x: this.p4x, p4y: this.p4y});
    }

    /**
     * Given an x/y point, find the equivalent split distance t
     * @param {Coord} coord - place to look
     * @param {number} threshold - how close to look
     * @return {object} - collection of results
     */
    getSplitFromCoord(coord, threshold = 1) {
        // debug(`\n getSplitFromCoord - START`);

        let grains = this.getQuickLength() * 1000;
        let mindistance = 999999999;
        let re = false;
        let check;
        let d;

        for (let t = 0; t < 1; t += (1 / grains)) {
            check = this.getCoordFromSplit(t);
            // debug(`\t checking x:${check.x}\ty:${check.y}\tt${t}`);

            d = Math.sqrt(((check.x - coord.x) * (check.x - coord.x)) + ((check.y - coord.y) * (check.y - coord.y)));

            if (d < mindistance) {
                mindistance = d;
                re = {
                    'split': t,
                    'distance': d,
                    'x': check.x,
                    'y': check.y,
                };
                if (threshold && re.distance < threshold) return re;
            }
        }
        // debug(` getSplitFromCoord - END\n\n`);
        return re;
    }

    /**
     * Find the length of a curve, recursively
     * At small enough sizes, assume a curve is a straight line
     * @return {number}
     */
    calculateLength() {
        // this function is only used as an approximation
        // threshold in em units
        let re;
        let threshold = 10;
        let a = Math.abs(this.p1x - this.p4x);
        let b = Math.abs(this.p1y - this.p4y);
        let c = Math.sqrt((a * a) + (b * b));

        if (this.line || c < threshold) {
            this.cache.length = c;
            return c;
        } else {
            let s = this.split();
            re = s[0].calculateLength() + s[1].calculateLength();
            return re;
        }
    }

    /**
     * Find the length of a curve, in a fast/cheap way
     * Just assume a straight line between the first and last points
     * @return {number}
     */
    getQuickLength() {
        let a = Math.abs(this.p1x - this.p4x);
        let b = Math.abs(this.p1y - this.p4y);
        let c = Math.sqrt((a * a) + (b * b));
        return c;
    }

    /**
     * Given a percent distance, return a x/y value
     * @param {number} t - between 0 and 1
     * @return {Coord}
     */
    getCoordFromSplit(t = 0.5) {
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
        return new Coord({'x': x1234, 'y': y1234});
    }

    /**
     * Reverses the 'winding' of this segment
     * @return {Segment}
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
     * Given a control point number, return a Coord
     * 1 - first 'PathPoint'
     * 2 - first 'Handle'
     * 3 - second 'Handle'
     * 4 - second 'PathPoint'
     * @param {number} pt - Which point to return
     * @return {Coord}
     */
    getCoord(pt) {
        if (pt === 1) return new Coord({x: this.p1x, y: this.p1y});
        else if (pt === 2) return new Coord({x: this.p2x, y: this.p2y});
        else if (pt === 3) return new Coord({x: this.p3x, y: this.p3y});
        else if (pt === 4) return new Coord({x: this.p4x, y: this.p4y});
    }


    //    -----------------------------------
    //    Bounds
    //    -----------------------------------

    /**
     * A Bezier Segment can never be outside the bounding box
     * created by all 4 of it's control points
     * @return {Maxes}
     */
    getFastMaxes() {
        let bounds = {
            'xMin': Math.min(this.p1x, Math.min(this.p2x, Math.min(this.p3x, this.p4x))),
            'yMin': Math.min(this.p1y, Math.min(this.p2y, Math.min(this.p3y, this.p4y))),
            'xMax': Math.max(this.p1x, Math.max(this.p2x, Math.max(this.p3x, this.p4x))),
            'yMax': Math.max(this.p1y, Math.max(this.p2y, Math.max(this.p3y, this.p4y))),
        };
        return new Maxes(bounds);
    }

    /**
     * Calculate the bounding box for this Segment
     * @return {Maxes}
     */
    calcMaxes() {
        // debug('\n Segment.calcMaxes - START');
        // debug(this);

        /**
         * Takes a value and updates a maxes object if that value falls outside the current maxes
         * @param {Maxes} maxes - maxes object to check against
         * @param {number} value - new value that may fall outside the current maxes object
         */
        function checkXbounds(maxes, value) {
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
        function checkYbounds(maxes, value) {
            if (maxes.yMin > value) {
                maxes.yMin = value;
            } else if (maxes.yMax < value) {
                maxes.yMax = value;
            }
        }

        /**
         * Some crazy Bezier math sh*t goin' down in this helper funciton
         * @param {number} t
         * @param {number} p0
         * @param {number} p1
         * @param {number} p2
         * @param {number} p3
         * @return {number}
         */
        function getBezierValue(t, p0, p1, p2, p3) {
            let mt = (1-t);
            return (mt*mt*mt*p0) + (3*mt*mt*t*p1) + (3*mt*t*t*p2) + (t*t*t*p3);
        }

        let bounds = new Maxes({
            'xMin': Math.min(this.p1x, this.p4x),
            'yMin': Math.min(this.p1y, this.p4y),
            'xMax': Math.max(this.p1x, this.p4x),
            'yMax': Math.max(this.p1y, this.p4y),
        });

        if (this.line) {
            // debug([bounds]);
            // debug(' Segment.calcMaxes - returning fastmaxes for line - END\n');
            return bounds;
        }

        let d1x = this.p2x - this.p1x;
        let d1y = this.p2y - this.p1y;
        let d2x = this.p3x - this.p2x;
        let d2y = this.p3y - this.p2y;
        let d3x = this.p4x - this.p3x;
        let d3y = this.p4y - this.p3y;
        let numerator;
        let denominator;
        let quadroot;
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
            quadroot = (2 * d2x - 2 * d1x) * (2 * d2x - 2 * d1x) - 2 * d1x * denominator;
            root = Math.sqrt(quadroot);
            t1 = (numerator + root) / denominator;
            t2 = (numerator - root) / denominator;
            if (0 < t1 && t1 < 1) {
                checkXbounds(bounds, getBezierValue(t1, this.p1x, this.p2x, this.p3x, this.p4x));
            }
            if (0 < t2 && t2 < 1) {
                checkXbounds(bounds, getBezierValue(t2, this.p1x, this.p2x, this.p3x, this.p4x));
            }
        }

        // Y bounds
        if (this.p2y < bounds.yMin || this.p2y > bounds.yMax || this.p3y < bounds.yMin || this.p3y > bounds.yMax) {
            if (d1y + d3y !== 2 * d2y) {
                d2y += 0.01;
            }
            numerator = 2 * (d1y - d2y);
            denominator = 2 * (d1y - 2 * d2y + d3y);
            quadroot = (2 * d2y - 2 * d1y) * (2 * d2y - 2 * d1y) - 2 * d1y * denominator;
            root = Math.sqrt(quadroot);
            t1 = (numerator + root) / denominator;
            t2 = (numerator - root) / denominator;
            if (0 < t1 && t1 < 1) {
                checkYbounds(bounds, getBezierValue(t1, this.p1y, this.p2y, this.p3y, this.p4y));
            }
            if (0 < t2 && t2 < 1) {
                checkYbounds(bounds, getBezierValue(t2, this.p1y, this.p2y, this.p3y, this.p4y));
            }
        }
        // debug([this.getFastMaxes(), bounds]);
        // debug(' Segment.calcMaxes - END\n');
        return new Maxes(bounds);
    }


    //    -----------------------------------
    //    Curve Checking
    //    -----------------------------------

    /**
     * A segment is redundant to another segment if
     * it is completely overlapped by the other segment
     * @param {Segment} s - segment to check against this segment
     * @return {boolean}
     */
    isRedundantTo(s) {
        if (!this.line) return false;
        return (s.containsPointOnLine(this.getCoord(1)) && s.containsPointOnLine(this.getCoord(4)));
    }

    /**
     * Checks to see if an x/y value is one of the points of this Segment
     * @param {Coord} pt - point to check
     * @param {number} threshold - how close to check
     * @return {boolean} - kind of
     */
    containsTerminalPoint(pt, threshold = 1) {
        if (this.containsStartPoint(pt, threshold)) return 'start';
        else if (this.containsEndPoint(pt, threshold)) return 'end';
        else return false;
    }

    /**
     * Checks to see if an x/y value is the start of this Segment
     * @param {Coord} pt - point to check
     * @param {number} threshold - how close to check
     * @return {boolean}
     */
    containsStartPoint(pt, threshold = 1) {
        return coordsAreEqual(this.getCoord(1), pt, threshold);
    }
    /**
     * Checks to see if an x/y value is the end of this Segment
     * @param {Coord} pt - point to check
     * @param {number} threshold - how close to check
     * @return {boolean}
     */
    containsEndPoint(pt, threshold = 1) {
        return coordsAreEqual(this.getCoord(4), pt, threshold);
    }

    /**
     * Checks to see if an x/y value is anywhere on this Segment
     * @param {Coord} pt - point to check
     * @param {number} threshold - how close to check
     * @return {boolean}
     */
    containsPointOnCurve(pt, threshold) {
        if (this.containsTerminalPoint(pt, threshold)) return true;

        if (this.line) return this.containsPointOnLine(pt);

        threshold = isVal(threshold) ? threshold : 0.1;
        let t = this.getSplitFromCoord(pt, threshold);

        if (t && t.distance < threshold) return true;
        else return false;
    }

    /**
     * Checks to see if an x/y value is on this Line Segment
     * @param {Coord} pt - point to check
     * @return {boolean}
     */
    containsPointOnLine(pt) {
        // debug('\n Segment.containsPointOnLine - START');
        // debug('\t checking ' + pt.x + ' \t' + pt.y);
        if (!this.line) {
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
         * @return {boolean}
         */
        function within(l, m, r) {
            return ((l <= m) && (m <= r)) || ((r <= m) && (m <= l));
        }

        if (within(this.p1x, pt.x, this.p4x) &&
            within(this.p1y, pt.y, this.p4y) &&
            pointsAreCollinear(this.getCoord(1), this.getCoord(4), pt)) {
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
     * @return {boolean}
     */
    preceeds(s2, threshold = 1) {
        return (coordsAreEqual(this.getCoord(4)), s2.getCoord(1), threshold);
    }

    /**
     * Determines if this Segment is actually a Line Segment
     * and if so, what kind
     * @param {number} precision - how close to look
     * @return {string}
     */
    isLine(precision) {
        precision = isVal(precision) ? precision : 1;
        let rex = (round(this.p1x, precision) === round(this.p2x, precision) &&
            round(this.p1x, precision) === round(this.p3x, precision) &&
            round(this.p1x, precision) === round(this.p4x, precision));

        if (rex) return 'vertical';

        let rey = (round(this.p1y, precision) === round(this.p2y, precision) &&
            round(this.p1y, precision) === round(this.p3y, precision) &&
            round(this.p1y, precision) === round(this.p4y, precision));
        if (rey) return 'horizontal';

        let red = (pointsAreCollinear(this.getCoord(1), this.getCoord(4), this.getCoord(2)) &&
            pointsAreCollinear(this.getCoord(1), this.getCoord(4), this.getCoord(3)));
        if (red) return 'diagonal';

        return false;
    }

    /**
     * Creates a string representation of this Segment
     * @param {number} precision - how far to round
     * @return {string}
     */
    toString(precision) {
        precision = isVal(precision) ? precision : 1;
        re = '';
        re += round(this.p1x, precision) + '\t' + round(this.p1y, precision) + '\n';
        // re += round(this.p2x, precision) + '\t' + round(this.p2y, precision) + '\n';
        // re += round(this.p3x, precision) + '\t' + round(this.p3y, precision) + '\n';
        re += round(this.p4x, precision) + '\t' + round(this.p4y, precision) + '\n';
        return re;
    }

    /**
     * Rounds all the values in this Segment
     * @param {number} precision - how many decimal places to round
     */
    roundAll(precision) {
        precision = isVal(precision) ? precision : 3;
        this.p1x = roundAll(this.p1x, precision);
        this.p1y = roundAll(this.p1y, precision);
        this.p2x = roundAll(this.p2x, precision);
        this.p2y = roundAll(this.p2y, precision);
        this.p3x = roundAll(this.p3x, precision);
        this.p3y = roundAll(this.p3y, precision);
        this.p4x = roundAll(this.p4x, precision);
        this.p4y = roundAll(this.p4y, precision);
    }
}


//    -----------------------------------
//    Curve Intersections
//    -----------------------------------

/**
 * Find all places where two segments cross eachother
 * This is a recursive algorithm
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @param {number} depth - How deep this recursive call has gone
 * @return {array} - collection of overlap points in ix format (text: 'x/y,x/y,x/y...')
 */
function findSegmentIntersections(s1, s2, depth) {
    // debug('\n findSegmentIntersections - START');
    depth = depth || 0;
    // debug('\t depth ' + depth);


    // if(depth > 15) {
        // debug('\t fINDsEGMENTiNTERSECTIONS debug early return');
    //     return [];
    // }
    // s1.drawSegmentOutline();
    // s2.drawSegmentOutline();


    // Check for overlapping / coincident segments
    if (depth === 0) {
        let co = findOverlappingLineSegmentIntersections(s1, s2);
        if (co.length) {
            // debug('\t found overlapping line ' + co[0]);
                return co;
        }
    }

    // If both segments are lines, check for intersection
    if (depth === 0) {
        let cr = findCrossingLineSegmentIntersections(s1, s2);
        if (cr.length) {
            // debug('\t found cross line ' + cr[0]);
            return cr;
        }
    }

    // Edge case, find end points overlapping the other segment
    let endpoints = [];
    if (depth===0 && (s1.line || s2.line)) {
        // findEndPointSegmentIntersections is a perf hit
        // only run if either s1 or s2 is a line segment
        endpoints = findEndPointSegmentIntersections(s1, s2);
    }

    // Check to stop recursion
    let s1m = s1.getFastMaxes();
    let s2m = s2.getFastMaxes();

    if (!maxesOverlap(s1m, s2m)) {
        // debug('\t segments have non overlapping fastmaxes');
        return [];
    }
    // debug('\t segments fastmaxes overlap');
    // debug([s1m]);
    // debug([s2m]);

    // Complex segment intersections
    let threshold = 0.00005;
    let precision = 3;

    let s1w = (s1m.xMax - s1m.xMin);
    let s1h = (s1m.yMax - s1m.yMin);
    let s2w = (s2m.xMax - s2m.xMin);
    let s2h = (s2m.yMax - s2m.yMin);
    // debug('\t s1 w/h: ' + s1w + ' / ' + s1h);
    // debug('\t s2 w/h: ' + s2w + ' / ' + s2h);

    if ( (s1w < threshold) &&
        (s1h < threshold) &&
        (s2w < threshold) &&
        (s2h < threshold) ) {
            s1w *= 0.5;
            s1h *= 0.5;
            s2w *= 0.5;
            s2h *= 0.5;
            let x = ((s1m.xMin + s1w) + (s2m.xMin + s2w)) / 2;
            let y = ((s1m.yMin + s1h) + (s2m.yMin + s2h)) / 2;

            x = round(x, precision);
            y = round(y, precision);

            let ix = ''+x+'/'+y;
            // debug('\t <<<<<<<<<<<<<<<<< hit bottom, found ' + ix);
            return [ix];
    } else {
        // debug('\t not below threshold at ' + depth);
    }

    // More recursion needed
    let re = [];
    let s1split = s1.splitAtTime(0.5);
    let s2split = s2.splitAtTime(0.5);
    let pairs = [
        [s1split[0], s2split[0]],
        [s1split[0], s2split[1]],
        [s1split[1], s2split[1]],
        [s1split[1], s2split[0]],
    ];

    pairs = pairs.filter(function(p) {
        return maxesOverlap(p[0].getFastMaxes(), p[1].getFastMaxes(), 'inclusive');
    });

    // debug('\t ' + pairs.length + ' pairs after maxes overlap filter');
    // debug(pairs);

    pairs.forEach(function(p) {
        re = re.concat( findSegmentIntersections(p[0], p[1], depth+1) );
    });

    re = re.concat(endpoints);
    re = re.filter(duplicates);

    // if(depth === 0) alert('break');

    // debug('\t return length ' + re.length);
    // debug(' findSegmentIntersections - END\n');
    return re;
}

/**
 * Checks a segment's points to see of two segments are equal
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @param {number} threshold - precision
 * @return {boolean}
 */
function segmentsAreEqual(s1, s2, threshold) {
    // debug('\n segmentsAreEqual - START');
    threshold = threshold || 1;
    // debug([s1, s2]);

    if ( coordsAreEqual(s1.getCoord(1), s2.getCoord(1), threshold) &&
        coordsAreEqual(s1.getCoord(4), s2.getCoord(4), threshold) ) {
        if (s1.line && s2.line) {
            // debug(' segmentsAreEqual - returning LINE true - END\n');
            return true;
        } else if ( coordsAreEqual(s1.getCoord(2), s2.getCoord(2), threshold) &&
                    coordsAreEqual(s1.getCoord(3), s2.getCoord(3), threshold) ) {
            // debug(' segmentsAreEqual - returning FULLY true - END\n');
            return true;
        }
    }

    // debug(' segmentsAreEqual - returning false - END\n');
    return false;
}

/**
 * Check if the two segments are overlapping horizontal or vertical lines
 * If so, just return one point from the coincident lines
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @return {array} - collection of overlaps in ix format
 */
function findOverlappingLineSegmentIntersections(s1, s2) {
    let re = [];

    if (s1.containsPointOnLine(s2.getCoord(1))) re.push(''+s2.p1x+'/'+s2.p1y);
    if (s1.containsPointOnLine(s2.getCoord(4))) re.push(''+s2.p4x+'/'+s2.p4y);

    if (s2.containsPointOnLine(s1.getCoord(1))) re.push(''+s1.p1x+'/'+s1.p1y);
    if (s2.containsPointOnLine(s1.getCoord(4))) re.push(''+s1.p4x+'/'+s1.p4y);

    if (re.length) {
        // debug('\n findOverlappingLineSegmentIntersections - START');
        // debug([s1, s2]);
        // debug(json(re));
        // debug(' findOverlappingLineSegmentIntersections - END\n');
    }

    return re;
}

/**
 * Find overlap points for Segments that are Lines (no curves)
 * This is much faster than comparing two curves
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @return {array} - overlap point in ix format
 */
function findCrossingLineSegmentIntersections(s1, s2) {
    // debug('\n findCrossingLineSegmentIntersections - START');
    if (!s1.line || !s2.line) return [];

    let d1x = s1.p4x - s1.p1x;
    let d1y = s1.p4y - s1.p1y;
    let d2x = s2.p4x - s2.p1x;
    let d2y = s2.p4y - s2.p1y;

    let s = ((-1*d1y) * (s1.p1x - s2.p1x) + d1x * (s1.p1y - s2.p1y)) / ((-1*d2x) * d1y + d1x * d2y);
    let t = ( d2x * (s1.p1y - s2.p1y) - d2y * (s1.p1x - s2.p1x)) / ((-1*d2x) * d1y + d1x * d2y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        let rx = numSan(s1.p1x + (t * d1x));
        let ry = numSan(s1.p1y + (t * d1y));

        // debug('\t found ' + rx + ', ' + ry);
        if (s1.containsTerminalPoint({x: rx, y: ry}) && s2.containsTerminalPoint({x: rx, y: ry})) {
            // debug('\t its an end point');
            // debug(' findCrossingLineSegmentIntersections - END\n');
            return [];
        }


        let re = [(''+rx+'/'+ry)];
        // debug(' findCrossingLineSegmentIntersections - END\n');
        return re;
    }

    // debug(' findCrossingLineSegmentIntersections - END\n');
    return [];
}

/**
 * Finds if two segments overlap in their end points
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @return {array} - collection of overlaps in ix format
 */
function findEndPointSegmentIntersections(s1, s2) {
    // debug('\n findEndPointSegmentIntersections - START');
    let s1s = s1.getCoord(1);
    let s1e = s1.getCoord(4);
    let s2s = s2.getCoord(1);
    let s2e = s2.getCoord(4);

    let re = [];

    if (s1.containsPointOnCurve(s2s)) re.push(coordToIx(s2s));
    if (s1.containsPointOnCurve(s2e)) re.push(coordToIx(s2e));
    if (s2.containsPointOnCurve(s1s)) re.push(coordToIx(s1s));
    if (s2.containsPointOnCurve(s1e)) re.push(coordToIx(s1e));

    // debug('\t returning ' + re);
    // debug(' findEndPointSegmentIntersections - END\n');
    return re;
}

/**
 * Takes the string ix format for a point and returns a Coord
 * @param {string} ix - x/y value in text string format
 * @return {Coord}
 */
function ixToCoord(ix) {
    // debug('\n ixToCoord - START');
    // debug(ix);
    let re = {
        x: parseFloat(ix.split('/')[0]),
        y: parseFloat(ix.split('/')[1]),
    };
    // debug([re]);
    // debug(' ixToCoord - END\n');
    return new Coord(re);
}

/**
 * Converts a Coord to a string in ix format
 * @param {Coord} co - x y object to convert
 * @return {string}
 */
function coordToIx(co) {
    return (''+co.x+'/'+co.y);
}

/**
 * Returns true if three points are in a straight line
 * @param {Coord} a - poitn to evaluate
 * @param {Coord} b - poitn to evaluate
 * @param {Coord} c - poitn to evaluate
 * @param {number} precision - how close to compare
 * @return {boolean}
 */
function pointsAreCollinear(a, b, c, precision) {
    precision = isVal(precision)? precision : 3;

    let s1 = (b.x - a.x) * (c.y - a.y);
    let s2 = (c.x - a.x) * (b.y - a.y);

    return round(s1, precision) === round(s2, precision);
}
