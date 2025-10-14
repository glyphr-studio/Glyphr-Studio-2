import { describe, expect, it } from 'vitest';
import { CharacterRange } from '../../../project_data/character_range.js';
import {
	getParentRange,
	getUnicodeBlockByName,
	isCharInRange,
	isControlChar,
	isStandardUnicodeRange,
	unicodeNonCharPoints,
} from '../unicode_blocks.js';

describe('Unicode Blocks - getUnicodeBlockByName', () => {
	it('getUnicodeBlockByName - finds Basic Latin block', () => {
		const block = getUnicodeBlockByName('Basic Latin');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Basic Latin');
		expect(block.begin).toBe(0x0020);
		expect(block.end).toBe(0x007f);
	});

	it('getUnicodeBlockByName - finds Latin-1 Supplement block', () => {
		const block = getUnicodeBlockByName('Latin-1 Supplement');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Latin-1 Supplement');
		expect(block.begin).toBe(0x00a0);
	});

	it('getUnicodeBlockByName - finds Latin Extended-A', () => {
		const block = getUnicodeBlockByName('Latin Extended-A');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Latin Extended-A');
	});

	it('getUnicodeBlockByName - finds Greek and Coptic', () => {
		const block = getUnicodeBlockByName('Greek and Coptic');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Greek and Coptic');
	});

	it('getUnicodeBlockByName - finds Cyrillic', () => {
		const block = getUnicodeBlockByName('Cyrillic');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Cyrillic');
	});

	it('getUnicodeBlockByName - finds Arabic', () => {
		const block = getUnicodeBlockByName('Arabic');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Arabic');
	});

	it('getUnicodeBlockByName - finds CJK Unified Ideographs', () => {
		const block = getUnicodeBlockByName('CJK Unified Ideographs');
		expect(block).toBeTruthy();
		expect(block.name).toBe('CJK Unified Ideographs');
	});

	it('getUnicodeBlockByName - finds Emoji block in SMP', () => {
		const block = getUnicodeBlockByName('Emoticons');
		expect(block).toBeTruthy();
		expect(block.name).toBe('Emoticons');
	});

	it('getUnicodeBlockByName - returns false for non-existent block', () => {
		const block = getUnicodeBlockByName('Non Existent Block Name');
		expect(block).toBe(false);
	});

	it('getUnicodeBlockByName - returns false for empty string', () => {
		const block = getUnicodeBlockByName('');
		expect(block).toBe(false);
	});

	it('getUnicodeBlockByName - case sensitive matching', () => {
		const block = getUnicodeBlockByName('basic latin');
		expect(block).toBe(false);
	});
});

describe('Unicode Blocks - unicodeNonCharPoints constant', () => {
	it('unicodeNonCharPoints - is an array', () => {
		expect(Array.isArray(unicodeNonCharPoints)).toBe(true);
	});

	it('unicodeNonCharPoints - contains Basic Latin Controls', () => {
		const controls = unicodeNonCharPoints.find((range) => range.name === 'Basic Latin Controls');
		expect(controls).toBeTruthy();
		expect(controls.begin).toBe(0x0000);
		expect(controls.end).toBe(0x001f);
	});

	it('unicodeNonCharPoints - contains Latin-1 Supplement Controls', () => {
		const controls = unicodeNonCharPoints.find(
			(range) => range.name === 'Latin-1 Supplement Controls'
		);
		expect(controls).toBeTruthy();
		expect(controls.begin).toBe(0x0080);
		expect(controls.end).toBe(0x009f);
	});

	it('unicodeNonCharPoints - has expected structure', () => {
		unicodeNonCharPoints.forEach((range) => {
			expect(range).toHaveProperty('begin');
			expect(range).toHaveProperty('end');
			expect(range).toHaveProperty('name');
			expect(typeof range.begin).toBe('number');
			expect(typeof range.end).toBe('number');
			expect(typeof range.name).toBe('string');
		});
	});
});

