import GlyphElement from './glyphelement.js';
import Path from './path.js';
import PathPoint from './pathpoint.js';
import Coord from './coord.js';
import {findPathIntersections} from './path.js';
import {ixToCoord} from './segment.js';
import {strSan, clone, isVal, round} from '../app/functions.js';

export {rectPathFromMaxes, ovalPathFromMaxes, addShape,
    turnSelectedShapeIntoAComponent, getClickedShape, isOverShape,
    combineShapes, combineTwoShapes};

/**
 * Object > Shape
 * The Shape object is the high level object that
 * represents an outline.  The Glyph object treats
 * Shape objects and Component Instance objects
 * interchangeably - any method added to Shape
 * should also be added to Component Instance.
 */
export default class Shape extends GlyphElement {
    /**
     * Create a Shape
     * @param {string} name
     * @param {Path} path
     * @param {boolean} xLock
     * @param {boolean} yLock
     * @param {boolean} wLock
     * @param {boolean} hLock
     * @param {boolean} ratioLock
     */
    constructor({
        name = 'Shape',
        path = [],
        visible = true,
        xLock = false,
        yLock = false,
        wLock = false,
        hLock = false,
        ratioLock = false,
    } = {}) {
        super();
        this.name = name;
        this.path = path;
        this.visible = visible;
        this.xLock = xLock;
        this.yLock = yLock;
        this.wLock = wLock;
        this.hLock = hLock;
        this.ratioLock = ratioLock;
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
            path: this.path.save(verbose),
        };

        if (this.name !== 'Shape') re.name = this.name;
        // if (!this.visible) re.visible = this.visible;
        if (this.xLock) re.xLock = this.xLock;
        if (this.yLock) re.yLock = this.yLock;
        if (this.wLock) re.wLock = this.wLock;
        if (this.hLock) re.hLock = this.hLock;
        if (this.ratioLock) re.ratioLock = this.ratioLock;

        if (!verbose) delete re.objType;

