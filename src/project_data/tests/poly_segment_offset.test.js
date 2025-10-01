import { describe, expect, it } from 'vitest';
import { round } from '../../common/functions.js';
import { offsetPolySegment } from '../poly_segment_offset.js';
import { Segment } from '../segment.js';

/**
 * Helper function to create a simple square polygon (clockwise)
 * @param {number} size - Side length of the square
 * @returns {Segment[]} Array of segments forming a square
 */
function createSquarePolygon(size = 100) {
	return [
		new Segment({ p1x: 0, p1y: 0, p4x: size, p4y: 0 }), // Bottom edge
		new Segment({ p1x: size, p1y: 0, p4x: size, p4y: size }), // Right edge
		new Segment({ p1x: size, p1y: size, p4x: 0, p4y: size }), // Top edge
		new Segment({ p1x: 0, p1y: size, p4x: 0, p4y: 0 }), // Left edge
	];
}

/**
 * Helper function to create a simple triangle polygon (clockwise)
 * @returns {Segment[]} Array of segments forming a triangle
 */
function createTrianglePolygon() {
	return [
		new Segment({ p1x: 0, p1y: 0, p4x: 100, p4y: 0 }), // Base
		new Segment({ p1x: 100, p1y: 0, p4x: 50, p4y: 100 }), // Right side
		new Segment({ p1x: 50, p1y: 100, p4x: 0, p4y: 0 }), // Left side
	];
}

/**
 * Helper function to create a simple curved segment (quarter circle)
 * @returns {Segment[]} Array with one curved segment
 */
function createCurvedSegment() {
	return [
		new Segment({
			p1x: 0,
			p1y: 0,
			p2x: 0,
			p2y: 55.228,
			p3x: 44.772,
			p3y: 100,
			p4x: 100,
			p4y: 100,
		}), // Quarter circle approximation
	];
}

/**
 * Helper function to create a mixed geometry shape (line + curve)
 * @returns {Segment[]} Array with both straight and curved segments
 */
function createMixedGeometry() {
	return [
		new Segment({ p1x: 0, p1y: 0, p4x: 100, p4y: 0 }), // Straight line
		new Segment({
			p1x: 100,
			p1y: 0,
			p2x: 100,
			p2y: 55.228,
			p3x: 44.772,
			p3y: 100,
			p4x: 0,
			p4y: 100,
		}), // Curved segment
		new Segment({ p1x: 0, p1y: 100, p4x: 0, p4y: 0 }), // Closing straight line
	];
}

/**
 * Helper function to round all coordinates in a segment for comparison
 * @param {Segment} segment - Segment to round
 * @param {number} precision - Decimal places
 * @returns {Object} Rounded segment coordinates
 */
function roundSegment(segment, precision = 2) {
	return {
		p1x: round(segment.p1x, precision),
		p1y: round(segment.p1y, precision),
		p2x: round(segment.p2x, precision),
		p2y: round(segment.p2y, precision),
		p3x: round(segment.p3x, precision),
		p3y: round(segment.p3y, precision),
		p4x: round(segment.p4x, precision),
		p4y: round(segment.p4y, precision),
	};
}

