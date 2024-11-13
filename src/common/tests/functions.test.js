import { describe, expect, it } from 'vitest';
import {
	areEqual,
	calculateAngle,
	calculateDeltaAngle,
	calculateLength,
	caseCamelToKebab,
	caseKebabToCamel,
	clone,
	countItems,
	deg,
	duplicates,
	escapeXMLValues,
	generateNewID,
	getFirstID,
	hasNonValues,
	isInteger,
	isVal,
	json,
	makeCrisp,
	niceAngleToRadians,
	numSan,
	parseNumber,
	rad,
	radiansToNiceAngle,
	remove,
	rotate,
	round,
	snapRadiansToDegrees,
	strSan,
	trim,
	valuesAreClose,
	xyPointsAreClose,
} from '../functions.js';

// --------------------------------------------------------------
// Object functions
// --------------------------------------------------------------
describe('Object Functions', () => {
	// Test for getFirstID function
	it('getFirstID should return the first key in an object', () => {
		const obj = { key1: 'value1', key2: 'value2', key3: 'value3' };
		const firstKey = getFirstID(obj);
		expect(firstKey).toBe('key1');
	});

	it('getFirstID should return false for an empty object', () => {
		const obj = {};
		const firstKey = getFirstID(obj);
		expect(firstKey).toBe(false);
	});

	// Test for generateNewID function
	it('generateNewID should create a unique key with the given prefix', () => {
		const obj = { id1: 'value1', id2: 'value2' };
		const newID = generateNewID(obj, 'id');
		expect(newID).toMatch(/^id\d+$/);
		expect(obj[newID]).toBeUndefined();
	});

	it('generateNewID should create a unique key with the default prefix "id"', () => {
		const obj = { id1: 'value1', id2: 'value2' };
		const newID = generateNewID(obj);
		expect(newID).toMatch(/^id\d+$/);
		expect(obj[newID]).toBeUndefined();
	});

	// Test for countItems function
	it('countItems should return the number of keys in an object', () => {
		const obj = { a: 1, b: 2, c: 3 };
		const count = countItems(obj);
		expect(count).toBe(3);
	});

	it('countItems should return 0 for an empty object', () => {
		const obj = {};
		const count = countItems(obj);
		expect(count).toBe(0);
	});
});

