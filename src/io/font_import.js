import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { countItems, isVal, pause, round } from '../common/functions.js';
import { decToHex } from '../common/character_ids.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { getUnicodeBlockByName } from '../lib/unicode_blocks.js';
import { isOutOfBounds } from '../pages/open_project.js';
import { Glyph } from '../project_data/glyph.js';
import {
	ioSVG_cleanAndFormatPathDefinition,
	ioSVG_convertSVGTagToPath,
} from './svg_outline_import.js';
import { getUnicodeName } from '../lib/unicode_names.js';
import { makeLigatureID } from '../pages/ligatures.js';

/**
	IO > Import > OpenType
	Using OpenType.js to read in a font file
	and convert it to a Glyphr Studio Project.
**/
const finalGlyphs = {};
const finalLigatures = {};
let importItemCounter = 0;
let importItemTotal = 0;
let customGlyphRange = [];
// let maxChar = 0;
// let minChar = 0xffff;

export async function ioFont_importFont(importedFont) {
	log('ioFont_importFont', 'start');
	log(importedFont);
	const project = getCurrentProject();
	const fontGlyphs = importedFont.glyphs.glyphs;
	const fontLigatures = importedFont.substitution.getLigatures('liga');
	log(fontLigatures);
	importItemTotal = countItems(fontGlyphs) + fontLigatures.length;
	// updateFontImportProgressIndicator(1);

	for (const key of Object.keys(fontGlyphs)) {
		await updateFontImportProgressIndicator();
		importOneGlyph(fontGlyphs[key], project);
	}

	for (const liga of fontLigatures) {
		await updateFontImportProgressIndicator();
		importOneLigature({ glyph: importedFont.glyphs.get(liga.by), gsub: liga.sub }, importedFont);
	}

	importFontMetadata(importedFont, project);

	project.glyphs = finalGlyphs;
	project.ligatures = finalLigatures;
	// project.kerning = finalKerns;

	const editor = getCurrentProjectEditor();
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

function importOneGlyph(otfGlyph, project) {
	log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`otfGlyph.unicode: ${otfGlyph.unicode}`);
	// log(`otfGlyph.name: ${otfGlyph.name}`);
	// log(`otfGlyph.advanceWidth: ${otfGlyph.advanceWidth}`);
	log(otfGlyph);

	const uni = decToHex(otfGlyph.unicode || 0);

	if (uni === false || uni === '0x0000') {
		// Check for .notdef
		log(`!!! Skipping ${otfGlyph.name} NO UNICODE !!!`);
		importItemTotal--;
		log('importOneGlyph', 'end');
		return;
	}

	if (isOutOfBounds([uni])) {
		log(`!!! Skipping ${otfGlyph.name} OUT OF BOUNDS !!!`);
		importItemTotal--;
		log('importOneGlyph', 'end');
		return;
	}

	const importedGlyph = makeGlyphrStudioGlyphObject(otfGlyph);

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);
		console.log(otfGlyph);
		importItemTotal--;
		log('importOneGlyph', 'end');
		return;
	}

	// Get some range data
	// minChar = Math.min(minChar, uni);
	// maxChar = Math.max(maxChar, uni);

	importedGlyph.id = uni;
	const latinExtendedB = getUnicodeBlockByName('Latin Extended-B');
	if (1 * uni > latinExtendedB.end) customGlyphRange.push(uni);

	finalGlyphs[uni] = importedGlyph;
	// log(`Pushing new glyph to finalGlyphs as:`);
	// log(finalGlyphs[uni]);

	if (getUnicodeName(uni) === '[name not found]') {
		project.settings.app.showNonCharPoints = true;
	}
	// Successful loop, advance importItemCounter
	importItemCounter++;
	log(importedGlyph);
	log('importOneGlyph', 'end');
}

function makeGlyphrStudioGlyphObject(otfGlyph) {
	log(`makeGlyphrStudioGlyphObject`, 'start');
	log(otfGlyph);
	const advance = otfGlyph.advanceWidth;
	log(`advance: ${advance}`);

	const newPaths = [];
	let pathCounter = 0;
	// Import Path Data
	let data = flattenDataArray(otfGlyph.path.commands);
	// log('Glyph has path data \n' + data);

	if (data && data !== 'z') {
		data = ioSVG_cleanAndFormatPathDefinition(data);

		// log('split data into ' + data.length + ' Glyphr Studio paths.');
		// log(data);

		data.forEach((pathData) => {
			if (pathData.length) {
				// log('starting convertPathTag');
				const newPath = ioSVG_convertSVGTagToPath(pathData);
				// log('created path from PathTag');
				// log(newPath);
				if (newPath.pathPoints.length) {
					pathCounter++;
					newPath.name = `Path ${pathCounter}`;
					newPaths.push(newPath);
				} else {
					// log('!!!!!!!!!!!!!!!!!!\n\t data resulted in no path points: ' + pathData);
				}
			}
		});
	}

	const importedGlyph = new Glyph({
		paths: newPaths,
		advanceWidth: advance,
	});

	log(`makeGlyphrStudioGlyphObject`, 'end');
	return importedGlyph;
}

