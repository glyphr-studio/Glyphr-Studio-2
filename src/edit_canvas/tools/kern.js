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
			editor.history.addState('Kern Adjustment: ' + editor.getSelectedKern.value);
			// redraw({calledBy:'Kern.mouseup'});
		};

		this.mousemove = () => {
			if (this.dragging) {
				// Moving paths if mousedown
				const editor = getCurrentProjectEditor();
				let value = 1 * editor.getSelectedKern.value;
				let newValue = round(
					value + (1 * (eventHandlerData.mousePosition.x - this.deltaX)) / editor.view.dz
				);
				editor.selectedKern.value = newValue;
				editor.publish('currentKern', editor.selectedKern);
				this.deltaX = eventHandlerData.mousePosition.x;
			}
		};
	}
}
