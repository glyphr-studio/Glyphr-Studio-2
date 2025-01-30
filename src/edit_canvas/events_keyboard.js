import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { closeEveryTypeOfDialog, showToast } from '../controls/dialogs/dialogs.js';
import { DisplayCanvas } from '../display_canvas/display_canvas.js';
import { TextBlockOptions } from '../display_canvas/text_block_options.js';
import { ioFont_exportFont } from '../formats_io/otf/font_export.js';
import { ioSVG_exportSVGfont } from '../formats_io/svg_font/svg_font_export.js';
import {
	clipboardCopy,
	clipboardPaste,
	deleteSelectedPaths,
	deleteSelectedPoints,
} from '../panels/actions.js';
import { getItemStringAdvanceWidth } from './context_characters.js';
import {
	cancelDefaultEventActions,
	eventHandlerData,
	togglePanOff,
	togglePanOn,
} from './events.js';
import { handlePasteSVGonEditCanvas } from './events_drag_drop_paste.js';
import { clickTool } from './tools/tools.js';

// --------------------------------------------------------------
// Key Down
// --------------------------------------------------------------

/**
 * Handles key presses
 * @param {KeyboardEvent} event - key press event
 * @returns nothing
 */
export function handleKeyPress(event) {
	const editor = getCurrentProjectEditor();
	// log('handleKeyPress', 'start');
	const key = getKeyFromEvent(event);
	// log(`KEY ${key} from ${event.which}`);
	// log(event);

	handleSpecialKeys(key, 'down');
	const ehd = eventHandlerData;
	// log(`ehd.isCtrlDown: ${ehd.isCtrlDown}`);

	// s
	if (ehd.isCtrlDown && key === 's') {
		cancelDefaultEventActions(event);
		getCurrentProjectEditor().saveProjectFile();
	}

	// g
	if (ehd.isCtrlDown && key === 'g') {
		cancelDefaultEventActions(event);
		setTimeout(ioSVG_exportSVGfont, 10);
	}

	// e
	if (ehd.isCtrlDown && key === 'e') {
		cancelDefaultEventActions(event);
		showToast('Exporting OTF font file...');
		setTimeout(ioFont_exportFont, 500);
	}

	// o
	if (ehd.isCtrlDown && key === 'o') {
		cancelDefaultEventActions(event);
		window.open('http://glyphrstudio.com/app', '_blank');
	}

	// q
	// for dev mode clear console
	if (key === 'q' && getGlyphrStudioApp().settings.dev.mode) {
		if (ehd.isCtrlDown || ehd.isAltDown) {
			cancelDefaultEventActions(event);
			console.clear();
		}
	}

	// Only allow the following stuff for canvas edit pages
	if (!editor.nav.isOnEditCanvasPage) return;
	let editMode = getEditMode();
	// log(`editMode: ${editMode}`);

	// Ctrl
	if (ehd.isCtrlDown) {
		// Show multi-selectable stuff on the canvas
		editor.editCanvas.redraw();
	}

	// Ctrl+A - Select / Ctrl+Shift+A - Deselect All
	if (ehd.isCtrlDown && key === 'a') {
		if (ehd.isMouseOverCanvas) {
			if (ehd.isShiftDown) {
				// Clear all selections
				cancelDefaultEventActions(event);
				editor.multiSelect.points.clear();
				editor.multiSelect.shapes.clear();
			} else if (editMode === 'arrow') {
				// Select all shapes
				cancelDefaultEventActions(event);
				editor.multiSelect.points.clear();
				editor.multiSelect.shapes.clear();
				editor.multiSelect.shapes.selectAll();
			} else if (editMode === 'pen') {
				// Select all path points
				cancelDefaultEventActions(event);
				editor.multiSelect.points.clear();
				editor.multiSelect.shapes.clear();
				editor.multiSelect.points.selectAll();
			}
		}

		// log('handleKeyPress', 'end');
		return;
	}

	// Space
	if (ehd.isCtrlDown && ehd.isSpaceDown) {
		// Ctrl+Space - Hide UI
		addHideUIOverlay();
	} else if (ehd.isSpaceDown && ehd.isMouseOverCanvas) {
		// Space - Pan
		cancelDefaultEventActions(event);
		if (!ehd.isPanning) togglePanOn(event);
	}

	if (key === 'Escape') {
		closeEveryTypeOfDialog();
	}

	// z
	if (key === 'Undo' || (ehd.isCtrlDown && key === 'z')) {
		cancelDefaultEventActions(event);
		editor.history.restoreState();
	}

	// plus
	if (ehd.isCtrlDown && key === 'Plus') {
		cancelDefaultEventActions(event);
		editor.updateViewZoom(1.1);
	}

	// minus
	if (ehd.isCtrlDown && key === 'Minus') {
		cancelDefaultEventActions(event);
		editor.updateViewZoom(0.9);
	}

	// 0
	if (ehd.isCtrlDown && key === '0') {
		cancelDefaultEventActions(event);
		editor.autoFitView();
	}

	// left
	if (key === 'ArrowLeft' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(-1, 0);
	}

	// right
	if (key === 'ArrowRight' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(1, 0);
	}

	// up
	if (key === 'ArrowUp' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, 1);
	}

	// down
	if (key === 'ArrowDown' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, -1);
	}

	// Only allow above stuff on Kerning page
	if (editor.nav.page === 'Kerning') return;

	// Only do the below stuff if the canvas has focus

	if (ehd.isMouseOverCanvas) {
		// del
		if (key === 'Delete' || key === 'Backspace') {
			cancelDefaultEventActions(event);

			if (editMode === 'pen') {
				deleteSelectedPoints();
			} else if (editMode === 'arrow') {
				deleteSelectedPaths();
			}
		}

		// control + c
		if (ehd.isCtrlDown && key === 'c') {
			cancelDefaultEventActions(event);
			clipboardCopy();
		}

		// control + v
		if (ehd.isCtrlDown && key === 'v') {
			// log(`\n⮟editor.clipboard⮟`);
			// log(editor.clipboard);
			let didStuff = false;
			if (editor.clipboard) {
				didStuff = clipboardPaste();
				cancelDefaultEventActions(event);
			}

			if (!didStuff) {
				handlePasteSVGonEditCanvas(event);
			}
		}

		// v
		if (key === 'v') clickTool('resize');

		// b
		if (key === 'b') clickTool('pathEdit');
	}
	// log('handleKeyPress', 'end');
}

