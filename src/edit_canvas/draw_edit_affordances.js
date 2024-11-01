import { getCurrentProjectEditor } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import {
	calculateAngle,
	calculateLength,
	makeCrisp,
	radiansToNiceAngle,
	rotate,
	round,
	snapRadiansToDegrees,
} from '../common/functions.js';
import { drawShape } from '../display_canvas/draw_paths.js';
import { ControlPoint } from '../project_data/control_point.js';
import { Maxes } from '../project_data/maxes.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { cXsX, cYsY, sXcX, sYcY } from './edit_canvas.js';
import { eventHandlerData } from './events.js';
import { canResize } from './events_mouse.js';

// --------------------------------------------------------------
// Common size stuff
// --------------------------------------------------------------

export let canvasUIPointSize = 7;
let rotateHandleHeight = 40;
let accentBlue = accentColors.blue.l65;
let accentGreen = accentColors.green.l65;
let accentGray = accentColors.gray.l65;
let pathFill = '#000';
let pointFill = '#FFF';
let multiSelectThickness = 3;

// --------------------------------------------------------------
// Compute and Draw functions
// --------------------------------------------------------------

/**
 * Gets the bounding box for the currently selected shape(s)
 * and draws the bounding box for it (but no affordances).
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @returns nothing
 */
export function computeAndDrawBoundingBox(ctx) {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;
	if (msShapes.length < 1) return;
	let maxes = msShapes.maxes;
	let style = computeSelectionStyle();
	drawBoundingBox(ctx, maxes, style.thickness, style.accent);
}

/**
 * Draws the little circle handle affordance for rotating.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @returns nothing
 */
export function computeAndDrawRotationAffordance(ctx) {
	// log(`computeAndDrawRotationAffordance`, 'start');
	let style = computeSelectionStyle();
	drawRotationAffordance(ctx, style.accent, style.thickness);
	// log(`computeAndDrawRotationAffordance`, 'end');
}

/**
 * Draws the resize handle squares around the bounding box.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @returns nothing
 */
export function computeAndDrawBoundingBoxHandles(ctx) {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;
	if (msShapes.length < 1) return;
	let maxes = msShapes.maxes;
	let style = computeSelectionStyle();
	drawBoundingBoxHandles(ctx, maxes, style.thickness, style.accent);
}

/**
 * Chooses the right selection style based on the objects
 * that are currently selected.
 * @returns {Object} - with thickness and accent color
 */
function computeSelectionStyle() {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;
	let thickness = 1;
	let accent = accentBlue;
	if (msShapes.length > 1) {
		thickness = multiSelectThickness;
		accent = accentGray;
	} else {
		if (msShapes.singleton.objType === 'ComponentInstance') {
			accent = accentGreen;
		}
	}
	return { thickness: thickness, accent: accent };
}

// --------------------------------------------------------------
// Bounding Box
// --------------------------------------------------------------

/**
 * Draws a bounding box for selected stuff
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object | Maxes} maxes - dimensions to draw
 * @param {Number =} thickness - how thick the box line should be
 * @param {String =} accent - color for the box
 */
export function drawBoundingBox(ctx, maxes, thickness, accent) {
	// log(`drawBoundingBox`, 'start');
	// log(`maxes.center.x: ${maxes.center.x}`);
	// log(`maxes.center.y: ${maxes.center.y}`);
	// log(`thickness: ${thickness}`);
	// log(maxes);

	const bb = getBoundingBoxAndHandleDimensions(maxes, thickness);

	let w = bb.rightX - bb.leftX;
	let h = bb.topY - bb.bottomY;

	ctx.fillStyle = 'transparent';
	ctx.strokeStyle = accent || computeSelectionStyle().accent;
	ctx.lineWidth = thickness || 1;
	ctx.strokeRect(bb.leftX, bb.bottomY, w, h);
	// log(`drawBoundingBox`, 'end');
}

/**
 * Draws resize handle boxes around the bounding box
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object | Maxes} maxes - dimensions to draw
 * @param {Number} thickness - how thick the box line should be
 * @param {String} accent - color for the box
 */