        return re;
    }

    /**
     * Reset the cache and calculate dimensions
     */
    changed() {
        this.path.changed();
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * get name
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * get path
     * @returns {Path}
     */
    get path() {
        return this._path;
    }

    /**
     * get visible
     * @returns {boolean}
     */
    get visible() {
        return this._visible;
    }

    /**
     * get xLock
     * @returns {boolean}
     */
    get xLock() {
        return this._xLock;
    }

    /**
     * get yLock
     * @returns {boolean}
     */
    get yLock() {
        return this._yLock;
    }

    /**
     * get wLock
     * @returns {boolean}
     */
    get wLock() {
        return this._wLock;
    }

    /**
     * get hLock
     * @returns {boolean}
     */
    get hLock() {
        return this._hLock;
    }

    /**
     * get ratioLock
     * @returns {boolean}
     */
    get ratioLock() {
        return this._ratioLock;
    }

    /**
     * Get X possition
     * @returns {number}
     */
    get x() {
        return this.maxes.xMin;
    }

    /**
     * Get Y possition
     * @returns {number}
     */
    get y() {
        return this.maxes.yMax;
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
     * Get Height
     * @returns {number}
     */
    get height() {
        let h = this.maxes.yMax - this.maxes.yMin;
        return Math.max(h, 0);
    }

    /**
     * get maxes
     * @returns {boolean}
     */
    get maxes() {
        return this.path.maxes;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * set name
     * @param {string} name
     * @returns {Shape} - reference to this Shape
     */
    set name(name) {
        name = strSan(name);
        // debug('\t sanitized: ' + name);
        if (name !== '') {
            this._name = name;
        } else {
            showToast('Invalid shape name - shape names must only contain alphanumeric characters or spaces.');
        }

        return this;
    }

    /**
     * set path
     * @param {boolean} path
     * @returns {Shape} - reference to this Shape
     */
    set path(path) {
        this._path = new Path(path);
        return this;
    }

    /**
     * set visible
     * @param {boolean} visible
     * @returns {Shape} - reference to this Shape
     */
    set visible(visible) {
        this._visible = !!visible;
        return this;
    }

    /**
     * set xLock
     * @param {boolean} xLock
     * @returns {Shape} - reference to this Shape
     */
    set xLock(xLock) {
        this._xLock = !!xLock;
        return this;
    }

    /**
     * set yLock
     * @param {boolean} yLock
     * @returns {Shape} - reference to this Shape
     */
    set yLock(yLock) {
        this._yLock = !!yLock;
        return this;
    }

    /**
     * set wLock
     * @param {boolean} wLock
     * @returns {Shape} - reference to this Shape
     */
    set wLock(wLock) {
        this._wLock = !!wLock;
        return this;
    }

    /**
     * set hLock
     * @param {boolean} hLock
     * @returns {Shape} - reference to this Shape
     */
    set hLock(hLock) {
        this._hLock = !!hLock;
        return this;
    }

    /**
     * set ratioLock
     * @param {boolean} ratioLock
     * @returns {Shape} - reference to this Shape
     */
    set ratioLock(ratioLock) {
        this._ratioLock = !!ratioLock;
        return this;
    }

    /**
     * Set X possition
     * @param {number} x
     * @returns {Shape} - reference to this Shape
     */
    set x(x) {
        this.setShapePosition(x, false);
        return this;
    }

    /**
     * Set Y possition
     * @param {number} y
     * @returns {Shape} - reference to this Shape
     */
    set y(y) {
        this.setShapePosition(false, y);
        return this;
    }

    /**
     * Set Width
     * @param {number} w
     * @returns {Shape} - reference to this Shape
     */
    set width(w) {
        this.setShapeSize(w, false);
        return this;
    }

    /**
     * Set Height
     * @param {number} h
     * @returns {Shape} - reference to this Shape
     */
    set height(h) {
        this.setShapeSize(false, h);
        return this;
    }


    // --------------------------------------------------------------
    // Export to different languages
    // --------------------------------------------------------------

    /**
     * Make SVG from this Shape
     * @param {number} size - how big
     * @param {number} gutter - margin
     * @returns {string} - svg
     */
    makeSVG(size = 50, gutter = 10) {
        let upm = 1000;
        let desc = 300;

        if (_GP && _GP.projectSettings) {
            upm = _GP.projectSettings.upm;
            desc = upm - _GP.projectSettings.ascent;
        }

        let charscale = (size - (gutter * 2)) / size;
        let gutterscale = (gutter / size) * upm;
        let vbsize = upm - (gutter * 2);
        let re = '<svg version="1.1" ';
        re += 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
        re += 'width="' + size + '" height="' + size + '" viewBox="0,0,' + vbsize + ',' + vbsize + '">';
        re += '<g transform="translate(' + (gutterscale) + ',' + (upm - desc - (gutterscale / 2)) + ') scale(' + charscale + ',-' + charscale + ')">';
        // re += '<rect x="0" y="-'+desc+'" height="'+desc+'" width="1000" fill="lime"/>';
        // re += '<rect x="0" y="0" height="'+(upm-desc)+'" width="1000" fill="cyan"/>';
        re += '<path d="';
        re += this.path.svgPathData;
        re += '"/>';
        re += '</g>';
        re += '</svg>';
        return re;
    }

    /**
     * Make a PostScript path from this shape
     * PostScript paths use relative MoveTo commands, so
     * this shape must know about where the last shape left off
     * @param {number} lastx - x from previous path
     * @param {number} lasty - y from previous path
     * @returns {string} - PostScript path data
     */
    makePostScript(lastx = 0, lasty = 0) {
        return this.path ? this.path.makePathPostScript(lastx, lasty) : {'re': '', 'lastx': lastx, 'lasty': lasty};
    }

    /**
     * Make an Opentype.js Path
     * @param {opentype.Path} otpath
     * @returns {opentype.Path}
     */
    makeOpentypeJsPath(otpath) {
        return this.path.makeOpentypeJsPath(otpath);
    }


    // --------------------------------------------------------------
    // Parity methods, shared between Shapes and ComponentInstances
    // --------------------------------------------------------------

    /**
     * Call path.updatePathPosition
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     * @returns {Shape} - reference to this shape
     */
    updateShapePosition(dx = 0, dy = 0) {
        this.path.updatePathPosition(dx, dy);
        return this;
    }

    /**
     * Call path.setPathPosition
     * @param {number} nx - new x value
     * @param {number} ny - new y value
     * @returns {Shape} - reference to this shape
     */
    setShapePosition(nx = false, ny = false) {
        this.path.setPathPosition(nx, ny);
        return this;
    }

    /**
     * Call path.updatePathSize
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratioLock - maintain aspect ratio
     * @returns {Shape} - reference to this shape
     */
    updateShapeSize(dw = 0, dh = 0, ratioLock = false) {
        this.path.updatePathSize(dw, dh, ratioLock);
        return this;
    }

    /**
     * Call path.setPathSize
     * @param {number} nw - new width
     * @param {number} nh - new height
     * @param {boolean} ratioLock - maintain aspect ratio
     * @returns {Shape} - reference to this shape
     */
    setShapeSize(nw = false, nh = false, ratioLock = false) {
        this.path.setPathSize(nw, nh, ratioLock);
        return this;
    }

    /**
     * Call path.isOverControlPoint
     * @param {number} x - x value to check
     * @param {number} y - y value to check
     * @param {number} targetSize - radius around the point to return true
     * @param {boolean} noHandles - true = only check points
     * @returns {object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
     */
    isOverControlPoint(x, y, targetSize, noHandles) {
        return this.path.isOverControlPoint(x, y, targetSize, noHandles);
    }

    /**
     * Call path.flipEW
     * @param {number} mid - x value about which to flip
     * @returns {Shape} - reference to this shape
     */
    flipEW(mid = this.getCenter().x) {
        this.path.flipEW(mid);
        return this;
    }

    /**
     * Call path.flipNS
     * @param {number} mid - y value about which to flip
     * @returns {Shape} - reference to this shape
     */
    flipNS(mid = this.getCenter().y) {
        this.path.flipNS(mid);
        return this;
    }

    /**
     * Call path.rotate
     * @param {number} angle - how much to rotate
     * @param {Coord} about - x/y center of rotation
     * @returns {Shape} - reference to this shape
     */
    rotate(angle, about) {
        // debug('\n Shape.rotate - START');
        about = about || this.getCenter();
        // debug('\t first p[0].p.x ' + this.path.pathPoints[0].p.x);
        // debug(' Shape.rotate - END\n');
        this.path.rotate(angle, about);
        return this;
    }

    /**
     * Call path.getCenter
     * @returns {Coord}
     */
    getCenter() {
        return this.path.getCenter();
    }

    /**
     * Call path.reverseWinding
     */
    reverseWinding() {
        this.path.reverseWinding();
    }

    /**
     * Call path.calcMaxes
     */
    calcMaxes() {
        this.path.calcMaxes();
    }

    /**
     * Call path.getSegment
     * @param {number} num - which segment to get
     * @returns {Segment}
     */
    getSegment(num) {
        return this.path.getSegment(num);
    }

    /**
     * Call path.isHere
     * @param {number} px - check x
     * @param {number} py - check y
     * @returns {boolean}
     */
    isHere(px, py) {
        return this.path.isHere(px, py);
    }

    // --------------------------------------------------------------
    // Boolean Combine
    // --------------------------------------------------------------

    /**
     * Converts this Shape to a PolySegment to look for self-overlaps.
     * @returns {array} - new collection of shapes that are separated
     *                    versions of the original shape
     */
    resolveSelfOverlaps() {
        // debug('\n Shape.resolveSelfOverlaps - START');
        // Add self intersects to path
        let polyseg = this.path.getPolySegment();
        let ix = polyseg.findIntersections();
        // debug('\t intersections');
        // debug(json(ix, true));

        if (ix.length === 0) return new Shape(clone(this));

        let segnum = polyseg.segments.length;
        let threshold = 0.01;
        polyseg.splitSegmentsAtIntersections(ix, threshold);
        if (segnum === polyseg.segments.length) return new Shape(clone(this));

        // debug('\t before filtering ' + polyseg.segments.length);
        polyseg.removeZeroLengthSegments();
        polyseg.removeDuplicateSegments();
        polyseg.removeSegmentsOverlappingShape(this);
        polyseg.removeRedundantLineSegments();
        polyseg.removeNonConnectingSegments();
        // debug('\t afters filtering ' + polyseg.segments.length);
        if (_UI.devMode) polyseg.drawPolySegmentOutline();
        // var reshapes = [];
        // reshapes.push(new Shape({'name':this.name, 'path':polyseg.getPath()}));

        let resegs = polyseg.stitchSegmentsTogether();
        let reshapes = [];
        let psn;
        for (let ps = 0; ps < resegs.length; ps++) {
            psn = resegs[ps];
            if (psn.segments.length > 1) reshapes.push(new Shape({'name': this.name, 'path': psn.getPath()}));
        }

        // debug(' Shape.resolveSelfOverlaps - END\n');
        return reshapes;
    }


    // --------------------------------------------------------------
    // Drawing
    // --------------------------------------------------------------

    /**
     * Draw this Shape to a canvas
     * @param {object} lctx - canvas context
     * @param {view} view
     * @returns {boolean}
     */
    drawShape(lctx, view) {
        // debug('\n Shape.drawShape - START');
        // debug('\t view ' + json(view, true));
        if (this.visible) {
            if ((this.path.maxes.xMax === -1) &&
                (lctx === _UI.glyphEditCTX) &&
                (_UI.selectedTool !== 'newpath')) {
                this.calcMaxes();
            }
            this.path.drawPath(lctx, view);
        }
        // debug(' Shape.drawShape - returning true by default - END\n');
        return true;
    }

    /**
     * Draws the segment version of this shape
     * for debugging purposes
     */
    drawSegments() {
        let segs = this.path.getPolySegment();
        segs.slowlyDrawSegments();
    }


    // --------------------------------------------------------------
    // Checking
    // --------------------------------------------------------------

    /**
     * Checks for any NaN
     * @returns {boolean}
     */
    checkForNaN() {
        return this.path.checkForNaN();
    }


/* NEEDS REFACTORING - NO NEED TO DUPLICATE THESE METHODS HERE

    draw_PathOutline(accent, thickness) {
        // debug('\n Shape.draw_PathOutline - START');
        accent = accent || _UI.colors.blue;
        thickness = thickness || 1;
        draw_PathOutline(this, accent, thickness);
    }

    draw_BoundingBox(accent, thickness) {
        // debug('\n Shape.draw_BoundingBox - START');
        accent = accent || _UI.colors.blue;
        thickness = thickness || 1;
        draw_BoundingBox(this.path.maxes, accent, thickness);
    }

    draw_BoundingBoxHandles(accent, thickness) {
        // debug('\n Shape.draw_BoundingBoxHandles - START');
        accent = accent || _UI.colors.blue;
        thickness = thickness || 1;
        draw_BoundingBoxHandles(this.path.maxes, accent, thickness);
    }

    isOverBoundingBoxHandle(px, py) {
        // debug('\n Shape.isOverBoundingBoxHandle - START');
        let c = isOverBoundingBoxHandle(px, py, this.maxes);
        // debug('\t Shape.isOverBoundingBoxHandle returning ' + c);
        return c;
    }
*/
}


// --------------------------------------------------------------
// Helper functions
// --------------------------------------------------------------


// --------------------------------------------------------------
// New Shape
// --------------------------------------------------------------

/**
 * Create a new rectangle from a Maxes object
 * @param {Maxes} maxes
 * @returns {Path}
 */
function rectPathFromMaxes(maxes) {
    // Default Shape size
    let lx = 0;
    let ty = 700;
    let rx = 100;
    let by = 0;

    if (_GP && _GP.projectSettings) {
        ty = _GP.projectSettings.ascent;
        rx = (_GP.projectSettings.upm / _GP.projectSettings.griddivisions);
    }

    if (maxes) {
        lx = maxes.xMin;
        ty = maxes.yMax;
        rx = maxes.xMax;
        by = maxes.yMin;
    }

    let qw = round((rx-lx)/4);
    let qh = round((ty-by)/4);

    // First Point
    let Pul = new Coord({'x': lx, 'y': ty});
    let H1ul = new Coord({'x': lx, 'y': (ty-qh)});
    let H2ul = new Coord({'x': (lx+qw), 'y': ty});

    // Second Point
    let Pur = new Coord({'x': rx, 'y': ty});
    let H1ur = new Coord({'x': (rx-qw), 'y': ty});
    let H2ur = new Coord({'x': rx, 'y': (ty-qh)});

    // Third Point
    let Plr = new Coord({'x': rx, 'y': by});
    let H1lr = new Coord({'x': rx, 'y': (by+qh)});
    let H2lr = new Coord({'x': (rx-qw), 'y': by});

    // Fourth Point
    let Pll = new Coord({'x': lx, 'y': by});
    let H1ll = new Coord({'x': (lx+qw), 'y': by});
    let H2ll = new Coord({'x': lx, 'y': (by+qh)});

    let patharr = [];
    patharr[0] = new PathPoint({'p': Pul, 'h1': H1ul, 'h2': H2ul});
    patharr[1] = new PathPoint({'p': Pur, 'h1': H1ur, 'h2': H2ur});
    patharr[2] = new PathPoint({'p': Plr, 'h1': H1lr, 'h2': H2lr});
    patharr[3] = new PathPoint({'p': Pll, 'h1': H1ll, 'h2': H2ll});

    let rp = new Path({'pathPoints': patharr, 'leftx': lx, 'rightx': rx, 'topy': ty, 'bottomy': by});
    // debug('RETURNING PATH: ' + JSON.stringify(rp));

    return rp;
}

/**
 * Create a new oval from a Maxes object
 * @param {Maxes} maxes
 * @returns {Path}
 */
function ovalPathFromMaxes(maxes) {
    maxes = maxes || {};

    // Default Circle size
    let lx = isVal(maxes.xMin)? maxes.xMin : 0;
    let ty = isVal(maxes.yMax)? maxes.yMax : _GP.projectSettings.xheight || 500;
    let rx = isVal(maxes.xMax)? maxes.xMax : _GP.projectSettings.xheight || 500;
    let by = isVal(maxes.yMin)? maxes.yMin : 0;


    let hw = round((rx-lx)/2);
    let hh = round((ty-by)/2);
    let hwd = round(hw*0.448);
    let hhd = round(hh*0.448);

    // First Point - Top
    let Pt = new Coord({'x': (lx+hw), 'y': ty});
    let H1t = new Coord({'x': (lx+hwd), 'y': ty});
    let H2t = new Coord({'x': (rx-hwd), 'y': ty});

    // Second Point - Right
    let Pr = new Coord({'x': rx, 'y': (by+hh)});
    let H1r = new Coord({'x': rx, 'y': (ty-hhd)});
    let H2r = new Coord({'x': rx, 'y': (by-hhd)});

    // Third Point - Bottom
    let Pb = new Coord({'x': (lx+hw), 'y': by});
    let H1b = new Coord({'x': (rx-hwd), 'y': by});
    let H2b = new Coord({'x': (lx+hwd), 'y': by});

    // Fourth Point - Left
    let Pl = new Coord({'x': lx, 'y': (by+hh)});
    let H1l = new Coord({'x': lx, 'y': (by+hhd)});
    let H2l = new Coord({'x': lx, 'y': (ty-hhd)});

    let patharr = [];
    patharr[0] = new PathPoint({'p': Pt, 'h1': H1t, 'h2': H2t, 'type': 'symmetric'});
    patharr[1] = new PathPoint({'p': Pr, 'h1': H1r, 'h2': H2r, 'type': 'symmetric'});
    patharr[2] = new PathPoint({'p': Pb, 'h1': H1b, 'h2': H2b, 'type': 'symmetric'});
    patharr[3] = new PathPoint({'p': Pl, 'h1': H1l, 'h2': H2l, 'type': 'symmetric'});

    return new Path({pathPoints: patharr});
}


// --------------------------------------------------------------
// Button Functions - SHOULD PROBABLY MOVE THIS STUFF
// --------------------------------------------------------------

/**
 * Add a new shape
 * @param {Shape} newshape - shape to add
 * @returns {Shape} - reference to the new Shape
 */
function addShape(newshape) {
    // debug('addShape - START');
    // debug('\t name: ' + newshape.name);
    // debug('\t objType: ' + newshape.objType);

    if (newshape) {
        if (newshape.objType === 'ComponentInstance') {
            // debug('\t is a Component instance');
            _UI.selectedTool = 'shaperesize';
        } else if (newshape.path && (_UI.selectedTool === 'shaperesize')) {
            // debug('\t triggered as true: newshape.path && _UI.selectedTool == shaperesize \n\t NOT calling calcmaxes, okay?');
            // newshape.calcMaxes();
        }
    } else {
        // debug('\t passed null, creating new shape.');
        newshape = new Shape({});
        newshape.name = ('Rectangle ' + ((getSelectedWorkItemShapes().length*1)+1));
    }

    let sg = getSelectedWorkItem();

    sg.shapes.push(newshape);
    _UI.multiSelect.shapes.select(newshape);
    sg.changed();

    _UI.currentPanel = 'npAttributes';

    // debug('\t returns: ' + newshape.name);
    // debug('addShape - END\n');
    return newshape;
}

/**
 * Turns the selected shape into a component
 */
function turnSelectedShapeIntoAComponent() {
    let s = clone(_UI.multiSelect.shapes.getMembers());
    let n = s.length === 1? ('Component ' + s[0].name) : ('Component ' + (countObjectKeys(_GP.components)+1));

    _UI.multiSelect.shapes.deleteShapes();
    let newid = createNewComponent(new Glyph({'shapes': s, 'name': n}));
    insertComponentInstance(newid);
    _UI.selectedTool = 'shaperesize';
    selectShape(getSelectedWorkItemShapes().length-1);
    redraw({calledBy: 'turnSelectedShapeIntoAComponent'});
}

/**
 * Looks at the provided x/y, and returns a shape if it's there
 * @param {number} x - check x
 * @param {number} y - check y
 * @returns {Shape}
 */
function getClickedShape(x, y) {
    // debug('\n getClickedShape - START');
    // debug('\t checking x:' + x + ' y:' + y);

    let ts;
    let sws = getSelectedWorkItemShapes();
    for (let j=(sws.length-1); j>=0; j--) {
        ts = sws[j];
        // debug('\t Checking shape ' + j);

        if (ts.isHere(x, y)) {
            return ts;
        }
    }

    // clickEmptySpace();
    // debug(' getClickedShape - END\n');
    return false;
}

/**
 * Checks to see if there is a Shape here, for hover feedback
 * @param {number} x - check x
 * @param {number} y - check y
 * @returns {boolean}
 */
function isOverShape(x, y) {
    let sws = getSelectedWorkItemShapes();
    for (let j=(sws.length-1); j>=0; j--) {
        if (sws[j].isHere(x, y)) return true;
    }
    return false;
}


// --------------------------------------------------------------
// Boolean Combine
// --------------------------------------------------------------

/**
 * Combine a bunch of shapes into as few shapes as possible
 * @param {array} shapes - array of shapes to combine
 * @param {boolean} donttoast - 'silent' if true
 * @param {boolean} dontresolveoverlaps - faster if true
 * @returns {array} - collection of result shapes
 */
function combineShapes(shapes, donttoast, dontresolveoverlaps) {
    // debug('\n combineShapes - START');
    // debug(shapes);

    let tempshapes = false;

    if (shapes.length <= 1) {
        // debug('\t length=1 - returning what was passed');
        return false;
    } else if (shapes.length === 2) {
        tempshapes = combineTwoShapes(shapes[0], shapes[1], donttoast);
        if (!tempshapes) {
            // debug('\t length=2 - returning what was passed');
            if (!donttoast) showToast('The selected shapes do not have overlapping paths.');
            return false;
        } else {
            tempshapes = [tempshapes];
            // debug('\t length=2 - continuing with tempshapes from combineTwoShapes');
            // debug(tempshapes);
        }
    }


    /**
     * One pass through all the shapes
     * @param {array} arr
     * @returns {array} - collection of combined shapes
     */
    function singlePass(arr) {
        // debug('\n\t SinglePass');
        // debug('\t\t start arr len ' + arr.length);
        let re;
        let newarr = [];
        let didstuff = false;

        for (let outer=0; outer<arr.length; outer++) {
            for (let inner=0; inner<arr.length; inner++) {
            // debug('\t\t testing shape ' + outer + ' and ' + inner);

                if ((outer !== inner) && arr[outer] && arr[inner]) {
                    re = combineTwoShapes(arr[outer], arr[inner], donttoast);

                    // debug('\t\t combineShapes returned ' + (re.length || re));
                    if (re !== false) {
                        newarr.push(re);
                        didstuff = true;
                        arr[outer] = false;
                        arr[inner] = false;
                    }
                }
            }
        }

        newarr = newarr.concat(arr.filter(function(v) {
            return v;
        }));

        // debug('\t singlepass didstuff = ' + didstuff);

        return {'arr': newarr, 'didstuff': didstuff};
    }


    // Sort shapes by winding

    if (!tempshapes) {
        tempshapes = clone(shapes);
        tempshapes.sort(function(a, b) {
            return a.path.winding - b.path.winding;
        });

        // Main collapsing loop
        let looping = true;
        let count = 0;

        while (looping && count < 20) {
            looping = false;

            lr = singlePass(tempshapes);
            looping = lr.didstuff;
            if (!looping && count === 0) {
                if (!donttoast) showToast('The selected shapes do not have overlapping paths.');
                return false;
            }

            tempshapes = lr.arr;
            // debug('\t didstuff ' + lr.didstuff);
            count++;
        }
    }


    // debug(tempshapes);

    let newshapes = [];
    if (dontresolveoverlaps) {
        // debug('\t dontresolveoverlaps is true');
        newshapes = tempshapes;
        // debug('\t newshapes is now ');
        // debug(newshapes);
    } else {
        // debug('\t dontresolveoverlaps is false, tempshapes.length = ' + tempshapes.length);
        // Collapse each shape's overlapping paths
        for (let ts=0; ts<tempshapes.length; ts++) {
            newshapes = newshapes.concat(tempshapes[ts].resolveSelfOverlaps());
        }
        // debug('\t newshapes is now ');
        // debug(newshapes);
    }

    // debug('\t returning');
    // debug(newshapes);

    // debug(' combineShapes - END\n');
    return newshapes;
}

/**
 * Combines two shapes (if possible)
 * @param {Shape} shape1
 * @param {Shape} shape2
 * @returns {Shape} - single result shape, or false if non-overlapping
 */
function combineTwoShapes(shape1, shape2) {
    // debug('\n combineShapes - START');

    // debug(`\t shape 1`);
    // debug(shape1.print());

    // debug(`\t shape 2`);
    // debug(shape2.print());

    // Find intersections
    let intersections = findPathIntersections(shape1.path, shape2.path);

    if (intersections.length < 1) {
        // debug('\t no intersections, returning.');
        return false;
    }

    // debug(`\t found ${intersections.length} intersections`);

    // Insert one intersection into both shapes
    let co = ixToCoord(intersections[0]);
    // debug(`\t chose coord ${co.print()} to start with`);

    let p1 = shape1.path.containsPoint(co);
    let p2 = shape2.path.containsPoint(co);

    if (!p1) {
        // debug(`\t p1.containsPoint returned false, getting closes point on curve`);

        p1 = shape1.path.getClosestPointOnCurve(co);
        p1 = shape1.path.insertPathPoint(p1.split, p1.point);
    }

    if (!p2) {
        // debug(`\t p2.containsPoint returned false, getting closes point on curve`);

        p2 = shape2.path.getClosestPointOnCurve(co);
        p2 = shape2.path.insertPathPoint(p2.split, p2.point);
    }

    p1.customID = 'overlap';
    p2.customID = 'overlap';

    // debug(`\t point 1`);
    // debug(p1.print());

    // debug(`\t point 2`);
    // debug(p2.print());

    /*
        Walk one shape until the overlap point is found
        Flip to the other shape, add all the points
        Flip back to the first shape, add remaining points
    */

    /** get points before overlap
     * @param {Path} path
     * @returns {object}
     */
    function getPointsBeforeOverlap(path) {
        let re = [];
        let pt = {};

        for (let pp=0; pp<path.pathPoints.length; pp++) {
            pt = new PathPoint(path.pathPoints[pp]);

            if (path.pathPoints[pp].customID !== 'overlap') {
                re.push(pt);
            } else {
                return {
                    'points': re,
                    'overlap': pt,
                };
            }
        }
    }

    /**
     * get poitns after overlap
     * @param {Path} path
     * @returns {object}
     */
    function getPointsAfterOverlap(path) {
        let re = [];
        let ov = {};

        for (let pp=0; pp<path.pathPoints.length; pp++) {
            if (path.pathPoints[pp].customID === 'overlap') {
                ov = new PathPoint(path.pathPoints[pp]);

                for (let pa=(pp+1); pa<path.pathPoints.length; pa++) {
                    re.push(new PathPoint(path.pathPoints[pa]));
                }

                return {
                    'points': re,
                    'overlap': ov,
                };
            }
        }
    }

    let s1h1 = getPointsBeforeOverlap(shape1.path);
    let s1h2 = getPointsAfterOverlap(shape1.path);
    let s2h1 = getPointsBeforeOverlap(shape2.path);
    let s2h2 = getPointsAfterOverlap(shape2.path);

    // debug(`\t After getPoints/Before/After/Overlap`);
    // debug(`\t s1h1`);
    // debug(s1h1);
    // debug(`\t s1h2`);
    // debug(s1h2);
    // debug(`\t s2h1`);
    // debug(s2h1);
    // debug(`\t s2h2`);
    // debug(s2h2);

    let newpoints = [];

    newpoints = newpoints.concat(s1h1.points);

    newpoints.push(
        new PathPoint({
            p: s1h1.overlap.p,
            h1: s1h1.overlap.h1,
            h2: s2h1.overlap.h2,
            type: 'corner',
        })
    );

    newpoints = newpoints.concat(s2h2.points);
    newpoints = newpoints.concat(s2h1.points);

    newpoints.push(
        new PathPoint({
            p: s2h1.overlap.p,
            h1: s2h1.overlap.h1,
            h2: s1h2.overlap.h2,
            type: 'corner',
        })
    );

    newpoints = newpoints.concat(s1h2.points);

    // debug(' combineShapes - returning successfully - END\n');

    return new Shape({path: {pathPoints: newpoints}});
}
