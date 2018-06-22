import {numSan, duplicates, isVal, round} from '../app/functions.js';

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
    constructor(oa) {
        // debug('\n SEGMENT - START');
        oa = oa || {};
        this.objtype = 'segment';
        this.p1x = numSan(oa.p1x) || 0;
        this.p1y = numSan(oa.p1y) || 0;
        this.p2x = numSan(oa.p2x) || this.p1x || 0;
        this.p2y = numSan(oa.p2y) || this.p1y || 0;
        this.p3x = numSan(oa.p3x) || 0;
        this.p3y = numSan(oa.p3y) || 0;
        this.p4x = numSan(oa.p4x) || 0;
        this.p4y = numSan(oa.p4y) || 0;
        if (!oa.p3x)
            this.p3x = this.p4x;
        if (!oa.p3y)
            this.p3y = this.p4y;
        this.line = this.isLine();
        // cache
        oa.cache = oa.cache || {};
        this.cache = {};
        this.cache.length = oa.cache.length || false;
        // debug(' SEGMENT - END\n');
    }
    //    -----------------------------------
    //    Methods
    //    -----------------------------------
    changed() {
        this.cache = {};
        this.line = this.isLine();
    }
    //    -----------------------------------
    //    Drawing
    //    -----------------------------------
    drawSegmentOutline(color, dx, dy) {
        if (!_UI.glyphEditCTX)
            setupEditCanvas();
        let ctx = _UI.glyphEditCTX;
        ctx.strokeStyle = RGBAtoRGB((color || _UI.colors.green.l65), 0.9);
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
    drawSegmentPoints(color, txt) {
        if (!_UI.glyphEditCTX)
            setupEditCanvas();
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
        color = RGBAtoRGB((color || _UI.colors.green.l65), 0.4);
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
    split(sp) {
        sp = sp || 0.5;
        if (typeof sp === 'object' && isVal(sp.x) && isVal(sp.y)) {
            return this.splitAtCoord(sp);
        }
        else if (!isNaN(sp)) {
            return this.splitAtTime(sp);
        }
        return false;
    }
    splitAtCoord(co) {
        // debug('\n Segment.splitAtCoord - START');
        // debug('\t splitting at ' + json(co, true));
        if (this.containsTerminalPoint(co, 0.1))
            return false;
        if (this.line && this.line !== 'diagonal') {
            let newx, newy;
            let online = false;
            if (this.line === 'horizontal') {
                if (round(co.y, 2) === round(this.p1y, 2)) {
                    if ((co.x > Math.min(this.p1x, this.p4x)) && (co.x < Math.max(this.p1x, this.p4x))) {
                        newx = co.x;
                        newy = this.p1y;
                        online = true;
                    }
                }
            }
            else if (this.line === 'vertical') {
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
        }
        else if (this.pointIsWithinMaxes(co)) {
            let threshold = 0.1;
            let sp = this.getSplitFromCoord(co, threshold);
            // debug('\t distance is ' + sp.distance);
            if (sp && sp.distance < threshold) {
                // debug('\t splitting at ' + sp.split);
                // if(this.line === 'diagonal'){
                //     // debug('\t splitting diagonal');
                //     var re = this.splitAtTime(sp.split);
                //     re[0] = re[0].convertToLine();
                //     re[1] = re[1].convertToLine();
                //     return re;
                // } else {
                return this.splitAtTime(sp.split);
                // }
            }
        }
        // debug(' Segment.splitAtCoord - returning false - END\n');
        return false;
    }
    splitAtTime(t) {
        // debug('\n Segment.splitAtTime - START');
        let fs = t || 0.5;
        let rs = (1 - fs);
        // Do some math
        let x12 = (this.p1x * rs) + (this.p2x * fs);
        let y12 = (this.p1y * rs) + (this.p2y * fs);
        let x23 = (this.p2x * rs) + (this.p3x * fs);
        let y23 = (this.p2y * rs) + (this.p3y * fs);
        let x34 = (this.p3x * rs) + (this.p4x * fs);
        let y34 = (this.p3y * rs) + (this.p4y * fs);
        let x123 = (x12 * rs) + (x23 * fs);
        let y123 = (y12 * rs) + (y23 * fs);
        let x234 = (x23 * rs) + (x34 * fs);
        let y234 = (y23 * rs) + (y34 * fs);
        let x1234 = (x123 * rs) + (x234 * fs);
        let y1234 = (y123 * rs) + (y234 * fs);
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
    pointIsWithinMaxes(co) {
        let m = this.getMaxes();
        let re = (co.x <= m.xMax &&
            co.x >= m.xMin &&
            co.y <= m.yMax &&
            co.y >= m.yMin);
        return re;
    }
    convertToLine() {
        return new Segment({ p1x: this.p1x, p1y: this.p1y, p4x: this.p4x, p4y: this.p4y });
    }
    //    -----------------------------------
    //    Getters
    //    -----------------------------------
    getSplitFromCoord(coord, threshold) {
        let grains = this.getQuickLength() * 1000;
        let mindistance = 999999999;
        let re = false;
        let check, d;
        for (let t = 0; t < 1; t += (1 / grains)) {
            check = this.getCoordFromSplit(t);
            d = Math.sqrt(((check.x - coord.x) * (check.x - coord.x)) + ((check.y - coord.y) * (check.y - coord.y)));
            if (d < mindistance) {
                mindistance = d;
                re = {
                    'split': t,
                    'distance': d,
                    'x': check.x,
                    'y': check.y,
                };
                if (threshold && re.distance < threshold)
                    return re;
            }
        }
        return re;
    }
    getLength() {
        // this function is only used as an approximation
        // threshold in em units
        if (this.cache && this.cache.length)
            return this.cache.length;
        let re;
        let threshold = 10;
        let a = Math.abs(this.p1x - this.p4x);
        let b = Math.abs(this.p1y - this.p4y);
        let c = Math.sqrt((a * a) + (b * b));
        if (this.line || c < threshold) {
            this.cache.length = c;
            return c;
        }
        else {
            let s = this.split();
            re = s[0].getLength() + s[1].getLength();
            this.cache.length = re;
            return re;
        }
    }
    getQuickLength() {
        let a = Math.abs(this.p1x - this.p4x);
        let b = Math.abs(this.p1y - this.p4y);
        let c = Math.sqrt((a * a) + (b * b));
        return c;
    }
    getCoordFromSplit(t) {
        t = t || 0.5;
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
        return { 'x': x1234, 'y': y1234 };
    }
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
    getCoord(pt) {
        if (pt === 1)
            return { x: this.p1x, y: this.p1y };
        else if (pt === 2)
            return { x: this.p2x, y: this.p2y };
        else if (pt === 3)
            return { x: this.p3x, y: this.p3y };
        else if (pt === 4)
            return { x: this.p4x, y: this.p4y };
    }
    //    -----------------------------------
    //    Bounds
    //    -----------------------------------
    getFastMaxes() {
        let bounds = {
            'xMin': Math.min(this.p1x, Math.min(this.p2x, Math.min(this.p3x, this.p4x))),
            'yMin': Math.min(this.p1y, Math.min(this.p2y, Math.min(this.p3y, this.p4y))),
            'xMax': Math.max(this.p1x, Math.max(this.p2x, Math.max(this.p3x, this.p4x))),
            'yMax': Math.max(this.p1y, Math.max(this.p2y, Math.max(this.p3y, this.p4y))),
        };
        return bounds;
    }
    getMaxes() {
        // debug('\n Segment.getMaxes - START');
        // debug(this);
        let bounds = {
            'xMin': Math.min(this.p1x, this.p4x),
            'yMin': Math.min(this.p1y, this.p4y),
            'xMax': Math.max(this.p1x, this.p4x),
            'yMax': Math.max(this.p1y, this.p4y),
        };
        if (this.line) {
            // debug([bounds]);
            // debug(' Segment.getMaxes - returning fastmaxes for line - END\n');
            return bounds;
        }
        let d1x = this.p2x - this.p1x;
        let d1y = this.p2y - this.p1y;
        let d2x = this.p3x - this.p2x;
        let d2y = this.p3y - this.p2y;
        let d3x = this.p4x - this.p3x;
        let d3y = this.p4y - this.p3y;
        let numerator, denominator, quadroot, root, t1, t2;
        if (this.p2x < bounds.xMin || this.p2x > bounds.xMax || this.p3x < bounds.xMin || this.p3x > bounds.xMax) {
            // X bounds
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
        // debug(' Segment.getMaxes - END\n');
        return bounds;
    }
    //    -----------------------------------
    //    Curve Checking
    //    -----------------------------------
    isRedundantTo(s) {
        // A segment is  Redundant redundant to another segment if
        // it is completely overlapped by the other segment
        if (!this.line)
            return false;
        return (s.containsPointOnLine(this.getCoord(1)) && s.containsPointOnLine(this.getCoord(4)));
    }
    containsTerminalPoint(pt, threshold) {
        threshold = threshold || 1;
        if (this.containsStartPoint(pt, threshold))
            return 'start';
        else if (this.containsEndPoint(pt, threshold))
            return 'end';
        else
            return false;
    }
    containsStartPoint(pt, threshold) {
        threshold = threshold || 1;
        return coordsAreEqual(this.getCoord(1), pt, threshold);
    }
    containsEndPoint(pt, threshold) {
        threshold = threshold || 1;
        return coordsAreEqual(this.getCoord(4), pt, threshold);
    }
    containsPointOnCurve(pt, threshold) {
        if (this.containsTerminalPoint(pt, threshold))
            return true;
        if (this.line)
            return this.containsPointOnLine(pt);
        threshold = isVal(threshold) ? threshold : 0.1;
        let t = this.getSplitFromCoord(pt, threshold);
        if (t && t.distance < threshold)
            return true;
        else
            return false;
    }
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
    preceeds(s2, threshold) {
        threshold = threshold || 1;
        return (coordsAreEqual(this.getCoord(4)), s2.getCoord(1), threshold);
    }
    isLine(precision) {
        precision = isVal(precision) ? precision : 1;
        let rex = (round(this.p1x, precision) === round(this.p2x, precision) &&
            round(this.p1x, precision) === round(this.p3x, precision) &&
            round(this.p1x, precision) === round(this.p4x, precision));
        if (rex)
            return 'vertical';
        let rey = (round(this.p1y, precision) === round(this.p2y, precision) &&
            round(this.p1y, precision) === round(this.p3y, precision) &&
            round(this.p1y, precision) === round(this.p4y, precision));
        if (rey)
            return 'horizontal';
        let red = (pointsAreCollinear(this.getCoord(1), this.getCoord(4), this.getCoord(2)) &&
            pointsAreCollinear(this.getCoord(1), this.getCoord(4), this.getCoord(3)));
        if (red)
            return 'diagonal';
        return false;
    }
    toString(precision) {
        precision = isVal(precision) ? precision : 1;
        re = '';
        re += round(this.p1x, precision) + '\t' + round(this.p1y, precision) + '\n';
        // re += round(this.p2x, precision) + '\t' + round(this.p2y, precision) + '\n';
        // re += round(this.p3x, precision) + '\t' + round(this.p3y, precision) + '\n';
        re += round(this.p4x, precision) + '\t' + round(this.p4y, precision) + '\n';
        return re;
    }
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

    checkXbounds(bounds, value) {
        if (bounds.xMin > value) {
            bounds.xMin = value;
        } else if (bounds.xMax < value) {
            bounds.xMax = value;
        }
    }

    checkYbounds(bounds, value) {
        if (bounds.yMin > value) {
            bounds.yMin = value;
        } else if (bounds.yMax < value) {
            bounds.yMax = value;
        }
    }

    getBezierValue(t, p0, p1, p2, p3) {
        let mt = (1-t);
        return (mt*mt*mt*p0) + (3*mt*mt*t*p1) + (3*mt*t*t*p2) + (t*t*t*p3);
    }
}


//    -----------------------------------
//    Curve Intersections
//    -----------------------------------

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

function ixToCoord(ix) {
    // debug('\n ixToCoord - START');
    // debug(ix);
    let re = {
        x: parseFloat(ix.split('/')[0]),
        y: parseFloat(ix.split('/')[1]),
    };
    // debug([re]);
    // debug(' ixToCoord - END\n');
    return re;
}

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

function findOverlappingLineSegmentIntersections(s1, s2) {
    // Check if the two segments are overlapping horizontal or vertical lines
    // If so, just return one point from the coincident lines
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

function coordToIx(co) {
    return (''+co.x+'/'+co.y);
}

function pointsAreCollinear(a, b, c, precision) {
    precision = isVal(precision)? precision : 3;

    let s1 = (b.x - a.x) * (c.y - a.y);
    let s2 = (c.x - a.x) * (b.y - a.y);

    return round(s1, precision) === round(s2, precision);
}
