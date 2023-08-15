import { duplicates, json, xyPointsAreEqual, round } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { debugDrawPoints } from '../edit_canvas/draw_edit_affordances.js';
import { sXcX, sYcY } from '../edit_canvas/edit_canvas.js';
import { isShapeHere } from '../edit_canvas/tools/tools.js';
import { maxesOverlap } from '../project_data/maxes.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { PolySegment, findSegmentIntersections } from '../project_data/poly_segment.js';
import { Segment, areSegmentsEquivalent } from '../project_data/segment.js';
import { XYPoint } from '../project_data/xy_point.js';

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

export function combineAllPaths(paths = []) {
	log(`combineAllPaths`, 'start');
	log(paths);
	// paths = clone(paths);

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
	log(intersections);

	// Chop at all intersections
	intersections.forEach((ix) => {
		paths.forEach((path) => insertPathPointsAtIXPoint(ix, path));
	});

	// Convert to Bezier segments
	let allSegments = [];
	paths.forEach((path) => {
		allSegments = allSegments.concat(path.makePolySegment().segments);
	});
	allSegments = new PolySegment({ segments: allSegments });
	// log(allSegments);
	log(`\n\n All Segments collected`);
	console.table(allSegments.valuesAsArray);

	// Filter duplicate segments
	allSegments.segments = allSegments.segments.filter((segment, index) => {
		for (let j = 0; j < allSegments.segments.length; j++) {
			if (j !== index) {
				if (areSegmentsEquivalent(segment, allSegments.segments[j])) {
					return false;
				}
			}
		}
		return true;
	});
	log(`\n\n All segments filtered for duplicates`);
	console.table(allSegments.valuesAsArray);

	// Filter overlapped segments
	paths.forEach((path) => (allSegments = removeSegmentsOverlappingPath(allSegments, path)));
	// log(allSegments);
	log(`\n\n All segments filtered for path overlapping`);
	console.table(allSegments.valuesAsArray);

	// Stich segments together
	allSegments = allSegments.segments;
	let orderedSegments = [];
	orderedSegments[0] = allSegments.shift();
	let didStuff = false;

	while (allSegments.length) {
		log(`un-stitched length ${allSegments.length}`);

		let targetX = orderedSegments.at(-1).p4x;
		let targetY = orderedSegments.at(-1).p4y;
		log(`\t target: ${targetX} ${targetY}`);

		for (let i = 0; i < allSegments.length; i++) {
			let testX = allSegments[i].p1x;
			let testY = allSegments[i].p1y;
			log(`\t test: ${testX} ${testY}`);

			// if (targetX === testX && targetY === testY) {
			if (xyPointsAreEqual({ x: targetX, y: targetY }, { x: testX, y: testY }, 1)) {
				orderedSegments.push(allSegments.splice(i, 1)[0]);
				log(`\t Match found at ${testX}, ${testY}`);
				log(orderedSegments);
				didStuff = true;
				break;
			}
		}

		if (didStuff) {
			didStuff = false;
		} else {
			log(`NO MATCH FOUND`);
			break;
		}
	}
	orderedSegments = new PolySegment({ segments: orderedSegments });
	log(`\n\n Ordered Segments`);
	console.table(orderedSegments.valuesAsArray);

	// Make Path
	let resultPath = orderedSegments.getPath();
	log(`Resulting path`);
	log(resultPath);

	log(`combineAllPaths`, 'end');
	return [resultPath];
}

// --------------------------------------------------------------
// Path intersections
// --------------------------------------------------------------

export function insertPathPointsAtIXPoint(ixPoint, path) {
	log(`insertPathPointsAtIXPoint`, 'start');
	log(`ixPoint: ${ixPoint}`);
	let newPoint = path.containsPoint(ixPoint);
	if (!newPoint) {
		let closestPoint = path.findClosestPointOnCurve(ixToXYPoint(ixPoint));
		newPoint = path.insertPathPoint(closestPoint.point, round(closestPoint.split, 4));
	}
	newPoint.customID = `overlap ${ixPoint}`;
	log(`insertPathPointsAtIXPoint`, 'end');
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
	log('findPathPointIntersections', 'start');
	let re = [];
	let ix;

	log(path1);
	log(path2);

	for (let pp1 = 0; pp1 < path1.pathPoints.length; pp1++) {
		for (let pp2 = 0; pp2 < path2.pathPoints.length; pp2++) {
			if (xyPointsAreEqual(path1.pathPoints[pp1].p, path2.pathPoints[pp2].p, 0.01)) {
				ix = '' + path1.pathPoints[pp1].p.x + '/' + path1.pathPoints[pp1].p.y;
				log(`found ${ix}`);

				re.push(ix);
			}
		}
	}

	re = re.filter(duplicates);

	log('returning ' + re);
	log('findPathPointIntersections', 'end');
	return re;
}

