import { GlyphElement } from '../glyph_element.js';

describe('GlyphElement', () => {
	it('get/set objType', () => {
		const ge = new GlyphElement();
		ge.objType = 'GlyphElement';
		expect(ge.objType).toBe('GlyphElement');
	});
});