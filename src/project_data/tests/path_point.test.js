import { describe, expect, it } from 'vitest';
import { PathPoint } from '../path_point.js';

/**
 * default sample PathPoint
 * @returns {PathPoint}
 */
function samplePathPoint() {
	let pp = new PathPoint({
		p: { coord: { x: 100, y: 100 } },
		h1: { coord: { x: 0, y: 0 } },
		h2: { coord: { x: 200, y: 200 } },
	});
	return pp;
}

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	constructor
	save
	print
	get/set p
	get/set h1
	get/set h2
	get/set type
	// get pointNumber - TESTED IN PATH
	get defaultHandleLength
	updatePathPointPosition
	makeSymmetric
	makeFlat
	isFlat
	reconcileHandle
	resolvePointType
	makePointedTo
	hasOverlappingHandle
	rotate
	resetHandles
	roundAll
*/

describe('PathPoint', () => {
	it('Constructor - objType', () => {
		const pp = new PathPoint();
		expect(pp.objType).toBe('PathPoint');
	});

	it('Constructor - p.x', () => {
		const pp = samplePathPoint();
		expect(pp.p.x).toBe(100);
	});

	it('Constructor - type', () => {
		const pp = samplePathPoint();
		expect(pp.type).toBe('corner');
	});

	it('Constructor - projectUPM', () => {
		const pp = samplePathPoint();
		expect(pp.projectUPM).toBe(2048);
	});

	it('save', () => {
		const pp = samplePathPoint();
		expect(pp.save()).toEqual(
			JSON.parse(
				'{"p":{"coord":{"x":100,"y":100}},"type":"corner","h1":{"coord":{"x":0,"y":0}},"h2":{"coord":{"x":200,"y":200}}}'
			)
		);
	});

	it('print', () => {
		const pp = samplePathPoint();
		expect(pp.print()).toEqual(`{PathPoint
  type: corner
  p:   {ControlPoint
    coord:     {x: 100  y: 100}
  }
  h1:   {ControlPoint
    coord:     {x: 0  y: 0}
    use: true
  }
  h2:   {ControlPoint
    coord:     {x: 200  y: 200}
    use: true
  }
}/PathPoint`);
	});

	it('ControlPoint: get defaultHandleLength', () => {
		const pp = new PathPoint();
		expect(pp.defaultHandleLength).toBe(100);

		const pp1 = new PathPoint({ projectUPM: 99 });
		expect(pp1.defaultHandleLength).toBe(2);

		const pp2 = new PathPoint({ projectUPM: 499 });
		expect(pp2.defaultHandleLength).toBe(10);

		const pp3 = new PathPoint({ projectUPM: 999 });
		expect(pp3.defaultHandleLength).toBe(50);

		const pp4 = new PathPoint({ projectUPM: 2050 });
		expect(pp4.defaultHandleLength).toBe(200);
	});

	it('ControlPoint: use', () => {
		const pp = new PathPoint();
		pp.h1.use = false;
		expect(pp.h1.x).toBe(pp.p.x);
	});

	it('updatePathPointPosition', () => {
		const pp = samplePathPoint();
		pp.updatePathPointPosition('p', 100, 100);
		expect(pp.p.x).toBe(200);
	});

	it('makeSymmetric', () => {
		const pp = samplePathPoint();
		pp.h2.x = 555;
		expect(pp.makeSymmetric('h1').h2.x).toBe(200);
	});

	it('isFlat', () => {
		const pp = samplePathPoint();
		expect(pp.isFlat()).toBeTruthy();
	});

	it('makeFlat', () => {
		const pp = samplePathPoint();
		pp.h2.x = 555;
		expect(pp.makeFlat('h1').h2.x).toBe(429.412355566697);
	});

	it('reconcileHandle', () => {
		const pp = samplePathPoint();
		pp.type = 'symmetric';
		pp.h2.x = 555;
		pp.reconcileHandle('h1');
		expect(pp.h1.x).toBe(-355);
	});

	it('resolvePointType', () => {
		const pp = samplePathPoint();
		expect(pp.resolvePointType()).toBe('symmetric');
	});

	it('makePointedTo', () => {
		const pp = samplePathPoint();
		expect(pp.makePointedTo(300, 0).h2.x).toBe(166.66666666666666);
	});

	it('hasOverlappingHandle', () => {
		const pp = new PathPoint({
			p: { coord: { x: 100, y: 100 } },
			h1: { coord: { x: 0, y: 0 } },
			h2: { coord: { x: 100, y: 100 } },
		});
		expect(pp.hasOverlappingHandle('h2')).toBeTruthy();
	});

	it('rotate', () => {
		const pp = samplePathPoint();
		expect(pp.rotate(90, { x: 0, y: 0 }).p.x).toBe(-134.2070279729728);
	});

	it('resetHandles', () => {
		const pp = samplePathPoint();
		pp.h1.x = 555;
		expect(pp.resetHandles().p.x).toBe(100);
	});

	it('roundAll', () => {
		const pp = samplePathPoint();
		pp.h1.x = 39.9999;
		expect(pp.roundAll(3).h1.x).toBe(40);

		const pp2 = samplePathPoint();
		pp2.h1.x = 39.9999;
		pp2.h1.use = false;
		pp2.roundAll(3);
		pp2.h1.use = true;
		expect(pp2.h1.x).toBe(40);
	});
});
