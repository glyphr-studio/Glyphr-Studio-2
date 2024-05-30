import { getCurrentProjectEditor } from '../app/main.js';
import { closeAllNotations } from '../controls/dialogs/dialogs.js';
import { Glyph } from '../project_data/glyph.js';
import { findAndUnderlineHotspot, isHotspotHere } from './context_characters.js';
import { setCursor } from './cursors.js';
import { canvasUIPointSize } from './draw_edit_affordances.js';
import { cXsX, cYsY } from './edit_canvas.js';
import {
	cancelDefaultEventActions,
	eventHandlerData,
	togglePanOff,
	togglePanOn,
} from './events.js';

// --------------------------------------------------------------
// Mouse Events
// --------------------------------------------------------------

export function handleMouseEvents(event) {
	// log(`handleMouseEvents`, 'start');
	// log(`Raw mouse event x/y = ${event.layerX} / ${event.layerY}`);
	// log(event);
	const ehd = eventHandlerData;
	const editor = getCurrentProjectEditor();

	ehd.mousePosition = getMousePositionData(event);

	// Mouse back & forward buttons
	if (event.button === 3 || event.button === 4) {
		// Don't navigate
		cancelDefaultEventActions(event);
		return;
	}

	// Mouse right-click
	if (event.button === 2) {
		// Right-click handler
	}

	// Mouse wheel-click
	if (event.button === 1) {
		if (event.type === 'mousedown') {
			togglePanOn(event);
		}
		if (event.type === 'mouseup') {
			togglePanOff(event);
		}
		// return;
	}

	// Mouse left-click
	if (event.button === 0) {
		// Switch Tool function
		// log(`editor.selectedTool: ${editor.selectedTool}`);
		switch (editor.selectedTool) {
			case 'resize':
				ehd.currentToolHandler = editor.eventHandlers.tool_resize;
				break;
			case 'pathEdit':
				ehd.currentToolHandler = editor.eventHandlers.tool_pathEdit;
				break;
			case 'pan':
				ehd.currentToolHandler = editor.eventHandlers.tool_pan;
				break;
			case 'pathAddPoint':
				ehd.currentToolHandler = editor.eventHandlers.tool_pathAddPoint;
				break;
			case 'newPath':
				ehd.currentToolHandler = editor.eventHandlers.tool_addPath;
				break;
			case 'newRectangle':
				ehd.currentToolHandler = editor.eventHandlers.tool_addRectOval;
				break;
			case 'newOval':
				ehd.currentToolHandler = editor.eventHandlers.tool_addRectOval;
				break;
			case 'kern':
				ehd.currentToolHandler = editor.eventHandlers.tool_kern;
				break;
			case editor.selectedTool:
				ehd.currentToolHandler = editor.eventHandlers.tool_resize;
		}

		// Call the event handler of the ehd.currentToolHandler.
		// log(JSON.stringify(ehd.currentToolHandler));
		ehd.currentToolHandler[event.type](event);
	}
	// log(`handleMouseEvents`, 'end');
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

export function getMousePositionData(event) {
	let mouse = { x: false, y: false };

	if (event.offsetX || event.offsetY) {
		// IE, Chrome, (Opera?)
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
	} else if (event.layerX || event.layerY) {
		// Firefox
		mouse.x = event.layerX;
		mouse.y = event.layerY;
	}
	// log(`mouse: ${mouse.x}, ${mouse.y}`);
	return mouse;
}

export function clickEmptySpace() {
	const editor = getCurrentProjectEditor();
	editor.multiSelect.points.clear();
	editor.multiSelect.shapes.clear();
}

export function resizePath() {
	// log('resizePath', 'start');
	const editor = getCurrentProjectEditor();
	let selected = editor.multiSelect.shapes;
	// log(selected);
	let resizeCorner = eventHandlerData.handle;
	// log('handle ' + resizeCorner);

	let mx = cXsX(eventHandlerData.mousePosition.x);
	let my = cYsY(eventHandlerData.mousePosition.y);
	let lx = cXsX(eventHandlerData.lastX);
	let ly = cYsY(eventHandlerData.lastY);
	let dh = ly - my;
	let dw = lx - mx;
	// let rl = selected.virtualGlyph.ratioLock || false;
	let rl = selected.ratioLock;

	// Check that the path won't have negative dimensions
	let maxes = selected.maxes;

	// Resizing width from the right
	if (resizeCorner.includes('e')) {
		if (mx + dw <= maxes.xMax) dw = 0;
	}
	// Resizing width from the left
	if (resizeCorner.includes('w')) {
		if (mx + dw >= maxes.xMin) dw = 0;
		if (maxes.width + dw < 0) dw = maxes.width * -0.9;
	}
	// Resizing height from the top
	if (resizeCorner.includes('n')) {
		if (my <= maxes.yMax - dh) dh = 0;
	}
	// Resizing height from the bottom
	if (resizeCorner.includes('s')) {
		if (my + dh >= maxes.yMin) dh = 0;
		if (maxes.height + dh < 0) dh = maxes.height * -0.9;
	}

	// log('dw/dh/rl: ' + dw + '/' + dh + '/' + rl);

	// Resize the path
	switch (resizeCorner) {
		case 'n':
			if (canResize('n')) {
				setCursor('n-resize');
				selected.updateShapeSize({
					width: 0,
					height: dh * -1,
					ratioLock: rl,
					transformOrigin: 'bottom-center',
				});
			}
			break;

		case 'ne':
			if (canResize('ne')) {
				setCursor('ne-resize');
				selected.updateShapeSize({
					width: dw * -1,
					height: dh * -1,
					ratioLock: rl,
					transformOrigin: 'bottom-left',
				});
			}
			break;

		case 'e':
			if (canResize('e')) {
				setCursor('e-resize');
				selected.updateShapeSize({
					width: dw * -1,
					height: 0,
					ratioLock: rl,
					transformOrigin: 'middle-left',
				});
			}
			break;

		case 'be':
			if (canResize('be')) {
				setCursor('e-resize');
				selected.updateShapeSize({
					width: dw * -1,
					height: 0,
					ratioLock: rl,
					transformOrigin: 'baseline-left',
				});
			}
			break;

		case 'se':
			if (canResize('se')) {
				setCursor('se-resize');
				selected.updateShapeSize({
					width: dw * -1,
					height: dh,
					ratioLock: rl,
					transformOrigin: 'top-left',
				});
				// selected.updateShapePosition(0, dh * -1);
			}
			break;

		case 's':
			if (canResize('s')) {
				setCursor('s-resize');
				// selected.updateShapePosition(0, dh * -1);
				selected.updateShapeSize({
					width: 0,
					height: dh,
					ratioLock: rl,
					transformOrigin: 'top-center',
				});
			}
			break;

		case 'sw':
			if (canResize('sw')) {
				setCursor('sw-resize');
				selected.updateShapeSize({
					width: dw,
					height: dh,
					ratioLock: rl,
					transformOrigin: 'top-right',
				});
				// selected.updateShapePosition(dw * -1, dh * -1);
			}
			break;

		case 'bw':
			if (canResize('bw')) {
				setCursor('ew-resize');
				selected.updateShapeSize({
					width: dw,
					height: 0,
					ratioLock: rl,
					transformOrigin: 'baseline-right',
				});
				// selected.updateShapePosition(dw * -1, 0);
			}
			break;

		case 'w':
			if (canResize('w')) {
				setCursor('w-resize');
				selected.updateShapeSize({
					width: dw,
					height: 0,
					ratioLock: rl,
					transformOrigin: 'middle-right',
				});
				// selected.updateShapePosition(dw * -1, 0);
			}
			break;

		case 'nw':
			if (canResize('nw')) {
				setCursor('nw-resize');
				selected.updateShapeSize({
					width: dw,
					height: dh * -1,
					ratioLock: rl,
					transformOrigin: 'bottom-right',
				});
				// selected.updateShapePosition(dw * -1, 0);
			}
			break;
	}

	// log('Done lx/rx/ty/by: ' + selected.maxes.print());
	// log(`resizePath`, 'end');
}

export function checkForMouseOverHotspot(x, y) {
	const editor = getCurrentProjectEditor();

	if (isHotspotHere(x, y)) {
		let hs = findAndUnderlineHotspot(x, y);
		setCursor('pointer');
		if (hs !== eventHandlerData.canvasHotspotHovering)
			editor.publish('editCanvasView', editor.view);
		eventHandlerData.canvasHotspotHovering = hs;
	} else {
		if (eventHandlerData.canvasHotspotHovering) editor.publish('editCanvasView', editor.view);
		eventHandlerData.canvasHotspotHovering = false;
	}
}

export function canResize(handle) {
	const editor = getCurrentProjectEditor();
	const msShapes = editor.multiSelect.shapes;
	let selected = msShapes;
	if (msShapes.length > 1) {
		// @ts-ignore
		selected = msShapes.virtualGlyph;
	}
	let rl = selected.ratioLock;
	// @ts-ignore
	let xl = selected.xLock;
	// @ts-ignore
	let yl = selected.yLock;
	// @ts-ignore
	let wl = selected.wLock;
	// @ts-ignore
	let hl = selected.hLock;
	let yMax = selected.maxes.yMax;
	let yMin = selected.maxes.yMin;
	let handleSize = canvasUIPointSize / 2 / editor.view.dz;
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
		case 'be':
			re = !wl && rl && yMin < handleSize * -1 && yMax > handleSize;
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
		case 'bw':
			re = !xl && !wl && rl && yMin < handleSize * -1 && yMax > handleSize;
			break;
		case 'w':
			re = !xl && !wl;
	}

	// log('canResize ' + handle + ' returning ' + re);
	return re;
}

export function handleMouseWheel(event) {
	// log(event);
	let delta = event.deltaY * -1;
	const editor = getCurrentProjectEditor();
	const mouse = getMousePositionData(event);
	// log('MOUSEWHEEL - deltaY: ' + event.deltaY);

	let canZoom = editor.nav.isOnEditCanvasPage;
	// && document.querySelector('#dialog_box').style.display !== 'block';

	if (canZoom) {
		if (event.ctrlKey || event.metaKey) {
			cancelDefaultEventActions(event);
			closeAllNotations();
			eventHandlerData.hoverPoint = false;
			// log('MOUSEWHEEL: canZoom=true and delta=' + delta );
			if (delta > 0) {
				editor.updateViewZoom(1.1, mouse);
			} else {
				editor.updateViewZoom(0.9, mouse);
			}
		}
	}
}
