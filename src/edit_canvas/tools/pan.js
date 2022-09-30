// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { eventHandlerData } from '../events.js';

export class Tool_Pan {
	constructor() {
		this.deltaX = 0;
		this.deltaY = 0;

		this.mousedown = function (ev) {
			// log('PAN TOOL - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			const editor = getCurrentProjectEditor();
			let view = editor.view;
			this.deltaX = eventHandlerData.mouseX - view.dx;
			this.deltaY = eventHandlerData.mouseY - view.dy;
			// log(`this.delta: ${this.deltaX}, ${this.deltaY}`);
			eventHandlerData.isPanning = true;
		};

		this.mousemove = function (ev) {
			if (eventHandlerData.isPanning) {
				// Moving paths if mousedown
				const editor = getCurrentProjectEditor();
				// log(`ehd.mouse: ${eventHandlerData.mouseX}, ${eventHandlerData.mouseY}`);
				// log(`this.delta: ${this.deltaX}, ${this.deltaY}`);

				let update = {
					dx: eventHandlerData.mouseX - this.deltaX,
					dy: eventHandlerData.mouseY - this.deltaY,
				};
				// log(update);
				editor.view = update;
				editor.publish('view', editor.view);
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
