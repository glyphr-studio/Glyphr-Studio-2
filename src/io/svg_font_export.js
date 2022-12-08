import { getCurrentProject, getGlyphrStudioApp } from '../app/main.js';
import { round, trim } from '../common/functions.js';
import { isValidHex } from '../common/unicode.js';
import { showToast } from '../controls/dialogs.js';
import { makeDateStampSuffix, saveFile } from '../project_editor/saving.js';
/**
	IO > Export > SVG Font
	Converting a Glyphr Studio Project to XML in
	a SVG Font format.
**/

export function ioSVG_exportSVGfont() {
	// log('ioSVG_exportSVGfont', 'start');
	const project = getCurrentProject();
	const app = getGlyphrStudioApp();
	const ps = project.projectSettings;
	const md = project.metadata;
	const family = md.font_family;
	const familyID = family.replace(/ /g, '_');
	const timestamp = makeDateStampSuffix();
	let timeOutput = timestamp.split('-');
	timeOutput[0] = timeOutput[0].replace(/\./g, '-');
	timeOutput[1] = timeOutput[1].replace(/\./g, ':');
	timeOutput = timeOutput.join(' at ');

	let con = `<?xml version="1.0"?>
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<metadata>
		Project: ${ps.name}
		Font exported on ${timeOutput}
		Created with Glyphr Studio - the free, web-based font editor
		Version: ${app.version}
		Find out more at www.glyphrstudio.com
	</metadata>
	<defs>
		<font id="${familyID}" horiz-adv-x="${ps.upm}">
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

	const filename = ps.name + ' - SVG Font - ' + timestamp + '.svg';

	saveFile(filename, con);
	showToast('Exported SVG Font File');

	// log('ioSVG_exportSVGfont', 'end');
}

function ioSVG_makeFontFace() {
	// log('ioSVG_makeFontFace', 'start');
	const project = getCurrentProject();
	// const app = getGlyphrStudioApp();
	const ps = project.projectSettings;
	const md = project.metadata;
	const fm = project.calcFontMaxes();
	const t = '\t\t';
	let con = '';

	// Project properties
	con += `
		${t}units-per-em="${ps.upm}"
		${t}cap-height="${ps.capHeight}"
		${t}x-height="${ps.xHeight}"
		${t}ascent="${ps.ascent}"
		${t}descent="${ps.descent}"
		${t}bbox="${fm.maxes.xMin}, ${fm.maxes.yMin}, ${fm.maxes.xMax}, ${fm.maxes.yMax}"
		${t}unicode-range="U+20-${fm.maxGlyph}"`;

	// Metadata properties
	con += `
		${t}font-family=${getProperty('font_family')}
		${t}font-style=${getProperty('font_style')}
		${t}panose-1=${getProperty('panose_1')}
		${t}font-variant=${getProperty('font_variant')}
		${t}font-weight=${getProperty('font_weight')}
		${t}font-stretch=${getProperty('font_stretch')}
		${t}stemv=${getProperty('stemv')}
		${t}stemh=${getProperty('stemh')}
		${t}slope=${getProperty('slope')}
		${t}underline-position=${getProperty('underline_position')}
		${t}underline-thickness=${getProperty('underline_thickness')}
		${t}strikethrough-position=${getProperty('strikethrough_position')}
		${t}strikethrough-thickness=${getProperty('strikethrough_thickness')}
		${t}overline-position=${getProperty('overline_position')}
		${t}overline-thickness=${getProperty('overline_thickness')}`;

	function getProperty(prop) {
		if (md[prop]) return JSON.stringify(trim(md[prop]));
		else return '""';
	}

	// log('ioSVG_makeFontFace', 'end');
	return con;
}

function ioSVG_makeMissingGlyph() {
	// log('ioSVG_makeMissingGlyph', 'start');
	const gh = getCurrentProject().projectSettings.ascent;
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

	// TODO Ligatures
	// sortLigatures();
	// const li = getCurrentProject().ligatures;
	// con += '\t\t\t<!-- Ligatures -->\n';
	// for (const l of Object.keys(li)) {
	// 	con += ioSVG_makeOneGlyphOrLigature(li[l], l);
	// }

	// con += '\n';

	con += '\t\t\t<!-- Glyphs -->\n';
	for (const c of Object.keys(finalGlyphs)) {
		con += ioSVG_makeOneGlyphOrLigature(finalGlyphs[c], c);
	}

	// log('ioSVG_makeAllGlyphsAndLigatures', 'end');
	return con;
}

function ioSVG_makeOneGlyphOrLigature(gl, uni) {
	// if(!gl.paths.length && !gl.advanceWidth) return '';
	// Results in lots of special unicode glyphs with no paths
	if (!gl.paths.length && uni != 0x0020) {
		console.warn('Glyph ' + uni + ' not exported: No paths.');
		return '';
	}

	uni = uni.split('0x');
	uni.forEach(function (v, i, a) {
		// only export glyph if it has a valid hexadecimal unicode
		if (!isValidHex(v)) {
			console.warn('Glyph ' + uni.join('') + ' not exported: Bad hex value.');
			return '';
		}

		if (v) a[i] = '&#x' + v + ';';
	});
	uni = uni.join('');

	if (getCurrentProject().projectSettings.combinePathsOnExport) {
		gl = new Glyph(gl).flattenGlyph().combineAllPaths(true);
	}

	let pathData = gl.svgPathData;
	pathData = pathData || 'M0,0Z';

	let con = '\t\t\t';
	con += `<glyph glyph-name="${gl.name.replace(/ /g, '_')}" `;
	con += `unicode="${uni}" `;
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
				con += `u1="${hexToUnicodeHex(kp[k].leftGroup[lg])}" `;
				con += `u2="${hexToUnicodeHex(kp[k].rightGroup[rg])}" `;
				con += `k="${kp[k].value}" />\n`;
			}
		}
	}

	// log('ioSVG_makeAllKernPairs', 'end');
	return con;
}
