/**
  Page > Ligatures
  HTML and associated functions for this page.
**/

/*
  function loadPage_ligatures() {
    // debug('\n loadPage_ligatures - START');

    getEditDocument().getElementById('mainwrapper').innerHTML = makeEditPageContent();
    setupEditCanvas();
    initEventHandlers();
    clickEmptySpace();

    if (window.GlyphrStudio.settings.dev.mode && isVal(window.GlyphrStudio.settings.dev.selectedShape)) {
      selectShape(window.GlyphrStudio.settings.dev.selectedShape);
      window.GlyphrStudio.settings.dev.selectedShape = false;
    }

    _UI.selectedLigature = _UI.selectedLigature || getFirstID(getCurrentProject().ligatures);

    if (getSelectedWorkItemShapes().length > 0) _UI.selectedTool = 'pathedit';
    else _UI.selectedTool = 'pathaddpoint';

    redraw({calledBy: 'loadPage_ligatures'});
  }

  function showNewLigatureDialog() {
    let con = '<h1>New Ligature</h1>';
    con += '<div style="width:500px;">';
    con += 'Create a new ligature by specifying two or more individual glyphs that will make up the ligature (like ff).<br><br>';
    con += 'Ligature glyphs can also be specified in Unicode format (like U+0066U+0066) or hexadecimal format (like 0x00660x0066). ';
    con += 'Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!<br><br>';
    con += '<h3>Ligature Glyphs</h3>';
    con += '<input type="text" id="newligatureinput" style="font-size:24px; padding:8px;"/><br>';
    con += makeErrorMessageBox();
    con += '<br>';
    con += '<button class="button--call-to-action" onclick="createNewLigature();">create new ligature</button>';
    con += '</div>';

    openDialog(con);
  }

  function createNewLigature() {
    // debug('\n createNewLigature - START');
    let inlig = document.getElementById('newligatureinput').value;
    // debug('\t retrieved ' + lid);
    let lid = inlig.replace(/\s/gi, '');
    lid = parseUnicodeInput(lid);
    if (lid) lid = lid.join('');
    else {
      showErrorMessageBox('Ligatures must be at least two glyphs.');
      return;
    }


    // debug('\t parsed ' + lid);

    let lig = getCurrentProject().ligatures;

    if (lig[lid]) {
      showErrorMessageBox('Ligature allready exists.');
    } else if (lig === false || lid.length < 2) {
      showErrorMessageBox('Ligatures must be at least two glyphs.');
    } else {
      lig[lid] = new Glyph({'glyphhex': lid, 'name': ('Ligature ' + inlig)});
      sortLigatures();
      _UI.selectedLigature = lid;
      historyPut('Created ' + getSelectedWorkItemName());
      navigate();
      closeDialog();
    }
  }

  function addCommonLigatures() {
    let ff = parseUnicodeInput('ff').join('');
    let fi = parseUnicodeInput('fi').join('');
    let fl = parseUnicodeInput('fl').join('');
    let ft = parseUnicodeInput('ft').join('');
    let ffi = parseUnicodeInput('ffi').join('');
    let ffl = parseUnicodeInput('ffl').join('');

    if (!getCurrentProject().ligatures[ff]) getCurrentProject().ligatures[ff] = new Glyph({'glyphhex': ff});
    if (!getCurrentProject().ligatures[fi]) getCurrentProject().ligatures[fi] = new Glyph({'glyphhex': fi});
    if (!getCurrentProject().ligatures[fl]) getCurrentProject().ligatures[fl] = new Glyph({'glyphhex': fl});
    if (!getCurrentProject().ligatures[ft]) getCurrentProject().ligatures[fl] = new Glyph({'glyphhex': ft});
    if (!getCurrentProject().ligatures[ffi]) getCurrentProject().ligatures[ffi] = new Glyph({'glyphhex': ffi});
    if (!getCurrentProject().ligatures[ffl]) getCurrentProject().ligatures[ffl] = new Glyph({'glyphhex': ffl});

    _UI.selectedGlyph = getFirstID(getCurrentProject().ligatures);
    redraw({calledBy: 'addCommonLigatures'});
  }

  function deleteLigatureConfirm() {
    let content = '<h1>Delete Ligature</h1>';
    content += '<b style="color:'+_UI.colors.error.medium+';">This action cannot be undone!</b> &nbsp; Are you sure you want to delete this Ligature?<br><br>';

    let uia = getSelectedWorkItem().usedIn;
    if (uia.length > 0) {
      content += 'This Ligature is linked to the following Glyphs as a Component Instance:<br><ul>';

      for (let ssu=0; ssu<uia.length; ssu++) {
        content += ('<li>' + getGlyphName(uia[ssu]).replace(/LATIN /gi, '') + '</li>');
      }

      content += '</ul>';
      // content += '<br>The Component Instances in these Glyphs will also be deleted.<br><br>';
    }

    content += '<br><br><button class="button--call-to-action" onclick="deleteLigature();">delete this ligature</button> &nbsp; <button onclick="closeDialog();">cancel</button>';

    openDialog(content);
  }

  function deleteLigature() {
    // debug('\n deleteLigature - START');
    // debug('\t deleting ' + _UI.selectedLigature);

    closeDialog();

    // Delete upstream Component Instances
    getSelectedWorkItem().deleteLinks(_UI.selectedLigature);

    // Delete it
    let oldname = getSelectedWorkItemName();
    delete getCurrentProject().ligatures[_UI.selectedLigature];
    _UI.selectedLigature = getFirstID(getCurrentProject().ligatures);

    // historyPut('Deleted ' + oldname);

    // debug('\t after delete ' + getCurrentProject().ligatures);
    redraw({calledBy: 'deleteLigature'});

    // debug('deleteLigature - END\n');
  }

  function sortLigatures() {
    let temp;
    let sortarr = [];

    for (let n in getCurrentProject().ligatures) {
 if (getCurrentProject().ligatures.hasOwnProperty(n)) {
      temp = getCurrentProject().ligatures[n];
      sortarr.push({'id': n, 'ligature': temp});
    }
}

    sortarr.sort(function(a, b) {
      if (a.id && b.id) {
        if (a.id.length === b.id.length) {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
        } else {
          return b.id.length - a.id.length;
        }
      } else return 0;
    });

    getCurrentProject().ligatures = {};

    for (let s=0; s<sortarr.length; s++) {
      temp = sortarr[s];
      getCurrentProject().ligatures[temp.id] = temp.ligature;
    }

    return sortarr;
  }
*/
