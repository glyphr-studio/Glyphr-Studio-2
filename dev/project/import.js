export { importGlyphrProjectFromText };
import GlyphrStudioProject from '../project/glyphr_studio_project.js';
// import { migrateGlyphrStudioProject } from './migrate.js';

// -------------------------------
// IMPORT FUNCTIONS
// -------------------------------

/**
 * Event handler for dropped project text files
 */
function importGlyphrProjectFromText() {
  // debug('\n importGlyphrProjectFromText - START');

  // -----------------------------
  // START IMPORT
  // -----------------------------

  let fileContent;
  try {
    fileContent = JSON.parse(window.GlyphrStudio.temp.droppedFileContent);
  } catch (e) {
    fileContent = {};
  }

  if (!fileContent.projectSettings || !fileContent.projectSettings.version) {
    errorNoVersionFound();
    return;
  }

  const projectVersion = parseVersionNum(fileContent.projectSettings.version);
  const currentAppVersion = parseVersionNum(window.GlyphrStudio.version);
  // debug("\t version found " + fileContent.projectSettings.version);

  // Check for future versions
  if (projectVersion.major > currentAppVersion.major) {
    errorTimeTraveller();
    return;
  }

  // Roll upgrades through V2
  if (projectVersion.major === 2) {
    // So far no updates among minor V2 versions
  }
  // debug(`\t done with v2 minor updates`);

  // Update the version
  fileContent.projectSettings.version = window.GlyphrStudio.version;
  fileContent.projectSettings.version = window.GlyphrStudio.version;

  // Hydrate after all updates
  // debug(' importGlyphrProjectFromText - END\n');
  return new GlyphrStudioProject(fileContent);
}

// -----------------------------
// HELPER FUNCTIONS
// -----------------------------

/**
 * Parse text version number to variables
 * @param {string} vn - version number
 * @returns {object}
 */
function parseVersionNum(vn) {
  vn = vn.split('.');
  return {
    major: vn[0] * 1,
    minor: vn[1] * 1,
    patch: vn[2] * 1,
  };
}

/**
 * Error if no version information is found
 */
function errorNoVersionFound() {
  const msg =
    'No version information was found.  Either the file is not a Glyphr Studio Project, or the file has non-valid JSON data.  Please try a different file...';
  console.warn(msg);
  alert(msg);
}

/**
 * Error if a version number is found that is later than
 * the current app version number (which should be the latest)
 */
function errorTimeTraveller() {
  const msg =
    'Your Glyphr Project was created with a later version of Glyphr Studio.  This version of Glyphr Studio cannot open project files created in the future O_o (whoa).  Please go to glyphrstudio.com to get the latest release.';
  console.warn(msg);
  alert(msg);
}
