// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------

export default class Tool_Pan {
	constructor() {
		this.dragging = false;
		this.deltax = 0;
		this.deltay = 0;

		this.mousedown = function (ev) {
			// log('PAN TOOL - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
			let v = getView('Event Handler Tool_Pan mousedown');
			this.deltax = eventHandlerData.mouseX - v.dx;
			this.deltay = eventHandlerData.mouseY - v.dy;
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
				// Moving shapes if mousedown
				setView({
					dx: eventHandlerData.mouseX - this.deltax,
					dy: eventHandlerData.mouseY - this.deltay,
				});
				redraw({
					calledBy: 'Event Handler Tool_Pan mousemove',
					redrawPanels: false,
				});
			}
		};
	}
}
