import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import openTypeJS from '../../../lib/opentype.js-september-2024-kern-write/opentype.mjs';
import { ioFont_importFont } from '../font_import.js';

describe('Most Basic Test Fonts', () => {
	it('Import: OTF Most Basic Test', async () => {
		const mostBasicTestOTF = './MostBasicTestRegular.otf';
		const filePath = path.resolve(__dirname, mostBasicTestOTF);
		const fontBuffer = fs.readFileSync(filePath);
		const loadResult = openTypeJS.parse(fontBuffer);
		const result = await ioFont_importFont(loadResult, true);
		expect(result).toBeTruthy();

		// Glyphs
		const capA = result.glyphs['glyph-0x41'];
		expect(capA).toBeTruthy();
		expect(capA.advanceWidth).toEqual(970);
		expect(capA.shapes.length).toEqual(1);
		expect(capA.shapes[0].pathPoints.length).toEqual(4);

		// Metadata
		expect(result.settings.font.style).toEqual('Regular');
	});
	it('Import: TTF Most Basic Test', async () => {
		const mostBasicTestTTF = './MostBasicTest.ttf';
		const filePath = path.resolve(__dirname, mostBasicTestTTF);
		const fontBuffer = fs.readFileSync(filePath);
		const loadResult = openTypeJS.parse(fontBuffer);
		const result = await ioFont_importFont(loadResult, true);
		expect(result).toBeTruthy();

		// Glyphs
		const capT = result.glyphs['glyph-0x54'];
		expect(capT).toBeTruthy();
		expect(capT.advanceWidth).toEqual(1000);
		expect(capT.shapes.length).toEqual(2);
		expect(capT.shapes[0].pathPoints.length).toEqual(4);

		// Metadata
		expect(result.settings.font.style).toEqual('Regular');
	});
	it('Import: WOFF Most Basic Test', async () => {
		const mostBasicTestWOFF = './MostBasicTest.woff';
		const filePath = path.resolve(__dirname, mostBasicTestWOFF);
		const fontBuffer = fs.readFileSync(filePath);
		const loadResult = openTypeJS.parse(fontBuffer);
		const result = await ioFont_importFont(loadResult, true);
		expect(result).toBeTruthy();

		// Glyphs
		const capT = result.glyphs['glyph-0x54'];
		expect(capT).toBeTruthy();
		expect(capT.advanceWidth).toEqual(1000);
		expect(capT.shapes.length).toEqual(2);
		expect(capT.shapes[0].pathPoints.length).toEqual(4);

		// Metadata
		expect(result.settings.font.style).toEqual('Regular');
	});
});

describe('OTF Extended Test Font', () => {
	it('Import: Oblegg Extended Test', async () => {
		const obleggExtendedTestOTF = './ObleggExtendedTestRegular.otf';
		const filePath = path.resolve(__dirname, obleggExtendedTestOTF);
		const fontBuffer = fs.readFileSync(filePath);
		const loadResult = openTypeJS.parse(fontBuffer);
		const result = await ioFont_importFont(loadResult, true);
		expect(result).toBeTruthy();

		// Glyphs
		const capA = result.glyphs['glyph-0x41'];
		expect(capA).toBeTruthy();
		expect(capA.advanceWidth).toEqual(1252);
		expect(capA.shapes.length).toEqual(2);
		expect(capA.shapes[0].pathPoints.length).toEqual(32);

		// Kerns
		const kernOne = result.kerning['kern-1'];
		expect(kernOne.leftGroup[0]).toEqual('0x2F');
		expect(kernOne.rightGroup[0]).toEqual('0x41');
		expect(kernOne.value).toEqual(-219);

		// Metadata
		expect(result.settings.font.style).toEqual('ExtendedTestRegular');
	});
});