describe('Unicode Blocks - isControlChar', () => {
	it('isControlChar - null character is control char', () => {
		expect(isControlChar(0x0000)).toBe(true);
	});

	it('isControlChar - tab character is control char', () => {
		expect(isControlChar(0x0009)).toBe(true);
	});

	it('isControlChar - line feed is control char', () => {
		expect(isControlChar(0x000a)).toBe(true);
	});

	it('isControlChar - carriage return is control char', () => {
		expect(isControlChar(0x000d)).toBe(true);
	});

	it('isControlChar - DEL character is control char', () => {
		expect(isControlChar(0x001f)).toBe(true);
	});

	it('isControlChar - Latin-1 Supplement control characters', () => {
		expect(isControlChar(0x0080)).toBe(true);
		expect(isControlChar(0x0090)).toBe(true);
		expect(isControlChar(0x009f)).toBe(true);
	});

	it('isControlChar - space is not a control char', () => {
		expect(isControlChar(0x0020)).toBe(false);
	});

	it('isControlChar - regular ASCII letter is not control char', () => {
		expect(isControlChar(0x0041)).toBe(false);
	});

	it('isControlChar - number is not control char', () => {
		expect(isControlChar(0x0030)).toBe(false);
	});

	it('isControlChar - emoji is not control char', () => {
		expect(isControlChar(0x1f600)).toBe(false);
	});
});

describe('Unicode Blocks - isCharInRange', () => {
	const testRange = { begin: 0x0041, end: 0x005a, name: 'Test Range' }; // A-Z

	it('isCharInRange - character at beginning of range', () => {
		expect(isCharInRange(0x0041, testRange)).toBe(true);
	});

	it('isCharInRange - character at end of range', () => {
		expect(isCharInRange(0x005a, testRange)).toBe(true);
	});

	it('isCharInRange - character in middle of range', () => {
		expect(isCharInRange(0x0050, testRange)).toBe(true);
	});

	it('isCharInRange - character before range', () => {
		expect(isCharInRange(0x0040, testRange)).toBe(false);
	});

	it('isCharInRange - character after range', () => {
		expect(isCharInRange(0x005b, testRange)).toBe(false);
	});

	it('isCharInRange - accepts hex string', () => {
		expect(isCharInRange('0x0041', testRange)).toBe(true);
	});

	it('isCharInRange - accepts decimal string', () => {
		expect(isCharInRange('65', testRange)).toBe(true); // 0x41
	});

	it('isCharInRange - accepts decimal number', () => {
		expect(isCharInRange(65, testRange)).toBe(true);
	});

	it('isCharInRange - returns false for invalid input', () => {
		expect(isCharInRange('invalid', testRange)).toBe(false);
	});

	it('isCharInRange - returns false for NaN', () => {
		expect(isCharInRange(NaN, testRange)).toBe(false);
	});

	it('isCharInRange - returns false for null', () => {
		expect(isCharInRange(null, testRange)).toBe(false);
	});

	it('isCharInRange - returns false for undefined', () => {
		expect(isCharInRange(undefined, testRange)).toBe(false);
	});

	it('isCharInRange - works with Basic Latin Controls range', () => {
		const controlRange = { begin: 0x0000, end: 0x001f, name: 'Basic Latin Controls' };
		expect(isCharInRange(0x0000, controlRange)).toBe(true);
		expect(isCharInRange(0x0010, controlRange)).toBe(true);
		expect(isCharInRange(0x001f, controlRange)).toBe(true);
		expect(isCharInRange(0x0020, controlRange)).toBe(false);
	});
});

