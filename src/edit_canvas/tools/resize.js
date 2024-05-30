import { getCurrentProjectEditor } from '../../app/main.js';
import { calculateAngle, clone } from '../../common/functions.js';
import { findAndCallHotspot } from '../context_characters.js';
import { setCursor } from '../cursors.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { checkForMouseOverHotspot, clickEmptySpace, resizePath } from '../events_mouse.js';
import { getShapeAtLocation } from './tools.js';

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
		this.historyTitle = 'Path resize tool';
		eventHandlerData.handle = '';
	}
	// --------------------------------------------------------------
	// Mouse Down
	// --------------------------------------------------------------
	mousedown() {
		// log(`Tool_Resize.mousedown`, 'start');
		// log('x:y ' + eventHandlerData.mousePosition.x + ':' + eventHandlerData.mousePosition.y);
		const editor = getCurrentProjectEditor();
		const msShapes = editor.multiSelect.shapes;
		const ehd = eventHandlerData;
		ehd.handle = '';
		ehd.lastX = ehd.mousePosition.x;
		ehd.firstX = ehd.mousePosition.x;
		ehd.lastY = ehd.mousePosition.y;
		ehd.firstY = ehd.mousePosition.y;
		ehd.handle = msShapes.isOverBoundingBoxHandle(ehd.mousePosition.x, ehd.mousePosition.y) || '';

		this.didStuff = false;
		this.clickedPath = getShapeAtLocation(ehd.mousePosition.x, ehd.mousePosition.y);
		this.resizing = false;
		this.dragging = false;
		this.rotating = false;

		// log('clickedPath: ' + this.clickedPath);
		// log('corner: ' + ehd.handle);

		if (ehd.handle) {
			if (ehd.handle === 'rotate') {
				// log('mousedown - setting rotating = true');
				this.rotating = true;
				ehd.rotationStartCenter = clone(msShapes.maxes.center);
				// log(`center.x: ${ehd.rotationStartCenter.x}`);
				// log(`center.y: ${ehd.rotationStartCenter.y}`);
				ehd.rotationStartMaxesTopY = cYsY(ehd.mousePosition.y);
				// log(`ehd.rotationStartMaxesTopY: ${ehd.rotationStartMaxesTopY}`);
				this.historyTitle = 'Rotated shape';
			} else {
				// log('clicked on ehd.handle: ' + ehd.handle);
				this.resizing = true;
			}
			setCursor(ehd.handle);
		} else if (this.clickedPath) {
			if (ehd.isCtrlDown) {
				if (msShapes.isSelected(this.clickedPath)) {
					// If we don't drag this shape, then deselect it on mouseup
					this.monitorForDeselect = true;
				} else {
					msShapes.add(this.clickedPath);
				}
			} else {
				if (msShapes.isSelected(this.clickedPath)) {
					// If we don't drag this shape, then deselect it on mouseup
					this.monitorForDeselect = true;
				} else {
					msShapes.select(this.clickedPath);
				}
			}

			// 	if (this.clickedPath.objType === 'ComponentInstance') clickTool('pathEdit');
			// 	editor.nav.panel = 'Attributes';
			// }

			this.dragging = true;
		} else {
			// log('clicked on nothing');
			clickEmptySpace();

			findAndCallHotspot(ehd.mousePosition.x, ehd.mousePosition.y);
		}
		// log(`Tool_Resize.mousedown`, 'end');
	}

	// --------------------------------------------------------------
	// Mouse Move
	// --------------------------------------------------------------
	mousemove() {
		// log(`Tool_Resize.mousemove`, 'start');

		const ehd = eventHandlerData;
		const editor = getCurrentProjectEditor();
		const view = editor.view;
		const msShapes = editor.multiSelect.shapes;
		this.didStuff = false;
		const corner =
			ehd.handle || msShapes.isOverBoundingBoxHandle(ehd.mousePosition.x, ehd.mousePosition.y);
		const singlePath = msShapes.singleton;

		if (this.dragging) {
			// log('detected DRAGGING');
			this.monitorForDeselect = false;
			let dx = (ehd.mousePosition.x - ehd.lastX) / view.dz;
			let dy = (ehd.lastY - ehd.mousePosition.y) / view.dz;

			if (singlePath) {
				if (singlePath.xLock) dx = 0;
				if (singlePath.yLock) dy = 0;
				this.historyTitle = `Moved shape: ${singlePath.name}`;
			} else {
				this.historyTitle = `Moved ${msShapes.members.length} shapes`;
			}

			msShapes.updateShapePosition(dx, dy);
			this.monitorForDeselect = false;
			this.didStuff = true;
		} else if (this.resizing) {
			// log('detected RESIZING');
			resizePath();
			if (singlePath) {
				this.historyTitle = `Resized shape: ${singlePath.name}`;
			} else {
				this.historyTitle = `Resized ${msShapes.members.length} shapes`;
			}
			this.didStuff = true;
		} else if (this.rotating) {
			// log(`detected ROTATING`);
			let m = ehd.mousePosition;
			let center = ehd.rotationStartCenter;
			// log(`center.x: ${center.x}`);
			// log(`center.y: ${center.y}`);
			let a1 = calculateAngle({ x: cXsX(m.x), y: cYsY(m.y) }, center);
			let a2 = calculateAngle({ x: cXsX(ehd.lastX), y: cYsY(ehd.lastY) }, center);
			msShapes.rotate(a1 - a2, center);
			if (singlePath) {
				this.historyTitle = `Rotated shape: ${singlePath.name}`;
			} else {
				this.historyTitle = `Rotated ${msShapes.members.length} shapes`;
			}
			this.didStuff = true;
		}

		// Figure out cursor
		let hoveredPath = getShapeAtLocation(ehd.mousePosition.x, ehd.mousePosition.y);

		if (corner) {
			setCursor(corner);
		} else if (this.rotating) {
			setCursor('rotate');
		} else if (this.dragging) {
			setCursor('arrowSquare');
		} else if (ehd.isCtrlDown) {
			if (hoveredPath) {
				if (msShapes.isSelected(hoveredPath)) {
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

		checkForMouseOverHotspot(ehd.mousePosition.x, ehd.mousePosition.y);

		if (this.didStuff) {
			// log('did stuff');
			ehd.lastX = ehd.mousePosition.x;
			ehd.lastY = ehd.mousePosition.y;
			ehd.undoQueueHasChanged = true;
			editor.publish('currentItem', editor.selectedItem);
		} else {
			// log(`did NOT do stuff`);
		}

		// log(`Tool_Resize.mousemove`, 'end');
	}

	// --------------------------------------------------------------
	// Mouse Up
	// --------------------------------------------------------------
	mouseup() {
		// log(`Tool_Resize.mouseup`, 'start');
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
			editor.multiSelect.shapes.remove(this.clickedPath);
		}

		// Finish Up
		this.clickedPath = false;
		this.didStuff = false;
		this.dragging = false;
		this.resizing = false;
		this.rotating = false;
		this.monitorForDeselect = false;
		ehd.handle = '';
		ehd.lastX = -100;
		ehd.lastY = -100;
		ehd.firstX = -100;
		ehd.firstY = -100;
		ehd.rotationStartCenter = false;
		ehd.rotationStartMaxesTopY = -100;
		if (ehd.undoQueueHasChanged) editor.history.addState(this.historyTitle);
		ehd.undoQueueHasChanged = false;
		editor.publish('currentItem', editor.selectedItem);
		// log(`Tool_Resize.mouseup`, 'end');
	}
}
