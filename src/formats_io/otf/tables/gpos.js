import { decToHex } from '../../../common/character_ids.js';
import { makeKernGroupID } from '../../../pages/kerning.js';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project.js';
import { KernGroup } from '../../../project_data/kern_group.js';
import { updateFontImportProgressIndicator, updateImportItemTotal } from '../font_import.js';

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
 *
 * @param {Object} importedFont - opentype.js font object
 * @param {Object} gposKernTables - opentype.js gpos kern tables
 * @returns {Promise<Object>} - imported kern groups
 */
export async function importGposKernPairs(importedFont, gposKernTables) {
	// log(`importGposKernPairs`, 'start');
	// log(`\n⮟gposKernTables⮟`);
	// log(gposKernTables);
	const finalKerns = {};
	for (let t = 0; t < gposKernTables.length; t++) {
		for (let s = 0; s < gposKernTables[t].length; s++) {
			const pairSets = gposKernTables[t][s].pairSets;
			const glyphList = gposKernTables[t][s].glyphList;
			for (let leftPairID = 0; leftPairID < pairSets.length; leftPairID++) {
				const pairSet = pairSets[leftPairID];
				const leftID = glyphList[leftPairID];
				const leftGlyph = importedFont.glyphs.glyphs[leftID];
				for (let p = 0; p < pairSet.length; p++) {
					const pair = pairSet[p];
					const rightID = pair.secondGlyph;
					// GS Kerns are relative to the left hand glyph,
					// So we need to invert this data from the right hand glyph
					const kernValue = pair.value1.xAdvance * -1;
					const rightGlyph = importedFont.glyphs.glyphs[rightID];
					// log(`${leftGlyph.name} : ${rightGlyph.name} = ${kernValue}`);
					await updateFontImportProgressIndicator('kern pair');
					importOneGposKernPair(leftGlyph, rightGlyph, kernValue, finalKerns);
				}
			}
		}
	}
	// log(`importGposKernPairs`, 'end');
	return finalKerns;
}

/**
 * Imports kern information from Opentype.js into the
 * current Glyphr Studio project.
 * @param {Object} leftGlyph - kern left glyph
 * @param {Object} rightGlyph - kern right glyph
 * @param {Number} value - kern value
 * @param {Object} finalKerns -  imported kern groups
 * @returns nothing
 */