// --------------------------------------------------------------
// Common Functions
// --------------------------------------------------------------
describe('Common Functions', () => {
	// Test for clone function
	it('clone should create a deep copy of an object', () => {
		const obj = { a: 1, b: { c: 2 } };
		const clonedObj = clone(obj);

		expect(clonedObj).toEqual(obj);
		expect(clonedObj).not.toBe(obj); // Ensure it's a deep copy
	});

	// Test for json function
	it('json should stringify an object with pretty formatting by default', () => {
		const obj = { key1: 'value1', key2: { subKey: 'subValue' } };
		const jsonString = json(obj);

		expect(jsonString).toContain('"key1": "value1"');
		expect(jsonString).toContain('"key2": {');
		expect(jsonString).toContain('  "subKey": "subValue"');
	});

	it('json should stringify an object without formatting when raw is true', () => {
		const obj = { key1: 'value1', key2: { subKey: 'subValue' } };
		const jsonString = json(obj, true);

		expect(jsonString).toContain('"key1":"value1"');
		expect(jsonString).toContain('"key2":{"subKey":"subValue"}');
	});

	// Test for areEqual function
	it('areEqual should return true for equal objects', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { a: 1, b: 2 };

		expect(areEqual(obj1, obj2)).toBe(true);
	});

	it('areEqual should return false for different objects', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { a: 1, b: 3 };

		expect(areEqual(obj1, obj2)).toBe(false);
	});

	// Test for xyPointsAreClose function
	it('xyPointsAreClose should return true for close points within the threshold', () => {
		const point1 = { x: 1, y: 1 };
		const point2 = { x: 1.5, y: 1.5 };

		expect(xyPointsAreClose(point1, point2, 1)).toBe(true);
	});

	it('xyPointsAreClose should return false for points outside the threshold', () => {
		const point1 = { x: 1, y: 1 };
		const point2 = { x: 3, y: 3 };

		expect(xyPointsAreClose(point1, point2, 1)).toBe(false);
	});

	// Test for valuesAreClose function
	it('valuesAreClose should return true for close values within the threshold', () => {
		expect(valuesAreClose(1, 1.5, 1)).toBe(true);
	});

	it('valuesAreClose should return false for values outside the threshold', () => {
		expect(valuesAreClose(1, 3, 1)).toBe(false);
	});

	// Test for makeCrisp function
	it('makeCrisp should round a number with +0.5 when dir is true', () => {
		expect(makeCrisp(1.3, true)).toBe(1.5);
	});

	it('makeCrisp should round a number with 0.5 when dir is false', () => {
		expect(makeCrisp(1.3, false)).toBe(0.5);
	});

	// Test for round function
	it('round should round a number with a specified number of decimal places', () => {
		expect(round(1.235, 2)).toBe(1.24);
	});

	// Test for numSan function
	it('numSan should sanitize a number by rounding in certain cases', () => {
		expect(numSan(1.00001)).toBe(1);
		expect(numSan(1.00009)).toBe(1);
		expect(numSan(1.99999)).toBe(2);
		expect(numSan(-0.00001)).toBe(0);
	});

	// Test for isInteger function
	it('isInteger should return true for an integer', () => {
		expect(isInteger(42)).toBe(true);
	});

	it('isInteger should return false for a non-integer', () => {
		expect(isInteger(3.14)).toBe(false);
	});

	// Test for parseNumber function
	it('parseNumber should return a number for all different types', () => {
		expect(parseNumber(123)).toBe(123);
		expect(parseNumber('123')).toBe(123);
		expect(parseNumber(2e3)).toBe(2000);
		expect(parseNumber('2e3')).toBe(2000);
		expect(parseNumber(0x41)).toBe(65);
		expect(parseNumber('0x41')).toBe(65);
		expect(parseNumber(false)).toBe(0);
		expect(parseNumber('')).toBe(0);
		expect(parseNumber()).toBe(0);
	});

	// Test for strSan function
	it('strSan should remove illegal characters from a string', () => {
		const input = "I'm <not> allowed\\ 'here'";
		const sanitized = strSan(input);

		expect(sanitized).toBe('Im not allowed here');
	});

	// Test for trim function
	it('trim should remove whitespace and line breaks from a string', () => {
		const input = '  This is\n\t a test  ';
		const trimmed = trim(input);

		expect(trimmed).toBe('This is a test');
	});

	// Test for remove function
	it('remove should remove all instances of a search term from the base string', () => {
		const base = 'U+123U+456U+4';
		const searchTerm = 'U+';
		const result = remove(base, searchTerm);

		expect(result).toBe('1234564');
	});

	// Test for caseCamelToKebab function
	it('caseCamelToKebab should convert camelCase to kebab-case', () => {
		const camel = 'camelCaseString';
		const kebab = caseCamelToKebab(camel);

		expect(kebab).toBe('camel-case-string');
	});

	// Test for caseKebabToCamel function
	it('caseKebabToCamel should convert kebab-case to camelCase', () => {
		const kebab = 'kebab-case-string';
		const camel = caseKebabToCamel(kebab);

		expect(camel).toBe('kebabCaseString');
	});

	// Test case 1: Test with a string containing special characters
	it('escapeXMLValues - should escape special characters in a string', () => {
		const input = '<div>&"\'</div>';
		const expectedOutput = '&lt;div&gt;&amp;&quot;&apos;&lt;/div&gt;';

		const result = escapeXMLValues(input);

		expect(result).toEqual(expectedOutput);
	});

	// Test case 2: Test with an empty string
	it('escapeXMLValues - should return an empty string when given an empty string', () => {
		const input = '';
		const expectedOutput = '';

		const result = escapeXMLValues(input);

		expect(result).toEqual(expectedOutput);
	});

	// Test case 3: Test with a string without special characters
	it('escapeXMLValues - should return the same string when no special characters are present', () => {
		const input = 'Hello, World!';
		const expectedOutput = 'Hello, World!';

		const result = escapeXMLValues(input);

		expect(result).toEqual(expectedOutput);
	});

	// Test case for handling '""' and "''"
	it('escapeXMLValues - should return an empty string when given \'""\' or "\'\'"', () => {
		expect(escapeXMLValues('""')).toEqual('');
		expect(escapeXMLValues("''")).toEqual('');
	});

	// Test for isVal function
	it('isVal should return true for a value that is not null or undefined', () => {
		expect(isVal(42)).toBe(true);
		expect(isVal('hello')).toBe(true);
		expect(isVal({ a: 1 })).toBe(true);
	});

	it('isVal should return false for null or undefined values', () => {
		expect(isVal(null)).toBe(false);
		expect(isVal(undefined)).toBe(false);
	});

	it('isVal should return false for an empty object', () => {
		expect(isVal({})).toBe(false);
	});

	// Test for hasNonValues function
	it('hasNonValues should return true if an object contains non-value properties', () => {
		const obj = { a: 42, b: null, c: undefined, d: {} };

		expect(hasNonValues(obj)).toBe(true);
	});

	it('hasNonValues should return false if an object contains only value properties', () => {
		const obj = { a: 42, b: 'hello', c: true };

		expect(hasNonValues(obj)).toBe(false);
	});

	// Test for duplicates function
	it('duplicates should return true for duplicate elements in an array', () => {
		const arr = [1, 2, 2, 3, 3, 3];

		expect(arr.filter(duplicates)).toEqual([1, 2, 3]);
	});
});

