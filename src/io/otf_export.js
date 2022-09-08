
import { Glyph } from '../glyph_elements/glyph.js';
import { getCurrentProject } from '../app/main.js';
import { round, clone } from '../common/functions.js';
import { showToast } from '../controls/dialogs.js';
import { decToHex, getUnicodeShortName } from '../common/unicode.js';
import { OpenTypeJS } from '../lib/opentypejs_0-9-0.js';

/**
	IO > Export > OpenType
	Using OpenType.js to convert a Glyphr Studio
	Project into OpenType.js format for saving.
**/

export function exportOTFFont() {
	// log('exportOTFFont', 'start');
	// log('combinePathsOnExport = ' + getCurrentProject().projectSettings.combinePathsOnExport);

	function firstExportStep() {
		// log('firstExportStep', 'start');

		// Add metadata
		const md = getCurrentProject().metadata;
		const ps = getCurrentProject().projectSettings;

		options.unitsPerEm = ps.upm || 1000;
		options.ascender = ps.ascent || 0.00001;
		options.descender = -1 * Math.abs(ps.descent) || -0.00001;
		options.familyName = md.font_family || ' ';
		options.styleName = md.font_style || ' ';
		options.designer = md.designer || ' ';
		options.designerURL = md.designerURL || ' ';
		options.manufacturer = md.manufacturer || ' ';
		options.manufacturerURL = md.manufacturerURL || ' ';
		options.license = md.license || ' ';
		options.licenseURL = md.licenseURL || ' ';
		options.version = md.version || 'Version 0.001';
		options.description = md.description || ' ';
		options.copyright = md.copyright || ' ';
		options.trademark = md.trademark || ' ';
		options.glyphs = [];

		// log('NEW options ARG BEFORE GLYPHS');
		// log(options);
		// log('options.version ' + options.version);

		// Add Notdef
		const notdef = generateNotdefGlyph();

		const notdefPath = notdef.makeOpenTypeJSPath();

		options.glyphs.push(
			new OpenTypeJS.Glyph({
				name: '.notdef',
				unicode: 0,
				index: 0,
				advanceWidth: round(notdef.getAdvanceWidth()),
				xMin: round(notdef.maxes.xMin),
				xMax: round(notdef.maxes.xMax),
				yMin: round(notdef.maxes.yMin),
				yMax: round(notdef.maxes.yMax),
				path: notdefPath,
			})
		);

		// log('firstExportStep', 'end');
	}

	function populateExportList() {
		// log('populateExportList', 'start');

		// Add Glyphs and Ligatures
		let thisGlyph;
		for (const key of Object.keys(getCurrentProject().glyphs)) {
			if (getCurrentProject().glyphs[key]) {
				if (parseInt(key)) {
					thisGlyph = new Glyph(clone(getCurrentProject().glyphs[key]));
					exportArray.push({ xg: thisGlyph, xc: key });
				} else {
					console.warn(
						'Skipped exporting Glyph ' + key + ' - non-numeric key value.'
					);
				}
			}
		}

		exportArray.sort(function (a, b) {
			return a.xc - b.xc;
		});
		// log('populateExportList', 'end');
	}

	function generateOneGlyph() {
		// log('generateOneGlyph', 'start');
		// export this glyph
		const glyph = currentExportGlyph.xg;
		const num = currentExportGlyph.xc;
		const comb = getCurrentProject().projectSettings.combinePathsOnExport;
		const maxes = glyph.maxes;

		// log('' + glyph.name);

		showToast('Exporting<br>' + glyph.name, 999999);

		if (
			comb &&
			glyph.paths.length <=
				getCurrentProject().projectSettings.maxCombinePathsOnExport
		) {
			glyph.combineAllPaths(true);
		}

		if (glyph.isAutoWide) glyph.updateGlyphPosition(glyph.lsb, 0);

		const thisPath = glyph.makeOpenTypeJSPath(new OpenTypeJS.Path());

		const thisGlyph = new OpenTypeJS.Glyph({
			name: getUnicodeShortName('' + decToHex(num)),
			unicode: parseInt(num),
			index: parseInt(num),
			advanceWidth: round(glyph.getAdvanceWidth() || 1), // has to be non-zero
			xMin: round(maxes.xMin),
			xMax: round(maxes.xMax),
			yMin: round(maxes.yMin),
			yMax: round(maxes.yMax),
			path: thisPath,
		});

		// log(thisGlyph);

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

		// log('generateOneGlyph', 'end');
	}

	function lastExportStep() {
		// log('lastExportStep', 'start');
		options.glyphs.sort(function (a, b) {
			return a.unicode - b.unicode;
		});

		// Create Font
		// log('NEW options ARG TO FONT');
		// log(options);
		const font = new OpenTypeJS.Font(options);

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

	// log('exportOTFFont', 'end');
}

function generateNotdefGlyph() {
	// log(`generateNotdefGlyph`, 'start');
	const capHeight = getCurrentProject().projectSettings.capHeight;
	const notDefGlyphPaths =
		'[{"objtype":"path","name":"Outer Phi Rectangle","path":{"objtype":"path","pathPoints":[{"objtype":"pathpoint","P":{"objtype":"coord","x":0,"y":700,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":432,"y":700,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":432,"y":0,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":0,"y":0,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false}],"winding":-4,"maxes":{"xmax":432,"xmin":0,"ymax":700,"ymin":0}},"visible":true,"xlock":false,"ylock":false,"wlock":false,"hlock":false,"ratiolock":false},{"objtype":"path","name":"Inner Phi Rectangle","path":{"objtype":"path","pathPoints":[{"objtype":"pathpoint","P":{"objtype":"coord","x":50,"y":50,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":382,"y":50,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":382,"y":650,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":50,"y":650,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false}],"winding":4,"maxes":{"xmax":382,"xmin":50,"ymax":650,"ymin":50}},"visible":true,"xlock":false,"ylock":false,"wlock":false,"hlock":false,"ratiolock":false}]';

	var notdef = new Glyph({
		name: 'notdef',
		paths: JSON.parse(notDefGlyphPaths),
	});
	// log(`capHeight ${capHeight}`);
	// log(`notdef.maxes.ymax ${notdef.maxes.ymax}`);

	if (capHeight !== 700) {
		var delta = capHeight - 700;
		// log(`delta is ${delta}`);
		notdef.updateGlyphSize(false, delta, true);
		// log(`notdef.maxes.height ${notdef.maxes.ymax}`);
	}

	notdef.updateGlyphPosition(notdef.getLSB(), 0, true);
	notdef.leftSideBearing = 0;

	// log(`generateNotdefGlyph`, 'end');
	return notdef;
}
