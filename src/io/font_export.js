import { getCurrentProject } from '../app/main.js';
import { round } from '../common/functions.js';
import { showToast } from '../controls/dialogs.js';
import { decToHex, getUnicodeShortName } from '../common/unicode.js';
import openTypeJS from '../lib/opentypejs_1-3-1.js';
import { Glyph } from '../project_data/glyph.js';

/**
	IO > Export > OpenType
	Using OpenType.js to convert a Glyphr Studio
	Project into OpenType.js format for saving.
**/

export function ioFont_exportFont() {
	// log('ioFont_exportFont', 'start');
	const project = getCurrentProject();
	// log('combinePathsOnExport = ' + project.metadata.preferences.combinePathsOnExport);

	function firstExportStep() {
		log('firstExportStep', 'start');

		// Add metadata
		const fmd = project.metadata.font;

		options.unitsPerEm = fmd.upm || 1000;
		options.ascender = fmd.ascent || 0.00001;
		options.descender = -1 * Math.abs(fmd.descent) || -0.00001;
		options.familyName = fmd.family || ' ';
		options.styleName = fmd.style || ' ';
		options.designer = fmd.designer || ' ';
		options.designerURL = fmd.designerURL || ' ';
		options.manufacturer = fmd.manufacturer || ' ';
		options.manufacturerURL = fmd.manufacturerURL || ' ';
		options.license = fmd.license || ' ';
		options.licenseURL = fmd.licenseURL || ' ';
		options.version = fmd.version || 'Version 0.001';
		options.description = fmd.description || ' ';
		options.copyright = fmd.copyright || ' ';
		options.trademark = fmd.trademark || ' ';
		options.glyphs = [];

		// log('NEW options ARG BEFORE GLYPHS');
		// log(options);
		// log('options.version ' + options.version);

		// Add Notdef
		const notdef = generateNotdefGlyph();
		log(`notdef.advanceWidth: ${notdef.advanceWidth}`);

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

		log('firstExportStep', 'end');
	}

	function populateExportList() {
		log('populateExportList', 'start');
		// Add Glyphs and Ligatures
		let thisGlyph;
		for (const key of Object.keys(project.glyphs)) {
			if (project.glyphs[key]) {
				if (parseInt(key)) {
					// thisGlyph = new Glyph(clone(project.glyphs[key]));
					thisGlyph = project.glyphs[key].clone();
					exportArray.push({ xg: thisGlyph, xc: key });
				} else {
					console.warn('Skipped exporting Glyph ' + key + ' - non-numeric key value.');
				}
			}
		}

		exportArray.sort(function (a, b) {
			return a.xc - b.xc;
		});
		log('exportArray');
		log(exportArray);
		log('populateExportList', 'end');
	}

	function generateOneGlyph() {
		log('generateOneGlyph', 'start');
		// export this glyph
		const glyph = currentExportGlyph.xg;
		const num = currentExportGlyph.xc;
		const comb = project.metadata.preferences.combinePathsOnExport;
		const maxes = glyph.maxes;

		log('' + glyph.name);

		showToast('Exporting<br>' + glyph.name, 999999);

		if (comb && glyph.paths.length <= project.metadata.preferences.maxCombinePathsOnExport) {
			glyph.combineAllPaths(true);
		}

		const thisPath = glyph.makeOpenTypeJSpath(new openTypeJS.Path());
		log('openTypeJS thisPath');
		log(thisPath);

		const thisGlyph = new openTypeJS.Glyph({
			name: getUnicodeShortName('' + decToHex(num)),
			unicode: parseInt(num),
			index: parseInt(num),
			advanceWidth: round(glyph.advanceWidth || 1), // has to be non-zero
			xMin: round(maxes.xMin),
			xMax: round(maxes.xMax),
			yMin: round(maxes.yMin),
			yMax: round(maxes.yMax),
			path: thisPath,
		});

		log(thisGlyph);

		// Add this finished glyph
		options.glyphs.push(thisGlyph);

		// start the next one
		currentExportNumber++;

		if (currentExportNumber < exportArray.length) {
			currentExportGlyph = exportArray[currentExportNumber];
			setTimeout(generateOneGlyph, 10);
		} else {
			showToast('Finalizing...', 10);
			setTimeout(lastExportStep, 10);
		}

		log('generateOneGlyph', 'end');
	}

	function lastExportStep() {
		// log('lastExportStep', 'start');
		options.glyphs.sort(function (a, b) {
			return a.unicode - b.unicode;
		});

		// Create Font
		// log('NEW options ARG TO FONT');
		// log(options);
		const font = new openTypeJS.Font(options);

		// log('Font object:');
		// log(font.toTables());

		// Export
		// _UI.stopPageNavigation = false;
		font.download();
		// setTimeout(function () {
		//   _UI.stopPageNavigation = true;
		// }, 2000);
		// log('lastExportStep', 'end');
	}

	/*
		MAIN EXPORT LOOP
	*/
	const options = {};
	const exportArray = [];
	let currentExportNumber = 0;
	let currentExportGlyph = {};

	firstExportStep();
	populateExportList();
	currentExportGlyph = exportArray[0];
	generateOneGlyph();

	// log('ioFont_exportFont', 'end');
}

function generateNotdefGlyph() {
	log(`generateNotdefGlyph`, 'start');
	const capHeight = getCurrentProject().metadata.font.capHeight;
	const notDefGlyphPaths = [
		{
			name: 'Outer Phi Rectangle',
			pathPoints: [
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 700 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 432, y: 700 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 432, y: 0 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 0 } },
				},
			],
			winding: -4,
		},
		{
			name: 'Inner Phi Rectangle',
			pathPoints: [
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 50, y: 50 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 382, y: 50 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 382, y: 650 } },
				},
				{
					objType: 'PathPoint',
					p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 50, y: 650 } },
				},
			],
			winding: 4,
		},
	];

	let notdef = new Glyph({
		name: 'notdef',
		advanceWidth: 432,
		paths: notDefGlyphPaths,
	});
	log(`notdef.maxes: ${notdef.maxes}`);
	// log(`capHeight ${capHeight}`);
	// log(`notdef.maxes.yMax ${notdef.maxes.yMax}`);

	if (capHeight !== 700) {
		let delta = capHeight - 700;
		// log(`delta is ${delta}`);
		notdef.updateGlyphSize(false, delta, true);
		log(notdef);

		notdef.advanceWidth = notdef.maxes.xMax;
		// log(`notdef.maxes.height ${notdef.maxes.yMax}`);
	}

	log(notdef);
	log(`generateNotdefGlyph`, 'end');
	return notdef;
}
