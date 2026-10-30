const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const version = '18.0.0';
// Standard publication date, not the timestamps of individual UCD files.
// https://www.unicode.org/versions/Unicode18.0.0/
const releaseDate = '2026-09-16';
const baseUrl = `https://www.unicode.org/Public/${version}/ucd/`;
const limit = 0x110000;
const check = process.argv.includes('--check');

async function download(filename) {
	const response = await fetch(new URL(filename, baseUrl));
	if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
	return response.text();
}

function hex(point) {
	return point.toString(16).toUpperCase().padStart(4, '0');
}

function readDerivedNames(text) {
	assert(text.startsWith(`# DerivedName-${version}.txt`), 'Unexpected DerivedName version');
	const names = new Map();
	const supplementary = [];
	for (const line of text.split(/\r?\n/)) {
		const data = line.split('#')[0].trim();
		if (!data) continue;
		const match = /^([0-9A-F]{4,6})(?:\.\.([0-9A-F]{4,6}))?\s*;\s*(.+)$/.exec(data);
		assert(match, `Invalid DerivedName record: ${data}`);
		const first = parseInt(match[1], 16);
		const last = parseInt(match[2] || match[1], 16);
		assert(first <= last && last < limit, `Invalid range: ${data}`);
		if (last >= 0x20000) supplementary.push({ begin: Math.max(first, 0x20000), end: last, name: match[3] });
		for (let point = first; point <= last; point++) {
			assert(!names.has(point), `Duplicate name at U+${hex(point)}`);
			names.set(point, match[3].replace('*', hex(point)));
		}
	}
	return { names, supplementary };
}

function hangulName(point) {
	const leading = ['G', 'GG', 'N', 'D', 'DD', 'R', 'M', 'B', 'BB', 'S', 'SS', '', 'J', 'JJ', 'C', 'K', 'T', 'P', 'H'];
	const vowel = ['A', 'AE', 'YA', 'YAE', 'EO', 'E', 'YEO', 'YE', 'O', 'WA', 'WAE', 'OE', 'YO', 'U', 'WEO', 'WE', 'WI', 'YU', 'EU', 'YI', 'I'];
	const trailing = ['', 'G', 'GG', 'GS', 'N', 'NJ', 'NH', 'D', 'L', 'LG', 'LM', 'LB', 'LS', 'LT', 'LP', 'LH', 'M', 'B', 'BS', 'S', 'SS', 'NG', 'J', 'C', 'K', 'T', 'P', 'H'];
	const index = point - 0xac00;
	return `HANGUL SYLLABLE ${leading[Math.floor(index / 588)]}${vowel[Math.floor(index / 28) % 21]}${trailing[index % 28]}`;
}

// Independently expand UnicodeData ranges to cross-check the derived Name property.
function readUnicodeData(text) {
	const names = new Map();
	const controls = new Set();
	let range;
	for (const line of text.split(/\r?\n/)) {
		if (!line) continue;
		const fields = line.split(';');
		assert.equal(fields.length, 15, 'Invalid UnicodeData record');
		const point = parseInt(fields[0], 16);
		assert(point < limit, 'UnicodeData code point is out of range');
		const name = fields[1];
		if (name.endsWith(', First>')) {
			assert(!range, 'Nested UnicodeData range');
			range = { first: point, name: name.replace(', First>', ''), category: fields[2] };
		} else if (name.endsWith(', Last>')) {
			assert(range && range.name === name.replace(', Last>', ''), 'Unmatched UnicodeData range');
			if (range.category !== 'Cs' && range.category !== 'Co') {
				for (let member = range.first; member <= point; member++) {
					let expanded;
					if (range.name === '<Hangul Syllable') expanded = hangulName(member);
					else if (range.name.startsWith('<CJK Ideograph')) expanded = `CJK UNIFIED IDEOGRAPH-${hex(member)}`;
					else if (range.name.startsWith('<Tangut Ideograph')) expanded = `TANGUT IDEOGRAPH-${hex(member)}`;
					else if (range.name === '<Jurchen Character') expanded = `JURCHEN CHARACTER-${hex(member)}`;
					else if (range.name === '<Seal Character') expanded = `SMALL SEAL CHARACTER-${hex(member)}`;
					else throw new Error(`Unsupported UnicodeData range: ${range.name}`);
					assert(!names.has(member), `Duplicate UnicodeData entry at U+${hex(member)}`);
					names.set(member, expanded);
				}
			}
			range = undefined;
		} else {
			assert(!range, 'Unterminated UnicodeData range');
			assert(!names.has(point), `Duplicate UnicodeData entry at U+${hex(point)}`);
			if (name === '<control>') {
				assert.equal(fields[2], 'Cc');
				controls.add(point);
			} else {
				assert(!name.startsWith('<'), `Unexpected pseudo-name: ${name}`);
				names.set(point, name);
			}
		}
	}
	assert(!range, 'Unterminated UnicodeData range');
	return { names, controls };
}