function drawBoundingBoxHandles(ctx, maxes, thickness, accent) {
	// log(`drawBoundingBoxHandles`, 'start');
	let bb = getBoundingBoxAndHandleDimensions(maxes, thickness);
	ctx.fillStyle = pointFill;
	ctx.lineWidth = 1;
	ctx.strokeStyle = accent;

	const msShapes = getCurrentProjectEditor().multiSelect.shapes;
	if (msShapes.isRotatable()) {
		const halfPointSize = canvasUIPointSize / 2;
		ctx.lineWidth = thickness;
		drawLine(
			ctx,
			{ x: bb.midX + 1, y: bb.topY },
			{ x: bb.midX + 1, y: bb.topY - rotateHandleHeight }
		);
		ctx.lineWidth = 1;
		drawCircleHandle(ctx, {
			x: bb.midX + 1,
			y: bb.topY - rotateHandleHeight + halfPointSize,
		});
	}

	//upper left
	if (canResize('nw')) drawSquareHandle(ctx, bb.nw);
	//top
	if (canResize('n')) drawSquareHandle(ctx, bb.n);
	//upper right
	if (canResize('ne')) drawSquareHandle(ctx, bb.ne);
	// right
	if (canResize('e')) drawSquareHandle(ctx, bb.e);
	// baseline right
	if (canResize('be')) drawSquareHandle(ctx, bb.be);
	//lower right
	if (canResize('se')) drawSquareHandle(ctx, bb.se);
	//bottom
	if (canResize('s')) drawSquareHandle(ctx, bb.s);
	//lower left
	if (canResize('sw')) drawSquareHandle(ctx, bb.sw);
	//baseline left
	if (canResize('bw')) drawSquareHandle(ctx, bb.bw);
	//left
	if (canResize('w')) drawSquareHandle(ctx, bb.w);
	// //Center Dot
	// ctx.fillRect(bb.midX, bb.midY, ps, ps);
	// ctx.strokeRect(bb.midX, bb.midY, ps, ps);
	// log(`drawBoundingBoxHandles`, 'end');
}

/**
 * Draws the rotation affordance, a short handle with a circle
 * above the bounding box.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {String} accent - color for the handle
 * @param {Number} thickness - how thick the line should be
 */
function drawRotationAffordance(ctx, accent = accentBlue, thickness = 1) {
	// log(`drawRotationAffordance`, 'start');
	// const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	// log(`accent: ${accent}`);
	// log(`thickness: ${thickness}`);

	let center = ehd.rotationStartCenter;
	// log(`center.x: ${center.x}`);
	// log(`center.y: ${center.y}`);

	let startTopY = ehd.rotationStartMaxesTopY;
	// log(`startTopY: ${startTopY}`);

	let mx = ehd.mousePosition.x;
	// log(`mx: ${mx}`);
	let my = ehd.mousePosition.y;
	// log(`my: ${my}`);

	let radians = calculateAngle({ x: cXsX(mx), y: cYsY(my) }, center);
	// log(`radians: ${radians}`);

	let snap = ehd.isShiftDown;
	if (snap) radians = snapRadiansToDegrees(radians);
	let rotateHandle = { x: center.x, y: startTopY };
	rotate(rotateHandle, radians, center);
	rotate(rotateHandle, Math.PI / -2, center);
	// log(`drag angle: ${round(radians, 2)}`);

	let counterclockwise = false;
	if (Math.abs(radians) > Math.PI / 2) {
		counterclockwise = true;
	}

	// Convert things to Canvas System
	let canvasHandle = {
		x: sXcX(rotateHandle.x),
		y: sYcY(rotateHandle.y),
	};
	let canvasCenter = {
		x: sXcX(center.x),
		y: sYcY(center.y),
	};
	startTopY = sYcY(startTopY);
	let radius = calculateLength(canvasCenter, canvasHandle);

	// Pizza Pie Sweep
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(canvasCenter.x, canvasCenter.y);
	ctx.arc(canvasCenter.x, canvasCenter.y, radius, Math.PI / -2, radians * -1, counterclockwise);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// rotate Handle
	ctx.strokeStyle = accent;
	ctx.fillStyle = pointFill;
	ctx.lineWidth = thickness;
	drawLine(ctx, { x: canvasHandle.x, y: canvasHandle.y }, { x: canvasCenter.x, y: canvasCenter.y });
	ctx.lineWidth = 1;
	drawCircleHandle(ctx, canvasHandle);

	// readout
	let readout = round(radiansToNiceAngle(radians), 1);
	if (counterclockwise) readout -= 360;
	readout = round(readout, 1);
	// log(`readout: ${readout}`);

	ctx.font = '24px FiraGo, "Open Sans", sans-serif';
	ctx.fillStyle = accent;
	ctx.globalAlpha = 0.8;
	ctx.fillText('' + readout + '°', canvasCenter.x, startTopY - 24);

	ctx.globalAlpha = 1;
	// log(`drawRotationAffordance`, 'end');
}

