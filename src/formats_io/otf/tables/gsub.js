import { makeLigatureID } from '../../../pages/ligatures';
import {
	decrementItemTotal,
	incrementItemCounter,
	makeGlyphrStudioGlyphObject,
	updateFontImportProgressIndicator,
} from '../font_import';

/**
 * Converts FontFlux ligatures into Glyphr Studio ligatures
 * @param {Object} importedFont - FontFlux font object
 * @param {Array} fontLigatures - FontFlux ligature table
 * @returns {Promise<Object>} - imported ligature groups
 */
export async function importLigatures(importedFont, fontLigatures) {
	const finalLigatures = {};
	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator('ligature');
		let thisLigature = false;
		try {
			thisLigature = findFontGlyph(importedFont, liga.by);
		} catch {
			console.warn(`Ligature import error: could not get ${liga.by} (${liga.sub})`);
		}
		importOneLigature({ glyph: thisLigature, gsub: liga.sub }, importedFont, finalLigatures);
	}

	return finalLigatures;
}

// --------------------------------------------------------------
// Ligatures
// --------------------------------------------------------------
/**
 * Imports one FontFlux ligature and adds it
 * to the current project
 * @param {Object} otfLigature - FontFlux ligature object
 * @param {Object} importedFont - entire FontFlux Font object
 * @returns nothing
 */
function importOneLigature(otfLigature, importedFont, finalLigatures) {
	// log(`importOneLigature`, 'start');
	// log(`otfLigature.glyph.name: ${otfLigature.glyph.name}`);
	// log(otfLigature);

	if (otfLigature?.glyph) {
		// make the Glyphr Studio Glyph
		const importedLigature = makeGlyphrStudioGlyphObject(otfLigature.glyph, importedFont);
		if (!importedLigature) {
			console.warn(`Something went wrong with importing this glyph.`);

			decrementItemTotal();
			// log(`importOneLigature`, 'end');
			return;
		}

		// Convert font glyph index to decimal for gsub
		let newGsub = [];
		otfLigature.gsub.forEach((glyphReference) => {
			const glyph = findFontGlyph(importedFont, glyphReference);
			if (glyph?.unicode !== undefined) {
				newGsub.push(glyph.unicode);
			}
		});

		if (otfLigature.gsub.length !== newGsub.length) {
			// log(`importOneLigature`, 'end');
			return;
		}
		// log(`newGsub`);
		// log(newGsub);
		importedLigature.gsub = newGsub;

		// Update properties
		importedLigature.objType = 'Ligature';
		const newLigatureID = makeLigatureID(String.fromCodePoint(...newGsub));
		// log(`newLigatureID: ${newLigatureID}`);
		if (newLigatureID) {
			importedLigature.id = newLigatureID;
			finalLigatures[newLigatureID] = importedLigature;
			incrementItemCounter();
			// log(importedLigature);
		} else {
			decrementItemTotal();
		}
	} else {
		decrementItemTotal();
	}
	// log(`importOneLigature`, 'end');
}

/**
 * Resolves a FontFlux glyph reference from either the array used by current
 * releases or the Map-like collection used by older releases.
 * @param {Object} importedFont - FontFlux font object
 * @param {String|Number} reference - glyph name, unicode, or glyph index
 * @returns {Object|undefined} matching glyph
 */
function findFontGlyph(importedFont, reference) {
	const glyphs = importedFont?.glyphs;
	if (!glyphs) return undefined;

	if (typeof glyphs.get === 'function') {
		return glyphs.get(reference) ?? glyphs.get(Number(reference));
	}

	if (!Array.isArray(glyphs)) return undefined;
	if (typeof reference === 'number') {
		return glyphs[reference] ?? glyphs.find((glyph) => glyph.unicode === reference);
	}

	return glyphs.find(
		(glyph) =>
			glyph.name === reference || glyph.name === String(reference) || glyph.unicode === Number(reference)
	);
}
