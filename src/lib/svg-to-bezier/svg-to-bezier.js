/*
	SVG to Bezier
	For more details, see: https://github.com/mattlag/SVG-to-Bezier
	Version: 1.1.0

	=================================================================

	"Bezier Data Format"

	- Point
		{x: Number, y: Number}            // simple x/y object

	- Bezier curve (Collection of 2 or 4 points)
		[point0, point1, point2, point3]  // 'Regular' Bezier curve notation
		or
		[point0, false, false, point3]    // straight lines have no point1 or point2

	- Path (collection of Bezier curves)
		[bezier1, bezier2, ...]           // where point3 of bezier(n) should equal point0 of bezier(n+1)

	- Bezier Paths (collection of Paths)
		[path1, path2, ...]

	=================================================================
*/

import { tagConvertCircleEllipse } from './tag-convert-circle-ellipse.js';
import { tagConvertPolygonPolyline } from './tag-convert-polygon-polyline.js';
import { tagConvertPath } from './tag-convert-path.js';
import { tagConvertRect } from './tag-convert-rect.js';
import { XMLtoJSON } from './xml-to-json.js';

const enableConsoleLogging = false;

/**
 * Takes an input SVG document in string format, and converts it to
 * a JSON object in Bezier Data Format.
 * @param {String} inputSVG - xml svg to convert
 * @returns {Array} - collection of Paths in Bezier Data Format
 */
export function SVGtoBezier(inputSVG) {
	// log(`\n\n========================\nSVGtoBezier`);
	// log(inputSVG);
	let svgDocumentData = XMLtoJSON(inputSVG);
	// log(`JSON DATA`);
	// log(svgDocumentData);
	let bezierPaths = convertTags(svgDocumentData);
	// log(bezierPaths);
	// log(`\nSVGtoBezier\n========================\n\n`);
	return bezierPaths;
}

/**
 * Recursively look through the SVG data and convert individual tags
 * @param {Object} tagData - XML to JSON format of a SVG Tag, it's attributes, and content
 * @param {Object} parentTransformData - Object with transforms to apply from parent tag
 * @returns {Array} - collection of Paths in Bezier Data Format
 */
function convertTags(tagData, parentTransformData = false) {
	// log(`\n\nCONVERT TAGS for ${tagData.name}`);
	let result = [];
	let transformData = false;
	if (!tagData?.content) return [];
	if (tagData.attributes.transform) {
		console.warn('Transform data is not supported!');
		// transformData = getTransformData(tagData);
	}
	if (parentTransformData) {
		// TODO update current transform data
	}

	tagData.content.forEach((tag) => {
		let name = tag.name.toLowerCase();
		// log(`Starting conversion for ${tag.name} - result.length = ${result.length}`);
		if (name === 'circle' || name === 'ellipse') {
			// log(`MATCHED ${name} as CIRCLE or ELLIPSE`);
			result = result.concat(tagConvertCircleEllipse(tag, transformData));
		}
		if (name === 'path' || name === 'glyph') {
			// log(`MATCHED ${name} as PATH or GLYPH`);
			result = result.concat(tagConvertPath(tag, transformData));
		}
		if (name === 'polygon' || name === 'polyline') {
			// log(`MATCHED ${name} as POLYGON or POLYLINE`);
			result = result.concat(tagConvertPolygonPolyline(tag, transformData));
		}
		if (name === 'rect') {
			// log(`MATCHED ${name} as RECT`);
			result = result.concat(tagConvertRect(tag, transformData));
		}
		if (name === 'g') {
			// log(`MATCHED ${name} as G`);
			result = result.concat(convertTags(tag, transformData));
		}

		// log(`END for ${tag.name} - result.length = ${result.length}`);
	});

	return result;
}

export function getTransformData(tag) {
	/*
		`transform` attribute
			matrix(a,b,c,d,e,f)
			translate(x, y) 	// default (0,0)
			scale(x, y) 			// if only x, y = x
			rotate(a, x, y) 	// if no x,y use 0,0
			skewX(a) 					// degrees horizontal
			skewY(a) 					// degrees vertical

		`transform-origin` attribute
			(x, y, z) 						// default to 0,0 - ignore z value
														// ignore keyword values
	*/

	// toLowerCase is called to identify these
	const supported = ['matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy'];
	let transforms = false;

	if (tag.attributes.transform) {
		// log(`Detected transforms`);
		// log(tag.attributes.transform);
		let temp = tag.attributes.transform.replace(',', ' ');
		temp = temp.toLowerCase();
		temp = temp.split(')');
		// log(temp);
		transforms = [];
		temp.forEach((value) => {
			let data = value.split('(');
			if (data.length === 2) {
				data[0] = data[0].trim();
				data[1] = data[1].trim();
				if (supported.indexOf(data[0]) > -1) {
					transforms.push({
						name: data[0],
						args: data[1].split(' '),
					});
				}
			}
		});
	}

	// log(transforms);
	return transforms;
}

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

/*
	Helper functions
*/

export function log(message) {
	if (enableConsoleLogging) console.log(message);
}
