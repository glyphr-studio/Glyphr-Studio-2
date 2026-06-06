import { FontFlux } from 'font-flux-js';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { setCurrentProjectEditor } from '../src/app/main.js';
import { ioFont_exportFont } from '../src/formats_io/otf/font_export.js';
import { ioFont_importFont } from '../src/formats_io/otf/font_import.js';
import { ProjectEditor } from '../src/project_editor/project_editor.js';

/**
 * Round trip test: Import -> Export -> Import
 *
 * This verifies that a binary font survives a full Glyphr Studio import /
 * export cycle without losing data. It compares the ORIGINAL font binary to
 * the ROUND-TRIPPED font binary (both read with FontFlux), which is the most
 * direct measure of "what goes in and what comes out" of Glyphr Studio.
 *
 * Two differences are expected and are NOT data loss:
 *   1. Control characters (code points below U+0020) are imported into a
 *      hidden / disabled character range and are intentionally not re-exported.
 *   2. Contour start points may be rotated by one vertex (a behavior of the
 *      svg-to-bezier import dependency) and a redundant coincident closing
 *      point may be added on export. Neither changes the rendered geometry, so
 *      the test compares the *set* of on-curve points (rotation independent)
 *      and only requires that every original on-curve point is preserved.
 */

/**
 * Collects the set of on-curve points (the segment end points) of a FontFlux
 * glyph's contours, rounded to the nearest unit. Off-curve control points are
 * ignored because contour rotation / quad->cubic conversion can legitimately
 * move them.
 *
 * TrueType glyphs return raw points as `{ x, y, onCurve }`; off-curve points
 * are flagged with `onCurve === false` and must be skipped. Cubic (OTF) glyphs
 * return commands as `{ type, x, y, x1, y1, x2, y2 }` where `x, y` is the
 * on-curve anchor and the control points live in separate `x1..y2` fields, so
 * only the anchors are counted here.
 *
 * @param {Array} contours - FontFlux contours
 * @param {Object} [options]
 * @param {boolean} [options.excludeDegenerate] - When true, on-curve points
 *   that belong to a degenerate single-anchor contour (a zero-area `M x y Z`)
 *   are excluded. Glyphr Studio drops these noise contours on export, which is
 *   correct behavior, so they should not be required to survive the round trip.
 * @returns {Set<string>} - Set of "x,y" on-curve point strings
 */
function onCurvePointSet(contours, { excludeDegenerate = false } = {}) {
	const points = new Set();
	if (!contours) return points;
	contours.forEach((contour) => {
		const onCurve = [];
		contour.forEach((command) => {
			if (command.onCurve === false) return; // TrueType off-curve control point
			if (command.x === undefined || command.y === undefined) return;
			onCurve.push(`${Math.round(command.x)},${Math.round(command.y)}`);
		});
		// A degenerate contour has a single on-curve anchor (zero area).
		if (excludeDegenerate && onCurve.length <= 1) return;
		onCurve.forEach((point) => points.add(point));
	});
	return points;
}

/**
 * Builds a sorted multiset of kerning values from a FontFlux font. Glyph names
 * are intentionally ignored because the source font may store numeric glyph
 * names while Glyphr Studio re-exports proper Unicode glyph names; only the
 * pair values matter for fidelity.
 * @param {Object} font - A FontFlux font
 * @returns {string[]} - Sorted list of kerning values
 */
function kerningValueMultiset(font) {
	return font.kerning.map((pair) => String(pair.value)).sort();
}

/**
 * Runs a font binary through one Glyphr Studio import -> export cycle.
 * @param {ArrayBuffer} arrayBuffer - Source font binary
 * @returns {Promise<ArrayBuffer>} - Exported font binary
 */
async function roundTripThroughGlyphrStudio(arrayBuffer) {
	const project = await ioFont_importFont(FontFlux.open(arrayBuffer), true);
	const editor = new ProjectEditor({ project });
	setCurrentProjectEditor(editor);
	return await ioFont_exportFont(true);
}

