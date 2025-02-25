import { parseNumber } from '../../common/functions.js';
import { CharacterRange } from '../../project_data/character_range.js';
import { unicodeBlocksBMP } from './unicode_blocks_0_bmp.js';
import { unicodeBlocksSMP } from './unicode_blocks_1_smp.js';
import { unicodeBlocksSIP } from './unicode_blocks_2_sip.js';
import { unicodeBlocksTIP } from './unicode_blocks_3_tip.js';

let allBlocks = [unicodeBlocksBMP, unicodeBlocksSMP, unicodeBlocksSIP, unicodeBlocksTIP];

export function getUnicodeBlockByName(name) {
	// log(`getUnicodeBlockByName`, 'start');
	// log(`name: ${name}`);
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (currentBlock[b].name === name) {
				// log(`found currentBlock[b].name: ${currentBlock[b].name}`);
				// log(`getUnicodeBlockByName`, 'end');
				return currentBlock[b];
			}
		}
	}
	// log(`returning FALSE`);
	// log(`getUnicodeBlockByName`, 'end');
	return false;
}

export const unicodeNonCharPoints = [
	{ begin: 0x0000, end: 0x001f, name: 'Basic Latin Controls' },
	{ begin: 0x0080, end: 0x009f, name: 'Latin-1 Supplement Controls' },
];

export function isControlChar(id) {
	for (let r = 0; r < unicodeNonCharPoints.length; r++) {
		if (isCharInRange(id, unicodeNonCharPoints[r])) {
			return true;
		}
	}

	return false;
}

/**
 * Checks to see if a given char ID is in a range
 * @param {Number} id - Unicode ID
 * @param {Object} range - to check
 * @returns {Boolean}
 */
export function isCharInRange(id, range) {
	id = parseNumber(id);
	if (isNaN(id)) return false;
	let result = id <= range.end && id >= range.begin;
	return result;
}

/**
 * For a given character ID, return the parent Unicode Block
 * @param {Number} id
 * @returns {Object | false}
 */
export function getParentRange(id = -1) {
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (id <= currentBlock[b].end && id >= currentBlock[b].begin) {
				return currentBlock[b];
			}
		}
	}
	return false;
}

/**
 * Checks a range to tell if it's a default or a custom range
 * @param {Object | CharacterRange} range - range to check
 * @returns {Boolean}
 */
export function isStandardUnicodeRange(range) {
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (range.begin === currentBlock[b].begin && range.end === currentBlock[b].end) {
				return true;
			}
		}
	}
	return false;
}
