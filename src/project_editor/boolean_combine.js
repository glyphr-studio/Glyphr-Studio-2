// @ts-ignore
import { combine as bezierCombine } from 'bezier-boolean';

import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outlines/svg_outline_import.js';
import { SVGtoBezier } from 'svg-to-bezier';


/**
 * Combines an array of paths using bezier-boolean
 * @param {Array} gsPaths - paths to combine
 * @param {String} operation - how to combine the paths
 * @returns {Array | String} - resulting paths
 */
export function combinePaths(gsPaths = [], operation = 'unite') {
	if (gsPaths.length === 0) return 'No paths were found to combine.';
	if (['divide', 'subtract', 'intersect', 'unite', 'exclude'].indexOf(operation) < 0) {
		return `Unknown combine operation: ${operation}`;
	}

	// Convert Glyphr Studio paths to bezier-boolean BezierLoops
	const bezierLoops = gsPaths.map(gsPath => convertToBezierLoop(gsPath)).filter(Boolean);

	if (bezierLoops.length === 0) return 'No valid paths to combine.';

	// For subtract, bezier-boolean expects [subject, ...cutters]
	let resultLoops;
	if (operation === 'subtract' && bezierLoops.length > 1) {
		const subject = bezierLoops[0];
		const cutters = bezierLoops.slice(1);
		resultLoops = bezierCombine([subject, ...cutters], 'subtract');
	} else {
		resultLoops = bezierCombine(bezierLoops, operation);
	}

	// Convert result BezierLoops back to Glyphr Studio paths
	let newGSPaths = [];
	resultLoops.forEach(loop => {
		const svgPath = bezierLoopToSVGPath(loop);
		const gsFromSVG = ioSVG_convertSVGTagsToGlyph(`<svg><path d="${svgPath}"></path></svg>`, false);
		if (gsFromSVG.shapes && gsFromSVG.shapes.length) {
			newGSPaths = newGSPaths.concat(gsFromSVG.shapes);
		}
	});
	return newGSPaths;
}





// --------------------------------------------------------------
// Conversion Functions for bezier-boolean
// --------------------------------------------------------------

/**
 * Converts a Glyphr Studio path to a bezier-boolean BezierLoop
 * @param {Object} gsPath - the Glyphr Studio Path to convert
 * @returns {Array|null} - BezierLoop or null
 */
function convertToBezierLoop(gsPath) {
	if (!gsPath || !gsPath.svgPathData) return null;
	try {
		// svg-to-bezier expects a full SVG string
		const bezierData = SVGtoBezier(`<svg><path d="${gsPath.svgPathData}"></path></svg>`);
		if (Array.isArray(bezierData) && bezierData.length > 0) {
			return bezierData[0]; // Each path is an array of loops; take the first
		}
	} catch (e) {
		// Optionally log error
	}
	return null;
}

/**
 * Converts a bezier-boolean BezierLoop to SVG path data string
 * @param {Array} loop - BezierLoop
 * @returns {String} - SVG path data
 */
function bezierLoopToSVGPath(loop) {
	if (!Array.isArray(loop) || loop.length === 0) return '';
	let d = '';
	loop.forEach((seg, i) => {
		const [p1, cp1, cp2, p2] = seg;
		if (i === 0) {
			d += `M${p1.x},${p1.y}`;
		}
		if (cp1 === false && cp2 === false) {
			d += `L${p2.x},${p2.y}`;
		} else {
			d += `C${cp1.x},${cp1.y},${cp2.x},${cp2.y},${p2.x},${p2.y}`;
		}
	});
	d += 'Z';
	return d;
}
