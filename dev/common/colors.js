import {round} from './functions.js';
export {uiColors, accentColors, parseColorString, shiftColor, getColorFromRGBA,
  transparencyToAlpha, makeRandomSaturatedColor, flashUIElementAsActive};

// -------------------
// Re-usable Colors
// -------------------
/* eslint-disable key-spacing */

const accentColors = {
  gray: {
    l95: '#E2F3FC',
    l90: '#CFE7F3',
    l85: '#BAD9E9',
    l80: '#A6CCDF',
    l75: '#95BFD4',
    l70: '#8AB1C4',
    l65: '#7FA3B5',
    l60: '#7595A6',
    l55: '#6A8897',
    l50: '#5F7A87',
    l45: '#556D79',
    l40: '#4B606B',
    l35: '#42545E',
    l30: '#394951',
    l25: '#2F3D44',
    l20: '#273238',
    l15: '#1F272C',
    l10: '#161D20',
    l05: '#0E1214',
  },

  blue: {
    l95: '#DEF4FF',
    l90: '#C0E9FD',
    l85: '#9BDDFF',
    l80: '#73D1FF',
    l75: '#49C4FF',
    l70: '#2EB5FA',
    l65: '#00A5F8',
    l60: '#0097E3',
    l55: '#008ACF',
    l50: '#007DBB',
    l45: '#0071AA',
    l40: '#006498',
    l35: '#005782',
    l30: '#004A70',
    l25: '#004060',
    l20: '#00344E',
    l15: '#00283D',
    l10: '#001E2E',
    l05: '#00141E',
  },

  orange: {
    l95: '#FFECE3',
    l90: '#FFDAC7',
    l85: '#FFC7AB',
    l80: '#FFB48F',
    l75: '#FFA070',
    l70: '#FF8B50',
    l65: '#FF6B1F',
    l60: '#FF5500',
    l55: '#EB4E00',
    l50: '#D54700',
    l45: '#BF3F00',
    l40: '#A83800',
    l35: '#963100',
    l30: '#822A00',
    l25: '#6E2400',
    l20: '#591E00',
    l15: '#471800',
    l10: '#331100',
    l05: '#210B00',
  },

  green: {
    l95: '#A1FFA9',
    l90: '#7DFD88',
    l85: '#60F06D',
    l80: '#44E351',
    l75: '#2AD439',
    l70: '#14C623',
    l65: '#00B60F',
    l60: '#00A70E',
    l55: '#00980D',
    l50: '#008A0B',
    l45: '#007C0A',
    l40: '#036E0C',
    l35: '#006008',
    l30: '#005407',
    l25: '#004606',
    l20: '#003A05',
    l15: '#002D04',
    l10: '#002103',
    l05: '#001402',
  },

  purple: {
    l95: '#FAEAFF',
    l90: '#F5D8FF',
    l85: '#F0C5FF',
    l80: '#EBB1FF',
    l75: '#E69CFF',
    l70: '#E289FF',
    l65: '#DB6FFF',
    l60: '#D454FF',
    l55: '#CF38FF',
    l50: '#BF00FF',
    l45: '#AD00E7',
    l40: '#9A00CE',
    l35: '#8800B6',
    l30: '#75009C',
    l25: '#650088',
    l20: '#52006E',
    l15: '#420057',
    l10: '#330043',
    l05: '#240031',
  },
};

const accentColor = accentColors.blue.l65;

const uiColors = {
  accent: accentColor,
  offWhite:   '#F2F6F9',
  darkred:  '#740000',
  red:    '#F40000',
  lightred:   '#FFCCCC',
  enabled: {
    resting: {
      text:     'rgb(10, 10, 10)',
      lightText:  'rgb(30, 30, 30)',
      border:   'rgb(190, 190, 190)',
      fill:     'rgb(100, 100, 100)',
      background: 'rgb(250, 250, 250)',
    },
    focus: {
      text:     'rgb(0, 0, 0)',
      lightText:  'rgb(20, 20, 20)',
      border:   'rgb(160, 160, 160)',
      fill:     'rgb(30, 40, 50)',
      background: getColorFromRGBA(accentColor, 0.2),
    },
    active: {
      text:     'rgb(0, 0, 0)',
      lightText:  getColorFromRGBA(accentColor, 0.25),
      border:   'rgb(160, 160, 160)',
      fill:     accentColor,
      background: getColorFromRGBA(accentColor, 0.1),
    },
  },
  disabled: {
    text:     'rgb(40, 40, 40)',
    border:   'rgb(210, 210, 210)',
    fill:     'rgb(210, 210, 210)',
    background: 'rgb(240, 240,240)',
  },
};
/* eslint-enable key-spacing */

