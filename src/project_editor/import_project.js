import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { getGlyphrStudioApp } from '../app/main.js';
import { parseSemVer } from '../io/validate_file_input.js';
import { migrateGlyphrStudioProject } from './migrate_project.js';

/**
 * Takes a js Object from a JSON-based project file, and returns
 * a Glyphr Studio project object.
 * @param {Object} importedProject - Object from JSON project file data
 * @returns {GlyphrStudioProject}
 */
export function importGlyphrProjectFromText(importedProject) {
	log('importGlyphrProjectFromText', 'start');
	log('passed:');
	log(importedProject);

	const version = parseSemVer(importedProject.projectSettings.version);
	log('version found ' + importedProject.projectSettings.version);

	if (version.major === 1) {
		importedProject = migrateGlyphrStudioProject(importedProject);
	}

	// Update the version
	const app = getGlyphrStudioApp();
	importedProject.projectSettings.version = app.version;

	// Hydrate after all updates
	log('importGlyphrProjectFromText', 'end');
	return new GlyphrStudioProject(importedProject);
}
