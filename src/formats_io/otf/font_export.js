import { FontFlux } from 'font-flux-js';
import { getCurrentProject } from '../../app/main.js';
import { decToHex, parseCharsInputAsHex } from '../../common/character_ids.js';
import { pause, round } from '../../common/functions.js';
import { closeAllToasts, showError, showToast } from '../../controls/dialogs/dialogs.js';
import { getUnicodeShortName } from '../../lib/unicode/unicode_names.js';
import { Glyph } from '../../project_data/glyph.js';
import { sortLigatures } from '../../project_data/glyphr_studio_project.js';
import { Path } from '../../project_data/path.js';
import { makeGlyphWithResolvedLinks } from '../../project_editor/cross_item_actions.js';
import { saveFile } from '../../project_editor/file_io.js';
import { writeGposKernDataToFont } from './tables/gpos.js';


/**
	IO > Export > Font
	Using FontFlux and path-conversion helpers to export a Glyphr Studio
	project into OpenType format for saving.
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
	for (let g = 0; g < exportLists.glyphs.length; g++) {
		exportedItem = await generateOneGlyph(exportLists.glyphs[g]);
		options.glyphs.push(exportedItem);
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
	const font = FontFlux.create({
		family: options.familyName,
		unitsPerEm: options.unitsPerEm,
		ascender: options.ascender,
		descender: options.descender,
	});

	// Set additional font info properties
	font.info.styleName = options.styleName;
	font.info.copyright = options.copyright;
	font.info.version = options.version;
	font.info.weight = options.weightClass;
	font.info.italicAngle = options.italicAngle;

	// Add glyphs
	options.glyphs.forEach(glyph => {
		font.addGlyph(glyph);
	});

	// log(`\n⮟font⮟`);
	// log(font);

	// log(`\n⮟ligatureSubstitutions⮟`);
	// log(ligatureSubstitutions);

	// Write kern pair data first, before setting GSUB features
	// This ensures the font's GPOS table is properly initialized
	if (project.settings.app.exportKerning) {
		writeGposKernDataToFont(font, project);
	}

	if (exportLigatures && ligatureSubstitutions.length > 0) {
		ligatureSubstitutions.forEach(sub => {
			font.addSubstitution({
				type: 'ligature',
				feature: 'liga',
				substitution: {
					components: sub.components,
					ligature: sub.ligature,
				},
			});
		});
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
		const familyName = font.info.familyName || 'MyFont';
		const styleName = font.info.styleName || 'Regular';
		const fileName = familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
		// log(`\n⮟font⮟`);
		// log(font);
		// Export as SFNT (complete OpenType file with all required tables)
		const arrayBuffer = font.export({ format: 'sfnt' });
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
	const contours = glyphToContours(notdef);

	const notdefGlyph = {
		name: '.null',
		unicode: 0,
		advanceWidth: notdef.advanceWidth,
		contours: contours,
	};

	options.glyphs.push(notdefGlyph);

	codePointGlyphIndexTable['0x0'] = 0;
	// log(`addNotdefToExport`, 'end');
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @returns {Promise<Object>} - FontFlux Glyph object
 */
async function generateOneGlyph(currentExportItem) {
	// log('generateOneGlyph', 'start');
	// export this glyph
	const glyph = currentExportItem.xg;
	const num = currentExportItem.xc;

	showToast('Exporting<br>' + glyph.name, 999999);

	// Unicode
	const thisUnicode = parseInt(num);
	const thisIndex = getNextGlyphIndexNumber();

	// Name
	const hexID = decToHex(num);
	const thisName = hexID ? getUnicodeShortName(hexID) : 'name';

	// Convert glyph outlines directly to FontFlux contours
	const contours = glyphToContours(glyph);

	const thisGlyph = {
		name: thisName,
		unicode: thisUnicode,
		advanceWidth: glyph.advanceWidth,
		contours: contours,
	};

	// Add this finished glyph
	codePointGlyphIndexTable[parseCharsInputAsHex(glyph.chars)] = thisIndex;

	await pause();
	return thisGlyph;
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @returns {Promise<Object>} - FontFlux Glyph object
 */
async function generateOneLigature(currentExportItem) {
	// log(`generateOneLigature`, 'start');

	// export this glyph
	const liga = currentExportItem.xg;

	showToast('Exporting<br>' + liga.name, 999999);

	// Convert ligature outlines directly to FontFlux contours
	const contours = glyphToContours(liga);

	const thisLigature = {
		name: generateLigatureExportName(liga),
		advanceWidth: liga.advanceWidth,
		contours: contours,
	};

	// Add substitution info for FontFlux
	const componentNames = liga.gsub.map((unicode) => {
		const hexID = decToHex(unicode);
		return hexID ? getUnicodeShortName(hexID) : 'name';
	});
	ligatureSubstitutions.push({ components: componentNames, ligature: thisLigature.name });

	await pause();
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
 * Converts a Glyphr Studio Glyph directly to FontFlux contours format.
 * @param {Glyph | Object} item - Item to convert
 * @returns {Array<Array>} - Array of contours, each contour is an array of points
 */
function glyphToContours(item) {
	const flatItem = makeGlyphWithResolvedLinks(item);
	const contours = [];

	flatItem.shapes.forEach((shape) => {
		if (shape.objType === 'Path') {
			const contour = pathToContour(shape);
			if (contour && contour.length > 0) {
				contours.push(contour);
			}
		}
	});

	return contours;
}

/**
 * Converts a Glyphr Studio Path into a FontFlux CFF contour (cubic Bézier format).
 * Uses explicit 'M' (move) and 'C' (cubic curve) commands.
 * Format: [{ type: 'M', x, y }, { type: 'C', x1, y1, x2, y2, x, y }, ...]
 * @param {Path} path - Path object to convert
 * @returns {Array} - Contour commands in CFF cubic format
 */
function pathToContour(path) {
	if (!path.pathPoints || path.pathPoints.length === 0) {
		return [];
	}

	const contour = [];
	const points = path.pathPoints;

	// Reverse winding for correct direction
	path.reverseWinding();

	try {
		// Start with move command to first point
		contour.push({
			type: 'M',
			x: round(points[0].p.x),
			y: round(points[0].p.y),
		});

		// Add cubic curve for each segment
		points.forEach((point, index) => {
			const nextIndex = (index + 1) % points.length;
			const nextPoint = points[nextIndex];

			// Cubic curve command
			// x1, y1 = first control point (from current point's h2)
			// x2, y2 = second control point (to next point's h1)
			// x, y = end point
			contour.push({
				type: 'C',
				x1: round(point.h2.x),
				y1: round(point.h2.y),
				x2: round(nextPoint.h1.x),
				y2: round(nextPoint.h1.y),
				x: round(nextPoint.p.x),
				y: round(nextPoint.p.y),
			});
		});
	} finally {
		// Restore winding
		path.reverseWinding();
	}

	return contour;
}
