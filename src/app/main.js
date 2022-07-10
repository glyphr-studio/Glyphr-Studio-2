import ProjectEditor from '../project/project_editor.js';
import GlyphrStudioApp from './glyphr_studio_app.js';
import { debug } from '../common/functions.js';
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
  console.log(`\n\n>>>>>>>>>>\nglyphrStudioOnLoad - Start`);

  if (passPreChecks()) {
    debug(`\t passPreChecks = true`);
    debug(`\t GSApp Object:`);
    console.log(GSApp);
    console.log(
      `\t %cApp Version ${GSApp.version} \n\n`,
      'color:rgb(0,170,225)'
    );
    GSApp.setUp();
  }
  debug(`glyphrStudioOnLoad - END\n<<<<<<<<<<<<\n\n\n`);
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