// --------------------------------------------------------------
// Resolving segment overlap cases
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

	// polySegment.combineInlineSegments();
	// log('after combineInlineSegments ' + polySegment.segments.length);

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
	log('removeSegmentsOverlappingPath', 'start');
	let startLength = polySegment.segments.length;
	// log('Path mask');
	// log(path);
	// log('polySegment.segments starting as ' + polySegment.segments.length);
	// log(polySegment.segments);
	polySegment.segments.forEach((segment) => {
		if (testForHit(segment, 0.33, path) && testForHit(segment, 0.66, path)) {
			debugDrawSegmentPoints(segment);
			segment.objType = 'hit';
		} else {
			debugDrawSegmentPoints(segment);
		}
	});

	// log(polySegment.segments);
	polySegment.segments = polySegment.segments.filter((seg) => {
		return seg.objType === 'Segment';
	});

	log(`removed: ${startLength - polySegment.segments.length} segments`);
	// log(polySegment);
	log('removeSegmentsOverlappingPath', 'end');
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

// --------------------------------------------------------------
// OLD
// --------------------------------------------------------------
/**
 * Takes a collection of paths and combines as many together as possible
 * @param {Array} paths - list of paths to combine
 * @param {Boolean} notifyErrors - show toast notifications on errors
 * @returns {Array} - collection of paths
 */
// export function combineAllPaths_REFACTORED(paths = [], notifyErrors = true) {
// 	log(`combineAllPaths`, 'start');
// 	let resultPaths = [];

// 	// One Path
// 	if (paths.length <= 1) {
// 		log(`combineAllPaths`, 'end');
// 		return paths;
// 	}

// 	// Two Paths
// 	if (paths.length === 2) {
// 		resultPaths = combineTwoPaths_REFACTORED(paths[0], paths[1]);
// 		if (!resultPaths) {
// 			if (notifyErrors) showToast('The selected paths do not overlap.');
// 		}
// 		log(`combineAllPaths`, 'end');
// 		return [resultPaths];
// 	}

// 	// More than two paths
// 	// TODO Boolean Combine, don't combine opposite windings
// 	paths.map((path, index) => (resultPaths[index] = new Path(path)));
// 	resultPaths.sort(function (a, b) {
// 		return a.winding - b.winding;
// 	});

// 	// Main collapsing loop
// 	let looping = true;
// 	let count = 0;
// 	let loopResult;
// 	let loopMax = 20;

// 	while (looping && count <= loopMax) {
// 		if (count === loopMax) {
// 			console.warn(`Combine All Paths - too many collapsing loops`);
// 			return paths;
// 		}

// 		looping = false;

// 		loopResult = onePassCombinePaths_REFACTORED(resultPaths);
// 		looping = loopResult.didStuff;
// 		if (!looping && count === 0) {
// 			if (notifyErrors) showToast('The selected paths do not overlap.');
// 			log(`combineAllPaths`, 'end');
// 			return paths;
// 		}

// 		resultPaths = loopResult.paths;
// 		count++;
// 	}

// 	// Resolve self overlaps
// 	let tempPaths = [];
// 	resultPaths.forEach((path) => {
// 		tempPaths = tempPaths.concat(resolveSelfOverlaps(path));
// 	});
// 	resultPaths = tempPaths;

// 	log(`combineAllPaths`, 'end');
// 	return resultPaths;
// }

/**
 * Takes a single list of paths, and uses two for loops to attempt
 * to combine as many of the paths in the list as possible. It is
 * possible that these loops could not combine any, combine some, or
 * combine all. A 'didStuff' flag is returned, if nothing was done then
 * no more of the paths can be combined.
 * @param {Array} paths - collection of paths to attempt to combine
 * @returns {Object} - resulting paths and a 'didStuff' flag
 */
// function onePassCombinePaths_REFACTORED(paths = []) {
// 	log(`onePassCombinePaths`, 'start');
// 	let resultPaths = [];
// 	let didStuff = false;
// 	let checkList = paths.map((value) => !!value);

// 	for (let outer = 0; outer < paths.length; outer++) {
// 		for (let inner = 0; inner < paths.length; inner++) {
// 			log('attempting to combine paths ' + outer + ' with ' + inner);

