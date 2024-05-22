import { roundAndSanitize } from './svg-to-bezier.js';

/**
 * Converts an SVG Circle or Ellipse tags to Bezier Data Format
 * @param {object} tagData - Object with tag information
 * @returns {Array} - resulting path(s) in Bezier Data Format
 */
export function tagConvertCircleEllipse(tagData) {
	let bezierPath = [];
	let data = tagData?.attributes || {};

	let rx = Number(data.r) || Number(data.rx) || 100;
	rx = Math.abs(rx);
	let ry = Number(data.r) || Number(data.ry) || 100;
	ry = Math.abs(ry);
	let cx = Number(data.cx) || 0;
	let cy = Number(data.cy) || 0;

	if (!(rx === 0 && ry === 0)) {
		let ellipseMaxes = {
			xMin: cx - rx,
			xMax: cx + rx,
			yMin: cy - ry,
			yMax: cy + ry,
		};

		bezierPath = ovalPathFromMaxes(ellipseMaxes);
	}

	return [bezierPath];
}

function ovalPathFromMaxes(maxes) {
	let lx = maxes.xMin;
	let ty = maxes.yMax;
	let rx = maxes.xMax;
	let by = maxes.yMin;

	let hw = (rx - lx) / 2;
	let hh = (ty - by) / 2;
	let hwd = hw * 0.448;
	let hhd = hh * 0.448;

	/*
		This is "Glyphr Studio Notation" 
		with an on-path point surrounded by two control points.
		P = Point
		H1 = Control point 'before' the point
		H2 = Control point 'after' the point
	*/

	// First Point - Top
	let Pt = { x: roundAndSanitize(lx + hw), y: roundAndSanitize(ty) };
	let H1t = { x: roundAndSanitize(lx + hwd), y: roundAndSanitize(ty) };
	let H2t = { x: roundAndSanitize(rx - hwd), y: roundAndSanitize(ty) };

	// Second Point - Right
	let Pr = { x: roundAndSanitize(rx), y: roundAndSanitize(by + hh) };
	let H1r = { x: roundAndSanitize(rx), y: roundAndSanitize(ty - hhd) };
	let H2r = { x: roundAndSanitize(rx), y: roundAndSanitize(by + hhd) };

	// Third Point - Bottom
	let Pb = { x: roundAndSanitize(lx + hw), y: roundAndSanitize(by) };
	let H1b = { x: roundAndSanitize(rx - hwd), y: roundAndSanitize(by) };
	let H2b = { x: roundAndSanitize(lx + hwd), y: roundAndSanitize(by) };

	// Fourth Point - Left
	let Pl = { x: roundAndSanitize(lx), y: roundAndSanitize(by + hh) };
	let H1l = { x: roundAndSanitize(lx), y: roundAndSanitize(by + hhd) };
	let H2l = { x: roundAndSanitize(lx), y: roundAndSanitize(ty - hhd) };

	let paths = [
		[Pt, H2t, H1r, Pr],
		[Pr, H2r, H1b, Pb],
		[Pb, H2b, H1l, Pl],
		[Pl, H2l, H1t, Pt],
	];

	return paths;
}
