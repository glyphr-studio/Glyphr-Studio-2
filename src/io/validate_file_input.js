import { getGlyphrStudioApp } from '../app/main.js';
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
	validatedContent: false,
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

	if (validationResult.fileSuffix === 'otf' || validationResult.fileSuffix === 'ttf') {
		validationResult.fileType = 'font';
		reader.onload = readerValidateOTF;
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
	}

	log(`validateFileInput`, 'end');
}

// --------------------------------------------------------------
// Validators for different file types
// --------------------------------------------------------------

/**
 * Validate the file as OTF (or TTF)
 * @returns Validated data object
 */
function readerValidateOTF() {
	log(`readerValidateOTF`, 'start');
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
			validationResult.validatedContent = font;
		}
	}

	postValidationCallback(validationResult);
	log(`readerValidateOTF`, 'end');
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
		validationResult.validatedContent = font;
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
	log(`readerValidateTXTandGS2`, 'start');
	const file = this.result;
	let project;

	try {
		project = JSON.parse(file);
	} catch (error) {
		return failWithError(`
			The provided text file does not appear to be a Glyphr Studio project file.
			It may not be a Glyphr Studio Project file. <br>
			${error.message}
		`);
	}

	if (!project.version) {
		return failWithError(`
			The provided text file has no version information associated with it.
			It may not be a Glyphr Studio Project file.
		`);
	}

	let version = parseSemVer(project.version);

	if (!version) {
		return failWithError(`
			The provided project file has no version information associated with it.
		`);
	}

	let thisGlyphrStudioVersion = parseSemVer(getGlyphrStudioApp().version);
	if (isSemVerLessThan(thisGlyphrStudioVersion, version)) {
		return failWithError(`
			This Glyphr Studio project file was created with a future version of
			Glyphr Studio 0_o Glyphr Studio is not forwards-compatible.
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
				the project file with Glyphr Studio v1 (which will update it).
			`);
		} else {
			// TODO update v1 to v2
			return failWithError(`Glyphr Studio v1 project files cannot be imported (for now)`);
		}
	} else if (version.major === 2) {
		validationResult.validatedContent = project;
	}

	postValidationCallback(validationResult);
	log(`readerValidateTXTandGS2`, 'end');
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

function failWithError(message) {
	validationResult.errorMessage = message;
	console.error(message);
	postValidationCallback(validationResult);
	return false;
}

function isSemVerLessThan(test, threshold) {
	if (test[0] < threshold[0]) return true;
	else if (test[0] === threshold[0]) {
		if (test[1] < threshold[1]) return true;
		else if (test[1] === threshold[1]) {
			if (test[2] < threshold[2]) return true;
		}
	}
	return false;
}

function parseSemVer(versionString) {
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
