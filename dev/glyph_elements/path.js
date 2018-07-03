import GlyphElement from './glyphelement.js';
import Maxes from './maxes.js';
import Coord from './coord.js';
import Segment from './segment.js';
import PolySegment from './polysegment.js';
import Handle from './handle.js';
import PathPoint from './pathpoint.js';
import {clone, round, isVal, hasNonValues, duplicates} from '../app/functions.js';
import {coordsAreEqual} from './coord.js';
import {json} from '../app/functions.js';
import {getOverallMaxes, maxesOverlap} from './maxes.js';
import {findSegmentIntersections} from './segment.js';
import {sx_cx, sy_cy, getView, setView} from '../edit_canvas/edit_canvas.js';

/**
 * Path
 * A Path is a collection of Path Points, plus
 * a few properties like selected point, winding,
 * and maxes.
 * Higher level objects should only have access to
 * a Shape object, not direct access to a Shape's
 * Path object. This is to enable Shape objects and
 * Component Instance objects to be used
 * interchangeably, even though Component Instance
 * objects don't have a Path.
 */
 export default class Path extends GlyphElement {
    /**
     * Create a Path
     * @param {array} pathPoints - array of Path Point objects that make up this path
     * @param {number} winding - number representing winding direction
     * @param {object} maxes - a Maxes object that contains max and min information
     * @param {object} cache - any cached information
     */
    constructor({
        pathPoints = [],
        winding = 0,
        maxes = {},
        cache = {},
    } = {}) {
        super();
        // debug('\n Path.constructor - START');
        this.pathPoints = pathPoints;
        this.winding = winding;
        if (!this.winding) this.findWinding();

        // internal
        this.maxes = maxes;
        this._cache = {};
        this._cache.segments = cache.segments || [];
        this._cache.segmentlengths = cache.segmentlengths || [];
        this.calcMaxes();

        // debug(`\t maxes: ${json(this.maxes, true)}`);

        // debug(' Path.constructor - END\n');
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
            winding: this.winding,
            pathPoints: [],
        };

        this._pathPoints.forEach((point) => {
            re.pathPoints.push(point.save());
        });

        if (verbose) re.objType = this.objType;

        return re;
    }

    /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @param {string} indentChar - what to use for indention
     * @returns {string}
     */
    print(level = 0, indentChar = '  ') {
        let ind = '';
        for (let i=0; i<level; i++) ind += indentChar;

        let re = `{\n`;
        re += `${ind+indentChar}winding: ${this.winding}\n`;

        re += `${ind+indentChar}pathPoints: [\n`;
        this._pathPoints.forEach((point) => {
            re += point.print(level+1, indentChar);
            re += `${ind+indentChar},\n`;
        });
        re += `${ind+indentChar}]\n`;

        re += `${ind+indentChar}maxes: ${this.maxes.print(level+1, indentChar)}`;
        re += `\n${ind}}`;

        return re;
    }

    /**
     * Reset the cache
     */
    changed() {
        this._cache = {};
        this.calcMaxes();
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Get PathPoints
     * @returns {array}
     */
    get pathPoints() {
        return this._pathPoints;
    }

    /**
     * Get Winding
     * negative = clockwise
     * positive = counterclockwise
     * zero = unknown
     * @returns {number}
     */
    get winding() {
        if (!isVal(this._winding)) {
            if (this.findWinding) {
                this.findWinding();
            } else {
                this._winding = 0;
            }
        }
        return this._winding;
    }

    /**
     * Get X possition
     * @returns {number} x
     */
    get x() {
        return this._maxes.xMin;
    }

    /**
     * Get Y possition
     * @returns {number} y
     */
    get y() {
        return this._maxes.yMax;
    }

    /**
     * Get Height
     * @returns {number}
     */
    get height() {
        let h = this.maxes.yMax - this.maxes.yMin;
        return Math.max(h, 0);
    }

    /**
     * Get Width
     * @returns {number}
     */
    get width() {
        let w = this.maxes.xMax - this.maxes.xMin;
        return Math.max(w, 0);
    }

    /**
     * Get Maxes
     * @returns {object}
     */
    get maxes() {
        // debug('\n Path.maxes - START');
        if (hasNonValues(this._maxes)) {
            // debug('\t no cache, calcMaxes');
            this.calcMaxes();
        }
        // debug('\t returning ' + json(this.maxes, true));
        // debug(' Path.maxes - END\n');
        return new Maxes(this._maxes);
    }

    /**
     * Get or generate SVG path data
     * @returns {string}
     */
    get svgPathData() {
        if (this._cache.svgpathdata) {
            return this._cache.svgpathdata;
        }

        this._cache.svgpathdata = this.makeSVGPathData();
        return this._cache.svgpathdata;
    }


    // --------------------------------------------------------------
    //  Setters
    // --------------------------------------------------------------

    /**
     * Set PathPoints
     * @param {array} pathPoints - array of Path Points
     * @returns {Path} - reference to this Path
     */
    set pathPoints(pathPoints) {
        this._pathPoints = [];

        if (pathPoints && pathPoints.length) {
            // debug('NEW PATH : Hydrating Path Points, length ' + pathPoints.length);
            for (let i = 0; i < pathPoints.length; i++) {
                this._pathPoints[i] = new PathPoint(pathPoints[i]);
                this._pathPoints[i].parentPath = this;
            }
        }

        return this;
    }

    /**
     * Set Winding
     * negative = clockwise
     * positive = counterclockwise
     * zero = unknown
     * @param {number} winding
     * @returns {Path} - reference to this Path
     */
    set winding(winding) {
        this._winding = winding;
        return this;
    }

    /**
     * Set Maxes
     * @param {Maxes} maxes
     * @returns {Path} - reference to this Path
     */
    set maxes(maxes) {
        // debug(`\n Path.set maxes - START`);
        // debug(`\t passed ${json(this._maxes, true)}`);
        this._maxes = new Maxes(maxes);
        // debug(`\t _maxes is now`);
        // debug(this._maxes);


        // debug(` Path.set maxes - END\n\n`);
        return this;
    }

    /**
     * Set X possition
     * @param {number} x
     * @returns {Path} - reference to this Path
     */
    set x(x) {
        this.setPathPosition(x, false);
        return this;
    }

    /**
     * Set Y possition
     * @param {number} y
     * @returns {Path} - reference to this Path
     */
    set y(y) {
        this.setPathPosition(false, y);
        return this;
    }

    /**
     * Set Height
     * @param {number} h
     * @returns {Path} - reference to this Path
     */
    set height(h) {
        this.setPathSize(false, h);
        return this;
    }

    /**
     * Set Width
     * @param {number} w
     * @returns {Path} - reference to this Path
     */
    set width(w) {
        this.setPathSize(w, false);
        return this;
    }

    /**
     * Set or generate SVG path data
     * @param {string} data
     * @returns {Path} - reference to this Path
     */
    set svgPathData(data) {
        this._cache.svgpathdata = data;
        return this;
    }


    // --------------------------------------------------------------
    //  SIZE AND POSSITION
    // --------------------------------------------------------------

    /**
     * Sets the overall Path width or height to a specific value
     * @param {number} nw - new Width
     * @param {number} nh - new Height
     * @param {boolean} ratiolock - if one is changed, change the other
     */
    setPathSize(nw, nh, ratiolock = false) {
        if (nw !== false) nw = parseFloat(nw);
        if (nh !== false) nh = parseFloat(nh);

        let dw = (nw !== false) ? (nw - this.width) : 0;
        let dh = (nh !== false) ? (nh - this.height) : 0;

        this.updatePathSize(dw, dh, ratiolock);
    }

    /**
     * Updates the overall Path width or height by a delta value
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratiolock - if one is changed, change the other
     */
    updatePathSize(dw = 0, dh = 0, ratiolock = false) {
        // debug('\n Path.updatePathSize - START');
        // debug('dw,dh,rl\t'+dw+' , '+dh+' , '+ratiolock);
        dw = parseFloat(dw) || 0;
        dh = parseFloat(dh) || 0;
        if (!dw && !dh) return;

        // Lock Aspect Ratio
        if (ratiolock) {
            if (dw !== dh) {
                let ratio = this.width / this.height;
                if (Math.abs(dw) > Math.abs(dh)) {
                    dh = dw / ratio;
                } else {
                    dw = dh * ratio;
                }
            }
        }

        // debug('\t dw / dh is now ' + dw + ' / ' + dh);
        let oldw = this.width;
        if (oldw === 0) oldw = 1;

        let oldh = this.height;
        if (oldh === 0) oldh = 1;

        let neww = Math.max((oldw + dw), 1);
        let newh = Math.max((oldh + dh), 1);
        let ratiodh = (newh / oldh);
        let ratiodw = (neww / oldw);

        // If ratiolocked, keep both w&h from min'ing out at 1
        if (ratiolock) {
            if (neww <= 1 || newh <= 1) {
                // debug('\t RETURNING: ratiolock forcing width or height to be less than 1.');
                return;
            }
        }

        for (let e = 0; e < this.pathPoints.length; e++) {
            let pp = this.pathPoints[e];
            pp.p.x = (((pp.p.x - this.maxes.xMin) * ratiodw) + this.maxes.xMin);
            pp.h1.x = (((pp.h1.x - this.maxes.xMin) * ratiodw) + this.maxes.xMin);
            pp.h2.x = (((pp.h2.x - this.maxes.xMin) * ratiodw) + this.maxes.xMin);
            pp.p.y = (((pp.p.y - this.maxes.yMin) * ratiodh) + this.maxes.yMin);
            pp.h1.y = (((pp.h1.y - this.maxes.yMin) * ratiodh) + this.maxes.yMin);
            pp.h2.y = (((pp.h2.y - this.maxes.yMin) * ratiodh) + this.maxes.yMin);
        }

        if (this.checkForNaN()) {
            // debug('\t NAN FOUND IN THIS PATH');
            // debug('\t this.maxes = ' + json(this.maxes));
            // debug('oldw = ' + oldw);
            // debug('oldh = ' + oldh);
            // debug('neww = ' + neww);
            // debug('newh = ' + newh);
            // debug('ratiodh = ' + ratiodh);
            // debug('ratiodw = ' + ratiodw);
        }
        this.calcMaxes();
        // debug(' Path.updatePathSize - END\n');
    }

    /**
     * Moves a path to a specific possition
     * @param {number} nx - new X
     * @param {number} ny - new Y
     * @param {boolean} force - disregard lock setting
     */
    setPathPosition(nx, ny, force = false) {
        // debug('\n Path.setPathPosition - START');
        // debug('\t nx ny force:\t ' + nx + '\t ' + ny + '\t ' + force);

        if (nx !== false) nx = parseFloat(nx);
        if (ny !== false) ny = parseFloat(ny);

        let dx = (nx !== false) ? ((nx * 1) - this.maxes.xMin) : 0;
        let dy = (ny !== false) ? ((ny * 1) - this.maxes.yMax) : 0;
        // debug('\t dx dy: ' + dx + ' ' + dy);

        this.updatePathPosition(dx, dy, force);
        // debug(' Path.setPathPosition - END\n');
    }

    /**
     * Moves the path based on delta values
     * @param {number} dx - delta X
     * @param {number} dy - delta Y
     * @param {boolean} force - disreagard lock setting
     */
    updatePathPosition(dx = 0, dy = 0, force = false) {
        // debug('\n Path.updatePathPosition - START');

        if (dx !== false) dx = parseFloat(dx);
        if (dy !== false) dy = parseFloat(dy);

        // debug('\t dx, dy, f\t'+dx+'\t'+dy+'\t'+force);
        for (let d = 0; d < this.pathPoints.length; d++) {
            let pp = this.pathPoints[d];
            // debug('-------------------- pathPoint #' + d);
            pp.updatePathPointPosition('p', dx, dy);
        }
        this.changed();
        // debug(' Path.updatePathPosition - END\n');
    }

    /**
     * Rotate this path about a point
     * @param {number} angle - how much to rotate
     * @param {Coord} about - x/y center of rotation
     * @returns {Path} - reference to this path
     */
    rotate(angle, about) {
        // debug('\n Path.rotate - START');
        for (let d = 0; d < this.pathPoints.length; d++) {
            // debug('\t starting point ' + d);
            let pp = this.pathPoints[d];
            pp.rotate(angle, about);
            // debug('\t p['+d+'].p.x ' + pp.p.x);
        }
        this.changed();
        // debug(' Path.rotate - END\n');
        return this;
    }

    /**
     * Returns true if this path is at the specified point
     * @param {number} px - target X in Em Units
     * @param {number} py - target Y in Em Units
     * @returns {boolean}
     */
    isHere(px, py) {
        let element = document.createElement('canvas');
        element.setAttribute('height', '3000');
        element.setAttribute('width', '3000');

        let ctx = element.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,255,0.2)';

        ctx.beginPath();
        this.drawPath(ctx);
        ctx.closePath();
        ctx.fill();
        let imageData = ctx.getImageData(px, py, 1, 1);
        // debug('ISHERE? alpha = ' + imageData.data[3] + '  returning: ' + (imageData.data[3] > 0));

        return (imageData.data[3] > 0);
    }


    // --------------------------------------------------------------
    //  Methods
    // --------------------------------------------------------------

    /**
     * Get the next point number in the path
     * Handle looping
     * @param {number} pnum - point number
     * @returns {number}
     */
    getNextPointNum(pnum = 0) {
        pnum = parseInt(pnum);
        pnum += 1;
        pnum = pnum % this.pathPoints.length;
        return pnum;
    }

    /**
     * Get the previous point number in the path
     * Handle looping
     * @param {number} pnum - point number
     * @returns {number}
     */
    getPreviousPointNum(pnum = 0) {
        pnum = parseInt(pnum);
        pnum -= 1;
        if (pnum < 0) {
            pnum = pnum + this.pathPoints.length;
        }

        return pnum;
    }

    /**
     * If this path overlaps itself, add Path Points
     * where it overlaps
     */
    addPointsAtPathIntersections() {
        let polyseg = this.getPolySegment();
        polyseg.splitSegmentsAtIntersections();
        let newpath = polyseg.getPath();
        // this._pathPoints = clone(newpath.pathPoints);
        this._pathPoints = newpath.pathPoints;
    }

    /**
     * Looks for a point in the path that matches a given coordinate
     * @param {Coord} coordinate - Coordinate to test for
     * @param {boolean} wantSecond - return the second result, not the first
     * @returns {PathPoint}
     */
    containsPoint(coordinate, wantSecond) {
        for (let pp = 0; pp < this.pathPoints.length; pp++) {
            if (coordsAreEqual(coordinate, this.pathPoints[pp].p, 0.01)) {
                if (wantSecond) wantSecond = false;
                else return this.pathPoints[pp];
            }
        }
        return false;
    }


    // --------------------------------------------------------------
    //  DRAWING
    // --------------------------------------------------------------

    /**
     * Draw a path to a canvas
     * @param {object} lctx - HTML Canvas Context
     * @param {object} view - View object with x / y offset and Zoom
     */
    drawPath(lctx, view) {
        // debug('\n Path.drawPath - START');
        // debug('\t view ' + json(view, true));

        let snap = true;
        if (_GP && _GP.projectSettings) snap = _GP.projectSettings.renderpointssnappedtogrid;

        let currview = getView('Path.drawPath');
        view = view || clone(currview);
        setView(view);

        if (this.pathPoints === false || this.pathPoints.length < 2) return;

        let pp;
        let np;
        let pph2x;
        let pph2y;
        let nxh1x;
        let nxh1y;
        let nxppx;
        let nxppy;

        if (snap) {
            lctx.moveTo(sx_cx(round(this.pathPoints[0].p.x)), sy_cy(round(this.pathPoints[0].p.y)));
        } else {
            lctx.moveTo( sx_cx(this.pathPoints[0].p.x), sy_cy(this.pathPoints[0].p.y));
        }

        for (let cp = 0; cp < this.pathPoints.length; cp++) {
            pp = this.pathPoints[cp];
            // np = this.pathPoints[(cp+1) % this.pathPoints.length];
            np = this.pathPoints[this.getNextPointNum(cp)];

            if (pp.type === 'symmetric') {
                pp.makeSymmetric('h1');
            } else if (pp.type === 'flat') {
                pp.makeFlat('h1');
            }

            // this.validate('DRAW PATH');
            if (snap) {
                pph2x = sx_cx(round(pp.h2.x));
                pph2y = sy_cy(round(pp.h2.y));
                nxh1x = sx_cx(round(np.h1.x));
                nxh1y = sy_cy(round(np.h1.y));
                nxppx = sx_cx(round(np.p.x));
                nxppy = sy_cy(round(np.p.y));
            } else {
                pph2x = sx_cx(pp.h2.x);
                pph2y = sy_cy(pp.h2.y);
                nxh1x = sx_cx(np.h1.x);
                nxh1y = sy_cy(np.h1.y);
                nxppx = sx_cx(np.p.x);
                nxppy = sy_cy(np.p.y);
            }

            // debug('\t curve ' + pph2x +' '+ pph2y +' '+ nxh1x +' '+ nxh1y +' '+ nxppx +' '+ nxppy);
            lctx.bezierCurveTo(pph2x, pph2y, nxh1x, nxh1y, nxppx, nxppy);
        }

        setView(currview);
        // debug(' Path.drawPath - END\n');
    }


    // --------------------------------------------------------------
    //  TRANSLATE TO OTHER LANGUAGES
    // --------------------------------------------------------------

    /**
     * Converts this path to Post Script
     * @param {number} lastx - Last x value in the sequence
     * @param {number} lasty - Last y value in the sequence
     * @returns {string}
     */
    makePathPostScript(lastx = 0, lasty = 0) {
        if (!this.pathPoints) {
            return {'re': '', 'lastx': lastx, 'lasty': lasty};
        }

        let p1;
        let p2;
        let p1h2x;
        let p1h2y;
        let p2h1x;
        let p2h1y;
        let p2ppx;
        let p2ppy;
        let trr = '';
        let re = '\t\t\t\t' + (this.pathPoints[0].p.x - lastx) + ' ' + (this.pathPoints[0].p.y - lasty) + ' rmoveto \n';

        // debug('makePathPostScript:\n\t ' + re);
        for (let cp = 0; cp < this.pathPoints.length; cp++) {
            p1 = this.pathPoints[cp];
            // p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
            p2 = this.pathPoints[this.getNextPointNum(cp)];
            p1h2x = p1.h2.x - p1.p.x;
            p1h2y = p1.h2.y - p1.p.y;
            p2h1x = p2.h1.x - p1.h2.x;
            p2h1y = p2.h1.y - p1.h2.y;
            p2ppx = p2.p.x - p2.h1.x;
            p2ppy = p2.p.y - p2.h1.y;
            trr = '\t\t\t\t' + p1h2x + ' ' + p1h2y + ' ' + p2h1x + ' ' + p2h1y + ' ' + p2ppx + ' ' + p2ppy + ' rrcurveto \n';
            // debug('\t ' + trr);
            re += trr;
        }

        return {
            're': re,
            'lastx': p2.p.x,
            'lasty': p2.p.y,
        };
    }

    /**
     * Create SVG data
     * @param {string} glyphName - Name of the glyph this path belongs to
     * @returns {string}
     */
    makeSVGPathData(glyphName = 'not specified') {
        // debug('\n Path.makeSVGPathData - START');
        // debug('\t Glyph ' + glyphName);
        // debug('\t this.pathPoints: ' + json(this.pathPoints, true));

        if (!this.pathPoints || !this.pathPoints.length) {
            return '';
        }

        let roundValue = 8;
        if (_GP && _GP.projectSettings && _GP.projectSettings.svgprecision) {
            roundValue = _GP.projectSettings.svgprecision;
        }

        let p1;
        let p2;
        let trr = '';
        let re = 'M' + round(this.pathPoints[0].p.x, roundValue) + ',' + round(this.pathPoints[0].p.y, roundValue);

        // debug('makePathPostScript:\n\t ' + re);
        if (re.indexOf('NaN') > -1) {
            console.warn(glyphName + ' PathPoint 0 MOVE has NaN: ' + re);
            // debug(this.pathPoints[0]);
        }

        for (let cp = 0; cp < this.pathPoints.length; cp++) {
            p1 = this.pathPoints[cp];
            // p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
            p2 = this.pathPoints[this.getNextPointNum(cp)];
            trr = ' C' + round(p1.h2.x, roundValue) + ',' + round(p1.h2.y, roundValue) + ',' + round(p2.h1.x, roundValue) + ',' + round(p2.h1.y, roundValue) + ',' + round(p2.p.x, roundValue) + ',' + round(p2.p.y, roundValue);
            // debug('\t ' + trr);
            if (trr.indexOf('NaN') > -1) {
                console.warn(glyphName + ' PathPoint ' + cp + ' has NaN: ' + trr);
            }
            re += trr;
        }

        re += 'Z';

        // debug('\t returning: ' + re);
        // debug('Path.makeSVGPathData - END\n');
        return re;
    }


    /**
     * Export an Opentype.js Path
     * @param {object} otpath - Opentype.js Path object
     * @returns {object}
     */
    makeOpentypeJsPath(otpath) {
        // debug('\n Path.makeOpentypeJsPath - START');
        // debug('\t otpath: ' + json(otpath));
        otpath = otpath || new opentype.Path();

        let p1;
        let p2;
        if (!this.pathPoints) {
            if (this.pathPoints.length === 0) {
                // debug('\t !!!Path has zero points!');
            }
            otpath.close();
            return otpath;
        }

        otpath.moveTo(round(this.pathPoints[0].p.x), round(this.pathPoints[0].p.y));

        for (let cp = 0; cp < this.pathPoints.length; cp++) {
            p1 = this.pathPoints[cp];
            // p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
            p2 = this.pathPoints[this.getNextPointNum(cp)];
            otpath.curveTo(
                round(p1.h2.x),
                round(p1.h2.y),
                round(p2.h1.x),
                round(p2.h1.y),
                round(p2.p.x),
                round(p2.p.y)
            );
        }

        otpath.close();
        // debug('\t returning path ' + json(otpath));
        // debug(' Path.makeOpentypeJsPath - END\n');
        return otpath;
    }

    /**
     * Get a part of the path in Segment format
     * @param {number} num - segment number
     * @returns {Segment}
     */
    getSegment(num = 0) {
        // debug('\n Path.getSegment - START');
        // debug('\t passed ' + num);
        // make a segment

        num = num % this.pathPoints.length;

        // check cache
        if (this._cache.segments && this._cache.segments[num]) {
            return this._cache.segments[num];
        } else {
            this._cache.segments = [];
        }

        // debug('\t validated as ' + num);
        let pp1 = this.pathPoints[num];
        // var pp2 = this.pathPoints[(num+1)%this.pathPoints.length];
        let pp2 = this.pathPoints[this.getNextPointNum(num)];

        let re = new Segment({
            'p1x': pp1.p.x, 'p1y': pp1.p.y,
            'p2x': pp1.h2.x, 'p2y': pp1.h2.y,
            'p3x': pp2.h1.x, 'p3y': pp2.h1.y,
            'p4x': pp2.p.x, 'p4y': pp2.p.y,
        });
        this._cache.segments[num] = re;
        // debug([re, re2]);
        // debug(' Path.getSegment - END\n');

        return re;
    }

    /**
     * Use a quick algorithm to get a segment's length
     * @param {number} num - segment number
     * @returns {number}
     */
    getQuickSegmentLength(num = 0) {
        let re = this.getSegment(num);
        re = re.getQuickLength();
        return re;
    }

    /**
     * PolySegment is an industry-standard way of describing Bezier paths
     * @returns {PolySegment}
     */
    getPolySegment() {
        // debug(`\n Path.getPolySegment - START`);

        let seg = [];
        for (let pp = 0; pp < this.pathPoints.length; pp++) {
            seg.push(this.getSegment(pp));
        }

        let re = new PolySegment({segments: seg});

        // debug(`\t returning`);
        // debug(re);
        // debug(` Path.getPolySegment - END\n\n`);

        return re;
    }


    // --------------------------------------------------------------
    //  CANVAS HELPER FUNCTIONS
    // --------------------------------------------------------------

    /**
     * Looks through path points to see if there is a control point
     * at the designated coordinate
     * @param {number} x - x value to check
     * @param {number} y - y value to check
     * @param {number} targetSize - radius around the point to return true
     * @param {boolean} noHandles - true = only check points
     * @returns {object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
     */
    isOverControlPoint(x, y, targetSize, noHandles) {
        let a = this.pathPoints || [];
        let re = false;
        for (let k = a.length - 1; k >= 0; k--) {
            re = a[k].isOverControlPoint(x, y, targetSize, noHandles);
            if (re) return re;
        }
        return false;
    }

    /**
     * Checks to see if the first point in the path is at a coordinate
     * @param {number} x - x value to check
     * @param {number} y - y value to check
     * @param {number} targetSize - radius around the point to return true
     * @returns {boolean}
     */
    isOverFirstPoint(x = 0, y = 0, targetSize = 3) {
        // debug('\n Path.isOverFirstPoint - START');
        // debug('\t Passed ' + x + '/' + y);
        let a = this.pathPoints[0];
        // debug('\t Checking ' + a.p.x + '/' + a.p.y + ' around ' + targetSize);

        if (!a) return false;

        if (((a.p.x + targetSize) > x) && ((a.p.x - targetSize) < x) &&
            ((a.p.y + targetSize) > y) && ((a.p.y - targetSize) < y)) {
            // debug(' Path.isOverFirstPoint - END - return TRUE\n');
            return true;
        }

        // debug(' Path.isOverFirstPoint - END - return FALSE\n');
        return false;
    }

    /**
     * Finds either the clockwise or counterclockwise winding of a path
     * @param {boolean} secondtry - If the first try fails, do a trick for a second pass
     * @returns {number} - negative = clockwise, positive = counterclockwise, 0 = unknown
     */
    findWinding(secondtry) {
        // debug('\n Path.findWinding - START');
        let j;
        let k;
        let z;
        let count = -1;
        let parr = this.pathPoints;

        if (parr.length === 2) {
            count = parr[1].p.x > parr[0].p.x ? -1 : 1;
        } else if (parr.length > 2) {
            for (let i = 0; i < parr.length; i++) {
                j = (i + 1) % parr.length;
                k = (i + 2) % parr.length;
                z = (parr[j].p.x - parr[i].p.x) * (parr[k].p.y - parr[j].p.y);
                z -= (parr[j].p.y - parr[i].p.y) * (parr[k].p.x - parr[j].p.x);

                if (z < 0) count--;
                else if (z > 0) count++;
            }
        }

        // negative = clockwise
        // positive = counterclockwise
        if (count === 0 && !secondtry) {
            // debug('\t second try...');
            this.reverseWinding();
            count = this.findWinding(true) * -1;
            this.reverseWinding();
        }

        this._winding = count;
        // if(!secondtry) debug(' Path.findWinding - END returning: ' + count + '\n');
        return count;
    }

    /**
     * Reverses the order of the path points in the path,
     * thus reversing the winding
     */
    reverseWinding() {
        // debug('\n Path.reverseWinding - START');
        let ht;
        let pp;

        if (this.pathPoints) {
            for (let i = 0; i < this.pathPoints.length; i++) {
                pp = this.pathPoints[i];
                ht = pp.h1;
                pp.h1 = pp.h2;
                pp.h2 = ht;

                if (pp.h1.use !== pp.h2.use) {
                    pp.h1.use = !pp.h1.use;
                    pp.h2.use = !pp.h2.use;
                }
            }

            this.pathPoints.reverse();
            this.winding *= -1;

            if (this.winding === 0 || !isVal(this.winding)) {
                this.findWinding(true);
            }
        }
        // debug(' Path.reverseWinding - END\n');
    }

    /**
     * Flips a path about a horizontal line
     * @param {number} mid - y value about which to flip
     * @returns {Path} - reference to this path
     */
    flipNS(mid) {
        // debug(`\n Path.flipNS - START`);
        // debug(json(this.save()));
        let startingY = this.y;
        mid = isVal(mid) ? mid : (this.height / 2) + this.maxes.yMin;
        // debug(`\t calculating mid: (height)/2 + ymin = mid: ${this.height}/2 + ${this.maxes.yMin} = ${mid}`);

        for (let e = 0; e < this.pathPoints.length; e++) {
            let pp = this.pathPoints[e];
            pp.p.y += ((mid - pp.p.y) * 2);
            pp.h1.y += ((mid - pp.h1.y) * 2);
            pp.h2.y += ((mid - pp.h2.y) * 2);
        }
        this.y = startingY;
        this.reverseWinding();

        // debug(` Path.flipNS - END\n\n`);
        return this;
    }

    /**
     * Flips a path about a vertical line
     * @param {number} mid - x value about which to flip
     * @returns {Path} - reference to this path
     */
    flipEW(mid) {
        // debug(`\n Path.flipEW - START`);
        // debug(json(this.save()));
        let startingX = this.x;
        mid = isVal(mid) ? mid : (this.width / 2) + this.x;
        // debug(`\t calculating mid: (width)/2 + x = mid: ${this.width}/2 + ${this.x} = ${mid}`);

        for (let e = 0; e < this.pathPoints.length; e++) {
            let pp = this.pathPoints[e];
            pp.p.x += ((mid - pp.p.x) * 2);
            pp.h1.x += ((mid - pp.h1.x) * 2);
            pp.h2.x += ((mid - pp.h2.x) * 2);
        }
        this.x = startingX;
        this.reverseWinding();

        // debug(` Path.flipEW - END\n\n`);
        return this;
    }

    /**
     * Adds a Path Point to the beginning of this path
     * @param {PathPoint} newpp - Path Point to add
     * @returns {PathPoint} - reference to the added point
     */
    addPathPoint(newpp) {
        // debug('\n Path.addPathPoint - START');
        // debug('\t newpp = ' + newpp);

        newpp.parentPath = this;
        this.pathPoints.push(newpp);
        let re = this.selectPathPoint(this.pathPoints.length - 1);

        this.findWinding();
        // debug('\t calling calcMaxes');
        this.changed();
        // debug(' Path.addPathPoint - END - returning ' + re + '\n');

        return re;
    }

    /**
     * Add a Path Point along a curve at a certain distance
     * @param {number} t - decimal from 0 to 1 representing how far along the curve to split
     * @param {number} pointnum - point number before the new split
     * @returns {PathPoint} - reference to the added path point
     */
    insertPathPoint(t, pointnum) {
        let pp1i = pointnum || 0;
        let pp1 = (pp1i === false ? this.pathPoints[0] : this.pathPoints[pp1i]);
        // var pp2i = (pp1i+1)%this.pathPoints.length;
        let pp2i = this.getNextPointNum(pp1i);
        let pp2 = this.pathPoints[pp2i];
        let nP;
        let nH1;
        let nH2;
        let ppn;

        if (this.pathPoints.length > 1) {
            let splits = this.getSegment(pp1i).split(t);
            let s1 = splits[0];
            let s2 = splits[1];

            // New Point
            nP = new Coord({x: s1.p4x, y: s1.p4y});
            nH1 = new Handle({point: new Coord({x: s1.p3x, y: s1.p3y})});
            nH2 = new Handle({point: new Coord({x: s2.p2x, y: s2.p2y})});
            ppn = new PathPoint({P: nP, H1: nH1, H2: nH2, type: 'flat'});
            ppn.roundAll();

            // Update P1
            if (pp1.type === 'symmetric') pp1.type = 'flat';
            pp1.h2.x = s1.p2x;
            pp1.h2.y = s1.p2y;
            pp1.roundAll();

            // Update P2
            if (pp2.type === 'symmetric') pp2.type = 'flat';
            pp2.h1.x = s2.p3x;
            pp2.h1.y = s2.p3y;
            pp2.roundAll();
        } else {
            // just make a random point
            let d = 100;
            nP = new Coord({'x': pp1.p.x + d, 'y': pp1.p.y + d});
            nH1 = new Coord({'x': pp1.h2.x + d, 'y': pp1.h2.y + d});
            nH2 = new Coord({'x': pp1.h1.x + d, 'y': pp1.h1.y + d});
            ppn = new PathPoint({'p': nP, 'h1': nH1, 'h2': nH2, 'type': pp1.type});
        }

        // Insert
        ppn.parentPath = this;
        this.pathPoints.splice(pp2i, 0, ppn);
        // this.selectPathPoint(pp2i);
        this.changed();

        return ppn;
    }

    /**
     * Given a target coordinate, find the closes point on this path
     * @param {Coord} coord - x/y value to target
     * @param {boolean} wantsecond - return the second result
     * @returns {object}
     */
    getClosestPointOnCurve(coord = new Coord(), wantsecond = false) {
        let grains = 10000;
        let first = false;
        let second = false;
        let mindistance = 999999999;
        let check;
        let d;

        for (let pp = 0; pp < this.pathPoints.length; pp++) {
            // grains = this._cache.segmentlengths[pp] * 100;
            grains = this.getSegment(pp).getQuickLength() * 100;

            for (let t = 0; t < 1; t += (1 / grains)) {
                check = this.getCoordFromSplit(t, pp);
                d = Math.sqrt(
                    ((check.x - coord.x) * (check.x - coord.x)) +
                    ((check.y - coord.y) * (check.y - coord.y))
                );

                if (d < mindistance) {
                    if (first && first.point !== pp) second = clone(first);

                    mindistance = d;
                    first = {
                        'point': pp,
                        'split': t,
                        'distance': d,
                        'x': check.x,
                        'y': check.y,
                    };
                }
            }
        }
        return wantsecond ? second : first;
    }

    /**
     * Get an X/Y value from a curve split
     * @param {number} t - decimal from 0 to 1 how far along the curve to split
     * @param {number} pointnum - after which point to split
     * @returns {Coord}
     */
    getCoordFromSplit(t, pointnum = 0) {
        if (this.pathPoints.length > 1) {
            let seg = this.getSegment(pointnum);
            return seg.getCoordFromSplit(t);
        } else {
            return this.pathPoints[0].p;
        }
    }

    /**
     * Selects a point on this curve
     * @param {number} index - point to select
     * @returns {PathPoint} - reference to the selected point
     */
    selectPathPoint(index) {
        index = parseInt(index);

        if (index === false) return false;

        if (index === -1) {
            index = this.pathPoints.length - 1;
        } else {
            index = Math.abs(index);
        }

        index = index % this.pathPoints.length;

        if (_UI.multiSelect) _UI.multiSelect.points.select(this.pathPoints[index]);

        return this.pathPoints[index];
    }


    // ----------------------------------
    // Calc Maxes
    // ----------------------------------

    /**
     * Find the bounding box for this path
     */
    calcMaxes() {
        // debug('\n Path.calcMaxes - START');
        // debug('\t before ' + json(this._maxes, true));
        this._maxes = clone(_UI.mins);
        let seg;
        let tbounds;

        for (let s = 0; s < this.pathPoints.length; s++) {
            // debug('\t ++++++ starting seg ' + s);
            seg = this.getSegment(s);
            tbounds = seg.maxes;
            // debug('\t tseg maxes ' + json(tbounds, true));
            // debug('\t this maxes ' + json(this._maxes, true));
            this._maxes = getOverallMaxes([this._maxes, tbounds]);
            // debug('\t path maxes is now ' + json(this._maxes, true));
            this._cache.segments[s] = seg;
            // debug('\t ++++++ ending seg ' + s);
        }

        this._maxes.xMax = round(this._maxes.xMax, 4);
        this._maxes.xMin = round(this._maxes.xMin, 4);
        this._maxes.yMax = round(this._maxes.yMax, 4);
        this._maxes.yMin = round(this._maxes.yMin, 4);
        // debug('\t afters ' + json(this.maxes, true));
        // debug(' Path.calcMaxes - END\n');
    }

    /**
     * Looks through the whole path and sets erronious values to 0
     * @param {string} calledBy - message for who called this
     */
    validate(calledBy) {
        let tp;
        for (let pp = 0; pp < this.pathPoints.length; pp++) {
            tp = this.pathPoints[pp];
            if (!tp.p.x && tp.p.x !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} P.x from ${tp.p.x}`);
                tp.p.x = 0;
            }
            if (!tp.p.y && tp.p.y !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} P.y from ${tp.p.y}`);
                tp.p.y = 0;
            }
            if (!tp.h1.x && tp.h1.x !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} H1.x from ${tp.h1.x}`);
                tp.h1.x = 0;
            }
            if (!tp.h1.y && tp.h1.y !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} H1.y from ${tp.h1.y}`);
                tp.h1.y = 0;
            }
            if (!tp.h2.x && tp.h2.x !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} H2.x from ${tp.h2.x}`);
                tp.h2.x = 0;
            }
            if (!tp.h2.y && tp.h2.y !== 0) {
                // debug(`VALIDATE PATH: ${calledBy} - resetting point ${pp} H2.y from ${tp.h2.y}`);
                tp.h2.y = 0;
            }
            tp.roundAll();
        }
    }

    /**
     * Checks all the data for NaN
     * @returns {boolean}
     */
    checkForNaN() {
        for (let pp = 0; pp < this.pathPoints.length; pp++) {
            let tp = this.pathPoints[pp];
            if (isNaN(tp.p.x) || isNaN(tp.p.y) ||
                isNaN(tp.h1.x) || isNaN(tp.h1.y) ||
                isNaN(tp.h2.x) || isNaN(tp.h2.y)) {
                return true;
            }
        }
        return false;
    }
}


// --------------------------------------------------------------
// Boolean Combine
// --------------------------------------------------------------

/**
 * Fin overlaps between two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array}
 */
export function findPathIntersections(p1, p2) {
    debug('\n findPathIntersections - START');
    let intersects = [];

    // Find overlaps at boundaries
    intersects = intersects.concat(findPathPointIntersections(p1, p2));

    intersects = intersects.concat(findPathPointBoundaryIntersections(p1, p2));

    intersects = intersects.filter(duplicates);
    debug('\t intersections after boundary detection');
    debug(intersects);

    // Maxes within boundaries
    if (!maxesOverlap(p1.maxes, p2.maxes)) {
        debug(' findPathIntersections - paths dont\'t overlap - END\n');
        debug(p1.maxes);
        debug(p2.maxes);
        return intersects;
    }

    // Continue with recursive overlap detection
    let bs;
    let ts;
    let segoverlaps = [];

    /**
     * Quicly find if two segments could overlap by checking
     * their bounding boxes
     * @param {Path} p1 - first path
     * @param {PathPoint} p1p - first path point
     * @param {Path} p2 - second path
     * @param {PathPoint} p2p - second path point
     */
    function pushSegOverlaps(p1, p1p, p2, p2p) {
        debug('\t pushSegOverlaps - p1p ' + p1p + ' - p2p ' + p2p);
        bs = p1.getSegment(p1p);
        ts = p2.getSegment(p2p);


        if (maxesOverlap(bs.getFastMaxes(), ts.getFastMaxes())) {
            debug('\t\t pushed!');
            // bs.drawSegmentOutline();
            // ts.drawSegmentOutline();
            segoverlaps.push({'bottom': bs, 'top': ts});
        }
    }

    // Find overlaps within a single segment -- don't care about this case
    // Find overlaps within a single path -- don't care about this case

    // Find overlaps between two paths
    for (let bpp=0; bpp < p1.pathPoints.length; bpp++) {
        for (let tpp=0; tpp < p2.pathPoints.length; tpp++) {
            pushSegOverlaps(p1, bpp, p2, tpp);
        }
    }

    debug('\t segoverlaps are now:');
    segoverlaps.forEach((element) => {
        debug(`bottom:\n${element.bottom.print()}\ntop:\n${element.top.print()}`);
    });

    // Use overlaps to find intersections
    let re = [];
    for (let v=0; v<segoverlaps.length; v++) {
        debug('\n\t SEGOVERLAPS ' + v);
        re = findSegmentIntersections(segoverlaps[v].bottom, segoverlaps[v].top, 0);
        if (re.length > 0) {
            intersects = intersects.concat(re);
        }
        debug('\t intersects is now');
        debug(intersects);
    }

    debug('\t pre filter ' + intersects);
    intersects = intersects.filter(duplicates);

    debug('\t returning ' + intersects);
    debug(' findPathIntersections - END\n');
    return intersects;
}

/**
 * Collects instances of path points being on a bounding
 * box of the other path
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array}
 */
export function findPathPointBoundaryIntersections(p1, p2) {
    let re = [];

    /**
     * Check points in a path against the bounding box of another path
     * @param {Path} chk - first point to check
     * @param {Path} against - check against these maxes
     */
    function check(chk, against) {
        let m = against.maxes;
        let tpp;
        for (let pp=0; pp<chk.pathPoints.length; pp++) {
            tpp = chk.pathPoints[pp];
            if ( (tpp.p.x === m.xMin) || (tpp.p.x === m.xMax) ||
                (tpp.p.y === m.yMin) || (tpp.p.y === m.yMax) ) {
                // if (against.isHere(sx_cx(tpp.p.x), sy_cy(tpp.p.y))) {
                if (against.isHere(tpp.p.x, tpp.p.y)) {
                    re.push(''+tpp.p.x+'/'+tpp.p.y);
                }
            }
        }
    }

    check(p1, p2);
    check(p2, p1);

    re = re.filter(duplicates);

    return re;
}

/**
 * Finds x/y overlaps between any points given two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array} - collection of strings representing coordinates
 */
export function findPathPointIntersections(p1, p2) {
    // debug('\n findPathPointIntersections - START');
    let re = [];
    let ix;

    // debug(p1.toString());
    // debug(p2.toString());

    for (let pp1=0; pp1<p1.pathPoints.length; pp1++) {
        for (let pp2=0; pp2<p2.pathPoints.length; pp2++) {
            if (coordsAreEqual(p1.pathPoints[pp1].p, p2.pathPoints[pp2].p, 0.01)) {
                ix = ''+p1.pathPoints[pp1].p.x+'/'+p1.pathPoints[pp1].p.y;
                // debug(`\t found ${ix}`);

                re.push(ix);
            }
        }
    }

    re = re.filter(duplicates);

    // debug('\t returning ' + re);
    // debug(' findPathPointIntersections - END\n');
    return re;
}