/**
 * Hit / Hover detection for resize handles
 * @param {Number} px - x location to check
 * @param {Number} py - y location to check
 * @param {Object | Maxes} maxes - location of the bounding box
 * @returns {String | false} - letter representing the compass location of the hovered handle
 */
export function isOverBoundingBoxHandle(px, py, maxes) {
	// log(`isOverBoundingBoxHandle`, 'start');
	// log('\t px/py - ' + px + ' / ' + py);
	// log('\t maxes - ' + json(maxes, true));

	if (!maxes) {
		// log(`no maxes, returning false`);
		// log(`isOverBoundingBoxHandle`, 'end');
		return false;
	}

	const editor = getCurrentProjectEditor();
	let re = '';
	let ps = canvasUIPointSize;
	let bb = getBoundingBoxAndHandleDimensions(maxes);

	// log('\t point size - ' + ps);
	// log('\t l/m/r x: ' + bb.leftX + ' / ' + bb.midX + ' / ' + bb.rightX);
	// log('\t t/m/b y: ' + bb.topY + ' / ' + bb.midY + ' / ' + bb.bottomY);

	// rotation handle
	if (editor.multiSelect.shapes.isRotatable()) {
		if (
			px > bb.midX &&
			px < bb.midX + ps &&
			py > bb.topY - rotateHandleHeight &&
			py < bb.topY - rotateHandleHeight + ps
		) {
			re = 'rotate';
		}
	}

	// upper left
	if (px > bb.nw.x && px < bb.nw.x + ps && py > bb.nw.y && py < bb.nw.y + ps) {
		re = 'nw';
	}

	// top
	if (px > bb.n.x && px < bb.n.x + ps && py > bb.n.y && py < bb.n.y + ps) {
		re = 'n';
	}

	// upper right
	if (px > bb.ne.x && px < bb.ne.x + ps && py > bb.ne.y && py < bb.ne.y + ps) {
		re = 'ne';
	}

	// right
	if (px > bb.e.x && px < bb.e.x + ps && py > bb.e.y && py < bb.e.y + ps) {
		re = 'e';
	}

	// baseline right
	if (px > bb.be.x && px < bb.be.x + ps && py > bb.be.y && py < bb.be.y + ps) {
		re = 'be';
	}

	// lower right
	if (px > bb.se.x && px < bb.se.x + ps && py > bb.se.y && py < bb.se.y + ps) {
		re = 'se';
	}

	// bottom
	if (px > bb.s.x && px < bb.s.x + ps && py > bb.s.y && py < bb.s.y + ps) {
		re = 's';
	}

	// lower left
	if (px > bb.sw.x && px < bb.sw.x + ps && py > bb.sw.y && py < bb.sw.y + ps) {
		re = 'sw';
	}

	// baseline left
	if (px > bb.bw.x && px < bb.bw.x + ps && py > bb.bw.y && py < bb.bw.y + ps) {
		re = 'bw';
	}

	// left
	if (px > bb.w.x && px < bb.w.x + ps && py > bb.w.y && py < bb.w.y + ps) {
		re = 'w';
	}

	// log(`re: ${re}`);

	// log(`isOverBoundingBoxHandle`, 'end');
	return re;
}

/**
 * Does a bunch of math, given a bounding box, to calculate all the
 * dimensions for each resize handle.
 * @param {Object | Maxes} maxes - location of the bounding box
 * @param {Number =} thickness - thickness of the bounding box
 * @returns {Object} - container for a bunch of metrics for all of the resize handles
 */
