import Coord from './coord.js';
import {pointsAreEqual} from '../common/functions.js';
jest.mock('./coord.js');
jest.mock('../common/functions.js');


test('Coord: Constructor - x', () => {
  expect((new Coord({x: 101})).x).toBe(101);
});

test('Coord: Constructor - y', () => {
  expect((new Coord({x: 101})).y).toBe(0);
});

test('Coord: pointsAreEqual', () => {
  const c1 = new Coord({x: 100, y: 100});
  const c2 = new Coord({x: 99.1, y: 100.9});
  expect(pointsAreEqual(c1, c2)).toBeTruthy();
});

test('Coord: X Setter', () => {
  const co = new Coord({x: 101, y: 123});
  co.x = 789;
  expect(co.x).toBe(789);
});

test('Coord: Y Setter', () => {
  const co = new Coord({x: 101, y: 123});
  co.y = 789;
  expect(co.y).toBe(789);
});
