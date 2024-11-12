import { describe, it } from 'vitest';
import { rectPathFromMaxes } from '../../edit_canvas/tools/new_basic_path';
import { Glyph } from '../../project_data/glyph';
import { makeGlyphSVGforExport } from '../cross_item_actions';

describe;

const testGlyph = new Glyph();
testGlyph.shapes = [
	rectPathFromMaxes({ xMin: 0, xMax: 10, yMin: 0, yMax: 10 }),
	rectPathFromMaxes({ xMin: 5, xMax: 15, yMin: 5, yMax: 15 }),
];

describe('makeGlyphSVGforExport', () => {
	it('makeGlyphSVGforExport', () => {
		const re = makeGlyphSVGforExport(testGlyph);
		expect(re)
			.toBe(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,15,15">
	<g>
		<path d="M0,0M0,5 C0,5,0,15,0,15 C0,15,10,15,10,15 C10,15,10,5,10,5 C10,5,0,5,0,5Z M5,0 C5,0,5,10,5,10 C5,10,15,10,15,10 C15,10,15,0,15,0 C15,0,5,0,5,0Z "/>
	</g>
</svg>`);
	});
});
