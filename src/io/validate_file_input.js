import { getGlyphrStudioApp } from '../app/main.js';
import { json } from '../common/functions.js';
import OpenTypeJS from '../lib/opentypejs_1-3-1.js';
import { XMLtoJSON } from '../lib/xml_to_json.js';
import { getFirstTagInstance } from './svg_font_import.js';

/**
 * Build the result
 */
const validationResult = {
	fileName: false,
	fileSuffix: false,
	fileType: false,
	errorMessage: false,
	content: false,
};

let postValidationCallback;

/**
 * Handles all the validation for anything a user inputs.
 * OpenType.js used to validate
 * 	- Open Type Font (.otf)
 *  - True Type font (.ttf)
 * Glyphr Studio to validate
 *  - Glyphr Studio v1 project file (.txt)
 *  - Glyphr Studio v2 project file (.gs2)
 * XML Document Parser to validate
 *  - SVG Font (.svg)
 *  - SVG (.svg)
 * @param {*} input - Any input from the user, hopefully a File
 * @returns {Object} - processed stuff to use
 */
export async function validateFileInput(input, callback) {
	log(`validateFileInput`, 'start');
	postValidationCallback = callback;
	log(input.files);

	const file = input.files[0];
	validationResult.fileName = file.name;
	let fileSuffix = file.name.split('.');
	fileSuffix = fileSuffix[fileSuffix.length - 1].toLowerCase();
	validationResult.fileSuffix = fileSuffix;

	log(`validationResult.fileName: ${validationResult.fileName}`);
	log(`validationResult.fileSuffix: ${validationResult.fileSuffix}`);

	const reader = new FileReader();
	reader.onerror = () => {
		failWithError('A file reader error occurred.');
	};

	if (
		validationResult.fileSuffix === 'otf' ||
		validationResult.fileSuffix === 'ttf' ||
		validationResult.fileSuffix === 'woff'
	) {
		validationResult.fileType = 'font';
		reader.onload = readerValidateFont;
		reader.readAsArrayBuffer(file);
	} else if (validationResult.fileSuffix === 'svg') {
		validationResult.fileType = 'svg';
		reader.onload = readerValidateSVG;
		reader.readAsText(file);
	} else if (validationResult.fileSuffix === 'txt') {
		validationResult.fileType = 'project';
		reader.onload = readerValidateTXTandGS2;
		reader.readAsText(file);
	} else if (validationResult.fileSuffix === 'gs2') {
		validationResult.fileType = 'project';
		reader.onload = readerValidateTXTandGS2;
		reader.readAsText(file);
	} else {
		return failWithError(`
			Unrecognized file type (.${validationResult.fileSuffix}).
			Try loading a Glyphr Studio Project file, or a font file.
		`);
	}

	log(`validateFileInput`, 'end');
}

// --------------------------------------------------------------
// Validators for different file types
// --------------------------------------------------------------

/**
 * Validate the file as OTF, TTF, or WOFF
 * @returns Validated data object
 */
function readerValidateFont() {
	log(`readerValidateFont`, 'start');
	const file = this.result;
	let font = false;

	try {
		font = OpenTypeJS.parse(file);
		log(font);
	} catch (err) {
		return failWithError(err.message);
	}

	if (font) {
		if (!(font.glyphs && font.glyphs.length)) {
			return failWithError('Font file does not have any glyph data.');
		} else {
			validationResult.content = font;
		}
	}

	postValidationCallback(validationResult);
	log(`readerValidateFont`, 'end');
}

/**
 * Validate file content as SVG
 * @returns Validated data object
 */
