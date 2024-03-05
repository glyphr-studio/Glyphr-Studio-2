import { getGlyphrStudioApp, getProjectEditorImportTarget, setCurrentProjectEditor } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { countItems, pause } from '../common/functions.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { getUnicodeBlockByName, isControlChar } from '../lib/unicode/unicode_blocks.js';
import { makeKernGroupID } from '../pages/kerning.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { Glyph } from '../project_data/glyph.js';
import { KernGroup } from '../project_data/kern_group.js';
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
// let maxChar = 0;
// let minChar = 0xffff;

export async function ioFont_importFont(importedFont) {
	// log('ioFont_importFont', 'start');
	// log(importedFont);
	const editor = getProjectEditorImportTarget();
	const project = editor.project;
	const fontGlyphs = importedFont.glyphs.glyphs;
	// log(`\nfontGlyphs:`);
	// log(fontGlyphs);

	// Reset module data
	finalGlyphs = {};
	finalLigatures = {};
	finalKerns = {};
	importItemCounter = 0;
	importItemTotal = 0;

	const fontLigatures = importedFont.substitution.getLigatures('liga');
	// log(`\nfontLigatures:`);
	// log(fontLigatures);
	const fontKerns = importedFont.kerningPairs;
	// log(`\nfontKerns:`);
	// log(fontKerns);

	importItemTotal = countItems(fontGlyphs) + fontLigatures.length + countItems(fontKerns);

	for (const key of Object.keys(fontGlyphs)) {
		await updateFontImportProgressIndicator();
		importOneGlyph(fontGlyphs[key], project);
	}

	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator();
		let thisLigature = false;
		try {
			thisLigature = importedFont.glyphs.get(liga.by);
		} catch {
			console.warn(`Ligature import error: could not get ${liga.by} (${liga.sub})`);
		}
		importOneLigature({ glyph: thisLigature, gsub: liga.sub }, importedFont);
	}

	for (const key of Object.keys(fontKerns)) {
		await updateFontImportProgressIndicator();
		importOneKern(key, fontKerns[key], project);
	}

	importFontMetadata(importedFont, project);

	project.glyphs = finalGlyphs;
	project.ligatures = finalLigatures;
	project.kerning = finalKerns;

	// log(project);

	setCurrentProjectEditor(editor);
	editor.selectedCharacterRange = getUnicodeBlockByName('Basic Latin');
	editor.nav.page = 'Overview';

	const app = getGlyphrStudioApp();
	app.selectedProjectEditor = editor;
	app.selectedProjectEditor.navigate();


	// log('ioFont_importFont', 'end');
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

	if (uni === false) {
		// log(`!!! Skipping ${otfGlyph.name} NO UNICODE !!!`);
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

	if (isControlChar(uni)) {
		project.settings.app.showNonCharPoints = true;
		// console.warn(`CONTROL CHAR FOUND ${uni}`);
		// log(otfGlyph);
	}

	project.incrementRangeCountFor(uni);

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
		importedGlyph = ioSVG_convertSVGTagsToGlyph(`<svg>${data}</svg>`, false);
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

	if (otfLigature?.glyph) {
		// make the Glyphr Studio Glyph
		const importedLigature = makeGlyphrStudioGlyphObject(otfLigature.glyph);
		if (!importedLigature) {
			console.warn(`Something went wrong with importing this glyph.`);
			console.log(otfLigature);
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
		importedLigature.id = newLigatureID;

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

function importOneKern(members, value) {
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
	const newKernID = makeKernGroupID(finalKerns);

	// Finish up
	finalKerns[newKernID] = importedKern;
	importItemCounter++;
	// log(`importOneKern`, 'end');
}

// --------------------------------------------------------------
// Metadata
// --------------------------------------------------------------

function importFontMetadata(font, project) {
	log('importFontMetadata', 'start');
	log(font);
	const fontSettings = project.settings.font;
	const os2 = font.tables.os2;
	const familyName = getTableValue(font.names.fontFamily) || 'My Font';
	project.settings.project.name = familyName;

	fontSettings.name = familyName;
	fontSettings.upm = 1 * font.unitsPerEm || fontSettings.upm;

	// TODO reconcile conflicting ascender data
	fontSettings.ascent = 1 * getTableValue(os2.sTypoAscender) || fontSettings.ascent;
	// fontSettings.ascent = 1 * font.ascender || fontSettings.ascent;

	// TODO reconcile conflicting descender data
	fontSettings.descent = -1 * Math.abs(getTableValue(os2.sTypoDescender)) || fontSettings.descent;
	// fontSettings.descent = -1 * Math.abs(font.descender) || fontSettings.descent;

	fontSettings.capHeight = 1 * getTableValue(os2.sCapHeight) || fontSettings.capHeight;
	fontSettings.xHeight = 1 * getTableValue(os2.sxHeight) || fontSettings.xHeight;
	fontSettings.overshoot = fontSettings.upm > 2000 ? 30 : 20;
	fontSettings.lineGap = 1 * getTableValue(os2.sTypoLineGap) || fontSettings.lineGap;

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

	log(fontSettings);
	log('importFontMetadata', 'end');
}

function getTableValue(val) {
	// log(`getTableValue`, 'start');
	// log(`val: ${val}`);
	try {
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
