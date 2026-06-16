import { FontFlux } from 'font-flux-js';
import {
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from '../../app/main.js';
import { isUIUpdateDue, resetUIUpdateThrottle } from '../../common/functions.js';
import { updateProgressIndicator } from '../../controls/progress-indicator/progress_indicator.js';
import { sortCharacterRanges } from '../../pages/settings_project.js';
import { Glyph } from '../../project_data/glyph.js';
import { ProjectEditor } from '../../project_editor/project_editor.js';
import { ioSVG_convertSVGTagsToGlyph } from '../svg_outlines/svg_outline_import.js';
import { importGlyphs } from './tables/glyphs.js';
import { extractGposKernGroups, importGposKernGroups } from './tables/gpos.js';
import { importLigatures } from './tables/gsub.js';
import { importTable_head } from './tables/head.js';
import { importTable_name } from './tables/name.js';
import { importTable_os2 } from './tables/os2.js';
import { importTable_post } from './tables/post.js';

/**
 * Extracts ligature data from the GSUB table
 * @param {Object} importedFont - FontFlux font object
 * @returns {Array} - Array of ligature objects {by: glyphIndex, sub: [glyphIndex1, glyphIndex2, ...]}
 */
function extractLigaturesFromGSUB(importedFont) {
	const ligatures = [];

	if (!importedFont.features?.GSUB?.lookupList?.lookups) {
		return ligatures;
	}

	const lookups = importedFont.features.GSUB.lookupList.lookups;

	// Find ligature lookups (type 4)
	for (const lookup of lookups) {
		if (lookup.lookupType === 4) {
			// Ligature substitution
			for (const subtable of lookup.subtables) {
				// Process each ligature set
				for (const ligatureSet of subtable.ligatureSets) {
					for (const ligature of ligatureSet) {
						if (ligature.componentGlyphIDs && ligature.ligatureGlyph !== undefined) {
							ligatures.push({
								by: ligature.ligatureGlyph,
								sub: ligature.componentGlyphIDs,
							});
						}
					}
				}
			}
		}
	}

	return ligatures;
}
let importItemCounter = 0;
let importItemTotal = 0;

/**
 * Takes the import result from Font Flux JS, reads the data, and
 * creates a new Glyphr Studio Project from it.
 * @param {Object} importedFont - result from Font Flux JS import
 * @param {Boolean} testing - is this a vitest test
 * @returns nothing
 */
export async function ioFont_importFont(importedFont, testing = false) {
	if (!testing) console.log(importedFont);
	const editor = testing ? new ProjectEditor() : getProjectEditorImportTarget();
	const project = editor.project;

	// Reset module data
	importItemCounter = 0;
	importItemTotal = 0;
	resetUIUpdateThrottle();

	// --------------------------------------------------------------
	// Set up import groups
	// --------------------------------------------------------------

	const fontGlyphs = importedFont.glyphs || {};
	// log(`\nfontGlyphs:`);
	// log(fontGlyphs);
	const fontLigatures = extractLigaturesFromGSUB(importedFont) || [];
	// log(`\nfontLigatures:`);
	// log(fontLigatures);

	// Import kern data as compact Kern Groups built straight from the kern data
	// FontFlux has already parsed. FontFlux 2.6.0 keeps class-based (PairPos
	// format 2) kerning as native class entries on `font.data.kerningClasses`
	// and individual pairs on `font.kerning`, so a single class-vs-class kern
	// maps to one Kern Group instead of exploding into hundreds of thousands of
	// individual pairs (e.g. for fonts like Inter).
	const gposKernGroups = extractGposKernGroups(importedFont);
	// log(`\n⮟kernGroups⮟`);
	// log(gposKernGroups);

	// --------------------------------------------------------------
	// Count items and set up progress indicator
	// --------------------------------------------------------------

	importItemTotal = fontGlyphs.length + fontLigatures.length + gposKernGroups.length;

	// --------------------------------------------------------------
	// Import data
	// --------------------------------------------------------------

	// Characters
	project.glyphs = await importGlyphs(fontGlyphs, project, importedFont);

	// Ligatures
	project.ligatures = await importLigatures(importedFont, fontLigatures);

	// Kern data
	project.kerning = await importGposKernGroups(importedFont, gposKernGroups);

	// Metadata
	importTable_head(importedFont, project);
	importTable_name(importedFont, project);
	importTable_os2(importedFont, project);
	importTable_post(importedFont, project);

	// --------------------------------------------------------------
	// Finish up
	// --------------------------------------------------------------

	// log(editor);
	if (testing) {
		return editor.project;
	} else {
		setCurrentProjectEditor(editor);
		editor.project.resetSessionStateForAllItems();
		sortCharacterRanges();
		editor.nav.page = 'Overview';
		const app = getGlyphrStudioApp();
		app.selectedProjectEditor = editor;
		app.selectedProjectEditor.navigate();
	}
}

/**
 * Converts one FontFlux Glyph into a Glyphr Studio Glyph.
 * Used for characters and ligatures.
 * @param {Object} glyph - FontFlux Glyph object
 * @param {Object =} importedFont - FontFlux font object, used to decompose
 * 		composite (component-based) glyphs into outlines
 * @returns {Glyph}
 */
export function makeGlyphrStudioGlyphObject(glyph, importedFont = false) {
	// log(`makeGlyphrStudioGlyphObject`, 'start');
	// log(glyph);
	const advance = glyph.advanceWidth;
	// log(`advance: ${advance}`);

	const contours = resolveGlyphContours(glyph, importedFont);

	// Import Path Data
	let data;
	if (contours) {
		data = FontFlux.contoursToSVG(contours);
	}
	// log('Glyph has SVG data');
	// log(data);

	let importedGlyph;

	if (data) {
		importedGlyph = ioSVG_convertSVGTagsToGlyph(`<svg><path d="${data}"/></svg>`, false);
		// log(`importedGlyph`);
		// log(importedGlyph);
	} else {
		importedGlyph = new Glyph();
	}

	if (importedGlyph) {
		importedGlyph.advanceWidth = advance;
		// importedGlyph.flipNS();
	}

	// log(`makeGlyphrStudioGlyphObject`, 'end');
	return importedGlyph;
}

/**
 * Returns the renderable contours for a FontFlux glyph. Simple glyphs already
 * carry their own `contours`. TrueType composite glyphs (e.g. `i`, `j`, and
 * accented letters in fonts like Inter) instead arrive with a `components`
 * array and no `contours`, so they would otherwise import as empty glyphs.
 * This decomposes them via FontFlux's own composite flattening.
 *
 * The glyph's `name` is used as the lookup key on purpose: FontFlux resolves a
 * numeric id as a Unicode code point (never an array index), so passing an
 * index would silently return the wrong glyph, and unencoded building-block
 * components have no code point to look up by at all.
 * @param {Object} glyph - FontFlux glyph object
 * @param {Object} importedFont - FontFlux font object (or false)
 * @returns {Array | undefined} - contours array, or undefined if none
 */
function resolveGlyphContours(glyph, importedFont) {
	if (glyph.contours) return glyph.contours;

	const isComposite = glyph.components?.length;
	if (!isComposite || typeof importedFont?.getGlyphContours !== 'function') return undefined;

	const lookupKey = glyph.name ?? glyph.unicode;
	if (lookupKey === undefined || lookupKey === null) return undefined;

	try {
		const contours = importedFont.getGlyphContours(lookupKey);
		if (contours && contours.length) return contours;
	} catch (error) {
		console.warn(`Could not decompose composite glyph "${glyph.name}":`, error);
	}

	return undefined;
}

// --------------------------------------------------------------
// Progress Indicator
// --------------------------------------------------------------

/**
 * Updates the progress indicator UI
 * @param {String} type - Character, Ligature, Kern Pair
 */
export async function updateFontImportProgressIndicator(type) {
	// Throttle to ~60fps. The per-item counter still increments on every loop
	// iteration (see incrementItemCounter); here we just skip the DOM write and
	// event-loop yield most of the time, so the import runs at full speed
	// instead of pausing per item. When a frame is due, the counter has jumped
	// across however many items were processed in the interim, so it still
	// appears to whiz by.
	if (!isUIUpdateDue()) return;
	await updateProgressIndicator(`
			<span class="progress-indicator__title">Importing ${type}s</span>
			Item
			<span class="progress-indicator__counter">${importItemCounter}</span>
			 of
			<span class="progress-indicator__counter">${importItemTotal}</span>
		`);
}

export function decrementItemTotal() {
	importItemTotal--;
}

export function incrementItemCounter() {
	importItemCounter++;
}
