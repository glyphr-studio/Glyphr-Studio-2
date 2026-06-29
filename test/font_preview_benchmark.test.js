import { FontFlux } from 'font-flux-js';
import { describe, expect, it } from 'vitest';
import { FontPreviewBuilder } from '../src/controls/font-preview/font_preview.js';
import { importGlyphrProjectFromText } from '../src/project_editor/import_project.js';

function makePreviewProjectText() {
	return JSON.stringify({
		settings: {
			project: {
				name: 'Preview Benchmark',
				latestVersion: '2.5.0',
				initialVersion: '2.5.0',
				id: 'preview-benchmark',
				exportFormat: 'otf',
				characterRanges: [{ enabled: true, name: 'Basic Latin', begin: '0x20', end: '0x7F' }],
			},
			app: {
				exportLigatures: true,
				exportKerning: false,
				exportUneditedItems: true,
				previewText: false,
			},
			font: {
				family: 'PreviewBenchmark',
				style: 'Regular',
				version: '1.0',
				upm: 1000,
				ascent: 800,
				descent: -200,
				capHeight: 700,
				xHeight: 500,
				lineGap: 0,
				weight: 400,
				italicAngle: 0,
			},
		},
		glyphs: {
			'glyph-0x20': {
				id: 'glyph-0x20',
				advanceWidth: 300,
				leftSideBearing: 0,
				shapes: [],
			},
			'glyph-0x61': {
				id: 'glyph-0x61',
				advanceWidth: 500,
				leftSideBearing: 0,
				shapes: [
					{
						objType: 'Path',
						pathPoints: [
							{ p: { coord: { x: 50, y: 0 } } },
							{ p: { coord: { x: 450, y: 0 } } },
							{ p: { coord: { x: 450, y: 700 } } },
							{ p: { coord: { x: 50, y: 700 } } },
						],
					},
				],
			},
			'glyph-0x62': {
				id: 'glyph-0x62',
				advanceWidth: 520,
				leftSideBearing: 0,
				shapes: [
					{
						objType: 'Path',
						pathPoints: [
							{ p: { coord: { x: 50, y: 0 } } },
							{ p: { coord: { x: 350, y: 0 } } },
							{ p: { coord: { x: 350, y: 700 } } },
							{ p: { coord: { x: 50, y: 700 } } },
						],
					},
				],
			},
			'glyph-0x63': {
				id: 'glyph-0x63',
				advanceWidth: 480,
				leftSideBearing: 0,
				shapes: [
					{
						objType: 'Path',
						pathPoints: [
							{ p: { coord: { x: 450, y: 0 } } },
							{ p: { coord: { x: 50, y: 0 } } },
							{ p: { coord: { x: 50, y: 700 } } },
							{ p: { coord: { x: 450, y: 700 } } },
						],
					},
				],
			},
			'glyph-0x64': {
				id: 'glyph-0x64',
				advanceWidth: 500,
				leftSideBearing: 0,
				shapes: [
					{
						objType: 'Path',
						pathPoints: [
							{ p: { coord: { x: 50, y: 0 } } },
							{ p: { coord: { x: 450, y: 0 } } },
							{ p: { coord: { x: 450, y: 700 } } },
							{ p: { coord: { x: 50, y: 700 } } },
						],
					},
				],
			},
		},
		ligatures: {
			'liga-0x61-0x62': {
				id: 'liga-0x61-0x62',
				chars: 'ab',
				gsub: ['0x61', '0x62'],
				advanceWidth: 980,
				leftSideBearing: 0,
				shapes: [
					{
						objType: 'Path',
						pathPoints: [
							{ p: { coord: { x: 0, y: 0 } } },
							{ p: { coord: { x: 980, y: 0 } } },
							{ p: { coord: { x: 980, y: 700 } } },
							{ p: { coord: { x: 0, y: 700 } } },
						],
					},
				],
			},
		},
		components: {},
		kerning: {},
	});
}

function makeParagraph(wordCount) {
	const words = ['ab', 'ac', 'ad', 'bc', 'cd', 'da'];
	const result = [];
	for (let i = 0; i < wordCount; i += 1) {
		result.push(words[i % words.length]);
	}
	return result.join(' ');
}

function measure(fn) {
	const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
	const value = fn();
	const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
	return { value, duration: end - start };
}

describe('FontPreviewBuilder Benchmarks', () => {
	it('builds a valid preview font buffer for a short string', () => {
		const project = importGlyphrProjectFromText(makePreviewProjectText());
		const builder = new FontPreviewBuilder(project, { flavor: 'otf' });
		const buffer = builder.buildFontBuffer('ab');

		expect(buffer).toBeInstanceOf(ArrayBuffer);
		expect(buffer.byteLength).toBeGreaterThan(0);

		const font = FontFlux.open(buffer);
		expect(font.info.familyName).toBe('PreviewBenchmark');
		expect(font.glyphs.some((glyph) => glyph.unicode === 0x61)).toBe(true);
		expect(font.glyphs.some((glyph) => glyph.unicode === 0x62)).toBe(true);
		expect(font.glyphs.some((glyph) => glyph.name?.startsWith('lig'))).toBe(true);
	});

	it('builds preview fonts for paragraph text and preserves ligature substitutions', () => {
		const project = importGlyphrProjectFromText(makePreviewProjectText());
		const builder = new FontPreviewBuilder(project, { flavor: 'otf' });
		const buffer = builder.buildFontBuffer(makeParagraph(50));
		const font = FontFlux.open(buffer);

		expect(buffer.byteLength).toBeGreaterThan(0);
		expect(font.glyphs.some((glyph) => glyph.name === 'lig.0061.0062')).toBe(true);
	});

	it('measures preview font build time for short, paragraph, and long text', () => {
		const project = importGlyphrProjectFromText(makePreviewProjectText());
		const builder = new FontPreviewBuilder(project, { flavor: 'otf' });

		const short = measure(() => builder.buildFontBuffer('ab'));
		const paragraph = measure(() => builder.buildFontBuffer(makeParagraph(100)));
		const long = measure(() => builder.buildFontBuffer(makeParagraph(1000)));

		console.info('FontPreviewBuilder benchmark:', {
			short: `${short.duration.toFixed(1)}ms`,
			paragraph: `${paragraph.duration.toFixed(1)}ms`,
			long: `${long.duration.toFixed(1)}ms`,
		});

		expect(short.duration).toBeGreaterThan(0);
		expect(paragraph.duration).toBeGreaterThan(short.duration);
		expect(long.duration).toBeGreaterThan(paragraph.duration);
		expect(long.value.byteLength).toBeGreaterThan(0);
	});
});
