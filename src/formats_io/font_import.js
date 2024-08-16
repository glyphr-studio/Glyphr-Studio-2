import {
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { countItems } from '../common/functions.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import openTypeJS from '../lib/opentype.js-july-2024/opentype.mjs';
import { isControlChar } from '../lib/unicode/unicode_blocks.js';
import { makeKernGroupID } from '../pages/kerning.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { KernGroup } from '../project_data/kern_group.js';
import { ProjectEditor } from '../project_editor/project_editor.js';
import { ioSVG_convertSVGTagsToGlyph } from './svg_outline_import.js';

/**
	IO > Import > OpenType
	Using OpenType.js to read in a font file
	and convert it to a Glyphr Studio Project.
**/
let finalGlyphs = {};
let finalLigatures = {};
let finalKerns = {};
let importItemCounter = 0;
let importItemTotal = 0;

/**
 * Takes the import result from Opentype.js, reads the data, and
 * creates a new Glyphr Studio Project from it.
 * @param {Object} importedFont - result from Opentype.js import
 * @param {Boolean} testing - is this a vitest test
 * @returns nothing
 */
export async function ioFont_importFont(importedFont, testing = false) {
	// log(importedFont);
	const editor = testing ? new ProjectEditor() : getProjectEditorImportTarget();
	const project = editor.project;

	// TESTING
	const svgTable = importedFont.tables.svg;
	console.log('importedFont.tables.svg', svgTable);
	console.log('importedFont.svgImages', importedFont.svgImages);
	// 0x270B
	const gIndex = importedFont.charToGlyphIndex('😂');
	console.log(`getting index ${gIndex}`);
	const svgBits = svgTable.get(gIndex);
	const svgCode = await openTypeJS.decodeSvgDocument(svgBits);
	console.log(svgCode);
	console.log(importedFont.glyphs.glyphs[gIndex]);
	console.log('getting from glyph object');
	console.log(await importedFont.charToGlyph('😂').getSvgImage(importedFont));

	// Reset module data
	finalGlyphs = {};
	finalLigatures = {};
	finalKerns = {};
	importItemCounter = 0;
	importItemTotal = 0;

	// --------------------------------------------------------------
	// Set up import groups
	// --------------------------------------------------------------

	const fontGlyphs = importedFont.glyphs.glyphs || {};
	// log(`\nfontGlyphs:`);
	// log(fontGlyphs);
	const fontLigatures = importedFont.substitution.getLigatures('liga') || [];
	// log(`\nfontLigatures:`);
	// log(fontLigatures);
	const kernTables = importedFont.position.getKerningTables() || [];
	// log(`\n⮟kernTables⮟`);
	// log(kernTables);

	// --------------------------------------------------------------
	// Count items and set up progress indicator
	// --------------------------------------------------------------

	// Get Kern Info
	let kernPairCount = 0;
	const gposKernTables = [];

	function loadOneKernTable(table) {
		// log(`loadOneKernTable`, 'start');
		// log(table);
		const subtables = [];
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
		return subtables;
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

	// log(`\n⮟kernTables⮟`);
	// log(kernTables);
	kernTables.forEach((table) => gposKernTables.push(loadOneKernTable(table)));
	// log(`\n⮟gposKernTables⮟`);
	// log(gposKernTables);

	// log(`kernPairCount: ${kernPairCount}`);
	importItemTotal = countItems(fontGlyphs) + fontLigatures.length + kernPairCount;

	// --------------------------------------------------------------
	// Import Characters
	// --------------------------------------------------------------

	for (const key of Object.keys(fontGlyphs)) {
		await updateFontImportProgressIndicator('character');
		importOneGlyph(fontGlyphs[key], project);
	}

	// --------------------------------------------------------------
	// Import Ligatures
	// --------------------------------------------------------------

	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator('ligature');
		let thisLigature = false;
		try {
			thisLigature = importedFont.glyphs.get(liga.by);
		} catch {
			console.warn(`Ligature import error: could not get ${liga.by} (${liga.sub})`);
		}
		importOneLigature({ glyph: thisLigature, gsub: liga.sub }, importedFont);
	}

	// --------------------------------------------------------------
	// Import Kern Pairs
	// --------------------------------------------------------------

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
					importOneKern(leftGlyph, rightGlyph, kernValue);
				}
			}
		}
	}

	// --------------------------------------------------------------
	// Import metadata, and finishing steps
	// --------------------------------------------------------------

	importFontMetadata(importedFont, project);

	project.glyphs = finalGlyphs;
	project.ligatures = finalLigatures;
	project.kerning = finalKerns;

	// log(editor);
	if (testing) {
		return editor.project;
	} else {
		setCurrentProjectEditor(editor);
		editor.project.resetSessionStateForAllItems();

		editor.nav.page = 'Overview';
		const app = getGlyphrStudioApp();
		app.selectedProjectEditor = editor;
		app.selectedProjectEditor.navigate();
	}
}

