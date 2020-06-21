import { clone } from '../common/functions.js';

/**
    History
    An object that stores a Glyphr Studio Project
    state, to enable undo.  History is saved per
    page... essentially, each page gets it's own
    undo queue.
**/
export default class History {
  /**
   * Create a new History
   * @param {string} parentName - glyphs / ligatures / components / kerning
   * @param {ProjectEditor} editor - parent to this history
   */
  constructor(parentName, editor) {
    this.queue = [];
    this.editor = editor;
    this.parentName = parentName;
    this.currentState = clone(this.editor.project[this.parentName]);
    this.initialState = clone(this.editor.project[this.parentName]);
    this.initialDate = new Date().getTime();
  }

  /**
   * Put a change into the Undo Queue
   * @param {string} des - description for this change
   */
  put(des) {
    // debug('\n History.put - START');
    let currentID = this.editor.getSelectedWorkItemID()[this.parentName];

    this.queue.push({
      name: this.editor.getWorkItemName(currentID),
      id: currentID,
      description: des,
      date: new Date().getTime(),
      state: clone(this.currentState),
    });
    this.currentState = clone(this.editor.project[this.parentName]);
    this.editor.setProjectAsUnsaved();
    this.editor.markSelectedWorkItemAsChanged();
    // debug(' History.put - END\n');
  }

  /**
   * Pull a change from the Undo Queue
   */
  pull() {
    // debug('\n History.pull - START');
    // debug('\t queue.length ' + this.queue.length);
    let currentID = getSelectedWorkItemID();
    let nextID = this.queue[this.queue.length - 1].id;
    if (currentID === nextID) {
      let top = this.queue.length ? this.queue.pop().state : this.initialState;
      if (this.parentName === 'kerning') {
        hydrateGlyphrObjectList(
          HKern,
          clone(top),
          this.editor.project[kerning]
        );
      } else {
        hydrateGlyphrObjectList(
          Glyph,
          clone(top),
          this.editor.project[this.parentName]
        );
      }
      this.currentState = clone(top);
    } else {
      // If the next undo item is a different glyph,
      // navigate to that glyph before undo-ing
      showToast('Navigated without undo-ing');
      selectGlyph(nextID);
    }
    if (this.editor.nav.page === 'import svg') {
      update_NavPanels();
    } else if (this.editor.nav.page === 'components') {
      if (!this.editor.project.components[_UI.selectedComponent]) {
        _UI.selectedComponent = getFirstID(this.editor.project.components);
      }
    } else if (this.editor.nav.page === 'ligatures') {
      if (!this.editor.project.ligatures[_UI.selectedLigature]) {
        _UI.selectedLigature = getFirstID(this.editor.project.ligatures);
      }
    }
    _UI.multiSelect.shapes.clear();
    _UI.multiSelect.points.clear();
    // update_NavPanels();
    redraw({ calledBy: 'historyPull', redrawPanels: true });
    // debug('\t after redraw');
    let empty = true;
    for (let q in this.editor.history) {
      if (
        this.editor.history.hasOwnProperty(q) &&
        this.editor.history[q].queue.length
      ) {
        empty = false;
        break;
      }
    }
    if (empty) setProjectAsSaved();
    // debug(' History.pull - END\n');
  }
}
