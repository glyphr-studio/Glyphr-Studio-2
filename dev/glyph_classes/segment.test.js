import Segment from './segment.js';
import {round} from '../app/functions.js';

_TEST.globals.testSegment = {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300};
// Test Segment at t=0.5 is {x: 112.5, y:187.5}

function testSegment() {
    return new Segment(_TEST.globals.testSegment);
}

_TEST.testList.push(
   {
        category: 'Segment',
        name: 'save',
        assertion: function() {
            return _TEST.is(testSegment().save()).equalTo({
                p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300});
        },
    },
    {
        category: 'Segment',
        name: 'length getter',
        assertion: function() {
            return _TEST.is(testSegment().length).equalTo(445.8599063561878);
        },
    },
    {
        category: 'Segment',
        name: 'maxes getter',
        assertion: function() {
            return _TEST.is(testSegment().maxes.xMax).equalTo(300);
        },
    },
    {
        category: 'Segment',
        name: 'split',
        assertion: function() {
            return _TEST.is(testSegment().split()[1].p1x).equalTo(112.5);
        },
    },
    {
        category: 'Segment',
        name: 'getCoordFromSplit',
        assertion: function() {
            return _TEST.is(testSegment().getCoordFromSplit().y).equalTo(187.5);
        },
    },
    {
        category: 'Segment',
        name: 'getSplitFromCoord',
        assertion: function() {
            return _TEST.is(round(testSegment().getSplitFromCoord({x: 112, y:187}).split, 2)).equalTo(0.5);
        },
    },
    {
        category: 'Segment',
        name: 'splitAtCoord',
        assertion: function() {
            return _TEST.is(testSegment().splitAtCoord({x: 112, y:187})[1].p1x).equalTo(111.93021257079866);
        },
    },
    {
        category: 'Segment',
        name: 'splitAtTime',
        assertion: function() {
            return _TEST.is(testSegment().splitAtTime(0.5)[1].p1x).equalTo(112.5);
        },
    },
    {
        category: 'Segment',
        name: 'splitSegmentAtProvidedCoords',
        assertion: function() {
            let coords = [
                {x: 55.5, y: 122.1}, // t=0.33
                {x: 177.5, y: 244.2}, // t=0.66
            ];
            // 0.33 {p1x: 55.4556, p1y: 122.0889
            // 0.66 {p1x: 177.5111, p1y: 244.2443

            let segs = testSegment().splitSegmentAtProvidedCoords(coords);
            // debug(segs);

            return _TEST.is(round(segs[2].p1x)).equalTo(177);
        },
    },
);

/*
CLASS METHODS

pointIsWithinMaxes(co)
convertToLine()
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

drawSegmentOutline(color, dx, dy)
drawSegmentPoints(color, txt)
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
