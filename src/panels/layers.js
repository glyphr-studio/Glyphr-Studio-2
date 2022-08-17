/**
    Panel > Layers
    Shows a list of all the shapes in a Glyph.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import {
    makeActionButton_AddShape,
    makeActionButton_PasteShapesFromAnotherGlyph,
    makeActionButton_DeleteShape,
    makeActionButton_MoveLayerUp,
    makeActionButton_MoveLayerDown
} from '../common/graphics.js';

export function makePanel_Layers() {
  // log(`makePanel_Layers`, 'start');
  let projectEditor = getCurrentProjectEditor();
  let content = '<div class="panel__section">';

  let selected = projectEditor.selectedWorkItem;
  let shapes = selected.shapes;
  // log(`selectedWorkItemShapes`);
  // log(shapes);

  // log(`selectedShapes`);
  // log(projectEditor.multiSelect.shapes.members);

  let ts;

  if (shapes.length > 0) {
    content += '<table class="layertable">';
    for (let i = shapes.length - 1; i >= 0; i--) {
      ts = shapes[i];

      if (projectEditor.multiSelect.shapes.isSelected(ts)) {
        // log(`i: ${i} is selected`);
        if (ts.objType === 'ComponentInstance')
          content += '<tr class="componentlayersel"';
        else content += '<tr class="layersel"';
      } else {
        // log(`i: ${i} is NOT selected`);
        if (ts.objType === 'ComponentInstance')
          content += '<tr class="componentlayer"';
        else content += '<tr class="layer"';
      }

      content += ' onclick="selectShape(' + i + '); ';
      if (ts.objType === 'ComponentInstance')
        content += "clickTool('shaperesize'); ";
      content += " redraw({calledBy:'updatelayers'});";
      content += '">';

      if (ts.objType === 'ComponentInstance') {
        content +=
          '<td class="layerthumb">' + ts.transformedGlyph.makeSVG() + '</td>';
        content += '<td class="layername">' + ts.name;
        content +=
          '<span class="layernote">[linked to component: ' +
          getGlyphName(ts.link) +
          ']</span>';
      } else {
        content += '<td class="layerthumb">' + ts.makeSVG() + '</td>';
        content += '<td class="layername">' + ts.name;
      }

      content += '</td></tr>';
    }
    content += '</table>';
  } else {
    content +=
      '<div>No shapes exist yet.  You can create one with the New Shape tools on the canvas, or by pressing "add new shape" below.<br><br></div>';
  }

  content += '<br><br>' + updateLayerActions();

  content += '</div>';

  // log(`makePanel_Layers`, 'end');
  return makeElement({content: content});
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
      ${makeActionButton_AddShape(false)}
    </button>
    <button
      title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph"
      onclick="showDialogAddComponent();"
    >
      ${makeActionButton_AddShape(true)}
    </button>
    <button
      title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one"
      onclick="showDialogGetShapes();"
    >
      ${makeActionButton_PasteShapesFromAnotherGlyph()}
    </button>
  `;

  if (selectedShapes.length > 0) {
    shapeActions += `
      <button
        title="Delete\nRemoves the currently selected shape or shapes from this glyph"
        onclick="projectEditor.multiSelect.shapes.deleteShapes(); historyPut(\'Delete Shape\'); redraw({calledBy:\'updateactions\'});"
      >
        ${makeActionButton_DeleteShape()}
      </button>
    `;
  }

  let layerActions = `
    <button
      title="Move Shape Up\nMoves the shape up in the shape layer order"
      onclick="moveShapeUp(); historyPut(\'Move Shape Layer Up\');"
    >
      ${makeActionButton_MoveLayerUp()}
    </button>
    <button
      title="Move Shape Down\nMoves the shape down in the shape layer order"
      onclick="moveShapeDown(); historyPut(\'Move Shape Layer Down\');"
    >
      ${makeActionButton_MoveLayerDown()}
    </button>
  `;

  let totalShapes = projectEditor.selectedWorkItem.shapes.length;
  let content = `
    <h3>Actions</h3>
    <div class="actionsarea">
      ${shapeActions}
      ${
        (totalShapes > 1 && selectedShapes.length === 1) ? layerActions : ''
      }
    </div>
  `;

  return content;
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
