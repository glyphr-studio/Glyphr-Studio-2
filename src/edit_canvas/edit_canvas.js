import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { accentColors, getColorFromRGBA, transparencyToAlpha } from '../common/colors.js';
import { makeElement } from '../common/dom.js';
import { clone } from '../common/functions.js';
import { drawGlyph } from '../display_canvas/draw_paths.js';
import { kernGroupSideMaxWidth } from '../project_editor/cross_item_actions.js';
import { guideColorDark, guideColorLight, guideColorMedium } from '../project_editor/guide.js';
import { runQualityChecksForItem } from '../project_editor/quality_checks.js';
import { drawCharacterKernExtra, drawContextCharacters } from './context_characters.js';
import {
	computeAndDrawBoundingBox,
	computeAndDrawBoundingBoxHandles,
	computeAndDrawDragToSelectBox,
	computeAndDrawPathPointHandles,
	computeAndDrawPathPoints,
	computeAndDrawRotationAffordance,
	drawAllHighlightedPoints,
	drawNewBasicPath,
	drawPathPointHover,
	drawSelectedPathOutline,
} from './draw_edit_affordances.js';
import { cancelDefaultEventActions, eventHandlerData, initEventHandlers } from './events.js';
import { handlePasteSVGonEditCanvas } from './events_drag_drop_paste.js';

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
	 * @param {Object} attributes - collection of key: value pairs to set as attributes
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
		/** @type {HTMLCanvasElement} */
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		// Put it all together
		let shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(this.canvas);

		this.canvas.height = Number(this.height);
		this.canvas.width = Number(this.width);

		const editor = getCurrentProjectEditor();

		// Need paste event listeners on both edit-canvas and canvas
		// for cross-browser compat
		this.canvas.setAttribute('contenteditable', 'true');
		this.canvas.addEventListener('paste', handlePasteSVGonEditCanvas, false);
		this.addEventListener('paste', handlePasteSVGonEditCanvas, false);

		// These are handled by the EditCanvas element, not the canvas in the Element
		// Fixes a FireFox default behavior that caused issues with dragging
		[
			'mousedown',
			'mousemove',
			'mouseup',
			'mouseover',
			'mouseout',
			'wheel',
			'drop',
			'dragenter',
			'dragover',
			'drag',
			'keydown',
			'keyup',
		].forEach((eventName) => {
			this.canvas.addEventListener(eventName, cancelDefaultEventActions);
		});

		const styles = makeElement({
			tag: 'style',
			innerHTML: `
				:focus-visible,
				:focus,
				canvas:focus-visible,
				canvas:focus {
					border: 0;
					border-image: none;
					outline: 0;
				}
				[contenteditable='true'] {
					caret-color: transparent;
				}
				::selection {
					background-color: transparent;
				}
				`,
		});
		shadow.appendChild(styles);

		initEventHandlers(this.canvas);
		editor.editCanvas = this;

		// Set up Subscriptions
		editor.subscribe({
			topic: '*',
			subscriberID: `editCanvas-all`,
			callback: () => {
				this.redraw();
			},
		});
		// log(`EditCanvas.constructor`, 'end');
	}

	connectedCallback() {
		// log(`EditCanvas.connectedCallback`, 'start');
		// Auto-fit view
		this.setAttribute('contenteditable', 'true');
		const editor = getCurrentProjectEditor();
		editor.autoFitIfViewIsDefault();
		// log(`EditCanvas.connectedCallback`, 'end');
	}

	/**
	 * Listens for attribute changes on this element
	 * @param {String} attributeName - which attribute was changed
	 * @param {String} oldValue - value before the change
	 * @param {String} newValue - value after the change
	 */
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// log(`EditCanvas.attributeChangeCallback`, 'start');
		// log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

		switch (attributeName) {
			case 'editing-item-id':
				this.editingItemID = newValue;
				// getCurrentProjectEditor().autoFitIfViewIsDefault();
				this.redraw();
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
		const width = Number(this.width);
		const height = Number(this.height);
		const currentItemID = this.editingItemID;
		const currentItem = project.getItem(currentItemID);
		runQualityChecksForItem(currentItem);
		// log(`currentItemID: ${currentItemID}`);
		const advanceWidth = currentItem?.advanceWidth || 0;
		const itemXMax = Math.max(advanceWidth, currentItem?.maxes?.xMax || 0);

		if (currentItemID.startsWith('kern-')) {
			if (requestAnimationFrame) requestAnimationFrame(redrawKernEdit);
			else redrawKernEdit();
		} else {
			if (requestAnimationFrame) requestAnimationFrame(redrawGlyphEdit);
			else redrawGlyphEdit();
		}

		// log('EditCanvas.redraw', 'end');

		function redrawGlyphEdit() {
			// log(`EditCanvas.redrawGlyphEdit`, 'start');
			editor.autoFitIfViewIsDefault();
			ctx.clearRect(0, 0, width, height);
			const ehd = eventHandlerData;

			// Guides
			const guidesSettings = editor.project.settings.app.guides;
			if (!guidesSettings.drawGuidesOnTop) {
				// if (guidesSettings.systemShowGuides) drawSystemGuidelines(!shouldDrawContextCharacters());
				if (guidesSettings.systemShowGuides) drawSystemGuidelines();
				if (guidesSettings.customShowGuides) drawCustomGuidelines();
			}

			// Draw glyphs
			drawGlyph(currentItem, ctx, view);

			// Draw selected shape
			const editMode = editor.selectedTool;
			// log(`editMode: ${editMode}`);
			// log(`ehd.handle: ${ehd.handle}`);
			if (editMode === 'resize') {
				drawSelectedPathOutline(ctx, view);
				if (ehd.handle === 'rotate') {
					computeAndDrawRotationAffordance(ctx);
				} else {
					computeAndDrawBoundingBox(ctx);
					computeAndDrawBoundingBoxHandles(ctx);
				}
			} else if (editMode === 'pathEdit') {
				drawSelectedPathOutline(ctx, view);
				if (ehd.selecting) {
					computeAndDrawPathPoints(ctx, true);
					// testDrawAllPathPointHandles(ctx);
				} else {
					computeAndDrawPathPointHandles(ctx);
					computeAndDrawPathPoints(ctx);
					// drawPathPointHover(ctx, ehd.hoverPoint);
				}
			} else if (editMode === 'pathAddPoint') {
				drawSelectedPathOutline(ctx, view);
				computeAndDrawPathPoints(ctx);
				if (ehd.hoverPoint) {
					drawPathPointHover(ctx, ehd.hoverPoint);
				}
			} else if (editMode === 'newPath') {
				computeAndDrawPathPointHandles(ctx);
				computeAndDrawPathPoints(ctx);
			}

			// Draw temporary new paths
			if (eventHandlerData?.newBasicPath?.objType) {
				drawNewBasicPath(ctx, ehd.newBasicPath, view);
			}

			// Guides (if draw on top)
			if (guidesSettings.drawGuidesOnTop) {
				// if (guidesSettings.systemShowGuides) drawSystemGuidelines(!shouldDrawContextCharacters());
				if (guidesSettings.systemShowGuides) drawSystemGuidelines();
				if (guidesSettings.customShowGuides) drawCustomGuidelines();
			}

			const contextCharacterSettings = editor.project.settings.app.contextCharacters;
			// Context characters
			if (contextCharacterSettings.showCharacters) {
				drawContextCharacters(ctx);
			}

			// Highlighted points
			drawAllHighlightedPoints(ctx);

			// Drag to select box
			if (ehd.selecting) {
				computeAndDrawDragToSelectBox(ctx, eventHandlerData);
			}
			// log(`EditCanvas.redrawGlyphEdit`, 'end');
		}

		function redrawKernEdit() {
			// log(`EditCanvas.redraw.redrawKernEdit`, 'start');
			// log(`currentItemID: ${currentItemID}`);
			editor.autoFitIfViewIsDefault();
			ctx.clearRect(0, 0, width, height);
			let kernGroup = project.getItem(currentItemID);
			// log(kernGroup);

			if (kernGroup) {
				// drawSystemGuidelines(false);
				ctx.fillStyle = accentColors.gray.l90;
				const gridPad = 100 * view.dz;
				const visibleLeftWidth = kernGroupSideMaxWidth(kernGroup.leftGroup) * view.dz;
				const visibleRightWidth = kernGroupSideMaxWidth(kernGroup.rightGroup) * view.dz;
				const visibleValue = kernGroup.value * view.dz;
				ctx.fillRect(
					view.dx - gridPad - visibleLeftWidth + visibleValue,
					Math.ceil(view.dy),
					gridPad * 2 + visibleLeftWidth + visibleRightWidth - visibleValue,
					1
				);

				ctx.fillStyle = accentColors.purple.l60;
				drawEmVerticalLine(ctx, 0, view);
				drawEmVerticalLine(ctx, kernGroup.value, view);
				drawCharacterKernExtra(ctx, kernGroup.value, view.dx, view.dz);

				let drawItem;
				// Draw right hand group
				// log(`Drawing right-hand group`);
				let rightAlpha = Math.max(0.25, 1 / kernGroup.rightGroup.length);
				kernGroup.rightGroup.forEach((id) => {
					drawItem = project.getItem(`glyph-${id}`, true);
					// log(drawItem);
					let thisView = clone(view);
					thisView.dx += kernGroup.value * thisView.dz;
					// log(thisView);
					drawGlyph(drawItem, ctx, thisView, rightAlpha);
				});

				// Draw left hand group
				// log(`Drawing left-hand group`);
				let leftAlpha = Math.max(0.25, 1 / kernGroup.leftGroup.length);
				kernGroup.leftGroup.forEach((id) => {
					drawItem = project.getItem(`glyph-${id}`, true);
					// log(drawItem);
					let thisView = clone(view);
					thisView.dx -= drawItem.advanceWidth * thisView.dz;
					// log(thisView);
					drawGlyph(drawItem, ctx, thisView, leftAlpha);
				});
			}

			// log(`EditCanvas.redraw.redrawKernEdit`, 'end');
		}

		function drawSystemGuidelines(drawVerticals = true) {
			// log(`drawSystemGuidelines`, 'start');
			const alpha = transparencyToAlpha(project.settings.app.guides.systemTransparency);
			const showLabels = project.settings.app.guides.systemShowLabels;
			// Horizontals
			let deltaY = 0;

			// capHeight
			if (editor.systemGuides.capHeight) {
				// log(`drawing capHeight...`);
				deltaY = project.settings.font.capHeight;
				setSystemGuideColor('light', alpha);
				drawEmHorizontalLine(ctx, deltaY, itemXMax, view);
				if (showLabels) drawGuideLabel('Cap height', deltaY, true);
			}
			// ascent
			if (editor.systemGuides.ascent) {
				// log(`drawing ascent...`);
				deltaY = project.settings.font.ascent;
				setSystemGuideColor('medium', alpha);
				drawEmHorizontalLine(ctx, deltaY, itemXMax, view);
				if (showLabels) drawGuideLabel('Ascent', deltaY, true);
			}
			// xHeight
			if (editor.systemGuides.xHeight) {
				// log(`drawing xHeight...`);
				deltaY = project.settings.font.xHeight;
				setSystemGuideColor('light', alpha);
				drawEmHorizontalLine(ctx, deltaY, itemXMax, view);
				if (showLabels) drawGuideLabel('X height', deltaY, true);
			}
			// descent
			if (editor.systemGuides.descent) {
				// log(`drawing descent...`);
				deltaY = project.settings.font.descent;
				setSystemGuideColor('medium', alpha);
				drawEmHorizontalLine(ctx, deltaY, itemXMax, view);
				if (showLabels) drawGuideLabel('Descent', deltaY, true);
			}

			// baseline
			if (editor.systemGuides.baseline) {
				// log(`drawing baseline...`);
				deltaY = 0;
				setSystemGuideColor('dark', alpha);
				drawEmHorizontalLine(ctx, deltaY, itemXMax, view);
				if (showLabels) drawGuideLabel('Baseline', 0, true);
			}

			// Verticals
			if (drawVerticals) {
				/** @type {String | false} */
				let sbHover = false;
				if (editor.selectedTool === 'resize') {
					const tool = editor.eventHandlers.tool_resize;
					sbHover = tool.sideBearingHover || tool.sideBearingEdit;
				}

				if (editor.systemGuides.leftSide) {
					if (sbHover === 'lsb') {
						setSystemGuideColor('dark', 0.8);
						drawGuideLabel(`Left side bearing: ${currentItem.leftSideBearing}`, 0, false);
					} else {
						setSystemGuideColor('dark', alpha);
					}
					drawEmVerticalLine(ctx, 0, view, sbHover === 'lsb');
					if (showLabels) drawGuideLabel('Left side', 0, false);
				}

				if (editor.systemGuides.rightSide && advanceWidth && currentItem.objType !== 'Component') {
					if (sbHover === 'rsb') {
						setSystemGuideColor('dark', 0.8);
						drawGuideLabel(
							`Right side bearing: ${currentItem.rightSideBearing}`,
							advanceWidth,
							false
						);
					} else {
						setSystemGuideColor('dark', alpha);
					}
					drawEmVerticalLine(ctx, advanceWidth, view, sbHover === 'rsb');
					if (showLabels) drawGuideLabel('Right side', advanceWidth, false);
				}
			}

			// log(`drawSystemGuidelines`, 'end');
		}

		function setSystemGuideColor(level = 'medium', alpha) {
			let fill;
			if (level === 'light') {
				fill = getColorFromRGBA(guideColorLight, alpha);
			} else if (level === 'medium') {
				fill = getColorFromRGBA(guideColorMedium, alpha);
			} else if (level === 'dark') {
				fill = getColorFromRGBA(guideColorDark, alpha);
			}
			// log(`fill: ${fill}`);
			ctx.fillStyle = fill;
		}

		function drawCustomGuidelines() {
			const guides = getCurrentProject().settings.app.guides;

			if (guides.custom) {
				let alpha = transparencyToAlpha(guides.customTransparency);
				guides.custom.forEach((guide) => {
					if (guide.visible) {
						let fill = getColorFromRGBA(guide.color, alpha);
						ctx.fillStyle = fill;
						if (guide.angle === 90) {
							drawEmHorizontalLine(ctx, guide.location, itemXMax, view);
							if (guides.customShowLabels) drawGuideLabel(guide.name, guide.location, true);
						} else {
							drawEmVerticalLine(ctx, guide.location, view);
							if (guides.customShowLabels) drawGuideLabel(guide.name, guide.location, false);
						}
					}
				});
			}
		}

		function drawGuideLabel(name, location, isHorizontal) {
			let deltaX = 4;
			let deltaY = -4;
			let x, y;
			if (isHorizontal) {
				x = 5;
				y = sYcY(location) + deltaY;
				y = location > 0 ? Math.floor(y) : Math.ceil(y);
				ctx.fillRect(0, y - deltaY, 60, 1);
			} else {
				x = sXcX(location) + deltaX;
				x = Math.floor(x);
				y = 12;
				ctx.fillRect(x - deltaX, 0, 1, 20);
			}
			ctx.font = '10px Tahoma, Verdana, sans-serif';
			ctx.fillText(name, x, y);
		}
	}
}

