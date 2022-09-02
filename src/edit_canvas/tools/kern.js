// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------

export class Tool_Kern {
	constructor() {
		this.dragging = false;
		this.deltax = 0;

		this.mousedown = function (ev) {
			// log('Tool_Kern - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			let v = getView('Event Handler Tool_Kern mousedown');
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
				// Moving shapes if mousedown
				let sk = getSelectedKern();
				let val = 1 * sk.value;
				updateKernValue(
					getSelectedKernID(),
					round(
						val + (1 * (eventHandlerData.mouseX - this.deltax)) / getView().dz
					)
				);
				this.deltax = eventHandlerData.mouseX;
				redraw({ calledBy: 'Kern.mousemove', redrawPanels: false });
			}
		};
	}
}
