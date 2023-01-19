import { Tool_Pan } from './tools/pan.js';
import { Tool_NewBasicPath } from './tools/new_basic_path.js';
import { Tool_Resize } from './tools/resize.js';
import { Tool_NewPath } from './tools/new_path.js';
import { Tool_PathEdit } from './tools/path_edit.js';
import { Tool_PathAddPoint } from './tools/path_add_point.js';
import { Tool_Kern } from './tools/kern.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { setCursor, updateCursor } from './cursors.js';
import { handleMouseEvents, handleMouseWheel } from './events_mouse.js';
import { handleKeyPress, handleKeyUp } from './events_keyboard.js';
import { handleDropSVGonEditCanvas, handlePasteSVGonEditCanvas } from './events_drag_drop_paste.js';
import { showToast } from '../controls/dialogs/dialogs.js';

// --------------------------------------------------------------
// Events - shared between Mouse and Keyboard
// --------------------------------------------------------------

export let eventHandlerData = {
	currentToolHandler: false,
	newBasicPathMaxes: false,
	newBasicPath: false,
	dragSelectArea: false,
	mousePosition: false,
	handle: false,
	rotationCenter: false,
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
	hoverPoint: false,
	multi: false,
	canvasHotSpots: [],
};

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

	// Document Key Listeners
	document.addEventListener('paste', handlePasteSVGonEditCanvas, false);
	document.addEventListener('keydown', handleKeyPress, false);
	document.addEventListener('keyup', handleKeyUp, false);
	// log(`initEventHandlers`, 'end');
}

export function cancelDefaultEventActions(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
}

function handleMouseOverCanvas() {
	// log('handleMouseOverCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = true;
	updateCursor();
	// log('handleMouseOverCanvas', 'end');
}

function handleMouseLeaveCanvas() {
	// log('handleMouseLeaveCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = false;
	// Fixes a Chrome cursor problem
	document.onselectstart = function () {};
	updateCursor();
	// log('handleMouseLeaveCanvas', 'end');
}

function handleDragEnterCanvas(event) {
	event.preventDefault();
	event.stopPropagation();
	showToast('Drop a SVG file to import it');
}

export function togglePanOn(event) {
	const editor = getCurrentProjectEditor();
	editor.eventHandlers.tool_pan.mousedown(event);
	eventHandlerData.lastTool = editor.selectedTool;
	editor.selectedTool = 'pan';
	eventHandlerData.isPanning = true;
	editor.publish('whichToolIsSelected', editor.selectedTool);
	setCursor('move');
}

export function togglePanOff(event) {
	const editor = getCurrentProjectEditor();
	editor.eventHandlers.tool_pan.mouseup(event);
	editor.selectedTool = eventHandlerData.lastTool;
	eventHandlerData.lastTool = false;
	eventHandlerData.isPanning = false;
	updateCursor();
	editor.publish('whichToolIsSelected', editor.selectedTool);
}
