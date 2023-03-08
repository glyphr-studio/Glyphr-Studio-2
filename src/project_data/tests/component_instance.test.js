import { assert, describe, expect, it } from 'vitest';
import { ComponentInstance } from '../component_instance.js';

/**
 * Create a sample Component Instance
 * @returns {ComponentInstance}
 */
function sampleComponentInstance() {
	return new ComponentInstance();
}

describe('ComponentInstance', () => {
	it('get/set link', () => {
		const ci = sampleComponentInstance();
		ci.link = '0x1234';
		expect(ci.link).toBe('0x1234');
	});

	it('get/set name', () => {
		const ci = sampleComponentInstance();
		ci.name = 'New Name';
		expect(ci.name).toBe('New Name');
	});

	it('get/set translateX', () => {
		const ci = sampleComponentInstance();
		ci.translateX = 123;
		expect(ci.translateX).toBe(123);
	});

	it('get/set translateY', () => {
		const ci = sampleComponentInstance();
		ci.translateY = 456;
		expect(ci.translateY).toBe(456);
	});

	it('get/set scaleW', () => {
		const ci = sampleComponentInstance();
		ci.scaleW = 789;
		expect(ci.scaleW).toBe(789);
	});

	it('get/set scaleH', () => {
		const ci = sampleComponentInstance();
		ci.scaleH = 246;
		expect(ci.scaleH).toBe(246);
	});

	it('get/set isFlippedNS', () => {
		const ci = sampleComponentInstance();
		ci.isFlippedNS = 123;
		expect(ci.isFlippedNS).toBe(true);
	});

	it('get/set isFlippedEW', () => {
		const ci = sampleComponentInstance();
		ci.isFlippedEW = 123;
		expect(ci.isFlippedEW).toBe(true);
	});

	it('get/set reverseWinding', () => {
		const ci = sampleComponentInstance();
		ci.reverseWinding = true;
		expect(ci.reverseWinding).toBe(true);
	});

	it('get/set rotation', () => {
		const ci = sampleComponentInstance();
		ci.rotation = 90;
		expect(ci.rotation).toBe(90);
	});

	it('get/set rotateFirst', () => {
		const ci = sampleComponentInstance();
		ci.rotateFirst = false;
		expect(ci.rotateFirst).toBe(false);
	});

	it('get/set xLock', () => {
		const ci = sampleComponentInstance();
		ci.xLock = true;
		expect(ci.xLock).toBe(true);
	});

	it('get/set yLock', () => {
		const ci = sampleComponentInstance();
		ci.yLock = true;
		expect(ci.yLock).toBe(true);
	});

	it('get/set wLock', () => {
		const ci = sampleComponentInstance();
		ci.wLock = true;
		expect(ci.wLock).toBe(true);
	});

	it('get/set hLock', () => {
		const ci = sampleComponentInstance();
		ci.hLock = true;
		expect(ci.hLock).toBe(true);
	});

	it('get/set ratioLock', () => {
		const ci = sampleComponentInstance();
		ci.ratioLock = true;
		expect(ci.ratioLock).toBe(true);
	});

	// TODO refactor with component stuff
	/*
	it('get/set x', () => {
		let ci = sampleComponentInstance();
		ci.x = 600;
		expect(ci.x).toBe(600);
	});

	it('get/set y', () => {
		let ci = sampleComponentInstance();
		ci.y = 600;
		expect(ci.y).toBe(600);
	});

	it('get/set width', () => {
		let ci = sampleComponentInstance();
		ci.width = 500;
		expect(ci.width).toBe(500);
	});

	it('get/set height', () => {
		let ci = sampleComponentInstance();
		ci.height = 500;
		expect(ci.height).toBe(500);
	});
	*/
});
