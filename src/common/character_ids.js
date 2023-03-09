// import { log } from '../app/main.js';
import { isInteger } from './functions.js';

/**
 * Reading and writing character IDs come in many flavors. This file
 * deals with identifying and converting between these formats:
 * @param {string} char - single character
 * @param {string} unicode - hexadecimal id number, starting with 'U+' or 'u+'
 * @param {number} dec - decimal representation of a character
 * @param {string} hex - a string of a hexadecimal number, starting with '0X' or '0x'
 * @param {string} xmlDec - a decimal XML Char Reference, string starting with '&#'
 * @param {string} xmlHex - a decimal XML Char Reference, string starting with '&#x' or '&#X'
 */

// --------------------------------------------------------------
// Format detection for single inputs
// --------------------------------------------------------------

/**
 * @param {string} - single character
 * @returns {boolean}
 */
export function isChar(input) {
	if (typeof input !== 'string') return false;
	if (input.length > 1) return false;
	return true;
}

/**
 * @param {string} input - Unicode id starting with 'U+'
 * @returns {boolean}
 */
export function isUnicode(input) {
	if (typeof input !== 'string') return false;
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, 'U+');
}

/**
 * @param {string} input - Hex string starting with '0x'
 * @returns {boolean}
 */
export function isHex(input) {
	if (typeof input !== 'string') return false;
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, '0x');
}

/**
 * @param {string} input - Decimal XML Char Reference starting with '&#'
 * @returns {boolean}
 */
export function isXMLDec(input) {
	if (typeof input !== 'string') return false;
	return isNumberWithPrefix(input, '&#');
}

/**
 * @param {string} input - Hexadecimal XML Char Reference starting with '&#'
 * @returns {boolean}
 */
export function isXMLHex(input) {
	if (typeof input !== 'string') return false;
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, '&#x');
}

// --------------------------------------------------------------
// Prefix and Suffix checking
// --------------------------------------------------------------

/**
 * For Hex, XML Hex, and Unicode IDs, we want to be lenient
 * with regards to capitalization (of the x for hex and the U for
 * Unicode). All our functions assume the 'normal' way of writing these,
 * so this function ensures passed in content is capitalized as expected.
 * @param {string} input - thing to normalize
 * @returns {string}
 */
export function normalizePrefixes(input) {
	input = input.replaceAll('0X', '0x');
	input = input.replaceAll('&#X', '&#x');
	input = input.replaceAll('u+', 'U+');
	return input;
}

/**
 * Hex, Unicode IDs, and XML Char Entities all use different prefixes,
 * but the same Hexadecimal suffix. This validates and formats the suffix.
 * @param {string} input - string to check
 * @returns {string} - validated and formatted suffix
 */
export function validateDecOrHexSuffix(input) {
	const green = '0123456789ABCDEF';
	input = input.toString();
	input = input.toUpperCase();

	for (var c = 0; c < input.length; c++) {
		if (green.indexOf(input.charAt(c)) === -1) return false;
	}

	const result = parseInt(`0x${input}`);
	if (isNaN(result)) return false;
	return result.toString(16).toUpperCase();
}

/**
 * @param {string} input - thing to check
 * @param {string} prefix - prefix to check for
 * @returns {boolean}
 */
export function hasPrefix(input, prefix) {
	input = normalizePrefixes(input);
	return input.indexOf(prefix) > -1;
}

/**
 * Checks for two things:
 * 1) that a string has a specified prefix
 * 2) that the subsequent suffix is a valid number
 * @param {string} input - thing to check
 * @param {string} prefix - prefix to check for
 * @returns {boolean}
 */
export function isNumberWithPrefix(input, prefix) {
	// Check for prefix
	if (!hasPrefix(input, prefix)) return false;
	// Check for many instance instead of single instance
	if (input.indexOf(prefix, prefix.length) > 0) return false;
	// Check for valid number suffix
	let value = input.substring(prefix.length);
	if (!validateDecOrHexSuffix(value)) return false;

	return true;
}

// --------------------------------------------------------------
// Validate and return single ID Formats
// --------------------------------------------------------------

/**
 * @param {string} input - expected hexadecimal string
 * @returns - validated hexadecimal string
 */
export function validateAsHex(input) {
	if (!isHex(input)) return false;
	if (!isNumberWithPrefix(input, '0x')) return false;
	let suffix = validateDecOrHexSuffix(input.substring(2));
	return `0x${suffix}`;
}

/**
 * @param {string} input - expected Unicode ID string
 * @returns - validated Unicode ID string
 */
export function validateAsUnicode(input) {
	if (!isUnicode(input)) return false;
	if (!isNumberWithPrefix(input, 'U+')) return false;
	return `U+${input.substring(2).toUpperCase()}`;
}

/**
 * @param {string} input - expected hexadecimal XML Char Reference
 * @returns - validated hexadecimal XML Char Reference
 */
export function validateAsXMLHex(input) {
	if (!isXMLHex(input)) return false;
	if (!isNumberWithPrefix(input, '&#x')) return false;
	return `&#x${input.substring(3).toUpperCase()}`;
}

/**
 * @param {string} input - expected decimal XML Char Reference
 * @returns - validated decimal XML Char Reference
 */
export function validateAsXMLDec(input) {
	if (!isXMLDec(input)) return false;
	let result = String(xmlDecToDec(input));
	return `&#${result}`;
}