/**
 * Converts Key press IDs to actual characters
 * @param {KeyboardEvent} event - key press event
 * @returns {String} - character equivalent for the key ID
 */
export function getKeyFromEvent(event) {
	// log(`getKeyFromEvent`, 'start');
	// log(event);
	// log(`event.key: ${event.key}`);

	/*
		Keys used above. Names should conform to lowercase versions of event.key values:
		https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
		'Meta' keys on Mac (Option or Command) are converted to windows 'Control'
		'Space', 'Plus' and 'Minus' keywords are added for convenience.

	const handledCharacterKeys = ['0', 'a', 'b', 'c', 'e', 'g', 'o', 's', 'q', 'v', 'z'];

	const handledSpecialKeys = [
		'Alt',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'Backspace',
		'Control',
		'Delete',
		'Escape',
		'Minus',
		'Plus',
		'Shift',
		'Space',
		'Undo',
	];
	*/

	let result = event.key;
	if (result.length === 1) result = result.toLocaleLowerCase();
	if (result === 'Meta') result = 'Control';
	if (result === '-') result = 'Minus';
	if (result === '+') result = 'Plus';
	if (result === ' ') result = 'Space';

	// log(`result: ${result}`);
	// log(`getKeyFromEvent`, 'end');
	return result;
}

/**
 * Moves the selected thing a small amount, depending
 * on if the shift key is down or not.
 * @param {Number} dx - x value to nudge
 * @param {Number} dy - y value to nudge
 * @returns nothing
 */
function nudge(dx, dy) {
	// log(`events_keyboard Nudge`, 'start');
	// log(`dx: ${dx}`);
	// log(`dy: ${dy}`);

	const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	if (ehd.isCtrlDown) return;

	let multiplier = ehd.isShiftDown ? 10 : 1;

	let mx = dx * multiplier;
	let my = dy * multiplier;
	let editMode = getEditMode();
	// log(`editMode: ${editMode}`);

	if (editMode === 'kern') {
		let delta = mx || my;
		editor.selectedKernGroup.value += delta;
		editor.history.addState(`Nudged kern group ${editor.selectedKernGroupID} by ${delta}`);
		editor.publish('currentKernGroup', editor.selectedKernGroup);
		editor.editCanvas.redraw();
	} else if (editMode === 'arrow') {
		const msShapes = editor.multiSelect.shapes;
		msShapes.updateShapePosition(mx, my);
		editor.history.addState(`Nudged shape(s) by ${mx}, ${my}`);
		editor.publish('currentItem', editor.selectedItem);
		editor.editCanvas.redraw();
	} else if (editMode === 'pen') {
		const msPoints = editor.multiSelect.points;
		msPoints.members.forEach((point) => point.updatePathPointPosition('p', mx, my));
		if (msPoints.members.length > 1) {
			editor.history.addState(`Nudged path points by ${mx}, ${my}`);
			editor.publish('currentItem', editor.selectedItem);
		} else if (msPoints.singleton) {
			editor.history.addState(`Nudged path point by ${mx}, ${my}`);
			editor.publish('currentPathPoint', msPoints.singleton);
		}
		editor.editCanvas.redraw();
	}
	// log(`events_keyboard Nudge`, 'end');
}