describe('Font Round Trip Tests', () => {
	it('Round trip: Oblegg font - import -> export -> import preserves all data', async () => {
		const fontFileName = 'ObleggExtendedTestRegular.otf';
		const fontPath = path.resolve(__dirname, '../src/formats_io/otf/tests', fontFileName);
		expect(fs.existsSync(fontPath), `Font file not found: ${fontPath}`).toBe(true);

		const arrayBuffer = new Uint8Array(fs.readFileSync(fontPath)).buffer;

		const original = FontFlux.open(arrayBuffer);
		const exportedBuffer = await roundTripThroughGlyphrStudio(arrayBuffer);
		expect(exportedBuffer instanceof ArrayBuffer).toBe(true);
		const roundTripped = FontFlux.open(exportedBuffer);

		// --- Font-level metadata ---------------------------------------------
		expect(roundTripped.info.familyName).toEqual(original.info.familyName);
		expect(roundTripped.info.unitsPerEm).toEqual(original.info.unitsPerEm);

		// --- Glyph coverage --------------------------------------------------
		// Map both fonts by Unicode code point.
		const originalByUnicode = new Map();
		original.glyphs.forEach((g) => {
			if (g.unicode !== undefined && g.unicode !== null) originalByUnicode.set(g.unicode, g);
		});
		const roundTripByUnicode = new Map();
		roundTripped.glyphs.forEach((g) => {
			if (g.unicode !== undefined && g.unicode !== null) roundTripByUnicode.set(g.unicode, g);
		});

		// Every original glyph that is NOT a control character must survive the
		// round trip. Control characters (below U+0020, except the .notdef at
		// U+0000) are intentionally dropped on export.
		const droppedNonControl = [];
		for (const [unicode] of originalByUnicode) {
			if (unicode !== 0 && unicode < 0x20) continue; // control char, by design
			if (!roundTripByUnicode.has(unicode)) {
				droppedNonControl.push(`U+${unicode.toString(16).toUpperCase().padStart(4, '0')}`);
			}
		}
		expect(droppedNonControl, 'Non-control glyphs must not be dropped').toEqual([]);

		// --- Geometry and advance widths -------------------------------------
		const geometryLoss = [];
		const advanceMismatch = [];
		for (const [unicode, og] of originalByUnicode) {
			const rg = roundTripByUnicode.get(unicode);
			if (!rg) continue; // skip the by-design dropped control chars

			// Advance widths must be preserved exactly.
			if (og.advanceWidth !== rg.advanceWidth) {
				advanceMismatch.push(
					`U+${unicode.toString(16).toUpperCase().padStart(4, '0')}: ${og.advanceWidth} -> ${
						rg.advanceWidth
					}`
				);
			}

			// Every original on-curve point must be present after the round trip.
			const originalPoints = onCurvePointSet(og.contours);
			const roundTripPoints = onCurvePointSet(rg.contours);
			let missing = 0;
			for (const point of originalPoints) {
				if (!roundTripPoints.has(point)) missing++;
			}
			if (missing > 0) {
				geometryLoss.push(
					`U+${unicode
						.toString(16)
						.toUpperCase()
						.padStart(4, '0')}: ${missing} on-curve points lost`
				);
			}
		}
		expect(advanceMismatch, 'Advance widths must be preserved').toEqual([]);
		expect(geometryLoss, 'On-curve geometry must be preserved').toEqual([]);

		// --- Kerning ---------------------------------------------------------
		// Counts and the multiset of values must match (names may be remapped
		// from numeric to Unicode glyph names, so values are what matter).
		expect(roundTripped.kerning.length).toEqual(original.kerning.length);
		expect(kerningValueMultiset(roundTripped)).toEqual(kerningValueMultiset(original));
	});

	it('Round trip is idempotent - a second cycle changes nothing', async () => {
		const fontFileName = 'ObleggExtendedTestRegular.otf';
		const fontPath = path.resolve(__dirname, '../src/formats_io/otf/tests', fontFileName);
		const arrayBuffer = new Uint8Array(fs.readFileSync(fontPath)).buffer;

		const firstPass = await roundTripThroughGlyphrStudio(arrayBuffer);
		const secondPass = await roundTripThroughGlyphrStudio(firstPass);

		const first = FontFlux.open(firstPass);
		const second = FontFlux.open(secondPass);

		// Glyph count, kerning count, and total on-curve point counts should be
		// stable once the font has been through Glyphr Studio once (no drift).
		const countPoints = (font) => {
			let n = 0;
			font.glyphs.forEach((g) => {
				if (g.contours)
					g.contours.forEach((c) =>
						c.forEach((cmd) => {
							if (cmd.x !== undefined) n++;
						})
					);
			});
			return n;
		};

		expect(second.glyphs.length).toEqual(first.glyphs.length);
		expect(second.kerning.length).toEqual(first.kerning.length);
		expect(countPoints(second)).toEqual(countPoints(first));
	}, 15000);
});

