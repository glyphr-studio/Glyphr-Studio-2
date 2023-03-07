import { getCurrentProject } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { isControlChar } from '../lib/unicode_blocks.js';
import { basicLatinOrder } from '../project_editor/project_editor.js';

export class GlyphRange {
	constructor({ begin = 0, end = 0, name = '' }) {
		this.begin = begin;
		this.end = end;
		this.name = name;
		this.cachedArray = false;
	}

	get begin() {
		return this._begin || 0;
	}

	set begin(val) {
		this._begin = parseInt(val);
	}

	get end() {
		return this._end || 0;
	}

	set end(val) {
		this._end = parseInt(val);
	}

	// --------------------------------------------------------------
	// Generator
	// --------------------------------------------------------------

	*generator() {
		if (this.begin <= 0x21 && this.end === 0x7f) {
			let basicLatinIndex = 0;
			while (basicLatinIndex < basicLatinOrder.length) {
				yield basicLatinOrder[basicLatinIndex];
				basicLatinIndex++;
			}
		} else {
			let current = this.begin;
			if (getCurrentProject().settings.app.showNonCharPoints) {
				while (current <= this.end) yield current++;
			} else {
				while (isControlChar(current)) current++;
				while (current <= this.end) yield current++;
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
		return {
			begin: this.begin,
			end: this.end,
			name: this.name,
		};
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

	get array() {
		if (this.cachedArray) return this.cachedArray;

		const result = [];

		for (const glyphID of this.generator()) {
			result.push(glyphID);
		}
		this.cachedArray = result;
		return result;
	}
}
