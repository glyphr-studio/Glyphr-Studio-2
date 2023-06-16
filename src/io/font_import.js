import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { countItems, isVal, pause, round } from '../common/functions.js';
import { decToHex } from '../common/character_ids.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { getParentRange, getUnicodeBlockByName, isControlChar } from '../lib/unicode_blocks.js';
import { isOutOfBounds } from '../pages/open_project.js';
import { Glyph } from '../project_data/glyph.js';
import { ioSVG_convertSVGTagsToGlyph } from './svg_outline_import.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { CharacterRange } from '../project_data/character_range.js';
import { KernGroup } from '../project_data/kern_group.js';
import { makeKernID } from '../pages/kerning.js';

/**
	IO > Import > OpenType
	Using OpenType.js to read in a font file
	and convert it to a Glyphr Studio Project.
**/
const finalGlyphs = {};
const importedRanges = {};
const finalLigatures = {};
const finalKerns = {};
let importItemCounter = 0;
let importItemTotal = 0;
// let maxChar = 0;
// let minChar = 0xffff;

export async function ioFont_importFont(importedFont) {
	log('ioFont_importFont', 'start');
	log(importedFont);
	const project = getCurrentProject();
	const fontGlyphs = importedFont.glyphs.glyphs;
	const fontLigatures = importedFont.substitution.getLigatures('liga');
	const fontKerns = importedFont.kerningPairs;

	importItemTotal = countItems(fontGlyphs) + fontLigatures.length + countItems(fontKerns);

	for (const key of Object.keys(fontGlyphs)) {
		await updateFontImportProgressIndicator();
		importOneGlyph(fontGlyphs[key], project);
	}

	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator();
		importOneLigature({ glyph: importedFont.glyphs.get(liga.by), gsub: liga.sub }, importedFont);
	}

	for (const key of Object.keys(fontKerns)) {
		await updateFontImportProgressIndicator();
		importOneKern(key, fontKerns[key], project);
	}

	importFontMetadata(importedFont, project);

	project.glyphs = finalGlyphs;
	project.ligatures = finalLigatures;
	project.kerning = finalKerns;

	log(project);

	const editor = getCurrentProjectEditor();
	editor.selectedCharacterRange = getUnicodeBlockByName('Basic Latin');
	editor.nav.page = 'Overview';
	editor.navigate();

	log('ioFont_importFont', 'end');
}

async function updateFontImportProgressIndicator() {
	updateProgressIndicator(`
			Importing glyph:
			<span class="progress-indicator__counter">${importItemCounter}</span>
			 of
			<span class="progress-indicator__counter">${importItemTotal}</span>
		`);
	await pause();
}

// --------------------------------------------------------------
// Characters
// --------------------------------------------------------------

function importOneGlyph(otfGlyph, project) {
	// log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`otfGlyph.unicode: ${otfGlyph.unicode}`);
	// log(`otfGlyph.name: ${otfGlyph.name}`);
	// log(`otfGlyph.advanceWidth: ${otfGlyph.advanceWidth}`);
	// log(otfGlyph);

	const uni = decToHex(otfGlyph.unicode || 0);

	if (uni === false || uni === '0x0000') {
		// Check for .notdef
		// log(`!!! Skipping ${otfGlyph.name} NO UNICODE !!!`);
		importItemTotal--;
		// log('importOneGlyph', 'end');
		return;
	}

	if (isOutOfBounds([uni])) {
		// log(`!!! Skipping ${otfGlyph.name} OUT OF BOUNDS !!!`);
		importItemTotal--;
		// log('importOneGlyph', 'end');
		return;
	}

	const importedGlyph = makeGlyphrStudioGlyphObject(otfGlyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);
		console.log(otfGlyph);
		importItemTotal--;
		// log('importOneGlyph', 'end');
		return;
	}

	// Get some range data
	// minChar = Math.min(minChar, uni);
	// maxChar = Math.max(maxChar, uni);

	const glyphID = `glyph-${uni}`;
	importedGlyph.id = glyphID;

	finalGlyphs[glyphID] = importedGlyph;
	// log(`Pushing new glyph to finalGlyphs as:`);
	// log(finalGlyphs[uni]);

	if (isControlChar(uni)) {
		project.settings.app.showNonCharPoints = true;
		console.warn(`CONTROL CHAR FOUND ${uni}`);
		// log(otfGlyph);
	}

	const parentRange = getParentRange(uni);
	if (!importedRanges[parentRange.name]) {
		importedRanges[parentRange.name] = parentRange;
	}

	// Successful loop, advance importItemCounter
	importItemCounter++;
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}

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
		importedGlyph = ioSVG_convertSVGTagsToGlyph(`<svg>${data}</svg>`);
		// log(`importedGlyph`);
		// log(importedGlyph);
	} else {
		importedGlyph = new Glyph();
	}

	if (importedGlyph) importedGlyph.advanceWidth = advance;

	// log(`makeGlyphrStudioGlyphObject`, 'end');
	return importedGlyph;
}

