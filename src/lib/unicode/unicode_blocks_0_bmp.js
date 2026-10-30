import {
	unicodeBlocksBMP as standardUnicodeBlocksBMP,
	unicodeBlocksBMPUnallocated,
} from './unicode_definitions/unicode_blocks_0_bmp.js';

export const unicodeBlocksBMP = [
	{ begin: 0x0000, end: 0x001f, name: 'Basic Latin Controls' },
	{ begin: 0x0020, end: 0x007f, name: 'Basic Latin' },
	{ begin: 0x0080, end: 0x009f, name: 'Latin-1 Supplement Controls' },
	{ begin: 0x00a0, end: 0x00ff, name: 'Latin-1 Supplement' },
	...standardUnicodeBlocksBMP.slice(2).map((range) => ({ ...range })),
];

export { unicodeBlocksBMPUnallocated };
