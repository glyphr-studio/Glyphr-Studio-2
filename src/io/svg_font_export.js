import { getCurrentProject, getGlyphrStudioApp } from '../app/main.js';
import { round, trim } from '../common/functions.js';
import { decToHex, hexesToXMLHexes } from '../common/character_ids.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { Glyph } from '../project_data/glyph.js';
import { makeDateStampSuffix, saveFile } from '../project_editor/saving.js';
import { makeGlyphWithResolvedLinks } from '../project_editor/cross_item_actions.js';
import { getOverallMaxes, Maxes } from '../project_data/maxes.js';
/**
	IO > Export > SVG Font
	Converting a Glyphr Studio Project to XML in
	a SVG Font format.
**/

export function ioSVG_exportSVGfont() {
	// log('ioSVG_exportSVGfont', 'start');
	const project = getCurrentProject();
	const app = getGlyphrStudioApp();
	const fontSettings = project.settings.font;
	const family = fontSettings.family;
	const familyID = family.replace(/ /g, '_');
	const timestamp = makeDateStampSuffix();
	let timeOutput = timestamp.split('-');
	timeOutput[0] = timeOutput[0].replace(/\./g, '-');
	timeOutput[1] = timeOutput[1].replace(/\./g, ':');
	timeOutput = timeOutput.join(' at ');

	let con = `<?xml version="1.0"?>
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<metadata>
		Project: ${project.settings.project.name}
		Font exported on ${timeOutput}
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
${ioSVG_makeAllGlyphsAndLigatures()}
${ioSVG_makeAllKernPairs()}
		</font>
	</defs>

	<text x="100" y="150" style="font-size:48px;" font-family="${family}">
		${family}
	</text>
</svg>
`;

	const filename = project.settings.project.name + ' - SVG Font - ' + timestamp + '.svg';

	saveFile(filename, con);
	showToast('Exported SVG Font File');

	// log('ioSVG_exportSVGfont', 'end');
}

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
		for (let char = range.begin; char < range.end; char++) {
			thisGlyph = project.getItem(`glyph-${decToHex(char)}`);
			if (thisGlyph) fm.maxes = getOverallMaxes([fm.maxes, thisGlyph.maxes]);
		}
		fm.maxGlyph = Math.max(fm.maxGlyph, range.end);
	});

	for (const lig of Object.keys(project.ligatures)) {
		fm.maxes = getOverallMaxes([fm.maxes, project.ligatures[lig]]);
	}

	// log(`returning fm`);
	// log(fm);
	// log(`GSProject.calcFontMaxes`, 'end');
	return fm;
}

function ioSVG_makeMissingGlyph() {
	// log('ioSVG_makeMissingGlyph', 'start');
	const gh = getCurrentProject().settings.font.ascent;
	const gw = round(gh * 0.618);
	const gt = round(gh / 100);

	let con = `\t\t\t<missing-glyph horiz-adv-x="${gw}" `;
	con += `d="M0,0 v${gh} h${gw} v-${gh} h-${gw}z `;
	con += `M${gt},${gt} v${gh - gt * 2} h${gw - gt * 2} `;
	con += `v - ${gh - gt * 2} h - ${gw - gt * 2} z"/>
`;

	// log('ioSVG_makeMissingGlyph', 'end');
	return con;
}

function ioSVG_makeAllGlyphsAndLigatures() {
	// log('ioSVG_makeAllGlyphsAndLigatures', 'start');

	const finalGlyphs = getCurrentProject().glyphs;
	let con = '';

	const li = getCurrentProject().ligatures;
	con += '\t\t\t<!-- Ligatures -->\n';
	for (const l of Object.keys(li)) {
		con += ioSVG_makeOneGlyphOrLigature(li[l], l);
	}

	// con += '\n';

	con += '\t\t\t<!-- Glyphs -->\n';
	for (const c of Object.keys(finalGlyphs)) {
		con += ioSVG_makeOneGlyphOrLigature(finalGlyphs[c], c);
	}

	// log('ioSVG_makeAllGlyphsAndLigatures', 'end');
	return con;
}

function ioSVG_makeOneGlyphOrLigature(gl, uni) {
	// if(!gl.shapes.length && !gl.advanceWidth) return '';
	// Results in lots of special unicode glyphs with no paths
	if (!gl.shapes.length && uni != 0x0020) {
		console.warn('Glyph ' + uni + ' not exported: No paths.');
		return '';
	}

	let pathData = gl.svgPathData;
	pathData = pathData || 'M0,0Z';

	let con = '\t\t\t';
	con += `<glyph glyph-name="${gl.name.replace(/ /g, '_')}" `;
	con += `unicode="${gl.chars}" `;
	con += `horiz-adv-x="${gl.advanceWidth}" `;
	con += `d="${pathData}" />\n`;
	return con;
}

function ioSVG_makeAllKernPairs() {
	// log('ioSVG_makeAllKernPairs', 'start');
	const kp = getCurrentProject().kerning;
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