function readerValidateSVG() {
	log(`readerValidateSVG`, 'start');
	let svgData = this.result;
	let jsonData;

	try {
		// Convert unicode glyphs to decimal values
		// DOM Parser does not return unicode values as text strings
		// Kern groups containing '&#x' will get fuck'd
		svgData = svgData.replace(/&#x/g, '0x');
		jsonData = XMLtoJSON(svgData);
	} catch (err) {
		return failWithError(err.message);
	}

	// Check to see if it's actually a SVG Font
	let font = getFirstTagInstance(jsonData, 'font');
	if (!font) {
		return failWithError(`
			The SVG file you tried to load was not a SVG Font file.
			See Glyphr Studio help for more information.`);
	} else {
		validationResult.content = font;
	}
	postValidationCallback(validationResult);
	log(`readerValidateSVG`, 'end');
}

/**
 * Validate file content as TXT File
 * This is (hopefully) a Glyphr Studio Project File
 * @returns Validated data object
 */
function readerValidateTXTandGS2() {
	// log(`readerValidateTXTandGS2`, 'start');
	const file = this.result;
	let projectData;

	try {
		projectData = JSON.parse(file);
	} catch (error) {
		return failWithError(`
			The provided text file does not appear to be a Glyphr Studio project file.
			It may not be a Glyphr Studio Project file.
			<hr>
			${error.message}
		`);
	}

	if (!projectData.metadata && !projectData.projectsettings) {
		return failWithError(`
		The provided text file is missing project metadata.
		It may not be a Glyphr Studio Project file.
		`);
	}

	if (!projectData?.metadata?.latestVersion && !projectData?.projectsettings?.versionnum) {
		return failWithError(`
			The provided text file has no version information associated with it.
			It may not be a Glyphr Studio Project file.
		`);
	}

	let version = parseSemVer(projectData?.projectsettings?.versionnum);
	if (!version) version = parseSemVer(projectData?.metadata?.latestVersion);

	log(`version: ${json(version)}`);

	if (!version) {
		return failWithError(`
			The version information could not be read for the provided project file.
		`);
	}

	let thisGlyphrStudioVersion = parseSemVer(getGlyphrStudioApp().version);
	if (isSemVerLessThan(thisGlyphrStudioVersion, version)) {
		return failWithError(`
			This Glyphr Studio project file was created with a future version of
			Glyphr Studio (0_o) As with most software, Glyphr Studio is not forwards-compatible.
		`);
	}

	// Only upgrade recent v1 projects,
	// versions 1.13.1 and below are not supported
	// versions 1.13.2 and above are supported
	if (version.major === 1) {
		if (isSemVerLessThan(version, [1, 13, 2])) {
			return failWithError(`
				Only Glyphr Studio Project files with version 1.13.2 and above can be
				imported into Glyphr Studio v2. For versions 1.13.1 and below, open and re-save
				the project file with Glyphr Studio v1 App (which will update it).
			`);
		} else {
			// TODO update v1 to v2
			// validationResult.content = project;
			return failWithError(`Glyphr Studio v1 project files cannot be imported (for now).`);
		}
	} else if (version.major === 2) {
		validationResult.content = projectData;
	}

	postValidationCallback(validationResult);
	// log(`readerValidateTXTandGS2`, 'end');
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

function failWithError(message) {
	validationResult.errorMessage = message;
	console.warn(message.replace(/[\t\n\r]/gm, ''));
	postValidationCallback(validationResult);
	return false;
}

/**
 * Tests a semantic version against a threshold
 * @param {Object} test - semVer object to test
 * @param {Array} threshold - semVer array as a threshold
 * @returns {Boolean}
 */
export function isSemVerLessThan(test, threshold) {
	// log(`isSemVerLessThan`, 'start');

	let result = false;
	if (test.major < threshold[0]) result = 'major';
	else if (test.major === threshold[0]) {
		if (test.minor < threshold[1]) result = 'minor';
		else if (test.minor === threshold[1]) {
			if (test.patch < threshold[2]) result = 'patch';
		}
	}

	// log(`result: ${result}`);

	// log(`isSemVerLessThan`, 'end');
	return result;
}

export function parseSemVer(versionString) {
	if (!versionString) return false;
	const prePostDash = versionString.split('-');
	const versions = prePostDash[0].split('.');

	if (versions.length !== 3) return false;

	const result = {
		preRelease: false,
		major: versions[0] * 1,
		minor: versions[1] * 1,
		patch: versions[2] * 1,
	};

	if (prePostDash[1]) result.preRelease = prePostDash[1];

	return result;
}
