/// <reference lib="es2021" />
/**
 * FUNCTIONS
 * some random general-use functions
 */

// --------------------------------------------------------------
// Object Functions
// --------------------------------------------------------------

/**
 * Gets the first key in an object
 * @param {Object} obj
 * @returns {String | false}
 */
export function getFirstID(obj = {}) {
	const keys = Object.keys(obj);
	if (keys.length) return keys[0];
	return false;
}

/**
 * Creates a unique key for an object given a prefix
 * @param {Object} obj
 * @param {String =} base - string prefix for the new ID
 * @returns {String}
 */
export function generateNewID(obj, base = 'id') {
	let number = 1;
	let id = '' + base + number;
	while (obj[id]) {
		number += 1;
		id = '' + base + number;
	}

	return id;
}

/**
 * Like .length property, but for object keys
 * @param {Object} object - object to count
 */
export function countItems(object) {
	return Object.keys(object).length;
}

// --------------------------------------------------------------
// Common Functions
// --------------------------------------------------------------

/**
 * Counts the number of times a search term is found in an array
 * @param {Array} arr - array to search through
 * @param {*} term - any value to search for
 * @returns {Number} - count of matches
 */
export function count(arr = [], term = '') {
	let count = 0;
	if (!arr || !Array.isArray(arr)) return 0;
	arr.forEach((item) => {
		if (item === term) count += 1;
	});
	return count;
}

/**
 * Returns a full new copy of any object
 * 'parent' is a pointer up to parent object, they
 * cause infinite loops when cloning objects.  Kind of a hack.
 * 'cache' is also left out by default.
 * @param {Object} source - object to clone
 * @returns {Object}
 */
export function clone(source) {
	try {
		return structuredClone(source);
	} catch (error) {
		// console.warn('No structuredClone, falling back to manual clone');

		const newObj = Array.isArray(source) ? [] : {};
		for (const i of Object.keys(source)) {
			if (source[i] && typeof source[i] === 'object' && i !== 'parent' && i !== 'cache') {
				newObj[i] = clone(source[i]);
			} else newObj[i] = source[i];
		}
		return newObj;
	}
}

/**
 * Wrapper for JSON.stringify that does pretty
 * formatting by default
 * @param {Object} obj - object to stringify
 * @param {Boolean =} raw - true = don't format
 * @returns {String}
 */
export function json(obj, raw) {
	obj = clone(obj);
	if (raw) return JSON.stringify(obj);
	else {
		let result = JSON.stringify(obj, undefined, 2);
		result = result || '';
		result = result.replace(/\n/g, '\r\n');
		// The only things indented this much are Coords and Control Points
		// This puts them on a single line
		result = result.replaceAll('\r\n                  "', '"');
		result = result.replaceAll('\r\n                }', '}');
		result = result.replaceAll('\r\n                "', '"');
		result = result.replaceAll('\r\n              }', '}');
		result = result.replaceAll('},"', '}, "');
		return result;
	}
}

/**
 * Simple way of comparing equality between things (including Objects)
 * Not intended for complex objects :-)
 * @param {Object} obj1 - first object to compare
 * @param {Object} obj2 - second object to compare
 * @returns {Boolean}
 */
export function areEqual(obj1, obj2) {
	// log(`areEqual`, 'start');
	// log(`passed ${typeof obj1} and ${typeof obj2} equality? ${obj1 === obj2}`);

	if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
		return obj1 === obj2;
	}

	for (const key of Object.keys(obj1)) {
		if (obj2[key]) {
			if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
				if (!areEqual(obj1[key], obj2[key])) return false;
			} else if (obj1[key] !== obj2[key]) return false;
		} else {
			return false;
		}
	}

	return true;
}

/**
 * Compare two x/y points within a margin of rounding
 * @param {Object} c1 - Coord or XYPoint, First point to compare
 * @param {Object} c2 - Coord or XYPoint, Second point to compare
 * @param {Number} threshold - how close to compare positions
 * @returns {Boolean}
 */
export function xyPointsAreClose(c1, c2, threshold = 1) {
	// log('xyPointsAreClose', 'start');
	// log(`c1: ${c1.x}, ${c1.y}`);
	// log(`c2: ${c2.x}, ${c2.y}`);
	// log('threshold ' + threshold);

	if (isNaN(c1.x) || isNaN(c1.y) || isNaN(c2.x) || isNaN(c2.y)) return false;

	if (c1.x === c2.x && c1.y === c2.y) {
		// log('exact match');
		// log('xyPointsAreClose', 'end');
		return true;
	}

	if (valuesAreClose(c1.x, c2.x, threshold) && valuesAreClose(c1.y, c2.y, threshold)) {
		// log(`close match`);
		// log('xyPointsAreClose', 'end');
		return true;
	}

	// log('not a match');
	// log('xyPointsAreClose', 'end');

	return false;
}

