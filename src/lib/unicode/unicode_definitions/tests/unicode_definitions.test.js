import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import * as definitions from '../index.js';

test('versioned schema and GS-compatible data shapes', () => {
	assert.equal(definitions.unicodeVersion, '18.0.0');
	assert.equal(definitions.unicodeReleaseDate, '2026-09-16');
	assert.equal(definitions.unicodeDefinitionSchemaVersion, 1);
	assert.equal(definitions.unicodeNamedCharacterCount, 172808);
	assert.equal(definitions.unicodeBlockCount, 353);
	assert.equal(definitions.unicodeNamesBMP['0x41'], 'LATIN CAPITAL LETTER A');
	assert.equal(definitions.unicodeNamesBMP['0x0041'], undefined);
	assert.equal(definitions.unicodeNamesBMP['0x0'], undefined);
	assert.equal(definitions.unicodeBlocks.length, 353);
	assert.equal(definitions.unicodeBlocksBMP[0].begin, 0);
	assert.equal(definitions.unicodeBlocksBMP[1].begin, 0x80);
	for (const source of Object.values(definitions.unicodeSources)) {
		assert(source.url.startsWith('https://www.unicode.org/Public/18.0.0/ucd/'));
		assert.match(source.sha256, /^[0-9a-f]{64}$/);
	}
});

test('input normalization accepts GS IDs, padded IDs, numbers, and U+ notation', () => {
	for (const input of [65, '65', '0x41', '0x0041', '0x000041', '0X41', 'U+0041', 'u+41']) {
		assert.equal(definitions.normalizeCodePoint(input), 65);
		assert.equal(definitions.decToHex(input), '0x41');
		assert.equal(definitions.getUnicodeName(input), 'LATIN CAPITAL LETTER A');
	}
	assert.equal(definitions.normalizeCodePoint('0x0000'), 0);
	assert.equal(definitions.normalizeCodePoint('0x00e9'), 0xe9);
	assert.equal(definitions.normalizeCodePoint('0x10FFFF'), 0x10ffff);
	for (const input of [null, undefined, true, false, {}, '', ' ', ' 65', '41oops', '0x', 'U+', '0x-1', -1, 0.5, NaN, Infinity, 0x110000, '0x110000']) {
		assert.equal(definitions.normalizeCodePoint(input), undefined);
		assert.equal(definitions.decToHex(input), undefined);
		assert.equal(definitions.getUnicodeName(input), undefined);
		assert.equal(definitions.getParentRange(input), false);
		assert.equal(definitions.isControlChar(input), false);
	}
});

test('all 1,114,112 code points match the raw name and block definitions', () => {
	let rangeIndex = 0;
	let blockIndex = 0;
	let named = 0;
	let controls = 0;
	for (let point = 0; point <= 0x10ffff; point++) {
		let expectedName;
		if (point < 0x10000) expectedName = definitions.unicodeNamesBMP[definitions.decToHex(point)];
		else if (point < 0x20000) expectedName = definitions.unicodeNamesSMP[definitions.decToHex(point)];
		else {
			while (rangeIndex < definitions.unicodeNameRanges.length && definitions.unicodeNameRanges[rangeIndex].end < point) rangeIndex++;
			const range = definitions.unicodeNameRanges[rangeIndex];
			if (range && range.begin <= point) expectedName = range.name.replace('*', point.toString(16).toUpperCase());
		}
		assert.equal(definitions.getUnicodeName(point), expectedName, `Name at ${point}`);
		if (expectedName !== undefined) named++;
		const control = point <= 0x1f || (point >= 0x7f && point <= 0x9f);
		assert.equal(definitions.isControlChar(point), control, `Control at ${point}`);
		if (control) {
			assert.equal(expectedName, undefined);
			controls++;
		}
		while (blockIndex < definitions.unicodeBlocks.length && definitions.unicodeBlocks[blockIndex].end < point) blockIndex++;
		const block = definitions.unicodeBlocks[blockIndex];
		assert.equal(definitions.getParentRange(point), block && block.begin <= point ? block : false, `Block at ${point}`);
	}
	assert.equal(named, definitions.unicodeNamedCharacterCount);
	assert.equal(controls, 65);
});

