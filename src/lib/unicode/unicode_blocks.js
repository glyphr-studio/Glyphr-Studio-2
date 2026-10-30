import {
	isCharInRange as isStandardCharInRange,
	isControlChar as isStandardControlChar,
	normalizeCodePoint,
} from './unicode_definitions/index.js';
import {
	unicodeBlocksBMP,
	unicodeBlocksBMPUnallocated,
} from './unicode_blocks_0_bmp.js';
import { unicodeBlocksSMP, unicodeBlocksSMPUnallocated } from './unicode_blocks_1_smp.js';
import { unicodeBlocksSIP, unicodeBlocksSIPUnallocated } from './unicode_blocks_2_sip.js';
import { unicodeBlocksTIP, unicodeBlocksTIPUnallocated } from './unicode_blocks_3_tip.js';
import { unicodeBlocksOther, unicodeBlocksOtherUnallocated } from './unicode_blocks_other.js';

const allBlocks = [
	unicodeBlocksBMP,
	unicodeBlocksBMPUnallocated,
	unicodeBlocksSMP,
	unicodeBlocksSMPUnallocated,
	unicodeBlocksSIP,
	unicodeBlocksSIPUnallocated,
	unicodeBlocksTIP,
	unicodeBlocksTIPUnallocated,
	unicodeBlocksOther,
	unicodeBlocksOtherUnallocated,
];

/**
 * For a given Unicode block name, return the block object
 * @param {String} name - name of the block to find
 * @returns {Object | false}
 */
export function getUnicodeBlockByName(name) {
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (currentBlock[b].name === name) {
				return currentBlock[b];
			}
		}
	}
	return false;
}

export const unicodeNonCharPoints = [
	{ begin: 0x0000, end: 0x001f, name: 'Basic Latin Controls' },
	{ begin: 0x0080, end: 0x009f, name: 'Latin-1 Supplement Controls' },
];

/**
 * Checks to see if a given char ID is a control character
 * @param {Number} id - id of the character
 * @returns {Boolean} - true if it's a control character
 */
export function isControlChar(id) {
	return isStandardControlChar(id);
}

/**
 * Checks to see if a given char ID is in a range
 * @param {Number | String} id - Unicode ID
 * @param {Object} range - to check
 * @returns {Boolean}
 */
export function isCharInRange(id, range) {
	return isStandardCharInRange(id, range);
}

/**
 * For a given character ID, return the parent Unicode Block
 * @param {Number} id
 * @returns {Object | false}
 */
export function getParentRange(id = -1) {
	const point = normalizeCodePoint(id);
	if (point === undefined) {
		console.warn(`getParentRange: No parent range found for ID ${id}`);
		return false;
	}

	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (point <= currentBlock[b].end && point >= currentBlock[b].begin) {
				return currentBlock[b];
			}
		}
	}
	console.warn(`getParentRange: No parent range found for ID ${point}`);
	return false;
}

/**
 * Checks a range to tell if it's a default or a custom range
 * @param {Object} range - range to check
 * @returns {Boolean}
 */
export function isStandardUnicodeRange(range) {
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (
				range?.begin === currentBlock[b].begin &&
				range?.end === currentBlock[b].end
			) {
				return true;
			}
		}
	}
	return false;
}
