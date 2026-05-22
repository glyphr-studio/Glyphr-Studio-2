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
 * Imports glyph data from FontFlux
 * @param {Array} fontGlyphs - FontFlux glyph array
 * @param {GlyphrStudioProject} project - current project
 * @returns {Promise<Object>} - imported glyphs
 */
export async function importGlyphs(fontGlyphs, project) {
	const finalGlyphs = {};

	for (const glyph of fontGlyphs) {
		await updateFontImportProgressIndicator('character');
		importOneGlyph(glyph, project, finalGlyphs);
	}

	return finalGlyphs;
}

/**
 * Imports one FontFlux Glyph object and adds it
 * to the current project
 * @param {Object} glyph - FontFlux Glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} finalGlyphs - imported glyphs
 * @returns nothing
 */
function importOneGlyph(glyph, project, finalGlyphs) {
	// log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`glyph.unicode: ${glyph.unicode}`);
	// log(`glyph.name: ${glyph.name}`);
	// log(`glyph.advanceWidth: ${glyph.advanceWidth}`);
	// log(glyph);

	const unicode = glyph.unicode;
	const unicodes = glyph.unicodes || (unicode !== undefined ? [unicode] : []);

	if (unicode === undefined || isNaN(unicode)) {
		// Skip glyphs without unicode, except for special cases
		if (glyph.name !== '.notdef') {
			// log(`!!! Skipping ${glyph.name} NO UNICODE !!!`);
			decrementItemTotal();
			// log('importOneGlyph', 'end');
			return;
		}
	}

	// log(`primaryUnicodeHex: ${primaryUnicodeHex}`);
	const importedGlyph = makeGlyphrStudioGlyphObject(glyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);
		decrementItemTotal();
		// log('importOneGlyph', 'end');
		return;
	}

	for (let i = 0; i < unicodes.length; i++) {
		const unicodeVal = unicodes[i];
		const unicodeHex = decToHex(unicodeVal || 0);
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
