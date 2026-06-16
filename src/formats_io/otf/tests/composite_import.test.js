import { FontFlux } from 'font-flux-js';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { ioFont_importFont } from '../font_import.js';

function bbox(contours) {
	let xMin = Infinity,
		xMax = -Infinity,
		yMin = Infinity,
		yMax = -Infinity;
	for (const c of contours)
		for (const p of c) {
			xMin = Math.min(xMin, p.x);
			xMax = Math.max(xMax, p.x);
			yMin = Math.min(yMin, p.y);
			yMax = Math.max(yMax, p.y);
		}
	return { xMin, xMax, yMin, yMax, w: xMax - xMin, h: yMax - yMin };
}

describe('Inter composite glyph import (correctness)', () => {
	it('imports i/j with the CORRECT outlines (by-name decomposition)', async () => {
		const filePath = path.resolve(
			__dirname,
			'../../../../test/sample fonts/Inter_18pt-Regular.ttf'
		);
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
		const filePath = path.resolve(
			__dirname,
			'../../../../test/sample fonts/Inter_18pt-Regular.ttf'
		);
		const fontBuffer = fs.readFileSync(filePath);
		const arrayBuffer = new Uint8Array(fontBuffer).buffer;
		const loadResult = FontFlux.open(arrayBuffer);
		const result = await ioFont_importFont(loadResult, true);

		let emptyLig = 0,
			totalLig = 0;
		for (const key of Object.keys(result.ligatures)) {
			totalLig++;
			if ((result.ligatures[key].shapes?.length ?? 0) === 0) emptyLig++;
		}
		console.log(`Ligatures: ${totalLig} total, ${emptyLig} empty`);
		expect(emptyLig).toBe(0);
	}, 30000);

	it('imports composites as re-usable Component Instances (shared roots)', async () => {
		const filePath = path.resolve(
			__dirname,
			'../../../../test/sample fonts/Inter_18pt-Regular.ttf'
		);
		const fontBuffer = fs.readFileSync(filePath);
		const arrayBuffer = new Uint8Array(fontBuffer).buffer;
		const loadResult = FontFlux.open(arrayBuffer);

		const result = await ioFont_importFont(loadResult, true);

		// 'i' should be built from Component Instances (each carries a `link`),
		// not flattened paths.
		const i = result.glyphs['glyph-0x69'];
		expect(i.shapes.length).toBe(2);
		for (const shape of i.shapes) {
			expect(shape.objType).toBe('ComponentInstance');
			expect(typeof shape.link).toBe('string');
			// The linked Component Root must exist in the project.
			expect(result.getItem(shape.link)).toBeTruthy();
		}

		// Re-use: à and á are both built from the same base 'a' glyph, so they
		// must LINK the same Component Root (created once, linked thereafter)
		// rather than each owning a duplicate.
		const aGrave = result.glyphs['glyph-0xE0']; // à
		const aAcute = result.glyphs['glyph-0xE1']; // á
		expect(aGrave?.shapes?.length).toBeGreaterThan(0);
		expect(aAcute?.shapes?.length).toBeGreaterThan(0);

		const graveLinks = new Set(aGrave.shapes.map((s) => s.link));
		const acuteLinks = new Set(aAcute.shapes.map((s) => s.link));
		const sharedRoots = [...graveLinks].filter((link) => acuteLinks.has(link));
		expect(sharedRoots.length).toBeGreaterThan(0);

		// The 'a' base root resolves to a real Component with outlines.
		const sharedRoot = result.getItem(sharedRoots[0]);
		expect(sharedRoot).toBeTruthy();
		expect(sharedRoot.shapes.length).toBeGreaterThan(0);
	}, 30000);
});
