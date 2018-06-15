
/**
    Object > Poly Segment
    A Poly Segment (aka poly bezier) stores a
    series of Segments that    represent a Path.

    Paths in Glyphr Studio are a collection of
    Path Points, which themselves contain a point
    and two handles.  Bezier curves, on the other
    hand, are represented as two points, with two
    handles between them.

    This PolySegment object is basically here just
    to make Bezier math easier for Paths.
**/

    function PolySegment(oa) {
        // debug('\n SEGMENT - START');
        oa = oa || {};
        this.objtype = 'polysegment';

        this.segments = [];
        oa.segments = oa.segments || [];

        for (let i=0; i<oa.segments.length; i++) {
            this.segments[i] = new Segment(oa.segments[i]);
        }

        // debug(' SEGMENT - END\n');
    }


//    -----------------------------------
//    Methods
//    -----------------------------------
    PolySegment.prototype.drawPolySegmentOutline = function(dx, dy) {
        let c;
        for (let s=0; s<this.segments.length; s++) {
            c = makeRandomSaturatedColor();
            this.segments[s].drawSegmentOutline(c, dx, dy);
        }
    };

    PolySegment.prototype.drawPolySegmentPoints = function() {
        this.segments.forEach(function(v, i) {
            v.drawSegmentPoints(false, i);
        });
    };

    PolySegment.prototype.slowlyDrawSegments = function() {
        // debug('\n PolySegment.slowlyDrawSegments - START');
        // debug(this.segments);

        currseg = 0;

        function ds() {
            if (currseg < this.segments.length) {
                this.segments[currseg].drawSegmentOutline();
                this.segments[currseg].drawSegmentPoints('red', currseg);
                currseg++;
                setTimeout(ds, 600);
            } else {
                // debug(' PolySegment.slowlyDrawSegments - END\n');
            }
        }

        setTimeout(ds, 500);
    };

    PolySegment.prototype.getPath = function() {
        // debug('\n PolySegment.getPath - START');
        // debug(this.segments);

        let pp = [];

        pp.push(makePathPointFromSegments(this.segments[this.segments.length-1], this.segments[0]));
        let ns;
        for (let s=0; s<this.segments.length-1; s++) {
            ns = this.segments[s+1];
            pp.push(makePathPointFromSegments(this.segments[s], ns));
        }

        // debug(pp);
        // debug(' PolySegment.getPath - END\n');

        return new Path({pathPoints: pp});
    };

    PolySegment.prototype.containsSegment = function(seg) {
        for (let s=0; s<this.segments.length; s++) {
            if (segmentsAreEqual(this.segments[s], seg)) return true;
        }

        return false;
    };

    PolySegment.prototype.roundAll = function(precision) {
        precision = isVal(precision)? precision : 3;

        for (let s=0; s<this.segments.length; s++) {
            this.segments[s].roundAll(precision);
        }
    };

    PolySegment.prototype.splitSegment = function(seg, t) {
        // debug('\n PolySegment.splitSegment - START');
        // if(typeof t === 'number') debug('\t ' + t);
        // else debug('\t' + json(t, true));

        let ns;

        for (let s=0; s<this.segments.length; s++) {
            if (this.segments.length > 100) {
                // console.warn('\t Breaking, over 100');
                return;
            }

            if (segmentsAreEqual(seg, this.segments[s])) {
                ns = this.segments[s].split(t);
                // debug('\t adding at pos ' + s);
                // debug(ns);
                // debug(this.segments);
                this.segments.splice(s, 1, ns[0], ns[1]);
                s++;
                // debug(this.segments);
            }
        }

        // debug(' PolySegment.splitSegment - END\n');
    };


