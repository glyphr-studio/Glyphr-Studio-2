import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { closeEveryTypeOfDialog, showToast } from '../controls/dialogs/dialogs.js';
import { ioFont_exportFont } from '../formats_io/font_export.js';
import { ioSVG_exportSVGfont } from '../formats_io/svg_font_export.js';
import { clipboardCopy, clipboardPaste, deleteSelectedPaths, deleteSelectedPoints } from '../panels/actions.js';
import {
	cancelDefaultEventActions,
	eventHandlerData,
	togglePanOff,
	togglePanOn,
} from './events.js';
import { clickTool } from './tools/tools.js';

// --------------------------------------------------------------
// Key Down
// --------------------------------------------------------------

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

	// Ctrl+A - Select All

	if (ehd.isCtrlDown && key === 'a') {
		if (ehd.isMouseOverCanvas) {
			if (editMode === 'arrow') {
				cancelDefaultEventActions(event);
				editor.multiSelect.points.clear();
				editor.multiSelect.shapes.clear();
				editor.multiSelect.shapes.selectAll();
			}
		}

		// log('handleKeyPress', 'end');
		return;
	}

	// Space
	if (ehd.isSpaceDown && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		if (!ehd.isPanning) togglePanOn(event);
	}

	if (key === 'esc') {
		closeEveryTypeOfDialog();
	}

	// z
	if (key === 'undo' || (ehd.isCtrlDown && key === 'z')) {
		cancelDefaultEventActions(event);
		editor.history.restoreState();
	}

	// plus
	if (ehd.isCtrlDown && key === 'plus') {
		cancelDefaultEventActions(event);
		editor.updateViewZoom(1.1);
	}

	// minus
	if (ehd.isCtrlDown && key === 'minus') {
		cancelDefaultEventActions(event);
		editor.updateViewZoom(0.9);
	}

	// 0
	if (ehd.isCtrlDown && key === '0') {
		cancelDefaultEventActions(event);
		editor.autoFitView();
	}

	// left
	if (key === 'left' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(-1, 0);
	}

	// right
	if (key === 'right' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(1, 0);
	}

	// up
	if (key === 'up' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, 1);
	}

	// down
	if (key === 'down' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, -1);
	}

	// Only allow above stuff on Kerning page
	if (editor.nav.page === 'Kerning') return;

	// Only do the below stuff if the canvas has focus

	if (ehd.isMouseOverCanvas) {
		// del
		if (key === 'del' || key === 'backspace') {
			cancelDefaultEventActions(event);

			if (editMode === 'pen') {
				deleteSelectedPoints();
			} else if (editMode === 'arrow') {
				deleteSelectedPaths();
			}
		}

		// ctrl + c
		if (ehd.isCtrlDown && key === 'c') {
			cancelDefaultEventActions(event);
			clipboardCopy();
		}

		// ctrl + v
		if (ehd.isCtrlDown && key === 'v') {
			// log(`\n⮟editor.clipboard⮟`);
			// log(editor.clipboard);
			if (editor.clipboard) {
				clipboardPaste();
				cancelDefaultEventActions(event);
			}
		}

		// v
		if (key === 'v') clickTool('resize');

		// b
		if (key === 'b') clickTool('pathEdit');
	}
	// log('handleKeyPress', 'end');
}

export function getKeyFromEvent(event) {
	// log(`getKeyFromEvent`, 'start');
	// log(`event.keyCode: ${event.keyCode}`);
	// log(`event.which: ${event.which}`);
	// for 91, 93, 224 'meta' keys, return 'ctrl'
	let specialGlyphs = {
		8: 'backspace',
		9: 'tab',
		13: 'enter',
		16: 'shift',
		17: 'ctrl',
		18: 'alt',
		20: 'capslock',
		26: 'undo',
		27: 'esc',
		32: 'space',
		33: 'pageup',
		34: 'pagedown',
		35: 'end',
		36: 'home',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		45: 'ins',
		46: 'del',
		48: '0',
		91: 'ctrl',
		93: 'ctrl',
		96: '0',
		107: 'plus',
		187: 'plus',
		109: 'minus',
		189: 'minus',
		224: 'ctrl',
	};

	let result =
		specialGlyphs[parseInt(event.which)] || String.fromCodePoint(event.which).toLowerCase();
	// log(`result: ${result}`);

	// log(`getKeyFromEvent`, 'end');
	return result;
}

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

function getEditMode() {
	const editor = getCurrentProjectEditor();
	if (editor.nav.page === 'Kerning') return 'kern';
	if (editor.selectedTool === 'resize') return 'arrow';
	if (editor.selectedTool === 'pathEdit') return 'pen';
}

// --------------------------------------------------------------
// Key Up
// --------------------------------------------------------------

export function handleKeyUp(event) {
	// log(`handleKeyup`, 'start');
	let key = getKeyFromEvent(event);
	// log(`KEY ${key} from ${event.which}`);
	// log(event);

	const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	// log('ehd.lastTool: ' + ehd.lastTool);

	handleSpecialKeys(key, 'up');
	if (!editor.nav.isOnEditCanvasPage) return;

	// Ctrl
	if (key === 'ctrl' && !ehd.isCtrlDown) {
		// updateCursor();
		editor.editCanvas.redraw();
	}

	// Space
	if (key === 'space' && !ehd.isSpaceDown && ehd.isMouseOverCanvas) {
		togglePanOff(event);
	}

	// log(`handleKeyup`, 'end');
}

function handleSpecialKeys(key, keyDirection) {
	// log(`handleSpecialKeys`, 'start');
	// log(`key: ${key}`);
	// log(`keyDirection: ${keyDirection}`);

	const ehd = eventHandlerData;

	// Maybe not strong equals here?
	if (keyDirection === 'down') {
		if (key === 'ctrl') {
			ehd.isCtrlDown = true;
			// log(`setting isCtrlDown to true`);
		}
		if (key === 'space') {
			ehd.isSpaceDown = true;
			// log(`setting isSpaceDown to true`);
		}
		if (key === 'shift') {
			ehd.isShiftDown = true;
			// log(`setting isShiftDown to true`);
		}
		if (key === 'alt') {
			ehd.isAltDown = true;
			// log(`setting isAltDown to true`);
		}
	}

	if (keyDirection === 'up') {
		if (key === 'ctrl') {
			ehd.isCtrlDown = false;
			// log(`setting isCtrlDown to false`);
		}
		if (key === 'space') {
			ehd.isSpaceDown = false;
			// log(`setting isSpaceDown to false`);
		}
		if (key === 'shift') {
			ehd.isShiftDown = false;
			// log(`setting isShiftDown to false`);
		}
		if (key === 'alt') {
			ehd.isAltDown = false;
			// log(`setting isAltDown to false`);
		}
	}

	// log(`handleSpecialKeys`, 'end');
}
