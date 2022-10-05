import { ControlPoint } from '../control_point.js';

describe('ControlPoint', () => {
	it('Constructor - x', () => {
		expect(new ControlPoint().x).toBe(0);
	});

	it('x/y getter/setter', () => {
		const cp = new ControlPoint();
		cp.x = 500;
		cp.y = 500;
		expect(cp.x === 500 && cp.y === 500).toBeTruthy();
	});

	it('coord getter/setter', () => {
		const cp = new ControlPoint();
		cp.coord = { x: 500, y: 500 };
		expect(cp.coord.x === 500 && cp.coord.y === 500).toBeTruthy();
	});

	it('use', () => {
		const cp = new ControlPoint();
		cp.use = false;
		expect(cp.use).toBeFalse();
	});

	it('xLock', () => {
		const cp = new ControlPoint();
		cp.xLock = true;
		expect(cp.xLock).toBeTruthy();
	});

	it('yLock', () => {
		const cp = new ControlPoint();
		cp.yLock = true;
		expect(cp.yLock).toBeTruthy();
	});

	it('save', () => {
		const cp = new ControlPoint();
		const savePoint = cp.save();
		expect(savePoint).toEqual({ coord: { x: 0, y: 0 } });
	});
});
