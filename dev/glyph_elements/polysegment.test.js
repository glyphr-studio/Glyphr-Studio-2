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
                "segments":[{"p1x":0,"p1y":0,"p2x":0,"p2y":100,"p3x":200,"p3y":300,"p4x":300,"p4y":300},{"p1x":300,"p1y":300,"p2x":400,"p2y":300,"p3x":600,"p3y":200,"p4x":600,"p4y":0}]}
            );
        },
    },
);
/*

get segments()
set segments(segs = [])

getPath()
containsSegment(seg)
roundAll(precision = 3)
splitSegment(seg, t)
findIntersections()
drawIntersections(color = 'rgb(200, 50, 60)')
splitSegmentsAtIntersections(ixarr = this.findIntersections(), threshold)
stitchSegmentsTogether()
removeZeroLengthSegments()
removeRedundantSegments()
removeDuplicateSegments()
removeSegmentsOverlappingShape(shape)
removeNonConnectingSegments()
combineInlineSegments()

CANVAS METHODS
drawPolySegmentOutline(dx, dy)
drawPolySegmentPoints()
slowlyDrawSegments(delay = 600)
*/