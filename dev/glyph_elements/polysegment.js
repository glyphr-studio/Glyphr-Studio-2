import GlyphElement from './glyphelement.js';
import XYPoint from './xypoint.js';
import Segment from './segment.js';
import Path from './path.js';
import PathPoint from './pathpoint.js';
import {maxesOverlap} from './maxes.js';
import {duplicates, clone, pointsAreEqual, round, numSan} from '../app/functions.js';
import {sXcX, sYcY} from '../edit_canvas/edit_canvas.js';

/**
 * Glyph Element > Poly Segment
 * A Poly Segment (aka poly bezier) stores a
 * series of Segments that represent a Path.

 * Paths in Glyphr Studio are a collection of
 * Path Points, which themselves contain a point
 * and two handles.  Bezier curves, on the other
 * hand, are represented as two points, with two
 * handles between them.

 * This PolySegment object is basically here just
 * to make Bezier math easier for Paths.
 */
export default class PolySegment extends GlyphElement {
    /**
     * Make a PolySegment
     * @param {Array} segments
     */
    constructor({segments = []} = {}) {
        super();
        this.segments = segments;
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
            segments: [],
        };

        for (let s = 0; s < this._segments.length; s++) {
            re.segments[s] = this._segments[s].save(verbose);
        }

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

        let re = `${ind}{PolySegment\n`;
        ind += '  ';

        re += `${ind}segments: [\n`;
        this.segments.forEach((seg) => {
            re += seg.print(level+2);
            re += `\n`;
        });
        re += `${ind}]\n`;

        re += `${ind.substring(2)}}`;