// --------------------------------------------------------------
// Angle and Rotation
// --------------------------------------------------------------
describe('Angle and Rotation Functions', () => {
	// Test for calculateAngle function
	it('calculateAngle should calculate the angle (in radians) of a handle given a point', () => {
		const handle = { x: 3, y: 3 };
		const point = { x: 0, y: 0 };
		const angle = calculateAngle(handle, point);

		expect(angle).toBeCloseTo(0.7853981633974483); // Approximately 45 degrees in radians
	});

	it('calculateDeltaAngle should calculate the angle (in degrees) between two points and a base point', () => {
		const base = { x: 0, y: 0 };
		const p1 = { x: 3, y: 3 };
		const p2 = { x: 3, y: 0 };
		const angle1 = calculateDeltaAngle(base, p1, p2);

		expect(angle1).toBe(-45);

		const p3 = { x: -3, y: 3 };
		const p4 = { x: -3, y: -3 };
		const angle2 = calculateDeltaAngle(base, p3, p4);

		expect(angle2).toBe(90);
	});

	// Test for calculateLength function
	it('calculateLength should calculate the length of a handle given a point', () => {
		const handle = { x: 3, y: 4 };
		const point = { x: 0, y: 0 };
		const length = calculateLength(handle, point);

		expect(length).toBeCloseTo(5); // Length of a 3-4-5 right triangle
	});

	// Test for rotate function
	it('rotate should rotate a point by a specified angle around a given point', () => {
		const point = { x: 2, y: 0 };
		const angle = Math.PI / 2; // 90 degrees in radians
		const about = { x: 0, y: 0 };

		rotate(point, angle, about);

		expect(point.x).toBeCloseTo(0);
		expect(point.y).toBeCloseTo(2);
	});

	// Test for rad function
	it('rad should convert degrees to radians', () => {
		const degrees = 180;
		const radians = rad(degrees);

		expect(radians).toBeCloseTo(Math.PI);
	});

	// Test for deg function
	it('deg should convert radians to degrees', () => {
		const radians = Math.PI;
		const degrees = deg(radians);

		expect(degrees).toBeCloseTo(180);
	});

	// Test for snapRadiansToDegrees function
	it('snapRadiansToDegrees should snap radians to the nearest degree value', () => {
		const radians = rad(45);
		const snappedRadians = snapRadiansToDegrees(radians);

		expect(snappedRadians).toBeCloseTo(rad(45));
	});

	// Test for radiansToNiceAngle function
	it('radiansToNiceAngle should convert radians to the "Nice Angle" system in degrees', () => {
		const radians = rad(45); // 135 degrees in radians
		const niceAngle = radiansToNiceAngle(radians);

		expect(niceAngle).toBeCloseTo(45); // 45 degrees in "Nice Angle" system
	});

	// Test for niceAngleToRadians function
	it('niceAngleToRadians should convert "Nice Angle" in degrees to radians', () => {
		const radians = niceAngleToRadians(45);
		expect(radians).toBeCloseTo(3.9269908169872414);
	});
});