// 			if (outer !== inner && checkList[outer] && checkList[inner]) {
// 				let combined = combineTwoPaths_REFACTORED(paths[outer], paths[inner]);

// 				if (combined !== false) {
// 					resultPaths.push(combined);
// 					didStuff = true;
// 					checkList[outer] = false;
// 					checkList[inner] = false;
// 				}
// 			}
// 		}
// 	}

// 	// Add back any un-combined paths
// 	for (let i = 0; i < checkList.length; i++) {
// 		if (checkList[i]) resultPaths.push(paths[i]);
// 	}

// 	// Finish up
// 	log(`didStuff: ${didStuff}`);
// 	log(resultPaths);

// 	log(`onePassCombinePaths`, 'end');
// 	return { paths: resultPaths, didStuff: didStuff };
// }
// --------------------------------------------------------------
// Combining just two paths
// --------------------------------------------------------------

// function combineTwoPaths_REFACTORED(path1, path2) {
// 	log(`combineTwoPaths_REFACTORED`, 'start');

// 	// Find intersections
// 	let intersections = findPathIntersections(path1, path2);
// 	if (intersections.length < 1) {
// 		log('no intersections, returning.');
// 		log(`combineTwoPaths_REFACTORED`, 'end');
// 		return false;
// 	} else {
// 		log('found intersections');
// 		log(intersections);
// 	}

// 	// Add path points at all intersections
// 	log(`path1.pathPoints.length: ${path1.pathPoints.length}`);
// 	log(`path2.pathPoints.length: ${path2.pathPoints.length}`);
// 	intersections.forEach((ix) => {
// 		insertPathPointsAtIXPoint(ix, path1);
// 		insertPathPointsAtIXPoint(ix, path2);
// 	});
// 	log(`path1.pathPoints.length: ${path1.pathPoints.length}`);
// 	log(`path2.pathPoints.length: ${path2.pathPoints.length}`);

// 		// Traverse the working path, adding path points to the result path
// 		// until an 'overlap' point is detected, then switch the working path
// 		// and continue to add points until another overlap point is reached,
// 		// or the first point of path 1 is reached.

// 	path1.customID = 'path1';
// 	path2.customID = 'path2';
// 	let resultPath = new Path();
// 	resultPath.addPathPoint(path1.pathPoints[0]);
// 	let workingPath = path1;
// 	path1.pathPoints[0].customID = 'completed';
// 	let workingPoint = path1.pathPoints[1];
// 	let loopNumber = 1;
// 	let loopMax = 999;
// 	log(path1);
// 	log(path2);
// 	while (loopNumber <= loopMax) {
// 		log(`loopNumber: ${loopNumber}`);
// 		log(`\t workingPath.customID: ${workingPath.customID}`);
// 		log(`\t workingPoint.customID: ${workingPoint.customID}`);
// 		log(`\t workingPoint.pointNumber: ${workingPoint.pointNumber}`);

// 		if (loopNumber === loopMax) {
// 			console.warn(`Combine Two Paths - too many points to loop through.`);
// 			break;
// 		}

// 		if (workingPoint.customID === 'completed') {
// 			// Back to a completed point, end the loop
// 			log(`\t COMPLETED point, breaking loop`);
// 			break;
// 		} else if (workingPoint?.customID?.startsWith('overlap')) {
// 			// Overlap point detected, add it and flip the working path
// 			log(`\t OVERLAP point`);
// 			resultPath.addPathPoint(
// 				new PathPoint({
// 					p: workingPoint.p,
// 					h1: workingPoint.h1,
// 				})
// 			);
// 			let lastResultPoint = resultPath.pathPoints.at(-1);

// 			// Switch working path
// 			if (workingPath.customID === 'path1') workingPath = path2;
// 			else if (workingPath.customID === 'path2') workingPath = path1;
// 			else log(`\t ERROR switching working path`);
// 			log(`\t working path is now ${workingPath.customID}`);

// 			// Switch working point
// 			let oldWorkingPoint = workingPoint;
// 			workingPoint = findPointByCustomID_REFACTORED(workingPath, workingPoint.customID);
// 			oldWorkingPoint.customID = 'completed';
// 			if (workingPoint) lastResultPoint.h2 = workingPoint.h2;
// 			else log(`\t ERROR updating h2 handle`);
// 		} else {
// 			// Just a normal point, add it to the result path
// 			log(`\t REGULAR point`);
// 			resultPath.addPathPoint(workingPoint);
// 		}

