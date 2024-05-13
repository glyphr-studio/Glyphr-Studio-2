import { roundAndSanitize } from './svg-to-bezier.js';

/**
 * Converts a curve in Arc notation to Cubic Bezier Curve notation.
 * This is recursive, as it may take more than one Bezier curve to describe
 * a single Arc.
 * 		Check this for more math
 * 		http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
 *
 * @param {number} startX - starting point X value
 * @param {number} startY - starting point Y value
 * @param {number} radiusX - arc radius in the X direction
 * @param {number} radiusY - arc radius in the Y direction
 * @param {number} rotationDegrees - rotation of the ellipse in degrees
 * @param {boolean} largeArcFlag - is the ellipse sweep greater than 180 degrees
 * @param {boolean} sweepFlag - arc sweep is clockwise
 * @param {number} endX - ending point X value
 * @param {number} endY - ending point Y value
 * @param {object} subPath - for recursion, where it takes multiple Bezier curves
 * 								to describe a single Arc
 */
export function convertArcToCommandToBezier(
	startX,
	startY,
	radiusX,
	radiusY,
	rotationDegrees,
	largeArcFlag,
	sweepFlag,
	endX,
	endY,
	subPath
) {
	let startPoint = { x: startX, y: startY };
	let endPoint = { x: endX, y: endY };

	// Short circuit for straight-line edge cases
	if ((startX === endX && startY === endY) || !radiusX || !radiusY) {
		return [startPoint.x, startPoint.y, endPoint.x, endPoint.y, endPoint.x, endPoint.y];
	}

	let rotationRadians = rad(rotationDegrees);
	largeArcFlag = !!largeArcFlag;
	sweepFlag = !!sweepFlag;

	// Get the ellipse in centerpoint notation
	let center = {};
	let angleStart;
	let angleEnd;

	if (subPath) {
		angleStart = subPath[0];
		angleEnd = subPath[1];
		center = {
			x: subPath[2],
			y: subPath[3],
		};
	} else {
		// Reverse rotate so we're working with an un-rotated ellipse
		startPoint = rotate(startPoint, rotationRadians * -1);
		endPoint = rotate(endPoint, rotationRadians * -1);

		// Ensure the start point + radii can reach the end point
		// Scale the radii if they don't reach
		let halfWidth = (startPoint.x - endPoint.x) / 2;
		let halfHeight = (startPoint.y - endPoint.y) / 2;
		let halfHeightSquared = halfHeight * halfHeight;
		let halfWidthSquared = halfWidth * halfWidth;
		let hyp = halfWidthSquared / (radiusX * radiusX) + halfHeightSquared / (radiusY * radiusY);

		if (hyp > 1) {
			hyp = Math.sqrt(hyp);
			radiusX *= hyp;
			radiusY *= hyp;
		}

		// Convert Endpoint Notation to Centerpoint Notation
		let radiusXSquared = radiusX * radiusX;
		let radiusYSquared = radiusY * radiusY;
		let sign = largeArcFlag === sweepFlag ? -1 : 1;
		sign *= Math.sqrt(
			Math.abs(
				(radiusXSquared * radiusYSquared -
					radiusXSquared * halfHeightSquared -
					radiusYSquared * halfWidthSquared) /
					(radiusXSquared * halfHeightSquared + radiusYSquared * halfWidthSquared)
			)
		);

		center.x = (sign * radiusX * halfHeight) / radiusY + (startPoint.x + endPoint.x) / 2;
		center.y = (sign * -1 * radiusY * halfWidth) / radiusX + (startPoint.y + endPoint.y) / 2;
		angleStart = Math.asin((startPoint.y - center.y) / radiusY);
		angleEnd = Math.asin((endPoint.y - center.y) / radiusY);

		angleStart = startPoint.x < center.x ? Math.PI - angleStart : angleStart;
		angleEnd = endPoint.x < center.x ? Math.PI - angleEnd : angleEnd;

		let twoPI = Math.PI * 2;
		if (angleStart < 0) angleStart = twoPI + angleStart;
		if (angleEnd < 0) angleEnd = twoPI + angleEnd;
		if (sweepFlag && angleStart > angleEnd) angleStart = angleStart - twoPI;
		if (!sweepFlag && angleEnd > angleStart) angleEnd = angleEnd - twoPI;
	}

	// Check to see if we need to break this path into subpaths
	// to accurately convert to a bezier
	let angleDelta = angleEnd - angleStart;
	let result = [];
	let threshold = (Math.PI * 120) / 180;

	if (Math.abs(angleDelta) > threshold) {
		let angleEndOld = angleEnd;
		let endPointXOld = endPoint.x;
		let endPointYOld = endPoint.y;
		angleEnd = angleStart + threshold * (sweepFlag && angleEnd > angleStart ? 1 : -1);
		endPoint.x = center.x + radiusX * Math.cos(angleEnd);
		endPoint.y = center.y + radiusY * Math.sin(angleEnd);
		result = convertArcToCommandToBezier(
			endPoint.x,
			endPoint.y,
			radiusX,
			radiusY,
			rotationDegrees,
			0,
			sweepFlag,
			endPointXOld,
			endPointYOld,
			[angleEnd, angleEndOld, center.x, center.y]
		);
	}

	// Convert the result back to Endpoint Notation
	let tempPointOne = {
		x: Math.cos(angleStart),
		y: Math.sin(angleStart),
	};

	let tempPointTwo = {
		x: Math.cos(angleEnd),
		y: Math.sin(angleEnd),
	};

	angleDelta = angleEnd - angleStart;
	let multiplier = (Math.tan(angleDelta / 4) * 4) / 3;

	// Compute Bezier Points
	let p1 = { x: startPoint.x, y: startPoint.y };

	let p2 = {
		x: startPoint.x + radiusX * multiplier * tempPointOne.y,
		y: startPoint.y - radiusY * multiplier * tempPointOne.x,
	};
	p2.x = 2 * p1.x - p2.x;
	p2.y = 2 * p1.y - p2.y;

	let p3 = {
		x: endPoint.x + radiusX * multiplier * tempPointTwo.y,
		y: endPoint.y - radiusY * multiplier * tempPointTwo.x,
	};

	let p4 = { x: endPoint.x, y: endPoint.y };

	result = [p2.x, p2.y, p3.x, p3.y, p4.x, p4.y].concat(result);

	if (subPath) {
		return result;
	} else {
		let finalResult = [];

		// Rotate the bezier points back to their original rotated angle
		for (let i = 0; i < result.length; i++) {
			if (i % 2) {
				finalResult[i] = rotate({ x: result[i - 1], y: result[i] }, rotationRadians).y;
			} else {
				finalResult[i] = rotate({ x: result[i], y: result[i + 1] }, rotationRadians).x;
			}
			finalResult[i] = roundAndSanitize(finalResult[i]);
		}

		return finalResult;
	}
}

/*
 * Helper Functions
 */

/**
 * Converts degrees to radians
 * 0rad = 0deg, PIrad = 180deg
 * @param {Number} deg - degrees in 360 format
 * @returns {Number} - degrees in radians
 */
function rad(deg) {
	return deg * (Math.PI / 180);
}

/**
 * Rotates a point a certain number of degrees around another point
 * @param {Object} point - x/y point to rotate
 * @param {Number} deltaRad - Angle to rotate in radians
 * @param {Object} about - x/y point to rotate around (default is 0,0)
 * @returns {Object} - x/y point
 */
function rotate(point, deltaRad, about) {
	if (!point) return;
	if (deltaRad === 0) return point;

	about = about || {};
	about.x = about.x || 0;
	about.y = about.y || 0;

	const newPoint = { x: 0, y: 0 };
	newPoint.x =
		Math.cos(deltaRad) * (point.x - about.x) - Math.sin(deltaRad) * (point.y - about.y) + about.x;
	newPoint.y =
		Math.sin(deltaRad) * (point.x - about.x) + Math.cos(deltaRad) * (point.y - about.y) + about.y;

	return newPoint;
}
