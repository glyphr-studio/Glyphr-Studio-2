/*
	SVG to Bezier
	For more details, see: https://github.com/mattlag/SVG-to-Bezier
	Also, more info on our 'Bezier Data Format' in bezier-data-format.md in this folder
	Version: 2.0.0
*/

import { tagConvertCircleEllipse } from './tag-convert-circle-ellipse.js';
import { tagConvertPath } from './tag-convert-path.js';
import { tagConvertPolygonPolyline } from './tag-convert-polygon-polyline.js';
import { tagConvertRect } from './tag-convert-rect.js';
import { applyTransformData, getTransformData } from './transforms.js';
import { XMLtoJSON } from './xml-to-json.js';

export const enableConsoleLogging = false;
export const roundToDecimalPrecision = false;

/**
 * Takes an input SVG document in string format, and converts it to
 * a JSON object in Bezier Data Format.
 * @param {String} inputSVG - xml svg to convert
 * @returns {Array} - collection of Paths in Bezier Data Format
 */
export function SVGtoBezier(inputSVG) {
	log(`\n\n========================\n========================\nSVGtoBezier`);
	log(inputSVG);
	let svgDocumentData = XMLtoJSON(inputSVG);
	log(`JSON DATA`);
	log(svgDocumentData);
	let bezierPaths = convertTags(svgDocumentData);
	log(bezierPaths);
	log(`SVGtoBezier\n========================\n========================\n\n`);
	return bezierPaths;
}

/**
 * Recursively look through the SVG data and convert individual tags
 * @param {Object} tagData - XML to JSON format of a SVG Tag, it's attributes, and content
 * @returns {Array} - collection of Paths in Bezier Data Format
 */
function convertTags(tagData) {
	log(`\n\nCONVERT TAGS - START ${tagData.name}`);
	log('tagData');
	log(tagData);
	if (!tagData?.content) return [];

	let resultBezierPaths = [];

	tagData.content.forEach((tag) => {
		log(`\n\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n START TAG ${tag.name}`);
		log('tag');
		log(tag);

		const name = tag.name.toLowerCase();
		const tagTransforms = getTransformData(tag);
		log(`tagTransforms`);
		log(tagTransforms);

		if (convert[name]) {
			log(`\n\n======= converting ${tag.name} =======`);
			let bezierPaths = convert[name](tag);
			log(`converted tag: \n${JSON.stringify(bezierPaths)}`);
			if (tagTransforms) {
				log(`\n\n======= transforming ${tag.name} =======`);
				bezierPaths = applyTransformData(bezierPaths, tagTransforms);
			}
			log(`transformed tag: \n${JSON.stringify(bezierPaths)}`);
			resultBezierPaths = resultBezierPaths.concat(bezierPaths);
		}

		log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n END TAG ${tag.name}\n\n\n\n`);
	});

	log(`resultBezierPaths`);
	log(resultBezierPaths);
	log(`CONVERT TAGS - END ${tagData.name}\n\n`);
	return resultBezierPaths;
}

/**
 * Conversion functions for each SVG tag type
 */
const convert = {
	circle: tagConvertCircleEllipse,
	ellipse: tagConvertCircleEllipse,
	path: tagConvertPath,
	glyph: tagConvertPath,
	polygon: tagConvertPolygonPolyline,
	polyline: tagConvertPolygonPolyline,
	rect: tagConvertRect,
	g: convertTags,
};

/*
 * Common Functions
 */

/**
 * Takes a string of number data and makes it easier to work with.
 * @param {String} data - data from an XML attribute
 * @returns {String} sanitized numbers separated by commas
 */
export function sanitizeParameterData(data) {
	// Clean up whitespace and replace with commas
	data = data.replace(/\s+/g, ',');

	// Clean up numbers
	//		Maintain scientific notation e+ and e- numbers
	//		Commas before all negative numbers
	//		Remove + to denote positive numbers
	data = data.replace(/e/gi, 'e');

	data = data.replace(/e-/g, '~~~');
	data = data.replace(/-/g, ',-');
	data = data.replace(/~~~/g, 'e-');

	data = data.replace(/e\+/g, '~~~');
	data = data.replace(/\+/g, ',');
	data = data.replace(/~~~/g, 'e+');

	// Clean up commas
	data = data.replace(/,+/g, ',');

	return data;
}

/**
 * Takes a string that came from an XML Attribute, and splits it into an array of numbers.
 * It's good to call 'sanitizeParameterData' somewhere before this.
 * In addition to chunking, this also checks for "Decimal number string" notation.
 * @param {String} data - data from an attribute, hopefully numbers separated by commas
 * @returns {Array} individual parameters chunked into an array
 */
export function chunkAndValidateParameters(data = '') {
	// Validate and chunk numeric data
	let validatedParameters = [];

	if (data.charAt(0) === ',') {
		data = data.substring(1);
	}

	if (data.charAt(data.length - 1) === ',') {
		data = data.substring(0, data.length - 1);
	}

	if (data.length > 0) {
		data = data.split(',');

		// Handle sequence of decimal numbers without spaces or leading zeros
		// like: 123.45.67.89 should be 123.45, 0.67, 0.89
		data.forEach((param) => {
			param = param.split('.');

			if (param.length === 1) validatedParameters.push(Number(param[0]));
			else if (param.length === 2) validatedParameters.push(Number(param.join('.')));
			else if (param.length > 2) {
				validatedParameters.push(Number(`${param[0]}.${param[1]}`));
				for (let p = 2; p < param.length; p++) {
					validatedParameters.push(Number(`0.${param[p]}`));
				}
			}
		});

		// validatedParameters = parameters.map(x => Number(x));
	}

	return validatedParameters;
}

/**
 * One call for floating point sanitize and global rounding
 * @param {Number} num - number to sanitize
 * @returns {Number}
 */
export function roundAndSanitize(num) {
	num = floatSanitize(num);
	num = round(num, roundToDecimalPrecision);
	return num;
}

/**
 * Better rounding than Math.round
 * @param {Number} num - number to round
 * @param {Number} dec - number of decimal places
 * @returns {Number}
 */
export function round(num, dec = false) {
	if (!num) return 0;
	if (dec === false) return parseFloat(num);
	num = parseFloat(num);
	return Number(Math.round(`${num}e${dec}`) + `e-${dec}`) || 0;
}

/**
 * Gets rid of those annoying floating point results that contain
 * long sequences of 0s or 9s, and are really close to another
 * much more simple number.
 * @param {Number} num - number to sanitize
 * @returns {Number}
 */
export function floatSanitize(num) {
	const stringNum = String(num);
	if (stringNum.indexOf('00000') > -1 || stringNum.indexOf('99999') > -1) {
		num = round(num, 5);
	}
	return num;
}

/**
 * Global switch for console logging
 * @param {String} message - text to log
 */
export function log(message) {
	if (enableConsoleLogging) console.log(message);
}
