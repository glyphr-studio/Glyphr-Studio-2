import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the post table in the opentype.js font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - opentype.js font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_post(importedFont, project) {
	const fontSettings = project.settings.font;
	fontSettings.italicAngle = importedFont.tables?.post?.italicAngle || 0;

	// These are not part of the Options argument
	// fontSettings.underlinePosition = importedFont.tables?.post?.underlinePosition || 0;
	// fontSettings.underlineThickness = importedFont.tables?.post?.underlineThickness || 0;
}
