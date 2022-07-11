/**
  IO > Import > SVG Font
  Reading XML Text and parsing it into Glyphr
  Studio Objects.  Relies heavily on
  IO > Import > SVG Outline
**/

function ioSVG_importSVGFont(filter) {
  // log('\n ioSVG_importSVGFont - Start');

  // Spinner Animation
  document.getElementById(
    'openprojecttableright'
  ).innerHTML = make_LoadingAnimation(false);
  const fis = document.getElementById('fontimportstatus');
  const sweep = document.getElementById('sweep');
  let degrees = 0;

  function importStatus(msg) {
    degrees = (degrees + 2) % 360;
    sweep.style.transform = 'rotate(' + degrees + 'deg)';
    fis.innerHTML = msg;
  }

  // Font Stuff
  let font;
  let chars;
  let kerns;

  setTimeout(setupFontImport, 10);

  function setupFontImport() {
    // log('\n setupFontImport - START');
    importStatus('Reading font data...');
    _GP = new GlyphrStudioProject();

    try {
      // Get Font
      let svgdata = getGlyphrStudioApp().temp.droppedFileContent;
      // Convert unicode glyphs to decimal values
      // DOM Parser does not return unicode values as text strings
      // Kern groups containing '&#x' will get fuck'd
      svgdata = svgdata.replace(/&#x/g, '0x');
      const jsondata = convertXMLtoJSON(svgdata);
      font = ioSVG_getFirstTagInstance(jsondata, 'font');
    } catch (e) {
      loadPage_openproject();
      openproject_changeTab('load');
      showErrorMessageBox(
        'There was a problem reading the SVG file:<br>' + e.message
      );
      return;
    }

    // Check to see if it's actually a SVG Font
    if (!font) {
      loadPage_openproject();
      openproject_changeTab('load');
      showErrorMessageBox(
        'The SVG file you tried to load was not a SVG Font file. See Glyphr Studio help for more information.'
      );
      return;
    }

    // Get Kerns
    kerns = ioSVG_getTags(font, 'hkern');

    // Get Glyphs
    chars = ioSVG_getTags(font, 'glyph');

    // test for range
    if (chars.length < _UI.overflowCount || filter) {
      setTimeout(startFontImport, 1);
      // Dump JSON
      // saveFile('Parsed JSON', json(jsondata));
    } else {
      document.getElementById(
        'openprojecttableright'
      ).innerHTML = make_ImportFilter(
        chars.length,
        kerns.length,
        'ioSVG_importSVGFont'
      );
    }

    // log('setupFontImport', 'end');
  }

  function startFontImport() {
    // log('\n startFontImport - START');
    importStatus('Importing Glyph 1 of ' + chars.length);
    setTimeout(importOneGlyph, 4);
    // log('startFontImport', 'end');
  }

  /*
   *
   *  GLYPH IMPORT
   *
   */
  let tca;
  let data;
  let uni;
  let np;
  let adv;
  let isAutoWide;
  let maxGlyph = 0;
  let minchar = 0xffff;
  let customglyphrange = [];
  let shapecounter = 0;
  let newshapes = [];
  const fc = {};
  const fl = {};

  let c = 0;
  function importOneGlyph() {
    importStatus('Importing Glyph ' + c + ' of ' + chars.length);

    if (c >= chars.length) {
      setTimeout(importOneKern, 1);
      return;
    }

    // One Glyph or Ligature in the font
    tca = chars[c].attributes;

    // Get the appropriate unicode decimal for this char
    // log('\n importOneGlyph - START');
    // log('starting  unicode \t' + tca.unicode + ' \t ' + tca['glyph-name']);

    uni = parseUnicodeInput(tca.unicode);

    if (tca.unicode === ' ') uni = ['0x0020'];

    if (uni === false) {
      // Check for .notdef
      // log('!!! Skipping '+tca['glyph-name']+' NO UNICODE !!!');
      chars.splice(c, 1);
    } else if (filter && isOutOfBounds(uni)) {
      // log('!!! Skipping '+tca['glyph-name']+' OUT OF BOUNDS !!!');
      chars.splice(c, 1);
    } else {
      // log('GLYPH ' + c + '/'+chars.length+'\t unicode: ' + json(uni) + '\t attributes: ' + json(tca));
      /*
       *
       *  GLYPH OR LIGATURE IMPORT
       *
       */
      newshapes = [];
      shapecounter = 0;

      // Import Path Data
      data = tca.d;
      // log('Glyph has path data ' + data);
      if (data && data !== 'z') {
        data = cleanAndFormatPathPointData(data);

        // log('split z, data into ' + data.length + ' Glyphr Studio shapes.');
        // log(data);

        for (let d = 0; d < data.length; d++) {
          if (data[d].length) {
            // log('starting convertPathTag');
            np = ioSVG_convertPathTag(data[d]);
            // log('created shape from PathTag');
            // log(np);
            if (np.pathPoints.length) {
              shapecounter++;
              newshapes.push(
                new Shape({ path: np, name: 'Shape ' + shapecounter })
              );
            } else {
              // log('!!!!!!!!!!!!!!!!!!\n\t data resulted in no path points: ' + data[d]);
            }
          }
        }
      }

      // Get Advance Width
      isAutoWide = true;
      adv = parseInt(tca['horiz-adv-x']);
      if (adv) {
        if (!isNaN(adv) && adv > 0) {
          isAutoWide = false;
        }
      } else adv = false;

      if (uni.length === 1) {
        // It's a GLYPH
        // Get some range data
        uni = uni[0];
        minchar = Math.min(minchar, uni);
        maxGlyph = Math.max(maxGlyph, uni);
        if (1 * uni > _UI.glyphrange.latinExtendedB.end)
          customglyphrange.push(uni);

        fc[uni] = new Glyph({
          shapes: newshapes,
          glyphhex: uni,
          glyphWidth: adv,
          isAutoWide: isAutoWide,
        });
        if (getUnicodeName(uni) === '[name not found]')
          getCurrentProject().projectSettings.glyphrange.filternoncharpoints = false;
      } else {
        // It's a LIGATURE
        uni = uni.join('');
        fl[uni] = new Glyph({
          shapes: newshapes,
          glyphhex: uni,
          glyphWidth: adv,
          isAutoWide: isAutoWide,
        });
      }

      // Successfull loop, advance c
      c++;
    }

    // finish loop
    setTimeout(importOneGlyph, 1);

    // log('importOneGlyph', 'end');
  }

  /*
   *
   *  KERN IMPORT
   *
   */
  let tk;
  let leftgroup;
  let rightgroup;
  let newid;
  const fk = {};

  let k = 0;
  function importOneKern() {
    if (k >= kerns.length) {
      importStatus('Finalizing the imported font...');
      setTimeout(startFinalizeFontImport, 1);
      return;
    }

    importStatus('Importing Kern Pair ' + k + ' of ' + kerns.length);

    // log('\n Kern Import - START ' + k + '/' + kerns.length);
    leftgroup = [];
    rightgroup = [];
    tk = kerns[k];
    // log('Kern Attributes: ' + json(tk.attributes, true));

    // Get members by name
    leftgroup = getKernMembersByName(
      tk.attributes.g1,
      chars,
      leftgroup,
      _UI.glyphrange.latinExtendedB.end
    );
    rightgroup = getKernMembersByName(
      tk.attributes.g2,
      chars,
      rightgroup,
      _UI.glyphrange.latinExtendedB.end
    );

    // log('kern groups by name ' + json(leftgroup, true) + ' ' + json(rightgroup, true));

    // Get members by Unicode
    leftgroup = getKernMembersByUnicodeID(
      tk.attributes.u1,
      chars,
      leftgroup,
      _UI.glyphrange.latinExtendedB.end
    );
    rightgroup = getKernMembersByUnicodeID(
      tk.attributes.u2,
      chars,
      rightgroup,
      _UI.glyphrange.latinExtendedB.end
    );

    // log('kern groups parsed as ' + json(leftgroup, true) + ' ' + json(rightgroup, true));

    if (leftgroup.length && rightgroup.length) {
      newid = generateNewID(fk, 'kern');
      kernval = tk.attributes.k || 0;
      // log('Making a kern pair with k = ' + kernval);
      fk[newid] = new HKern({
        leftgroup: leftgroup,
        rightgroup: rightgroup,
        value: kernval,
      });
      // log('Made the new kern successfully.');
      k++;
    } else {
      kerns.splice(k, 1);
      // log('Kern ' + json(tk.attributes, true) + ' returned an empty group.');
    }

    // log('Kern Import', 'end');
    setTimeout(importOneKern, 1);
  }

  /*
   *
   *  FINALIZE
   *
   */
  function startFinalizeFontImport() {
    importStatus('Finalizing the imported font...');
    setTimeout(finalizeFontImport, 4);
  }

  function finalizeFontImport() {
    getCurrentProject().glyphs = fc;
    getCurrentProject().ligatures = fl;
    getCurrentProject().kerning = fk;

    let rstart;
    let rend;
    for (const r of Object.keys(_UI.glyphrange)) {
      rstart = 1 * _UI.glyphrange[r].begin;
      rend = 1 * _UI.glyphrange[r].end + 1;
      for (let t = rstart; t < rend; t++) {
        if (getGlyph(t)) {
          getCurrentProject().projectSettings.glyphrange[r] = true;
          break;
        }
      }
    }

    // Make a custom range for the rest
    if (customglyphrange.length) {
      customglyphrange = customglyphrange.sort();
      getCurrentProject().projectSettings.glyphrange.custom.push({
        begin: customglyphrange[0],
        end: customglyphrange[customglyphrange.length - 1],
      });
    }

    // Import Font Settings
    // Check to make sure certain stuff is there
    // space has horiz-adv-x

    // Font Settings
    const fatt = ioSVG_getFirstTagInstance(font, 'font-face').attributes;
    const ps = getCurrentProject().projectSettings;
    const md = getCurrentProject().metadata;
    const fname = fatt['font-family'] || 'My Font';

    ps.upm = 1 * fatt['units-per-em'] || 1000;
    ps.name = fname;
    ps.ascent = 1 * fatt.ascent || 700;
    ps.capheight = 1 * fatt['cap-height'] || 675;
    ps.xheight = 1 * fatt['x-height'] || 400;
    ps.overshoot = round(ps.upm / 100);
    md.font_family = fname;
    md.panose_1 = fatt['panose-1'] || '0 0 0 0 0 0 0 0 0 0';
    md.font_weight = 1 * fatt['font-weight'] || 400;
    md.font_stretch = fatt['font-stretch'] || 'normal';
    md.underline_position = 1 * fatt['underline-position'] || -50;
    md.underline_thickness = 1 * fatt['underline-thickness'] || 10;
    md.strikethrough_position = 1 * fatt['strikethrough-position'] || 300;
    md.strikethrough_thickness = 1 * fatt['strikethrough-thickness'] || 10;
    md.overline_position = 1 * fatt['overline-position'] || 750;
    md.overline_thickness = 1 * fatt['overline-thickness'] || 10;

    // Finish Up
    finalizeUI();
    closeDialog();

    // log('ioSVG_importSVGFont', 'end');
    navigate();
  }
  // log('ioSVG_importSVGFont', 'end');
}

function make_LoadingAnimation() {
  // log('\n make_LoadingAnimation - START');
  let re = '';
  re += '<div class="openproject_tile">';
  re += '<h2>Importing Font</h2>';
  re += '<div id="fontimportstatus">Reading font data...</div>';
  re +=
    '<br><div style="margin:0px; width:50px; height:50px; padding:0px; background-color:' +
    _UI.colors.blue.l65 +
    ';';
  re +=
    'background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwFJREFUeNrsWd2N2kAQNtYpr/F1wFUQUgG4gnAVABXEVwFHBXepwEkFx1UAVHBOBXYHOK9RJDJzGkerZWZ3bYy9QYw0Qgh2dr6d2dn5Gfz+czgEF0BhcCF0BeIb3bQsryDe0fet9vuEPsfAQ+JWaNDCZc+AfwCvP9wMijoLYW8EMgWeAY/6AFKi4sCruspbQC0JWNQFkO/ADwCgPIevgz4I4gl4fi4gePILALDt4vKCXnifUtd75AqkthVIkSOqcxB1rOMC5Bk2f3DYFH37C13akUOAQH4F2WsH2Qgmsf3pYODEdmLAj8B7ixwT70lGZNkrMckxAUkdBJ8CgANkO7hUWi+51hZMHhv89kV53NomvEP30n2E/Tfc3qHwRiwEIej7b2cEUb3+b7QXRwvS0QqEfeTowdq0mVYY6H0v2lOPeqjbyha1CvjjneBOm1PTiIbpT8y5GeiUq4eqW2QlCFz2ACKgPZfCbyvJIiUgvzXciz7pTnD3fZWXhdrrLVmjb3oyZBxHFvkMqDPmguee1E5HVlG9JVTcKmMWTz0qAqdMBMuqUBwq0YGjmUdAZobI9g/IzhA1fCFJl50KpHBNw/skQafCCKRJudkBRTYgvruVVadrg+5/AlJ6qG/ZBEjmIZDMBmQidDt8skopdGAmKpCxsPibR0AkXcZ60nirFzBUUOUevCklJY2cfnv9jiSMe+HC2ANrxEIzImELKw41IcfMM+3BMu+NEK6Jp3tLqD3/bBFFguKOI1lVr68NBV+kItObXXNL4vbYcmOO7TxadJi7NOhKOonMICiiQudrizlZRpFpbWqWU1W40d1c6jSioHuXzrkydfoUuDWwVcWRfwaO0y5K41+4u2rrxuMo4blB3TAM5EZe0WTKRX1hqQnhNFbYUuQo+oi7dChpYGnTumS/KCCnTviwSwA0EcgDh15z0xmi04CmIYBqYDSvs+6U8XQ12X3FS9vU9cjKI1K+0UT3VCBc7VxQJPqlfFepCgIfSXlTUOgNyLXUvQK5RCB/BRgA7GD39jF9VXsAAAAASUVORK5CYII=); ';
  re += 'rgb(0,140,210) no-repeat fixed;">';
  re += '<img id="sweep" style="margin:0px; padding:0px;" ';
  re +=
    'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAu9JREFUeNrsWMtu00AU9TNOkyakjxSXlj4gIPESYsdjg8SGDSyRWCCxgQ9gh9Qt38LX8AHtCj4AKE1aEzuOuSOdka4uTqxCbHcxRzoa2+PEc+bce30T21ow4knWpKFHdNjlHWKC45S4TPxJ/K7Y8Ozkf5/rWYtHJkRIuMRt4grxGsTHNBySoK8XSUjR7io3YnHtLnGXBA1p/EKCjs77ULsEIWqHwzmhtUYM2NwGsYGQs9g9n8/jkGOVg0lBaHG0hIgruPaWNuQ5cq42IeM5c4EIbX7uo1BoYQ+J70jMRl1C0jlzPjteJ56w8y3isbj/CfEjibl60YTwvOyKEPPFvfvEEeY+zBNTihBK0lmh1WNhtyRyaZN4Ks4dtilaTFilI7PKsNrxKY77xIhVKelUh3gm8ukB8YDEtKsUkhbkR4Md99miW3BjyOY7eHmeoJS/rtsRly0sYeX2lAndFwWgkyPsJblyr04hAatWMRa+yty7TvzB7g/BYU5H8qkuIR76MB5iW2zhN1GhNHYRZiPxPeoze8pJcuVF6UKocqU5PVaEluQMiwxYhRrDGSX4Bo4jUfEGKAo6n95X4YglmsOmaEl2EDJruBajJA/gQso+p0LuEgRMeYkmV55WIWQiQku3JGrxv1Fm17FAldTqhfeL3b+NUIpyQtWFS2/KauNnlWCbtSS3Uak2ca4Sus2Suo/fKyMRXvod0wSVONVYdr2KQ6uLKjVEch8jxDy40oNbY5HkS3CsgdDKhEOPyxaSsER32KJChNYAY4YXHk9wF3nRYu7O6uHulCqEKteUbJ/CjRWETBu7uofwCjEfseqkQ2dc0IC6cPNZ2Y7ohHewwBDjKt4lujVxUZabuD/L+U0TsILhY9QuP6pCSIIF3yJeRg74SP5liNKhk2DOxRjg2C14Rq8qIfchpIsc8VjFbLCF+//6ELtsFZQjale/sf+6MhEWC0EVQtRL7pVlYGBgYGBgYGBgYGBgYGBgYGBg8Bf+CDAAUF2+ry6GVycAAAAASUVORK5CYII=">';
  re += '</div>';
  re += makeErrorMessageBox();
  re += '</div>';

  // log('make_LoadingAnimation', 'end');
  return re;
}

function make_ImportFilter(chars, kerns, funname) {
  let re =
    '<div class="openproject_tile" style="width:500px; height:auto;">' +
    '<h2>Whoa, there...</h2><br>' +
    "The font you're trying to import has <b>" +
    chars +
    ' glyphs</b>';
  if (kerns) re += ' and <b>' + kerns + ' kern pairs</b>.  ';
  else re += '.  ';
  re +=
    'Glyphr Studio has a hard time with super-large fonts like this.  ' +
    'We recommend pairing it down a little:<br><br>';

  re += '<table>';

  re +=
    '<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'basic\');" id="basic" checked/></td><td>';
  re +=
    '<h3>Only import Latin glyphs</h3>' +
    'This includes Latin and Latin Extended Unicode ranges<br>(0x0020 - 0x024F).<br><br>';
  re += '</td></tr>';

  re +=
    '<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'custom\');" id="custom"/></td><td>';
  re +=
    '<h3>Import a custom range of glyphs</h3>' +
    'A nice overview of glyph ranges can be found at<br><a href="https://en.wikipedia.org/wiki/Unicode_block" target="_blank">Wikipedia\'s Unicode Block page</a>.<br>' +
    '<table class="settingstable"><tr>' +
    "<td>begin:<br><input type=\"text\" onchange=\"checkFilter('custom');document.getElementById('importfontbutton').disabled = 'disabled';\" value=\"" +
    decToHex(_UI.importRange.begin) +
    '" id="customrangebegin"></td>' +
    "<td>end:<br><input type=\"text\" onchange=\"checkFilter('custom');document.getElementById('importfontbutton').disabled = 'disabled';\" value=\"" +
    decToHex(_UI.importRange.end) +
    '" id="customrangeend"></td>' +
    '<td><br><button onclick="checkFilter(\'custom\');">Set Range</button></td>' +
    '<td style="padding-top:20px;">' +
    helpUI(unicodeInputHelp()) +
    '</td>' +
    '<td><br><div id="customrangeerror">bad range input</div></td>' +
    '</tr></table><br>';
  re += '</td></tr>';

  re +=
    '<tr><td class="checkcol"><input type="checkbox" onclick="checkFilter(\'everything\');" id="everything"/></td><td>';
  re +=
    '<h3>Import all the glyphs</h3>' + "Don't say we did't try to warn you.";
  re += '</td></tr>';

  re += '</table>';

  re +=
    '<br><br><button class="button--call-to-action" id="importfontbutton" onclick="' +
    funname +
    '(true);">Import Font</button>';

  return re;
}

function setFontImportRange() {
  const range = getCustomRange(false);
  if (range) {
    _UI.importRange = range;
    document.getElementById('customrangebegin').value = range.begin;
    document.getElementById('customrangeend').value = range.end;
  }
}

function isOutOfBounds(uni) {
  if (!uni.length) return true;

  for (let u = 0; u < uni.length; u++) {
    if (
      parseInt(uni[u]) > _UI.importRange.end ||
      parseInt(uni[u]) < _UI.importRange.begin
    )
      return true;
  }

  return false;
}

function checkFilter(id) {
  if (id === 'basic') {
    document.getElementById('basic').checked = true;
    document.getElementById('custom').checked = false;
    document.getElementById('everything').checked = false;
    _UI.importRange.begin = 0x0020;
    _UI.importRange.end = 0x024f;
  } else if (id === 'custom') {
    document.getElementById('basic').checked = false;
    document.getElementById('custom').checked = true;
    document.getElementById('everything').checked = false;
    setFontImportRange();
  } else if (id === 'everything') {
    document.getElementById('basic').checked = false;
    document.getElementById('custom').checked = false;
    document.getElementById('everything').checked = true;
    _UI.importRange.begin = 0x0000;
    _UI.importRange.end = 0xffff;
  }

  document.getElementById('importfontbutton').disabled = false;
}

function getKernMembersByName(names, chars, arr, limit) {
  limit = limit || 0xffff;
  let uni;
  if (names) {
    names = names.split(',');

    // Check all the glyph names
    for (let n = 0; n < names.length; n++) {
      // Check all the chars
      for (let c = 0; c < chars.length; c++) {
        if (chars[c].attributes.unicode) {
          // Push the match
          if (names[n] === chars[c].attributes['glyph-name']) {
            uni = parseUnicodeInput(chars[c].attributes.unicode);
            if (1 * uni < limit) arr = arr.concat(uni);
          }
        }
      }
    }
  }

  return arr;
}

function getKernMembersByUnicodeID(ids, chars, arr, limit) {
  limit = limit || 0xffff;
  let uni;
  if (ids) {
    ids = ids.split(',');

    // Check all the IDs
    for (let i = 0; i < ids.length; i++) {
      // Check all the chars
      for (let c = 0; c < chars.length; c++) {
        if (chars[c].attributes.unicode) {
          // Push the match
          if (ids[i] === chars[c].attributes.unicode) {
            uni = parseUnicodeInput(chars[c].attributes.unicode);
            if (1 * uni < limit) arr = arr.concat(uni);
          }
        }
      }
    }
  }

  return arr;
}
