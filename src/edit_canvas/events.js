import { getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { setCursor, updateCursor } from './cursors.js';
import { handleDropSVGonEditCanvas } from './events_drag_drop_paste.js';
import { handleKeyPress, handleKeyUp } from './events_keyboard.js';
import { handleMouseEvents, handleMouseWheel } from './events_mouse.js';
import { Tool_Kern } from './tools/kern.js';
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

	// Mouse Event Listeners
	canvas.addEventListener('mousedown', handleMouseEvents, false);
	canvas.addEventListener('mousemove', handleMouseEvents, false);
	canvas.addEventListener('mouseup', handleMouseEvents, false);
	canvas.addEventListener('mouseover', handleMouseOverCanvas);
	canvas.addEventListener('mouseout', handleMouseLeaveCanvas);
	canvas.addEventListener('wheel', handleMouseWheel, { passive: false, capture: false });
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
	editor.selectedTool = eventHandlerData.lastTool;
	eventHandlerData.lastTool = false;
	eventHandlerData.isPanning = false;
	updateCursor();
	editor.publish('whichToolIsSelected', editor.selectedTool);
}
