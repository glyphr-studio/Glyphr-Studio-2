import { clone, duplicates, pointsAreEqual } from '../common/functions.js';
import { ControlPoint } from '../project_data/control_point.js';
import { maxesOverlap } from '../project_data/maxes.js';
import { Path } from '../project_data/path.js';
import { findSegmentIntersections } from '../project_data/poly_segment.js';


// --------------------------------------------------------------
// Boolean Combine
// --------------------------------------------------------------

export function combineShapes(shapes, showToast = true, resolveOverlaps = true) {
	// debug('\n combineShapes - START');
	// debug(shapes);

	let tempShapes = false;

	if (shapes.length <= 1) {
		// debug('\t length=1 - returning what was passed');
		return false;
	} else if (shapes.length === 2) {
		// debug('\t length=2, starting combineTwoShapes');
		tempShapes = combineTwoShapes(shapes[0], shapes[1], showToast);

		if (!tempShapes) {
			// debug('\t length=2 - returning what was passed');
			if (showToast) showToast('The selected shapes do not have overlapping paths.');
			return false;
		} else {
			tempShapes = [tempShapes];
			// debug('\t length=2 - continuing with tempShapes from combineTwoShapes');
			// debug(tempShapes);
		}
	}

	// One pass through collapsing shapes down
	function singlePass(arr) {
		// debug('\n\t singlePass');
		// debug('\t\t start arr len ' + arr.length);
		let re;
		let newPaths = [];
		let didStuff = false;

		for (let outer = 0; outer < arr.length; outer++) {
			for (let inner = 0; inner < arr.length; inner++) {
				// debug('\t\t testing shape ' + outer + ' and ' + inner);

				if (outer !== inner && arr[outer] && arr[inner]) {
					re = combineTwoShapes(arr[outer], arr[inner], showToast);

					// debug('\t\t combineShapes returned ' + (re.length || re));
					if (re !== false) {
						newPaths.push(re);
						didStuff = true;
						arr[outer] = false;
						arr[inner] = false;
					}
				}
			}
		}

		newPaths = newPaths.concat(
			arr.filter(function (v) {
				return v;
			})
		);

		// debug('\t singlePass didStuff = ' + didStuff);

		return { arr: newPaths, didStuff: didStuff };
	}

	// Sort shapes by winding

	if (!tempShapes) {
		// debug('\t No tempShapes, sorting the existing shapes');
		tempShapes = clone(shapes, 'combineShapes');
		tempShapes.sort(function (a, b) {
			return a.path.getWinding() - b.path.getWinding();
		});

		// Main collapsing loop
		let looping = true;
		let count = 0;
		let lr;

		while (looping && count < 20) {
			looping = false;

			lr = singlePass(tempShapes);
			looping = lr.didStuff;
			if (!looping && count === 0) {
				if (!showToast) showToast('The selected shapes do not have overlapping paths.');
				return false;
			}

			tempShapes = lr.arr;
			// debug('\t didStuff ' + lr.didStuff);
			count++;
		}
	}

	// debug('\t working on shapes (tempShapes)');
	// debug(tempShapes);

	let newShapes = [];
	if (resolveOverlaps) {
		// debug('\t resolveOverlaps is true');
		newShapes = tempShapes;
		// debug('\t newShapes is now ');
		// debug(newShapes);
	} else {
		// debug('\t resolveOverlaps is false, tempShapes.length = ' + tempShapes.length);
		// Collapse each shape's overlapping paths
		for (let ts = 0; ts < tempShapes.length; ts++) {
			newShapes = newShapes.concat(resolveSelfOverlaps(tempShapes[ts]));
		}
		// debug('\t newShapes is now ');
		// debug(newShapes);
	}

	// debug('\t returning');
	// debug(newShapes);

	// debug(' combineShapes - END\n');
	return newShapes;
}

