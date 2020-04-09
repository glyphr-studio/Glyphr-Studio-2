/**
  Page > Project Settings
  Project Settings are any settings that are
  specific to Glyphr Studio, and are not a part
  of any font metadata.
  HTML and associated functions for this page.
**/

/*
  function loadPage_projectSettings() {
    // debug("LOADING PAGE >> loadPage_projectSettings");
    let ps = getCurrentProject().projectSettings;

    let content = '<h1 class="pagetitle">Project Settings</h1><div class="pagecontent textpage">';

    content += '<h1>Project Name</h1>'+
          'The Font Name and the Project name can be different, but they start out the same. The Font Name can be changed on the Font Settings page.'+
          '<table class="settingstable">'+
          '<tr><td>Project Name:</td><td><input type="text" style="width:100%" value="' + ps.name + '" onchange="getCurrentProject().projectSettings.name = this.value;" /></td></tr>'+
          '</table>';

    content += '<h1>Grids and Guides</h1>';
    content += '<h2>Grid System</h2>';
    content += 'Defining a grid system to use while editing glyphs in this font makes stuff a whole ' +
          'lot easier. This number is the number of vertical and horizontal divisions to use, it should ' +
          'divide evenly into the Units per Em.<br>' +
          '<table class=\'settingstable\'>'+
          '<tr><td>Units per Em:</td><td><input type=\'number\' disabled=\'disabled\' value=\'' + ps.upm + '\'/></td><td><span class=\'unit\'>(total)</span></td></tr>'+
          '<tr><td>Grid Divisions</td><td><input type=\'number\' value=\''+ps.griddivisions+'\' onchange=\'updateGridDivisions(this.value);\'/></td><td><span class=\'unit\'>(number)</span></td></tr>'+
          '<tr><td>Grid Square Size:</td><td><input type=\'number\' id=\'metirc-ssize\' disabled=\'disabled\' value=\'' + (ps.upm/ps.griddivisions) + '\'/></td><td><span class=\'unit\'>(em units)</span></td></tr>' +
          '</table>';

    content += '<h2>Overshoot</h2>'+
          'Round letters usually extend a little above the x height line and below the baseline. ' +
          'A light guideline will show this overshoot distance.<br>' +
          '<table class=\'settingstable\'>'+
          '<tr><td>Overshoot:</td><td><input type=\'number\' value=\''+ps.overshoot+'\' onchange=\'getCurrentProject().projectSettings.overshoot = this.value;\'></td><td><span class=\'unit\'>(em units)</span></td></tr>'+
          '</table>';

    content += '<h1>UI Behavior</h1>'+
          '<table class="settingstable">'+

          '<tr><td class="uicolumn">'+checkUI('getCurrentProject().projectSettings.renderpointssnappedtogrid', ps.renderpointssnappedtogrid)+'</td>'+
          '<td class="longlabel"><label for="renderpointssnappedtogrid">Render shape outlines with their points snapped to a 1em grid.<br>(required for .otf export - Project Files will still store decimal values)</label></td></tr>'+

          '<tr><td class="uicolumn">'+checkUI('getCurrentProject().projectSettings.showkeyboardtipsicon', ps.showkeyboardtipsicon)+'</td>'+
          '<td><label for="showkeyboardtipsicon" style="position:relative; top:-6px;">Show the &nbsp;<span style="position:relative; top:6px; height:22px;">'+makeIcon({'name': 'keyboard', 'size': 50, 'width': 22, 'height': 22, 'color': 'rgb(76, 81, 86)', 'hoverColor': 'rgb(76, 81, 86)'})+'</span>&nbsp; button on the edit canvas.</label></td></tr>'+

          '<tr><td class="uicolumn">'+checkUI('getCurrentProject().projectSettings.stopPageNavigation', ps.stopPageNavigation)+'</td>'+
          '<td><label for="stopPageNavigation">Show a confirmation message if you attempt to close an unsaved project.</label></td></tr>'+

          '<tr><td class="uicolumn">'+checkUI('getCurrentProject().projectSettings.formatsavefile', ps.formatsavefile)+'</td>'+
          '<td><label for="formatsavefile">Format the Glyphr Project text file for easy reading. This may increase the file size by 2x.</label></td></tr>'+

          '<tr><td class="uicolumn"><input type="text" value="'+(ps.spinnervaluechange)+'" onchange="var r=round(parseInt(this.value)); r=r||1; getCurrentProject().projectSettings.spinnervaluechange=r; this.value=r;" style="width:25px;"/></td>'+
          '<td>Spinner Button and Keyboard Nudge increment or decrement value.</td></tr>'+

          '<tr><td class="uicolumn"><input type="text" value="'+(ps.pointsize)+'" onchange="var r=round(parseInt(this.value)); r=r||1; getCurrentProject().projectSettings.pointsize=r; this.value=r;" style="width:25px;"/></td>'+
          '<td>Path Point and Handle size.</td></tr>'+

          '<tr><td class="uicolumn"><input type="text" value="'+(ps.colors.gridtransparency || 95)+'" onchange="var r=Math.max(1, Math.min(99, round(parseInt(this.value)))); r=r||95; this.value=r; updateGridLightness(r);" style="width:25px;"/></td>'+
          '<td>% Grid lightness on the edit canvas.</td></tr>'+

          '</table>';


    content += '<h1>Export Options</h1>'+
          '<table class="settingstable">'+

          '<tr><td class="uicolumn">'+checkUI('getCurrentProject().projectSettings.combineshapesonexport', ps.combineshapesonexport)+'</td>'+
          '<td class="longlabel"><label for="combineshapesonexport">Combine all glyph shapes<br>Sometimes fonts behave better if there are less path outlines in a glyph. This option will combine all overlapping shapes with the same winding into as few shapes as possible.</label></td></tr>'+

          '<tr><td class="uicolumn"><input type="text" value="'+(ps.maxcombineshapesonexport)+'" onchange="var r=round(parseInt(this.value)); r=r||30; getCurrentProject().projectSettings.maxcombineshapesonexport=r; this.value=r;" style="width:40px; padding-left:4px; margin-top:0px;"/></td>'+
          '<td class="longlabel">Maximum shapes to attempt to combine<br>Combining glyph shapes is a time-intensive process. If a glyph has more than this number of shapes, combine will not be attempted, and overlapping shapes will be exported as-is.</td></tr>'+

          '<tr><td class="uicolumn"><input type="text" value="'+(ps.svgprecision)+'" onchange="var r=round(parseInt(this.value)); r=r||3; getCurrentProject().projectSettings.svgprecision=r; this.value=r;" style="width:40px; padding-left:4px; margin-top:0px;"/></td>'+
          '<td class="longlabel">SVG Decimal Precision<br>Number of decimal places to round point data.</td></tr>'+

          '</table>';


    content += '</div>';

    getEditDocument().getElementById('mainwrapper').innerHTML = content;
  }

  function updateGridLightness(l) {
    l = l || 95;
    getCurrentProject().projectSettings.colors.gridtransparency = l;
  }

  function updateGridDivisions(val) {
    let ps = getCurrentProject().projectSettings;
    ps.griddivisions = Math.min(ps.upm, Math.max(1, val));
    document.getElementById('metirc-ssize').value = round((ps.upm / ps.griddivisions), 3);
  }


function unicodeInputHelp() {
  let re = '<h1>Using Unicode Values</h1>'+
    'Unicode is a format used by fonts that assigns an ID number to every glyph.<br>'+
    'Glyphr Studio uses this format for importing fonts, and for identifying glyphs,<br>kern pairs, and ligatures.<br><br>'+
    'Glyphr Studio accepts three flavors of this ID number:<br>'+
    '<ul>'+
      '<li><b>Decimal Numbers</b> - for example, the number 78 corresponds to capital N.</li>'+
      '<li><b>Hexadecimal Numbers</b> - a base-16 number with a 0x prefix. For example,<br>0x4E corresponds to capital N.</li>'+
      '<li><b>Unicode Numbers</b> - a base-16 number with a U+ prefix. For example,<br>U+4E corresponds to capital N.</li>'+
    '</ul>'+
    'When you input any of these numbers, Glyphr Studio will validate the number,<br>and convert it to a four digit hex format (like 0x004E).<br><br>'+
    'Note: Glyphr Studio is limited to the Basic Multilingual Plane,<br>Unicode U+0000 through U+FFFF. Unicode range notation is not supported.'+
    '';
  return re;
}


// --------------------------------------------------------------
// Range Functions
// --------------------------------------------------------------


function addCustomGlyphRange() {
  let newrange = getCustomRange(true);
  if (newrange) {
    getCurrentProject().projectSettings.glyphrange.custom.unshift(newrange);
    updateCustomRangeTable();
  }
}


function getCustomRange(filterbasicrange) {
  let newrange = {'begin': 0, 'end': 0};
  newrange.begin = parseUnicodeInput(document.getElementById('customrangebegin').value)[0];
  newrange.end = parseUnicodeInput(document.getElementById('customrangeend').value)[0];
  document.getElementById('customrangebegin').value = '';
  document.getElementById('customrangeend').value = '';

  if (isNaN(newrange.begin) || isNaN(newrange.end)) {
    document.getElementById('customrangeerror').style.display = 'block';
    setTimeout(function() {
      document.getElementById('customrangeerror').style.display = 'none';
    }, 2500);
    return false;
  } else {
    // flip
    if (newrange.begin > newrange.end) {
      let tempbegin = newrange.begin;
      newrange.begin = newrange.end;
      newrange.end = tempbegin;
    }

    // maxes
    if (filterbasicrange) {
      newrange.begin = Math.max(newrange.begin, (_UI.glyphrange.latinExtendedB.end+1));
      newrange.end = Math.max(newrange.end, (_UI.glyphrange.latinExtendedB.end+2));
    }
    newrange.begin = Math.min(newrange.begin, 0xFFFE);
    newrange.end = Math.min(newrange.end, 0xFFFF);

    // format
    newrange.begin = decToHex(newrange.begin);
    newrange.end = decToHex(newrange.end);

    return newrange;
  }
}


function updateCustomRangeTable() {
  let cr = getCurrentProject().projectSettings.glyphrange.custom;
  // debug('UPDATECUSTOMRANGETABLE - \n\t custom is ' + JSON.stringify(cr));
  let content = '';
  if (cr.length) {
    content += 'Existing custom glyph ranges:<br><table style="margin-top:8px;">';
    for (let c=0; c<cr.length; c++) {
      content += '<tr><td class="customrangeline">';
      content += cr[c].begin + '&nbsp;&nbsp;through&nbsp;&nbsp;' + cr[c].end + '&nbsp;&nbsp;';
      content += '</td><td>';
      content += '<button onclick="removeCustomGlyphRange('+c+');">remove</button>';
      content += '</td></tr>';
    }
    content += '</table><br>';
    content += 'Note, removing a custom range will not delete glyph data from your Glyphr Project. ';
    content += 'Custom ranges only determine what is shown in the UI, and what is exported to fonts.';
  }
  document.getElementById('customrangetable').innerHTML = content;
}

function removeCustomGlyphRange(i) {
  let cr = getCurrentProject().projectSettings.glyphrange.custom;
  // debug('REMOVECUSTOMGLYPHRANGE - called on index ' + i + '\n\t custom is ' + JSON.stringify(cr));
  cr.splice(i, 1);
  updateCustomRangeTable();
  // debug('REMOVECUSTOMGLYPHRANGE - \n\t custom is ' + JSON.stringify(cr));
}
*/
