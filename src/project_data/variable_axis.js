/**
 * Variable Axis
 * Describes one axis of a variable font: a four character tag, a
 * human readable name, and the min / default / max range of values.
 *
 * The design-space metadata is saved with the project and exported to fvar.
 * Glyphr Studio does not yet generate interpolated outline masters.
 */

/**
 * The registered OpenType axis tags, plus the custom options Glyphr
 * Studio offers as a convenience. `custom: true` means the user picks
 * their own tag.
 */
export const STANDARD_AXIS_TYPES = [
	{ tag: 'wght', name: 'Weight', min: 100, default: 400, max: 900 },
	{ tag: 'wdth', name: 'Width', min: 50, default: 100, max: 200 },
	{ tag: 'slnt', name: 'Slant', min: -15, default: 0, max: 0 },
	{ tag: 'opsz', name: 'Optical size', min: 8, default: 14, max: 144 },
	{ tag: 'RNDS', name: 'Roundness', min: 0, default: 50, max: 100, custom: true },
	{ tag: 'XXXX', name: 'Custom', min: 0, default: 50, max: 100, custom: true },
];

/**
 * Normalizes an axis tag to exactly four characters.
 * @param {String} tag - raw tag input
 * @returns {String}
 */
export function sanitizeAxisTag(tag = '') {
	const cleaned = String(tag)
		.replace(/[^A-Za-z0-9]/g, '')
		.substring(0, 4);
	return cleaned.padEnd(4, 'X');
}

export class VariableAxis {
	/**
	 * Set up the VariableAxis object
	 * @param {Object} arg
	 * @param {String =} arg.tag - four character OpenType axis tag
	 * @param {String =} arg.name - display name
	 * @param {Number =} arg.min - minimum axis value
	 * @param {Number =} arg.max - maximum axis value
	 * @param {Number =} arg.defaultValue - value used when no variation is applied
	 * @param {Number =} arg.value - the value currently previewed in the UI
	 */
	constructor({
		tag = 'wght',
		name = 'Weight',
		min = 100,
		max = 900,
		defaultValue = 400,
		value = false,
	} = {}) {
		this.objType = 'VariableAxis';
		this.tag = sanitizeAxisTag(tag);
		this.name = name;
		this.min = Number(min);
		this.max = Number(max);
		this.defaultValue = Number(defaultValue);
		this.value = value === false ? this.defaultValue : Number(value);
	}

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean =} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {Object}
	 */
	save(verbose = false) {
		const re = {
			tag: this.tag,
			name: this.name,
			min: this.min,
			max: this.max,
			defaultValue: this.defaultValue,
			value: this.value,
		};
		if (verbose) re.objType = this.objType;
		return re;
	}

	/**
	 * Clamps a value into this axis's range
	 * @param {Number} value - value to clamp
	 * @returns {Number}
	 */
	clamp(value) {
		const number = Number(value);
		if (!isFinite(number)) return this.defaultValue;
		return Math.min(this.max, Math.max(this.min, number));
	}
}

/**
 * Makes an ID for a new variable axis.
 * @param {Object} axes - existing project.variableAxes
 * @param {String} tag - axis tag
 * @returns {String}
 */
export function makeVariableAxisID(axes = {}, tag = 'wght') {
	const base = `axis-${sanitizeAxisTag(tag)}`;
	if (!axes[base]) return base;
	let counter = 2;
	while (axes[`${base}-${counter}`]) counter++;
	return `${base}-${counter}`;
}
