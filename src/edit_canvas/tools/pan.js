import { getCurrentProjectEditor } from '../../app/main.js';
import { eventHandlerData } from '../events.js';

/**
	// ----------------------------------------------------------------
	// Pan - moves the canvas view
	// ----------------------------------------------------------------
 */
export class Tool_Pan {
	constructor() {
		this.deltaX = 0;
		this.deltaY = 0;
	}
	mousedown() {
		// log('PAN TOOL - mouse down: ' + eventHandlerData.mousePosition.x + ':' + eventHandlerData.mousePosition.y);
		const editor = getCurrentProjectEditor();
		let view = editor.view;
		this.deltaX = eventHandlerData.mousePosition.x - view.dx;
		this.deltaY = eventHandlerData.mousePosition.y - view.dy;
		// log(`this.delta: ${this.deltaX}, ${this.deltaY}`);
		eventHandlerData.isPanning = true;
	}

	mousemove() {
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
	}

	mouseup() {
		// log('PAN TOOL - Mouse Up');
		eventHandlerData.isPanning = false;
		this.deltaX = 0;
		this.deltaY = 0;
	}
}
