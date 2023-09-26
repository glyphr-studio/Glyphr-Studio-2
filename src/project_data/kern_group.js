import { getCurrentProject } from '../app/main.js';
import { hexesToChars, validateAsHex } from '../common/character_ids.js';
import { duplicates } from '../common/functions.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Kern Group
 * An object for storing two groups of glyphs, and
 * the horizontal kern value that applies to them.
 */
export class KernGroup extends GlyphElement {
	/**
	 * Set up the KernGroup object
	 * @param {Array} leftGroup - Collection of Unicode values
	 * @param {Array} rightGroup - Collection of Unicode values
	 * @param {Number} value - Amount to move leftGroup to the right
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

	get leftGroupAsString() {
		let left = '';
		if (this.leftGroup) {
			left = hexesToChars(this.leftGroup.join(''));
		}
		return left;
	}

	get rightGroupAsString() {
		let right = '';
		if (this.rightGroup) {
			right = hexesToChars(this.rightGroup.join(''));
		}
		return right;
	}

	get leftGroupWidth() {
		let leftWidth = 0;
		const project = getCurrentProject();
		this.leftGroup.forEach((id) => {
			let item = project.getItem(`glyph-${id}`);
			if (item && item.advanceWidth) leftWidth = Math.max(leftWidth, item.advanceWidth);
		});
		return leftWidth;
	}

	get rightGroupWidth() {
		let rightWidth = 0;
		const project = getCurrentProject();
		this.rightGroup.forEach((id) => {
			let item = project.getItem(`glyph-${id}`);
			if (item && item.advanceWidth) rightWidth = Math.max(rightWidth, item.advanceWidth);
		});
		return rightWidth;
	}

	get groupWidth() {
		// log(`KernGroup GET groupWidth`, 'start');
		if (!this?.cache?.groupWidth) {
			const project = getCurrentProject();
			let leftWidth = this.leftGroupWidth || project.defaultAdvanceWidth;
			let rightWidth = this.rightGroupWidth || project.defaultAdvanceWidth;
			this.cache.groupWidth = leftWidth - this.value + rightWidth;
			// log(`this.cache.groupWidth: ${this.cache.groupWidth}`);
		}
		// log(`KernGroup GET groupWidth`, 'end');
		return this.cache.groupWidth;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * Validates and sets the members of the left group
	 * @param {Array}
	 */
	set leftGroup(newGroup = []) {
		newGroup = newGroup.map((value) => validateAsHex(value));
		newGroup = newGroup.filter(duplicates);
		this.changed();
		this._leftGroup = newGroup;
	}
	/**
	 * Validates and sets the members of the right group
	 * @param {Array}
	 */
	set rightGroup(newGroup = []) {
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
		this._value = parseInt(val) || 0;
		this.changed();
	}
}
