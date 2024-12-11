import { round } from './functions.js';

// --------------------------------------------------------------
// Re-usable Colors
// --------------------------------------------------------------
/* eslint-disable key-spacing */

// Straight Lab Color System
export const accentColors = {
	gray: {
		l99: 'hsl(200, 20%, 99%)',
		l97: 'hsl(200, 20%, 97%)',
		l95: 'hsl(200, 20%, 94%)',
		l90: 'hsl(200, 20%, 89%)',
		l85: 'hsl(200, 20%, 83%)',
		l80: 'hsl(200, 20%, 78%)',
		l75: 'hsl(200, 20%, 72%)',
		l70: 'hsl(200, 20%, 66%)',
		l65: 'hsl(200, 20%, 61%)',
		l60: 'hsl(200, 20%, 56%)',
		l55: 'hsl(200, 20%, 50%)',
		l50: 'hsl(200, 20%, 46%)',
		l45: 'hsl(200, 20%, 41%)',
		l40: 'hsl(200, 20%, 36%)',
		l35: 'hsl(200, 20%, 32%)',
		l30: 'hsl(200, 20%, 27%)',
		l25: 'hsl(200, 20%, 23%)',
		l20: 'hsl(200, 20%, 19%)',
		l15: 'hsl(200, 20%, 15%)',
		l10: 'hsl(200, 20%, 10%)',
		l05: 'hsl(200, 20%, 6%)',
	},

	blue: {
		l97: 'hsl(197, 100%, 96%)',
		l95: 'hsl(197, 100%, 93%)',
		l90: 'hsl(197, 100%, 86%)',
		l85: 'hsl(197, 100%, 78%)',
		l80: 'hsl(197, 100%, 70%)',
		l75: 'hsl(197, 100%, 60%)',
		l70: 'hsl(197, 100%, 50%)',
		l65: 'hsl(197, 100%, 46%)',
		l60: 'hsl(197, 100%, 42%)',
		l55: 'hsl(197, 100%, 38%)',
		l50: 'hsl(197, 100%, 35%)',
		l45: 'hsl(197, 100%, 31%)',
		l40: 'hsl(197, 100%, 28%)',
		l35: 'hsl(197, 100%, 24%)',
		l30: 'hsl(197, 100%, 21%)',
		l25: 'hsl(197, 100%, 18%)',
		l20: 'hsl(197, 100%, 14%)',
		l15: 'hsl(197, 100%, 11%)',
		l10: 'hsl(197, 100%, 8%)',
		l05: 'hsl(197, 100%, 5%)',
	},

	royal: {
		l95: 'hsl(230, 100%, 97%)',
		l90: 'hsl(230, 100%, 93%)',
		l85: 'hsl(230, 100%, 90%)',
		l80: 'hsl(230, 100%, 86%)',
		l75: 'hsl(230, 100%, 83%)',
		l70: 'hsl(230, 100%, 79%)',
		l65: 'hsl(230, 100%, 76%)',
		l60: 'hsl(230, 100%, 72%)',
		l55: 'hsl(230, 100%, 68%)',
		l50: 'hsl(230, 100%, 64%)',
		l45: 'hsl(230, 100%, 60%)',
		l40: 'hsl(230, 100%, 55%)',
		l35: 'hsl(230, 100%, 49%)',
		l30: 'hsl(230, 100%, 43%)',
		l25: 'hsl(230, 100%, 36%)',
		l20: 'hsl(230, 100%, 30%)',
		l15: 'hsl(230, 100%, 24%)',
		l10: 'hsl(230, 100%, 18%)',
		l05: 'hsl(230, 100%, 12%)',
	},

	purple: {
		l95: 'hsl(285, 100%, 97%)',
		l90: 'hsl(285, 100%, 92%)',
		l85: 'hsl(285, 100%, 89%)',
		l80: 'hsl(285, 100%, 85%)',
		l75: 'hsl(285, 100%, 81%)',
		l70: 'hsl(285, 100%, 77%)',
		l65: 'hsl(285, 100%, 72%)',
		l60: 'hsl(285, 100%, 67%)',
		l55: 'hsl(285, 100%, 61%)',
		l50: 'hsl(285, 100%, 50%)',
		l45: 'hsl(285, 100%, 45%)',
		l40: 'hsl(285, 100%, 40%)',
		l35: 'hsl(285, 100%, 36%)',
		l30: 'hsl(285, 100%, 31%)',
		l25: 'hsl(285, 100%, 26%)',
		l20: 'hsl(285, 100%, 22%)',
		l15: 'hsl(285, 100%, 18%)',
		l10: 'hsl(285, 100%, 14%)',
		l05: 'hsl(285, 100%, 9%)',
	},

	orange: {
		l95: 'hsl(20, 100%, 95%)',
		l90: 'hsl(20, 100%, 90%)',
		l85: 'hsl(20, 100%, 84%)',
		l80: 'hsl(20, 100%, 79%)',
		l75: 'hsl(20, 100%, 73%)',
		l70: 'hsl(20, 100%, 67%)',
		l65: 'hsl(20, 100%, 59%)',
		l60: 'hsl(20, 100%, 51%)',
		l55: 'hsl(20, 100%, 46%)',
		l50: 'hsl(20, 100%, 42%)',
		l45: 'hsl(20, 100%, 37%)',
		l40: 'hsl(20, 100%, 33%)',
		l35: 'hsl(20, 100%, 29%)',
		l30: 'hsl(20, 100%, 25%)',
		l25: 'hsl(20, 100%, 21%)',
		l20: 'hsl(20, 100%, 17%)',
		l15: 'hsl(20, 100%, 14%)',
		l10: 'hsl(20, 100%, 10%)',
		l05: 'hsl(20, 100%, 7%)',
	},

	green: {
		l95: 'hsl(125, 100%, 90%)',
		l90: 'hsl(125, 100%, 74%)',
		l85: 'hsl(125, 100%, 49%)',
		l80: 'hsl(125, 100%, 45%)',
		l75: 'hsl(125, 100%, 42%)',
		l70: 'hsl(125, 100%, 39%)',
		l65: 'hsl(125, 100%, 36%)',
		l60: 'hsl(125, 100%, 33%)',
		l55: 'hsl(125, 100%, 30%)',
		l50: 'hsl(125, 100%, 28%)',
		l45: 'hsl(125, 100%, 24%)',
		l40: 'hsl(125, 100%, 21%)',
		l35: 'hsl(125, 100%, 19%)',
		l30: 'hsl(125, 100%, 16%)',
		l25: 'hsl(125, 100%, 14%)',
		l20: 'hsl(125, 100%, 11%)',
		l15: 'hsl(125, 100%, 9%)',
		l10: 'hsl(125, 100%, 7%)',
		l05: 'hsl(125, 100%, 4%)',
	},
};
/*
// Original color system
export const accentColors = {
	gray: {
		l97: 'hsl(200, 81%, 97%)',
		l95: 'hsl(200, 81%, 94%)',
		l90: 'hsl(200, 60%, 88%)',
		l85: 'hsl(200, 52%, 82%)',
		l80: 'hsl(200, 47%, 76%)',
		l75: 'hsl(200, 42%, 71%)',
		l70: 'hsl(200, 33%, 65%)',
		l65: 'hsl(200, 27%, 60%)',
		l60: 'hsl(200, 22%, 55%)',
		l55: 'hsl(200, 18%, 50%)',
		l50: 'hsl(200, 17%, 45%)',
		l45: 'hsl(200, 17%, 40%)',
		l40: 'hsl(200, 18%, 36%)',
		l35: 'hsl(200, 18%, 31%)',
		l30: 'hsl(200, 17%, 27%)',
		l25: 'hsl(200, 18%, 23%)',
		l20: 'hsl(200, 18%, 19%)',
		l15: 'hsl(200, 17%, 15%)',
		l10: 'hsl(200, 19%, 11%)',
		l05: 'hsl(200, 18%, 7%)',
	},

	blue: {
		l95: 'hsl(200, 100%, 94%)',
		l90: 'hsl(200, 94%, 87%)',
		l85: 'hsl(200, 100%, 80%)',
		l80: 'hsl(200, 100%, 73%)',
		l75: 'hsl(200, 100%, 64%)',
		l70: 'hsl(200, 100%, 58%)',
		l65: 'hsl(200, 100%, 49%)',
		l60: 'hsl(200, 100%, 45%)',
		l55: 'hsl(200, 100%, 41%)',
		l50: 'hsl(200, 100%, 37%)',
		l45: 'hsl(200, 100%, 33%)',
		l40: 'hsl(200, 100%, 30%)',
		l35: 'hsl(200, 100%, 25%)',
		l30: 'hsl(200, 100%, 22%)',
		l25: 'hsl(200, 100%, 19%)',
		l20: 'hsl(200, 100%, 15%)',
		l15: 'hsl(200, 100%, 12%)',
		l10: 'hsl(200, 100%, 9%)',
		l05: 'hsl(200, 100%, 6%)',
	},

	orange: {
		l95: 'hsl(20, 100%, 95%)',
		l90: 'hsl(20, 100%, 89%)',
		l85: 'hsl(20, 100%, 84%)',
		l80: 'hsl(20, 100%, 78%)',
		l75: 'hsl(20, 100%, 72%)',
		l70: 'hsl(20, 100%, 66%)',
		l65: 'hsl(20, 100%, 56%)',
		l60: 'hsl(20, 100%, 50%)',
		l55: 'hsl(20, 100%, 46%)',
		l50: 'hsl(20, 100%, 42%)',
		l45: 'hsl(20, 100%, 37%)',
		l40: 'hsl(20, 100%, 33%)',
		l35: 'hsl(20, 100%, 29%)',
		l30: 'hsl(20, 100%, 25%)',
		l25: 'hsl(20, 100%, 22%)',
		l20: 'hsl(20, 100%, 17%)',
		l15: 'hsl(20, 100%, 14%)',
		l10: 'hsl(20, 100%, 10%)',
		l05: 'hsl(20, 100%, 6%)',
	},

	green: {
		l95: 'hsl(125, 100%, 82%)',
		l90: 'hsl(125, 97%, 74%)',
		l85: 'hsl(125, 83%, 66%)',
		l80: 'hsl(125, 74%, 58%)',
		l75: 'hsl(125, 67%, 50%)',
		l70: 'hsl(125, 82%, 43%)',
		l65: 'hsl(125, 100%, 36%)',
		l60: 'hsl(125, 100%, 33%)',
		l55: 'hsl(125, 100%, 30%)',
		l50: 'hsl(125, 100%, 27%)',
		l45: 'hsl(125, 100%, 24%)',
		l40: 'hsl(125, 95%, 22%)',
		l35: 'hsl(125, 100%, 19%)',
		l30: 'hsl(125, 100%, 16%)',
		l25: 'hsl(125, 100%, 14%)',
		l20: 'hsl(125, 100%, 11%)',
		l15: 'hsl(125, 100%, 9%)',
		l10: 'hsl(125, 100%, 6%)',
		l05: 'hsl(125, 100%, 4%)',
	},

	purple: {
		l95: 'hsl(285, 100%, 96%)',
		l90: 'hsl(285, 100%, 92%)',
		l85: 'hsl(285, 100%, 89%)',
		l80: 'hsl(285, 100%, 85%)',
		l75: 'hsl(285, 100%, 81%)',
		l70: 'hsl(285, 100%, 77%)',
		l65: 'hsl(285, 100%, 72%)',
		l60: 'hsl(285, 100%, 66%)',
		l55: 'hsl(285, 100%, 61%)',
		l50: 'hsl(285, 100%, 50%)',
		l45: 'hsl(285, 100%, 45%)',
		l40: 'hsl(285, 100%, 40%)',
		l35: 'hsl(285, 100%, 36%)',
		l30: 'hsl(285, 100%, 31%)',
		l25: 'hsl(285, 100%, 27%)',
		l20: 'hsl(285, 100%, 22%)',
		l15: 'hsl(285, 100%, 17%)',
		l10: 'hsl(285, 100%, 13%)',
		l05: 'hsl(285, 100%, 10%)',
	},
};
*/