function importOneGposKernPair(leftGlyph, rightGlyph, value, finalKerns) {
	// log(`importOneGposKernPair`, 'start');
	// log(`leftGlyph.unicode: ${leftGlyph.unicode}`);
	// log(`rightGlyph.unicode: ${rightGlyph.unicode}`);

	if (!leftGlyph || !rightGlyph) {
		console.warn(`Something went wrong with importing this kern pair:
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		updateImportItemTotal(-1);
		// log(`importOneGposKernPair`, 'end');
		return;
	}

	if (!leftGlyph.unicode || !rightGlyph.unicode) {
		console.warn(`Only kern values containing characters with Unicode Code Points can be imported (can't kern ligatures) :
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		updateImportItemTotal(-1);
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
	updateImportItemTotal(1);

	// log(`newKernID: ${newKernID}`);
	// log(importedKern);
	// log(`importOneGposKernPair`, 'end');
}

// --------------------------------------------------------------
// GPOS Table Writing
// --------------------------------------------------------------

/**
 *
 * @param {Object} exportingFont - opentype.js font object
 * @param {GlyphrStudioProject} project - current project
 * @returns
 */
// export function makeGposTableOptions(exportingFont, project) {
// 	const gpos = {
// 		scripts: [
// 			{
// 				tag: 'DFLT',
// 				script: {
// 					defaultLangSys: {
// 						reserved: 0,
// 						reqFeatureIndex: 65535,
// 						featureIndexes: [0],
// 					},
// 					langSysRecords: [],
// 				},
// 			},
// 			{
// 				tag: 'latn',
// 				script: {
// 					defaultLangSys: {
// 						reserved: 0,
// 						reqFeatureIndex: 65535,
// 						featureIndexes: [0],
// 					},
// 					langSysRecords: [],
// 				},
// 			},
// 		],
// 		features: [
// 			{
// 				tag: 'kern',
// 				feature: {
// 					featureParams: 0,
// 					lookupListIndexes: [0],
// 				},
// 			},
// 		],
// 		lookups: [
// 			{
// 				lookupType: 2,
// 				lookupFlag: 4,
// 				subtables: [
// 					{
// 						posFormat: 1,
// 						coverage: {
// 							format: 1,
// 							glyphs: [],
// 						},
// 						valueFormat1: 4,
// 						valueFormat2: 0,
// 						pairSets: [],
// 					},
// 				],
// 			},
// 		],
// 	};

// 	for (const kernGroup in project.kerning) {
// 		const leftCharID = 64;
// 		const rightCharID = 65;
// 		gpos.lookups[0].subtables[0].coverage.glyphs.push(leftCharID);
// 		gpos.lookups[0].subtables[0].pairSets.push({
// 			secondGlyph: rightCharID,
// 			value1: {
// 				xAdvance: 100,
// 			},
// 		});
// 	}

// 	return gpos;
// }

// 	function makeGposTable(gpos) {
//     return new table.Table('GPOS', [
//         {name: 'version', type: 'ULONG', value: 0x10000},
//         {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gpos.scripts)},
//         {name: 'features', type: 'TABLE', value: new table.FeatureList(gpos.features)},
//         {name: 'lookups', type: 'TABLE', value: new table.LookupList(gpos.lookups, subtableMakers)}
//     ]);
// }

// const example = {
// 	version: 1,
// 	scripts: [
// 		{
// 			tag: 'DFLT',
// 			script: {
// 				defaultLangSys: {
// 					reserved: 0,
// 					reqFeatureIndex: 65535,
// 					featureIndexes: [0],
// 				},
// 				langSysRecords: [],
// 			},
// 		},
// 		{
// 			tag: 'latn',
// 			script: {
// 				defaultLangSys: {
// 					reserved: 0,
// 					reqFeatureIndex: 65535,
// 					featureIndexes: [0],
// 				},
// 				langSysRecords: [],
// 			},
// 		},
// 	],
// 	features: [
// 		{
// 			tag: 'kern',
// 			feature: {
// 				featureParams: 0,
// 				lookupListIndexes: [0],
// 			},
// 		},
// 	],
// 	lookups: [
// 		{
// 			lookupType: 2,
// 			lookupFlag: 4,
// 			subtables: [
// 				{
// 					posFormat: 1,
// 					coverage: {
// 						format: 1,
// 						glyphs: [25, 43, 64, 65, 70],
// 					},
// 					valueFormat1: 4,
// 					valueFormat2: 0,
// 					pairSets: [
// 						[
// 							{
// 								secondGlyph: 25,
// 								value1: {
// 									xAdvance: -165,
// 								},
// 							},
// 							{
// 								secondGlyph: 43,
// 								value1: {
// 									xAdvance: -219,
// 								},
// 							},
// 						],
// 						[
// 							{
// 								secondGlyph: 64,
// 								value1: {
// 									xAdvance: -303,
// 								},
// 							},
// 							{
// 								secondGlyph: 65,
// 								value1: {
// 									xAdvance: -191,
// 								},
// 							},
// 							{
// 								secondGlyph: 70,
// 								value1: {
// 									xAdvance: -229,
// 								},
// 							},
// 						],
// 						[
// 							{
// 								secondGlyph: 25,
// 								value1: {
// 									xAdvance: -225,
// 								},
// 							},
// 							{
// 								secondGlyph: 43,
// 								value1: {
// 									xAdvance: -283,
// 								},
// 							},
// 						],
// 						[
// 							{
// 								secondGlyph: 25,
// 								value1: {
// 									xAdvance: -138,
// 								},
// 							},
// 							{
// 								secondGlyph: 43,
// 								value1: {
// 									xAdvance: -182,
// 								},
// 							},
// 						],
// 						[
// 							{
// 								secondGlyph: 64,
// 								value1: {
// 									xAdvance: -232,
// 								},
// 							},
// 							{
// 								secondGlyph: 65,
// 								value1: {
// 									xAdvance: -138,
// 								},
// 							},
// 							{
// 								secondGlyph: 70,
// 								value1: {
// 									xAdvance: -165,
// 								},
// 							},
// 						],
// 					],
// 				},
// 			],
// 		},
// 	],
// };
