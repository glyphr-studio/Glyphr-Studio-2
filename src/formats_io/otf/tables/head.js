import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the head table in the opentype.js font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - opentype.js font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_head(importedFont, project) {
	const fontSettings = project.settings.font;
	fontSettings.upm = 1 * importedFont.unitsPerEm || fontSettings.upm;
	fontSettings.version =
		importedFont.tables.head.fontRevision || importedFont.version || 'Version 0.1';
}
