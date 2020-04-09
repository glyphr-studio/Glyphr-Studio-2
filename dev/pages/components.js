/**
  Page > Components
  HTML and associated functions for this page.
**/

/*
  function loadPage_components() {
    // debug('\n loadPage_components - START');

    getEditDocument().getElementById('mainwrapper').innerHTML = makeEditPageContent();
    setupEditCanvas();
    initEventHandlers();
    clickEmptySpace();

    if (window.GlyphrStudio.settings.dev.mode && isVal(window.GlyphrStudio.settings.dev.selectedShape)) {
      selectShape(window.GlyphrStudio.settings.dev.selectedShape);
      window.GlyphrStudio.settings.dev.selectedShape = false;
    }

    _UI.selectedComponent = _UI.selectedComponent || getFirstID(getCurrentProject().components);

    if (getSelectedWorkItemShapes().length > 0) _UI.selectedTool = 'pathedit';
    else _UI.selectedTool = 'pathaddpoint';

    redraw({calledBy: 'loadPage_components'});
  }


  function createNewComponent(pglyph) {
    // debug('\n createNewComponent - START');

    pglyph = pglyph || new Glyph({'name': 'Component ' + (countObjectKeys(getCurrentProject().components)+1)});
    let newid = generateNewID(getCurrentProject().components, 'com');
    _UI.selectedComponent = newid;

    getCurrentProject().components[newid] = pglyph;

    // debug("Added New Component: " + newid + " JSON=" + json(getCurrentProject().components));

    return newid;
  }

  function deleteComponentConfirm() {
    let content = '<h1>Delete Component</h1>';
    content += '<b style="color:'+_UI.colors.error.medium+';">This action cannot be undone!</b> &nbsp; Are you sure you want to delete this Component?<br><br>';

    let uia = getSelectedWorkItem().usedIn;
    if (uia.length > 0) {
      content += 'This Component is linked to the following Glyphs as a Component Instance:<br><ul>';

      for (let ssu=0; ssu<uia.length; ssu++) {
        content += ('<li>' + getGlyphName(uia[ssu]).replace(/LATIN /gi, '') + '</li>');
      }

      content += '</ul>';
      // content += '<br>The Component Instances in these Glyphs will also be deleted.<br><br>';
    }

    content += '<br><br><button class="buttonsel" onclick="deleteComponent();">delete this component</button> &nbsp; <button onclick="closeDialog();">cancel</button>';

    openDialog(content);
  }

  function deleteComponent() {
    // debug('\n deleteComponent - START');
    // debug('\t deleting ' + _UI.selectedComponent);

    closeDialog();

    // Delete upstream Component Instances
    getSelectedWorkItem().deleteLinks(_UI.selectedComponent);

    // Delete it
    let oldname = getSelectedWorkItemName();
    delete getCurrentProject().components[_UI.selectedComponent];
    _UI.selectedComponent = getFirstID(getCurrentProject().components);

    // historyPut('Deleted ' + oldname);

    // debug('\t after delete ' + getCurrentProject().components);
    redraw({calledBy: 'deleteComponent'});

    // debug('deleteComponent - END\n');
  }
*/
