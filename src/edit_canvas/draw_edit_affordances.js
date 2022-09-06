import { getCurrentProjectEditor } from '../app/main';
import { accentColors } from '../common/colors';
import { sXcX, sYcY } from './canvas-edit.js';
import { canResize } from './events_mouse';



// --------------------------------------------------------------
// Common size stuff
// --------------------------------------------------------------

let pointSize = 7;
let rotateHandleHeight = 40;
let affordanceBorderColor = accentColors.blue.l60;
let multiSelectThickness = 3;




// --------------------------------------------------------------
// Canvas functions
// --------------------------------------------------------------

export function computeAndDrawBoundingBox(ctx) {
	let editor = getCurrentProjectEditor();
	let maxes = editor.multiSelect.shapes.getMaxes();
	let thickness = editor.multiSelect.shapes.length > 1? multiSelectThickness : 1;
	drawBoundingBox(ctx, maxes, thickness);
}

export function computeAndDrawRotationAffordance(ctx) {
	let ss;
	if (this.members.length === 1) {
		ss = this.members[0];
		const accent =
			ss.objType === 'ComponentInstance' ? _UI.colors.green : _UI.colors.blue;
		drawRotationAffordance(accent, false);
	} else if (this.members.length > 1) {
		ss = this.glyph;
		drawRotationAffordance(_UI.colors.gray, _UI.multiSelectThickness);
	}
}

export function computeAndDrawBoundingBoxHandles(ctx) {
	let editor = getCurrentProjectEditor();
	let maxes = editor.multiSelect.shapes.getMaxes();
	let thickness = editor.multiSelect.shapes.length > 1? multiSelectThickness : 1;
	drawBoundingBoxHandles(ctx, maxes, thickness);
}

// --------------------------------------------------------------
// Bounding Box
// --------------------------------------------------------------

function drawBoundingBox(ctx, maxes, thickness) {
	log(`drawBoundingBox`, 'start');
	log(`thickness: ${thickness}`);
	log(maxes);

	let accent = thickness === 1?  affordanceBorderColor : accentColors.gray.l60;
	let lx = sXcX(maxes.xMin);
	let rx = sXcX(maxes.xMax);
	let ty = sYcY(maxes.yMax);
	let by = sYcY(maxes.yMin);

	if(thickness > 1){
		lx -= thickness;
		rx += thickness;
		ty -= thickness;
		by += thickness;
	}

	let w = (rx-lx);
	let h = (by-ty);

	ctx.fillStyle = 'transparent';
	ctx.strokeStyle = accent.l65;
	ctx.lineWidth = thickness;
	ctx.strokeRect(lx,ty,w,h);
	log(`drawBoundingBox`, 'end');
}

function drawBoundingBoxHandles(ctx, maxes, thickness) {
	let accent = thickness === 1?  affordanceBorderColor : accentColors.gray.l60;
	let bb = getBoundingBoxHandleDimensions(maxes, thickness);

	ctx.fillStyle = 'white';
	ctx.lineWidth = 1;
	ctx.strokeStyle = accent;

	// TODO rotate handle
/*
	if(_UI.ms.shapes.rotatable()){
		let h = rotateHandleHeight;
		ctx.lineWidth = thickness;
		drawLine({x:bb.midX + bb.hp, y:bb.topY}, {x:bb.midX + bb.hp, y:bb.topY - h});
		ctx.lineWidth = 1;
		drawCircleHandle({x:bb.midX + bb.hp, y:bb.topY - h + bb.hp});
	}
*/

	//upper left
	if(canResize('nw')) drawSquareHandle(ctx, {x:bb.leftX, y:bb.topY});

	//top
	if(canResize('n')) drawSquareHandle(ctx, {x:bb.midX, y:bb.topY});

	//upper right
	if(canResize('ne')) drawSquareHandle(ctx, {x:bb.rightX, y:bb.topY});

	// right
	if(canResize('e')) drawSquareHandle(ctx, {x:bb.rightX, y:bb.midY});

	//lower right
	if(canResize('se')) drawSquareHandle(ctx, {x:bb.rightX, y:bb.bottomY});

	//bottom
	if(canResize('s')) drawSquareHandle(ctx, {x:bb.midX, y:bb.bottomY});

	//lower left
	if(canResize('sw')) drawSquareHandle(ctx, {x:bb.leftX, y:bb.bottomY});

	//left
	if(canResize('w')) drawSquareHandle(ctx, {x:bb.leftX, y:bb.midY});

	// //Center Dot
	// ctx.fillRect(bb.midX, bb.midY, ps, ps);
	// ctx.strokeRect(bb.midX, bb.midY, ps, ps);
}

