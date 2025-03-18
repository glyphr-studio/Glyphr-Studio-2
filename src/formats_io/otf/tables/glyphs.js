import { decToHex } from '../../../common/character_ids';
import { isControlChar } from '../../../lib/unicode/unicode_blocks';
import { Glyph } from '../../../project_data/glyph';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';
import {
	decrementItemTotal,
	incrementItemCounter,
	makeGlyphrStudioGlyphObject,
	updateFontImportProgressIndicator,
} from '../font_import';

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
		decrementItemTotal();
		// log('importOneGlyph', 'end');
		return;
	}

	if (!Array.isArray(otfGlyph.unicodes)) otfGlyph.unicodes = [otfGlyph.unicode];
	if (otfGlyph.unicodes[0] !== otfGlyph.unicode) {
		otfGlyph.unicodes.unshift(otfGlyph.unicode);
	}

	// log(`primaryUnicodeHex: ${primaryUnicodeHex}`);
	const importedGlyph = makeGlyphrStudioGlyphObject(otfGlyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);
		decrementItemTotal();
		// log('importOneGlyph', 'end');
		return;
	}

	for (let i = 0; i < otfGlyph.unicodes.length; i++) {
		const unicode = otfGlyph.unicodes[i];
		const unicodeHex = decToHex(unicode || 0);
		const glyphID = `glyph-${unicodeHex}`;
		if (!finalGlyphs[glyphID]) {
			const newGlyph = new Glyph(importedGlyph.save());
			newGlyph.id = glyphID;
			finalGlyphs[glyphID] = newGlyph;

			if (isControlChar(unicodeHex) && unicodeHex !== '0x0') {
				project.settings.app.showNonCharPoints = true;
			}

			if (!isNaN(Number(unicodeHex))) project.incrementRangeCountFor(Number(unicodeHex));
		}
	}

	// Successful loop, advance importItemCounter
	incrementItemCounter();
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}
