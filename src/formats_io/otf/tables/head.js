import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the head table in a FontFlux font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_head(importedFont, project) {
	const fontSettings = project.settings.font;
	const info = importedFont.info;
	if (!info) return;

	fontSettings.upm = 1 * info.unitsPerEm || fontSettings.upm;
	fontSettings.version = info.version || 'Version 0.1';
}
