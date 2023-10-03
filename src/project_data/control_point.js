import { calculateAngle, calculateLength, rotate } from '../common/functions.js';
import { Coord } from './coord.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Glyph Element > ControlPoint
 * Either the central Point in a Path Point, or one of it's Handles
 */
export class ControlPoint extends GlyphElement {
	/**
	 * Create a ControlPoint
	 * @param {Coord} coord - position of the handle
	 * @param {Boolean} use - show or hide the handle
	 * @param {PathPoint} parent - link to the parent Path object
	 */
	constructor({
		coord = { x: 0, y: 0 },
		use = true,
		xLock = false,
		yLock = false,
		parent = false,
		type = false,
	} = {}) {
		super();
		this.parent = parent;
		this.coord = coord;
		this.use = use;
		this.xLock = xLock;
		this.yLock = yLock;
		this.type = type;

		this.objType = 'ControlPoint';
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
		const re = {
			coord: this.coord.save(verbose),
		};

		if (!this.use) re.use = false;
		if (this.xLock) re.xLock = true;
		if (this.yLock) re.yLock = true;

		if (verbose) re.objType = this.objType;
		if (this.type === 'p') delete re.use;
		if (!verbose && this.__ID) delete this.__ID;

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

		let re = `${ind}{ControlPoint\n`;
		ind += '  ';

		re += `${ind}coord: ${this.coord.print(level + 1)}\n`;
		if (this.type !== 'p') re += `${ind}use: ${this.use}\n`;

		re += `${ind.substring(2)}}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * Get the x coordinate
	 * @returns {Number}
	 */
	get x() {
		return this.use ? this._coord.x : this.parent.p.x;
	}

	/**
	 * Get the y coordinate
	 * @returns {Number}
	 */
	get y() {
		return this.use ? this._coord.y : this.parent.p.y;
	}

	/**
	 * Get the x/y Coord
	 * @returns {Coord}
	 */
	get coord() {
		return this._coord;
	}

	/**
	 * Get the show/hide value
	 * @returns {Boolean}
	 */
	get use() {
		return this._use === false ? false : true;
	}

	/**
	 * Is the handle locked in the x dimension
	 * @returns {Boolean}
	 */
	get xLock() {
		return this._xLock;
	}

	/**
	 * Is the handle locked in the y dimension
	 * @returns {Boolean}
	 */
	get yLock() {
		return this._yLock;
	}

	/**
	 * Gets the point type: p, h1, h2
	 * @returns {String}
	 */
	get type() {
		return this._type;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Set the X position
	 * If this is not a handle, move the point and the handles
	 * @param {Number} position
	 */
	set x(position) {
		// log(`ControlPoint SET x`, 'start');
		// log(`this.type: ${this.type}`);
		// log(`position: ${position}`);

		if (this.type === 'p') {
			// log(`this is a P control point`);

			let dx = position - this.x;
			// log(`dx: ${dx}`);

			this.parent.updatePathPointPosition('p', dx, 0);
		} else {
			// log(`this is a H control point`);
			this.coord.x = position;
			// Maybe we can move it without using it?
			this.use = true;
		}
		// log(`ControlPoint SET x`, 'end');
	}

	/**
	 * Set the Y position
	 * If this is not a handle, move the point and the handles
	 * @param {Number} position
	 */
	set y(position) {
		if (this.type === 'p') {
			let dy = position - this.y;
			this.parent.updatePathPointPosition('p', 0, dy);
		} else {
			this.coord.y = position;
			// Maybe we can move it without using it?
			this.use = true;
		}
	}

	/**
	 * Set the x/y Coord
	 * @param {Coord} pt
	 */
	set coord(pt) {
		this._coord = new Coord(pt);
		this._coord.parent = this;
		this.use = true;
	}

	/**
	 * Show or hide the handle
	 * @param {Boolean} show
	 */
	set use(show) {
		this._use = !!show;
		this.changed();
	}

	/**
	 * Set the handle lock in the x dimension
	 * @param {Boolean} lock
	 */
	set xLock(lock) {
		this._xLock = !!lock;
	}

	/**
	 * Set the handle lock in the y dimension
	 * @param {Boolean} lock
	 */
	set yLock(lock) {
		this._yLock = !!lock;
	}

	/**
	 * Sets the point type: p, h1, h2
	 * @param {String} type
	 */
	set type(t) {
		this._type = t;
	}

	// --------------------------------------------------------------
	// Lock stuff
	// --------------------------------------------------------------

	/**
	 * Indicates that this object has lockable properties
	 * @returns {Boolean}
	 */
	get isLockable() {
		return true;
	}

	/**
	 * Check to see if x or y are locked
	 * @param {String} propertyName - property to check if locked
	 * @returns {Boolean}
	 */
	isLocked(propertyName) {
		if (propertyName === 'x') return this.xLock;
		if (propertyName === 'y') return this.yLock;
		return false;
	}

	/**
	 * Sets xLock/yLock based on x or y input
	 * @param {String} propertyName - property to lock
	 */
	lock(propertyName) {
		// log(`ControlPoint.lock`, 'start');
		// log(`propertyName: ${propertyName}`);
		if (propertyName === 'x') this.xLock = true;
		if (propertyName === 'y') this.yLock = true;
		// log(`ControlPoint.lock`, 'end');
	}

	/**
	 * Sets xLock/yLock based on x or y input
	 * @param {String} propertyName - property to unlock
	 */
	unlock(propertyName) {
		// log(`ControlPoint.unlock`, 'start');
		// log(`propertyName: ${propertyName}`);
		if (propertyName === 'x') this.xLock = false;
		if (propertyName === 'y') this.yLock = false;
		// log(`ControlPoint.unlock`, 'end');
	}

	/**
	 * Rotate this point around another point
	 * @param {Number} angle - angle to rotate (radians)
	 * @param {XYPoint} about - center point for rotation
	 */
	rotate(angle, about) {
		rotate(this.coord, angle, about);
	}
}
