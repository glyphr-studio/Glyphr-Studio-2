import Segment from './segment.js';
import PolySegment from './polysegment.js';

_TEST.globals.samplePolySegment = [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p2x: 400, p2y: 300, p3x: 600, p3y: 200, p4x: 600, p4y: 0},
];

/**
 * Create a sample PolySegment
 * @returns {PolySegment}
 */
function samplePolySegment() {
    return new PolySegment({segments: _TEST.globals.samplePolySegment});
}
_TEST.testList.push(
    {
        category: 'PolySegment',
        name: 'save',
        assertion: function() {
            return _TEST.is(samplePolySegment().save()).equalTo({
                'segments': [{'p1x': 0, 'p1y': 0, 'p2x': 0, 'p2y': 100, 'p3x': 200, 'p3y': 300, 'p4x': 300, 'p4y': 300}, {'p1x': 300, 'p1y': 300, 'p2x': 400, 'p2y': 300, 'p3x': 600, 'p3y': 200, 'p4x': 600, 'p4y': 0}]}
            );
        },
    },
    {
        category: 'PolySegment',
        name: 'get segments',
        assertion: function() {
            return _TEST.is(samplePolySegment().segments[0].p3x).equalTo(200);
        },
    },
    {
        category: 'PolySegment',
        name: 'get path',
        assertion: function() {
            let p = samplePolySegment().getPath();
            return _TEST.is(p.pathPoints.length).equalTo(3);
        },
    },
    {
        category: 'PolySegment',
        name: 'containsSegment',
        assertion: function() {
            return _TEST.expression(samplePolySegment().containsSegment(new Segment({
                p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300,
            })));
        },
    },
    {
        category: 'PolySegment',
        name: 'roundAll',
        assertion: function() {
            let ps = samplePolySegment();
            ps.segments[0].p1x = 123.4557;
            return _TEST.is(ps.roundAll().segments[0].p1x).equalTo(123.456);
        },
    },
    {
        category: 'PolySegment',
        name: 'findIntersections',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
                {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
            ]});
            return _TEST.is(ps.findIntersections()[0]).equalTo('169.757/238.309');
        },
    },
    {
        category: 'PolySegment',
        name: 'splitSegmentsAtIntersections',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
                {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
            ]});
            return _TEST.is(ps.splitSegmentsAtIntersections().segments.length).equalTo(4);
        },
    },
    {
        category: 'PolySegment',
        name: 'stitchSegmentsTogether',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p4x: 300, p4y: 300},
                {p1x: 600, p1y: 600, p4x: 0, p4y: 0},
                {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
            ]});
            return _TEST.is(ps.stitchSegmentsTogether()[0].segments.length).equalTo(3);
        },
    },
    {
        category: 'PolySegment',
        name: 'removeZeroLengthSegments',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
                {p1x: 300, p1y: 300, p4x: 300, p4y: 300},
            ]});
            return _TEST.is(ps.removeZeroLengthSegments().segments.length).equalTo(1);
        },
    },
    {
        category: 'PolySegment',
        name: 'removeRedundantLineSegments',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 300, p1y: 300, p4x: 700, p4y: 700},
                {p1x: 600, p1y: 600, p4x: 500, p4y: 500},
            ]});
            return _TEST.is(ps.removeRedundantLineSegments().segments[0].p4x).equalTo(700);
        },
    },
    {
        category: 'PolySegment',
        name: 'removeDuplicateSegments',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
                {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
            ]});
            return _TEST.is(ps.removeDuplicateSegments().segments.length).equalTo(2);
        },
    },
    {
        category: 'PolySegment',
        name: 'removeNonConnectingSegments',
        assertion: function() {
            let ps = new PolySegment({segments: [
                {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
                {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
                {p1x: 600, p1y: 600, p4x: 0, p4y: 0},
                {p1x: 700, p1y: 700, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 800, p4y: 800},
            ]});
            return _TEST.is(ps.removeNonConnectingSegments().segments.length).equalTo(3);
        },
    }
);

/*
CANVAS METHODS
removeSegmentsOverlappingShape(shape)
drawIntersections(color = 'rgb(200, 50, 60)')
drawPolySegmentOutline(dx, dy)
drawPolySegmentPoints()
slowlyDrawSegments(delay = 600)
*/
