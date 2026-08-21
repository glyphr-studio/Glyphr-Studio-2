import { getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { setCursor, updateCursor } from './cursors.js';
import { handleDropSVGonEditCanvas } from './events_drag_drop_paste.js';
import { handleKeyPress, handleKeyUp } from './events_keyboard.js';
import { handleMouseEvents, handleMouseWheel } from './events_mouse.js';
import { Tool_Kern } from './tools/kern.js';
import { Tool_Measure } from './tools/measure.js';
import { Tool_Handwriting } from './tools/handwriting.js';
import { Tool_NewBasicPath } from './tools/new_basic_path.js';
import { Tool_NewPath } from './tools/new_path.js';
import { Tool_Pan } from './tools/pan.js';
import { Tool_PathAddPoint } from './tools/path_add_point.js';
import { Tool_PathEdit } from './tools/path_edit.js';
import { Tool_Resize } from './tools/resize.js';

// --------------------------------------------------------------
// Events - shared between Mouse and Keyboard
// --------------------------------------------------------------

export let eventHandlerData = {
	currentToolHandler: {},
	newBasicPathMaxes: {},
	newBasicPath: {},
	selecting: false,
	mousePosition: {},
	/** @type {Object | Boolean} */
	initialPoint: false,
	handle: '',
	rotationStartCenter: {},
	rotationStartMaxesTopY: -100,
	rotateHandleHeight: 40,
	isMouseOverCanvas: false,
	corner: false,
	toolHandoff: false,
	lastX: -100,
	lastY: -100,
	firstX: -100,
	firstY: -100,
	undoQueueHasChanged: false,
	lastTool: false,
	isSpaceDown: false,
	isPanning: false,
	isShiftDown: false,
	isCtrlDown: false,
	isAltDown: false,
	hoverPoint: {},
	multi: false,
	canvasHotspots: [],
};

/**
 * Sets up the event listeners for a given edit canvas,
 * and creates tools for each type of event handler.
 * @param {Element} canvas
 */
export function initEventHandlers(canvas) {
	// log('initEventHandlers', 'start');
	// log(canvas);
	const editor = getCurrentProjectEditor();

	editor.eventHandlers.tool_pan = new Tool_Pan();
	editor.eventHandlers.tool_addRectOval = new Tool_NewBasicPath();
	editor.eventHandlers.tool_resize = new Tool_Resize();
	editor.eventHandlers.tool_addPath = new Tool_NewPath();
	editor.eventHandlers.tool_pathEdit = new Tool_PathEdit();
	editor.eventHandlers.tool_pathAddPoint = new Tool_PathAddPoint();
	editor.eventHandlers.tool_kern = new Tool_Kern();
	editor.eventHandlers.tool_handwriting = new Tool_Handwriting();
	editor.eventHandlers.tool_measure = new Tool_Measure();

	// Mouse Event Listeners
	canvas.addEventListener('mousedown', handleMouseEvents, false);
	canvas.addEventListener('mousemove', handleMouseEvents, false);
	canvas.addEventListener('mouseup', handleMouseEvents, false);
	canvas.addEventListener('mouseover', handleMouseOverCanvas);
	canvas.addEventListener('mouseout', handleMouseLeaveCanvas);
	canvas.addEventListener('wheel', handleMouseWheel, { passive: false, capture: false });
	initializeTouchEditing(canvas);
	canvas.addEventListener('drop', handleDropSVGonEditCanvas, false);
	canvas.addEventListener('dragenter', handleDragEnterCanvas, false);
	canvas.addEventListener('dragover', cancelDefaultEventActions, false);
	canvas.addEventListener('drag', cancelDefaultEventActions, false);

	// Document Key Listeners
	document.addEventListener('keydown', handleKeyPress, false);
	document.addEventListener('keyup', handleKeyUp, false);
	// log(`initEventHandlers`, 'end');
}

/**
 * Adds direct-manipulation editing for touch screens. A moving finger uses
 * the selected drawing/editing tool, a short hold switches temporarily to
 * pan, and two fingers pan and pinch-zoom the canvas.
 * @param {HTMLCanvasElement} canvas - edit canvas element
 */
function initializeTouchEditing(canvas) {
	const state = {
		mode: 'idle',
		startedTool: false,
		longPressTimer: 0,
		startPoint: false,
		lastPoint: false,
		lastDistance: 0,
		lastCenter: false,
	};

	const pointFromTouch = (touch) => {
		const rect = canvas.getBoundingClientRect();
		return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
	};
	const distanceBetween = (first, second) =>
		Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
	const centerBetween = (first, second) => {
		const rect = canvas.getBoundingClientRect();
		return {
			x: (first.clientX + second.clientX) / 2 - rect.left,
			y: (first.clientY + second.clientY) / 2 - rect.top,
		};
	};
	const mouseLikeEvent = (type, point, sourceEvent) => ({
		type,
		button: 0,
		offsetX: point.x,
		offsetY: point.y,
		layerX: point.x,
		layerY: point.y,
		clientX: point.x,
		clientY: point.y,
		ctrlKey: sourceEvent.ctrlKey || false,
		metaKey: sourceEvent.metaKey || false,
		shiftKey: sourceEvent.shiftKey || false,
		altKey: sourceEvent.altKey || false,
		preventDefault: () => sourceEvent.preventDefault(),
		stopPropagation: () => sourceEvent.stopPropagation(),
	});
	const clearLongPress = () => {
		if (state.longPressTimer) window.clearTimeout(state.longPressTimer);
		state.longPressTimer = 0;
	};
	const finishCurrentGesture = (sourceEvent) => {
		clearLongPress();
		if (!state.lastPoint) return;
		const upEvent = mouseLikeEvent('mouseup', state.lastPoint, sourceEvent);
		if (state.mode === 'long-pan') togglePanOff(upEvent);
		else if (state.startedTool || state.mode === 'tool') handleMouseEvents(upEvent);
		state.startedTool = false;
	};

	canvas.addEventListener(
		'touchstart',
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			if (event.touches.length >= 2) {
				finishCurrentGesture(event);
				const first = event.touches[0];
				const second = event.touches[1];
				state.mode = 'pinch';
				state.lastDistance = distanceBetween(first, second);
				state.lastCenter = centerBetween(first, second);
				return;
			}

			const point = pointFromTouch(event.touches[0]);
			state.mode = 'pending';
			state.startPoint = point;
			state.lastPoint = point;
			state.startedTool = false;
			clearLongPress();
			state.longPressTimer = window.setTimeout(() => {
				if (state.mode !== 'pending') return;
				state.mode = 'long-pan';
				togglePanOn(mouseLikeEvent('mousedown', state.startPoint, event));
			}, 360);
		},
		{ passive: false }
	);

	canvas.addEventListener(
		'touchmove',
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			if (event.touches.length >= 2) {
				clearLongPress();
				const first = event.touches[0];
				const second = event.touches[1];
				const nextDistance = distanceBetween(first, second);
				const nextCenter = centerBetween(first, second);
				if (state.mode !== 'pinch') {
					finishCurrentGesture(event);
					state.mode = 'pinch';
					state.lastDistance = nextDistance;
					state.lastCenter = nextCenter;
					return;
				}
				const editor = getCurrentProjectEditor();
				const scale = state.lastDistance ? nextDistance / state.lastDistance : 1;
				if (Number.isFinite(scale) && scale > 0) editor.updateViewZoom(scale, nextCenter);
				if (state.lastCenter) {
					const view = editor.view;
					editor.view = {
						dx: view.dx + nextCenter.x - state.lastCenter.x,
						dy: view.dy + nextCenter.y - state.lastCenter.y,
					};
					editor.publish('editCanvasView', editor.view);
				}
				state.lastDistance = nextDistance;
				state.lastCenter = nextCenter;
				return;
			}

			if (!event.touches.length || state.mode === 'pinch') return;
			const point = pointFromTouch(event.touches[0]);
			state.lastPoint = point;
			if (state.mode === 'long-pan') {
				handleMouseEvents(mouseLikeEvent('mousemove', point, event));
				return;
			}

			const moved = Math.hypot(point.x - state.startPoint.x, point.y - state.startPoint.y);
			if (state.mode === 'pending' && moved > 5) {
				clearLongPress();
				state.mode = 'tool';
				handleMouseEvents(mouseLikeEvent('mousedown', state.startPoint, event));
				state.startedTool = true;
			}
			if (state.mode === 'tool') handleMouseEvents(mouseLikeEvent('mousemove', point, event));
		},
		{ passive: false }
	);

	const endTouch = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (state.mode === 'pending' && state.lastPoint) {
			clearLongPress();
			handleMouseEvents(mouseLikeEvent('mousedown', state.lastPoint, event));
			state.startedTool = true;
			state.mode = 'tool';
		}
		if (state.mode !== 'pinch') finishCurrentGesture(event);
		state.mode = 'idle';
		state.startedTool = false;
		state.startPoint = false;
		state.lastPoint = false;
		state.lastDistance = 0;
		state.lastCenter = false;
	};
	canvas.addEventListener('touchend', endTouch, { passive: false });
	canvas.addEventListener('touchcancel', endTouch, { passive: false });
}

