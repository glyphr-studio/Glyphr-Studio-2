// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------

import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { cXsX, cYsY } from '../canvas-edit.js';
import { setCursor } from '../cursors.js';
import { isOverControlPoint } from '../draw_shapes.js';
import { checkForMouseOverHotspot, clickEmptySpace, eventHandlerData, findAndCallHotspot } from '../events_mouse.js';
import { getShapeAtLocation } from './tools.js';

export class Tool_PathEdit {
	constructor() {
		this.dragging = false;
		this.controlpoint = false;

		this.mousedown = function(ev) {
			// log('Tool_PathEdit.mousedown', 'start');
			let ehd = eventHandlerData;
			let editor = getCurrentProjectEditor();
			let view = editor.view;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;
			let targetSize = getCurrentProject().projectSettings.pointSize / view.dz;
			this.controlpoint = isOverControlPoint(
				editor.selectedWorkItem,
				cXsX(ehd.mouseX, view),
				cYsY(ehd.mouseY, view),
				targetSize,
				ehd.multi
			);
			let clickedShape = getShapeAtLocation(ehd.mouseX, ehd.mouseY);

			// log(this.controlpoint);
			if (this.controlpoint) {
				this.dragging = true;
				if (this.controlpoint.type === 'p') {
					if (ehd.multi)
						editor.multiSelect.points.toggle(this.controlpoint.point);
					else if (!editor.multiSelect.points.isSelected(this.controlpoint.point))
						editor.multiSelect.points.select(this.controlpoint.point);
					setCursor('penSquare');
				} else {
					editor.multiSelect.points.handleSingleton = this.controlpoint.point;
					setCursor('penCircle');
				}

				// selectShapesThatHaveSelectedPoints();
			} else if (clickedShape) {
				clickEmptySpace();
				editor.multiSelect.shapes.select(clickedShape);
			} else {
				// editor.multiSelect.shapes.calcMaxes();
				clickEmptySpace();
				findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}

			if (editor.multiSelect.shapes.members.length) editor.nav.panel = 'Attributes';
			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_PathEdit mousedown' });
			// log('Tool_PathEdit.mousedown', 'end');
		};

		this.mousemove = function(ev) {
			log('Tool_PathEdit.mousemove', 'start');
			let ehd = eventHandlerData;
			let editor = getCurrentProjectEditor();
			let view = editor.view;
			let sp = editor.multiSelect.points;

			if (ehd.toolHandoff) {
				ehd.toolHandoff = false;
				this.controlpoint = {
					type: 'h2',
					point: spsingleton,
				};

				this.controlpoint.point.h2.use = true;
				this.controlpoint.point.h2.x = cXsX(ehd.mouseX, view);
				this.controlpoint.point.h2.y = cYsY(ehd.mouseY, view);
				editor.multiSelect.points.handleSingleton = this.controlpoint.point;

				this.dragging = true;

				// log('toolHandoff this.controlpoint = ');
				// log(this.controlpoint);
			}

			if (this.dragging) {
				// log('Dragging');
				// Moving points if mousedown
				let dz = view.dz;
				let dx = (ehd.mouseX - ehd.lastX) / dz;
				let dy = (ehd.lastY - ehd.mouseY) / dz;
				let cpt = this.controlpoint.type;

				if (this.controlpoint.type === 'p') setCursor('penSquare');
				else setCursor('penCircle');

				if (sp.members.length === 1) {
					// log('this.controlpoint.point ' + this.controlpoint.point);
					// log('this.controlpoint.type ' + cpt);
					let cpx = this.controlpoint.point[cpt];
					if (cpx && cpx.xLock) dx = 0;
					if (cpx && cpx.yLock) dy = 0;
				}

				sp.members.forEach(function (point, i) {
					// log('UpdatePPP ' + cpt + '\t' + dx + '\t' + dy);
					if (ev.ctrlKey || ev.metaKey) return;
					point.updatePathPointPosition(cpt, dx, dy);
				});
				// editor.multiSelect.shapes.calcMaxes();
				ehd.lastX = ehd.mouseX;
				ehd.lastY = ehd.mouseY;
				ehd.undoQueueHasChanged = true;
				// selectShapesThatHaveSelectedPoints();
				redraw({ calledBy: 'Event Handler Tool_PathEdit mousemove' });
			}

			checkForMouseOverHotspot(ehd.mouseX, ehd.mouseY);

			let targetSize = getCurrentProject().projectSettings.pointSize / view.dz;
			let cp = editor.multiSelect.shapes.isOverControlPoint(
				cXsX(ehd.mouseX, view),
				cYsY(ehd.mouseY, view),
				targetSize
			);
			if (cp.type === 'p') setCursor('penSquare');
			else if (editor.multiSelect.points.isSelected(cp.point)) setCursor('penCircle');
			if (!cp && ehd.multi) setCursor('penPlus');

			log('Tool_PathEdit.mousemove', 'end');
		};

		this.mouseup = function() {
			// log('Tool_PathEdit.mouseup', 'start');
			let ehd = eventHandlerData;
			this.dragging = false;
			this.controlpoint = false;
			ehd.toolHandoff = false;
			let editor = getCurrentProjectEditor();
			editor.multiSelect.points.handleSingleton = false;
			ehd.lastX = -100;
			ehd.lastY = -100;

			if (ehd.undoQueueHasChanged) {
				// editor.multiSelect.shapes.calcMaxes();
				updateCurrentGlyphWidth();
				historyPut('Path Edit tool');
				ehd.undoQueueHasChanged = false;
				redraw({ calledBy: 'Event Handler Tool_PathEdit mouseup' });
			}
			// log('Tool_PathEdit.mouseup', 'end');
		};
	}
}
