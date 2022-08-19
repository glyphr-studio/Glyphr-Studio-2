import { makeElement } from '../common/dom.js';
import { log } from '../common/functions.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../app/nav.js';
import { showNavDropdown } from '../app/nav.js';
import { lookUpGlyphName } from '../lib/unicode_names.js';
import { hexToChars } from '../common/unicode.js';
import { makePanel } from '../panels/panels.js';
import { makeEditToolsButtons } from '../controls/canvas-edit/tools.js';

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
    let editor = getCurrentProjectEditor();
    log('current ProjectEditor');
    log(editor);
    log(editor.selectedGlyph);

    let canvasGlyph = hexToChars(editor.selectedGlyphID);
    const content = makeElement({
      tag: 'div',
      id: 'app__page',
      innerHTML: `
      <div class="glyph-edit__page">
        <div class="glyph-edit__left-area">
          <div class="glyph-edit__nav-area">
            ${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Glyph edit'})}
            ${makeNavButton({level: 'l2', superTitle: 'EDITING', title: lookUpGlyphName(editor.selectedGlyphID, true)})}
            ${makeNavButton({level: 'l3', superTitle: 'PANEL', title: editor.nav.panel})}
          </div>
          <div class="left-area__panel"></div>
        </div>
        <div class="glyph-edit__tools-area">t<br>o<br>o<br>l<br>s</div>
        <div class="glyph-edit__right-area">
          <canvas-edit id="glyph-edit__main-canvas" glyphs="${canvasGlyph}" onclick="closeAllDialogs();"></canvas-edit>
        </div>
      </div>
    `,
    });

    // Panel
    content.querySelector('.left-area__panel').appendChild(makePanel());

    // Page Selector
    let l1 = content.querySelector('#nav-button-l1');
    l1.addEventListener('click', function(){ showNavDropdown(l1); });

    // Glyph Selector
    let l2 = content.querySelector('#nav-button-l2');
    l2.addEventListener('click', function(){ showNavDropdown(l2); });
    editor.subscribe({
      topic: 'selectedGlyphID',
      subscriberName: 'EDITING nav button',
      callback: (newGlyphID) => {
        l2.innerHTML = makeNavButtonContent(lookUpGlyphName(newGlyphID, true), 'EDITING');
      }
    });

    // Panel Selector
    let l3 = content.querySelector('#nav-button-l3');
    l3.addEventListener('click', function(){ showNavDropdown(l3); });

    // Tools
    let toolsArea = content.querySelector('.glyph-edit__tools-area');
    toolsArea.appendChild(makeEditToolsButtons());

    // Canvas
    editor.subscribe({
      topic: 'selectedGlyphID',
      subscriberName: 'Main edit canvas',
      callback: (newGlyphID) => {
        log(`Main Canvas subscriber callback`, 'start');
        let newChar = hexToChars(newGlyphID);
        log(`new id ${newGlyphID} results in ${newChar} on the main canvas`);
        content.querySelector('#glyph-edit__main-canvas').setAttribute('glyphs', newChar);
        log(`Main Canvas subscriber callback`, 'end');
      }
    });

    const callback = function () {};

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
