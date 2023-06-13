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
	let Pt = { x: lx + hw, y: ty };
	let H1t = { x: lx + hwd, y: ty };
	let H2t = { x: rx - hwd, y: ty };

	// Second Point - Right
	let Pr = { x: rx, y: by + hh };
	let H1r = { x: rx, y: ty - hhd };
	let H2r = { x: rx, y: by + hhd };

	// Third Point - Bottom
	let Pb = { x: lx + hw, y: by };
	let H1b = { x: rx - hwd, y: by };
	let H2b = { x: lx + hwd, y: by };

	// Fourth Point - Left
	let Pl = { x: lx, y: by + hh };
	let H1l = { x: lx, y: by + hhd };
	let H2l = { x: lx, y: ty - hhd };

	let paths = [
		[Pt, H2t, H1r, Pr],
		[Pr, H2r, H1b, Pb],
		[Pb, H2b, H1l, Pl],
		[Pl, H2l, H1t, Pt],
	];

	return paths;
}
