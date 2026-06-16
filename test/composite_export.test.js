import { FontFlux } from 'font-flux-js';
import { describe, expect, it } from 'vitest';
import { setCurrentProjectEditor } from '../src/app/main.js';
import { ioFont_exportFont } from '../src/formats_io/otf/font_export.js';
import { importGlyphrProjectFromText } from '../src/project_editor/import_project.js';
import { ProjectEditor } from '../src/project_editor/project_editor.js';

/**
 * Build a minimal v2 project:
 *   - comp-0: a 200x200 square component
 *   - glyph-0x69 (i): two pure-translation instances of comp-0 (at x=0 and x=400)
 */
function makeComponentProjectText() {
	const square = {
		name: 'Square',
		pathPoints: [
			{ p: { coord: { x: 100, y: 100 } } },
			{ p: { coord: { x: 300, y: 100 } } },
			{ p: { coord: { x: 300, y: 300 } } },
			{ p: { coord: { x: 100, y: 300 } } },
		],
	};
	return JSON.stringify({
		settings: {
			project: {
				name: 'Composite Test',
				latestVersion: '2.5.0',
				initialVersion: '2.5.0',
				id: 'g2_COMPTEST',
				exportComponentsAsComposites: true,
				characterRanges: [{ name: 'Basic Latin', begin: '0x20', end: '0x7F' }],
			},
			font: { family: 'CompTest', upm: 1000, ascent: 800, descent: -200 },
			app: { exportUneditedItems: true },
		},
		glyphs: {
			'glyph-0x69': {
				id: 'glyph-0x69',
				advanceWidth: 600,
				shapes: [
					{ link: 'comp-0', translateX: 0, translateY: 0 },
					{ link: 'comp-0', translateX: 400, translateY: 0 },
				],
			},
		},
		components: {
			'comp-0': { id: 'comp-0', name: 'Square', advanceWidth: 200, shapes: [square] },
		},
		ligatures: {},
		kerning: {},
	});
}

function onCurvePoints(contours) {
	const set = new Set();
	(contours || []).forEach((contour) => {
		contour.forEach((cmd) => {
			if (cmd.onCurve === false) return;
			if (cmd.x === undefined || cmd.y === undefined) return;
			set.add(`${Math.round(cmd.x)},${Math.round(cmd.y)}`);
		});
	});
	return set;
}

function exportAndOpen(project) {
	const editor = new ProjectEditor({ project });
	setCurrentProjectEditor(editor);
	return ioFont_exportFont('ttf', true).then((buf) => FontFlux.open(buf));
}

function findGlyph(font, unicode) {
	let found = null;
	font.glyphs.forEach((g) => {
		if (g.unicode === unicode) found = g;
	});
	return found;
}

describe('Composite Glyph Export', () => {
	it('exports component-built glyphs as TrueType composites when setting is ON', async () => {
		const project = importGlyphrProjectFromText(makeComponentProjectText());
		expect(project.settings.project.exportComponentsAsComposites).toBe(true);

		const font = await exportAndOpen(project);
		const i = findGlyph(font, 0x69);
		expect(i, 'glyph i must be exported').toBeTruthy();
		expect(Array.isArray(i.components), 'glyph i should be a composite').toBe(true);
		expect(i.components.length).toBe(2);

		// Decomposed geometry: two squares, second offset by +400 in x.
		const dec = font.getGlyphContours('uni0069');
		expect(dec.length).toBe(2);
		const points = onCurvePoints(dec);
		expect(points.has('100,100')).toBe(true); // first square
		expect(points.has('500,100')).toBe(true); // second square (100 + 400)
	});

	it('flattens component-built glyphs to outlines when setting is OFF', async () => {
		const project = importGlyphrProjectFromText(makeComponentProjectText());
		project.settings.project.exportComponentsAsComposites = false;

		const font = await exportAndOpen(project);
		const i = findGlyph(font, 0x69);
		expect(i, 'glyph i must be exported').toBeTruthy();
		expect(i.components === undefined || i.components === null).toBe(true);
		expect(Array.isArray(i.contours)).toBe(true);

		// Same rendered geometry as the composite version.
		const points = onCurvePoints(i.contours);
		expect(points.has('100,100')).toBe(true);
		expect(points.has('500,100')).toBe(true);
	});

	it('always flattens for OTF/CFF even when setting is ON', async () => {
		const project = importGlyphrProjectFromText(makeComponentProjectText());
		expect(project.settings.project.exportComponentsAsComposites).toBe(true);
		const editor = new ProjectEditor({ project });
		setCurrentProjectEditor(editor);
		// OTF/CFF cannot store composites, so the setting is ignored and the
		// glyph is flattened to outlines regardless.
		const buf = await ioFont_exportFont('otf', true);
		const font = FontFlux.open(buf);
		const i = findGlyph(font, 0x69);
		expect(i).toBeTruthy();
		expect(i.components === undefined || i.components === null).toBe(true);
		// Geometry still renders correctly after flattening.
		const points = onCurvePoints(i.contours);
		expect(points.has('100,100')).toBe(true);
		expect(points.has('500,100')).toBe(true);
	});
});
