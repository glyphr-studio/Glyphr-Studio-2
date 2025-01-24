import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the name table in the opentype.js font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - opentype.js font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_name(importedFont, project) {
	// log('importTable_name', 'start');

	const fontSettings = project.settings.font;

	// Font Family
	const familyName = getTableValue('fontFamily', importedFont) || 'My Font';
	project.settings.project.name = familyName;
	fontSettings.name = familyName;
	fontSettings.family = familyName.substring(0, 31); // long family names cause errors

	// Table data
	fontSettings.style = getTableValue('fontSubfamily', importedFont) || 'Regular';
	fontSettings.copyright = getTableValue('copyright', importedFont) || '';
	fontSettings.trademark = getTableValue('trademark', importedFont) || '';
	fontSettings.designer = getTableValue('designer', importedFont) || '';
	fontSettings.designerURL = getTableValue('designerURL', importedFont) || '';
	fontSettings.manufacturer = getTableValue('manufacturer', importedFont) || '';
	fontSettings.manufacturerURL = getTableValue('manufacturerURL', importedFont) || '';
	fontSettings.license = getTableValue('license', importedFont) || '';
	fontSettings.licenseURL = getTableValue('licenseURL', importedFont) || '';
	fontSettings.description = getTableValue('description', importedFont) || '';

	// log(fontSettings);
	// log('importTable_name', 'end');
}

/**
 * "Values" from a font table may take many forms - this function
 * takes anything, figures out what it should be, and returns a
 * value that Glyphr Studio can use.
 * @param {any} name - name of the property
 * @returns {String | false}
 */
function getTableValue(name, importedFont) {
	let nameTable = importedFont?.tables?.name;
	if (!nameTable) return false;

	const platforms = ['windows', 'macintosh', 'unicode'];

	for (let i = 0; i < platforms.length; i++) {
		if (nameTable[platforms[i]]) {
			if (nameTable[platforms[i]][name]) {
				if (nameTable[platforms[i]][name].en) return nameTable[platforms[i]][name].en;
			}
		}
	}
	return false;
}

/*
{
    "macintosh": {
        "copyright": {
            "en": "2023"
        },
        "fontFamily": {
            "en": "Oblegg"
        },
        "fontSubfamily": {
            "en": "ExtendedTestRegular"
        },
        "uniqueID": {
            "en": "FontForge 2.0 : Oblegg Extended Test Regular : 6-5-2024"
        },
        "fullName": {
            "en": "Oblegg Extended Test Regular"
        },
        "version": {
            "en": "1.0"
        },
        "postScriptName": {
            "en": "ObleggExtendedTestRegular"
        },
        "trademark": {
            "en": " "
        },
        "manufacturer": {
            "en": "Matt LaGrandeur"
        },
        "designer": {
            "en": "Matt LaGrandeur"
        },
        "description": {
            "en": "Test font for Glyphr Studio v2"
        },
        "manufacturerURL": {
            "en": "mattlag.com"
        },
        "designerURL": {
            "en": "mattlag.com"
        },
        "license": {
            "en": "OFL"
        },
        "licenseURL": {
            "en": " "
        },
        "preferredFamily": {
            "en": "Oblegg"
        },
        "preferredSubfamily": {
            "en": "Regular"
        }
    },
    "windows": {
        "copyright": {
            "en": "2023"
        },
        "fontFamily": {
            "en": "Oblegg"
        },
        "fontSubfamily": {
            "en": "ExtendedTestRegular"
        },
        "uniqueID": {
            "en": "FontForge 2.0 : Oblegg Extended Test Regular : 6-5-2024"
        },
        "fullName": {
            "en": "Oblegg Extended Test Regular"
        },
        "version": {
            "en": "1.0"
        },
        "postScriptName": {
            "en": "ObleggExtendedTestRegular"
        },
        "trademark": {
            "en": " "
        },
        "manufacturer": {
            "en": "Matt LaGrandeur"
        },
        "designer": {
            "en": "Matt LaGrandeur"
        },
        "description": {
            "en": "Test font for Glyphr Studio v2"
        },
        "manufacturerURL": {
            "en": "mattlag.com"
        },
        "designerURL": {
            "en": "mattlag.com"
        },
        "license": {
            "en": "OFL"
        },
        "licenseURL": {
            "en": " "
        },
        "preferredFamily": {
            "en": "Oblegg"
        },
        "preferredSubfamily": {
            "en": "Regular"
        }
    }
}
*/
