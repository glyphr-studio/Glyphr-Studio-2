import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';

let basicLatinOrder = {};
let unicodeRanges = {};
let ligatureToUnicode = {};
export {
  decToHex,
  decToHTML,
  glyphToHex,
  charsToHexArray,
  hexToChars,
  hexToHTML,
  hexToUnicodeHex,
  parseUnicodeInput,
  isInputUnicode,
  isInputHex,
  validateHex,
  getUnicodeName,
  getUnicodeShortName,
  basicLatinOrder,
  unicodeRanges,
  ligatureToUnicode,
};

/**
  Framework > Unicode
  Anything having to do with / working with
  Unicode values.  Also working with Unicode
  ranges, like basic latin.
**/

// --------------------------------------------------------------
// Conversion Functions
// --------------------------------------------------------------

/**
 * Convert decimal to hexadecimal
 * @param {number} d - decimal
 * @returns {string} - hexadecimal
 */
function decToHex(d) {
  let dr = Number(d).toString(16);

  while (dr.length < 4) {
    dr = '0' + dr;
  }

  return '0x' + dr.toUpperCase();
}

/**
 * Convert decimal to HTML
 * @param {number} d - decimal
 * @returns {string} - HTML
 */
function decToHTML(d) {
  return hexToHTML(decToHex(d));
}

/**
 * Convert Unicode glyph to hexadecimal
 * @param {string} s - unicode
 * @returns {string} - hexadecimal
 */
function glyphToHex(s) {
  let result = '';
  for (let i = 0; i < s.length; i++)
    result += decToHex(String(s).charCodeAt(i));
  return result;
}

/**
 * Convert string to an array of hexadecimal
 * @param {number} s - string
 * @returns {array} - hexadecimal
 */
function charsToHexArray(s) {
  const result = [];
  for (let i = 0; i < s.length; i++)
    result.push(decToHex(String(s).charCodeAt(i)));
  return result;
}

/**
 * Convert hexadecimal to string
 * @param {string} u - hexadecimal
 * @returns {string} - string
 */
function hexToChars(u) {
  // log('\n hexToChars - START');
  // log(`passed ${u} which is a ${typeof u}`);

  if (String(u).charAt(1) !== 'x') u = String(decToHex(u));
  // log(`u is now ${u} which is a ${typeof u}`);

  u = u.split('0x');
  let result = '';

  for (let i = 0; i < u.length; i++) {
    if (u[i] !== '') {
      u[i] = String.fromCharCode('0x' + u[i]);
      // log('added ' + u[i]);
      if (u[i]) result += u[i];
    }
  }

  // log(`hexToHTML`, 'end');
  return result;
}

/**
 * Convert hexadecimal to HTML
 * @param {string} h - hexadecimal
 * @returns {string} - HTML
 */
function hexToHTML(h) {
  // log('\n hexToHTML - START');
  // log('passed ' + h);
  if (!h || h.indexOf('0x') < 0) return false;

  h = String(h).split('0x');
  let result = '';

  for (let i = 0; i < h.length; i++) {
    if (h[i] !== '') {
      h[i] = '0x' + h[i];
      h[i] = parseInt(h[i], 16);
      if (h[i]) result += '&#' + h[i] + ';';
    }
  }
  return result;
}

/**
 * Convert hexadecimal to Unicode format
 * @param {number} h - hexadecimal
 * @returns {string} - Unicode
 */
function hexToUnicodeHex(h) {
  return h.replace(/0x/, '&#x') + ';';
}

/**
 * Take user input and try to get Unicode out
 * @param {string} str - input string
 * @returns {array} - sanitized array of strings
 */
function parseUnicodeInput(str) {
  // takes any kind or number of input
  // Unicode, Hex, or glyph
  // and returns an array of padded hex values

  // log('\n parseUnicodeInput - START');
  // log('passed ' + str);

  if (!str) return false;

  let entries = [];
  const results = [];

  if (isInputUnicode(str)) {
    str = str.replace(/u\+/g, 'U+');
    entries = str.split('U+');
  } else if (isInputHex(str)) {
    str = str.replace(/0X/g, '0x');
    entries = str.split('0x');
  } else {
    return charsToHexArray(str);
  }

  let te;
  for (let e = 0; e < entries.length; e++) {
    te = entries[e];
    te = te.replace(/;/g, '');
    if (te !== '') {
      while (te.length < 4) te = '0' + te;
      te = '0x' + te.toUpperCase();
      // log('parsed ' + e + ' as ' + te);
      results.push(te);
    }
  }

  if (results.length === 0) results.push('0x0000');
  // log('returning ' + JSON.stringify(results));
  // log('parseUnicodeInput', 'end');
  return results;
}

/**
 * Detects if this string is has Unicode chars in it
 * @param {string} str - input Unicode
 * @returns {number} - count of chars
 */
