// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { eventHandlerData } from '../events_mouse.js';

export class Tool_Pan {
	constructor() {
		this.dragging = false;
		this.deltax = 0;
		this.deltay = 0;

		this.mousedown = function (ev) {
			// log('PAN TOOL - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			const editor = getCurrentProjectEditor();
			let view = editor.view;
			this.deltax = eventHandlerData.mouseX - view.dx;
			this.deltay = eventHandlerData.mouseY - view.dy;
			this.dragging = true;
		};

		this.mouseup = function () {
			// log('PAN TOOL - Mouse Up');
			this.dragging = false;
			this.deltax = 0;
			this.deltay = 0;
		};

		this.mousemove = function (ev) {
			if (this.dragging) {
				const editor = getCurrentProjectEditor();
				// Moving paths if mousedown
				editor.view = {
					dx: eventHandlerData.mouseX - this.deltax,
					dy: eventHandlerData.mouseY - this.deltay,
				};

				editor.editCanvas.redraw({
					calledBy: 'Event Handler Tool_Pan mousemove',
					redrawPanels: false,
				});
			}
		};
	}
}
