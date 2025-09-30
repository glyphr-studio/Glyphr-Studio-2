import { describe, expect, it } from 'vitest';
import { clone, xyPointsAreClose } from '../../common/functions.js';
import { samples } from '../../samples/samples.js';
import { Path } from '../path.js';
import { PathPoint } from '../path_point.js';

/**
 * A sample path
 * @returns {Path}
 */
function samplePath() {
	return new Path({ pathPoints: clone(samples.pathPoints) });
}

/**
 * Another sample path
 * @returns {Path}
 */
function trianglePath() {
	return new Path({
		pathPoints: [
			{ p: { coord: { x: 100, y: 200 } } },
			{ p: { coord: { x: 300, y: 600 } } },
			{ p: { coord: { x: 400, y: 500 } } },
		],
	});
}

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	constructor
	save
	print
	get/set name
	get/set pathPoints
	get/set winding
	get/set x
	get/set y
	get/set height
	get/set width
	get/set xLock
	get/set yLock
	get/set wLock
	get/set hLock
	get/set ratioLock
	get/set maxes - Also tests recalculateMaxes
	get/set svgPathData
	get isLockable
	isLocked
	lock
	unlock
	setShapeSize
	updateShapeSize
	setShapePosition
	updateShapePosition
	rotate
	getNextPointNumber
	getPreviousPointNumber
	containsPoint
	makeSVGPathData
	makePostScript
	makePolySegment
	makeSegment
	addPointsAtPathIntersections
	calculateQuickSegmentLength
	findWinding
	reverseWinding
	flipNS
	flipEW
	roundAll
	addPathPoint
	insertPathPoint
	findClosestPointOnCurve
	findXYPointFromSplit
*/

