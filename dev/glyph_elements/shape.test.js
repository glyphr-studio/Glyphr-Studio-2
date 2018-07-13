import Shape from './shape.js';
import Path from './path.js';
import {rectPathFromMaxes, ovalPathFromMaxes, combineShapes, combineTwoShapes} from './shape.js';
import {clone} from '../app/functions.js';


/**
 * A sample shape
 * @returns {Shape}
 */
function sampleShape() {
    return new Shape({path: {pathPoints: clone(_TEST.globals.testPathPoints)}});
}

/**
 * Another sample path
 * @returns {Shape}
 */
function triangleShape() {
    return new Shape({path: {pathPoints: [{p: {x: 100, y: 200}}, {p: {x: 300, y: 600}}, {p: {x: 400, y: 500}}]}});
}

_TEST.testList.push(
    {
        category: 'Shape',
        name: 'get/set name',
        assertion: function() {
            let s = sampleShape();
            s.name = 'new Name';
            return _TEST.is(s.name).equalTo('new Name');
        },
    },
    {
        category: 'Shape',
        name: 'get/set path',
        assertion: function() {
            let s = sampleShape();
            s.path = new Path({pathPoints: [{p: {x: 100, y: 200}}, {p: {x: 300, y: 600}}, {p: {x: 400, y: 500}}]});
            return _TEST.is(s.path.pathPoints[2].p.x).equalTo(400);
        },
    },
    {
        category: 'Shape',
        name: 'get/set visible',
        assertion: function() {
            let s = sampleShape();
            s.visible = false;
            return _TEST.is(s.visible).equalTo(false);
        },
    },
    {
        category: 'Shape',
        name: 'get/set xLock',
        assertion: function() {
            let s = sampleShape();
            s.xLock = true;
            return _TEST.is(s.xLock).equalTo(true);
        },
    },
    {
        category: 'Shape',
        name: 'get/set yLock',
        assertion: function() {
            let s = sampleShape();
            s.yLock = true;
            return _TEST.is(s.yLock).equalTo(true);
        },
    },
    {
        category: 'Shape',
        name: 'get/set wLock',
        assertion: function() {
            let s = sampleShape();
            s.wLock = true;
            return _TEST.is(s.wLock).equalTo(true);
        },
    },
    {
        category: 'Shape',
        name: 'get/set hLock',
        assertion: function() {
            let s = sampleShape();
            s.hLock = true;
            return _TEST.is(s.hLock).equalTo(true);
        },
    },
    {
        category: 'Shape',
        name: 'get/set ratioLock',
        assertion: function() {
            let s = sampleShape();
            s.ratioLock = true;
            return _TEST.is(s.ratioLock).equalTo(true);
        },
    },
    {
        category: 'Shape',
        name: 'get/set x',
        assertion: function() {
            let s = sampleShape();
            s.x = 300;
            return _TEST.is(s.x).equalTo(300);
        },
    },
    {
        category: 'Shape',
        name: 'get/set y',
        assertion: function() {
            let s = sampleShape();
            s.y = 300;
            return _TEST.is(s.y).equalTo(300);
        },
    },
    {
        category: 'Shape',
        name: 'get/set width',
        assertion: function() {
            let s = sampleShape();
            s.width = 100;
            return _TEST.is(s.width).equalTo(100);
        },
    },
    {
        category: 'Shape',
        name: 'get/set height',
        assertion: function() {
            let s = sampleShape();
            s.height = 100;
            return _TEST.is(s.height).equalTo(100);
        },
    },
    {
        category: 'Shape',
        name: 'save',
        assertion: function() {
            let s = sampleShape();
            let re = s.save();
            return _TEST.is(re).equalTo({'path': {'winding': -5, 'pathPoints': [{'p': {'x': 326.65249430318556, 'y': 500}, 'type': 'symmetric', 'h1': {'point': {'x': 239.84504649235828, 'y': 500}, 'use': true}, 'h2': {'point': {'x': 413.45994211401285, 'y': 500}, 'use': true}}, {'p': {'x': 484, 'y': 343.4570087834163}, 'type': 'symmetric', 'h1': {'point': {'x': 484, 'y': 428.9899571029709}, 'use': true}, 'h2': {'point': {'x': 484, 'y': 257.92406046386174}, 'use': true}}, {'p': {'x': 326.65249430318556, 'y': 186}, 'type': 'symmetric', 'h1': {'point': {'x': 414.1548862447006, 'y': 186}, 'use': true}, 'h2': {'point': {'x': 239.15010236167052, 'y': 186}, 'use': true}}, {'p': {'x': 170, 'y': 343.4570087834163}, 'type': 'symmetric', 'h1': {'point': {'x': 170, 'y': 257.0100080446707}, 'use': true}, 'h2': {'point': {'x': 170, 'y': 429.9040095221619}, 'use': true}}]}});
        },
    },
    {
        category: 'Shape',
        name: 'makeSVG',
        assertion: function() {
            let s = sampleShape();
            let re = s.makeSVG();
            return _TEST.is(re).equalTo('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0,0,980,980"><g transform="translate(200,600) scale(0.6,-0.6)"><path d="M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z"/></g></svg>');
        },
    },
    {
        category: 'Shape',
        name: 'makePostScript',
        assertion: function() {
            let s = sampleShape();
            let re = s.makePostScript();
            return _TEST.is(re).equalTo({'re': '\t\t\t\t326.65249430318556 500 rmoveto \n\t\t\t\t86.80744781082728 0 70.54005788598715 -71.01004289702911 0 -85.53294831955458 rrcurveto \n\t\t\t\t0 -85.53294831955458 -69.8451137552994 -71.92406046386174 -87.50239194151504 0 rrcurveto \n\t\t\t\t-87.50239194151504 0 -69.15010236167052 71.01000804467071 0 86.4470007387456 rrcurveto \n\t\t\t\t0 86.4470007387456 69.84504649235828 70.09599047783809 86.80744781082728 0 rrcurveto \n', 'lastX': 326.65249430318556, 'lastY': 500});
        },
    },
    {
        category: 'Shape',
        name: 'makeOpenTypeJsPath',
        assertion: function() {
            let s = sampleShape();
            let re = s.makeOpenTypeJsPath();
            return _TEST.is(re).equalTo({'commands': [{'type': 'M', 'x': 327, 'y': 500}, {'type': 'C', 'x1': 413, 'y1': 500, 'x2': 484, 'y2': 429, 'x': 484, 'y': 343}, {'type': 'C', 'x1': 484, 'y1': 258, 'x2': 414, 'y2': 186, 'x': 327, 'y': 186}, {'type': 'C', 'x1': 239, 'y1': 186, 'x2': 170, 'y2': 257, 'x': 170, 'y': 343}, {'type': 'C', 'x1': 170, 'y1': 430, 'x2': 240, 'y2': 500, 'x': 327, 'y': 500}, {'type': 'Z'}], 'fill': 'black', 'stroke': null, 'strokeWidth': 1});
        },
    },
    {
        category: 'Shape',
        name: 'setShapePosition x',
        assertion: function() {
            // setShapePosition uses updateShapePosition, this tests both
            let s = sampleShape();
            let re = s.setShapePosition(123, false);
            return _TEST.is(re.x).equalTo(123);
        },
    },
    {
        category: 'Shape',
        name: 'setShapePosition y',
        assertion: function() {
            // setShapePosition uses updateShapePosition, this tests both
            let s = sampleShape();
            let re = s.setShapePosition(false, 123);
            return _TEST.is(re.y).equalTo(123);
        },
    },
    {
        category: 'Shape',
        name: 'setShapeSize w',
        assertion: function() {
            // setShapeSize uses updateShapeSize, this tests both
            let s = sampleShape();
            let re = s.setShapeSize(123, false);
            return _TEST.is(re.width).equalTo(123);
        },
    },
    {
        category: 'Shape',
        name: 'setShapeSize h',
        assertion: function() {
            // setShapeSize uses updateShapeSize, this tests both
            let s = sampleShape();
            let re = s.setShapeSize(false, 123);
            return _TEST.is(re.height).equalTo(123);
        },
    },
    {
        category: 'Shape',
        name: 'isOverControlPoint',
        assertion: function() {
            let s = sampleShape();
            return _TEST.is(s.isOverControlPoint(326, 500).type).equalTo('p');
        },
    },
    {
        category: 'Shape',
        name: 'flipNS',
        assertion: function() {
            let s = triangleShape();
            s.flipNS();
            return _TEST.is(s.path.pathPoints[2].p.y).equalTo(600);
        },
    },
    {
        category: 'Shape',
        name: 'flipEW',
        assertion: function() {
            let s = triangleShape();
            s.flipEW();
            return _TEST.is(s.path.pathPoints[2].p.x).equalTo(400);
        },
    },
    {
        category: 'Shape',
        name: 'rotate',
        assertion: function() {
            let s = sampleShape();
            s.rotate(45, {x: 100, y: 100});
            return _TEST.is(s.path.pathPoints[0].p.x).equalTo(-121.29587073579876);
        },
    },
    {
        category: 'Shape',
        name: 'getCenter',
        assertion: function() {
            return _TEST.is(sampleShape().center.x).equalTo(327);
        },
    },
    {
        category: 'Shape',
        name: 'reverseWinding',
        assertion: function() {
            let s = sampleShape();
            s.reverseWinding();
            return _TEST.is(s.path.winding).equalTo(5);
        },
    },
    {
        category: 'Shape',
        name: 'getSegment',
        assertion: function() {
            return _TEST.is(sampleShape().getSegment(1).p1x).equalTo(484);
        },
    },
    {
        category: 'Shape',
        name: 'checkForNaN',
        assertion: function() {
            let s = sampleShape();
            s.path.pathPoints[2].h1.x = 'asdf';
            return _TEST.expression(!s.checkForNaN());
        },
    },
    {
        category: 'Shape',
        name: 'rectPathFromMaxes',
        assertion: function() {
            let re = rectPathFromMaxes({xMin: 123, xMax: 456, yMin: 123, yMax: 456});
            return _TEST.is(re.maxes.xMin).equalTo(123);
        },
    },
    {
        category: 'Shape',
        name: 'ovalPathFromMaxes',
        assertion: function() {
            let re = ovalPathFromMaxes({xMin: 123, xMax: 456, yMin: 123, yMax: 456});
            return _TEST.is(re.pathPoints[1].h1.x).equalTo(656);
        },
    },
    // {
    //     category: 'Shape',
    //     name: 'combineShapes',
    //     assertion: function() {
    //         let re = combineShapes([sampleShape(), triangleShape()]);
    //         return _TEST.is(re.length).equalTo(1);
    //     },
    // },
    {
        category: 'Shape',
        name: 'combineTwoShapes',
        assertion: function() {
            let ts2 = triangleShape();
            ts2.x = 150;
            let re = combineTwoShapes(triangleShape(), ts2);
            return _TEST.is(re.maxes.xMax).equalTo(450);
        },
    }
);

/*
OTHER METHODS
addShape
turnSelectedShapeIntoAComponent

CANVAS METHODS
resolveSelfOverlaps
isHere(px, py)
drawShape(lctx, view)
drawSegments()
getClickedShape
isOverShape
*/
