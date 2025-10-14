import { describe, expect, it } from 'vitest';
import {
	getUnicodeName,
	getUnicodeShortName,
	isWhitespace,
	shortUnicodeNames,
	whitespaceCharacters,
} from '../unicode_names.js';

describe('Unicode Names - getUnicodeName', () => {
	it('getUnicodeName - basic ASCII character', () => {
		expect(getUnicodeName('0x41')).toBe('Latin Capital Letter A');
	});

	it('getUnicodeName - lowercase letter', () => {
		expect(getUnicodeName('0x61')).toBe('Latin Small Letter A');
	});

	it('getUnicodeName - number as hex string', () => {
		expect(getUnicodeName('0x41')).toBe('Latin Capital Letter A');
	});

	it('getUnicodeName - special character', () => {
		expect(getUnicodeName('0x21')).toBe('Exclamation mark');
	});

	it('getUnicodeName - space character', () => {
		expect(getUnicodeName('0x20')).toBe('Space');
	});

	it('getUnicodeName - emoji (surrogate pair)', () => {
		expect(getUnicodeName('0x1F600')).toBe('Grinning Face');
	});

	it('getUnicodeName - CJK character in BMP', () => {
		expect(getUnicodeName('0x4E00')).toBe('CJK Unified Ideograph 4E00');
	});

	it('getUnicodeName - CJK character in SMP', () => {
		expect(getUnicodeName('0x20000')).toBe('CJK Unified Ideograph 20000');
	});

	it('getUnicodeName - Khitan Small Script', () => {
		expect(getUnicodeName('0x18B00')).toBe('Khitan Small Script Character 18B00');
	});

	it('getUnicodeName - Tangut Component', () => {
		expect(getUnicodeName('0x18800')).toBe('Tangut Component 1');
	});

	it('getUnicodeName - Nushu Character', () => {
		expect(getUnicodeName('0x1B170')).toBe('Nushu Character 1B170');
	});

	it('getUnicodeName - character with no defined name falls back to code point', () => {
		expect(getUnicodeName('0x1FC00')).toContain('U+1FC00');
	});

	it('getUnicodeName - invalid input returns name not found', () => {
		expect(getUnicodeName('invalid')).toBe('[name not found]');
	});

	it('getUnicodeName - null input', () => {
		expect(getUnicodeName(null)).toBe('[name not found]');
	});

	it('getUnicodeName - Greek letter', () => {
		expect(getUnicodeName('0x3B1')).toBe('GREEK SMALL LETTER ALPHA');
	});

	it('getUnicodeName - currency symbol', () => {
		expect(getUnicodeName('0x20AC')).toBe('EURO SIGN');
	});

	it('getUnicodeName - mathematical symbol', () => {
		expect(getUnicodeName('0x221E')).toBe('INFINITY');
	});
});

describe('Unicode Names - getUnicodeShortName', () => {
	it('getUnicodeShortName - has predefined short name', () => {
		expect(getUnicodeShortName('0x41')).toBe('A');
	});

	it('getUnicodeShortName - lowercase letter', () => {
		expect(getUnicodeShortName('0x61')).toBe('a');
	});

	it('getUnicodeShortName - space character', () => {
		expect(getUnicodeShortName('0x20')).toBe('space');
	});

	it('getUnicodeShortName - exclamation mark', () => {
		expect(getUnicodeShortName('0x21')).toBe('exclam');
	});

	it('getUnicodeShortName - period', () => {
		expect(getUnicodeShortName('0x2E')).toBe('period');
	});

	it('getUnicodeShortName - comma', () => {
		expect(getUnicodeShortName('0x2C')).toBe('comma');
	});

	it('getUnicodeShortName - null character', () => {
		expect(getUnicodeShortName('0x0')).toBe('.null');
	});

	it('getUnicodeShortName - character without short name gets truncated long name', () => {
		const result = getUnicodeShortName('0x3B1');
		expect(result.length).toBeLessThanOrEqual(20);
		expect(result).not.toContain(' ');
		expect(result).not.toContain('latin');
	});

	it('getUnicodeShortName - removes "latin" from name', () => {
		const result = getUnicodeShortName('0xE0');
		expect(result).not.toContain('latin');
	});

	it('getUnicodeShortName - removes spaces from name', () => {
		const result = getUnicodeShortName('0xE0');
		expect(result).not.toContain(' ');
	});

	it('getUnicodeShortName - truncates to 20 characters', () => {
		const result = getUnicodeShortName('0x1F600');
		expect(result.length).toBeLessThanOrEqual(20);
	});

	it('getUnicodeShortName - number input', () => {
		expect(getUnicodeShortName(65)).toBe('A');
	});
});

