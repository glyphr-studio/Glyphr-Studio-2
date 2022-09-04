// ----------------------------------------------------------------
// New Path - adds many points to a new path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';

export class Tool_NewPath {
	constructor() {
		this.dragging = false;
		this.firstpoint = true;
		this.currpt = {};
		this.newShape = false;

		this.mousedown = function (ev) {
			// log('Tool_NewPath.mousedown', 'start');
			let editor = getCurrentProjectEditor();
			let eh = eventHandlerData;
			let newpoint = new PathPoint({
				p: { point: { x: cXsX(eh.mouseX), y: cYsY(eh.mouseY) } },
				h1: {
					point: { x: cXsX(eh.mouseX - 100), y: cYsY(eh.mouseY) },
					use: false,
				},
				h2: {
					point: { x: cXsX(eh.mouseX + 100), y: cYsY(eh.mouseY) },
					use: false,
				},
				type: 'flat',
			});

			if (this.firstpoint) {
				// make a new shape with the new pathpoint
				let count = editor.nav.page === 'components' ?
					Object.keys(getCurrentProject().components).length :
					getSelectedWorkItemShapes().length;
				this.newShape = action_addShape(
					new Shape({ name: 'Shape ' + count, path: new Path() })
				);
				this.currpt = this.newShape.path.addPathPoint(newpoint);
			} else if (this.newShape) {
				if (isOverFirstPoint(this.newShape.path, cXsX(eh.mouseX), cYsY(eh.mouseY),)) {
					// clicked on an existing control point in this path
					// if first point - close the path
					eh.toolHandoff = true;
					eh.tool_pathEdit.dragging = true;
					eh.lastX = eh.mouseX;
					eh.lastY = eh.mouseY;
					let editor = getCurrentProjectEditor();
					editor.multiSelect.points.select(this.newShape.path.pathPoints[0]);
					editor.selectedTool = 'pathEdit';

					this.dragging = false;
					this.firstpoint = false;
					this.currpt = {};

					redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
					return;
				}

				this.currpt = this.newShape.path.addPathPoint(newpoint);
				// editor.multiSelect.points.select(this.currpt);
			}

			this.firstpoint = false;
			this.dragging = true;
			eh.lastX = eh.mouseX;
			eh.lastY = eh.mouseY;

			redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
			// log('Tool_NewPath.mousedown', 'end');
		};

		this.mousemove = function (ev) {
			let eh = eventHandlerData;

			if (this.dragging) {
				// avoid really small handles
				if (Math.abs(this.currpt.p.x - cXsX(eh.mouseX)) >
					getCurrentProject().projectSettings.pointSize * 2 ||
					Math.abs(this.currpt.p.y - cYsY(eh.mouseY)) >
					getCurrentProject().projectSettings.pointSize * 2) {
					this.currpt.h1.use = true;
					this.currpt.h2.use = true;
					this.currpt.h2.x = cXsX(eh.mouseX);
					this.currpt.h2.y = cYsY(eh.mouseY);
					this.currpt.makeSymmetric('h2');
				}

				setCursor('penCircle');
				eh.lastX = eh.mouseX;
				eh.lastY = eh.mouseY;
				eh.undoQueueHasChanged = true;

				redraw({ calledBy: 'Event Handler Tool_NewPath mousemove' });
			} else if (this.newShape &&
				isOverFirstPoint(this.newShape.path, cXsX(eh.mouseX), cYsY(eh.mouseY))) {
				setCursor('penSquare');
			} else {
				setCursor('penPlus');
			}
		};

		this.mouseup = function () {
			// log('Tool_NewPath.mouseup', 'start');
			setCursor('penPlus');

			if (eventHandlerData.undoQueueHasChanged) {
				// if (this.newShape) this.newShape.path.calcMaxes();
				updateCurrentGlyphWidth();
				// For new shape tools, mouse up always adds to the undo-queue
				historyPut('New Path tool');
				eventHandlerData.undoQueueHasChanged = false;
				redraw({ calledBy: 'Event Handler Tool_NewPath mouseup' });
			}

			this.dragging = false;
			this.firstpoint = false;
			this.currpt = {};
			eventHandlerData.lastX = -100;
			eventHandlerData.lastY = -100;
			// log('Tool_NewPath.mouseup', 'end');
		};
	}
}
