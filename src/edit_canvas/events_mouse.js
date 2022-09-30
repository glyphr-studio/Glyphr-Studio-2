import { getCurrentProjectEditor } from '../app/main.js';
import { setCursor } from './cursors.js';
import { cXsX, cYsY } from './edit_canvas.js';
import { eventHandlerData, handleMouseLeaveCanvas, handleMouseOverCanvas } from './events.js';

// --------------------------------------------------------------
// Mouse Events
// --------------------------------------------------------------

export function handleMouseEvents(event) {
	// log(`handleMouseEvents`, 'start');
	// log(`Raw mouse event x/y = ${event.layerX} / ${event.layerY}`);

	const editor = getCurrentProjectEditor();
	handleMouseOverCanvas();
	let eh = eventHandlerData;

	if (event.offsetX || event.offsetX) {
		// IE, Chrome, (Opera?)
		eh.mouseX = event.offsetX;
		eh.mouseY = event.offsetY;
	} else if (event.layerX || event.layerX) {
		// Firefox
		eh.mouseX = event.layerX;
		eh.mouseY = event.layerY;
	}
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
	eh.currentToolHandler[event.type](event);
	// log(`handleMouseEvents`, 'end');
}


// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

export function clickEmptySpace() {
	const editor = getCurrentProjectEditor();
	editor.multiSelect.points.clear();
	editor.multiSelect.paths.clear();
}

export function resizePath() {
	// log('resizePath', 'start');
	const editor = getCurrentProjectEditor();
	let paths = editor.multiSelect.paths;
	// log(paths);
	let resizeCorner = eventHandlerData.handle;
	// log('handle ' + resizeCorner);

	let mx = cXsX(eventHandlerData.mouseX);
	let my = cYsY(eventHandlerData.mouseY);
	let lx = cXsX(eventHandlerData.lastX);
	let ly = cYsY(eventHandlerData.lastY);
	let dh = ly - my;
	let dw = lx - mx;
	// TODO multi-select path ratioLock?
	let rl = paths.ratioLock || false;

	// Check that the path won't have negative dimensions
	let maxes = paths.maxes;
	// TODO if resizing handle goes past the opposite side,
	// flip the shape and selected handle to keep going
	if ((mx >= maxes.xMax) && (maxes.xMax - maxes.xMin + dw < 2)) dw = 0;
	if ((my >= maxes.yMax) && (maxes.yMax - maxes.yMin + dh < 2)) dh = 0;
	// log('dw/dh/rl: ' + dw + '/' + dh + '/' + rl);

	// Resize the path
	switch (resizeCorner) {
		case 'n':
			if (canResize('n')) {
				setCursor('n-resize');
				paths.updatePathSize(0, dh * -1, rl);
			}
			break;

		case 'ne':
			if (canResize('ne')) {
				setCursor('ne-resize');
				paths.updatePathSize(dw * -1, dh * -1, rl);
			}
			break;

		case 'e':
			if (canResize('e')) {
				setCursor('e-resize');
				paths.updatePathSize(dw * -1, 0, rl);
			}
			break;

		case 'se':
			if (canResize('se')) {
				setCursor('se-resize');
				paths.updatePathSize(dw * -1, dh, rl);
				paths.updatePathPosition(0, dh * -1);
			}
			break;

		case 's':
			if (canResize('s')) {
				setCursor('s-resize');
				paths.updatePathPosition(0, dh * -1);
				paths.updatePathSize(0, dh, rl);
			}
			break;

		case 'sw':
			if (canResize('sw')) {
				setCursor('sw-resize');
				paths.updatePathSize(dw, dh, rl);
				paths.updatePathPosition(dw * -1, dh * -1);
			}
			break;

		case 'w':
			if (canResize('w')) {
				setCursor('w-resize');
				paths.updatePathSize(dw, 0, rl);
				paths.updatePathPosition(dw * -1, 0);
			}
			break;

		case 'nw':
			if (canResize('nw')) {
				setCursor('nw-resize');
				paths.updatePathSize(dw, dh * -1, rl);
				paths.updatePathPosition(dw * -1, 0);
			}
			break;
	}

	// log('Done lx/rx/ty/by: ' + paths.maxes.print());
	// log(`resizePath`, 'end');
}

export function checkForMouseOverHotspot(x, y) {
	const editor = getCurrentProjectEditor();
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

function updateDragSelectArea(dx, dy, dw, dh) {
	// log('updateDragSelectArea dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
	eventHandlerData.dragSelectArea.xMin += dx;
	eventHandlerData.dragSelectArea.yMax += dy;
	eventHandlerData.dragSelectArea.xMax += dw + dx;
	eventHandlerData.dragSelectArea.yMin += dh + dy;
}

export function canResize(handle) {
	const editor = getCurrentProjectEditor();
	let selectedPaths = editor.multiSelect.paths;
	let rl = selectedPaths.ratioLock;
	let xl = selectedPaths.xLock;
	let yl = selectedPaths.yLock;
	let wl = selectedPaths.wLock;
	let hl = selectedPaths.hLock;
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

export function handleMouseWheel(event) {
	let delta = event.deltaY * -1;
	const editor = getCurrentProjectEditor();
	// log('MOUSEWHEEL - deltaY: ' + event.deltaY);

	let canZoom =
		editor.nav.isOnEditCanvasPage &&
		document.getElementById('dialog_box').style.display !== 'block';

	if (canZoom) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			// log('MOUSEWHEEL: canZoom=true and delta=' + delta );
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

	const editor = getCurrentProjectEditor();
	const v = editor.view;
	const currchar = getSelectedItemChar();
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
