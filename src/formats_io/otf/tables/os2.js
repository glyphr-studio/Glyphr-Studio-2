import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the OS/2 table in a FontFlux font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_os2(importedFont, project) {
	const fontSettings = project.settings.font;
	const info = importedFont.info;
	if (!info) return;

	fontSettings.ascent = 1 * (info.ascender || fontSettings.ascent);
	fontSettings.descent = 1 * (info.descender || fontSettings.descent);
	fontSettings.capHeight = 1 * (info.capHeight || fontSettings.capHeight);
	fontSettings.xHeight = 1 * (info.xHeight || fontSettings.xHeight);
	fontSettings.overshoot = fontSettings.upm > 2000 ? 30 : 20;
	fontSettings.weight = info.weight || 400;
	fontSettings.panose = info.panose || '0 0 0 0 0 0 0 0 0 0';
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
