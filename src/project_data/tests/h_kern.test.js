import { assert, describe, expect, it } from 'vitest';
import { HKern } from '../h_kern.js';

/**
 * Sample kern for testing
 * @returns {HKern}
 */
function sampleHKern() {
	return new HKern({
		leftGroup: ['0x0041', '0x0061'],
		rightGroup: ['0x0056', '0x0076'],
		value: 123,
	});
}

describe('HKern', () => {
	it('leftGroup', () => {
		expect(sampleHKern().leftGroup[0]).toBe('0x0041');
	});

	it('rightGroup', () => {
		expect(sampleHKern().rightGroup[1]).toBe('0x0076');
	});

	it('value', () => {
		expect(sampleHKern().value).toBe(123);
	});

	it('name', () => {
		expect(sampleHKern().name).toBe('Aa | Vv');
	});
});
