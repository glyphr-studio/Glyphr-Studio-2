import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the OS/2 table in the opentype.js font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - opentype.js font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_os2(importedFont, project) {
	const os2 = importedFont.tables.os2;
	const fontSettings = project.settings.font;

	// Ascender
	fontSettings.ascent = 1 * (os2?.sTypoAscender || importedFont?.ascender || fontSettings.ascent);

	// Descender
	/** @type {any} */
	let typoDescender = os2?.sTypoDescender || importedFont?.descender || fontSettings.descent;
	if (typoDescender) {
		typoDescender = parseFloat(typoDescender);
		fontSettings.descent = -1 * Math.abs(1 * typoDescender);
	}

	// Other key metrics
	fontSettings.capHeight = 1 * (os2?.sCapHeight || fontSettings.capHeight);
	fontSettings.xHeight = 1 * (os2?.sxHeight || fontSettings.xHeight);
	fontSettings.overshoot = fontSettings.upm > 2000 ? 30 : 20;
	// fontSettings.lineGap = 1 * (os2?.sTypoLineGap || fontSettings.lineGap);
	fontSettings.panose = os2?.panose.join(' ') || '0 0 0 0 0 0 0 0 0 0';
}

/*
{
    "version": 3,
    "xAvgCharWidth": 954,
    "usWeightClass": 400,
    "usWidthClass": 5,
    "fsType": 0,
    "ySubscriptXSize": 650,
    "ySubscriptYSize": 699,
    "ySubscriptXOffset": 0,
    "ySubscriptYOffset": 140,
    "ySuperscriptXSize": 650,
    "ySuperscriptYSize": 699,
    "ySuperscriptXOffset": 0,
    "ySuperscriptYOffset": 479,
    "yStrikeoutSize": 49,
    "yStrikeoutPosition": 258,
    "sFamilyClass": 0,
    "panose": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    "ulUnicodeRange1": 3,
    "ulUnicodeRange2": 0,
    "ulUnicodeRange3": 4194304,
    "ulUnicodeRange4": 0,
    "achVendID": "LaG ",
    "fsSelection": 64,
    "usFirstCharIndex": 1,
    "usLastCharIndex": 65535,
    "sTypoAscender": 1490,
    "sTypoDescender": -430,
    "sTypoLineGap": 0,
    "usWinAscent": 1700,
    "usWinDescent": 450,
    "ulCodePageRange1": 1,
    "ulCodePageRange2": 0,
    "sxHeight": 1019,
    "sCapHeight": 1490,
    "usDefaultChar": 32,
    "usBreakChar": 32,
    "usMaxContent": 3
}
*/