// 		// End of loop advancements
// 		let nextPointNum = workingPath.getNextPointNum(workingPoint.pointNumber);
// 		workingPoint = workingPath.pathPoints[nextPointNum];
// 		loopNumber++;
// 	}

// 	// All done
// 	log(resultPath);
// 	log(`combineTwoPaths_REFACTORED`, 'end');
// 	return resultPath;
// }

// function findPointByCustomID_REFACTORED(path, id) {
// 	for (let p = 0; p < path.pathPoints.length; p++) {
// 		if (path.pathPoints[p]?.customID === id) {
// 			return path.pathPoints[p];
// 		}
// 	}
// 	return false;
// }

/**
 * Takes an array of paths and combines them
 * @param {Array} paths - collection of paths and component instances to merge
 * @param {Boolean} notifyErrors - show little alerts about the progress
 * @param {Boolean} resolveOverlaps - do extra work to remove overlapping paths and points
 * @returns {Array} - new set of combined paths
 */
// export function OLDcombineAllPaths(paths, notifyErrors = true, resolveOverlaps = true) {
// 	log('OLDcombineAllPaths', 'start');
// 	log(paths);

// 	let tempPaths = false;

// 	// Early return stuff
// 	if (paths.length <= 1) {
// 		log('length=1 - returning false');
// 		return false;
// 	} else if (paths.length === 2) {
// 		// log('length=2, starting combinePathsAtFirstIntersection');
// 		// tempPaths = combinePathsAtFirstIntersection(paths[0], paths[1], notifyErrors);
// 		tempPaths = combineTwoPaths_REFACTORED(paths[0], paths[1]);

// 		if (!tempPaths) {
// 			log('length=2 - returning false');
// 			if (notifyErrors) showToast('The selected paths do not overlap.');
// 			return false;
// 		} else {
// 			tempPaths = [tempPaths];
// 			// log('length=2 - continuing with tempPaths from combinePathsAtFirstIntersection');
// 			log('length=2 - continuing with tempPaths from combineTwoPaths_REFACTORED');
// 			log(tempPaths);
// 			log(`OLDcombineAllPaths`, 'end');
// 			return tempPaths;
// 		}
// 	}

// 	// One pass through collapsing paths down
// 	function singlePass(arr) {
// 		log('\n\t singlePass');
// 		log('\t\t start arr len ' + arr.length);
// 		let re;
// 		let newPaths = [];
// 		let didStuff = false;

// 		for (let outer = 0; outer < arr.length; outer++) {
// 			for (let inner = 0; inner < arr.length; inner++) {
// 				log('\t\t testing shape ' + outer + ' and ' + inner);

// 				if (outer !== inner && arr[outer] && arr[inner]) {
// 					re = combinePathsAtFirstIntersection(arr[outer], arr[inner], notifyErrors);

// 					log('\t\t OLDcombineAllPaths returned ' + (re.length || re));
// 					if (re !== false) {
// 						newPaths.push(re);
// 						didStuff = true;
// 						arr[outer] = false;
// 						arr[inner] = false;
// 					}
// 				}
// 			}
// 		}

// 		// concat truthy values
// 		newPaths = newPaths.concat(arr.filter((p) => p));

// 		log('singlePass didStuff = ' + didStuff);

// 		return { arr: newPaths, didStuff: didStuff };
// 	}

// 	// Sort paths by winding

// 	if (!tempPaths) {
// 		log('No tempPaths, sorting the existing paths');
// 		tempPaths = [];
// 		paths.map((path, index) => (tempPaths[index] = new Path(path)));
// 		// tempPaths = clone(paths);
// 		tempPaths.sort(function (a, b) {
// 			return a.winding - b.winding;
// 		});

// 		// Main collapsing loop
// 		let looping = true;
// 		let count = 0;
// 		let loopResult;

// 		while (looping && count < 20) {
// 			looping = false;

// 			loopResult = singlePass(tempPaths);
// 			looping = loopResult.didStuff;
// 			if (!looping && count === 0) {
// 				if (!showToast) showToast('The selected paths do not overlap.');
// 				return false;
// 			}

// 			tempPaths = loopResult.arr;
// 			log('didStuff ' + loopResult.didStuff);
// 			count++;
// 		}
// 	}

// 	log('working on paths (tempPaths)');
// 	log(tempPaths);

// 	let newPaths = [];
// 	if (resolveOverlaps) {
// 		log('resolveOverlaps is true, tempPaths.length = ' + tempPaths.length);
// 		// Collapse each shape's overlapping paths
// 		for (let ts = 0; ts < tempPaths.length; ts++) {
// 			log(`ts: ${ts}`);
// 			newPaths = newPaths.concat(resolveSelfOverlaps(tempPaths[ts]));
// 		}
// 	} else {
// 		log('resolveOverlaps is false');
// 		newPaths = tempPaths;
// 	}

