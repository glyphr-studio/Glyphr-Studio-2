// ----------------------------------------------------------------
// New Path - adds many points to a new path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { makeElement } from '../../common/dom.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { setCursor } from '../cursors.js';
import { canvasUIPointSize } from '../draw_edit_affordances.js';
import { isOverFirstPoint } from '../detect_edit_affordances.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { clickTool } from './tools.js';

export class Tool_NewPath {
	constructor() {
		this.dragging = false;
		this.firstPoint = true;
		this.currentPoint = {};
		this.newPath = false;

		this.mousedown = function (ev) {
			// log('Tool_NewPath.mousedown', 'start');
			const editor = getCurrentProjectEditor();
			const ehd = eventHandlerData;
			const msPaths = editor.multiSelect.paths;
			const msPoints = editor.multiSelect.points;

			// New point
			let newPoint = new PathPoint();
			newPoint.p.x = cXsX(ehd.mousePosition.x);
			newPoint.p.y = cYsY(ehd.mousePosition.y);

			// Ensure selection
			if (this.newPath) {
				if (!msPaths.isSelected(this.newPath)) {
					msPaths.select(this.newPath);
				}
			}

			if (this.firstPoint) {
				// make a new path with the new PathPoint
				let count =
					editor.nav.page === 'components'
						? Object.keys(getCurrentProject().components).length
						: editor.selectedItem.paths.length;

				count += 1;
				this.newPath = editor.selectedItem.addOnePath(new Path({ name: 'Path ' + count }));
				this.currentPoint = this.newPath.addPathPoint(newPoint);
				msPaths.select(this.newPath);
				msPoints.select(this.currentPoint);
				editor.publish('whichPathPointIsSelected', this.currentPoint);
				this.showDoneCreatingPathButton();
			} else if (this.newPath) {
				if (isOverFirstPoint(this.newPath, cXsX(ehd.mousePosition.x), cYsY(ehd.mousePosition.y))) {
					// clicked on an existing control point in this path
					// if first point - close the path
					ehd.toolHandoff = true;
					editor.eventHandlers.tool_pathEdit.dragging = true;
					ehd.lastX = ehd.mousePosition.x;
					ehd.lastY = ehd.mousePosition.y;
					msPoints.select(this.newPath.pathPoints[0]);
					editor.selectedTool = 'pathEdit';
					editor.publish('whichToolIsSelected', editor.selectedTool);

					this.dragging = false;
					this.firstPoint = true;
					this.currentPoint = {};
					this.newPath = false;

					return;
				}

				this.currentPoint = this.newPath.addPathPoint(newPoint);
				msPoints.select(this.currentPoint);
			}

			this.firstPoint = false;
			this.dragging = true;
			ehd.lastX = ehd.mousePosition.x;
			ehd.lastY = ehd.mousePosition.y;

			// log('Tool_NewPath.mousedown', 'end');
		};

		this.mousemove = function (ev) {
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();

			if (this.dragging) {
				// avoid really small handles
				let ps2 = canvasUIPointSize * 2;
				if (
					Math.abs(this.currentPoint.p.x - cXsX(ehd.mousePosition.x)) > ps2 ||
					Math.abs(this.currentPoint.p.y - cYsY(ehd.mousePosition.y)) > ps2
				) {
					this.currentPoint.h1.use = true;
					this.currentPoint.h2.use = true;
					this.currentPoint.h2.x = cXsX(ehd.mousePosition.x);
					this.currentPoint.h2.y = cYsY(ehd.mousePosition.y);
					this.currentPoint.makeSymmetric('h2');
				}

				setCursor('penCircle');
				ehd.lastX = ehd.mousePosition.x;
				ehd.lastY = ehd.mousePosition.y;
				ehd.undoQueueHasChanged = true;

				editor.publish('currentControlPoint.h1', this.currentPoint.h1);
				editor.publish('currentControlPoint.h2', this.currentPoint.h2);
			} else if (
				this.newPath &&
				isOverFirstPoint(this.newPath, cXsX(ehd.mousePosition.x), cYsY(ehd.mousePosition.y))
			) {
				setCursor('penSquare');
			} else {
				setCursor('penPlus');
			}
		};

		this.mouseup = function () {
			// log('Tool_NewPath.mouseup', 'start');
			setCursor('penPlus');

			if (eventHandlerData.undoQueueHasChanged) {
				// For new path tools, mouse up always adds to the undo-queue
				const editor = getCurrentProjectEditor();
				editor.history.addState(`New path: added point ${this.currentPoint.pointNumber}`);
				eventHandlerData.undoQueueHasChanged = false;
			}

			this.dragging = false;
			this.firstPoint = false;
			this.currentPoint = {};
			eventHandlerData.lastX = -100;
			eventHandlerData.lastY = -100;
			// log('Tool_NewPath.mouseup', 'end');
		};
	}

	showDoneCreatingPathButton() {
		let finishPath = makeElement({
			tag: 'button',
			className: 'edit-canvas__tool-selected',
			id: 'done-creating-path-button',
			title: 'Done creating path',
			content: 'Done creating path',
		});
		finishPath.addEventListener('click', () => {
			stopCreatingNewPathPoints();
			clickTool('pathEdit');
		});

		document.body.appendChild(finishPath);
	}
}
export function stopCreatingNewPathPoints() {
	let newPathTool = getCurrentProjectEditor().eventHandlers.tool_addPath;
	newPathTool.newPath = false;
	newPathTool.firstPoint = true;
	let doneButton = document.getElementById('done-creating-path-button');
	if (doneButton) doneButton.remove();
}
