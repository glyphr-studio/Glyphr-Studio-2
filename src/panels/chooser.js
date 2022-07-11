/**
    Panel > Chooser
    Shows a list of all the Glyphs to choose from
    for whatever the current page is.  Also has
    the logic for creating Glyph chooser dialogs.
**/

function makePanel_GlyphChooser() {
  // log('\n makePanel_GlyphChooser - START');

  let content = '<div class="navarea_header">';
  content += makePanelSuperTitle();
  content += '<h1 class="paneltitle">chooser</h1>';
  content += '</div>';
  content += '<div class="panel_section" id="glyphChooser">';

  const gcp = _UI.glyphChooser.panel;
  // _UI.glyphChooser.cache = false;

  if (editor.nav.page === 'glyph edit') {
    asyncLoadChooserPanel();
    // _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
  } else if (editor.nav.page === 'import svg') {
    asyncLoadChooserPanel();
    // _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
  } else if (editor.nav.page === 'ligatures') {
    const emptyligs = Object.keys(getCurrentProject().ligatures).length === 0;
    if (!emptyligs) {
      content += make_GlyphChooser(gcp);
    }
    content += '<div class="panel_section" ';
    content += emptyligs ? 'style="padding-top:-10px;">' : '>';
    content +=
      '<button onclick="showNewLigatureDialog();">create new ligature</button><br>';
    if (!emptyligs)
      content +=
        '<button onclick="deleteLigatureConfirm();">delete selected ligature</button><br>';
    else
      content +=
        '<button onclick="addCommonLigatures();">add some common ligatures</button>';
    content += '</div>';

    if (emptyligs) {
      content += '<div class="panel_section">';
      content += '<h2>Please note!</h2><br>';
      content +=
        'Ligatures will only be exported to SVG Fonts. This is a limitation of the library we use to write OTF files.<br><br>';
      content +=
        'If you really need Ligatures in an OTF file, first export your project to an SVG Font, then use an online service to ';
      content += 'convert your SVG Font to an OTF Font.';
      content += '</div>';
    }
  } else if (editor.nav.page === 'components') {
    const emptycoms = Object.keys(getCurrentProject().components).length === 0;
    if (!emptycoms) {
      content += make_GlyphChooser(gcp);
    }
    content += '<div class="panel_section" ';
    content += emptycoms ? 'style="padding-top:-10px;">' : '>';
    content +=
      "<button onclick=\"createNewComponent();historyPut('Create New Component');navigate({panel:'npAttributes'});\">create new component</button><br>";
    if (!emptycoms)
      content +=
        '<button onclick="deleteComponentConfirm();">delete selected component</button><br>';
    content += '</div>';
  }

  content += '</div>';

  // log('makePanel_GlyphChooser', 'end');
  return content;
}

function asyncLoadChooserPanel() {
  // log('asyncLoadChooserPanel - START');

  function tryLoadChooserPanel() {
    const np = _UI.popOut
      ? document.getElementById('popOut_glyphchooser')
      : document.getElementById('navarea_panel');
    const gc = document.getElementById('glyphChooser');

    if (_UI.glyphChooser.cache && np && gc && gc.innerHTML === '') {
      gc.innerHTML = _UI.glyphChooser.cache;
      // log('tryLoadChooserPanel - SUCCESS\n');
    } else {
      // log('tryLoadChooserPanel - TRYING AGAIN\n');
      setTimeout(tryLoadChooserPanel, 10);
    }
  }

  tryLoadChooserPanel();
  _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
}

function make_GlyphChooser(gcdata) {
  // log('\n make_GlyphChooser - START');
  // log([gcdata]);

  let con = '';

  if (
    gcdata.choices === 'all' ||
    (editor.nav.page === 'glyph edit' && pluralGlyphRange()) ||
    (editor.nav.page === 'import svg' &&
      (pluralGlyphRange() ||
        Object.keys(getCurrentProject().components).length ||
        Object.keys(getCurrentProject().ligatures).length))
  ) {
    con += make_GlyphChooser_Header(gcdata.selected);
  }

  if (_UI.glyphChooser.dropdown)
    con += make_GlyphChooser_DropDown(gcdata.choices);
  else con += make_GlyphChooser_Content(gcdata);

  // log('make_GlyphChooser', 'end');
  return con;
}

function toggle_GlyphChooser() {
  _UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

  if (isBigDialogOpen()) {
    document.getElementById(
      'bigDialogScrollContent'
    ).innerHTML = make_GlyphChooser(_UI.glyphChooser.dialog);
  } else {
    redraw({ calledBy: 'toggle_GlyphChooser', redrawCanvas: false });
  }
}

