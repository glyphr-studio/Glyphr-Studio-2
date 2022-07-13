export default {};
export { importOTFFont };
import { OpenTypeJS } from '../lib/opentypejs_0-9-0.js';

/**
  IO > Import > OpenType
  Using OpenType.js to read in a font file
  and convert it to a Glyphr Studio Project.
**/

function importOTFFont(filter) {
  // log('importOTFFont', 'start');

  /*
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
    if (msg) fis.innerHTML = msg;
  }
  */

  // Font Stuff
  let font = false;
  const importGlyphs = [];

  setTimeout(setupFontImport, 10);

  function setupFontImport() {
    // importStatus('Reading font data...');

    try {
      // Get Font
      font = OpenTypeJS.parse(getGlyphrStudioApp().temp.droppedFileContent);
    } catch (err) {
      console.error(
        'Something went wrong with opening the font file:<br><br>' + err
      );
      return;
    }

    if (font && font.glyphs && font.glyphs.length) {
      // test for range
      if (font.glyphs.length < _UI.overflowCount || filter) {
        // importStatus('Importing Glyph 1 of ' + font.glyphs.length);
        setTimeout(startFontImport, 1);
      } else {
        document.getElementById(
          'openprojecttableright'
        ).innerHTML = make_ImportFilter(
          font.glyphs.length,
          0,
          'importOTFFont'
        );
      }

      Object.keys(font.glyphs.glyphs).forEach(function (key) {
        importGlyphs.push(font.glyphs.glyphs[key]);
      });
    } else {
      loadPage_openproject();
      openproject_changeTab('load');
      showErrorMessageBox(
        'Something went wrong with opening the font file:<br><br>' + err
      );
      return;
    }

    // log('SetupFontImport', 'end');
  }

  function startFontImport() {
    // log('startFontImport', 'start');
    // log(font);
    setTimeout(importOneGlyph, 4);
    // log('startFontImport', 'end');
  }

  /*
   *
   *  GLYPH IMPORT
   *
   */
  let thisGlyph;
  let data;
  let uni;
  let np;
  let adv;
  let isAutoWide;
  let maxGlyph = 0;
  let minChar = 0xffff;
  let customGlyphRange = [];
  let shapeCounter = 0;
  let newShapes = [];
  const fc = {};
  let fl = {};

  let c = 0;
  function importOneGlyph() {
    // log('\n\n=============================\n');
    // log('importOneGlyph', 'start');
    // importStatus('Importing Glyph ' + c + ' of ' + importGlyphs.length);

    if (c >= importGlyphs.length) {
      // setTimeout(importOneKern, 1);
      startFinalizeFontImport();
      return;
    }

    // One Glyph in the font
    thisGlyph = importGlyphs[c];

    // Get the appropriate unicode decimal for this glyph
    // log('starting  unicode \t' + thisGlyph.unicode + ' \t ' + thisGlyph.name);
    // log(thisGlyph);

    uni = decToHex(thisGlyph.unicode || 0);

    if (uni === false || uni === '0x0000') {
      // Check for .notdef
      // log('!!! Skipping '+thisGlyph.name+' NO UNICODE !!!');
      importGlyphs.splice(c, 1);
    } else if (filter && isOutOfBounds([uni])) {
      // log('!!! Skipping '+thisGlyph.name+' OUT OF BOUNDS !!!');
      importGlyphs.splice(c, 1);
    } else {
      // log('GLYPH ' + c + '/'+importGlyphs.length+'\t"'+thisGlyph.name + '" unicode: ' + uni);
      /*
       *
       *  GLYPH IMPORT
       *
       */
      newShapes = [];
      shapeCounter = 0;

      // Import Path Data
      data = flattenDataArray(thisGlyph.path.commands);
      // log('Glyph has path data \n' + data);

      if (data && data !== 'z') {
        data = cleanAndFormatPathPointData(data);

        // log('split data into ' + data.length + ' Glyphr Studio shapes.');
        // log(data);

        for (let d = 0; d < data.length; d++) {
          if (data[d].length) {
            // log('starting convertPathTag');
            np = ioSVG_convertPathTag(data[d]);
            // log('created shape from PathTag');
            // log(np);
            if (np.pathPoints.length) {
              shapeCounter++;
              newShapes.push(
                new Shape({ path: np, name: 'Shape ' + shapeCounter })
              );
            } else {
              // log('!!!!!!!!!!!!!!!!!!\n\t data resulted in no path points: ' + data[d]);
            }
          }
        }
      }

      // Get Advance Width
      isAutoWide = true;
      adv = parseInt(thisGlyph.advanceWidth);
      if (adv) {
        if (!isNaN(adv) && adv > 0) {
          isAutoWide = false;
        }
      } else adv = false;

      // Get some range data
      // uni = uni[0];
      minChar = Math.min(minChar, uni);
      maxGlyph = Math.max(maxGlyph, uni);
      if (1 * uni > _UI.glyphrange.latinExtendedB.end)
        customGlyphRange.push(uni);

      fc[uni] = new Glyph({
        shapes: newShapes,
        glyphhex: uni,
        glyphWidth: adv,
        isAutoWide: isAutoWide,
      });
      if (getUnicodeName(uni) === '[name not found]')
        getCurrentProject().projectSettings.glyphrange.filternoncharpoints = false;

      // Successfull loop, advance c
      c++;
    }

    // finish loop
    setTimeout(importOneGlyph, 1);

    // log('importOneGlyph', 'end');
  }

  function flattenDataArray(da) {
    // log('flattenDataArray', 'start');
    // log(json(da, true));

    let re = '';
    let tc;
    for (let i = 0; i < da.length; i++) {
      tc = da[i];

      re += tc.type;

      if (isVal(tc.x1) && isVal(tc.y1)) {
        re += tc.x1 + ',' + tc.y1 + ',';
        if (isVal(tc.x2) && isVal(tc.y2)) {
          re += tc.x2 + ',' + tc.y2 + ',';
        }
      }

      if (isVal(tc.x) && isVal(tc.y)) re += tc.x + ',' + tc.y + ',';
    }

    // log(re);
    // log('flattenDataArray', 'end');

    return re;
  }

  /*
   *
   *  IMPORT LIGATURES?
   *
   */
  fl = {};

  /*
   *
   *  IMPORT KERNS?
   *
   */
  fk = {};

  /*
   *
   *  FINALIZE
   *
   */
  function startFinalizeFontImport() {
    // importStatus('Finalizing the imported font...');
    setTimeout(finalizeFontImport, 20);
  }

  function finalizeFontImport() {
    // log('finalizeFontImport', 'start');
    getCurrentProject().glyphs = fc;
    getCurrentProject().ligatures = fl;
    getCurrentProject().kerning = fk;

    let rstart;
    let rend;
    for (const r of Object.keys(_UI.glyphrange)) {
      rstart = 1 * _UI.glyphrange[r].begin;
      rend = 1 * _UI.glyphrange[r].end + 1;
      for (let t = rstart; t < rend; t++) {
        if (getGlyph('' + decToHex(t))) {
          getCurrentProject().projectSettings.glyphrange[r] = true;
          break;
        }
      }
    }

    // Make a custom ranges for the rest, with logical separations
    // log('customGlyphRange.length ' + customGlyphRange.length);

    if (customGlyphRange.length) {
      const ranges = getCurrentProject().projectSettings.glyphrange.custom;
      const maxvalley = 50;
      const maxrange = 100;
      customGlyphRange = customGlyphRange.sort();
      let rangestart = customGlyphRange[0];
      let rangeend = customGlyphRange[0];
      let current;
      let fencepost = true;

      for (let c = 0; c < customGlyphRange.length; c++) {
        current = customGlyphRange[c];
        // log('' + current + ' \t ' + rangestart + ' \t ' + rangeend);

        if (current - rangestart > maxrange || current - rangeend > maxvalley) {
          ranges.push({ begin: rangestart, end: rangeend });
          rangestart = current;
          rangeend = current;
          fencepost = false;
          // log('new glyphrange ' + json(ranges));
        } else {
          rangeend = current;
          fencepost = true;
          // log('incrementing...');
        }
      }

      if (fencepost) ranges.push({ begin: rangestart, end: rangeend });
      // log('new glyphrange ' + json(ranges));
    }

    // Import Font Settings
    // Check to make sure certain stuff is there
    // space has horiz-adv-x
    // log('Custom range stuff done');
    const ps = getCurrentProject().projectSettings;
    const md = getCurrentProject().metadata;
    const fname = font.familyName || 'My Font';

    ps.name = fname;
    ps.upm = 1 * font.unitsPerEm || 1000;
    ps.ascent = 1 * font.ascender || 700;
    ps.descent = -1 * Math.abs(font.descender) || 300;
    ps.capheight = 1 * getTableValue(font.tables.os2.sCapHeight) || 675;
    ps.xheight = 1 * getTableValue(font.tables.os2.sxHeight) || 400;
    ps.overshoot = round(ps.upm / 100);

    md.font_family = fname.substr(0, 31);
    md.panose_1 =
      getTableValue(font.tables.os2.panose) || '0 0 0 0 0 0 0 0 0 0';
    md.version =
      getTableValue(font.tables.head.fontRevision) ||
      getTableValue(font.version) ||
      getTableValue('Version 0.001');

    // These can be read in but not saved using OpenType.js
    md.font_style = getTableValue(font.tables.name.fontSubfamily) || 'Regular';
    md.copyright = getTableValue(font.tables.name.copyright) || '';
    md.trademark = getTableValue(font.tables.name.trademark) || '';
    md.designer = getTableValue(font.tables.name.designer) || '';
    md.designerURL = getTableValue(font.tables.name.designerURL) || '';
    md.manufacturer = getTableValue(font.tables.name.manufacturer) || '';
    md.manufacturerURL = getTableValue(font.tables.name.manufacturerURL) || '';
    md.license = getTableValue(font.tables.name.license) || '';
    md.licenseURL = getTableValue(font.tables.name.licenseURL) || '';
    md.description = getTableValue(font.tables.name.description) || '';

    // md.font_weight = 1*font.fontweight || 400;
    // md.font_stretch = font.fontstretch || 'normal';
    // md.underline_position = 1*font.underlineposition || -50;
    // md.underline_thickness = 1*font.underlinethickness || 10;
    // md.strikethrough_position = 1*font.strikethroughposition || 300;
    // md.strikethrough_thickness = 1*font.strikethroughthickness || 10;
    // md.overline_position = 1*font.overlineposition || 750;
    // md.overline_thickness = 1*font.overlinethickness || 10;

    // Finish Up
    // log('calling finalizeUI');
    finalizeUI();
    closeDialog();
    // log('finalizeFontImport', 'end');
    navigate();
  }

  // log('importOTFFont', 'end');
}

function getTableValue(val) {
  try {
    // fixes #238 .ttf import from Google Fonts
    if (typeof val === 'object' && typeof val.en === 'string') {
      return val.en;
    }

    if (Object.prototype.toString.call(val) === '[object Array]') {
      return val.join(' ');
    }
  } catch (err) {
    return 0;
  }
}
