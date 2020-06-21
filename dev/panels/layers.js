/**
    Panel > Layers
    Shows a list of all the shapes in a Glyph.
**/

function makePanel_LayerChooser() {
  // debug(`\n makePanel_LayerChooser - START`);

  let content = '<div class="navarea_header">';

  content += makePanelSuperTitle();

  content += '<h1 class="paneltitle">shapes</h1>';

  content += '</div><div class="panel_section">';

  let scs = getSelectedWorkItemShapes();
  // debug(`\t selectedWorkItemShapes`);
  // debug(scs);

  // debug(`\t selectedShapes`);
  // debug(_UI.multiSelect.shapes.getMembers());

  let ts;

  if (scs.length > 0) {
    content += '<table class="layertable">';
    for (let i = scs.length - 1; i >= 0; i--) {
      ts = scs[i];

      if (_UI.multiSelect.shapes.isSelected(ts)) {
        // debug(`\t i: ${i} is selected`);
        if (ts.objType === 'ComponentInstance')
          content += '<tr class="componentlayersel"';
        else content += '<tr class="layersel"';
      } else {
        // debug(`\t i: ${i} is NOT selected`);
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

  // debug(`makePanel_LayerChooser - END\n\n`);
  return content;
}

function selectShape(num) {
  // debug('\n selectShape - START');
  // debug('\t passed ' + num);
  let wishapes = getSelectedWorkItemShapes();
  // debug('\t wishapes ' + wishapes);

  if (wishapes && wishapes[num]) {
    if (_UI.eventhandlers.multi) _UI.multiSelect.shapes.toggle(wishapes[num]);
    else {
      _UI.multiSelect.points.clear();
      _UI.multiSelect.shapes.select(wishapes[num]);
    }
  } else {
    _UI.multiSelect.shapes.clear();
  }
  // debug(' selectShape - END\n');
}

function updateLayerActions() {
  let selshapes = _UI.multiSelect.shapes.getMembers().length;
  let numshapes = getSelectedWorkItemShapes().length;

  let shapeactions = '';
  shapeactions +=
    '<button title="Add Shape\nCreates a new default shape and adds it to this glyph" onclick="addShape(); historyPut(\'Add Shape\'); redraw({calledBy:\'updateactions\'});">' +
    makeActionButton_AddShape(false) +
    '</button>';
  shapeactions +=
    '<button title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph" onclick="showDialogAddComponent();">' +
    makeActionButton_AddShape(true) +
    '</button>';
  shapeactions +=
    '<button title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one" onclick="showDialogGetShapes();">' +
    makeActionButton_PasteShapesFromAnotherGlyph() +
    '</button>';
  if (selshapes > 0)
    shapeactions +=
      '<button title="Delete\nRemoves the currently selected shape or shapes from this glyph" onclick="_UI.multiSelect.shapes.deleteShapes(); historyPut(\'Delete Shape\'); redraw({calledBy:\'updateactions\'});">' +
      makeActionButton_DeleteShape() +
      '</button>';

  let layeractions = '';
  layeractions +=
    '<button title="Move Shape Up\nMoves the shape up in the shape layer order" onclick="moveShapeUp(); historyPut(\'Move Shape Layer Up\');">' +
    makeActionButton_MoveLayerUp() +
    '</button>';
  layeractions +=
    '<button title="Move Shape Down\nMoves the shape down in the shape layer order" onclick="moveShapeDown(); historyPut(\'Move Shape Layer Down\');">' +
    makeActionButton_MoveLayerDown() +
    '</button>';

  let content = '';
  if (_UI.popOut) {
    content += '<div class="actionsarea">';
    content += '<h3>Actions</h3>';
  } else {
    content += '<h1 class="paneltitle">Actions</h1>';
    content += '<div class="actionsarea">';
  }

  content += shapeactions;
  if (numshapes > 1 && selshapes === 1) content += layeractions;

  content += '</div>';

  return content;
}

// -------------------
// Move up / down
// -------------------
function moveShapeUp() {
  let wishapes = getSelectedWorkItemShapes();
  let si = wishapes.indexOf(_UI.multiSelect.shapes.getSingleton());
  if (si > -1 && si < wishapes.length - 1) {
    let tempshape = wishapes[si + 1];
    wishapes[si + 1] = wishapes[si];
    wishapes[si] = tempshape;
    redraw({ calledBy: 'moveShapeUp' });
  }
}

function moveShapeDown() {
  let wishapes = getSelectedWorkItemShapes();
  let si = wishapes.indexOf(_UI.multiSelect.shapes.getSingleton());
  if (si > 0 && si < wishapes.length) {
    let tempshape = wishapes[si - 1];
    wishapes[si - 1] = wishapes[si];
    wishapes[si] = tempshape;
    redraw({ calledBy: 'moveShapeDown' });
  }
}