describe('Path', () => {
	it('Constructor - objType', () => {
		const path = new Path();
		expect(path.objType).toBe('Path');
	});

	it('pathPoints', () => {
		// also tests pathPoints setter
		const path = samplePath();
		expect(path.pathPoints[3].p.x).toBe(170);
	});

	it('save', () => {
		const path = trianglePath();
		let saved = path.save();
		// console.log(saved);
		expect(saved).toEqual({
			name: 'Path',
			pathPoints: [
				{
					h1: {
						coord: {
							x: 0,
							y: 200,
						},
						use: false,
					},
					h2: {
						coord: {
							x: 200,
							y: 200,
						},
						use: false,
					},
					p: {
						coord: {
							x: 100,
							y: 200,
						},
					},
					type: 'corner',
				},
				{
					h1: {
						coord: {
							x: 200,
							y: 600,
						},
						use: false,
					},
					h2: {
						coord: {
							x: 400,
							y: 600,
						},
						use: false,
					},
					p: {
						coord: {
							x: 300,
							y: 600,
						},
					},
					type: 'corner',
				},
				{
					h1: {
						coord: {
							x: 300,
							y: 500,
						},
						use: false,
					},
					h2: {
						coord: {
							x: 500,
							y: 500,
						},
						use: false,
					},
					p: {
						coord: {
							x: 400,
							y: 500,
						},
					},
					type: 'corner',
				},
			],
		});
	});

	it('print', () => {
		const path = samplePath();
		expect(path.print()).toBeTruthy();
	});

	it('get / set name', () => {
		const path = samplePath();
		path.name = 'Sample Test Path';
		expect(path.name).toBe('Sample Test Path');
	});

	it('maxes getter', () => {
		const path = samplePath();
		expect(path.maxes.save()).toEqual({ xMin: 170, xMax: 484, yMin: 186, yMax: 500 });
	});

	it('svgPathData getter', () => {
		const path = samplePath();
		expect(path.svgPathData).toBe(
			'M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z'
		);
	});

	it('winding setter/getter', () => {
		const path = samplePath();
		expect(path.winding).toBeCloseTo(-180);
	});

	it('maxes getter', () => {
		const path = samplePath();
		expect(path.maxes.center.x).toBe(327);
	});

	it('y setter/getter', () => {
		// y setter uses setShapePosition and updateShapePosition
		const path = samplePath();
		path.y = 654;
		expect(path.y).toBe(654);
	});

	it('x setter/getter', () => {
		// x setter uses setShapePosition and updateShapePosition
		const path = samplePath();
		path.x = 654;

		expect(path.x).toBe(654);
	});

	it('width setter/getter', () => {
		// width setter uses setShapeSize and updateShapeSize
		const path = samplePath();
		path.width = 500;
		expect(path.width).toBe(500);
	});

	it('height setter/getter', () => {
		// height setter uses setShapeSize and updateShapeSize
		const path = samplePath();
		path.height = 654;
		expect(path.height).toBe(654);
	});

	it('isLockable', () => {
		expect(samplePath().isLockable).toBeTruthy();
	});

	it('get/set transformOrigin', () => {
		const path = samplePath();
		path.transformOrigin = 'top-left';
		expect(path.transformOrigin).toBe('top-left');
		path.transformOrigin = 'error';
		expect(path.transformOrigin).toBe('baseline-left');
	});

	it('x/y/w/h/ratio Lock setters/getters', () => {
		const path = samplePath();
		path.xLock = true;
		path.yLock = true;
		path.wLock = true;
		path.hLock = true;
		path.ratioLock = true;
		expect(path.xLock).toBeTruthy();
		expect(path.yLock).toBeTruthy();
		expect(path.wLock).toBeTruthy();
		expect(path.hLock).toBeTruthy();
		expect(path.ratioLock).toBeTruthy();
	});

	it('lock / unlock / isLocked setters/getters', () => {
		const path = samplePath();
		path.lock('x');
		path.lock('y');
		path.lock('width');
		path.lock('height');

		expect(path.isLocked('x')).toBeTruthy();
		expect(path.isLocked('y')).toBeTruthy();
		expect(path.isLocked('width')).toBeTruthy();
		expect(path.isLocked('height')).toBeTruthy();

		path.unlock('x');
		path.unlock('y');
		path.unlock('width');
		path.unlock('height');

		expect(path.isLocked('x')).toBeFalsy();
		expect(path.isLocked('y')).toBeFalsy();
		expect(path.isLocked('width')).toBeFalsy();
		expect(path.isLocked('height')).toBeFalsy();
	});

	it('svgPathData setter/getter', () => {
		const path = samplePath();
		path.svgPathData = '<svg>hi</svg>';

		expect(path.svgPathData).toBe('<svg>hi</svg>');
	});

	it('getNextPointNumber', () => {
		const path = samplePath();
		expect(path.getNextPointNumber(3)).toBe(0);
	});

	it('getPreviousPointNumber', () => {
		const path = samplePath();
		expect(path.getPreviousPointNumber(0)).toBe(3);
	});

	it('containsPoint', () => {
		const path = samplePath();
		expect(path.containsPoint({ x: 326.65249430318556, y: 500 })).toBeTruthy();
	});

	it('rotate', () => {
		const path = samplePath();
		path.rotate(45, { x: 100, y: 100 });
		expect(path.pathPoints[0].p.x).toBe(-121.29587073579876);
	});

	it('skewAngle', () => {
		const path = trianglePath();
		// Initial state: triangle with points at y: 200, 600, 500
		// Skew by 45 degrees from origin (0, 0)
		path.skewAngle(45, { x: 0, y: 0 });
		// At 45 degrees, tan(45°) = 1, so dx = y * 1
		// Point at y=200 should shift x by 200
		expect(path.pathPoints[0].p.x).toBeCloseTo(300, 1);
		// Point at y=600 should shift x by 600
		expect(path.pathPoints[1].p.x).toBeCloseTo(900, 1);
		// Point at y=500 should shift x by 500
		expect(path.pathPoints[2].p.x).toBeCloseTo(900, 1);
	});

	it('skewAngle with custom origin', () => {
		const path = trianglePath();
		const originalX = path.pathPoints[0].p.x;
		// Skew around y=200 (the y coordinate of first point)
		path.skewAngle(30, { x: 0, y: 200 });
		// Point at y=200 should not move (it's at the origin)
		expect(path.pathPoints[0].p.x).toBeCloseTo(originalX, 1);
		// Points above y=200 should shift
		expect(path.pathPoints[1].p.x).not.toBe(300);
	});

	it('skewDistance', () => {
		const path = trianglePath();
		// Initial maxes: yMax should be 600
		const yMax = path.maxes.yMax;
		expect(yMax).toBe(600);
		// Skew by distance of 100 from origin (0, 0)
		path.skewDistance(100, { x: 0, y: 0 });
		// Point at y=200: dx = (200 - 0) / 600 * 100 = 33.33
		expect(path.pathPoints[0].p.x).toBeCloseTo(133.33, 1);
		// Point at y=600: dx = (600 - 0) / 600 * 100 = 100
		expect(path.pathPoints[1].p.x).toBeCloseTo(400, 1);
		// Point at y=500: dx = (500 - 0) / 600 * 100 = 83.33
		expect(path.pathPoints[2].p.x).toBeCloseTo(483.33, 1);
	});

	it('skewDistance with custom origin', () => {
		const path = trianglePath();
		const yMax = path.maxes.yMax;
		const originalX = path.pathPoints[0].p.x;
		// Skew around y=200 (the y coordinate of first point)
		path.skewDistance(100, { x: 0, y: 200 });
		// Point at y=200: dx = (200 - 200) / yMax * 100 = 0
		expect(path.pathPoints[0].p.x).toBeCloseTo(originalX, 1);
		// Points above y=200 should shift proportionally
		expect(path.pathPoints[1].p.x).not.toBe(300);
	});

	it('getCenter', () => {
		expect(samplePath().maxes.center.x).toBe(327);
	});

	it('makePostScript', () => {
		const path = samplePath();
		expect(path.makePostScript().re).toBe(
			'326.65249430318556 500 rmoveto\n\n86.80744781082728 0 70.54005788598715 -71.01004289702911 0 -85.53294831955458 rrcurveto\n\n0 -85.53294831955458 -69.8451137552994 -71.92406046386174 -87.50239194151504 0 rrcurveto\n\n-87.50239194151504 0 -69.15010236167052 71.01000804467071 0 86.4470007387456 rrcurveto\n\n0 86.4470007387456 69.84504649235828 70.09599047783809 86.80744781082728 0 rrcurveto\n'
		);
	});

	it('makeSVGPathData', () => {
		const path = samplePath();
		expect(path.makeSVGPathData()).toBe(
			'M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z'
		);
	});

	it('addPointsAtPathIntersections', () => {
		const path = samplePath();
		// Pull the top coord down below the original bottom coord
		path.pathPoints[0].p.y = 100;
		path.addPointsAtPathIntersections();
		expect(path.pathPoints.length).toBe(8);
	});

	it('findWinding', () => {
		const path = samplePath();
		expect(path.findWinding()).toBeCloseTo(-180);
		expect(path.winding).toBeCloseTo(-180);
	});

	it('reverseWinding', () => {
		const path = samplePath();
		path.reverseWinding();
		expect(path.winding).toBeGreaterThan(0);
	});

	it('makeSegment', () => {
		expect(samplePath().makeSegment(1).p1x).toBe(484);
	});

	it('calculateQuickSegmentLength', () => {
		expect(samplePath().calculateQuickSegmentLength()).toBe(272.4319839826901);
	});

	it('makePolySegment', () => {
		const ps = samplePath().makePolySegment();
		expect(ps.segments[3].p1x).toBe(170);
	});

	it('flipNS', () => {
		const p = trianglePath();
		p.flipNS();
		expect(p.pathPoints[2].p.y).toBe(200);
	});

	it('flipEW', () => {
		const p = trianglePath();
		p.flipEW();
		expect(p.pathPoints[2].p.x).toBe(200);
	});

	it('roundAll', () => {
		const p = trianglePath();
		p.pathPoints[0].h1.x = 400.123;
		p.roundAll();
		expect(p.pathPoints[0].h1.x).toBe(400);
	});

	it('addPathPoint', () => {
		const pp = new PathPoint();
		expect(samplePath().addPathPoint(pp).p.x).toBe(0);
	});

	it('PathPoint: pointNumber', () => {
		const pp = samplePath().pathPoints[3];
		expect(pp.pointNumber).toBe(3);
	});

	it('insertPathPoint', () => {
		const newPP = samplePath().insertPathPoint();
		// expect(newPP.p.x).toBe(437.879040080653);
		// expect(newPP.p.y).toBe(453.80336001154114);
		expect(
			xyPointsAreClose(
				newPP.p,
				{
					x: 437.879,
					y: 453.803,
				},
				3
			)
		).toBeTruthy();
	});

	it('findClosestPointOnCurve', () => {
		expect(samplePath().findClosestPointOnCurve({ x: 100, y: 100 }).x).toBe(219.88358613439445);
	});

	it('findXYPointFromSplit', () => {
		expect(samplePath().findXYPointFromSplit().x).toBe(437.879040080653);
	});
});
