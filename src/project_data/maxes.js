import { isVal, parseNumber, round } from '../common/functions.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Glyph Element > Maxes
 * Standard way of defining a bounding box
 */
export class Maxes extends GlyphElement {
	/**
	 * Create a Maxes object
	 * @param {Object} arg
	 * @param {Number | undefined =} arg.xMin - smallest x value
	 * @param {Number | undefined =} arg.xMax - largest x value
	 * @param {Number | undefined =} arg.yMin - smallest y value
	 * @param {Number | undefined =} arg.yMax - largest y value
	 */
	constructor({ xMin, xMax, yMin, yMax } = {}) {
		super();
		// log(`Maxes.constructor`, 'start');

		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		this.objType = 'Maxes';

		// log(`maxes is now`);
		// log(this);
		// log(`Maxes.constructor`, 'end');
		return this;
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		// log(`Maxes.save`, 'start');

		const re = {};

		if (isVal(this._xMin)) re.xMin = this._xMin;
		if (isVal(this._xMax)) re.xMax = this._xMax;
		if (isVal(this._yMin)) re.yMin = this._yMin;
		if (isVal(this._yMax)) re.yMax = this._yMax;

		if (verbose) re.objType = this.objType;

		// log(`returning`);
		// log(re);
		// log(`Maxes.save`, 'end');
		return re;
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {Number} level - how far down we are
	 * @returns {String}
	 */
	print(level = 0) {
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{`;
		re += `xMin:${this.xMin} `;
		re += `xMax:${this.xMax} `;
		re += `yMin:${this.yMin} `;
		re += `yMax:${this.yMax}`;
		re += `}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * Get xMin
	 * @returns {Number} value
	 */
	get xMin() {
		// log(`Maxes GET xMin`, 'start');

		if (isVal(this._xMin)) {
			return parseNumber(this._xMin);
		} else {
			return Number.MAX_SAFE_INTEGER;
		}
	}

	/**
	 * Get xMax
	 * @returns {Number} value
	 */
	get xMax() {
		if (isVal(this._xMax)) return parseNumber(this._xMax);
		else return Number.MIN_SAFE_INTEGER;
	}

	/**
	 * Get yMin
	 * @returns {Number} value
	 */
	get yMin() {
		if (isVal(this._yMin)) return parseNumber(this._yMin);
		else return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Get yMax
	 * @returns {Number} value
	 */
	get yMax() {
		if (isVal(this._yMax)) return parseNumber(this._yMax);
		else return Number.MIN_SAFE_INTEGER;
	}

	/**
	 * Figures out the center of the bounding box
	 * @returns {Object} x/y point
	 */
	get center() {
		return {
			x: this.width / 2 + this.xMin,
			y: this.height / 2 + this.yMin,
		};
	}

	/**
	 * Figures out the width of the area
	 * @returns {Number} value
	 */
	get width() {
		return this.xMax - this.xMin;
	}

	/**
	 * Figures out the height of the area
	 * @returns {Number} value
	 */
	get height() {
		return this.yMax - this.yMin;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Set xMin
	 * @param {Number | undefined} x - new value
	 * @returns {Maxes}
	 */
	set xMin(x) {
		if (x === undefined || isNaN(+x)) delete this._xMin;
		else this._xMin = parseNumber(x);
	}

	/**
	 * Set xMax
	 * @param {Number | undefined} x - new value
	 * @returns {Maxes}
	 */
	set xMax(x) {
		if (x === undefined || isNaN(+x)) delete this._xMax;
		else this._xMax = parseNumber(x);
	}

	/**
	 * Set yMin
	 * @param {Number | undefined} y - new value
	 * @returns {Maxes}
	 */
	set yMin(y) {
		if (y === undefined || isNaN(+y)) delete this._yMin;
		else this._yMin = parseNumber(y);
	}

	/**
	 * Set yMax
	 * @param {Number | undefined} y - new value
	 * @returns {Maxes}
	 */
	set yMax(y) {
		if (y === undefined || isNaN(+y)) delete this._yMax;
		else this._yMax = parseNumber(y);
	}

	// --------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------

	/**
	 * Rounds all the values to a certain precision
	 * @param {Number} precision - how many decimal paces to round to
	 */
	roundAll(precision = 3) {
		this.xMin = round(this.xMin, precision);
		this.xMax = round(this.xMax, precision);
		this.yMin = round(this.yMin, precision);
		this.yMax = round(this.yMax, precision);
	}

	/**
	 * Checks to see if a x/y point is inside this maxes
	 * @param {Number} x - x value to check
	 * @param {Number} y - y value to check
	 * @returns {Boolean}
	 */
	isPointInside(x, y) {
		if (x >= this.xMax) return false;
		if (x <= this.xMin) return false;
		if (y >= this.yMax) return false;
		if (y <= this.yMin) return false;
		return true;
	}

	/**
	 * Checks if the given otherMaxes object is completely inside this Maxes object.
	 * @param {Object} otherMaxes - The Maxes object to check.
	 * @returns {boolean}
	 */
	isMaxesInside(otherMaxes) {
		if (!this.isPointInside(otherMaxes.xMin, otherMaxes.yMin)) return false;
		if (!this.isPointInside(otherMaxes.xMin, otherMaxes.yMax)) return false;
		if (!this.isPointInside(otherMaxes.xMax, otherMaxes.yMax)) return false;
		if (!this.isPointInside(otherMaxes.xMax, otherMaxes.yMin)) return false;
		return true;
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Takes a random object, and tests to see if it can be
 * considered a Maxes object or not.
 * @param {Object} test - object to test
 * @returns {Boolean}
 */
export function isMaxes(test = {}) {
	if (isNaN(test?.yMin)) return false;
	if (isNaN(test?.xMin)) return false;
	if (isNaN(test?.yMax)) return false;
	if (isNaN(test?.xMax)) return false;
	return true;
}

/**
 * Given two Maxes, check if they overlap
 * @param {Maxes} m1 - first maxes
 * @param {Maxes} m2 - second maxes
 * @param {Boolean | String =} exclusive - 'inclusive' or 'exclusive'
 * @returns {Boolean}
 */
export function maxesOverlap(m1, m2, exclusive = true) {
	// log(`maxesOverlap`, 'start');
	// log(`passed m1 / m2`);
	// log(m1.save());
	// log(m2.save());

	let re;

	if (exclusive)
		re = m1.xMin < m2.xMax && m1.xMax > m2.xMin && m1.yMin < m2.yMax && m1.yMax > m2.yMin;
	else re = m1.xMin <= m2.xMax && m1.xMax >= m2.xMin && m1.yMin <= m2.yMax && m1.yMax >= m2.yMin;

	// log(re);
	// log(`maxesOverlap`, 'end');
	return re;
}

/**
 * This takes an array of maxes objects, and returns a maxes
 * object that represents the extremes of all the passed objects
 * @param {Array} maxesArray - array of 'maxes' objects
 * @returns {Maxes}
 */
export function getOverallMaxes(maxesArray) {
	// log('getOverallMaxes', 'start');
	// log(JSON.stringify(maxesArray));

	const re = maxesMinBounds();
	let tm;

	for (let m = 0; m < maxesArray.length; m++) {
		// log('iteration number ' + m);
		tm = new Maxes(maxesArray[m]);
		// log(tm);

		// find
		re.xMin = Math.min(re.xMin, tm.xMin);
		re.xMax = Math.max(re.xMax, tm.xMax);
		re.yMin = Math.min(re.yMin, tm.yMin);
		re.yMax = Math.max(re.yMax, tm.yMax);
		// log([re]);
	}

	// log('returning');
	// log(re);
	// log('getOverallMaxes', 'end');

	return new Maxes(re);
}

/**
 * Helper that checks if everything is zero
 * @param {Object} maxes - object to check
 * @returns {Boolean}
 */
export function isAllZeros(maxes) {
	return maxes.xMax === 0 && maxes.xMin === 0 && maxes.yMax === 0 && maxes.yMin === 0;
}

/**
 * Generic smallest box
 * @returns {Object}
 */
export function maxesMinBounds() {
	return {
		xMin: Number.MAX_SAFE_INTEGER,
		xMax: Number.MIN_SAFE_INTEGER,
		yMin: Number.MAX_SAFE_INTEGER,
		yMax: Number.MIN_SAFE_INTEGER,
	};
}

/**
 * Generic largest box
 * @returns {Object}
 */
export function maxesMaxBounds() {
	return {
		xMin: Number.MIN_SAFE_INTEGER,
		xMax: Number.MAX_SAFE_INTEGER,
		yMin: Number.MIN_SAFE_INTEGER,
		yMax: Number.MAX_SAFE_INTEGER,
	};
}
