import { makeElement, addEventHandler } from '../common/dom.js';
import { log } from '../common/functions.js';
import makePanel_GlyphAttributes from '../panels/attributes_glyph.js';
import { getCurrentProjectEditor, addGlobalEventListener } from '../app/main.js';
import { makeNavButton } from '../app/nav.js';
import { showNavDropdown } from '../app/nav.js';

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
    log(`PageGlyphEdit.pageLoader`, 'start');
    log('current ProjectEditor');
    log(getCurrentProjectEditor());
    let selectedGlyph = getCurrentProjectEditor().selectedGlyph;
    log('selected glyph');
    log(selectedGlyph);

    const content = makeElement({
      tag: 'div',
      id: 'app__page',
      innerHTML: `
      <div class="glyph-edit__page">
        <div class="glyph-edit__left-area">
          <div class="glyph-edit__nav-area">
            ${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Glyph edit'})}
            ${makeNavButton({level: 'l2', superTitle: 'EDITING', title: selectedGlyph.name})}
            ${makeNavButton({level: 'l3', superTitle: 'PANEL', title: 'Attributes'})}
          </div>
          <div id="glyph-edit__panel">
            ${makePanel_GlyphAttributes()}
          </div>
        </div>
        <div class="glyph-edit__tools-area">t<br>o<br>o<br>l<br>s</div>
        <div class="glyph-edit__right-area">
          <canvas-display glyphs="B"></canvas-display>
        </div>
      </div>
    `,
    });

    const callback = function () {
      addGlobalEventListener('showNavDropdown', showNavDropdown);
      let l1 = document.getElementById('nav-button-l1');
      l1.addEventListener('click', showNavDropdown);

      let l2 = document.getElementById('nav-button-l2');
      l2.addEventListener('click', showNavDropdown);

      let l3 = document.getElementById('nav-button-l3');
      l3.addEventListener('click', showNavDropdown);

    };

    log(`PageGlyphEdit.pageLoader`, 'end');

    return { content: content, callback: callback };
  }
}

/* cSpell:disable */
/*

// -------------------
// Redraw
// -------------------
  function redraw_GlyphEdit() {
    // log('redraw_GlyphEdit', 'start');
    _UI.redrawing = true;

    let sg = getSelectedWorkItem();
    let editmode = getEditMode();

    // if (sg) sg.calcMaxes();
    // log('Selected WI ' + sg.name);

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
    // log('redraw_GlyphEdit', 'end');
  }
*/
