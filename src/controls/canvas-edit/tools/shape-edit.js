// ----------------------------------------------------------------
// Shape Resize - resizes whole shapes (Arrow / Pointer)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../../app/main.js';
import { log } from '../../../common/functions.js';
import { setCursor } from '../cursors.js';
import { checkForMouseOverHotspot, clickEmptySpace, eventHandlerData } from '../events_mouse.js';
import { clickTool, getShapeAtLocation } from './tools.js';

export default class Tool_ShapeEdit {
	constructor() {
		this.dragging = false;
		this.resizing = false;
		this.rotating = false;
		this.dragselecting = false;
		this.didstuff = false;
		this.clickedshape = false;
		eventHandlerData.handle = false;

		this.mousedown = function (ev) {
			// log('Tool_ShapeEdit.mousedown', 'start');
			// log('x:y ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			this.didstuff = false;
			let eh = eventHandlerData;
			eh.handle = false;
			eh.lastX = eh.mouseX;
			eh.firstX = eh.mouseX;
			eh.lastY = eh.mouseY;
			eh.firstY = eh.mouseY;

			this.clickedshape = getShapeAtLocation(eh.mouseX, eh.mouseY);
			let editor = getCurrentProjectEditor();

			// TODO cursor detection
			// eh.handle = editor.multiSelect.shapes.isOverBoundingBoxHandle(
			// 	eh.mouseX,
			// 	eh.mouseY
			// );

			// log('clickshape: ' + this.clickedshape);
			// log('corner: ' + eh.handle);
			this.resizing = false;
			this.dragging = false;
			this.rotating = false;
			this.dragselecting = false;

			if (eh.handle) {
				if (eh.handle === 'rotate') {
					// log('mousedown - setting rotating = true');
					this.rotating = true;
					eh.rotationCenter = editor.multiSelect.shapes.center;
					eh.rotationstarttopy =
						editor.multiSelect.shapes.maxes.yMax +
						editor.rotateHandleHeight / editor.view.dz;
				} else {
					// log('clicked on eh.handle: ' + eh.handle);
					this.resizing = true;
				}
				setCursor(eh.handle);
			} else if (this.clickedshape) {
				// log('clicked on shape = true');
				this.dragging = true;
			} else if (!eh.multi) {
				// log('clicked on nothing');
				clickEmptySpace();
				this.dragselecting = true;
				findAndCallHotspot(eh.mouseX, eh.mouseY);
			}

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_ShapeEdit mousedown' });
		};

		this.mousemove = function (ev) {
			log(`Tool_ShapeEdit.mousemove`, 'start');

			let eh = eventHandlerData;
			let editor = getCurrentProjectEditor();
			this.didstuff = false;
			// TODO cursor detection
			// let corner = eh.handle || editor.multiSelect.shapes.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);
			let corner = eh.handle;

			let dz = editor.view.dz;
			let dx = (eh.mouseX - eh.lastX) / dz || 0;
			let dy = (eh.lastY - eh.mouseY) / dz || 0;

			if (this.dragging) {
				// log('Tool_ShapeEdit.mousemove - dragging');
				let cur = 'arrowSquare';

				if (this.clickedshape) {
					if (eh.multi)
						editor.multiSelect.shapes.add(this.clickedshape);
					else if (!editor.multiSelect.shapes.isSelected(this.clickedshape)) {
						editor.multiSelect.shapes.select(this.clickedshape);
					}

					if (this.clickedshape.objType === 'ComponentInstance')
						clickTool('shapeEdit');
					editor.nav.panel = 'Attributes';
				}

				let singleshape = editor.multiSelect.shapes.singleton;

				if (singleshape) {
					// TODO cursor detection
					// cur = singleshape.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);
					// if (!cur) cur = getShapeAtLocation(eh.mouseX, eh.mouseY) ? 'arrowSquare' : 'arrow';
					dx = singleshape.xLock ? 0 : dx;
					dy = singleshape.yLock ? 0 : dy;
				}

				editor.multiSelect.shapes.updateShapePosition(dx, dy);
				this.didstuff = true;
				setCursor(cur);
			} else if (this.resizing) {
				// log('Tool_ShapeEdit.mousemove - resizing');
				eventHandler_ShapeResize();
				this.didstuff = true;
			} else if (this.rotating) {
				let a1 = calculateAngle(
					{ x: cXsX(eh.mouseX), y: cYsY(eh.mouseY) },
					eh.rotationCenter
				), a2 = calculateAngle(
					{ x: cXsX(eh.lastX), y: cYsY(eh.lastY) },
					eh.rotationCenter
				);

				editor.multiSelect.shapes.rotate(a1 - a2, eh.rotationCenter);
				this.didstuff = true;
				setCursor('rotate');
			} else if (corner) {
				// log('Tool_ShapeEdit.mousemove - corner ' + corner);
				// hovering over a corner
				setCursor(corner);
			} else if (eh.multi) {
				setCursor('arrowPlus');
			} else if (getShapeAtLocation(eh.mouseX, eh.mouseY)) {
				setCursor('arrowSquare');
			} else {
				// log('Tool_ShapeEdit.mousemove - fallthrough else');
				setCursor('arrow');
			}

			checkForMouseOverHotspot(eh.mouseX, eh.mouseY);

			if (this.didstuff) {
				eh.lastX = eh.mouseX;
				eh.lastY = eh.mouseY;
				eh.undoQueueHasChanged = true;
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_ShapeEdit mousemove' });
			}
			log(`Tool_ShapeEdit.mousemove`, 'end');
		};

		this.mouseup = function () {
			// log('Mouse Up');
			let eh = eventHandlerData;
			let editor = getCurrentProjectEditor();

			// New Basic Shape
			if (eh.tempNewBasicShape) {
				eh.tempNewBasicShape = false;
				eh.lastX = eh.firstX;
				eh.lastY = eh.firstY;
				eventHandler_ShapeResize();
			}

			// Clicked a shape to select
			if (this.clickedshape && !this.didstuff) {
				if (eh.multi) {
					editor.multiSelect.shapes.toggle(this.clickedshape);
				} else {
					editor.multiSelect.shapes.select(this.clickedshape);
				}

				if (this.clickedshape.objType === 'ComponentInstance') {
					clickTool('shapeEdit');
				} else {
					setCursor('arrowSquare');
				}

				editor.publish('selectedShape', this.clickedshape);
				editor.nav.panel = 'Attributes';
			}

			// Resized a shape
			// if (this.resizing || this.rotating) editor.multiSelect.shapes.calcMaxes();
			updateCurrentGlyphWidth();

			// Finish Up
			this.clickedshape = false;
			this.didstuff = false;
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
			if (eh.undoQueueHasChanged)
				historyPut('Path Edit tool');
			eh.undoQueueHasChanged = false;
			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_ShapeEdit mouseup' });
			// log('EVENTHANDLER - after Tool_ShapeEdit Mouse Up REDRAW');
		};
	}
}