        return re;
    }

    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * get the Segments array
     * @returns {array}
     */
    get segments() {
        return this._segments;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * set the Segments array
     * @param {array} segments
     */
    set segments(segments = []) {
        this._segments = [];
        for (let s = 0; s < segments.length; s++) {
            this._segments[s] = new Segment(segments[s]);
        }
    }


    // --------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------

    /**
     * Draw this PolySegment with random colors for each segment
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     */
    drawPolySegmentOutline(dx, dy) {
        let c;
        for (let s = 0; s < this._segments.length; s++) {
            c = makeRandomSaturatedColor();
            this._segments[s].drawSegmentOutline(c, dx, dy);
        }
    }

    /**
     * Draw all the control points
     */
    drawPolySegmentPoints() {
        this._segments.forEach(function(v, i) {
            v.drawSegmentPoints(false, i);
        });
    }

    /**
     * Slowly draw each segment
     * @param {number} delay - ms delay
     */
    slowlyDrawSegments(delay = 600) {
        // debug('\n PolySegment.slowlyDrawSegments - START');
        // debug(this._segments);
        currentSegment = 0;
        segments = this._segments;

        /** Draw one segment */
        function ds() {
            if (currentSegment < segments.length) {
                segments[currentSegment].drawSegmentOutline();
                segments[currentSegment].drawSegmentPoints('red', currentSegment);
                currentSegment++;
                setTimeout(ds, delay);
            } else {
                // debug(' PolySegment.slowlyDrawSegments - END\n');
            }
        }
        setTimeout(ds, delay);
    }

    /**
     * Convert this PolySegment to a Path
     * @returns {Path}
     */
    getPath() {
        // debug('\n PolySegment.getPath - START');
        // debug(this._segments);

        /**
         * Creates a single Point from two segments
         * @param {Segment} seg1 - First segment
         * @param {Segment} seg2 - Second segment
         * @returns {PathPoint}
         */
        function makePathPointFromSegments(seg1, seg2) {
            let newPP = {
                h1: {point: {x: seg1.p3x, y: seg1.p3y}},
                p: {point: {x: seg2.p1x, y: seg2.p1y}},
                h2: {point: {x: seg2.p2x, y: seg2.p2y}},
            };

            if (seg1.line || pointsAreEqual(newPP.h1, newPP.p)) newPP.h1.use = false;
            if (seg2.line || pointsAreEqual(newPP.h2, newPP.p)) newPP.h2.use = false;

            // newPP.resolvePointType();

            return newPP;
        }

        let pp = [];
        let segments = clone(this._segments);

        // Connect the first / last point if not already
        let firstP = new XYPoint(segments[0].p1x, segments[0].p1y);
        let lastP = new XYPoint(segments[segments.length-1].p4x, segments[segments.length-1].p4y);
        if (!pointsAreEqual(firstP, lastP)) {
            segments.push(new Segment({p1x: lastP.x, p1y: lastP.y, p4x: firstP.x, p4y: firstP.y}));
        }

        // Fencepost make the first PathPoint
        pp.push(makePathPointFromSegments(segments[segments.length - 1], segments[0]));

        // Loop through Segments and create PathPoints
        let ns;
        for (let s = 0; s < segments.length - 1; s++) {
            ns = segments[s + 1];
            pp.push(makePathPointFromSegments(segments[s], ns));
        }

        // debug(pp);
        // debug(' PolySegment.getPath - END\n');
        return {pathPoints: pp};
    }

    /**
     * Search to see if a Segment is in this PolySegment
     * @param {Segment} seg - to look for
     * @returns {boolean}
     */
    containsSegment(seg) {
        for (let s = 0; s < this._segments.length; s++) {
            if (segmentsAreEqual(this._segments[s], seg)) return true;
        }
        return false;
    }

    /**
     * Round all the Segment values
     * @param {number} precision - decimal places
     * @returns {PolySegment}
     */
    roundAll(precision = 3) {
        for (let s = 0; s < this._segments.length; s++) {
            this._segments[s].roundAll(precision);
        }

        return this;
    }


    // --------------------------------------------------------------
    // Intersections
    // --------------------------------------------------------------

    /**
     * Finds all the intersections between segments
     * @returns {array} - collection of intersections in ix format
     */
    findIntersections() {
        // debug('\n PolySegment.findIntersections - START');
        // debug('\t ' + this._segments.length + ' segments');
        let s1;
        let s2;
        let ix = [];
        for (let i = 0; i < this._segments.length; i++) {
            for (let j = i; j < this._segments.length; j++) {
                if (j !== i) {
                    s1 = new Segment(this._segments[i]);
                    s2 = new Segment(this._segments[j]);
                    ix = ix.concat(findSegmentIntersections(s1, s2));
                }
            }
        }
        // debug(ix);
        ix = ix.filter(duplicates);
        // debug('\t found ' + ix.length + ' ix');
        // debug(ix);
        // debug(' PolySegment.findIntersections - END\n');
        return ix;
    }

    /**
     * Draws all the intersections between segments
     * @param {object} ctx - canvas context
     * @param {string} color
     */
    drawIntersections(ctx, color = 'rgb(200, 50, 60)') {
        // debug('\n PolySegment.drawIntersections - START');
        let ix = this.findIntersections();
        let co;
        ctx.fillStyle = color;
        ix.forEach(function(v, i) {
            ix[i] = new XYPoint(...v.split('/'));
            co = ix[i];
            ctx.fillRect(sXcX(co.x), sYcY(co.y), 5, 5);
        });
        // debug(ix);
        // debug(' PolySegment.drawIntersections - END\n');
    }

    /**
     * Takes a collection of intersections, and splits all the applicable
     * segments at those points
     * @param {array} ixArray - array of intersections in ix format
     * @param {number} threshold - how closely to look and split
     * @returns {PolySegment}
     */
    splitSegmentsAtIntersections(ixArray = this.findIntersections(), threshold) {
        // debug('\n PolySegment.splitSegmentsAtIntersections - START');
        // debug('\t before length ' + this._segments.length);
        // debug(this.print());
        // debug(`\t ixArray ${typeof ixArray} ${JSON.stringify(ixArray)}`);

        let x;
        let y;
        ixArray.forEach(function(v, i) {
            x = v.split('/')[0];
            y = v.split('/')[1];
            ixArray[i] = new XYPoint(x, y);
        });

        // debug(`\t ixArray ${typeof ixArray} ${JSON.stringify(ixArray)}`);

        let result = [];
        for (let s = 0; s < this._segments.length; s++) {
            result = result.concat(this._segments[s].splitAtManyPoints(ixArray, threshold));
        }
        this._segments = result;
        // debug('\t afters length ' + this._segments.length);
        // debug(this.print());
        // debug(' PolySegment.splitSegmentsAtIntersections - END\n');
        return this;
    }

    /**
     * Takes all the segments and orders them based on their
     * starting and ending points
     * @returns {array} - Returns a collection of *PolySegments*
     */
    stitchSegmentsTogether() {
        // debug('\n PolySegment.stitchSegmentsTogether - START');
        let source = new PolySegment(this).segments;
        let sorted = [];
        let result = [];

        /**
         * Looks for a segment with a provided starting point
         * @param {XYPoint} co - starting point to look for
         * @returns {Segment}
         */
        function getSegmentStartingAt(co) {
            let ts;
            let re;
            for (let s = 0; s < source.length; s++) {
                ts = source[s];
                if (ts.objType === 'Segment') {
                    if (ts.containsStartPoint(co, 0)) {
                        re = new Segment(ts);
                        ts.objType = '-' + result.length + '.' + sorted.length;
                        return re;
                    }
                }
            }
            // if not, try all the segments reversed
            for (let r = 0; r < source.length; r++) {
                ts = source[r].getReverse();
                if (source[r].objType === 'Segment') {
                    if (ts.containsStartPoint(co, 0)) {
                        re = new Segment(ts);
                        source[r].objType = 'R' + result.length + '.' + sorted.length;
                        return re;
                    }
                }
            }
            return false;
        }

        /**
         * Get the next unsorted segment's first point
         * @returns {XYPoint}
         */
        function getNextUnusedSegmentP1() {
            for (let s = 0; s < source.length; s++) {
                if (source[s].objType === 'Segment') {
                    return source[s].getXYPoint(1);
                }
            }
        }


        // Start ordering
        let resultSegment;
        let nextCoord = getNextUnusedSegmentP1();
        // debug('\t starting loop');
        // debug([nextCoord]);
        // debug('\t source.length ' + source.length);
        for (let i = 0; i < source.length; i++) {
            resultSegment = getSegmentStartingAt(nextCoord);
            if (resultSegment) {
                // debug('\t LOOP ' + i + ' added a segment,  ' + result.length + '.' + sorted.length);
                sorted.push(resultSegment);
                nextCoord = resultSegment.getXYPoint(4);
            } else {
                // debug('\t LOOP ' + i + ' NO NEXT SEGMENT FOUND');
                if (sorted.length) {
                    result.push(new PolySegment({segments: sorted}));
                    if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getXYPoint(1))) {
                        // debug('\t\t Pushed sorted PolySegment, connected nicely');
                    } else {
                        // debug('\t\t Pushed sorted PolySegment, OPEN LOOP');
                    }
                    sorted = [];
                    nextCoord = getNextUnusedSegmentP1();
                    i--;
                }
            }
        }

        // Fencepost
        if (sorted.length) {
            // debug('\t FINISHING');
            result.push(new PolySegment({segments: sorted}));
            if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getXYPoint(1))) {
                // debug('\t\t Pushed sorted PolySegment, connected nicely');
            } else {
                // debug('\t\t Pushed sorted PolySegment, OPEN LOOP');
            }
        }
        // debug('\t result');
        // debug(result);
        // result.forEach(function(v, i) {
            // debug('\n\t RETURNING ' + i);
            // debug(v.segments);
        // });
        // debug(' PolySegment.stitchSegmentsTogether - END\n');

        return result;
    }


    // --------------------------------------------------------------
    // Segment Filtering
    // --------------------------------------------------------------

    /**
     * Removes all the zero length segments
     * @returns {PolySegment}
     */
    removeZeroLengthSegments() {
        // debug('\n PolySegment.removeZeroLengthSegments - START');

        let currSeg;
        for (let s = 0; s < this._segments.length; s++) {
            currSeg = this._segments[s];
            if (pointsAreEqual(currSeg.getXYPoint(1), currSeg.getXYPoint(4))) {
                if (currSeg.line) {
                    currSeg.objType = 'LINE ZERO';
                } else if (
                    pointsAreEqual(currSeg.getXYPoint(1), currSeg.getXYPoint(2)) &&
                    pointsAreEqual(currSeg.getXYPoint(1), currSeg.getXYPoint(3))
                ) {
                    currSeg.objType = 'ZERO';
                }
            }
        }

        // debug(this.print());
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'Segment';
        });
        // debug(' PolySegment.removeZeroLengthSegments - END\n');

        return this;
    }

    /**
     * Removes all line segments that are overlapped
     * by larger line segments
     * @returns {PolySegment}
     */
    removeRedundantLineSegments() {
        // debug('\n PolySegment.removeRedundantLineSegments - START');
        for (let s = 0; s < this._segments.length; s++) {
            for (let t = 0; t < this._segments.length; t++) {
                if (s !== t && this._segments[s] && this._segments[t]) {
                    // try one way
                    if (this._segments[s].isLineOverlappedByLine(this._segments[t])) {
                        this._segments[s].objType = 'REDUNDANT';
                    }
                    // try other way
                    if (this._segments[t].isLineOverlappedByLine(this._segments[s])) {
                        this._segments[t].objType = 'REDUNDANT';
                    }
                }
                // debug(`\t Seg ${s} ${this._segments[s].objType}`);
            }
        }

        this._segments = this._segments.filter(function(v) {
            return v.objType === 'Segment';
        });
        // debug(' PolySegment.removeRedundantLineSegments - END\n');

        return this;
    }

    /**
     * Removes all duplicate segments
     * @returns {PolySegment}
     */
    removeDuplicateSegments() {
        // debug('\n PolySegment.removeDuplicateSegments - START');
        for (let x = 0; x < this._segments.length; x++) {
            for (let y = x; y < this._segments.length; y++) {
                if (x !== y && this._segments[x] && this._segments[y]) {
                    if (segmentsAreEqual(this._segments[x], this._segments[y])) {
                        this._segments[y].objType = 'DUPE';
                    }

                    if (segmentsAreEqual(this._segments[x], this._segments[y].getReverse())) {
                        this._segments[y].objType = 'REVERSE';
                    }
                }
            }
        }

        // debug(this._segments);
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'Segment';
        });
        // debug(' PolySegment.removeDuplicateSegments - END\n');

        return this;
    }

    /**
     * Removes all the segments that overlap a provided shape
     * @param {Shape} shape
     * @returns {PolySegment}
     */
    removeSegmentsOverlappingShape(shape) {
        // debug('\n PolySegment.removeSegmentsOverlappingShape - START');
        // debug('\t segments starting as ' + this._segments.length);
        // debug(this._segments);
        let pt = 3;
        let tx;
        let ty;

        /**
         * Finds out if a segment overlaps a shape
         * @param {Segment} seg - segment to test
         * @param {array} split
         * @param {Shape} shape - shape to test
         * @returns {boolean}
         */
        function testForHit(seg, split, shape) {
            split = seg.splitAtTime(split);
            tx = split[0].p4x;
            ty = split[0].p4y;
            // Big hit detection, to miss border paths
            // var re = shape.isHere(sXcX(tx), sYcY(ty)) &&
            // shape.isHere(sXcX(tx), sYcY(ty + pt)) &&
            // shape.isHere(sXcX(tx), sYcY(ty - pt)) &&
            // shape.isHere(sXcX(tx + pt), sYcY(ty)) &&
            // shape.isHere(sXcX(tx - pt), sYcY(ty));
            // if (re) alert('HIT ' + tx + ', ' + ty);

            if (!shape.isHere(sXcX(tx), sYcY(ty + pt))) return false;

            if (!shape.isHere(sXcX(tx), sYcY(ty - pt))) return false;

            if (!shape.isHere(sXcX(tx + pt), sYcY(ty))) return false;

            if (!shape.isHere(sXcX(tx - pt), sYcY(ty))) return false;

            if (!shape.isHere(sXcX(tx), sYcY(ty))) return false;

            return true;
        }

        for (let s = 0; s < this._segments.length; s++) {
            if (testForHit(this._segments[s], 0.33, shape) && testForHit(this._segments[s], 0.66, shape)) {
                // this._segments[s].drawSegmentPoints('rgb(255,0,0)', s);
                this._segments[s].objType = 'HIT';
            } else {
                // this._segments[s].drawSegmentPoints('rgb(0,255,0)', s);
            }
        }

        // debug(this._segments);
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'Segment';
        });
        // alert('removeSegmentsOverlappingShape - hits and misses');

        return this;
        // debug(' PolySegment.removeSegmentsOverlappingShape - END\n');
    }

    /**
     * Removes all segments not 'connected' to other segments
     * @returns {PolySegment}
     */
    removeNonConnectingSegments() {
        // debug('\n PolySegment.removeNonConnectingSegments - START');
        let test;
        let against;
        let connected1 = [];
        let connected4 = [];
        let threshold = 1;
        for (let t = 0; t < this._segments.length; t++) {
            // debug('\t testing segment ' + t);
            test = this._segments[t];
            connected1[t] = false;
            connected4[t] = false;
            for (let a = 0; a < this._segments.length; a++) {
                against = this._segments[a];
                // if(t !== a && against.objType === 'Segment'){
                if (t !== a) {
                    if (against.containsTerminalPoint(test.getXYPoint(1), threshold)) {
                        connected1[t] = true;
                    }

                    if (against.containsTerminalPoint(test.getXYPoint(4), threshold)) {
                        connected4[t] = true;
                    }
                    if (connected1[t] && connected4[t]) {
                        break;
                    }
                }
            }
        }
        // debug('\t segments by number, first point connected');
        // debug(json(connected1, true));
        // debug('\t segments by number, last point connected');
        // debug(json(connected4, true));

        for (let c = 0; c < this._segments.length; c++) {
            if (!(connected1[c] && connected4[c])) {
                this._segments[c].objType = 'NON CONNECTED';
            }
        }

        // debug(this._segments);
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'Segment';
        });
        // debug(' PolySegment.removeNonConnectingSegments - END\n');

        return this;
    }
}


