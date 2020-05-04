import Segment from './segment.js';
import PolySegment from './poly_segment.js';
// jest.moc('./segment.js');
// jest.moc('./poly_segment.js');

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


it('PolySegment: save', () => {
  expect(samplePolySegment().save()).toEqual({
    'segments': [{'p1x': 0, 'p1y': 0, 'p2x': 0, 'p2y': 100, 'p3x': 200, 'p3y': 300, 'p4x': 300, 'p4y': 300}, {'p1x': 300, 'p1y': 300, 'p2x': 400, 'p2y': 300, 'p3x': 600, 'p3y': 200, 'p4x': 600, 'p4y': 0}]}
  );
});

it('PolySegment: get segments', () => {
  expect(samplePolySegment().segments[0].p3x).toBe(200);
});

it('PolySegment: get path', () => {
  const p = samplePolySegment().getPath();
  expect(p.pathPoints.length).toBe(3);
});

it('PolySegment: containsSegment', () => {
  expect(samplePolySegment().containsSegment(new Segment({
    p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300,
  }))).toBeTruthy();
});

it('PolySegment: roundAll', () => {
  const ps = samplePolySegment();
  ps.segments[0].p1x = 123.4557;
  expect(ps.roundAll().segments[0].p1x).toBe(123.456);
});

it('PolySegment: findIntersections', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
    {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
  ]});
  expect(ps.findIntersections()[0]).toBe('100/168.004');
});

it('PolySegment: splitSegmentsAtIntersections', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200},
    {p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0},
  ]});
  expect(ps.splitSegmentsAtIntersections().segments.length).toBe(4);
});

it('PolySegment: stitchSegmentsTogether', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p4x: 300, p4y: 300},
    {p1x: 600, p1y: 600, p4x: 0, p4y: 0},
    {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
  ]});
  expect(ps.stitchSegmentsTogether()[0].segments.length).toBe(3);
});

it('PolySegment: removeZeroLengthSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p4x: 300, p4y: 300},
  ]});
  expect(ps.removeZeroLengthSegments().segments.length).toBe(1);
});

it('PolySegment: removeRedundantLineSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 300, p1y: 300, p4x: 700, p4y: 700},
    {p1x: 600, p1y: 600, p4x: 500, p4y: 500},
  ]});
  expect(ps.removeRedundantLineSegments().segments[0].p4x).toBe(700);
});

it('PolySegment: removeDuplicateSegments', () => {
  const ps = new PolySegment({segments: [
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
    {p1x: 300, p1y: 300, p4x: 600, p4y: 600},
    {p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300},
  ]});
  expect(ps.removeDuplicateSegments().segments.length).toBe(2);
});

it('PolySegment: removeNonConnectingSegments', () => {
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
