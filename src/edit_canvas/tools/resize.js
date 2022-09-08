// ----------------------------------------------------------------
// Resize - resizes whole paths (Arrow / Pointer)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { setCursor } from '../cursors.js';
import { checkForMouseOverHotspot, clickEmptySpace, eventHandlerData } from '../events_mouse.js';
import { clickTool, getPathAtLocation } from './tools.js';

export class Tool_Resize {
	constructor() {
		this.dragging = false;
		this.resizing = false;
		this.rotating = false;
		this.dragSelecting = false;
		this.didStuff = false;
		this.clickedPath = false;
		eventHandlerData.handle = false;

		this.mousedown = function (ev) {
			// log('Tool_Resize.mousedown', 'start');
			// log('x:y ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			this.didStuff = false;
			let eh = eventHandlerData;
			eh.handle = false;
			eh.lastX = eh.mouseX;
			eh.firstX = eh.mouseX;
			eh.lastY = eh.mouseY;
			eh.firstY = eh.mouseY;

			this.clickedPath = getPathAtLocation(eh.mouseX, eh.mouseY);
			let editor = getCurrentProjectEditor();

			// TODO cursor detection
			// eh.handle = editor.multiSelect.paths.isOverBoundingBoxHandle(
			// 	eh.mouseX,
			// 	eh.mouseY
			// );

			// log('clickedPath: ' + this.clickedPath);
			// log('corner: ' + eh.handle);
			this.resizing = false;
			this.dragging = false;
			this.rotating = false;
			this.dragSelecting = false;

			if (eh.handle) {
				if (eh.handle === 'rotate') {
					// log('mousedown - setting rotating = true');
					this.rotating = true;
					eh.rotationCenter = editor.multiSelect.paths.maxes.center;
					eh.rotationstarttopy =
						editor.multiSelect.paths.maxes.yMax +
						editor.rotateHandleHeight / editor.view.dz;
				} else {
					// log('clicked on eh.handle: ' + eh.handle);
					this.resizing = true;
				}
				setCursor(eh.handle);
			} else if (this.clickedPath) {
				// log('clicked on path = true');
				this.dragging = true;
			} else if (!eh.multi) {
				// log('clicked on nothing');
				clickEmptySpace();
				this.dragSelecting = true;
				// TODO hotspots
				// findAndCallHotspot(eh.mouseX, eh.mouseY);
			}

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_Resize mousedown' });
		};

		this.mousemove = function (ev) {
			// log(`Tool_Resize.mousemove`, 'start');

			let eh = eventHandlerData;
			let editor = getCurrentProjectEditor();
			this.didStuff = false;
			// TODO cursor detection
			// let corner = eh.handle || editor.multiSelect.paths.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);
			let corner = eh.handle;

			let dz = editor.view.dz;
			let dx = (eh.mouseX - eh.lastX) / dz || 0;
			let dy = (eh.lastY - eh.mouseY) / dz || 0;

			if (this.dragging) {
				// log('Tool_Resize.mousemove - dragging');
				let cur = 'arrowSquare';

				if (this.clickedPath) {
					if (eh.multi)
						editor.multiSelect.paths.add(this.clickedPath);
					else if (!editor.multiSelect.paths.isSelected(this.clickedPath)) {
						editor.multiSelect.paths.select(this.clickedPath);
					}

					if (this.clickedPath.objType === 'ComponentInstance')
						clickTool('pathEdit');
					editor.nav.panel = 'Attributes';
				}

				let singlePath = editor.multiSelect.paths.singleton;

				if (singlePath) {
					// TODO cursor detection
					// cur = singlePath.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);
					// if (!cur) cur = getPathAtLocation(eh.mouseX, eh.mouseY) ? 'arrowSquare' : 'arrow';
					dx = singlePath.xLock ? 0 : dx;
					dy = singlePath.yLock ? 0 : dy;
				}

				editor.multiSelect.paths.updatePathPosition(dx, dy);
				this.didStuff = true;
				setCursor(cur);
			} else if (this.resizing) {
				// log('Tool_Resize.mousemove - resizing');
				eventHandler_PathResize();
				this.didStuff = true;
			} else if (this.rotating) {
				let a1 = calculateAngle(
					{ x: cXsX(eh.mouseX), y: cYsY(eh.mouseY) },
					eh.rotationCenter
				), a2 = calculateAngle(
					{ x: cXsX(eh.lastX), y: cYsY(eh.lastY) },
					eh.rotationCenter
				);

				editor.multiSelect.paths.rotate(a1 - a2, eh.rotationCenter);
				this.didStuff = true;
				setCursor('rotate');
			} else if (corner) {
				// log('Tool_Resize.mousemove - corner ' + corner);
				// hovering over a corner
				setCursor(corner);
			} else if (eh.multi) {
				setCursor('arrowPlus');
			} else if (getPathAtLocation(eh.mouseX, eh.mouseY)) {
				setCursor('arrowSquare');
			} else {
				// log('Tool_Resize.mousemove - fallthrough else');
				setCursor('arrow');
			}

			checkForMouseOverHotspot(eh.mouseX, eh.mouseY);

			if (this.didStuff) {
				eh.lastX = eh.mouseX;
				eh.lastY = eh.mouseY;
				eh.undoQueueHasChanged = true;
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_Resize mousemove' });
			}
			// log(`Tool_Resize.mousemove`, 'end');
		};

		this.mouseup = function () {
			// log('Mouse Up');
			let eh = eventHandlerData;
			let editor = getCurrentProjectEditor();

			// New Basic Path
			if (eh.tempNewBasicPath) {
				eh.tempNewBasicPath = false;
				eh.lastX = eh.firstX;
				eh.lastY = eh.firstY;
				eventHandler_PathResize();
			}

			// Clicked a path to select
			if (this.clickedPath && !this.didStuff) {
				if (eh.multi) {
					editor.multiSelect.paths.toggle(this.clickedPath);
				} else {
					editor.multiSelect.paths.select(this.clickedPath);
				}

				if (this.clickedPath.objType === 'ComponentInstance') {
					clickTool('pathEdit');
				} else {
					setCursor('arrowSquare');
				}

				editor.publish('whichPathIsSelected', this.clickedPath);
				editor.nav.panel = 'Attributes';
				editor.navigate();
				// editor.publish('selectedPanel', editor.nav.panel);
			}

			// Resized a path
			// if (this.resizing || this.rotating) editor.multiSelect.paths.recalculateMaxes();
			// updateCurrentGlyphWidth();

			// Finish Up
			this.clickedPath = false;
			this.didStuff = false;
			this.dragging = false;
			this.resizing = false;
			this.rotating = false;
			eh.handle = false;
			eh.lastX = -100;
			eh.lastY = -100;
			eh.firstX = -100;
			eh.firstY = -100;
			eh.rotationCenter = false;
			eh.rotationstarttopy = false;
			// TODO history
			// if (eh.undoQueueHasChanged) historyPut('Path Edit tool');
			eh.undoQueueHasChanged = false;
			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_Resize mouseup' });
			// log('EVENTHANDLER - after Tool_Resize Mouse Up REDRAW');
		};
	}
}
