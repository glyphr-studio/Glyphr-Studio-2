import { clone, json } from '../common/functions.js';

/**
 * Base for all Glyph Elements
 */
export class GlyphElement {
	/** Yay! */
	constructor() {
		// this.__ID = makeRandomID();
	}

	/**
	 * Any change that updates the path of any part of a glyph
	 * gets bubbled up through the GlyphElement hierarchy
	 */
	changed() {
		// log(`changed called on ${this.objType}:${this.id}:${this.name}`);
		// log(`~CHANGED`, 'start');
		// log(`${this.objType} ${this?.name} ${this.__ID}`);
		if (this.cache) {
			this.cache = {};
		}
		// log(this.cache);

		if (this.parent && this.parent.changed) {
			// log('\tcalling parent.changed()');
			this.parent.changed();
		} else {
			// log(this.cache);
			// log('\tNo Parent!');
		}
		// log(`~CHANGED`, 'end');
	}

	get ident() {
		return this.__ID || '';
	}

	/**
	 * Find out what type of Element this is
	 */
	get objType() {
		return this._objType || this.constructor.name;
	}

	/**
	 * Returns the name of the type of Glyph Element this is.
	 * For the three objects that use Glyph as their base type,
	 * figures out the type based on the ID.
	 */
	get displayType() {
		if (this.id) {
			if (this.id.startsWith('liga-')) return 'Ligature';
			if (this.id.startsWith('comp-')) return 'Component';
			if (this.id.startsWith('glyph-')) return 'Glyph';
			if (this.id.startsWith('kern-')) return 'Kern Group';
		}
		return this.objType;
	}

	/**
	 * Find out what type of Element this is
	 * @param {String} type
	 * @returns {String}
	 */
	set objType(type) {
		this._objType = type;
	}

	/**
	 * get the cache
	 * @returns {Object}
	 */
	get cache() {
		if (!this._cache) this._cache = {};
		return this._cache;
	}

	/**
	 * set the cache
	 * @param {Object} cache
	 * @returns {Object}
	 */
	set cache(cache = {}) {
		this._cache = cache;
	}

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = clone(this);

		if (verbose) re.objType = this.objType;
		else delete re.objType;

		if (re.cache) delete re.cache;

		return re;
	}

	/**
	 * Returns a totally new Glyph Element object that
	 * matches this one.
	 * @returns {Object}
	 */
	clone() {
		return new this.constructor(this.save(true));
	}

	/**
	 * String representation of this object
	 * Uses .save() to only get defaults
	 * @returns {String}
	 */
	toString() {
		return json(this.save());
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {Number} level - how far down we are
	 * @param {Number} num - increment designator for arrays
	 * @returns {String}
	 */
	print(level = 0, num = false) {
		// log(`GlyphElement.print`, 'start');
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{${this.objType} ${num ? num : ''}\n`;
		ind += '  ';

		const safeObj = this.save();
		// log(`\n⮟safeObj⮟`);
		// log(safeObj);
		let elem;

		for (const key of Object.keys(safeObj)) {
			elem = this[key];
			if (elem.print) {
				re += `${ind}${key}: ${elem.print(level + 1)}\n`;
			} else {
				if (typeof elem !== 'function') {
					if (typeof elem === 'object') {
						re += `${ind}${key}: ${JSON.stringify(elem)}\n`;
					} else {
						re += `${ind}${key}: ${elem}\n`;
					}
				}
			}
		}

		re += `${ind.substring(2)}}/${this.objType} ${num ? num : ''}`;

		// log(`GlyphElement.print`, 'end');
		return re;
	}

	// --------------------------------------------------------------
	// Lock stuff
	// For most objects this just provides defaults
	// Certain objects will overwrite these methods
	// for more functionality
	// --------------------------------------------------------------
	/**
	 * For glyph elements with lockable properties, this function
	 * will return true.
	 * @returns {Boolean}
	 */
	get isLockable() {
		return false;
	}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to return a boolean.
	 * By default, properties are all unlocked.
	 * @param {String} propertyName - property to check if locked
	 * @returns {Boolean}
	 */
	isLocked() {
		return false;
	}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to lock properties.
	 * @param {String} propertyName - property to lock
	 */
	lock() {}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to lock properties.
	 * @param {String} propertyName - property to unlock
	 */
	unlock() {}
}

/**
 * A quick visual way to see if two objects are actually the
 * same object from the console.
 * @returns String of emojis
 */
export function makeRandomID() {
	let glyphs = ['💖', '🦧', '🐆', '✅', '🐋', '😈', '🦑'];
	let result = '';
	for (let i = 0; i < 3; i++) {
		result += glyphs[Math.floor(Math.random() * glyphs.length)];
	}

	return result;
}
