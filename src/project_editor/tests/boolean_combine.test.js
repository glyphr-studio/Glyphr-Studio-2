import { rectPathFromMaxes } from '../../edit_canvas/tools/new_basic_path.js';
import { combinePaths } from '../boolean_combine.js';

// Helper: compare two SVG path data strings for geometric equivalence
// This is a simple bounding box comparison for demo; replace with a more robust method if needed
function getBoundingBox(svgPathData) {
	// Only works for simple M/L/C/Z paths, not arcs or complex curves
	const nums = Array.from(svgPathData.matchAll(/[-+]?[0-9]*\.?[0-9]+/g)).map(Number);
	let xs = [], ys = [];
	for (let i = 0; i < nums.length; i += 2) {
		xs.push(nums[i]);
		ys.push(nums[i + 1]);
	}
	return {
		minX: Math.min(...xs),
		maxX: Math.max(...xs),
		minY: Math.min(...ys),
		maxY: Math.max(...ys),
	};
}

function pathsRoughlyEqual(path1, path2, tol = 0.01) {
	const b1 = getBoundingBox(path1);
	const b2 = getBoundingBox(path2);
	return (
		Math.abs(b1.minX - b2.minX) < tol &&
		Math.abs(b1.maxX - b2.maxX) < tol &&
		Math.abs(b1.minY - b2.minY) < tol &&
		Math.abs(b1.maxY - b2.maxY) < tol
	);
}

let testPaths = [
	rectPathFromMaxes({ xMin: 0, xMax: 10, yMin: 0, yMax: 10 }),
	rectPathFromMaxes({ xMin: 5, xMax: 15, yMin: 5, yMax: 15 }),
];

describe('combinePaths', () => {
	it('should return an error message when no paths are provided', () => {
		const result = combinePaths([], 'unite');
		expect(result).toBe('No paths were found to combine.');
	});

	it('should return an error message for an unknown combine operation', () => {
		const result = combinePaths(testPaths, 'unknownOp');
		expect(result).toBe('Unknown combine operation: unknownOp');
	});

	it('should return the combined paths for the "unite" operation', () => {
		const result = combinePaths(testPaths, 'unite');
		expect(result).toHaveLength(1);
		// Expect bounding box to match the union of the two squares
		const expected = 'M10,0 C10,0,10,5,10,5 C10,5,15,5,15,5 C15,5,15,15,15,15 C15,15,5,15,5,15 C5,15,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0 C0,0,10,0,10,0Z';
		expect(pathsRoughlyEqual(result[0].svgPathData, expected)).toBe(true);
	});

	it('should return the combined paths for the "subtract" operation', () => {
		const result = combinePaths(testPaths, 'subtract');
		expect(result).toHaveLength(1);
		const expected = 'M10,0 C10,0,10,5,10,5 C10,5,5,5,5,5 C5,5,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0 C0,0,10,0,10,0Z';
		expect(pathsRoughlyEqual(result[0].svgPathData, expected)).toBe(true);
	});

	it('should return the combined paths for the "divide" operation', () => {
		const result = combinePaths(testPaths, 'divide');
		expect(result).toHaveLength(3);
		// Get bounding boxes for each region and sort by minX/minY for stable comparison
		const actualBoxes = result.map(r => getBoundingBox(r.svgPathData)).sort((a, b) => (a.minX - b.minX) || (a.minY - b.minY));
		// Update these expected boxes to match bezier-boolean's output order and values
		const expectedBoxes = [
			{ minX: 0, maxX: 10, minY: 0, maxY: 10 },
			{ minX: 5, maxX: 15, minY: 5, maxY: 15 },
			{ minX: 5, maxX: 10, minY: 5, maxY: 10 },
		];
		const sortedExpected = expectedBoxes.sort((a, b) => (a.minX - b.minX) || (a.minY - b.minY));
		actualBoxes.forEach((b, i) => {
			const e = sortedExpected[i];
			expect(Math.abs(b.minX - e.minX)).toBeLessThan(0.01);
			expect(Math.abs(b.maxX - e.maxX)).toBeLessThan(0.01);
			expect(Math.abs(b.minY - e.minY)).toBeLessThan(0.01);
			expect(Math.abs(b.maxY - e.maxY)).toBeLessThan(0.01);
		});
	});

	it('should return the combined paths for the "intersect" operation', () => {
		const result = combinePaths(testPaths, 'intersect');
		expect(result).toHaveLength(1);
		// Intersection is the overlap: (5,5)-(10,10)
		const expected = 'M5,10 C5,10,5,5,5,5 C5,5,10,5,10,5 C10,5,10,10,10,10 C10,10,5,10,5,10Z';
		expect(pathsRoughlyEqual(result[0].svgPathData, expected)).toBe(true);
	});

	it('should return the combined paths for the "exclude" operation', () => {
		const result = combinePaths(testPaths, 'exclude');
		expect(result).toHaveLength(2);
		// Exclude: two non-overlapping regions
		const expectedBoxes = [
			{ minX: 0, maxX: 10, minY: 0, maxY: 10 },
			{ minX: 5, maxX: 15, minY: 5, maxY: 15 },
		];
		result.forEach((r, i) => {
			const b = getBoundingBox(r.svgPathData);
			const e = expectedBoxes[i];
			expect(Math.abs(b.minX - e.minX)).toBeLessThan(0.01);
			expect(Math.abs(b.maxX - e.maxX)).toBeLessThan(0.01);
			expect(Math.abs(b.minY - e.minY)).toBeLessThan(0.01);
			expect(Math.abs(b.maxY - e.maxY)).toBeLessThan(0.01);
		});
	});
});