function combineTwoShapes(shape1, shape2) {
	// debug('\n combineTwoShapes - START');
	// Find intersections
	let intersections = findPathIntersections(shape1.path, shape2.path);

	if (intersections.length < 1) {
		// debug('\t no intersections, returning.');
		return false;
	}
	// debug('\t found intersections');
	// debug(intersections);

	// Insert one intersection into both shapes
	let ix = ixToCoord(intersections[0]);

	let p1 = shape1.path.containsPoint(ix);
	if (!p1) {
		p1 = shape1.path.getClosestPointOnCurve(ix);
		p1 = shape1.path.insertControlPoint(p1.split, p1.point);
	}
	p1.customid = 'overlap';

	let p2 = shape2.path.containsPoint(ix);
	if (!p2) {
		p2 = shape2.path.getClosestPointOnCurve(ix);
		p2 = shape2.path.insertControlPoint(p2.split, p2.point);
	}
	p2.customid = 'overlap';

	// Walk one shape until the overlap point is found
	// Flip to the other shape, add all the points
	// Flip back to the first shape, add remaining points

	function getPointsBeforeOverlap(path) {
		let re = [];
		let pt = {};

		for (let pp = 0; pp < path.pathpoints.length; pp++) {
			pt = new ControlPoint(path.pathpoints[pp]);

			if (path.pathpoints[pp].customid !== 'overlap') {
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

		for (let pp = 0; pp < path.pathpoints.length; pp++) {
			if (path.pathpoints[pp].customid === 'overlap') {
				ov = new ControlPoint(path.pathpoints[pp]);

				for (let pa = pp + 1; pa < path.pathpoints.length; pa++) {
					re.push(new ControlPoint(path.pathpoints[pa]));
				}

				return {
					points: re,
					overlap: ov,
				};
			}
		}
	}

	let s1h1 = getPointsBeforeOverlap(shape1.path);
	let s1h2 = getPointsAfterOverlap(shape1.path);
	let s2h1 = getPointsBeforeOverlap(shape2.path);
	let s2h2 = getPointsAfterOverlap(shape2.path);

	let newPoints = [];

	newPoints = newPoints.concat(s1h1.points);

	newPoints.push(
		new ControlPoint({
			P: clone(s1h1.overlap.P, 'combineTwoShapes'),
			H1: clone(s1h1.overlap.H1, 'combineTwoShapes'),
			H2: clone(s2h1.overlap.H2, 'combineTwoShapes'),
			type: 'corner',
			useh1: s1h1.overlap.useh1,
			useh2: s2h1.overlap.useh2,
		})
	);

	newPoints = newPoints.concat(s2h2.points);
	newPoints = newPoints.concat(s2h1.points);

	newPoints.push(
		new ControlPoint({
			P: clone(s2h1.overlap.P, 'combineTwoShapes'),
			H1: clone(s2h1.overlap.H1, 'combineTwoShapes'),
			H2: clone(s1h2.overlap.H2, 'combineTwoShapes'),
			type: 'corner',
			useh1: s2h1.overlap.useh1,
			useh2: s1h2.overlap.useh2,
		})
	);

	newPoints = newPoints.concat(s1h2.points);

	// debug(' combineTwoShapes - returning successfully - END\n');

	return new Path({ path: { pathpoints: newPoints } });
}

function ixToCoord(ix) {
	// debug('\n ixToCoord - START');
	// debug(ix);
	var re = {
		x: parseFloat(ix.split('/')[0]),
		y: parseFloat(ix.split('/')[1]),
	};
	// debug([re]);
	// debug(' ixToCoord - END\n');
	return re;
}

function resolveSelfOverlaps(path) {
	// debug('\n Shape.resolveSelfOverlaps - START');
	// Add self intersects to path
	let polySegment = path.getPolySegment();
	let ix = polySegment.findIntersections();
	// debug('\t intersections');
	// debug(json(ix, true));

	if (ix.length === 0) return new Path(clone(path, 'Shape.resolveSelfOverlaps'));

	let segmentNumber = polySegment.segments.length;

	let threshold = 0.01;
	polySegment.splitSegmentsAtProvidedIntersections(ix, threshold);

	if (segmentNumber === polySegment.segments.length)
		return new Path(clone(path, 'Shape.resolveSelfOverlaps'));

	// debug('\t before filtering ' + polySegment.segments.length);
	polySegment.removeZeroLengthSegments();
	polySegment.removeDuplicateSegments();
	polySegment.removeSegmentsOverlappingShape(path);
	polySegment.removeRedundantSegments();
	polySegment.removeNonConnectingSegments();
	// polySegment.combineInlineSegments();
	// debug('\t afters filtering ' + polySegment.segments.length);

	// if(_UI.devmode) polySegment.drawPolySegmentOutline();

	// let resultingPaths = [];
	// resultingPaths.push(new Path({'name':path.name, 'path':polySegment.getPath()}));

	let resultingSegments = polySegment.stitchSegmentsTogether();

	let resultingPaths = [];
	let psn;
	for (let ps = 0; ps < resultingSegments.length; ps++) {
		psn = resultingSegments[ps];
		if (psn.segments.length > 1) resultingPaths.push(new Path({ name: path.name, path: psn.getPath() }));
	}

	// debug(' Shape.resolveSelfOverlaps - END\n');
	return resultingPaths;
}

/**
 * Find overlaps between two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {Array}
 */
function findPathIntersections(p1, p2) {
	// log('findPathIntersections', 'start');
	let intersects = [];

	// Find overlaps at boundaries
	intersects = intersects.concat(findPathPointIntersections(p1, p2));

	intersects = intersects.concat(findPathPointBoundaryIntersections(p1, p2));

	intersects = intersects.filter(duplicates);
	// log('intersections after boundary detection');
	// log(intersects);

	// Maxes within boundaries
	if (!maxesOverlap(p1.maxes, p2.maxes)) {
		// log(p1.maxes);
		// log(p2.maxes);
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
	 * @param {Path} p1 - first path
	 * @param {PathPoint} p1p - first path point
	 * @param {Path} p2 - second path
	 * @param {PathPoint} p2p - second path point
	 */
	function pushSegOverlaps(p1, p1p, p2, p2p) {
		// log('pushSegOverlaps - p1p ' + p1p + ' - p2p ' + p2p);
		bs = p1.makeSegment(p1p);
		ts = p2.makeSegment(p2p);

		if (maxesOverlap(bs.getFastMaxes(), ts.getFastMaxes())) {
			// log('\t\t pushed!');
			segmentOverlaps.push({ bottom: bs, top: ts });
		}
	}

	// Find overlaps within a single segment -- don't care about this case
	// Find overlaps within a single path -- don't care about this case

	// Find overlaps between two paths
	for (let bpp = 0; bpp < p1.pathPoints.length; bpp++) {
		for (let tpp = 0; tpp < p2.pathPoints.length; tpp++) {
			pushSegOverlaps(p1, bpp, p2, tpp);
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
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {Array}
 */
function findPathPointBoundaryIntersections(p1, p2) {
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

	check(p1, p2);
	check(p2, p1);

	re = re.filter(duplicates);

	return re;
}

/**
 * Finds x/y overlaps between any points given two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {Array} - collection of IX strings, representing xy points
 */
function findPathPointIntersections(p1, p2) {
	// log('findPathPointIntersections', 'start');
	let re = [];
	let ix;

	// log(p1.toString());
	// log(p2.toString());

	for (let pp1 = 0; pp1 < p1.pathPoints.length; pp1++) {
		for (let pp2 = 0; pp2 < p2.pathPoints.length; pp2++) {
			if (pointsAreEqual(p1.pathPoints[pp1].p, p2.pathPoints[pp2].p, 0.01)) {
				ix = '' + p1.pathPoints[pp1].p.x + '/' + p1.pathPoints[pp1].p.y;
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