function update_GlyphChooser(selrange) {
  // log('\n update_GlyphChooser - START');
  // log('passed ' + selrange);

  if (isBigDialogOpen()) {
    _UI.glyphChooser.dialog.selected = selrange;
    toggle_GlyphChooser();
  } else {
    _UI.glyphChooser.panel.selected = selrange;
    _UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

    if (selrange === 'glyphs') selrange = 'basicLatin';

    if (!isNaN(parseInt(selrange))) {
      selectGlyph(
        getCurrentProject().projectSettings.glyphrange.custom[selrange].begin,
        true
      );
    } else {
      switch (selrange) {
        case 'basicLatin':
          selectGlyph('0x0041', true);
          break;
        case 'latinSupplement':
          selectGlyph('0x00A0', true);
          break;
        case 'latinExtendedA':
          selectGlyph('0x0100', true);
          break;
        case 'latinExtendedB':
          selectGlyph('0x0180', true);
          break;
        case 'components':
          selectGlyph(getFirstID(getCurrentProject().components), true);
          break;
        case 'ligatures':
          selectGlyph(getFirstID(getCurrentProject().ligatures), true);
          break;
      }
    }

    update_NavPanels();
    redraw({ calledBy: update_GlyphChooser, redrawPanels: false });
  }

  // log('update_GlyphChooser', 'end');
}

function make_GlyphChooser_Header(selrange) {
  // log('\n make_GlyphChooser_Header - START');
  // log('passed selrange ' + selrange);

  let content =
    '<div class="glyphChooser-header" onclick="toggle_GlyphChooser();">';

  if (_UI.glyphChooser.dropdown) {
    content += 'choose a glyph range';
    content += '<span>&#x2571;&#x2572;</span>';
    content += '</div>';
    return content;
  }

  if (selrange === 'glyphs') selrange = 'basicLatin';

  if (!isNaN(parseInt(selrange))) {
    content += 'Custom Range ' + (selrange + 1);
  } else if (selrange) {
    switch (selrange) {
      case 'basicLatin':
        content += 'Basic Latin';
        break;
      case 'latinSupplement':
        content += 'Latin Supplement';
        break;
      case 'latinExtendedA':
        content += 'Latin Extended-A';
        break;
      case 'latinExtendedB':
        content += 'Latin Extended-B';
        break;
      case 'components':
        content += 'Components';
        break;
      case 'ligatures':
        content += 'Ligatures';
        break;
    }
  } else {
    content += selrange;
  }
  // content += '&emsp;&#x25BC;';
  content += '<span>&#x2572;&#x2571;</span>';
  content += '</div>';

  return content;
}

