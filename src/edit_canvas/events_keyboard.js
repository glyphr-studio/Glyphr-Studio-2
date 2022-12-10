import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { ioSVG_exportSVGfont } from '../io/svg_font_export.js';
import {
	clipboardCopy,
	deleteSelectedPaths,
	deleteSelectedPoints,
	clipboardPaste,
} from '../panels/actions.js';
import { setCursor, updateCursor } from './cursors.js';
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

	if (editor.nav.page === 'Open project') {
		// log('handleKeyPress', 'end');
		return;
	}
	// TODO context glyphs
	// if (document.activeElement.id === 'contextglyphsinput') {
	// log('handleKeyPress', 'end');
	// 	return;
	// }

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
		getCurrentProjectEditor().saveGlyphrProjectFile();
	}

	// g
	if (ehd.isCtrlDown && key === 'g') {
		cancelDefaultEventActions(event);
		setTimeout(ioSVG_exportSVGfont, 10);
	}

	// e
	// if (ehd.isCtrlDown && key === 'e') {
	// 	cancelDefaultEventActions(event);
	// 	showToast('Exporting OTF font file...');
	// 	setTimeout(ioOTF_exportOTFfont, 500);
	// }

	// o
	if (ehd.isCtrlDown && key === 'o') {
		cancelDefaultEventActions(event);
		window.open('http://glyphrstudio.com/v2/app', '_blank');
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
		editor.editCanvas.redraw({ calledBy: 'Event Handler - Keydown Ctrl for multi select' });
	}

	// Ctrl+A - Select All

	if (ehd.isCtrlDown && key === 'a') {
		if (ehd.isMouseOverCanvas) {
			if (editMode === 'arrow') {
				cancelDefaultEventActions(event);
				editor.multiSelect.points.members = [];
				editor.multiSelect.paths.selectAll();
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
		closeDialog();
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
		nudge(-1, 0, event);
	}

	// right
	if (key === 'right' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(1, 0, event);
	}

	// up
	if (key === 'up' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, 1, event);
	}

	// down
	if (key === 'down' && ehd.isMouseOverCanvas) {
		cancelDefaultEventActions(event);
		nudge(0, -1, event);
	}

	// Only allow above stuff on Kerning page
	if (editor.nav.page === 'kerning') return;

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
			cancelDefaultEventActions(event);
			clipboardPaste();
		}

		// v
		if (key === 'v') clickTool('resize');

		// b
		if (key === 'b') clickTool('pathEdit');
	}
	// log('handleKeyPress', 'end');
}

function getKeyFromEvent(event) {
	// log('GETKEYFROMEVENT - keyCode:' + event.keyCode + '\twhich:' + event.which);
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
	return specialGlyphs[parseInt(event.which)] || String.fromCharCode(event.which).toLowerCase();
}

function nudge(dx, dy, ev) {
	const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	if (ehd.isCtrlDown) return;

	let multiplier = ehd.isShiftDown ? 10 : 1;

	let mx = dx * multiplier;
	let my = dy * multiplier;
	let editMode = getEditMode();

	if (editMode === 'kern') {
		let nv = getSelectedKern().value + (mx || my);
		updateKernValue(getSelectedKernID(), nv);
		editor.editCanvas.redraw({ calledBy: 'Nudge kern value', redrawPanels: false });
	} else if (editMode === 'arrow') {
		editor.multiSelect.paths.updatePathPosition(mx, my);
		editor.editCanvas.redraw({ calledBy: 'Nudge path' });
	} else if (editMode === 'pen') {
		editor.multiSelect.points.members.forEach(function (o, i) {
			o.updatePathPointPosition('p', mx, my);
		});
		editor.editCanvas.redraw({ calledBy: 'Nudge path point' });
	}
}

function getEditMode() {
	const editor = getCurrentProjectEditor();
	if (editor.nav.page === 'kern') return 'kern';
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
		editor.editCanvas.redraw({ calledBy: 'Event Handler - Keyup Ctrl for multi select' });
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