// 	log('returning');
// 	log(newPaths);
// 	log('OLDcombineAllPaths', 'end');
// 	return newPaths;
// }

/**
 * Takes two paths and attempts to combine them
 * @param {Path} path1 - Path to combine
 * @param {Path} path2 - Other path to combine
 * @returns - Array of path or paths
 */
// function combinePathsAtFirstIntersection(path1, path2) {
// 	log('combinePathsAtFirstIntersection', 'start');
// 	// Find intersections
// 	let intersections = findPathIntersections(path1, path2);

// 	if (intersections.length < 1) {
// 		log('no intersections, returning.');
// 		return false;
// 	}
// 	log('found intersections');
// 	log(intersections);

// 	// Insert one intersection into both shapes
// 	let intersectionPoint = ixToXYPoint(intersections[0]);
// 	let closestPoint;
// 	let point1 = path1.containsPoint(intersectionPoint);
// 	if (!point1) {
// 		closestPoint = path1.findClosestPointOnCurve(intersectionPoint);
// 		point1 = path1.insertPathPoint(closestPoint.point, round(closestPoint.split, 4));
// 	}
// 	point1.customID = 'overlap';

// 	let point2 = path2.containsPoint(intersectionPoint);
// 	if (!point2) {
// 		closestPoint = path2.findClosestPointOnCurve(intersectionPoint);
// 		point2 = path2.insertPathPoint(closestPoint.point, round(closestPoint.split, 4));
// 	}
// 	point2.customID = 'overlap';

// 	// Walk one shape until the overlap point is found
// 	// Flip to the other shape, add all the points
// 	// Flip back to the first shape, add remaining points

// 	function getPointsBeforeOverlap(path) {
// 		let re = [];
// 		let pt = {};

// 		for (let pp = 0; pp < path.pathPoints.length; pp++) {
// 			pt = new PathPoint(path.pathPoints[pp]);

// 			if (path.pathPoints[pp].customID !== 'overlap') {
// 				re.push(pt);
// 			} else {
// 				return {
// 					points: re,
// 					overlap: pt,
// 				};
// 			}
// 		}
// 	}

// 	function getPointsAfterOverlap(path) {
// 		let re = [];
// 		let ov = {};

// 		for (let pp = 0; pp < path.pathPoints.length; pp++) {
// 			if (path.pathPoints[pp].customID === 'overlap') {
// 				ov = new PathPoint(path.pathPoints[pp]);

// 				for (let pa = pp + 1; pa < path.pathPoints.length; pa++) {
// 					re.push(new PathPoint(path.pathPoints[pa]));
// 				}

// 				return {
// 					points: re,
// 					overlap: ov,
// 				};
// 			}
// 		}
// 	}

// 	let shape1half1 = getPointsBeforeOverlap(path1);
// 	let shape1half2 = getPointsAfterOverlap(path1);
// 	let shape2half1 = getPointsBeforeOverlap(path2);
// 	let shape2half2 = getPointsAfterOverlap(path2);

// 	let newPoints = [];
// 	let newPoint;
// 	newPoints = newPoints.concat(shape1half1.points);

// 	newPoint = new PathPoint({
// 		p: shape1half1.overlap.p,
// 		h1: shape1half1.overlap.h1,
// 		h2: shape2half1.overlap.h2,
// 		type: 'corner',
// 	});
// 	newPoint.h1.use = shape1half1.overlap.h1.use;
// 	newPoint.h2.use = shape2half1.overlap.h2.use;
// 	newPoints.push(newPoint);
// 	newPoints = newPoints.concat(shape2half2.points);
// 	newPoints = newPoints.concat(shape2half1.points);

// 	newPoint = new PathPoint({
// 		p: shape2half1.overlap.p,
// 		h1: shape2half1.overlap.h1,
// 		h2: shape1half2.overlap.h2,
// 		type: 'corner',
// 	});
// 	newPoint.h1.use = shape2half1.overlap.h1.use;
// 	newPoint.h2.use = shape1half2.overlap.h2.use;
// 	newPoints.push(newPoint);
// 	newPoints = newPoints.concat(shape1half2.points);

// 	let result = new Path({ pathPoints: newPoints });
// 	log(result);
// 	log('combinePathsAtFirstIntersection', 'end');
// 	return result;
// }