// --------------------------------------------------------------
// Single to Single Conversion Functions
// --------------------------------------------------------------

/**
 * Convert decimal to hexadecimal
 * @param {number} input - decimal
 * @returns {string} - hexadecimal
 */
export function decToHex(input) {
	if (!isInteger(input)) return false;
	input = parseInt(input);
	if (isNaN(input)) return false;
	let suffix = validateDecOrHexSuffix(Number(input).toString(16));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Convert a string with a single character to hexadecimal
 * @param {string} input - char
 * @returns {string} - hexadecimal
 */
export function charToHex(input) {
	if (!isChar(input)) return false;
	return `0x${Number(input.charCodeAt(0)).toString(16).toUpperCase()}`;
}

/**
 * Converts a single Unicode ID to hexadecimal
 * @param {string} input - Unicode string starting with 'U+'
 * @returns {string} - hexadecimal string
 */
export function unicodeToHex(input) {
	if (!isUnicode(input)) return false;
	let suffix = validateDecOrHexSuffix(input.substring(2));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Converts a single Hex-based XML Char Reference to hexadecimal
 * @param {string} input - XML char code starting with '&#x'
 * @returns {string} - hexadecimal string
 */
export function xmlHexToHex(input) {
	if (!isXMLHex(input)) return false;
	let suffix = validateDecOrHexSuffix(input.substring(3));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Converts a single Decimal-based XML Char Reference to a number
 * @param {string} input - XML char code starting with '&#'
 * @returns {number} - decimal number
 */
export function xmlDecToDec(input) {
	if (!isXMLDec(input)) return false;
	return parseInt(input.substring(2));
}

// --------------------------------------------------------------
// Splitting a string of many IDs
// --------------------------------------------------------------

/**
 * Splits a string containing hexadecimal numbers into an array
 * @param {string} input - string of hexadecimal numbers
 * @returns {array}
 */
export function hexesToHexArray(input) {
	input = input.replaceAll('X', 'x');
	let result = input.split('0x');
	result = result.map((value) => {
		return validateAsHex(`0x${value}`);
	});

	return result.splice(1);
}

/**
 * Splits a string containing Unicode IDs into an array
 * @param {string} input - string of Unicode IDs
 * @returns {array}
 */
export function unicodesToUnicodeArray(input) {
	input = input.replaceAll('u', 'U');
	let result = input.split('U+');
	result = result.map((value) => {
		return validateAsUnicode(`U+${value}`);
	});

	return result.splice(1);
}

// --------------------------------------------------------------
// Many to Many Conversion Functions
// --------------------------------------------------------------

/**
 * Convert string to an array of hexadecimal
 * @param {number} input - string
 * @returns {array} - hexadecimal
 */
export function charsToHexArray(input) {
	const result = [];
	for (let i = 0; i < input.length; i++) {
		result.push(charToHex(input.charAt(i)));
	}
	return result;
}

/**
 * Convert hexadecimal to string
 * @param {string} input - hexadecimal
 * @returns {string} - string
 */
export function hexesToChars(input) {
	// log('hexesToChars', 'start');
	input = input.replaceAll('X', 'x');
	if (String(input).charAt(1) !== 'x') return false;

	input = input.split('0x');
	let result = '';

	for (let i = 0; i < input.length; i++) {
		if (input[i] !== '') {
			input[i] = String.fromCharCode(`0x${input[i]}`);
			if (input[i]) result += input[i];
		}
	}

	// log(`hexesToChars`, 'end');
	return result;
}

/**
 * Convert hexadecimal string to XML format
 * @param {number} input - hexadecimal
 * @returns {string} - String of XML char entities
 */
export function hexesToXMLHexes(input) {
	let hexArr = hexesToHexArray(input);
	let result = hexArr.join(';');
	result = result.replaceAll('0x', '&#x');
	result += ';';
	return result;
}

// --------------------------------------------------------------
// Accepting unknown inputs
// --------------------------------------------------------------

/**
 * Take user input and try to get Unicode out
 * @param {string} input - input string
 * @returns {array} - sanitized array of strings
 */
export function parseCharsInputAsHex(input) {
	// Takes any kind or number of input
	// and returns an array of hex values
	// Unicode: 'U+123;U+123;'
	// Hexadecimal: '0x1230x123'
	// Chars: 'abc'

	// log('parseCharsInputAsHex', 'start');
	// log('passed ' + input);

	if (!input) return false;

	let entries = [];
	const results = [];
	input = normalizePrefixes(input);

	if (hasPrefix(input, 'U+')) {
		entries = input.split('U+');
	} else if (hasPrefix(input, '0x')) {
		entries = input.split('0x');
	} else {
		return charsToHexArray(input);
	}

	entries.forEach((entry) => {
		if (entry !== '') {
			results.push(validateAsHex(`0x${entry}`));
		}
	});

	if (results.length === 0) results.push('0x0');
	// log('returning ' + JSON.stringify(results));
	// log('parseCharsInputAsHex', 'end');
	return results;
}

/**
 * Does a loose compare of two hex inputs to see
 * if they are equal (ignoring zero pads)
 * @param {any} hex1 - first hex value
 * @param {any} hex2 - second hex value
 * @returns {boolean}
 */
export function areHexValuesEqual(hex1, hex2) {
	hex1 = validateAsHex(hex1);
	hex2 = validateAsHex(hex2);
	return hex1 == hex2;
}
