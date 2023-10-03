import { describe, expect, it } from 'vitest';
import { clone, json, xyPointsAreClose } from '../functions.js';

describe('Common Functions', () => {
	it('clone', () => {
		const originalObject = { prop1: 'value1', prop2: { subProp1: 'subValue1' } };
		const clonedObject = clone(originalObject);

		expect(clonedObject).toEqual(originalObject);
		expect(clonedObject).not.toBe(originalObject);
		expect(clonedObject.prop2).not.toBe(originalObject.prop2);
	});

	it('json', () => {
		const testObject = { prop1: 'value1', prop2: 'value2' };
		const jsonString = json(testObject);

		expect(jsonString.replace(/\s+/g, '')).toBe('{"prop1":"value1","prop2":"value2"}');
	});

	it('xyPointsAreClose', () => {
		const c1 = { x: 100, y: 100 };
		const c2 = { x: 99.1, y: 100.9 };
		expect(xyPointsAreClose(c1, c2)).toBeTruthy();
	});
});