/**
 * Stops default event stuff from happening,
 * so we can do custom stuff.
 * @param {Event} event - input event
 * @returns {false} - as per event spec
 */
export function cancelDefaultEventActions(event) {
	// log(`cancelDefaultEventActions`, 'start');
	// log(event);
	if (event.preventDefault) event.preventDefault();
	if (event.stopPropagation) event.stopPropagation();
	// log(`cancelDefaultEventActions`, 'end');
	return false;
}

/**
 * Do stuff when the mouse goes over the Edit Canvas
 */
function handleMouseOverCanvas() {
	// log('handleMouseOverCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = true;
	updateCursor();
	// log('handleMouseOverCanvas', 'end');
}

/**
 * Do stuff when the mouse leaves the Edit Canvas
 */
function handleMouseLeaveCanvas() {
	// log('handleMouseLeaveCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = false;
	// Fixes a Chrome cursor problem
	document.onselectstart = function () {};
	updateCursor();
	// log('handleMouseLeaveCanvas', 'end');
}

/**
 * Do stuff when the user drags a file over the Edit Canvas
 * @param {DragEvent} event - drag event
 */
function handleDragEnterCanvas(event) {
	event.preventDefault();
	event.stopPropagation();
	showToast('Drop a SVG file to import it');
}

/**
 * Switch the Edit Canvas to pan mode
 * @param {Event} event - mouse event
 */
export function togglePanOn(event) {
	const editor = getCurrentProjectEditor();
	editor.eventHandlers.tool_pan.mousedown(event);
	eventHandlerData.lastTool = editor.selectedTool;
	editor.selectedTool = 'pan';
	eventHandlerData.isPanning = true;
	editor.publish('whichToolIsSelected', editor.selectedTool);
	setCursor('move');
}

/**
 * Switch the Edit Canvas out of pan mode
 * @param {Event} event - mouse event
 */
export function togglePanOff(event) {
	const editor = getCurrentProjectEditor();
	editor.eventHandlers.tool_pan.mouseup(event);
	editor.selectedTool = editor.nav.page === 'Kerning' ? 'kern' : eventHandlerData.lastTool;
	eventHandlerData.lastTool = false;
	eventHandlerData.isPanning = false;
	updateCursor();
	editor.publish('whichToolIsSelected', editor.selectedTool);
}
