import {
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from '../../app/main.js';
import { countItems } from '../../common/functions.js';
import { updateProgressIndicator } from '../../controls/progress-indicator/progress_indicator.js';
import { Glyph } from '../../project_data/glyph.js';
import { ProjectEditor } from '../../project_editor/project_editor.js';
import { ioSVG_convertSVGTagsToGlyph } from '../svg_outlines/svg_outline_import.js';
import { importGlyphs } from './tables/glyphs.js';
import { importKerns, loadOneKernTable } from './tables/gpos.js';
import { importLigatures } from './tables/gsub.js';
import { importTable_head } from './tables/head.js';
import { importTable_name } from './tables/name.js';
import { importTable_os2 } from './tables/os2.js';

/**
	IO > Import > OpenType
	Using OpenType.js to read in a font file
	and convert it to a Glyphr Studio Project.
**/
let importItemCounter = 0;
let importItemTotal = 0;

/**
 * Takes the import result from Opentype.js, reads the data, and
 * creates a new Glyphr Studio Project from it.
 * @param {Object} importedFont - result from Opentype.js import
 * @param {Boolean} testing - is this a vitest test
 * @returns nothing
 */
export async function ioFont_importFont(importedFont, testing = false) {
	log(importedFont);
	const editor = testing ? new ProjectEditor() : getProjectEditorImportTarget();
	const project = editor.project;

	// Reset module data
	importItemCounter = 0;
	importItemTotal = 0;

	// --------------------------------------------------------------
	// Set up import groups
	// --------------------------------------------------------------

	const fontGlyphs = importedFont.glyphs.glyphs || {};
	// log(`\nfontGlyphs:`);
	// log(fontGlyphs);
	const fontLigatures = importedFont.substitution.getLigatures('liga') || [];
	// log(`\nfontLigatures:`);
	// log(fontLigatures);
	const kernTables = importedFont.position.getKerningTables() || [];
	// log(`\n⮟kernTables⮟`);
	// log(kernTables);

	// --------------------------------------------------------------
	// Count items and set up progress indicator
	// --------------------------------------------------------------

	let kernPairCount = 0;
	const gposKernTables = [];
	kernTables.forEach((table) => {
		const tableData = loadOneKernTable(table);
		gposKernTables.push(...tableData.subtables);
		kernPairCount += tableData.kernPairCount;
	});
	importItemTotal = countItems(fontGlyphs) + fontLigatures.length + kernPairCount;

	// --------------------------------------------------------------
	// Import data
	// --------------------------------------------------------------

	// Characters
	project.glyphs = await importGlyphs(fontGlyphs, project);

	// Ligatures
	project.ligatures = await importLigatures(importedFont, fontLigatures);

	// Kern data
	project.kerning = await importKerns(importedFont, gposKernTables);

	// Metadata
	importTable_head(importedFont, project);
	importTable_name(importedFont, project);
	importTable_os2(importedFont, project);

	// --------------------------------------------------------------
	// Finish up
	// --------------------------------------------------------------

	// log(editor);
	if (testing) {
		return editor.project;
	} else {
		setCurrentProjectEditor(editor);
		editor.project.resetSessionStateForAllItems();

		editor.nav.page = 'Overview';
		const app = getGlyphrStudioApp();
		app.selectedProjectEditor = editor;
		app.selectedProjectEditor.navigate();
	}
}

/**
 * Converts one Opentype.js Glyph into a Glyphr Studio Glyph.
 * Used for characters and ligatures.
 * @param {Object} otfGlyph - Opentype.js Glyph object
 * @returns {Glyph}
 */
export function makeGlyphrStudioGlyphObject(otfGlyph) {
	// log(`makeGlyphrStudioGlyphObject`, 'start');
	// log(otfGlyph);
	const advance = otfGlyph.advanceWidth;
	// log(`advance: ${advance}`);

	// const newPaths = [];
	// let pathCounter = 0;
	// Import Path Data
	let data = otfGlyph.path.toSVG();
	// log('Glyph has .toSVG data');
	// log(data);

	let importedGlyph;

	if (data) {
		importedGlyph = ioSVG_convertSVGTagsToGlyph(`<svg>${data}</svg>`, false);
		// log(`importedGlyph`);
		// log(importedGlyph);
	} else {
		importedGlyph = new Glyph();
	}

	if (importedGlyph) {
		importedGlyph.advanceWidth = advance;
		importedGlyph.flipNS();
	}

	// log(`makeGlyphrStudioGlyphObject`, 'end');
	return importedGlyph;
}

// --------------------------------------------------------------
// Progress Indicator
// --------------------------------------------------------------

/**
 * Updates the progress indicator UI
 * @param {String} type - Character, Ligature, Kern Pair
 */
export async function updateFontImportProgressIndicator(type) {
	await updateProgressIndicator(`
			Importing ${type}:
			<span class="progress-indicator__counter">${importItemCounter}</span>
			 of
			<span class="progress-indicator__counter">${importItemTotal}</span>
		`);
}

export function updateImportItemTotal(delta = 0) {
	importItemTotal += delta;
}
