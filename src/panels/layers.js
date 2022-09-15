/**
		Panel > Layers
		Shows a list of all the paths in a Glyph.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { eventHandlerData } from '../edit_canvas/events_mouse.js';
import { makeActionButtonIcon } from './action-buttons.js';
import { refreshPanel } from './panels.js';

export function makePanel_Layers() {
	// log(`makePanel_Layers`, 'start');
	let rowsArea = makeElement({className: 'panel__card full-width layer-panel__rows-area'});
	let editor = getCurrentProjectEditor();
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
				subscriberName: 'Layer row button',
				callback: (newSelectedPath) => {
					log(`Layer subscription callback for selectedPath`, 'start');

					let isSelected = editor.multiSelect.paths.isSelected(path);
					log(`isSelected: ${isSelected}`);
					log(row.classList.toString());
					row.classList.toggle('layer-panel__selected', isSelected);
					log(`Layer subscription callback for selectedPath`, 'end');
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
		subscriberName: 'Layer panel',
		callback: () => { refreshPanel(); }
	});

	let content = makeElement({className: 'panel__card full-width'});
	content.appendChild(rowsArea);
	content.appendChild(makeActionArea_Layers());

	// log(`makePanel_Layers`, 'end');
	return content;
}

function selectPath(num) {
	// log('selectPath', 'start');
	// log('passed ' + num);
	let itemPaths = getSelectedItem.paths;
	// log('itemPaths ' + itemPaths);

	if (itemPaths && itemPaths[num]) {
		if (projectEditor.eventHandlers.multi) projectEditor.multiSelect.paths.toggle(itemPaths[num]);
		else {
			projectEditor.multiSelect.points.clear();
			projectEditor.multiSelect.paths.select(itemPaths[num]);
		}
	} else {
		projectEditor.multiSelect.paths.clear();
	}
	// log('selectPath', 'end');
}

function makeActionArea_Layers() {
	let projectEditor = getCurrentProjectEditor();
	let selectedPaths = projectEditor.multiSelect.paths.members;

	let pathActions = `
		<button
			title="Add Path\nCreates a new default path and adds it to this glyph"
			onclick="addPath(); historyPut('Add Path'); redraw({calledBy:'updateactions'});"
		>
			${makeActionButtonIcon.addPath(false)}
		</button>
		<button
			title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph"
			onclick="showDialogAddComponent();"
		>
			${makeActionButtonIcon.addPath(true)}
		</button>
		<button
			title="Get Paths\nChoose another Glyph, and copy all the paths from that glyph to this one"
			onclick="showDialogGetPaths();"
		>
			${makeActionButtonIcon.pastePathsFromAnotherGlyph()}
		</button>
	`;

	if (selectedPaths.length > 0) {
		pathActions += `
			<button
				title="Delete\nRemoves the currently selected path or paths from this glyph"
				onclick="projectEditor.multiSelect.paths.deletePaths(); historyPut(\'Delete Path\'); redraw({calledBy:\'updateactions\'});"
			>
				${makeActionButtonIcon.deletePath()}
			</button>
		`;
	}

	let layerActions = `
		<button
			title="Move Path Up\nMoves the path up in the path layer order"
			onclick="movePathUp(); historyPut(\'Move Path Layer Up\');"
		>
			${makeActionButtonIcon.moveLayerUp()}
		</button>
		<button
			title="Move Path Down\nMoves the path down in the path layer order"
			onclick="movePathDown(); historyPut(\'Move Path Layer Down\');"
		>
			${makeActionButtonIcon.moveLayerDown()}
		</button>
	`;

	let totalPaths = projectEditor.selectedItem.paths.length;
	let content = `
		<h3>Actions</h3>
		<div class="panel__actions-area">
			${pathActions}
			${
				(totalPaths > 1 && selectedPaths.length === 1) ? layerActions : ''
			}
		</div>
	`;

	return makeElement({className: 'panel__card full-width', content: content});
}

// --------------------------------------------------------------
// Move up / down
// --------------------------------------------------------------
function movePathUp() {
	let itemPaths = getSelectedItem.paths;
	let si = itemPaths.indexOf(projectEditor.multiSelect.paths.singleton);
	if (si > -1 && si < itemPaths.length - 1) {
		let tempPath = itemPaths[si + 1];
		itemPaths[si + 1] = itemPaths[si];
		itemPaths[si] = tempPath;
		redraw({ calledBy: 'movePathUp' });
	}
}

function movePathDown() {
	let itemPaths = getSelectedItem.paths;
	let si = itemPaths.indexOf(projectEditor.multiSelect.paths.singleton);
	if (si > 0 && si < itemPaths.length) {
		let tempPath = itemPaths[si - 1];
		itemPaths[si - 1] = itemPaths[si];
		itemPaths[si] = tempPath;
		redraw({ calledBy: 'movePathDown' });
	}
}