function isInputUnicode(str) {
  str = str.replace(/u\+/g, 'U+');
  let count = 0;
  let pos = str.indexOf('U+');
  while (pos !== -1) {
    count++;
    pos = str.indexOf('U+', pos + 2);
  }
  return count;
}

/**
 * Detects if this string has Hex chars in it
 * @param {string} str - input Hex
 * @returns {number} - count of chars
 */
function isInputHex(str) {
  str = str.replace(/0X/g, '0x');
  let count = 0;
  let pos = str.indexOf('0x');
  while (pos !== -1) {
    count++;
    pos = str.indexOf('0x', pos + 2);
  }
  return count;
}

/**
 * Checks to see if a string is valid Hex Char
 * @param {string} str - input Hex
 * @returns {boolean}
 */
function validateHex(str) {
  const green = '0123456789ABCDEF';
  str = str.toString();
  str = str.toUpperCase();
  if (str.startsWith('0x')) str = str.substring(2);

  if (str.length > 4) return false;

  for (let c = 0; c < str.length; c++) {
    if (green.indexOf(str.charAt(c)) === -1) return false;
  }

  return true;
}

//  -----------------
//  Glyph Name Wrapper
//  -----------------

/**
 * Gets the name of a Unicode character
 * @param {number} ch - Unicode code point
 * @returns {string} - name
 */
function getUnicodeName(ch) {
  // log('\n getUnicodeName - START');
  // log('passed ' + ch);
  ch = '' + ch;
  let re;
  const chn = ch * 1;

  if (chn >= 0x4e00 && chn < 0xa000) {
    re = 'CJK Unified Ideograph ' + ch.substr(2);
  } else {
    re = unicodeNames[ch] || '[name not found]';
  }

  // log('returning ' + re + '\n');
  // log('getUnicodeName', 'end');
  return re;
}

/**
 * Gets a short name for a Unicode character, and if not,
 * returns the regular long name
 * @param {number} ch - Unicode code point
 * @returns {string} - name
 */
function getUnicodeShortName(ch) {
  // log('\n getUnicodeShortName - START');
  // log('passed ' + ch);
  ch = '' + ch;
  let name = shortUnicodeNames[ch];
  if (!name) {
    name = getUnicodeName(ch);
    if (name)
      name = name
        .replace(/latin /gi, '')
        .replace(/ /g, '')
        .substr(0, 20);
    else name = 'none';
  }

  // log('getUnicodeShortName - returning ' + name + '', 'end');
  return name;
}

//  -----------------
//  Global Vars
//  -----------------

basicLatinOrder = [
  '0x41',
  '0x42',
  '0x43',
  '0x44',
  '0x45',
  '0x46',
  '0x47',
  '0x48',
  '0x49',
  '0x4A',
  '0x4B',
  '0x4C',
  '0x4D',
  '0x4E',
  '0x4F',
  '0x50',
  '0x51',
  '0x52',
  '0x53',
  '0x54',
  '0x55',
  '0x56',
  '0x57',
  '0x58',
  '0x59',
  '0x5A',
  '0x61',
  '0x62',
  '0x63',
  '0x64',
  '0x65',
  '0x66',
  '0x67',
  '0x68',
  '0x69',
  '0x6A',
  '0x6B',
  '0x6C',
  '0x6D',
  '0x6E',
  '0x6F',
  '0x70',
  '0x71',
  '0x72',
  '0x73',
  '0x74',
  '0x75',
  '0x76',
  '0x77',
  '0x78',
  '0x79',
  '0x7A',
  '0x30',
  '0x31',
  '0x32',
  '0x33',
  '0x34',
  '0x35',
  '0x36',
  '0x37',
  '0x38',
  '0x39',
  '0x21',
  '0x22',
  '0x23',
  '0x24',
  '0x25',
  '0x26',
  '0x27',
  '0x28',
  '0x29',
  '0x2A',
  '0x2B',
  '0x2C',
  '0x2D',
  '0x2E',
  '0x2F',
  '0x3A',
  '0x3B',
  '0x3C',
  '0x3D',
  '0x3E',
  '0x3F',
  '0x40',
  '0x5B',
  '0x5C',
  '0x5D',
  '0x5E',
  '0x5F',
  '0x60',
  '0x7B',
  '0x7C',
  '0x7D',
  '0x7E',
  '0x20',
];

unicodeRanges = {
  basicLatin: { begin: 0x20, end: 0x7e },
  latinSupplementControls: { begin: 0x80, end: 0x9f },
  latinSupplement: { begin: 0xa0, end: 0xff },
  latinExtendedA: { begin: 0x100, end: 0x17f },
  latinExtendedB: { begin: 0x180, end: 0x24f },
};

// https://en.wikipedia.org/wiki/Typographic_ligature
ligatureToUnicode = {
  ff: '0xFB00',
  fi: '0xFB01',
  fl: '0xFB02',
  ft: '0xFB05',
  ffi: '0xFB03',
  ffl: '0xFB04',
};
