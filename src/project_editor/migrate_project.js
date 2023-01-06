import { getGlyphrStudioApp } from '../app/main.js';
import { parseSemVer } from '../io/validate_file_input.js';

/**
 * Starting with Glyphr Studio Project file version 1.13.2,
 * roll through updates to translate any old project file structure
 * to current project file structure.
 * Hopefully this is minimal.
 * @param {string} project - Old project object data
 * @returns {object} - Latest Glyphr Studio v2 Project structure
 */
export function migrateGlyphrStudioProject(project) {
	// log('migrateGlyphrStudioProject', 'start');

	const version = parseSemVer(project.metadata.latestVersion);
	const appVersion = parseSemVer(getGlyphrStudioApp().version);

	// versions 1.13.1 and below are not supported
	// versions 1.13.2 and above are supported

	return project;
	// log('migrateGlyphrStudioProject', 'end');
}