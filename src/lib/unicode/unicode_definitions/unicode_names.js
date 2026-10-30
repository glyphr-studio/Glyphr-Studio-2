import { decToHex, normalizeCodePoint } from './unicode_ids.js';
import { unicodeNamesBMP } from './unicode_names_0_bmp.js';
import { unicodeNamesSMP } from './unicode_names_1_smp.js';
import { unicodeNameRanges } from './unicode_name_ranges.js';

/** Exact Unicode Name property, or undefined when unnamed or invalid. */
export function getUnicodeName(value) {
	const point = normalizeCodePoint(value);
	if (point === undefined) return undefined;
	const id = decToHex(point);
	if (point < 0x10000) return unicodeNamesBMP[id];
	if (point < 0x20000) return unicodeNamesSMP[id];

	let low = 0;
	let high = unicodeNameRanges.length - 1;
	while (low <= high) {
		const mid = (low + high) >>> 1;
		const range = unicodeNameRanges[mid];
		if (point < range.begin) high = mid - 1;
		else if (point > range.end) low = mid + 1;
		else return range.name.replace('*', point.toString(16).toUpperCase().padStart(4, '0'));
	}
	return undefined;
}

/** Standard names only, in code-point order, with GS-style hexadecimal IDs. */
export function* iterateUnicodeNames() {
	for (const table of [unicodeNamesBMP, unicodeNamesSMP]) {
		for (const id in table) yield [id, table[id]];
	}
	for (const range of unicodeNameRanges) {
		for (let point = range.begin; point <= range.end; point++) {
			yield [decToHex(point), range.name.replace('*', point.toString(16).toUpperCase().padStart(4, '0'))];
		}
	}
}

/** General_Category=Cc; controls do not have a Unicode Name property. */
export function isControlChar(value) {
	const point = normalizeCodePoint(value);
	return point !== undefined && (point <= 0x1f || (point >= 0x7f && point <= 0x9f));
}
