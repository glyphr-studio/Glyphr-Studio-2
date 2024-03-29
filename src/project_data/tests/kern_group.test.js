import { describe, expect, it } from 'vitest';
import { KernGroup } from '../kern_group.js';

/**
 * Sample kern for testing
 * @returns {KernGroup}
 */
function sampleKernGroup() {
	return new KernGroup({
		leftGroup: ['0x41', '0x61'],
		rightGroup: ['0x56', '0x76'],
		value: 123,
	});
}

// --------------------------------------------------------------
// Checklist
// --------------------------------------------------------------
/*
	save
	print
	get/set leftGroup
	get/set rightGroup
	get/set value
	get name
	get leftGroupAsString
	get rightGroupAsString
*/

describe('KernGroup', () => {
	it('save', () => {
		const saveData = sampleKernGroup().save();
		expect(saveData).toEqual({
			leftGroup: ['0x41', '0x61'],
			rightGroup: ['0x56', '0x76'],
			value: 123,
		});
	});

	it('print', () => {
		const printData = sampleKernGroup().print();
		expect(printData.replace(/\n/g, '')).toEqual(
			`{KernGroup   leftGroup: ["0x41","0x61"]  rightGroup: ["0x56","0x76"]  value: 123}/KernGroup`
		);
	});

	it('leftGroup', () => {
		expect(sampleKernGroup().leftGroup[0]).toBe('0x41');
	});

	it('rightGroup', () => {
		expect(sampleKernGroup().rightGroup[1]).toBe('0x76');
	});

	it('value', () => {
		const kern = sampleKernGroup();
		expect(kern.value).toBe(123);
		kern.value = 456;
		expect(kern.value).toBe(456);
	});

	it('leftGroupAsString', () => {
		expect(sampleKernGroup().leftGroupAsString).toBe('Aa');
	});

	it('rightGroupAsString', () => {
		expect(sampleKernGroup().rightGroupAsString).toBe('Vv');
	});

	it('name', () => {
		expect(sampleKernGroup().name).toBe('Aa | Vv');
	});
});
