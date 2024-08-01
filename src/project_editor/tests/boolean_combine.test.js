import { rectPathFromMaxes } from '../../edit_canvas/tools/new_basic_path.js';
import { combinePaths } from '../boolean_combine.js';

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
		expect(result[0].svgPathData).toBe(
			'M0,0 C0,0,10,0,10,0 C10,0,10,5,10,5 C10,5,15,5,15,5 C15,5,15,15,15,15 C15,15,5,15,5,15 C5,15,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0Z'
		);
	});

	it('should return the combined paths for the "subtract" operation', () => {
		const result = combinePaths(testPaths, 'subtract');
		expect(result).toHaveLength(1);
		expect(result[0].svgPathData).toBe(
			'M0,0 C0,0,10,0,10,0 C10,0,10,5,10,5 C10,5,5,5,5,5 C5,5,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0Z'
		);
	});

	it('should return the combined paths for the "divide" operation', () => {
		const result = combinePaths(testPaths, 'divide');
		expect(result).toHaveLength(3);
		expect(result[0].svgPathData).toBe(
			'M0,0 C0,0,10,0,10,0 C10,0,10,5,10,5 C10,5,5,5,5,5 C5,5,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0Z'
		);
		expect(result[1].svgPathData).toBe(
			'M10,10 C10,10,5,10,5,10 C5,10,5,5,5,5 C5,5,10,5,10,5 C10,5,10,10,10,10Z'
		);
		expect(result[2].svgPathData).toBe(
			'M15,5 C15,5,15,15,15,15 C15,15,5,15,5,15 C5,15,5,10,5,10 C5,10,10,10,10,10 C10,10,10,5,10,5 C10,5,15,5,15,5Z'
		);
	});

	it('should return the combined paths for the "intersect" operation', () => {
		const result = combinePaths(testPaths, 'intersect');
		expect(result).toHaveLength(1);
		expect(result[0].svgPathData).toBe(
			'M10,10 C10,10,5,10,5,10 C5,10,5,5,5,5 C5,5,10,5,10,5 C10,5,10,10,10,10Z'
		);
	});

	it('should return the combined paths for the "exclude" operation', () => {
		const result = combinePaths(testPaths, 'exclude');
		expect(result).toHaveLength(2);
		expect(result[0].svgPathData).toBe(
			'M0,0 C0,0,10,0,10,0 C10,0,10,5,10,5 C10,5,5,5,5,5 C5,5,5,10,5,10 C5,10,0,10,0,10 C0,10,0,0,0,0Z'
		);
		expect(result[1].svgPathData).toBe(
			'M10,10 C10,10,5,10,5,10 C5,10,5,15,5,15 C5,15,15,15,15,15 C15,15,15,5,15,5 C15,5,10,5,10,5 C10,5,10,10,10,10Z'
		);
	});
});
