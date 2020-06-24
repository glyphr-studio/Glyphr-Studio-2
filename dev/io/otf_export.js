export default {};
export { exportOTFFont };

import Glyph from '../glyph_elements/glyph.js';
import { getCurrentProject } from '../project/glyphr_studio_project.js';
import { round, clone } from '../common/functions.js';
import { showToast } from '../controls/dialogs.js';
import { decToHex, getUnicodeShortName } from '../common/unicode.js';
import { OpenTypeJS } from '../lib/opentypejs_0-9-0.js';

/**
  IO > Export > OpenType
  Using OpenType.js to convert a Glyphr Studio
  Project into OpenType.js format for saving.
**/

function exportOTFFont() {
  // debug('\n exportOTFFont - START');
  // debug('\t combineShapesOnExport = ' + getCurrentProject().projectSettings.combineShapesOnExport);

  function firstExportStep() {
    // debug('\n firstExportStep - START');

    // Add metadata
    const md = getCurrentProject().metadata;
    const ps = getCurrentProject().projectSettings;

    options.unitsPerEm = ps.upm || 1000;
    options.ascender = ps.ascent || 0.00001;
    options.descender = -1 * Math.abs(ps.descent) || -0.00001;
    options.familyName = md.font_family || ' ';
    options.styleName = md.font_style || ' ';
    options.designer = md.designer || ' ';
    options.designerURL = md.designerURL || ' ';
    options.manufacturer = md.manufacturer || ' ';
    options.manufacturerURL = md.manufacturerURL || ' ';
    options.license = md.license || ' ';
    options.licenseURL = md.licenseURL || ' ';
    options.version = md.version || 'Version 0.001';
    options.description = md.description || ' ';
    options.copyright = md.copyright || ' ';
    options.trademark = md.trademark || ' ';
    options.glyphs = [];

    // debug('\t NEW options ARG BEFORE GLYPHS');
    // debug(options);
    // debug('\t options.version ' + options.version);

    // Add Notdef
    const notdef = generateNotdefGlyph();

    const notdefPath = notdef.makeOpenTypeJSPath();

    options.glyphs.push(
      new OpenTypeJS.Glyph({
        name: '.notdef',
        unicode: 0,
        index: 0,
        advanceWidth: round(notdef.getAdvanceWidth()),
        xMin: round(notdef.maxes.xMin),
        xMax: round(notdef.maxes.xMax),
        yMin: round(notdef.maxes.yMin),
        yMax: round(notdef.maxes.yMax),
        path: notdefPath,
      })
    );

    // debug(' firstExportStep - END\n');
  }

  function populateExportList() {
    // debug('\n populateExportList - START');

    // Add Glyphs and Ligatures
    let tg;
    for (const c in getCurrentProject().glyphs) {
      if (getCurrentProject().glyphs[c]) {
        if (parseInt(c)) {
          tg = new Glyph(clone(getCurrentProject().glyphs[c]));
          exportArray.push({ xg: tg, xc: c });
        } else {
          console.warn(
            'Skipped exporting Glyph ' + c + ' - non-numeric key value.'
          );
        }
      }
    }

    exportArray.sort(function (a, b) {
      return a.xc - b.xc;
    });
    // debug(' populateExportList - END\n');
  }

  function generateOneGlyph() {
    // debug('\n generateOneGlyph - START');
    // export this glyph
    const glyph = currentExportGlyph.xg;
    const num = currentExportGlyph.xc;
    const comb = getCurrentProject().projectSettings.combineShapesOnExport;
    const maxes = glyph.maxes;

    // debug('\t ' + glyph.name);

    showToast('Exporting<br>' + glyph.name, 999999);

    if (
      comb &&
      glyph.shapes.length <=
        getCurrentProject().projectSettings.maxCombineShapesOnExport
    ) {
      glyph.combineAllShapes(true);
    }

    if (glyph.isAutoWide) glyph.updateGlyphPosition(glyph.lsb, 0);

    const thisPath = glyph.makeOpenTypeJSPath(new OpenTypeJS.Path());

    const thisGlyph = new OpenTypeJS.Glyph({
      name: getUnicodeShortName('' + decToHex(num)),
      unicode: parseInt(num),
      index: parseInt(num),
      advanceWidth: round(glyph.getAdvanceWidth() || 1), // has to be non-zero
      xMin: round(maxes.xMin),
      xMax: round(maxes.xMax),
      yMin: round(maxes.yMin),
      yMax: round(maxes.yMax),
      path: thisPath,
    });

    // debug(thisGlyph);

    // Add this finished glyph
    options.glyphs.push(thisGlyph);

    // start the next one
    currentExportNumber++;

    if (currentExportNumber < exportArray.length) {
      currentExportGlyph = exportArray[currentExportNumber];
      setTimeout(generateOneGlyph, 10);
    } else {
      showToast('Finalizing...', 10);
      setTimeout(lastExportStep, 10);
    }

    // debug(' generateOneGlyph - END\n');
  }

  function lastExportStep() {
    // debug('\n lastExportStep - START');
    options.glyphs.sort(function (a, b) {
      return a.unicode - b.unicode;
    });

    // Create Font
    // debug('\t NEW options ARG TO FONT');
    // debug(options);
    const font = new OpenTypeJS.Font(options);

    // debug('\t Font object:');
    // debug(font.toTables());

    // Export
    // _UI.stopPageNavigation = false;
    font.download();
    // setTimeout(function () {
    //   _UI.stopPageNavigation = true;
    // }, 2000);
    // debug(' lastExportStep - END\n');
  }

  /*
    MAIN EXPORT LOOP
  */
  const options = {};
  const exportArray = [];
  let currentExportNumber = 0;
  let currentExportGlyph = {};

  firstExportStep();
  populateExportList();
  currentExportGlyph = exportArray[0];
  generateOneGlyph();

  // debug(' exportOTFFont - END\n');
}

