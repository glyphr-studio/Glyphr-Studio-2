export default {};
export {
  debug,
  saveFile,
  makeDateStampSuffix,
  getFirstID,
  generateNewID,
  clone,
  json,
  areEqual,
  makeCrisp,
  round,
  numSan,
  strSan,
  trim,
  isVal,
  hasNonValues,
  reqAniFrame,
  duplicates,
  localStorageGet,
  localStorageSet,
  calculateAngle,
  calculateLength,
  rotate,
  rad,
  deg,
  angleToNiceAngle,
  niceAngleToAngle,
  makeEmailContent,
  kCombinations,
};

/**
 * FUNCTIONS
 * some random general-use functions
 */

/**
 * Wrapper for console.log that does some extra fancy stuff, and
 * also adheres to a global switch in settings
 * @param {string} message - message to show in the console
 * @param {boolean} force - show message even if dev.mode = false
 */
function debug(message, force) {
  const dev = window.GlyphrStudio.settings.dev;
  // if (!dev.mode) return;

  if (dev.mode || force) {
    if (typeof message === 'string') {
      message = message.replace(/&lt;/gi, '<');
      message = message.replace(/&gt;/gi, '>');

      if (message === 'group') {
        console.group();
        return;
      } else if (message === 'groupCollapsed') {
        console.groupCollapsed();
        return;
      } else if (dev.debugAutoGroup && message.indexOf('- START') > 0) {
        console.group(message.substr(2).replace(' - START', ''));
        return;
      } else if (
        message === 'groupEnd' ||
        (dev.debugAutoGroup && message.indexOf('- END') > 0)
      ) {
        console.groupEnd(message);
        return;
      } else {
        console.log(message);
      }
    } else if (typeof message === 'object') {
      if (dev.debugTableObjects) console.table(message);
      else console.log(message);
    }
  }
}

// -------------------
// File Saver
// -------------------

/**
 * Saves a file
 * @param {string} fileName - name for the saved file
 * @param {string} buffer - data for the file
 * @param {string} fileType - file suffix
 */
function saveFile(fileName, buffer, fileType) {
  fileType = fileType || 'text/plain;charset=utf-8';
  const fileBlob = new Blob([buffer], { type: fileType, endings: 'native' });

  try {
    // IE
    window.navigator.msSaveBlob(fileBlob, fileName);
  } catch (err) {
    // Others
    const link = document.createElement('a');
    window.URL = window.URL || window.webkitURL;
    link.href = window.URL.createObjectURL(fileBlob);
    // link.onclick = ("alert("+window.URL.createObjectURL(fileBlob)+");");
    link.download = fileName;

    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, false);
    link.dispatchEvent(event);
  }
}

/**
 * Generates a date suffix for file saves
 * @returns {string}
 */
function makeDateStampSuffix() {
  const d = new Date();
  const yr = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const hr = d.getHours();
  const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  return '' + yr + '.' + mo + '.' + day + '-' + hr + '.' + min + '.' + sec;
}

// --------------------------------------------------------------
// Object Functions
// --------------------------------------------------------------

/**
 * Gets the first key in an object
 * @param {object} obj
 * @returns {string}
 */
function getFirstID(obj) {
  for (const key of obj) return key;
  return false;
}

/**
 * Creates a unique key for an object given a prefix
 * @param {object} obj
 * @param {string} base - string prefix for the new ID
 * @returns {string}
 */
function generateNewID(obj, base) {
  let number = 1;
  base = base || 'id';
  let id = '' + base + number;
  while (obj[id]) {
    number += 1;
    id = '' + base + number;
  }

  return id;
}

// -------------------
// Common Functions
// -------------------

/**
 * Returns a full new copy of any object
 * 'parent' and 'parent' are pointers up to parent objects, they
 * cause infinite loops when cloning objects.  Kind of a hack.
 * @param {object} source - object to clone
 * @returns {object}
 */
