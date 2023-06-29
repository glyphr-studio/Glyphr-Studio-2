// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { setCursor } from '../cursors.js';
import { eventHandlerData } from '../events.js';

export class Tool_Pan {
	constructor() {
		this.deltaX = 0;
		this.deltaY = 0;

		this.mousedown = function (ev) {
			// log('PAN TOOL - mouse down: ' + eventHandlerData.mousePosition.x + ':' + eventHandlerData.mousePosition.y);
			const editor = getCurrentProjectEditor();
			let view = editor.view;
			this.deltaX = eventHandlerData.mousePosition.x - view.dx;
			this.deltaY = eventHandlerData.mousePosition.y - view.dy;
			// log(`this.delta: ${this.deltaX}, ${this.deltaY}`);
			eventHandlerData.isPanning = true;
		};

		this.mousemove = function (ev) {
			if (eventHandlerData.isPanning) {
				// Moving paths if mousedown
				const editor = getCurrentProjectEditor();
				// log(`ehd.mouse: ${eventHandlerData.mousePosition.x}, ${eventHandlerData.mousePosition.y}`);
				// log(`this.delta: ${this.deltaX}, ${this.deltaY}`);

				let update = {
					dx: eventHandlerData.mousePosition.x - this.deltaX,
					dy: eventHandlerData.mousePosition.y - this.deltaY,
				};
				// log(update);
				editor.view = update;
				editor.publish('editCanvasView', editor.view);
			}
		};

		this.mouseup = function () {
			// log('PAN TOOL - Mouse Up');
			eventHandlerData.isPanning = false;
			this.deltaX = 0;
			this.deltaY = 0;
		};
	}
}
