import { getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { updateCursor } from './cursors.js';
import { Tool_Pan}  from './tools/pan.js';
import { Tool_NewBasicPath}  from './tools/new-basic-path.js';
import { Tool_Resize}  from './tools/resize.js';
import { Tool_NewPath}  from './tools/new-path.js';
import { Tool_PathEdit}  from './tools/path-edit.js';
import { Tool_PathAddPoint}  from './tools/path-add-point.js';
import { Tool_Kern}  from './tools/kern.js';

/**
 Framework > Event Handlers > Mouse
 All the canvas mouse interaction and tool
 events for all pages can be found here.
 **/

export let eventHandlerData = {
	currentToolHandler: false,
	tempNewBasicPath: false,
	dragSelectArea: false,
	mouseX: 0,
	mouseY: 0,
	handle: false,
	rotationCenter: false,
	rotateHandleHeight: 40,
	isMouseOverCanvas: false,
	corner: false,
	toolHandoff: false,
	lastX: -100,
	lastY: -100,
	firstX: -100,
	firstY: -100,
	undoQueueHasChanged: false,
	lastTool: false,
	isSpaceDown: false,
	isShiftDown: false,
	hoverPoint: false,
	multi: false,
	canvasHotSpots: []
};

/* eslint-disable require-jsdoc */

export function initEventHandlers(editCanvas) {
	// log('initEventHandlers', 'start');

	let editor = getCurrentProjectEditor();

	editor.eventHandlers.tool_pan = new Tool_Pan();
	editor.eventHandlers.tool_addRectOval = new Tool_NewBasicPath();
	editor.eventHandlers.tool_resize = new Tool_Resize();
	editor.eventHandlers.tool_addPath = new Tool_NewPath();
	editor.eventHandlers.tool_pathEdit = new Tool_PathEdit();
	editor.eventHandlers.tool_pathAddPoint = new Tool_PathAddPoint();
	editor.eventHandlers.tool_kern = new Tool_Kern();

	// Mouse Event Listeners
	editCanvas.addEventListener('mousedown', ev_canvas, false);
	editCanvas.addEventListener('mousemove', ev_canvas, false);
	editCanvas.addEventListener('mouseup', ev_canvas, false);
	editCanvas.customGuideTransparency = handleMouseOverCanvas;
	editCanvas.onmouseout = handleMouseLeaveCanvas;
	editCanvas.addEventListener('wheel', mousewheel, false);

	// TODO
	// Document Key Listeners
	// getEditDocument().addEventListener('keypress', keypress, false);
	// getEditDocument().addEventListener('keydown', keypress, false);
	// getEditDocument().addEventListener('keyup', keyup, false);

	// The general-purpose event handler.
	function ev_canvas(ev) {
		// log(`ev_canvas`, 'start');
		// log(`Raw mouse event x/y = ${ev.layerX} / ${ev.layerY}`);

		let editor = getCurrentProjectEditor();
		handleMouseOverCanvas();
		let eh = eventHandlerData;


		if (ev.offsetX || ev.offsetX) {
			// IE, Chrome, (Opera?)
			eh.mouseX = ev.offsetX;
			eh.mouseY = ev.offsetY;
		} else if (ev.layerX || ev.layerX) {
			// Firefox
			eh.mouseX = ev.layerX;
			eh.mouseY = ev.layerY;
		}

		// log('EV_CANVAS offsetx / offsety / layerx / layery: ' +  ev.offsetX + ' ' + ev.offsetY + ' ' + ev.layerX + ' ' + ev.layerY);

		// updateCursor();

		// Switch Tool function
		// log(`editor.selectedTool: ${editor.selectedTool}`);
		switch (editor.selectedTool) {
			case 'resize':
				eh.currentToolHandler = editor.eventHandlers.tool_resize;
				break;
			case 'pathEdit':
				eh.currentToolHandler = editor.eventHandlers.tool_pathEdit;
				break;
			case 'pan':
				eh.currentToolHandler = editor.eventHandlers.tool_pan;
				break;
			case 'pathAddPoint':
				eh.currentToolHandler = editor.eventHandlers.tool_pathAddPoint;
				break;
			case 'newPath':
				eh.currentToolHandler = editor.eventHandlers.tool_addPath;
				break;
			case 'newRectangle':
				eh.currentToolHandler = editor.eventHandlers.tool_addRectOval;
				break;
			case 'newOval':
				eh.currentToolHandler = editor.eventHandlers.tool_addRectOval;
				break;
			case 'kern':
				eh.currentToolHandler = editor.eventHandlers.tool_kern;
				break;
			case editor.selectedTool:
				eh.currentToolHandler = editor.eventHandlers.tool_resize;
		}

		// Call the event handler of the eh.currentToolHandler.
		// log(JSON.stringify(eh.currentToolHandler));
		eh.currentToolHandler[ev.type](ev);
		// log(`ev_canvas`, 'end');
	}
}

function handleMouseOverCanvas() {
	// log('handleMouseOverCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = true;
	updateCursor();
	// log('handleMouseOverCanvas', 'end');
}

function handleMouseLeaveCanvas() {
	// log('handleMouseLeaveCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = false;
	// Fixes a Chrome cursor problem
	document.onselectstart = function () {};
	updateCursor();
	// log('handleMouseLeaveCanvas', 'end');
}


// Helper Functions
export function clickEmptySpace() {
	let editor = getCurrentProjectEditor();
	editor.multiSelect.points.clear();
	editor.multiSelect.paths.clear();
}

function eventHandler_PathResize() {
	// log('eventHandler_PathResize', 'start');
	let editor = getCurrentProjectEditor();
	let s = editor.multiSelect.paths;
	let pcorner = eventHandlerData.handle;
	// log('handle ' + pcorner);

	let maxes = s.maxes;
	let mx = cXsX(eventHandlerData.mouseX);
	let my = cYsY(eventHandlerData.mouseY);
	let lx = cXsX(eventHandlerData.lastX);
	let ly = cYsY(eventHandlerData.lastY);
	let dh = ly - my;
	let dw = lx - mx;
	let rl = s.getAttribute('ratioLock');

	// log('eventHandler_PathResize dw/dh/rl: ' + dw + '/' + dh + '/' + rl);

	// Check that the path won't have negative dimensions
	if (mx >= maxes.xMax && maxes.xMax - maxes.xMin + dw < 2) dw = 0;
	if (my >= maxes.yMax && maxes.yMax - maxes.yMin + dh < 2) dh = 0;

	// Resize the path
	switch (pcorner) {
		case 'n':
			if (canResize('n')) {
				setCursor('n-resize');
				s.updatePathSize(0, dh * -1, rl);
			}
			break;

		case 'ne':
			if (canResize('ne')) {
				setCursor('ne-resize');
				s.updatePathSize(dw * -1, dh * -1, rl);
			}
			break;

		case 'e':
			if (canResize('e')) {
				setCursor('e-resize');
				s.updatePathSize(dw * -1, 0, rl);
			}
			break;

		case 'se':
			if (canResize('se')) {
				setCursor('se-resize');
				s.updatePathSize(dw * -1, dh, rl);
				s.updatePathPosition(0, dh * -1);
			}
			break;

		case 's':
			if (canResize('s')) {
				setCursor('s-resize');
				s.updatePathPosition(0, dh * -1);
				s.updatePathSize(0, dh, rl);
			}
			break;

		case 'sw':
			if (canResize('sw')) {
				setCursor('sw-resize');
				s.updatePathSize(dw, dh, rl);
				s.updatePathPosition(dw * -1, dh * -1);
			}
			break;

		case 'w':
			if (canResize('w')) {
				setCursor('w-resize');
				s.updatePathSize(dw, 0, rl);
				s.updatePathPosition(dw * -1, 0);
			}
			break;

		case 'nw':
			if (canResize('nw')) {
				setCursor('nw-resize');
				s.updatePathSize(dw, dh * -1, rl);
				s.updatePathPosition(dw * -1, 0);
			}
			break;
	}

	// if(!eventHandlerData.tempNewBasicPath) s.recalculateMaxes();

	// log('eventHandler_PathResize - Done lx/rx/ty/by: ' + s.maxes.xMin + ',' + s.maxes.xMax + ',' + s.maxes.yMax + ',' + s.maxes.yMin);
}

export function checkForMouseOverHotspot(x, y) {
	let editor = getCurrentProjectEditor();
	if (isHotspotHere(x, y)) {
		let hs = findAndUnderlineHotspot(x, y);
		setCursor('pointer');
		if (hs !== eventHandlerData.canvasHotSpotHovering)
			redraw({
				calledBy: 'checkForMouseOverHotspot',
				redrawPanels: false,
				redrawTools: false,
			});
		eventHandlerData.canvasHotSpotHovering = hs;
	} else {
		if (eventHandlerData.canvasHotSpotHovering)
			redraw({
				calledBy: 'checkForMouseOverHotspot',
				redrawPanels: false,
				redrawTools: false,
			});
		eventHandlerData.canvasHotSpotHovering = false;
	}
}

function updateTNBS(dx, dy, dw, dh) {
	// log('updateTNBS dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
	eventHandlerData.tempNewBasicPath.xMin += dx;
	eventHandlerData.tempNewBasicPath.yMax += dy;
	eventHandlerData.tempNewBasicPath.xMax += dw + dx;
	eventHandlerData.tempNewBasicPath.yMin += dh + dy;
}

function updateDragSelectArea(dx, dy, dw, dh) {
	// log('updateDragSelectArea dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
	eventHandlerData.dragSelectArea.xMin += dx;
	eventHandlerData.dragSelectArea.yMax += dy;
	eventHandlerData.dragSelectArea.xMax += dw + dx;
	eventHandlerData.dragSelectArea.yMin += dh + dy;
}

export function canResize(handle) {
	let editor = getCurrentProjectEditor();
	let rl = editor.multiSelect.paths.ratioLock;
	let xl = editor.multiSelect.paths.xLock;
	let yl = editor.multiSelect.paths.yLock;
	let wl = editor.multiSelect.paths.wLock;
	let hl = editor.multiSelect.paths.hLock;
	let re = true;

	switch (handle) {
		case 'nw':
			re = rl ? false : !yl && !hl && !xl && !wl;
			break;
		case 'n':
			re = !yl && !hl;
			break;
		case 'ne':
			re = rl ? false : !yl && !hl && !wl;
			break;
		case 'e':
			re = !wl;
			break;
		case 'se':
			re = rl ? false : !hl && !wl;
			break;
		case 's':
			re = !hl;
			break;
		case 'sw':
			re = rl ? false : !hl && !xl && !wl;
			break;
		case 'w':
			re = !xl && !wl;
	}

	// log('canResize ' + handle + ' returning ' + re);
	return re;
}

function mousewheel(event) {
	let delta = event.deltaY * -1;
	// log('MOUSEWHEEL - deltaY: ' + event.deltaY);

	let canzoom =
		onEditCanvasPage() &&
		document.getElementById('dialog_box').style.display !== 'block';

	if (canzoom) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			// log('MOUSEWHEEL: canzoom=true and delta=' + delta );
			if (delta > 0) {
				viewZoom(1.1);
			} else {
				viewZoom(0.9);
			}
		}
	}
}




