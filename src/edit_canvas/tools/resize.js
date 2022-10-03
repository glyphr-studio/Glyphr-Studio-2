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
		this.dragSelecting = false;
		this.didStuff = false;
		this.clickedPath = false;
		eventHandlerData.handle = false;

		this.mousedown = function (ev) {
			// log('Tool_Resize.mousedown', 'start');
			// log('x:y ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			this.didStuff = false;
			let ehd = eventHandlerData;
			ehd.handle = false;
			ehd.lastX = ehd.mouseX;
			ehd.firstX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;
			ehd.firstY = ehd.mouseY;

			this.clickedPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);
			const editor = getCurrentProjectEditor();
			let selectedPaths = editor.multiSelect.paths;

			ehd.handle = selectedPaths.isOverBoundingBoxHandle(ehd.mouseX, ehd.mouseY);

			// log('clickedPath: ' + this.clickedPath);
			// log('corner: ' + ehd.handle);
			this.resizing = false;
			this.dragging = false;
			this.rotating = false;
			this.dragSelecting = false;

			if (ehd.handle) {
				if (ehd.handle === 'rotate') {
					// log('mousedown - setting rotating = true');
					this.rotating = true;
					ehd.rotationCenter = selectedPaths.maxes.center;
					ehd.rotationStartTopY =
						selectedPaths.maxes.yMax +
						editor.rotateHandleHeight / editor.view.dz;
				} else {
					// log('clicked on ehd.handle: ' + ehd.handle);
					this.resizing = true;
				}
				setCursor(ehd.handle);
			} else if (this.clickedPath) {
				// log('clicked on path = true');
				this.dragging = true;
			} else if (!ehd.isCtrlDown) {
				// log('clicked on nothing');
				clickEmptySpace();
				this.dragSelecting = true;
				// TODO hotspots
				// findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}

			// editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_Resize mousedown' });
		};


		this.mousemove = function (ev) {
			// log(`Tool_Resize.mousemove`, 'start');

			let ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			let selectedPaths = editor.multiSelect.paths;
			this.didStuff = false;
			let corner = ehd.handle || selectedPaths.isOverBoundingBoxHandle(ehd.mouseX, ehd.mouseY);
			// TODO rapidly shaking new basic paths makes straight sides curved
			if (this.dragging) {
				// log('detected DRAGGING');

				let dz = editor.view.dz;
				let dx = (ehd.mouseX - ehd.lastX) / dz || 0;
				let dy = (ehd.lastY - ehd.mouseY) / dz || 0;
				let cur = 'arrowSquare';

				if (this.clickedPath) {
					if (ehd.isCtrlDown)
						selectedPaths.add(this.clickedPath);
					else if (!selectedPaths.isSelected(this.clickedPath)) {
						selectedPaths.select(this.clickedPath);
					}

					if (this.clickedPath.objType === 'ComponentInstance')
						clickTool('pathEdit');
					editor.nav.panel = 'Attributes';
				}

				let singlePath = selectedPaths.singleton;

				if (singlePath) {
					cur = selectedPaths.isOverBoundingBoxHandle(ehd.mouseX, ehd.mouseY);
					if (!cur) cur = getPathAtLocation(ehd.mouseX, ehd.mouseY) ? 'arrowSquare' : 'arrow';
					// log(`singleton`);
					dx = singlePath.xLock ? 0 : dx;
					dy = singlePath.yLock ? 0 : dy;
				}

				// log(`dx: ${dx}`);
				// log(`dy: ${dy}`);

				selectedPaths.updatePathPosition(dx, dy);
				this.didStuff = true;
				setCursor(cur);

			} else if (this.resizing) {
				// log('detected RESIZING');
				resizePath();
				this.didStuff = true;

			} else if (this.rotating) {
				// log(`detected ROTATING`);
				let a1 = calculateAngle({ x: cXsX(ehd.mouseX), y: cYsY(ehd.mouseY) }, ehd.rotationCenter);
				let a2 = calculateAngle({ x: cXsX(ehd.lastX), y: cYsY(ehd.lastY) }, ehd.rotationCenter);
				selectedPaths.rotate(a1 - a2, ehd.rotationCenter);
				this.didStuff = true;
				setCursor('rotate');

			} else if (corner) {
				// log(`detected CORNER HOVER ${corner}`);
				// hovering over a corner
				setCursor(corner);

			} else if (ehd.isCtrlDown) {
				// log(`detected MULTI-SELECT`);
				setCursor('arrowPlus');

			} else if (getPathAtLocation(ehd.mouseX, ehd.mouseY)) {
				// log(`detected PATH HOVER`);
				setCursor('arrowSquare');

			} else {
				// log('detected NOTHING');
				setCursor('arrow');
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


		this.mouseup = function () {
			// log('Mouse Up');
			let ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();

			// New Basic Path
			if (ehd.newBasicPathMaxes) {
				ehd.newBasicPathMaxes = false;
				ehd.lastX = ehd.firstX;
				ehd.lastY = ehd.firstY;
				resizePath();
			}

			// Clicked a path to select
			if (this.clickedPath && !this.didStuff) {
				if (ehd.isCtrlDown) {
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
			ehd.handle = false;
			ehd.lastX = -100;
			ehd.lastY = -100;
			ehd.firstX = -100;
			ehd.firstY = -100;
			ehd.rotationCenter = false;
			ehd.rotationStartTopY = false;
			// TODO history
			// if (ehd.undoQueueHasChanged) historyPut('Path Edit tool');
			ehd.undoQueueHasChanged = false;
			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_Resize mouseup' });
			// log('EVENTHANDLER - after Tool_Resize Mouse Up REDRAW');
		};
	}
}
