import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { insertAfter, makeElement } from '../../common/dom.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { setCursor } from '../cursors.js';
import { isOverFirstPoint } from '../detect_edit_affordances.js';
import { canvasUIPointSize } from '../draw_edit_affordances.js';
import { cXsX, cYsY, sXcX, sYcY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { checkForFirstShapeAutoRSB, selectTool } from './tools.js';

/**
	// ----------------------------------------------------------------
	// New Path - adds many points to a new path (Pen Plus)
	// ----------------------------------------------------------------
 */
export class Tool_NewPath {
	constructor() {
		this.dragging = false;
		this.firstPoint = true;
		this.currentPoint = {};
		/** @type {Path | false} */
		this.newPath = false;
	}
	mousedown() {
		// log('Tool_NewPath.mousedown', 'start');
		const editor = getCurrentProjectEditor();
		const ehd = eventHandlerData;
		const msShapes = editor.multiSelect.shapes;
		const msPoints = editor.multiSelect.points;

		// New point
		// log(`editor.project.settings.font.upm: ${editor.project.settings.font.upm}`);
		let newPoint = new PathPoint({ projectUPM: editor.project.settings.font.upm });
		newPoint.p.x = cXsX(ehd.mousePosition.x);
		newPoint.p.y = cYsY(ehd.mousePosition.y);

		if (eventHandlerData.isShiftDown) newPoint.roundAll(0);

		// Ensure selection
		if (this.newPath) {
			if (!msShapes.isSelected(this.newPath)) {
				msShapes.select(this.newPath);
			}
		}

		// log(`this.firstPoint: ${this.firstPoint}`);
		// log(`this.newPath: ${this.newPath}`);

		if (this.firstPoint) {
			// make a new path with the new PathPoint
			let count =
				editor.nav.page === 'components'
					? Object.keys(getCurrentProject().components).length
					: editor.selectedItem.shapes.length;

			count += 1;

			this.newPath = editor.selectedItem.addOneShape(new Path({ name: 'Path ' + count }));
			// log(`\n⮟this.newPath⮟`);
			// log(this.newPath);
			if (this.newPath) {
				this.currentPoint = this.newPath.addPathPoint(newPoint);
				msShapes.select(this.newPath);
				msPoints.select(this.currentPoint);
				editor.publish('whichPathPointIsSelected', this.currentPoint);
				this.showDoneCreatingPathButton();
			}
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

		// log(`\n⮟this.currentPoint⮟`);
		// log(this.currentPoint);
		this.firstPoint = false;
		this.dragging = true;
		ehd.lastX = ehd.mousePosition.x;
		ehd.lastY = ehd.mousePosition.y;

		// log('Tool_NewPath.mousedown', 'end');
	}

	mousemove() {
		const ehd = eventHandlerData;
		const editor = getCurrentProjectEditor();

		if (this.dragging) {

					// log(`\n⮟this.currentPoint⮟`);
					// log(this.currentPoint);
			// avoid really small handles
			if (
				Math.abs(sXcX(this.currentPoint.p.x) - ehd.mousePosition.x) > canvasUIPointSize ||
				Math.abs(sYcY(this.currentPoint.p.y) - ehd.mousePosition.y) > canvasUIPointSize
			) {
				this.currentPoint.h1.use = true;
				this.currentPoint.h2.use = true;
				this.currentPoint.h2.x = cXsX(ehd.mousePosition.x);
				this.currentPoint.h2.y = cYsY(ehd.mousePosition.y);
				this.currentPoint.makeSymmetric('h2');
			}

			if (eventHandlerData.isShiftDown) this.currentPoint.roundAll(0);

			setCursor('penCircle');
			ehd.lastX = ehd.mousePosition.x;
			ehd.lastY = ehd.mousePosition.y;
			ehd.undoQueueHasChanged = true;

			editor.publish('currentPathPoint', this.currentPoint);
		} else if (
			this.newPath &&
			isOverFirstPoint(this.newPath, cXsX(ehd.mousePosition.x), cYsY(ehd.mousePosition.y))
		) {
			setCursor('penSquare');
		} else {
			setCursor('penPlus');
		}
	}

	mouseup() {
		// log('Tool_NewPath.mouseup', 'start');
		const editor = getCurrentProjectEditor();
		setCursor('penPlus');

		if (eventHandlerData.undoQueueHasChanged) {
			// For new path tools, mouse up always adds to the undo-queue
			editor.history.addState(`New path: added point ${this.currentPoint.pointNumber}`);
			eventHandlerData.undoQueueHasChanged = false;
		}

		if (eventHandlerData.isShiftDown) {
			this.currentPoint.roundAll(0);
			editor.publish('currentPathPoint', this.currentPoint);
		}

		this.dragging = false;
		this.firstPoint = false;
		this.currentPoint = {};
		eventHandlerData.lastX = -100;
		eventHandlerData.lastY = -100;
		// log('Tool_NewPath.mouseup', 'end');
	}

	showDoneCreatingPathButton() {
		let finishPath = makeElement({
			tag: 'button',
			className: 'editor-page__tool-selected',
			id: 'done-creating-path-button',
			title: 'Done creating path',
			content: 'Done creating path',
		});
		finishPath.addEventListener('click', removeStopCreatingNewPathButton);

		insertAfter(document.querySelector('#editor-page__edit-canvas'), finishPath);
		// document.body.appendChild(finishPath);
	}
}

/**
 * Removes (hides) the "Stop creating new path" button.
 * Also calls `stopCreatingNewPath` for instances where
 * the path creation ends, but not because of this button.
 */
export function removeStopCreatingNewPathButton() {
	checkForFirstShapeAutoRSB();
	if (document.querySelector('#done-creating-path-button')) {
		stopCreatingNewPath();
		selectTool('pathEdit');
	}
}

/**
 * Event handler for the "Stop creating new path" button.
 */
export function stopCreatingNewPath() {
	let editor = getCurrentProjectEditor();
	let newPathTool = editor.eventHandlers.tool_addPath;
	newPathTool.newPath = false;
	newPathTool.firstPoint = true;
	let doneButton = document.querySelector('#done-creating-path-button');
	if (doneButton) doneButton.remove();
}
