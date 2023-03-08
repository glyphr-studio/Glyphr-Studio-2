import { assert, describe, expect, it } from 'vitest';
import { GlyphElement } from '../glyph_element.js';

describe('GlyphElement', () => {
	it('objType get/set', () => {
		const ge = new GlyphElement();
		ge.objType = 'test';
		expect(ge.objType).toBe('test');
	});

	it('cache get/set', () => {
		const ge = new GlyphElement();
		ge.cache = 'test';
		expect(ge.cache).toBe('test');
	});

	it('save', () => {
		const ge = new GlyphElement();
		expect(ge.save(true)).toEqual({ objType: 'GlyphElement' });
	});
});
