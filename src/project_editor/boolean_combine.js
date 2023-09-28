import { duplicates, xyPointsAreClose } from '../common/functions.js';
import { debugDrawPoints } from '../edit_canvas/draw_edit_affordances.js';
import { sXcX, sYcY } from '../edit_canvas/edit_canvas.js';
import { isShapeHere } from '../edit_canvas/tools/tools.js';
import { maxesOverlap } from '../project_data/maxes.js';
import { PolySegment, findSegmentIntersections } from '../project_data/poly_segment.js';
import { XYPoint } from '../project_data/xy_point.js';
/**
		Boolean Combine
		Using Bezier math to merge two paths together.
		Maybe other boolean stuff in the future, like:
		Intersection, Minus front/back, Exclusion, Divide, Slice
**/

/*
	Note about IX Format
	--------------------------------------------------------------
	Boolean combine does a lot of finding intersections between two
	bezier curves. These intersections are simple x/y points, but they
	are passed around and filtered for duplicates. To do this a bit
	easier, the IX format is a text representation of two numbers,
	separated by a forward slash.

	"Intersections" or "IX" format is stuff like this:
		'123/345'
		'0.01/0.02'
*/

// --------------------------------------------------------------
// Combine all paths
// --------------------------------------------------------------

/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combineAllPaths(paths = []) {
	// log(`combineAllPaths`, 'start');
	// log(`\n⮟paths⮟`);
	// log(paths);
	let clockwise = paths.filter((path) => path.winding < 0);
	// log(`\n⮟clockwise⮟`);
	// log(clockwise);
	let counterClockwise = paths.filter((path) => path.winding > 0);
	// log(`\n⮟counterClockwise⮟`);
	// log(counterClockwise);
	let unknown = paths.filter((path) => path.winding === 0);
	// log(`\n⮟unknown⮟`);
	// log(unknown);

	let result = [];
	let errorMessage = '';
	let didStuff = false;
	function processWinding(shapeArray, name) {
		if (shapeArray.length > 1) {
			let combinationResult = combinePaths(shapeArray);
			if (Array.isArray(combinationResult)) {
				result = result.concat(combinationResult);
				didStuff = true;
				// log(`Combined ${name}`);
			} else {
				errorMessage = combinationResult;
				result = result.concat(shapeArray);
				// log(`No overlap for ${name}`);
			}
		} else {
			result = result.concat(shapeArray);
			// log(`Less than one shape for ${name}`);
		}
	}

	// Process each array
	processWinding(clockwise, 'clockwise');
	processWinding(counterClockwise, 'counterClockwise');
	processWinding(unknown, 'unknown');

	// log(`\n⮟result⮟`);
	// log(result);
	// log(`combineAllPaths`, 'end');
	if (didStuff) return result;
	else return errorMessage || 'No overlapping shapes found with the same winding.';
}

