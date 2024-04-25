import { getCurrentProject } from '../app/main.js';
import { decToHex, parseCharsInputAsHex } from '../common/character_ids.js';
import { pause, round } from '../common/functions.js';
import { closeAllToasts, showToast } from '../controls/dialogs/dialogs.js';
import openTypeJS from '../lib/opentype/opentypejs_1-3-1.js';
import { getUnicodeShortName } from '../lib/unicode/unicode_names.js';
import { Glyph } from '../project_data/glyph.js';
import { sortLigatures } from '../project_data/glyphr_studio_project.js';
import { makeGlyphWithResolvedLinks } from '../project_editor/cross_item_actions.js';

/**
	IO > Export > OpenType
	Using OpenType.js to convert a Glyphr Studio
	Project into OpenType.js format for saving.
**/

const ligatureSubstitutions = [];
const codePointGlyphIndexTable = {};

export async function ioFont_exportFont() {
	// log('ioFont_exportFont', 'start');
	const options = createOptionsObject();
	const exportLists = populateExportList();
	// Add .notdef
	addNotdefToExport(options);

	// Add Characters
	let exportedItem;
	for (let g = 0; g < exportLists.glyphs.length; g++) {
		exportedItem = await generateOneGlyph(exportLists.glyphs[g]);
		options.glyphs.push(exportedItem);
	}
	// log(`\n⮟codePointGlyphIndexTable⮟`);
	// log(codePointGlyphIndexTable);

	// Add Ligatures
	let exportLigatures = getCurrentProject().settings.app.exportLigatures;
	if (exportLigatures) {
		for (let l = 0; l < exportLists.ligatures.length; l++) {
			exportedItem = await generateOneLigature(exportLists.ligatures[l]);
			options.glyphs.push(exportedItem);
		}
	}
	showToast('Finalizing...');

	options.glyphs.sort(function (a, b) {
		return a.unicode - b.unicode;
	});

	// Create Font
	// log('NEW options ARG TO FONT');
	// log(options);
	const font = new openTypeJS.Font(options);

	if (exportLigatures) {
		ligatureSubstitutions.forEach((sub) => {
			// log(`Adding ligature to font`);
			// log(sub);
			font.substitution.addLigature('liga', sub);
		});
	}

	// TODO investigate advanced table values
	/*
	font.tables.os2.ySuperscriptYSize = 1234;
	// log('Font object:');
	// log(font);
	// log(font.toTables());
	*/

	font.download();
	await pause();
	showToast('Export complete!');
	await pause(1000);

	closeAllToasts();
	// log('ioFont_exportFont', 'end');
}

function createOptionsObject() {
	// log('createOptionsObject', 'start');

	// Add settings
	const options = {};
	const project = getCurrentProject();
	const fontSettings = project.settings.font;

	options.unitsPerEm = fontSettings.upm || 1000;
	options.ascender = fontSettings.ascent || 0.00001;
	options.descender = -1 * Math.abs(fontSettings.descent) || -0.00001;
	options.familyName = fontSettings.family || ' ';
	options.styleName = fontSettings.style || ' ';
	options.designer = fontSettings.designer || ' ';
	options.designerURL = fontSettings.designerURL || ' ';
	options.manufacturer = fontSettings.manufacturer || ' ';
	options.manufacturerURL = fontSettings.manufacturerURL || ' ';
	options.license = fontSettings.license || ' ';
	options.licenseURL = fontSettings.licenseURL || ' ';
	options.version = fontSettings.version || 'Version 0.001';
	options.description = fontSettings.description || ' ';
	options.copyright = fontSettings.copyright || ' ';
	options.trademark = fontSettings.trademark || ' ';
	options.weightClass = parseInt(fontSettings.weight);
	options.panose = fontSettings.panose.split(' ').map(Number) || [];
	options.italicAngle = fontSettings.italicAngle || 0;
	options.slope = fontSettings.slope || 0;

	options.glyphs = [];

	// log('NEW options ARG BEFORE GLYPHS');
	// log(options);
	// log('options.version ' + options.version);

	return options;
	// log('createOptionsObject', 'end');
}

const ligatureToCodepoint = {
	ae: '0xE6',
	AE: '0xC6',
	ff: '0xFB00',
	fi: '0xFB01',
	fl: '0xFB02',
	oe: '0x153',
	OE: '0x152',
	st: '0xFB06',
	ffi: '0xFB03',
	ffl: '0xFB04',
};

