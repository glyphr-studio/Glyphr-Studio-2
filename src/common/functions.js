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
 * @returns {String}
 */
export function getFirstID(obj) {
	for (const key of Object.keys(obj)) return key;
	return false;
}

/**
 * Creates a unique key for an object given a prefix
 * @param {Object} obj
 * @param {String} base - string prefix for the new ID
 * @returns {String}
 */
export function generateNewID(obj, base) {
	let number = 1;
	base = base || 'id';
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
 * @param {Boolean} raw - true = don't format
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
	if (v1 === v2) return true;
	if (Math.abs(v1 - v2) <= threshold) return true;
	return false;
}

/**
 * Rounds a number to include a .5 so it draws nicely on canvas
 * true = +0.5, false = -0.5
 * @param {Number} num - number to crisp
 * @param {Boolean} dir - direction, plus or minus, to adjust number
 * @returns {Number}
 */
export function makeCrisp(num, dir) {
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
	return Number(Math.round(`${num}e${dec}`) + `e-${dec}`) || 0;
}

/**
 * Floating point numbers make me mad
 * Looks for sequences of 0s or 9s
 * @param {Number} num - number to sanitize
 * @returns {Number}
 */
export function numSan(num) {
	num = parseFloat(num);
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
	base = base.split(searchTerm);
	base = base.join('');
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

export function calculateDeltasFromTransform(deltaWidth, deltaHeight, maxes, transformOrigin) {
	let deltaX = 0;
	let deltaY = 0;

	if (transformOrigin.indexOf('right') > -1) {
		deltaX = deltaWidth;
	}

	if (transformOrigin.indexOf('bottom') > -1) {
		deltaY = deltaHeight * -1;
	}

	return { deltaX: deltaX, deltaY: deltaY };
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
 * @param {XYPoint} handle - x/y point of handle
 * @param {XYPoint} point - x/y point of point
 * @returns {Number} - Angle (in radians)
 */
export function calculateAngle(handle, point = { x: 0, y: 0 }) {
	let result = Math.atan2(handle.y - point.y, handle.x - point.x);

	if (isNaN(result)) {
		console.warn('calculateAngle returned NaN\n' + json(handle) + '\n' + json(point));
		result = 0;
	}

	return result;
}

/**
 * Calculates the length of a handle, given a point
 * @param {XYPoint} handle - x/y point of handle
 * @param {XYPoint} point - x/y point of point
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
 * @param {XYPoint} point - x/y point to rotate
 * @param {Number} angle - how much to rotate (radians)
 * @param {XYPoint} about - x/y point center of rotation
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
