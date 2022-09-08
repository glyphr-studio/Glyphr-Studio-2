import { Maxes, maxesMaxBounds } from '../maxes.js';
import { maxesOverlap, getOverallMaxes } from '../maxes.js';

describe('Maxes', () => {
	// beforeAll(() => {
	// 	spyOn(console, 'log').and.callThrough();;
	// });

	it('constructor', () => {
		const m1 = new Maxes();
		expect(m1.xMax).toBe(Number.MIN_SAFE_INTEGER);
	});

	it('xMin getter/setter', () => {
		const m1 = new Maxes();
		m1.xMin = 500;
		expect(m1.xMin).toBe(500);
	});

	it('xMax getter/setter', () => {
		const m1 = new Maxes();
		m1.xMax = 500;
		expect(m1.xMax).toBe(500);
	});

	it('yMin getter/setter', () => {
		const m1 = new Maxes();
		m1.yMin = 500;
		expect(m1.yMin).toBe(500);
	});

	it('yMax getter/setter', () => {
		const m1 = new Maxes();
		m1.yMax = 500;
		expect(m1.yMax).toBe(500);
	});

	it('maxBounds', () => {
		const m1 = maxesMaxBounds();
		expect(m1.xMax).toBe(Number.MAX_SAFE_INTEGER);
	});

	it('save', () => {
		const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
		expect(m1.save()).toEqual({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
	});

	it('maxesOverlap', () => {
		const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
		const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
		expect(maxesOverlap(m1, m2)).toBeTruthy();
	});

	it('getOverallMaxes', () => {
		const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
		const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
		expect(getOverallMaxes([m1, m2]).save()).toEqual({xMax: 150, xMin: 0, yMax: 150, yMin: 0});
	});
});