/**
 * Returns true if two values are within a threshold of each other
 * @param {Number} v1 - First value
 * @param {Number} v2 - Second value
 * @param {Number} threshold - wiggle room
 */
export function valuesAreClose(v1, v2, threshold = 1) {
	if (isNaN(v1) || isNaN(v2)) return false;
	if (v1 === v2) return true;
	if (Math.abs(v1 - v2) <= threshold) return true;
	return false;
}

/**
 * Rounds a number to include a .5 so it draws nicely on canvas
 * true = +0.5, false = -0.5
 * @param {Number} num - number to crisp
 * @param {Boolean=} dir - direction, plus or minus, to adjust number
 * @returns {Number}
 */
export function makeCrisp(num, dir = false) {
	const mul = dir ? 1 : -1;
	return round(num) + 0.5 * mul;
}

/**
 * Better rounding than Math.round
 * @param {Number} num - number to round
 * @param {Number} dec - number of decimal places
 * @returns {Number}
 */
export function round(num, dec = 0) {
	if (!num) return 0;
	return Number(Math.round(+`${num}e${dec}`) + `e-${dec}`) || 0;
}

/**
 * Floating point numbers make me mad
 * Looks for sequences of 0s or 9s
 * @param {Number} num - number to sanitize
 * @returns {Number}
 */
export function numSan(num) {
	num = parseNumber(num);
	const stringNumber = '' + num;

	if (stringNumber.indexOf('0000') > -1 || stringNumber.indexOf('9999') > -1) {
		num = round(num, 3);
	}

	if (num < 0.00001 && num > 0) num = 0;

	return num;
}

/**
 * Simple test for integer numbers
 * @param {*} input thing to test
 */
export function isInteger(input) {
	input = parseFloat(input);
	if (isNaN(input)) return false;
	if (input !== Math.round(input)) return false;
	return true;
}

/**
 * Tries to make a number out of an input
 * @param {* =} input - something to check as a number
 * @returns {Number}
 */
export function parseNumber(input = 0) {
	let result = +input;
	if (isNaN(result)) return 0;
	return result;
}

/**
 * Removes illegal file name chars
 * @param {String} val - string to sanitize
 * @returns {String}
 */
export function strSan(val = '') {
	val = String(val);
	return val.replace(/[<>'"\\]/g, '');
}

/**
 * Removes beginning and trailing whitespace, and any breaking or tab chars
 * @param {String} text - text to trim
 * @returns {String}
 */
export function trim(text = '') {
	text = String(text);

	// Old school quotes stored as values bug
	if (text === `""` || text === `''`) return '';

	try {
		text = text.replace(/^\s+|\s+$/g, '');
		return text.replace(/(\r\n|\n|\r|\t)/gm, '');
	} catch (e) {
		return '';
	}
}

/**
 * Takes a string and a search term, and removes all instances
 * of that search term from the base string.
 * @param {String} base - base string to operate on
 * @param {String} searchTerm - what to remove
 * @returns {String}
 */
export function remove(base = '', searchTerm = '') {
	base = String(base);
	let baseArr = base.split(searchTerm);
	base = baseArr.join('');
	return base || '';
}

/**
 * Converts camelCaseString to kebab-case-string
 * @param {String} camel - string to convert
 * @returns {String}
 */
export function caseCamelToKebab(camel = '') {
	let kebab = '';
	for (let i = 0; i < camel.length; i++) {
		let char = camel.charCodeAt(i);
		if (char <= 0x5a && char >= 0x41) {
			kebab += '-';
		}
		kebab += camel.charAt(i).toLowerCase();
	}

	return kebab;
}

/**
 * Converts kebab-case-string to camelCaseString
 * @param {String} kebab - string to convert
 * @returns {String}
 */
export function caseKebabToCamel(kebab = '') {
	let camel = '';
	for (let i = 0; i < kebab.length; i++) {
		if (kebab.charAt(i) === '-') {
			i++;
			camel += kebab.charAt(i).toUpperCase();
		} else {
			camel += kebab.charAt(i);
		}
	}

	return camel;
}

/**
 * Takes a random string and ensures it's compatible as an
 * XML Attribute value.
 * @param {String} value - string to escape
 * @returns {String} string with escape characters
 */
export function escapeXMLValues(value = '') {
	// log(`escapeXMLValues`, 'start');
	// log(`value: ${value}`);

	if (typeof value === 'string') {
		if (value === '""' || value === "''") return '';

		if (value.indexOf('&') > -1) {
			// log('replacing ampersand');
			value = value.replace(/&/g, '&amp;');
		}

		if (value.indexOf('"') > -1) {
			// log('replacing double quotes');
			value = value.replace(/"/g, '&quot;');
		}

		if (value.indexOf("'") > -1) {
			// log('replacing single quotes');
			value = value.replace(/'/g, '&apos;');
		}

		if (value.indexOf('<') > -1) {
			// log('replacing less than');
			value = value.replace(/</g, '&lt;');
		}

		if (value.indexOf('>') > -1) {
			// log('replacing greater than');
			value = value.replace(/>/g, '&gt;');
		}
	}

	// log(`value: ${value}`);
	// log(`escapeXMLValues`, 'end');
	return value;
}

/**
 * Checks to see if something is a value, and not null or undefined
 * @param {*} val - variable to test
 * @returns {Boolean}
 */
export function isVal(val) {
	if (val === 0) return true;
	else if (val === false) return true;
	else if (val === null || val === undefined) return false;
	// else if ( typeof val === 'number' && isNaN(val)) return false;
	else if (typeof val === 'object' && Object.keys(val).length === 0) return false;
	else return !!val;
}

/**
 * Checks all object properties for isVal
 * @param {Object} obj - object to check
 * @returns {Boolean}
 */
export function hasNonValues(obj) {
	if (!obj) return true;

	for (const key of Object.keys(obj)) {
		if (!isVal(obj[key])) return true;
		if (obj[key] === Number.MAX_SAFE_INTEGER) return true;
		if (obj[key] === Number.MIN_SAFE_INTEGER) return true;
	}

	return false;
}

/**
 * A export function for filtering duplicates in an array
 * @param {*} v
 * @param {Number} i
 * @param {Array} a
 * @returns {Boolean}
 */
export function duplicates(v, i, a) {
	return a.indexOf(v) === i;
}

/**
 * Pauses execution to allow for the UI to display
 * rapid updates
 * @param {Number} ms - milliseconds to pause
 * @returns {Promise}
 */
export function pause(ms = 10) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('fast');
		}, ms);
	});
}

