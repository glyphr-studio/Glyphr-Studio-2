export { importGlyphrProjectFromText };
import GlyphrStudioProject from './glyphr_studio_project.js';
import { getGlyphrStudioApp } from '../app/main.js';
import { log } from '../common/functions.js';
// import { migrateGlyphrStudioProject } from './migrate.js';

// --------------------------------------------------------------------------
// IMPORT FUNCTIONS
// --------------------------------------------------------------------------

/**
 * Event handler for dropped project text files
 */
function importGlyphrProjectFromText(textProject) {
	log('importGlyphrProjectFromText', 'start');
	// log('passed:');
	// log(textProject);

	let app = getGlyphrStudioApp();
	let fileContent;
	try {
		fileContent = JSON.parse(textProject);
	} catch (e) {
		fileContent = {};
	}

	log('file content is: ');
	log(fileContent);

	if (!fileContent.projectSettings || !fileContent.projectSettings.version) {
		errorNoVersionFound();
		return;
	}

	const projectVersion = parseVersionNum(fileContent.projectSettings.version);
	const currentAppVersion = parseVersionNum(app.version);
	log('version found ' + fileContent.projectSettings.version);

	// Check for future versions
	if (projectVersion.major > currentAppVersion.major) {
		errorTimeTraveller();
		return;
	}

	// Roll upgrades through V2
	if (projectVersion.major === 2) {
		// So far no updates among minor V2 versions
	}
	log('done with v2 minor updates');

	// Update the version
	fileContent.projectSettings.version = app.version;
	fileContent.projectSettings.version = app.version;

	// Hydrate after all updates
	log('importGlyphrProjectFromText', 'end');
	return new GlyphrStudioProject(fileContent);
}

// ------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------

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
	// alert(msg);
}

/**
 * Error if a version number is found that is later than
 * the current app version number (which should be the latest)
 */
function errorTimeTraveller() {
	const msg =
		'Your Glyphr Project was created with a later version of Glyphr Studio.  This version of Glyphr Studio cannot open project files created in the future O_o (whoa).  Please go to glyphrstudio.com to get the latest release.';
	console.warn(msg);
	// alert(msg);
}
