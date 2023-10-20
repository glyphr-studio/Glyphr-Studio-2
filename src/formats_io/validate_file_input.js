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
 * @param {*} fileHandle - Any input from the user, hopefully a File
 * @returns {Object} - processed stuff to use
 */
export async function validateSingleFileInput(fileHandle, callback) {
	// log(`validateSingleFileInput`, 'start');
	postValidationCallback = callback;

	validationResult.fileHandle = fileHandle;
	const file = await fileHandle.getFile();
	// log(file);
	validationResult.fileName = file.name;
	let fileSuffix = file.name.split('.');
	fileSuffix = fileSuffix[fileSuffix.length - 1].toLowerCase();
	validationResult.fileSuffix = fileSuffix;

	// log(`validationResult.fileName: ${validationResult.fileName}`);
	// log(`validationResult.fileSuffix: ${validationResult.fileSuffix}`);

	const reader = new FileReader();
	reader.onerror = () => {
		failWithError('A file reader error occurred. [FR0]');
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
			[FR1]
		`);
	}

	// log(`validateSingleFileInput`, 'end');
}

// --------------------------------------------------------------
// Validators for different file types
// --------------------------------------------------------------

/**
 * Validate the file as OTF, TTF, or WOFF
 * @returns Validated data object
 */
function readerValidateFont() {
	// log(`readerValidateFont`, 'start');
	const file = this.result;
	let font = false;

	try {
		font = OpenTypeJS.parse(file);
		// log(font);
	} catch (err) {
		return failWithError(`
			Font file could not be read. [FF0]
			<hr>
			${err.message}
		`);
	}

	if (font) {
		if (!font?.glyphs?.length) {
			return failWithError('Font file does not have any glyph data. [FF1]');
		} else {
			validationResult.content = font;
		}
	}

	postValidationCallback(validationResult);
	// log(`readerValidateFont`, 'end');
}

/**
 * Validate file content as SVG
 * @returns Validated data object
 */
function readerValidateSVG() {
	// log(`readerValidateSVG`, 'start');
	let svgData = this.result;
	let jsonData;

	try {
		// Convert unicode glyphs to decimal values
		// DOM Parser does not return unicode values as text strings
		// Kern groups containing '&#x' will get fuck'd
		svgData = svgData.replace(/&#x/g, '0x');
		jsonData = XMLtoJSON(svgData);
	} catch (err) {
		return failWithError(`
			SVG file could not be read. [SVG0]
			<hr>
			${err.message}
		`);
	}

	// Check to see if it's actually a SVG Font
	let font = getFirstTagInstance(jsonData, 'font');
	if (!font) {
		return failWithError(`
			The SVG file you tried to load was not a SVG Font file.
			See Glyphr Studio help for more information. [SVG1]`);
	} else {
		validationResult.content = font;
	}
	postValidationCallback(validationResult);
	// log(`readerValidateSVG`, 'end');
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

	// Can't read JSON file
	try {
		projectData = JSON.parse(file);
	} catch (error) {
		return failWithError(`
			The file could not be read. Expecting a Glyphr Studio Project file
			in JSON format. [PF0]
			<hr>
			${error.message}
		`);
	}

	// Missing settings property
	if (!projectData.settings && !projectData.projectsettings) {
		return failWithError(`
		The provided text file is missing project settings.
		It may not be a Glyphr Studio Project file. [PF1]
		`);
	}

	// Missing version information
	if (!projectData?.settings?.project?.latestVersion && !projectData?.projectsettings?.versionnum) {
		return failWithError(`
			The provided text file has no version information associated with it.
			It may not be a Glyphr Studio Project file. [PF2]
		`);
	}

	let version = tryToGetProjectVersion(projectData);

	// log(`version: ${json(version)}`);

	// Version information could not be parsed as SemVer
	if (!version) {
		return failWithError(`
			The version information could not be read for the provided project file. [PF3]
		`);
	}

	// Project file created with a future version of Glyphr Studio
	let thisGlyphrStudioVersion = parseSemVer(getGlyphrStudioApp().version);
	if (isSemVerLessThan(thisGlyphrStudioVersion, version)) {
		return failWithError(`
			This Glyphr Studio project file was created with a future version of
			Glyphr Studio (0_o) As with most software, Glyphr Studio is not forwards-compatible. [PF4]
		`);
	}

	// Only upgrade recent v1 projects,
	// versions 1.13.1 and below are not supported
	// versions 1.13.2 and above are supported
	// log(`version: ${json(version)}`);

	if (isSemVerLessThan(version, [1, 13, 2])) {
		return failWithError(`
			Only Glyphr Studio Project files with version 1.13.2 and above can be
			imported into Glyphr Studio v2. For versions 1.13.1 and below, open and re-save
			the project file with Glyphr Studio v1 App (which will update it). [PF5]
		`);
	}

	// Success fallthrough!
	validationResult.content = projectData;

	// log(`readerValidateTXTandGS2`, 'end');
	postValidationCallback(validationResult);
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * A cross v1 / v2 way to check for project version
 * @param {Object} projectData - GS Project to check
 * @returns {Object} - hopefully a version object
 */
export function tryToGetProjectVersion(projectData) {
	let version = parseSemVer(projectData?.projectsettings?.versionnum);
	if (!version) version = parseSemVer(projectData?.settings?.project?.latestVersion);
	return version;
}

function failWithError(message) {
	validationResult.errorMessage = message;
	// console.warn(message.replace(/[\t\n\r]/gm, ' '));
	console.warn(message.replace(/\s\s+/g, ' '));
	postValidationCallback(validationResult);
	return false;
}

/**
 * Tests a semantic version against a threshold
 * @param {Object} test - semVer object to test
 * @param {Object or Array} threshold - semVer as a threshold
 * @returns {Boolean}
 */
export function isSemVerLessThan(test, threshold) {
	// log(`isSemVerLessThan`, 'start');

	if (Array.isArray(threshold)) {
		threshold = {
			major: threshold[0],
			minor: threshold[1],
			patch: threshold[2],
		};
	}

	let result = false;
	if (test.major < threshold.major) result = 'major';
	else if (test.major === threshold.major) {
		if (test.minor < threshold.minor) result = 'minor';
		else if (test.minor === threshold.minor) {
			if (test.patch < threshold.patch) result = 'patch';
		}
	}

	// log(`result: ${result}`);

	// log(`isSemVerLessThan`, 'end');
	return result;
}

export function parseSemVer(versionString) {
	// log(`parseSemVer`, 'start');
	// log(`versionString: ${versionString}`);

	if (!versionString) return false;
	const prePostDash = versionString.split('-');
	const versions = prePostDash[0].split('.');

	if (versions.length !== 3) return false;

	const result = {
		preRelease: false,
		major: parseInt(versions[0]),
		minor: parseInt(versions[1]),
		patch: parseInt(versions[2]),
	};

	if (prePostDash[1]) result.preRelease = prePostDash[1];
	// log(`Result:`);
	// log(json(result));
	// log(`parseSemVer`, 'end');
	return result;
}

export function makeSemVerString(versionObject) {
	const major = versionObject?.major || '0';
	const minor = versionObject?.minor || '0';
	const patch = versionObject?.patch || '0';
	const preRelease = versionObject?.preRelease;

	let result = `${major}.${minor}.${patch}`;
	if (preRelease) result = `${result}-${preRelease}`;

	return result;
}
