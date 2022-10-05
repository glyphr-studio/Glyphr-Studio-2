// ----------------------------------------------------------------
// Path Add Point - adds points to an existing path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { eventHandlerData } from '../events.js';

export class Tool_PathAddPoint {
	constructor() {
		this.addPoint = false;
		this.mousedown = function (ev) {
			const editor = getCurrentProjectEditor();
			let singlePath = editor.multiSelect.paths.singleton;
			let s = getPathAtLocation(eventHandlerData.mouseX, eventHandlerData.mouseY);

			if (this.addPoint && singlePath && singlePath.objType !== 'ComponentInstance') {
				let p = singlePath.insertPathPoint(this.addPoint.point, this.addPoint.split);
				if (p) editor.multiSelect.points.select(p);
				// historyPut('Added point to path');
			} else if (s) {
				editor.multiSelect.points.clear();
				if (eventHandlerData.isCtrlDown) editor.multiSelect.paths.add(s);
				else editor.multiSelect.paths.select(s);

				if (s.objType === 'ComponentInstance') clickTool('pathEdit');
				editor.nav.panel = 'Attributes';
			} else {
				editor.selectedTool = 'newPath';
				eventHandlerData.currentToolHandler = eventHandlerData.tool_addPath;
				eventHandlerData.currentToolHandler.dragging = true;
				eventHandlerData.currentToolHandler.firstPoint = true;
				eventHandlerData.currentToolHandler.mousedown(ev);
			}

			eventHandlerData.hoverPoint = false;
			redraw({ calledBy: 'Tool_PathAddPoint.mousedown' });
		};

		this.mousemove = function (ev) {
			const editor = getCurrentProjectEditor();
			let singlePath = editor.multiSelect.paths.singleton;
			if (singlePath) {
				let pt = singlePath.findClosestPointOnCurve({
					x: cXsX(eventHandlerData.mouseX),
					y: cYsY(eventHandlerData.mouseY),
				});
				if (pt && pt.distance < 20) {
					this.addPoint = pt;
					let ptsize = getCurrentProject().projectSettings.pointSize;
					let ptx = sXcX(pt.x) - ptsize / 2;
					let pty = sYcY(pt.y) - ptsize / 2;
					openNotation('x: ' + round(pt.x, 3) + '<br>y: ' + round(pt.y, 3), ptx, pty);
					eventHandlerData.hoverPoint = {
						fill: accentColors.blue.l75,
						x: ptx,
						y: pty,
						size: ptsize,
					};
				} else {
					this.addPoint = false;
					eventHandlerData.hoverPoint = false;
					closeNotation();
				}
			} else {
				this.addPoint = false;
				eventHandlerData.hoverPoint = false;
				closeNotation();
			}

			redraw({ calledBy: 'Tool_PathAddPoint.mousemove', redrawPanels: false });
		};

		this.mouseup = function () {};
	}
}
