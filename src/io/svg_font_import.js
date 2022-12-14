import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { round } from '../common/functions.js';
import { getUnicodeName, parseUnicodeInput } from '../common/unicode.js';
import { updateImportStatus } from '../controls/loading-spinner.js';
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

export function ioSVG_importSVGFont() {
	// log('ioSVG_importSVGFont', 'start');

	// Font Stuff
	let font;
	let chars;

	// TODO kerning
	// let kerns;

	const latinExtendedB = getUnicodeBlockByName('Latin Extended-B');

	setTimeout(setupFontImport, 10);

	function setupFontImport() {
		// log('setupFontImport', 'start');
		updateImportStatus('Reading font data...');
		const newProject = new GlyphrStudioProject();

		try {
			// Get Font
			let svgData = getGlyphrStudioApp().temp.droppedFileContent;
			// Convert unicode glyphs to decimal values
			// DOM Parser does not return unicode values as text strings
			// Kern groups containing '&#x' will get fuck'd
			svgData = svgData.replace(/&#x/g, '0x');
			const jsonData = XMLtoJSON(svgData);
			font = getFirstTagInstance(jsonData, 'font');
		} catch (e) {
			showError('There was a problem reading the SVG file:<br>' + e.message);
			// log('setupFontImport', 'end');
			return;
		}

		// Check to see if it's actually a SVG Font
		if (!font) {
			showError(
				'The SVG file you tried to load was not a SVG Font file. See Glyphr Studio help for more information.'
			);
			// log('setupFontImport', 'end');
			return;
		}

		// Get Kerns
		// TODO kerning
		// kerns = ioSVG_getTags(font, 'hkern');

		// Get Glyphs
		chars = ioSVG_getTags(font, 'glyph');

		// test for range
		if (chars.length < importOverflowCount) {
			setTimeout(startFontImport, 1);
			// Dump JSON
			// saveFile('Parsed JSON', json(jsonData));
		} else {
			showError(`Number of glyphs exceeded maximum of ${importOverflowCount}`);
			// log('setupFontImport', 'end');
			return;
		}

		// log('setupFontImport', 'end');
	}

	function startFontImport() {
		// log('startFontImport', 'start');
		updateImportStatus('Importing Glyph 1 of ' + chars.length);
		setTimeout(importOneGlyph, 4);
		// log('startFontImport', 'end');
	}

	/*
	 *
	 *  GLYPH IMPORT
	 *
	 */
	let tca;
	let data;
	let uni;
	let np;
	let adv;
	let maxGlyph = 0;
	let minChar = 0xffff;
	let customGlyphRange = [];
	let pathCounter = 0;
	let newPaths = [];
	let finalGlyphs = {};
	let finalLigatures = {};
	let charCounter = 0;

	function importOneGlyph() {
		updateImportStatus('Importing Glyph ' + charCounter + ' of ' + chars.length);

		if (charCounter >= chars.length) {
			// TODO Kerning
			// setTimeout(importOneKern, 1);
			updateImportStatus('Finalizing the imported font...');
			setTimeout(startFinalizeFontImport, 1);

			return;
		}

		// One Glyph or Ligature in the font
		tca = chars[charCounter].attributes;

		// Get the appropriate unicode decimal for this char
		// log('importOneGlyph', 'start');
		// log('starting  unicode \t' + tca.unicode + ' \t ' + tca['glyph-name']);

		uni = parseUnicodeInput(tca.unicode);

		if (tca.unicode === ' ') uni = ['0x0020'];

		if (uni === false) {
			// Check for .notdef
			// log('!!! Skipping '+tca['glyph-name']+' NO UNICODE !!!');
			chars.splice(charCounter, 1);
		} else if (isOutOfBounds(uni)) {
			// log('!!! Skipping '+tca['glyph-name']+' OUT OF BOUNDS !!!');
			chars.splice(charCounter, 1);
		} else {
			// log('GLYPH ' + charCounter + '/'+chars.length+'\t unicode: ' + json(uni) + '\t attributes: ' + json(tca));
			/*
			 *
			 *  GLYPH OR LIGATURE IMPORT
			 *
			 */
			newPaths = [];
			pathCounter = 0;

			// Import Path Data
			data = tca.d;
			// log('Glyph has path data ' + data);
			if (data && data !== 'z') {
				data = ioSVG_cleanAndFormatPathDefinition(data);

				// log('split z, data into ' + data.length + ' Glyphr Studio paths.');
				// log(data);

				for (let d = 0; d < data.length; d++) {
					if (data[d].length) {
						// log('starting convertPathTag');
						np = ioSVG_convertSVGTagToPath(data[d]);
						// log('created path from PathTag');
						// log(np);
						if (np.pathPoints.length) {
							pathCounter++;
							np.name = `Path ${pathCounter}`;
							newPaths.push(np);
						} else {
							// log('!!!!!!!!!!!!!!!!!!\n\t data resulted in no path points: ' + data[d]);
						}
					}
				}
			}

			// Get Advance Width
			adv = parseInt(tca['horiz-adv-x']);

			if (uni.length === 1) {
				// It's a GLYPH
				// Get some range data
				uni = uni[0];
				minChar = Math.min(minChar, uni);
				maxGlyph = Math.max(maxGlyph, uni);
				if (1 * uni > latinExtendedB.end) customGlyphRange.push(uni);

				finalGlyphs[uni] = new Glyph({
					paths: newPaths,
					advanceWidth: adv,
				});
				if (getUnicodeName(uni) === '[name not found]')
					getCurrentProject().projectSettings.filterNonCharPoints = false;
			} else {
				// It's a LIGATURE
				uni = uni.join('');
				finalLigatures[uni] = new Glyph({
					paths: newPaths,
					advanceWidth: adv,
				});
			}

			// Successful loop, advance charCounter
			charCounter++;
		}

		// finish loop
		setTimeout(importOneGlyph, 1);

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
	let finalKerns = {};

	let kernCount = 0;
	function importOneKern() {
		if (kernCount >= kerns.length) {
			updateImportStatus('Finalizing the imported font...');
			setTimeout(startFinalizeFontImport, 1);
			return;
		}

		updateImportStatus('Importing Kern Pair ' + kernCount + ' of ' + kerns.length);

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
		setTimeout(importOneKern, 1);
	}

	/*
	 *
	 *  FINALIZE
	 *
	 */
	function startFinalizeFontImport() {
		updateImportStatus('Finalizing the imported font...');
		setTimeout(finalizeFontImport, 4);
	}

	function finalizeFontImport() {
		const project = getCurrentProject();
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

		editor.nav.page = 'Glyph edit';
		editor.navigate();
		// log('ioSVG_importSVGFont', 'end');
	}
	// log('ioSVG_importSVGFont', 'end');
}

function getFirstTagInstance(obj, tagname) {
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
