import { makeLigatureID } from '../../../pages/ligatures';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';
import {
	decrementItemTotal,
	incrementItemCounter,
	makeGlyphrStudioGlyphObject,
	updateFontImportProgressIndicator,
} from '../font_import';

/**
 * Converts opentype.js ligatures into Glyphr Studio ligatures
 * @param {Object} importedFont - opentype.js font object
 * @param {Object} fontLigatures - opentype.js ligature table
 * @param {GlyphrStudioProject} project - current project
 * @returns {Promise<Object>} - imported ligature groups
 */
export async function importLigatures(importedFont, fontLigatures, project) {
	const finalLigatures = {};
	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator('ligature');
		let thisLigature = false;
		try {
			thisLigature = importedFont.glyphs.get(liga.by);
		} catch {
			console.warn(`Ligature import error: could not get ${liga.by} (${liga.sub})`);
		}
		importOneLigature(
			{ glyph: thisLigature, gsub: liga.sub },
			importedFont,
			project,
			finalLigatures
		);
	}

	return finalLigatures;
}

// --------------------------------------------------------------
// Ligatures
// --------------------------------------------------------------
/**
 * Imports one Opentype.js Ligature and adds it
 * to the current project
 * @param {Object} otfLigature - Opentype.js Ligature object
 * @param {Object} importedFont - entire Opentype.js Font object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} finalLigatures - imported ligature groups
 * @returns nothing
 */
function importOneLigature(otfLigature, importedFont, project, finalLigatures) {
	// log(`importOneLigature`, 'start');
	// log(`otfLigature.glyph.name: ${otfLigature.glyph.name}`);
	// log(otfLigature);

	if (otfLigature?.glyph) {
		// make the Glyphr Studio Glyph
		const importedLigature = makeGlyphrStudioGlyphObject(otfLigature.glyph);
		if (!importedLigature) {
			console.warn(`Something went wrong with importing this glyph.`);

			decrementItemTotal();
			// log(`importOneLigature`, 'end');
			return;
		}

		// Convert font glyph index to decimal for gsub
		let newGsub = [];
		otfLigature.gsub.forEach((glyphID) => {
			if (importedFont.glyphs.get(glyphID)?.unicode) {
				newGsub.push(importedFont.glyphs.get(glyphID).unicode);
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
			importedLigature.parent = project;
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
