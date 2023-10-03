import { describe, expect, it } from 'vitest';
import { ComponentInstance } from '../component_instance.js';

// --------------------------------------------------------------
// CHECKLIST
// >> depends on root glyph
// --------------------------------------------------------------
/*
	>> get transformedGlyph
	>> makeTransformedGlyph
	>> getCrossLinkedItem
	get/set link
	get/set name
	get/set translateX
	get/set translateY
	get/set resizeWidth
	get/set resizeHeight
	get/set isFlippedEW
	get/set isFlippedNS
	get/set reverseWinding
	get/set rotation
	get/set rotateFirst
	get/set xLock
	get/set yLock
	get/set wLock
	get/set hLock
	get/set ratioLock
	>> get x
	>> get y
	>> get width
	>> get height
	>> get maxes
	>> get center
	>> get svgPathData
	>> updateShapeSize
	updateShapePosition
	flipEW
	flipNS
	rotate
*/

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

	it('get/set resizeWidth', () => {
		const ci = sampleComponentInstance();
		ci.resizeWidth = 789;
		expect(ci.resizeWidth).toBe(789);
	});

	it('get/set resizeHeight', () => {
		const ci = sampleComponentInstance();
		ci.resizeHeight = 246;
		expect(ci.resizeHeight).toBe(246);
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

	it('updateShapePosition', () => {
		const ci = sampleComponentInstance();
		ci.updateShapePosition(100, 100);
		expect(ci.translateX).toBe(100);
		expect(ci.translateY).toBe(100);
	});

	it('flipEW', () => {
		const ci = sampleComponentInstance();
		ci.flipEW();
		expect(ci.isFlippedEW).toBeTruthy();
	});

	it('flipNS', () => {
		const ci = sampleComponentInstance();
		ci.flipNS();
		expect(ci.isFlippedNS).toBeTruthy();
	});

	it('rotate', () => {
		const ci = sampleComponentInstance();
		ci.rotate(Math.PI / 2);
		expect(ci.rotation).toBe(-90);
	});
});