/**
 * Real-world sample fonts kept in `test/sample fonts/`. Each is run through one
 * Glyphr Studio import -> export cycle and compared (via FontFlux) to the
 * original binary. Per-font tolerances capture verified, expected behavior so
 * the suite acts as a regression guard:
 *
 *   - `excludeDegenerate`: the font contains degenerate single-point contours
 *     (zero-area `M x y Z`) that Glyphr Studio correctly drops on export.
 *   - `kerningExact`: require the kerning value multiset to match exactly. Set
 *     false when the font has kern pairs that reference glyphs without a Unicode
 *     code point (e.g. ligatures); Glyphr Studio cannot kern those, so they are
 *     intentionally dropped.
 *   - `allowDiffInRange`: a `[lo, hi]` code-point range within which advance /
 *     geometry differences are tolerated. Used for fonts affected by the
 *     font-flux-js Mac Roman cmap conflation bug (see FONT_FLUX_BUGS.md), whose
 *     damage is confined to 0x80-0xFF.
 *
 * Skipped on purpose (unsupported by Glyphr Studio or out of scope here):
 * color fonts (EmojiOneColor.otf, Multicoloure-SVGinOT.ttf, Reinebow-SVGinOT.ttf,
 * BungeeTint-Regular.ttf, noto-cff2_colr_1-online-test.otf), variable fonts
 * (AdobeVFPrototype-online-test.otf, SegUIVar-test.ttf), font collections
 * (cambria-test.ttc, msgothic-test.ttc), and fira.ttf (~850k kern pairs — too
 * large to round-trip within a reasonable test runtime).
 */
const SAMPLE_FONT_TESTS = [
	{ file: 'mtextra.ttf', family: 'MT Extra', kerningExact: true },
	{ file: 'oblegg.ttf', family: 'Oblegg', kerningExact: true },
	{ file: 'oblegg.otf', family: 'Oblegg', kerningExact: true },
	{ file: 'oblegg.woff', family: 'Oblegg', kerningExact: true },
	{ file: 'noto.ttf', family: 'Noto Sans Symbols 2', kerningExact: true },
	{ file: 'cour-test.ttf', family: 'Courier New', kerningExact: true, excludeDegenerate: true },
	{ file: 'consola-test.ttf', family: 'Consolas', kerningExact: true, excludeDegenerate: true },
	{ file: 'arial-test.ttf', family: 'Arial', kerningExact: false },
	{
		file: 'ARIALN-test.TTF',
		family: 'Arial Narrow',
		kerningExact: false,
		excludeDegenerate: true,
		allowDiffInRange: [0x80, 0xff],
	},
];