// --------------------------------------------------------------
// Canvas hotspots
// --------------------------------------------------------------

export function registerCanvasHotspot(hotspot) {
	eventHandlerData.canvasHotSpots.push(hotspot);
}

export function clearCanvasHotspots() {
	eventHandlerData.canvasHotSpots = [];
}

export function isHotspotHere(cx, cy) {
	const chs = eventHandlerData.canvasHotSpots;
	let v;

	for (let i = 0; i < chs.length; i++) {
		v = chs[i];
		// log(`isHotspotHere - checking ${v.target.xMin} - ${v.target.xMax} - ${v.target.yMin} - ${v.target.yMax}`);
		// log(`results ${(cx <= v.target.xMax)} - ${(cx >= v.target.xMin)} - ${(cy <= v.target.yMax)} - ${(cy >= v.target.yMin)}`);
		if (
			cx <= v.target.xMax &&
			cx >= v.target.xMin &&
			cy <= v.target.yMax &&
			cy >= v.target.yMin
		) {
			return v;
		}
	}

	return false;
}

export function findAndCallHotspot(cx, cy) {
	eventHandlerData.canvasHotSpots.forEach(function (v, i, a) {
		if (
			cx <= v.target.xMax &&
			cx >= v.target.xMin &&
			cy <= v.target.yMax &&
			cy >= v.target.yMin
		) {
			v.onclick();
		}
	});
}

