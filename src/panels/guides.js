/**
    Panel > Guides
    Shows a list of all the system and custom
    guide lines.
**/

import { getCurrentProjectEditor } from "../app/main.js";
import { makeElement } from "../common/dom.js";

export function makePanel_Guides() {
  let project = getCurrentProject();
  let content = '<div class="panel__card">';
  content += projectEditor.nav.page;
  content += '<h2>guides</h2>';
  content += '</div><div class="panel__card">';

  let system = '';
  let user = '';
  let guides = project.projectSettings.guides;
  let ps = project.projectSettings;
  let tg;

  for (let g of Object.keys(guides)) {
    tg = guides[g];

    if (tg.editable) {
      user += makeOneGuideRow(
        tg,
        'getCurrentProject().projectSettings.guides.' + g,
        tg.visible,
        g
      );
    } else if (tg.showname) {
      system += makeOneGuideRow(
        tg,
        'getCurrentProject().projectSettings.guides.' + g,
        tg.visible,
        g
      );
    }
  }

  /*
  content += '<h3 style="margin-top:0px; margin-bottom:10px;">options</h3>';
  content +=
    '<table style="width:100%;">' +
    '<tr><td style="width:20px">' +
    checkUI('_UI.showGrid', _UI.showGrid, true) +
    '</td>' +
    '<td><label style="margin-left:10px;" for="showGrid">show grid</label></td></tr>' +
    '<tr><td style="width:20px">' +
    checkUI('_UI.showGuides', _UI.showGuides, true) +
    '</td>' +
    '<td><label style="margin-left:10px;" for="showGuides">show guides</label></td></tr>' +
    '<tr><td style="width:20px">' +
    checkUI('_UI.showGuidesLabels', _UI.showGuidesLabels, true) +
    '</td>' +
    '<td><label style="margin-left:10px;" for="showGuidesLabels">show guide labels</label></td></tr>' +
    '<tr><td style="width:20px">' +
    checkUI('_UI.showOvershoots', _UI.showOvershoots, true) +
    '</td>' +
    '<td><label style="margin-left:10px;" for="showOvershoots">show overshoots (' +
    ps.overshoot +
    ' em units)</label></td></tr>' +
    // '<td colspan="2">grid transparency:<input type="range" min="0" max="100" value="'+ps.colors.glyphTransparency+'" step="1" oninput="updateTransparency(\'glyphTransparency\', this.value);"/><span id="glyphTransparency">'+ps.colors.glyphTransparency+'</span>%</td>'+sliderUI('glyphTransparency')+'</tr>'+
    '<td colspan="2">grid ' +
    sliderUI('glyphTransparency', 'glyphTransparency_panel', false, true) +
    '</td></tr>' +
    '</table>';
  */
  if (editor.nav.page !== 'kerning') {
    content += '<br><h3 style=" margin-bottom:0px;">system guides</h3>';
    // content += 'transparency:<input type="range" min="0" max="100" value="'+ps.colors.systemGuideTransparency+'" step="1" oninput="updateTransparency(\'systemGuideTransparency\', this.value);"/><span id="systemGuideTransparency">'+ps.colors.systemGuideTransparency+'</span>%<br><br>';
    content +=
      'guide ' +
      sliderUI(
        'systemGuideTransparency',
        'systemGuideTransparency_panel',
        false,
        true
      ) +
      '<br><br>';
    content += system;
    content += '<br><h3 style=" margin-bottom:0px;">custom guides</h3>';
    // content += 'transparency:<input type="range" min="0" max="100" value="'+ps.colors.customGuideTransparency+'" step="1" oninput="updateTransparency(\'customGuideTransparency\', this.value);"/><span id="customGuideTransparency">'+ps.colors.customGuideTransparency+'</span>%<br><br>';
    content +=
      'guide ' +
      sliderUI(
        'customGuideTransparency',
        'customGuideTransparency_panel',
        false,
        true
      ) +
      '<br><br>';
    content += user;
    content += '<br><button onclick="newGuide();">new guide</button>';
  }

  content += '</div>';

  return makeElement({content: content});
}

function makeOneGuideRow(guide, path, currviz, id) {
  let sys = !guide.editable;
  let re = '<table class="guiderow"><tr>';

  re += '<td class="guidecolor" style="background-color:' + guide.color + ';"';
  if (!sys) {
    re +=
      " customGuideTransparency=\"hideAllSatChoosers(); this.style.cursor='pointer'; this.style.borderColor='" +
      guide.color +
      '\';"';
    re += ' onmouseout="this.style.borderColor=\'rgb(250,252,255)\';"';
    re +=
      ' onclick="hideAllSatChoosers(); showGuideSatChooser(this, \'' +
      id +
      '\');"';
  }
  re += '>';
  re += '</td>';

  re += '<td>';
  re += checkUI(path + '.visible', currviz, true);
  re += '</td>';

  re += '<td>';
  if (guide.type === 'horizontal') {
    re +=
      '<button ' +
      (sys ? 'disabled' : '') +
      ' class="guidetype" onclick="updateGuide(\'' +
      id +
      "', 'type', 'vertical');\">&mdash;</button>";
  } else {
    re +=
      '<button ' +
      (sys ? 'disabled' : '') +
      ' class="guidetype" onclick="updateGuide(\'' +
      id +
      "', 'type', 'horizontal');\">|</button>";
  }
  re += '</td>';

  re += '<td>';
  re +=
    '<input ' +
    (sys ? 'disabled' : '') +
    ' type="text" class="guidename" value="' +
    guide.name +
    '" onchange="updateGuide(\'' +
    id +
    "', 'name', this.value);\"/>";
  re += '</td>';

  re += '<td>';
  re +=
    '<input ' +
    (sys ? 'disabled' : '') +
    ' type="number" id="' +
    id +
    '" class="guidelocation" value="' +
    round(guide.location, 3) +
    '" onchange="_UI.focusElement=this.id; updateGuide(\'' +
    id +
    "', 'location', (1*this.value));\"/>";
  re += '</td>';

  if (!sys) {
    re += '<td>';
    re +=
      '<button class="guideremove" onclick="deleteGuide(\'' +
      id +
      '\');">&times</button>';
    re += '</td>';
  }

  re += '</tr></table>';
  return re;
}

function updateGuide(id, key, value) {
  let g = getCurrentProject().projectSettings.guides[id];
  g[key] = value;
  if (key === 'type') {
    if (g.name === 'horizontal guide') g.name = 'vertical guide';
    else if (g.name === 'vertical guide') g.name = 'horizontal guide';
  }
  redraw({ calledBy: 'updateGuide' });
}

function deleteGuide(id) {
  let g = getCurrentProject().projectSettings.guides[id];
  showToast('Deleted ' + g.name);

  delete getCurrentProject().projectSettings.guides[id];
  redraw({ calledBy: 'deleteGuide' });
}

function showGuideSatChooser(ctx, id) {
  let sc = new SatChooser({
    clickCallback: function (args) {
      getCurrentProject().projectSettings.guides[id].color = args.colorstring;
      redraw({ calledBy: 'SatChooser.callback' });
    },
  });
  sc.show({ elem: ctx });
}

function hideAllSatChoosers() {
  let scid = document.getElementById('satChooser');
  while (scid) {
    scid.parentNode.removeChild(scid);
    scid = document.getElementById('satChooser');
  }
}

function newGuide() {
  let g = getCurrentProject().projectSettings.guides;
  let id = generateNewID(g, 'guide');

  g[id] = new Guide({});

  redraw({ calledBy: 'newGuide' });
}
