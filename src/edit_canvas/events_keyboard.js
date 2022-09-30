import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { setCursor, updateCursor } from './cursors.js';
import { eventHandlerData } from './events.js';

// --------------------------------------------------------------
// Key Down
// --------------------------------------------------------------

export function handleKeyPress(event) {
	const editor = getCurrentProjectEditor();
	if (event.type !== 'keydown') {
		// log('handleKeyPress', 'end');
		return;
	}
	if (editor.nav.page === 'Open project') {
		// log('handleKeyPress', 'end');
		return;
	}
	// TODO context glyphs
	// if (document.activeElement.id === 'contextglyphsinput') {
	// 	log('handleKeyPress', 'end');
	// 	return;
	// }


	log('handleKeyPress', 'start');
	let key = getKeyFromEvent(event);
	log(`KEY ${key} from ${event.which}`);
	log(`CTRL ${event.ctrlKey} META ${event.metaKey}`);
	// log(event);

	handleSpecialKeys(event, 'down');
	let ehd = eventHandlerData;

	// shift s (save as)
	if (ehd.isCtrlDown && ehd.isShiftDown && key === 's') {
		event.preventDefault();
		// ehd.isShiftDown = false;
		saveGlyphrProjectFile(false); // save as always
	}

	// s
	else if (ehd.isCtrlDown && key === 's') {
		event.preventDefault();
		// ehd.isShiftDown = false;
		saveGlyphrProjectFile(true); // overwrite if electron
	}

	// g
	if (ehd.isCtrlDown && key === 'g') {
		event.preventDefault();
		showToast('Exporting SVG font file...');
		setTimeout(ioSVG_exportSVGfont, 500);
	}

	// e
	if (ehd.isCtrlDown && key === 'e') {
		event.preventDefault();
		showToast('Exporting OTF font file...');
		setTimeout(ioOTF_exportOTFfont, 500);
	}

	// o
	if (ehd.isCtrlDown && key === 'o') {
		log('pressed Ctrl + O');
		event.preventDefault();

		window.open('http://glyphrstudio.com/online', '_blank');
	}

	// q
	// for dev mode clear console
	if (getGlyphrStudioApp().settings.dev.mode && ehd.isCtrlDown && key === 'q') {
		event.preventDefault();
		console.clear();
	}

	// Only allow the following stuff for canvas edit pages
	if (!editor.nav.isOnEditCanvasPage) return;
	var em = getEditMode();

	// Ctrl
	if ((ehd.isCtrlDown || key === 'ctrl') && !ehd.multi) {
		log('event.ctrlKey = true');
		log('selectedTool = ' + editor.selectedTool);
		event.preventDefault();
		ehd.multi = true;

		if (ehd.isMouseOverCanvas) {
			if (em === 'arrow') setCursor('arrowPlus');
			if (em === 'pen') setCursor('penPlus');
		}

		log('ehd.lastTool = ' + ehd.lastTool);
		editor.editCanvas.redraw({calledBy: 'Event Handler - Keydown Ctrl for multi select'});
		return;
	}

	if (ehd.isCtrlDown && key === 'a') {
		for (let i of Object.keys(getCurrentProject().s)) {
			if (!getCurrentProject().glyphs[i].getPaths) return;

			getCurrentProject().glyphs[i].getPaths().forEach(function (path, i) {
				editor.multiSelect.paths.members.push(path);
				log(editor.multiSelect.paths.members);
			});
		}
		editor.multiSelect.points.selectPathsThatHaveSelectedPoints();
		editor.editCanvas.redraw({calledBy: 'Event Handler - Select all path points'});
		return;
	}

	// Space
	if (key === 'space' && ehd.isMouseOverCanvas) {
		event.preventDefault();
		if (!ehd.isSpaceDown) {
			ehd.lastTool = editor.selectedTool;
			editor.selectedTool = 'pan';
			ehd.isSpaceDown = true;
			setCursor('move');
		}
	}

	if (key === 'esc') {
		closeDialog();
	}

	// ?
	if (key === '?' || key === '¿') {
		event.preventDefault();
		toggleKeyboardTips();
	}

	// z
	if (key === 'undo' || ((ehd.multi || event.metaKey) && key === 'z')) {
		event.preventDefault();
		historyPull();
	}

	// plus
	if ((ehd.multi || event.metaKey) && key === 'plus') {
		event.preventDefault();
		viewZoom(1.1);
		editor.editCanvas.redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// minus
	if ((ehd.multi || event.metaKey) && key === 'minus') {
		event.preventDefault();
		viewZoom(0.9);
		editor.editCanvas.redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// 0
	if ((ehd.multi || event.metaKey) && key === '0') {
		event.preventDefault();
		setView(clone(editor.defaultView));
		editor.editCanvas.redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// left
	if (key === 'left' && ehd.isMouseOverCanvas) {
		event.preventDefault();
		nudge(-1, 0, event);
	}

	// right
	if (key === 'right' && ehd.isMouseOverCanvas) {
		event.preventDefault();
		nudge(1, 0, event);
	}

	// up
	if (key === 'up' && ehd.isMouseOverCanvas) {
		event.preventDefault();
		nudge(0, 1, event);
	}

	// down
	if (key === 'down' && ehd.isMouseOverCanvas) {
		event.preventDefault();
		nudge(0, -1, event);
	}

	// Only allow above stuff on Kerning page
	if (editor.nav.page === 'kerning') return;

	// Only do the below stuff if the canvas has focus

	if (ehd.isMouseOverCanvas) {
		// del
		if (key === 'del' || key === 'backspace') {
			event.preventDefault();

			if (em === 'pen') {
				editor.multiSelect.points.deletePathPoints();
				historyPut('Delete Path Point');
				editor.editCanvas.redraw({ calledBy: 'Keypress DEL or BACKSPACE' });
			} else if (em === 'arrow') {
				editor.multiSelect.paths.deletePaths();
				historyPut('Delete Path');
				editor.editCanvas.redraw({ calledBy: 'Keypress DEL or BACKSPACE' });
			}
		}

		// ctrl + c
		if ((ehd.multi || event.metaKey) && key === 'c') {
			event.preventDefault();
			copyPath();
		}

		// ctrl + v
		if ((ehd.multi || event.metaKey) && key === 'v') {
			event.preventDefault();
			pastePath();
			historyPut('Paste Path');
			editor.editCanvas.redraw({ calledBy: 'Paste Path' });
		}

		// v
		if (key === 'v') clickTool('pathEdit');

		// b
		if (key === 'b') clickTool('pathEdit');
	}
	log('handleKeyPress', 'end');
}

function getKeyFromEvent(event) {
	// log('GETKEYFROMEVENT - keyCode:' + event.keyCode + '\twhich:' + event.which);
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
		91: 'meta',
		93: 'meta',
		187: 'plus',
		189: 'minus',
		224: 'meta',
	};
	return (
		specialGlyphs[parseInt(event.which)] ||
		String.fromCharCode(event.which).toLowerCase()
	);
}

function nudge(dx, dy, ev) {
	if (ev.ctrlKey) return;

	let multiplier = editor.eventHandlers.isShiftDown ? 10 : 1;

	let mx = dx * multiplier;
	let my = dy * multiplier;
	let em = getEditMode();

	if (em === 'kern') {
		let nv = getSelectedKern().value + (mx || my);
		updateKernValue(getSelectedKernID(), nv);
		editor.editCanvas.redraw({ calledBy: 'Nudge kern value', redrawPanels: false });
	} else if (em === 'arrow') {
		editor.multiSelect.paths.updatePathPosition(mx, my);
		editor.editCanvas.redraw({ calledBy: 'Nudge path' });
	} else if (em === 'pen') {
		editor.multiSelect.points.members.forEach(function (o, i) {
			o.updatePathPointPosition('p', mx, my);
		});
		editor.editCanvas.redraw({ calledBy: 'Nudge path point' });
	}
}

function getEditMode() {
	const editor = getCurrentProjectEditor();
	if(editor.nav.page === 'kern') return 'kern';
	if(editor.selectedTool === 'pathResize') return 'arrow';
	if(editor.selectedTool === 'pathEdit') return 'pen';
}


// --------------------------------------------------------------
// Key Up
// --------------------------------------------------------------

export function handleKeyUp(event) {
	log(`handleKeyup`, 'start');
	let key = getKeyFromEvent(event);
	log(`KEY ${key} from ${event.which}`);
	log(`CTRL ${event.ctrlKey} META ${event.metaKey}`);
	// log(event);


	const editor = getCurrentProjectEditor();
	const ehd = eventHandlerData;
	// log('ehd.lastTool = ' + ehd.lastTool);

	handleSpecialKeys(event, 'up');

	if (!editor.nav.isOnEditCanvasPage) return;

	// Ctrl
	if (ehd.isCtrlDown) {
		updateCursor();
		ehd.multi = false;
		editor.editCanvas.redraw({calledBy: 'Event Handler - Keyup Ctrl for multi select'});
	}

	// Space
	if (key === 'space' && ehd.isMouseOverCanvas) {
		editor.selectedTool = ehd.lastTool;
		updateCursor();
		editor.editCanvas.redraw({calledBy: 'Event Handler - Keyup Spacebar for pan toggle'});
	}
	
	log(`handleKeyup`, 'end');
}

function handleSpecialKeys(event, keyDirection) {
	let ehd = eventHandlerData;
	let key = getKeyFromEvent(event);

	// Maybe not strong equals here?
	if (keyDirection === 'down') {
		if (event.ctrlKey || event.metaKey || event.which === 17) {
			ehd.isCtrlDown = true;
		}
		if (key === 'space') ehd.isSpaceDown = true;
		if (event.which === 16) ehd.isShiftDown = true;
	}

	if (keyDirection === 'up') {
		if (!event.ctrlKey && !event.metaKey && event.which !== 17) {
			ehd.isCtrlDown = false;
		}
		if (key === 'space') ehd.isSpaceDown = false;
		if (event.which === 16) ehd.isShiftDown = false;
	}
}