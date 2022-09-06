// ----------------------------------------------------------------
// Path Add Point - adds points to an existing path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';

export class Tool_PathAddPoint {
	constructor() {
		this.addpoint = false;

		this.mousedown = function (ev) {
			let editor = getCurrentProjectEditor();
			let singleshape = editor.multiSelect.shapes.singleton;
			let s = getShapeAtLocation(eventHandlerData.mouseX, eventHandlerData.mouseY);

			if (this.addpoint &&
				singleshape &&
				singleshape.objType !== 'ComponentInstance') {
				let p = singleshape.path.insertPathPoint(
					this.addpoint.split,
					this.addpoint.point
				);
				if (p)
					editor.multiSelect.points.select(p);
				historyPut('Added point to path');
			} else if (s) {
				editor.multiSelect.points.clear();
				if (eventHandlerData.multi)
					editor.multiSelect.shapes.add(s);
				else
					editor.multiSelect.shapes.select(s);

				if (s.objType === 'ComponentInstance')
					clickTool('shapeEdit');
				editor.nav.panel = 'Attributes';
			} else {
				editor.selectedTool = 'newPath';
				eventHandlerData.currentToolHandler = eventHandlerData.tool_addPath;
				eventHandlerData.currentToolHandler.dragging = true;
				eventHandlerData.currentToolHandler.firstpoint = true;
				eventHandlerData.currentToolHandler.mousedown(ev);
			}

			eventHandlerData.hoverPoint = false;
			redraw({ calledBy: 'Tool_PathAddPoint.mousedown' });
		};

		this.mousemove = function (ev) {
			let editor = getCurrentProjectEditor();
			let singleshape = editor.multiSelect.shapes.singleton;
			if (singleshape) {
				let pt = singleshape.path.getClosestPointOnCurve({
					x: cXsX(eventHandlerData.mouseX),
					y: cYsY(eventHandlerData.mouseY),
				});
				if (pt && pt.distance < 20) {
					this.addpoint = pt;
					let ptsize = getCurrentProject().projectSettings.pointSize;
					let ptx = (sXcX(pt.x) - ptsize / 2);
					let pty = (sYcY(pt.y) - ptsize / 2);
					openNotation(
						'x: ' + round(pt.x, 3) + '<br>y: ' + round(pt.y, 3),
						ptx,
						pty
					);
					eventHandlerData.hoverPoint = {
						fill: accentColors.blue.l75,
						x: ptx,
						y: pty,
						size: ptsize,
					};
				} else {
					this.addpoint = false;
					eventHandlerData.hoverPoint = false;
					closeNotation();
				}
			} else {
				this.addpoint = false;
				eventHandlerData.hoverPoint = false;
				closeNotation();
			}

			redraw({ calledBy: 'Tool_PathAddPoint.mousemove', redrawPanels: false });
		};

		this.mouseup = function () { };
	}
}
