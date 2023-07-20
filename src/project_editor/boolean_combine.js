import { clone, duplicates, json, pointsAreEqual } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { debugDrawPoints } from '../edit_canvas/draw_edit_affordances.js';
import { sXcX, sYcY } from '../edit_canvas/edit_canvas.js';
import { isShapeHere } from '../edit_canvas/tools/tools.js';
import { maxesOverlap } from '../project_data/maxes.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { PolySegment, findSegmentIntersections } from '../project_data/poly_segment.js';
import { Segment } from '../project_data/segment.js';
import { XYPoint } from '../project_data/xy_point.js';

// --------------------------------------------------------------
// Note about IX Format
// --------------------------------------------------------------
/*
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
// Boolean Combine - Top level functions
// --------------------------------------------------------------

/**
 * Takes an array of paths and combines them
 * @param {Array} paths - collection of paths and component instances to merge
 * @param {Boolean} notifyErrors - show little alerts about the progress
 * @param {Boolean} resolveOverlaps - do extra work to remove overlapping paths and points
 * @returns {Array} - new set of combined paths
 */
export function combineAllPaths(paths, notifyErrors = true, resolveOverlaps = true) {
	log('combineAllPaths', 'start');
	log(paths);

	let tempPaths = false;

	// Early return stuff
	if (paths.length <= 1) {
		log('length=1 - returning what was passed');
		return false;
	} else if (paths.length === 2) {
		log('length=2, starting combineTwoPaths');
		tempPaths = combineTwoPaths(paths[0], paths[1], notifyErrors);

		if (!tempPaths) {
			log('length=2 - returning what was passed');
			if (notifyErrors) showToast('The selected paths do not overlap.');
			return false;
		} else {
			tempPaths = [tempPaths];
			log('length=2 - continuing with tempPaths from combineTwoPaths');
			log(tempPaths);
		}
	}

	// One pass through collapsing paths down
	function singlePass(arr) {
		log('\n\t singlePass');
		log('\t\t start arr len ' + arr.length);
		let re;
		let newPaths = [];
		let didStuff = false;

		for (let outer = 0; outer < arr.length; outer++) {
			for (let inner = 0; inner < arr.length; inner++) {
				log('\t\t testing shape ' + outer + ' and ' + inner);

				if (outer !== inner && arr[outer] && arr[inner]) {
					re = combineTwoPaths(arr[outer], arr[inner], notifyErrors);

					log('\t\t combineAllPaths returned ' + (re.length || re));
					if (re !== false) {
						newPaths.push(re);
						didStuff = true;
						arr[outer] = false;
						arr[inner] = false;
					}
				}
			}
		}

		// concat truthy values
		newPaths = newPaths.concat(arr.filter(p => p));

		log('singlePass didStuff = ' + didStuff);

		return { arr: newPaths, didStuff: didStuff };
	}

	// Sort paths by winding

	if (!tempPaths) {
		log('No tempPaths, sorting the existing paths');
		tempPaths = clone(paths);
		tempPaths.sort(function (a, b) {
			return a.path.getWinding() - b.path.getWinding();
		});

		// Main collapsing loop
		let looping = true;
		let count = 0;
		let lr;

		while (looping && count < 20) {
			looping = false;

			lr = singlePass(tempPaths);
			looping = lr.didStuff;
			if (!looping && count === 0) {
				if (!showToast) showToast('The selected paths do not overlap.');
				return false;
			}

			tempPaths = lr.arr;
			log('didStuff ' + lr.didStuff);
			count++;
		}
	}

	log('working on paths (tempPaths)');
	log(tempPaths);

	let newPaths = [];
	if (resolveOverlaps) {
		log('resolveOverlaps is true, tempPaths.length = ' + tempPaths.length);
		// Collapse each shape's overlapping paths
		for (let ts = 0; ts < tempPaths.length; ts++) {
			log(`ts: ${ts}`);

			newPaths = newPaths.concat(resolveSelfOverlaps(tempPaths[ts]));
		}
	} else {
		log('resolveOverlaps is false');
		newPaths = tempPaths;
	}
	log('newPaths is now ');
	log(newPaths);

	log('returning');
	log(newPaths);

	log('combineAllPaths', 'end');
	return newPaths;
}

