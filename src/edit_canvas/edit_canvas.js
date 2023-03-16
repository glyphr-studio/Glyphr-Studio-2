import { makeElement } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { eventHandlerData, initEventHandlers } from './events.js';
import { drawGlyph } from '../display_canvas/draw_paths.js';
import {
	computeAndDrawBoundingBox,
	computeAndDrawBoundingBoxHandles,
	computeAndDrawPathPointHandles,
	computeAndDrawPathPoints,
	drawNewBasicPath,
	drawSelectedPathOutline,
} from './draw_edit_affordances.js';
import { round } from '../common/functions.js';

/**
 * EditCanvas takes a string of glyphs and displays them on the canvas
 * And has a bunch of controls and interactions that allow for editing
 */
export class EditCanvas extends HTMLElement {
	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	static get observedAttributes() {
		return ['editing-item-id'];
	}

	/**
	 * Create an EditCanvas
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		// log(`EditCanvas.constructor`, 'start');

		super();

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

		// element attributes
		this.editingItemID = this.getAttribute('editing-item-id') || '';
		this.width = this.getAttribute('width') || 2000;
		this.height = this.getAttribute('height') || 2000;

		// internal properties
		this.canvas = makeElement({ tag: 'canvas' });
		this.ctx = this.canvas.getContext('2d');

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		// let styles = makeElement({ tag: 'style', innerHTML: style });
		// shadow.appendChild(styles);
		shadow.appendChild(this.canvas);

		this.canvas.height = this.height;
		this.canvas.width = this.width;

		const editor = getCurrentProjectEditor();
		initEventHandlers(this.canvas);
		editor.editCanvas = this;

		// Set up Subscriptions
		let canvasSubscriptions = [
			'view',
			'whichToolIsSelected',
			'whichGlyphIsSelected',
			'whichPathIsSelected',
			'whichPathPointIsSelected',
			'currentItem',
			'currentPath',
			'currentComponentInstance',
			'currentPathPoint',
			'currentControlPoint',
			'currentControlPoint.p',
			'currentControlPoint.h1',
			'currentControlPoint.h2',
		];

		canvasSubscriptions.forEach((topic) => {
			editor.subscribe({
				topic: topic,
				subscriberID: `editCanvas-${topic}`,
				callback: () => {
					this.redraw({ calledBy: `editCanvas-${topic}` });
					// updateCursor();
				},
			});
		});

		// log(`EditCanvas.constructor`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`EditCanvas.attributeChangeCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		switch (attributeName) {
			case 'editing-item-id':
				this.editingItemID = newValue;
				getCurrentProjectEditor().autoFitIfViewIsDefault();
				this.redraw({
					calledBy: 'EditCanvas.attributeChangeCallback - attribute: editing-item-id',
				});
				break;
		}
		// log(`EditCanvas.attributeChangeCallback`, 'end');
	}

	// --------------------------------------------------------------
	// Redraw the canvas
	// --------------------------------------------------------------
	redraw() {
		// log('EditCanvas.redraw', 'start');
		const editor = getCurrentProjectEditor();
		const project = getCurrentProject();
		const view = editor.view;
		const ctx = this.ctx;
		const width = this.width;
		const height = this.height;

		// Current Glyph
		const sg = editor.project.getItem(this.editingItemID);
		// log(sg);

		if (requestAnimationFrame) requestAnimationFrame(redrawAnimationFrame);
		else this.redrawAnimationFrame();

		function redrawAnimationFrame() {
			ctx.clearRect(0, 0, width, height);

			// Guides
			drawGuides();

			// Draw glyphs
			drawGlyph(sg, ctx, view);

			// Draw selected path / path
			const editMode = editor.selectedTool;
			// log(`editMode: ${editMode}`);

			if (editMode === 'resize') {
				drawSelectedPathOutline(ctx, view);
				computeAndDrawBoundingBox(ctx);
				computeAndDrawBoundingBoxHandles(ctx);
			} else if (editMode === 'rotate') {
				// computeAndDrawRotationAffordance(ctx);
			} else if (editMode === 'pathEdit') {
				drawSelectedPathOutline(ctx, view);
				if (eventHandlerData.isCtrlDown || editor.multiSelect.points.count > 1) {
					computeAndDrawPathPoints(ctx, true);
					// testDrawAllPathPointHandles(ctx);
				} else {
					computeAndDrawPathPointHandles(ctx);
					computeAndDrawPathPoints(ctx);
					// drawPathPointHover(ctx, eventHandlerData.hoverPoint);
				}
			} else if (editMode === 'newPath') {
				computeAndDrawPathPointHandles(ctx);
				computeAndDrawPathPoints(ctx);
			}

			// Draw temporary new paths
			if (eventHandlerData.newBasicPath) {
				drawNewBasicPath(ctx, eventHandlerData.newBasicPath, view);
			}
		}

		function drawGuides() {
			ctx.fillStyle = accentColors.gray.l90;
			const gridTop = sYcY(project.settings.font.ascent, view);
			const gridHeight = project.totalVertical * view.dz;
			const gridPad = 100 * view.dz;
			const gridWidth = sg.advanceWidth * view.dz;

			const gridLines = project.settings.app.guides.system;
			// Verticals
			if (gridLines.showLeftSide) {
				ctx.fillRect(view.dx, gridTop, 1, gridHeight);
			}
			if (gridLines.showRightSide && sg.advanceWidth) {
				ctx.fillRect(round(view.dx + gridWidth), gridTop, 1, gridHeight);
			}

			// Baseline
			if (gridLines.showBaseline) {
				ctx.fillRect(view.dx - gridPad, view.dy, gridWidth + gridPad * 2, 1);
			}
		}

		// log('EditCanvas.redraw', 'end');
	}
}

// --------------------------------------------------------------------------
// Convert between Saved values and Canvas values
// --------------------------------------------------------------------------
// convert stored x-y point to canvas x-y
export function sXcX(sx, view = getCurrentProjectEditor().view) {
	let canvasX = view.dx;
	canvasX += sx * view.dz;
	return canvasX || view.dx;
}

export function sYcY(sy, view = getCurrentProjectEditor().view) {
	let canvasY = view.dy;
	canvasY -= sy * view.dz;
	return canvasY || view.dy;
}

// convert canvas x-y inputs to saved path x-y
export function cXsX(cx, view = getCurrentProjectEditor().view) {
	return (cx - view.dx) / view.dz;
}

export function cYsY(cy, view = getCurrentProjectEditor().view) {
	return (view.dy - cy) / view.dz;
}
