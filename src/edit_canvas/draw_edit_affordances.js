import { getCurrentProjectEditor } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { makeCrisp } from '../common/functions.js';
import { drawPath } from './draw_paths.js';
import { eventHandlerData } from './events.js';
import { sXcX, sYcY } from './edit_canvas.js';
import { canResize } from './events_mouse.js';
import { ovalPathFromMaxes, rectPathFromMaxes } from './tools/new_basic_path.js';

// --------------------------------------------------------------
// Common size stuff
// --------------------------------------------------------------

let pointSize = 7;
let rotateHandleHeight = 40;
let accentBlue = accentColors.blue.l65;
let accentGreen = accentColors.green.l65;
let accentGray = accentColors.gray.l65;
let pathFill = '#000';
let pointFill = '#FFF';
let multiSelectThickness = 3;

// --------------------------------------------------------------
// Paths
// --------------------------------------------------------------
// --------------------------------------------------------------
// Compute and Draw functions
// --------------------------------------------------------------

export function computeAndDrawBoundingBox(ctx) {
	const editor = getCurrentProjectEditor();
	if (editor.multiSelect.paths.length < 1) return;
	let maxes = editor.multiSelect.paths.maxes;
	let thickness = editor.multiSelect.paths.length > 1 ? multiSelectThickness : 1;
	drawBoundingBox(ctx, maxes, thickness);
}

export function computeAndDrawRotationAffordance(ctx) {
	const editor = getCurrentProjectEditor();
	let ss;
	if (editor.multiSelect.paths.length === 1) {
		ss = editor.multiSelect.paths.members[0];
		const accent = ss.objType === 'ComponentInstance' ? accentGreen : accentBlue;
		drawRotationAffordance(accent, false);
	} else if (editor.multiSelect.paths.length > 1) {
		ss = editor.multiSelect.paths.virtualGlyph;
		drawRotationAffordance(accentGray, multiSelectThickness);
	}
}

export function computeAndDrawBoundingBoxHandles(ctx) {
	const editor = getCurrentProjectEditor();
	if (editor.multiSelect.paths.length < 1) return;
	let maxes = editor.multiSelect.paths.maxes;
	let thickness = editor.multiSelect.paths.length > 1 ? multiSelectThickness : 1;
	drawBoundingBoxHandles(ctx, maxes, thickness);
}

// --------------------------------------------------------------
// Paths
// --------------------------------------------------------------
export function drawSelectedPathOutline(ctx, view) {
	// log(`drawSelectedPathOutline`, 'start');
	const editor = getCurrentProjectEditor();
	let selected = editor.multiSelect.paths.members.length;
	// log(`selected: ${selected}`);

	if (selected > 0) {
		ctx.beginPath();
		editor.multiSelect.paths.drawPaths(ctx, view);
		ctx.closePath();

		ctx.strokeStyle = accentBlue;
		ctx.stroke();
	}

	// log(`drawSelectedPathOutline`, 'end');
}

export function drawNewBasicPath(ctx, path, view) {
	ctx.beginPath();
	drawPath(path, ctx, view);
	ctx.closePath();

	ctx.fillStyle = pathFill;
	ctx.fill();
	ctx.strokeStyle = accentBlue;
	ctx.stroke();

	drawBoundingBox(ctx, path.maxes, 1);
}

// --------------------------------------------------------------
// Bounding Box
// --------------------------------------------------------------

export function drawBoundingBox(ctx, maxes, thickness) {
	// log(`drawBoundingBox`, 'start');
	// log(`thickness: ${thickness}`);
	// log(maxes);

	let accent = thickness === 1 ? accentBlue : accentGray;
	let lx = sXcX(maxes.xMin);
	let rx = sXcX(maxes.xMax);
	let ty = sYcY(maxes.yMax);
	let by = sYcY(maxes.yMin);

	if (thickness > 1) {
		lx -= thickness;
		rx += thickness;
		ty -= thickness;
		by += thickness;
	}

	let w = rx - lx;
	let h = by - ty;

	ctx.fillStyle = 'transparent';
	ctx.strokeStyle = accent;
	ctx.lineWidth = thickness;
	ctx.strokeRect(lx, ty, w, h);
	// log(`drawBoundingBox`, 'end');
}

