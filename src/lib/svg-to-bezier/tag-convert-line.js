import { roundAndSanitize } from './svg-to-bezier.js';

/**
 * Converts an SVG Line tag to Bezier Data Format
 * @param {object} tagData - Object with tag information
 * @returns {Array} - resulting path(s) in Bezier Data Format
 */
export function tagConvertLine(tagData) {
	let data = tagData.attributes || {};
	let x1 = roundAndSanitize(data.x1) || 0;
	let y1 = roundAndSanitize(data.y1) || 0;
	let x2 = roundAndSanitize(data.x2) || 0;
	let y2 = roundAndSanitize(data.y2) || 0;

	let bezierPath = [{ x: x1, y: y1 }, false, false, { x: x2, y: y2 }];

	return [bezierPath];
}