// --------------------------------------------------------------
// Guides
// --------------------------------------------------------------

/**
 * Draws a horizontal line, based on some Em values
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Number} emY - y value, in Em space units (not pixels)
 * @param {Number} emLineWidth - width, in Em space units (not pixels)
 * @param {Object} view - view object (dx, dy, dz)
 */
function drawEmHorizontalLine(ctx, emY = 0, emLineWidth, view) {
	// log(`drawEmHorizontalLine`, 'start');
	let pad = 50 * view.dz;
	// if (shouldDrawContextCharacters()) pad = 0;
	let lineWidth = emLineWidth * view.dz;
	let lineX = view.dx - pad;
	let lineY = sYcY(emY);
	lineWidth += pad * 2;
	if (emY > 0) lineY = Math.floor(lineY);
	else lineY = Math.ceil(lineY);
	// log(`lineX: ${lineX}`);
	// log(`lineY: ${lineY}`);
	// log(`lineWidth: ${lineWidth}`);
	ctx.fillRect(lineX, lineY, lineWidth, 1);
	// log(`drawEmHorizontalLine`, 'end');
}

/**
 * Draws a vertical line, based on some Em values
 * @param {CanvasRenderingContext2D} ctx - canvas context
 * @param {Number} emX - x value, in Em space units (not pixels)
 * @param {Object} view - view object (dx, dy, dz)
 */
