// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------

import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { cXsX, cYsY } from '../edit-canvas.js';
import { setCursor } from '../cursors.js';
import { isOverControlPoint } from '../draw_paths.js';
import { checkForMouseOverHotspot, clickEmptySpace, eventHandlerData, findAndCallHotspot } from '../events_mouse.js';
import { getPathAtLocation } from './tools.js';

export class Tool_PathEdit {
	constructor() {
		this.dragging = false;
		this.controlPoint = false;

		this.mousedown = function(ev) {
			log('Tool_PathEdit.mousedown', 'start');
			let ehd = eventHandlerData;
			let editor = getCurrentProjectEditor();
			let view = editor.view;
			ehd.lastX = ehd.mouseX;
			ehd.lastY = ehd.mouseY;
			let targetSize = getCurrentProject().projectSettings.pointSize / view.dz;
			this.controlPoint = isOverControlPoint(
				editor.selectedItem,
				cXsX(ehd.mouseX, view),
				cYsY(ehd.mouseY, view),
				targetSize,
				ehd.multi
			);
			log(this.controlPoint);
			let clickedPath = getPathAtLocation(ehd.mouseX, ehd.mouseY);

			log(this.controlPoint);
			if (this.controlPoint) {
				log('detected CONTROL POINT');
				this.dragging = true;

				if (this.controlPoint.type === 'p') {
					log('detected P');

					if (ehd.multi) {
						log('Multi Select Mode');
						editor.multiSelect.points.toggle(this.controlPoint.parent);

					} else if (!editor.multiSelect.points.isSelected(this.controlPoint.parent)){
					// } else {
						log('Single Select Mode');
						editor.multiSelect.points.select(this.controlPoint.parent);
						setCursor('penSquare');
					}

				} else {
					log('detected HANDLE');
					editor.multiSelect.points.handleSingleton = this.controlPoint.point;
					setCursor('penCircle');
				}

				// selectPathsThatHaveSelectedPoints();
			} else if (clickedPath) {
				log('detected PATH');
				clickEmptySpace();
				editor.multiSelect.paths.select(clickedPath);

			} else {
				log('detected NOTHING');
				// editor.multiSelect.paths.recalculateMaxes();
				clickEmptySpace();
				findAndCallHotspot(ehd.mouseX, ehd.mouseY);
			}

			if (editor.multiSelect.paths.members.length) editor.nav.panel = 'Attributes';
			// editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_PathEdit mousedown' });
			log('Tool_PathEdit.mousedown', 'end');
		};


		this.mousemove = function(ev) {
			// log('Tool_PathEdit.mousemove', 'start');
			let ehd = eventHandlerData;
			let editor = getCurrentProjectEditor();
			let view = editor.view;
			let sp = editor.multiSelect.points;

			setCursor('pen');

			if (ehd.toolHandoff) {
				ehd.toolHandoff = false;
				this.controlPoint = {
					type: 'h2',
					point: spsingleton,
				};

				this.controlPoint.point.h2.use = true;
				this.controlPoint.point.h2.x = cXsX(ehd.mouseX, view);
				this.controlPoint.point.h2.y = cYsY(ehd.mouseY, view);
				editor.multiSelect.points.handleSingleton = this.controlPoint.point;

				this.dragging = true;

				// log('toolHandoff this.controlPoint = ');
				// log(this.controlPoint);
			}

			if (this.dragging) {
				// log('Dragging');
				// Moving points if mousedown
				let dz = view.dz;
				let dx = (ehd.mouseX - ehd.lastX) / dz;
				let dy = (ehd.lastY - ehd.mouseY) / dz;
				let cpt = this.controlPoint.type;

				if (this.controlPoint.type === 'p') setCursor('penSquare');
				else setCursor('penCircle');

				if (sp.members.length === 1) {
					// log('this.controlPoint.point ' + this.controlPoint.point);
					// log('this.controlPoint.type ' + cpt);
					let cpx = this.controlPoint.point[cpt];
					if (cpx && cpx.xLock) dx = 0;
					if (cpx && cpx.yLock) dy = 0;
				}

				sp.members.forEach(function (point, i) {
					// log('UpdatePPP ' + cpt + '\t' + dx + '\t' + dy);
					if (ev.ctrlKey || ev.metaKey) return;
					point.updatePathPointPosition(cpt, dx, dy);
				});
				// editor.multiSelect.paths.recalculateMaxes();
				ehd.lastX = ehd.mouseX;
				ehd.lastY = ehd.mouseY;
				ehd.undoQueueHasChanged = true;
				// selectPathsThatHaveSelectedPoints();
				redraw({ calledBy: 'Event Handler Tool_PathEdit mousemove' });
			}

			checkForMouseOverHotspot(ehd.mouseX, ehd.mouseY);

			let targetSize = getCurrentProject().projectSettings.pointSize / view.dz;
			let cp = editor.multiSelect.paths.isOverControlPoint(
				cXsX(ehd.mouseX, view),
				cYsY(ehd.mouseY, view),
				targetSize
			);
			if (cp.type === 'p') setCursor('penSquare');
			else if (editor.multiSelect.points.isSelected(cp.point)) setCursor('penCircle');
			if (!cp && ehd.multi) setCursor('penPlus');

			// log('Tool_PathEdit.mousemove', 'end');
		};


		this.mouseup = function() {
			log('Tool_PathEdit.mouseup', 'start');
			let ehd = eventHandlerData;
			this.dragging = false;
			this.controlPoint = false;
			ehd.toolHandoff = false;
			let editor = getCurrentProjectEditor();
			editor.multiSelect.points.handleSingleton = false;
			ehd.lastX = -100;
			ehd.lastY = -100;

			if (ehd.undoQueueHasChanged) {
				// editor.multiSelect.paths.recalculateMaxes();
				// updateCurrentGlyphWidth();
				historyPut('Path Edit tool');
				ehd.undoQueueHasChanged = false;
				redraw({ calledBy: 'Event Handler Tool_PathEdit mouseup' });
			}
			log('Tool_PathEdit.mouseup', 'end');
		};
	}
}