describe('Unicode Names - isWhitespace', () => {
	it('isWhitespace - space character', () => {
		expect(isWhitespace('0x20')).toBe(true);
	});

	it('isWhitespace - tab character', () => {
		expect(isWhitespace('0x9')).toBe(true);
	});

	it('isWhitespace - line feed', () => {
		expect(isWhitespace('0xA')).toBe(true);
	});

	it('isWhitespace - carriage return', () => {
		expect(isWhitespace('0xD')).toBe(true);
	});

	it('isWhitespace - non-breaking space', () => {
		expect(isWhitespace('0xA0')).toBe(true);
	});

	it('isWhitespace - en space', () => {
		expect(isWhitespace('0x2002')).toBe(true);
	});

	it('isWhitespace - em space', () => {
		expect(isWhitespace('0x2003')).toBe(true);
	});

	it('isWhitespace - zero-width space', () => {
		expect(isWhitespace('0x200B')).toBe(true);
	});

	it('isWhitespace - zero-width non-joiner', () => {
		expect(isWhitespace('0x200C')).toBe(true);
	});

	it('isWhitespace - zero-width joiner', () => {
		expect(isWhitespace('0x200D')).toBe(true);
	});

	it('isWhitespace - byte order mark', () => {
		expect(isWhitespace('0xFEFF')).toBe(true);
	});

	it('isWhitespace - regular letter is not whitespace', () => {
		expect(isWhitespace('0x41')).toBe(false);
	});

	it('isWhitespace - number is not whitespace', () => {
		expect(isWhitespace('0x30')).toBe(false);
	});

	it('isWhitespace - emoji is not whitespace', () => {
		expect(isWhitespace('0x1F600')).toBe(false);
	});

	it('isWhitespace - punctuation is not whitespace', () => {
		expect(isWhitespace('0x21')).toBe(false);
	});
});

describe('Unicode Names - whitespaceCharacters constant', () => {
	it('whitespaceCharacters - is an array', () => {
		expect(Array.isArray(whitespaceCharacters)).toBe(true);
	});

	it('whitespaceCharacters - contains common whitespace', () => {
		expect(whitespaceCharacters).toContain('0x20');
		expect(whitespaceCharacters).toContain('0x9');
		expect(whitespaceCharacters).toContain('0xA');
	});

	it('whitespaceCharacters - contains non-breaking space', () => {
		expect(whitespaceCharacters).toContain('0xA0');
	});

	it('whitespaceCharacters - contains zero-width characters', () => {
		expect(whitespaceCharacters).toContain('0x200B');
		expect(whitespaceCharacters).toContain('0x200C');
		expect(whitespaceCharacters).toContain('0x200D');
	});

	it('whitespaceCharacters - has expected length', () => {
		expect(whitespaceCharacters.length).toBeGreaterThan(20);
	});

	it('whitespaceCharacters - all entries are hex strings', () => {
		whitespaceCharacters.forEach((char) => {
			expect(char).toMatch(/^0x[0-9A-F]+$/i);
		});
	});
});

describe('Unicode Names - shortUnicodeNames constant', () => {
	it('shortUnicodeNames - is an object', () => {
		expect(typeof shortUnicodeNames).toBe('object');
	});

	it('shortUnicodeNames - contains basic ASCII letters', () => {
		expect(shortUnicodeNames['0x41']).toBe('A');
		expect(shortUnicodeNames['0x61']).toBe('a');
	});

	it('shortUnicodeNames - contains digits', () => {
		expect(shortUnicodeNames['0x30']).toBe('zero');
		expect(shortUnicodeNames['0x39']).toBe('nine');
	});

	it('shortUnicodeNames - contains punctuation', () => {
		expect(shortUnicodeNames['0x2E']).toBe('period');
		expect(shortUnicodeNames['0x2C']).toBe('comma');
		expect(shortUnicodeNames['0x21']).toBe('exclam');
	});

	it('shortUnicodeNames - contains special characters', () => {
		expect(shortUnicodeNames['0x20']).toBe('space');
		expect(shortUnicodeNames['0x0']).toBe('.null');
	});

	it('shortUnicodeNames - contains brackets', () => {
		expect(shortUnicodeNames['0x5B']).toBe('bracketleft');
		expect(shortUnicodeNames['0x5D']).toBe('bracketright');
	});

	it('shortUnicodeNames - contains mathematical symbols', () => {
		expect(shortUnicodeNames['0x2B']).toBe('plus');
		expect(shortUnicodeNames['0x3D']).toBe('equal');
	});

	it('shortUnicodeNames - has entries for all basic ASCII printable chars', () => {
		// Check that we have entries for common printable ASCII range
		expect(shortUnicodeNames['0x20']).toBeDefined(); // space
		expect(shortUnicodeNames['0x7E']).toBeDefined(); // tilde
	});
});
