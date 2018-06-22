import Path from './path.js';

_TEST.testList.push(
    {
        category: 'Path',
        name: 'pathPoints',
        assertion: function() {
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

            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.pathPoints[3].p.x).equalTo(170);
        },
    },
    {
        category: 'Path',
        name: 'save',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.save()).equalTo({'winding': -5, 'pathPoints': [{'p': {'x': 326.65249430318556, 'y': 500}, 'h1': {'point': {'x': 239.84504649235828, 'y': 500}, 'use': true}, 'h2': {'point': {'x': 413.45994211401285, 'y': 500}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 484, 'y': 343.4570087834163}, 'h1': {'point': {'x': 484, 'y': 428.9899571029709}, 'use': true}, 'h2': {'point': {'x': 484, 'y': 257.92406046386174}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 326.65249430318556, 'y': 186}, 'h1': {'point': {'x': 414.1548862447006, 'y': 186}, 'use': true}, 'h2': {'point': {'x': 239.15010236167052, 'y': 186}, 'use': true}, 'type': 'symmetric'}, {'p': {'x': 170, 'y': 343.4570087834163}, 'h1': {'point': {'x': 170, 'y': 257.0100080446707}, 'use': true}, 'h2': {'point': {'x': 170, 'y': 429.9040095221619}, 'use': true}, 'type': 'symmetric'}]});
        },
    },
    {
        category: 'Path',
        name: 'winding getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.winding).equalTo(-5);
        },
    },
    {
        category: 'Path',
        name: 'x getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.x).equalTo(170);
        },
    },
    {
        category: 'Path',
        name: 'y getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.y).equalTo(500);
        },
    },
    {
        category: 'Path',
        name: 'width getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.width).equalTo(314);
        },
    },
    {
        category: 'Path',
        name: 'height getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.height).equalTo(314);
        },
    },
    {
        category: 'Path',
        name: 'maxes getter',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.maxes).equalTo({'xMin': 170, 'xMax': 484, 'yMin': 186, 'yMax': 500});
        },
    },
    {
        category: 'Path',
        name: 'svgPathData',
        assertion: function() {
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            return _TEST.is(path.svgPathData).equalTo('M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z');
        },
    },
    {
        category: 'Path',
        name: 'width setter',
        assertion: function() {
            // width setter uses setPathSize and updatePathSize
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            path.width = 500;
            return _TEST.is(path.width).equalTo(500);
        },
    },
    {
        category: 'Path',
        name: 'height setter',
        assertion: function() {
            // height setter uses setPathSize and updatePathSize
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            path.height = 654;
            return _TEST.is(path.height).equalTo(654);
        },
    },
    {
        category: 'Path',
        name: 'y setter',
        assertion: function() {
            // y setter uses setPathPosition and updatePathPosition
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            path.y = 654;
            return _TEST.is(path.y).equalTo(654);
        },
    },
    {
        category: 'Path',
        name: 'x setter',
        assertion: function() {
            // x setter uses setPathPosition and updatePathPosition
            let path = new Path({pathPoints: _TEST.globals.testPathPoints});
            path.x = 654;
            return _TEST.is(path.x).equalTo(654);
        },
    }
);

/*


setPathPosition
updatePathPosition
rotate
isHere
getNextPointNum
getPreviousPointNum
addPointsAtPathIntersections
containsPoint
drawPath
genPathPostScript
makeSVGpathData
makeOpentypeJsPath
getSegment
getQuickSegmentLength
getPolySegment
isOverControlPoint
isOverFirstPoint
findWinding
reverseWinding
flipNS
flipEW
addPathPoint
insertPathPoint
getClosestPointOnCurve
getCoordFromSplit
selectPathPoint
calcMaxes
validate
checkForNaN

findPathIntersections
findPathPointBoundaryIntersections
findPathPointIntersections
maxesOverlap
*/
