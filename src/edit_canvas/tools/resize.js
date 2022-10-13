import { getCurrentProjectEditor } from '../../app/main.js';
import { setCursor } from '../cursors.js';
import { eventHandlerData } from '../events.js';
import { checkForMouseOverHotspot, clickEmptySpace, resizePath } from '../events_mouse.js';
import { clickTool, getPathAtLocation } from './tools.js';

// ----------------------------------------------------------------
// Resize - resizes whole paths (Arrow / Pointer)
// ----------------------------------------------------------------

export class Tool_Resize {
	constructor() {
		this.dragging = false;
		this.resizing = false;
		this.rotating = false;
		this.monitorForDeselect = false;
		this.didStuff = false;
		this.clickedPath = false;
		eventHandlerData.handle = false;

		// --------------------------------------------------------------
		// Mouse Down
		// --------------------------------------------------------------
		this.mousedown = function (ev) {
			// log('Tool_Resize.mousedown', 'start');
			// log('x:y ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			const editor = getCurrentProjectEditor();
			const msPaths = editor.multiSelect.paths;
			const ehd = eventHandlerData;
			ehd.handle = false;
			ehd.lastX = ehd.mouseX;
			ehd.firstX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;
			ehd.firstY = ehd.mouseY;
			ehd.handle = msPaths.isOverBoundingBoxHandle(ehd.mouseX, ehd.mouseY);

			this.didStuff = false;
			this.clickedPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);
			this.resizing = false;
			this.dragging = false;
			this.rotating = false;

			// log('clickedPath: ' + this.clickedPath);
			// log('corner: ' + ehd.handle);

			if (ehd.handle) {
				if (ehd.handle === 'rotate') {
					// log('mousedown - setting rotating = true');
					this.rotating = true;
					ehd.rotationCenter = msPaths.maxes.center;
					ehd.rotationStartTopY = msPaths.maxes.yMax + editor.rotateHandleHeight / editor.view.dz;
				} else {
					// log('clicked on ehd.handle: ' + ehd.handle);
					this.resizing = true;
				}
				setCursor(ehd.handle);
			} else if (this.clickedPath) {
				if (ehd.isCtrlDown) {
					if (msPaths.isSelected(this.clickedPath)) {
						// If we don't drag this shape, then deselect it on mouseup
						this.monitorForDeselect = true;
					} else {
						msPaths.add(this.clickedPath);
					}
				} else {
					if (msPaths.isSelected(this.clickedPath)) {
						// If we don't drag this shape, then deselect it on mouseup
						this.monitorForDeselect = true;
					} else {
						msPaths.select(this.clickedPath);
					}
				}

				// 	if (this.clickedPath.objType === 'ComponentInstance') clickTool('pathEdit');
				// 	editor.nav.panel = 'Attributes';
				// }

				this.dragging = true;
			} else {
				// log('clicked on nothing');
				clickEmptySpace();

				// TODO hotspots
				// findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}
		};

		// --------------------------------------------------------------
		// Mouse Move
		// --------------------------------------------------------------
		this.mousemove = function (ev) {
			// log(`Tool_Resize.mousemove`, 'start');

			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const view = editor.view;
			const msPaths = editor.multiSelect.paths;
			this.didStuff = false;
			const corner = ehd.handle || msPaths.isOverBoundingBoxHandle(ehd.mouseX, ehd.mouseY);

			if (this.dragging) {
				// log('Dragging');
				this.monitorForDeselect = false;
				let dx = (ehd.mouseX - ehd.lastX) / view.dz;
				let dy = (ehd.lastY - ehd.mouseY) / view.dz;

				const singlePath = msPaths.singleton;
				if (singlePath) {
					if (singlePath.xLock) dx = 0;
					if (singlePath.yLock) dy = 0;
				}

				msPaths.updatePathPosition(dx, dy);
				this.monitorForDeselect = false;
				this.didStuff = true;
			} else if (this.resizing) {
				// log('detected RESIZING');
				resizePath();
				this.didStuff = true;
			} else if (this.rotating) {
				// log(`detected ROTATING`);
				let a1 = calculateAngle({ x: cXsX(ehd.mouseX), y: cYsY(ehd.mouseY) }, ehd.rotationCenter);
				let a2 = calculateAngle({ x: cXsX(ehd.lastX), y: cYsY(ehd.lastY) }, ehd.rotationCenter);
				msPaths.rotate(a1 - a2, ehd.rotationCenter);
				this.didStuff = true;
			}

			// Figure out cursor
			let hoveredPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);

			if (corner) {
				setCursor(corner);
			} else if (this.rotating) {
				setCursor('rotate');
			} else if (this.dragging) {
				setCursor('arrowSquare');
			} else if (ehd.isCtrlDown) {
				if (hoveredPath) {
					if (msPaths.isSelected(hoveredPath)) {
						setCursor('arrowSquareMinus');
					} else {
						setCursor('arrowSquarePlus');
					}
				} else {
					setCursor('arrowPlus');
				}
			} else {
				if (hoveredPath) {
					setCursor('arrowSquare');
				} else {
					setCursor('arrow');
				}
			}

			// checkForMouseOverHotspot(ehd.mouseX, ehd.mouseY);

			if (this.didStuff) {
				// log('did stuff');
				ehd.lastX = ehd.mouseX;
				ehd.lastY = ehd.mouseY;
				ehd.undoQueueHasChanged = true;
				editor.publish('currentGlyph', editor.selectedItem);
			} else {
				// log(`did NOT do stuff`);
			}

			// log(`Tool_Resize.mousemove`, 'end');
		};

		// --------------------------------------------------------------
		// Mouse Up
		// --------------------------------------------------------------
		this.mouseup = function () {
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();

			// New Basic Path
			if (ehd.newBasicPathMaxes) {
				ehd.newBasicPathMaxes = false;
				ehd.lastX = ehd.firstX;
				ehd.lastY = ehd.firstY;
				resizePath();
			}

			if (this.monitorForDeselect) {
				editor.multiSelect.paths.remove(this.clickedPath);
			}

			// Finish Up
			this.clickedPath = false;
			this.didStuff = false;
			this.dragging = false;
			this.resizing = false;
			this.rotating = false;
			this.monitorForDeselect = false;
			ehd.handle = false;
			ehd.lastX = -100;
			ehd.lastY = -100;
			ehd.firstX = -100;
			ehd.firstY = -100;
			ehd.rotationCenter = false;
			ehd.rotationStartTopY = false;
			if (ehd.undoQueueHasChanged) editor.history.addState('Path Edit tool');
			ehd.undoQueueHasChanged = false;
		};
	}
}
