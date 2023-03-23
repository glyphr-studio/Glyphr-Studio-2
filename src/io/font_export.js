import { getCurrentProject, log } from '../app/main.js';
import { pause, round } from '../common/functions.js';
import { closeAllToasts, showToast } from '../controls/dialogs/dialogs.js';
import { decToHex, parseCharsInputAsHex } from '../common/character_ids.js';
import { getUnicodeShortName } from '../lib/unicode_names.js';
import openTypeJS from '../lib/opentypejs_1-3-1.js';
import { Glyph } from '../project_data/glyph.js';
import { sortLigatures } from '../project_data/glyphr_studio_project.js';

/**
	IO > Export > OpenType
	Using OpenType.js to convert a Glyphr Studio
	Project into OpenType.js format for saving.
**/

const ligatureSubstitutions = [];
const codePointGlyphIndexTable = {};

export async function ioFont_exportFont() {
	log('ioFont_exportFont', 'start');

	const options = createOptionsObject();
	const exportLists = populateExportList();

	let exportedItem;
	for (let g = 0; g < exportLists.glyphs.length; g++) {
		exportedItem = await generateOneGlyph(exportLists.glyphs[g]);
		options.glyphs.push(exportedItem);
	}

	for (let l = 0; l < exportLists.ligatures.length; l++) {
		exportedItem = await generateOneLigature(exportLists.ligatures[l]);
		options.glyphs.push(exportedItem);
	}

	showToast('Finalizing...');

	options.glyphs.sort(function (a, b) {
		return a.unicode - b.unicode;
	});

	// Create Font
	// log('NEW options ARG TO FONT');
	// log(options);
	const font = new openTypeJS.Font(options);
	ligatureSubstitutions.forEach((sub) => {
		log(`Adding ligature to font`);
		log(sub);
		font.substitution.addLigature('liga', sub);
	});
	log('Font object:');
	log(font.toTables());

	font.download();
	await pause();
	showToast('Export complete!');
	await pause(1000);

	closeAllToasts();
	log('ioFont_exportFont', 'end');
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
	options.glyphs = [];

	// log('NEW options ARG BEFORE GLYPHS');
	// log(options);
	// log('options.version ' + options.version);

	// Add Notdef
	const notdef = generateNotdefGlyph();
	// log(`notdef.advanceWidth: ${notdef.advanceWidth}`);

	const notdefPath = notdef.makeOpenTypeJSpath(new openTypeJS.Path());

	options.glyphs.push(
		new openTypeJS.Glyph({
			name: '.notdef',
			unicode: 0,
			index: 0,
			advanceWidth: round(notdef.advanceWidth),
			xMin: round(notdef.maxes.xMin),
			xMax: round(notdef.maxes.xMax),
			yMin: round(notdef.maxes.yMin),
			yMax: round(notdef.maxes.yMax),
			path: notdefPath,
		})
	);

	codePointGlyphIndexTable['0x0'] = 0;
	return options;
	// log('createOptionsObject', 'end');
}

function populateExportList() {
	// log('populateExportList', 'start');

	// Add Glyphs
	const exportGlyphs = [];
	const project = getCurrentProject();
	let thisGlyph;
	for (const key of Object.keys(project.glyphs)) {
		if (project.glyphs[key]) {
			if (parseInt(key)) {
				// thisGlyph = new Glyph(clone(project.glyphs[key]));
				thisGlyph = project.glyphs[key].clone();
				exportGlyphs.push({ xg: thisGlyph, xc: key });
			} else {
				console.warn('Skipped exporting Glyph ' + key + ' - non-numeric key value.');
			}
		}
	}

	exportGlyphs.sort(function (a, b) {
		return a.xc - b.xc;
	});

	// Add Ligatures
	const exportLigatures = [];
	// const ligWithCodePoint;
	for (const key of Object.keys(project.ligatures)) {
		if (project.ligatures[key]) {
			// log(project.ligatures[key]);

			if (project.ligatures[key].gsub.length > 1) {
				thisGlyph = project.ligatures[key].clone();
				// log(`\t adding ligature "${thisGlyph.name}"`);
				exportLigatures.push({ xg: thisGlyph, xc: key, chars: thisGlyph.chars });

				// ligWithCodePoint = doesLigatureHaveCodePoint(l);
				// if (ligWithCodePoint) {
				// 	// log(`\t LIGATURE WITH CODE POINT FOUND for ${l} at ${ligWithCodePoint.point}`);
				// 	const dupe = new Glyph(
				// 		clone(_GP.ligatures[l], 'ioOTF export.populateExportLists - ligature with code point')
				// 	);
				// 	exportGlyphs.push({ xg: dupe, xc: ligWithCodePoint.point });
				// 	if (parseInt(l) >= 0xe000) privateUseArea.push(parseInt(l));
				// }
			} else {
				console.warn(`
					Skipped exporting ligature ${project.ligatures[key].name}.
					Source chars length: ${project.ligatures[key].gsub.length}
				`);
			}
		}
	}
	exportLigatures.sort(sortLigatures);
	// log('exportLigatures');
	// log(exportLigatures);

	// log('populateExportList', 'end');
	return { glyphs: exportGlyphs, ligatures: exportLigatures };
}

