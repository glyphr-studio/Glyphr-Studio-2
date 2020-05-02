import Segment from './segment.js';
import PolySegment from './poly_segment.js';
jest.mock('./segment.js');
jest.mock('./poly_segment.js');

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


test('PolySegment: save', () => {
  expect(samplePolySegment().save()).toBe({
    'segments': [{'p1x': 0, 'p1y': 0, 'p2x': 0, 'p2y': 100, 'p3x': 200, 'p3y': 300, 'p4x': 300, 'p4y': 300}, {'p1x': 300, 'p1y': 300, 'p2x': 400, 'p2y': 300, 'p3x': 600, 'p3y': 200, 'p4x': 600, 'p4y': 0}]}
  );
});

test('PolySegment: get segments', () => {
  expect(samplePolySegment().segments[0].p3x).toBe(200);
});

test('PolySegment: get path', () => {
  const p = samplePolySegment().getPath();
  expect(p.pathPoints.length).toBe(3);
});

test('PolySegment: containsSegment', () => {
  expect(samplePolySegment().containsSegment(new Segment({
    p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300,
  }))).toBeTruthy();
});

test('PolySegment: roundAll', () => {
  const ps = samplePolySegment();
  ps.segments[0].p1x = 123.4557;
  expect(ps.roundAll().segments[0].p1x).toBe(123.456);
});

test('PolySegment: findIntersections', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
    {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
  ]});
  expect(ps.findIntersections()[0]).toBe('100/168.004');
});

test('PolySegment: splitSegmentsAtIntersections', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
    {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
  ]});
  expect(ps.splitSegmentsAtIntersections().segments.length).toBe(4);
});

test('PolySegment: stitchSegmentsTogether', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p4x: 300, p4y: 300},
    {p1x: 600, p1y: 600, p4x: 0, p4y: 0},
    {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
  ]});
  expect(ps.stitchSegmentsTogether()[0].segments.length).toBe(3);
});

test('PolySegment: removeZeroLengthSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p4x: 300, p4y: 300},
  ]});
  expect(ps.removeZeroLengthSegments().segments.length).toBe(1);
});

test('PolySegment: removeRedundantLineSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 300, p1y: 300, p4x: 700, p4y: 700},
    {p1x: 600, p1y: 600, p4x: 500, p4y: 500},
  ]});
  expect(ps.removeRedundantLineSegments().segments[0].p4x).toBe(700);
});

test('PolySegment: removeDuplicateSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
  ]});
  expect(ps.removeDuplicateSegments().segments.length).toBe(2);
});

test('PolySegment: removeNonConnectingSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
    {p1x: 600, p1y: 600, p4x: 0, p4y: 0},
    {p1x: 700, p1y: 700, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 800, p4y: 800},
  ]});
  expect(ps.removeNonConnectingSegments().segments.length).toBe(3);
});
/*
CANVAS METHODS
removeSegmentsOverlappingShape(shape)
drawIntersections(color = 'rgb(200, 50, 60)')
drawPolySegmentOutline(dx, dy)
drawPolySegmentPoints()
slowlyDrawSegments(delay = 600)
*/