/**
 * Updates the progress indicator UI
 * @param {String} type - Character, Ligature, Kern Pair
 */
async function updateFontImportProgressIndicator(type) {
	await updateProgressIndicator(`
			Importing ${type}:
			<span class="progress-indicator__counter">${importItemCounter}</span>
			 of
			<span class="progress-indicator__counter">${importItemTotal}</span>
		`);
}

// --------------------------------------------------------------
// Characters
// --------------------------------------------------------------

/**
 * Imports one Opentype.js Glyph object and adds it
 * to the current project
 * @param {Object} otfGlyph - Opentype.js Glyph object
 * @param {GlyphrStudioProject} project - current project
 * @returns nothing
 */
function importOneGlyph(otfGlyph, project) {
	// log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`otfGlyph.unicode: ${otfGlyph.unicode}`);
	// log(`otfGlyph.name: ${otfGlyph.name}`);
	// log(`otfGlyph.advanceWidth: ${otfGlyph.advanceWidth}`);
	// log(otfGlyph);

	if (isNaN(otfGlyph.unicode)) {
		// log(`!!! Skipping ${otfGlyph.name} NO UNICODE !!!`);
		importItemTotal--;
		// log('importOneGlyph', 'end');
		return;
	}

	const uni = decToHex(otfGlyph.unicode || 0);
	// log(`uni: ${uni}`);
	const importedGlyph = makeGlyphrStudioGlyphObject(otfGlyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);

		importItemTotal--;
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
	importItemCounter++;
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}

/**
 * Converts one Opentype.js Glyph into a Glyphr Studio Glyph.
 * @param {Object} otfGlyph - Opentype.js Glyph object
 * @returns {Glyph}
 */
function makeGlyphrStudioGlyphObject(otfGlyph) {
	// log(`makeGlyphrStudioGlyphObject`, 'start');
	// log(otfGlyph);
	const advance = otfGlyph.advanceWidth;
	// log(`advance: ${advance}`);

	// const newPaths = [];
	// let pathCounter = 0;
	// Import Path Data
	let data = otfGlyph.path.toSVG();
	// log('Glyph has .toSVG data');
	// log(data);

	let importedGlyph;

	if (data) {
		importedGlyph = ioSVG_convertSVGTagsToGlyph(`<svg>${data}</svg>`, false);
		// log(`importedGlyph`);
		// log(importedGlyph);
	} else {
		importedGlyph = new Glyph();
	}

	if (importedGlyph) {
		importedGlyph.advanceWidth = advance;
		importedGlyph.flipNS();
	}

	// log(`makeGlyphrStudioGlyphObject`, 'end');
	return importedGlyph;
}

// --------------------------------------------------------------
// Ligatures
// --------------------------------------------------------------
/**
 * Imports one Opentype.js Ligature and adds it
 * to the current project
 * @param {Object} otfLigature - Opentype.js Ligature object
 * @param {Object} otfFont - entire Opentype.js Font object
 * @returns nothing
 */
