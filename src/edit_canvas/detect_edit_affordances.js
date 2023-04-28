import { pointsAreEqual } from '../common/functions';
import { canvasUIPointSize } from './draw_edit_affordances';

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Glyph or ComponentInstance} item - what Glyph, Ligature, ComponentInstance, or Component to check
 * @param {number} x - x to check
 * @param {number} y - y to check
 * @param {boolean} noHandles - only check for Path Points, not Handles
 * @returns {boolean}
 */
export function isOverControlPoint(item, x, y, noHandles) {
	if (item.objType === 'Glyph') return isOverGlyphControlPoint(item, x, y, noHandles);
	if (item.objType === 'Path') return isOverPathControlPoint(item, x, y, noHandles);
	if (item.objType === 'PathPoint') return isOverPathPointControlPoint(item, x, y, noHandles);
	return false;
}

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Glyph} glyph - what glyph to check
 * @param {number} x - x to check
 * @param {number} y - y to check
 * @param {boolean} noHandles - only check for Path Points, not Handles
 * @returns {boolean}
 */
function isOverGlyphControlPoint(glyph, x, y, noHandles) {
	let re = false;
	for (let s = 0; s < glyph.shapes.length; s++) {
		if (glyph.shapes[s].objType !== 'ComponentInstance') {
			re = isOverPathControlPoint(glyph.shapes[s], x, y, noHandles);
			if (re) {
				// log(`isOverGlyphControlPoint - returning path#${s}`);
				return re;
			}
		}
	}
	return false;
}

/**
 * Checks to see if the cursor is over a control point, for cursor hover effect
 * @param {Path} path - what Path to check
 * @param {number} x - x to check
 * @param {number} y - y to check
 * @param {boolean} noHandles - only check for Path Points, not Handles
 * @returns {boolean}
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
 * @param {number} x - x to check
 * @param {number} y - y to check
 * @returns {boolean}
 */
export function isOverFirstPoint(path, x, y) {
	let pp = path.pathPoints[0];
	if (!pp) return false;
	return pointsAreEqual({ x: x, y: y }, pp.p.coord, canvasUIPointSize);
}

/**
 * Checks to see if there is a control point where the mouse is (Point, H1 or H2)
 * @param {PathPoint} pathPoint - Which PathPoint to check
 * @param {number} x - mouse x position
 * @param {number} y - mouse y position
 * @param {boolean} noHandles - Eliminates checking for handles in multi-select situations
 * @returns {object} - 'type' = h1/h2/p, 'point' = reference to this PathPoint
 */
function isOverPathPointControlPoint(pathPoint, x = 0, y = 0, noHandles = false) {
	//TODO browser zoom messes with visible handle size
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
