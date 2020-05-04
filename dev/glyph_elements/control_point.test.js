import ControlPoint from './control_point.js';
// jest.moc('./control_point.js');


it('ControlPoint: Constructor - x', () => {
  expect((new ControlPoint()).x).toBe(100);
});

it('ControlPoint: Change Position', () => {
  const cp = new ControlPoint();
  cp.x = 500;
  cp.y = 500;
  expect(cp.x === 500 && cp.y === 500).toBeTruthy();
});

it('ControlPoint: xLock', () => {
  const cp = new ControlPoint();
  cp.xLock = true;
  expect(cp.xLock).toBeTruthy();
});

it('ControlPoint: save', () => {
  const cp = new ControlPoint();
  expect(cp.save).toEqual({point: {x: 0, y: 0}, use: true});
});
