/**
		Framework > Event Handlers > Keyboard
		All keyboard handlers can be found here.
**/

const { getGlyphrStudioApp } = require("../app/main");

function keyup(event) {
	let eh = _UI.eventHandlers;
	// log('eh.lastTool = ' + eh.lastTool);

	eh.isShiftDown = false;
	let kc = getKeyFromEvent(event);
	// log('Key Up:\t\t' + kc + ' from ' + event.which);
	// log('CTRL ' + event.ctrlKey + ' META ' + event.metaKey);
	// log(event);

	if (!onEditCanvasPage()) return;

	let isCtrlDown = event.ctrlKey || event.metaKey || event.which == 17;

	// Ctrl
	if (isCtrlDown) {
		updateCursor();
		eh.multi = false;
		redraw({
			calledBy: 'Event Handler - Keyup Ctrl for multi select',
			redrawPanels: false,
		});
	}

	// Space
	if (kc === 'space' && eh.ismouseovercec) {
		_UI.selectedTool = eh.lastTool;
		eh.isSpaceDown = false;
		updateCursor();
		redraw({
			calledBy: 'Event Handler - Keyup Spacebar for pan toggle',
			redrawCanvas: false,
		});
	}
}

function keypress(event) {
	// log('keypress', 'start');
	if (event.type !== 'keydown') return;
	if (editor.nav.page === 'openproject') return;
	if (getEditDocument().activeElement.id === 'contextglyphsinput') return;

	let eh = _UI.eventHandlers;
	let overcanvas = eh.ismouseovercec;
	let kc = getKeyFromEvent(event);
	let isCtrlDown = event.ctrlKey || event.metaKey || event.which == 17;
	if (event.which === 16) {
		eh.isShiftDown = true;
	}

	// log('Key Press:\t' + kc + ' from ' + event.which);
	// log('CTRL ' + event.ctrlKey + ' META ' + event.metaKey);
	// log(event);

	// shift s (save as)
	if (isCtrlDown && eh.isShiftDown && kc === 's') {
		event.preventDefault();
		eh.isShiftDown = false;
		saveGlyphrProjectFile(false); // save as always
	}

	// s
	else if (isCtrlDown && kc === 's') {
		event.preventDefault();
		eh.isShiftDown = false;
		saveGlyphrProjectFile(true); // overwrite if electron
	}

	// g
	if (isCtrlDown && kc === 'g') {
		event.preventDefault();
		showToast('Exporting SVG font file...');
		setTimeout(ioSVG_exportSVGfont, 500);
	}

	// e
	if (isCtrlDown && kc === 'e') {
		event.preventDefault();
		showToast('Exporting OTF font file...');
		setTimeout(ioOTF_exportOTFfont, 500);
	}

	// o
	if (isCtrlDown && kc === 'o') {
		// log('pressed Ctrl + O');
		event.preventDefault();

		window.open('http://glyphrstudio.com/online', '_blank');
	}

	// q
	// for dev mode clear console
	if (getGlyphrStudioApp().settings.dev.mode && isCtrlDown && kc === 'q') {
		event.preventDefault();
		console.clear();
	}

	// Only allow the following stuff for canvas edit pages
	if (!onEditCanvasPage()) return;
	var em = getEditMode();

	// Ctrl
	if ((isCtrlDown || kc === 'ctrl') && !eh.multi) {
		// log('event.ctrlKey = true');
		// log('selectedTool = ' + _UI.selectedTool);
		event.preventDefault();
		eh.multi = true;

		if (overcanvas) {
			if (em === 'arrow') setCursor('arrowPlus');
			if (em === 'pen') setCursor('penPlus');
		}

		// log('eh.lastTool = ' + eh.lastTool);
		redraw({
			calledBy: 'Event Handler - Keydown Ctrl for multi select',
			redrawPanels: false,
		});
		return;
	}

	if (isCtrlDown && kc === 'a') {
		for (let i of Object.keys(getCurrentProject().s)) {
			if (!getCurrentProject().glyphs[i].getPaths) return;

			getCurrentProject()
				.glyphs[i].getPaths()
				.forEach(function (path, i) {
					_UI.multiSelect.paths.members.push(path);
					// log(_UI.multiSelect.paths.members);
				});
		}
		_UI.multiSelect.points.selectPathsThatHaveSelectedPoints();
		redraw({
			calledBy: 'Event Handler - Select all path points',
			redrawPanels: false,
		});
		return;
	}

	// Space
	if (kc === 'space' && overcanvas) {
		event.preventDefault();
		if (!eh.isSpaceDown) {
			eh.lastTool = _UI.selectedTool;
			_UI.selectedTool = 'pan';
			eh.isSpaceDown = true;
			setCursor('move');
		}
	}

	if (kc === 'esc') {
		closeDialog();
	}

	// ?
	if (kc === '?' || kc === '¿') {
		event.preventDefault();
		toggleKeyboardTips();
	}

	// z
	if (kc === 'undo' || ((eh.multi || event.metaKey) && kc === 'z')) {
		event.preventDefault();
		historyPull();
	}

	// plus
	if ((eh.multi || event.metaKey) && kc === 'plus') {
		event.preventDefault();
		viewZoom(1.1);
		redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// minus
	if ((eh.multi || event.metaKey) && kc === 'minus') {
		event.preventDefault();
		viewZoom(0.9);
		redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// 0
	if ((eh.multi || event.metaKey) && kc === '0') {
		event.preventDefault();
		setView(clone(_UI.defaultView));
		redraw({ calledBy: 'Zoom Keyboard Shortcut', redrawCanvas: false });
	}

	// left
	if (kc === 'left' && overcanvas) {
		event.preventDefault();
		nudge(-1, 0, event);
	}

	// right
	if (kc === 'right' && overcanvas) {
		event.preventDefault();
		nudge(1, 0, event);
	}

	// up
	if (kc === 'up' && overcanvas) {
		event.preventDefault();
		nudge(0, 1, event);
	}

	// down
	if (kc === 'down' && overcanvas) {
		event.preventDefault();
		nudge(0, -1, event);
	}

	// Only allow above stuff on Kerning page
	if (editor.nav.page === 'kerning') return;

	// Only do the below stuff if the canvas has focus

	if (overcanvas) {
		// del
		if (kc === 'del' || kc === 'backspace') {
			event.preventDefault();
			var em = getEditMode();

			if (em === 'pen') {
				_UI.multiSelect.points.deletePathPoints();
				historyPut('Delete Path Point');
				redraw({ calledBy: 'Keypress DEL or BACKSPACE' });
			} else if (em === 'arrow') {
				_UI.multiSelect.paths.deletePaths();
				historyPut('Delete Path');
				redraw({ calledBy: 'Keypress DEL or BACKSPACE' });
			}
		}

		// ctrl + c
		if ((eh.multi || event.metaKey) && kc === 'c') {
			event.preventDefault();
			copyPath();
		}

		// ctrl + v
		if ((eh.multi || event.metaKey) && kc === 'v') {
			event.preventDefault();
			pastePath();
			historyPut('Paste Path');
			redraw({ calledBy: 'Paste Path' });
		}

		// v
		if (kc === 'v') clickTool('pathEdit');

		// b
		if (kc === 'b') clickTool('pathEdit');
	}
	// log('keypress', 'end');
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

	let multiplyer = _UI.eventHandlers.isShiftDown ? 10 : 1;

	let mx = dx * multiplyer;
	let my = dy * multiplyer;
	let em = getEditMode();

	if (em === 'kern') {
		let nv = getSelectedKern().value + (mx || my);
		updateKernValue(getSelectedKernID(), nv);
		redraw({ calledBy: 'Nudge kern value', redrawPanels: false });
	} else if (em === 'arrow') {
		_UI.multiSelect.paths.updatePathPosition(mx, my);
		redraw({ calledBy: 'Nudge path' });
	} else if (em === 'pen') {
		_UI.multiSelect.points.members.forEach(function (o, i) {
			o.updatePathPointPosition('p', mx, my);
		});
		redraw({ calledBy: 'Nudge path point' });
	}
}
