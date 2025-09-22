import { clone, duplicates, numSan, round, xyPointsAreClose } from '../common/functions.js';
import { GlyphElement } from './glyph_element.js';
import { maxesOverlap } from './maxes.js';
import { Path } from './path.js';
import { offsetPolySegment } from './poly_segment_offset.js';
import { Segment } from './segment.js';
import { XYPoint } from './xy_point.js';

/**
 * Glyph Element > Poly Segment
 * A Poly Segment (aka poly bezier) stores a
 * series of Segments that represent a Path.

 * Paths in Glyphr Studio are a collection of
 * Path Points, which themselves contain a point
 * and two handles.  Bezier curves, on the other
 * hand, are represented as two points, with two
 * handles between them.

 * This PolySegment object is basically here just
 * to make Bezier math easier for Paths.
 */
export class PolySegment extends GlyphElement {
	/**
	 * Make a PolySegment
	 * @param {Object} arg
	 * @param {Array =} arg.segments
	 */
	constructor({ segments = [] } = {}) {
		super();
		this.segments = segments;

		this.objType = 'PolySegment';
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = {
			/**
			 * @type {Array}
			 */
			segments: [],
		};

		for (let s = 0; s < this._segments.length; s++) {
			re.segments[s] = this._segments[s].save(verbose);
		}

		if (verbose) re.objType = this.objType;

		return re;
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {Number} level - how far down we are
	 * @returns {String}
	 */
	print(level = 0) {
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{PolySegment\n`;
		ind += '  ';

		re += `${ind}segments: [\n`;
		this.segments.forEach((seg) => {
			re += seg.print(level + 2);
			re += `\n`;
		});
		re += `${ind}]\n`;

		re += `${ind.substring(2)}}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * get the Segments array
	 * @returns {Array}
	 */
	get segments() {
		return this._segments;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * set the Segments array
	 * @param {Array} segments
	 */
	set segments(segments) {
		this._segments = [];
		for (let s = 0; s < segments.length; s++) {
			this._segments[s] = new Segment(segments[s]);
		}
	}

	/**
	 * Creates a 2x2 matrix of raw segment point values
	 */
	get valuesAsArray() {
		let re = [];
		this.segments.forEach((segment) => re.push(segment.valuesAsArray));
		return re;
	}

	// --------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------

	/**
	 * Convert this PolySegment to a Path
	 * @returns {Path}
	 */
	get path() {
		// log('PolySegment GET path', 'start');
		// log(this._segments);

		/**
		 * Creates a single Point from two segments
		 * @param {Segment} seg1 - First segment
		 * @param {Segment} seg2 - Second segment
		 * @returns {Object}
		 */
		function makePathPointFromSegments(seg1, seg2) {
			const newPP = {
				h1: { coord: { x: seg1.p3x, y: seg1.p3y } },
				p: { coord: { x: seg2.p1x, y: seg2.p1y } },
				h2: { coord: { x: seg2.p2x, y: seg2.p2y } },
			};

			if (xyPointsAreClose(newPP.h1.coord, newPP.p.coord)) newPP.h1.use = false;
			if (xyPointsAreClose(newPP.h2.coord, newPP.p.coord)) newPP.h2.use = false;
			if (seg1.lineType) newPP.h1.use = false;
			if (seg2.lineType) newPP.h2.use = false;

			// newPP.resolvePointType();

			return newPP;
		}

		const pp = [];
		const segments = clone(this._segments);

		// Connect the first / last point if not already
		const firstP = new XYPoint(segments[0].p1x, segments[0].p1y);
		const lastP = new XYPoint(segments.at(-1).p4x, segments.at(-1).p4y);
		if (!xyPointsAreClose(firstP, lastP)) {
			segments.push(
				new Segment({
					p1x: lastP.x,
					p1y: lastP.y,
					p4x: firstP.x,
					p4y: firstP.y,
				})
			);
		}

		// Fencepost make the first PathPoint
		pp.push(makePathPointFromSegments(segments.at(-1), segments[0]));

		// Loop through Segments and create PathPoints
		let ns;
		for (let s = 0; s < segments.length - 1; s++) {
			ns = segments[s + 1];
			pp.push(makePathPointFromSegments(segments[s], ns));
		}

		// log(pp);
		// log('PolySegment GET path', 'end');
		return new Path({ pathPoints: pp });
	}

	/**
	 * Search to see if a Segment is in this PolySegment
	 * @param {Segment} seg - to look for
	 * @returns {Boolean}
	 */
	containsSegment(seg) {
		for (let s = 0; s < this._segments.length; s++) {
			if (segmentsAreEqual(this._segments[s], seg)) return true;
		}
		return false;
	}

	/**
	 * Round all the Segment values
	 * @param {Number} precision - decimal places
	 * @returns {PolySegment}
	 */
	roundAll(precision = 3) {
		for (let s = 0; s < this._segments.length; s++) {
			this._segments[s].roundAll(precision);
		}

		return this;
	}

	// --------------------------------------------------------------
	// Intersections
	// --------------------------------------------------------------

	/**
	 * Finds all the intersections between segments
	 * @returns {Array} - collection of intersections in ix format
	 */
	findIntersections() {
		// log('PolySegment.findIntersections', 'start');
		// log('' + this._segments.length + ' segments');
		let s1;
		let s2;
		let ix = [];
		for (let i = 0; i < this._segments.length; i++) {
			for (let j = i; j < this._segments.length; j++) {
				if (j !== i) {
					s1 = new Segment(this._segments[i]);
					s2 = new Segment(this._segments[j]);
					ix = ix.concat(findSegmentIntersections(s1, s2));
				}
			}
		}
		ix = ix.filter(duplicates);
		// log('found ' + ix.length + ' ix');
		// log(ix);
		// log('PolySegment.findIntersections', 'end');
		return ix;
	}

	/**
	 * Takes a collection of intersections, and splits all the applicable
	 * segments at those points
	 * @param {Array} ixArray - array of intersections in ix format
	 * @param {Number} threshold - how closely to look and split
	 * @returns {PolySegment}
	 */
	splitSegmentsAtIntersections(ixArray = this.findIntersections(), threshold = 1) {
		// log('PolySegment.splitSegmentsAtIntersections', 'start');
		// log('before length ' + this._segments.length);
		// log(this.print());
		// log(`ixArray ${typeof ixArray} ${JSON.stringify(ixArray)}`);

		let x;
		let y;
		ixArray.forEach(function (v, i) {
			x = v.split('/')[0];
			y = v.split('/')[1];
			ixArray[i] = new XYPoint(x, y);
		});

		// log(`ixArray ${typeof ixArray} ${JSON.stringify(ixArray)}`);

		let result = [];
		for (let s = 0; s < this._segments.length; s++) {
			result = result.concat(this._segments[s].splitAtManyPoints(ixArray, threshold));
		}
		this._segments = result;
		this.cache.splits = ixArray;

		// log('afters length ' + this._segments.length);
		// log(this.print());
		// log('PolySegment.splitSegmentsAtIntersections', 'end');
		return this;
	}

	/**
	 * Takes all the segments and orders them based on their
	 * starting and ending points
	 * @returns {Array | Boolean} - collection of stitched PolySegments (hopefully just one)
	 */
	stitchSegmentsTogether() {
		// log('PolySegment.stitchSegmentsTogether', 'start');
		const source = this.segments;
		let sorted = [];
		const result = [];

		/**
		 * Looks for a segment with a provided starting point
		 * @param {XYPoint} co starting point to look for
		 * @returns {Segment | false}
		 */
		function getSegmentStartingAt(co) {
			let ts;
			let re;
			for (let s = 0; s < source.length; s++) {
				ts = source[s];
				if (ts.objType === 'Segment') {
					if (ts.containsStartPoint(co, 0)) {
						re = new Segment(ts);
						ts.objType = '-' + result.length + '.' + sorted.length;
						return re;
					}
				}
			}
			// if not, try all the segments reversed
			for (let r = 0; r < source.length; r++) {
				ts = source[r].getReverse();
				if (source[r].objType === 'Segment') {
					if (ts.containsStartPoint(co, 0)) {
						re = new Segment(ts);
						source[r].objType = 'R' + result.length + '.' + sorted.length;
						return re;
					}
				}
			}
			return false;
		}

		/**
		 * Get the next unsorted segment's first point
		 * @returns {XYPoint | Object}
		 */
		function getNextUnusedSegmentP1() {
			for (let s = 0; s < source.length; s++) {
				if (source[s].objType === 'Segment') {
					return source[s].getXYPoint(1);
				}
			}
		}

		// Start ordering
		let nextXYPoint = getNextUnusedSegmentP1();
		// log('starting loop');
		// log(nextXYPoint);
		// log('source.length ' + source.length);
		for (let i = 0; i < source.length; i++) {
			let resultSegment = getSegmentStartingAt(nextXYPoint);
			if (resultSegment) {
				// log('LOOP ' + i + ' added a segment,  ' + result.length + '.' + sorted.length);
				sorted.push(resultSegment);
				nextXYPoint = resultSegment.getXYPoint(4);
			} else {
				// log('LOOP ' + i + ' NO NEXT SEGMENT FOUND');
				if (sorted.length) {
					result.push(new PolySegment({ segments: sorted }));
					if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getXYPoint(1))) {
						// log('\t\t Pushed sorted PolySegment, connected nicely');
					} else {
						// log('\t\t Pushed sorted PolySegment, OPEN LOOP');
					}
					sorted = [];
					nextXYPoint = getNextUnusedSegmentP1();
					i--;
				}
			}
		}

		// Fencepost
		if (sorted.length) {
			// log('FINISHING');
			result.push(new PolySegment({ segments: sorted }));
			if (sorted[sorted.length - 1].containsEndPoint(sorted[0].getXYPoint(1))) {
				// log('\t\t Pushed sorted PolySegment, connected nicely');
			} else {
				// log('\t\t Pushed sorted PolySegment, OPEN LOOP');
			}
		}

		// log('result');
		// log(result);
		// result.forEach(function (v, i) {
		// log('\n\t RETURNING ' + i);
		// log(v.segments);
		// });
		// log('PolySegment.stitchSegmentsTogether', 'end');

		return result;
	}

	// --------------------------------------------------------------
	// Segment Filtering
	// --------------------------------------------------------------

	/**
	 * Removes all the zero length segments
	 * @returns {PolySegment}
	 */
	removeZeroLengthSegments() {
		// log('PolySegment.removeZeroLengthSegments', 'start');

		let currSeg;
		for (let s = 0; s < this._segments.length; s++) {
			currSeg = this._segments[s];
			if (xyPointsAreClose(currSeg.getXYPoint(1), currSeg.getXYPoint(4))) {
				if (currSeg.lineType) {
					currSeg.objType = 'LINE ZERO';
				} else if (
					xyPointsAreClose(currSeg.getXYPoint(1), currSeg.getXYPoint(2)) &&
					xyPointsAreClose(currSeg.getXYPoint(1), currSeg.getXYPoint(3))
				) {
					currSeg.objType = 'ZERO';
				}
			}
		}

		// log(this.print());
		this._segments = this._segments.filter(function (v) {
			return v.objType === 'Segment';
		});
		// log('PolySegment.removeZeroLengthSegments', 'end');

		return this;
	}

	/**
	 * Removes all line segments that are overlapped
	 * by larger line segments
	 * @returns {PolySegment}
	 */
	removeRedundantLineSegments() {
		// log('PolySegment.removeRedundantLineSegments', 'start');
		for (let s = 0; s < this._segments.length; s++) {
			for (let t = 0; t < this._segments.length; t++) {
				if (s !== t && this._segments[s] && this._segments[t]) {
					let sSeg = this._segments[s];
					let tSeg = this._segments[t];
					// try one way
					if (sSeg.isLineOverlappedByLine(tSeg)) {
						sSeg.objType = 'REDUNDANT';
					}
					// try other way
					if (tSeg.isLineOverlappedByLine(sSeg)) {
						tSeg.objType = 'REDUNDANT';
					}
					// exactly overlapping
					if (tSeg.objType === 'Segment' && sSeg.objType === 'Segment') {
						if (segmentsAreEqual(sSeg, tSeg)) {
							sSeg.objType = 'DUPLICATE';
						}
					}
				}
			}
			// log(`Seg ${s} ${this._segments[s].objType}`);
		}

		this._segments = this._segments.filter(function (v) {
			return v.objType === 'Segment';
		});
		// log('PolySegment.removeRedundantLineSegments', 'end');

		return this;
	}

	/**
	 * Removes all segments not 'connected' to other segments
	 * @returns {PolySegment}
	 */
	removeNonConnectingSegments() {
		// log('PolySegment.removeNonConnectingSegments', 'start');
		let test;
		let against;
		const connected1 = [];
		const connected4 = [];
		const threshold = 1;
		for (let t = 0; t < this._segments.length; t++) {
			// log('testing segment ' + t);
			test = this._segments[t];
			connected1[t] = false;
			connected4[t] = false;
			for (let a = 0; a < this._segments.length; a++) {
				against = this._segments[a];
				// if(t !== a && against.objType === 'Segment'){
				if (t !== a) {
					if (against.containsTerminalPoint(test.getXYPoint(1), threshold)) {
						connected1[t] = true;
					}

					if (against.containsTerminalPoint(test.getXYPoint(4), threshold)) {
						connected4[t] = true;
					}
					if (connected1[t] && connected4[t]) {
						break;
					}
				}
			}
		}
		// log('segments by number, first point connected');
		// log(json(connected1, true));
		// log('segments by number, last point connected');
		// log(json(connected4, true));

		for (let c = 0; c < this._segments.length; c++) {
			if (!(connected1[c] && connected4[c])) {
				this._segments[c].objType = 'NON CONNECTED';
			}
		}

		// log(this._segments);
		this._segments = this._segments.filter(function (v) {
			return v.objType === 'Segment';
		});
		// log('PolySegment.removeNonConnectingSegments', 'end');

		return this;
	}

	/**
	 * Looks for straight line segments that are in line with each other,
	 * then merges them into one larger line.
	 */
	combineInlineSegments() {
		// log(`PolySegment.combineInlineSegments`, 'start');
		// let startLength = this.segments.length;
		let thisSegment, nextSegment;

		for (let s = 0; s < this.segments.length; s++) {
			// log(`segment number ${s}`);

			thisSegment = this.segments[s];
			nextSegment = this.segments[s + 1];
			if (s === this.segments.length - 1) nextSegment = this.segments[0];
			// log(`thisSegment.lineType: ${thisSegment.lineType}`);
			// log(`nextSegment.lineType: ${nextSegment.lineType}`);

			if (thisSegment.lineType === nextSegment.lineType) {
				this.segments[s] = new Segment({
					p1x: thisSegment.p1x,
					p1y: thisSegment.p1y,
					p4x: nextSegment.p4x,
					p4y: nextSegment.p4y,
				});
				this.segments.splice(s + 1, 1);
				s--;
			}
		}
		// log(`Removed segments: ${this.segments.length - startLength}`);
		// log(`PolySegment.combineInlineSegments`, 'end');
	}

	// --------------------------------------------------------------
	// Curve Offsetting
	// --------------------------------------------------------------

	makeOffsetPolySegment(offsetDistance = 10) {
		const newSegments = offsetPolySegment(this, offsetDistance);
		return new PolySegment({ segments: newSegments });
	}
}

// --------------------------------------------------------------
// Curve Intersections
// --------------------------------------------------------------

/**
 * Find all places where two segments cross each other
 * This is a recursive algorithm
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @param {Number} depth - How deep this recursive call has gone
 * @returns {Array} - collection of overlap points in ix format like ['x/y', 'x/y', 'x/y']
 */
export function findSegmentIntersections(s1, s2, depth = 0) {
	// log('findSegmentIntersections', 'start');
	// log('depth ' + depth);

	// if(depth > 15) {
	// log('findSegmentIntersections early return');
	//  return [];
	// }

	// Check for overlapping / coincident segments
	if (depth === 0) {
		const co = findOverlappingLineSegmentIntersections(s1, s2);
		if (co.length) {
			// log('found overlapping line ' + co[0]);
			return co;
		}
	}

	// If both segments are lines, check for intersection
	if (depth === 0) {
		const cr = findCrossingLineSegmentIntersections(s1, s2);
		if (cr.length) {
			// log('found cross line ' + cr[0]);
			return cr;
		}
	}

	// Edge case, find end points overlapping the other segment
	let endpoints = [];
	if (depth === 0 && (s1.lineType || s2.lineType)) {
		// findEndPointSegmentIntersections is a perf hit
		// only run if either s1 or s2 is a line segment
		endpoints = findEndPointSegmentIntersections(s1, s2);
	}

	// Check to stop recursion
	const s1m = s1.getFastMaxes();
	const s2m = s2.getFastMaxes();

	if (!maxesOverlap(s1m, s2m)) {
		// log('segments have non overlapping fast maxes');
		return [];
	}
	// log('segments fast maxes overlap');
	// log([s1m]);
	// log([s2m]);

	// Complex segment intersections
	const threshold = 0.0009;
	const precision = 3;

	let s1w = s1m.xMax - s1m.xMin;
	let s1h = s1m.yMax - s1m.yMin;
	let s2w = s2m.xMax - s2m.xMin;
	let s2h = s2m.yMax - s2m.yMin;
	// log(`threshold: ${threshold}`);
	// log('s1 w/h: ' + s1w + ' / ' + s1h);
	// log('s2 w/h: ' + s2w + ' / ' + s2h);

	if (s1w < threshold && s1h < threshold && s2w < threshold && s2h < threshold) {
		s1w *= 0.5;
		s1h *= 0.5;
		s2w *= 0.5;
		s2h *= 0.5;
		let x = (s1m.xMin + s1w + (s2m.xMin + s2w)) / 2;
		let y = (s1m.yMin + s1h + (s2m.yMin + s2h)) / 2;

		x = round(x, precision);
		y = round(y, precision);

		const ix = '' + x + '/' + y;
		// log('<<<<<<<<<<<<<<<<< hit bottom, found ' + ix);
		return [ix];
	} else {
		// log('not below threshold at ' + depth);
	}

	// More recursion needed
	let re = [];
	const s1split = s1.splitAtTime(0.5);
	const s2split = s2.splitAtTime(0.5);
	let pairs = [
		[s1split[0], s2split[0]],
		[s1split[0], s2split[1]],
		[s1split[1], s2split[1]],
		[s1split[1], s2split[0]],
	];

	pairs = pairs.filter(function (p) {
		return maxesOverlap(p[0].getFastMaxes(), p[1].getFastMaxes(), 'inclusive');
	});

	// log('' + pairs.length + ' pairs after maxes overlap filter');
	// log(pairs);

	pairs.forEach(function (p) {
		re = re.concat(findSegmentIntersections(p[0], p[1], depth + 1));
	});

	re = re.concat(endpoints);
	re = re.filter(duplicates);

	// if(depth === 0) alert('break');

	// log('return length ' + re.length);
	// log('findSegmentIntersections', 'end');
	return re;
}

/**
 * Checks a segment's points to see of two segments are equal
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @param {Number} threshold - precision
 * @returns {Boolean}
 */
export function segmentsAreEqual(s1, s2, threshold = 1) {
	// log('segmentsAreEqual', 'start');
	// log([s1, s2]);

	if (
		xyPointsAreClose(s1.getXYPoint(1), s2.getXYPoint(1), threshold) &&
		xyPointsAreClose(s1.getXYPoint(4), s2.getXYPoint(4), threshold)
	) {
		if (s1.lineType && s2.lineType) {
			// log('segmentsAreEqual - returning LINE true', 'end');
			return true;
		} else if (
			xyPointsAreClose(s1.getXYPoint(2), s2.getXYPoint(2), threshold) &&
			xyPointsAreClose(s1.getXYPoint(3), s2.getXYPoint(3), threshold)
		) {
			// log('segmentsAreEqual - returning FULLY true', 'end');
			return true;
		}
	}

	// log('segmentsAreEqual - returning false', 'end');
	return false;
}

/**
 * Check if the two segments are overlapping horizontal or vertical lines
 * If so, just return one point from the coincident lines
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @returns {Array} - collection of overlaps in ix format
 */
export function findOverlappingLineSegmentIntersections(s1, s2) {
	// log(`findOverlappingLineSegmentIntersections`, 'start');
	const re = [];

	if (s1.containsPointOnLine(s2.getXYPoint(1))) re.push('' + s2.p1x + '/' + s2.p1y);
	if (s1.containsPointOnLine(s2.getXYPoint(4))) re.push('' + s2.p4x + '/' + s2.p4y);

	if (s2.containsPointOnLine(s1.getXYPoint(1))) re.push('' + s1.p1x + '/' + s1.p1y);
	if (s2.containsPointOnLine(s1.getXYPoint(4))) re.push('' + s1.p4x + '/' + s1.p4y);

	if (re.length) {
		// log('findOverlappingLineSegmentIntersections', 'start');
		// log([s1, s2]);
		// log(json(re));
		// log('findOverlappingLineSegmentIntersections', 'end');
	}

	// log(`findOverlappingLineSegmentIntersections`, 'end');
	return re;
}

/**
 * Find overlap points for Segments that are Lines (no curves)
 * This is much faster than comparing two curves
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @returns {Array} - overlap point in ix format
 */
export function findCrossingLineSegmentIntersections(s1, s2) {
	// log('findCrossingLineSegmentIntersections', 'start');
	if (!s1.lineType || !s2.lineType) return [];

	const d1x = s1.p4x - s1.p1x;
	const d1y = s1.p4y - s1.p1y;
	const d2x = s2.p4x - s2.p1x;
	const d2y = s2.p4y - s2.p1y;

	const s = (-1 * d1y * (s1.p1x - s2.p1x) + d1x * (s1.p1y - s2.p1y)) / (-1 * d2x * d1y + d1x * d2y);
	const t = (d2x * (s1.p1y - s2.p1y) - d2y * (s1.p1x - s2.p1x)) / (-1 * d2x * d1y + d1x * d2y);

	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
		const rx = numSan(s1.p1x + t * d1x);
		const ry = numSan(s1.p1y + t * d1y);

		// log('found ' + rx + ', ' + ry);
		if (s1.containsTerminalPoint({ x: rx, y: ry }) && s2.containsTerminalPoint({ x: rx, y: ry })) {
			// log('its an end point');
			// log('findCrossingLineSegmentIntersections', 'end');
			return [];
		}

		const re = ['' + rx + '/' + ry];
		// log('findCrossingLineSegmentIntersections', 'end');
		return re;
	}

	// log('findCrossingLineSegmentIntersections', 'end');
	return [];
}

/**
 * Finds if two segments overlap in their end points
 * @param {Segment} s1 - first segment
 * @param {Segment} s2 - second segment
 * @returns {Array} - collection of overlaps in ix format
 */
export function findEndPointSegmentIntersections(s1, s2) {
	// log('findEndPointSegmentIntersections', 'start');
	const s1s = s1.getXYPoint(1);
	const s1e = s1.getXYPoint(4);
	const s2s = s2.getXYPoint(1);
	const s2e = s2.getXYPoint(4);

	const re = [];

	if (s1.containsPointOnCurve(s2s)) re.push(`${s2s.x}/${s2s.y}`);
	if (s1.containsPointOnCurve(s2e)) re.push(`${s2e.x}/${s2e.y}`);
	if (s2.containsPointOnCurve(s1s)) re.push(`${s1s.x}/${s1s.y}`);
	if (s2.containsPointOnCurve(s1e)) re.push(`${s1e.x}/${s1e.y}`);

	// log('returning ' + re);
	// log('findEndPointSegmentIntersections', 'end');
	return re;
}
