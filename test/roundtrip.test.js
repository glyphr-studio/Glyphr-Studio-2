import { FontFlux } from 'font-flux-js';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { setCurrentProjectEditor } from '../src/app/main.js';
import { ioFont_exportFont, shouldExportItem } from '../src/formats_io/otf/font_export.js';
import { ioFont_importFont } from '../src/formats_io/otf/font_import.js';
import { importGlyphrProjectFromText } from '../src/project_editor/import_project.js';
import { ProjectEditor } from '../src/project_editor/project_editor.js';
import { projects as sampleProjects } from '../src/samples/samples.js';

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
 *
 * FontFlux 2.6.0 stores kerning in two places: flat individual pairs on
 * `font.kerning` (GPOS PairPos format 1 / legacy `kern`) and class-based
 * kerning on `font.data.kerningClasses` (GPOS PairPos format 2). A single
 * class pair `{ left: '@L', right: '@R', value }` expands to
 * `members(L) x members(R)` individual pairs, so both sources are expanded to
 * a flat list of values here. This keeps the comparison partition-independent:
 * whether a given pair is represented as a flat pair or inside a class subtable
 * is an internal encoding detail that may legitimately change across a round
 * trip.
 *
 * @param {Object} font - A FontFlux font
 * @returns {string[]} - Sorted list of expanded kerning values
 */
function kerningValueMultiset(font) {
	return expandKerningValues(font).sort();
}

/**
 * Resolves a kern class pair reference (`'@className'`) to its member glyph
 * names, or returns the single glyph name when the reference is not a class.
 * @param {string} ref - Pair side reference (e.g. '@kern_L0' or a glyph name)
 * @param {Object} classMap - Map of className -> [member glyph names]
 * @returns {string[]} - Member glyph names
 */
function resolveKernClassMembers(ref, classMap) {
	if (typeof ref === 'string' && ref.startsWith('@')) {
		return classMap[ref.slice(1)] || [];
	}
	return [ref];
}

/**
 * Expands every kerning pair a FontFlux font represents - both flat
 * `font.kerning` pairs and class-based `font.data.kerningClasses` pairs - into
 * a flat array of stringified values (one entry per resolved individual pair).
 * @param {Object} font - A FontFlux font
 * @returns {string[]} - Unsorted list of expanded kerning values
 */