function getBoundingBoxAndHandleDimensions(maxes, thickness = 1) {
	const pt = canvasUIPointSize;
	const hp = canvasUIPointSize / 2;
	const pad = 1;

	// Translation Fidelity - converting passed canvas values to saved value system
	let leftX = sXcX(maxes.xMin);
	let midX = round(sXcX(maxes.xMin) + (sXcX(maxes.xMax) - sXcX(maxes.xMin)) / 2);
	let rightX = sXcX(maxes.xMax);
	let topY = sYcY(maxes.yMax);
	let baselineY = sYcY(0);
	let midY = round(sYcY(maxes.yMax) + (sYcY(maxes.yMin) - sYcY(maxes.yMax)) / 2);
	let bottomY = sYcY(maxes.yMin);

	if (thickness > 1) {
		leftX -= thickness;
		rightX += thickness;
		topY -= thickness;
		bottomY += thickness;
	}

	leftX = makeCrisp(leftX, false) - pad;
	midX = makeCrisp(midX, false);
	rightX = makeCrisp(rightX, true) + pad;
	topY = makeCrisp(topY, false) - pad;
	midY = makeCrisp(midY, false);
	bottomY = makeCrisp(bottomY, true) + pad;

	let result = {
		leftX: leftX,
		midX: midX,
		rightX: rightX,
		topY: topY,
		midY: midY,
		bottomY: bottomY,
		nw: { x: leftX - pt, y: topY - pt },
		n: { x: makeCrisp(midX - hp) + pad, y: topY - pt },
		ne: { x: rightX, y: topY - pt },
		e: { x: rightX, y: makeCrisp(midY - hp) + pad },
		be: { x: rightX, y: makeCrisp(baselineY - hp) + pad },
		se: { x: rightX, y: bottomY },
		s: { x: makeCrisp(midX - hp) + pad, y: bottomY },
		sw: { x: leftX - pt, y: bottomY },
		bw: { x: leftX - pt, y: makeCrisp(baselineY - hp) + pad },
		w: { x: leftX - pt, y: makeCrisp(midY - hp) + pad },
	};

	return result;
}

// --------------------------------------------------------------
// Paths
// --------------------------------------------------------------

/**
 * For the selected path, draw the outline in an accent color.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object} view - view object (dx, dy, dz)
 */
export function drawSelectedPathOutline(ctx, view) {
	// log(`drawSelectedPathOutline`, 'start');
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;
	let selected = msShapes.members.length;
	// log(`selected: ${selected}`);
	let style = computeSelectionStyle();

	if (selected > 0) {
		ctx.beginPath();
		msShapes.drawShapes(ctx, view);
		ctx.closePath();

		ctx.strokeStyle = style.accent;
		ctx.lineWidth = style.thickness;
		ctx.stroke();
	}

	// log(`drawSelectedPathOutline`, 'end');
}

/**
 * Special case draw the 'new basic path' - this is in the process
 * of being created, but not really a path in the project just yet.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Path | Object} path - path to draw
 * @param {Object} view - view object (dx, dy, dz)
 */
export function drawNewBasicPath(ctx, path, view) {
	ctx.beginPath();
	drawShape(path, ctx, view);
	ctx.closePath();

	ctx.fillStyle = pathFill;
	ctx.fill();
	ctx.strokeStyle = accentBlue;
	ctx.stroke();

	drawBoundingBox(ctx, path.maxes);
}

// --------------------------------------------------------------
// Simple drawings
// --------------------------------------------------------------

/**
 * Draws a line.
 * Set stroke styles before this.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object} p1 - x/y point
 * @param {Object} p2 - x/y point
 */
function drawLine(ctx, p1, p2) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
}

/**
 * Draws a resize handle.
 * Set stroke and fill styles before this.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object} ul - x/y point for the upper left of the handle
 */
function drawSquareHandle(ctx, ul) {
	ctx.fillRect(ul.x, ul.y, canvasUIPointSize, canvasUIPointSize);
	ctx.strokeRect(ul.x, ul.y, canvasUIPointSize, canvasUIPointSize);
}

/**
 * Draws a circle handle.
 * Set stroke and fill styles before this.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Object} center - x/y point
 */
