import { describe, expect, it } from 'vitest';
import { clone, json } from '../functions.js';

describe('clone', () => {
	it('should create a deep clone of an object', () => {
		const originalObject = { prop1: 'value1', prop2: { subProp1: 'subValue1' } };
		const clonedObject = clone(originalObject);

		expect(clonedObject).toEqual(originalObject);
		expect(clonedObject).not.toBe(originalObject);
		expect(clonedObject.prop2).not.toBe(originalObject.prop2);
	});
});

describe('json', () => {
	it('should stringify an object', () => {
		const testObject = { prop1: 'value1', prop2: 'value2' };
		const jsonString = json(testObject);

		expect(jsonString.replace(/\s+/g, '')).toBe('{"prop1":"value1","prop2":"value2"}');
	});
});
