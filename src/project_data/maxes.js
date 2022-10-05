import { isVal, round } from '../common/functions.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Glyph Element > Maxes
 * Standard way of defining a bounding box
 */
export class Maxes extends GlyphElement {
	/**
	 * Create a Maxes object
	 * @param {number} xMin - smallest x value
	 * @param {number} xMax - largest x value
	 * @param {number} yMin - smallest y value
	 * @param {number} yMax - largest y value
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
	 * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
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
	 * @param {number} level - how far down we are
	 * @returns {string}
	 */
	print(level = 0) {
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{`;
		re += `xMin:${this._xMin} `;
		re += `xMax:${this._xMax} `;
		re += `yMin:${this._yMin} `;
		re += `yMax:${this._yMax}`;
		re += `}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * Get xMin
	 * @returns {number} value
	 */
	get xMin() {
		// log(`Maxes GET xMin`, 'start');

		if (isVal(this._xMin)) {
			// log(`returning ${this._xMin}`);
			// log(`Maxes GET xMin`, 'end');
			return this._xMin;
		} else {
			// log(`returning MAX_SAFE_INTEGER`);
			// log(`Maxes GET xMin`, 'end');
			return Number.MAX_SAFE_INTEGER;
		}
	}

	/**
	 * Get xMax
	 * @returns {number} value
	 */
	get xMax() {
		if (isVal(this._xMax)) return this._xMax;
		else return Number.MIN_SAFE_INTEGER;
	}

	/**
	 * Get yMin
	 * @returns {number} value
	 */
	get yMin() {
		if (isVal(this._yMin)) return this._yMin;
		else return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Get yMax
	 * @returns {number} value
	 */
	get yMax() {
		if (isVal(this._yMax)) return this._yMax;
		else return Number.MIN_SAFE_INTEGER;
	}

	/**
	 * Figures out the center of the bounding box
	 */
	get center() {
		return {
			x: (this.xMax - this.xMin) / 2 + this.xMin,
			y: (this.yMax - this.yMin) / 2 + this.yMin,
		};
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Set xMin
	 * @param {number} x - new value
	 * @returns {Maxes}
	 */
	set xMin(x) {
		// log(`Maxes SET xMin`, 'start');
		// log(`x: ${x}`);

		x = parseFloat(x);
		// log(`x: ${x}`);

		// log(`this._xMin: ${this._xMin}`);

		if (!isNaN(x)) this._xMin = x;
		// else delete this._xMin;
		// log(`this._xMin: ${this._xMin}`);

		// log(`Maxes SET xMin`, 'end');
	}

	/**
	 * Set xMax
	 * @param {number} x - new value
	 * @returns {Maxes}
	 */
	set xMax(x) {
		x = parseFloat(x);
		if (!isNaN(x)) this._xMax = x;
		else delete this._xMax;
	}

	/**
	 * Set yMin
	 * @param {number} y - new value
	 * @returns {Maxes}
	 */
	set yMin(y) {
		y = parseFloat(y);
		if (!isNaN(y)) this._yMin = y;
		else delete this._yMin;
	}

	/**
	 * Set yMax
	 * @param {number} y - new value
	 * @returns {Maxes}
	 */
	set yMax(y) {
		y = parseFloat(y);
		if (!isNaN(y)) this._yMax = y;
		else delete this._yMax;
	}

	// --------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------

	/**
	 * Rounds all the values to a certain precision
	 * @param {number} precision - how many decimal paces to round to
	 */
	roundAll(precision = 3) {
		this.xMin = round(this.xMin, precision);
		this.xMax = round(this.xMax, precision);
		this.yMin = round(this.yMin, precision);
		this.yMax = round(this.yMax, precision);
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Given two Maxes, check if they overlap
 * @param {Maxes} m1 - first maxes
 * @param {Maxes} m2 - second maxes
 * @param {boolean} exclusive - 'inclusive' or 'exclusive'
 * @returns {boolean}
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
 * @param {array} maxesArray - array of 'maxes' objects
 * @returns {Maxes}
 */
export function getOverallMaxes(maxesArray) {
	// log('getOverallMaxes', 'start');
	// log(maxesArray);

	const re = maxesMinBounds();
	let tm;

	for (let m = 0; m < maxesArray.length; m++) {
		// log('iteration number ' + m);
		tm = new Maxes(maxesArray[m]);
		tm = maxesArray[m];

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
 * Generic smallest box
 * @returns {object}
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
 * @returns {object}
 */
export function maxesMaxBounds() {
	return {
		xMin: Number.MIN_SAFE_INTEGER,
		xMax: Number.MAX_SAFE_INTEGER,
		yMin: Number.MIN_SAFE_INTEGER,
		yMax: Number.MAX_SAFE_INTEGER,
	};
}
