/**
    Panel > Actions
    Usually this is attached to the bottom of the
    Glyph Attributes panel screen mode,
    the Attributes panel gets its own column.
**/

import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeActionButton } from '../common/graphics.js';
import { makeElement } from '../common/dom.js';

export function makePanel_Actions() {

  let projectEditor = getCurrentProjectEditor();
  let ss = projectEditor.multiSelect.shapes.members;

  // TODO hook these up
  let clipBoardShape = false;
  let historyLength = 0;

  let content = '<div class="panel__section full-width">';
  content += '<h2>actions</h2>';

  // if (!existingWorkItem()) {
  //   return content + '</div></div>';
  // }

  // UNIVERSAL ACTIONS
  let allactions = '';
  allactions +=
    '<button title="Paste\nAdds the previously-copied shape or shapes into this glyph" ' +
    (clipBoardShape ? '' : 'disabled') +
    " onclick=\"pasteShape(); historyPut('Paste Shape'); redraw({calledBy:'actions panel'});\">" +
    makeActionButton.Paste(!clipBoardShape) +
    '</button>';
  allactions +=
    '<button title="Undo\nStep backwards in time one action" ' +
    (historyLength ? '' : 'disabled') +
    ' onclick="historyPull();">' +
    makeActionButton.Undo(!historyLength) +
    '</button>';

  allactions +=
    '<button title="Add Shape\nCreates a new default shape and adds it to this glyph" onclick="addShape(); historyPut(\'Add Shape\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.AddShape(false) +
    '</button>';
  allactions +=
    '<button title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph" onclick="showDialogAddComponent();">' +
    makeActionButton.AddShape(true) +
    '</button>';
  allactions +=
    '<button title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one" onclick="showDialogGetShapes();">' +
    makeActionButton.PasteShapesFromAnotherGlyph() +
    '</button>';

  if (projectEditor.nav.page === 'components')
    allactions +=
      '<button title="Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance" onclick="showDialogLinkComponentToGlyph();">' +
      makeActionButton.LinkToGlyph() +
      '</button>';

  // SHAPE
  let shapeactions = ss.length > 1 ? '<h3>shapes</h3>' : '<h3>shape</h3>';
  shapeactions +=
    '<button title="Copy\nAdds a copy of the currently selected shape or shapes to the clipboard" onclick="copyShape();">' +
    makeActionButton.Copy() +
    '</button>';
  shapeactions +=
    '<button title="Delete\nRemoves the currently selected shape or shapes from this glyph" onclick="_UI.multiSelect.shapes.deleteShapes(); historyPut(\'Delete Shape\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.DeleteShape() +
    '</button>';
  shapeactions +=
    "<button title=\"Reverse Overlap Mode\nToggles the clockwise or counterclockwise winding of the shape's path\" onclick=\"_UI.multiSelect.shapes.reverseWinding(); historyPut('Reverse Path Direction'); redraw({calledBy:'makeAttributesGroup_shape - Winding'});\">" +
    makeActionButton.ReverseWinding() +
    '</button>';
  if (ss.length === 1 && ss[0].objType === 'ComponentInstance') {
    shapeactions +=
      "<button title=\"Turn Component Instance into a Shape\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's shapes as regular Shapes to this glyph\" onclick=\"turnComponentIntoShapes(); historyPut('Unlinked Component'); redraw({calledBy:'turnComponentIntoShapes'});\">" +
      makeActionButton.SwitchShapeComponent(true) +
      '</button>';
  } else {
    shapeactions +=
      '<button title="Turn Shape into a Component Instance\nTakes the selected shape and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance" onclick="turnSelectedShapeIntoAComponent(); historyPut(\'Turned Shape into a Component\'); redraw({calledBy:\'turnSelectedShapeIntoAComponent\'});">' +
      makeActionButton.SwitchShapeComponent(false) +
      '</button>';
  }
  shapeactions +=
    '<button title="Flip Horizontal\nReflects the currently selected shape or shapes horizontally" onclick="_UI.multiSelect.shapes.flipEW(); historyPut(\'Flip Shape Horizontal\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.FlipHorizontal() +
    '</button>';
  shapeactions +=
    '<button title="Flip Vertical\nReflects the currently selected shape or shapes vertically" onclick="_UI.multiSelect.shapes.flipNS(); historyPut(\'Flip Shape Vertical\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.FlipVertical() +
    '</button>';

  // ALIGN
  let alignactions = '';
  alignactions +=
    '<button title="Align Left\nMoves all the selected shapes so they are left aligned with the leftmost shape" onclick="_UI.multiSelect.shapes.align(\'left\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('left') +
    '</button>';
  alignactions +=
    '<button title="Align Center\nMoves all the selected shapes so they are center aligned between the leftmost and rightmost shape" onclick="_UI.multiSelect.shapes.align(\'center\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('center') +
    '</button>';
  alignactions +=
    '<button title="Align Right\nMoves all the selected shapes so they are right aligned with the rightmost shape" onclick="_UI.multiSelect.shapes.align(\'right\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('right') +
    '</button>';
  alignactions +=
    '<button title="Align Top\nMoves all the selected shapes so they are top aligned with the topmost shape" onclick="_UI.multiSelect.shapes.align(\'top\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('top') +
    '</button>';
  alignactions +=
    '<button title="Align Middle\nMoves all the selected shapes so they are middle aligned between the topmost and bottommost shape" onclick="_UI.multiSelect.shapes.align(\'middle\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('middle') +
    '</button>';
  alignactions +=
    '<button title="Align Bottom\nMoves all the selected shapes so they are bottom aligned with the bottommost shape" onclick="_UI.multiSelect.shapes.align(\'bottom\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.Align('bottom') +
    '</button>';

  // LAYERS
  let layeractions = '';
  layeractions +=
    '<button title="Move Shape Up\nMoves the shape up in the shape layer order" onclick="moveShapeUp(); historyPut(\'Move Shape Layer Up\');">' +
    makeActionButton.MoveLayerUp() +
    '</button>';
  layeractions +=
    '<button title="Move Shape Down\nMoves the shape down in the shape layer order" onclick="moveShapeDown(); historyPut(\'Move Shape Layer Down\');">' +
    makeActionButton.MoveLayerDown() +
    '</button>';

  // COMBINE
  let boolactions = '';
  boolactions +=
    '<button title="Combine\nSelect two shapes, and combine their paths into a single shape" onclick="combineSelectedShapes();">' +
    makeActionButton.Combine() +
    '</button>';
  // boolactions += '<button title="Subtract Using Upper\nSelect two shapes, and the upper shape will be used to cut out an area from the lower shape" onclick="">' + makeActionButton.SubtractUsingTop() + '</button>';
  // boolactions += '<button title="Subtract Using Lower\nSelect two shapes, and the lower shape will be used to cut out an area from the upper shape" onclick="">' + makeActionButton.SubtractUsingBottom() + '</button>';

  // PATH POINT
  let pointactions = '<h3>path point</h3>';
  pointactions +=
    '<button title="Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one" onclick="_UI.multiSelect.points.insertPathPoint(); historyPut(\'Insert Path Point\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.InsertPathPoint() +
    '</button>';
  pointactions +=
    '<button title="Delete Path Point\nRemoves the currently selected point or points from the path" class="' +
    (ss.length ? '' : 'buttondis') +
    "\" onclick=\"_UI.multiSelect.points.deletePathPoints(); historyPut('Delete Path Point'); redraw({calledBy:'actions panel'});\">" +
    makeActionButton.DeletePathPoint() +
    '</button>';
  pointactions +=
    '<button title="Reset Handles\nMoves the handles of the currently selected point or points to default locations" onclick="_UI.multiSelect.points.resetHandles(); historyPut(\'Reset Path Point\'); redraw({calledBy:\'actions panel\'});">' +
    makeActionButton.ResetPathPoint() +
    '</button>';
  pointactions += '<h3>point align</h3>';
  pointactions +=
    '<button title="Align Vertically\nAlign points vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { console.log(o[0]),o[0].alignX(o[1]) }); historyPut(\'Align Points Vertically\');">' +
    makeActionButton.AlignPointsX() +
    '</button>';
  pointactions +=
    '<button title="Align Horizontally\nAlign points horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignY(o[1]) }); historyPut(\'Align Points Horizontally\');">' +
    makeActionButton.AlignPointsY() +
    '</button>';
  pointactions += '<h3>point handle align</h3>';
  pointactions +=
    '<button title="Align Handles Vertically\nAlign handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 1).forEach(function(o, i) { o[0].alignHV(); }); historyPut(\'Align Handles Vertically\');">' +
    makeActionButton.AlignHandlesV() +
    '</button>';
  pointactions +=
    '<button title="Align Handles Horizontally\nAlign handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 1).forEach(function(o, i) { o[0].alignHH(); }); historyPut(\'Align Handles Horizontally\');">' +
    makeActionButton.AlignHandlesH() +
    '</button>';
  pointactions +=
    '<button title="Align Handles Double-Cross Horizontally\nAlign both opposite handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHYCross(o[1]) }); historyPut(\'Align Handles Double-Cross Horizontally\');">' +
    makeActionButton.AlignHandlesYCross() +
    '</button>';
  pointactions +=
    '<button title="Align 1-Handles Cross-Horizontally\nAlign first opposite handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1YCross(o[1]) }); historyPut(\'Align 1-Handles Cross-Horizontally\');">' +
    makeActionButton.AlignHandlesH1YCross() +
    '</button>';
  pointactions +=
    '<button title="Align 2-Handles Cross-Horizontally\nAlign second opposite handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2YCross(o[1]) }); historyPut(\'Align 1-Handles Cross-Horizontally\');">' +
    makeActionButton.AlignHandlesH2YCross() +
    '</button>';
  pointactions +=
    '<button title="Align Handles Horizontally\nAlign handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHY(o[1]) }); historyPut(\'Align Handles Horizontally\');">' +
    makeActionButton.AlignHandlesHY() +
    '</button>';
  pointactions +=
    '<button title="Align 1-Handles Horizontally\nAlign first handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1Y(o[1]) }); historyPut(\'Align 1-Handles Horizontally\');">' +
    makeActionButton.AlignHandlesH1Y() +
    '</button>';
  pointactions +=
    '<button title="Align 2-Handles Horizontally\nAlign second handles horizontally" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2Y(o[1]) }); historyPut(\'Align 2-Handles Horizontally\');">' +
    makeActionButton.AlignHandlesH2Y() +
    '</button>';
  pointactions +=
    '<button title="Align Handles Double-Cross Vertically\nAlign both opposite handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHXCross(o[1]) }); historyPut(\'Align Handles Double Cross Vertically\');">' +
    makeActionButton.AlignHandlesXCross() +
    '</button>';
  pointactions +=
    '<button title="Align 1-Handles Cross-Vertically\nAlign first opposite handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1XCross(o[1]) }); historyPut(\'Align 1-Handles Cross-Vertically\');">' +
    makeActionButton.AlignHandlesH1XCross() +
    '</button>';
  pointactions +=
    '<button title="Align 2-Handles Cross-Vertically\nAlign second opposite handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2XCross(o[1]) }); historyPut(\'Align 1-Handles Cross-Vertically\');">' +
    makeActionButton.AlignHandlesH2XCross() +
    '</button>';
  pointactions +=
    '<button title="Align Handles Vertically\nAlign handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHX(o[1]) }); historyPut(\'Align Handles Vertically\');">' +
    makeActionButton.AlignHandlesHX() +
    '</button>';
  pointactions +=
    '<button title="Align 1-Handles Vertically\nAlign first handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1X(o[1]) }); historyPut(\'Align 1-Handles Vertically\');">' +
    makeActionButton.AlignHandlesH1X() +
    '</button>';
  pointactions +=
    '<button title="Align 2-Handles Vertically\nAlign second handles vertically" onclick="kCombinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2X(o[1]) }); historyPut(\'Align 2-Handles Vertically\');">' +
    makeActionButton.AlignHandlesH2X() +
    '</button>';
  pointactions += '<h3>point autofit</h3>';
  pointactions +=
    '<button title="Autofit XY\nAutofit a point based on the selected points" onclick="kCombinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetXY(o[0], o[1], o[3] ? o[2] : {p:{x:undefined}}) }); historyPut(\'Autofit XY\');">' +
    makeActionButton.AutofitXY() +
    '</button>';
  pointactions +=
    '<button title="Autofit X\nAutofit a point based on the selected points" onclick="kCombinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetX(o[0], o[1], o[3] ? o[2] : {p:{x:undefined}}) }); historyPut(\'Autofit X\');">' +
    makeActionButton.AutofitX() +
    '</button>';
  pointactions +=
    '<button title="Autofit Y\nAutofit a point based on the selected points" onclick="kCombinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetY(o[0], o[1], o[3] ? o[2] : {p:{x:undefined}}) }); historyPut(\'Autofit Y\');">' +
    makeActionButton.AutofitY() +
    '</button>';

  // GLYPH
  let glyphactions = '<h3>glyph</h3>';
  glyphactions +=
    '<button title="Combine all shapes\nCombines the paths of all shapes with the same winding into as few shapes as possible" onclick="combineAllGlyphShapes();">' +
    makeActionButton.Combine() +
    '</button>';
  glyphactions +=
    '<button title="Flip Vertical\nReflects the glyph vertically" onclick="getSelectedWorkItem().flipEW(); historyPut(\'Flip Glyph : Vertical\'); redraw({calledBy:\'Glyph Details - FlipEW\'});">' +
    makeActionButton.FlipHorizontal() +
    '</button>';
  glyphactions +=
    '<button title="Flip Horizontal\nReflects the glyph horizontally" onclick="getSelectedWorkItem().flipNS(); historyPut(\'Flip Glyph : Horizontal\'); redraw({calledBy:\'Glyph Details - FlipNS\'});">' +
    makeActionButton.FlipVertical() +
    '</button>';

  // DEV
  let devactions = '';
  let dev = getGlyphrStudioApp().settings.dev;
  if (dev.mode) {
    if (dev.testActions.length) devactions += '<h3>test</h3>';
    for (let a = 0; a < dev.testActions.length; a++) {
      devactions +=
        '<button onclick="' +
        dev.testActions[a].onclick +
        '">' +
        dev.testActions[a].name +
        '</button>';
    }
  }

  // Put it all together
  content += '<div class="actionsArea">';

  content += allactions;

  if (ss.length === 0) content += glyphactions;
  if (ss.length > 0) content += shapeactions;
  if (ss.length > 1) content += boolactions;
  if (ss.length === 1) content += layeractions;
  if (ss.length > 1) content += alignactions;

  let ispointsel = false;
  if (projectEditor.multiSelect.points.count() > 0) ispointsel = true;
  // if (_UI.selectedTool !== 'pathedit') ispointsel = false;

  if (ispointsel) {
    content += pointactions;
  }

  content += devactions;

  content += '</div>';
  content += '</div>';

  return makeElement({content: content});
}

