import Path from './path.js';
import {findPathIntersections, findPathPointIntersections} from './path.js';
import {clone} from '../app/functions.js';
import PathPoint from './pathpoint.js';

// It's a circle!
_TEST.globals.testPathPoints = [
    {
        p: {x: 326.65249430318556, y: 499.9999934240834},
        h1: {point: {x: 239.84504649235828, y: 499.9999934240834}},
        h2: {point: {x: 413.45994211401285, y: 499.9999934240834}},
        type: 'symmetric',
    },
    {
        p: {x: 483.99995919594085, y: 343.4570087834163},
        h1: {point: {x: 483.99995919594085, y: 428.9899571029709}},
        h2: {point: {x: 483.99995919594085, y: 257.92406046386174}},
        type: 'symmetric',
    },
    {
        p: {x: 326.65249430318556, y: 185.99997172355825},
        h1: {point: {x: 414.1548862447006, y: 185.99997172355825}},
        h2: {point: {x: 239.15010236167052, y: 185.99997172355825}},
        type: 'symmetric',
    },
    {
        p: {x: 169.99997354111795, y: 343.4570087834163},
        h1: {point: {x: 169.99997354111795, y: 257.0100080446707}},
        h2: {point: {x: 169.99997354111795, y: 429.9040095221619}},
        type: 'symmetric',
    },
];

/**
 * A sample path
 * @returns {Path}
 */
function samplePath() {
    return new Path({pathPoints: clone(_TEST.globals.testPathPoints)});
}

/**
 * Another sample path
 * @returns {Path}
 */
function trianglePath() {
    return new Path({pathPoints: [{p: {x: 100, y: 200}}, {p: {x: 300, y: 600}}, {p: {x: 400, y: 500}}]});
}