function drawBoundingBoxHandles(ctx, maxes, thickness) {
	let accent = thickness === 1 ? accentBlue : accentGray;
	let bb = getBoundingBoxHandleDimensions(maxes, thickness);

	ctx.fillStyle = pointFill;
	ctx.lineWidth = 1;
	ctx.strokeStyle = accent;

	// TODO rotate handle
	/*
	if(getCurrentProjectEditor().multiSelect.paths.isRotatable()){
		let h = rotateHandleHeight;
		ctx.lineWidth = thickness;
		drawLine({x:bb.midX + bb.hp, y:bb.topY}, {x:bb.midX + bb.hp, y:bb.topY - h});
		ctx.lineWidth = 1;
		drawCircleHandle({x:bb.midX + bb.hp, y:bb.topY - h + bb.hp});
	}
*/

	//upper left
	if (canResize('nw')) drawSquareHandle(ctx, { x: bb.leftX, y: bb.topY });

	//top
	if (canResize('n')) drawSquareHandle(ctx, { x: bb.midX, y: bb.topY });

	//upper right
	if (canResize('ne')) drawSquareHandle(ctx, { x: bb.rightX, y: bb.topY });

	// right
	if (canResize('e')) drawSquareHandle(ctx, { x: bb.rightX, y: bb.midY });

	//lower right
	if (canResize('se')) drawSquareHandle(ctx, { x: bb.rightX, y: bb.bottomY });

	//bottom
	if (canResize('s')) drawSquareHandle(ctx, { x: bb.midX, y: bb.bottomY });

	//lower left
	if (canResize('sw')) drawSquareHandle(ctx, { x: bb.leftX, y: bb.bottomY });

	//left
	if (canResize('w')) drawSquareHandle(ctx, { x: bb.leftX, y: bb.midY });

	// //Center Dot
	// ctx.fillRect(bb.midX, bb.midY, ps, ps);
	// ctx.strokeRect(bb.midX, bb.midY, ps, ps);
}

function drawRotationAffordance(ctx, accent, thickness) {
	const editor = getCurrentProjectEditor();
	accent = accent || accentBlue;
	thickness = thickness || 1;
	let center = clone(eventHandlerData.rotationCenter, 'drawRotationAffordance');
	let startTopY = eventHandlerData.rotationStartPoint.y;
	let mx = eventHandlerData.mouseX;
	let my = eventHandlerData.mouseY;
	let radians = calculateAngle({ x: cx_sx(mx), y: cy_sy(my) }, center);

	// log('\t Init radians:\t' + radians);
	let snap = eventHandlerData.isShiftDown;
	if (snap) radians = snapRadiansToDegrees(radians);
	let rotateHandle = { x: center.x, y: startTopY };
	rotate(rotateHandle, radians, center, snap);
	rotate(rotateHandle, Math.PI / -2, center, snap);

	// log('\t Drag Angle:\t' + round(radians, 2));

	let counterclockwise = false;
	if (Math.abs(radians) > Math.PI / 2) {
		counterclockwise = true;
	}

	// Convert things to Canvas System
	rotateHandle.x = sXcX(rotateHandle.x);
	rotateHandle.y = sYcY(rotateHandle.y);
	center.x = sXcX(center.x);
	center.y = sYcY(center.y);
	startTopY = sYcY(startTopY);
	let radius = calculateLength(center, rotateHandle);

	// Pizza Pie Sweep
	ctx.fillStyle = accent.l65;
	ctx.strokeStyle = accent.l65;
	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(center.x, center.y);
	ctx.arc(center.x, center.y, radius, Math.PI / -2, radians * -1, counterclockwise);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// rotate Handle
	ctx.strokeStyle = accent.l65;
	ctx.fillStyle = pointFill;
	ctx.lineWidth = thickness;
	drawLine({ x: rotateHandle.x, y: rotateHandle.y }, { x: center.x, y: center.y });
	ctx.lineWidth = 1;
	drawCircleHandle(rotateHandle);

	// readout
	let readout = round(radiansToNiceAngle(radians), 1);
	if (counterclockwise) readout -= 360;
	readout = round(readout, 1);

	// log('\t Readout angle:\t' + readout);

	ctx.font = '24px OpenSans';
	ctx.fillStyle = accent.l65;
	ctx.globalAlpha = 0.8;
	ctx.fillText('' + readout + '°', center.x, startTopY - 24);

	ctx.globalAlpha = 1;
}

// --------------------------------------------------------------
// Simple drawings
// --------------------------------------------------------------

function drawLine(ctx, p1, p2) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
}

function drawSquareHandle(ctx, ul) {
	ctx.fillRect(ul.x, ul.y, pointSize, pointSize);
	ctx.strokeRect(ul.x, ul.y, pointSize, pointSize);
}

