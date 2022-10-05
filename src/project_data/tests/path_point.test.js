import { PathPoint } from '../path_point.js';

const testPathPoint = {
	p: { coord: { x: 100, y: 100 } },
	h1: { coord: { x: 0, y: 0 } },
	h2: { coord: { x: 200, y: 200 } },
	type: 'corner',
	q: false,
	parent: false,
};

/**
 * default sample PathPoint
 * @returns {PathPoint}
 */
function samplePathPoint() {
	return new PathPoint(testPathPoint);
}

describe('PathPoint', () => {
	it('Constructor - p.x', () => {
		const pp = samplePathPoint();
		expect(pp.p.x).toBe(100);
	});

	it('Constructor - type', () => {
		const pp = samplePathPoint();
		expect(pp.type).toBe('corner');
	});

	it('save', () => {
		const pp = samplePathPoint();
		expect(pp.save()).toEqual(
			JSON.parse(
				'{"p":{"coord":{"x":100,"y":100}},"type":"corner","h1":{"coord":{"x":0,"y":0}},"h2":{"coord":{"x":200,"y":200}}}'
			)
		);
	});

	it('ControlPoint: length', () => {
		const pp = samplePathPoint();
		expect(pp.h1.length).toBe(141.4213562373095);
	});

	it('ControlPoint: angle', () => {
		const pp = samplePathPoint();
		pp.h1.y = 100;
		expect(pp.h1.angle).toBe(3.141592653589793);
	});

	it('ControlPoint: niceAngle', () => {
		const pp = samplePathPoint();
		pp.h1.y = 100;
		expect(pp.h1.niceAngle).toBe(270);
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

	it('resolvePointType', () => {
		const pp = samplePathPoint();
		expect(pp.resolvePointType()).toBe('symmetric');
	});

	it('makePointedTo', () => {
		const pp = samplePathPoint();
		expect(pp.makePointedTo(300, 0).h2.x).toBe(166.66666666666666);
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
	});
});