describe('Font Round Trip Tests - sample fonts', () => {
	for (const cfg of SAMPLE_FONT_TESTS) {
		it(`Round trip: ${cfg.file} preserves glyph coverage, geometry, advances${
			cfg.kerningExact ? ' and kerning' : ''
		}`, async () => {
			const fontPath = path.resolve(__dirname, 'sample fonts', cfg.file);
			expect(fs.existsSync(fontPath), `Font file not found: ${fontPath}`).toBe(true);
			const arrayBuffer = new Uint8Array(fs.readFileSync(fontPath)).buffer;

			const original = FontFlux.open(arrayBuffer);
			const exportedBuffer = await roundTripThroughGlyphrStudio(arrayBuffer);
			expect(exportedBuffer instanceof ArrayBuffer).toBe(true);
			const roundTripped = FontFlux.open(exportedBuffer);

			// --- Font-level metadata -----------------------------------------
			expect(roundTripped.info.familyName).toEqual(cfg.family);
			expect(roundTripped.info.familyName).toEqual(original.info.familyName);
			expect(roundTripped.info.unitsPerEm).toEqual(original.info.unitsPerEm);

			// Map both fonts by Unicode code point.
			const originalByUnicode = new Map();
			original.glyphs.forEach((g) => {
				if (g.unicode !== undefined && g.unicode !== null) originalByUnicode.set(g.unicode, g);
			});
			const roundTripByUnicode = new Map();
			roundTripped.glyphs.forEach((g) => {
				if (g.unicode !== undefined && g.unicode !== null) roundTripByUnicode.set(g.unicode, g);
			});

			const inAllowedRange = (unicode) =>
				cfg.allowDiffInRange &&
				unicode >= cfg.allowDiffInRange[0] &&
				unicode <= cfg.allowDiffInRange[1];
			const hex = (unicode) => `U+${unicode.toString(16).toUpperCase().padStart(4, '0')}`;

			// --- Glyph coverage ----------------------------------------------
			// Non-control glyphs must survive. Unicode control characters are
			// dropped by design: C0 controls (< U+0020, including U+0000 which
			// OpenType reserves as the unmapped .notdef glyph at index 0), DEL
			// (U+007F), and C1 controls (U+0080-U+009F). Code points in an
			// allowed-diff range are exempt.
			const isControl = (u) => u < 0x20 || u === 0x7f || (u >= 0x80 && u <= 0x9f);
			const droppedNonControl = [];
			for (const [unicode] of originalByUnicode) {
				if (isControl(unicode)) continue;
				if (inAllowedRange(unicode)) continue;
				if (!roundTripByUnicode.has(unicode)) droppedNonControl.push(hex(unicode));
			}
			expect(droppedNonControl, 'Non-control glyphs must not be dropped').toEqual([]);

			// --- Geometry and advance widths ---------------------------------
			const geometryLoss = [];
			const advanceMismatch = [];
			for (const [unicode, og] of originalByUnicode) {
				const rg = roundTripByUnicode.get(unicode);
				if (!rg) continue;
				if (inAllowedRange(unicode)) continue;

				if (og.advanceWidth !== rg.advanceWidth) {
					advanceMismatch.push(`${hex(unicode)}: ${og.advanceWidth} -> ${rg.advanceWidth}`);
				}

				const opts = { excludeDegenerate: cfg.excludeDegenerate };
				const originalPoints = onCurvePointSet(og.contours, opts);
				const roundTripPoints = onCurvePointSet(rg.contours);
				let missing = 0;
				for (const point of originalPoints) {
					if (!roundTripPoints.has(point)) missing++;
				}
				if (missing > 0) geometryLoss.push(`${hex(unicode)}: ${missing} on-curve points lost`);
			}
			expect(advanceMismatch, 'Advance widths must be preserved').toEqual([]);
			expect(geometryLoss, 'On-curve geometry must be preserved').toEqual([]);

			// --- Kerning -----------------------------------------------------
			if (cfg.kerningExact) {
				expect(kerningValueMultiset(roundTripped)).toEqual(kerningValueMultiset(original));
			}
		}, 60000);
	}
});
