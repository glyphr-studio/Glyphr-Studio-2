import { GlyphElement } from './glyph_element.js';
import { numSan, isVal } from '../common/functions.js';

/**
 * Glyph Element > Coordinate
 * A single x/y coordinate with fancy GlyphElement stuff, used as a child of ControlPoint
 * For simple x/y object, use XYPoint
 */
export class Coord extends GlyphElement {
	/**
	 * Create a coordinate
	 * @param {Number} x - The X value
	 * @param {Number} y - The Y value
	 * @param {Object} parent - link to the parent ControlPoint object
	 */
	constructor({ x = 0, y = 0, parent = false } = {}) {
		super();
		this.parent = parent;
		this.x = x;
		this.y = y;

		this.objType = 'Coord';
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @returns {Object}
	 */
	save() {
		const re = {
			x: this.x,
			y: this.y,
		};

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
		re += `x: ${isVal(this._x) ? this._x : '--'}  `;
		re += `y: ${isVal(this._y) ? this._y : '--'}`;
		re += `}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * Make sure x is a number
	 * @returns {Number}
	 */
	get x() {
		if (!isNaN(this._x)) {
			return this._x;
		} else {
			this._x = 0;
			console.warn('Coord.x was NaN, setting to 0');
			return 0;
		}
	}

	/**
	 * Make sure y is a number
	 * @returns {Number}
	 */
	get y() {
		if (!isNaN(this._y)) {
			return this._y;
		} else {
			this._y = 0;
			console.warn('Coord.y was NaN, setting to 0');
			return 0;
		}
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Set the x position of the point
	 * @param {Number} position
	 */
	set x(position = 0) {
		position = numSan(position);
		// position = round(position, 4);
		if (isNaN(position)) {
			this._x = 0;
		} else {
			// log(`COORD changing _x from ${this._x} to ${position}`);
			this._x = position;
		}

		this.changed();
	}

	/**
	 * Set the y position of the point
	 * @param {Number} position
	 */
	set y(position = 0) {
		position = numSan(position);
		// position = round(position, 4);
		if (isNaN(position)) {
			this._y = 0;
		} else {
			// log(`COORD changing _y from ${this._y} to ${position}`);
			this._y = position;
		}

		this.changed();
	}
}
