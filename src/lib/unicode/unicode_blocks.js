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

export function isControlChar(char) {
	for (let r = 0; r < unicodeNonCharPoints.length; r++) {
		if (isCharInRange(char, unicodeNonCharPoints[r])) {
			return true;
		}
	}

	return false;
}

export function isCharInRange(char, range) {
	char = parseInt(char);
	if (isNaN(char)) return false;
	let result = char <= range.end && char >= range.begin;
	return result;
}

export function getParentRange(char) {
	for (let i = 0; i < allBlocks.length; i++) {
		const currentBlock = allBlocks[i];
		for (let b = 0; b < currentBlock.length; b++) {
			if (char <= currentBlock[b].end && char >= currentBlock[b].begin) {
				return currentBlock[b];
			}
		}
	}
	return false;
}