_TEST.testList.push(
    {
        category: 'Path',
        name: 'pathPoints',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.pathPoints[3].p.x).equalTo(170);
        },
    },
    {
        category: 'Path',
        name: 'save',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.save()).equalTo({'winding': -5, 'pathPoints': [{'p': {'x': 326.65249430318556, 'y': 500}, 'h1': {'point': {'x': 239.84504649235828, 'y': 500}, 'use': true}, 'h2': {'point': {'x': 413.45994211401285, 'y': 500}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 484, 'y': 343.4570087834163}, 'h1': {'point': {'x': 484, 'y': 428.9899571029709}, 'use': true}, 'h2': {'point': {'x': 484, 'y': 257.92406046386174}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 326.65249430318556, 'y': 186}, 'h1': {'point': {'x': 414.1548862447006, 'y': 186}, 'use': true}, 'h2': {'point': {'x': 239.15010236167052, 'y': 186}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 170, 'y': 343.4570087834163}, 'h1': {'point': {'x': 170, 'y': 257.0100080446707}, 'use': true}, 'h2': {'point': {'x': 170, 'y': 429.9040095221619}, 'use': true}, 'type': 'symmetric'}]});
        },
    },
    {
        category: 'Path',
        name: 'winding getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.winding).equalTo(-5);
        },
    },
    {
        category: 'Path',
        name: 'x getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.x).equalTo(170);
        },
    },
    {
        category: 'Path',
        name: 'y getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.y).equalTo(500);
        },
    },
    {
        category: 'Path',
        name: 'width getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.width).equalTo(314);
        },
    },
    {
        category: 'Path',
        name: 'height getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.height).equalTo(314);
        },
    },
    {
        category: 'Path',
        name: 'maxes getter',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.maxes.save()).equalTo({'xMin': 170, 'xMax': 484, 'yMin': 186, 'yMax': 500});
        },
    },
    {
        category: 'Path',
        name: 'svgPathData',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.svgPathData).equalTo('M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z');
        },
    },
    {
        category: 'Path',
        name: 'width setter',
        assertion: function() {
            // width setter uses setPathSize and updatePathSize
            let path = samplePath();
            path.width = 500;
            return _TEST.is(path.width).equalTo(500);
        },
    },
    {
        category: 'Path',
        name: 'height setter',
        assertion: function() {
            // height setter uses setPathSize and updatePathSize
            let path = samplePath();
            path.height = 654;
            return _TEST.is(path.height).equalTo(654);
        },
    },
    {
        category: 'Path',
        name: 'y setter',
        assertion: function() {
            // y setter uses setPathPosition and updatePathPosition
            let path = samplePath();
            path.y = 654;
            return _TEST.is(path.y).equalTo(654);
        },
    },
    {
        category: 'Path',
        name: 'x setter',
        assertion: function() {
            // x setter uses setPathPosition and updatePathPosition
            let path = samplePath();
            path.x = 654;
            return _TEST.is(path.x).equalTo(654);
        },
    },
    {
        category: 'Path',
        name: 'getNextPointNum',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.getNextPointNum(3)).equalTo(0);
        },
    },
    {
        category: 'Path',
        name: 'getPreviousPointNum',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.getPreviousPointNum(0)).equalTo(3);
        },
    },
    {
        category: 'Path',
        name: 'containsPoint',
        assertion: function() {
            let path = samplePath();
            return _TEST.expression(path.containsPoint({x: 326.65249430318556, y: 500}));
        },
    },
    {
        category: 'Path',
        name: 'rotate',
        assertion: function() {
            let path = samplePath();
            path.rotate(45, {x: 100, y: 100});
            return _TEST.is(path.pathPoints[0].p.x).equalTo(-121.29587073579876);
        },
    },
    {
        category: 'Path',
        name: 'makePathPostScript',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.makePathPostScript().re).equalTo('\t\t\t\t326.65249430318556 500 rmoveto \n\t\t\t\t86.80744781082728 0 70.54005788598715 -71.01004289702911 0 -85.53294831955458 rrcurveto \n\t\t\t\t0 -85.53294831955458 -69.8451137552994 -71.92406046386174 -87.50239194151504 0 rrcurveto \n\t\t\t\t-87.50239194151504 0 -69.15010236167052 71.01000804467071 0 86.4470007387456 rrcurveto \n\t\t\t\t0 86.4470007387456 69.84504649235828 70.09599047783809 86.80744781082728 0 rrcurveto \n');
        },
    },
    {
        category: 'Path',
        name: 'makeSVGPathData',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.makeSVGPathData()).equalTo('M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z');
        },
    },
    {
        category: 'Path',
        name: 'makeOpenTypeJsPath',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.makeOpentypeJsPath()).equalTo({'commands': [{'type': 'M', 'x': 327, 'y': 500}, {'type': 'C', 'x1': 413, 'y1': 500, 'x2': 484, 'y2': 429, 'x': 484, 'y': 343}, {'type': 'C', 'x1': 484, 'y1': 258, 'x2': 414, 'y2': 186, 'x': 327, 'y': 186}, {'type': 'C', 'x1': 239, 'y1': 186, 'x2': 170, 'y2': 257, 'x': 170, 'y': 343}, {'type': 'C', 'x1': 170, 'y1': 430, 'x2': 240, 'y2': 500, 'x': 327, 'y': 500}, {'type': 'Z'}], 'fill': 'black', 'stroke': null, 'strokeWidth': 1});
        },
    },
    {
        category: 'Path',
        name: 'addPointsAtPathIntersections',
        assertion: function() {
            let path = samplePath();
            // Pull the top point down below the original bottom point
            path.pathPoints[0].p.y = 100;
            path.addPointsAtPathIntersections();
            return _TEST.is(path.pathPoints.length).equalTo(8);
        },
    },
    {
        category: 'Path',
        name: 'isOverControlPoint',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.isOverControlPoint(326, 500).type).equalTo('p');
        },
    },
    {
        category: 'Path',
        name: 'isOverFirstPoint',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.isOverFirstPoint(326, 500)).equalTo(true);
        },
    },
    {
        category: 'Path',
        name: 'findWinding',
        assertion: function() {
            let path = samplePath();
            return _TEST.is(path.findWinding()).equalTo(-5);
        },
    },
    {
        category: 'Path',
        name: 'reverseWinding',
        assertion: function() {
            let path = samplePath();
            path.reverseWinding();
            return _TEST.is(path.winding).equalTo(5);
        },
    },
    {
        category: 'Path',
        name: 'getSegment',
        assertion: function() {
            return _TEST.is(samplePath().getSegment(1).p1x).equalTo(484);
        },
    },
    {
        category: 'Path',
        name: 'getSegment',
        assertion: function() {
            return _TEST.is(samplePath().getQuickSegmentLength()).equalTo(221.95482794488714);
        },
    },
    {
        category: 'Path',
        name: 'getPolySegment',
        assertion: function() {
            let ps = samplePath().getPolySegment();
            return _TEST.is(ps.segments[3].p1x).equalTo(170);
        },
    },
    {
        category: 'Path',
        name: 'flipNS',
        assertion: function() {
            let p = trianglePath();
            p.flipNS();
            return _TEST.is(p.pathPoints[2].p.y).equalTo(600);
        },
    },
    {
        category: 'Path',
        name: 'flipEW',
        assertion: function() {
            let p = trianglePath();
            p.flipEW();
            return _TEST.is(p.pathPoints[2].p.x).equalTo(400);
        },
    },
    {
        category: 'Path',
        name: 'selectPathPoint',
        assertion: function() {
            return _TEST.is(samplePath().selectPathPoint(2).p.x).equalTo(326.65249430318556);
        },
    },
    {
        category: 'Path',
        name: 'addPathPoint',
        assertion: function() {
            let pp = new PathPoint();
            return _TEST.is(samplePath().addPathPoint(pp).p.x).equalTo(100);
        },
    },
    {
        category: 'Path',
        name: 'insertPathPoint',
        assertion: function() {
            return _TEST.is(samplePath().insertPathPoint().p.x).equalTo(100);
        },
    },
    {
        category: 'Path',
        name: 'getClosestPointOnCurve',
        assertion: function() {
            return _TEST.is(samplePath().getClosestPointOnCurve({x: 100, y: 100}).x).equalTo(219.88497706136906);
        },
    },
    {
        category: 'Path',
        name: 'getCoordFromSplit',
        assertion: function() {
            return _TEST.is(samplePath().getCoordFromSplit().x).equalTo(437.879040080653);
        },
    },
    {
        category: 'Path',
        name: 'checkForNaN',
        assertion: function() {
            let p = samplePath();
            p.pathPoints[2].h1.x = 'asdf';
            return _TEST.expression(!p.checkForNaN());
        },
    },
    {
        category: 'Path',
        name: 'findPathIntersections',
        assertion: function() {
            let tp2 = trianglePath();
            tp2.x = 150;

            // debug(`Path 1`);
            // debug(trianglePath().print(0, '  '));
            // debug(`Path 2 (P1.x + 150)`);
            // debug(tp2.print(0, '  '));

            return _TEST.is(findPathIntersections(trianglePath(), tp2).length).equalTo(2);
        },
    },
    {
        category: 'Path',
        name: 'findPathPointIntersections',
        assertion: function() {
            let p2 = samplePath();
            p2.y = 814;
            return _TEST.is(findPathPointIntersections(samplePath(), p2)[0]).equalTo('326.65249430318556/500');
        },
    },
    {
        category: 'PathPoint',
        name: 'pointNumber',
        assertion: function() {
            let pp = samplePath().pathPoints[3];
            return _TEST.is(pp.pointNumber).equalTo(3);
        },
    }
);

/*
CANVAS METHODS

isHere
drawPath
findPathPointBoundaryIntersections
*/
