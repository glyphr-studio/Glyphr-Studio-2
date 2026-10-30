import { describe, expect, it, vi } from 'vitest';
import {
	getUnicodeName as getStandardUnicodeName,
	isControlChar as isStandardControlChar,
} from '../unicode_definitions/index.js';
import {
	getUnicodeName,
	getUnicodeShortName,
	isWhitespace,
	shortUnicodeNames,
	whitespaceCharacters,
} from '../unicode_names.js';

describe('Unicode Names - getUnicodeName', () => {
	it('returns exact standard names for normalized IDs', () => {
		for (const input of ['0x41', '0x0041', 65]) {
			expect(getStandardUnicodeName(input)).toBe('LATIN CAPITAL LETTER A');
			expect(getUnicodeName(input)).toBe('LATIN CAPITAL LETTER A');
		}
		expect(getUnicodeName('0x61')).toBe('LATIN SMALL LETTER A');
		expect(getUnicodeName('0x21')).toBe('EXCLAMATION MARK');
		expect(getUnicodeName('0x20')).toBe('SPACE');
		expect(getUnicodeName('0x1F600')).toBe('GRINNING FACE');
		expect(getUnicodeName('0x3B1')).toBe('GREEK SMALL LETTER ALPHA');
		expect(getUnicodeName('0x20AC')).toBe('EURO SIGN');
		expect(getUnicodeName('0x221E')).toBe('INFINITY');
	});

	it('uses assigned Unicode 18 algorithmic names and exact boundaries', () => {
		const cases = [
			['0x18800', 'TANGUT COMPONENT-001'],
			['0x2F800', 'CJK COMPATIBILITY IDEOGRAPH-2F800'],
			['0x323AF', 'CJK UNIFIED IDEOGRAPH-323AF'],
			['0x323B0', 'CJK UNIFIED IDEOGRAPH-323B0'],
			['0x3D000', 'SMALL SEAL CHARACTER-3D000'],
			['0xE0001', 'LANGUAGE TAG'],
			['0xE0100', 'VARIATION SELECTOR-17'],
			['0xE01EF', 'VARIATION SELECTOR-256'],
		];
		for (const [input, name] of cases) {
			expect(getStandardUnicodeName(input)).toBe(name);
			expect(getUnicodeName(input)).toBe(name);
		}
	});

	it('does not fabricate names for unassigned or private-use code points', () => {
		for (const input of ['0x2A6E0', '0x3347A', '0x3FC40', '0xE000', '0xF0000', '0x100000']) {
			expect(getStandardUnicodeName(input)).toBeUndefined();
			expect(getUnicodeName(input)).toBe(`U+${Number(input).toString(16).toUpperCase()}`);
		}
	});

	it('keeps friendly control labels outside the standard name data', () => {
		const cases = [
			['0x0', '.null'],
			['0x7F', 'Delete'],
			['0x9F', 'Application Program Command'],
		];
		for (const [input, label] of cases) {
			expect(isStandardControlChar(input)).toBe(true);
			expect(getStandardUnicodeName(input)).toBeUndefined();
			expect(getUnicodeName(input)).toBe(label);
		}
	});

	it('preserves the U+ fallback for unnamed code points', () => {
		for (const input of ['0x2A6E0', '0x3347A', '0x3FC40', '0xE000', '0xF0000', '0x100000']) {
			expect(getUnicodeName(input).startsWith('U+')).toBe(true);
		}
	});

	it('warns and returns the legacy message for invalid code points', () => {
		const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
		for (const input of ['invalid', null, -1, 0.5, 0x110000]) {
			expect(getUnicodeName(input)).toBe('[name not found]');
		}
		expect(warning).toHaveBeenCalledTimes(5);
		warning.mockRestore();
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

	it('getUnicodeShortName - derives a bounded label from the exact standard name', () => {
		expect(getUnicodeShortName('0x18800')).toBe('TANGUTCOMPONENT-001');
		expect(getUnicodeShortName('0xE0100')).toBe('VARIATIONSELECTOR-17');
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
