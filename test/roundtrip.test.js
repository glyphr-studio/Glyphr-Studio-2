import { FontFlux } from 'font-flux-js';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { setCurrentProjectEditor } from '../src/app/main.js';
import { ioFont_exportFont } from '../src/formats_io/otf/font_export.js';
import { ioFont_importFont } from '../src/formats_io/otf/font_import.js';
import { ProjectEditor } from '../src/project_editor/project_editor.js';

/**
 * Round trip test: Import → Export → Import
 * Verifies that a font survives the import/export cycle without data loss
 */

/**
 * Recursively removes metadata fields that are expected to change between import/export cycles
 * Also excludes fields that contain circular references
 * @param {Object} obj - Object to clean
 * @param {Set} seen - Set to track visited objects
 * @returns {Object} - Cleaned object
 */
function removeMetadataFields(obj, seen = new Set()) {
	if (obj === null || typeof obj !== 'object') return obj;

	// Handle circular references
	if (seen.has(obj)) return undefined;
	seen.add(obj);

	if (Array.isArray(obj)) {
		try {
			return obj.map(item => removeMetadataFields(item, seen));
		} catch {
			return undefined;
		}
	}

	const cleaned = {};
	const fieldsToSkip = new Set([
		'latestVersion',
		'initialVersion',
		'sessionState',
		'sessionID',
		'selectedItemID',
		'selectedItemIDs',
		'loadedFileHandle',
		'editMode',
		'navigationHistory',
		'editCanvasOptions',
		'multiSelectPoints',
		'multiSelectShapes',
		'textToCopy',
		'copiedItem',
		'eventPublisher',
		'eventSubscribers',
		'parent', // Skip parent references to avoid circular refs
		'editor',
		'project',
	]);

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key) && !fieldsToSkip.has(key)) {
			try {
				const value = obj[key];
				// Skip functions and undefined values
				if (typeof value !== 'function' && value !== undefined) {
					cleaned[key] = removeMetadataFields(value, seen);
				}
			} catch {
				// Skip fields that cause errors
			}
		}
	}

	seen.delete(obj);
	return cleaned;
}

/**
 * Compares two project objects for data equality
 * Ignores timestamp, UI state, and circular reference fields
 * @param {Object} proj1 - First project
 * @param {Object} proj2 - Second project
 * @returns {Object} - { match: boolean, differences: string[] }
 */
function compareProjects(proj1, proj2) {
	try {
		const cleaned1 = removeMetadataFields(proj1);
		const cleaned2 = removeMetadataFields(proj2);

		const json1 = JSON.stringify(cleaned1, null, 2);
		const json2 = JSON.stringify(cleaned2, null, 2);

		const match = json1 === json2;

		if (!match) {
			const lines1 = json1.split('\n');
			const lines2 = json2.split('\n');
			const differences = [];

			for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
				if (lines1[i] !== lines2[i]) {
					differences.push(`Line ${i + 1}:`);
					differences.push(`  First:  ${lines1[i] || '(missing)'}`);
					differences.push(`  Second: ${lines2[i] || '(missing)'}`);
				}
			}

			return {
				match: false,
				differences: differences.slice(0, 50), // Limit to first 50 differences
			};
		}

		return { match: true, differences: [] };
	} catch (error) {
		return {
			match: false,
			differences: [`Error during comparison: ${error.message}`],
		};
	}
}

describe('Font Round Trip Tests', () => {
	it('Round trip: Oblegg font - import → export → import', async () => {
		// Step 1: Load binary font file
		const fontFileName = 'ObleggExtendedTestRegular.otf';
		const fontPath = path.resolve(
			__dirname,
			'../src/formats_io/otf/tests',
			fontFileName
		);
		expect(fs.existsSync(fontPath), `Font file not found: ${fontPath}`).toBe(true);

		const fontBuffer = fs.readFileSync(fontPath);
		const arrayBuffer1 = new Uint8Array(fontBuffer).buffer;

		// Step 2: Import font (first time)
		const loadResult1 = FontFlux.open(arrayBuffer1);
		const project1 = await ioFont_importFont(loadResult1, true);
		expect(project1).toBeTruthy();
		expect(Object.keys(project1.glyphs).length).toBeGreaterThan(0);

		// Step 3: Set up a project editor with the imported project and export
		const editor = new ProjectEditor({ project: project1 });
		setCurrentProjectEditor(editor);

		// Step 4: Export the project to binary font
		const exportedBuffer = await ioFont_exportFont(true);
		expect(exportedBuffer).toBeTruthy();
		expect(exportedBuffer instanceof ArrayBuffer).toBe(true);

		// Step 5: Import the exported font (second time)
		const loadResult2 = FontFlux.open(exportedBuffer);
		const project2 = await ioFont_importFont(loadResult2, true);
		expect(project2).toBeTruthy();

		// Step 6: Compare the two projects
		const comparison = compareProjects(project1, project2);

		if (!comparison.match) {
			console.log('\n=== Project Differences ===');
			comparison.differences.forEach(diff => console.log(diff));

		// Additional diagnostic information
		console.log('\n=== Diagnostic Info ===');
		console.log(`Glyphs in project1: ${Object.keys(project1.glyphs).length}`);
		console.log(`Glyphs in project2: ${Object.keys(project2.glyphs).length}`);
		console.log(`Kerning in project1: ${Object.keys(project1.kerning).length}`);
		console.log(`Kerning in project2: ${Object.keys(project2.kerning).length}`);
	}

	expect(comparison.match, 'Projects should match after round trip').toBe(true);

	// Additional specific checks
	expect(Object.keys(project2.glyphs).length).toEqual(Object.keys(project1.glyphs).length);
	expect(Object.keys(project2.kerning).length).toEqual(Object.keys(project1.kerning).length);
	expect(project2.settings.font.family).toEqual(project1.settings.font.family);
});
});
