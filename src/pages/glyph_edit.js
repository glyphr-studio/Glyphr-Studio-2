import { makeElement } from '../controls/controls.js';
import { debug } from '../common/functions.js';

/**
 * Page > Glyph Edit
 * The main edit surface for Glyphr Studio
 * Comprised of Panels of tools, and the Edit Canvas
 */
export default class PageGlyphEdit {
  /**
   * Initialize this page
   */
  constructor() {}

  /**
   * Load the Open Project page
   * @returns {object} HTML Element + callback function
   */
  pageLoader() {
    debug(`\n PageGlyphEdit.pageLoader - START`);

    const content = makeElement({
      tag: 'div',
      id: 'app__page',
      innerHTML: `
      <div class="glyph-edit__page">
        <div class="glyph-edit__left-area">
          <fancy-button>Glyphr Studio</fancy-button>
          <panel-area panel="attributes"></panel-area>
        </div>
        <div class="glyph-edit__right-area">
          <canvas-display glyphs="A"></canvas-display>
        </div>
      </div>
    `,
    });

    const callback = function () {
      // let can = document.querySelector('canvas-display');
      // if (can) can.redraw();
      debug(` PageGlyphEdit.pageLoader.callback - END\n\n`);
    };

    debug(` PageGlyphEdit.pageLoader - END\n\n`);

    return { content: content, callback: callback };
  }
}

/* cSpell:disable */
/*

// -------------------
// Redraw
// -------------------
  function redraw_GlyphEdit() {
    // debug('\n redraw_GlyphEdit - START');
    _UI.redrawing = true;

    let sg = getSelectedWorkItem();
    let editmode = getEditMode();

    // if (sg) sg.calcMaxes();
    // debug('\t Selected WI ' + sg.name);

    // draw grids
    drawGrid();
    drawGuides();

    // load glyph info
    if (sg && sg.shapes.length) {
      let v = getView('Redraw');
      if (sg.contextGlyphs) drawContextGlyphs();
      sg.drawGlyph(_UI.glyphEditCTX, v);
    } else {
      _UI.redrawing = false;
      return;
    }

    _UI.multiSelect.shapes.draw_PathOutline();

    if (editmode === 'arrow') {
      _UI.multiSelect.shapes.draw_BoundingBox();
      _UI.multiSelect.shapes.draw_BoundingBoxHandles();
    } else if (editmode === 'rotate') {
      _UI.multiSelect.shapes.draw_RotationAffordance();
    } else if (editmode === 'pen') {
      if (_UI.eventhandlers.multi) sg.drawMultiSelectAffordances(_UI.colors.blue);
      _UI.multiSelect.points.draw_PathPointHandles();
      _UI.multiSelect.shapes.draw_PathPoints();
      // _UI.multiSelect.points.draw_PathPoints();

      if (_UI.eventhandlers.hoverpoint) {
        let hp = _UI.eventhandlers.hoverpoint;
        _UI.glyphEditCTX.fillStyle = hp.fill;
        _UI.glyphEditCTX.fillRect(hp.x, hp.y, hp.size, hp.size);
      }
    } else if (editmode === 'newpath') {
      _UI.multiSelect.points.draw_PathPointHandles();
      _UI.multiSelect.shapes.draw_PathPoints();
      // _UI.multiSelect.points.draw_PathPoints();
    }

    _UI.redrawing = false;
    // debug(' redraw_GlyphEdit - END\n');
  }
*/