function clone(source) {
  const newObj = source instanceof Array ? [] : {};
  for (const i in source) {
    if (
      source[i] &&
      typeof source[i] === 'object' &&
      i !== 'parent' &&
      i !== 'cache'
    ) {
      newObj[i] = clone(source[i]);
    } else newObj[i] = source[i];
  }
  return newObj;
}

/**
 * Wrapper for JSON.stringify that does pretty
 * formatting by default
 * @param {object} obj - object to stringify
 * @param {boolean} raw - true = don't format
 * @returns {string}
 */
function json(obj, raw) {
  obj = clone(obj);
  if (raw) return JSON.stringify(obj);
  else {
    const j = JSON.stringify(obj, undefined, '\t');
    if (j) return j.replace(/\n/g, '\r\n');
    else return '';
  }
}

/**
 * Simple way of comparing equality between things (including Objects)
 * Not intended for complex objects :-)
 * @param {object} obj1 - first object to compare
 * @param {object} obj2 - second object to compare
 * @returns {boolean}
 */
function areEqual(obj1, obj2) {
  // debug(`\n areEqual - START`);
  // debug(`\t passed ${typeof obj1} and ${typeof obj2} equality? ${obj1 === obj2}`);

  if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  for (const key of obj1) {
    if (obj2[key]) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!areEqual(obj1[key], obj2[key])) return false;
      } else if (obj1[key] !== obj2[key]) return false;
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Compare two x/y points within a margin of rounding
 * @param {object} c1 - Coord or XYPoint, First point to compare
 * @param {object} c2 - Coord or XYPoint, Second point to compare
 * @param {number} threshold - how close to compare positions
 * @returns {boolean}
 */
export function pointsAreEqual(c1, c2, threshold = 1) {
  // debug('\n pointsAreEqual - START');
  // debug('\t c1 ' + json(c1, true));
  // debug('\t c2 ' + json(c2, true));
  // debug('\t threshold ' + threshold);

  if (c1.x === c2.x && c1.y === c2.y) {
    // debug('\t exact match');
    return true;
  }

  const dx = Math.abs(c1.x - c2.x);
  const dy = Math.abs(c1.y - c2.y);

  // debug('\t dx ' + dx + '\tdy ' + dy);

  if (dx <= threshold && dy <= threshold) {
    // debug('\t below threshold match');
    return true;
  }

  // debug('\t not a match');
  // debug(' pointsAreEqual - END\n');

  return false;
}

/**
 * Rounds a number to include a .5 so it draws nicely on canvas
 * true = +0.5, false = -0.5
 * @param {number} num - number to crisp
 * @param {boolean} dir - direction, plus or minus, to adjust number
 * @returns {number}
 */
function makeCrisp(num, dir) {
  const mul = dir ? 1 : -1;
  return round(num) + 0.5 * mul;
}

/**
 * Better rounding than Math.round
 * @param {number} num - number to round
 * @param {number} dec - number of decimal places
 * @returns {number}
 */
function round(num, dec = 0) {
  if (!num) return 0;
  return Number(Math.round(num + 'e' + dec) + 'e-' + dec) || 0;
}

/**
 * Floating point numbers make me mad
 * Looks for sequences of 0s or 9s
 * @param {number} num - number to sanitize
 * @returns {number}
 */
function numSan(num) {
  num = parseFloat(num);
  const stringNumber = '' + num;

  if (stringNumber.indexOf('0000') > -1 || stringNumber.indexOf('9999') > -1) {
    num = round(num, 4);
  }

  if (num < 0.0 && num > 0) num = 0;

  return num;
}

/**
 * Removes illegal file name chars
 * @param {string} val - string to sanitize
 * @returns {string}
 */
