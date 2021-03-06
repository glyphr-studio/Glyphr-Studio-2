import { isVal, clone } from '../common/functions.js';
import { getGlyphrStudioApp } from '../../app/main.js';

export { sXcX, sYcY };
export { getView, setView };
export default redraw;

/**
    Framework > Edit Canvas
    The Glyph Edit, Components, Ligatures, and to
    a certain extent, Kerning pages use a common
    HTML5 Canvas mechanism for interaction.
    Common functions around this can be found here.
**/

// -------------------
// Common Edit Page
// -------------------

function makeEditPageContent() {
  return (
    '' +
    "<div id='notation'>&#x20E2;</div>" +
    "<canvas id='glyphEditCanvas' width=12 height=12 ></canvas>" +
    "<div id='toolsarea_upperleft' onmouseover='mouseovercec();'> (ノ°□°)ノ︵ ┻━┻ </div>" +
    "<div id='toolsarea_upperright'>&nbsp;</div>" +
    "<div id='toolsarea_lowerleft'>&nbsp;</div>" +
    makeFloatLogo()
  );
}

// -------------------
// REDRAW
// -------------------
/*
        redraw
        This can be called globally to trigger a redraw of whatever page is currently active.
        It takes an optional 'calledBy' variable, which is any string to identify what triggered
        the redraw, for debugging purposes.
    */
function redraw(oa) {
  // debug('\n REDRAW - START');
  // debug('\t oa: ' + json(oa));
  oa = oa || {};
  _UI.redraw.redrawCanvas = isVal(oa.redrawCanvas) ? oa.redrawCanvas : true;
  _UI.redraw.redrawTools = isVal(oa.redrawTools) ? oa.redrawTools : true;
  _UI.redraw.redrawPanels = isVal(oa.redrawPanels) ? oa.redrawPanels : true;
  _UI.redraw.calledBy = oa.calledBy || '';

  if (
    !_UI.redraw.redrawPanels &&
    document.getElementById('navarea_panel') &&
    document.getElementById('navarea_panel').innerHTML === ''
  )
    _UI.redraw.redrawPanels = true;

  if (_UI.redrawing) {
    // this is totally a hack
    // debug('\t RETURNING because _UI.redrawing = ' + _UI.redrawing);
    return;
  }

  _UI.redrawing = false;
  reqAniFrame(redrawUnit);
  _UI.redrawing = false;
  // debug(' REDRAW - END\n');
}

function redrawUnit() {
  // debug('\n redrawUnit - START');
  // debug('\t _UI.redraw ' + json(_UI.redraw));

  if (_UI.redraw.redrawCanvas) {
    if (_UI.glyphEditCTX)
      _UI.glyphEditCTX.clearRect(
        0,
        0,
        _UI.glyphEditCanvasSize,
        _UI.glyphEditCanvasSize
      );

    switch (editor.nav.page) {
      case 'glyph edit':
        redraw_GlyphEdit();
        break;
      case 'components':
        redraw_GlyphEdit();
        break;
      case 'ligatures':
        redraw_GlyphEdit();
        break;
      case 'kerning':
        redraw_Kerning();
        break;
      case 'test drive':
        redraw_TestDrive();
        break;
    }
  }

  if (!_UI.eventhandlers.currtool.dragging) update_ToolsArea();

  if (_UI.redraw.redrawPanels) update_NavPanels();

  if (_UI.focusElement) {
    const fe = document.getElementById(_UI.focusElement);
    // if(fe) fe.select();
    if (fe) {
      // var l = fe.value.length;
      // fe.selectionStart = l;
      // fe.selectionEnd = l;
      fe.focus();
    }
  }
  _UI.focusElement = false;

  if (!_UI.contextGlyphs.string) updateContextGlyphs();

  if (getGlyphrStudioApp().settings.dev.mode && _UI.testOnRedraw)
    _UI.testOnRedraw();
  // debug(' redrawUnit - END\n');
}

