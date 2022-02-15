import manifest from '../manifest.js';
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
  console.log(`glyphrStudioOnLoad - Start`);
  console.log(
    '%c\n       GG              GG\n       G               G\n GGGG  G GG   G  GGGG  GGGGG   GGGGG\nG    G G G    G G    G G    G G     G\nG    G G G    G G    G G    G G\n GGGGG G  GGGGG GGGGG  GG   G GG\nGG   G   GG   G G             STUDIO\n GGGG     GGGG  GG\n\n',
    'color:rgb(0,170,225)'
  );
  if (passPreChecks()) {
    assemble();
    console.log(GSApp);
    console.log(`%cApp Version ${GSApp.version} \n\n`, 'color:rgb(0,170,225)');
    GSApp.setUp();
  }
  debug(`glyphrStudioOnLoad - END`);
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
 * Assemble adds .js and .css file references to the current HTML doc
 * @param {boolean} loadTests - optionally load test files
 * @param {function} callback - function to run after assembly
 *  manifest.js is found in the root of the dev directory
 */
function assemble(loadTests = false, callback = false) {
  const tests = [];
  let newElement;
  const nonModules = 'opentypejs';
  // console.log(manifest);
  manifest.forEach((directory) => {
    directory.files.forEach((file) => {
      const suffix = file.split('.')[1];
      // console.log(`loading file ${file} with suffix ${suffix}`);
      if (suffix === 'js' || suffix === 'map') {
        newElement = document.createElement('script');
        newElement.setAttribute('src', `${directory.path}/${file}`);
        if (file.indexOf(nonModules) === -1)
          newElement.setAttribute('type', 'module');
        document.getElementsByTagName('head')[0].appendChild(newElement);
      } else if (suffix === 'css') {
        if (!loadTests) {
          newElement = document.createElement('link');
          newElement.setAttribute('rel', 'stylesheet');
          newElement.setAttribute('type', 'text/css');
          newElement.setAttribute('href', `${directory.path}/${file}`);
          document.getElementsByTagName('head')[0].appendChild(newElement);
        }
      } else if (suffix === 'test') {
        if (loadTests) {
          tests.push(`${directory.path}/${file}`);
        }
      } else {
        console.warn(`Assemble - unhandled file type ${suffix}`);
      }
      // console.log(`\t added ${file}`);
    });
  });
  if (loadTests) {
    tests.forEach((element) => {
      newElement = document.createElement('script');
      newElement.setAttribute('src', element);
      newElement.setAttribute('type', 'module');
      document.getElementsByTagName('head')[0].appendChild(newElement);
      // console.log(`\t added test ${element}`);
    });
    // dev_mode_includes.js adds Glyph Element classes to the window._DEV object
    newElement = document.createElement('script');
    newElement.setAttribute('src', `app/dev_mode_includes.js`);
    newElement.setAttribute('type', 'module');
    document.getElementsByTagName('head')[0].appendChild(newElement);
  }
  if (callback) window.setTimeout(callback, 500);
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