function strSan(val = '') {
  val = String(val);
  return val.replace(/[<>'"\\]/g, '');
}

/**
 * Removes beginning and trailing whitespace, and any breaking or tab chars
 * @param {string} text - text to trim
 * @returns {string}
 */
function trim(text = '') {
  text = String(text);

  // Old school quotes stored as values bug
  if (text === `""` || text === `''`) return '';

  try {
    text = text.replace(/^\s+|\s+$/g, '');
    return text.replace(/(\r\n|\n|\r|\t)/gm, '');
  } catch (e) {
    return '';
  }
}

/**
 * Checks to see if something is a value, and not null or undefined
 * @param {*} val - variable to test
 * @returns {boolean}
 */
function isVal(val) {
  if (val === 0) return true;
  else if (val === false) return true;
  else if (val === null || val === undefined) return false;
  // else if ( typeof val === 'number' && isNaN(val)) return false;
  else if (typeof val === 'object' && Object.keys(val).length === 0)
    return false;
  else return !!val;
}

/**
 * Checks all object properties for isVal
 * @param {object} obj - object to check
 * @returns {boolean}
 */
function hasNonValues(obj) {
  if (!obj) return true;

  for (const v of obj) {
    if (!isVal(obj[v])) return true;
    if (obj[v] === Number.MAX_SAFE_INTEGER) return true;
    if (obj[v] === Number.MIN_SAFE_INTEGER) return true;
  }

  return false;
}

/**
 * Calls the right Request Animation Frame in two screen mode
 * @param {function} fun - function to call
 */
function reqAniFrame(fun) {
  if (window.requestAnimationFrame) window.requestAnimationFrame(fun);
  else {
    console.warn('no requestAnimationFrame');
    fun();
  }
}

/**
 * A function for filtering duplicates in an array
 * @param {*} v
 * @param {number} i
 * @param {array} a
 * @returns {boolean}
 */
function duplicates(v, i, a) {
  return a.indexOf(v) === i;
}

// --------------------------
// Local Storage
// --------------------------

/**
 * Wrapper for window.localStorage.setItem
 * @param {string} key - storage key
 * @param {*} value - what to save
 */
function localStorageSet(key, value) {
  key = 'GlyphrStudio_' + key;

  if (value.save) value = JSON.stringify(value.save());
  else if (typeof value != 'string') value = JSON.stringify(value);

  window.localStorage.setItem(key, value);
}

/**
 * Wrapper for window.localStorage.getItem
 * @param {string} key - key to look for
 * @returns {*}
 */
function localStorageGet(key) {
  if (window.localStorage[key]) {
    return JSON.parse(window.localStorage.getItem(key));
  } else if (window.localStorage['GlyphrStudio_' + key]) {
    return JSON.parse(window.localStorage.getItem('GlyphrStudio_' + key));
  } else {
    return undefined;
  }
}

// --------------------------
// Angle and Rotation Stuff
// --------------------------

// Use JavaScript "Angle" system by default:
// Radians, top is positive bottom is negative
// 3 o'clock is zero, 9 o'clock is pi

// Glyphr Studio "Nice Angle" used in the UI
// 360 Degrees, 12 o'clock is zero, clockwise = positive

/**
 * Calculates the angle (in radians) of a handle given a point
 * @param {XYPoint} handle - x/y point of handle
 * @param {XYPoint} point - x/y point of point
 * @returns {number}
 */
function calculateAngle(handle, point = { x: 0, y: 0 }) {
  let result = Math.atan2(handle.y - point.y, handle.x - point.x);

  if (isNaN(result)) {
    console.warn(
      'calculateAngle returned NaN\n' + json(handle) + '\n' + json(point)
    );
    result = 0;
  }

  return result;
}

/**
 * Calculates the length of a handle, given a point
 * @param {XYPoint} handle - x/y point of handle
 * @param {XYPoint} point - x/y point of point
 * @returns {number}
 */
function calculateLength(handle, point) {
  const adj = point.x - handle.x;
  const opp = point.y - handle.y;
  const result = Math.sqrt(adj * adj + opp * opp);
  return result;
}

/**
 * Rotates a point a certain number of degrees around a given point
 * @param {XYPoint} point - x/y point to rotate
 * @param {number} angle - how much to rotate (radians)
 * @param {XYPoint} about - x/y point center of rotation
 */
function rotate(point, angle, about = { x: 0, y: 0 }) {
  // debug('\n rotate - START');
  // debug('\t point ' + json(point, true));
  // debug('\t Math angle:\t' + angle);
  // debug('\t about ' + json(about, true));

  if (!angle || !point) return;

  point.x -= about.x;
  point.y -= about.y;

  const newX = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const newY = point.x * Math.sin(angle) + point.y * Math.cos(angle);

  point.x = newX + about.x;
  point.y = newY + about.y;

  // debug('\t new point x/y: ' + point.x + '/' + point.y);
  // debug(' rotate - END\n');
}

/**
 * Convert degrees to radians
 * @param {number} deg - degrees
 * @returns {number}
 */
function rad(deg) {
  return ((deg * Math.PI) / 180) % Math.PI;
}

/**
 * Convert radians to degrees
 * @param {number} rad - radians
 * @returns {number}
 */
function deg(rad) {
  return ((rad * 180) / Math.PI) % 360;
}

/**
 * Given a standard JavaScript angle (radians), convert it to the angle
 * system we show the user (degrees, aka "Nice Angle")
 * @param {number} angle - Angle in Radians
 * @returns {number} - Angle in Degrees
 */
function angleToNiceAngle(angle) {
  angle = deg(angle);
  angle = 360 - angle;
  angle -= 270;
  angle = angle % 360;
  if (angle < 0) angle += 360;

  return angle;
}

/**
 * Given a "Nice Angle" in degrees from the UI, calculate the type of
 * angle that JavaScript knows about (radians)
 * @param {number} angle - Angle in Degrees
 * @returns {number} - Angle in Radians
 */
function niceAngleToAngle(angle) {
  angle += 90;
  angle = angle % 360;
  if (angle < 180) angle = 360 - angle;
  else angle *= -1;

  angle = rad(angle);

  return angle;
}

// -------------------
// BUG EMAIL
// -------------------

/**
 * Generates the content for the "email us" link
 * @returns {string}
 */
function makeEmailContent() {
  const con = `Have a feature idea or ran into an issue%3F We'd be happy to help!
  %0A%0A%0A%0A___________________________________________%0A
  version %09Glyphr Studio  ${window.GlyphrStudio.versionNumber} %0A
  app name %09 ${navigator.appName} %0A
  language %09 ${navigator.language} %0A
  platform %09 ${navigator.platform} %0A
  user agent %09 ${encodeURIComponent(navigator.userAgent)} %0A`;

  // debug(con);

  return con;
}

// -------------------
// COMBINATORICS
// -------------------

/**
 * K-combinations
 *
 * Get k-sized combinations of elements in a set.
 *
 * Examples:
 *
 *   kCombinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 *
 *   kCombinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 *
 *   kCombinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 *
 *   kCombinations([1, 2, 3], 4)
 *   -> []
 *
 *   kCombinations([1, 2, 3], 0)
 *   -> []
 *
 *   kCombinations([1, 2, 3], -1)
 *   -> []
 *
 *   kCombinations([], 0)
 *   -> []
 *
 * @param {number} set - Array of objects of any type. They are treated as unique.
 * @param {number} k - size of combinations to search for.
 * @returns {array} - Array of found combinations, size of a combination is k.
 */
function kCombinations(set, k) {
  let i;
  let j;
  let combs;
  let head;
  let tailCombinations;

  if (k > set.length || k <= 0) {
    return [];
  }

  if (k == set.length) {
    return [set];
  }

  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i + 1);
    tailCombinations = kCombinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailCombinations.length; j++) {
      combs.push(head.concat(tailCombinations[j]));
    }
  }
  return combs;
}
