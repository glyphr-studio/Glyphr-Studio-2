/**
 * Stylistic Set
 * Maps one base character to a list of alternate glyphs. Alternates are
 * stored as regular Glyph objects in `project.alternates`, referenced here by
 * their item ID so editing one never changes a Character or Component.
 */
export class StylisticSet {
	/**
	 * Set up the StylisticSet object
	 * @param {Object} arg
	 * @param {String =} arg.name - display name for the set
	 * @param {String =} arg.baseItemID - item ID of the character this set replaces
	 * @param {Array =} arg.alternates - item IDs of the alternate glyphs
	 * @param {String =} arg.feature - OpenType feature tag (ss01 - ss20)
	 */
	constructor({ name = '', baseItemID = '', alternates = [], feature = 'ss01' } = {}) {
		this.objType = 'StylisticSet';
		this.name = name;
		this.baseItemID = baseItemID;
		this.alternates = alternates.slice();
		this.feature = feature;
	}

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean =} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {Object}
	 */
	save(verbose = false) {
		const re = {
			name: this.name,
			baseItemID: this.baseItemID,
			alternates: this.alternates.slice(),
			feature: this.feature,
		};
		if (verbose) re.objType = this.objType;
		return re;
	}
}

/**
 * Makes an ID for a new stylistic set.
 * @param {Object} sets - existing project.stylisticSets
 * @returns {String}
 */
export function makeStylisticSetID(sets = {}) {
	let counter = 1;
	while (sets[`sset-${counter}`]) counter++;
	return `sset-${counter}`;
}

/**
 * Picks the next unused stylistic set feature tag (ss01 - ss20).
 * @param {Object} sets - existing project.stylisticSets
 * @returns {String}
 */
export function makeNextFeatureTag(sets = {}) {
	const used = new Set(Object.values(sets).map((/** @type {any} */ set) => set.feature));
	for (let i = 1; i <= 20; i++) {
		const tag = `ss${String(i).padStart(2, '0')}`;
		if (!used.has(tag)) return tag;
	}
	return 'ss20';
}