const accentColor = accentColors.blue.l65;

export const uiColors = {
	accent: accentColor,
	offWhite: 'hsl(200, 81%, 97%)',
	darkRed: 'hsl(0, 100%, 23%)',
	red: 'hsl(0, 100%, 48%)',
	lightRed: 'hsl(0, 100%, 90%)',
	enabled: {
		resting: {
			text: 'hsl(0, 0%, 5%)',
			lightText: 'hsl(0, 0%, 10%)',
			border: 'hsl(0, 0%, 75%)',
			fill: 'hsl(0, 0%, 39%)',
			background: 'hsl(0, 0%, 98%)',
		},
		restingLight: {
			text: 'hsl(0, 0%, 20%)',
			lightText: 'hsl(0, 0%, 30%)',
			border: 'hsla(0, 0%, 75%, 0.2)',
			fill: 'hsl(0, 0%, 39%, 0.4)',
			background: 'hsl(0, 0%, 98%)',
		},
		focus: {
			text: 'hsl(0, 0%, 0%)',
			lightText: 'hsl(0, 0%, 10%)',
			border: 'hsl(0, 0%, 63%)',
			fill: 'hsl(200, 25%, 15%)',
			background: 'white',
		},
		active: {
			text: 'hsl(0, 0%, 0%)',
			lightText: 'hsl(0, 0%, 10%)',
			border: 'hsl(0, 0%, 63%)',
			fill: accentColor,
			background: 'white',
		},
	},
	disabled: {
		text: 'hsl(0, 0%, 40%)',
		border: 'hsl(0, 0%, 82%)',
		fill: 'hsl(0, 0%, 82%)',
		background: 'hsl(0, 0%, 94%)',
	},
};
/* eslint-enable key-spacing */

