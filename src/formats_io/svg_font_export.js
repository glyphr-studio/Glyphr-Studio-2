import { getCurrentProject, getGlyphrStudioApp } from '../app/main.js';
import { decToHex, hexesToXMLHexes } from '../common/character_ids.js';
import { escapeXMLValues, round } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { Glyph } from '../project_data/glyph.js';
import { Maxes, getOverallMaxes } from '../project_data/maxes.js';
import { makeFileDateString, saveTextFile } from '../project_editor/file_io.js';
/**
	IO > Export > SVG Font
	Converting a Glyphr Studio Project to XML in
	a SVG Font format.
**/

/**
 * Using the current project, generate SVG code in
 * the format of a SVG Font. Then, trigger a text
 * file download in the browser.
 */
export function ioSVG_exportSVGfont() {
	// log('ioSVG_exportSVGfont', 'start');
	const project = getCurrentProject();
	const app = getGlyphrStudioApp();
	const fontSettings = project.settings.font;
	const family = fontSettings.family;
	const familyID = family.replace(/ /g, '_');
	const timestamp = makeFileDateString();
	let timeOutput = timestamp.split('-');
	timeOutput[0] = timeOutput[0].replace(/\./g, '-');
	timeOutput[1] = timeOutput[1].replace(/\./g, ':');
	let timeOutputString = timeOutput.join(' at ');

	let con = `<?xml version="1.0"?>
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<metadata>
		Project: ${project.settings.project.name}
		Font exported on ${timeOutputString}
		Created with Glyphr Studio - the free, web-based font editor
		Version: ${app.version}
		Find out more at www.glyphrstudio.com
	</metadata>
	<defs>
		<font id="${familyID}" horiz-adv-x="${fontSettings.upm}">
			<font-face ${ioSVG_makeFontFace()}
			>
				<font-face-src>
					<font-face-name name="${family}" />
				</font-face-src>
			</font-face>
${ioSVG_makeMissingGlyph()}
${ioSVG_makeAllGlyphs()}
${ioSVG_makeAllKernPairs()}
		</font>
	</defs>

	<text x="100" y="150" style="font-size:48px;" font-family="${family}">
		${family}
	</text>
</svg>
`;

	saveTextFile('svg', con);
	showToast('Exported SVG Font File');

	// log('ioSVG_exportSVGfont', 'end');
}

/**
 * Makes the Font Face section of the data
 * @returns {String}
 */
function ioSVG_makeFontFace() {
	// log('ioSVG_makeFontFace', 'start');
	const project = getCurrentProject();
	// const app = getGlyphrStudioApp();
	const fontSettings = project.settings.font;
	const fm = calcFontMaxes();
	const t = '\t\t';
	let con = '';

	con += `
		${t}font-family="${fontSettings.family}"
		${t}font-style="${fontSettings.style}"
		${t}panose-1="${fontSettings.panose}"
		${t}units-per-em="${fontSettings.upm}"
		${t}ascent="${fontSettings.ascent}"
		${t}cap-height="${fontSettings.capHeight}"
		${t}x-height="${fontSettings.xHeight}"
		${t}descent="${fontSettings.descent}"
		${t}bbox="${fm.maxes.xMin}, ${fm.maxes.yMin}, ${fm.maxes.xMax}, ${fm.maxes.yMax}"
		${t}unicode-range="U+20-${fm.maxGlyph}"
		${t}font-variant="${fontSettings.variant}"
		${t}font-weight="${fontSettings.weight}"
		${t}font-stretch="${fontSettings.stretch}"
		${t}stemv="${fontSettings.stemv}"
		${t}stemh="${fontSettings.stemh}"
		${t}slope="${fontSettings.slope}"
		${t}underline-position="${fontSettings.underlinePosition}"
		${t}underline-thickness="${fontSettings.underlineThickness}"
		${t}strikethrough-position="${fontSettings.strikethroughPosition}"
		${t}strikethrough-thickness="${fontSettings.strikethroughThickness}"
		${t}overline-position="${fontSettings.overlinePosition}"
		${t}overline-thickness="${fontSettings.overlineThickness}"
	`;

	// function getSVGproperty(prop) {
	// 	if (fontSettings[prop]) return JSON.stringify(trim(fontSettings[prop]));
	// 	else return '';
	// }

	// log('ioSVG_makeFontFace', 'end');
	return con;
}
/**
 * Calculate the overall bounds given every glyph in this font
 * @returns {Object} - font maxes
 */
