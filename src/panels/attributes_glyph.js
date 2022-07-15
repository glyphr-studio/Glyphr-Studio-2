/**
    Panel > Attributes > Glyph
    Builds a panel of attributes for a Glyph,
    which changes based on Shape or Path Point
    selection.
**/
import { log } from "../common/functions.js";
import { getCurrentProjectEditor } from "../app/main.js";
import { makeAttributesGroup_pathPoint, makeAttributesGroup_shape, makeInputs_position, makeInputs_size } from "./attributes.js";


export default function makePanel_GlyphAttributes() {
  log('makePanel_GlyphAttributes', 'start');
  let projectEditor = getCurrentProjectEditor();
  let content = '<div class="panel__section">';
  // log(projectEditor);

  log(projectEditor.multiSelect.shapes);
  log(`multiSelect length: ${projectEditor.multiSelect.shapes.length}`);
  if (projectEditor.multiSelect.shapes.length === 0) {
    // no shape selected
    log("No shape selected");
    content += makeInputs_position(projectEditor.selectedGlyph.x, projectEditor.selectedGlyph.y);
    content += makeInputs_size(projectEditor.selectedGlyph.width, projectEditor.selectedGlyph.height);

  } else if (projectEditor.multiSelect.shapes.length === 1) {
    // One shape selected
    log('One shape selected');
    if (projectEditor.multiSelect.shapes[0].objType === 'ComponentInstance') {
      // component selected
      log("...Component selected");
      content += makeAttributesGroup_componentInstance(projectEditor.multiSelect.shapes[0]);
    } else {
      // regular shape selected
      log("...Regular shape selected");
      content += makeAttributesGroup_shape(projectEditor.multiSelect.shapes[0]);

      let isPointSelected = _UI.multiSelect.points.count() === 1;
      if (!(_UI.selectedTool === 'pathedit' || _UI.selectedTool === 'pathaddpoint'))
        isPointSelected = false;

      if (isPointSelected) {
        content += makeAttributesGroup_pathPoint(_UI.multiSelect.points.getSingleton());
      }
    }
  } else {
    // Many shapes selected
    log('More than one shape selected');
    content += `<h3>${projectEditor.multiSelect.shapes.length} selected shapes</h3>`;
    let virtualGlyph = projectEditor.multiSelect.shapes.getGlyph();
    content += makeInputs_position(virtualGlyph.x, virtualGlyph.y);
    content += makeInputs_size(virtualGlyph.width, virtualGlyph.height);
  }

  content += '</div>';
  // log(content);
  log('makePanel_GlyphAttributes', 'end');
  return content;
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