import {
	chunkAndValidateParameters,
	roundAndSanitize,
	sanitizeParameterData,
} from './svg-to-bezier.js';

/**
 * Converts an SVG Polygon or Polyline tag to Bezier Data Format
 * @param {object} tagData - Object with tag information
 * @returns {Array} - resulting path(s) in Bezier Data Format
 */
export function tagConvertPolygonPolyline(tagData) {
	let bezierPath = [];

	let initialData = tagData?.attributes?.points;
	initialData = sanitizeParameterData(initialData);
	let data = chunkAndValidateParameters(initialData);

	// log('Polyline or Polygon data, cleaned & formatted:');
	// log(data);

	if (data.length > 4) {
		let previousX = Number(data[0]);
		let previousY = Number(data[1]);
		for (let i = 0; i < data.length; i += 2) {
			let px = Number(data[i]) || 0;
			let py = Number(data[i + 1]) || 0;
			bezierPath.push([
				{ x: roundAndSanitize(previousX), y: roundAndSanitize(previousY) },
				false,
				false,
				{ x: roundAndSanitize(px), y: roundAndSanitize(py) },
			]);
			previousX = px;
			previousY = py;
		}
	}

	return [bezierPath];
}
