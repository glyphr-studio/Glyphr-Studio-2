import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';

/**
 * Finds metadata from the post table in a FontFlux font object,
 * and pulls appropriate data into a provided Glyphr Studio Project.
 * @param {Object} importedFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current Glyphr Studio Project
 */
export function importTable_post(importedFont, project) {
	const fontSettings = project.settings.font;
	const info = importedFont.info;
	fontSettings.italicAngle = info?.italicAngle || 0;

	// FontFlux exposes the post-table underline metrics on `info`. These are
	// surfaced to users in the font settings, so import them (and export them in
	// font_export.js) to keep them round-trippable.
	if (typeof info?.underlinePosition === 'number') {
		fontSettings.underlinePosition = info.underlinePosition;
	}
	if (typeof info?.underlineThickness === 'number') {
		fontSettings.underlineThickness = info.underlineThickness;
	}
}