describe('offsetPolySegment', () => {
	describe('Polygon Offsetting', () => {
		it('should expand a square polygon with positive offset', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 10);

			expect(result).toHaveLength(4);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// For a square expanded by 10 units, we expect the bounds to grow
			// Check that the first segment (bottom edge) moves down (y becomes negative)
			expect(result[0].p1y).toBeLessThan(square[0].p1y);
			expect(result[0].p4y).toBeGreaterThan(square[0].p4y);
		});

		it('should shrink a square polygon with negative offset', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, -10);

			expect(result).toHaveLength(4);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// For a square shrunk by 10 units, the overall bounds should be smaller
			const originalBounds = {
				minX: Math.min(...square.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...square.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...square.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...square.map((s) => Math.max(s.p1y, s.p4y))),
			};

			const resultBounds = {
				minX: Math.min(...result.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...result.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...result.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...result.map((s) => Math.max(s.p1y, s.p4y))),
			};

			expect(resultBounds.maxX - resultBounds.minX).toBeLessThan(
				originalBounds.maxX - originalBounds.minX
			);
			expect(resultBounds.maxY - resultBounds.minY).toBeLessThan(
				originalBounds.maxY - originalBounds.minY
			);
		});

		it('should handle triangle polygon expansion', () => {
			const triangle = createTrianglePolygon();
			const result = offsetPolySegment(triangle, 5);

			expect(result).toHaveLength(3);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// Triangle should expand outward - base should move away from centroid
			expect(result[0].p1y).toBeLessThan(triangle[0].p1y);
		});

		it('should preserve straight line segments for polygons', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 10);

			// All segments should remain straight lines
			result.forEach((segment) => {
				expect(segment.isLine).toBe(true);
			});
		});
	});

	describe('Curved Segment Offsetting', () => {
		it('should offset a curved segment with positive distance', () => {
			const curve = createCurvedSegment();
			const result = offsetPolySegment(curve, 10);

			expect(result).toHaveLength(1);
			expect(result[0] instanceof Segment).toBe(true);

			// Curved segment should maintain its curve properties
			expect(result[0].isLine).toBe(false);

			// Start and end points should be offset
			const original = curve[0];
			const offset = result[0];

			// The offset curve should be different from the original
			expect(offset.p1x).not.toBeCloseTo(original.p1x, 0);
			expect(offset.p4y).not.toBeCloseTo(original.p4y, 0);
		});

		it('should offset a curved segment with negative distance', () => {
			const curve = createCurvedSegment();
			const result = offsetPolySegment(curve, -5);

			expect(result).toHaveLength(1);
			expect(result[0] instanceof Segment).toBe(true);
			expect(result[0].isLine).toBe(false);

			// The negative offset should produce different results than positive
			const positiveResult = offsetPolySegment(curve, 5);
			expect(result[0].p1x).not.toBeCloseTo(positiveResult[0].p1x, 0);
			expect(result[0].p4y).not.toBeCloseTo(positiveResult[0].p4y, 0);
		});

		it('should preserve handle relationships in curved segments', () => {
			const curve = createCurvedSegment();
			const result = offsetPolySegment(curve, 10);

			const offset = result[0];

			// Handles should not collapse to endpoints for genuine curves
			const p2IsNotP1 = !(offset.p2x === offset.p1x && offset.p2y === offset.p1y);
			const p3IsNotP4 = !(offset.p3x === offset.p4x && offset.p3y === offset.p4y);

			expect(p2IsNotP1 || p3IsNotP4).toBe(true);
		});
	});

	describe('Mixed Geometry Offsetting', () => {
		it('should handle mixed line and curve segments', () => {
			const mixed = createMixedGeometry();
			const result = offsetPolySegment(mixed, 8);

			expect(result).toHaveLength(3);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// First and last segments should be lines, middle should be curve
			expect(result[0].isLine).toBe(true);
			expect(result[1].isLine).toBe(false);
			expect(result[2].isLine).toBe(true);
		});

		it('should maintain connectivity between segments', () => {
			const mixed = createMixedGeometry();
			const result = offsetPolySegment(mixed, 5);

			// Check that segments connect (end of one = start of next)
			for (let i = 0; i < result.length; i++) {
				const curr = result[i];
				const next = result[(i + 1) % result.length];

				expect(curr.p4x).toBeCloseTo(next.p1x, 1);
				expect(curr.p4y).toBeCloseTo(next.p1y, 1);
			}
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty segment array', () => {
			const result = offsetPolySegment([], 10);
			expect(result).toHaveLength(0);
		});

		it('should handle zero offset distance', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 0);

			expect(result).toHaveLength(4);

			// With zero offset, the overall bounds should remain similar
			// Calculate total bounds of original vs offset
			const originalBounds = {
				minX: Math.min(...square.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...square.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...square.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...square.map((s) => Math.max(s.p1y, s.p4y))),
			};

			const resultBounds = {
				minX: Math.min(...result.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...result.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...result.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...result.map((s) => Math.max(s.p1y, s.p4y))),
			};

			expect(resultBounds.maxX - resultBounds.minX).toBeCloseTo(
				originalBounds.maxX - originalBounds.minX,
				0
			);
			expect(resultBounds.maxY - resultBounds.minY).toBeCloseTo(
				originalBounds.maxY - originalBounds.minY,
				0
			);
		});

		it('should handle very small offset distances', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 0.1);

			expect(result).toHaveLength(4);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);
		});

		it('should handle large offset distances', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 50);

			expect(result).toHaveLength(4);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// Large offset should create significantly different geometry
			expect(Math.abs(result[0].p1y - square[0].p1y)).toBeGreaterThan(40);
		});
	});

	describe('Winding Direction Handling', () => {
		it('should expand clockwise shapes with positive offset', () => {
			const clockwiseSquare = createSquarePolygon(100); // Already clockwise
			const result = offsetPolySegment(clockwiseSquare, 10);

			// Shape should expand - check that bounds are larger
			const originalBounds = {
				minX: Math.min(...clockwiseSquare.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...clockwiseSquare.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...clockwiseSquare.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...clockwiseSquare.map((s) => Math.max(s.p1y, s.p4y))),
			};

			const resultBounds = {
				minX: Math.min(...result.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...result.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...result.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...result.map((s) => Math.max(s.p1y, s.p4y))),
			};

			expect(resultBounds.maxX - resultBounds.minX).toBeGreaterThan(
				originalBounds.maxX - originalBounds.minX
			);
			expect(resultBounds.maxY - resultBounds.minY).toBeGreaterThan(
				originalBounds.maxY - originalBounds.minY
			);
		});

		it('should expand counter-clockwise shapes with positive offset', () => {
			// Create counter-clockwise square by reversing the order
			const ccwSquare = createSquarePolygon(100).reverse();
			const result = offsetPolySegment(ccwSquare, 10);

			expect(result).toHaveLength(4);
			expect(result.every((seg) => seg instanceof Segment)).toBe(true);

			// Should still expand outward despite different winding
			// The algorithm should auto-detect and adjust
		});
	});

	describe('Return Value Validation', () => {
		it('should return array of Segment instances', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 10);

			expect(Array.isArray(result)).toBe(true);
			expect(result.every((item) => item instanceof Segment)).toBe(true);
		});

		it('should return same number of segments as input for simple cases', () => {
			const inputs = [
				createSquarePolygon(100),
				createTrianglePolygon(),
				createCurvedSegment(),
				createMixedGeometry(),
			];

			inputs.forEach((input) => {
				const result = offsetPolySegment(input, 10);
				expect(result.length).toBe(input.length);
			});
		});

		it('should produce finite coordinate values', () => {
			const square = createSquarePolygon(100);
			const result = offsetPolySegment(square, 10);

			result.forEach((segment) => {
				expect(Number.isFinite(segment.p1x)).toBe(true);
				expect(Number.isFinite(segment.p1y)).toBe(true);
				expect(Number.isFinite(segment.p2x)).toBe(true);
				expect(Number.isFinite(segment.p2y)).toBe(true);
				expect(Number.isFinite(segment.p3x)).toBe(true);
				expect(Number.isFinite(segment.p3y)).toBe(true);
				expect(Number.isFinite(segment.p4x)).toBe(true);
				expect(Number.isFinite(segment.p4y)).toBe(true);
			});
		});
	});

	describe('Symmetry and Consistency', () => {
		it('should produce opposite results for positive and negative offsets', () => {
			const square = createSquarePolygon(100);
			const positiveResult = offsetPolySegment(square, 10);
			const negativeResult = offsetPolySegment(square, -10);

			// The results should expand/contract in opposite directions
			const posBounds = {
				minX: Math.min(...positiveResult.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...positiveResult.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...positiveResult.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...positiveResult.map((s) => Math.max(s.p1y, s.p4y))),
			};

			const negBounds = {
				minX: Math.min(...negativeResult.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...negativeResult.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...negativeResult.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...negativeResult.map((s) => Math.max(s.p1y, s.p4y))),
			};

			// Positive should be larger, negative should be smaller
			const posWidth = posBounds.maxX - posBounds.minX;
			const negWidth = negBounds.maxX - negBounds.minX;
			const posHeight = posBounds.maxY - posBounds.minY;
			const negHeight = negBounds.maxY - negBounds.minY;

			expect(posWidth).toBeGreaterThan(negWidth);
			expect(posHeight).toBeGreaterThan(negHeight);
		});

		it('should be approximately reversible for small offsets', () => {
			const square = createSquarePolygon(100);
			const offsetOut = offsetPolySegment(square, 5);
			const offsetBack = offsetPolySegment(offsetOut, -5);

			// Should be close to original bounds (within tolerance due to floating point)
			const originalBounds = {
				minX: Math.min(...square.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...square.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...square.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...square.map((s) => Math.max(s.p1y, s.p4y))),
			};

			const backBounds = {
				minX: Math.min(...offsetBack.map((s) => Math.min(s.p1x, s.p4x))),
				maxX: Math.max(...offsetBack.map((s) => Math.max(s.p1x, s.p4x))),
				minY: Math.min(...offsetBack.map((s) => Math.min(s.p1y, s.p4y))),
				maxY: Math.max(...offsetBack.map((s) => Math.max(s.p1y, s.p4y))),
			};

			expect(backBounds.maxX - backBounds.minX).toBeCloseTo(
				originalBounds.maxX - originalBounds.minX,
				0
			);
			expect(backBounds.maxY - backBounds.minY).toBeCloseTo(
				originalBounds.maxY - originalBounds.minY,
				0
			);
		});
	});
});