/**
 * Takes an array of paths and combines them, without regard to
 * path winding or anything else
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combinePaths(paths = []) {
	// log(`combinePaths`, 'start');
	// log(`\n⮟paths⮟`);
	// log(paths);

	// --------------------------------------------------------------
	// Prepare Paths and convert to PolySegment
	// --------------------------------------------------------------
	// Find all intersections
	let intersections = [];
	for (let i = 0; i < paths.length; i++) {
		for (let j = 1; j < paths.length; j++) {
			if (i !== j) {
				intersections = intersections.concat(findPathIntersections(paths[i], paths[j]));
			}
		}
	}
	intersections = intersections.filter(duplicates);
	// log(`\n⮟intersections⮟`);
	// log(intersections);

	// Chop at all intersections
	intersections.forEach((ix) => {
		paths.forEach((path) => insertPathPointsAtIXPoint(ix, path));
	});
	// log(`\n⮟paths⮟`);
	// log(paths);

	if (intersections.length === 0) {
		// log(`combinePaths`, 'end');
		return 'No overlapping shapes.';
	}

	// Convert to Bezier segments
	let allSegments = [];
	paths.forEach((path, index) => {
		allSegments = allSegments.concat(path.makePolySegment(index + 1).segments);
	});
	// allSegments.sort((a, b) => a.maxes.xMin - b.maxes.xMin); // Helps with complex overlaps for some reason

	allSegments = new PolySegment({ segments: allSegments });
	// log(`\n\n All Segments collected`);
	// console.table(allSegments.valuesAsArray);

	// --------------------------------------------------------------
	// Filter out segments we don't need
	// --------------------------------------------------------------

	allSegments.removeZeroLengthSegments();
	// log('after removeZeroLengthSegments ' + allSegments.segments.length);

	allSegments.removeRedundantLineSegments();
	// log('after removeRedundantLineSegments ' + allSegments.segments.length);

	paths.forEach((path) => (allSegments = removeSegmentsOverlappingPath(allSegments, path)));
	// log('after removeSegmentsOverlappingPath ' + allSegments.segments.length);

	// log(`Segments Post Filtering`);
	console.table(allSegments.segments);

	// --------------------------------------------------------------
	// Take remaining segments and stitch them together
	// --------------------------------------------------------------
	allSegments = allSegments.segments;
	let orderedSegments = [];
	let newPolySegments = [];
	orderedSegments[0] = allSegments.shift();
	let didStuff = false;

	while (allSegments.length) {
		// log(`un-stitched length ${allSegments.length}`);
		let target;
		let test;

		// First try by ID
		target = orderedSegments.at(-1);
		// log(`\t Target point2ID ${target.point2ID}`);

		for (let i = 0; i < allSegments.length; i++) {
			test = allSegments[i];
			// log(`\t Test point1ID ${test.point1ID}`);

			if (target.point2ID === test.point1ID) {
				orderedSegments.push(allSegments.splice(i, 1)[0]);
				// log(`\t Match found for ${test.point1ID}`);
				// log(orderedSegments);
				didStuff = true;
				break;
			}
		}

		// Next try by coordinates
		if (!didStuff) {
			target = orderedSegments.at(-1).getXYPoint(4);
			// log(`\t Target ${target.x}, ${target.y}`);

			for (let i = 0; i < allSegments.length; i++) {
				test = allSegments[i].getXYPoint(1);
				// log(`\t Testing ${test.x}, ${test.y}`);

				if (xyPointsAreClose(target, test, 1)) {
					orderedSegments.push(allSegments.splice(i, 1)[0]);
					// log(`\t Match found at ${test.x}, ${test.y}`);
					// log(orderedSegments);
					didStuff = true;
					break;
				}
			}
		}

		if (didStuff && allSegments.length >= 1) {
			// Continue stitching loops for this shape
			didStuff = false;
		} else {
			// No matches were found, or no more segments to stitch
			// log(`allSegments.length: ${allSegments.length}`);
			newPolySegments.push(new PolySegment({ segments: orderedSegments }));
			// log(`newPolySegments`);
			// log(newPolySegments);

			if (allSegments.length <= 1) {
				// No more segments to stitch
				break;
			} else {
				// More segments that weren't attached to the previous shape
				// Start a new PolySegment to stitch
				orderedSegments = [];
				orderedSegments[0] = allSegments.shift();
			}
		}
	}
	// log(newPolySegments);

	// --------------------------------------------------------------
	// Finish up
	// --------------------------------------------------------------

	let newPaths = newPolySegments.map((polySegment) => polySegment.getPath());

	// log(`\n⮟newPaths⮟`);
	// log(newPaths);

	// log(`combinePaths`, 'end');
	return newPaths;
}

// --------------------------------------------------------------
// Path intersections
// --------------------------------------------------------------

/**
 * Takes an IX Point, finds the closest point on a given path,
 * and adds a Path Point to that place.
 * @param {String} ixPoint - point in IX Format
 * @param {Path} path - Path to add the point to
 */
export function insertPathPointsAtIXPoint(ixPoint, path) {
	// log(`insertPathPointsAtIXPoint`, 'start');
	// log(`ixPoint: ${ixPoint}`);
	let newPoint = path.containsPoint(ixPoint);
	if (!newPoint) {
		let closestPoint = path.findClosestPointOnCurve(ixToXYPoint(ixPoint));
		newPoint = path.insertPathPoint(closestPoint.point, closestPoint.split);
	}
	newPoint.customID = `overlap ${ixPoint}`;
	// log(`insertPathPointsAtIXPoint`, 'end');
}

/**
 * Converts from IX format to XY format
 * @param {String} ix - Intersection in IX Format
 * @returns {XYPoint} - coordinate
 */