// --------------------------------------------------------------
// Translation
// --------------------------------------------------------------

/**
 * Position names are {y name}-{x name}
 * Y names are: top, middle, baseline,bottom
 * X names are: left, center, right
 */
export const transformOrigins = [
	'top-left',
	'middle-left',
	'baseline-left',
	'bottom-left',
	'top-center',
	'middle-center',
	'baseline-center',
	'bottom-center',
	'top-right',
	'middle-right',
	'baseline-right',
	'bottom-right',
];

/**
 * Takes an items current maxes and future size changes, and calculates
 * the future position changes based on a given transform origin.
 * @param {Number} deltaWidth - how much the item will change in width
 * @param {Number} deltaHeight - how much the item will change in height
 * @param {Object} maxes - item maxes *before* resizing
 * @param {String | Boolean} transformOrigin - name of the origin position
 * @returns {Object} - deltaX and deltaY to apply after resizing
 */
export function calculateDeltasFromTransform(
	deltaWidth = 0,
	deltaHeight = 0,
	maxes,
	transformOrigin = 'baseline-left'
) {
	// log(`calculateDeltasFromTransform`, 'start');
	// log(`deltaWidth: ${deltaWidth}`);
	// log(`deltaHeight: ${deltaHeight}`);
	// log(`transformOrigin: ${transformOrigin}`);
	// log(maxes.print());
	if (transformOrigin === false) transformOrigin = 'baseline-left';
	else if (transformOrigins.indexOf('' + transformOrigin) < 0) transformOrigin = 'baseline-left';
	transformOrigin = '' + transformOrigin;
	// log(`transformOrigin: ${transformOrigin}`);
	let result = {
		deltaX: 0,
		deltaY: 0,
	};

	// Y adjustments - 'bottom' requires no adjustments
	if (deltaHeight !== 0) {
		if (transformOrigin.includes('top')) {
			result.deltaY = deltaHeight * -1;
		}

		if (transformOrigin.includes('middle')) {
			result.deltaY = deltaHeight / -2;
		}

		if (transformOrigin.includes('baseline')) {
			let scaleVertical = (deltaHeight + maxes.height) / maxes.height;
			let newY = maxes.yMax * scaleVertical;
			let newAbsoluteY = (maxes.yMax - newY) * -1;
			result.deltaY = newAbsoluteY - deltaHeight;
		}
	}

	// X Adjustments - 'left' requires no adjustments
	if (deltaWidth !== 0) {
		if (transformOrigin.includes('right')) {
			result.deltaX = deltaWidth * -1;
		}

		if (transformOrigin.includes('center')) {
			result.deltaX = deltaWidth / -2;
		}
	}

	// log(`\n⮟result⮟`);
	// log(result);
	// log(`calculateDeltasFromTransform`, 'end');
	return result;
}