function drawCircleHandle(ctx, center) {
	ctx.beginPath();
	ctx.arc(center.x, center.y, pointSize / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

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
	let re = false;
	let ps = pointSize;
	let bb = getBoundingBoxHandleDimensions(maxes);

	// log('\t point size - ' + ps);
	// log('\t l/m/r x: ' + bb.leftX + ' / ' + bb.midX + ' / ' + bb.rightX);
	// log('\t t/m/b y: ' + bb.topY + ' / ' + bb.midY + ' / ' + bb.bottomY);

	// rotation handle
	if (editor.multiSelect.paths.isRotatable()) {
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
	if (px > bb.leftX && px < bb.leftX + ps && py > bb.topY && py < bb.topY + ps) {
		re = 'nw';
	}

	// top
	if (px > bb.midX && px < bb.midX + ps && py > bb.topY && py < bb.topY + ps) {
		re = 'n';
	}

	// upper right
	if (px > bb.rightX && px < bb.rightX + ps && py > bb.topY && py < bb.topY + ps) {
		re = 'ne';
	}

	// right
	if (px > bb.rightX && px < bb.rightX + ps && py > bb.midY && py < bb.midY + ps) {
		re = 'e';
	}

	// lower right
	if (px > bb.rightX && px < bb.rightX + ps && py > bb.bottomY && py < bb.bottomY + ps) {
		re = 'se';
	}

	// bottom
	if (px > bb.midX && px < bb.midX + ps && py > bb.bottomY && py < bb.bottomY + ps) {
		re = 's';
	}

	// lower left
	if (px > bb.leftX && px < bb.leftX + ps && py > bb.bottomY && py < bb.bottomY + ps) {
		re = 'sw';
	}

	// left
	if (px > bb.leftX && px < bb.leftX + ps && py > bb.midY && py < bb.midY + ps) {
		re = 'w';
	}

	// log(`re: ${re}`);

	// log(`isOverBoundingBoxHandle`, 'end');
	return re;
}

function getBoundingBoxHandleDimensions(maxes, thickness) {
	let dimensions = {};
	let hp = pointSize / 2;
	thickness = 1;

	// Translation Fidelity - converting passed canvas values to saved value system
	dimensions.leftX = sXcX(maxes.xMin) - hp;
	dimensions.midX = Math.floor(sXcX(maxes.xMin) + (sXcX(maxes.xMax) - sXcX(maxes.xMin)) / 2 - hp);
	dimensions.rightX = sXcX(maxes.xMax) - hp;
	dimensions.topY = sYcY(maxes.yMax) - hp;
	dimensions.midY = Math.floor(sYcY(maxes.yMax) + (sYcY(maxes.yMin) - sYcY(maxes.yMax)) / 2 - hp);
	dimensions.bottomY = sYcY(maxes.yMin) - hp;

	if (thickness > 1) {
		dimensions.leftX -= thickness;
		dimensions.rightX += thickness;
		dimensions.topY -= thickness;
		dimensions.bottomY += thickness;
	}

	dimensions.leftX = makeCrisp(dimensions.leftX, -1);
	dimensions.midX = makeCrisp(dimensions.midX, -1);
	dimensions.rightX = makeCrisp(dimensions.rightX, 1);
	dimensions.topY = makeCrisp(dimensions.topY, -1);
	dimensions.midY = makeCrisp(dimensions.midY, -1);
	dimensions.bottomY = makeCrisp(dimensions.bottomY, 1);

	dimensions.hp = hp;

	return dimensions;
}

/* NEEDS TO BE REFACTORED
drawComponentInstanceOutline(componentInstance, accent = '#000', thickness = 1) {
	// log('ComponentInstance.drawPathOutline', 'start');
	let g = componentInstance.transformedGlyph;
	for (let s = 0; s < g.paths.length; s++) {
		drawPathOutline(g.paths[s], accent, thickness);
	}
}
drawComponentInstanceBoundingBox(componentInstance, accent = '#000', thickness = 1) {
	// log('ComponentInstance.drawBoundingBox', 'start');
	let g = componentInstance.transformedGlyph.maxes;
	drawBoundingBox(g, accent, thickness);
}
drawComponentInstanceBoundingBoxHandles(componentInstance, accent = '#000', thickness = 1) {
	// log('ComponentInstance.drawBoundingBoxHandles', 'start');
	let g = componentInstance.transformedGlyph.maxes;
	drawBoundingBoxHandles(g, accent, thickness);
}
isOverComponentInstanceBoundingBoxHandle(componentInstance, px, py) {
	// log('ComponentInstance.isOverBoundingBoxHandle', 'start');
	let c = isOverBoundingBoxHandle(px, py, componentInstance.maxes);
	// log('ComponentInstance.isOverBoundingBoxHandle returning ' + c);
	return c;
}
*/

// --------------------------------------------------------------
// Paths and PathPoints
// --------------------------------------------------------------
// --------------------------------------------------------------
// Canvas Stuff
// --------------------------------------------------------------

export function computeAndDrawPathPointHandles(ctx) {
	const editor = getCurrentProjectEditor();
	// let points = editor.multiSelect.points;
	let paths = editor.multiSelect.paths.members;

	paths.forEach((path) => {
		path.pathPoints.forEach((point) => {
			if (editor.multiSelect.points.isSelected(point)) {
				drawHandles(point, ctx);
			}
		});
	});
}

export function testDrawAllPathPointHandles(ctx) {
	const editor = getCurrentProjectEditor();
	// let points = editor.multiSelect.points;
	let paths = editor.selectedItem.paths;

	ctx.strokeStyle = 'purple';
	paths.forEach((path) => {
		path.pathPoints.forEach((point) => {
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

export function computeAndDrawPathPoints(ctx, drawAllPathPoints = false) {
	const editor = getCurrentProjectEditor();
	let paths = editor.multiSelect.paths.members;
	if (drawAllPathPoints) paths = editor.selectedItem.paths;

	paths.forEach((path) => {
		path.pathPoints.forEach((point, index) => {
			if (index === 0) {
				// This could just be '1' but whatever
				let nextPoint = path.pathPoints[path.getNextPointNum(0)];
				drawDirectionalityPoint(point, ctx, editor.multiSelect.points.isSelected(point), nextPoint);
			} else {
				drawPoint(point, ctx, editor.multiSelect.points.isSelected(point));
			}
		});
	});
}

export function drawPathPointHover(ctx, point) {
	if (point) {
		ctx.fillStyle = pointFill;
		ctx.fillRect(point.x, point.y, point.size, point.size);
	}
}

// --------------------------------------------------------------
// Points and handles
// --------------------------------------------------------------

/**
 * Draws this point on the edit canvas
 * @param {PathPoint} point - point to draw
 * @param {object} ctx - canvas context
 * @param {boolean} isSelected - draw this as selected
 */
export function drawPoint(point, ctx, isSelected) {
	// log('PathPoint.drawPoint', 'start');
	// log('sel = ' + isSelected);

	let pointSize = 7;
	let pointFill = uiColors.offWhite;
	let accent = uiColors.accent;
	const halfPointSize = pointSize / 2;
	// ctx.fillStyle = sel? 'white' : accent;
	ctx.fillStyle = isSelected ? pointFill : accent;
	ctx.strokeStyle = accent;
	ctx.font = '10px Consolas';

	ctx.fillRect(
		sXcX(point.p.x) - halfPointSize,
		sYcY(point.p.y) - halfPointSize,
		pointSize,
		pointSize
	);
	ctx.strokeRect(
		sXcX(point.p.x) - halfPointSize,
		sYcY(point.p.y) - halfPointSize,
		pointSize,
		pointSize
	);

	ctx.fillStyle = accent;
	// ctx.fillText(point.pointNumber, sXcX(point.p.x + 12), sYcY(point.p.y));
	// log('PathPoint.drawPoint', 'end');
}

/**
 * Draws a point with an arrow to show path winding
 * @param {PathPoint} point - point to draw
 * @param {object} ctx - canvas context
 * @param {boolean} isSelected - draw this as selected
 * @param {Point} next - next Point in the path sequence
 */
export function drawDirectionalityPoint(point, ctx, isSelected, next) {
	// ctx.fillStyle = sel? 'white' : accent;
	let pointSize = 7;
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

	const halfPointSize = pointSize / 2;
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

	for (const p of Object.keys(rotatedArrow)) {
		if (p > 0) {
			ctx.lineTo(rotatedArrow[p][0] + sXcX(point.p.x), rotatedArrow[p][1] + sYcY(point.p.y));
		}
	}

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
 * @param {object} ctx - canvas context
 * @param {boolean} drawH1 - draw the first handle
 * @param {boolean} drawH2 - draw the second handle
 */
export function drawHandles(point, ctx, drawH1 = true, drawH2 = true) {
	let pointSize = 7;
	let pointFill = uiColors.offWhite;
	let accent = uiColors.accent;
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;
	ctx.font = '10px Consolas';

	const halfPointSize = pointSize / 2;

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

/**
 * Draws a Quadratic point to the edit canvas
 * @param {PathPoint} point - point to draw
 * @param {object} ctx - canvas context
 * @param {string} accent - accent color
 * @param {Point} prevP - Previous point in the path sequence
 * @param {number} pointSize - how big to draw the point
 */
export function drawQuadraticHandle(ctx) {
	// Draw Quadratic handle point from imported SVG
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;
	const halfPointSize = pointSize / 2;

	if (point.q) {
		ctx.beginPath();
		ctx.arc(sXcX(point.q.x), sYcY(point.q.y), halfPointSize, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(sXcX(point.p.x), sYcY(point.p.y));
		ctx.lineTo(sXcX(point.q.x), sYcY(point.q.y));
		ctx.closePath();
		ctx.stroke();

		if (prevP) {
			ctx.beginPath();
			ctx.moveTo(sXcX(prevP.x), sYcY(prevP.y));
			ctx.lineTo(sXcX(point.q.x), sYcY(point.q.y));
			ctx.closePath();
			ctx.stroke();
		}
	}
}
