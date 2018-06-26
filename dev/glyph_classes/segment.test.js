import Segment from './segment.js';
// import debug from '../app/functions.js';

_TEST.testList.push(
   {
        category: 'Segment',
        name: 'save',
        assertion: function() {
            _TEST.globals.testSegment = {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300};
            let seg = new Segment(_TEST.globals.testSegment);
            return _TEST.is(seg.save()).equalTo({
                p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300});
        },
    }
);

/*
CLASS METHODS

constructor()
changed()
get length()
get maxes()
drawSegmentOutline(color, dx, dy)
drawSegmentPoints(color, txt)
split(sp = 0.5)
splitAtCoord(co)
splitAtTime(t)
splitSegmentAtProvidedCoords(coords, threshold)
pointIsWithinMaxes(co)
convertToLine()
getSplitFromCoord(coord, threshold)
calculateLength()
getQuickLength()
getCoordFromSplit(t)
getReverse()
getCoord(pt)
getFastMaxes()
calcMaxes()
isRedundantTo(s)
containsTerminalPoint(pt, threshold = 1)
containsStartPoint(pt, threshold = 1)
containsEndPoint(pt, threshold = 1)
containsPointOnCurve(pt, threshold)
containsPointOnLine(pt)
preceeds(s2, threshold = 1)
isLine(precision)
toString(precision)
roundAll(precision)
*/

/*
findSegmentIntersections(s1, s2, depth)
segmentsAreEqual(s1, s2, threshold)
findOverlappingLineSegmentIntersections(s1, s2)
findCrossingLineSegmentIntersections(s1, s2)
findEndPointSegmentIntersections(s1, s2)
ixToCoord(ix)
coordToIx(co)
pointsAreCollinear(a, b, c, precision)
*/
