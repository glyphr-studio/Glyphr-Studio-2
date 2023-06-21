// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { round } from '../../common/functions.js';
import { eventHandlerData } from '../events.js';

export class Tool_Kern {
	constructor() {
		this.dragging = false;
		this.deltaX = 0;

		this.mousedown = () => {
			// log('Tool_Kern - mouse down: ' + eventHandlerData.mousePosition.x + ':' + eventHandlerData.mousePosition.y);
			this.deltaX = eventHandlerData.mousePosition.x;
			this.dragging = true;
		};

		this.mouseup = function () {
			// log('Tool_Kern - Mouse Up');
			const editor = getCurrentProjectEditor();
			this.dragging = false;
			this.deltaX = 0;
			editor.history.addState('Kern group value: ' + editor.selectedKernGroup.value);
			// redraw({calledBy:'Kern.mouseup'});
		};

		this.mousemove = () => {
			if (this.dragging) {
				// log('Tool_Kern - Mouse Move');
				// Moving paths if mousedown
				const editor = getCurrentProjectEditor();
				let value = 1 * editor.selectedKernGroup.value;
				let newValue = round(
					value + (1 * (eventHandlerData.mousePosition.x - this.deltaX)) / editor.view.dz
				);
				editor.selectedKernGroup.value = newValue;
				editor.publish('currentKernGroup', editor.selectedKernGroup);
				this.deltaX = eventHandlerData.mousePosition.x;
			}
		};
	}
}
