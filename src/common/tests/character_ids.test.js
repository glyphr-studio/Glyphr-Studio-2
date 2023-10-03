import { describe, expect, it } from 'vitest';
import {
	areHexValuesEqual,
	charToHex,
	charsToHexArray,
	decToHex,
	hasPrefix,
	hexesToChars,
	hexesToHexArray,
	hexesToXMLHexes,
	isChar,
	isHex,
	isNumberWithPrefix,
	isUnicode,
	isXMLDec,
	isXMLHex,
	normalizePrefixes,
	parseCharsInputAsHex,
	unicodeToHex,
	unicodesToUnicodeArray,
	validateAsHex,
	validateAsUnicode,
	validateAsXMLDec,
	validateAsXMLHex,
	validateDecOrHexSuffix,
	xmlDecToDec,
	xmlHexToHex,
} from '../character_ids.js';

describe('Character IDs - Prefix and Suffix Checking', () => {
	it('normalizePrefixes - hex', () => {
		expect(normalizePrefixes('0X123F0X123f')).toBe('0x123F0x123f');
	});
	it('normalizePrefixes - xml hex', () => {
		expect(normalizePrefixes('&#X123F&#X123F')).toBe('&#x123F&#x123F');
	});
	it('normalizePrefixes - unicode', () => {
		expect(normalizePrefixes('u+123Fu+123f')).toBe('U+123FU+123f');
	});

	it('validateDecOrHexSuffix', () => {
		expect(validateDecOrHexSuffix('0123456789ABCDEFabcdef')).toBeTruthy();
	});

	it('validateDecOrHexSuffix - not hex', () => {
		expect(validateDecOrHexSuffix('asdf')).toBeFalsy();
	});

	it('hasPrefix', () => {
		expect(hasPrefix('0x123', '0x')).toBeTruthy();
	});

	it('hasPrefix - no prefix', () => {
		expect(hasPrefix('0x123', 'U+')).toBeFalsy();
	});

	it('isNumberWithPrefix', () => {
		expect(isNumberWithPrefix('0x123F', '0x')).toBeTruthy();
	});

	it('isNumberWithPrefix - bad prefix', () => {
		expect(isNumberWithPrefix('123', 'foo')).toBeFalsy();
	});

	it('isNumberWithPrefix - too many prefixes', () => {
		expect(isNumberWithPrefix('0x1230x123', '0x')).toBeFalsy();
	});

	it('isNumberWithPrefix - not a number suffix', () => {
		expect(isNumberWithPrefix('0xEFG', '0x')).toBeFalsy();
	});
});

describe('Character IDs - Format Detection', () => {
	it('isChar - single', () => {
		expect(isChar('a')).toBeTruthy();
	});
	it('isChar - bad length', () => {
		expect(isChar('aa')).toBeFalsy();
	});

	it('isUnicode', () => {
		expect(isUnicode('U+123F')).toBeTruthy();
	});

	it('isUnicode - bad prefix', () => {
		expect(isUnicode('0x123F')).toBeFalsy();
	});

	it('isHex', () => {
		expect(isHex('0x123F')).toBeTruthy();
	});

	it('isHex - strange casing', () => {
		expect(isHex('0X123f')).toBeTruthy();
	});

	it('isHex - bad prefix', () => {
		expect(isHex('Ox123F')).toBeFalsy();
	});

	it('isHex - bad string format', () => {
		expect(isHex(0x123f)).toBeFalsy();
	});

	it('isXMLDec', () => {
		expect(isXMLDec('&#123')).toBeTruthy();
	});

	it('isXMLHex', () => {
		expect(isXMLHex('&#x123F')).toBeTruthy();
	});
});

describe('Character IDs - Validate and return single IDs', () => {
	it('validateAsHex', () => {
		expect(validateAsHex('0X123f')).toBe('0x123F');
	});

	it('validateAsUnicode', () => {
		expect(validateAsUnicode('u+123f')).toBe('U+123F');
	});

	it('validateAsXMLHex', () => {
		expect(validateAsXMLHex('&#X123f')).toBe('&#x123F');
	});

	it('validateAsXMLDec', () => {
		expect(validateAsXMLDec('&#0123')).toBe('&#123');
	});
});

describe('Character IDs - Single to Single Conversion', () => {
	it('decToHex', () => {
		expect(decToHex(385)).toBe('0x181');
	});

	it('charToHex', () => {
		expect(charToHex('a')).toBe('0x61');
	});

	it('unicodeToHex', () => {
		expect(unicodeToHex('U+3F')).toBe('0x3F');
	});

	it('xmlHexToHex', () => {
		expect(xmlHexToHex('&#x3D')).toBe('0x3D');
	});

	it('xmlDecToDec', () => {
		expect(xmlDecToDec('&#23')).toBe(23);
	});
});

describe('Character IDs - Splitting a string of many IDs', () => {
	it('hexesToHexArray', () => {
		expect(hexesToHexArray('0x123F0x456C')).toEqual(['0x123F', '0x456C']);
	});

	it('unicodesToUnicodeArray', () => {
		expect(unicodesToUnicodeArray('U+123FU+456C')).toEqual(['U+123F', 'U+456C']);
	});
});

describe('Character IDs - Many to many conversions', () => {
	it('charsToHexArray', () => {
		expect(charsToHexArray('abc')).toEqual(['0x61', '0x62', '0x63']);
	});

	it('hexesToChars', () => {
		expect(hexesToChars('0x610x620x63')).toEqual('abc');
	});

	it('hexesToXMLHexes', () => {
		expect(hexesToXMLHexes('0x610x620x63')).toEqual('&#x61;&#x62;&#x63;');
	});
});

describe('Character IDs - Accepting unknown inputs', () => {
	it('parseCharsInputAsHex - hex input', () => {
		expect(parseCharsInputAsHex('0x610x620x63')).toEqual(['0x61', '0x62', '0x63']);
	});

	it('parseCharsInputAsHex - unicode input', () => {
		expect(parseCharsInputAsHex('U+61U+62U+63')).toEqual(['0x61', '0x62', '0x63']);
	});

	it('parseCharsInputAsHex - char input', () => {
		expect(parseCharsInputAsHex('abc')).toEqual(['0x61', '0x62', '0x63']);
	});

	it('areHexValuesEqual', () => {
		expect(areHexValuesEqual('0x123', '0x123')).toBeTruthy();
	});

	it('areHexValuesEqual - capitalization', () => {
		expect(areHexValuesEqual('0x123', '0X123')).toBeTruthy();
	});

	it('areHexValuesEqual - extra zeros', () => {
		expect(areHexValuesEqual('0x123', '0x000123')).toBeTruthy();
	});
});
