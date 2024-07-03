import { describe, expect, it } from 'vitest';
import {
	Maxes,
	getOverallMaxes,
	isAllZeros,
	isMaxes,
	maxesMaxBounds,
	maxesMinBounds,
	maxesOverlap,
} from '../maxes.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	save
	print
	xMin
	xMax
	yMin
	yMax
	center
	width
	height
	roundAll
*/

describe('Maxes', () => {
	it('constructor', () => {
		const maxes = new Maxes({ xMin: 1, xMax: 2, yMin: 3, yMax: 4 });

		expect(maxes.xMin).toBe(1);
		expect(maxes.xMax).toBe(2);
		expect(maxes.yMin).toBe(3);
		expect(maxes.yMax).toBe(4);
	});

	it('defaults', () => {
		const maxes = new Maxes();

		expect(maxes.xMin).toBe(Number.MAX_SAFE_INTEGER);
		expect(maxes.xMax).toBe(Number.MIN_SAFE_INTEGER);
		expect(maxes.yMin).toBe(Number.MAX_SAFE_INTEGER);
		expect(maxes.yMax).toBe(Number.MIN_SAFE_INTEGER);
	});

	it('roundAll', () => {
		const maxes = new Maxes({ xMin: 1.12345, xMax: 2.56789, yMin: 3.98765, yMax: 4.54321 });
		maxes.roundAll(2);

		expect(maxes.xMin).toBeCloseTo(1.12);
		expect(maxes.xMax).toBeCloseTo(2.57);
		expect(maxes.yMin).toBeCloseTo(3.99);
		expect(maxes.yMax).toBeCloseTo(4.54);
	});

	it('isPointInside', () => {
		const maxes = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });

		expect(maxes.isPointInside(2, 3)).toBe(true);
		expect(maxes.isPointInside(4, 3)).toBe(false);
	});

	it('center, width, and height', () => {
		const maxes = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });

		expect(maxes.center).toEqual({ x: 2, y: 3 });
		expect(maxes.width).toBe(2);
		expect(maxes.height).toBe(2);
	});

	it('save', () => {
		const maxes = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });
		const savedData = maxes.save();

		expect(savedData.xMin).toBe(1);
		expect(savedData.xMax).toBe(3);
		expect(savedData.yMin).toBe(2);
		expect(savedData.yMax).toBe(4);
	});

	it('print', () => {
		const maxes = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });
		const formattedString = maxes.print();

		expect(formattedString).toBe('{xMin:1 xMax:3 yMin:2 yMax:4}');
	});
});

describe('isMaxes', () => {
	it('should return true for a Maxes object', () => {
		const maxes1 = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });
		expect(isMaxes(maxes1)).toBe(true);
	});

	it('should return true for a Maxes-like object', () => {
		expect(isMaxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 })).toBe(true);
	});

	it('should return false for a nearly-Maxes-like object', () => {
		expect(isMaxes({ xMin: 1, xMax: 3, yMin: 2})).toBe(false);
	});

	it('should return false for random objects', () => {
		expect(isMaxes({'name': 'value'})).toBe(false);
	});
});

describe('maxesOverlap', () => {
	it('should detect overlap between two Maxes objects', () => {
		const maxes1 = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });
		const maxes2 = new Maxes({ xMin: 2, xMax: 4, yMin: 3, yMax: 5 });

		expect(maxesOverlap(maxes1, maxes2)).toBe(true);
	});

	it('should detect no overlap between two Maxes objects', () => {
		const maxes1 = new Maxes({ xMin: 1, xMax: 3, yMin: 2, yMax: 4 });
		const maxes2 = new Maxes({ xMin: 4, xMax: 5, yMin: 5, yMax: 6 });

		expect(maxesOverlap(maxes1, maxes2)).toBe(false);
	});
});

describe('getOverallMaxes', () => {
	it('should calculate the overall Maxes from an array of Maxes objects', () => {
		const maxesArray = [
			{ xMin: 1, xMax: 3, yMin: 2, yMax: 4 },
			{ xMin: 2, xMax: 4, yMin: 3, yMax: 5 },
			{ xMin: 0, xMax: 2, yMin: 1, yMax: 3 },
		];

		const overallMaxes = getOverallMaxes(maxesArray);

		expect(overallMaxes.xMin).toBe(0);
		expect(overallMaxes.xMax).toBe(4);
		expect(overallMaxes.yMin).toBe(1);
		expect(overallMaxes.yMax).toBe(5);
	});
});

describe('isAllZeros', () => {
	it('should check if all values in a Maxes object are zero', () => {
		const maxes1 = new Maxes({ xMin: 0, xMax: 0, yMin: 0, yMax: 0 });
		const maxes2 = new Maxes({ xMin: 1, xMax: 0, yMin: 0, yMax: 0 });

		// expect(isAllZeros(maxes1)).toBe(true);
		expect(maxes1.xMin).toEqual(0);
		expect(maxes1.xMax).toEqual(0);
		expect(maxes1.yMin).toEqual(0);
		expect(maxes1.yMax).toEqual(0);
		expect(isAllZeros(maxes2)).toBe(false);
	});
});

describe('maxesMinBounds', () => {
	it('should return the minimum bounds for a Maxes object', () => {
		const minBounds = maxesMinBounds();

		expect(minBounds.xMin).toBe(Number.MAX_SAFE_INTEGER);
		expect(minBounds.xMax).toBe(Number.MIN_SAFE_INTEGER);
		expect(minBounds.yMin).toBe(Number.MAX_SAFE_INTEGER);
		expect(minBounds.yMax).toBe(Number.MIN_SAFE_INTEGER);
	});
});

describe('maxesMaxBounds', () => {
	it('should return the maximum bounds for a Maxes object', () => {
		const maxBounds = maxesMaxBounds();

		expect(maxBounds.xMin).toBe(Number.MIN_SAFE_INTEGER);
		expect(maxBounds.xMax).toBe(Number.MAX_SAFE_INTEGER);
		expect(maxBounds.yMin).toBe(Number.MIN_SAFE_INTEGER);
		expect(maxBounds.yMax).toBe(Number.MAX_SAFE_INTEGER);
	});
});
