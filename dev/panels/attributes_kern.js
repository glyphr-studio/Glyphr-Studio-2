/**
    Panel > Kern
    Shows a list of all the kern pairs.
**/

function makePanel_KerningAttributes() {
  // debug('\n makePanel_KerningAttributes - START');

  let content = '<div class="navarea_header">';
  content += makePanelSuperTitle();
  content += '<h1 class="paneltitle">Pairs</h1>';
  content += '</div>';

  content += '<div class="panel_section">';
  let rows = '';
  for (let k of Object.keys(getCurrentProject().kerning)) {
    rows += makeOneKernPairRow(getCurrentProject().kerning[k], k);
  }
  content +=
    rows ||
    'No kern pairs exist yet.  You can create a new one, or add some common kern pairs to get started.';
  content += '</div>';

  content += '<div class="panel_section">';
  content +=
    '<button onclick="showNewKernPairDialog();">add new kern pair</button><br>';
  if (!rows)
    content +=
      '<button onclick="addCommonKernPairs();">add some common kern pairs</button>';
  content += '</div>';

  if (!rows) {
    content += '<div class="panel_section">';
    content += '<h2>Please note!</h2><br>';
    content +=
      'Kern information will only be exported to SVG Fonts. This is a limitation of the library we use to write OTF files.<br><br>';
    content +=
      'If you really need kern information in an OTF file, first export your project to an SVG Font, then use an online service to ';
    content += 'convert your SVG Font to an OTF Font.';
    content += '</div>';
  }

  // debug(' makePanel_KerningAttributes - END\n');
  return content;
}

function makeOneKernPairRow(k, id) {
  let selstyle = '';
  if (getSelectedKernID() === id)
    selstyle = 'style="background-color:' + _UI.colors.blue.l55 + '; ';

  let re = '<table class="kernrow"><tr>';
  re +=
    '<td class="selkern" ' +
    selstyle +
    'onclick="selectKern(\'' +
    id +
    '\');"></td>';
  re +=
    '<td><input class="rowleftgroup" type="text" onchange="updateKernGroup(\'' +
    id +
    "', 'left', this.value);\" value=\"" +
    hexToChars(k.leftgroup.join('')) +
    '"></td>';
  re +=
    '<td><input class="rowrightgroup" type="text" onchange="updateKernGroup(\'' +
    id +
    "', 'right', this.value);\" value=\"" +
    hexToChars(k.rightgroup.join('')) +
    '"></td>';
  re +=
    '<td><input class="kernvalue" type="number" id="' +
    id +
    '" value="' +
    k.value +
    '" onchange="_UI.focusElement=this.id; updateKernValue(\'' +
    id +
    '\', this.value);"></td>';
  re +=
    '<td><button class="guideremove" onclick="deleteKernPair(\'' +
    id +
    '\');">&times</button></td>';

  re += '</tr></table>';
  return re;
}

function addCommonKernPairs() {
  let add = [
    'A',
    'VWY',
    'A',
    'CO',
    'VWY',
    'A',
    'FP',
    'A',
    'O',
    'A',
    'L',
    'TVW',
  ];
  let nid;

  for (let k = 0; k < add.length; k += 2) {
    nid = generateNewID(getCurrentProject().kerning);
    getCurrentProject().kerning[nid] = new HKern({
      leftgroup: parseKernGroupInput(add[k]),
      rightgroup: parseKernGroupInput(add[k + 1]),
    });
  }

  _UI.selectedKern = getFirstID(getCurrentProject().kerning);
  redraw({ calledBy: 'addCommonKernPairs' });
}

function updateKernValue(id, val) {
  let k = getCurrentProject().kerning[id];
  k.value = val;
  // selectKern(id);
  getEditDocument().getElementById(id).value = val;
  historyPut(k.getName() + ' value: ' + val);
}

function updateKernGroup(id, side, val) {
  let k = getCurrentProject().kerning[id];
  if (side === 'left') k.leftgroup = parseKernGroupInput(val);
  else if (side === 'right') k.rightgroup = parseKernGroupInput(val);
  selectKern(id);
  historyPut('Updated Members: ' + k.getName());
}

function selectKern(id) {
  _UI.selectedKern = id;
  redraw({ calledBy: 'selectKern' });
}

function showNewKernPairDialog() {
  let con = '<h1>New Kern Pair</h1>';
  con += '<div style="width:500px;">';
  con +=
    'Create a new kern pair by specifying a glyph for the left and right sides. ';
  con +=
    'Each side of the kern pair can also be a group of glyphs.  When any glyph from the left side is displayed before any glyph in the right side, the pair will be kerned.<br><br>';
  con +=
    'Glyphs can also be specified in Unicode format (like U+0066) or hexadecimal format (like 0x0066). ';
  con +=
    'Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!<br><br>';
  con += '<h3>Kern Pair Glyphs</h3>';
  con +=
    '<input type="text" id="leftgroup" style="font-size:24px; width:45%; padding:8px; text-align:right;"/>';
  con +=
    '<input type="text" id="rightgroup" style="font-size:24px; width:45%; padding:8px;"/><br>';
  con += makeErrorMessageBox();
  con += '<br>';
  con +=
    '<button class="button--call-to-action" onclick="createNewKernPair();">create new kern pair</button>';
  con += '</div>';

  openDialog(con);
}

function createNewKernPair() {
  let l = parseKernGroupInput(document.getElementById('leftgroup').value);
  let r = parseKernGroupInput(document.getElementById('rightgroup').value);

  if (!l || !l.length)
    showErrorMessageBox('The left kern group cannot be empty.');
  else if (!r || !r.length)
    showErrorMessageBox('The right kern group cannot be empty.');
  else {
    let id = generateNewID(getCurrentProject().kerning, 'kern');

    getCurrentProject().kerning[id] = new HKern({
      leftgroup: l,
      rightgroup: r,
    });

    closeDialog();
    _UI.selectedKern = id;
    redraw({ calledBy: 'createNewKernPair' });
  }
}

function parseKernGroupInput(chars) {
  chars = trim(chars);
  chars = parseUnicodeInput(chars);
  if (chars === false) return false;
  chars = chars.filter(function (elem, pos) {
    return chars.indexOf(elem) === pos;
  });
  return chars;
}

function deleteKernPair(id) {
  let k = getCurrentProject().kerning[id];
  showToast('Deleted ' + k.getName());

  delete getCurrentProject().kerning[id];
  _UI.selectedKern = getFirstID(getCurrentProject().kerning);
  redraw({ calledBy: 'deleteKernPair' });
}
