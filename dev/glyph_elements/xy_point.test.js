import XYPoint from './xy_point.js';
jest.mock('./xy_point.js');


test('XYPoint: Constructor - x', () => {
  expect(new XYPoint(101, 123).x).toBe(101);
});

test('XYPoint: Constructor - y', () => {
  expect(new XYPoint(101, 123).y).toBe(123);
});

test('XYPoint: X Setter', () => {
  const xyp = new XYPoint(101, 123);
  xyp.x = 789;
  expect(xyp.x).toBe(789);
});

test('XYPoint: Y Setter', () => {
  const xyp = new XYPoint(101, 123);
  xyp.y = 789;
  expect(xyp.y).toBe(789);
});
