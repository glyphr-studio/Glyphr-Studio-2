import GlyphElement from './glyphelement.js';
import Segment from './segment.js';
import Path from './path.js';
import {makePathPointFromSegments} from './pathpoint.js';
import {segmentsAreEqual, findSegmentIntersections, ixToCoord} from './segment.js';
import {duplicates} from '../app/functions.js';

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
        pp.push(makePathPointFromSegments(this._segments[this._segments.length - 1], this._segments[0]));
        let ns;
        for (let s = 0; s < this._segments.length - 1; s++) {
            ns = this._segments[s + 1];
            pp.push(makePathPointFromSegments(this._segments[s], ns));
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
     */
    roundAll(precision = 3) {
        for (let s = 0; s < this._segments.length; s++) {
            this._segments[s].roundAll(precision);
        }
    }

    /**
     * Look for a Segment, and if found, split it at time=t
     * @param {Segment} seg - Look for this one and split it
     * @param {number} t - decimal between 0 and 1
     */
    splitSegment(seg, t) {
        // debug('\n PolySegment.splitSegment - START');
        // if(typeof t === 'number') debug('\t ' + t);
        // else debug('\t' + json(t, true));
        let ns;
        for (let s = 0; s < this._segments.length; s++) {
            if (this._segments.length > 100) {
                // console.warn('\t Breaking, over 100');
                return;
            }
            if (segmentsAreEqual(seg, this._segments[s])) {
                ns = this._segments[s].split(t);
                // debug('\t adding at pos ' + s);
                // debug(ns);
                // debug(this._segments);
                this._segments.splice(s, 1, ns[0], ns[1]);
                s++;
                // debug(this._segments);
            }
        }
        // debug(' PolySegment.splitSegment - END\n');
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
    }

    /**
     * Takes all the segments and orders them based on their
     * starting and ending points
     * @returns {array} - sorted Segments
     */
    stitchSegmentsTogether() {
        // debug('\n PolySegment.stitchSegmentsTogether - START');
        let source = new PolySegment(this).segments;
        let sorted = [];
        let result = [];

        /**
         * Takes the end of a segment, and looks for another segment
         * with that point as it's start
         * @param {Coordinate} co - starting point to look for
         * @returns {Segment}
         */
        function getNextSegment(co) {
            let ts;
            let re;
            for (let s = 0; s < source.length; s++) {
                ts = source[s];
                if (ts.objType === 'segment') {
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
                if (source[r].objType === 'segment') {
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
                if (source[s].objType === 'segment') {
                    return source[s].getCoord(1);
                }
            }
        }


        // Start ordering
        let reseg;
        let nextcoord = getNextUnusedSegmentP1();
        // debug('\t starting loop');
        // debug([nextcoord]);
        // debug('\t source.length ' + source.length);
        for (let i = 0; i < source.length; i++) {
            reseg = getNextSegment(nextcoord);
            if (reseg) {
                // debug('\t LOOP ' + i + ' added a segment,  ' + result.length + '.' + sorted.length);
                sorted.push(reseg);
                nextcoord = reseg.getCoord(4);
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
                    nextcoord = getNextUnusedSegmentP1();
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
        // debug('\t SOURCE');
        // debug(source);
        result.forEach(function(v, i) {
            // debug('\n\t RETURNING ' + i);
            // debug(v.segments);
        });
        // debug(' PolySegment.stitchSegmentsTogether - END\n');

        return result;
    }


    // --------------------------------------------------------------
    // Segment Filtering
    // --------------------------------------------------------------

    /**
     * Removes all the zero length segments
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

        // debug(this._segments);
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'segment';
        });
        // debug(' PolySegment.removeZeroLengthSegments - removed ' + (len-this._segments.length) + ' - END\n');
    }

    /**
     * Removes all redundant segments (line overlappings)
     */
    removeRedundantSegments() {
        // debug('\n PolySegment.removeRedundantSegments - START');
        for (let s = 0; s < this._segments.length; s++) {
            for (let t = 0; t < this._segments.length; t++) {
                if (s !== t && this._segments[s] && this._segments[t]) {
                    if (this._segments[s].isLineOverlappedByLine(this._segments[t])) {
                        this._segments[s] = 'REDUNDANT';
                    }
                }
            }
        }

        // debug(this._segments);
        this._segments = this._segments.filter(function(v) {
            return v.objType === 'segment';
        });
        // debug(' PolySegment.removeRedundantSegments - removed ' + (len-this._segments.length) + ' - END\n');
    }

    /**
     * Removes all duplicate segments
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
            return v.objType === 'segment';
        });
        // debug(' PolySegment.removeDuplicateSegments - removed ' + (len-this._segments.length) + ' - END\n');
    }

    /**
     * Removes all the segments that overlap a provided shape
     * @param {Shape} shape
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
            // Big hit dectection, to miss border paths
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
            return v.objType === 'segment';
        });
        // alert('removeSegmentsOverlappingShape - hits and misses');
        // debug(' PolySegment.removeSegmentsOverlappingShape - removed ' + (len-this._segments.length) + ' - END\n');
    }

    /**
     * Removes all segments not 'connected' to other segments
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
                // if(t !== a && against.objType === 'segment'){
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
            return v.objType === 'segment';
        });
        // debug(' PolySegment.removeNonConnectingSegments - removed ' + (len-this._segments.length) + ' - END\n');
    }

    /**
     * Combines the first and last segments if they are
     * lines and if they are inline with eachother
     */
    combineInlineSegments() {
        // debug('\n PolySegment.combineInlineSegments - START');
        let ts;
        let ns;
        for (let s = 0; s < this._segments.length; s++) {
            ts = this._segments[s];
            ns = (s === this._segments.length - 1) ? this._segments[0] : this._segments[s + 1];
            if (ts.line === ns.line) {
                this._segments[s] = new Segment({
                    'p1x': ts.p1x,
                    'p1y': ts.p1y,
                    'p4x': ns.p4x,
                    'p4y': ns.p4y,
                });
                this._segments.splice(s + 1, 1);
                s--;
            }
        }
        // debug(' PolySegment.combineInlineSegments - removed ' + (len-this._segments.length) + ' - END\n');
    }
}