function drawRotationAffordance(ctx, accent, thickness) {
	let editor = getCurrentProjectEditor();
	accent = accent || _UI.colors.blue;
	thickness = thickness || 1;
	let center = clone(editor.eventHandlerData.rotationcenter, 'drawRotationAffordance');
	let starttopY = editor.eventHandlerData.rotationstartpoint.y;
	let mx = editor.eventHandlerData.mousex;
	let my = editor.eventHandlerData.mousey;
	let radians = calculateAngle({x:cx_sx(mx), y:cy_sy(my)}, center);

	// log('\t Init radians:\t' + radians);
	let snap = editor.eventHandlerData.isShiftDown;
	if(snap) radians = snapRadiansToDegrees(radians);
	let rotatehandle = {x:center.x, y:starttopY};
	rotate(rotatehandle, radians, center, snap);
	rotate(rotatehandle, (Math.PI/-2), center, snap);

	// log('\t Drag Angle:\t' + round(radians, 2));

	let counterclockwise = false;
	if(Math.abs(radians) > (Math.PI/2)) {
		counterclockwise = true;
	}


	// Convert things to Canvas System
	rotatehandle.x = sXcX(rotatehandle.x);
	rotatehandle.y = sYcY(rotatehandle.y);
	center.x = sXcX(center.x);
	center.y = sYcY(center.y);
	starttopY = sYcY(starttopY);
	let radius = calculateLength(center, rotatehandle);


	// Pizza Pie Sweep
	ctx.fillStyle = accent.l65;
	ctx.strokeStyle = accent.l65;
	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(center.x, center.y);
	ctx.arc(center.x, center.y, radius, (Math.PI/-2), (radians*-1), counterclockwise);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// rotate Handle
	ctx.strokeStyle = accent.l65;
	ctx.fillStyle = 'white';
	ctx.lineWidth = thickness;
	drawLine({x:rotatehandle.x, y:rotatehandle.y}, {x:center.x, y:center.y});
	ctx.lineWidth = 1;
	drawCircleHandle(rotatehandle);

	// readout
	let readout = round(radiansToNiceAngle(radians),1);
	if(counterclockwise) readout -= 360;
	readout = round(readout, 1);

	// log('\t Readout angle:\t' + readout);

	ctx.font = '24px OpenSans';
	ctx.fillStyle = accent.l65;
	ctx.globalAlpha = 0.8;
	ctx.fillText((''+readout+'°'), center.x, starttopY-24);

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
	ctx.arc(center.x, center.y, (pointSize/2), 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}



// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------


function isOverBoundingBoxHandle(px, py, maxes, thickness) {
	// debug('\n isOverBoundingBoxHandle - START');
	// debug('\t px/py - ' + px + ' / ' + py);
	// debug('\t maxes - ' + json(maxes, true));

	if(!maxes) return false;
	let ps = _GP.projectsettings.pointsize;
	let bb = getBoundingBoxHandleDimensions(maxes, thickness);

	// debug('\t point size - ' + ps);
	// debug('\t l/m/r x: ' + bb.leftX + ' / ' + bb.midX + ' / ' + bb.rightX);
	// debug('\t t/m/b y: ' + bb.topY + ' / ' + bb.midY + ' / ' + bb.bottomY);

	// rotation handle
	if(_UI.ms.shapes.rotatable()){
		if( ((px > bb.midX) && (px < bb.midX+ps)) &&
			((py > bb.topY-_UI.rotatehandleheight) && (py < bb.topY-_UI.rotatehandleheight+ps)) ){
			return 'rotate';
		}
	}

	// upper left
	if( ((px > bb.leftX) && (px < bb.leftX+ps)) &&
		((py > bb.topY) && (py < bb.topY+ps)) ){
		return 'nw';
	}

	// top
	if( ((px > bb.midX) && (px < bb.midX+ps)) &&
		((py > bb.topY) && (py < bb.topY+ps)) ){
		return 'n';
	}

	// upper right
	if( ((px > bb.rightX) && (px < bb.rightX+ps)) &&
		((py > bb.topY) && (py < bb.topY+ps)) ){
		return 'ne';
	}

	// right
	if( ((px > bb.rightX) && (px < bb.rightX+ps)) &&
		((py > bb.midY) && (py < bb.midY+ps)) ){
		return 'e';
	}

	// lower right
	if( ((px > bb.rightX) && (px < bb.rightX+ps)) &&
		((py > bb.bottomY) && (py < bb.bottomY+ps)) ){
		return 'se';
	}

	// bottom
	if( ((px > bb.midX) && (px < bb.midX+ps)) &&
		((py > bb.bottomY) && (py < bb.bottomY+ps)) ){
		return 's';
	}

	// lower left
	if( ((px > bb.leftX) && (px < bb.leftX+ps)) &&
		((py > bb.bottomY) && (py < bb.bottomY+ps)) ){
		return 'sw';
	}

	// left
	if( ((px > bb.leftX) && (px < bb.leftX+ps)) &&
		((py > bb.midY) && (py < bb.midY+ps)) ){
		return 'w';
	}

	// debug(' isOverBoundingBoxHandle - returning FALSE - END\n');
	return false;
}

function getBoundingBoxHandleDimensions(maxes, thickness) {
	let dimensions = {};
	let hp = pointSize/2;
	thickness = thickness || 1;

	// Translation Fidelity - converting passed canvas values to saved value system
	dimensions.leftX = (sXcX(maxes.xMin) - hp); //.makeCrisp(false);
	dimensions.midX = Math.floor(sXcX(maxes.xMin)+((sXcX(maxes.xMax)-sXcX(maxes.xMin))/2)-hp);
	dimensions.rightX = (sXcX(maxes.xMax) - hp); //.makeCrisp(true);

	dimensions.topY = (sYcY(maxes.yMax) - hp); //.makeCrisp(true);
	dimensions.midY = Math.floor(sYcY(maxes.yMax)+((sYcY(maxes.yMin)-sYcY(maxes.yMax))/2)-hp);
	dimensions.bottomY = (sYcY(maxes.yMin) - hp); //.makeCrisp(false);


	if(thickness > 1){
		dimensions.leftX -= thickness;
		dimensions.rightX += thickness;
		dimensions.topY -= thickness;
		dimensions.bottomY += thickness;
	}

	dimensions.hp = hp;

	return dimensions;
}



/* NEEDS TO BE REFACTORED
drawComponentInstanceOutline(componentInstance, accent = '#000', thickness = 1) {
	// log('ComponentInstance.drawPathOutline', 'start');
	let g = componentInstance.transformedGlyph;
	for (let s = 0; s < g.shapes.length; s++) {
		drawPathOutline(g.shapes[s], accent, thickness);
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

/**
 * Draws this point on the edit canvas
 * @param {PathPoint} point - point to draw
 * @param {object} ctx - canvas context
 * @param {boolean} isSelected - draw this as selected
 * @param {string} accent - accent color
 * @param {number} pointSize - how big to draw the point
 */
export function drawPoint(point, ctx, isSelected, accent = '#000', pointSize = 7) {
	// log('PathPoint.drawPoint', 'start');
	// log('sel = ' + isSelected);

	const halfPointSize = pointSize / 2;
	// ctx.fillStyle = sel? 'white' : accent;
	ctx.fillStyle = isSelected ? 'white' : accent;
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
	ctx.fillText(point.pointNumber, sXcX(point.p.x + 12), sYcY(point.p.y));
	// log('PathPoint.drawPoint', 'end');
}

/**
 * Draws a point with an arrow to show path winding
 * @param {PathPoint} point - point to draw
 * @param {object} ctx - canvas context
 * @param {boolean} isSelected - draw this as selected
 * @param {string} accent - accent color
 * @param {Point} next - next Point in the path sequence
 * @param {number} pointSize - how big to draw the point
 */
export function drawDirectionalityPoint(point, ctx, isSelected, accent = '#000', next, pointSize = 7) {
	// ctx.fillStyle = sel? 'white' : accent;
	ctx.fillStyle = isSelected ? 'white' : accent;
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
	ctx.moveTo(
		rotatedArrow[0][0] + sXcX(point.p.x),
		rotatedArrow[0][1] + sYcY(point.p.y)
	);

	for (const p of Object.keys(rotatedArrow)) {
		if (p > 0) {
			ctx.lineTo(
				rotatedArrow[p][0] + sXcX(point.p.x),
				rotatedArrow[p][1] + sYcY(point.p.y)
			);
		}
	}

	ctx.lineTo(
		rotatedArrow[0][0] + sXcX(point.p.x),
		rotatedArrow[0][1] + sYcY(point.p.y)
	);
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
 * @param {string} accent - accent color
 * @param {number} pointSize - how big to draw the point
 */
export function drawHandles(point, ctx, drawH1, drawH2, accent = '#000', pointSize = 7) {
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;
	ctx.font = '10px Consolas';

	const halfPointSize = pointSize / 2;

	if (drawH1 && point.h1.use) {
		ctx.beginPath();
		ctx.arc(
			sXcX(point.h1.x),
			sYcY(point.h1.y),
			halfPointSize,
			0,
			Math.PI * 2,
			true
		);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(sXcX(point.p.x), sYcY(point.p.y));
		ctx.lineTo(sXcX(point.h1.x), sYcY(point.h1.y));
		ctx.closePath();
		ctx.stroke();
		ctx.fillText('1', sXcX(point.h1.x + 12), sYcY(point.h1.y));
	}

	if (drawH2 && point.h2.use) {
		ctx.beginPath();
		ctx.arc(
			sXcX(point.h2.x),
			sYcY(point.h2.y),
			halfPointSize,
			0,
			Math.PI * 2,
			true
		);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(sXcX(point.p.x), sYcY(point.p.y));
		ctx.lineTo(sXcX(point.h2.x), sYcY(point.h2.y));
		ctx.closePath();
		ctx.stroke();
		ctx.fillText('2', sXcX(point.h2.x + 12), sYcY(point.h2.y));
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
export function drawQuadraticHandle(ctx, accent = '#000', prevP, pointSize = 7) {
	// Draw Quadratic handle point from imported SVG
	ctx.fillStyle = accent;
	ctx.strokeStyle = accent;
	ctx.lineWidth = 1;
	const halfPointSize = pointSize / 2;

	if (point.q) {
		ctx.beginPath();
		ctx.arc(
			sXcX(point.q.x),
			sYcY(point.q.y),
			halfPointSize,
			0,
			Math.PI * 2,
			true
		);
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