function populateExportList() {
	// log('populateExportList', 'start');
	const project = getCurrentProject();

	// Add Glyphs
	let checklist = [];
	let exportGlyphs = [];

	project.settings.project.characterRanges.forEach((range) => {
		if (range.enabled) {
			range.getMemberIDs().forEach((hexID) => {
				if (checklist.indexOf(hexID) === -1) {
					const thisGlyph = project.getItem(`glyph-${hexID}`);
					if (thisGlyph) {
						exportGlyphs.push({ xg: thisGlyph, xc: hexID });
						checklist.push(hexID);
					}
				}
			});
		}
	});

	exportGlyphs.sort((a, b) => a.xc - b.xc);

	// Add Ligatures
	const exportLigatures = [];
	// const ligWithCodePoint;
	if (project.settings.app.exportLigatures) {
		for (const key of Object.keys(project.ligatures)) {
			// log(project.ligatures[key]);
			if (project.ligatures[key].gsub.length > 1) {
				const thisLigature = project.ligatures[key];
				// log(`\t adding ligature "${thisLigature.name}"`);
				exportLigatures.push({ xg: thisLigature, xc: key, chars: thisLigature.chars });

				/*
					When exporting to OTF, if a ligature depends on certain
					characters, and one or more of those characters do not
					exist in the font, it causes an error.
					This will check to see if Glyph objects exist for all
					Ligature source characters, and if some are missing, it
					will create blank Glyphs for them.
				 */
				project.ligatures[key].gsub.forEach((charID) => {
					const hexID = '' + decToHex(charID);
					const id = `glyph-${hexID}`;
					if (!project.glyphs[id]) {
						// log(`No glyph found for charID ${charID} id ${id}`);
						const newGlyph = project.addItemByType(new Glyph({ id: id }), 'Glyph', id);
						if (!checklist.includes(hexID)) {
							exportGlyphs.push({ xg: newGlyph, xc: hexID });
							checklist.push(hexID);
						}
					}
				});

				/*
					Some Latin ligatures have Unicode code points. Check to see if
					this ligature is one of those, and if so, also put it in that
					code point
				*/
				const ligaHexID = ligatureToCodepoint[thisLigature.chars];
				if (ligaHexID) {
					exportGlyphs.push({ xg: thisLigature, xc: ligaHexID });
					checklist.push(ligaHexID);
				}
			} else {
				console.warn(`
				Skipped exporting ligature ${project.ligatures[key].name}.
				Source chars length: ${project.ligatures[key].gsub.length}
			`);
			}
		}
		exportLigatures.sort(sortLigatures);
		// log('exportLigatures');
		// log(exportLigatures);
	}

	// Add Kerns
	if (project.settings.app.exportKerning) {
		// TODO Export kerning?
	}

	// log('populateExportList', 'end');
	return { glyphs: exportGlyphs, ligatures: exportLigatures };
}

function addNotdefToExport(options) {
	const project = getCurrentProject();
	let notdef = project.getItem('glyph-0x0');
	if (!notdef) {
		const capHeight = project.settings.font.capHeight;
		const notDefGlyphPaths = [
			{
				name: 'Outer Phi Rectangle',
				pathPoints: [
					{ p: { coord: { x: 0, y: 700 } } },
					{ p: { coord: { x: 432, y: 700 } } },
					{ p: { coord: { x: 432, y: 0 } } },
					{ p: { coord: { x: 0, y: 0 } } },
				],
				winding: -4,
			},
			{
				name: 'Inner Phi Rectangle',
				pathPoints: [
					{ p: { coord: { x: 50, y: 50 } } },
					{ p: { coord: { x: 382, y: 50 } } },
					{ p: { coord: { x: 382, y: 650 } } },
					{ p: { coord: { x: 50, y: 650 } } },
				],
				winding: 4,
			},
		];

		notdef = new Glyph({
			advanceWidth: 432,
			shapes: notDefGlyphPaths,
		});

		if (capHeight !== 700) {
			let delta = capHeight - 700;
			notdef.updateGlyphSize({ height: delta, ratioLock: true });
			notdef.advanceWidth = notdef.maxes.xMax;
		}
	}

	// Add it to the export
	const notdefPath = makeOpenTypeJS_Glyph(notdef, new openTypeJS.Path());
	let thisAdvance = notdef.advanceWidth;
	if (thisAdvance === 0) thisAdvance = 0.000001;
	else thisAdvance = round(thisAdvance); // TODO investigate zero advance width

	options.glyphs.push(
		new openTypeJS.Glyph({
			name: 'null',
			unicode: 0,
			index: 0,
			advanceWidth: thisAdvance,
			xMin: round(notdef.maxes.xMin),
			xMax: round(notdef.maxes.xMax),
			yMin: round(notdef.maxes.yMin),
			yMax: round(notdef.maxes.yMax),
			path: notdefPath,
		})
	);

	codePointGlyphIndexTable['0x0'] = 0;
}

