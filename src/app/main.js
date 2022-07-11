import ProjectEditor from '../project/project_editor.js';
import GlyphrStudioApp from './glyphr_studio_app.js';
import { log } from '../common/functions.js';

/* Web Components */
import AnchorTwelvepoint from '../controls/anchor-twelvepoint/anchor-twelvepoint.js';
import ButtonToggle from '../controls/button-toggle/button-toggle.js';
import CanvasDisplay from '../controls/canvas-display/canvas-display.js';
import CanvasEdit from '../controls/canvas-edit/canvas-edit.js';
import FancyButton from '../controls/fancy-button/fancy-button.js';
import InfoBubble from '../controls/info-bubble/info-bubble.js';
import InputNumber from '../controls/input-number/input-number.js';
import InputNumberLockable from '../controls/input-number-lockable/input-number-lockable.js';
import PanelArea from '../controls/panel-area/panel-area.js';

/** export nothing by default */
export default function () {}
export {
  getGlyphrStudioApp,
  getCurrentProjectEditor,
  getCurrentProject,
  glyphrStudioOnLoad,
};

/** Here is the main app object */
const GSApp = new GlyphrStudioApp();

/**
 * First function to run when the browser starts
 */
function glyphrStudioOnLoad() {
  log(`glyphrStudioOnLoad`, 'start');

  if (passPreChecks()) {
    log(`passPreChecks = true`);
    log(`GSApp Object:`);
    log(GSApp);
    console.log(`%cApp Version ${GSApp.version} \n\n`, 'color:rgb(0,170,225)');
    registerCustomComponents();
    GSApp.setUp();
  }
  log(`glyphrStudioOnLoad`, 'end');
}

/**
 * Does some checking against new-ish HTML/JavaScript features
 * @returns {boolean}
 */
function passPreChecks() {
  let pass = true;
  // Templates
  const template = document.createElement('template');
  if (!template.content) {
    console.error('Browser does not support HTML Templates');
    pass = false;
  }
  return pass;
}

/**
 * Registers all the custom Web Components to the current document
 */
function registerCustomComponents() {
  customElements.define('anchor-twelvepoint', AnchorTwelvepoint);
  customElements.define('button-toggle', ButtonToggle);
  customElements.define('canvas-display', CanvasDisplay);
  customElements.define('canvas-edit', CanvasEdit);
  customElements.define('fancy-button', FancyButton);
  customElements.define('info-bubble', InfoBubble);
  customElements.define('input-number', InputNumber);
  customElements.define('input-number-lockable', InputNumberLockable);
  customElements.define('panel-area', PanelArea);
}

/**
 * Returns the overall App object
 * @returns {GlyphrStudioApp}
 */
function getGlyphrStudioApp() {
  return GSApp;
}

/**
 * Returns the project that is currently being edited
 * @returns {GlyphrStudioProject}
 */
function getCurrentProject() {
  return getGlyphrStudioApp().getCurrentProjectEditor().project;
}

/**
 * Returns the current Project Editor
 * @returns {ProjectEditor}
 */
function getCurrentProjectEditor() {
  const gs = getGlyphrStudioApp();
  if (!gs.projectEditors[gs.selectedProjectEditor]) {
    gs.projectEditors[gs.selectedProjectEditor] = new ProjectEditor();
  }
  return gs.projectEditors[gs.selectedProjectEditor];
}
