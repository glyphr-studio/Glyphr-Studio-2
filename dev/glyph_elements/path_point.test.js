import PathPoint from './path_point.js';
jest.mock('./path_point.js');

_TEST.globals.testPathPoint = {
  p: {coord: {x: 100, y: 100}},
  h1: {coord: {x: 0, y: 0}},
  h2: {coord: {x: 200, y: 200}},
  type: 'corner',
  q: false,
  parent: false,
};

/**
 * default sample PathPoint
 * @returns {PathPoint}
 */
function samplePathPoint() {
  return new PathPoint(_TEST.globals.testPathPoint);
}


test('PathPoint: Constructor - p.x', () => {
  const pp = samplePathPoint();
  expect(pp.p.x).toBe(100);
});

test('PathPoint: Constructor - type', () => {
  const pp = samplePathPoint();
  expect(pp.type).toBe('corner');
});

test('ControlPoint: length', () => {
  const pp = samplePathPoint();
  expect(pp.h1.length).toBe(141.4213562373095);
});

test('ControlPoint: angle', () => {
  const pp = samplePathPoint();
  pp.h1.y = 100;
  expect(pp.h1.angle).toBe(3.141592653589793);
});

test('ControlPoint: niceAngle', () => {
  const pp = samplePathPoint();
  pp.h1.y = 100;
  expect(pp.h1.niceAngle).toBe(270);
});

test('ControlPoint: use', () => {
  const p = new PathPoint();
  p.h1.use = false;
  expect(p.h1.x).toBe(p.p.x);
});

test('PathPoint: save', () => {
  const pp = samplePathPoint();
  expect(pp.save()).toBe(JSON.parse('{"p":{"coord":{"x":100,"y":100},"use":true},"type":"corner","h1":{"coord":{"x":0,"y":0},"use":true},"h2":{"coord":{"x":200,"y":200},"use":true}}'));
});

test('PathPoint: isOverControlPoint', () => {
  const pp = samplePathPoint();
  expect((pp.isOverControlPoint(200, 200)).type).toBe('h2');
});

test('PathPoint: isFlat', () => {
  const pp = samplePathPoint();
  expect(pp.isFlat()).toBeTruthy();
});

test('PathPoint: resolvePointType', () => {
  const pp = samplePathPoint();
  expect(pp.resolvePointType()).toBe('symmetric');
});

test('PathPoint: makePointedTo', () => {
  const pp = samplePathPoint();
  expect(pp.makePointedTo(300, 0).h2.x).toBe(166.66666666666666);
});

test('PathPoint: makeSymmetric', () => {
  const pp = samplePathPoint();
  pp.h2.x = 555;
  expect(pp.makeSymmetric('h1').h2.x).toBe(200);
});

test('PathPoint: makeFlat', () => {
  const pp = samplePathPoint();
  pp.h2.x = 555;
  expect(pp.makeFlat('h1').h2.x).toBe(429.412355566697);
});

test('PathPoint: rotate', () => {
  const pp = samplePathPoint();
  expect(pp.rotate(90, {x: 0, y: 0}).p.x).toBe(-134.2070279729728);
});

test('PathPoint: resetHandles', () => {
  const pp = samplePathPoint();
  pp.h1.x = 555;
  expect(pp.resetHandles().p.x).toBe(100);
});

test('PathPoint: roundAll', () => {
  const pp = samplePathPoint();
  pp.h1.x = 39.9999;
  expect(pp.roundAll(3).h1.x).toBe(40);
});