function ixToXYPoint(ix) {
	// log('ixToXYPoint', 'start');
	// log(ix);
	let re = new XYPoint(parseFloat(ix.split('/')[0]), parseFloat(ix.split('/')[1]));
	// log([re]);
	// log(' ixToXYPoint', 'end');
	return re;
}

/**
 * Find overlaps between two paths
 * @param {Path} path1 - first path
 * @param {Path} path2 - second path
 * @returns {Array} - collection of intersections in IX Format
 */
export function findPathIntersections(path1, path2) {
	// log('findPathIntersections', 'start');
	let intersects = [];

	// Find overlaps at boundaries
	intersects = intersects.concat(findPathPointIntersections(path1, path2));
	intersects = intersects.concat(findPathPointBoundaryIntersections(path1, path2));
	intersects = intersects.filter(duplicates);
	// log('intersections after boundary detection');
	// log(intersects);

	// Maxes within boundaries
	if (!maxesOverlap(path1.maxes, path2.maxes)) {
		// log(path1.maxes);
		// log(path2.maxes);
		// log('paths don't intersect');
		// log(`findPathIntersections`, 'end');
		return intersects;
	}

	// Continue with recursive overlap detection
	let bs;
	let ts;
	const segmentOverlaps = [];

	/**
	 * Quickly find if two segments could overlap by checking
	 * their bounding boxes
	 * @param {Path} path1 - first path
	 * @param {PathPoint} p1p - first path point
	 * @param {Path} path2 - second path
	 * @param {PathPoint} p2p - second path point
	 */
	function pushSegOverlaps(path1, p1p, path2, p2p) {
		// log(`pushSegOverlaps`, 'start');
		// log(`path1: ${path1}`);
		// log(`p1p: ${p1p}`);
		// log(`path2: ${path2}`);
		// log(`p2p: ${p2p}`);

		bs = path1.makeSegment(p1p);
		ts = path2.makeSegment(p2p);

		if (maxesOverlap(bs.getFastMaxes(), ts.getFastMaxes())) {
			// log('\t pushed!');
			segmentOverlaps.push({ bottom: bs, top: ts });
		}
		// log(`pushSegOverlaps`, 'end');
	}

	// Find overlaps within a single segment -- don't care about this case
	// Find overlaps within a single path -- don't care about this case

	// Find overlaps between two paths
	for (let bpp = 0; bpp < path1.pathPoints.length; bpp++) {
		for (let tpp = 0; tpp < path2.pathPoints.length; tpp++) {
			pushSegOverlaps(path1, bpp, path2, tpp);
		}
	}

	// log('segmentOverlaps are now:');
	// segmentOverlaps.forEach((element) => {
	// log(`bottom:\n${element.bottom.print()}\ntop:\n${element.top.print()}`);
	// });

	// Use overlaps to find intersections
	let re = [];
	for (let v = 0; v < segmentOverlaps.length; v++) {
		re = findSegmentIntersections(segmentOverlaps[v].bottom, segmentOverlaps[v].top, 0);
		if (re.length > 0) {
			intersects = intersects.concat(re);
		}
		// log('intersects is now');
		// log(intersects);
	}

	// log('pre filter ' + intersects);
	intersects = intersects.filter(duplicates);

	// log('returning ' + intersects);
	// log('findPathIntersections', 'end');
	return intersects;
}

/**
 * Collects instances of path points being on a bounding
 * box of the other path
 * @param {Path} path1 - first path
 * @param {Path} path2 - second path
 * @returns {Array} - collection of intersections in IX Format
 */
function findPathPointBoundaryIntersections(path1, path2) {
	let re = [];

	/**
	 * Check points in a path against the bounding box of another path
	 * @param {Path} chk - first point to check
	 * @param {Path} against - check against these maxes
	 */
	function check(chk, against) {
		const m = against.maxes;
		let tpp;
		for (let pp = 0; pp < chk.pathPoints.length; pp++) {
			tpp = chk.pathPoints[pp];

			if (tpp.p.x === m.xMin || tpp.p.x === m.xMax) {
				if (tpp.p.y <= m.yMax && tpp.p.y >= m.yMin) {
					re.push('' + tpp.p.x + '/' + tpp.p.y);
				}
			}
			if (tpp.p.y === m.yMin || tpp.p.y === m.yMax) {
				if (tpp.p.x <= m.xMax && tpp.p.x >= m.xMin) {
					re.push('' + tpp.p.x + '/' + tpp.p.y);
				}
			}
		}
	}

	check(path1, path2);
	check(path2, path1);

	re = re.filter(duplicates);
	return re;
}