export function hotspotNavigateToGlyph(gid) {
	// log('hotspotNavigateToGlyph', 'start');
	// log('passed ' + gid);

	let editor = getCurrentProjectEditor();
	const v = editor.view;
	const currchar = getSelectedWorkItemChar();
	const newchar = hexToChars(gid);
	const ctxg = getContextGlyphString();
	const p1 = ctxg.indexOf(currchar);
	const p2 = ctxg.indexOf(newchar);
	let flipper;
	let leftchar;
	let rightchar;

	if (p1 < p2) {
		flipper = 1;
		leftchar = currchar;
		rightchar = newchar;
	} else {
		flipper = -1;
		leftchar = newchar;
		rightchar = currchar;
	}

	const str = ctxg.substring(p1, p2);
	// log(`substring from ${p1} to ${p2} yeilds ${str}`);

	const delta = getGlyphSequenceAdvanceWidth(str);

	// log(`advance width: ${delta} screen pixels: ${sXcX(delta)}`);
	// v.dx += sXcX(delta);
	const kern = calculateKernOffset(leftchar, rightchar);
	// log(`kern offset ${leftchar} and ${rightchar} is ${kern}`);

	v.dx += v.dz * delta * flipper;
	v.dx += v.dz * kern * flipper;

	getGlyph(gid, true).contextGlyphs = ctxg;
	selectGlyph(gid);
	setView(v);

	_UI.redraw.redrawTools = true;
	update_ToolsArea();

	// log('hotspotNavigateToGlyph', 'end');
}

export function findAndUnderlineHotspot(cx, cy) {
	// log('findAndUnderlineHotspot', 'start');
	// log(`cx:${cx} \t cy:${cy}`);
	const hs = isHotspotHere(cx, cy);
	const ctx = _UI.glyphEditCTX;
	// log(`${hs}`);
	if (hs) {
		const t = getCurrentProject().projectSettings.colors
			.systemGuideTransparency;
		// var t2 = (((100 - t) / 2) + t);
		const alpha = transparencyToAlpha(t);
		const rgb = getColorFromRGBA('rgb(204,81,0)', alpha);

		ctx.strokeStyle = rgb;
		ctx.beginPath();
		ctx.moveTo(hs.underline.xMin, makeCrisp(hs.underline.y));
		ctx.lineTo(hs.underline.xMax, makeCrisp(hs.underline.y));
		ctx.stroke();
		setCursor('arrow');
	}

	return hs.target.xMin;
	// log('findAndUnderlineHotspot', 'end');
}
