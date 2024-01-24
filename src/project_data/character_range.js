import { decToHex } from '../common/character_ids.js';
import { isControlChar } from '../lib/unicode/unicode_blocks.js';

export class CharacterRange {
	constructor({ begin = 0, end = 0, name = '', enabled = true, count = 0 }) {
		this.begin = begin;
		this.end = end;
		this.name = name;
		this.enabled = !!enabled;
		this.count = count;
		this.cachedArray = false;
	}

	get begin() {
		return this._begin || 0;
	}

	set begin(val) {
		this._begin = parseInt(val);
		this.cachedArray = false;
	}

	get end() {
		return this._end || 0;
	}

	set end(val) {
		this._end = parseInt(val);
		this.cachedArray = false;
	}

	get count() {
		return this._count || 0;
	}

	set count(val) {
		this._count = parseInt(val);
	}

	// --------------------------------------------------------------
	// Generator
	// --------------------------------------------------------------

	/**
	 * For this range, yields char points in order.
	 */
	*generator(showNonCharPoints = false) {
		if (this.begin <= 0x21 && (this.end === 0x7e || this.end === 0x7f)) {
			let basicLatinIndex = 0;
			while (basicLatinIndex < basicLatinOrder.length) {
				yield basicLatinOrder[basicLatinIndex];
				basicLatinIndex++;
			}
		} else {
			let current = this.begin;
			if (showNonCharPoints) {
				while (current <= this.end) yield decToHex(current++);
			} else {
				while (isControlChar(current)) current++;
				while (current <= this.end) yield decToHex(current++);
			}
		}
	}

	// --------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------

	get isValid() {
		let begin = this.begin !== 0;
		let end = this.end !== 0;
		let name = this.name !== '';
		return begin && end && name;
	}

	save() {
		let result = {
			name: this.name,
			begin: this.beginHex,
			end: this.endHex,
			enabled: this.enabled,
		};
		return result;
	}

	isWithinRange(id) {
		return id <= this.end && id >= this.begin;
	}

	// --------------------------------------------------------------
	// Calculated properties
	// --------------------------------------------------------------

	get beginHex() {
		return decToHex(this.begin);
	}

	get endHex() {
		return decToHex(this.end);
	}

	get note() {
		return `["${this.beginHex}", "${this.endHex}"]`;
	}

	get id() {
		return `${this.name} ${this.note}`;
	}

	getMemberIDs(showNonCharPoints = false) {
		if (this.cachedArray) return this.cachedArray;

		const result = [];

		for (const glyphID of this.generator(showNonCharPoints)) {
			result.push(glyphID);
		}
		this.cachedArray = result;
		return result;
	}
}

// This was in ProjectEditor, but child dependencies shouldn't import from
// parent nodes... so now ProjectEditor imports from here.
export const basicLatinOrder = [
	'0x41',
	'0x42',
	'0x43',
	'0x44',
	'0x45',
	'0x46',
	'0x47',
	'0x48',
	'0x49',
	'0x4A',
	'0x4B',
	'0x4C',
	'0x4D',
	'0x4E',
	'0x4F',
	'0x50',
	'0x51',
	'0x52',
	'0x53',
	'0x54',
	'0x55',
	'0x56',
	'0x57',
	'0x58',
	'0x59',
	'0x5A',
	'0x61',
	'0x62',
	'0x63',
	'0x64',
	'0x65',
	'0x66',
	'0x67',
	'0x68',
	'0x69',
	'0x6A',
	'0x6B',
	'0x6C',
	'0x6D',
	'0x6E',
	'0x6F',
	'0x70',
	'0x71',
	'0x72',
	'0x73',
	'0x74',
	'0x75',
	'0x76',
	'0x77',
	'0x78',
	'0x79',
	'0x7A',
	'0x30',
	'0x31',
	'0x32',
	'0x33',
	'0x34',
	'0x35',
	'0x36',
	'0x37',
	'0x38',
	'0x39',
	'0x21',
	'0x22',
	'0x23',
	'0x24',
	'0x25',
	'0x26',
	'0x27',
	'0x28',
	'0x29',
	'0x2A',
	'0x2B',
	'0x2C',
	'0x2D',
	'0x2E',
	'0x2F',
	'0x3A',
	'0x3B',
	'0x3C',
	'0x3D',
	'0x3E',
	'0x3F',
	'0x40',
	'0x5B',
	'0x5C',
	'0x5D',
	'0x5E',
	'0x5F',
	'0x60',
	'0x7B',
	'0x7C',
	'0x7D',
	'0x7E',
	'0x20',
];