// --------------------------------------------------------------
// Ligatures
// --------------------------------------------------------------

function importOneLigature(otfLigature, otfFont) {
	// log(`importOneLigature`, 'start');
	// log(`otfLigature.glyph.name: ${otfLigature.glyph.name}`);
	// log(otfLigature);

	// make the Glyphr Studio Glyph
	const importedLigature = makeGlyphrStudioGlyphObject(otfLigature.glyph);
	if (!importedLigature) {
		console.warn(`Something went wrong with importing this glyph.`);
		console.log(otfLigature);
		importItemTotal--;
		return;
	}

	// Convert font glyph index to decimal for gsub
	let newGsub = [];
	otfLigature.gsub.forEach((glyphID) => {
		newGsub.push(otfFont.glyphs.get(glyphID).unicode);
	});
	// log(`newGsub`);
	// log(newGsub);
	importedLigature.gsub = newGsub;

	// Update properties
	importedLigature.objType = 'Ligature';
	const newLigatureID = makeLigatureID(String.fromCharCode(...newGsub));
	// log(`newLigatureID: ${newLigatureID}`);
	importedLigature.id = newLigatureID;

	// Finish up
	finalLigatures[newLigatureID] = importedLigature;
	importItemCounter++;
	// log(importedLigature);
	// log(`importOneLigature`, 'end');
}

// --------------------------------------------------------------
// Kerning
// --------------------------------------------------------------

function importOneKern(members, value, project) {
	// log(`importOneKern`, 'start');
	members = members.split(',');
	let left = decToHex(members[0]);
	let right = decToHex(members[1]);

	if (members.length !== 2) {
		console.warn(
			`Something went wrong with importing this kern pair: ${JSON.stringify(members)} | ${value} `
		);
		importItemCounter--;
		// log(`importOneKern`, 'end');
		return;
	}
	const importedKern = new KernGroup({
		leftGroup: [left],
		rightGroup: [right],
		value: value,
	});
	const newKernID = makeKernID(finalKerns);

	// Finish up
	finalKerns[newKernID] = importedKern;
	importItemCounter++;
	// log(`importOneKern`, 'end');
}

// --------------------------------------------------------------
// Metadata
// --------------------------------------------------------------

function importFontMetadata(font, project) {
	// log('importFontMetadata', 'start');
	// log(font);
	// Import Font Settings
	// Check to make sure certain stuff is there
	// space has horiz-adv-x
	// log('Custom range stuff done');
	const fontSettings = project.settings.font;
	const familyName = getTableValue(font.names.fontFamily) || 'My Font';
	project.settings.project.name = familyName;

	fontSettings.name = familyName;
	fontSettings.upm = 1 * font.unitsPerEm || 1000;
	fontSettings.ascent = 1 * font.ascender || 700;
	fontSettings.descent = -1 * Math.abs(font.descender) || 300;
	fontSettings.capHeight = 1 * getTableValue(font.tables.os2.sCapHeight) || 675;
	fontSettings.xHeight = 1 * getTableValue(font.tables.os2.sxHeight) || 400;
	fontSettings.overshoot = round(fontSettings.upm / 100);

	fontSettings.family = familyName.substring(0, 31);
	fontSettings.panose = getTableValue(font.tables.os2.panose) || '0 0 0 0 0 0 0 0 0 0';
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

	// Ranges
	for (const range of Object.keys(importedRanges)) {
		project.settings.project.characterRanges.push(new CharacterRange(importedRanges[range]));
	}
	// log(fontSettings);
	// log('importFontMetadata', 'end');
}

function getTableValue(val) {
	try {
		// fixes #238 .ttf import from Google Fonts
		if (typeof val === 'object' && typeof val.en === 'string') {
			return val.en;
		}

		if (Object.prototype.toString.call(val) === '[object Array]') {
			return val.join(' ');
		}
	} catch (err) {
		return 0;
	}
}
