import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { isVal, json, round } from '../common/functions.js';
import { decToHex, getUnicodeName } from '../common/unicode.js';
import { showError } from '../controls/dialogs/dialogs.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { getUnicodeBlockByName } from '../lib/unicode_blocks.js';
import { importOverflowCount, isOutOfBounds, resetOpenProjectTabs } from '../pages/open_project.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import {
	ioSVG_cleanAndFormatPathDefinition,
	ioSVG_convertSVGTagToPath,
} from './svg_outline_import.js';

/**
	IO > Import > OpenType
	Using OpenType.js to read in a font file
	and convert it to a Glyphr Studio Project.
**/

export function ioFont_importFont(font) {
	// log('ioFont_importFont', 'start');

	// Font Stuff
	// let font = false;
	const importFontGlyphs = [];
	const project = getCurrentProject();

	setTimeout(setupFontImport, 10);

	function setupFontImport() {
		updateProgressIndicator('Reading font data...');

		// test for range
		// if (font.glyphs.length < importOverflowCount) {
		// updateProgressIndicator(`
		// 	Importing glyph:
		// 	<span class="progress-indicator__counter">1 of ${font.glyphs.length}</span>
		// `);
		// 	setTimeout(importOneGlyph, 10);
		// } else {
		// 	showError(`Number of glyphs exceeded maximum of ${importOverflowCount}`);
		// 	// log('setupFontImport', 'end');
		// }

		updateProgressIndicator(`
			Importing glyph:
			<span class="progress-indicator__counter">1</span>
			 of
			<span class="progress-indicator__counter">${font.glyphs.length}</span>
		`);
		Object.keys(font.glyphs.glyphs).forEach(function (key) {
			importFontGlyphs.push(font.glyphs.glyphs[key]);
		});

		setTimeout(importOneGlyph, 10);
		// log('setupFontImport', 'end');
	}

	/*
	 *
	 *  GLYPH IMPORT
	 *
	 */
	let maxChar = 0;
	let minChar = 0xffff;
	let customGlyphRange = [];
	let importGlyphCounter = 0;
	const finalGlyphs = {};

	function importOneGlyph() {
		// log('importOneGlyph', 'start');
		updateProgressIndicator(`
			Importing glyph:
			<span class="progress-indicator__counter">${importGlyphCounter}</span>
			 of
			<span class="progress-indicator__counter">${importFontGlyphs.length}</span>
		`);

		if (importGlyphCounter >= importFontGlyphs.length) {
			// TODO Kerning
			// setTimeout(importOneKern, 10);
			// log(`No more glyphs to import, moving to startFinalize...`);
			// log('importOneGlyph', 'end');
			startFinalizeFontImport();
			return;
		}

		// One Glyph in the font
		const thisOTFglyph = importFontGlyphs[importGlyphCounter];

		// Get the appropriate unicode decimal for this glyph
		// log(`thisOTFglyph.unicode: ${thisOTFglyph.unicode}`);
		// log(`thisOTFglyph.name: ${thisOTFglyph.name}`);
		// log(`thisOTFglyph.advanceWidth: ${thisOTFglyph.advanceWidth}`);
		// log(thisOTFglyph);

		const uni = decToHex(thisOTFglyph.unicode || 0);
		const advanceWidth = thisOTFglyph.advanceWidth;

		if (uni === false || uni === '0x0000') {
			// Check for .notdef
			// log(`!!! Skipping ${thisOTFglyph.name} NO UNICODE !!!`);
			importFontGlyphs.splice(importGlyphCounter, 1);
		} else if (isOutOfBounds([uni])) {
			// log(`!!! Skipping ${thisOTFglyph.name} OUT OF BOUNDS !!!`);
			importFontGlyphs.splice(importGlyphCounter, 1);
		} else {
			// log(`GLYPH ${importGlyphCounter}/${importFontGlyphs.length}`);
			// log(`${thisOTFglyph.name} unicode: ${uni}`);

			/*
			 *
			 *  GLYPH IMPORT
			 *
			 */
			const newPaths = [];
			let pathCounter = 0;

			// Import Path Data
			let data = flattenDataArray(thisOTFglyph.path.commands);
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

			// Get some range data
			// uni = uni[0];
			minChar = Math.min(minChar, uni);
			maxChar = Math.max(maxChar, uni);

			const latinExtendedB = getUnicodeBlockByName('Latin Extended-B');
			if (1 * uni > latinExtendedB.end) customGlyphRange.push(uni);

			finalGlyphs[uni] = new Glyph({
				id: uni,
				paths: newPaths,
				advanceWidth: advanceWidth,
			});
			// log(`Pushing new glyph to finalGlyphs as:`);
			// log(finalGlyphs[uni]);

			if (getUnicodeName(uni) === '[name not found]') {
				project.settings.app.showNonCharPoints = true;
			}

			// Successful loop, advance importGlyphCounter
			importGlyphCounter++;
		}

		// finish loop
		setTimeout(importOneGlyph, 10);

		// log('importOneGlyph', 'end');
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

	/*
	 *
	 *  IMPORT LIGATURES?
	 *
	 */
	const finalLigatures = {};

	/*
	 *
	 *  IMPORT KERNS?
	 *
	 */
	const finalKerns = {};

	/*
	 *
	 *  FINALIZE
	 *
	 */
	function startFinalizeFontImport() {
		updateProgressIndicator('Finalizing the imported font...');
		setTimeout(finalizeFontImport, 10);
	}

	function finalizeFontImport() {
		// log('finalizeFontImport', 'start');
		project.glyphs = finalGlyphs;
		project.ligatures = finalLigatures;
		project.kerning = finalKerns;

		/*
		REFACTOR
		let rangeStart;
		let rend;
		for (const r of Object.keys(_UI.glyphRange)) {
			rangeStart = 1 * _UI.glyphRange[r].begin;
			rend = 1 * _UI.glyphRange[r].end + 1;
			for (let t = rangeStart; t < rend; t++) {
				if (getGlyph('' + decToHex(t))) {
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

		const editor = getCurrentProjectEditor();
		editor.nav.page = 'Overview';
		editor.navigate();
		// log('finalizeFontImport', 'end');
	}

	// log('ioFont_importFont', 'end');
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
