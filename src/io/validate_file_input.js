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
	reader.onerror = readerError;

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
		reader.onload = readerValidateTXT;
		reader.readAsText(file);
	} else if (validationResult.fileSuffix === 'gs2') {
		validationResult.fileType = 'project';
		reader.onload = readerValidateGS2;
		reader.readAsText(file);
	}

	log(`validateFileInput`, 'end');
}

function readerValidateOTF() {
	log(`readerValidateOTF`, 'start');
	const file = this.result;
	let font = false;

	try {
		font = OpenTypeJS.parse(file);
		log(font);
	} catch (err) {
		validationResult.errorMessage = err.message;
		console.error(err);
	}

	if (font) {
		if (!(font.glyphs && font.glyphs.length)) {
			validationResult.errorMessage = 'Font file does not have any glyph data.';
		} else {
			validationResult.validatedContent = font;
		}
	}

	postValidationCallback(validationResult);
	log(`readerValidateOTF`, 'end');
}

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
		validationResult.errorMessage = err.message;
		console.error(err);
		return;
	}

	// Check to see if it's actually a SVG Font
	let font = getFirstTagInstance(jsonData, 'font');
	if (!font) {
		validationResult.errorMessage = `The SVG file you tried to load was not a SVG Font file.
				See Glyphr Studio help for more information.`;
	} else {
		validationResult.validatedContent = font;
	}
	postValidationCallback(validationResult);
	log(`readerValidateSVG`, 'end');
}

function readerValidateTXT() {
	log(`readerValidateTXT`, 'start');
	const file = this.result;

	postValidationCallback(validationResult);
	log(`readerValidateTXT`, 'end');
}

function readerValidateGS2() {
	log(`readerValidateGS2`, 'start');
	const file = this.result;

	postValidationCallback(validationResult);
	log(`readerValidateGS2`, 'end');
}

function readerError(event) {
	validationResult.errorMessage = 'A file reader error occurred.';
	postValidationCallback(validationResult);
}