export function drawEmVerticalLine(ctx, emX = 0, view, tall = false) {
	// log(`drawEmVerticalLine`, 'start');
	const project = getCurrentProject();
	let pad = (tall ? 200 : 50) * view.dz;
	const lineTopY = sYcY(project.settings.font.ascent, view) - pad;
	let lineX = sXcX(emX);
	lineX = Math.floor(lineX);
	let lineHeight = project.totalVertical * view.dz;
	lineHeight += pad * 2;
	// log(`lineX: ${lineX}`);
	// log(`lineTopY: ${lineTopY}`);
	// log(`lineHeight: ${lineHeight}`);

	ctx.fillRect(lineX, lineTopY, 1, lineHeight);

	// log(`drawEmVerticalLine`, 'end');
}

// --------------------------------------------------------------------------
// Convert between Saved values and Canvas values
// --------------------------------------------------------------------------

/**
 * Converts saved X value into a canvas pixel value, given
 * a specified view.
 * @param {Number} sx - Saved X value "sx"
 * @param {Object} view - view object (dx, dy, dz)
 * @returns {Number} - X value in Canvas units (pixels)
 */
export function sXcX(sx, view = getCurrentProjectEditor().view) {
	let canvasX = view.dx;
	canvasX += sx * view.dz;
	return canvasX || view.dx;
}

/**
 * Converts saved Y value into a canvas pixel value, given
 * a specified view.
 * @param {Number} sy - Saved Y value "sy"
 * @param {Object} view - view object (dx, dy, dz)
 * @returns {Number} - Y value in Canvas units (pixels)
 */
export function sYcY(sy, view = getCurrentProjectEditor().view) {
	let canvasY = view.dy;
	canvasY -= sy * view.dz;
	return canvasY || view.dy;
}

/**
 * Converts canvas pixel X value into Em units that are
 * saved to project data.
 * @param {Number} cx - Canvas X value "cx"
 * @param {Object} view - view object (dx, dy, dz)
 * @returns {Number} - X value in Save units (Em units)
 */
export function cXsX(cx, view = getCurrentProjectEditor().view) {
	return (cx - view.dx) / view.dz;
}

/**
 * Converts canvas pixel Y value into Em units that are
 * saved to project data.
 * @param {Number} cy - Canvas Y value "cy"
 * @param {Object} view - view object (dx, dy, dz)
 * @returns {Number} - Y value in Save units (Em units)
 */
export function cYsY(cy, view = getCurrentProjectEditor().view) {
	return (view.dy - cy) / view.dz;
}
