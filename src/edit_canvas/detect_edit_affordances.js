import { pointsAreEqual } from '../common/functions';
import { canvasUIPointSize } from './draw_edit_affordances';

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Glyph or ComponentInstance} item - what Glyph, Ligature, ComponentInstance, or Component to check
 * @param {Number} x - x to check
 * @param {Number} y - y to check
 * @param {Boolean} noHandles - only check for Path Points, not Handles
 * @returns {Boolean}
 */
export function isOverControlPoint(item, x, y, noHandles) {
	// log(`isOverControlPoint`, 'start');
	// log(item);
	let result = false;
	if (item.objType === 'Glyph') result = isOverGlyphControlPoint(item, x, y, noHandles);
	if (item.objType === 'VirtualGlyph') result = isOverGlyphControlPoint(item, x, y, noHandles);
	if (item.objType === 'Path') result = isOverPathControlPoint(item, x, y, noHandles);
	if (item.objType === 'PathPoint') result = isOverPathPointControlPoint(item, x, y, noHandles);
	// log(`result: ${result}`);
	// log(`isOverControlPoint`, 'end');
	return result;
}

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Glyph} glyph - what glyph to check
 * @param {Number} x - x to check
 * @param {Number} y - y to check
 * @param {Boolean} noHandles - only check for Path Points, not Handles
 * @returns {Boolean}
 */
function isOverGlyphControlPoint(glyph, x, y, noHandles) {
	// log(`isOverGlyphControlPoint`, 'start');

	let re = false;
	for (let s = 0; s < glyph.shapes.length; s++) {
		if (glyph.shapes[s].objType !== 'ComponentInstance') {
			re = isOverPathControlPoint(glyph.shapes[s], x, y, noHandles);
			if (re) {
				// log(`isOverGlyphControlPoint - returning path#${s}`);
				// log(`isOverGlyphControlPoint`, 'end');
				return re;
			}
		}
	}
	// log(`returning false`);
	// log(`isOverGlyphControlPoint`, 'end');
	return false;
}

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Path} path - what Path to check
 * @param {Number} x - x to check
 * @param {Number} y - y to check
 * @param {Boolean} noHandles - only check for Path Points, not Handles
 * @returns {Boolean}
 */
function isOverPathControlPoint(path, x, y, noHandles) {
	// log(`isOverPathControlPoint`, 'start');
	// log(path);
	let pp = path.pathPoints || [];
	let re = false;

	for (let k = pp.length - 1; k >= 0; k--) {
		re = isOverPathPointControlPoint(pp[k], x, y, noHandles);
		if (re) {
			return re;
		}
	}

	// log(`returning false`);
	// log(`isOverPathControlPoint`, 'end');
	return false;
}

/**
 * Specifically checks to see if x/y is over the 1st point in the path
 * @param {Path} path - what Path to check
 * @param {Number} x - x to check
 * @param {Number} y - y to check
 * @returns {Boolean}
 */
export function isOverFirstPoint(path, x, y) {
	let pp = path.pathPoints[0];
	if (!pp) return false;
	return pointsAreEqual({ x: x, y: y }, pp.p.coord, canvasUIPointSize);
}

/**
 * Checks to see if there is a control point where the mouse is (Point, H1 or H2)
 * @param {PathPoint} pathPoint - Which PathPoint to check
 * @param {Number} x - mouse x position
 * @param {Number} y - mouse y position
 * @param {Boolean} noHandles - Eliminates checking for handles in multi-select situations
 * @returns {Object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
 */
function isOverPathPointControlPoint(pathPoint, x = 0, y = 0, noHandles = false) {
	const targetSize = canvasUIPointSize;
	const test = { x: x, y: y };
	if (pointsAreEqual(pathPoint.p, test, targetSize)) {
		// log(`isOverPathPointControlPoint - Returning p`);
		return pathPoint.p;
	}

	if (pathPoint.h1.use && !noHandles) {
		if (pointsAreEqual(pathPoint.h1, test, targetSize)) {
			// log(`isOverPathPointControlPoint - Returning h1`);
			return pathPoint.h1;
		}
	}

	if (pathPoint.h2.use && !noHandles) {
		if (pointsAreEqual(pathPoint.h2, test, targetSize)) {
			// log(`isOverPathPointControlPoint - Returning h2`);
			return pathPoint.h2;
		}
	}

	return false;
}
