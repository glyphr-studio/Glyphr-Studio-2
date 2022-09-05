/**
		Panel > Layers
		Shows a list of all the shapes in a Glyph.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { makeActionButtonIcon } from './action-buttons.js';

export function makePanel_Layers() {
	// log(`makePanel_Layers`, 'start');
	let rowsArea = makeElement({className: 'panel__section full-width layer-panel__rows-area'});
	let editor = getCurrentProjectEditor();
	let selected = editor.selectedWorkItem;
	let shapes = selected.shapes;

	if (shapes.length > 0) {
		for (let i = shapes.length - 1; i >= 0; i--) {
			let shape = shapes[i];
			let row = makeElement();

			if (shape.objType === 'ComponentInstance') {
				row.setAttribute('class', 'layer-panel__row layer-panel__component');
			} else {
				row.setAttribute('class', 'layer-panel__row layer-panel__shape');
			}

			if (editor.multiSelect.shapes.isSelected(shape)) {
				row.classList.add('layer-panel__selected');
			}

			editor.subscribe({
				topic: 'whichShapeIsSelected',
				subscriberName: 'Layer row button',
				callback: (newSelectedShape) => {
					log(`Layer subscription callback for selectedShape`, 'start');

					let isSelected = editor.multiSelect.shapes.isSelected(shape);
					log(`isSelected: ${isSelected}`);
					log(row.classList.toString());
					row.classList.toggle('layer-panel__selected', isSelected);
					log(`Layer subscription callback for selectedShape`, 'end');
				}
			});

			row.addEventListener('click', () => {
				editor.multiSelect.shapes.select(shape);
				editor.publish('whichShapeIsSelected', shape);
			});

			// if (shape.objType === 'ComponentInstance') {
			//   content +=
			//     '<td class="layerthumb">' + shape.transformedGlyph.makeSVG() + '</td>';
			//   content += '<td class="layername">' + shape.name;
			//   content +=
			//     '<span class="layernote">[linked to component: ' +
			//     getGlyphName(shape.link) +
			//     ']</span>';
			// } else {

			row.appendChild(makeElement({
				className: 'layer-panel__layer-thumb',
				innerHTML: shape.makeSVG()
			}));

			row.appendChild(makeElement({
				className: 'layer-panel__layer-name',
				innerHTML: shape.name
			}));

			rowsArea.appendChild(row);
		}

	} else {
		rowsArea.appendChild(makeElement({
			content: `No shapes exist yet.  You can create one with the New Shape tools on the canvas, or by pressing "add new shape" below.`
		}));
	}

	let content = makeElement({className: 'panel__section full-width'});
	content.appendChild(rowsArea);
	content.appendChild(makeActionArea_Layers());

	// log(`makePanel_Layers`, 'end');
	return content;
}

function selectShape(num) {
	// log('selectShape', 'start');
	// log('passed ' + num);
	let wishapes = getSelectedWorkItemShapes();
	// log('wishapes ' + wishapes);

	if (wishapes && wishapes[num]) {
		if (projectEditor.eventhandlers.multi) projectEditor.multiSelect.shapes.toggle(wishapes[num]);
		else {
			projectEditor.multiSelect.points.clear();
			projectEditor.multiSelect.shapes.select(wishapes[num]);
		}
	} else {
		projectEditor.multiSelect.shapes.clear();
	}
	// log('selectShape', 'end');
}

function makeActionArea_Layers() {
	let projectEditor = getCurrentProjectEditor();
	let selectedShapes = projectEditor.multiSelect.shapes.members;

	let shapeActions = `
		<button
			title="Add Shape\nCreates a new default shape and adds it to this glyph"
			onclick="addShape(); historyPut('Add Shape'); redraw({calledBy:'updateactions'});"
		>
			${makeActionButtonIcon.addShape(false)}
		</button>
		<button
			title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph"
			onclick="showDialogAddComponent();"
		>
			${makeActionButtonIcon.addShape(true)}
		</button>
		<button
			title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one"
			onclick="showDialogGetShapes();"
		>
			${makeActionButtonIcon.pasteShapesFromAnotherGlyph()}
		</button>
	`;

	if (selectedShapes.length > 0) {
		shapeActions += `
			<button
				title="Delete\nRemoves the currently selected shape or shapes from this glyph"
				onclick="projectEditor.multiSelect.shapes.deleteShapes(); historyPut(\'Delete Shape\'); redraw({calledBy:\'updateactions\'});"
			>
				${makeActionButtonIcon.deleteShape()}
			</button>
		`;
	}

	let layerActions = `
		<button
			title="Move Shape Up\nMoves the shape up in the shape layer order"
			onclick="moveShapeUp(); historyPut(\'Move Shape Layer Up\');"
		>
			${makeActionButtonIcon.moveLayerUp()}
		</button>
		<button
			title="Move Shape Down\nMoves the shape down in the shape layer order"
			onclick="moveShapeDown(); historyPut(\'Move Shape Layer Down\');"
		>
			${makeActionButtonIcon.moveLayerDown()}
		</button>
	`;

	let totalShapes = projectEditor.selectedWorkItem.shapes.length;
	let content = `
		<h3>Actions</h3>
		<div class="actionsArea">
			${shapeActions}
			${
				(totalShapes > 1 && selectedShapes.length === 1) ? layerActions : ''
			}
		</div>
	`;

	return makeElement({className: 'panel__section full-width', content: content});
}

// --------------------------------------------------------------
// Move up / down
// --------------------------------------------------------------
function moveShapeUp() {
	let wishapes = getSelectedWorkItemShapes();
	let si = wishapes.indexOf(projectEditor.multiSelect.shapes.singleton);
	if (si > -1 && si < wishapes.length - 1) {
		let tempshape = wishapes[si + 1];
		wishapes[si + 1] = wishapes[si];
		wishapes[si] = tempshape;
		redraw({ calledBy: 'moveShapeUp' });
	}
}

function moveShapeDown() {
	let wishapes = getSelectedWorkItemShapes();
	let si = wishapes.indexOf(projectEditor.multiSelect.shapes.singleton);
	if (si > 0 && si < wishapes.length) {
		let tempshape = wishapes[si - 1];
		wishapes[si - 1] = wishapes[si];
		wishapes[si] = tempshape;
		redraw({ calledBy: 'moveShapeDown' });
	}
}