// --------------------------------------------------------------
// Color Math
// --------------------------------------------------------------

/**
 * Convert a color string into an object
 * @param {String} c - color string
 * @returns {Object}
 */
export function parseColorString(c) {
	const val = { r: 0, g: 0, b: 0, a: 1 };

	if (typeof c !== 'string') return val;

	if (c.charAt(0) === '#') {
		c = c.substring(1, 7);
		val.r = parseInt(c.substring(0, 2), 16);
		val.g = parseInt(c.substring(2, 4), 16);
		val.b = parseInt(c.substring(4, 6), 16);
	} else if (c.substring(0, 4) === 'rgb(') {
		let cSplit = c.split('(')[1].split(')')[0].split(',');
		val.r = parseInt(cSplit[0], 10);
		val.g = parseInt(cSplit[1], 10);
		val.b = parseInt(cSplit[2], 10);
		val.a = parseInt(cSplit[3], 10) || 1;
	}

	return val;
}

/**
 * Converts an RGB color string to it's Hex format
 * @param {String} rgbString - color in rgb(0,0,0) format
 * @returns {String} color in #000000 format
 */
export function rgbToHex(rgbString) {
	let obj = parseColorString(rgbString);
	let r = obj.r.toString(16).toUpperCase();
	if (r.length === 1) r = `0${r}`;
	let g = obj.g.toString(16).toUpperCase();
	if (g.length === 1) g = `0${g}`;
	let b = obj.b.toString(16).toUpperCase();
	if (b.length === 1) b = `0${b}`;

	return `#${r}${g}${b}`;
}