// -------------------
// Combine
// -------------------

function combineSelectedShapes() {
  showToast('Combining selected shapes... ', 100);

  setTimeout(function () {
    _UI.multiSelect.shapes.combine();
    historyPut('combine selected shapes');
    redraw({ calledBy: 'actions panel' });
  }, 200);
}

function combineAllGlyphShapes() {
  showToast('Combining all glyph shapes... ', 100);

  setTimeout(function () {
    getSelectedWorkItem().combineAllShapes(true);
    historyPut('combine all glyph shapes');
    redraw({ calledBy: 'actions panel' });
  }, 200);
}

// -------------------
// Copy Paste
// -------------------
function copyShape() {
  let ssm = _UI.multiSelect.shapes.members;
  if (ssm.length) {
    _UI.clipboardShape = {
      s: clone(ssm),
      c: _UI.selectedGlyph,
      dx: 0,
      dy: 0,
    };
    // log("COPYShape() - new clipboard shape: " + _UI.clipboardShape._UI.multiSelect.shapes.name);
  }
  redraw({ calledBy: 'copyShape', redrawCanvas: false });
}

function pasteShape() {
  // log('pasteShape', 'start');
  let cbs = _UI.clipboardShape;
  // log(cbs);
  let selwi = getSelectedWorkItemID();

  if (cbs) {
    let newshapes = [];
    let sourceshapes = cbs.s;
    var ts, newname, newsuffix, n;
    let offsetShapes = cbs.c === selwi;

    for (let s = 0; s < sourceshapes.length; s++) {
      var ts;

      if (sourceshapes[s].objType === 'ComponentInstance') {
        ts = new ComponentInstance(sourceshapes[s]);
      } else {
        ts = new Shape(sourceshapes[s]);
      }

      // log('shape ' + s);
      // log('objType: ' + ts.objType);
      // log('checking for moved glyphs: ' + cbs.c + ' to ' + selwi);
      // log('offsetShapes: ' + offsetShapes);

      if (offsetShapes) {
        if (s === 0) {
          cbs.dx += 20;
          cbs.dy -= 20;
        }
        ts.updateShapePosition(cbs.dx, cbs.dy, true);
      } else {
        cbs.dx = 0;
        cbs.dy = 0;
      }

      newname = ts.name;
      newsuffix = ' (copy)';
      n = ts.name.lastIndexOf('(copy');

      if (n > 0) {
        let suffix = newname.substring(n + 5);
        newname = newname.substring(0, n);
        if (suffix === ')') {
          newsuffix = '(copy 2)';
        } else {
          // log("\t - suffix " + suffix);
          suffix = suffix.substring(1);
          // log("\t - suffix " + suffix);
          suffix = suffix.substring(0, suffix.length - 1);
          // log("\t - suffix " + suffix);
          newsuffix = '(copy ' + (parseInt(suffix) + 1) + ')';
          // log("\t - newsuffix " + newsuffix);
        }
      }
      ts.name = newname + newsuffix;

      if (ts.objType === 'ComponentInstance') {
        getGlyph(ts.link).addToUsedIn(getSelectedWorkItemID);
        // _UI.selectedGlyph.addToUsedIn(ts.link);
        // log("PASTESHAPE - pasted a component, added " + _UI.selectedGlyph + " to usedIn array.");
      }

      newshapes.push(addShape(ts));
    }

    _UI.multiSelect.shapes.clear();
    _UI.multiSelect.points.clear();

    for (let t = 0; t < newshapes.length; t++)
      _UI.multiSelect.shapes.add(newshapes[t]);

    cbs.c = selwi;

    // log('pasteShapes', 'end');
  }
}

