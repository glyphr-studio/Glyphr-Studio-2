import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { round } from '../common/functions.js';
import { getUnicodeName, parseUnicodeInput } from '../common/unicode.js';
import { showError } from '../controls/dialogs.js';
import { updateProgressIndicator } from '../controls/progress-indicator/progress-indicator.js';
import { getUnicodeBlockByName } from '../lib/unicode_blocks.js';
import { XMLtoJSON } from '../lib/xml_to_json.js';
import { importOverflowCount, isOutOfBounds } from '../pages/open_project.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { Path } from '../project_data/path.js';
import {
	ioSVG_cleanAndFormatPathDefinition,
	ioSVG_convertSVGTagToPath,
	ioSVG_getTags,
} from './svg_outline_import.js';

/**
	IO > Import > SVG Font
	Reading XML Text and parsing it into Glyphr
	Studio Objects.  Relies heavily on
	IO > Import > SVG Outline
**/

export function ioSVG_importSVGfont(font) {
	// log('ioSVG_importSVGfont', 'start');

	const project = getCurrentProject();
	let chars;

	// TODO kerning
	// let kerns;

	const latinExtendedB = getUnicodeBlockByName('Latin Extended-B');

	setTimeout(setupFontImport, 10);

	function setupFontImport() {
		// log('setupFontImport', 'start');
		updateProgressIndicator('Reading font data...');

		// Get Kerns
		// TODO kerning
		// kerns = ioSVG_getTags(font, 'hkern');

		// Get Glyphs
		chars = ioSVG_getTags(font, 'glyph');

		// test for range
		// if (chars.length < importOverflowCount) {
		// 	setTimeout(startFontImport, 10);
		// 	// Dump JSON
		// 	// saveFile('Parsed JSON', json(jsonData));
		// } else {
		// 	showError(`Number of glyphs exceeded maximum of ${importOverflowCount}`);
		// 	// log('setupFontImport', 'end');
		// 	return;
		// }

		updateProgressIndicator(`
			Importing glyph:
			<span class="progress-indicator__counter">1</span>
			 of
			<span class="progress-indicator__counter">${chars.length}</span>
		`);
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
	const finalGlyphs = {};
	let charCounter = 0;

	function importOneGlyph() {
		updateProgressIndicator(`
			Importing glyph:
			<span class="progress-indicator__counter">${charCounter}</span>
			 of
			<span class="progress-indicator__counter">${chars.length}</span>
		`);

		if (charCounter >= chars.length) {
			// TODO Kerning
			// setTimeout(importOneKern, 10);
			updateProgressIndicator('Finalizing the imported font...');
			setTimeout(startFinalizeFontImport, 10);

			return;
		}

		// One Glyph or Ligature in the font
		const attributes = chars[charCounter].attributes;

		// Get the appropriate unicode decimal for this char
		// log('importOneGlyph', 'start');
		// log('starting  unicode \t' + attributes.unicode + ' \t ' + attributes['glyph-name']);

		let uni = parseUnicodeInput(attributes.unicode);
		if (attributes.unicode === ' ') uni = ['0x0020'];

		if (uni === false) {
			// Check for .notdef
			// log('!!! Skipping '+attributes['glyph-name']+' NO UNICODE !!!');
			chars.splice(charCounter, 1);
		} else if (isOutOfBounds(uni)) {
			// log('!!! Skipping '+attributes['glyph-name']+' OUT OF BOUNDS !!!');
			chars.splice(charCounter, 1);
		} else {
			// log('GLYPH ' + charCounter + '/'+chars.length+'\t unicode: ' + json(uni) + '\t attributes: ' + json(attributes));
			/*
			 *
			 *  GLYPH OR LIGATURE IMPORT
			 *
			 */
			const newPaths = [];
			let pathCounter = 0;

			// Import Path Data
			let data = attributes.d;
			// log('Glyph has path data ' + data);
			if (data && data !== 'z') {
				data = ioSVG_cleanAndFormatPathDefinition(data);

				// log('split z, data into ' + data.length + ' Glyphr Studio paths.');
				// log(data);

				data.forEach((pathData) => {
					if (pathData.length) {
						// log('starting convertPathTag');
						let newPath = ioSVG_convertSVGTagToPath(pathData);
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

			// Get Advance Width
			const advanceWidth = parseInt(attributes['horiz-adv-x']);

			if (uni.length === 1) {
				// It's a GLYPH
				// Get some range data
				uni = uni[0];
				minChar = Math.min(minChar, uni);
				maxChar = Math.max(maxChar, uni);
				if (1 * uni > latinExtendedB.end) customGlyphRange.push(uni);

				finalGlyphs[uni] = new Glyph({
					paths: newPaths,
					advanceWidth: advanceWidth,
				});
				if (getUnicodeName(uni) === '[name not found]')
					project.projectSettings.filterNonCharPoints = false;
			} else {
				// It's a LIGATURE
				uni = uni.join('');
				finalLigatures[uni] = new Glyph({
					paths: newPaths,
					advanceWidth: advanceWidth,
				});
			}

			// Successful loop, advance charCounter
			charCounter++;
		}

		// finish loop
		setTimeout(importOneGlyph, 10);

		// log('importOneGlyph', 'end');
	}

	/*
	 *
	 *  KERN IMPORT
	 *
	 */
	let thisKern;
	let leftGroup;
	let rightGroup;
	let newID;
	let kernValue;
	const finalKerns = {};
	let kernCount = 0;

	function importOneKern() {
		if (kernCount >= kerns.length) {
			updateProgressIndicator('Finalizing the imported font...');
			setTimeout(startFinalizeFontImport, 10);
			return;
		}

		updateProgressIndicator('Importing Kern Pair ' + kernCount + ' of ' + kerns.length);

		// log('Kern Import - START ' + kernCount + '/' + kerns.length);
		leftGroup = [];
		rightGroup = [];
		thisKern = kerns[kernCount];
		// log('Kern Attributes: ' + json(thisKern.attributes, true));

		// Get members by name
		leftGroup = getKernMembersByName(thisKern.attributes.g1, chars, leftGroup, latinExtendedB.end);
		rightGroup = getKernMembersByName(
			thisKern.attributes.g2,
			chars,
			rightGroup,
			latinExtendedB.end
		);

		// log('kern groups by name ' + json(leftGroup, true) + ' ' + json(rightGroup, true));

		// Get members by Unicode
		leftGroup = getKernMembersByUnicodeID(
			thisKern.attributes.u1,
			chars,
			leftGroup,
			latinExtendedB.end
		);
		rightGroup = getKernMembersByUnicodeID(
			thisKern.attributes.u2,
			chars,
			rightGroup,
			latinExtendedB.end
		);

		// log('kern groups parsed as ' + json(leftGroup, true) + ' ' + json(rightGroup, true));

		if (leftGroup.length && rightGroup.length) {
			newID = generateNewID(finalKerns, 'kern');
			kernValue = thisKern.attributes.k || 0;
			// log('Making a kern pair with k = ' + kernValue);
			finalKerns[newID] = new HKern({
				leftGroup: leftGroup,
				rightGroup: rightGroup,
				value: kernValue,
			});
			// log('Made the new kern successfully.');
			kernCount++;
		} else {
			kerns.splice(kernCount, 1);
			// log('Kern ' + json(thisKern.attributes, true) + ' returned an empty group.');
		}

		// log('Kern Import', 'end');
		setTimeout(importOneKern, 10);
	}

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
		const editor = getCurrentProjectEditor();
		project.glyphs = finalGlyphs;
		// TODO Ligatures
		// project.ligatures = finalLigatures;
		// TODO Kerning
		// project.kerning = finalKerns;

		/*
		REFACTOR
		let rangeStart;
		let rend;
		for (const r of Object.keys(_UI.glyphRange)) {
			rangeStart = 1 * _UI.glyphRange[r].begin;
			rend = 1 * _UI.glyphRange[r].end + 1;
			for (let t = rangeStart; t < rend; t++) {
				if (getGlyph(t)) {
					project.projectSettings.glyphRanges[r] = true;
					break;
				}
			}
		}
		*/

		// Make a custom range for the rest
		if (customGlyphRange.length) {
			customGlyphRange = customGlyphRange.sort();
			project.projectSettings.glyphRanges.push({
				begin: customGlyphRange[0],
				end: customGlyphRange[customGlyphRange.length - 1],
			});
		}

		// Import Font Settings
		// Check to make sure certain stuff is there
		// space has horiz-adv-x

		// Font Settings
		const fontAttributes = getFirstTagInstance(font, 'font-face').attributes;
		const ps = project.projectSettings;
		const md = project.metadata;
		const fname = fontAttributes['font-family'] || 'My Font';

		ps.upm = 1 * fontAttributes['units-per-em'] || 1000;
		ps.name = fname;
		ps.ascent = 1 * fontAttributes.ascent || 700;
		ps.capHeight = 1 * fontAttributes['cap-height'] || 675;
		ps.xHeight = 1 * fontAttributes['x-height'] || 400;
		ps.overshoot = round(ps.upm / 100);
		md.font_family = fname;
		md.panose_1 = fontAttributes['panose-1'] || '0 0 0 0 0 0 0 0 0 0';
		md.font_weight = 1 * fontAttributes['font-weight'] || 400;
		md.font_stretch = fontAttributes['font-stretch'] || 'normal';
		md.underline_position = 1 * fontAttributes['underline-position'] || -50;
		md.underline_thickness = 1 * fontAttributes['underline-thickness'] || 10;
		md.strikethrough_position = 1 * fontAttributes['strikethrough-position'] || 300;
		md.strikethrough_thickness = 1 * fontAttributes['strikethrough-thickness'] || 10;
		md.overline_position = 1 * fontAttributes['overline-position'] || 750;
		md.overline_thickness = 1 * fontAttributes['overline-thickness'] || 10;

		editor.nav.page = 'Overview';
		editor.navigate();
		// log('ioSVG_importSVGfont', 'end');
	}
	// log('ioSVG_importSVGfont', 'end');
}

export function getFirstTagInstance(obj, tagname) {
	// log('getFirstTagInstance', 'start');
	// log('finding ' + tagname + ' in:');
	// log(obj);

	if (tagname === obj.name) {
		// log('getFirstTagInstance - tagname === obj.name', 'end');
		return obj;
	} else if (obj.content) {
		for (let c = 0; c < obj.content.length; c++) {
			const sub = getFirstTagInstance(obj.content[c], tagname);
			if (sub) {
				// log('getFirstTagInstance - looked through obj and found it', 'end');
				return sub;
			}
		}
	} else {
		// log('getFirstTagInstance - NO obj.content FOUND', 'end');
		return false;
	}
}

function getKernMembersByName(names, chars, arr, limit) {
	limit = limit || 0xffff;
	let uni;
	if (names) {
		names = names.split(',');

		// Check all the glyph names
		for (let n = 0; n < names.length; n++) {
			// Check all the chars
			for (let c = 0; c < chars.length; c++) {
				if (chars[c].attributes.unicode) {
					// Push the match
					if (names[n] === chars[c].attributes['glyph-name']) {
						uni = parseUnicodeInput(chars[c].attributes.unicode);
						if (1 * uni < limit) arr = arr.concat(uni);
					}
				}
			}
		}
	}

	return arr;
}

function getKernMembersByUnicodeID(ids, chars, arr, limit) {
	limit = limit || 0xffff;
	let uni;
	if (ids) {
		ids = ids.split(',');

		// Check all the IDs
		for (let i = 0; i < ids.length; i++) {
			// Check all the chars
			for (let c = 0; c < chars.length; c++) {
				if (chars[c].attributes.unicode) {
					// Push the match
					if (ids[i] === chars[c].attributes.unicode) {
						uni = parseUnicodeInput(chars[c].attributes.unicode);
						if (1 * uni < limit) arr = arr.concat(uni);
					}
				}
			}
		}
	}

	return arr;
}
