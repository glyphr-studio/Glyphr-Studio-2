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
	// Tracks, per glyph slot, how the current occupant was assigned so a more
	// authoritative mapping can replace a weaker one (see importOneGlyph).
	const glyphSlotMeta = {};

	for (const glyph of fontGlyphs) {
		await updateFontImportProgressIndicator('character');
		importOneGlyph(glyph, project, finalGlyphs, glyphSlotMeta);
	}

	return finalGlyphs;
}

/**
 * Imports one FontFlux Glyph object and adds it
 * to the current project
 * @param {Object} glyph - FontFlux Glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} finalGlyphs - imported glyphs
 * @param {Object} glyphSlotMeta - per-slot assignment metadata
 * @returns nothing
 */
function importOneGlyph(glyph, project, finalGlyphs, glyphSlotMeta = {}) {
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

	const newGlyphIsEmpty = !importedGlyph.shapes || importedGlyph.shapes.length === 0;

	for (let i = 0; i < unicodes.length; i++) {
		const unicodeVal = unicodes[i];
		// A glyph's primary `.unicode` is the authoritative (Unicode cmap)
		// mapping. Additional entries in `.unicodes` can include secondary /
		// legacy mappings (for example Mac Roman byte values surfaced by
		// font-flux-js) which must never override a real primary mapping -
		// even when the primary glyph is an (as yet undecomposed) empty
		// composite and the secondary glyph happens to carry outlines.
		const viaPrimary = unicodeVal === unicode;
		const unicodeHex = decToHex(unicodeVal || 0);
		const glyphID = `glyph-${unicodeHex}`;

		// Rank a slot claim so the strongest mapping wins. Primary mappings
		// dominate secondary ones; within the same kind, a glyph with outlines
		// beats an empty placeholder. Equal ranks keep the first claimant.
		const rankOf = (isPrimary, isEmpty) => (isPrimary ? 2 : 0) + (isEmpty ? 0 : 1);
		const newRank = rankOf(viaPrimary, newGlyphIsEmpty);

		const existingMeta = glyphSlotMeta[glyphID];
		let shouldAssign = false;
		if (!existingMeta) {
			shouldAssign = true;
		} else if (newRank > rankOf(existingMeta.viaPrimary, existingMeta.empty)) {
			shouldAssign = true;
		}

		if (shouldAssign) {
			const isNewSlot = !finalGlyphs[glyphID];
			const newGlyph = new Glyph(importedGlyph.save());
			newGlyph.id = glyphID;
			finalGlyphs[glyphID] = newGlyph;
			glyphSlotMeta[glyphID] = { viaPrimary, empty: newGlyphIsEmpty };

			if (isNewSlot) {
				if (isControlChar(unicodeHex) && unicodeHex !== '0x0') {
					project.settings.app.showNonCharPoints = true;
				}

				if (!isNaN(Number(unicodeHex))) project.incrementRangeCountFor(Number(unicodeHex));
			}
		}
	}

	// Successful loop, advance importItemCounter
	incrementItemCounter();
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}