function drawCircleHandle(ctx, center) {
	// log(`drawCircleHandle`, 'start');
	// log(`center.x: ${center.x}`);
	// log(`center.y: ${center.y}`);
	ctx.beginPath();
	ctx.arc(center.x, center.y, canvasUIPointSize / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	// log(`drawCircleHandle`, 'end');
}

// --------------------------------------------------------------
// Paths and PathPoints
// --------------------------------------------------------------

/**
 * Figures out how to draw path point handles for the currently
 * selected path point(s) and draws them.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 */
export function computeAndDrawPathPointHandles(ctx) {
	const editor = getCurrentProjectEditor();
	// let points = editor.multiSelect.points;
	let msShapes = editor.multiSelect.shapes.members;

	msShapes.forEach((shape) => {
		if (shape.objType === 'ComponentInstance') return;
		shape.pathPoints.forEach((point) => {
			if (editor.multiSelect.points.isSelected(point)) {
				drawHandles(point, ctx);
			}
		});
	});
}

/**
 * For visual debugging, draws all path point handles
 * for all points.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 */
export function testDrawAllPathPointHandles(ctx) {
	const editor = getCurrentProjectEditor();
	// let points = editor.multiSelect.points;
	let msShapes = editor.selectedItem.shapes;

	ctx.strokeStyle = 'purple';
	msShapes.forEach((shape) => {
		if (shape.objType === 'ComponentInstance') return;
		shape.pathPoints.forEach((point) => {
			ctx.beginPath();
			ctx.arc(sXcX(point.h1.x), sYcY(point.h1.y), 3, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(sXcX(point.h2.x), sYcY(point.h2.y), 3, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		});
	});
}

/**
 * Figures out how to draw all selected path points,
 * and draws them.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Boolean =} drawAllPathPoints - for visual debugging
 */
export function computeAndDrawPathPoints(ctx, drawAllPathPoints = false) {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes.members;
	if (drawAllPathPoints) msShapes = editor.selectedItem.shapes;

	msShapes.forEach((shape) => {
		if (shape.objType === 'ComponentInstance') return;
		shape.pathPoints.forEach((point, index) => {
			if (index === 0) {
				// This could just be '1' but whatever
				let nextPoint = shape.pathPoints[shape.getNextPointNum(0)];
				drawDirectionalityPoint(point, ctx, editor.multiSelect.points.isSelected(point), nextPoint);
			} else {
				drawPoint(point, ctx, editor.multiSelect.points.isSelected(point));
			}
		});
	});
}

/**
 * For adding a point to a path, draws a preview path point
 * under where the mouse is hovering.
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {ControlPoint | Object} point - the 'p' control point
 */
export function drawPathPointHover(ctx, point) {
	// log(`drawPathPointHover`, 'start');
	// log(`\n⮟point⮟`);
	// log(point);
	let size = canvasUIPointSize;
	if (point) {
		(ctx.fillStyle = accentColors.blue.l85), ctx.fillRect(point.x, point.y, size, size);
	}
	// log(`drawPathPointHover`, 'end');
}

// --------------------------------------------------------------
// Points and handles
// --------------------------------------------------------------

/**
 * Draws this point on the edit canvas
 * @param {PathPoint} point - point to draw
 * @param {Object} ctx - canvas context
 * @param {Boolean} isSelected - draw this as selected
 */
export function drawPoint(point, ctx, isSelected) {
	// log('PathPoint.drawPoint', 'start');
	// log('sel = ' + isSelected);

	let canvasUIPointSize = 7;
	let pointFill = uiColors.offWhite;
	let accent = uiColors.accent;
	const halfPointSize = canvasUIPointSize / 2;
	// ctx.fillStyle = sel? 'white' : accent;
	ctx.fillStyle = isSelected ? pointFill : accent;
	ctx.strokeStyle = accent;
	ctx.font = '10px Consolas';

	let px = sXcX(point.p.x) - halfPointSize;
	let py = sYcY(point.p.y) - halfPointSize;
	ctx.fillRect(px, py, canvasUIPointSize, canvasUIPointSize);
	ctx.strokeRect(px, py, canvasUIPointSize, canvasUIPointSize);

	// ctx.fillStyle = 'orange';
	// ctx.fillText(point.__ID, px + 12, py);

	ctx.fillStyle = accent;
	// ctx.fillText(point.pointNumber, sXcX(point.p.x + 12), sYcY(point.p.y));
	// log('PathPoint.drawPoint', 'end');
}

/**
 * Draws a point with an arrow to show path winding
 * @param {PathPoint} point - point to draw
 * @param {Object} ctx - canvas context
 * @param {Boolean} isSelected - draw this as selected
 * @param {Object} next - next Point in the path sequence
 */
export function drawDirectionalityPoint(point, ctx, isSelected, next) {
	// ctx.fillStyle = sel? 'white' : accent;
	// let canvasUIPointSize = 7;
	let pointFill = uiColors.offWhite;
	let accent = uiColors.accent;

	ctx.fillStyle = isSelected ? pointFill : accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;

	const begin = { x: point.p.x, y: point.p.y };
	let end = { x: point.h2.x, y: point.h2.y };

	if (!point.h2.use) {
		end = { x: next.p.x, y: next.p.y };
	}

	const halfPointSize = canvasUIPointSize / 2;
	const arrow = [
		[halfPointSize * 3, 0],
		[halfPointSize, halfPointSize],
		[-halfPointSize, halfPointSize],
		[-halfPointSize, -halfPointSize],
		[halfPointSize, -halfPointSize],
	];
	const rotatedArrow = [];
	let ang = Math.atan2(end.y - begin.y, end.x - begin.x) * -1;

	// FAILURE CASE FALLBACK
	if (!ang && ang !== 0) {
		ang = point.p.x > point.h2.x ? Math.PI : 0;
	}

	for (const a of Object.keys(arrow)) {
		rotatedArrow.push([
			arrow[a][0] * Math.cos(ang) - arrow[a][1] * Math.sin(ang),
			arrow[a][0] * Math.sin(ang) + arrow[a][1] * Math.cos(ang),
		]);
	}

	// log('PathPoint.drawPoint arrow = ' + JSON.stringify(arrow) + '  - rotatedArrow = ' + JSON.stringify(rotatedArrow));

	ctx.beginPath();
	ctx.moveTo(rotatedArrow[0][0] + sXcX(point.p.x), rotatedArrow[0][1] + sYcY(point.p.y));

	rotatedArrow.forEach((v, i) => {
		if (i > 0) {
			ctx.lineTo(rotatedArrow[i][0] + sXcX(point.p.x), rotatedArrow[i][1] + sYcY(point.p.y));
		}
	});

	ctx.lineTo(rotatedArrow[0][0] + sXcX(point.p.x), rotatedArrow[0][1] + sYcY(point.p.y));
	ctx.fill();
	ctx.stroke();

	// Exact Middle Point
	ctx.fillStyle = accent;
	ctx.fillRect(makeCrisp(sXcX(point.p.x)), makeCrisp(sYcY(point.p.y)), 1, 1);
}

/**
 * Draws the handles on the edit canvas
 * @param {PathPoint} point - point to draw
 * @param {Object} ctx - canvas context
 * @param {Boolean} drawH1 - draw the first handle
 * @param {Boolean} drawH2 - draw the second handle
 */
export function drawHandles(point, ctx, drawH1 = true, drawH2 = true) {
	let accent = uiColors.accent;
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;
	ctx.font = '10px Consolas';

	if (drawH1 && point.h1.use) {
		drawOneHandle(point.h1, '1');
	}

	if (drawH2 && point.h2.use) {
		drawOneHandle(point.h2, '2');
	}

	function drawOneHandle(handle, label) {
		const hx = sXcX(handle.x);
		const hy = sYcY(handle.y);
		drawCircleHandle(ctx, { x: hx, y: hy });

		ctx.beginPath();
		ctx.moveTo(sXcX(point.p.x), sYcY(point.p.y));
		ctx.lineTo(hx, hy);
		ctx.closePath();
		ctx.stroke();

		ctx.fillText(label, hx + 12, hy);
	}
}

// --------------------------------------------------------------
// Drag to select
// --------------------------------------------------------------

/**
 * Draws the drag to select box
 * @param {Object} ctx - canvas context
 * @param {Object} eventHandlerData - event handler data object
 */
export function computeAndDrawDragToSelectBox(ctx, eventHandlerData) {
	let mouseX = eventHandlerData.mousePosition.x;
	let mouseY = eventHandlerData.mousePosition.y;

	mouseX += mouseX < eventHandlerData.firstX ? 1 : 0;
	mouseY += mouseY < eventHandlerData.firstY ? 1 : 0;

	const box = new Maxes({
		xMin: Math.min(eventHandlerData.firstX, mouseX),
		xMax: Math.max(eventHandlerData.firstX, mouseX),
		yMin: Math.min(eventHandlerData.firstY, mouseY),
		yMax: Math.max(eventHandlerData.firstY, mouseY),
	});

	// ctx.fillStyle = 'hsla(125, 100%, 36%, 0.05)';
	ctx.fillStyle = 'hsl(200, 17%, 45%, 0.05)';
	ctx.strokeStyle = accentGray;
	ctx.lineWidth = 1;
	ctx.setLineDash([3, 3]);
	ctx.fillRect(box.xMin, box.yMin, box.width, box.height);
	ctx.strokeRect(makeCrisp(box.xMin), makeCrisp(box.yMin), box.width, box.height);
	ctx.setLineDash([]);
}

// --------------------------------------------------------------
// Highlight points
// --------------------------------------------------------------

export function drawAllHighlightedPoints(ctx) {
	log(`drawAllHighligthedPoints`, 'start');
	let editor = getCurrentProjectEditor();
	let currentItem = editor.selectedItem;

	currentItem.shapes.forEach((shape) => {
		if (shape.objType === 'Path') {
			log(`\n⮟shape.cache⮟`);
			log(shape.cache);
			drawHighlightedPointsForPath(shape, ctx);
		}
	});
	log(`drawAllHighligthedPoints`, 'end');
}

function drawHighlightedPointsForPath(path, ctx) {
	path.pathPoints.forEach((point, index) => {
		if (path?.cache?.nearOtherPoints && path?.cache?.nearOtherPoints[index]) {
			// log(path?.cache?.nearOtherPoints);
			drawPointHighlight(point.p, ctx);
		}

		if (path?.cache?.nearItsOwnHandles && path?.cache?.nearItsOwnHandles[index]) {
			// log(path?.cache?.nearItsOwnHandles);
			drawPointHighlight(point.p, ctx);
		}

		if (path?.cache?.nearXZero && path?.cache?.nearXZero[index]) {
			// log(path?.cache?.nearXZero);
			drawPointHighlight(point.p, ctx);
		}

		if (path?.cache?.nearYZero && path?.cache?.nearYZero[index]) {
			// log(path?.cache?.nearYZero);
			drawPointHighlight(point.p, ctx);
		}
	});
}

/**
 * Draws a circle around a point in the highlight point style
 * @param {ControlPoint | Object} point - point to draw a circle around
 * @param {CanvasRenderingContext2D} ctx - canvas context
 */
export function drawPointHighlight(point, ctx) {
	log(`drawPointHighlight`, 'start');
	let px = sXcX(point.x);
	let py = sYcY(point.y);
	log(`canvas: ${px}, ${py}`);
	ctx.beginPath();
	ctx.arc(px, py, canvasUIPointSize + 4, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.strokeStyle = 'red';
	ctx.stroke();
	log(`drawPointHighlight`, 'end');
}

// --------------------------------------------------------------
// Visual debugging
// --------------------------------------------------------------

/**
 * Given a set of points, draws them to the canvas,
 * used for visual debugging.
 * @param {Array} xyPoints - collection of points
 * @param {String =} color - what color to draw the points
 */
export function debugDrawPoints(xyPoints = [], color = 'rgb(200,50,60)') {
	// log('debugDrawPoints', 'start');
	// log(xyPoints);
	let ctx = getCurrentProjectEditor().editCanvas.ctx;
	let oldFillStyle = ctx.fillStyle;
	ctx.fillStyle = color;
	let d = 10;
	xyPoints.forEach((point) => {
		// ctx.fillRect(sXcX(point.x), sYcY(point.y), 5, 5);
		let x = sXcX(point.x);
		let y = sYcY(point.y);
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + d, y);
		ctx.lineTo(x, y + d);
		ctx.closePath();
		ctx.fill();
	});
	ctx.fillStyle = oldFillStyle;
	// log('debugDrawPoints', 'end');
}