async function generateOneGlyph(currentExportItem) {
	log('generateOneGlyph', 'start');
	// export this glyph
	const project = getCurrentProject();
	const glyph = currentExportItem.xg;
	const num = currentExportItem.xc;
	const comb = project.settings.app.combinePathsOnExport;
	const maxes = glyph.maxes;

	log(glyph.name);

	showToast('Exporting<br>' + glyph.name, 999999);

	if (comb && glyph.paths.length <= project.settings.app.maxCombinePathsOnExport) {
		glyph.combineAllPaths(true);
	}

	const thisPath = glyph.makeOpenTypeJSpath(new openTypeJS.Path());
	// log('openTypeJS thisPath');
	// log(thisPath);
	const thisIndex = getNextGlyphIndexNumber();
	const thisAdvance = round(glyph.advanceWidth || 1); // has to be non-zero
	const thisGlyph = new openTypeJS.Glyph({
		name: getUnicodeShortName(decToHex(num)),
		unicode: parseInt(num),
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
	log(thisGlyph);
	log('generateOneGlyph', 'end');
	return thisGlyph;
}

async function generateOneLigature(currentExportItem) {
	log(`generateOneLigature`, 'start');
	log(currentExportItem);

	// export this glyph
	const project = getCurrentProject();
	const liga = currentExportItem.xg;
	const comb = project.settings.app.combinePathsOnExport;
	const maxes = liga.maxes;

	// log(`generateOneLigature: ${ligaID}\t${liga.name}\t${getNameForExport(ligaID)}`);
	showToast('Exporting<br>' + liga.name, 999999);

	if (comb && liga.paths.length <= project.settings.app.maxCombinePathsOnExport) {
		liga.combineAllShapes(true);
	}

	const thisPath = liga.makeOpenTypeJSpath(new openTypeJS.Path());
	const thisIndex = getNextGlyphIndexNumber();
	log(`thisIndex: ${thisIndex}`);


	const glyphInfo = {
		name: liga.name,
		index: thisIndex,
		advanceWidth: round(liga.advanceWidth || 1), // has to be non-zero
		path: thisPath,
		xMin: round(maxes.xMin),
		xMax: round(maxes.xMax),
		yMin: round(maxes.yMin),
		yMax: round(maxes.yMax),
	};

	// Add substitution info to font
	const indexList = liga.gsub.map((v) => codePointGlyphIndexTable[v]);
	log(`\t INDEX sub: [${indexList.toString()}] by: ${thisIndex}}`);
	ligatureSubstitutions.push({ sub: indexList, by: thisIndex });
	// log(glyphInfo);

	await pause();
	log(`generateOneLigature`, 'end');
	return new openTypeJS.Glyph(glyphInfo);
}

let currentIndex = 0;
function getNextGlyphIndexNumber() {
	currentIndex += 1;
	return currentIndex;
}

function generateNotdefGlyph() {
	// log(`generateNotdefGlyph`, 'start');
	const capHeight = getCurrentProject().settings.font.capHeight;
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

	let notdef = new Glyph({
		name: 'notdef',
		advanceWidth: 432,
		paths: notDefGlyphPaths,
	});
	// log(`notdef.maxes: ${notdef.maxes}`);
	// log(`capHeight ${capHeight}`);
	// log(`notdef.maxes.yMax ${notdef.maxes.yMax}`);

	if (capHeight !== 700) {
		let delta = capHeight - 700;
		// log(`delta is ${delta}`);
		notdef.updateGlyphSize(false, delta, true);
		// log(notdef);

		notdef.advanceWidth = notdef.maxes.xMax;
		// log(`notdef.maxes.height ${notdef.maxes.yMax}`);
	}

	// log(notdef);
	// log(`generateNotdefGlyph`, 'end');
	return notdef;
}