function readBlocks(text) {
	assert(text.startsWith(`# Blocks-${version}.txt`), 'Unexpected Blocks version');
	const blocks = [];
	for (const line of text.split(/\r?\n/)) {
		const data = line.split('#')[0].trim();
		if (!data) continue;
		const match = /^([0-9A-F]{4,6})\.\.([0-9A-F]{4,6});\s*(.+)$/.exec(data);
		assert(match, `Invalid Blocks record: ${data}`);
		const begin = parseInt(match[1], 16);
		const end = parseInt(match[2], 16);
		assert(begin <= end && end < limit && begin % 16 === 0 && end % 16 === 15, `Invalid block bounds: ${data}`);
		assert(!blocks.length || begin > blocks.at(-1).end, `Overlapping or unsorted blocks: ${data}`);
		blocks.push({ begin, end, name: match[3] });
	}
	return blocks;
}

function unallocatedRanges(blocks, plane) {
	const first = plane * 0x10000;
	const last = first + 0xffff;
	const gaps = [];
	let begin = first;
	for (const block of blocks.filter(block => (block.begin >>> 16) === plane)) {
		if (begin < block.begin) gaps.push({ begin, end: block.begin - 1, name: `Plane ${plane}: Unallocated ${hex(begin)}-${hex(block.begin - 1)}` });
		begin = block.end + 1;
	}
	if (begin <= last) gaps.push({ begin, end: last, name: `Plane ${plane}: Unallocated ${hex(begin)}-${hex(last)}` });
	return gaps;
}

