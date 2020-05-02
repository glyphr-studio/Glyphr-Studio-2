import ControlPoint from './control_point.js';
jest.mock('./control_point.js');


test('ControlPoint: Constructor - x', () => {
  expect((new ControlPoint()).x).toBe(100);
});

test('ControlPoint: Change Position', () => {
  const cp = new ControlPoint();
  cp.x = 500;
  cp.y = 500;
  expect(cp.x === 500 && cp.y === 500).toBeTruthy();
});

test('ControlPoint: xLock', () => {
  const cp = new ControlPoint();
  cp.xLock = true;
  expect(cp.xLock).toBeTruthy();
});

test('ControlPoint: save', () => {
  const cp = new ControlPoint();
  expect(cp.save).toBe({point: {x: 0, y: 0}, use: true});
});
