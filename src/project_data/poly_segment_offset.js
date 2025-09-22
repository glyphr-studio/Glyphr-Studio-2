import { Segment } from './segment.js';

// =======================================
// MAIN FUNCTION
// =======================================

/**
 * Main entry point: Offset a sequence of segments (polygon or general curve).
 * Accepts either an array of Segment objects or an object with a `segments` array (backward compatible with former PolySegment).
 * Automatically detects winding direction and ensures positive offsets always expand the shape.
 * @param {Segment[] | {segments: Segment[]}} inputSegments Segments or object containing them
 * @param {number} distance Offset distance (positive = expand)
 * @returns {Segment[]} Array of offset segments
 */
export function offsetPolySegment(inputSegments, distance) {
	let segments;
	if (Array.isArray(inputSegments)) {
		segments = inputSegments;
	} else if (inputSegments && Array.isArray(inputSegments.segments)) {
		segments = inputSegments.segments;
	} else {
		throw new Error(
			'offsetPolySegment expects Segment[] or {segments: Segment[]}'
		);
	}

	// Detect winding direction
	const signedArea = calculateWindingSignedArea(segments);
	const isCounterClockwise = signedArea > 0;

	// Based on empirical testing with the left-hand normal (-dy, dx):
	// - Positive signed area (visually clockwise): expands with NEGATIVE distance
	// - Negative signed area (visually counter-clockwise): expands with POSITIVE distance
	//
	// To ensure positive input distance always expands the shape:
	let adjustedDistance = distance;
	if (isCounterClockwise) {
		// Positive signed area = visually clockwise
		adjustedDistance = -distance; // Use negative distance to expand clockwise shapes
	}
	// For counter-clockwise shapes (negative signed area), use positive distance as-is

	let result;
	if (isPolygon(segments)) {
		result = offsetPolygon(segments, adjustedDistance);
	} else {
		result = offsetGeneralCurve(segments, adjustedDistance);
	}

	// Backward compatibility: provide .segments accessor on returned array
	if (
		Array.isArray(result) &&
		!Object.prototype.hasOwnProperty.call(result, 'segments')
	) {
		Object.defineProperty(result, 'segments', {
			value: result,
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}

	return result;
}

/**
 * Calculate signed area using shoelace formula to determine winding direction.
 * @param {Segment[]} segments
 * @returns {number} Signed area (positive = CCW, negative = CW)
 */
function calculateWindingSignedArea(segments) {
	let area = 0;

	// Extract all points in order (just use p1 of each segment, since p4 of segment i = p1 of segment i+1)
	const points = segments.map((s) => ({ x: s.p1x, y: s.p1y }));

	// Apply shoelace formula
	for (let i = 0; i < points.length; i++) {
		const current = points[i];
		const next = points[(i + 1) % points.length];
		area += current.x * next.y - next.x * current.y;
	}

	return area / 2;
}

// =======================================
// CORE ALGORITHM FUNCTIONS
// =======================================

/**
 * Check if a set of segments represents a polygon (all segments are straight lines).
 * @param {Segment[]} segments
 * @returns {boolean}
 */
function isPolygon(segments) {
	return segments.every((segment) => segment.isLine);
}

/**
 * Offset a polygon (all straight segments) by creating parallel lines and finding intersections.
 * @param {Segment[]} segments
 * @param {number} distance
 * @returns {Segment[]} Offset segments
 */
function offsetPolygon(segments, distance) {
	const offsetSegments = [];

	// Offset each segment as a straight line
	const offsetLines = segments.map((segment) =>
		offsetStraightLineSegment(segment, distance)
	);

	// Calculate intersection points between consecutive offset lines
	const intersectionPoints = [];
	for (let i = 0; i < offsetLines.length; i++) {
		const currentLine = offsetLines[i];
		const nextLine = offsetLines[(i + 1) % offsetLines.length];

		// Find intersection point
		const intersection = calculateStraightStraightJoint(currentLine, nextLine);
		intersectionPoints.push(intersection);
	}

	// Create segments connecting consecutive intersection points
	for (let i = 0; i < intersectionPoints.length; i++) {
		const startPoint = intersectionPoints[i];
		const endPoint = intersectionPoints[(i + 1) % intersectionPoints.length];

		// Create a new segment from intersection to intersection
		const newSegment = createStraightSegment(
			startPoint.x,
			startPoint.y,
			endPoint.x,
			endPoint.y
		);

		offsetSegments.push(newSegment);
	}

	return offsetSegments;
}

/**
 * Offset general curves using adaptive subdivision, join handling, and post-processing.
 * @param {Segment[]} originalSegments
 * @param {number} distance
 * @returns {Segment[]} Offset segments
 */
function offsetGeneralCurve(originalSegments, distance) {
	let offsetSegments = [];

	// Track which handles were originally zero-length
	const zeroLengthHandles = [];

	for (let i = 0; i < originalSegments.length; i++) {
		const segment = originalSegments[i];

		// Record zero-length handle information
		zeroLengthHandles[i] = {
			startZeroLength:
				segment.p1x === segment.p2x && segment.p1y === segment.p2y,
			endZeroLength: segment.p3x === segment.p4x && segment.p3y === segment.p4y,
		};

		const offsetSeg = offsetSingleSegment(segment, distance);
		offsetSegments.push(offsetSeg);
	}

	// Apply intelligent join handling that preserves curve geometry
	offsetSegments = handleJoins(offsetSegments, zeroLengthHandles);

	// Apply special handling for zero-length handle junctions
	offsetSegments = improveZeroLengthHandleJunctions(
		offsetSegments,
		zeroLengthHandles,
		distance
	);

	// Apply proper handle preservation based on geometric rules
	offsetSegments = preserveHandleGeometry(
		offsetSegments,
		originalSegments,
		distance
	);

	return offsetSegments;
}

// =======================================
// SUPPORTING FUNCTIONS
// =======================================

/**
 * Handle joins between offset segments (miter, round, bevel).
 * Intelligently handles both straight lines and curves.
 * @param {Segment[]} segments - Array of segments to join
 * @returns {Segment[]} Array of joined segments
 */
function handleJoins(segments, zeroLengthHandles = null) {
	if (segments.length < 2) return segments;

	for (let i = 0; i < segments.length; i++) {
		const curr = segments[i];
		const next = segments[(i + 1) % segments.length];
		const nextIndex = (i + 1) % segments.length;

		// Calculate the gap between current end and next start
		const gap = Math.sqrt(
			(curr.p4x - next.p1x) ** 2 + (curr.p4y - next.p1y) ** 2
		);

		// Check for zero-length handles at the junction using original segment information
		let currHasZeroLengthEnd = false;
		let nextHasZeroLengthStart = false;

		if (zeroLengthHandles && i >= 0 && nextIndex >= 0) {
			currHasZeroLengthEnd =
				zeroLengthHandles[i] && zeroLengthHandles[i].endZeroLength;
			nextHasZeroLengthStart =
				zeroLengthHandles[nextIndex] &&
				zeroLengthHandles[nextIndex].startZeroLength;
		}

		// For zero-length handles, force proper junction calculation instead of snapping
		const shouldForceJunctionCalculation =
			currHasZeroLengthEnd && nextHasZeroLengthStart;

		// If segments are already close enough (within 0.1 units) AND not zero-length, just snap
		if (gap < 0.1 && !shouldForceJunctionCalculation) {
			next.p1x = curr.p4x;
			next.p1y = curr.p4y;

			// Handle zero-length handles - move them along with their points
			adjustZeroLengthHandlesAtJunction(
				curr,
				next,
				i,
				nextIndex,
				zeroLengthHandles
			);
			continue;
		}

		/**
		 * Junction movement behavior for acute vs flat angles.
		 * Controls how much junction points move relative to the offset distance.
		 *
		 * Options:
		 * - 'midpoint' (default): Simple midpoint averaging - balanced movement
		 * - 'miter': True geometric miter - acute angles move much less, flat angles move linearly
		 * - 'linear': Force all junctions to move linearly with offset distance
		 * - 'damped': Reduce movement at acute angles more than midpoint but less than miter
		 * - 'enhanced': Increase movement at acute angles compared to midpoint
		 *
		 * Range effects:
		 * - 'miter': Most dramatic difference between acute/flat (acute moves least)
		 * - 'damped': Moderate reduction of acute angle movement
		 * - 'midpoint': Balanced movement (current default)
		 * - 'enhanced': Moderate increase of acute angle movement
		 * - 'linear': All angles move uniformly (least realistic but most predictable)
		 */
		const JUNCTION_BEHAVIOR = 'miter';

		// For curve offsetting, we need to use proper geometric joins
		// Calculate join point based on configured junction behavior
		const joinPoint = calculateJunctionPoint(
			curr,
			next,
			JUNCTION_BEHAVIOR,
			i,
			nextIndex,
			zeroLengthHandles
		);

		// Update endpoints to the join point
		curr.p4x = joinPoint.x;
		curr.p4y = joinPoint.y;
		next.p1x = joinPoint.x;
		next.p1y = joinPoint.y;

		// Handle zero-length handles - move them along with their points
		adjustZeroLengthHandlesAtJunction(
			curr,
			next,
			i,
			nextIndex,
			zeroLengthHandles
		);

		// Adjust control points to maintain shape quality
		if (curr.isLine) {
			adjustStraightLineControlPoints(curr);
		}
		if (next.isLine) {
			adjustStraightLineControlPoints(next);
		}
	}
	return segments;
}

/**
 * Calculate junction point between two segments based on behavior setting.
 * @param {Segment} curr - Current segment
 * @param {Segment} next - Next segment
 * @param {string} behavior - Junction behavior ('midpoint', 'miter', 'linear', 'damped', 'enhanced')
 * @param {number} currIndex - Index of current segment
 * @param {number} nextIndex - Index of next segment
 * @param {Array} zeroLengthHandles - Array tracking which handles were originally zero-length
 * @returns {{x: number, y: number}} The calculated junction point
 */
function calculateJunctionPoint(
	curr,
	next,
	behavior,
	currIndex = -1,
	nextIndex = -1,
	zeroLengthHandles = null
) {
	// Check for zero-length handles at the junction using original segment information
	let currHasZeroLengthEnd = false;
	let nextHasZeroLengthStart = false;

	if (zeroLengthHandles && currIndex >= 0 && nextIndex >= 0) {
		currHasZeroLengthEnd =
			zeroLengthHandles[currIndex] &&
			zeroLengthHandles[currIndex].endZeroLength;
		nextHasZeroLengthStart =
			zeroLengthHandles[nextIndex] &&
			zeroLengthHandles[nextIndex].startZeroLength;
	} else {
		// Fallback to current state detection
		currHasZeroLengthEnd = curr.p3x === curr.p4x && curr.p3y === curr.p4y;
		nextHasZeroLengthStart = next.p1x === next.p2x && next.p1y === next.p2y;
	}

	// If both segments have zero-length handles at the junction, treat as sharp corner
	if (currHasZeroLengthEnd && nextHasZeroLengthStart) {
		// For zero-length handles, use linear behavior which forces normal movement
		// This treats the junction as a sharp corner that moves linearly with offset
		return {
			x: (curr.p4x + next.p1x) / 2,
			y: (curr.p4y + next.p1y) / 2,
		};
	}

	const midpoint = {
		x: (curr.p4x + next.p1x) / 2,
		y: (curr.p4y + next.p1y) / 2,
	};

	switch (behavior) {
		case 'midpoint':
			return midpoint;

		case 'miter':
			// True geometric miter - find intersection of extended lines
			if (curr.isLine && next.isLine) {
				return calculateStraightStraightJoint(curr, next);
			}
			return midpoint; // Fallback for curves

		case 'linear': {
			// Force linear movement - move junction point more substantially
			// For zero-length handles, use a more aggressive approach
			const avgX = (curr.p4x + next.p1x) / 2;
			const avgY = (curr.p4y + next.p1y) / 2;
			return {
				x: avgX,
				y: avgY,
			};
		}

		case 'damped': {
			// Reduce movement at acute angles
			const dampedPoint = calculateDampedJunction(curr, next, midpoint);
			return dampedPoint;
		}

		case 'enhanced': {
			// Increase movement at acute angles
			const enhancedPoint = calculateEnhancedJunction(curr, next, midpoint);
			return enhancedPoint;
		}

		default:
			return midpoint;
	}
}

/**
 * Calculate damped junction point - reduces movement at acute angles.
 * @param {Segment} curr - Current segment
 * @param {Segment} next - Next segment
 * @param {{x: number, y: number}} midpoint - Basic midpoint
 * @returns {{x: number, y: number}} Damped junction point
 */
function calculateDampedJunction(curr, next, midpoint) {
	// Calculate angle between segments
	const angle = calculateSegmentAngle(curr, next);

	// Damping factor: reduce movement for acute angles (0-90°)
	// Factor ranges from 0.5 (most damping at 0°) to 1.0 (no damping at 90°+)
	const dampingFactor = Math.max(0.5, Math.min(1.0, angle / (Math.PI / 2)));

	// Apply damping by moving toward the original endpoints
	return {
		x:
			midpoint.x * dampingFactor +
			((curr.p4x + next.p1x) * (1 - dampingFactor)) / 2,
		y:
			midpoint.y * dampingFactor +
			((curr.p4y + next.p1y) * (1 - dampingFactor)) / 2,
	};
}

/**
 * Calculate enhanced junction point - increases movement at acute angles.
 * @param {Segment} curr - Current segment
 * @param {Segment} next - Next segment
 * @param {{x: number, y: number}} midpoint - Basic midpoint
 * @returns {{x: number, y: number}} Enhanced junction point
 */
function calculateEnhancedJunction(curr, next, midpoint) {
	// Calculate angle between segments
	const angle = calculateSegmentAngle(curr, next);

	// Enhancement factor: increase movement for acute angles
	// Factor ranges from 1.5 (most enhancement at 0°) to 1.0 (no enhancement at 90°+)
	const enhancementFactor = Math.max(
		1.0,
		Math.min(1.5, 1.5 - angle / (Math.PI / 2))
	);

	// Apply enhancement by moving away from original endpoints
	const dx = midpoint.x - (curr.p4x + next.p1x) / 2;
	const dy = midpoint.y - (curr.p4y + next.p1y) / 2;

	return {
		x: midpoint.x + dx * (enhancementFactor - 1),
		y: midpoint.y + dy * (enhancementFactor - 1),
	};
}

/**
 * Calculate the angle between two segments at their junction.
 * @param {Segment} curr - Current segment
 * @param {Segment} next - Next segment
 * @returns {number} Angle in radians (0 to π)
 */
function calculateSegmentAngle(curr, next) {
	// Get direction vectors
	const dir1 = {
		x: curr.p4x - curr.p3x,
		y: curr.p4y - curr.p3y,
	};
	const dir2 = {
		x: next.p2x - next.p1x,
		y: next.p2y - next.p1y,
	};

	// Normalize vectors
	const len1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
	const len2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);

	if (len1 === 0 || len2 === 0) return Math.PI / 2; // Default to 90° if zero-length

	dir1.x /= len1;
	dir1.y /= len1;
	dir2.x /= len2;
	dir2.y /= len2;

	// Calculate angle between vectors
	const dot = dir1.x * dir2.x + dir1.y * dir2.y;
	return Math.acos(Math.max(-1, Math.min(1, Math.abs(dot))));
}

/**
 * Adjust zero-length handles at a junction to move along with their points.
 * This treats zero-length handles (where handle equals point) as sharp corners.
 * @param {Segment} curr - Current segment
 * @param {Segment} next - Next segment
 * @param {number} currIndex - Index of current segment
 * @param {number} nextIndex - Index of next segment
 * @param {Array} zeroLengthHandles - Array tracking which handles were originally zero-length
 */
function adjustZeroLengthHandlesAtJunction(
	curr,
	next,
	currIndex,
	nextIndex,
	zeroLengthHandles
) {
	if (!zeroLengthHandles) return;

	// Check if current segment originally had zero-length end handle (p3 == p4)
	if (
		zeroLengthHandles[currIndex] &&
		zeroLengthHandles[currIndex].endZeroLength
	) {
		// Keep p3 at the same position as p4
		curr.p3x = curr.p4x;
		curr.p3y = curr.p4y;
	}

	// Check if next segment originally had zero-length start handle (p1 == p2)
	if (
		zeroLengthHandles[nextIndex] &&
		zeroLengthHandles[nextIndex].startZeroLength
	) {
		// Keep p2 at the same position as p1
		next.p2x = next.p1x;
		next.p2y = next.p1y;
	}
}

/**
 * Improve junction points for segments with zero-length handles by moving them
 * proportionally with the offset distance. This provides more intuitive behavior
 * for sharp corners where handles equal their points.
 * @param {Segment[]} segments - Array of offset segments
 * @param {Array} zeroLengthHandles - Array tracking which handles were originally zero-length
 * @param {number} offsetDistance - The offset distance used
 * @returns {Segment[]} Segments with improved zero-length handle junctions
 */
function improveZeroLengthHandleJunctions(
	segments,
	zeroLengthHandles,
	offsetDistance
) {
	if (!zeroLengthHandles || segments.length < 2) return segments;

	for (let i = 0; i < segments.length; i++) {
		const curr = segments[i];
		const next = segments[(i + 1) % segments.length];
		const nextIndex = (i + 1) % segments.length;

		// Check if this junction has zero-length handles
		const currHasZeroLengthEnd =
			zeroLengthHandles[i] && zeroLengthHandles[i].endZeroLength;
		const nextHasZeroLengthStart =
			zeroLengthHandles[nextIndex] &&
			zeroLengthHandles[nextIndex].startZeroLength;

		if (currHasZeroLengthEnd && nextHasZeroLengthStart) {
			// Calculate a new junction position that moves more proportionally with offset
			// Use a simple approach: move the junction point in the direction perpendicular
			// to the average direction of the adjacent segments

			// Get directions from the segments
			const currDirection = {
				x: curr.p4x - curr.p1x,
				y: curr.p4y - curr.p1y,
			};
			const nextDirection = {
				x: next.p4x - next.p1x,
				y: next.p4y - next.p1y,
			};

			// Normalize directions
			const currLen = Math.sqrt(currDirection.x ** 2 + currDirection.y ** 2);
			const nextLen = Math.sqrt(nextDirection.x ** 2 + nextDirection.y ** 2);

			if (currLen > 0 && nextLen > 0) {
				currDirection.x /= currLen;
				currDirection.y /= currLen;
				nextDirection.x /= nextLen;
				nextDirection.y /= nextLen;

				// Calculate perpendicular direction (average normal)
				const avgDirection = {
					x: (currDirection.x + nextDirection.x) / 2,
					y: (currDirection.y + nextDirection.y) / 2,
				};

				// Get perpendicular to average direction
				const perpendicular = {
					x: -avgDirection.y,
					y: avgDirection.x,
				};

				// Normalize perpendicular
				const perpLen = Math.sqrt(perpendicular.x ** 2 + perpendicular.y ** 2);
				if (perpLen > 0) {
					perpendicular.x /= perpLen;
					perpendicular.y /= perpLen;

					// Move junction point by a fraction of the offset distance
					const moveDistance = offsetDistance * 0.2; // Move 20% of offset distance
					const currentJunctionX = curr.p4x; // Should be same as next.p1x
					const currentJunctionY = curr.p4y; // Should be same as next.p1y

					const newJunctionX =
						currentJunctionX + perpendicular.x * moveDistance;
					const newJunctionY =
						currentJunctionY + perpendicular.y * moveDistance;

					// Update both segments to use the new junction point
					curr.p4x = newJunctionX;
					curr.p4y = newJunctionY;
					next.p1x = newJunctionX;
					next.p1y = newJunctionY;

					// Keep zero-length handles at the same position as their points
					if (currHasZeroLengthEnd) {
						curr.p3x = curr.p4x;
						curr.p3y = curr.p4y;
					}
					if (nextHasZeroLengthStart) {
						next.p2x = next.p1x;
						next.p2y = next.p1y;
					}
				}
			}
		}
	}

	return segments;
}

/**
 * Offset a single segment, choosing straight or curved logic.
 * @param {Segment} segment - The segment to offset
 * @param {number} distance - The offset distance
 * @returns {Segment} The offset segment
 */
function offsetSingleSegment(segment, distance) {
	if (segment.isLine) {
		return offsetStraightLineSegment(segment, distance);
	} else {
		return offsetCurvedSegment(segment, distance);
	}
}

/**
 * Offset a straight line segment.
 * All points move by the same distance perpendicular to the line.
 * @param {Segment} segment - The segment to offset
 * @param {number} distance - The offset distance
 * @returns {Segment} The offset segment
 */
function offsetStraightLineSegment(segment, distance) {
	// Calculate the line direction
	const lineVector = {
		x: segment.p4x - segment.p1x,
		y: segment.p4y - segment.p1y,
	};

	// Calculate perpendicular (normal) direction
	// Use left-hand normal (-dy, dx) - this points "outward" for clockwise shapes
	// and "inward" for counter-clockwise shapes when distance is positive
	const normal = { x: -lineVector.y, y: lineVector.x };
	const normalUnit = normalize(normal);

	// Offset all points by the same distance
	const offset = { x: normalUnit.x * distance, y: normalUnit.y * distance };

	// Determine if segment has explicit (non-zero-length) handles using public getters.
	// If both handles collapse to endpoints, treat as no handles.
	const handlesCollapseToLine =
		segment.p2x === segment.p1x &&
		segment.p2y === segment.p1y &&
		segment.p3x === segment.p4x &&
		segment.p3y === segment.p4y;
	const hasExplicitHandles = !handlesCollapseToLine;

	if (hasExplicitHandles) {
		// Original segment has coordinate handles, offset them
		return new Segment({
			p1x: segment.p1x + offset.x,
			p1y: segment.p1y + offset.y,
			p2x: segment.p2x + offset.x,
			p2y: segment.p2y + offset.y,
			p3x: segment.p3x + offset.x,
			p3y: segment.p3y + offset.y,
			p4x: segment.p4x + offset.x,
			p4y: segment.p4y + offset.y,
		});
	} else {
		// Original segment has no handles (false values), preserve that state
		return new Segment({
			p1x: segment.p1x + offset.x,
			p1y: segment.p1y + offset.y,
			p4x: segment.p4x + offset.x,
			p4y: segment.p4y + offset.y,
		});
	}
}

/**
 * Offset a curved segment by moving each control point along its normal direction.
 * @param {Segment} segment - The segment to offset
 * @param {number} distance - The offset distance
 * @returns {Segment} The offset segment
 */
function offsetCurvedSegment(segment, distance) {
	// Helper to compute normal at t
	function getNormalAtT(segment, t) {
		// Derivative of cubic Bezier at t
		const mt = 1 - t;
		const dx =
			-3 * mt * mt * segment.p1x +
			3 * mt * mt * segment.p2x -
			6 * mt * t * segment.p2x +
			6 * mt * t * segment.p3x -
			3 * t * t * segment.p3x +
			3 * t * t * segment.p4x;
		const dy =
			-3 * mt * mt * segment.p1y +
			3 * mt * mt * segment.p2y -
			6 * mt * t * segment.p2y +
			6 * mt * t * segment.p3y -
			3 * t * t * segment.p3y +
			3 * t * t * segment.p4y;
		// Normal is (-dy, dx)
		return normalize({ x: -dy, y: dx });
	}

	// Offset each control point along normal at its position
	const t1 = 0;
	const t2 = 1 / 3;
	const t3 = 2 / 3;
	const t4 = 1;

	const pt1 = evaluateSegmentAt(segment, t1);
	const pt2 = evaluateSegmentAt(segment, t2);
	const pt3 = evaluateSegmentAt(segment, t3);
	const pt4 = evaluateSegmentAt(segment, t4);

	const n1 = getNormalAtT(segment, t1);
	const n2 = getNormalAtT(segment, t2);
	const n3 = getNormalAtT(segment, t3);
	const n4 = getNormalAtT(segment, t4);

	const p1 = { x: pt1.x + n1.x * distance, y: pt1.y + n1.y * distance };
	const p2 = { x: pt2.x + n2.x * distance, y: pt2.y + n2.y * distance };
	const p3 = { x: pt3.x + n3.x * distance, y: pt3.y + n3.y * distance };
	const p4 = { x: pt4.x + n4.x * distance, y: pt4.y + n4.y * distance };

	return new Segment({
		p1x: p1.x,
		p1y: p1.y,
		p2x: p2.x,
		p2y: p2.y,
		p3x: p3.x,
		p3y: p3.y,
		p4x: p4.x,
		p4y: p4.y,
	});
}

/**
 * Create a perfectly straight line segment between two points.
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x4 - End X coordinate
 * @param {number} y4 - End Y coordinate
 * @returns {Segment} A straight line segment
 */
function createStraightSegment(x1, y1, x4, y4) {
	return new Segment({
		p1x: x1,
		p1y: y1,
		p4x: x4,
		p4y: y4,
	});
}

/**
 * Calculate the proper connection point for two offset straight line segments.
 * Finds the intersection of the two infinite lines.
 * @param {Segment} segment1 - The first offset straight line segment
 * @param {Segment} segment2 - The second offset straight line segment
 * @returns {{x: number, y: number}} The intersection point
 */
function calculateStraightStraightJoint(segment1, segment2) {
	const line1P1 = { x: segment1.p1x, y: segment1.p1y };
	const line1P2 = { x: segment1.p4x, y: segment1.p4y };
	const line2P1 = { x: segment2.p1x, y: segment2.p1y };
	const line2P2 = { x: segment2.p4x, y: segment2.p4y };

	// Find intersection of the two lines
	const intersection = lineIntersection(line1P1, line1P2, line2P1, line2P2);

	if (intersection) {
		return intersection;
	} else {
		// Lines are parallel - fallback to midpoint averaging
		return {
			x: (segment1.p4x + segment2.p1x) / 2,
			y: (segment1.p4y + segment2.p1y) / 2,
		};
	}
}

/**
 * Adjust control points of a straight line segment to maintain straightness.
 * Called after endpoints have been modified during reconnection.
 * @param {Segment} segment - The segment to adjust
 */
function adjustStraightLineControlPoints(segment) {
	// Detect absence of handles without using internal underscore fields.
	// If the public getters return the endpoints, we treat as no handles.
	const hasNoHandles =
		segment.p2x === segment.p1x &&
		segment.p2y === segment.p1y &&
		segment.p3x === segment.p4x &&
		segment.p3y === segment.p4y;

	if (hasNoHandles) {
		// Nothing to do; leaving them coincident preserves straight line semantics.
		return;
	}

	// For a straight line with explicit (non-zero-length) handles, reposition them
	// along the line at 1/3 and 2/3 to maintain smooth scaling.
	const dx = segment.p4x - segment.p1x;
	const dy = segment.p4y - segment.p1y;

	segment.p2x = segment.p1x + dx / 3;
	segment.p2y = segment.p1y + dy / 3;
	segment.p3x = segment.p1x + (2 * dx) / 3;
	segment.p3y = segment.p1y + (2 * dy) / 3;
}

// =======================================
// HANDLE ANGLE PRESERVATION FUNCTIONS
// =======================================

/**
 * Preserve handle geometry according to the three rules:
 * 1. Angle OP-OH equals Angle NP-NH
 * 2. Handle distance scales appropriately
 * 3. Joint angles preserved between segments
 * @param {Segment[]} offsetSegments
 * @param {Segment[]} originalSegments
 * @param {number} offsetDistance
 * @returns {Segment[]}
 */
function preserveHandleGeometry(
	offsetSegments,
	originalSegments,
	offsetDistance
) {
	for (let i = 0; i < offsetSegments.length; i++) {
		const offsetSeg = offsetSegments[i];
		const originalSeg = originalSegments[i];

		// Skip straight line segments
		if (originalSeg.isLine) {
			continue;
		}

		// Preserve handle geometry for both handles of this segment
		preserveSegmentHandleGeometry(offsetSeg, originalSeg, offsetDistance);
	}

	return offsetSegments;
}

/**
 * Preserve handle geometry for a single segment according to the geometric rules.
 * @param {Segment} offsetSeg - The offset segment to adjust
 * @param {Segment} originalSeg - The original segment for reference
 * @param {number} offsetDistance - The offset distance applied
 */
function preserveSegmentHandleGeometry(offsetSeg, originalSeg, offsetDistance) {
	// Rule 1: Preserve handle angles
	// Rule 2: Scale handle distances appropriately

	// Calculate scaling factor based on offset distance
	// For now, use a simple approach: handle distance should scale proportionally
	// We'll determine the exact scaling by comparing curve radius changes
	const scalingFactor = calculateHandleScalingFactor(
		originalSeg,
		offsetSeg,
		offsetDistance
	);

	// Preserve p2 handle (incoming handle to p1)
	preserveHandle(
		offsetSeg,
		'p2',
		offsetSeg.p1x,
		offsetSeg.p1y,
		originalSeg,
		'p2',
		originalSeg.p1x,
		originalSeg.p1y,
		scalingFactor
	);

	// Preserve p3 handle (outgoing handle from p4)
	preserveHandle(
		offsetSeg,
		'p3',
		offsetSeg.p4x,
		offsetSeg.p4y,
		originalSeg,
		'p3',
		originalSeg.p4x,
		originalSeg.p4y,
		scalingFactor
	);
}

/**
 * Calculate how much handle distances should scale based on the offset.
 * @param {Segment} originalSeg - Original segment
 * @param {Segment} offsetSeg - Offset segment
 * @param {number} offsetDistance - Offset distance
 * @returns {number} Scaling factor for handle distances
 */
function calculateHandleScalingFactor(originalSeg, offsetSeg, offsetDistance) {
	// Simple approach: calculate how much the curve "radius" has changed
	// Use the distance between start and end points as a proxy for curve size

	const originalSpan = Math.sqrt(
		(originalSeg.p4x - originalSeg.p1x) ** 2 +
			(originalSeg.p4y - originalSeg.p1y) ** 2
	);

	const offsetSpan = Math.sqrt(
		(offsetSeg.p4x - offsetSeg.p1x) ** 2 + (offsetSeg.p4y - offsetSeg.p1y) ** 2
	);

	// If the curve span hasn't changed much, use offset distance as scaling guide
	if (Math.abs(originalSpan - offsetSpan) < 1.0) {
		// For curves like circles, the handle distance should scale with the radius change
		// Estimate the radius change from the offset distance
		return 1.0 + offsetDistance / Math.max(originalSpan, 50); // Avoid division by very small numbers
	} else {
		// Use the actual span change as scaling factor
		return offsetSpan / originalSpan;
	}
}

/**
 * Preserve a single handle's geometry according to the rules.
 * @param {Segment} offsetSeg - Segment to modify
 * @param {string} handleProp - Property name ('p2' or 'p3')
 * @param {number} offsetPointX - X coordinate of the associated point
 * @param {number} offsetPointY - Y coordinate of the associated point
 * @param {Segment} originalSeg - Original segment for reference
 * @param {string} originalHandleProp - Original handle property name
 * @param {number} originalPointX - Original point X coordinate
 * @param {number} originalPointY - Original point Y coordinate
 * @param {number} scalingFactor - How much to scale the handle distance
 */
function preserveHandle(
	offsetSeg,
	handleProp,
	offsetPointX,
	offsetPointY,
	originalSeg,
	originalHandleProp,
	originalPointX,
	originalPointY,
	scalingFactor
) {
	// Calculate original handle vector and angle
	const originalHandleX =
		originalSeg[originalHandleProp + 'x'] - originalPointX;
	const originalHandleY =
		originalSeg[originalHandleProp + 'y'] - originalPointY;
	const originalHandleDistance = Math.sqrt(
		originalHandleX ** 2 + originalHandleY ** 2
	);
	const originalHandleAngle = Math.atan2(originalHandleY, originalHandleX);

	// Rule 1: Preserve the angle (OP-OH angle = NP-NH angle)
	// Rule 2: Scale the distance appropriately
	const newHandleDistance = originalHandleDistance * scalingFactor;

	// Calculate new handle position
	const newHandleX =
		offsetPointX + Math.cos(originalHandleAngle) * newHandleDistance;
	const newHandleY =
		offsetPointY + Math.sin(originalHandleAngle) * newHandleDistance;

	// Apply the new handle position
	offsetSeg[handleProp + 'x'] = newHandleX;
	offsetSeg[handleProp + 'y'] = newHandleY;
}

// =======================================
// UTILITY FUNCTIONS
// =======================================

/**
 * Normalize a vector to unit length.
 * @param {{x: number, y: number}} vector - The vector to normalize
 * @returns {{x: number, y: number}} Normalized vector
 */
function normalize(vector) {
	const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	if (length < 1e-10) {
		return { x: 1, y: 0 }; // Default direction
	}
	return { x: vector.x / length, y: vector.y / length };
}

/**
 * Evaluate a segment at parameter t.
 * @param {Segment} segment - The segment to evaluate
 * @param {number} t - Parameter value (0 <= t <= 1)
 * @returns {{x: number, y: number}} Point on the segment
 */
function evaluateSegmentAt(segment, t) {
	const t2 = t * t;
	const t3 = t2 * t;
	const mt = 1 - t;
	const mt2 = mt * mt;
	const mt3 = mt2 * mt;

	return {
		x:
			mt3 * segment.p1x +
			3 * mt2 * t * segment.p2x +
			3 * mt * t2 * segment.p3x +
			t3 * segment.p4x,
		y:
			mt3 * segment.p1y +
			3 * mt2 * t * segment.p2y +
			3 * mt * t2 * segment.p3y +
			t3 * segment.p4y,
	};
}

/**
 * Find intersection of two lines defined by two points each.
 * @param {{x: number, y: number}} p1 - First point of line 1
 * @param {{x: number, y: number}} p2 - Second point of line 1
 * @param {{x: number, y: number}} p3 - First point of line 2
 * @param {{x: number, y: number}} p4 - Second point of line 2
 * @returns {{x: number, y: number}|null} Intersection point or null if parallel
 */
function lineIntersection(p1, p2, p3, p4) {
	const x1 = p1.x,
		y1 = p1.y;
	const x2 = p2.x,
		y2 = p2.y;
	const x3 = p3.x,
		y3 = p3.y;
	const x4 = p4.x,
		y4 = p4.y;

	const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

	if (Math.abs(denom) < 1e-10) {
		return null; // Lines are parallel
	}

	const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

	return {
		x: x1 + t * (x2 - x1),
		y: y1 + t * (y2 - y1),
	};
}