// ---------------------------------------------------------------------
// Angle and Rotation Stuff
// ---------------------------------------------------------------------

// Use JavaScript "Angle" system by default:
// Radians, top is positive bottom is negative
// 3 o'clock is zero, 9 o'clock is pi

// Glyphr Studio "Nice Angle" used in the UI and saved to project files.
// 360 Degrees, 12 o'clock is zero, clockwise = positive

/**
 * Calculates the angle (in radians) of a handle given a point
 * @param {Object} handle - x/y point of handle
 * @param {Object} point - x/y point of point
 * @returns {Number} - Angle (in radians)
 */
export function calculateAngle(handle, point = { x: 0, y: 0 }) {
	// log(`calculateAngle`, 'start');
	// log(`handle: ${handle.x}, ${handle.y}`);
	// log(`point: ${point.x}, ${point.y}`);
	let result = Math.atan2(handle.y - point.y, handle.x - point.x);

	if (isNaN(result)) {
		console.warn('calculateAngle returned NaN\n' + json(handle) + '\n' + json(point));
		result = 0;
	}
	// log(`result: ${result}`);
	// log(`calculateAngle`, 'end');
	return result;
}

/**
 * Given a base and two points, calculates the angle that is formed
 * from p1 > base > p2, and ensures it's the more accute angle.
 * @param {Object} base - base point
 * @param {Object} p1 - point 1
 * @param {Object} p2 - point 2
 * @returns {Number} - Angle (in degrees)
 */
export function calculateDeltaAngle(base, p1, p2) {
	let a1 = deg(Math.atan2(p1.y - base.y, p1.x - base.x));
	let a2 = deg(Math.atan2(p2.y - base.y, p2.x - base.x));

	if (isNaN(a1)) a1 = 0;
	if (isNaN(a2)) a2 = 0;

	let result = a2 - a1;
	if (result > 180) result -= 360;
	if (result < -180) result += 360;
	// log(`\t a2:${a2} - a1:${a1} = ${result} `);

	return result;
}

/**
 * Calculates the length of a handle, given a point
 * @param {Object} handle - x/y point of handle
 * @param {Object} point - x/y point of point
 * @returns {Number}
 */
export function calculateLength(handle, point) {
	const adj = point.x - handle.x;
	const opp = point.y - handle.y;
	const result = Math.sqrt(adj * adj + opp * opp);
	return result;
}

/**
 * Rotates a point a certain number of degrees around a given point
 * @param {Object} point - x/y point to rotate
 * @param {Number} angle - how much to rotate (radians)
 * @param {Object} about - x/y point center of rotation
 */
export function rotate(point, angle, about = { x: 0, y: 0 }) {
	// log('rotate', 'start');
	// log('point ' + json(point, true));
	// log('Math angle:\t' + angle);
	// log('about ' + json(about, true));

	if (!angle || !point) return;

	point.x -= about.x;
	point.y -= about.y;

	const newX = point.x * Math.cos(angle) - point.y * Math.sin(angle);
	const newY = point.x * Math.sin(angle) + point.y * Math.cos(angle);

	point.x = newX + about.x;
	point.y = newY + about.y;

	// log('new point x/y: ' + point.x + '/' + point.y);
	// log('rotate', 'end');
}

/**
 * Convert degrees to radians
 * @param {Number} deg - degrees
 * @returns {Number}
 */
export function rad(deg) {
	return (deg * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 * @param {Number} rad - radians
 * @returns {Number}
 */
export function deg(rad) {
	return (rad * 180) / Math.PI;
}

/**
 * Snaps a radian to the nearest degree value
 * @param {Number} radians - radians
 * @returns - radians
 */
export function snapRadiansToDegrees(radians) {
	var degrees = deg(radians);
	degrees = round(degrees);
	radians = rad(degrees);
	return radians;
}

/**
 * Given a standard JavaScript angle (radians), convert it to the angle
 * system we show the user (degrees, aka "Nice Angle")
 * @param {Number} rad - Angle in Radians
 * @returns {Number} - Angle in Degrees
 */
export function radiansToNiceAngle(rad) {
	let degrees = deg(rad);
	degrees = 360 - degrees;
	degrees -= 270;
	degrees = degrees % 360;
	if (degrees < 0) degrees += 360;

	return degrees;
}

/**
 * Given a "Nice Angle" in degrees from the UI, calculate the type of
 * angle that JavaScript knows about (radians)
 * @param {Number} angle - Angle in Degrees
 * @returns {Number} - Angle in Radians
 */
export function niceAngleToRadians(angle) {
	angle += 90;
	angle = angle % 360;
	if (angle < 180) angle = 360 - angle;
	else angle *= -1;

	let radians = rad(angle);

	return radians;
}
