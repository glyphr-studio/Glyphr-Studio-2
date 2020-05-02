import Segment from './segment.js';
import {segmentsAreEqual, findSegmentIntersections,
  findOverlappingLineSegmentIntersections, findCrossingLineSegmentIntersections,
  findEndPointSegmentIntersections} from './poly_segment.js';
import {round} from '../common/functions.js';
jest.mock('./segment.js');
jest.mock('./poly_segment.js');
jest.mock('../common/functions.js');

// basically an upper-left quadrant quarter circle
// Test Segment at t=0.5 is {x: 62.5, y: 137.5}
_TEST.globals.testSegment1 = {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200};

/**
 * easy segment for testing
 * @returns {Segment}
 */
function sampleSegment() {
  return new Segment(_TEST.globals.testSegment1);
}


test('Segment: save', () => {
  expect(sampleSegment().save()).toBe({
    p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200});
});

test('Segment: length getter', () => {
  expect(sampleSegment().length).toBe(309.8050662153215);
});

test('Segment: quickLength getter', () => {
  expect(sampleSegment().quickLength).toBe(341.4213562373095);
});

test('Segment: maxes getter', () => {
  expect(sampleSegment().maxes.xMax).toBe(200);
});

test('Segment: line getter', () => {
  const seg = new Segment({p1x: 0, p1y: 100, p4x: 100, p4y: 0});
  expect(seg.lineType).toBe('diagonal');
});

test('Segment: split', () => {
  expect(sampleSegment().split()[1].p1x).toBe(62.5);
});

test('Segment: getXYPointFromSplit', () => {
  expect(sampleSegment().getXYPointFromSplit().y).toBe(137.5);
});

test('Segment: getSplitFromXYPoint', () => {
  expect(round(sampleSegment().getSplitFromXYPoint({x: 62.5, y: 137.5}).split, 2)).toBe(0.5);
});

test('Segment: splitAtPoint', () => {
  expect(sampleSegment().splitAtPoint({x: 62.5, y: 137.5})[1].p1x).toBe(62.42971272735194);
});

test('Segment: splitAtTime', () => {
  expect(sampleSegment().splitAtTime(0.5)[1].p1x).toBe(62.5);
});

test('Segment: splitAtManyPoints', () => {
  const points = [
    {x: 29.0763, y: 95.4063}, // t=0.33
    {x: 101.9304, y: 169.2504}, // t=0.66
  ];

  const segs = sampleSegment().splitAtManyPoints(points);
  // debug(segs);

  expect(round(segs[2].p1x)).toBe(102);
});

test('Segment: pointIsWithinMaxes', () => {
  expect(sampleSegment().pointIsWithinMaxes({x: 100, y: 100})).toBeTruthy();
});

test('Segment: convertToLine', () => {
  expect(sampleSegment().convertToLine().lineType).toBe('diagonal');
});

test('Segment: calculateLength', () => {
  expect(sampleSegment().calculateLength()).toBe(309.8050662153215);
});

test('Segment: getReverse', () => {
  expect(sampleSegment().getReverse().p1x).toBe(200);
});

test('Segment: getXYPoint', () => {
  expect(sampleSegment().getXYPoint(4).x).toBe(200);
});

test('Segment: getFastMaxes', () => {
  expect(sampleSegment().getFastMaxes().xMax).toBe(200);
});

test('Segment: isLineOverlappedByLine', () => {
  const seg = new Segment({p1x: 50, p1y: 50, p4x: 150, p4y: 150});
  expect(seg.isLineOverlappedByLine(sampleSegment().convertToLine())).toBeTruthy();
});

test('Segment: containsTerminalPoint - start', () => {
  // also tests Segment.containsStartPoint
  expect(sampleSegment().containsTerminalPoint({x: 0, y: 0})).toBe('start');
});

test('Segment: containsTerminalPoint - end', () => {
  // also tests Segment.containsEndPoint
  expect(sampleSegment().containsTerminalPoint({x: 200, y: 200})).toBe('end');
});

test('Segment: containsPointOnCurve', () => {
  expect(sampleSegment().containsPointOnCurve({x: 29.0763, y: 95.4063})).toBeTruthy();
});

test('Segment: containsPointOnLine', () => {
  expect(sampleSegment().convertToLine().containsPointOnLine({x: 100, y: 100})).toBeTruthy();
});

test('Segment: precedes', () => {
  const seg2 = new Segment({p1x: 200, p1y: 200});
  expect(sampleSegment().precedes(seg2)).toBeTruthy();
});

test('Segment: isLine', () => {
  expect(sampleSegment().convertToLine().lineType).toBeTruthy();
});

test('Segment: roundAll', () => {
  const seg = sampleSegment();
  seg.p2y = 123.4559;
  expect(seg.roundAll(3).p2y).toBe(123.456);
});

test('Segment: findSegmentIntersections', () => {
  // basically an upper-right quadrant quarter circle
  const seg2 = new Segment({p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0});
  expect(findSegmentIntersections(sampleSegment(), seg2)[0]).toBe('100/168.004');
});

test('Segment: segmentsAreEqual', () => {
  expect(segmentsAreEqual(sampleSegment(), sampleSegment())).toBeTruthy();
});

test('Segment: findOverlappingLineSegmentIntersections', () => {
  const seg1 = new Segment({p1x: 0, p1y: 0, p4x: 100, p4y: 0});
  const seg2 = new Segment({p1x: 50, p1y: 0, p4x: 200, p4y: 0});
  expect(findOverlappingLineSegmentIntersections(seg1, seg2)[0]).toBe('50/0');
});

test('Segment: findCrossingLineSegmentIntersections', () => {
  const seg1 = new Segment({p1x: 0, p1y: 0, p4x: 100, p4y: 100});
  const seg2 = new Segment({p1x: 0, p1y: 100, p4x: 100, p4y: 0});
  expect(findCrossingLineSegmentIntersections(seg1, seg2)[0]).toBe('50/50');
});

test('Segment: findEndPointSegmentIntersections', () => {
  const seg1 = sampleSegment();
  const seg2 = new Segment({p1x: 200, p1y: 200});
  expect(findEndPointSegmentIntersections(seg1, seg2)[0]).toBe('200/200');
});
/*
CANVAS METHODS

drawSegmentOutline(color, dx, dy)
drawSegmentPoints(color, txt)
*/
