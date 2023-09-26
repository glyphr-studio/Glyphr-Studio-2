// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { setCursor } from '../cursors.js';
import {
	isOverControlPoint,
} from '../detect_edit_affordances.js';
import { checkForMouseOverHotspot, clickEmptySpace } from '../events_mouse.js';
import { getShapeAtLocation } from './tools.js';
import { eventHandlerData } from '../events.js';
import { findAndCallHotspot } from '../context_characters.js';

export class Tool_PathEdit {
	constructor() {
		this.dragging = false;
		this.monitorForDeselect = false;
		this.controlPoint = false;
		this.pathPoint = false;
		this.historyTitle = 'Path edit tool';

		// --------------------------------------------------------------
		// Mouse Down
		// --------------------------------------------------------------
		this.mousedown = function () {
			// log('Tool_PathEdit.mousedown', 'start');
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const msPoints = editor.multiSelect.points;
			const msShapes = editor.multiSelect.shapes;
			const view = editor.view;
			ehd.lastX = ehd.mousePosition.x;
			ehd.lastY = ehd.mousePosition.y;
			this.historyTitle = 'Path edit tool';

			const clickedPath = getShapeAtLocation(ehd.mousePosition.x, ehd.mousePosition.y);

			// log(`getShapeAtLocation:`);
			// log(clickedPath);

			let checkPoints = ehd.isCtrlDown ? editor.selectedItem : msShapes.allPathPoints;
			let clickDetection = isOverControlPoint(
				checkPoints,
				cXsX(ehd.mousePosition.x, view),
				cYsY(ehd.mousePosition.y, view)
			);

			if (clickDetection) {
				// log(`\n⮟clickDetection⮟`);
				// log(clickDetection);
				this.pathPoint = clickDetection.pathPoint;
				if (clickDetection.controlPoint === 'p') this.controlPoint = clickDetection.pathPoint.p;
				if (clickDetection.controlPoint === 'h1') this.controlPoint = clickDetection.pathPoint.h1;
				if (clickDetection.controlPoint === 'h2') this.controlPoint = clickDetection.pathPoint.h2;
			}

			if (this.controlPoint) {
				// log('detected CONTROL POINT');
				this.dragging = true;
				const isPathPointSelected = msPoints.isSelected(this.pathPoint);

				if (this.controlPoint.type === 'p') {
					// log('detected P');

					if (ehd.isCtrlDown) {
						// log('Multi Select Mode');
						if (isPathPointSelected) {
							// If we don't drag the points, deselect on mouseup
							this.monitorForDeselect = true;
						} else {
							msPoints.add(this.pathPoint);
							editor.selectPathsThatHaveSelectedPoints();
							this.historyTitle = `Moved ${msPoints.length} path points`;
						}
					} else {
						// log('Single Select Mode');
						if (isPathPointSelected) {
							// If we don't drag the point, deselect on mouseup
							this.monitorForDeselect = true;
						} else {
							msPoints.select(this.pathPoint);
							editor.selectPathsThatHaveSelectedPoints();
							this.historyTitle = `Moved path point: ${this.pathPoint.pointNumber}`;
						}
					}
				} else {
					// log('detected HANDLE');
					msPoints.singleHandle = this.controlPoint.type;
					this.historyTitle = `Moved path point: ${this.pathPoint.pointNumber} ${this.controlPoint.type}`;
					// log(`set ms.singleHandle: ${msPoints.singleHandle}`);
					// setCursor('penCircle');
				}

				// selectPathsThatHaveSelectedPoints();
			} else if (clickedPath) {
				// log('detected PATH');
				clickEmptySpace();
				msShapes.select(clickedPath);
			} else {
				// log('detected NOTHING');
				clickEmptySpace();
				findAndCallHotspot(ehd.mousePosition.x, ehd.mousePosition.y);
			}

			// if (msShapes.members.length) editor.nav.panel = 'Attributes';
			// log('Tool_PathEdit.mousedown', 'end');
		};

		// --------------------------------------------------------------
		// Mouse Move
		// --------------------------------------------------------------
		this.mousemove = function () {
			// log('Tool_PathEdit.mousemove', 'start');
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();
			const msPoints = editor.multiSelect.points;
			const view = editor.view;

			if (ehd.toolHandoff) {
				ehd.toolHandoff = false;
				this.controlPoint = msPoints.singleton.h2;

				this.controlPoint.parent.h2.use = true;
				this.controlPoint.parent.h2.x = cXsX(ehd.mousePosition.x, view);
				this.controlPoint.parent.h2.y = cYsY(ehd.mousePosition.y, view);
				msPoints.singleHandle = this.controlPoint.type;

				this.historyTitle = `Added new path: ${this.pathPoint.parent.name}`;
				this.dragging = true;

				// log('toolHandoff this.controlPoint = ');
				// log(this.controlPoint);
			}

			if (this.dragging) {
				// log('Dragging');
				// Moving points if mousedown
				this.monitorForDeselect = false;
				let dx = (ehd.mousePosition.x - ehd.lastX) / view.dz;
				let dy = (ehd.lastY - ehd.mousePosition.y) / view.dz;
				const cpt = this.controlPoint.type;

				if (msPoints.members.length === 1) {
					if (this.controlPoint && this.controlPoint.xLock) dx = 0;
					if (this.controlPoint && this.controlPoint.yLock) dy = 0;
					if (cpt === 'p') {
						this.historyTitle = `Moved path point: ${this.pathPoint.pointNumber}`;
					}
				} else {
					if (cpt === 'p') {
						this.historyTitle = `Moved ${msPoints.members.length} path points`;
					}
				}

				// log(`dragging with ms.singleHandle: ${msPoints.singleHandle}`);
				// log(`dx: ${dx}, dy: ${dy}`);
				msPoints.updatePathPointPosition(dx, dy);

				ehd.lastX = ehd.mousePosition.x;
				ehd.lastY = ehd.mousePosition.y;
				ehd.undoQueueHasChanged = true;
				editor.publish(`currentPathPoint`, this.controlPoint.parent);
			}

			checkForMouseOverHotspot(ehd.mousePosition.x, ehd.mousePosition.y);

			// Figure out cursor
			let hoverDetection;
			let hcpIsSelected;

			if (ehd.isCtrlDown) {
				// Multi-selection

				hoverDetection = isOverControlPoint(
					editor.selectedItem,
					cXsX(ehd.mousePosition.x, view),
					cYsY(ehd.mousePosition.y, view)
				);
				hcpIsSelected = hoverDetection && msPoints.isSelected(hoverDetection.pathPoint);

				if (hoverDetection.controlPoint === 'p') {
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
				hoverDetection = isOverControlPoint(
					editor.multiSelect.shapes.allPathPoints,
					cXsX(ehd.mousePosition.x, view),
					cYsY(ehd.mousePosition.y, view)
				);
				hcpIsSelected = hoverDetection && msPoints.isSelected(hoverDetection.pathPoint);

				if (hoverDetection.controlPoint === 'p') {
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
				msPoints.remove(this.pathPoint);
			}

			if (ehd.undoQueueHasChanged) {
				editor.history.addState(this.historyTitle);
				ehd.undoQueueHasChanged = false;
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

			// log('Tool_PathEdit.mouseup', 'end');
		};
	}
}