async function main() {
	assert(process.argv.slice(2).every(arg => arg === '--check'), 'Usage: node generate.cjs [--check]');
	const [readme, derived, unicodeData, blockData] = await Promise.all(['ReadMe.txt', 'extracted/DerivedName.txt', 'UnicodeData.txt', 'Blocks.txt'].map(download));
	assert(readme.includes(`final data files for version ${version}`), 'Expected final Unicode data');
	const { names, supplementary } = readDerivedNames(derived);
	const independent = readUnicodeData(unicodeData);
	for (let point = 0; point < limit; point++) {
		assert.equal(names.get(point), independent.names.get(point), `Official sources disagree at U+${hex(point)}`);
	}
	const sourceHash = text => crypto.createHash('sha256').update(text).digest('hex');
	const quote = text => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
	const sources = {
		derivedName: { url: `${baseUrl}extracted/DerivedName.txt`, sha256: sourceHash(derived) },
		unicodeData: { url: `${baseUrl}UnicodeData.txt`, sha256: sourceHash(unicodeData) },
		blocks: { url: `${baseUrl}Blocks.txt`, sha256: sourceHash(blockData) },
	};
	const header = sourceNames => [
		`// Unicode v${version}`,
		...sourceNames.flatMap(name => [`// Source: ${sources[name].url}`, `// SHA-256: ${sources[name].sha256}`]),
		'// Generated by generate.cjs; do not edit manually.',
		'// Unicode data license: LICENSE.txt',
	].join('\n');
	const writeModule = (filename, output) => {
		const target = path.join(__dirname, filename);
		if (!check) fs.writeFileSync(target, output);
		assert(fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === output, `${filename} differs from generated Unicode ${version} data`);
	};
	const rangeExport = (variable, ranges) => {
		const rows = ranges.map(range => `\t{ begin: 0x${hex(range.begin)}, end: 0x${hex(range.end)}, name: ${quote(range.name)} },`);
		return `export const ${variable} = [\n${rows.join('\n')}\n];\n`;
	};
	for (const [plane, first, last] of [['BMP', 0, 0xffff], ['SMP', 0x10000, 0x1ffff]]) {
		const entries = [...names].filter(([point]) => point >= first && point <= last).sort(([a], [b]) => a - b);
		const rows = entries.map(([point, name]) => `\t'0x${point.toString(16).toUpperCase()}': ${quote(name)},`);
		const filename = plane === 'BMP' ? 'unicode_names_0_bmp.js' : 'unicode_names_1_smp.js';
		writeModule(filename, `${header(['derivedName', 'unicodeData'])}\nexport const unicodeNames${plane} = {\n${rows.join('\n')}\n};\n`);
	}
	supplementary.sort((a, b) => a.begin - b.begin);
	writeModule('unicode_name_ranges.js', `${header(['derivedName', 'unicodeData'])}\n${rangeExport('unicodeNameRanges', supplementary)}`);

	const blocks = readBlocks(blockData);
	const allGaps = Array.from({ length: 17 }, (_, plane) => unallocatedRanges(blocks, plane)).flat();
	for (const [suffix, variable, matches] of [
		['0_bmp', 'BMP', plane => plane === 0],
		['1_smp', 'SMP', plane => plane === 1],
		['2_sip', 'SIP', plane => plane === 2],
		['3_tip', 'TIP', plane => plane === 3],
		['other', 'Other', plane => plane >= 4],
	]) {
		const allocated = blocks.filter(block => matches(block.begin >>> 16));
		const gaps = allGaps.filter(block => matches(block.begin >>> 16));
		writeModule(`unicode_blocks_${suffix}.js`, `${header(['blocks'])}\n${rangeExport(`unicodeBlocks${variable}`, allocated)}\n${rangeExport(`unicodeBlocks${variable}Unallocated`, gaps)}`);
	}
	writeModule('unicode_metadata.js', `${header(['derivedName', 'unicodeData', 'blocks'])}
export const unicodeVersion = '${version}';
export const unicodeReleaseDate = '${releaseDate}';
export const unicodeDefinitionSchemaVersion = 1;
export const unicodeNamedCharacterCount = ${names.size};
export const unicodeBlockCount = ${blocks.length};
export const unicodeSources = ${JSON.stringify(sources, null, '\t')};
`);
	const definitions = await import(pathToFileURL(path.join(__dirname, 'index.js')).href);
	let blockIndex = 0;
	for (let point = 0; point < limit; point++) {
		assert.equal(definitions.getUnicodeName(point), independent.names.get(point), `Runtime name mismatch at U+${hex(point)}`);
		assert.equal(definitions.isControlChar(point), independent.controls.has(point), `Control mismatch at U+${hex(point)}`);
		while (blockIndex < blocks.length && blocks[blockIndex].end < point) blockIndex++;
		const block = blocks[blockIndex];
		const expected = block && block.begin <= point ? block : false;
		assert.deepEqual(definitions.getParentRange(point), expected, `Block mismatch at U+${hex(point)}`);
	}
	assert.deepEqual(definitions.unicodeBlocks, blocks);
	assert.deepEqual(definitions.unicodeUnallocatedBlocks, allGaps);
	let iterated = 0;
	for (const [id, name] of definitions.iterateUnicodeNames()) {
		assert.equal(name, independent.names.get(Number(id)), `Iteration mismatch: ${id}`);
		iterated++;
	}
	assert.equal(iterated, names.size);
	console.log(`Unicode ${version}: all ${limit.toLocaleString('en-US')} code points verified against official sources.`);
	console.log(`${names.size} standard names; ${blocks.length} official blocks; ${independent.controls.size} controls (no Name property).`);
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