function showDialogGetShapes(msg) {
  let content = '<h1>Get Shapes</h1>';
  content +=
    'Clicking a glyph will copy all the shapes in that glyph, and paste them into this glyph.<br><br>';
  content += msg ? msg : '';
  content += initGetShapesDialogOptions();

  _UI.glyphChooser.dialog = {
    fname: 'pasteShapesFrom',
    choices: 'all',
    selected: 'glyphs',
  };

  openBigDialog(content);
}

function initGetShapesDialogOptions(type) {
  /*
        _UI.glyphChooser.getShapeOptions = {
            srcAutoWidth: false,
            srcWidth: false,
            srcLSB: false,
            srcRSB: false
        };
        */
  type = type || 'shapes';
  let gso = _UI.glyphChooser.getShapeOptions;

  let content = '<br><br><br><br><h3>Copy options</h3>';

  if (type === 'shapes')
    content +=
      'When copying the shapes from the other glyph, also copy these attributes to this glyph:';
  else
    content +=
      'When inserting the Component Instance, also copy these attributes from the Root Component to this glyph:';

  content += '<table class="settingstable projectSettings">';

  content +=
    '<tr><td style="text-align:right; vertical-align:top;">' +
    checkUI('_UI.glyphChooser.getShapeOptions.srcAutoWidth', gso.srcAutoWidth) +
    '</td>' +
    '<td style="vertical-align:top;"><label for="srcAutoWidth">Auto-calculate Width</label><br><br></td></tr>';

  content +=
    '<tr><td style="text-align:right; vertical-align:top;">' +
    checkUI('_UI.glyphChooser.getShapeOptions.srcWidth', gso.srcWidth) +
    '</td>' +
    '<td style="vertical-align:top;"><label for="srcWidth">Glyph Width</label><br><br></td></tr>';

  content +=
    '<tr><td style="text-align:right; vertical-align:top;">' +
    checkUI('_UI.glyphChooser.getShapeOptions.srcLSB', gso.srcLSB) +
    '</td>' +
    '<td style="vertical-align:top;"><label for="srcLSB">Left Side Bearing</label><br><br></td></tr>';

  content +=
    '<tr><td style="text-align:right; vertical-align:top;">' +
    checkUI('_UI.glyphChooser.getShapeOptions.srcRSB', gso.srcRSB) +
    '</td>' +
    '<td style="vertical-align:top;"><label for="srcRSB">Right Side Bearing</label><br><br></td></tr>';

  content += '</table>';

  return content;
}

