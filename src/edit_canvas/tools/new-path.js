// ----------------------------------------------------------------
// New Path - adds many points to a new path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';

export class Tool_NewPath {
	constructor() {
		this.dragging = false;
		this.firstPoint = true;
		this.currentPoint = {};
		this.newPath = false;

		this.mousedown = function (ev) {
			// log('Tool_NewPath.mousedown', 'start');
			const editor = getCurrentProjectEditor();
			let ehd = eventHandlerData;
			let newPoint = new PathPoint({
				p: { point: { x: cXsX(ehd.mouseX), y: cYsY(ehd.mouseY) } },
				h1: {
					point: { x: cXsX(ehd.mouseX - 100), y: cYsY(ehd.mouseY) },
					use: false,
				},
				h2: {
					point: { x: cXsX(ehd.mouseX + 100), y: cYsY(ehd.mouseY) },
					use: false,
				},
				type: 'flat',
			});

			if (this.firstPoint) {
				// make a new path with the new PathPoint
				let count = editor.nav.page === 'components' ?
					Object.keys(getCurrentProject().components).length :
					getSelectedItem.paths.length;
				this.newPath = addPathToCurrentItem(
					new Path({ name: 'Path ' + count, path: new Path() })
				);
				this.currentPoint = this.newPath.addPathPoint(newPoint);
			} else if (this.newPath) {
				if (isOverFirstPoint(this.newPath, cXsX(ehd.mouseX), cYsY(ehd.mouseY),)) {
					// clicked on an existing control point in this path
					// if first point - close the path
					ehd.toolHandoff = true;
					ehd.tool_pathEdit.dragging = true;
					ehd.lastX = ehd.mouseX;
					ehd.lastY = ehd.mouseY;
					editor.multiSelect.points.select(this.newPath.pathPoints[0]);
					editor.selectedTool = 'pathEdit';

					this.dragging = false;
					this.firstPoint = false;
					this.currentPoint = {};

					redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
					return;
				}

				this.currentPoint = this.newPath.addPathPoint(newPoint);
				// editor.multiSelect.points.select(this.currentPoint);
			}

			this.firstPoint = false;
			this.dragging = true;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;

			redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
			// log('Tool_NewPath.mousedown', 'end');
		};

		this.mousemove = function (ev) {
			let ehd = eventHandlerData;

			if (this.dragging) {
				// avoid really small handles
				if (Math.abs(this.currentPoint.p.x - cXsX(ehd.mouseX)) >
					getCurrentProject().projectSettings.pointSize * 2 ||
					Math.abs(this.currentPoint.p.y - cYsY(ehd.mouseY)) >
					getCurrentProject().projectSettings.pointSize * 2) {
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

				redraw({ calledBy: 'Event Handler Tool_NewPath mousemove' });
			} else if (this.newPath &&
				isOverFirstPoint(this.newPath, cXsX(ehd.mouseX), cYsY(ehd.mouseY))) {
				setCursor('penSquare');
			} else {
				setCursor('penPlus');
			}
		};

		this.mouseup = function () {
			// log('Tool_NewPath.mouseup', 'start');
			setCursor('penPlus');

			if (eventHandlerData.undoQueueHasChanged) {
				// if (this.newPath) this.newPath.recalculateMaxes();
				// updateCurrentGlyphWidth();
				// For new path tools, mouse up always adds to the undo-queue
				historyPut('New Path tool');
				eventHandlerData.undoQueueHasChanged = false;
				redraw({ calledBy: 'Event Handler Tool_NewPath mouseup' });
			}

			this.dragging = false;
			this.firstPoint = false;
			this.currentPoint = {};
			eventHandlerData.lastX = -100;
			eventHandlerData.lastY = -100;
			// log('Tool_NewPath.mouseup', 'end');
		};
	}
}