// --------------------------------------------------------------
//    Curve Intersections
// --------------------------------------------------------------

/**
 * Find all places where two segments cross each other
 * This is a recursive algorithm
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @param {number} depth - How deep this recursive call has gone
 * @returns {array} - collection of overlap points in ix format like ['x/y', 'x/y', 'x/y']
 */
export function findSegmentIntersections(s1, s2, depth) {
    // debug('\n findSegmentIntersections - START');
    depth = depth || 0;
    // debug('\t depth ' + depth);


    // if(depth > 15) {
        // debug('\t findSegmentIntersections early return');
    //  return [];
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
    if (depth===0 && (s1.lineType || s2.lineType)) {
        // findEndPointSegmentIntersections is a perf hit
        // only run if either s1 or s2 is a line segment
        endpoints = findEndPointSegmentIntersections(s1, s2);
    }

    // Check to stop recursion
    let s1m = s1.getFastMaxes();
    let s2m = s2.getFastMaxes();

    if (!maxesOverlap(s1m, s2m)) {
        // debug('\t segments have non overlapping fast maxes');
        return [];
    }
    // debug('\t segments fast maxes overlap');
    // debug([s1m]);
    // debug([s2m]);

    // Complex segment intersections
    // let threshold = 0.00005; // Wow, this was the threshold???
    let threshold = 0.0005;
    let precision = 3;

    let s1w = (s1m.xMax - s1m.xMin);
    let s1h = (s1m.yMax - s1m.yMin);
    let s2w = (s2m.xMax - s2m.xMin);
    let s2h = (s2m.yMax - s2m.yMin);
    // debug('\t s1 w/h: ' + s1w + ' / ' + s1h);
    // debug('\t s2 w/h: ' + s2w + ' / ' + s2h);

    if ( (s1w < threshold) && (s1h < threshold) &&
        (s2w < threshold) && (s2h < threshold) ) {
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
 * @returns {boolean}
 */
export function segmentsAreEqual(s1, s2, threshold) {
    // debug('\n segmentsAreEqual - START');
    threshold = threshold || 1;
    // debug([s1, s2]);

    if ( pointsAreEqual(s1.getXYPoint(1), s2.getXYPoint(1), threshold) &&
        pointsAreEqual(s1.getXYPoint(4), s2.getXYPoint(4), threshold) ) {
        if (s1.lineType && s2.lineType) {
            // debug(' segmentsAreEqual - returning LINE true - END\n');
            return true;
        } else if ( pointsAreEqual(s1.getXYPoint(2), s2.getXYPoint(2), threshold) &&
                    pointsAreEqual(s1.getXYPoint(3), s2.getXYPoint(3), threshold) ) {
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
 * @returns {array} - collection of overlaps in ix format
 */
export function findOverlappingLineSegmentIntersections(s1, s2) {
    // debug(`\n findOverlappingLineSegmentIntersections - START`);
    let re = [];

    if (s1.containsPointOnLine(s2.getXYPoint(1))) re.push(''+s2.p1x+'/'+s2.p1y);
    if (s1.containsPointOnLine(s2.getXYPoint(4))) re.push(''+s2.p4x+'/'+s2.p4y);

    if (s2.containsPointOnLine(s1.getXYPoint(1))) re.push(''+s1.p1x+'/'+s1.p1y);
    if (s2.containsPointOnLine(s1.getXYPoint(4))) re.push(''+s1.p4x+'/'+s1.p4y);

    if (re.length) {
        // debug('\n findOverlappingLineSegmentIntersections - START');
        // debug([s1, s2]);
        // debug(json(re));
        // debug(' findOverlappingLineSegmentIntersections - END\n');
    }

    // debug(` findOverlappingLineSegmentIntersections - END\n\n`);
    return re;
}

/**
 * Find overlap points for Segments that are Lines (no curves)
 * This is much faster than comparing two curves
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @returns {array} - overlap point in ix format
 */
export function findCrossingLineSegmentIntersections(s1, s2) {
    // debug('\n findCrossingLineSegmentIntersections - START');
    if (!s1.lineType || !s2.lineType) return [];

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
 * @returns {array} - collection of overlaps in ix format
 */
export function findEndPointSegmentIntersections(s1, s2) {
    // debug('\n findEndPointSegmentIntersections - START');
    let s1s = s1.getXYPoint(1);
    let s1e = s1.getXYPoint(4);
    let s2s = s2.getXYPoint(1);
    let s2e = s2.getXYPoint(4);

    let re = [];

    if (s1.containsPointOnCurve(s2s)) re.push(`${s2s.x}/${s2s.y}`);
    if (s1.containsPointOnCurve(s2e)) re.push(`${s2e.x}/${s2e.y}`);
    if (s2.containsPointOnCurve(s1s)) re.push(`${s1s.x}/${s1s.y}`);
    if (s2.containsPointOnCurve(s1e)) re.push(`${s1e.x}/${s1e.y}`);

    // debug('\t returning ' + re);
    // debug(' findEndPointSegmentIntersections - END\n');
    return re;
}
