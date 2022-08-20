// ----------------------------------------------------------------
// New Basic Shape - adds many points to a new path
// ----------------------------------------------------------------

export default class Tool_NewBasicShape {
	constructor() {
		this.dragging = false;

		this.mousedown = function (ev) {
			eventHandlerData.tempNewBasicShape = {
				xMax: cXsX(eventHandlerData.mouseX),
				xMin: cXsX(eventHandlerData.mouseX),
				yMax: cYsY(eventHandlerData.mouseY),
				yMin: cYsY(eventHandlerData.mouseY),
			};

			let newshape = new Shape({ visible: false, name: '...' });
			newshape.path.maxes = eventHandlerData.tempNewBasicShape;
			newshape = addShape(newshape);
			let editor = getCurrentProjectEditor();
			editor.multiSelect.shapes.select(newshape);

			eventHandlerData.firstX = cXsX(eventHandlerData.mouseX);
			eventHandlerData.firstY = cYsY(eventHandlerData.mouseY);

			this.dragging = true;

			redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousedown' });
			// log('Tool_NewBasicShape MOUSEDOWN - after REDRAW');
		};

		this.mousemove = function (ev) {
			if (eventHandlerData.tempNewBasicShape) {
				eventHandlerData.tempNewBasicShape.xMax = Math.max(
					eventHandlerData.firstX,
					cXsX(eventHandlerData.mouseX)
				);
				eventHandlerData.tempNewBasicShape.xMin = Math.min(
					eventHandlerData.firstX,
					cXsX(eventHandlerData.mouseX)
				);
				eventHandlerData.tempNewBasicShape.yMax = Math.max(
					eventHandlerData.firstY,
					cYsY(eventHandlerData.mouseY)
				);
				eventHandlerData.tempNewBasicShape.yMin = Math.min(
					eventHandlerData.firstY,
					cYsY(eventHandlerData.mouseY)
				);

				eventHandlerData.undoQueueHasChanged = true;
				redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousemove' });
				// log('Tool_NewBasicShape MOUSEMOVE past redraw');
			}
		};

		this.mouseup = function () {
			// prevent really small shapes
			let tnbs = eventHandlerData.tempNewBasicShape;
			let editor = getCurrentProjectEditor();

			if (Math.abs(tnbs.xMax - tnbs.xMin) >
				getCurrentProject().projectSettings.pointSize &&
				Math.abs(tnbs.yMax - tnbs.yMin) >
				getCurrentProject().projectSettings.pointSize) {
				let count = editor.nav.page === 'components' ?
					Object.keys(getCurrentProject().components).length :
					getSelectedWorkItemShapes().length;
				let s = editor.multiSelect.shapessingleton;

				if (editor.selectedTool === 'newrect') {
					s.name = 'Rectangle ' + count;
					s.path = rectPathFromMaxes(tnbs);
				} else {
					s.name = 'Oval ' + count;
					s.path = ovalPathFromMaxes(tnbs);
				}

				s.visible = true;
				// updateCurrentGlyphWidth();
			} else {
				editor.multiSelect.shapes.deleteShapes();
			}

			eventHandlerData.firstX = -100;
			eventHandlerData.firstY = -100;
			eventHandlerData.tempNewBasicShape = false;
			historyPut('New Basic Shape tool');
			eventHandlerData.undoQueueHasChanged = false;

			this.dragging = false;

			clickTool('pathedit');
		};
	}
}