// -------------------
// Update Tools
// -------------------
function update_ToolsArea() {
  // debug('\n update_ToolsArea - START');

  if (!onCanvasEditPage()) {
    // debug('\t returning, !onCanvasEditPage');
    return;
  }

  if (!_UI.redraw.redrawTools) {
    // debug('\t returning, !_UI.redraw.redrawTools');
    return;
  }

  if (!getSelectedWorkItemID()) {
    // debug('\t returning, !getSelectedWorkItemID');
    getEditDocument().getElementById('toolsarea_upperleft').innerHTML = '';
    return;
  }

  let patheditclass = '';
  let pathaddpointclass = '';
  let penclickable = true;
  let penaddpointclickable = true;
  const onglyph = editor.nav.page === 'glyph edit';
  const oncom = editor.nav.page === 'components';
  const onlig = editor.nav.page === 'ligatures';
  const onkern = editor.nav.page === 'kerning';
  const type = _UI.multiSelect.shapes.getType();
  const selectedWorkItem = getSelectedWorkItem();

  if (_UI.selectedTool === 'pathedit') {
    patheditclass = 'button--call-to-action';
  } else if (type === 'ComponentInstance') {
    patheditclass = 'buttondis';
    penclickable = false;
    penaddpointclickable = false;
  }

  if (_UI.selectedTool === 'pathaddpoint') {
    pathaddpointclass = 'button--call-to-action';
  } else if (type === 'ComponentInstance') {
    pathaddpointclass = 'buttondis';
    penclickable = false;
    penaddpointclickable = false;
  }

  if (_UI.multiSelect.shapes.count() > 1) {
    pathaddpointclass = 'buttondis';
    penaddpointclickable = false;
  }

  const st = _UI.selectedTool;

  // debug(`\t selected glyph ${selectedWorkItem.name} selected tool ${st}`);

  // UPPER RIGHT
  // Pop In/Out
  let pop = '';
  if (onCanvasEditPage()) {
    pop += '<span style="width:15px; display:inline-block;">&nbsp;</span>';
    if (_UI.popOut) {
      pop +=
        '<button title="one screen mode" class="tool" onclick="popIn();">' +
        makeToolButton({ name: 'tool_popIn' }) +
        '</button>';
    } else {
      pop +=
        '<button title="two screen mode" class="tool" onclick="popOut();">' +
        makeToolButton({ name: 'tool_popOut' }) +
        '</button>';
    }
  }

  let zoom = '';
  // Pan
  zoom +=
    '<button title="scroll and pan" class="' +
    (st === 'pan' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'pan\');"/>' +
    makeToolButton({ name: 'tool_pan', selected: st === 'pan' }) +
    '</button>';
  zoom += '<span style="width:15px; display:inline-block;">&nbsp;</span>';
  // Zoom
  zoom +=
    '<button title="zoom: one to one" class="tool" onclick="setView({dz:1});redraw({calledBy:\'updatetools\'});">' +
    makeToolButton({ name: 'tool_zoom1to1' }) +
    '</button>';
  zoom +=
    '<button title="zoom: fit to screen" class="tool" onclick="fitViewToContextGlyphs(); redraw({calledBy:\'updatetools\'});">' +
    makeToolButton({ name: 'tool_zoomEm' }) +
    '</button>';
  zoom +=
    '<input type="number" title="zoom level" class="zoomreadout" value="' +
    round(getView('updatetools').dz * 100, 2) +
    '" onchange="setViewZoom(this.value);"/>';
  zoom +=
    '<button title="zoom: in" class="tool" onclick="viewZoom(1.1, true);">' +
    makeToolButton({ name: 'tool_zoomIn' }) +
    '</button>';
  zoom +=
    '<button title="zoom: out" class="tool" onclick="viewZoom(.9, true);">' +
    makeToolButton({ name: 'tool_zoomOut' }) +
    '</button>';

  // UPPER LEFT
  // New Shape
  let newshape = '';
  newshape +=
    '<button onmouseover="mouseovercec();" title="new rectangle shape" class="' +
    (st === 'newrect' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'newrect\');"/>' +
    makeToolButton({ name: 'tool_newRect', selected: st === 'newrect' }) +
    '</button>';
  newshape +=
    '<button onmouseover="mouseovercec();" title="new oval shape" class="' +
    (st === 'newoval' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'newoval\');"/>' +
    makeToolButton({ name: 'tool_newOval', selected: st === 'newoval' }) +
    '</button>';
  newshape +=
    '<button onmouseover="mouseovercec();" title="new path shape" class="' +
    (st === 'newpath' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'newpath\');"/>' +
    makeToolButton({ name: 'tool_newPath', selected: st === 'newpath' }) +
    '</button>';
  newshape += '<br>';

  // Path and Shape Edit
  let edittools = '';
  edittools +=
    '<button onmouseover="mouseovercec();" title="add path point" class="' +
    pathaddpointclass +
    ' tool" ' +
    (penaddpointclickable ? 'onclick="clickTool(\'pathaddpoint\');"' : '') +
    '/>' +
    makeToolButton({
      name: 'tool_penPlus',
      selected: st === 'pathaddpoint',
      disabled: !penaddpointclickable,
    }) +
    '</button>';
  edittools +=
    '<button onmouseover="mouseovercec();" title="path edit" class="' +
    patheditclass +
    ' tool" ' +
    (penclickable ? 'onclick="clickTool(\'pathedit\');"' : '') +
    '/>' +
    makeToolButton({
      name: 'tool_pen',
      selected: st === 'pathedit',
      disabled: !penclickable,
    }) +
    '</button>';
  edittools +=
    '<button onmouseover="mouseovercec();" title="shape edit" class="' +
    (st === 'shaperesize' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'shaperesize\');"/>' +
    makeToolButton({ name: 'tool_arrow', selected: st === 'shaperesize' }) +
    '</button>';
  edittools += '<br>';

  let donepath = '<div style="height:5px;">&nbsp;</div>';
  donepath +=
    '<button class="button--call-to-action" style="width:94px; font-size:.8em; padding:2px;" title="done editing path" onclick="clickTool(\'pathedit\');">done editing path</button>';

  // Slice
  // var slice = '<button title="slice" class="' + (st==='slice'? 'button--call-to-action ' : ' ') + 'tool" onclick="clickTool(\'slice\');"/>'+makeToolButton({'name':'tool_slice', 'selected':(st==='slice')})+'</button>';

  // Kern
  const kern =
    '<button title="kern" class="' +
    (st === 'kern' ? 'button--call-to-action ' : ' ') +
    'tool" onclick="clickTool(\'kern\');"/>' +
    makeToolButton({ name: 'tool_kern', selected: st === 'kern' }) +
    '</button>';

  // Context Glyphs
  let ctxg = '<div class="contextglyphsarea">';
  ctxg += '<div id="contextglyphsoptions">';
  ctxg +=
    '<b>Context Glyphs</b> are letters you can display around the glyph you are currently editing.<br><br>';
  ctxg += checkUI(
    'getCurrentProject().projectSettings.showcontextglyphguides',
    getCurrentProject().projectSettings.showcontextglyphguides,
    true
  );
  ctxg +=
    '<label style="margin-left:10px; position:relative; top:-6px;" for="showcontextglyphguides">show guides</label><br>';
  ctxg +=
    'glyph ' +
    sliderUI(
      'contextglyphtransparency',
      'contextglyphtransparency_dropdown',
      true,
      false
    );
  ctxg += '<br/>';
  ctxg +=
    'guide ' +
    sliderUI(
      'systemguidetransparency',
      'systemguidetransparency_dropdown',
      true,
      false
    );
  ctxg += '</div>';
  ctxg +=
    '<input type="text" id="contextglyphsinput" oninput="updateContextGlyphs();" ';
  ctxg += 'onblur="_UI.focusElement = false;" onmouseover="mouseoutcec();" ';
  ctxg +=
    'title="context glyphs\ndisplay glyphs before or after the currently-selected glyph" ';
  ctxg += 'value="' + getContextGlyphString() + '"/>';
  ctxg +=
    '<button id="contextglyphsoptionsbutton" onclick="showCtxGlyphsOptions();">&#x23F7;</button>';
  ctxg += '</div>';

  // LOWER LEFT
  // Keyboard Tips Button
  const kbt =
    '<button title="keyboard and mouse tips" onclick="toggleKeyboardTips();" id="keyboardtips">' +
    makeIcon({
      name: 'keyboard',
      size: 50,
      width: 30,
      height: 30,
      color: 'rgb(229,234,239)',
    }) +
    '</button>';

  //
  // Put it all together
  //

  let toolcontent = '';
  let viewcontent = '';
  let utilitiescontent = '';

  viewcontent += zoom;
  viewcontent += pop;

  if (onglyph || onlig) toolcontent += newshape;
  if (oncom && selectedWorkItem && !selectedWorkItem.shape)
    toolcontent += newshape;

  if (onglyph || oncom || onlig) {
    toolcontent += edittools;
    if (_UI.selectedTool === 'newpath') toolcontent += donepath;
  }

  if (onkern) toolcontent += kern;
  if (onglyph || onlig) toolcontent += ctxg;

  if (getCurrentProject().projectSettings.showkeyboardtipsicon)
    utilitiescontent += kbt;

  getEditDocument().getElementById(
    'toolsarea_upperleft'
  ).innerHTML = toolcontent;
  getEditDocument().getElementById(
    'toolsarea_upperright'
  ).innerHTML = viewcontent;
  getEditDocument().getElementById(
    'toolsarea_lowerleft'
  ).innerHTML = utilitiescontent;

  // debug(' update_ToolsArea - END\n');
}

function clickTool(ctool) {
  // debug('\n clickTool - START');
  _UI.selectedTool = ctool;

  // debug('\t passed: ' + ctool + ' and _UI.selectedTool now is: ' + _UI.selectedTool);

  _UI.eventhandlers.eh_addpath.firstpoint = true;
  _UI.eventhandlers.multi = false;

  if (ctool === 'newrect') {
    setCursor('crosshairsSquare');
    clickEmptySpace();
  } else if (ctool === 'newoval') {
    setCursor('crosshairsCircle');
    clickEmptySpace();
  } else if (ctool === 'newpath') {
    setCursor('penPlus');
    clickEmptySpace();
  } else if (ctool === 'pathedit') {
    setCursor('pen');
  } else if (ctool === 'slice') {
    setCursor('slice');
  } else if (ctool === 'shaperesize') {
    setCursor('arrow');
  }

  _UI.eventhandlers.hoverpoint = false;
  closeNotation();
  // updateCursor();

  redraw({ calledBy: 'clicktool', redrawPanels: false });
}

function updateCursor(tool) {
  tool = tool || _UI.selectedTool;

  // debug('\n updateCursor - START');
  // debug('\t tool = ' + tool);

  if (_UI.eventhandlers.ismouseovercec) {
    if (tool === 'newrect') {
      // debug('\t setting cursor to crosshairsSquare');
      setCursor('crosshairsSquare');
    } else if (tool === 'newoval') {
      // debug('\t setting cursor to crosshairsCircle');
      setCursor('crosshairsCircle');
    } else if (tool === 'shaperesize') {
      // debug('\t shaperesize :: not setting cursor');
      // Handled by eventHandler
    } else if (tool === 'newpath') {
      // debug('\t setting cursor to penPlus');
      setCursor('penPlus');
    } else if (tool === 'pathedit') {
      // debug('\t setting cursor to pen');
      setCursor('pen');
    } else if (tool === 'pathaddpoint') {
      // debug('\t setting cursor to pen');
      setCursor('penPlus');
    } else if (tool === 'slice') {
      // debug('\t setting cursor to slice');
      setCursor('slice');
    } else if (tool === 'pan') {
      // debug('\t setting cursor to move');
      setCursor('move');
    } else if (tool === 'kern') {
      // debug('\t setting cursor to col-resize');
      setCursor('col-resize');
    } else {
      // debug('\t defaulting cursor to pointer');
      setCursor('arrow');
    }
  } else {
    // debug('\t NOT ON EDIT CANVS setting cursor to default');
    setCursor('default');
  }

  // debug(' updateCursor - END\n');
}

function setCursor(name) {
  // debug('\n setCursor - START');
  // debug('\t passed ' + name);
  const cur = [
    'auto',
    'default',
    'none',
    'context-menu',
    'help',
    'pointer',
    'progress',
    'wait',
    'cell',
    'crosshair',
    'text',
    'vertical-text',
    'alias',
    'copy',
    'move',
    'no-drop',
    'not-allowed',
    'e-resize',
    'n-resize',
    'ne-resize',
    'nw-resize',
    's-resize',
    'se-resize',
    'sw-resize',
    'w-resize',
    'ew-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'col-resize',
    'row-resize',
    'all-scroll',
    'zoom-in',
    'zoom-out',
    'grab',
    'grabbing',
  ];

  if (cur.indexOf(name + '-resize') > -1) {
    if (canResize(name)) name += '-resize';
    // debug('\t SET -resize CURSOR');
  }

  getEditDocument().body.style.cursor = 'auto';

  if (_UI.cursors[name]) {
    getEditDocument().body.style.cursor = _UI.cursors[name];
    // debug('\t SET CUSTOM CURSOR:\t'+name);
  } else if (cur.indexOf(name) > -1) {
    getEditDocument().body.style.cursor = name;
    // debug('\t SET BUILT-IN CURSOR:\t'+name);
  } else {
    // debug('\t DEFAULT TO auto');
  }

  // debug(' setCursor - END\n');
}

function getEditMode() {
  let tool = _UI.selectedTool;
  if (tool === 'pan') tool = _UI.eventhandlers.lastTool;

  if (tool === 'newrect' || tool === 'newoval') return 'newbasicshape';
  else if (tool === 'newpath') return 'newpath';
  else if (tool === 'shaperesize')
    return _UI.eventhandlers.handle === 'rotate' ? 'rotate' : 'arrow';
  else if (tool === 'pathedit' || tool === 'pathaddpoint') return 'pen';
  else if (tool === 'kern') return 'kern';
}

function mouseovercec() {
  // debug('\n mouseovercec - START');
  _UI.eventhandlers.ismouseovercec = true;
  updateCursor();
  if (_UI.hamburger.state !== 0 && _UI.currentPanel !== 'npNav')
    goHamburger(false);
  // debug(' mouseovercec - END\n');
}

function mouseoutcec() {
  // debug('\n mouseoutcec - START');
  _UI.eventhandlers.ismouseovercec = false;
  // Fixes a Chrome cursor problem
  document.onselectstart = function () {};
  updateCursor();
  if (_UI.hamburger.state !== 11 && _UI.currentPanel !== 'npNav')
    goHamburger(true);
  // debug(' mouseoutcec - END\n');
}

function updateContextGlyphs() {
  const selwi = getSelectedWorkItem();
  const cgi = getEditDocument().getElementById('contextglyphsinput');

  if (cgi) {
    selwi.contextGlyphs = cgi.value;

    _UI.contextGlyphs.string = cgi.value;
    _UI.contextGlyphs.advancewidth = getStringAdvanceWidth(cgi.value);
    fitViewToContextGlyphs();

    redraw({
      calledBy: 'updateContextGlyphs',
      redrawPanels: false,
      redrawTools: false,
    });
  }
}

function getContextGlyphString() {
  return (
    getSelectedWorkItem().contextGlyphs || hexToChars(getSelectedWorkItemID())
  );
}

function showCtxGlyphsOptions() {
  getEditDocument().getElementById('contextglyphsoptions').style.display =
    'block';
  getEditDocument().getElementById(
    'contextglyphsoptionsbutton'
  ).onclick = hideCtxGlyphsOptions;
  getEditDocument().getElementById('contextglyphsoptionsbutton').innerHTML =
    '&#x23F6;';
}

function hideCtxGlyphsOptions() {
  getEditDocument().getElementById('contextglyphsoptions').style.display =
    'none';
  getEditDocument().getElementById(
    'contextglyphsoptionsbutton'
  ).onclick = showCtxGlyphsOptions;
  getEditDocument().getElementById('contextglyphsoptionsbutton').innerHTML =
    '&#x23F7;';
  getEditDocument().getElementById('contextglyphsinput').focus();
}

function toggleKeyboardTips() {
  if (document.getElementById('dialog_box').style.display === 'block') {
    closeDialog();
  } else {
    let con = '<h1>Keyboard and Mouse Shortcuts</h1>';

    con += makeKeyboardShortcutsTable();

    con +=
      '<table><tr><td style="vertical-align:top; padding:20px 10px 0px 0px;">' +
      checkUI(
        'getCurrentProject().projectSettings.showkeyboardtipsicon',
        getCurrentProject().projectSettings.showkeyboardtipsicon
      ) +
      '</td><td style="vertical-align:top; padding:20px 10px 0px 0px;">' +
      '<label style="position:relative; top:-5px;" for="showkeyboardtipsicon">show the &nbsp;<span style="position:relative; top:6px;">' +
      makeIcon({
        name: 'keyboard',
        size: 50,
        width: 22,
        height: 22,
        color: 'rgb(76, 81, 86)',
        hoverColor: 'rgb(76, 81, 86)',
      }) +
      '</span>&nbsp; button on the edit canvas</label>' +
      '</td></tr></table>';

    openDialog(con);
  }
}

function makeKeyboardShortcutsTable() {
  return `<table style='margin:20px 40px 40px 0px;'>
        <tr><td>

            <br>
            <table>
                <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>s</span></td><td>save a Glyphr Studio Project file</td></tr>
                <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>e</span></td><td>export an Open Type font file</td></tr>
                <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>g</span></td><td>export a SVG font file</td></tr>
            </table>

        </td>
        <td style='padding-left:40px;'>

            <br>
            <table>
            <tr><td class='keycol'><span class='keycallout'>?</span></td><td>toggles this shortcuts dialog</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>o</span></td><td>open a new Glyphr Studio Project</td></tr>
            </table>

        </td></tr>
        <tr><td>

            <br>
            <table>
            <tr><td>&nbsp;</td><td><br><h3 style='margin-bottom:8px;'>shapes and paths:</h3></td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>mouse click</span></td><td>multi-select shapes or points</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>c</span></td><td>copy selected shape</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>v</span></td><td>paste shape</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>z</span></td><td>undo</td></tr>
            <tr><td class='keycol'><span class='keycallout' style='margin-bottom:5px;'>backspace</span><br>or <span class='keycallout'>delete</span></td><td>delete selected shape<br>or path point</td></tr>
            <tr><td class='keycol'>
            <span class='arrow' style='margin-right:24px;'>&#x21E7;</span><br>
            <span class='arrow'>&#x21E6;</span>
            <span class='arrow'>&#x21E9;</span>
            <span class='arrow' style='margin-right:4px;'>&#x21E8;</span>
            </td><td>nudges the selected shape<br>or point ${
              getCurrentProject().projectSettings.spinnervaluechange
            } em units</td></tr>
            </table>

        </td><td style='padding-left:40px;'>

            <br>
            <table>
            <tr><td>&nbsp;</td><td><br><h3 style='margin-bottom:8px;'>edit canvas:</h3></td></tr>
            <tr><td class='keycol'><span class='keycallout'>spacebar</span></td><td>pan the edit canvas</td></tr>
            <tr><td class='keycol'><span class='keycallout'>v</span></td><td>select the shape edit arrow tool</td></tr>
            <tr><td class='keycol'><span class='keycallout'>b</span></td><td>select the path edit pen tool</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>mouse wheel</span></td><td>zoom the edit canvas</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>+</span></td><td>zoom in the edit canvas</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>&ndash;</span></td><td>zoom out the edit canvas</td></tr>
            <tr><td class='keycol'><span class='keycallout'>ctrl</span><span class='keycallout'>0</span></td><td>reset edit canvas zoom</td></tr>
            </table>

        </td></tr></table>`;
}

// -------------------
// CONTEXT GLYPHS
// -------------------

function drawContextGlyphs() {
  // debug('\n drawContextGlyphs - START');
  const selwid = getSelectedWorkItemID();
  const currGlyphObject = getGlyph(selwid, true);
  const currGlyphChar = hexToChars(selwid);
  const v = getView('drawContextGlyphs');
  const split = splitContextGlyphString(currGlyphChar);

  // debug('\t split: ' + split.left + ' | ' + split.right);
  // debug(`\t view: ${json(v, true)}`);

  clearCanvasHotspots();

  if (split.left) {
    let leftdistance = getGlyphSequenceAdvanceWidth(split.left);
    if (currGlyphObject.isAutoWide) leftdistance += currGlyphObject.lsb;
    leftdistance += calculateKernOffset(
      split.left.charAt(split.left.length - 1),
      currGlyphChar
    );

    // debug(`\t leftdistance: ${leftdistance}`);

    _UI.contextGlyphs.leftseq = new GlyphSequence({
      glyphstring: split.left,
      scale: v.dz,
      drawLineExtras: drawContextGlyphLeftLineExtras,
      drawGlyphExtras: drawContextGlyphExtras,
      drawGlyph: drawContextGlyph,
      maxes: {
        xMin: v.dx - leftdistance * v.dz,
        yMin: v.dy,
      },
    });

    _UI.contextGlyphs.leftseq.draw();
  }

  if (split.right) {
    let rightdistance = currGlyphObject.getAdvanceWidth();
    if (currGlyphObject.isAutoWide) rightdistance -= currGlyphObject.lsb;
    rightdistance += calculateKernOffset(currGlyphChar, split.right.charAt(0));

    // debug(`\t rightdistance: ${rightdistance}`);

    _UI.contextGlyphs.rightseq = new GlyphSequence({
      glyphstring: split.right,
      scale: v.dz,
      drawLineExtras: drawContextGlyphRightLineExtras,
      drawGlyphExtras: drawContextGlyphExtras,
      drawGlyph: drawContextGlyph,
      maxes: {
        xMin: v.dx + rightdistance * v.dz,
        yMin: v.dy,
      },
    });

    _UI.contextGlyphs.rightseq.draw();
  }

  // debug(' drawContextGlyphs - END\n');
}

function splitContextGlyphString(splitchar) {
  const ctxgs = getContextGlyphString();

  let l = '';
  let r = '';

  const pos = ctxgs.indexOf(splitchar);

  if (pos === -1) {
    l = ctxgs;
    r = '';
  } else {
    l = ctxgs.substr(0, pos);
    r = ctxgs.substr(pos + splitchar.length);
  }

  return { left: l, right: r };
}

function getGlyphSequenceAdvanceWidth(sequence) {
  let advanceWidth = 0;
  sequence = findAndMergeLigatures(sequence.split(''));

  let g;
  sequence.forEach(function (v, i, a) {
    g = getGlyph(glyphToHex(v));
    if (g) {
      advanceWidth += g.getAdvanceWidth();
      if (a[i + 1]) advanceWidth += calculateKernOffset(v, a[i + 1]);
    } else {
      advanceWidth += (getCurrentProject().projectSettings.upm * 1) / 2;
    }
  });

  return advanceWidth;
}

function drawContextGlyphLeftLineExtras(char, seq) {
  const alpha = transparencyToAlpha(
    getCurrentProject().projectSettings.colors.systemguidetransparency
  );
  const color = getColorFromRGBA('rgb(204,81,0)', alpha);
  drawVerticalLine(char.view.dx * char.view.dz, false, color);

  let kern = calculateKernOffset(
    seq.glyphstring[seq.glyphstring.length - 1],
    getSelectedWorkItemChar()
  );

  if (kern) {
    const selwi = getSelectedWorkItem();
    const v = getView('drawContextGlyphLeftLineExtras');
    kern *= -1;
    let rightx = selwi.isAutoWide ? kern - selwi.lsb : kern;
    rightx = v.dx + rightx * v.dz;
    const texty = sYcY(getCurrentProject().projectSettings.descent - 60);

    drawGlyphKernExtra(-kern, rightx, texty, v.dz);
  }
}

function drawContextGlyphRightLineExtras(char, seq) {
  const kern = calculateKernOffset(getSelectedWorkItemChar(), char.char);

  if (kern) {
    const v = getView('drawContextGlyphRightLineExtras');
    const selwi = getSelectedWorkItem();
    let rightx = selwi.getAdvanceWidth();
    if (selwi.isAutoWide) rightx -= selwi.lsb;
    rightx = v.dx + rightx * v.dz;
    const texty = sYcY(getCurrentProject().projectSettings.descent - 60);

    drawGlyphKernExtra(kern, rightx, texty, v.dz);
  }
}

function drawContextGlyphExtras(char) {
  // debug('\n drawContextGlyphExtras - START');

  // debug(`\t ${char.char}
  //  width \t ${char.width}
  //  aggr \t ${char.aggregate}
  //  lnbr \t ${char.islinebreaker}
  //  view \t ${json(char.view, true)}
  //  line \t ${char.linenumber}
  // \n`);
  // debug(char.glyph);

  const ps = getCurrentProject().projectSettings;
  const alpha = transparencyToAlpha(ps.colors.systemguidetransparency);

  if (ps.showcontextglyphguides && alpha) {
    const ctx = _UI.glyphEditCTX;
    const view = getView('drawContextGlyphExtras');
    const advanceWidth = char.width * view.dz;
    const currx = char.view.dx * view.dz;
    const rightx = currx + advanceWidth;
    const color = getColorFromRGBA('rgb(204,81,0)', alpha);
    const texty = sYcY(getCurrentProject().projectSettings.descent - 60);

    // Draw the glyph name
    let gname = char.glyph
      ? char.glyph.getName()
      : getGlyphName(charsToHexArray(char.char));
    gname = gname.replace(/latin /i, '');
    drawGlyphNameExtra(gname, currx, texty, advanceWidth, color, char.char);

    // Draw vertical lines
    drawVerticalLine(rightx, false, color);

    // Draw kern notation
    if (char.kern) drawGlyphKernExtra(char.kern, rightx, texty, view.dz);
  }

  // debug(' drawContextGlyphExtras - END\n');
}

function drawGlyphNameExtra(
  text,
  currx,
  topy,
  advanceWidth,
  color,
  regHotspot
) {
  // debug('\n drawGlyphNameExtra - START');
  // debug(`\t ${text} passed regHotspot ${regHotspot}`);

  const ctx = _UI.glyphEditCTX;
  const textw = ctx.measureText(text).width;
  const textx = currx + (advanceWidth - textw) / 2; // center the glyph name
  const texty = topy + 22;

  ctx.font = '12px tahoma, verdana, sans-serif';

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.strokeText(text, textx, texty);

  ctx.fillStyle = color;
  ctx.fillText(text, textx, texty);

  // Register hotspot
  if (regHotspot) {
    registerCanvasHotspot({
      target: {
        xMin: currx,
        xMax: currx + advanceWidth,
        yMin: texty - 20,
        yMax: texty + 20,
      },
      underline: {
        xMin: textx - 1,
        xMax: textx + textw + 1,
        y: texty + 6,
      },
      onclick: function () {
        hotspotNavigateToGlyph(glyphToHex(regHotspot));
      },
    });
  }
}

function drawGlyphKernExtra(kern, rightx, topy, scale) {
  const desc = getCurrentProject().projectSettings.descent;
  const ctx = _UI.glyphEditCTX;
  const offset = 40;
  const color = getColorFromRGBA(
    'rgb(255,0,255)',
    transparencyToAlpha(
      getCurrentProject().projectSettings.colors.systemguidetransparency
    )
  );
  const barheight = Math.max(scale * 10, 1);

  ctx.font = '12px tahoma, verdana, sans-serif';
  ctx.fillStyle = color;
  ctx.fillRect(rightx, topy + offset, kern * scale, barheight);

  const text = 'kern: ' + kern;
  const textwidth = ctx.measureText(text).width;
  const textx = rightx - (kern * -1 * scale - textwidth) / 2 - textwidth;

  ctx.strokeStyle = color;
  drawVerticalLine(rightx + kern * scale, false, color);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.miterLimit = 1;

  // ctx.strokeText(text, textx, (topy + (offset*4)));
  // ctx.fillText(text, textx, (topy + (offset*4)));

  ctx.strokeText(text, textx, topy + offset + barheight + 22);
  ctx.fillText(text, textx, topy + offset + barheight + 22);
}

function drawContextGlyph(char) {
  // debug('\n drawContextGlyph - START');
  // debug(`\t ${char.char}
  //  width \t ${char.width}
  //  aggr \t ${char.aggregate}
  //  lnbr \t ${char.islinebreaker}
  //  view \t ${json(char.view, true)}
  //  line \t ${char.linenumber}
  // \n`);
  // debug(char.glyph);
  const v = getView('drawContextGlyph');
  const c = char.view;

  if (!char.glyph) return;
  char.glyph.drawGlyph(
    _UI.glyphEditCTX,
    { dx: c.dx * c.dz, dy: v.dy, dz: c.dz },
    transparencyToAlpha(
      getCurrentProject().projectSettings.colors.contextglyphtransparency
    ),
    true
  );

  // debug(' drawContextGlyph - END\n');
}

// -------------------------------
//    CANVAS HOTSPOTS
// -------------------------------

function registerCanvasHotspot(hotspot) {
  _UI.canvasHotSpots.push(hotspot);
}

function clearCanvasHotspots() {
  _UI.canvasHotSpots = [];
}

function isHotspotHere(cx, cy) {
  const chs = _UI.canvasHotSpots;
  let v;

  for (let i = 0; i < chs.length; i++) {
    v = chs[i];
    // debug(`isHotspotHere - checking ${v.target.xMin} - ${v.target.xMax} - ${v.target.yMin} - ${v.target.yMax}`);
    // debug(`results ${(cx <= v.target.xMax)} - ${(cx >= v.target.xMin)} - ${(cy <= v.target.yMax)} - ${(cy >= v.target.yMin)}`);
    if (
      cx <= v.target.xMax &&
      cx >= v.target.xMin &&
      cy <= v.target.yMax &&
      cy >= v.target.yMin
    ) {
      return v;
    }
  }

  return false;
}

function findAndCallHotspot(cx, cy) {
  _UI.canvasHotSpots.forEach(function (v, i, a) {
    if (
      cx <= v.target.xMax &&
      cx >= v.target.xMin &&
      cy <= v.target.yMax &&
      cy >= v.target.yMin
    ) {
      v.onclick();
    }
  });
}

function hotspotNavigateToGlyph(gid) {
  // debug('\n hotspotNavigateToGlyph - START');
  // debug('\t passed ' + gid);

  const v = getView('hotspotNavigateToGlyph');
  const currchar = getSelectedWorkItemChar();
  const newchar = hexToChars(gid);
  const ctxg = getContextGlyphString();
  const p1 = ctxg.indexOf(currchar);
  const p2 = ctxg.indexOf(newchar);
  let flipper;
  let leftchar;
  let rightchar;

  if (p1 < p2) {
    flipper = 1;
    leftchar = currchar;
    rightchar = newchar;
  } else {
    flipper = -1;
    leftchar = newchar;
    rightchar = currchar;
  }

  const str = ctxg.substring(p1, p2);
  // debug(`\t substring from ${p1} to ${p2} yeilds ${str}`);

  const delta = getGlyphSequenceAdvanceWidth(str);

  // debug(`\t advance width: ${delta} screen pixels: ${sXcX(delta)}`);
  // v.dx += sXcX(delta);
  const kern = calculateKernOffset(leftchar, rightchar);
  // debug(`\t kern offset ${leftchar} and ${rightchar} is ${kern}`);

  v.dx += v.dz * delta * flipper;
  v.dx += v.dz * kern * flipper;

  getGlyph(gid, true).contextGlyphs = ctxg;
  selectGlyph(gid);
  setView(v);

  _UI.redraw.redrawTools = true;
  update_ToolsArea();

  // debug(' hotspotNavigateToGlyph - END\n');
}

function findAndUnderlineHotspot(cx, cy) {
  // debug('\n findAndUnderlineHotspot - START');
  // debug(`\t cx:${cx} \t cy:${cy}`);
  const hs = isHotspotHere(cx, cy);
  const ctx = _UI.glyphEditCTX;
  // debug(`\t ${hs}`);
  if (hs) {
    const t = getCurrentProject().projectSettings.colors
      .systemguidetransparency;
    // var t2 = (((100 - t) / 2) + t);
    const alpha = transparencyToAlpha(t);
    const rgb = getColorFromRGBA('rgb(204,81,0)', alpha);

    ctx.strokeStyle = rgb;
    ctx.beginPath();
    ctx.moveTo(hs.underline.xMin, makeCrisp(hs.underline.y));
    ctx.lineTo(hs.underline.xMax, makeCrisp(hs.underline.y));
    ctx.stroke();
    setCursor('arrow');
  }

  return hs.target.xMin;
  // debug(' findAndUnderlineHotspot - END\n');
}

// -------------------
// VIEW
// -------------------

function setView(oa) {
  const sc =
    editor.nav.page === 'kerning'
      ? getSelectedKernID()
      : getSelectedWorkItemID();
  const v = _UI.views || {};

  // Ensure there are at least defaults
  if (!isVal(v[sc])) {
    v[sc] = getView('setView');
  }

  // Check for which to set
  if (isVal(oa.dx)) v[sc].dx = oa.dx;
  if (isVal(oa.dy)) v[sc].dy = oa.dy;
  if (isVal(oa.dz)) v[sc].dz = oa.dz;
}

function getView(calledBy) {
  // debug('\n getView - START');
  // debug('\t calledBy: ' + calledBy);

  const onkern = editor.nav.page === 'kerning';
  const sc = onkern ? getSelectedKernID() : getSelectedWorkItemID();
  const v = _UI.views || {};
  let re;

  if (isVal(v[sc])) {
    re = clone(v[sc]);
  } else {
    re = onkern ? clone(_UI.defaultKernView) : clone(_UI.defaultView);
  }

  // debug('\t returning ' + json(re));
  // debug(' getView - END\n');

  return re;
}

function getDefaultView() {}

function viewZoom(zfactor, center) {
  const v = getView('viewZoom');
  const mx = _UI.eventhandlers.mousex;
  const my = _UI.eventhandlers.mousey;

  setView({
    dz: round((v.dz *= zfactor), 2),
    dx: center ? v.dx : mx - (mx - v.dx) * zfactor,
    dy: center ? v.dy : my - (my - v.dy) * zfactor,
  });

  redraw({ calledBy: 'viewZoom', redrawPanels: false });
}

function setViewZoom(zoom) {
  zoom /= 100;
  const v = getView('setViewZoom');

  setView({
    dz: round(zoom, 2),
    dx: v.dx,
    dy: v.dy,
  });

  redraw({ calledBy: 'setViewZoom', redrawPanels: false });
}

function resetThumbView() {
  const zoom =
    (_UI.thumbSize - 2 * _UI.thumbGutter) /
    getCurrentProject().projectSettings.upm;

  _UI.thumbView = {
    dx: _UI.thumbGutter,
    dy: _UI.thumbGutter + getCurrentProject().projectSettings.ascent * zoom,
    dz: zoom,
  };

  // debug('RESETTHUMBVIEW - set to \n' + JSON.stringify(_UI.thumbView));
}

function calculateDefaultView() {
  const ps = getCurrentProject().projectSettings;

  const xpadding = 80;
  const ypadding = 80; // Height of the UI across the top
  const canw = window.innerWidth - 470; // 470 is the width of the left panel area
  const canh = window.innerHeight - ypadding;

  const strw = ps.upm / 2;
  const strh = ps.ascent - ps.descent;

  let zw;
  let zh;
  var nz;

  zw = round(canw / (strw * 1.4), 3);
  zh = round(canh / (strh * 1.4), 3);

  var nz = Math.min(zh, zw);
  const nx = round((canw - nz * strw) / 2);
  const ny = round((canh - nz * strh) / 2 + ps.ascent * nz);

  _UI.defaultView = { dx: nx, dy: ny, dz: nz };
}

function fitViewToContextGlyphs(dontzoom) {
  // debug('\n fitViewToContextGlyphs - START');
  const ps = getCurrentProject().projectSettings;

  const xpadding = 80;
  const ypadding = 80; // Height of the UI across the top
  const canw = window.innerWidth - 470; // 470 is the width of the left panel area
  const canh = window.innerHeight - ypadding;
  // debug(`\t CAN \t ${canw} \t ${canh}`);

  const strw = _UI.contextGlyphs.advancewidth;
  const strh = ps.ascent - ps.descent;
  // debug(`\t STR \t ${strw} \t ${strh}`);

  let zw;
  let zh;
  var nz;

  if (dontzoom) {
    nz = getView('fitViewToContextGlyphs').dz;
    // debug(`\t VZ \t ${nz}`);
  } else {
    zw = round(canw / (strw * 1.4), 3);
    zh = round(canh / (strh * 1.4), 3);
    // debug(`\t NZ \t ${zw} \t ${zh}`);
  }

  var nz = Math.min(zh, zw);
  const nx = round((canw - nz * strw) / 2);
  const ny = round((canh - nz * strh) / 2 + ps.ascent * nz);
  // debug(`\t VIEW \t ${nx} \t ${ny} \t ${nz}`);

  setView({ dx: nx, dy: ny, dz: nz });
}

function getStringAdvanceWidth(str) {
  const carr = findAndMergeLigatures(str.split(''));
  let g;
  let aw = 0;

  for (let c = 0; c < carr.length; c++) {
    g = getGlyph(charsToHexArray(carr[c])[0]);

    aw += g.getAdvanceWidth();

    if (c < carr.length - 2) {
      aw += calculateKernOffset(carr[c], carr[c + 1]);
    }
  }

  return aw;
}

// --------------------------------------------------------------------------
//    Convert between Saved values and Canvas values
// --------------------------------------------------------------------------
// convert stored x-y point to canvas x-y
function sXcX(sx, view = getView('sXcX')) {
  let canvasx = view.dx;
  canvasx += sx * view.dz;
  return canvasx || view.dx;
}

function sYcY(sy, view = getView('sYcY')) {
  let canvasy = view.dy;
  canvasy -= sy * view.dz;
  return canvasy || view.dy;
}

// convert canvas x-y inputs to saved shape x-y
function cXsX(cx, view = getView('cXsX')) {
  return (cx - view.dx) / view.dz;
}

function cYsY(cy, view = getView('cYsY')) {
  return (view.dy - cy) / view.dz;
}

// ------------------------------
// Drawing controls
// ------------------------------

function draw_PathOutline(sh, accent, thickness) {
  // debug('\n draw_PathOutline - START');
  // debug('\t shape name = ' + sh.name);
  // debug('\t accent.l65 = ' + accent.l65);
  // debug('\t selectedTool = ' + _UI.selectedTool);

  if (!sh) return;

  accent = accent || _UI.colors.blue;
  thickness = thickness || 1;
  const hp = getCurrentProject().projectSettings.pointsize / 2;
  _UI.glyphEditCTX.strokeStyle = accent.l65;
  _UI.glyphEditCTX.fillStyle = 'transparent';

  if (_UI.selectedTool === 'newrect') {
    draw_BoundingBox(sh.maxes, accent);
  } else if (_UI.selectedTool === 'newoval') {
    _UI.glyphEditCTX.strokeStyle = accent.l65;
    const tpdso = ovalPathFromMaxes(_UI.eventhandlers.tempnewbasicshape);

    _UI.glyphEditCTX.lineWidth = 1;
    _UI.glyphEditCTX.strokeStyle = accent.l65;

    _UI.glyphEditCTX.beginPath();
    tpdso.drawPath(_UI.glyphEditCTX);
    _UI.glyphEditCTX.closePath();
    _UI.glyphEditCTX.stroke();
  } else {
    // Draw Path Points
    if (!sh.path) return;

    // Draw path selection outline
    _UI.glyphEditCTX.lineWidth = thickness;
    _UI.glyphEditCTX.strokeStyle = accent.l65;

    _UI.glyphEditCTX.beginPath();
    sh.path.drawPath(_UI.glyphEditCTX);
    _UI.glyphEditCTX.closePath();
    _UI.glyphEditCTX.stroke();
  }

  // debug(' draw_PathOutline - END\n');
}

function draw_PathPoints(pparr, accent) {
  // debug('\n draw_PathPoints - START');
  pparr = pparr || [];

  for (let p = 0; p < pparr.length; p++) {
    // debug('\t point ' + p + ' isSelected ' + _UI.multiSelect.points.isSelected(pparr[p]));

    if (p === 0) {
      pparr[p].drawDirectionalityPoint(accent, pparr[(p + 1) % pparr.length]);
    } else {
      pparr[p].drawPoint(accent);
    }
  }

  // debug(' draw_PathPoints - END\n');
}

function draw_PathPointHandles(pparr, accent) {
  pparr = pparr || [];

  for (let p = 0; p < pparr.length; p++) {
    pparr[p].drawHandles(true, true, accent);
  }
}

function draw_BoundingBox(maxes, accent, thickness) {
  // debug('\n draw_BoundingBox - START');
  // debug(maxes);
  // debug('\t accent: ' + accent.l65);

  accent = accent || _UI.colors.blue;
  thickness = thickness || 1;
  let lx = sXcX(maxes.xMin);
  let rx = sXcX(maxes.xMax);
  let ty = sYcY(maxes.yMax);
  let by = sYcY(maxes.yMin);

  if (thickness > 1) {
    lx -= thickness;
    rx += thickness;
    ty -= thickness;
    by += thickness;
  }

  const w = rx - lx;
  const h = by - ty;

  _UI.glyphEditCTX.fillStyle = 'transparent';
  _UI.glyphEditCTX.strokeStyle = accent.l65;
  _UI.glyphEditCTX.lineWidth = thickness;
  _UI.glyphEditCTX.strokeRect(lx, ty, w, h);
  // debug(' draw_BoundingBox - END\n');
}

function draw_BoundingBoxHandles(maxes, accent, thickness) {
  accent = accent || _UI.colors.blue;
  thickness = thickness || 1;
  const bb = getBoundingBoxHandleDimensions(maxes, thickness);

  _UI.glyphEditCTX.fillStyle = 'white';
  _UI.glyphEditCTX.lineWidth = 1;
  _UI.glyphEditCTX.strokeStyle = accent.l65;

  // rotate handle
  if (_UI.multiSelect.shapes.rotateable()) {
    const h = _UI.rotateHandleHeight;
    _UI.glyphEditCTX.lineWidth = thickness;
    draw_Line(
      { x: bb.midx + bb.hp, y: bb.topy },
      { x: bb.midx + bb.hp, y: bb.topy - h }
    );
    _UI.glyphEditCTX.lineWidth = 1;
    draw_CircleHandle({ x: bb.midx + bb.hp, y: bb.topy - h + bb.hp });
  }

  // upper left
  if (canResize('nw')) draw_SquareHandle({ x: bb.leftx, y: bb.topy });

  // top
  if (canResize('n')) draw_SquareHandle({ x: bb.midx, y: bb.topy });

  // upper right
  if (canResize('ne')) draw_SquareHandle({ x: bb.rightx, y: bb.topy });

  // right
  if (canResize('e')) draw_SquareHandle({ x: bb.rightx, y: bb.midy });

  // lower right
  if (canResize('se')) draw_SquareHandle({ x: bb.rightx, y: bb.bottomy });

  // bottom
  if (canResize('s')) draw_SquareHandle({ x: bb.midx, y: bb.bottomy });

  // lower left
  if (canResize('sw')) draw_SquareHandle({ x: bb.leftx, y: bb.bottomy });

  // left
  if (canResize('w')) draw_SquareHandle({ x: bb.leftx, y: bb.midy });

  // //Center Dot
  // _UI.glyphEditCTX.fillRect(bb.midx, bb.midy, ps, ps);
  // _UI.glyphEditCTX.strokeRect(bb.midx, bb.midy, ps, ps);
}

function draw_RotationAffordance(accent, thickness) {
  accent = accent || _UI.colors.blue;
  thickness = thickness || 1;
  const center = clone(_UI.eventhandlers.rotationcenter);
  let starttopy = _UI.eventhandlers.rotationstarttopy;
  const mx = _UI.eventhandlers.mousex;
  const my = _UI.eventhandlers.mousey;
  const ss = _UI.multiSelect.shapes;
  const angle = calculateAngle({ x: cXsX(mx), y: cYsY(my) }, center);

  // debug('\t Init angle:\t' + angle);

  const rotatehandle = { x: center.x, y: starttopy };
  rotate(rotatehandle, angle, center);
  rotate(rotatehandle, Math.PI / -2, center);

  // debug('\t Drag Angle:\t' + round(angle, 2));

  let counterclockwise = false;
  if (Math.abs(angle) > Math.PI / 2) {
    counterclockwise = true;
  }

  // Convert things to Canvas System
  rotatehandle.x = sXcX(rotatehandle.x);
  rotatehandle.y = sYcY(rotatehandle.y);
  center.x = sXcX(center.x);
  center.y = sYcY(center.y);
  starttopy = sYcY(starttopy);
  const radius = calculateLength(center, rotatehandle);

  const ctx = _UI.glyphEditCTX;

  // Pizza Pie Sweep
  ctx.fillStyle = accent.l65;
  ctx.strokeStyle = accent.l65;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.arc(
    center.x,
    center.y,
    radius,
    Math.PI / -2,
    angle * -1,
    counterclockwise
  );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // rotate handle
  ctx.strokeStyle = accent.l65;
  ctx.fillStyle = 'white';
  ctx.lineWidth = thickness;
  draw_Line(
    { x: rotatehandle.x, y: rotatehandle.y },
    { x: center.x, y: center.y }
  );
  ctx.lineWidth = 1;
  draw_CircleHandle(rotatehandle);

  // readout
  let readout = round(angleToNiceAngle(angle), 1);
  if (counterclockwise) readout -= 360;
  readout = round(readout, 1);

  // debug('\t Readout angle:\t' + readout);

  ctx.font = '24px FiraGO';
  ctx.fillStyle = accent.l65;
  ctx.globalAlpha = 0.8;
  ctx.fillText('' + readout + '°', center.x, starttopy - 24);

  ctx.globalAlpha = 1;
}

function draw_Line(p1, p2) {
  _UI.glyphEditCTX.beginPath();
  _UI.glyphEditCTX.moveTo(p1.x, p1.y);
  _UI.glyphEditCTX.lineTo(p2.x, p2.y);
  _UI.glyphEditCTX.closePath();
  _UI.glyphEditCTX.stroke();
}

function draw_SquareHandle(ul) {
  const ps = getCurrentProject().projectSettings.pointsize;
  _UI.glyphEditCTX.fillRect(ul.x, ul.y, ps, ps);
  _UI.glyphEditCTX.strokeRect(ul.x, ul.y, ps, ps);
}

function draw_CircleHandle(center) {
  _UI.glyphEditCTX.beginPath();
  _UI.glyphEditCTX.arc(
    center.x,
    center.y,
    getCurrentProject().projectSettings.pointsize / 2,
    0,
    Math.PI * 2,
    true
  );
  _UI.glyphEditCTX.closePath();
  _UI.glyphEditCTX.fill();
  _UI.glyphEditCTX.stroke();
}

function isOverBoundingBoxHandle(px, py, maxes, thickness) {
  // debug('\n isOverBoundingBoxHandle - START');
  // debug('\t px/py - ' + px + ' / ' + py);
  // debug('\t maxes - ' + json(maxes, true));

  if (!maxes) return false;
  const ps = getCurrentProject().projectSettings.pointsize;
  const bb = getBoundingBoxHandleDimensions(maxes, thickness);

  // debug('\t point size - ' + ps);
  // debug('\t l/m/r x: ' + bb.leftx + ' / ' + bb.midx + ' / ' + bb.rightx);
  // debug('\t t/m/b y: ' + bb.topy + ' / ' + bb.midy + ' / ' + bb.bottomy);

  // rotation handle
  if (_UI.multiSelect.shapes.rotateable()) {
    if (
      px > bb.midx &&
      px < bb.midx + ps &&
      py > bb.topy - _UI.rotateHandleHeight &&
      py < bb.topy - _UI.rotateHandleHeight + ps
    ) {
      return 'rotate';
    }
  }

  // upper left
  if (
    px > bb.leftx &&
    px < bb.leftx + ps &&
    py > bb.topy &&
    py < bb.topy + ps
  ) {
    return 'nw';
  }

  // top
  if (px > bb.midx && px < bb.midx + ps && py > bb.topy && py < bb.topy + ps) {
    return 'n';
  }

  // upper right
  if (
    px > bb.rightx &&
    px < bb.rightx + ps &&
    py > bb.topy &&
    py < bb.topy + ps
  ) {
    return 'ne';
  }

  // right
  if (
    px > bb.rightx &&
    px < bb.rightx + ps &&
    py > bb.midy &&
    py < bb.midy + ps
  ) {
    return 'e';
  }

  // lower right
  if (
    px > bb.rightx &&
    px < bb.rightx + ps &&
    py > bb.bottomy &&
    py < bb.bottomy + ps
  ) {
    return 'se';
  }

  // bottom
  if (
    px > bb.midx &&
    px < bb.midx + ps &&
    py > bb.bottomy &&
    py < bb.bottomy + ps
  ) {
    return 's';
  }

  // lower left
  if (
    px > bb.leftx &&
    px < bb.leftx + ps &&
    py > bb.bottomy &&
    py < bb.bottomy + ps
  ) {
    return 'sw';
  }

  // left
  if (
    px > bb.leftx &&
    px < bb.leftx + ps &&
    py > bb.midy &&
    py < bb.midy + ps
  ) {
    return 'w';
  }

  // debug(' isOverBoundingBoxHandle - returning FALSE - END\n');
  return false;
}

function getBoundingBoxHandleDimensions(maxes, thickness) {
  const dimensions = {};
  const hp = getCurrentProject().projectSettings.pointsize / 2;
  thickness = thickness || 1;

  // Translation Fidelity - converting passed canvas values to saved value system
  dimensions.leftx = sXcX(maxes.xMin) - hp;
  dimensions.midx = Math.floor(
    sXcX(maxes.xMin) + (sXcX(maxes.xMax) - sXcX(maxes.xMin)) / 2 - hp
  );
  dimensions.rightx = sXcX(maxes.xMax) - hp;

  dimensions.topy = sYcY(maxes.yMax) - hp;
  dimensions.midy = Math.floor(
    sYcY(maxes.yMax) + (sYcY(maxes.yMin) - sYcY(maxes.yMax)) / 2 - hp
  );
  dimensions.bottomy = sYcY(maxes.yMin) - hp;

  if (thickness > 1) {
    dimensions.leftx -= thickness;
    dimensions.rightx += thickness;
    dimensions.topy -= thickness;
    dimensions.bottomy += thickness;
  }

  dimensions.hp = hp;

  return dimensions;
}

// -------------------
// Drawing Grid
// -------------------

function drawGrid() {
  // debug('\n drawGrid - START');

  const xs = {
    xMax: _UI.glyphEditCanvasSize,
    xMin: 0,
    yMax: _UI.glyphEditCanvasSize,
    yMin: 0,
  };

  // background white square
  _UI.glyphEditCTX.fillStyle = 'white';
  _UI.glyphEditCTX.fillRect(
    xs.xMin,
    xs.yMin,
    xs.xMax - xs.xMin,
    xs.yMax - xs.yMin
  );

  if (_UI.showGrid) {
    const ps = getCurrentProject().projectSettings;
    const v = getView('grid');
    const gsize = (ps.upm / ps.griddivisions) * v.dz;
    const gridcolor = getColorFromRGBA(
      'rgb(170,170,170)',
      transparencyToAlpha(
        getCurrentProject().projectSettings.colors.gridtransparency
      )
    );
    _UI.glyphEditCTX.lineWidth = 1;

    if (gsize > 0 && gsize < _UI.glyphEditCanvasSize) {
      for (let i = v.dx; i < xs.xMax - 1; i += gsize) {
        drawVerticalLine(i, _UI.glyphEditCTX, gridcolor);
      }
      drawVerticalLine(xs.xMax + 1, _UI.glyphEditCTX, gridcolor);
      for (let j = v.dx; j >= xs.xMin; j -= gsize) {
        drawVerticalLine(j, _UI.glyphEditCTX, gridcolor);
      }

      for (let k = v.dy; k < xs.yMax - 1; k += gsize) {
        drawHorizontalLine(k, _UI.glyphEditCTX, gridcolor);
      }
      drawHorizontalLine(xs.yMax, _UI.glyphEditCTX, gridcolor);
      for (let p = v.dy; p >= xs.yMin; p -= gsize) {
        drawHorizontalLine(p, _UI.glyphEditCTX, gridcolor);
      }
    } else {
      console.warn('Grid size computed as ' + gsize + ', not drawing grid.');
    }
  }
}

function drawHorizontalLine(y, ctx, color) {
  ctx = ctx || _UI.glyphEditCTX;
  color = color || 'rgb(0,0,0)';

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  y = makeCrisp(y);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(_UI.glyphEditCanvasSize, y);
  ctx.stroke();
  ctx.closePath();
}

function drawVerticalLine(x, ctx, color) {
  ctx = ctx || _UI.glyphEditCTX;
  color = color || 'rgb(0,0,0)';

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  x = makeCrisp(x);
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, _UI.glyphEditCanvasSize + 1);
  ctx.stroke();
  ctx.closePath();
}

function drawGuides() {
  // debug('\n drawGuides - START');

  if (!getSelectedWorkItemID()) return;

  const ps = getCurrentProject().projectSettings;
  const onglyphedit =
    editor.nav.page === 'glyph edit' || editor.nav.page === 'ligatures';
  const onkern = editor.nav.page === 'kerning';
  // debug('\t ps.guides: ');
  // debug(ps.guides);

  if (_UI.showGuides) {
    if (onkern) {
      _UI.guides.leftGroupXMax.location = getSelectedKern().value;
      _UI.guides.leftGroupXMax.draw();
      _UI.guides.rightGroupXMin.draw();
      ps.guides.baseline.draw();
      return;
    }

    // Update custom guides
    let g;
    for (const c of Object.keys(ps.guides)) {
      g = ps.guides[c];
      if (g.editable) {
        g.draw();
      }
    }

    const selwi = getSelectedWorkItem();
    if (selwi) {
      const t = _UI.eventhandlers.tempnewbasicshape;
      const rl = t ? Math.max(selwi.glyphWidth, t.xMax) : selwi.glyphWidth;
      const ll = Math.min(selwi.maxes.xMin, 0);

      // Update system guides
      ps.guides.xheight.location = ps.xheight;
      ps.guides.capheight.location = ps.capheight;
      ps.guides.ascent.location = ps.ascent;
      ps.guides.baseline.location = 0;
      ps.guides.descent.location = ps.descent;
      ps.guides.min.location = ll;
      ps.guides.max.location = rl;
      ps.guides.leftside.location = getSelectedWorkItem() * -1;
      ps.guides.rightside.location = getSelectedGlyphRightSideBearing() + rl;

      // Minor Guidelines - Overshoots
      if (_UI.showOvershoots) {
        const os = ps.overshoot;
        ps.guides.xheight.draw(-1 * os);
        ps.guides.ascent.draw(-1 * os);
        ps.guides.baseline.draw(os);
        ps.guides.descent.draw(os);
      }

      // Verticals
      ps.guides.zero.draw(0);
      if (onglyphedit) {
        ps.guides.min.draw(0);
        ps.guides.leftside.draw();
        if (getSelectedWorkItemShapes().length || !selwi.isAutoWide) {
          ps.guides.max.draw(0);
          ps.guides.rightside.draw();
        }
      }

      // Horizontals
      ps.guides.xheight.draw();
      ps.guides.capheight.draw();
      ps.guides.ascent.draw();
      ps.guides.descent.draw();
      ps.guides.baseline.draw();

      // Out of bounds triangle
      if (ps.guides.baseline.visible || ps.guides.leftside.visible) {
        const ctx = _UI.glyphEditCTX;
        const v = getView('guides');
        ctx.fillStyle = shiftColor(
          ps.guides.baseline.color,
          ps.colors.systemguidetransparency / 100,
          true
        );
        ctx.beginPath();
        ctx.moveTo(v.dx - 1, v.dy);
        ctx.lineTo(v.dx - 1, v.dy + ps.pointsize * 2);
        ctx.lineTo(v.dx - 1 - ps.pointsize * 2, v.dy);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  // debug(' drawGuides - END\n');
}

// -------------------
// INIT
// -------------------
function setupEditCanvas() {
  _UI.glyphEditCanvas = getEditDocument().getElementById('glyphEditCanvas');
  _UI.glyphEditCanvas.height = _UI.glyphEditCanvasSize;
  _UI.glyphEditCanvas.width = _UI.glyphEditCanvasSize;
  _UI.glyphEditCTX = _UI.glyphEditCanvas.getContext('2d');
  _UI.glyphEditCTX.globalAlpha = 1;
  _UI.glyphEditCanvas.onselectstart = function () {
    return false;
  }; // for Chrome, disable text select while dragging
  _UI.glyphEditCanvas.onmouseout = mouseoutcec;
  _UI.glyphEditCanvas.customguidetransparency = mouseovercec;
}
