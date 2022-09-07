import { makeElement } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { glyphToHex } from '../common/unicode.js';
import { eventHandlerData, initEventHandlers } from './events_mouse.js';
import { drawGlyph, drawShape } from './draw_shapes.js';
import { computeAndDrawBoundingBox, computeAndDrawBoundingBoxHandles } from './draw_edit_affordances.js';

/**
 * CanvasEdit takes a string of glyphs and displays them on the canvas
 * And has a bunch of controls and interactions that allow for editing
 */
export class CanvasEdit extends HTMLElement {
	/**
	 * Specify which attributes are observed and trigger attributeChangedCallback
	 */
	 static get observedAttributes() {
		return ['glyphs'];
	}

	/**
	 * Create an CanvasEdit
	 * @param {object} attributes - collection of key: value pairs to set as attributes
	 */
	constructor(attributes = {}) {
		log(`CanvasEdit.constructor`, 'start');

		super();

		Object.keys(attributes).forEach((key) =>
			this.setAttribute(key, attributes[key])
		);

		// element attributes
		this.glyphs = this.getAttribute('glyphs') || '';
		this.width = this.getAttribute('width') || 2000;
		this.height = this.getAttribute('height') || 2000;

		// internal properties
		this.canvas = makeElement({ tag: 'canvas' });
		this.ctx = this.canvas.getContext('2d');

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(this.canvas);

		this.canvas.height = this.height;
		this.canvas.width = this.width;

		let editor = getCurrentProjectEditor();
		initEventHandlers(this.canvas);
		editor.editCanvas = this;
		editor.subscribe({
			topic: 'view',
			name: 'Edit canvas',
			callback: () => this.redraw({calledBy: 'CanvasEdit view subscriber'})
		});
		editor.subscribe({
			topic: 'currentGlyph',
			name: 'Edit canvas',
			callback: () => this.redraw({calledBy: 'CanvasEdit currentGlyph subscriber'})
		});
		editor.subscribe({
			topic: 'currentShape',
			name: 'Edit canvas',
			callback: () => this.redraw({calledBy: 'CanvasEdit currentShape subscriber'})
		});

		this.redraw();
		log(`CanvasEdit.constructor`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {string} attributeName - which attribute was changed
	 * @param {string} oldValue - value before the change
	 * @param {string} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		log(`CanvasEdit.attributeChangeCallback`, 'start');
		log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		switch (attributeName) {
			case 'glyphs':
				this.glyphs = newValue;
				this.redraw({calledBy: 'CanvasEdit.attributeChangeCallback - attribute: glyphs'});
				break;
		}
		log(`CanvasEdit.attributeChangeCallback`, 'end');
	}



	// --------------------------------------------------------------
	// Redraw the canvas
	// --------------------------------------------------------------
	redraw(oa = {}) {
		log('CanvasEdit.redraw', 'start');
		if(oa?.calledBy) log(`==CALLED BY ${oa.calledBy}==`);
		let editor = getCurrentProjectEditor();
		let ctx = this.ctx;
		let view = editor.view;
		ctx.clearRect(0, 0, this.width, this.height);

		// Current Glyph
		let glyphHex = glyphToHex(this.glyphs.charAt(0));
		let sg = editor.project.getGlyph(glyphHex);
		log(sg);

		// Grid
		ctx.fillStyle = accentColors.gray.l90;
		ctx.fillRect(view.dx, 0, 1, 1000);
		ctx.fillRect(view.dx + (sg.width * view.dz), 0, 1, 1000);
		ctx.fillRect(0, view.dy, 1000, 1);

		// Draw glyphs
		drawGlyph(sg, ctx, view);

		// Draw selected shape / path
		let editMode = editor.selectedTool;
		log(`editMode: ${editMode}`);

		if (editMode === 'shapeEdit') {
			computeAndDrawBoundingBox(ctx);
			computeAndDrawBoundingBoxHandles(ctx);

		} else if (editMode === 'rotate') {
			computeAndDrawRotationAffordance(ctx);

		} else if (editMode === 'pathEdit') {
			computeAndDrawPathPointHandles(ctx);
			computeAndDrawPathPoints(ctx);

			if (eventHandlerData.hoverPoint) {
				let hp = eventHandlerData.hoverPoint;
				ctx.fillStyle = hp.fill;
				ctx.fillRect(hp.x, hp.y, hp.size, hp.size);
			}

		} else if (editMode === 'newPath') {
			computeAndDrawPathPointHandles(ctx);
			computeAndDrawPathPoints(ctx);
		}

		// Draw temporary new shapes
		if(eventHandlerData.tempNewBasicShape) {
			drawShape(eventHandlerData.tempNewBasicShape, ctx, view);
		}

		log('CanvasEdit.redraw', 'end');
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

// convert canvas x-y inputs to saved shape x-y
export function cXsX(cx, view = getCurrentProjectEditor().view) {
	return (cx - view.dx) / view.dz;
}

export function cYsY(cy, view = getCurrentProjectEditor().view) {
	return (view.dy - cy) / view.dz;
}