function importOneLigature(otfLigature, otfFont) {
	// log(`importOneLigature`, 'start');
	// log(`otfLigature.glyph.name: ${otfLigature.glyph.name}`);
	// log(otfLigature);

	if (otfLigature?.glyph) {
		// make the Glyphr Studio Glyph
		const importedLigature = makeGlyphrStudioGlyphObject(otfLigature.glyph);
		if (!importedLigature) {
			console.warn(`Something went wrong with importing this glyph.`);

			importItemTotal--;
			// log(`importOneLigature`, 'end');
			return;
		}

		// Convert font glyph index to decimal for gsub
		let newGsub = [];
		otfLigature.gsub.forEach((glyphID) => {
			if (otfFont.glyphs.get(glyphID)?.unicode) {
				newGsub.push(otfFont.glyphs.get(glyphID).unicode);
			}
		});

		if (otfLigature.gsub.length !== newGsub.length) {
			importItemTotal--;
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
		if (newLigatureID) importedLigature.id = newLigatureID;

		// Finish up
		finalLigatures[newLigatureID] = importedLigature;
		importItemCounter++;
		// log(importedLigature);
	} else {
		importItemTotal--;
	}
	// log(`importOneLigature`, 'end');
}

// --------------------------------------------------------------
// Kerning
// --------------------------------------------------------------
/**
 * Imports kern information from Opentype.js into the
 * current Glyphr Studio project.
 * @param {Object} leftGlyph - kern left glyph
 * @param {Object} rightGlyph - kern right glyph
 * @param {Number} value - kern value
 * @returns nothing
 */
function importOneKern(leftGlyph, rightGlyph, value) {
	// log(`importOneKern`, 'start');
	// log(`leftGlyph.unicode: ${leftGlyph.unicode}`);
	// log(`rightGlyph.unicode: ${rightGlyph.unicode}`);

	if (!leftGlyph || !rightGlyph) {
		console.warn(`Something went wrong with importing this kern pair:
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		importItemCounter--;
		// log(`importOneKern`, 'end');
		return;
	}

	if (!leftGlyph.unicode || !rightGlyph.unicode) {
		console.warn(`Only kern values containing characters with Unicode Code Points can be imported (can't kern ligatures) :
${leftGlyph?.name} | ${rightGlyph?.name} = ${value} `);
		importItemCounter--;
		// log(`importOneKern`, 'end');
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
	importItemCounter++;

	// log(`newKernID: ${newKernID}`);
	// log(importedKern);
	// log(`importOneKern`, 'end');
}

// --------------------------------------------------------------
// Metadata
// --------------------------------------------------------------

/**
 * Finds metadata stuff in the Opentype.js Font object, and pulls
 * appropriate stuff into a provided Glyphr Studio Project.
 * @param {Object} font - Opentype.js Font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
function importFontMetadata(font, project) {
	// log('importFontMetadata', 'start');
	// log(font);
	const fontSettings = project.settings.font;
	const os2 = font.tables.os2;
	const familyName = '' + getTableValue(font.names.fontFamily) || 'My Font';
	project.settings.project.name = familyName;

	fontSettings.name = familyName;
	fontSettings.upm = 1 * font.unitsPerEm || fontSettings.upm;

	// TODO reconcile conflicting ascender data
	fontSettings.ascent = 1 * (getTableValue(os2.sTypoAscender) || fontSettings.ascent);
	// fontSettings.ascent = 1 * font.ascender || fontSettings.ascent;

	// TODO reconcile conflicting descender data
	/** @type {any} */
	let typoDescender = getTableValue(os2.sTypoDescender);
	if (typoDescender) {
		typoDescender = parseFloat(typoDescender);
		fontSettings.descent = -1 * Math.abs(1 * typoDescender);
	}
	// fontSettings.descent = -1 * Math.abs(font.descender) || fontSettings.descent;

	fontSettings.capHeight = 1 * (getTableValue(os2.sCapHeight) || fontSettings.capHeight);
	fontSettings.xHeight = 1 * (getTableValue(os2.sxHeight) || fontSettings.xHeight);
	fontSettings.overshoot = fontSettings.upm > 2000 ? 30 : 20;
	fontSettings.lineGap = 1 * (getTableValue(os2.sTypoLineGap) || fontSettings.lineGap);

	fontSettings.family = familyName.substring(0, 31);
	fontSettings.panose = getTableValue(os2.panose) || '0 0 0 0 0 0 0 0 0 0';
	fontSettings.version =
		getTableValue(font.tables.head.fontRevision) ||
		getTableValue(font.version) ||
		getTableValue('Version 0.1');

	// These can be read in but not saved using OpenType.js
	fontSettings.style = getTableValue(font.tables.name.fontSubfamily) || 'Regular';
	fontSettings.copyright = getTableValue(font.tables.name.copyright) || '';
	fontSettings.trademark = getTableValue(font.tables.name.trademark) || '';
	fontSettings.designer = getTableValue(font.tables.name.designer) || '';
	fontSettings.designerURL = getTableValue(font.tables.name.designerURL) || '';
	fontSettings.manufacturer = getTableValue(font.tables.name.manufacturer) || '';
	fontSettings.manufacturerURL = getTableValue(font.tables.name.manufacturerURL) || '';
	fontSettings.license = getTableValue(font.tables.name.license) || '';
	fontSettings.licenseURL = getTableValue(font.tables.name.licenseURL) || '';
	fontSettings.description = getTableValue(font.tables.name.description) || '';

	// log(fontSettings);
	// log('importFontMetadata', 'end');
}

/**
 * "Values" from a font table may take many forms - this function
 * takes anything, figures out what it should be, and returns a
 * value that Glyphr Studio can use.
 * @param {any} val - a thing that is some sort of value
 * @returns {String | false}
 */
function getTableValue(val) {
	// log(`getTableValue`, 'start');
	// log(`val: ${val}`);
	try {
		/** @type {any} */
		let tableValue = false;
		if (Array.isArray(val)) {
			tableValue = val.join(' ');
		} else if (typeof val === 'object' && typeof val.en === 'string') {
			// fixes #238 .ttf import from Google Fonts
			tableValue = val.en;
		} else if (typeof val === 'string' || typeof val === 'number') {
			tableValue = val;
		}

		// log(`tableValue: ${tableValue}`);
		// log(`getTableValue`, 'end');
		return tableValue;
	} catch (err) {
		// log(`Error, returning false`);
		// log(`getTableValue`, 'end');
		return false;
	}
}
