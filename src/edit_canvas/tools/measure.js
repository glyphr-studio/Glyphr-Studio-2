import { round } from '../../common/functions.js';
import { closeAllNotations, showNotation } from '../../controls/dialogs/dialogs.js';
import { cXsX, cYsY, sXcX, sYcY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';

/**
	// ----------------------------------------------------------------
	// Measure - a read-only ruler between two points on the canvas
	// ----------------------------------------------------------------

	Drag from one point to another to read the horizontal, vertical, and
	straight-line distance between them in Em units. Nothing is added to
	the glyph - this tool never edits project data.
 */
export class Tool_Measure {
	constructor() {
		this.dragging = false;
		this.start = false;
	}

	mousedown() {
		this.dragging = true;
		this.start = this.currentPoint();
		this.showReadout(this.start);
	}

	mousemove() {
		if (!this.dragging || !this.start) return;
		this.showReadout(this.currentPoint());
	}

	mouseup() {
		if (!this.dragging) return;
		// Leave the final measurement on screen so it can be read
		this.showReadout(this.currentPoint());
		this.dragging = false;
	}

	/**
	 * @returns {{x: Number, y: Number}} - mouse position in Em units
	 */
	currentPoint() {
		return {
			x: cXsX(eventHandlerData.mousePosition.x),
			y: cYsY(eventHandlerData.mousePosition.y),
		};
	}

	/**
	 * Draws the measurement note next to the cursor.
	 * @param {{x: Number, y: Number}} end - current end of the measurement
	 */
	showReadout(end) {
		const start = this.start || end;
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const distance = Math.hypot(dx, dy);

		closeAllNotations();
		showNotation(
			`
			<div class="notation__measure">
				<label>x</label><span>${round(end.x, 2)}</span>
				<label>y</label><span>${round(end.y, 2)}</span>
				<label>&Delta;x</label><span>${round(dx, 2)}</span>
				<label>&Delta;y</label><span>${round(dy, 2)}</span>
				<label>dist</label><span>${round(distance, 2)}</span>
			</div>
		`,
			sXcX(end.x),
			sYcY(end.y)
		);
	}
}
