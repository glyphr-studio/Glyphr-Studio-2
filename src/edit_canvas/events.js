import { Tool_Pan }  from './tools/pan.js';
import { Tool_NewBasicPath }  from './tools/new_basic_path.js';
import { Tool_Resize }  from './tools/resize.js';
import { Tool_NewPath }  from './tools/new_path.js';
import { Tool_PathEdit }  from './tools/path_edit.js';
import { Tool_PathAddPoint }  from './tools/path_add_point.js';
import { Tool_Kern }  from './tools/kern.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { updateCursor } from './cursors.js';
import { handleMouseEvents, handleMouseWheel } from './events_mouse.js';
import { handleKeyPress, handleKeyUp } from './events_keyboard.js';

// --------------------------------------------------------------
// Events - shared between Mouse and Keyboard
// --------------------------------------------------------------

export let eventHandlerData = {
	currentToolHandler: false,
	newBasicPathMaxes: false,
	newBasicPath: false,
	dragSelectArea: false,
	mouseX: 0,
	mouseY: 0,
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
	isShiftDown: false,
	isCtrlDown: false,
	hoverPoint: false,
	multi: false,
	canvasHotSpots: []
};


export function initEventHandlers(editCanvas) {
	// log('initEventHandlers', 'start');
	const editor = getCurrentProjectEditor();

	editor.eventHandlers.tool_pan = new Tool_Pan();
	editor.eventHandlers.tool_addRectOval = new Tool_NewBasicPath();
	editor.eventHandlers.tool_resize = new Tool_Resize();
	editor.eventHandlers.tool_addPath = new Tool_NewPath();
	editor.eventHandlers.tool_pathEdit = new Tool_PathEdit();
	editor.eventHandlers.tool_pathAddPoint = new Tool_PathAddPoint();
	editor.eventHandlers.tool_kern = new Tool_Kern();

	// Mouse Event Listeners
	editCanvas.addEventListener('mousedown', handleMouseEvents, false);
	editCanvas.addEventListener('mousemove', handleMouseEvents, false);
	editCanvas.addEventListener('mouseup', handleMouseEvents, false);
	editCanvas.addEventListener('mouseover', handleMouseOverCanvas);
	editCanvas.addEventListener('mouseout', handleMouseLeaveCanvas);
	editCanvas.addEventListener('wheel', handleMouseWheel, {passive: false, capture: false});

	// Document Key Listeners
	// document.addEventListener('keypress', handleKeyPress, false);
	document.addEventListener('keydown', handleKeyPress, false);
	document.addEventListener('keyup', handleKeyUp, false);
}

export function handleMouseOverCanvas() {
	// log('handleMouseOverCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = true;
	updateCursor();
	// log('handleMouseOverCanvas', 'end');
}

export function handleMouseLeaveCanvas() {
	// log('handleMouseLeaveCanvas', 'start');
	eventHandlerData.isMouseOverCanvas = false;
	// Fixes a Chrome cursor problem
	document.onselectstart = function () {};
	updateCursor();
	// log('handleMouseLeaveCanvas', 'end');
}