function expandKerningValues(font) {
	const values = [];
	(font.kerning || []).forEach((pair) => values.push(String(pair.value)));
	const classEntries = font.data && font.data.kerningClasses;
	if (Array.isArray(classEntries)) {
		classEntries.forEach((entry) => {
			const leftClasses = entry.leftClasses || {};
			const rightClasses = entry.rightClasses || {};
			(entry.pairs || []).forEach((pair) => {
				const leftMembers = resolveKernClassMembers(pair.left, leftClasses);
				const rightMembers = resolveKernClassMembers(pair.right, rightClasses);
				const count = leftMembers.length * rightMembers.length;
				for (let i = 0; i < count; i++) values.push(String(pair.value));
			});
		});
	}
	return values;
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
	return await ioFont_exportFont('otf', true);
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
		// The expanded multiset of kerning values must match (names may be
		// remapped from numeric to Unicode glyph names, so values are what
		// matter). FontFlux may encode a given pair as either a flat pair or a
		// class subtable, and that partition can legitimately change across a
		// round trip, so compare the fully expanded value multisets rather than
		// the raw `font.kerning` length.
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
 *     geometry differences are tolerated. Previously needed for the
 *     font-flux-js Mac Roman cmap conflation bug (confined to 0x80-0xFF), which
 *     was fixed in font-flux-js 2.4.23 — no font currently needs it, but the
 *     mechanism is retained as a guard for future regressions.
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

/**
 * Reads a sample project file (`.gs2` / `.json`) from `src/samples/` as text.
 * @param {string} file - File name within `src/samples/`
 * @returns {string} - Raw file contents
 */
function loadSampleProjectText(file) {
	return fs.readFileSync(path.resolve(__dirname, '../src/samples', file), 'utf8');
}

/**
 * Loads a Glyphr Studio project (modern `.gs2`/`.json` text or a legacy v1
 * project object), runs it through one OTF export, and re-reads the result with
 * FontFlux. This exercises exactly the path a user hits when they open a `.gs2`
 * file and export a font.
 * @param {string|Object} rawProjectData - Raw project text/object
 * @returns {Promise<{project: Object, font: Object}>} - Loaded project and the
 *   re-imported FontFlux font
 */
async function exportSampleProjectAndReimport(rawProjectData) {
	// importGlyphrProjectFromText reads the current editor for system-guide
	// visibility, so a placeholder editor must exist before loading.
	setCurrentProjectEditor(new ProjectEditor());
	const project = importGlyphrProjectFromText(rawProjectData);
	const editor = new ProjectEditor({ project });
	setCurrentProjectEditor(editor);
	const exportedBuffer = await ioFont_exportFont('otf', true);
	return { project, font: FontFlux.open(exportedBuffer) };
}

/**
 * Mirrors the export's glyph-selection logic to find which code points a
 * project intends to export. Walks every enabled character range, dedupes, and
 * applies `shouldExportItem`. Returns both the full exportable set and the
 * subset that actually carries outlines (`shapes.length > 0`) - the latter are
 * the glyphs that must survive export, since they represent real geometry.
 * @param {Object} project - A GlyphrStudioProject
 * @returns {{all: Set<number>, withShapes: Set<number>}} - Exportable code points
 */
function projectExportableCodePoints(project) {
	const all = new Set();
	const withShapes = new Set();
	const seen = new Set();
	project.settings.project.characterRanges.forEach((range) => {
		if (!range.enabled) return;
		range.getMemberIDs().forEach((hexID) => {
			if (seen.has(hexID)) return;
			seen.add(hexID);
			const item = project.getItem(`glyph-${hexID}`);
			if (item && shouldExportItem(item)) {
				const codePoint = parseInt(hexID);
				all.add(codePoint);
				if (item.shapes && item.shapes.length > 0) withShapes.add(codePoint);
			}
		});
	});
	return { all, withShapes };
}

/**
 * Glyphr Studio native sample projects kept in `src/samples/`. Each is loaded
 * (modern `.gs2`/`.json` JSON, or a legacy v1 project object migrated on import)
 * and run through one OTF export, then re-read with FontFlux. This is the
 * project-side counterpart to the binary round-trip tests above and guards the
 * same export path (`font_export.js` / `gpos.js`) against regressions such as
 * dropped glyphs or lost kerning.
 *
 *   - `.gs2` / `.json`: current v2 schema, loaded directly as JSON text.
 *   - `.js`: legacy v1 schema objects (`projectsettings`, `versionnum`, ...),
 *     migrated to v2 by `importGlyphrProjectFromText` on load.
 */
const SAMPLE_PROJECT_TESTS = [
	{ name: 'oblegg.gs2', getData: () => loadSampleProjectText('oblegg.gs2') },
	{ name: 'boolean_tests.gs2', getData: () => loadSampleProjectText('boolean_tests.gs2') },
	{
		name: 'simpleExampleProject.json',
		getData: () => loadSampleProjectText('simpleExampleProject.json'),
	},
	{ name: 'modegg.js (v1)', getData: () => sampleProjects.modegg },
	{ name: 'california_gothic.js (v1)', getData: () => sampleProjects.californiaGothic },
	{ name: 'merriweather_sans.js (v1)', getData: () => sampleProjects.merriweatherSans },
];

describe('Project Round Trip Tests - sample projects (.gs2)', () => {
	for (const cfg of SAMPLE_PROJECT_TESTS) {
		it(`Round trip: ${cfg.name} - load -> export -> re-import preserves glyphs and kerning`, async () => {
			const { project, font } = await exportSampleProjectAndReimport(cfg.getData());
			const { all, withShapes } = projectExportableCodePoints(project);

			// Map the re-imported font by Unicode code point.
			const fontByUnicode = new Map();
			font.glyphs.forEach((g) => {
				if (g.unicode !== undefined && g.unicode !== null) fontByUnicode.set(g.unicode, g);
			});
			const hex = (unicode) => `U+${unicode.toString(16).toUpperCase().padStart(4, '0')}`;

			// --- Glyph coverage ----------------------------------------------
			// Every project glyph that carries outlines must appear in the
			// exported font. A failure here means glyphs were silently dropped
			// (e.g. by colliding export names).
			const dropped = [];
			for (const codePoint of withShapes) {
				if (!fontByUnicode.has(codePoint)) dropped.push(hex(codePoint));
			}
			expect(dropped, 'Glyphs with outlines must not be dropped on export').toEqual([]);

			// --- Kerning -----------------------------------------------------
			// Permute the project's kern groups into pairs, keep only those whose
			// left and right are both exportable code points (the only pairs the
			// font can actually represent), and compare the value multiset to the
			// re-imported font's kerning.
			const expectedKern = project
				.makeCollectionOfKernPairs()
				.filter(
					(pair) =>
						typeof pair.left === 'string' &&
						typeof pair.right === 'string' &&
						typeof pair.value === 'number' &&
						all.has(parseInt(pair.left)) &&
						all.has(parseInt(pair.right))
				)
				.map((pair) => String(pair.value))
				.sort();
			expect(kerningValueMultiset(font), 'Kerning must be preserved on export').toEqual(
				expectedKern
			);
		}, 60000);
	}
});