// -------------------
// Color Math
// -------------------

/**
 * Convert a color string into an object
 * @param {string} c - color string
 * @returns {object}
 */
function parseColorString(c) {
  let val = {r: 0, g: 0, b: 0, a: 1};

  if (typeof c !== 'string') return val;

  if (c.charAt(0)==='#') {
    c = c.substring(1, 7);
    val.r = parseInt(c.substring(0, 2), 16);
    val.g = parseInt(c.substring(2, 4), 16);
    val.b = parseInt(c.substring(4, 6), 16);
  } else if (c.substring(0, 4) === 'rgb(') {
    c = c.split('(')[1].split(')')[0].split(',');
    val.r = parseInt(c[0], 10);
    val.g = parseInt(c[1], 10);
    val.b = parseInt(c[2], 10);
    val.a = parseInt(c[3], 10) || 1;
  }

  return val;
}

/**
 * Takes a color string, then lightens or darkens that color
 * by a certain percentage
 * @param {string} c - color string
 * @param {number} percent - ammount to shift color
 * @param {boolean} lighter - true = lighten, false = darken
 * @returns {string}
 */
function shiftColor(c, percent, lighter) {
  percent = Math.max(0, Math.min(percent, 1));
  let val = parseColorString(c);

  val.r = Math.max(0, Math.min(val.r, 255));
  val.g = Math.max(0, Math.min(val.g, 255));
  val.b = Math.max(0, Math.min(val.b, 255));

  if (lighter) {
    val.r = round(((255-val.r)*percent)+val.r);
    val.g = round(((255-val.g)*percent)+val.g);
    val.b = round(((255-val.b)*percent)+val.b);
  } else {
    val.r = round(val.r-(val.r*percent));
    val.g = round(val.g-(val.g*percent));
    val.b = round(val.b-(val.b*percent));
  }

  return `rgb(${val.r},${val.g},${val.b})`;
}

/**
 * Converts an RGBA color to it's opaque RGB equivallent
 * @param {object} rgb - color object in RGB
 * @param {number} alpha - transparency
 * @returns {string}
 */
function getColorFromRGBA(rgb, alpha) {
  let val = parseColorString(rgb);

  let dr = round((255-val.r) * (1-alpha));
  let dg = round((255-val.g) * (1-alpha));
  let db = round((255-val.b) * (1-alpha));

  let r = val.r + dr;
  let g = val.g + dg;
  let b = val.b + db;

  return `rgb(${r},${g},${b})`;
}

/**
 * Converts Transparency to Alpha, invert and change scale
 * @param {number} transparency - 0=opaque, 100=transparent
 * @returns {number}
 */
function transparencyToAlpha(transparency) {
  let t = parseInt(transparency);
  if (!t || isNaN(t)) return 1;

  if (t > 100) return 0;
  if (t < 0) return 1;

  return ((100 - transparency) / 100);
}


/**
 * Makes a random fully saturated color
 * @returns {string}
 */
function makeRandomSaturatedColor() {
  let sat = Math.floor(Math.random()*5)*51;
  let arr = [];
  let satloc = Math.floor(Math.random()*3);
  arr[satloc] = sat;
  switch (satloc) {
    case 0:
      arr[1] = 0;
      arr[2] = 255;
      break;
    case 1:
      arr[0] = 0;
      arr[2] = 255;
      break;
    case 2:
      arr[0] = 255;
      arr[1] = 0;
      break;
  }
  return 'rgb('+arr[0]+','+arr[1]+','+arr[2]+')';
}

/**
 * When a UI Element is sent an event via JavaScript
 * (as opposed to a user's input via keyboard or mouse)
 * the element's Style does not look like a native
 * :active style. This function sends an artificial
 * :active style for a brief moment.
 * @param {object} elem - HTML Element to flash
 */
function flashUIElementAsActive(elem) {
  elem.style.borderColor = uiColors.enabled.active.border;
  elem.style.backgroundColor = uiColors.enabled.active.background;
  elem.style.color = uiColors.enabled.active.fill;
  elem.style.fill = uiColors.enabled.active.fill;

  window.setTimeout(function() {
    elem.style.borderColor = uiColors.enabled.resting.border;
    elem.style.backgroundColor = uiColors.enabled.resting.background;
    elem.style.color = uiColors.enabled.resting.fill;
    elem.style.fill = uiColors.enabled.resting.fill;
  }, 200);
}
