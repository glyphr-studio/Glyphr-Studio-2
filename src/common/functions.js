/**
 * FUNCTIONS
 * some random general-use functions
 */

// --------------------------------------------------------------
// Object Functions
// --------------------------------------------------------------

/**
 * Gets the first key in an object
 * @param {object} obj
 * @returns {string}
 */
export function getFirstID(obj) {
	for (const key of Object.keys(obj)) return key;
	return false;
}

/**
 * Creates a unique key for an object given a prefix
 * @param {object} obj
 * @param {string} base - string prefix for the new ID
 * @returns {string}
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
 * A quick visual way to see if two objects are actually the
 * same object from the console.
 * @returns String of emojis
 */
export function makeRandomID() {
	let glyphs = ['💖', '🦧', '🐆', '✅', '🐋', '😈', '🦑'];
	let result = '';
	for (let i = 0; i < 4; i++) {
		result += glyphs[Math.floor(Math.random() * glyphs.length)];
	}

	return result;
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
 * @param {object} source - object to clone
 * @returns {object}
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
 * @param {object} obj - object to stringify
 * @param {boolean} raw - true = don't format
 * @returns {string}
 */
export function json(obj, raw) {
	obj = clone(obj);
	if (raw) return JSON.stringify(obj);
	else {
		const j = JSON.stringify(obj, undefined, 2);
		if (j) return j.replace(/\n/g, '\r\n');
		else return '';
	}
}

/**
 * Simple way of comparing equality between things (including Objects)
 * Not intended for complex objects :-)
 * @param {object} obj1 - first object to compare
 * @param {object} obj2 - second object to compare
 * @returns {boolean}
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
 * @param {object} c1 - Coord or XYPoint, First point to compare
 * @param {object} c2 - Coord or XYPoint, Second point to compare
 * @param {number} threshold - how close to compare positions
 * @returns {boolean}
 */
export function pointsAreEqual(c1, c2, threshold = 1) {
	// log('pointsAreEqual', 'start');
	// log('c1 ' + json(c1, true));
	// log('c2 ' + json(c2, true));
	// log('threshold ' + threshold);

	if (c1.x === c2.x && c1.y === c2.y) {
		// log('exact match');
		return true;
	}

	const dx = Math.abs(c1.x - c2.x);
	const dy = Math.abs(c1.y - c2.y);

	// log('dx ' + dx + '\tdy ' + dy);

	if (dx <= threshold && dy <= threshold) {
		// log('below threshold match');
		return true;
	}

	// log('not a match');
	// log('pointsAreEqual', 'end');

	return false;
}

/**
 * Rounds a number to include a .5 so it draws nicely on canvas
 * true = +0.5, false = -0.5
 * @param {number} num - number to crisp
 * @param {boolean} dir - direction, plus or minus, to adjust number
 * @returns {number}
 */
export function makeCrisp(num, dir) {
	const mul = dir ? 1 : -1;
	return round(num) + 0.5 * mul;
}

/**
 * Better rounding than Math.round
 * @param {number} num - number to round
 * @param {number} dec - number of decimal places
 * @returns {number}
 */
export function round(num, dec = 0) {
	if (!num) return 0;
	return Number(Math.round(num + 'e' + dec) + 'e-' + dec) || 0;
}

/**
 * Floating point numbers make me mad
 * Looks for sequences of 0s or 9s
 * @param {number} num - number to sanitize
 * @returns {number}
 */
export function numSan(num) {
	num = parseFloat(num);
	const stringNumber = '' + num;

	if (stringNumber.indexOf('0000') > -1 || stringNumber.indexOf('9999') > -1) {
		num = round(num, 4);
	}

	if (num < 0.0 && num > 0) num = 0;

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
 * @param {string} val - string to sanitize
 * @returns {string}
 */
export function strSan(val = '') {
	val = String(val);
	return val.replace(/[<>'"\\]/g, '');
}

/**
 * Removes beginning and trailing whitespace, and any breaking or tab chars
 * @param {string} text - text to trim
 * @returns {string}
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
 * Checks to see if something is a value, and not null or undefined
 * @param {*} val - variable to test
 * @returns {boolean}
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
 * @param {object} obj - object to check
 * @returns {boolean}
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
 * @param {number} i
 * @param {array} a
 * @returns {boolean}
 */
export function duplicates(v, i, a) {
	return a.indexOf(v) === i;
}

/**
 * Pauses execution to allow for the UI to display
 * rapid updates
 * @param {number} ms - milliseconds to pause
 * @returns {Promise}
 */
export function pause(ms = 10) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('fast');
		}, ms);
	});
}

// ---------------------------------------------------------------------
// Angle and Rotation Stuff
// ---------------------------------------------------------------------

// Use JavaScript "Angle" system by default:
// Radians, top is positive bottom is negative
// 3 o'clock is zero, 9 o'clock is pi

// Glyphr Studio "Nice Angle" used in the UI
// 360 Degrees, 12 o'clock is zero, clockwise = positive

/**
 * Calculates the angle (in radians) of a handle given a point
 * @param {XYPoint} handle - x/y point of handle
 * @param {XYPoint} point - x/y point of point
 * @returns {number}
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
 * @returns {number}
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
 * @param {number} angle - how much to rotate (radians)
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
 * @param {number} deg - degrees
 * @returns {number}
 */
export function rad(deg) {
	return ((deg * Math.PI) / 180) % Math.PI;
}

/**
 * Convert radians to degrees
 * @param {number} rad - radians
 * @returns {number}
 */
export function deg(rad) {
	return ((rad * 180) / Math.PI) % 360;
}

/**
 * Given a standard JavaScript angle (radians), convert it to the angle
 * system we show the user (degrees, aka "Nice Angle")
 * @param {number} angle - Angle in Radians
 * @returns {number} - Angle in Degrees
 */
export function angleToNiceAngle(angle) {
	angle = deg(angle);
	angle = 360 - angle;
	angle -= 270;
	angle = angle % 360;
	if (angle < 0) angle += 360;

	return angle;
}

/**
 * Given a "Nice Angle" in degrees from the UI, calculate the type of
 * angle that JavaScript knows about (radians)
 * @param {number} angle - Angle in Degrees
 * @returns {number} - Angle in Radians
 */
export function niceAngleToAngle(angle) {
	angle += 90;
	angle = angle % 360;
	if (angle < 180) angle = 360 - angle;
	else angle *= -1;

	angle = rad(angle);

	return angle;
}
