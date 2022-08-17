/**
    Panel > Layers
    Shows a list of all the shapes in a Glyph.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { makeActionButton } from '../common/graphics.js';

export function makePanel_Layers() {
  // log(`makePanel_Layers`, 'start');
  let projectEditor = getCurrentProjectEditor();
  let content = makeElement({className: 'left-area__panel-section full-width'});

  let selected = projectEditor.selectedWorkItem;
  let shapes = selected.shapes;
  // log(`selectedWorkItemShapes`);
  // log(shapes);

  // log(`selectedShapes`);
  // log(projectEditor.multiSelect.shapes.members);

  let shape, row, thumb, note, name;

  if (shapes.length > 0) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      shape = shapes[i];
      row = makeElement();

      if (shape.objType === 'ComponentInstance') {
        row.setAttribute('class', 'layer-panel__component-row');
      } else {
        row.setAttribute('class', 'layer-panel__shape-row');
      }

      if (projectEditor.multiSelect.shapes.isSelected(shape)) {
        row.classList.add('layer-panel__selected');
      }

      //onclick?

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

      content.appendChild(row);
    }

  } else {
    content.appendChild(makeElement({
      content: `No shapes exist yet.  You can create one with the New Shape tools on the canvas, or by pressing "add new shape" below.`
    }));
  }

  content.appendChild(updateLayerActions());

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

function updateLayerActions() {
  let projectEditor = getCurrentProjectEditor();
  let selectedShapes = projectEditor.multiSelect.shapes.members;

  let shapeActions = `
    <button
      title="Add Shape\nCreates a new default shape and adds it to this glyph"
      onclick="addShape(); historyPut('Add Shape'); redraw({calledBy:'updateactions'});"
    >
      ${makeActionButton.AddShape(false)}
    </button>
    <button
      title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph"
      onclick="showDialogAddComponent();"
    >
      ${makeActionButton.AddShape(true)}
    </button>
    <button
      title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one"
      onclick="showDialogGetShapes();"
    >
      ${makeActionButton.PasteShapesFromAnotherGlyph()}
    </button>
  `;

  if (selectedShapes.length > 0) {
    shapeActions += `
      <button
        title="Delete\nRemoves the currently selected shape or shapes from this glyph"
        onclick="projectEditor.multiSelect.shapes.deleteShapes(); historyPut(\'Delete Shape\'); redraw({calledBy:\'updateactions\'});"
      >
        ${makeActionButton.DeleteShape()}
      </button>
    `;
  }

  let layerActions = `
    <button
      title="Move Shape Up\nMoves the shape up in the shape layer order"
      onclick="moveShapeUp(); historyPut(\'Move Shape Layer Up\');"
    >
      ${makeActionButton.MoveLayerUp()}
    </button>
    <button
      title="Move Shape Down\nMoves the shape down in the shape layer order"
      onclick="moveShapeDown(); historyPut(\'Move Shape Layer Down\');"
    >
      ${makeActionButton.MoveLayerDown()}
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

  return makeElement({content: content});
}

// -------------------
// Move up / down
// -------------------
function moveShapeUp() {
  let wishapes = getSelectedWorkItemShapes();
  let si = wishapes.indexOf(projectEditor.multiSelect.shapessingleton);
  if (si > -1 && si < wishapes.length - 1) {
    let tempshape = wishapes[si + 1];
    wishapes[si + 1] = wishapes[si];
    wishapes[si] = tempshape;
    redraw({ calledBy: 'moveShapeUp' });
  }
}

function moveShapeDown() {
  let wishapes = getSelectedWorkItemShapes();
  let si = wishapes.indexOf(projectEditor.multiSelect.shapessingleton);
  if (si > 0 && si < wishapes.length) {
    let tempshape = wishapes[si - 1];
    wishapes[si - 1] = wishapes[si];
    wishapes[si] = tempshape;
    redraw({ calledBy: 'moveShapeDown' });
  }
}
