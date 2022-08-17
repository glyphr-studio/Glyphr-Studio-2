/**
    Panel > Attributes > Glyph
    Builds a panel of attributes for a Glyph,
    which changes based on Shape or Path Point
    selection.
**/
import { log } from "../common/functions.js";
import { makeElement } from "../common/dom.js";
import { getCurrentProjectEditor } from "../app/main.js";
import { makeAttributesGroup_pathPoint, makeAttributesGroup_shape, makeInputs_position, makeInputs_size } from "./attributes.js";


export default function makePanel_GlyphAttributes() {
  log('makePanel_GlyphAttributes', 'start');
  let projectEditor = getCurrentProjectEditor();
  let selectedShapes = projectEditor.multiSelect.shapes;
  let selectedPoints = projectEditor.multiSelect.points;
  let content = '';
  // log(projectEditor);

  // For debug
  selectedShapes.select(projectEditor.selectedGlyph.shapes[0]);
  selectedPoints.select(projectEditor.selectedGlyph.shapes[0].path.pathPoints[0]);

  log(selectedShapes);
  log(`multiSelect length: ${selectedShapes.length}`);

  content += `
    <div class="panel__section">
      <h2>${projectEditor.selectedGlyph.name}</h2>
      <h3>Glyph</h3>
      ${makeInputs_position(projectEditor.selectedGlyph.x, projectEditor.selectedGlyph.y)}
      ${makeInputs_size(projectEditor.selectedGlyph.width, projectEditor.selectedGlyph.height)}
    </div>
  `;

  if (selectedShapes.length === 1) {
    // One shape selected
    log('One shape selected');
    if (selectedShapes.singleton.objType === 'ComponentInstance') {
      // component selected
      log("...Component selected");
      content += makeAttributesGroup_componentInstance(selectedShapes.singleton);
    } else {
      // regular shape selected
      log("...Regular shape selected");
      content += makeAttributesGroup_shape(selectedShapes.singleton);

      let isPointSelected = projectEditor.multiSelect.points.count() === 1;
      // if (!(_UI.selectedTool === 'pathedit' || _UI.selectedTool === 'pathaddpoint'))
      //   isPointSelected = false;

      if (isPointSelected) {
        content += makeAttributesGroup_pathPoint(projectEditor.multiSelect.points.singleton);
      }
    }
  } else {
    // Many shapes selected
    log('More than one shape selected');
    let virtualGlyph = selectedShapes.getGlyph();
    content += `
      <div class="panel__section">
        <h3>${selectedShapes.length} selected shapes</h3>
        ${makeInputs_position(virtualGlyph.x, virtualGlyph.y)}
        ${makeInputs_size(virtualGlyph.width, virtualGlyph.height)}
      </div>
    `;
  }

  // log(content);
  log('makePanel_GlyphAttributes', 'end');
  return makeElement({content: content});
}

  /*
OLD GLYPH DETAILS
  if (projectEditor.nav.page === 'components') return content;

  // AUTO GLYPH WIDTH
  content += '<h3> glyph width </h3>';

  content +=`
    <label>auto calculate <span class="unit">(em units)</span></label>
    <input type="checkbox" checked="getSelectedWorkItem().isAutoWide"/>
  `;

  if (!glyph.isAutoWide) {
    content +=
      '<input type="number" id="charaw" step="' +
      spinn +
      '" ' +
      'value="' +
      round(glyph.glyphWidth, 3) +
      '" ' +
      'onchange="_UI.focusElement=this.id; getSelectedWorkItem().glyphWidth = (this.value*1); redraw({calledBy:{calledBy:\'glyphDetails\'}});">';
  } else {
    content +=
      '<input type="number" disabled="disabled" ' +
      'value="' +
      round(glyph.glyphWidth, 3) +
      '"/>';
  }

  content += '</td>' + '</tr>';

  // LEFT SIDE BEARING
  if (glyph.isAutoWide) {
    content +=
      '<tr><td colspan=2 class="detailtitle"><h3> left side bearing </h3>';

    content +=
      '<tr>' +
      '<td> use default <span class="unit">(em units)</span> </td>' +
      '<td>' +
      // checkUI(  'getSelectedWorkItem().leftSideBearing',  glyph.leftSideBearing,  true,  true) +
      '&emsp;';

    if (glyph.leftSideBearing) {
      if (glyph.leftSideBearing === true)
        glyph.leftSideBearing = getCurrentProject().projectSettings.defaultLSB;
      content +=
        '<input type="number" id="charlsb" step="' +
        spinn +
        '" ' +
        'value="' +
        glyph.leftSideBearing +
        '" ' +
        'onchange="_UI.focusElement=this.id; getSelectedWorkItem().leftSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
    } else {
      content +=
        '<input type="number" disabled="disabled" ' +
        'value="' +
        round(getCurrentProject().projectSettings.defaultLSB, 3) +
        '"/>';
    }
    content += '</td>' + '</tr>';
  }

  // RIGHT SIDE BEARING
  if (glyph.isAutoWide) {
    content +=
      '<tr><td colspan=2 class="detailtitle"><h3> right side bearing </h3>';

    content +=
      '<tr>' +
      '<td> use default <span class="unit">(em units)</span> </td>' +
      '<td>' +
      // checkUI(  'getSelectedWorkItem().rightSideBearing',  glyph.rightSideBearing,  true,  true) +
      '&emsp;';

    if (glyph.rightSideBearing) {
      if (glyph.rightSideBearing === true)
        glyph.rightSideBearing = getCurrentProject().projectSettings.defaultRSB;
      content +=
        '<input type="number" id="charrsb" step="' +
        spinn +
        '" ' +
        'value="' +
        glyph.rightSideBearing +
        '" ' +
        'onchange="_UI.focusElement=this.id; getSelectedWorkItem().rightSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
    } else {
      content +=
        '<input type="number" disabled="disabled" ' +
        'value="' +
        round(getCurrentProject().projectSettings.defaultRSB, 3) +
        '"/>';
    }
    content += '</td>' + '</tr>';
  }

  // USED IN
  if (glyph.usedIn.length > 0) {
    content +=
      '<tr><td colspan=2><br class="detailtitle"><h3>glyphs that use this component</h3>';
    content += '<tr><td colspan=2>';
    content += makeUsedInThumbs();
    content += '';
  }

  return content;
}

*/