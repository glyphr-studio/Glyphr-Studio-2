import { getCurrentProject } from '../../app/main.js';
import { decToHex, parseCharsInputAsHex } from '../../common/character_ids.js';
import { pause, round } from '../../common/functions.js';
import { closeAllToasts, showError, showToast } from '../../controls/dialogs/dialogs.js';
import openTypeJS from '../../lib/opentype.js-september-2024-kern-write/opentype.mjs';
import { getUnicodeShortName } from '../../lib/unicode/unicode_names.js';
import { Glyph } from '../../project_data/glyph.js';
import { sortLigatures } from '../../project_data/glyphr_studio_project.js';
import { Path } from '../../project_data/path.js';
import { makeGlyphWithResolvedLinks } from '../../project_editor/cross_item_actions.js';
import { saveFile } from '../../project_editor/file_io.js';
import { writeGposKernDataToFont } from './tables/gpos.js';

/**
	IO > Export > OpenType
	Using OpenType.js to convert a Glyphr Studio
	Project into OpenType.js format for saving.
**/

let ligatureSubstitutions = [];
let codePointGlyphIndexTable = {};

/**
 * Exports the current project to an .otf file
 */
export async function ioFont_exportFont() {
	// log('ioFont_exportFont', 'start');
	const options = createOptionsObject();
	const exportLists = populateExportList();
	const project = getCurrentProject();
	ligatureSubstitutions = [];
	codePointGlyphIndexTable = {};
	// Add .notdef
	addNotdefToExport(options);

	// Add Characters
	let exportedItem;
  const upm = project.settings.font.upm;
	for (let g = 0; g < exportLists.glyphs.length; g++) {
    exportedItem = await generateOneGlyph(exportLists.glyphs[g], upm);
		options.glyphs.push(exportedItem);
    if (g % 100 === 0) await pause();
	}
	// log(`\n⮟codePointGlyphIndexTable⮟`);
	// log(codePointGlyphIndexTable);

	// Add Ligatures
	let exportLigatures = project.settings.app.exportLigatures;
	// log(`exportLigatures: ${exportLigatures}`);
	if (exportLigatures) {
		for (let l = 0; l < exportLists.ligatures.length; l++) {
			exportedItem = await generateOneLigature(exportLists.ligatures[l]);
			options.glyphs.push(exportedItem);
		}
	}
	showToast('Finalizing...');

	// log(`\n⮟options.glyphs⮟`);
	// log(options.glyphs);

	// Create Font
	// log('NEW options ARG TO FONT');
	// log(options);
	const font = new openTypeJS.Font(options);

	// log(`\n⮟font⮟`);
	// log(font);

	// log(`\n⮟ligatureSubstitutions⮟`);
	// log(ligatureSubstitutions);
	if (exportLigatures) {
		ligatureSubstitutions.forEach((sub) => {
			// log(`Adding ligature to font`);
			const subIndexes = sub.subChars.map((char) => font.charToGlyphIndex(char));
			// log(sub);
			font.substitution.addLigature('liga', { sub: subIndexes, by: sub.byIndex });
		});
	}

	// Write kern pair data
	if (project.settings.app.exportKerning) {
		writeGposKernDataToFont(font, project);
	}

	// TODO investigate advanced table values

	// log('Font object:');
	// log(font);
	// log(font.toTables());

	const result = saveOTFFile(font);
	await pause();
	if (result === true) {
		showToast('Export complete!');
		await pause(1000);
		closeAllToasts();
	} else {
		showError(`
			The OTF file could not be saved. Here is the error message that was returned:
			<hr>
			${result}
		`);
	}
	// log('ioFont_exportFont', 'end');
}

function saveOTFFile(font) {
	let result = true;
	try {
		const familyName = font.getEnglishName('fontFamily');
		const styleName = font.getEnglishName('fontSubfamily');
		const fileName = familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
		// log(`\n⮟font⮟`);
		// log(font);
		const arrayBuffer = font.toArrayBuffer();
		const dataView = new DataView(arrayBuffer);
		const blob = new Blob([dataView], { type: 'font/opentype' });

		saveFile(blob, fileName);
	} catch (e) {
		console.error(e);
		result = e;
	}

	return result;
}