test('name iteration is ordered, complete, and contains only standard names', () => {
	let previous = -1;
	let count = 0;
	for (const [id, name] of definitions.iterateUnicodeNames()) {
		const point = Number(id);
		assert(point > previous, id);
		assert.equal(id, definitions.decToHex(point));
		assert.equal(definitions.getUnicodeName(id), name);
		assert.notEqual(name, '<control>');
		assert(definitions.getParentRange(point), id);
		previous = point;
		count++;
	}
	assert.equal(count, definitions.unicodeNamedCharacterCount);
});

test('official blocks and unallocated block gaps partition all planes without overlap', () => {
	const ranges = [...definitions.unicodeBlocks, ...definitions.unicodeUnallocatedBlocks].sort((a, b) => a.begin - b.begin);
	let next = 0;
	for (const range of ranges) {
		assert.equal(range.begin, next);
		assert(range.end >= range.begin);
		assert.equal(range.begin >>> 16, range.end >>> 16);
		next = range.end + 1;
	}
	assert.equal(next, 0x110000);
	for (const block of definitions.unicodeBlocks) {
		assert.deepEqual(Object.keys(block), ['begin', 'end', 'name']);
		assert.equal(definitions.getUnicodeBlockByName(block.name), block);
		assert(definitions.isStandardUnicodeRange(block));
		assert(definitions.isCharInRange(block.begin, block));
		assert(definitions.isCharInRange(block.end, block));
	}
	for (const gap of definitions.unicodeUnallocatedBlocks) {
		assert.equal(definitions.getParentRange(gap.begin), false);
		assert.equal(definitions.getParentRange(gap.end), false);
		assert.equal(definitions.isStandardUnicodeRange(gap), false);
	}
	assert.equal(definitions.getParentRange('0x0378').name, 'Greek and Coptic');
	assert.equal(definitions.getUnicodeName('0x0378'), undefined);
	assert.equal(definitions.isStandardUnicodeRange({ begin: 0x20, end: 0x7f }), false);
});

test('known Unicode 18 names, boundaries, and unnamed code points', () => {
	for (const [id, name] of [
		['0x18800', 'TANGUT COMPONENT-001'],
		['0x2F800', 'CJK COMPATIBILITY IDEOGRAPH-2F800'],
		['0x323AF', 'CJK UNIFIED IDEOGRAPH-323AF'],
		['0x323B0', 'CJK UNIFIED IDEOGRAPH-323B0'],
		['0x33479', 'CJK UNIFIED IDEOGRAPH-33479'],
		['0x3D000', 'SMALL SEAL CHARACTER-3D000'],
		['0x3FC3F', 'SMALL SEAL CHARACTER-3FC3F'],
		['0xE0001', 'LANGUAGE TAG'],
		['0xE01EF', 'VARIATION SELECTOR-256'],
	]) assert.equal(definitions.getUnicodeName(id), name);
	for (const point of [0, 0x7f, 0xd800, 0xe000, 0xffff, 0x2a6e0, 0x3347a, 0x3fc40, 0x40000, 0xf0000, 0x10ffff]) {
		assert.equal(definitions.getUnicodeName(point), undefined, point);
	}
});

test('the entire folder works after copying to an unrelated project directory', () => {
	const source = fileURLToPath(new URL('../', import.meta.url));
	const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'unicode-definitions-'));
	try {
		const destination = path.join(temporary, 'another-app', 'lib', 'unicode', 'unicode_definitions');
		fs.cpSync(source, destination, { recursive: true });
		const entry = pathToFileURL(path.join(destination, 'index.js')).href;
		const script = `
			import assert from 'node:assert/strict';
			import { getUnicodeName, unicodeBlocks, unicodeVersion, iterateUnicodeNames } from ${JSON.stringify(entry)};
			assert.equal(getUnicodeName('0x0041'), 'LATIN CAPITAL LETTER A');
			assert.equal(getUnicodeName('0x323B0'), 'CJK UNIFIED IDEOGRAPH-323B0');
			assert.equal(getUnicodeName('0xE0100'), 'VARIATION SELECTOR-17');
			assert.equal(getUnicodeName('0x2A6E0'), undefined);
			assert.equal(unicodeBlocks.length, 353);
			assert.equal(unicodeVersion, '18.0.0');
			assert.equal([...iterateUnicodeNames()].length, 172808);
		`;
		execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: temporary, stdio: 'pipe' });
		for (const filename of ['LICENSE.txt', 'LICENSE-gpl-3.0.txt', 'README.md', 'generate.cjs']) {
			assert(fs.existsSync(path.join(destination, filename)), filename);
		}
	} finally {
		fs.rmSync(temporary, { recursive: true });
	}
});
