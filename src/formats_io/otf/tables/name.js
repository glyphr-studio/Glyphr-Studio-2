import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the name table in a FontFlux font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_name(importedFont, project) {
	// log('importTable_name', 'start');

	const fontSettings = project.settings.font;

	// Font Family
	// FontFlux exposes name-table data as flat properties on `info` (e.g.
	// `familyName`, `styleName`, `vendorURL`), not the legacy nested
	// `fontFamily`/`fontSubfamily` structure. Use the legacy family (name ID 1)
	// for the family so width/weight-specific family names (e.g. "Arial Narrow",
	// whose typographic family name ID 16 is just "Arial") are preserved.
	const familyName = getTableValue('familyName', importedFont) || 'My Font';
	project.settings.project.name = familyName;
	fontSettings.name = familyName;
	fontSettings.family = familyName.substring(0, 31); // long family names cause errors

	// Table data
	// Prefer the typographic subfamily (name ID 17) when present: it carries the
	// true style (e.g. "Light") while name ID 2 is only the RIBBI-safe value
	// ("Regular"), so this recovers styles that RIBBI can't express.
	fontSettings.style =
		getTableValue('typographicSubfamily', importedFont) ||
		getTableValue('styleName', importedFont) ||
		'Regular';
	fontSettings.copyright = getTableValue('copyright', importedFont) || '';
	fontSettings.trademark = getTableValue('trademark', importedFont) || '';
	fontSettings.designer = getTableValue('designer', importedFont) || '';
	fontSettings.designerURL = getTableValue('designerURL', importedFont) || '';
	fontSettings.manufacturer = getTableValue('manufacturer', importedFont) || '';
	fontSettings.manufacturerURL = getTableValue('vendorURL', importedFont) || '';
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
	const info = importedFont.info;
	if (!info) return false;

	const value = info[name];
	return value || false;
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
