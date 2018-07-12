import PathPoint from './pathpoint.js';
import {makePathPointFromSegments} from './pathpoint.js';
import Segment from './segment.js';

_TEST.globals.testPathPoint = {
    p: {x: 100, y: 100},
    h1: {point: {x: 0, y: 0}},
    h2: {point: {x: 200, y: 200}},
    type: 'corner',
    q: false,
    parent: false,
};

/**
 * default sample PathPoint
 * @returns {PathPoint}
 */
function samplePathPoint() {
    return new PathPoint(_TEST.globals.testPathPoint);
}

_TEST.testList.push(
    {
        category: 'PathPoint',
        name: 'Constructor - p.x',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.p.x).equalTo(100);
        },
    },
    {
        category: 'PathPoint',
        name: 'Constructor - type',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.type).equalTo('corner');
        },
    },
    {
        category: 'ControlPoint',
        name: 'length',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.h1.length).equalTo(141.4213562373095);
        },
    },
    {
        category: 'ControlPoint',
        name: 'angle',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.h1.angle).equalTo(-2.356194490192345);
        },
    },
    {
        category: 'ControlPoint',
        name: 'niceAngle',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.h1.niceAngle).equalTo(225);
        },
    },
    {
        category: 'ControlPoint',
        name: 'use',
        assertion: function() {
            let p = new PathPoint();
            p.h1.use = false;
            return _TEST.is(p.h1.x).equalTo(p.p.x);
        },
    },
    {
        category: 'PathPoint',
        name: 'save',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.save()).equalTo(JSON.parse('{"p":{"point":{"x":100,"y":100},"use":true},"type":"corner","h1":{"point":{"x":0,"y":0},"use":true},"h2":{"point":{"x":200,"y":200},"use":true}}'));
        },
    },
    {
        category: 'PathPoint',
        name: 'isOverControlPoint',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is((pp.isOverControlPoint(200, 200)).type).equalTo('h2');
        },
    },
    {
        category: 'PathPoint',
        name: 'isFlat',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.expression(pp.isFlat());
        },
    },
    {
        category: 'PathPoint',
        name: 'resolvePointType',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.resolvePointType()).equalTo('symmetric');
        },
    },
    {
        category: 'PathPoint',
        name: 'makePointedTo',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.makePointedTo(300, 0).h2.x).equalTo(166.66666666666666);
        },
    },
    {
        category: 'PathPoint',
        name: 'makeSymmetric',
        assertion: function() {
            let pp = samplePathPoint();
            pp.h2.x = 555;
            return _TEST.is(pp.makeSymmetric('h1').h2.x).equalTo(200);
        },
    },
    {
        category: 'PathPoint',
        name: 'makeFlat',
        assertion: function() {
            let pp = samplePathPoint();
            pp.h2.x = 555;
            return _TEST.is(pp.makeFlat('h1').h2.x).equalTo(429.412355566697);
        },
    },
    {
        category: 'PathPoint',
        name: 'rotate',
        assertion: function() {
            let pp = samplePathPoint();
            return _TEST.is(pp.rotate(90, {x: 0, y: 0}).p.x).equalTo(-134.2070279729728);
        },
    },
    {
        category: 'PathPoint',
        name: 'resetHandles',
        assertion: function() {
            let pp = samplePathPoint();
            pp.h1.x = 555;
            return _TEST.is(pp.resetHandles().p.x).equalTo(100);
        },
    },
    {
        category: 'PathPoint',
        name: 'roundAll',
        assertion: function() {
            let pp = samplePathPoint();
            pp.h1.x = 39.9999;
            return _TEST.is(pp.roundAll(3).h1.x).equalTo(40);
        },
    },
    {
        category: 'PathPoint',
        name: 'makePathPointFromSegments',
        assertion: function() {
            let seg1 = new Segment({p1x: 100, p1y: 100, p3x: 200, p3y: 200, p4x: 400, p4y: 300});
            let seg2 = new Segment({p1x: 400, p1y: 300, p2x: 500, p2y: 200, p4x: 600, p4y: 600});
            let pp = makePathPointFromSegments(seg1, seg2);
            return _TEST.is(pp.save()).equalTo(
                {
                    'p': {'point': {'x': 400, 'y': 300}, 'use': true},
                    'h1': {'point': {'x': 200, 'y': 200}, 'use': true},
                    'h2': {'point': {'x': 500, 'y': 200}, 'use': true},
                    'type': 'corner',
                }
            );
        },
    }
);
