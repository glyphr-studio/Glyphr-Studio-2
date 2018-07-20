import XYPoint from '../glyph_elements/xypoint.js';
import Coord from '../glyph_elements/coord.js';
import PathPoint from '../glyph_elements/pathpoint.js';
import Shape from '../glyph_elements/shape.js';
import {findPathIntersections} from '../glyph_elements/path.js';
import {clone, isVal, round} from '../app/functions.js';

export {rectPathFromMaxes, ovalPathFromMaxes, addShape,
    turnSelectedShapeIntoAComponent, getClickedShape, isOverShape,
    combineShapes, combineTwoShapes};


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
    let Pul = {'x': lx, 'y': ty};
    let H1ul = {'x': lx, 'y': (ty-qh)};
    let H2ul = {'x': (lx+qw), 'y': ty};

    // Second Point
    let Pur = {'x': rx, 'y': ty};
    let H1ur = {'x': (rx-qw), 'y': ty};
    let H2ur = {'x': rx, 'y': (ty-qh)};

    // Third Point
    let Plr = {'x': rx, 'y': by};
    let H1lr = {'x': rx, 'y': (by+qh)};
    let H2lr = {'x': (rx-qw), 'y': by};

    // Fourth Point
    let Pll = {'x': lx, 'y': by};
    let H1ll = {'x': (lx+qw), 'y': by};
    let H2ll = {'x': lx, 'y': (by+qh)};

    let patharr = [];
    patharr[0] = {
        'p': {point: new Coord(Pul)},
        'h1': {point: new Coord(H1ul)},
        'h2': {point: new Coord(H2ul)},
    };

    patharr[1] = {
        'p': {point: new Coord(Pur)},
        'h1': {point: new Coord(H1ur)},
        'h2': {point: new Coord(H2ur)},
    };

    patharr[2] = {
        'p': {point: new Coord(Plr)},
        'h1': {point: new Coord(H1lr)},
        'h2': {point: new Coord(H2lr)},
    };

    patharr[3] = {
        'p': {point: new Coord(Pll)},
        'h1': {point: new Coord(H1ll)},
        'h2': {point: new Coord(H2ll)},
    };


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
    let Pt = {'x': (lx+hw), 'y': ty};
    let H1t = {'x': (lx+hwd), 'y': ty};
    let H2t = {'x': (rx-hwd), 'y': ty};

    // Second Point - Right
    let Pr = {'x': rx, 'y': (by+hh)};
    let H1r = {'x': rx, 'y': (ty-hhd)};
    let H2r = {'x': rx, 'y': (by-hhd)};

    // Third Point - Bottom
    let Pb = {'x': (lx+hw), 'y': by};
    let H1b = {'x': (rx-hwd), 'y': by};
    let H2b = {'x': (lx+hwd), 'y': by};

    // Fourth Point - Left
    let Pl = {'x': lx, 'y': (by+hh)};
    let H1l = {'x': lx, 'y': (by+hhd)};
    let H2l = {'x': lx, 'y': (ty-hhd)};

    let patharr = [];
    patharr[0] = {
        'p': {point: new Coord(Pt)},
        'h1': {point: new Coord(H1t)},
        'h2': {point: new Coord(H2t)},
        'type': 'symmetric',
    };

    patharr[1] = {
        'p': {point: new Coord(Pr)},
        'h1': {point: new Coord(H1r)},
        'h2': {point: new Coord(H2r)},
        'type': 'symmetric',
    };

    patharr[2] = {
        'p': {point: new Coord(Pb)},
        'h1': {point: new Coord(H1b)},
        'h2': {point: new Coord(H2b)},
        'type': 'symmetric',
    };

    patharr[3] = {
        'p': {point: new Coord(Pl)},
        'h1': {point: new Coord(H1l)},
        'h2': {point: new Coord(H2l)},
        'type': 'symmetric',
    };


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
    debug('\n combineShapes - START');
    debug(`\t shapes.length ${shapes.length}`);

    let tempshapes = false;

    if (shapes.length <= 1) {
        debug('\t length=1 - returning what was passed');
        return false;
    } else if (shapes.length === 2) {
        tempshapes = combineTwoShapes(shapes[0], shapes[1], donttoast);
        if (!tempshapes) {
            debug('\t length=2 - returning what was passed');
            if (!donttoast) showToast('The selected shapes do not have overlapping paths.');
            return false;
        } else {
            tempshapes = [tempshapes];
            debug('\t length=2 - continuing with tempshapes from combineTwoShapes');
            debug(tempshapes);
        }
    }


    /**
     * One pass through all the shapes
     * @param {array} arr
     * @returns {array} - collection of combined shapes
     */
    function singlePass(arr) {
        debug('\n\t SinglePass');
        debug('\t\t start arr len ' + arr.length);
        let re;
        let newarr = [];
        let didstuff = false;

        for (let outer=0; outer<arr.length; outer++) {
            for (let inner=0; inner<arr.length; inner++) {
            debug('\t\t testing shape ' + outer + ' and ' + inner);

                if ((outer !== inner) && arr[outer] && arr[inner]) {
                    re = combineTwoShapes(arr[outer], arr[inner], donttoast);

                    debug('\t\t combineShapes returned ' + (re.length || re));
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

        debug('\t singlepass didstuff = ' + didstuff);

        return {'arr': newarr, 'didstuff': didstuff};
    }


    // Sort shapes by winding

    if (!tempshapes) {
        tempshapes = [];

        shapes.forEach((shape) => {
            tempshapes.push(new Shape(shape.save()));
        });
        // tempshapes = clone(shapes);

        debug(`\t tempshapes:`);
        tempshapes.forEach((element) => {
            debug(element.print());
        });

        tempshapes.sort(function(a, b) {
            return a.path.winding - b.path.winding;
        });

        // Main collapsing loop
        let looping = true;
        let count = 0;
        let lr;

        while (looping && count < 20) {
            looping = false;

            lr = singlePass(tempshapes);
            looping = lr.didstuff;
            if (!looping && count === 0) {
                if (!donttoast) showToast('The selected shapes do not have overlapping paths.');
                return false;
            }

            tempshapes = lr.arr;
            debug('\t didstuff ' + lr.didstuff);
            count++;
        }
    }


    debug(tempshapes);

    let newshapes = [];
    if (dontresolveoverlaps) {
        debug('\t dontresolveoverlaps is true');
        newshapes = tempshapes;
        debug('\t newshapes is now ');
        debug(newshapes);
    } else {
        debug('\t dontresolveoverlaps is false, tempshapes.length = ' + tempshapes.length);
        // Collapse each shape's overlapping paths
        for (let ts=0; ts<tempshapes.length; ts++) {
            newshapes = newshapes.concat(tempshapes[ts].resolveSelfOverlaps());
        }
        debug('\t newshapes is now ');
        debug(newshapes);
    }

    debug('\t returning');
    debug(newshapes);

    debug(' combineShapes - END\n');
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
    let co = new XYPoint(...intersections[0].split('/'));
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
            p: s1h1.overlap.p.save(),
            h1: s1h1.overlap.h1.save(),
            h2: s2h1.overlap.h2.save(),
            type: 'corner',
        })
    );

    newpoints = newpoints.concat(s2h2.points);
    newpoints = newpoints.concat(s2h1.points);

    newpoints.push(
        new PathPoint({
            p: s2h1.overlap.p.save(),
            h1: s2h1.overlap.h1.save(),
            h2: s1h2.overlap.h2.save(),
            type: 'corner',
        })
    );

    newpoints = newpoints.concat(s1h2.points);

    // debug(' combineShapes - returning successfully - END\n');

    return new Shape({path: {pathPoints: newpoints}});
}
