import ControlPoint from './control_point.js';

describe('ControlPoint', () => {
  it('Constructor - x', () => {
    expect((new ControlPoint()).x).toBe(0);
  });

  it('Change Position', () => {
    const cp = new ControlPoint();
    cp.x = 500;
    cp.y = 500;
    expect(cp.x === 500 && cp.y === 500).toBeTruthy();
  });

  it('xLock', () => {
    const cp = new ControlPoint();
    cp.xLock = true;
    expect(cp.xLock).toBeTruthy();
  });

  it('save', () => {
    const cp = new ControlPoint();
    expect(cp.save()).toEqual({coord: {x: 0, y: 0}});
  });
});