/**
 * Takes two paths and attempts to combine them
 * @param {Path} path1 - Path to combine
 * @param {Path} path2 - Other path to combine
 * @returns - Array of path or paths
 */
function combineTwoPaths(path1, path2) {
	log('combineTwoPaths', 'start');
	// Find intersections
	let intersections = findPathIntersections(path1, path2);

	if (intersections.length < 1) {
		log('no intersections, returning.');
		return false;
	}
	log('found intersections');
	log(intersections);

	// Insert one intersection into both shapes
	let intersectionPoint = ixToXYPoint(intersections[0]);
	let closestPoint;
	let point1 = path1.containsPoint(intersectionPoint);
	if (!point1) {
		closestPoint = path1.findClosestPointOnCurve(intersectionPoint);
		point1 = path1.insertPathPoint(closestPoint.point, closestPoint.split);
	}
	point1.customID = 'overlap';

	let point2 = path2.containsPoint(intersectionPoint);
	if (!point2) {
		closestPoint = path2.findClosestPointOnCurve(intersectionPoint);
		point2 = path2.insertPathPoint(closestPoint.point, closestPoint.split);
	}
	point2.customID = 'overlap';

	// Walk one shape until the overlap point is found
	// Flip to the other shape, add all the points
	// Flip back to the first shape, add remaining points

	function getPointsBeforeOverlap(path) {
		let re = [];
		let pt = {};

		for (let pp = 0; pp < path.pathPoints.length; pp++) {
			pt = new PathPoint(path.pathPoints[pp]);

			if (path.pathPoints[pp].customID !== 'overlap') {
				re.push(pt);
			} else {
				return {
					points: re,
					overlap: pt,
				};
			}
		}
	}

	function getPointsAfterOverlap(path) {
		let re = [];
		let ov = {};

		for (let pp = 0; pp < path.pathPoints.length; pp++) {
			if (path.pathPoints[pp].customID === 'overlap') {
				ov = new PathPoint(path.pathPoints[pp]);

				for (let pa = pp + 1; pa < path.pathPoints.length; pa++) {
					re.push(new PathPoint(path.pathPoints[pa]));
				}

				return {
					points: re,
					overlap: ov,
				};
			}
		}
	}

	let s1h1 = getPointsBeforeOverlap(path1);
	let s1h2 = getPointsAfterOverlap(path1);
	let s2h1 = getPointsBeforeOverlap(path2);
	let s2h2 = getPointsAfterOverlap(path2);

	let newPoints = [];
	let newPoint;
	newPoints = newPoints.concat(s1h1.points);

	newPoint = new PathPoint({
		p: s1h1.overlap.p,
		h1: s1h1.overlap.h1,
		h2: s2h1.overlap.h2,
		type: 'corner',
	});
	newPoint.h1.use = s1h1.overlap.h1.use;
	newPoint.h2.use = s2h1.overlap.h2.use;
	newPoints.push(newPoint);
	newPoints = newPoints.concat(s2h2.points);
	newPoints = newPoints.concat(s2h1.points);

	newPoint = new PathPoint({
		p: s2h1.overlap.p,
		h1: s2h1.overlap.h1,
		h2: s1h2.overlap.h2,
		type: 'corner',
	});
	newPoint.h1.use = s2h1.overlap.h1.use;
	newPoint.h2.use = s1h2.overlap.h2.use;
	newPoints.push(newPoint);
	newPoints = newPoints.concat(s1h2.points);

	let result = new Path({ pathPoints: newPoints });
	log(result);
	log('combineTwoPaths', 'end');
	return result;
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

// --------------------------------------------------------------
// Finding intersections
// --------------------------------------------------------------

/**
 * Find overlaps between two paths
 * @param {Path} path1 - first path
 * @param {Path} path2 - second path
 * @returns {Array} - collection of intersections in IX Format
 */
function findPathIntersections(path1, path2) {
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

	// log(path1.toString());
	// log(path2.toString());

	for (let pp1 = 0; pp1 < path1.pathPoints.length; pp1++) {
		for (let pp2 = 0; pp2 < path2.pathPoints.length; pp2++) {
			if (pointsAreEqual(path1.pathPoints[pp1].p, path2.pathPoints[pp2].p, 0.01)) {
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
// Split segments apart, then stitch them back together
// --------------------------------------------------------------

/**
 * Checks for a bunch of 'overlap' and 'orphan' scenarios
 * concerning segments and path points
 * @param {Path} path - Path to check
 * @returns {Array} - Collection of resulting paths
 */
function resolveSelfOverlaps(path) {
	log('resolveSelfOverlaps', 'start');
	log('path');
	log(path);

	let polySegment = path.makePolySegment();
	log('polySegment');
	log(polySegment);

	// Add self intersects to path
	let ix = polySegment.findIntersections();
	log('intersections');
	log(json(ix, true));

	if (ix.length === 0) {
		log(`ix.length === 0, returning path as is`);
		log('resolveSelfOverlaps', 'end');
		return new Path(path);
	}

	let segmentNumber = polySegment.segments.length;
	let threshold = 0.01;
	polySegment.splitSegmentsAtIntersections(ix, threshold);

	if (segmentNumber === polySegment.segments.length) {
		log(`Splitting the polySegment on itself resulted in the same length, returning path as is`);
		log('resolveSelfOverlaps', 'end');
		return new Path(path);
	}

	log('before filtering ' + polySegment.segments.length);

	polySegment.removeZeroLengthSegments();
	log('after removeZeroLengthSegments ' + polySegment.segments.length);

	polySegment.removeDuplicateSegments();
	log('after removeDuplicateSegments ' + polySegment.segments.length);

	polySegment = removeSegmentsOverlappingPath(polySegment, path);
	log('after removeSegmentsOverlappingPath ' + polySegment.segments.length);

	polySegment.removeRedundantLineSegments();
	log('after removeRedundantLineSegments ' + polySegment.segments.length);

	polySegment.removeNonConnectingSegments();
	log('after removeNonConnectingSegments ' + polySegment.segments.length);

	polySegment.combineInlineSegments();
	log('after combineInlineSegments ' + polySegment.segments.length);

	log('afters filtering ' + polySegment.segments.length);

	// polySegment.drawPolySegmentOutline();
	let resultingSegments = polySegment.stitchSegmentsTogether();
	let resultingPaths = [];
	let psn;
	log(`resultingSegments`);
	log(resultingSegments);
	for (let ps = 0; ps < resultingSegments.length; ps++) {
		psn = resultingSegments[ps];
		if (psn.segments.length > 1) {
			let thisPath = psn.getPath();
			thisPath.name = path.name;
			resultingPaths.push(thisPath);
		}
	}

	log('resolveSelfOverlaps', 'end');
	return resultingPaths;
}

/**
 * Uses a provided Path to act as a mask, and removes Segments from
 * a PolySegment that are 'under' that Path
 * @param {PolySegment} polySegment - Collection of segments to remove from
 * @param {Path} path - path that acts like a mask
 * @returns {PolySegment} - new PolySegment with less Segments
 */
function removeSegmentsOverlappingPath(polySegment, path) {
	// log('PolySegment.removeSegmentsOverlappingPath', 'start');
	let segments = polySegment.segments;
	// let len = segments.length;
	// log('segments starting as ' + segments.length);
	// log(segments);
	segments.forEach((segment) => {
		if (testForHit(segment, 0.33, path) && testForHit(segment, 0.66, path)) {
			debugDrawSegmentPoints(segment);
			segment.objType = 'hit';
		} else {
			debugDrawSegmentPoints(segment);
		}
	});

	// log(segments);
	polySegment.segments = segments.filter(function (v) {
		return v.objType === 'segment';
	});

	// alert('removeSegmentsOverlappingPath - hits and misses');
	// log(' PolySegment.removeSegmentsOverlappingPath - removed ' + (len-this.segments.length) + ' - END\n');
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

	// Big hit detection, to miss border paths
	// let re = isShapeHere(path, sXcX(tx), sYcY(ty)) &&
	// isShapeHere(path, sXcX(tx), sYcY(ty + pt)) &&
	// isShapeHere(path, sXcX(tx), sYcY(ty - pt)) &&
	// isShapeHere(path, sXcX(tx + pt), sYcY(ty)) &&
	// isShapeHere(path, sXcX(tx - pt), sYcY(ty));
	// if (re) alert('HIT ' + tx + ', ' + ty);

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
