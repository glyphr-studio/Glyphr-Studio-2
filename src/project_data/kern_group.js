import { hexesToChars, validateAsHex } from '../common/character_ids.js';
import { duplicates, parseNumber } from '../common/functions.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Kern Group
 * An object for storing two groups of glyphs, and
 * the horizontal kern value that applies to them.
 */
export class KernGroup extends GlyphElement {
	/**
	 * Set up the KernGroup object
	 * @param {Object} arg
	 * @param {Array =} arg.leftGroup - Collection of Unicode values
	 * @param {Array =} arg.rightGroup - Collection of Unicode values
	 * @param {Number =} arg.value - Amount to move leftGroup to the right
	 */
	constructor({ leftGroup = [], rightGroup = [], value = 0 } = {}) {
		super();
		this.leftGroup = leftGroup;
		this.rightGroup = rightGroup;
		this.value = value;
		this.objType = 'KernGroup';
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
			leftGroup: this.leftGroup.slice(),
			rightGroup: this.rightGroup.slice(),
			value: this._value,
		};

		if (verbose) re.objType = this.objType;

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

		let re = `${ind}{${this.objType} \n`;
		ind += '  ';
		re += `${ind}leftGroup: ${JSON.stringify(this.leftGroup)}\n`;
		re += `${ind}rightGroup: ${JSON.stringify(this.rightGroup)}\n`;
		re += `${ind}value: ${this.value}\n`;
		re += `${ind.substring(2)}}/${this.objType}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * Return the members of the left group
	 * @returns {Array}
	 */
	get leftGroup() {
		return this._leftGroup || [];
	}
	/**
	 * Return the members of the right group
	 * @returns {Array}
	 */
	get rightGroup() {
		return this._rightGroup || [];
	}

	/**
	 * Return the value for this kern
	 * @returns {Number}
	 */
	get value() {
		return this._value || 0;
	}

	/**
	 * Creates a display name for this kern group
	 * @returns {String}
	 */
	get name() {
		// log(`KernGroup GET name`, 'start');
		let result = `${this.leftGroupAsString} | ${this.rightGroupAsString}`;
		// log(`result: ${result}`);
		// log(`KernGroup GET name`, 'end');
		return result;
	}

	/**
	 * Returns the left-group as a string
	 * @returns {String}
	 */
	get leftGroupAsString() {
		/**
		 * @type {Boolean | String}
		 */
		let left = '';
		if (this.leftGroup) {
			left = hexesToChars(this.leftGroup.join(''));
		}
		return left || '';
	}

	/**
	 * Returns the right-group as a string
	 * @returns {String}
	 */
	get rightGroupAsString() {
		/**
		 * @type {Boolean | String}
		 */
		let right = '';
		if (this.rightGroup) {
			right = hexesToChars(this.rightGroup.join(''));
		}
		return right || '';
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Validates and sets the members of the left group
	 * @param {Array} newGroup
	 */
	set leftGroup(newGroup)  {
		newGroup = newGroup.map((value) => validateAsHex(value));
		newGroup = newGroup.filter(duplicates);
		this.changed();
		this._leftGroup = newGroup;
	}
	/**
	 * Validates and sets the members of the right group
	 * @param {Array} newGroup
	 */
	set rightGroup(newGroup) {
		newGroup = newGroup.map((value) => validateAsHex(value));
		newGroup = newGroup.filter(duplicates);
		this.changed();
		this._rightGroup = newGroup;
	}

	/**
	 * Set the value for this kern
	 * @param {Number} val
	 */
	set value(val) {
		this._value = parseNumber(val) || 0;
		this.changed();
	}
}