/**
 * Finds x/y overlaps between any points given two paths
 * @param {Path} path1 - first path
 * @param {Path} path2 - second path
 * @returns {Array} - collection of intersections in IX Format
 */
function findPathPointIntersections(path1, path2) {
	// log('findPathPointIntersections', 'start');
	let re = [];
	let ix;

	// log(path1);
	// log(path2);

	for (let pp1 = 0; pp1 < path1.pathPoints.length; pp1++) {
		for (let pp2 = 0; pp2 < path2.pathPoints.length; pp2++) {
			if (xyPointsAreClose(path1.pathPoints[pp1].p, path2.pathPoints[pp2].p, 0.01)) {
				ix = '' + path1.pathPoints[pp1].p.x + '/' + path1.pathPoints[pp1].p.y;
				// log(`found ${ix}`);

				re.push(ix);
			}
		}
	}

	re = re.filter(duplicates);

	// log('returning ' + re);
	// log('findPathPointIntersections', 'end');
	return re;
}

// --------------------------------------------------------------
// Resolving segment overlap cases
// --------------------------------------------------------------

/**
 * Uses a provided Path to act as a mask, and removes Segments from
 * a PolySegment that are 'under' that Path
 * @param {PolySegment} polySegment - Collection of segments to remove from
 * @param {Path} path - path that acts like a mask
 * @returns {PolySegment} - new PolySegment with less Segments
 */
function removeSegmentsOverlappingPath(polySegment, path) {
	// log('removeSegmentsOverlappingPath', 'start');
	// let startLength = polySegment.segments.length;
	// log('Path mask');
	// log(path);
	// log('polySegment.segments starting as ' + polySegment.segments.length);
	// log(polySegment.segments);
	polySegment.segments.forEach((segment) => {
		if (testForHit(segment, 0.33, path) && testForHit(segment, 0.66, path)) {
			// debugDrawSegmentPoints(segment);
			segment.objType = 'hit';
		} else {
			// debugDrawSegmentPoints(segment);
		}
	});

	// log(polySegment.segments);
	polySegment.segments = polySegment.segments.filter((seg) => {
		return seg.objType === 'Segment';
	});

	// log(`removed: ${startLength - polySegment.segments.length} segments`);
	// log(polySegment);
	// log('removeSegmentsOverlappingPath', 'end');
	return polySegment;
}

/**
 * Takes a Segment and a decimal 'time' to get a single point along
 * that segment curve, then checks to see if that point is over
 * a given path.
 * @param {Segment} segment - Segment to get the point from
 * @param {Number} split - decimal 'time' between 0 and 1 for position on the Segment
 * @param {Path} path - Path to check point against
 * @returns {Boolean}
 */
function testForHit(segment, split, path) {
	let splitSegment = segment.splitAtTime(split);
	let pt = 3;
	let tx = splitSegment[0].p4x;
	let ty = splitSegment[0].p4y;

	if (!isShapeHere(path, sXcX(tx), sYcY(ty + pt))) return false;
	if (!isShapeHere(path, sXcX(tx), sYcY(ty - pt))) return false;
	if (!isShapeHere(path, sXcX(tx + pt), sYcY(ty))) return false;
	if (!isShapeHere(path, sXcX(tx - pt), sYcY(ty))) return false;
	if (!isShapeHere(path, sXcX(tx), sYcY(ty))) return false;

	return true;
}

/**
 * For debugging, visually draw a segment's points to the edit canvas
 * @param {Segment} segment - Segment to draw
 */
function debugDrawSegmentPoints(segment) {
	debugDrawPoints(
		[
			{ x: segment.p1x, y: segment.p1y },
			{ x: segment.p2x, y: segment.p2y },
			{ x: segment.p3x, y: segment.p3y },
			{ x: segment.p4x, y: segment.p4y },
		],
		'lime'
	);
}