//    -----------------------------------
//    Intersections
//    -----------------------------------
    PolySegment.prototype.findIntersections = function() {
        // debug('\n PolySegment.findIntersections - START');
        // debug('\t ' + this.segments.length + ' segments');

        let s1, s2;
        let ix = [];

        for (let i=0; i<this.segments.length; i++) {
            for (let j=i; j<this.segments.length; j++) {
                if (j !== i) {
                    s1 = clone(this.segments[i]);
                    s2 = clone(this.segments[j]);

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
    };

    PolySegment.prototype.drawIntersections = function(color) {
        // debug('\n PolySegment.drawIntersections - START');
        let ix = this.findIntersections();
        let co;
        let ctx = _UI.glyphEditCTX;

        ctx.fillStyle = 'rgb(200,50,60)';

        ix.forEach(function(v, i) {
            ix[i] = ixToCoord(v);
            co = ix[i];
            ctx.fillRect(sx_cx(co.x), sy_cy(co.y), 5, 5);
        });

        // debug(ix);
        // debug(' PolySegment.drawIntersections - END\n');
    };

    PolySegment.prototype.splitSegmentsAtProvidedIntersections = function(ixarr, threshold) {
        // debug('\n PolySegment.splitSegmentsAtProvidedIntersections - START');
        // debug('\t before length ' + this.segments.length);
        // debug(this.segments);

        ixarr.forEach(function(v, i) {
            ixarr[i] = ixToCoord(v);
        });

        // debug(ixarr);

        let result = [];

        for (let s=0; s<this.segments.length; s++) {
            result = result.concat(this.segments[s].splitSegmentAtProvidedCoords(ixarr, threshold));
        }

        this.segments = result;

        // debug('\t afters length ' + this.segments.length);
        // debug(' PolySegment.splitSegmentsAtProvidedIntersections - END\n');
    };

    PolySegment.prototype.stitchSegmentsTogether = function() {
        // debug('\n PolySegment.stitchSegmentsTogether - START');

        let source = new PolySegment(clone(this)).segments;
        let sorted = [];
        let result = [];

        function getNextSegment(co) {
            let ts, re;

            for (let s=0; s<source.length; s++) {
                ts = source[s];
                if (ts.objtype === 'segment') {
                    if (ts.containsStartPoint(co, 0)) {
                        re = new Segment(clone(ts));
                        ts.objtype = '-' + result.length + '.' + sorted.length;
                        return re;
                    }
                }
            }

            // if not, try all the segments reversed
            for (let r=0; r<source.length; r++) {
                ts = source[r].getReverse();
                if (source[r].objtype === 'segment') {
                    if (ts.containsStartPoint(co, 0)) {
                        re = new Segment(clone(ts));
                        source[r].objtype = 'R' + result.length + '.' + sorted.length;
                        return re;
                    }
                }
            }

            return false;
        }

        function getNextUnusedSegmentP1() {
            for (let s=0; s<source.length; s++) {
                if (source[s].objtype === 'segment') {
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

        for (let i=0; i<source.length; i++) {
            reseg = getNextSegment(nextcoord);

            if (reseg) {
                // debug('\t LOOP ' + i + ' added a segment,  ' + result.length + '.' + sorted.length);
                sorted.push(reseg);
                nextcoord = reseg.getCoord(4);
            } else {
                // debug('\t LOOP ' + i + ' NO NEXT SEGMENT FOUND');
                if (sorted.length) {
                    result.push(new PolySegment({segments: sorted}));

                    if (sorted[sorted.length-1].containsEndPoint(sorted[0].getCoord(1))) {
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

            if (sorted[sorted.length-1].containsEndPoint(sorted[0].getCoord(1))) {
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
    };


//    -----------------------------------
//    Segment Filtering
//    -----------------------------------

    PolySegment.prototype.removeZeroLengthSegments = function() {
        // debug('\n PolySegment.removeZeroLengthSegments - START');
        let len = this.segments.length;
        let s;

        for (let t=0; t<this.segments.length; t++) {
            s = this.segments[t];

            if (coordsAreEqual(s.getCoord(1), s.getCoord(4))) {
                if (s.line) {
                    s.objtype = 'LZERO';
                } else if (coordsAreEqual(s.getCoord(1), s.getCoord(2)) && coordsAreEqual(s.getCoord(1), s.getCoord(3))) {
                    s.objtype = 'ZERO';
                }
            }
        }

        // debug(this.segments);
        this.segments = this.segments.filter(function(v) {
 return v.objtype === 'segment';
});
        // debug(' PolySegment.removeZeroLengthSegments - removed ' + (len-this.segments.length) + ' - END\n');
    };

    PolySegment.prototype.removeRedundantSegments = function() {
        // debug('\n PolySegment.removeRedundantSegments - START');
        let len = this.segments.length;

        for (let s=0; s<this.segments.length; s++) {
        for (let t=0; t<this.segments.length; t++) {
            if (s !== t && this.segments[s] && this.segments[t]) {
                if (this.segments[s].isRedundantTo(this.segments[t])) {
                    this.segments[s] = 'REDUNDANT';
                }
            }
        }
}

        // debug(this.segments);
        this.segments = this.segments.filter(function(v) {
 return v.objtype === 'segment';
});
        // debug(' PolySegment.removeRedundantSegments - removed ' + (len-this.segments.length) + ' - END\n');
    };

    PolySegment.prototype.removeDuplicateSegments = function() {
        // debug('\n PolySegment.removeDuplicateSegments - START');
        let len = this.segments.length;

        for (let x=0; x<this.segments.length; x++) {
        for (let y=x; y<this.segments.length; y++) {
            if (x !== y && this.segments[x] && this.segments[y]) {
                if (segmentsAreEqual(this.segments[x], this.segments[y])) this.segments[y].objtype = 'DUPE';
                if (segmentsAreEqual(this.segments[x], this.segments[y].getReverse())) this.segments[y].objtype = 'REVERSE';
            }
        }
}

        // debug(this.segments);
        this.segments = this.segments.filter(function(v) {
return v.objtype === 'segment';
});
        // debug(' PolySegment.removeDuplicateSegments - removed ' + (len-this.segments.length) + ' - END\n');
    };

    PolySegment.prototype.removeSegmentsOverlappingShape = function(shape) {
        // debug('\n PolySegment.removeSegmentsOverlappingShape - START');
        let len = this.segments.length;

        // debug('\t segments starting as ' + this.segments.length);
        // debug(this.segments);

        let pt = 3;
        let tx, ty;

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

        // function testPoint(ptx, pty, shape) {
        //     if(shape.isHere(ptx, pty)){
        //         _UI.canvasctx.fill = 'lime';
        //         draw_CircleHandle({'x':ptx, 'y':pty});
        //         return true;
        //     } else {
        //         _UI.canvasctx.fill = 'red';
        //         draw_CircleHandle({'x':ptx, 'y':pty});
        //         return false;
        //     }
        // }

        for (let s=0; s<this.segments.length; s++) {
            if (testForHit(this.segments[s], 0.33, shape) && testForHit(this.segments[s], 0.66, shape)) {
                // this.segments[s].drawSegmentPoints('rgb(255,0,0)', s);
                this.segments[s].objtype = 'hit';
            } else {
                // this.segments[s].drawSegmentPoints('rgb(0,255,0)', s);
            }
        }

        // debug(this.segments);
        this.segments = this.segments.filter(function(v) {
return v.objtype === 'segment';
});

        // alert('removeSegmentsOverlappingShape - hits and misses');
        // debug(' PolySegment.removeSegmentsOverlappingShape - removed ' + (len-this.segments.length) + ' - END\n');
    };

    PolySegment.prototype.removeNonConnectingSegments = function() {
        // debug('\n PolySegment.removeNonConnectingSegments - START');
        let len = this.segments.length;
        let test, against, t1, t4;
        let connected1 = [];
        let connected4 = [];
        let threshold = 1;

        for (let t=0; t<this.segments.length; t++) {
            // debug('\t testing segment ' + t);
            test = this.segments[t];
            connected1[t] = false;
            connected4[t] = false;

            for (let a=0; a<this.segments.length; a++) {
                against = this.segments[a];
                // if(t !== a && against.objtype === 'segment'){
                if (t !== a) {
                    if (against.containsTerminalPoint(test.getCoord(1), threshold)) connected1[t] = true;
                    if (against.containsTerminalPoint(test.getCoord(4), threshold)) connected4[t] = true;
                    if (connected1[t] && connected4[t]) break;
                }
            }
        }

        // debug('\t segments by number, first point connected');
        // debug(json(connected1, true));

        // debug('\t segments by number, last point connected');
        // debug(json(connected4, true));

        for (let c=0; c<this.segments.length; c++) {
            if (!(connected1[c] && connected4[c])) this.segments[c].objtype = 'NON CONNECTED';
        }


        // debug(this.segments);
        this.segments = this.segments.filter(function(v) {
return v.objtype === 'segment';
});
        // debug(' PolySegment.removeNonConnectingSegments - removed ' + (len-this.segments.length) + ' - END\n');
    };

    PolySegment.prototype.combineInlineSegments = function() {
        // debug('\n PolySegment.combineInlineSegments - START');
        let len = this.segments.length;

        let ts, ns;

        for (let s=0; s < this.segments.length; s++) {
            ts = this.segments[s];
            ns = (s === this.segments.length-1)? this.segments[0] : this.segments[s+1];

            if (ts.line === ns.line) {
                this.segments[s] = new Segment({
                    'p1x': ts.p1x,
                    'p1y': ts.p1y,
                    'p4x': ns.p4x,
                    'p4y': ns.p4y,
                });

                this.segments.splice(s+1, 1);

                s--;
            }
        }

        // debug(' PolySegment.combineInlineSegments - removed ' + (len-this.segments.length) + ' - END\n');
    };
