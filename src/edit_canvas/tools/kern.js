// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';
import { eventHandlerData } from '../events.js';

export class Tool_Kern {
	constructor() {
		this.dragging = false;
		this.deltax = 0;

		this.mousedown = function (ev) {
			// log('Tool_Kern - mouse down: ' + eventHandlerData.mousePosition.x + ':' + eventHandlerData.mousePosition.y);
			this.deltax = eventHandlerData.mousePosition.x;
			this.dragging = true;
		};

		this.mouseup = function () {
			// log('Tool_Kern - Mouse Up');
			this.dragging = false;
			this.deltax = 0;
			editor.history.addState('Kern Adjustment: ' + getSelectedKern().value);
			// redraw({calledBy:'Kern.mouseup'});
		};

		this.mousemove = function (ev) {
			if (this.dragging) {
				// Moving paths if mousedown
				const editor = getCurrentProjectEditor();
				let sk = getSelectedKern();
				let val = 1 * sk.value;
				updateKernValue(
					getSelectedKernID(),
					round(val + (1 * (eventHandlerData.mousePosition.x - this.deltax)) / editor.view.dz)
				);
				this.deltax = eventHandlerData.mousePosition.x;
				redraw({ calledBy: 'Kern.mousemove', redrawPanels: false });
			}
		};
	}
}
