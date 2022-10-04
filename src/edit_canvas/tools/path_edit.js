// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------

import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { setCursor } from '../cursors.js';
import { isOverControlPoint } from '../draw_paths.js';
import { checkForMouseOverHotspot, clickEmptySpace, findAndCallHotspot } from '../events_mouse.js';
import { getPathAtLocation } from './tools.js';
import { eventHandlerData } from '../events.js';

export class Tool_PathEdit {
	constructor() {
		this.dragging = false;
		this.controlPoint = false;

		this.mousedown = function(ev) {
			// log('Tool_PathEdit.mousedown', 'start');
			let ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			let view = editor.view;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;
			this.controlPoint = isOverControlPoint(
				editor.selectedItem,
				cXsX(ehd.mouseX, view),
				cYsY(ehd.mouseY, view)
			);
			// log(`controlPoint CLICKED`);
			// log(this.controlPoint);
			let clickedPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);

			if (this.controlPoint) {
				// log('detected CONTROL POINT');
				this.dragging = true;

				if (this.controlPoint.type === 'p') {
					// log('detected P');

					if (ehd.isCtrlDown) {
						// log('Multi Select Mode');
						editor.multiSelect.points.toggle(this.controlPoint.parent);
						editor.selectPathsThatHaveSelectedPoints();
					// } else {
					} else if (!editor.multiSelect.points.isSelected(this.controlPoint.parent)){
						// log('Single Select Mode');
						editor.multiSelect.points.select(this.controlPoint.parent);
						editor.selectPathsThatHaveSelectedPoints();
						// setCursor('penSquare');
					}

				} else {
					// log('detected HANDLE');
					editor.multiSelect.points.singleHandle = this.controlPoint.type;
					// log(`set ms.singleHandle: ${editor.multiSelect.points.singleHandle}`);
					// setCursor('penCircle');
				}

				// selectPathsThatHaveSelectedPoints();
			} else if (clickedPath) {
				// log('detected PATH');
				clickEmptySpace();
				editor.multiSelect.paths.select(clickedPath);

			} else {
				// log('detected NOTHING');
				// editor.multiSelect.paths.recalculateMaxes();
				clickEmptySpace();
				// findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}

			if (editor.multiSelect.paths.members.length) editor.nav.panel = 'Attributes';
			// editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_PathEdit mousedown' });
			// log('Tool_PathEdit.mousedown', 'end');
		};


		this.mousemove = function(ev) {
			// log('Tool_PathEdit.mousemove', 'start');
			let ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			let view = editor.view;
			let selectedPoints = editor.multiSelect.points;

			if (ehd.toolHandoff) {
				ehd.toolHandoff = false;
				this.controlPoint = selectedPoints.singleton.h2;

				this.controlPoint.parent.h2.use = true;
				this.controlPoint.parent.h2.x = cXsX(ehd.mouseX, view);
				this.controlPoint.parent.h2.y = cYsY(ehd.mouseY, view);
				editor.multiSelect.points.singleHandle = this.controlPoint.type;

				this.dragging = true;

				// log('toolHandoff this.controlPoint = ');
				// log(this.controlPoint);
			}

			if (this.dragging) {
				// log('Dragging');
				// Moving points if mousedown
				let dx = (ehd.mouseX - ehd.lastX) / view.dz;
				let dy = (ehd.lastY - ehd.mouseY) / view.dz;
				let cpt = this.controlPoint.type;

				if (selectedPoints.members.length === 1) {
					if (this.controlPoint && this.controlPoint.xLock) dx = 0;
					if (this.controlPoint && this.controlPoint.yLock) dy = 0;
				}

				// log(`dragging with ms.singleHandle: ${editor.multiSelect.points.singleHandle}`);
				// log(`dx: ${dx}, dy: ${dy}`);
				selectedPoints.updatePathPointPosition(dx, dy);
				// selectedPoints.members.forEach(function (point, i) {
				// 	// log('UpdatePPP ' + cpt + '\t' + dx + '\t' + dy);
				// 	if (ev.ctrlKey || ev.metaKey) return;
				// 	point.updatePathPointPosition(cpt, dx, dy);
				// });

				ehd.lastX = ehd.mouseX;
				ehd.lastY = ehd.mouseY;
				ehd.undoQueueHasChanged = true;
				editor.publish(`currentControlPoint.${cpt}`, this.controlPoint);
				// selectPathsThatHaveSelectedPoints();
				// redraw({ calledBy: 'Event Handler Tool_PathEdit mousemove' });
			}

			// checkForMouseOverHotspot(ehd.mouseX, ehd.mouseY);

			// Figure out cursor
			let hoveredControlPoint;
			let hcpIsSelected;
			let msPoints = editor.multiSelect.points;
			let singlePoint = msPoints.singleton;

			if(ehd.isCtrlDown) {
				// Multi-selection

				hoveredControlPoint = isOverControlPoint(
					editor.selectedItem,
					cXsX(ehd.mouseX, view),
					cYsY(ehd.mouseY, view)
				);
				hcpIsSelected = hoveredControlPoint && msPoints.isSelected(hoveredControlPoint.parent);

				if (hoveredControlPoint.type === 'p') {
					// Hovered over a Point
					if(hcpIsSelected) {
						// Point is selected
						// log(`CTRL DOWN > Selected P`);
						setCursor('penSquareMinus');
					} else {
						// Point is not selected
						// log(`CTRL DOWN > Not selected P`);
						setCursor('penSquarePlus');
					}
				} else {
					// Not hovering over anything
					// log(`CTRL DOWN > Not P`);
					setCursor('penPlus');
				}

			} else {
				// Single selection
				hoveredControlPoint = isOverControlPoint(
					editor.multiSelect.paths.virtualGlyph,
					cXsX(ehd.mouseX, view),
					cYsY(ehd.mouseY, view)
				);
				hcpIsSelected = hoveredControlPoint && msPoints.isSelected(hoveredControlPoint.parent);

				if (hoveredControlPoint.type === 'p') {
					// Hovered over a Point
					if(hcpIsSelected) {
						// Point is selected
						setCursor('penSquare');
					} else {
						// Point is not selected
						setCursor('penSquare');
					}
				} else if (singlePoint && hcpIsSelected) {
					// Hovered over a handle
					setCursor('penCircle');
				} else {
					// Not hovering over anything
					setCursor('pen');
				}
			}

			// log('Tool_PathEdit.mousemove', 'end');
		};


		this.mouseup = function() {
			// log('Tool_PathEdit.mouseup', 'start');
			let ehd = eventHandlerData;
			this.dragging = false;
			this.controlPoint = false;
			ehd.toolHandoff = false;
			const editor = getCurrentProjectEditor();
			editor.multiSelect.points.singleHandle = false;
			ehd.lastX = -100;
			ehd.lastY = -100;

			if (ehd.undoQueueHasChanged) {
				// editor.multiSelect.paths.recalculateMaxes();
				// updateCurrentGlyphWidth();
				// TODO history
				// historyPut('Path Edit tool');
				// ehd.undoQueueHasChanged = false;
				// redraw({ calledBy: 'Event Handler Tool_PathEdit mouseup' });
			}
			// log('Tool_PathEdit.mouseup', 'end');
		};
	}
}
