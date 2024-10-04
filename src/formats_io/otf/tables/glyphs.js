import { decToHex } from "../../../common/character_ids";
import { isControlChar } from "../../../lib/unicode/unicode_blocks";
import { GlyphrStudioProject } from "../../../project_data/glyphr_studio_project";
import { makeGlyphrStudioGlyphObject, updateFontImportProgressIndicator, updateImportItemTotal } from "../font_import";

/**
 * In OTF fonts, there isn't really a "glyphs" table, but
 * opentype.js has a glyphs table abstraction that we use
 * to import character data.
 * @param {Object} fontGlyphs - opentype.js glyph data
 * @param {GlyphrStudioProject} project - current project
 * @returns {Promise<Object>} - imported glyphs
 */
export async function importGlyphs(fontGlyphs, project) {
	const finalGlyphs = {};
	for (const key of Object.keys(fontGlyphs)) {
		await updateFontImportProgressIndicator('character');
		importOneGlyph(fontGlyphs[key], project, finalGlyphs);
	}

	return finalGlyphs;
}

/**
 * Imports one Opentype.js Glyph object and adds it
 * to the current project
 * @param {Object} otfGlyph - Opentype.js Glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} finalGlyphs -  imported glyphs
 * @returns nothing
 */
function importOneGlyph(otfGlyph, project, finalGlyphs) {
	// log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`otfGlyph.unicode: ${otfGlyph.unicode}`);
	// log(`otfGlyph.name: ${otfGlyph.name}`);
	// log(`otfGlyph.advanceWidth: ${otfGlyph.advanceWidth}`);
	// log(otfGlyph);

	if (isNaN(otfGlyph.unicode)) {
		// log(`!!! Skipping ${otfGlyph.name} NO UNICODE !!!`);
		updateImportItemTotal(-1);
		// log('importOneGlyph', 'end');
		return;
	}

	const uni = decToHex(otfGlyph.unicode || 0);
	// log(`uni: ${uni}`);
	const importedGlyph = makeGlyphrStudioGlyphObject(otfGlyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);

		updateImportItemTotal(-1);
		// log('importOneGlyph', 'end');
		return;
	}

	const glyphID = `glyph-${uni}`;
	importedGlyph.id = glyphID;
	finalGlyphs[glyphID] = importedGlyph;

	if (isControlChar(uni) && uni !== '0x0') {
		project.settings.app.showNonCharPoints = true;
	}

	if (!isNaN(Number(uni))) project.incrementRangeCountFor(Number(uni));

	// Successful loop, advance importItemCounter
	updateImportItemTotal(1);
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}