function pasteShapesFrom(sourceGlyphID) {
  let destinationGlyphID = getSelectedWorkItemID();
  let sourceGlyph = getGlyph(sourceGlyphID);

  if (sourceGlyphID !== destinationGlyphID && sourceGlyph) {
    sourceGlyph.copyShapesTo(
      destinationGlyphID,
      _UI.glyphChooser.getShapeOptions
    );

    // showToast('Copied ' + this.shapes.length + ' shapes');
    redraw({ calledBy: 'pasteShapesFrom' });
    historyPut(
      'Copied shapes from "' +
        getGlyphName(sourceGlyphID) +
        '" to  "' +
        getSelectedWorkItemName()
    );
    if (_UI.selectedTool === 'pathaddpoint') _UI.selectedTool = 'shaperesize';
    closeDialog();
  } else {
    showDialogGetShapes(
      "Sorry, you can't paste shapes from the glyph you selected.<br>"
    );
  }
}

// -------------------
// COMPONENT Actions
// -------------------

function showDialogLinkComponentToGlyph(msg) {
  let sls = getSelectedWorkItem();
  let content = '<h1>Link to Glyph</h1>';
  content += 'Select a Glyph you would like to link to this Component.<br><br>';
  content += msg
    ? msg
    : 'There are currently ' +
      sls.usedIn.length +
      ' instances of "' +
      sls.name +
      '" being used in various Glyphs.<br><br>';

  _UI.glyphChooser.dialog = {
    fname: 'linkComponentToGlyph',
    choices: 'all',
    selected: 'glyphs',
  };

  openBigDialog(content);
}

function linkComponentToGlyph(id) {
  if (insertComponentInstance(_UI.selectedComponent, id)) {
    showDialogLinkComponentToGlyph(
      'The Component "' +
        getSelectedWorkItem().name +
        '" was successfully linked to Glyph "' +
        getGlyphName(id) +
        '".<br><br>'
    );
  }
}
