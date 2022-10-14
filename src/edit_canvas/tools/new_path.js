// ----------------------------------------------------------------
// New Path - adds many points to a new path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { makeElement } from '../../common/dom.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { setCursor } from '../cursors.js';
import { isOverFirstPoint } from '../draw_paths.js';
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

			// New point
			let newPoint = new PathPoint();
			newPoint.p.x = cXsX(ehd.mouseX);
			newPoint.p.y = cYsY(ehd.mouseY);

			if (this.firstPoint) {
				// make a new path with the new PathPoint
				let count =
					editor.nav.page === 'components'?
						Object.keys(getCurrentProject().components).length :
						editor.selectedItem.paths.length;

				count += 1;
				this.newPath = editor.selectedItem.addOnePath(new Path({ name: 'Path ' + count }));
				this.currentPoint = this.newPath.addPathPoint(newPoint);
				editor.multiSelect.paths.select(this.newPath);
				editor.multiSelect.points.select(this.currentPoint);
				editor.publish('whichPathPointIsSelected', this.currentPoint);
				this.showDoneEditingPathButton();
			} else if (this.newPath) {
				if (isOverFirstPoint(this.newPath, cXsX(ehd.mouseX), cYsY(ehd.mouseY))) {
					// clicked on an existing control point in this path
					// if first point - close the path
					ehd.toolHandoff = true;
					editor.eventHandlers.tool_pathEdit.dragging = true;
					ehd.lastX = ehd.mouseX;
					ehd.lastY = ehd.mouseY;
					editor.multiSelect.points.select(this.newPath.pathPoints[0]);
					editor.selectedTool = 'pathEdit';
					editor.publish('whichToolIsSelected', editor.selectedTool);

					this.dragging = false;
					this.firstPoint = true;
					this.currentPoint = {};
					this.newPath = false;

					return;
				}

				this.currentPoint = this.newPath.addPathPoint(newPoint);
				editor.multiSelect.points.select(this.currentPoint);
			}

			this.firstPoint = false;
			this.dragging = true;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;

			// log('Tool_NewPath.mousedown', 'end');
		};

		this.mousemove = function (ev) {
			const ehd = eventHandlerData;
			const editor = getCurrentProjectEditor();

			if (this.dragging) {
				// avoid really small handles
				let ps2 = getCurrentProject().projectSettings.pointSize * 2;
				if (
					Math.abs(this.currentPoint.p.x - cXsX(ehd.mouseX)) > ps2 ||
					Math.abs(this.currentPoint.p.y - cYsY(ehd.mouseY)) > ps2
				) {
					this.currentPoint.h1.use = true;
					this.currentPoint.h2.use = true;
					this.currentPoint.h2.x = cXsX(ehd.mouseX);
					this.currentPoint.h2.y = cYsY(ehd.mouseY);
					this.currentPoint.makeSymmetric('h2');
				}

				setCursor('penCircle');
				ehd.lastX = ehd.mouseX;
				ehd.lastY = ehd.mouseY;
				ehd.undoQueueHasChanged = true;

				editor.publish('currentControlPoint.h1', this.currentPoint.h1);
				editor.publish('currentControlPoint.h2', this.currentPoint.h2);
			} else if (
				this.newPath &&
				isOverFirstPoint(this.newPath, cXsX(ehd.mouseX), cYsY(ehd.mouseY))
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

	showDoneEditingPathButton() {
		let finishPath = makeElement({
			tag: 'button',
			className: 'edit-canvas__tool-selected',
			id: 'done-editing-path-button',
			title: 'Done editing path',
			content: 'Done editing path',
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
	let doneButton = document.getElementById('done-editing-path-button');
	if (doneButton) doneButton.remove();
}