function generateNotdefGlyph() {
  // debug(`\n generateNotdefGlyph - START`);
  const capHeight = getCurrentProject().projectSettings.capHeight;
  const notDefGlyphShapes =
    '[{"objtype":"shape","name":"Outer Phi Rectangle","path":{"objtype":"path","pathpoints":[{"objtype":"pathpoint","P":{"objtype":"coord","x":0,"y":700,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":432,"y":700,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":432,"y":0,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":0,"y":0,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false}],"winding":-4,"maxes":{"xmax":432,"xmin":0,"ymax":700,"ymin":0}},"visible":true,"xlock":false,"ylock":false,"wlock":false,"hlock":false,"ratiolock":false},{"objtype":"shape","name":"Inner Phi Rectangle","path":{"objtype":"path","pathpoints":[{"objtype":"pathpoint","P":{"objtype":"coord","x":50,"y":50,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":382,"y":50,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":382,"y":650,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false},{"objtype":"pathpoint","P":{"objtype":"coord","x":50,"y":650,"xlock":false,"ylock":false},"type":"corner","useh1":false,"useh2":false}],"winding":4,"maxes":{"xmax":382,"xmin":50,"ymax":650,"ymin":50}},"visible":true,"xlock":false,"ylock":false,"wlock":false,"hlock":false,"ratiolock":false}]';

  var notdef = new Glyph({
    name: 'notdef',
    shapes: JSON.parse(notDefGlyphShapes),
  });
  // debug(`\t capheight ${capHeight}`);
  // debug(`\t notdef.maxes.ymax ${notdef.maxes.ymax}`);

  if (capHeight !== 700) {
    var delta = capHeight - 700;
    // debug(`\t delta is ${delta}`);
    notdef.updateGlyphSize(false, delta, true);
    // debug(`\t notdef.maxes.height ${notdef.maxes.ymax}`);
  }

  notdef.updateGlyphPosition(notdef.getLSB(), 0, true);
  notdef.leftSideBearing = 0;

  // debug(` generateNotdefGlyph - END\n\n`);
  return notdef;
}