function flattenDataArray(data) {
	// log('flattenDataArray', 'start');
	// log(json(data, true));

	let result = '';
	data.forEach((entry) => {
		result += entry.type;
		if (isVal(entry.x1) && isVal(entry.y1)) {
			result += `${entry.x1},${entry.y1},`;
			if (isVal(entry.x2) && isVal(entry.y2)) {
				result += `${entry.x2},${entry.y2},`;
			}
		}
		if (isVal(entry.x) && isVal(entry.y)) result += `${entry.x},${entry.y},`;
	});

	// log(result);
	// log('flattenDataArray', 'end');

	return result;
}

function importOneLigature(otfLigature, otfFont) {
	log(`importOneLigature`, 'start');
	log(`otfLigature.glyph.name: ${otfLigature.glyph.name}`);
	log(otfLigature);

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
	log(`newGsub`);
	log(newGsub);
	importedLigature.gsub = newGsub;

	// Update properties
	importedLigature.objType = 'Ligature';
	const newLigatureID = makeLigatureID(String.fromCharCode(...newGsub));
	log(`newLigatureID: ${newLigatureID}`);
	importedLigature.id = newLigatureID;

	// Finish up
	finalLigatures[newLigatureID] = importedLigature;
	importItemCounter++;
	log(importedLigature);
	log(`importOneLigature`, 'end');
}

/*
 *
 *  IMPORT KERNS?
 *
 */
// const finalKerns = {};
// function importOneKern() {

// }

function importFontMetadata(font, project) {
	// log('importFontMetadata', 'start');

	/*
		REFACTOR
		let rangeStart;
		let rend;
		for (const r of Object.keys(_UI.glyphRange)) {
			rangeStart = 1 * _UI.glyphRange[r].begin;
			rend = 1 * _UI.glyphRange[r].end + 1;
			for (let t = rangeStart; t < rend; t++) {
				if (getItem('' + decToHex(t))) {
					project.settings.glyphRanges[r] = true;
					break;
				}
			}
		}
		*/

	// Make a custom ranges for the rest, with logical separations
	// log('customGlyphRange.length ' + customGlyphRange.length);

	if (customGlyphRange.length) {
		const ranges = project.settings.project.glyphRanges;
		const maxValley = 50;
		const maxRange = 100;
		customGlyphRange = customGlyphRange.sort();
		let rangeStart = customGlyphRange[0];
		let rangeEnd = customGlyphRange[0];
		let fencepost = true;

		customGlyphRange.forEach((range) => {
			// log('' + range + ' \t ' + rangeStart + ' \t ' + rangeEnd);

			if (range - rangeStart > maxRange || range - rangeEnd > maxValley) {
				ranges.push({ begin: rangeStart, end: rangeEnd });
				rangeStart = range;
				rangeEnd = range;
				fencepost = false;
				// log('new glyphRange ' + json(ranges));
			} else {
				rangeEnd = range;
				fencepost = true;
				// log('incrementing...');
			}
		});

		if (fencepost) ranges.push({ begin: rangeStart, end: rangeEnd });
		// log('new glyphRange ' + json(ranges));
	}

	// Import Font Settings
	// Check to make sure certain stuff is there
	// space has horiz-adv-x
	// log('Custom range stuff done');
	const fontSettings = project.settings.font;
	const fname = font.familyName || 'My Font';

	fontSettings.name = fname;
	fontSettings.upm = 1 * font.unitsPerEm || 1000;
	fontSettings.ascent = 1 * font.ascender || 700;
	fontSettings.descent = -1 * Math.abs(font.descender) || 300;
	fontSettings.capHeight = 1 * getTableValue(font.tables.os2.sCapHeight) || 675;
	fontSettings.xHeight = 1 * getTableValue(font.tables.os2.sxHeight) || 400;
	fontSettings.overshoot = round(fontSettings.upm / 100);

	fontSettings.family = fname.substr(0, 31);
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
