import Segment, {segmentsAreEqual, findSegmentIntersections,
    findOverlappingLineSegmentIntersections, findCrossingLineSegmentIntersections,
    findEndPointSegmentIntersections, ixToCoord, coordToIx, pointsAreCollinear} from './segment.js';
import {round} from '../app/functions.js';

// basically an upper-left quadrant quarter circle
// Test Segment at t=0.5 is {x: 112.5, y:187.5}
_TEST.globals.testSegment1 = {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300};

/**
 * easy segment for testing
 * @returns {Segment}
 */
function sampleSegment() {
    return new Segment(_TEST.globals.testSegment1);
}

_TEST.testList.push(
   {
        category: 'Segment',
        name: 'save',
        assertion: function() {
            return _TEST.is(sampleSegment().save()).equalTo({
                p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300});
        },
    },
    {
        category: 'Segment',
        name: 'length getter',
        assertion: function() {
            return _TEST.is(sampleSegment().length).equalTo(445.90009425053995);
        },
    },
    {
        category: 'Segment',
        name: 'quickLength getter',
        assertion: function() {
            return _TEST.is(sampleSegment().quickLength).equalTo(482.842712474619);
        },
    },
    {
        category: 'Segment',
        name: 'maxes getter',
        assertion: function() {
            return _TEST.is(sampleSegment().maxes.xMax).equalTo(300);
        },
    },
    {
        category: 'Segment',
        name: 'line getter',
        assertion: function() {
            let seg = new Segment({p1x: 0, p1y: 100, p4x: 100, p4y: 0});
            return _TEST.is(seg.lineType).equalTo('diagonal');
        },
    },
    {
        category: 'Segment',
        name: 'split',
        assertion: function() {
            return _TEST.is(sampleSegment().split()[1].p1x).equalTo(112.5);
        },
    },
    {
        category: 'Segment',
        name: 'getCoordFromSplit',
        assertion: function() {
            return _TEST.is(sampleSegment().getCoordFromSplit().y).equalTo(187.5);
        },
    },
    {
        category: 'Segment',
        name: 'getSplitFromCoord',
        assertion: function() {
            return _TEST.is(round(sampleSegment().getSplitFromCoord({x: 112, y: 187}).split, 2)).equalTo(0.5);
        },
    },
    {
        category: 'Segment',
        name: 'splitAtCoord',
        assertion: function() {
            return _TEST.is(sampleSegment().splitAtCoord({x: 112, y: 187})[1].p1x).equalTo(111.9300099391252);
        },
    },
    {
        category: 'Segment',
        name: 'splitAtTime',
        assertion: function() {
            return _TEST.is(sampleSegment().splitAtTime(0.5)[1].p1x).equalTo(112.5);
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

            let segs = sampleSegment().splitSegmentAtProvidedCoords(coords);
            // debug(segs);

            return _TEST.is(round(segs[2].p1x)).equalTo(177);
        },
    },
    {
        category: 'Segment',
        name: 'pointIsWithinMaxes',
        assertion: function() {
            return _TEST.expression(sampleSegment().pointIsWithinMaxes({x: 100, y: 100}));
        },
    },
    {
        category: 'Segment',
        name: 'convertToLine',
        assertion: function() {
            return _TEST.is(sampleSegment().convertToLine().lineType).equalTo('diagonal');
        },
    },
    {
        category: 'Segment',
        name: 'calculateLength',
        assertion: function() {
            return _TEST.is(sampleSegment().calculateLength()).equalTo(445.90009425053995);
        },
    },
    {
        category: 'Segment',
        name: 'getReverse',
        assertion: function() {
            return _TEST.is(sampleSegment().getReverse().p1x).equalTo(300);
        },
    },
    {
        category: 'Segment',
        name: 'getCoord',
        assertion: function() {
            return _TEST.is(sampleSegment().getCoord(4).x).equalTo(300);
        },
    },
    {
        category: 'Segment',
        name: 'getFastMaxes',
        assertion: function() {
            return _TEST.is(sampleSegment().getFastMaxes().xMax).equalTo(300);
        },
    },
    {
        category: 'Segment',
        name: 'isLineOverlappedByLine',
        assertion: function() {
            let seg = new Segment({p1x: 100, p1y: 100, p4x: 200, p4y: 200});
            return _TEST.expression(seg.isLineOverlappedByLine(sampleSegment().convertToLine()));
        },
    },
    {
        category: 'Segment',
        name: 'containsTerminalPoint - start',
        assertion: function() {
            // also tests Segment.containsStartPoint
            return _TEST.is(sampleSegment().containsTerminalPoint({x: 0, y: 0})).equalTo('start');
        },
    },
    {
        category: 'Segment',
        name: 'containsTerminalPoint - end',
        assertion: function() {
            // also tests Segment.containsEndPoint
            return _TEST.is(sampleSegment().containsTerminalPoint({x: 300, y: 300})).equalTo('end');
        },
    },
    {
        category: 'Segment',
        name: 'containsPointOnCurve',
        assertion: function() {
            return _TEST.expression(sampleSegment().containsPointOnCurve({x: 112, y: 187}));
        },
    },
    {
        category: 'Segment',
        name: 'containsPointOnLine',
        assertion: function() {
            return _TEST.expression(sampleSegment().convertToLine().containsPointOnLine({x: 100, y: 100}));
        },
    },
    {
        category: 'Segment',
        name: 'preceeds',
        assertion: function() {
            let seg2 = new Segment({p1x: 300, p1y: 300});
            return _TEST.expression(sampleSegment().preceeds(seg2));
        },
    },
    {
        category: 'Segment',
        name: 'isLine',
        assertion: function() {
            return _TEST.expression(sampleSegment().convertToLine().lineType);
        },
    },
    {
        category: 'Segment',
        name: 'roundAll',
        assertion: function() {
            let seg = sampleSegment();
            seg.p2y = 123.4559;
            return _TEST.is(seg.roundAll(3).p2y).equalTo(123.456);
        },
    },
    {
        category: 'Segment',
        name: 'findSegmentIntersections',
        assertion: function() {
            // basically an upper-right quadrant quarter circle
            let seg2 = new Segment({p1x: 0, p1y: 300, p2x: 100, p2y: 300, p3x: 300, p3y: 200, p4x: 300, p4y: 0});
            return _TEST.is(findSegmentIntersections(sampleSegment(), seg2)[0]).equalTo('169.757/238.309');
        },
    },
    {
        category: 'Segment',
        name: 'segmentsAreEqual',
        assertion: function() {
            return _TEST.expression(segmentsAreEqual(sampleSegment(), sampleSegment()));
        },
    },
    {
        category: 'Segment',
        name: 'findOverlappingLineSegmentIntersections',
        assertion: function() {
            let seg1 = new Segment({p1x: 0, p1y: 0, p4x: 100, p4y: 0});
            let seg2 = new Segment({p1x: 50, p1y: 0, p4x: 200, p4y: 0});
            return _TEST.is(findOverlappingLineSegmentIntersections(seg1, seg2)[0]).equalTo('50/0');
        },
    },
    {
        category: 'Segment',
        name: 'findCrossingLineSegmentIntersections',
        assertion: function() {
            let seg1 = new Segment({p1x: 0, p1y: 0, p4x: 100, p4y: 100});
            let seg2 = new Segment({p1x: 0, p1y: 100, p4x: 100, p4y: 0});
            return _TEST.is(findCrossingLineSegmentIntersections(seg1, seg2)[0]).equalTo('50/50');
        },
    },
    {
        category: 'Segment',
        name: 'findEndPointSegmentIntersections',
        assertion: function() {
            let seg1 = sampleSegment();
            let seg2 = new Segment({p1x: 300, p1y: 300});
            return _TEST.is(findEndPointSegmentIntersections(seg1, seg2)[0]).equalTo('300/300');
        },
    },
    {
        category: 'Segment',
        name: 'ixToCoord',
        assertion: function() {
            return _TEST.is(ixToCoord('123/456').y).equalTo(456);
        },
    },
    {
        category: 'Segment',
        name: 'coordToIx',
        assertion: function() {
            return _TEST.is(coordToIx({x: 123, y: 456})).equalTo('123/456');
        },
    },
    {
        category: 'Segment',
        name: 'pointsAreCollinear',
        assertion: function() {
            return _TEST.expression(pointsAreCollinear(
                {x: 100, y: 100},
                {x: 200, y: 200},
                {x: 300, y: 300}
            ));
        },
    }
);

/*
CANVAS METHODS

drawSegmentOutline(color, dx, dy)
drawSegmentPoints(color, txt)
*/
