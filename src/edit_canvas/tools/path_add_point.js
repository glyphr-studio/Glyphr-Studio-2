// ----------------------------------------------------------------
// Path Add Point - adds points to an existing path (Pen Plus)
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { round } from '../../common/functions.js';
import { canvasUIPointSize } from '../draw_edit_affordances.js';
import { cXsX, cYsY, sXcX, sYcY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { clickTool, getShapeAtLocation } from './tools.js';

export class Tool_PathAddPoint {
	constructor() {
		this.previewPoint = false;
		this.mousedown = function (ev) {
			const editor = getCurrentProjectEditor();
			let singlePath = editor.multiSelect.shapes.singleton;
			let clickedShape = getShapeAtLocation(
				eventHandlerData.mousePosition.x,
				eventHandlerData.mousePosition.y
			);

			if (this.previewPoint && singlePath && singlePath.objType !== 'ComponentInstance') {
				let addedPoint = singlePath.insertPathPoint(
					this.previewPoint.point,
					this.previewPoint.split,
					eventHandlerData.isShiftDown
				);
				if (addedPoint) {
					editor.multiSelect.points.select(addedPoint);
					editor.publish('currentPath', singlePath);
					editor.history.addState('Added point to path');
				}
			} else if (clickedShape) {
				editor.multiSelect.points.clear();
				if (eventHandlerData.isCtrlDown) editor.multiSelect.shapes.add(clickedShape);
				else editor.multiSelect.shapes.select(clickedShape);
				if (clickedShape.objType === 'ComponentInstance') {
					clickTool('pathEdit');
					editor.publish('currentComponentInstance');
				} else {
					editor.publish('whichShapeIsSelected');
				}
				editor.nav.panel = 'Attributes';
			} else {
				editor.selectedTool = 'newPath';
				eventHandlerData.currentToolHandler = eventHandlerData.tool_addPath;
				eventHandlerData.currentToolHandler.dragging = true;
				eventHandlerData.currentToolHandler.firstPoint = true;
				eventHandlerData.currentToolHandler.mousedown(ev);
			}

			eventHandlerData.hoverPoint = false;
		};

		this.mousemove = function () {
			const editor = getCurrentProjectEditor();
			let singlePath = editor.multiSelect.shapes.singleton;
			if (singlePath) {
				let pt = singlePath.findClosestPointOnCurve({
					x: cXsX(eventHandlerData.mousePosition.x),
					y: cYsY(eventHandlerData.mousePosition.y),
				});
				if (eventHandlerData.isShiftDown) {
					pt.x = round(pt.x);
					pt.y = round(pt.y);
				}
				if (pt && pt.distance < 20) {
					this.previewPoint = pt;
					let ptx = sXcX(pt.x) - canvasUIPointSize / 2;
					let pty = sYcY(pt.y) - canvasUIPointSize / 2;
					// showNotation('x: ' + round(pt.x, 3) + '<br>y: ' + round(pt.y, 3), ptx, pty);
					eventHandlerData.hoverPoint = { x: ptx, y: pty };
				} else {
					this.previewPoint = false;
					eventHandlerData.hoverPoint = false;
					// closeAllNotations();
				}
			} else {
				this.previewPoint = false;
				eventHandlerData.hoverPoint = false;
				// closeAllNotations();
			}

			editor.editCanvas.redraw();
		};

		this.mouseup = function () {};
	}
}
