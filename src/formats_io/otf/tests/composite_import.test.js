import { FontFlux } from 'font-flux-js';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { ioFont_importFont } from '../font_import.js';

function bbox(contours) {
	let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
	for (const c of contours) for (const p of c) {
		xMin = Math.min(xMin, p.x); xMax = Math.max(xMax, p.x);
		yMin = Math.min(yMin, p.y); yMax = Math.max(yMax, p.y);
	}
	return { xMin, xMax, yMin, yMax, w: xMax - xMin, h: yMax - yMin };
}

describe('Inter composite glyph import (correctness)', () => {
	it('imports i/j with the CORRECT outlines (by-name decomposition)', async () => {
		const filePath = path.resolve(__dirname, '../../../../test/sample fonts/Inter_18pt-Regular.ttf');
		const fontBuffer = fs.readFileSync(filePath);
		const arrayBuffer = new Uint8Array(fontBuffer).buffer;
		const loadResult = FontFlux.open(arrayBuffer);

		const truthI = bbox(loadResult.getGlyphContours('i')); // correct
		const wrongI = bbox(loadResult.getGlyphContours(689)); // by-index => hhooksuper (wrong)

		const result = await ioFont_importFont(loadResult, true);
		const i = result.glyphs['glyph-0x69'];
		const j = result.glyphs['glyph-0x6A'];

		expect(i.shapes.length).toBe(2); // dotlessi + tittle
		expect(j.shapes.length).toBeGreaterThan(0);
		expect(i.advanceWidth).toBe(480); // i's advance, not hhooksuper's

		// Imported width must match the correct 'i', and differ from the wrong glyph
		const impW = i.maxes.xMax - i.maxes.xMin;
		expect(Math.abs(impW - truthI.w)).toBeLessThan(2);
		expect(Math.abs(impW - wrongI.w)).toBeGreaterThan(2);
	}, 30000);

	it('all imported ligatures (if any) have outlines', async () => {
		const filePath = path.resolve(__dirname, '../../../../test/sample fonts/Inter_18pt-Regular.ttf');
		const fontBuffer = fs.readFileSync(filePath);
		const arrayBuffer = new Uint8Array(fontBuffer).buffer;
		const loadResult = FontFlux.open(arrayBuffer);
		const result = await ioFont_importFont(loadResult, true);

		let emptyLig = 0, totalLig = 0;
		for (const key of Object.keys(result.ligatures)) {
			totalLig++;
			if ((result.ligatures[key].shapes?.length ?? 0) === 0) emptyLig++;
		}
		console.log(`Ligatures: ${totalLig} total, ${emptyLig} empty`);
		expect(emptyLig).toBe(0);
	}, 30000);
});
