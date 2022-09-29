/**
		Panel > Layers
		Shows a list of all the paths in a Glyph.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { eventHandlerData } from '../edit_canvas/events_mouse.js';
import { makeActionButtonIcon } from './action_buttons.js';
import { addChildActions, getActionData } from './actions.js';
import { refreshPanel } from './panels.js';

export function makePanel_Layers() {
	// log(`makePanel_Layers`, 'start');
	let rowsArea = makeElement({className: 'panel__card full-width layer-panel__rows-area'});
	const editor = getCurrentProjectEditor();
	let selected = editor.selectedItem;
	let paths = selected.paths;

	if(eventHandlerData.newBasicPath) {
		let path = eventHandlerData.newBasicPath;
		let row = makeElement();
		row.setAttribute('class', 'layer-panel__row layer-panel__path layer-panel__new-path');
		row.classList.add('layer-panel__selected');
		row.appendChild(makeElement({
			className: 'layer-panel__layer-thumb',
			innerHTML: path.makeSVG()
		}));

		row.appendChild(makeElement({
			className: 'layer-panel__layer-name',
			innerHTML: path.name
		}));

		rowsArea.appendChild(row);
	}

	if (paths.length > 0) {
		for (let i = paths.length - 1; i >= 0; i--) {
			let path = paths[i];
			let row = makeElement();

			if (path.objType === 'ComponentInstance') {
				row.setAttribute('class', 'layer-panel__row layer-panel__component');
			} else {
				row.setAttribute('class', 'layer-panel__row layer-panel__path');
			}

			if (editor.multiSelect.paths.isSelected(path)) {
				row.classList.add('layer-panel__selected');
			}

			editor.subscribe({
				topic: 'whichPathIsSelected',
				subscriberID: 'layersPanel.rowButton',
				callback: (newSelectedPath) => {
					// log(`Layer subscription callback for selectedPath`, 'start');

					let isSelected = editor.multiSelect.paths.isSelected(path);
					// log(`isSelected: ${isSelected}`);
					// log(row.classList.toString());
					row.classList.toggle('layer-panel__selected', isSelected);
					// log(`Layer subscription callback for selectedPath`, 'end');
				}
			});

			row.addEventListener('click', () => {
				editor.multiSelect.paths.select(path);
				editor.publish('whichPathIsSelected', path);
			});

			// if (path.objType === 'ComponentInstance') {
			//   content +=
			//     '<td class="layerthumb">' + path.transformedGlyph.makeSVG() + '</td>';
			//   content += '<td class="layername">' + path.name;
			//   content +=
			//     '<span class="layernote">[linked to component: ' +
			//     getGlyphName(path.link) +
			//     ']</span>';
			// } else {

			row.appendChild(makeElement({
				className: 'layer-panel__layer-thumb',
				innerHTML: path.makeSVG()
			}));

			row.appendChild(makeElement({
				className: 'layer-panel__layer-name',
				innerHTML: path.name
			}));

			rowsArea.appendChild(row);
		}

	} else {
		rowsArea.appendChild(makeElement({
			content: `No paths exist yet.  You can create one with the New Path tools on the canvas, or by pressing "add new path" below.`
		}));
	}

	// Overall, watch for changes:
	editor.subscribe({
		topic: ['currentPath', 'currentGlyph'],
		subscriberID: 'layersPanel',
		callback: () => { refreshPanel(); }
	});

	// log(`makePanel_Layers`, 'end');
	return [rowsArea, makeActionArea_Layers()];
}

function selectPath(num) {
	// log('selectPath', 'start');
	// log('passed ' + num);
	const editor = getCurrentProjectEditor();
	let itemPaths = getSelectedItem.paths;
	// log('itemPaths ' + itemPaths);

	if (itemPaths && itemPaths[num]) {
		if (editor.eventHandlers.multi) editor.multiSelect.paths.toggle(itemPaths[num]);
		else {
			editor.multiSelect.points.clear();
			editor.multiSelect.paths.select(itemPaths[num]);
		}
	} else {
		editor.multiSelect.paths.clear();
	}
	// log('selectPath', 'end');
}

function makeActionArea_Layers() {
	const editor = getCurrentProjectEditor();

	let actionsCard = makeElement({
		className: 'panel__card full-width',
		content:'<h3>Actions</h3>'
	});

	let actionsArea = makeElement({
		tag: 'div',
		className: 'panel__actions-area',
	});
	addChildActions(actionsArea, getActionData('addPathActions'));

	let selectedPaths = editor.multiSelect.paths.members;
	let totalPaths = editor.selectedItem.paths.length;
	if(totalPaths > 1 && selectedPaths.length === 1) {
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	addAsChildren(actionsCard, actionsArea);
	return actionsCard;
}

// --------------------------------------------------------------
// Move up / down
// --------------------------------------------------------------
function movePathUp() {
	let itemPaths = getSelectedItem.paths;
	let si = itemPaths.indexOf(editor.multiSelect.paths.singleton);
	if (si > -1 && si < itemPaths.length - 1) {
		let tempPath = itemPaths[si + 1];
		itemPaths[si + 1] = itemPaths[si];
		itemPaths[si] = tempPath;
		redraw({ calledBy: 'movePathUp' });
	}
}

function movePathDown() {
	let itemPaths = getSelectedItem.paths;
	let si = itemPaths.indexOf(editor.multiSelect.paths.singleton);
	if (si > 0 && si < itemPaths.length) {
		let tempPath = itemPaths[si - 1];
		itemPaths[si - 1] = itemPaths[si];
		itemPaths[si] = tempPath;
		redraw({ calledBy: 'movePathDown' });
	}
}