/**
 * Takes a color string, then lightens or darkens that color
 * by a certain percentage
 * @param {String} c - color string
 * @param {Number} percent - amount to shift color
 * @param {Boolean} lighter - true = lighten, false = darken
 * @returns {String}
 */
export function shiftColor(c, percent, lighter) {
	percent = Math.max(0, Math.min(percent, 1));
	const val = parseColorString(c);

	val.r = Math.max(0, Math.min(val.r, 255));
	val.g = Math.max(0, Math.min(val.g, 255));
	val.b = Math.max(0, Math.min(val.b, 255));

	if (lighter) {
		val.r = round((255 - val.r) * percent + val.r);
		val.g = round((255 - val.g) * percent + val.g);
		val.b = round((255 - val.b) * percent + val.b);
	} else {
		val.r = round(val.r - val.r * percent);
		val.g = round(val.g - val.g * percent);
		val.b = round(val.b - val.b * percent);
	}

	return `rgb(${val.r},${val.g},${val.b})`;
}

/**
 * Converts an RGBA color to it's opaque RGB equivalent
 * @param {Object} rgb - color object in RGB
 * @param {Number} alpha - transparency
 * @returns {String}
 */
export function getColorFromRGBA(rgb, alpha) {
	// log(`getColorFromRGBA`, 'start');
	// log(`rgb: ${rgb}`);
	// log(`alpha: ${alpha}`);

	const val = parseColorString(rgb);
	// log(`val: ${val}`);

	const dr = round((255 - val.r) * (1 - alpha));
	const dg = round((255 - val.g) * (1 - alpha));
	const db = round((255 - val.b) * (1 - alpha));

	const r = val.r + dr;
	const g = val.g + dg;
	const b = val.b + db;

	const result = `rgb(${r},${g},${b})`;
	// log(`result: ${result}`);

	// log(`getColorFromRGBA`, 'end');
	return result;
}

/**
 * Converts Transparency to Alpha, invert and change scale
 * @param {String} transparency - 0=opaque, 100=transparent
 * @returns {Number}
 */
export function transparencyToAlpha(transparency) {
	// log(`transparencyToAlpha`, 'start');
	// log(`transparency: ${transparency}`);
	const t = parseInt(transparency);
	if (!t || isNaN(t)) return 1;
	// log(`t: ${t}`);

	if (t > 100) return 0;
	if (t < 0) return 1;

	const result = (100 - t) / 100;
	// log(`result: ${result}`);
	// log(`transparencyToAlpha`, 'end');
	return result;
}

/**
 * Makes a random fully saturated color
 * @returns {String}
 */
export function makeRandomSaturatedColor() {
	const sat = Math.floor(Math.random() * 5) * 51;
	const arr = [];
	const saturatedColorLocation = Math.floor(Math.random() * 3);
	arr[saturatedColorLocation] = sat;
	switch (saturatedColorLocation) {
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
	return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
}
