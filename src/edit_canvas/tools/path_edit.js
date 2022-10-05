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
		this.monitorForDeselect = false;
		this.controlPoint = false;
		this.pathPoint = false;

		// --------------------------------------------------------------
		// Mouse Down
		// --------------------------------------------------------------
		this.mousedown = function (ev) {
			log('Tool_PathEdit.mousedown', 'start');
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const msPoints = editor.multiSelect.points;
			const msPaths = editor.multiSelect.points;
			let view = editor.view;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;

			this.controlPoint = isOverControlPoint(ehd.isCtrlDown ? editor.selectedItem : msPaths.virtualGlyph, cXsX(ehd.mouseX, view), cYsY(ehd.mouseY, view));
			log(`isOverControlPoint:`);
			log(this.controlPoint);

			let clickedPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);
			log(`getPathAtLocation:`);
			log(clickedPath);

			if (this.controlPoint) {
				log('detected CONTROL POINT');
				this.dragging = true;
				this.pathPoint = this.controlPoint.parent;
				let isPathPointSelected = msPoints.isSelected(this.pathPoint);

				if (this.controlPoint.type === 'p') {
					log('detected P');

					if (ehd.isCtrlDown) {
						log('Multi Select Mode');
						if (isPathPointSelected) {
							// If we don't drag the points, deselect on mouseup
							this.monitorForDeselect = true;
						} else {
							msPoints.add(this.pathPoint);
							editor.selectPathsThatHaveSelectedPoints();
						}
					} else {
						log('Single Select Mode');
						if (isPathPointSelected) {
							// If we don't drag the point, deselect on mouseup
							this.monitorForDeselect = true;
						} else {
							msPoints.select(this.pathPoint);
							editor.selectPathsThatHaveSelectedPoints();
						}
					}
				} else {
					log('detected HANDLE');
					msPoints.singleHandle = this.controlPoint.type;
					log(`set ms.singleHandle: ${msPoints.singleHandle}`);
					// setCursor('penCircle');
				}

				// selectPathsThatHaveSelectedPoints();
			} else if (clickedPath) {
				log('detected PATH');
				clickEmptySpace();
				msPaths.select(clickedPath);
			} else {
				log('detected NOTHING');
				// msPaths.recalculateMaxes();
				clickEmptySpace();
				// findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}

			if (msPaths.members.length) editor.nav.panel = 'Attributes';
			log('Tool_PathEdit.mousedown', 'end');
		};

		// --------------------------------------------------------------
		// Mouse Move
		// --------------------------------------------------------------
		this.mousemove = function (ev) {
			// log('Tool_PathEdit.mousemove', 'start');
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const msPoints = editor.multiSelect.points;
			let view = editor.view;

			if (ehd.toolHandoff) {
				ehd.toolHandoff = false;
				this.controlPoint = msPoints.singleton.h2;

				this.controlPoint.parent.h2.use = true;
				this.controlPoint.parent.h2.x = cXsX(ehd.mouseX, view);
				this.controlPoint.parent.h2.y = cYsY(ehd.mouseY, view);
				msPoints.singleHandle = this.controlPoint.type;

				this.dragging = true;

				// log('toolHandoff this.controlPoint = ');
				// log(this.controlPoint);
			}

			if (this.dragging) {
				// log('Dragging');
				// Moving points if mousedown
				this.monitorForDeselect = false;
				let dx = (ehd.mouseX - ehd.lastX) / view.dz;
				let dy = (ehd.lastY - ehd.mouseY) / view.dz;
				let cpt = this.controlPoint.type;

				if (msPoints.members.length === 1) {
					if (this.controlPoint && this.controlPoint.xLock) dx = 0;
					if (this.controlPoint && this.controlPoint.yLock) dy = 0;
				}

				// log(`dragging with ms.singleHandle: ${msPoints.singleHandle}`);
				// log(`dx: ${dx}, dy: ${dy}`);
				msPoints.updatePathPointPosition(dx, dy);
				// msPoints.members.forEach(function (point, i) {
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

			if (ehd.isCtrlDown) {
				// Multi-selection

				hoveredControlPoint = isOverControlPoint(editor.selectedItem, cXsX(ehd.mouseX, view), cYsY(ehd.mouseY, view));
				hcpIsSelected = hoveredControlPoint && msPoints.isSelected(hoveredControlPoint.parent);

				if (hoveredControlPoint.type === 'p') {
					// Hovered over a Point
					if (hcpIsSelected) {
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
				hoveredControlPoint = isOverControlPoint(editor.multiSelect.paths.virtualGlyph, cXsX(ehd.mouseX, view), cYsY(ehd.mouseY, view));
				hcpIsSelected = hoveredControlPoint && msPoints.isSelected(hoveredControlPoint.parent);

				if (hoveredControlPoint.type === 'p') {
					// Hovered over a Point
					if (hcpIsSelected) {
						// Point is selected
						setCursor('penSquare');
					} else {
						// Point is not selected
						setCursor('penSquare');
					}
				} else if (msPoints.singleton && hcpIsSelected) {
					// Hovered over a handle
					setCursor('penCircle');
				} else {
					// Not hovering over anything
					setCursor('pen');
				}
			}

			// log('Tool_PathEdit.mousemove', 'end');
		};

		// --------------------------------------------------------------
		// Mouse Up
		// --------------------------------------------------------------
		this.mouseup = function () {
			// log('Tool_PathEdit.mouseup', 'start');
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const msPoints = editor.multiSelect.points;

			if (this.monitorForDeselect) {
				msPoints.deselect(this.pathPoint);
			}

			// set to defaults
			this.dragging = false;
			this.controlPoint = false;
			this.pathPoint = false;
			this.monitorForDeselect = false;
			ehd.toolHandoff = false;
			msPoints.singleHandle = false;
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
