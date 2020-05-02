import Maxes from './maxes.js';
import {maxesOverlap, getOverallMaxes} from './maxes.js';
// jest.moc('./maxes.js');


it('Maxes: constructor', () => {
  const m1 = new Maxes();
  expect(m1.xMax).toBe(Number.MIN_SAFE_INTEGER);
});

it('Maxes: maxBounds', () => {
  const m1 = new Maxes();
  expect(m1.maxBounds.xMax).toBe(Number.MAX_SAFE_INTEGER);
});

it('Maxes: save', () => {
  const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
  expect(m1.save()).toBe({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
});

it('Maxes: maxesOverlap', () => {
  const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
  const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
  expect(maxesOverlap(m1, m2)).toBeTruthy();
});

it('Maxes: getOverallMaxes', () => {
  const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
  const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
  expect(getOverallMaxes([m1, m2]).save()).toBe({xMax: 150, xMin: 0, yMax: 150, yMin: 0});
});