function calcFontMaxes() {
	// log(`GSProject.calcFontMaxes`, 'start');
	const project = getCurrentProject();
	const fm = {
		maxGlyph: 0x20,
		maxes: new Maxes(),
	};

	// log(`fm starts as`);
	// log(fm);

	let thisGlyph;
	const ranges = project.settings.project.characterRanges;
	// log(`ranges`);
	// log(ranges);

	ranges.forEach((range) => {
		if (range.enabled) {
			for (let char = range.begin; char < range.end; char++) {
				thisGlyph = project.getItem(`glyph-${decToHex(char)}`);
				if (thisGlyph) fm.maxes = getOverallMaxes([fm.maxes, thisGlyph.maxes]);
			}
			fm.maxGlyph = Math.max(fm.maxGlyph, range.end);
		}
	});

	for (const lig of Object.keys(project.ligatures)) {
		fm.maxes = getOverallMaxes([fm.maxes, project.ligatures[lig]]);
	}

	// log(`returning fm`);
	// log(fm);
	// log(`GSProject.calcFontMaxes`, 'end');
	return fm;
}

/**
 * Makes a .notdef character in SVG format
 * @returns {String}
 */
function ioSVG_makeMissingGlyph() {
	// log('ioSVG_makeMissingGlyph', 'start');
	const project = getCurrentProject();
	let notdef = project.getItem('glyph-0x0');
	if (notdef) return ioSVG_makeOneGlyph(notdef, 'glyph-0x0', 'missing-glyph');
	const gh = project.settings.font.ascent;
	const gw = round(gh * 0.618);
	const gt = round(gh / 100);

	let con = `\n\t\t\t<missing-glyph horiz-adv-x="${gw}" `;
	con += `d="M0,0 v${gh} h${gw} v-${gh} h-${gw}z `;
	con += `M${gt},${gt} v${gh - gt * 2} h${gw - gt * 2} `;
	con += `v - ${gh - gt * 2} h - ${gw - gt * 2} z"/>
`;

	// log('ioSVG_makeMissingGlyph', 'end');
	return con;
}

/**
 * Loops through all the glyphs and ligatures in the project,
 * and creates SVG code for them.
 * @returns {String}
 */
function ioSVG_makeAllGlyphs() {
	// log('ioSVG_makeAllGlyphs', 'start');
	const project = getCurrentProject();
	const checklist = [];
	const exportGlyphs = [];

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

	let con = '';

	con += '\t\t\t<!-- Glyphs -->\n';
	exportGlyphs.forEach((glyph) => {
		con += ioSVG_makeOneGlyph(glyph.xg, glyph.xc);
	});

	if (project.settings.app.exportLigatures) {
		con += '\n';

		con += '\t\t\t<!-- Ligatures -->\n';
		for (const key of Object.keys(project.ligatures)) {
			con += ioSVG_makeOneGlyph(project.ligatures[key], key);
		}
	}

	// log('ioSVG_makeAllGlyphs', 'end');
	return con;
}

/**
 * Converts one glyph item into SVG code.
 * @param {Glyph | Object} gl - item to convert
 * @param {String} id - project ID for this item
 * @param {String} tag - SVG tag to use
 * @returns {String}
 */
function ioSVG_makeOneGlyph(gl, id, tag = 'glyph') {
	// if(!gl.shapes.length && !gl.advanceWidth) return '';
	// Results in lots of special unicode glyphs with no paths
	if (!gl.shapes.length && gl.advanceWidth <= 0) {
		console.warn(`Glyph ${id} not exported: No paths or advance width.`);
		return '';
	}

	if (!id) {
		console.warn(`Glyph ${id} not exported: Bad ID`);
		return '';
	}

	if (id === 'glyph-0x0' && tag === 'glyph') {
		// This gets exported as a special 'missing-glyph' tag
		return '';
	}

	let pathData = gl.svgPathData;
	pathData = pathData || 'M0,0Z';
	let unicodeAttribute = escapeXMLValues(gl.chars);

	let con = '\t\t\t<';
	con += tag;

	if (tag === 'missing-glyph') {
		con += ` horiz-adv-x="${gl.advanceWidth}" `;
		con += `d="${pathData}" />\n`;
	} else {
		con += ` glyph-name="${gl.name.replace(/ /g, '_')}" `;
		con += `unicode="${unicodeAttribute}" `;
		con += `horiz-adv-x="${gl.advanceWidth}" `;
		con += `d="${pathData}" />\n`;
	}

	return con;
}

/**
 * Converts all the Kern Pair data in this project
 * into SVG code.
 * @returns {String}
 */
function ioSVG_makeAllKernPairs() {
	// log('ioSVG_makeAllKernPairs', 'start');
	const project = getCurrentProject();
	if (!project.settings.app.exportKerning) return '';

	const kp = project.kerning;
	let keys = Object.keys(kp);

	if (!keys.length) return '';

	let con = '\t\t\t<!-- Kern Pairs -->\n';

	for (const k of keys) {
		for (let lg = 0; lg < kp[k].leftGroup.length; lg++) {
			for (let rg = 0; rg < kp[k].rightGroup.length; rg++) {
				con += `\t\t\t<hkern `;
				con += `u1="${hexesToXMLHexes(kp[k].leftGroup[lg])}" `;
				con += `u2="${hexesToXMLHexes(kp[k].rightGroup[rg])}" `;
				con += `k="${kp[k].value}" />\n`;
			}
		}
	}

	// log('ioSVG_makeAllKernPairs', 'end');
	return con;
}