describe('Unicode Blocks - getParentRange', () => {
	it('getParentRange - finds Basic Latin for letter A', () => {
		const range = getParentRange(0x0041);
		expect(range).toBeTruthy();
		expect(range.name).toBe('Basic Latin');
	});

	it('getParentRange - finds Basic Latin for space', () => {
		const range = getParentRange(0x0020);
		expect(range).toBeTruthy();
		expect(range.name).toBe('Basic Latin');
	});

	it('getParentRange - finds Latin-1 Supplement', () => {
		const range = getParentRange(0x00a0);
		expect(range).toBeTruthy();
		expect(range.name).toBe('Latin-1 Supplement');
	});

	it('getParentRange - finds Greek and Coptic', () => {
		const range = getParentRange(0x03b1); // Greek small letter alpha
		expect(range).toBeTruthy();
		expect(range.name).toBe('Greek and Coptic');
	});

	it('getParentRange - finds Cyrillic', () => {
		const range = getParentRange(0x0410); // Cyrillic capital letter A
		expect(range).toBeTruthy();
		expect(range.name).toBe('Cyrillic');
	});

	it('getParentRange - finds Arabic', () => {
		const range = getParentRange(0x0627); // Arabic letter Alef
		expect(range).toBeTruthy();
		expect(range.name).toBe('Arabic');
	});

	it('getParentRange - finds CJK Unified Ideographs', () => {
		const range = getParentRange(0x4e00);
		expect(range).toBeTruthy();
		expect(range.name).toBe('CJK Unified Ideographs');
	});

	it('getParentRange - finds Emoticons (emoji)', () => {
		const range = getParentRange(0x1f600);
		expect(range).toBeTruthy();
		expect(range.name).toBe('Emoticons');
	});

	it('getParentRange - finds range for character at block boundary', () => {
		const range = getParentRange(0x007f); // Last char in Basic Latin
		expect(range).toBeTruthy();
		expect(range.name).toBe('Basic Latin');
	});

	it('getParentRange - returns false for invalid ID', () => {
		const range = getParentRange(-1);
		expect(range).toBe(false);
	});

	it('getParentRange - returns false for out of range ID', () => {
		const range = getParentRange(0x110000); // Beyond Unicode range
		expect(range).toBe(false);
	});

	it('getParentRange - handles default parameter', () => {
		const range = getParentRange();
		expect(range).toBe(false);
	});
});

describe('Unicode Blocks - isStandardUnicodeRange', () => {
	it('isStandardUnicodeRange - Basic Latin is standard', () => {
		const range = { begin: 0x0020, end: 0x007f, name: 'Basic Latin' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - Latin-1 Supplement is standard', () => {
		const range = { begin: 0x00a0, end: 0x00ff, name: 'Latin-1 Supplement' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - Latin Extended-A is standard', () => {
		const range = { begin: 0x0100, end: 0x017f, name: 'Latin Extended-A' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - custom range is not standard', () => {
		const range = { begin: 0x1000, end: 0x1010, name: 'Custom Range' };
		expect(isStandardUnicodeRange(range)).toBe(false);
	});

	it('isStandardUnicodeRange - range with wrong begin is not standard', () => {
		const range = { begin: 0x0021, end: 0x007f, name: 'Basic Latin' };
		expect(isStandardUnicodeRange(range)).toBe(false);
	});

	it('isStandardUnicodeRange - range with wrong end is not standard', () => {
		const range = { begin: 0x0020, end: 0x007e, name: 'Basic Latin' };
		expect(isStandardUnicodeRange(range)).toBe(false);
	});

	it('isStandardUnicodeRange - accepts CharacterRange object', () => {
		const range = new CharacterRange({ begin: 0x0020, end: 0x007f, name: 'Basic Latin' });
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - empty range is not standard', () => {
		const range = { begin: 0, end: 0, name: '' };
		expect(isStandardUnicodeRange(range)).toBe(false);
	});

	it('isStandardUnicodeRange - Greek and Coptic is standard', () => {
		const range = { begin: 0x0370, end: 0x03ff, name: 'Greek and Coptic' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - Cyrillic is standard', () => {
		const range = { begin: 0x0400, end: 0x04ff, name: 'Cyrillic' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});

	it('isStandardUnicodeRange - range with partial overlap is not standard', () => {
		const range = { begin: 0x0010, end: 0x0070, name: 'Partial Range' };
		expect(isStandardUnicodeRange(range)).toBe(false);
	});

	it('isStandardUnicodeRange - emoji block is standard', () => {
		const range = { begin: 0x1f600, end: 0x1f64f, name: 'Emoticons' };
		expect(isStandardUnicodeRange(range)).toBe(true);
	});
});