function make_GlyphChooser_DropDown(ch) {
  let content = '<div class="glyphChooser-dropdown">';
  const gr = getCurrentProject().projectSettings.glyphrange;

  if (ch === 'glyphs' || ch === 'all') {
    if (gr.basicLatin)
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'basicLatin\');">Basic Latin</button>';
    if (gr.latinSupplement)
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinSupplement\');">Latin Supplement</button>';
    if (gr.latinExtendedA)
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinExtendedA\');">Latin Extended-A</button>';
    if (gr.latinExtendedB)
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinExtendedB\');">Latin Extended-B</button>';

    if (gr.custom.length) content += '<div style="height:12px;"></div>';
    for (let c = 0; c < gr.custom.length; c++) {
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(' +
        c +
        ');">';
      content += 'Custom Range ' + (c + 1) + '&emsp;';
      content +=
        '<span class="units">' +
        gr.custom[c].begin +
        ' to ' +
        gr.custom[c].end +
        '</span>';
      content += '</button>';
    }
  }

  if (ch === 'components' || ch === 'all') {
    if (Object.keys(getCurrentProject().components).length) {
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'components\');">';
      content += 'Components&emsp;';
      content +=
        '<span class="units">(' +
        Object.keys(getCurrentProject().components).length +
        ')</span>';
      content += '</button>';
    }
  }

  if (ch === 'ligatures' || ch === 'all') {
    if (Object.keys(getCurrentProject().ligatures).length) {
      content +=
        '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'ligatures\');">';
      content += 'Ligatures&emsp;';
      content +=
        '<span class="units">(' +
        Object.keys(getCurrentProject().ligatures).length +
        ')</span>';
      content += '</button>';
    }
  }

  return content + '</div>';
}

function pluralGlyphRange() {
  // log('\n pluralGlyphRange - START');
  const gr = getCurrentProject().projectSettings.glyphrange;
  let count = gr.custom.length;

  if (gr.basicLatin) {
    count++; /* log('triggered basicLatin');*/
  }
  if (gr.latinExtendedA) {
    count++; /* log('triggered latinExtendedA');*/
  }
  if (gr.latinExtendedB) {
    count++; /* log('triggered latinExtendedB');*/
  }
  if (gr.latinSupplement) {
    count++; /* log('triggered latinSupplement');*/
  }

  // log('returning ' + count);
  // log('pluralGlyphRange', 'end');
  return count > 1;
}

function make_GlyphChooser_Content(gcdata) {
  // log('\n make_GlyphChooser_Content - START');
  // log([gcdata]);

  const fname = gcdata.fname || 'selectGlyph';
  const sel = isVal(gcdata.selected) ? gcdata.selected : 'glyphs';
  const selwi = getSelectedWorkItemID();
  let re = '<div class="glyphChooser-content">';

  if (sel === 'basicLatin' || sel === 'glyphs') {
    // log('triggered glyphs');
    const bl = _UI.basiclatinorder;
    for (let i = 0; i < bl.length; i++) {
      re += make_GlyphChooser_Button(bl[i], fname, selwi);
    }
    return re + '</div>';
  }

  if (sel === 'latinSupplement') {
    // log('triggered latinSupplement');
    for (
      let s = _UI.glyphrange.latinSupplement.begin;
      s <= _UI.glyphrange.latinSupplement.end;
      s++
    ) {
      re += make_GlyphChooser_Button(decToHex(s), fname, selwi);
    }
    return re + '</div>';
  }

  if (sel === 'latinExtendedA') {
    // log('triggered latinExtendedA');
    for (
      let a = _UI.glyphrange.latinExtendedA.begin;
      a <= _UI.glyphrange.latinExtendedA.end;
      a++
    ) {
      re += make_GlyphChooser_Button(decToHex(a), fname, selwi);
    }
    return re + '</div>';
  }

  if (sel === 'latinExtendedB') {
    // log('triggered latinExtendedB');
    for (
      let b = _UI.glyphrange.latinExtendedB.begin;
      b <= _UI.glyphrange.latinExtendedB.end;
      b++
    ) {
      re += make_GlyphChooser_Button(decToHex(b), fname, selwi);
    }
    return re + '</div>';
  }

  const cr = getCurrentProject().projectSettings.glyphrange;
  const c = parseInt(sel);
  if (!isNaN(c)) {
    // log('triggered custom range');
    for (let range = cr.custom[c].begin; range <= cr.custom[c].end; range++) {
      cn = decToHex(range);
      if (getCurrentProject().projectSettings.glyphrange.filternoncharpoints) {
        if (getUnicodeName(cn) !== '[name not found]')
          re += make_GlyphChooser_Button(cn, fname, selwi);
      } else {
        re += make_GlyphChooser_Button(cn, fname, selwi);
      }
    }
    return re + '</div>';
  }

  if (sel === 'ligatures' && getFirstID(getCurrentProject().ligatures)) {
    sortLigatures();
    const lig = getCurrentProject().ligatures;
    for (const l of Object.keys(lig)) {
      re += make_GlyphChooser_Button(l, fname, selwi);
    }
    return re + '</div>';
  }

  if (sel === 'components' && getFirstID(getCurrentProject().components)) {
    const com = getCurrentProject().components;
    for (const d of Object.keys(com)) {
      re += make_GlyphChooser_Button(d, fname, selwi);
    }
    return re + '</div>';
  }

  // log('ERROR');
  // log('make_GlyphChooser_HeaderContent', 'end');
  return '[error: make_GlyphChooser_HeaderContent]';
}

function make_GlyphChooser_Button(index, fname, selid) {
  // log('\n make_GlyphChooser_Button - START ' + index);
  const onc = fname + "('" + index + "');";
  // log('constructed function: ' + onc);

  const wi = getGlyph(index);
  // log('getGlyph returned');
  // log(wi);

  let gname = wi.name;
  if (gname === '[name not found]' || !gname) gname = getGlyphName(index);

  let rv =
    '<div class="glyphselect" onclick="' +
    onc +
    '" title="' +
    gname +
    '&#13;' +
    index +
    '">';

  const issel = index === selid;

  if (wi && wi.hasShapes()) {
    let extra = '';
    if (issel) {
      extra = ' glyphselectthumbsel';
    }
    rv +=
      '<div class="glyphselectthumb' + extra + '">' + wi.makeSVG() + '</div>';
  } else {
    if (issel) {
      rv += '<div class="glyphselectbuttonsel"';
    } else {
      rv += '<div class="glyphselectbutton"';
    }

    if (index === '0x0020') {
      rv += ' style="font-size:13px; line-height:3.8em;">space'; // SPACE needs to be smaller font size
    } else if (index.indexOf('0x') === -1) {
      rv += ' style="font-size:8px;"><div style="height:10px;"></div>'; // Component names needs to be smaller font size
      rv += gname;
    } else {
      rv += '>';
      rv += wi.glyphhtml || hexToHTML(index) || gname;
    }

    rv += '</div>';
  }

  rv +=
    '<div class="glyphselectname">' +
    (hexToHTML(index) || gname || '[no name])') +
    '</div>';
  rv += '</div>';

  // log('make_GlyphChooser_Button', 'end');
  return rv;
}
