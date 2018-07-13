import {round} from './functions.js';
export {parseColorString, shiftColor, getColorFromRGBA, transparencyToAlpha, makeRandomSaturatedColor};

// -------------------
// COLORS
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