async function generateOneGlyph(currentExportItem) {
	// log('generateOneGlyph', 'start');
	// export this glyph
	const glyph = currentExportItem.xg;
	const num = currentExportItem.xc;
	const maxes = glyph.maxes;

	// log(`num: ${num}`);
	// log(`\n⮟glyph⮟`);
	// log(glyph);

	showToast('Exporting<br>' + glyph.name, 999999);

	// Path data
	const thisPath = makeOpenTypeJS_Glyph(glyph, new openTypeJS.Path());
	// log('openTypeJS thisPath');
	// log(thisPath);

	// Index & Unicode
	const thisIndex = getNextGlyphIndexNumber();
	// log(`thisIndex: ${thisIndex}`);
	const thisUnicode = parseInt(num);
	// log(`thisUnicode: ${thisUnicode}`);

	// Name
	const thisName = getUnicodeShortName(decToHex(num));
	// log(`decToHex(num): ${decToHex(num)}`);
	// log(`thisName: ${thisName}`);

	// Advance width
	let thisAdvance = glyph.advanceWidth;
	if (thisAdvance === 0) thisAdvance = 0.000001; // TODO investigate zero advance width

	// Create OTF.js Glyph
	const thisGlyph = new openTypeJS.Glyph({
		name: thisName,
		unicode: thisUnicode,
		index: thisIndex,
		advanceWidth: thisAdvance,
		xMin: round(maxes.xMin),
		xMax: round(maxes.xMax),
		yMin: round(maxes.yMin),
		yMax: round(maxes.yMax),
		path: thisPath,
	});

	// Add this finished glyph
	codePointGlyphIndexTable[parseCharsInputAsHex(glyph.chars)] = thisIndex;

	await pause();
	// log(thisGlyph);
	// log('generateOneGlyph', 'end');
	return thisGlyph;
}

async function generateOneLigature(currentExportItem) {
	// log(`generateOneLigature`, 'start');
	// log(currentExportItem);

	// export this glyph
	const liga = currentExportItem.xg;
	const maxes = liga.maxes;

	// log(`generateOneLigature: ${ligaID}\t${liga.name}\t${getNameForExport(ligaID)}`);
	showToast('Exporting<br>' + liga.name, 999999);

	const thisPath = makeOpenTypeJS_Glyph(liga, new openTypeJS.Path());
	const thisIndex = getNextGlyphIndexNumber();
	// log(`thisIndex: ${thisIndex}`);

	const glyphInfo = {
		name: generateLigatureExportName(liga),
		index: thisIndex,
		advanceWidth: round(liga.advanceWidth || 1), // has to be non-zero
		path: thisPath,
		xMin: round(maxes.xMin),
		xMax: round(maxes.xMax),
		yMin: round(maxes.yMin),
		yMax: round(maxes.yMax),
	};

	// Add substitution info to font
	const indexList = liga.gsub.map((v) => codePointGlyphIndexTable[decToHex(v)]);
	// log(`\t INDEX sub: [${indexList.toString()}] by: ${thisIndex}}`);
	ligatureSubstitutions.push({ sub: indexList, by: thisIndex });
	// log(glyphInfo);

	await pause();
	// log(`generateOneLigature`, 'end');
	return new openTypeJS.Glyph(glyphInfo);
}

function generateLigatureExportName(lig) {
	let result = 'lig';

	lig.gsub.forEach((char) => {
		let shortName = getUnicodeShortName(decToHex(char));
		if (!shortName || shortName === '[name not found]') shortName = '?';
		result += '.' + shortName;
	});

	return result;
}

let currentIndex = 0;
function getNextGlyphIndexNumber() {
	currentIndex += 1;
	return currentIndex;
}

function makeOpenTypeJS_Glyph(item, openTypePath) {
	// log(`makeOpenTypeJS_Glyph`, 'start');
	let flatItem = makeGlyphWithResolvedLinks(item);
	flatItem.shapes.forEach((shape) => {
		if (shape.objType === 'Path') {
			openTypePath = makeOpenTypeJS_Path(shape, openTypePath);
		}
	});
	// log(`makeOpenTypeJS_Glyph`, 'end');
	return openTypePath;
}

function makeOpenTypeJS_Path(path, openTypePath) {
	// log('makeOpenTypeJS_Path', 'start');
	// log('openTypePath:');
	// log(openTypePath);

	if (!path.pathPoints || path.pathPoints.length === 0 || !path.pathPoints[0]) {
		// log('!!!Path has zero points!');
		openTypePath.close();
		return openTypePath;
	}

	path.reverseWinding(); // OTF.js reverses the winding for some reason

	openTypePath.moveTo(round(path.pathPoints[0].p.x), round(path.pathPoints[0].p.y));

	path.pathPoints.forEach((point) => {
		const nextPoint = path.pathPoints[path.getNextPointNum(point.pointNumber)];
		openTypePath.curveTo(
			round(point.h2.x),
			round(point.h2.y),
			round(nextPoint.h1.x),
			round(nextPoint.h1.y),
			round(nextPoint.p.x),
			round(nextPoint.p.y)
		);
	});

	openTypePath.close();
	path.reverseWinding(); // Put it back

	// log('returning path');
	// log(openTypePath);
	// log('makeOpenTypeJS_Path', 'end');
	return openTypePath;
}
