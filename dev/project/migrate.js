
/**
 * Migrate Glyphr Studio Projects
 * Handling backwards compatibility for old Glyphr
 * Studio projects via rolling upgrades.
 *
 * !!! DANGER !!!
 * Because this file contains "old" variables that
 * have since been corrected, there are probably a
 * lot of "wrong" stuff here.  If someone is doing
 * global find/replace-s, please exclude this file.
 * ESLint may also have a lot of problems with this
 * file, I'll try to include all the applicable
 * disables.
 */

/**
 * Check a project save file content, and do neccessary
 * data structure updates if it happens to be saved from
 * a previous version of Glyphr Studio
 * @param {string} project - project object data
 * @returns {object} - Glyphr Studio v2 Project strucutre
 */
export function migrateGlyphrStudioProject(project = {}) {
  // debug('\n upgradeGlyphrStudioProject - START');

  const noVersionFound = 'No version information was found.  Either the file is not a Glyphr Studio Project, or the file has non-valid JSON data.  Please try a different file...';
  const timeTraveller = 'Your Glyphr Project was created with a later version of Glyphr Studio.  This version of Glyphr Studio cannot open project files created in the future O_o (whoa).  Please go to glyphrstudio.com to get the latest release.';
  const betasNotSupported = 'Your Glyphr Project was created with a very early Beta version, and the project file is not supported in v2.  Glyphr Studio v1 *can* read this file, so open it in v1, save a new v1 project file, then open it in v2.';

  let semanticVersion = false;
  if (project.projectSettings && project.projectSettings.versionNumber) {
    // Glyphr Studio V2
    semanticVersion = project.projectSettings.versionNumber;
  } else if (project.projectsettings && project.projectsettings.versionnum) {
    // Glyphr Studio V1
    semanticVersion = project.projectsettings.versionnum;
  } else {
    return noVersionFound;
  }

  /**
     * Parse a semantic version string to an object
     * @param {sting} vn - version string to parse
     * @returns {object}
     */
  function parseVersionNum(vn) {
    vn = vn.split('.');
    return {
      'major': (vn[0]*1),
      'minor': (vn[1]*1),
      'patch': (vn[2]*1),
    };
  }

  semanticVersion = parseVersionNum(semanticVersion);
  const appVersion = parseVersionNum(window.GlyphrStudio.versionNumber);

  // Check for future versions
  if (semanticVersion.major > appVersion.major) {
    return timeTraveller;
  }

  // Message v0 Betas not supported
  if (semanticVersion.major === 0) {
    return betasNotSupported;
    return;
  }

  // Roll upgrades through v1 then to V2
  if (semanticVersion.major === 1) {
    if (minor < 10) {
      project.projectsettings.glyphrange.latinSupplement = project.projectsettings.glyphrange.latinsuppliment;
      delete project.projectsettings.glyphrange.latinsuppliment;
    }
    semanticVersion.major = 1;
    semanticVersion.minor = 99;

    project = migrateV1toV2(project);
  }
  // debug('\t done with v1 minor updates');

  return project;
  // debug(' upgradeGlyphrStudioProject - END\n');
}


/**
 * Migrate V1 to V2
 * This is mostly camelCaseIng project variables
 * @param {GlyphrStudioProject} project
 * @param {number} minor - minor version
 * @returns {GlyphrStudioProject}
 */
function migrateV1toV2(project) {
  // CamelCase the project variables
  return project;
}