/**
 * Creates the options object
 * @returns {Object}
 */
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
	options.version = fontSettings.version || '1.0';
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

/**
 * Using a combination of a provided item's Session State,
 * and the project setting for exporting empty items,
 * figures out if this item should be exported or not.
 * @param {Glyph | Object} item - item to check
 * @returns {Boolean}
 */
export function shouldExportItem(item) {
	// null char is always exported and handled separately
	if (item.name === '.null') return false;

	if (item.sessionState === 'new') {
		return !!getCurrentProject().settings.app.exportUneditedItems;
	}
	if (item) return true;
	return false;
}

/**
 * Looks through the project and creates a list
 * of items that should be exported.
 * @returns {Object}
 */
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
					if (shouldExportItem(thisGlyph)) {
						exportGlyphs.push({ xg: thisGlyph, xc: hexID });
						checklist.push(hexID);
					}
				}
			});
		}
	});

	exportGlyphs.sort((a, b) => a.xc - b.xc);

	// log(`\n⮟exportGlyphs⮟`);
	// log(exportGlyphs);

	// Add Ligatures
	const exportLigatures = [];
	// const ligWithCodePoint;
	if (project.settings.app.exportLigatures) {
		for (const key of Object.keys(project.ligatures)) {
			// log(project.ligatures[key]);
			if (project.ligatures[key].gsub.length > 1) {
				const thisLigature = project.ligatures[key];
				// log(`\t adding ligature "${thisLigature.name}"`);

				if (shouldExportItem(thisLigature)) {
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

	// log('populateExportList', 'end');
	const result = { glyphs: exportGlyphs, ligatures: exportLigatures };
	return result;
}

/**
 * Creates a notdef character, based on the project's key metrics,
 * and adds it to the provided export options object.
 * @param {Object} options - The options object that is being
 * built for the .otf export
 */
function addNotdefToExport(options) {
	// log(`addNotdefToExport`, 'start');
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
			},
			{
				name: 'Inner Phi Rectangle',
				pathPoints: [
					{ p: { coord: { x: 50, y: 50 } } },
					{ p: { coord: { x: 382, y: 50 } } },
					{ p: { coord: { x: 382, y: 650 } } },
					{ p: { coord: { x: 50, y: 650 } } },
				],
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

	// log(`\n⮟notdef⮟`);
	// log(notdef);

	// Add it to the export
	const notdefPath = makeOpenTypeJS_Glyph(notdef, new openTypeJS.Path());
	let thisAdvance = notdef.advanceWidth;

	const notdefGlyph = new openTypeJS.Glyph({
		name: '.null',
		unicode: 0,
		index: 0,
		xMin: round(notdef.maxes.xMin),
		xMax: round(notdef.maxes.xMax),
		yMin: round(notdef.maxes.yMin),
		yMax: round(notdef.maxes.yMax),
		path: notdefPath,
	});
	notdefGlyph.advanceWidth = thisAdvance;

	options.glyphs.push(notdefGlyph);

	codePointGlyphIndexTable['0x0'] = 0;
	// log(`addNotdefToExport`, 'end');
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @returns {Promise<Object>} - Opentype.js Glyph object
 */
async function generateOneGlyph (currentExportItem, upm = 1000) {
	// log('generateOneGlyph', 'start');
	// export this glyph
	const glyph = currentExportItem.xg;
	const num = currentExportItem.xc;
  const maxes = (glyph._isSkeleton && glyph.cache.maxes) ? glyph.cache.maxes : (glyph.maxes || { xMin: 0, xMax: 0, yMin: 0, yMax: 0 });

	// log(`num: ${num}`);
	// log(`\n⮟glyph⮟`);
	// log(glyph);

	// Path data
  let thisPath;
  if (glyph._isSkeleton && glyph._rawOtfGlyph) {
    const otfGlyph = glyph._rawOtfGlyph;
    if (otfGlyph.components && otfGlyph.components.length > 0) {
      thisPath = otfGlyph.getPath(0, 0, upm);
    } else {
      thisPath = otfGlyph.path;
    }
  } else {
    if (glyph._isSkeleton && glyph._load) glyph._load();
    thisPath = makeOpenTypeJS_Glyph(glyph, new openTypeJS.Path());
  }
	// log('openTypeJS thisPath');
	// log(thisPath);

	// Index & Unicode
	const thisIndex = getNextGlyphIndexNumber();

  if (thisIndex % 100 === 0) {
    showToast('Exporting<br>' + glyph.name, 999999);
  }

	// log(`thisIndex: ${thisIndex}`);
	const thisUnicode = parseInt(num);
	// log(`thisUnicode: ${thisUnicode}`);

	// Name
	const hexID = decToHex(num);
	const thisName = hexID ? getUnicodeShortName(hexID) : 'name';
	// log(`decToHex(num): ${decToHex(num)}`);
	// log(`thisName: ${thisName}`);

	// Create OTF.js Glyph
	const thisGlyph = new openTypeJS.Glyph({
		name: thisName,
		unicode: thisUnicode,
		index: thisIndex,
		xMin: round(maxes.xMin),
		xMax: round(maxes.xMax),
		yMin: round(maxes.yMin),
		yMax: round(maxes.yMax),
		path: thisPath,
	});

	// Opentype.js Glyph constructor removes Advance Width of zero.
	// So, incase we need it to be zero, we add it here.
	thisGlyph.advanceWidth = glyph.advanceWidth;

	// Add this finished glyph
	codePointGlyphIndexTable[parseCharsInputAsHex(glyph.chars)] = thisIndex;

	// log(thisGlyph);
	// log('generateOneGlyph', 'end');
	return thisGlyph;
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @returns {Promise<Object>} - Opentype.js Glyph object
 */
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

	const thisLigature = new openTypeJS.Glyph({
		name: generateLigatureExportName(liga),
		index: thisIndex,
		path: thisPath,
		xMin: round(maxes.xMin),
		xMax: round(maxes.xMax),
		yMin: round(maxes.yMin),
		yMax: round(maxes.yMax),
	});

	// Opentype.js Glyph constructor removes Advance Width of zero.
	// So, incase we need it to be zero, we add it here.
	thisLigature.advanceWidth = liga.advanceWidth;

	// Add substitution info to font
	const charSubList = liga.gsub.map((v) => String.fromCharCode(v));
	ligatureSubstitutions.push({ subChars: charSubList, byIndex: thisIndex });

  // log(thisLigature);
	// log(`generateOneLigature`, 'end');
	return thisLigature;
}

/**
 * Ligature characters need a name for the .otf file, this
 * generates one based on the ligature's source characters.
 * @param {Glyph | Object} lig - Ligature to generate name for
 * @returns {String}
 */
function generateLigatureExportName(lig) {
	let result = 'lig';

	lig.gsub.forEach((char) => {
		const hex = decToHex(char);
		let shortName;
		if (hex) shortName = getUnicodeShortName(hex);
		if (!shortName) shortName = '?';
		result += '.' + shortName;
	});

	return result;
}

let currentIndex = 0;
function getNextGlyphIndexNumber() {
	currentIndex += 1;
	return currentIndex;
}

/**
 * Converts a Glyphr Studio item into an Opentype.js Glyph
 * @param {Glyph | Object} item - Item to convert
 * @param {Object} openTypePath - current path to add to
 * @returns {Object}
 */
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

/**
 * Converts a Glyphr Studio Path into an Opentype.js Path
 * @param {Path| Object} path - Item to convert
 * @param {Object} openTypePath - current path to add to
 * @returns {Object}
 */
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
		const nextPoint = path.pathPoints[path.getNextPointNumber(point.pointNumber)];
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
