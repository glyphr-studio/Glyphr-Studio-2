import { decToHex } from '../../../common/character_ids.js';
import { makeKernGroupID } from '../../../pages/kerning.js';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project.js';
import { KernGroup } from '../../../project_data/kern_group.js';
import {
    decrementItemTotal,
    incrementItemCounter,
    updateFontImportProgressIndicator,
} from '../font_import.js';

// --------------------------------------------------------------
// Reading Kern information
// --------------------------------------------------------------

/**
 * Reads and prepares data from a kern (hopefully gpos) table
 * @param {Object} table - gpos table data
 * @returns {Object} - parsed data
 */
export function loadOneKernTable(table) {
	// log(`loadOneKernTable`, 'start');
	// log(table);
	const subtables = [];
	let kernPairCount = 0;
	if (table.lookupType === 2) {
		table?.subtables.forEach((subtable) => {
			if (subtable.posFormat === 1) {
				// log(`\n⮟subtable⮟`);
				// log(subtable);
				const pairSets = subtable?.pairSets || [];
				const glyphList = coverageTableToGlyphList(subtable?.coverage);
				// log(`\n⮟pairSets⮟`);
				// log(pairSets);
				// log(`\n⮟glyphList⮟`);
				// log(glyphList);
				pairSets.forEach((base) => (kernPairCount += base.length));
				subtables.push({ pairSets: pairSets, glyphList: glyphList });
			} else if (subtable.posFormat === 2) {
				// TODO support position format 2
				console.warn(
					`In a GPOS table: Lookup Type 2, found a subtable with Pair Position: Format 2. Can only import Format 1.`
				);
			}
		});
	} else {
		// TODO support other Lookup types
		console.warn(
			`Found a GPOS table: Lookup Type ${table.lookupType}. Only Lookup Type 2 is supported.`
		);
	}

	// log(`loadOneKernTable`, 'end');
	return { subtables, kernPairCount };
}

/**
 * Normalizes different coverage table data structures
 * to a simple array of font glyph IDs
 * @param {Object} coverage - glyph id data
 * @returns Array
 */
function coverageTableToGlyphList(coverage) {
	if (!coverage) return [];
	let result = [];
	const coverageFormat = coverage.format;
	if (coverageFormat === 1) {
		result = coverage?.glyphs || [];
	} else if (coverageFormat === 2) {
		const typeTwoCoverage = coverage?.ranges || [];
		for (let i = 0; i < typeTwoCoverage.length; i++) {
			const range = typeTwoCoverage[i];
			for (let j = range.start; j <= range.end; j++) {
				result.push(j);
			}
		}
	}
	return result;
}

// --------------------------------------------------------------
// Importing gpos table information
// --------------------------------------------------------------

/**
 * Converts FontFlux kern pairs into Glyphr Studio kern groups
 * @param {Object} importedFont - FontFlux font object
 * @param {Array} kernPairs - FontFlux kerning pair array
 * @returns {Promise<Object>} - imported kern groups
 */
export async function importGposKernPairs(importedFont, kernPairs) {
	const finalKerns = {};

	if (!Array.isArray(kernPairs)) return finalKerns;

	for (const pair of kernPairs) {
		await updateFontImportProgressIndicator('kern pair');
		const leftGlyph = importedFont.glyphs.find(g => g.name === pair.left);
		const rightGlyph = importedFont.glyphs.find(g => g.name === pair.right);
		if (leftGlyph && rightGlyph) {
			importOneGposKernPair(leftGlyph, rightGlyph, pair.value, finalKerns);
		}
	}

	return finalKerns;
}

/**
 * Imports kern information into the current Glyphr Studio project.
 * @param {Object} leftGlyph - kern left glyph
 * @param {Object} rightGlyph - kern right glyph
 * @param {Number} value - kern value
 * @param {Object} finalKerns - imported kern groups
 * @returns nothing
 */
function importOneGposKernPair(leftGlyph, rightGlyph, value, finalKerns) {
	// log(`importOneGposKernPair`, 'start');
	// log(`leftGlyph.unicode: ${leftGlyph.unicode}`);
	// log(`rightGlyph.unicode: ${rightGlyph.unicode}`);

	if (!leftGlyph || !rightGlyph) {
		console.warn(`Something went wrong with importing this kern pair:
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		decrementItemTotal();
		// log(`importOneGposKernPair`, 'end');
		return;
	}

	if (!leftGlyph.unicode || !rightGlyph.unicode) {
		console.warn(`Only kern values containing characters with Unicode Code Points can be imported (can't kern ligatures) :
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		decrementItemTotal();
		// log(`importOneGposKernPair`, 'end');
		return;
	}

	const importedKern = new KernGroup({
		leftGroup: [decToHex(leftGlyph.unicode)],
		rightGroup: [decToHex(rightGlyph.unicode)],
		value: value,
	});
	const newKernID = makeKernGroupID(finalKerns);
	importedKern.id = newKernID;

	// Finish up
	finalKerns[newKernID] = importedKern;
	incrementItemCounter();

	// log(`newKernID: ${newKernID}`);
	// log(importedKern);
	// log(`importOneGposKernPair`, 'end');
}

// --------------------------------------------------------------
// GPOS Table Writing
// --------------------------------------------------------------

/**
 * Writes kerning data to a FontFlux font object
 * @param {Object} exportingFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current project
 * @returns
 */
export function writeGposKernDataToFont(exportingFont, project) {
	const kernPairs = project.makeCollectionOfKernPairs();

	// Only proceed if there are kern pairs to export
	if (!kernPairs || kernPairs.length === 0) {
		// log('No kern pairs to export');
		return;
	}

	try {
		const fontFluxKernPairs = kernPairs
			.filter(pair => {
				// Validate each pair has required properties
				return pair && typeof pair.left === 'number' &&
					   typeof pair.right === 'number' &&
					   typeof pair.value === 'number';
			})
			.map(pair => ({
				left: String.fromCodePoint(pair.left),
				right: String.fromCodePoint(pair.right),
				value: pair.value
			}));

		// Only add kerning if we have valid pairs
		if (fontFluxKernPairs.length > 0) {
			// Try using addKerning if available
			if (exportingFont.addKerning && typeof exportingFont.addKerning === 'function') {
				exportingFont.addKerning(fontFluxKernPairs);
			}
		}
	} catch (error) {
		// Log the error but don't fail the entire export
		// Kerning export is optional and shouldn't block font export
		console.warn(`Warning: Kerning export failed (font will export without kerning): ${error.message}`);
	}
}
