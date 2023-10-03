import { describe, expect, it } from 'vitest';
import { ControlPoint } from '../control_point.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	constructor
	save
	// print
	get/set x
	get/set y
	get/set coord
	get/set use
	get/set xLock
	get/set yLock
	get/set type
	get isLockable
	isLocked
	lock
	unlock
	rotate
*/
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
		expect(cp.use).toBeFalsy();
	});

	it('isLockable', () => {
		const cp = new ControlPoint();
		expect(cp.isLockable).toBeTruthy();
	});

	it('xLock, isLocked, lock, unlock', () => {
		const cp = new ControlPoint();
		cp.xLock = true;
		expect(cp.xLock).toBeTruthy();
		expect(cp.isLocked('x')).toBeTruthy();
		cp.unlock('x');
		expect(cp.isLocked('x')).toBeFalsy();
		cp.lock('x');
		expect(cp.isLocked('x')).toBeTruthy();
	});

	it('yLock, isLocked, lock, unlock', () => {
		const cp = new ControlPoint();
		cp.yLock = true;
		expect(cp.yLock).toBeTruthy();
		expect(cp.isLocked('y')).toBeTruthy();
		cp.unlock('y');
		expect(cp.isLocked('y')).toBeFalsy();
		cp.lock('y');
		expect(cp.isLocked('y')).toBeTruthy();
	});

	it('type', () => {
		const cp = new ControlPoint({ type: 'h1' });
		expect(cp.type).toEqual('h1');
	});

	it('save', () => {
		const cp = new ControlPoint();
		const savePoint = cp.save();
		expect(savePoint).toEqual({ coord: { x: 0, y: 0 } });
	});

	it('rotate', () => {
		const cp = new ControlPoint({ coord: { x: 100, y: 100 } });
		cp.rotate((Math.PI / 2), { x: 50, y: 50 });
		expect(cp.x).toEqual(0);
		expect(cp.y).toEqual(100);
	});
});
