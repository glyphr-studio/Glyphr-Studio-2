// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------

import { getCurrentProjectEditor } from '../../app/main.js';

export class Tool_Kern {
	constructor() {
		this.dragging = false;
		this.deltax = 0;

		this.mousedown = function (ev) {
			// log('Tool_Kern - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			this.deltax = eventHandlerData.mouseX;
			this.dragging = true;
		};

		this.mouseup = function () {
			// log('Tool_Kern - Mouse Up');
			this.dragging = false;
			this.deltax = 0;
			historyPut('Kern Adjustment: ' + getSelectedKern().value);
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
					round(
						val + (1 * (eventHandlerData.mouseX - this.deltax)) / editor.view.dz
					)
				);
				this.deltax = eventHandlerData.mouseX;
				redraw({ calledBy: 'Kern.mousemove', redrawPanels: false });
			}
		};
	}
}
