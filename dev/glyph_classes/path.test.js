_TEST.testList.push(
    {
        category: 'Path',
        name: 'constructor',
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
            return is(path.x).equalTo(170);
        },
    }

);

/*
save
changed

pathPoints
winding
x
y
height
width
maxes
svgPathData

setPathSize
updatePathSize
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
