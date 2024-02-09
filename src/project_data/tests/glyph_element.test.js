import { describe, expect, it } from 'vitest';
import { GlyphElement, makeRandomID } from '../glyph_element.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	changed
	objType
	displayType
	cache
	isLockable
	isLocked
	// lock - these are overwritten by classes that extend Glyph Element
	// unlock - these are overwritten by classes that extend Glyph Element
	save
	toString
	print
*/

describe('GlyphElement', () => {
	it('constructor', () => {
		const glyphElement = new GlyphElement();
		// expect(glyphElement.ident).toBe('');
		expect(glyphElement.objType).toBe('GlyphElement');
		expect(glyphElement.displayType).toBe('GlyphElement');
		expect(glyphElement.cache).toEqual({});
		expect(glyphElement.isLockable).toBe(false);
	});

	it('objType', () => {
		const glyphElement = new GlyphElement();
		glyphElement.objType = 'TestType';

		expect(glyphElement.objType).toBe('TestType');
	});

	it('save', () => {
		const glyphElement = new GlyphElement();
		glyphElement.id = 'testID';
		const savedData = glyphElement.save();

		expect(savedData.id).toBe('testID');
		expect(savedData.objType).toBeUndefined();
		expect(savedData.cache).toBeUndefined();

		const savedData2 = glyphElement.save(true);
		expect(savedData2.objType).toBe('GlyphElement');
	});

	it('cache and changed', () => {
		const glyphElement = new GlyphElement();
		glyphElement.cache = { foo: 'bar' };
		glyphElement.changed();
		expect(glyphElement.cache.foo).toBeUndefined();
	});

	it('clone', () => {
		const glyphElement = new GlyphElement();
		const clonedElement = glyphElement.clone();

		expect(clonedElement).toEqual(glyphElement.save(true));
		expect(clonedElement).not.toBe(glyphElement);
	});

	it('toString', () => {
		const glyphElement = new GlyphElement();
		glyphElement.id = 'testID';
		const jsonString = glyphElement.toString();

		expect(jsonString.replace(/\s+/g, '')).toBe(`{"id":"testID"}`);
	});

	it('print', () => {
		const glyphElement = new GlyphElement();
		glyphElement.id = 'testID';
		const formattedString = glyphElement.print();

		expect(formattedString).toBe('{GlyphElement \n  id: testID\n}/GlyphElement ');
	});
});
describe('Random ID', () => {
	it('makeRandomID', () => {
		const randomID = makeRandomID();

		expect(randomID).toMatch(/[💖🦧🐆✅🐋😈🦑]{3}/);
	});
});