/**
 * Returns the tool name that corresponds to the selected tool
 * @returns {String} - name of the applicable tool
 */
function getEditMode() {
	const editor = getCurrentProjectEditor();
	if (editor.nav.page === 'Kerning') return 'kern';
	if (editor.selectedTool === 'resize') return 'arrow';
	if (editor.selectedTool === 'pathEdit') return 'pen';
}

function addHideUIOverlay() {
	if (!document.getElementById('hideUI')) {
		const editor = getCurrentProjectEditor();
		//const scale = this.options.fontSize / this.project.totalVertical;
		const fontSize = editor.project.totalVertical * editor.view.dz;
		let text = editor.selectedItem.char;
		if (editor.project.settings.app.contextCharacters.showCharacters) {
			text = editor.selectedItem.contextCharacters;
		}
		const advance = getItemStringAdvanceWidth(text) + 100;
		const windowSize = document.body.getBoundingClientRect();
		const width = advance * editor.view.dz;
		const offsetTop = (windowSize.height - fontSize) * 0.5;
		const offsetLeft = (windowSize.width - width) * 0.5;

		const hideUI = makeElement({
			tag: 'div',
			id: 'hideUI',
			style: `
				display: block;
				position: absolute;
				z-index: 3000;
				background-color: white;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				overflow-x: hidden;
				overflow-y: hidden;
			`,
		});
		const hideUIOptions = new TextBlockOptions({
			fontSize: fontSize,
			text: text,
			pageWidth: width,
		});
		const hideUIDisplayCanvas = new DisplayCanvas(hideUIOptions);
		hideUIDisplayCanvas.style.backgroundColor = 'white';
		hideUIDisplayCanvas.style.position = 'absolute';
		hideUIDisplayCanvas.style.top = offsetTop + 'px';
		hideUIDisplayCanvas.style.left = offsetLeft + 'px';
		hideUI.appendChild(hideUIDisplayCanvas);
		document.body.appendChild(hideUI);
	}
}

// --------------------------------------------------------------
// Key Up
// --------------------------------------------------------------

/**
 * Handles the key-up event
 * @param {KeyboardEvent} event - key up event
 * @returns nothing
 */
export function handleKeyUp(event) {
	// log(`handleKeyup`, 'start');
	let key = getKeyFromEvent(event);
	// log(`KEY ${key} from ${event.which}`);
	// log(event);

	const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	const hideUI = document.getElementById('hideUI');
	// log('ehd.lastTool: ' + ehd.lastTool);

	handleSpecialKeys(key, 'up');
	if (!editor.nav.isOnEditCanvasPage) return;

	// Ctrl
	if (key === 'Control' && !ehd.isCtrlDown) {
		// updateCursor();
		editor.editCanvas.redraw();
		if (hideUI) document.body.removeChild(hideUI);
	}

	// Space
	if (key === 'Space' && !ehd.isSpaceDown) {
		if (hideUI) document.body.removeChild(hideUI);
		if (ehd.isMouseOverCanvas) togglePanOff(event);
	}

	// log(`handleKeyup`, 'end');
}

// --------------------------------------------------------------
// Special Keys
// --------------------------------------------------------------

/**
 * Sets or removes the appropriate event handler settings, given some
 * special key (Ctrl, Space, Shift, Alt).
 * @param {String} key - name of the special key
 * @param {String} keyDirection - up or down
 */
function handleSpecialKeys(key, keyDirection) {
	// log(`handleSpecialKeys`, 'start');
	// log(`key: ${key}`);
	// log(`keyDirection: ${keyDirection}`);

	const ehd = eventHandlerData;

	// Maybe not strong equals here?
	if (keyDirection === 'down') {
		if (key === 'Control') {
			ehd.isCtrlDown = true;
			// log(`setting isCtrlDown to true`);
		}
		if (key === 'Space') {
			ehd.isSpaceDown = true;
			// log(`setting isSpaceDown to true`);
		}
		if (key === 'Shift') {
			ehd.isShiftDown = true;
			// log(`setting isShiftDown to true`);
		}
		if (key === 'Alt') {
			ehd.isAltDown = true;
			// log(`setting isAltDown to true`);
		}
	}

	if (keyDirection === 'up') {
		if (key === 'Control') {
			ehd.isCtrlDown = false;
			// log(`setting isCtrlDown to false`);
		}
		if (key === 'Space') {
			ehd.isSpaceDown = false;
			// log(`setting isSpaceDown to false`);
		}
		if (key === 'Shift') {
			ehd.isShiftDown = false;
			// log(`setting isShiftDown to false`);
		}
		if (key === 'Alt') {
			ehd.isAltDown = false;
			// log(`setting isAltDown to false`);
		}
	}

	// log(`handleSpecialKeys`, 'end');
}
