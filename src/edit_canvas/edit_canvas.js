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
import { clone, makeCrisp, round } from '../common/functions.js';
import { drawGlyphKernExtra } from './context_glyphs.js';

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
		editor.subscribe({
			topic: '*',
			subscriberID: `editCanvas-all`,
			callback: () => {
				this.redraw({ calledBy: `editCanvas-all` });
				// updateCursor();
			},
		});

		// log(`EditCanvas.constructor`, 'end');
	}

	connectedCallback() {
		// log(`EditCanvas.connectedCallback`, 'start');
		// Auto-fit view
		const editor = getCurrentProjectEditor();
		editor.autoFitIfViewIsDefault();
		// log(`EditCanvas.connectedCallback`, 'end');
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
				// getCurrentProjectEditor().autoFitIfViewIsDefault();
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
		let view = editor.view;
		const ctx = this.ctx;
		const width = this.width;
		const height = this.height;
		const currentItemID = this.editingItemID;

		if (currentItemID.startsWith('kern-')) {
			if (requestAnimationFrame) requestAnimationFrame(redrawKernEdit);
			else redrawKernEdit();
		} else {
			if (requestAnimationFrame) requestAnimationFrame(redrawGlyphEdit);
			else redrawGlyphEdit();
		}

		// log('EditCanvas.redraw', 'end');

		function redrawGlyphEdit() {
			// log(`EditCanvas.redraw.redrawGlyphEdit`, 'start');
			editor.autoFitIfViewIsDefault();
			ctx.clearRect(0, 0, width, height);

			// Guides
			drawGuides();

			// Draw glyphs
			drawGlyph(project.getItem(currentItemID), ctx, view);

			// Draw selected shape
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
			// log(`EditCanvas.redraw.redrawGlyphEdit`, 'end');
		}

		function redrawKernEdit() {
			log(`EditCanvas.redraw.redrawKernEdit`, 'start');
			log(`currentItemID: ${currentItemID}`);
			editor.autoFitIfViewIsDefault();
			ctx.clearRect(0, 0, width, height);
			let kernGroup = project.getItem(currentItemID);
			log(kernGroup);

			if (kernGroup) {
				// drawGuides();
				drawGlyphKernExtra(
					ctx,
					kernGroup.value,
					view.dx,
					sYcY(project.settings.font.descent),
					view.dz
				);
				ctx.fillStyle = accentColors.purple.l60;
				drawEmVerticalLine(ctx, 0, view, false);
				drawEmVerticalLine(ctx, kernGroup.value, view, true);

				let drawItem;
				// Draw right hand group
				// log(`Drawing right-hand group`);
				let rightAlpha = Math.max(0.25, 1 / kernGroup.rightGroup.length);
				kernGroup.rightGroup.forEach((id) => {
					drawItem = project.getItem(id, true);
					// log(drawItem);
					// log(view);
					drawGlyph(drawItem, ctx, view, rightAlpha);
				});

				// Draw left hand group
				// log(`Drawing left-hand group`);
				let leftAlpha = Math.max(0.25, 1 / kernGroup.leftGroup.length);
				kernGroup.leftGroup.forEach((id) => {
					drawItem = project.getItem(id, true);
					// log(drawItem);
					let thisView = clone(view);
					thisView.dx -= drawItem.advanceWidth * thisView.dz;
					thisView.dx += kernGroup.value * thisView.dz;
					// log(thisView);
					drawGlyph(drawItem, ctx, thisView, leftAlpha);
				});
			}

			log(`EditCanvas.redraw.redrawKernEdit`, 'end');
		}

		function drawGuides() {
			ctx.fillStyle = accentColors.gray.l90;
			const gridPad = 100 * view.dz;
			const advanceWidth = project.getItem(currentItemID).advanceWidth;
			const gridWidth = advanceWidth * view.dz;

			const gridLines = project.settings.app.guides.system;
			// Verticals
			if (gridLines.showLeftSide) {
				drawEmVerticalLine(ctx, 0, view);
			}
			if (gridLines.showRightSide && advanceWidth) {
				drawEmVerticalLine(ctx, advanceWidth, view);
			}

			// Baseline
			if (gridLines.showBaseline) {
				ctx.fillRect(view.dx - gridPad, view.dy, gridWidth + gridPad * 2, 1);
			}
		}
	}
}

function drawEmVerticalLine(ctx, emX = 0, view, roundUp = 'none') {
	// log(`drawEmVerticalLine`, 'start');
	const project = getCurrentProject();
	const lineTopY = sYcY(project.settings.font.ascent, view);
	let lineX = (sXcX(emX));
	if (roundUp === true) lineX = Math.ceil(lineX);
	if (roundUp === false) lineX = Math.floor(lineX);
	const lineHeight = project.totalVertical * view.dz;
	// log(`lineX: ${lineX}`);
	// log(`lineTopY: ${lineTopY}`);
	// log(`lineHeight: ${lineHeight}`);

	ctx.fillRect(lineX, lineTopY, 1, lineHeight);
	// log(`drawEmVerticalLine`, 'end');
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
