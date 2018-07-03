import GlyphElement from './glyphelement.js';
import Coord from './coord.js';
import Segment from './segment.js';
import Path from './path.js';
import {coordsAreEqual} from './coord.js';
import {makePathPointFromSegments} from './pathpoint.js';
import {segmentsAreEqual, findSegmentIntersections, ixToCoord} from './segment.js';
import {duplicates, clone} from '../app/functions.js';

/**
 * Object > Poly Segment
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
        let re = {segments: []};
        for (let s = 0; s < this._segments.length; s++) {
            re.segments[s] = this._segments[s].save();
        }

        if (verbose) re.objType = this.objType;

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
     * @param {array} segs
     */
    set segments(segs = []) {
        this._segments = [];
        for (let s = 0; s < segs.length; s++) {
            this._segments[s] = new Segment(segs[s]);
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
        currseg = 0;
        segs = this._segments;

        /** Draw one segment */
        function ds() {
            if (currseg < segs.length) {
                segs[currseg].drawSegmentOutline();
                segs[currseg].drawSegmentPoints('red', currseg);
                currseg++;
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
        let pp = [];
        let segs = clone(this._segments);

        // Connect the first / last point if not already
        let firstP = new Coord({x: segs[0].p1x, y: segs[0].p1y});
        let lastP = new Coord({x: segs[segs.length-1].p4x, y: segs[segs.length-1].p4y});
        if (!coordsAreEqual(firstP, lastP)) {
            segs.push(new Segment({p1x: lastP.x, p1y: lastP.y, p4x: firstP.x, p4y: firstP.y}));
        }

        // Fencepost make the first PathPoint
        pp.push(makePathPointFromSegments(segs[segs.length - 1], segs[0]));

        // Loop through Segments and create PathPoints
        let ns;
        for (let s = 0; s < segs.length - 1; s++) {
            ns = segs[s + 1];
            pp.push(makePathPointFromSegments(segs[s], ns));
        }

        // debug(pp);
        // debug(' PolySegment.getPath - END\n');
        return new Path({pathPoints: pp});
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
     * @param {string} color
     */
    drawIntersections(color = 'rgb(200, 50, 60)') {
        // debug('\n PolySegment.drawIntersections - START');
        let ix = this.findIntersections();
        let co;
        let ctx = _UI.glyphEditCTX;
        ctx.fillStyle = color;
        ix.forEach(function(v, i) {
            ix[i] = ixToCoord(v);
            co = ix[i];
            ctx.fillRect(sx_cx(co.x), sy_cy(co.y), 5, 5);
        });
        // debug(ix);
        // debug(' PolySegment.drawIntersections - END\n');
    }

    /**
     * Takes a collection of intersections, and splits all the applicable
     * segments at those points
     * @param {array} ixarr - array of intersections in ix format
     * @param {number} threshold - how closely to look and split
     * @returns {PolySegment}
     */
    splitSegmentsAtIntersections(ixarr = this.findIntersections(), threshold) {
        // debug('\n PolySegment.splitSegmentsAtIntersections - START');
        // debug('\t before length ' + this._segments.length);
        // debug(this._segments);
        ixarr.forEach(function(v, i) {
            ixarr[i] = ixToCoord(v);
        });
        // debug(ixarr);
        let result = [];
        for (let s = 0; s < this._segments.length; s++) {
            result = result.concat(this._segments[s].splitSegmentAtProvidedCoords(ixarr, threshold));
        }
        this._segments = result;
        // debug('\t afters length ' + this._segments.length);
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
         * @param {Coordinate} co - starting point to look for
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
         * @returns {Coord}
         */
        function getNextUnusedSegmentP1() {
            for (let s = 0; s < source.length; s++) {
                if (source[s].objType === 'Segment') {
                    return source[s].getCoord(1);
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
                nextCoord = resultSegment.getCoord(4);
            } else {
                // debug('\t LOOP ' + i + ' NO NEXT SEGMENT FOUND');
                if (sorted.length) {
                    result.push(new PolySegment({segments: sorted}));
                    if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getCoord(1))) {
                        // debug('\t\t Pushed sorted polyseg, connected nicely');
                    } else {
                        // debug('\t\t Pushed sorted polyseg, OPEN LOOP');
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
            if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getCoord(1))) {
                // debug('\t\t Pushed sorted polyseg, connected nicely');
            } else {
                // debug('\t\t Pushed sorted polyseg, OPEN LOOP');
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

        let s;
        for (let t = 0; t < this._segments.length; t++) {
            s = this._segments[t];
            if (coordsAreEqual(s.getCoord(1), s.getCoord(4))) {
                if (s.line) {
                    s.objType = 'LZERO';
                } else if (
                    coordsAreEqual(s.getCoord(1), s.getCoord(2)) &&
                    coordsAreEqual(s.getCoord(1), s.getCoord(3))
                ) {
                    s.objType = 'ZERO';
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
            // var re = shape.isHere(sx_cx(tx), sy_cy(ty)) &&
            // shape.isHere(sx_cx(tx), sy_cy(ty + pt)) &&
            // shape.isHere(sx_cx(tx), sy_cy(ty - pt)) &&
            // shape.isHere(sx_cx(tx + pt), sy_cy(ty)) &&
            // shape.isHere(sx_cx(tx - pt), sy_cy(ty));
            // if (re) alert('HIT ' + tx + ', ' + ty);

            if (!shape.isHere(sx_cx(tx), sy_cy(ty + pt))) return false;

            if (!shape.isHere(sx_cx(tx), sy_cy(ty - pt))) return false;

            if (!shape.isHere(sx_cx(tx + pt), sy_cy(ty))) return false;

            if (!shape.isHere(sx_cx(tx - pt), sy_cy(ty))) return false;

            if (!shape.isHere(sx_cx(tx), sy_cy(ty))) return false;

            return true;
        }

        for (let s = 0; s < this._segments.length; s++) {
            if (testForHit(this._segments[s], 0.33, shape) && testForHit(this._segments[s], 0.66, shape)) {
                // this._segments[s].drawSegmentPoints('rgb(255,0,0)', s);
                this._segments[s].objType = 'hit';
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
                    if (against.containsTerminalPoint(test.getCoord(1), threshold)) {
                        connected1[t] = true;
                    }

                    if (against.containsTerminalPoint(test.getCoord(4), threshold)) {
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
