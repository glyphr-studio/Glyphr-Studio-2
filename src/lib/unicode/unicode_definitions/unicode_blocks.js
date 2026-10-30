import { normalizeCodePoint } from './unicode_ids.js';
import { unicodeBlocksBMP, unicodeBlocksBMPUnallocated } from './unicode_blocks_0_bmp.js';
import { unicodeBlocksSMP, unicodeBlocksSMPUnallocated } from './unicode_blocks_1_smp.js';
import { unicodeBlocksSIP, unicodeBlocksSIPUnallocated } from './unicode_blocks_2_sip.js';
import { unicodeBlocksTIP, unicodeBlocksTIPUnallocated } from './unicode_blocks_3_tip.js';
import { unicodeBlocksOther, unicodeBlocksOtherUnallocated } from './unicode_blocks_other.js';

export const unicodeBlocks = [...unicodeBlocksBMP, ...unicodeBlocksSMP, ...unicodeBlocksSIP, ...unicodeBlocksTIP, ...unicodeBlocksOther];
export const unicodeUnallocatedBlocks = [...unicodeBlocksBMPUnallocated, ...unicodeBlocksSMPUnallocated, ...unicodeBlocksSIPUnallocated, ...unicodeBlocksTIPUnallocated, ...unicodeBlocksOtherUnallocated];

/** Official block only. A gap outside Blocks.txt returns false. */
export function getParentRange(value) {
	const point = normalizeCodePoint(value);
	if (point === undefined) return false;
	let low = 0;
	let high = unicodeBlocks.length - 1;
	while (low <= high) {
		const mid = (low + high) >>> 1;
		const block = unicodeBlocks[mid];
		if (point < block.begin) high = mid - 1;
		else if (point > block.end) low = mid + 1;
		else return block;
	}
	return false;
}

export function getUnicodeBlockByName(name) {
	return unicodeBlocks.find(block => block.name === name) || false;
}

export function isCharInRange(value, range) {
	const point = normalizeCodePoint(value);
	return point !== undefined && point >= range.begin && point <= range.end;
}

export function isStandardUnicodeRange(range) {
	return unicodeBlocks.some(block => range.begin === block.begin && range.end === block.end);
}
