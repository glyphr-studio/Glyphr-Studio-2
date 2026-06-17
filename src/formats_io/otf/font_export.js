import { FontFlux, initWoff2 } from 'font-flux-js';
import { getCurrentProject } from '../../app/main.js';
import { decToHex, parseCharsInputAsHex } from '../../common/character_ids.js';
import { isUIUpdateDue, pause, resetUIUpdateThrottle, round } from '../../common/functions.js';
import { closeAllToasts, showError, showToast } from '../../controls/dialogs/dialogs.js';
import { Glyph } from '../../project_data/glyph.js';
import { sortLigatures } from '../../project_data/glyphr_studio_project.js';
import { Path } from '../../project_data/path.js';
import { makeGlyphWithResolvedLinks } from '../../project_editor/cross_item_actions.js';
import { saveFile } from '../../project_editor/file_io.js';
import { writeGposKernDataToFont } from './tables/gpos.js';

/**
	IO > Export > Font
	Using FontFlux and path-conversion helpers to export a Glyphr Studio
	project into OpenType format for saving.
**/

let ligatureSubstitutions = [];
let codePointGlyphIndexTable = {};

/**
 * Exports the current project to an .otf file
 */
export async function ioFont_exportOTF() {
	await ioFont_exportFont('otf', false);
}

/**
 * Exports the current project to a .ttf file
 */
export async function ioFont_exportTTF() {
	await ioFont_exportFont('ttf', false);
}

/**
 * Exports the current project to a .woff file
 */
export async function ioFont_exportWOFF() {
	await ioFont_exportFont('woff', false);
}

/**
 * Exports the current project to a .woff2 file
 */
export async function ioFont_exportWOFF2() {
	await ioFont_exportFont('woff2', false);
}

/**
 * Valid font export formats, used to validate the project's saved
 * preferred export format before falling back to OTF.
 */
const validExportFormats = ['otf', 'ttf', 'woff', 'woff2'];

/**
 * Reads the project's preferred export format (the format that was originally
 * imported, or 'otf' for new projects). Always returns a known-good value.
 * @returns {String} - one of 'otf', 'ttf', 'woff', 'woff2'
 */
export function getPreferredExportFormat() {
	const format = getCurrentProject()?.settings?.project?.exportFormat;
	return validExportFormats.includes(format) ? format : 'otf';
}

/**
 * Exports the current project using its preferred format (the format that was
 * originally imported, defaulting to OTF for new projects). Backs the Ctrl+E
 * keyboard shortcut and the primary File menu export entry.
 */
export async function ioFont_exportDefaultFormat() {
	await ioFont_exportFont(getPreferredExportFormat(), false);
}

/**
 * Exports the current project
 * @param {String} suffix - file extension suffix (e.g. 'otf' or 'ttf')
 * @param {Boolean} testing - if true, returns ArrayBuffer instead of saving to file
 * @returns {Promise<ArrayBuffer|void>} - ArrayBuffer if testing, otherwise void
 */
export async function ioFont_exportFont(suffix = 'otf', testing = false) {
	// log('ioFont_exportFont', 'start');
	const options = createOptionsObject();
	const exportLists = populateExportList();
	const project = getCurrentProject();
	ligatureSubstitutions = [];
	codePointGlyphIndexTable = {};
	currentIndex = 0;
	resetUIUpdateThrottle();

	// When enabled, glyphs built entirely from pure-translation component
	// instances are exported as TrueType composite glyphs (preserving the
	// component structure for round-trip fidelity) instead of being flattened
	// to outlines. Composites can only be stored in TrueType-flavored formats
	// (.ttf/.woff/.woff2); OpenType/CFF (.otf) has no composite mechanism, so
	// the setting is ignored there and components are always flattened.
	const isTrueTypeFlavor = suffix === 'ttf' || suffix === 'woff' || suffix === 'woff2';
	const exportComposites =
		isTrueTypeFlavor && !!project?.settings?.project?.exportComponentsAsComposites;

	// Names of every character that will be exported, so a composite's component
	// reference can tell whether its linked character is already present in the
	// font (otherwise it gets added as an unencoded building-block glyph).
	const plannedCharacterNames = new Set();
	for (let g = 0; g < exportLists.glyphs.length; g++) {
		plannedCharacterNames.add(getUniqueGlyphName(parseInt(exportLists.glyphs[g].xc)));
	}

	// Flattened building-block glyphs (components / off-list characters) that
	// composite glyphs reference and therefore must also exist in the font.
	const buildingBlocks = new Map();
	const compositeContext = {
		exportComposites,
		project,
		buildingBlocks,
		plannedCharacterNames,
		testing,
	};

	// Add .notdef
	addNotdefToExport(options, compositeContext);

	// Add Characters
	let exportedItem;
	for (let g = 0; g < exportLists.glyphs.length; g++) {
		exportedItem = await generateOneGlyph(exportLists.glyphs[g], compositeContext);
		options.glyphs.push(exportedItem);
	}
	// log(`\n⮟codePointGlyphIndexTable⮟`);
	// log(codePointGlyphIndexTable);

	// Add Ligatures
	let exportLigatures = project.settings.app.exportLigatures;
	// log(`exportLigatures: ${exportLigatures}`);
	if (exportLigatures) {
		for (let l = 0; l < exportLists.ligatures.length; l++) {
			exportedItem = await generateOneLigature(exportLists.ligatures[l], compositeContext);
			options.glyphs.push(exportedItem);
		}
	}

	if (!testing) {
		showToast('Exporting...');
		await pause(0);
	}

	// Add building-block glyphs referenced by any composite glyphs. These are
	// always flattened (and mostly unencoded) so the composites have concrete
	// outlines to reference by name.
	buildingBlocks.forEach((glyphObject) => {
		options.glyphs.push(glyphObject);
	});
	if (!testing) showToast('Finalizing...');

	// log(`\n⮟options.glyphs⮟`);
	// log(options.glyphs);

	// Create Font
	// log('NEW options ARG TO FONT');
	// log(options);
	const font = FontFlux.create({
		family: options.familyName,
		unitsPerEm: options.unitsPerEm,
		ascender: options.ascender,
		descender: options.descender,
	});

	// Set additional font info properties
	font.info.styleName = options.styleName;
	font.info.copyright = options.copyright;
	font.info.version = options.version;
	font.info.weight = options.weightClass;
	font.info.italicAngle = options.italicAngle;
	font.info.ascender = options.ascender;
	font.info.descender = options.descender;
	font.info.lineGap = options.lineGap;
	font.info.capHeight = options.capHeight;
	font.info.xHeight = options.xHeight;
	// Name-table metadata. FontFlux uses `vendorURL` for the manufacturer /
	// vendor URL (name ID 11); the other fields map by the same name.
	font.info.description = options.description;
	font.info.designer = options.designer;
	font.info.designerURL = options.designerURL;
	font.info.manufacturer = options.manufacturer;
	font.info.vendorURL = options.manufacturerURL;
	font.info.license = options.license;
	font.info.licenseURL = options.licenseURL;
	font.info.trademark = options.trademark;

	// Add glyphs. Composite components reference their target glyphs by name
	// (`glyphName`); FontFlux (v2.7+) resolves those names against the finalized
	// glyph array at export time, so no manual index bookkeeping is needed here.
	options.glyphs.forEach((glyph) => {
		font.addGlyph(glyph);
	});

	// log(`\n⮟font⮟`);
	// log(font);

	// log(`\n⮟ligatureSubstitutions⮟`);
	// log(ligatureSubstitutions);

	// Write kern pair data first, before setting GSUB features
	// This ensures the font's GPOS table is properly initialized
	if (project.settings.app.exportKerning) {
		writeGposKernDataToFont(font, project);
	}

	if (exportLigatures && ligatureSubstitutions.length > 0) {
		ligatureSubstitutions.forEach((sub) => {
			font.addSubstitution({
				type: 'ligature',
				feature: 'liga',
				substitution: {
					components: sub.components,
					ligature: sub.ligature,
				},
			});
		});
	}

	// TODO investigate advanced table values

	// log('Font object:');
	// log(font);
	// log(font.toTables());

	if (testing) {
		// Return buffer for testing. Honor the requested flavor so callers can
		// validate format-specific behavior (e.g. TrueType composite glyphs);
		// `otf` keeps using the generic `sfnt` container for backward
		// compatibility with existing round-trip tests.
		try {
			const format = suffix === 'otf' ? 'sfnt' : suffix;
			const arrayBuffer = font.export({ format });
			return arrayBuffer;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	const result = await saveFontFile(font, suffix);
	// await pause();
	if (result === true) {
		showToast('Export complete!');
		await pause(1000);
		closeAllToasts();
	} else {
		showError(`
			The ${suffix.toUpperCase()} file could not be saved. Here is the error message that was returned:
			<hr>
			${result}
		`);
	}
	// log('ioFont_exportFont', 'end');
}

async function saveFontFile(font, suffix = 'otf') {
	let result = true;
	try {
		// log(`\n⮟font⮟`);
		// log(font);
		if (suffix === 'woff2') {
			// log('Initializing WOFF2 support (this may take a moment)...');
			await initWoff2();
			// log('WOFF2 support initialized.');
		}
		const familyName = font.info.familyName || 'MyFont';
		const styleName = font.info.styleName || 'Regular';
		const fileName = `${familyName.replace(/\s/g, '')}-${styleName}.${suffix.toLowerCase()}`;
		const arrayBuffer = font.export({ format: suffix });
		const dataView = new DataView(arrayBuffer);
		const blob = new Blob([dataView], { type: 'font/opentype' });

		saveFile(blob, fileName);
	} catch (e) {
		console.error(e);
		result = e;
	}

	return result;
}

/**
 * Creates the options object
 * @returns {Object}
 */
function createOptionsObject() {
	// log('createOptionsObject', 'start');

	// Add settings
	const options = {};
	const project = getCurrentProject();
	const fontSettings = project.settings.font;

	options.unitsPerEm = fontSettings.upm || 1000;
	// Calculate proportional defaults based on UPM if metrics are missing
	// Standard OpenType proportions: ascender ~80% of UPM, descender ~20% of UPM
	const defaultAscender = Math.round(options.unitsPerEm * 0.8);
	const defaultDescender = Math.round(options.unitsPerEm * 0.2);
	options.ascender = fontSettings.ascent || defaultAscender;
	options.descender = -1 * Math.abs(fontSettings.descent || defaultDescender);
	options.lineGap = fontSettings.lineGap || 0;
	options.capHeight = fontSettings.capHeight || options.ascender;
	options.xHeight = fontSettings.xHeight || Math.round(options.ascender * 0.7);
	// Name-table values must be strings. Legacy / imported projects may carry
	// non-string metadata (e.g. a numeric `version: 1.003`), which would crash
	// the downstream FontFlux name-table writer, so coerce each field here.
	options.familyName = String(fontSettings.family || ' ');
	options.styleName = String(fontSettings.style || ' ');
	options.designer = String(fontSettings.designer || ' ');
	options.designerURL = String(fontSettings.designerURL || ' ');
	options.manufacturer = String(fontSettings.manufacturer || ' ');
	options.manufacturerURL = String(fontSettings.manufacturerURL || ' ');
	options.license = String(fontSettings.license || ' ');
	options.licenseURL = String(fontSettings.licenseURL || ' ');
	options.version = String(fontSettings.version || '1.0');
	options.description = String(fontSettings.description || ' ');
	options.copyright = String(fontSettings.copyright || ' ');
	options.trademark = String(fontSettings.trademark || ' ');
	options.weightClass = parseInt(fontSettings.weight);
	options.panose = fontSettings.panose.split(' ').map(Number) || [];
	options.italicAngle = fontSettings.italicAngle || 0;
	options.slope = fontSettings.slope || 0;

	options.glyphs = [];

	// log('NEW options ARG BEFORE GLYPHS');
	// log(options);
	// log('options.version ' + options.version);

	return options;
	// log('createOptionsObject', 'end');
}

/**
 * Using a combination of a provided item's Session State,
 * and the project setting for exporting empty items,
 * figures out if this item should be exported or not.
 * @param {Glyph | Object} item - item to check
 * @returns {Boolean}
 */
export function shouldExportItem(item) {
	// null char is always exported and handled separately
	if (item.name === '.null') return false;

	if (item.sessionState === 'new') {
		return !!getCurrentProject().settings.app.exportUneditedItems;
	}
	if (item) return true;
	return false;
}

/**
 * Looks through the project and creates a list
 * of items that should be exported.
 * @returns {Object}
 */
function populateExportList() {
	// log('populateExportList', 'start');
	const project = getCurrentProject();

	// Add Glyphs
	let checklist = [];
	let exportGlyphs = [];

	project.settings.project.characterRanges.forEach((range) => {
		if (range.enabled) {
			range.getMemberIDs().forEach((hexID) => {
				if (checklist.indexOf(hexID) === -1) {
					const thisGlyph = project.getItem(`glyph-${hexID}`);
					if (shouldExportItem(thisGlyph)) {
						exportGlyphs.push({ xg: thisGlyph, xc: hexID });
						checklist.push(hexID);
					}
				}
			});
		}
	});

	exportGlyphs.sort((a, b) => a.xc - b.xc);

	// log(`\n⮟exportGlyphs⮟`);
	// log(exportGlyphs);

	// Add Ligatures
	const exportLigatures = [];
	// const ligWithCodePoint;
	if (project.settings.app.exportLigatures) {
		for (const key of Object.keys(project.ligatures)) {
			// log(project.ligatures[key]);
			if (project.ligatures[key].gsub.length > 1) {
				const thisLigature = project.ligatures[key];
				// log(`\t adding ligature "${thisLigature.name}"`);

				if (shouldExportItem(thisLigature)) {
					exportLigatures.push({ xg: thisLigature, xc: key, chars: thisLigature.chars });

					/*
					When exporting to OTF, if a ligature depends on certain
					characters, and one or more of those characters do not
					exist in the font, it causes an error.
					This will check to see if Glyph objects exist for all
					Ligature source characters, and if some are missing, it
					will create blank Glyphs for them.
				 */
					project.ligatures[key].gsub.forEach((charID) => {
						const hexID = '' + decToHex(charID);
						const id = `glyph-${hexID}`;
						if (!project.glyphs[id]) {
							// log(`No glyph found for charID ${charID} id ${id}`);
							const newGlyph = project.addItemByType(new Glyph({ id: id }), 'Glyph', id);
							if (!checklist.includes(hexID)) {
								exportGlyphs.push({ xg: newGlyph, xc: hexID });
								checklist.push(hexID);
							}
						}
					});
				}
			} else {
				console.warn(`
				Skipped exporting ligature ${project.ligatures[key].name}.
				Source chars length: ${project.ligatures[key].gsub.length}
			`);
			}
		}
		exportLigatures.sort(sortLigatures);
		// log('exportLigatures');
		// log(exportLigatures);
	}

	// log('populateExportList', 'end');
	const result = { glyphs: exportGlyphs, ligatures: exportLigatures };
	return result;
}

/**
 * Creates a notdef character, based on the project's key metrics,
 * and adds it to the provided export options object.
 * @param {Object} options - The options object that is being
 * built for the .otf export
 */
function addNotdefToExport(options, compositeContext) {
	// log(`addNotdefToExport`, 'start');
	const project = getCurrentProject();
	let notdef = project.getItem('glyph-0x0');
	if (!notdef) {
		const capHeight = project.settings.font.capHeight;
		const notDefGlyphPaths = [
			{
				name: 'Outer Phi Rectangle',
				pathPoints: [
					{ p: { coord: { x: 0, y: 700 } } },
					{ p: { coord: { x: 432, y: 700 } } },
					{ p: { coord: { x: 432, y: 0 } } },
					{ p: { coord: { x: 0, y: 0 } } },
				],
			},
			{
				name: 'Inner Phi Rectangle',
				pathPoints: [
					{ p: { coord: { x: 50, y: 50 } } },
					{ p: { coord: { x: 382, y: 50 } } },
					{ p: { coord: { x: 382, y: 650 } } },
					{ p: { coord: { x: 50, y: 650 } } },
				],
			},
		];

		notdef = new Glyph({
			advanceWidth: 432,
			shapes: notDefGlyphPaths,
		});

		if (capHeight !== 700) {
			let delta = capHeight - 700;
			notdef.updateGlyphSize({ height: delta, ratioLock: true });
			notdef.advanceWidth = notdef.maxes.xMax;
		}
	}

	// log(`\n⮟notdef⮟`);
	// log(notdef);

	// Use the standard '.notdef' name so FontFlux recognizes this as the
	// special glyph-zero. If it is named anything else (e.g. '.null'),
	// FontFlux injects its own default '.notdef' (advanceWidth 500) at
	// index 0 and keeps ours as a duplicate glyph mapped to unicode 0,
	// which loses our advanceWidth on round-trip.
	const notdefGlyph = {
		name: '.notdef',
		unicode: 0,
		advanceWidth: notdef.advanceWidth,
		leftSideBearing: round(notdef.leftSideBearing),
		...buildGlyphOutline(notdef, compositeContext),
	};

	options.glyphs.push(notdefGlyph);

	codePointGlyphIndexTable['0x0'] = 0;
	// log(`addNotdefToExport`, 'end');
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @param {Object} compositeContext - Shared composite-export bookkeeping
 * @returns {Promise<Object>} - FontFlux Glyph object
 */
async function generateOneGlyph(currentExportItem, compositeContext) {
	// log('generateOneGlyph', 'start');
	// export this glyph
	const glyph = currentExportItem.xg;
	const num = currentExportItem.xc;

	// Unicode
	const thisUnicode = parseInt(num);
	const thisIndex = getNextGlyphIndexNumber();

	// Name
	// Glyph names in the OpenType `post` table must be unique. The human-readable
	// short names are lossy (truncated to 20 chars), which collides for whole
	// blocks (e.g. every "CYRILLIC Capital Letter X" → "CYRILLICCapitalLette"),
	// causing FontFlux to overwrite/drop glyphs that share a name. Use the
	// canonical AGL `uniXXXX` / `uXXXXXX` convention to guarantee uniqueness.
	const thisName = getUniqueGlyphName(thisUnicode);

	const thisGlyph = {
		name: thisName,
		unicode: thisUnicode,
		advanceWidth: glyph.advanceWidth,
		// Explicitly set the left side bearing to the outline's xMin. FontFlux
		// defaults a missing lsb to 0, which makes the hmtx lsb disagree with the
		// glyf xMin; Windows then shifts the glyph by (xMin - lsb), visibly
		// reducing spacing for glyphs that overhang left (e.g. j, J).
		leftSideBearing: round(glyph.leftSideBearing),
		...buildGlyphOutline(glyph, compositeContext),
	};

	// Add this finished glyph
	codePointGlyphIndexTable[parseCharsInputAsHex(glyph.chars)] = thisIndex;

	// Update the toast and yield to the event loop so it paints, but only at a
	// throttled rate (~60fps) rather than once per glyph. A fixed pause per
	// glyph is pure dead time that adds up to tens of seconds for large fonts;
	// throttling lets the export run at full speed while the glyph name still
	// appears to whiz by. Skipped entirely under test.
	if (!compositeContext?.testing && isUIUpdateDue()) {
		showToast('Exporting<br>' + glyph.name, 999999);
		await pause(0);
	}

	return thisGlyph;
}

/**
 * Makes one item from the export list, and updates the
 * exterior export process, as well as the UI progress bar.
 * @param {Object} currentExportItem - Information about a single item
 * @param {Object} compositeContext - Shared composite-export bookkeeping
 * @returns {Promise<Object>} - FontFlux Glyph object
 */
async function generateOneLigature(currentExportItem, compositeContext) {
	// log(`generateOneLigature`, 'start');

	// export this glyph
	const liga = currentExportItem.xg;

	const thisLigature = {
		name: generateLigatureExportName(liga),
		advanceWidth: liga.advanceWidth,
		leftSideBearing: round(liga.leftSideBearing),
		...buildGlyphOutline(liga, compositeContext),
	};

	// Add substitution info for FontFlux. Component references must match the
	// exported glyph names exactly (uniXXXX), or the substitution won't resolve.
	const componentNames = liga.gsub.map((unicode) => getUniqueGlyphName(unicode));
	ligatureSubstitutions.push({ components: componentNames, ligature: thisLigature.name });

	if (!compositeContext?.testing && isUIUpdateDue()) {
		showToast('Exporting<br>' + liga.name, 999999);
		await pause(0);
	}

	return thisLigature;
}

/**
 * Ligature characters need a name for the .otf file, this
 * generates one based on the ligature's source characters.
 * @param {Glyph | Object} lig - Ligature to generate name for
 * @returns {String}
 */
function generateLigatureExportName(lig) {
	let result = 'lig';

	lig.gsub.forEach((char) => {
		result += '.' + getUniqueGlyphName(char).replace(/^uni?/, '');
	});

	return result;
}

/**
 * Generates a unique, valid OpenType glyph name for a code point using the
 * canonical AGL `uniXXXX` (BMP) / `uXXXXXX` (supplementary) convention. Unlike
 * the human-readable short names, these are guaranteed unique per code point,
 * which the `post` table requires — otherwise FontFlux overwrites/drops glyphs
 * that would otherwise share a (lossily truncated) name.
 * @param {Number} unicode - Decimal code point
 * @returns {String} - Unique glyph name
 */
export function getUniqueGlyphName(unicode) {
	const num = parseInt('' + unicode);
	if (isNaN(num)) return 'name';
	const hex = num.toString(16).toUpperCase();
	if (num <= 0xffff) return 'uni' + hex.padStart(4, '0');
	return 'u' + hex.padStart(6, '0');
}

let currentIndex = 0;
function getNextGlyphIndexNumber() {
	currentIndex += 1;
	return currentIndex;
}

/**
 * Builds the outline payload for an export glyph object.
 *
 * When composite export is active (a TrueType-flavored export with the project
 * setting enabled) and the item qualifies - every shape is a pure-translation
 * component instance whose link resolves to an exportable target - this returns
 * a `{ components }` payload that FontFlux writes as a TrueType composite glyph.
 *
 * Otherwise it returns a command-style `{ contours }` payload, which preserves
 * cubic outlines exactly. FontFlux (v2.7+) keeps composites intact even when
 * sibling and building-block glyphs use command-format contours, so flattened
 * glyphs no longer need to be coerced into SVG/point format.
 * @param {Glyph | Object} item - Item to convert
 * @param {Object} compositeContext - Shared composite-export bookkeeping
 * @returns {Object} - `{ components }` or `{ contours }`
 */
function buildGlyphOutline(item, compositeContext) {
	if (compositeContext?.exportComposites) {
		const components = getCompositeComponents(item, compositeContext);
		if (components) return { components };
	}
	return { contours: glyphToContours(item) };
}

/**
 * Determines whether an item can be exported as a TrueType composite glyph.
 * Only pure-translation component instances qualify (no resize, rotation, flip,
 * or winding reversal) - these map cleanly to TrueType component offsets and
 * guarantee visually identical output. Anything else returns false so the
 * caller flattens the outlines instead.
 * @param {Glyph | Object} item - Item to evaluate
 * @param {Object} compositeContext - Shared composite-export bookkeeping
 * @returns {Array<Object> | false} - FontFlux component descriptors, or false
 */
function getCompositeComponents(item, compositeContext) {
	const shapes = item?.shapes;
	if (!shapes || shapes.length === 0) return false;

	const components = [];
	for (const shape of shapes) {
		if (shape.objType !== 'ComponentInstance') return false;
		// Pure translation only - any other transform falls back to flattening.
		if (
			shape.resizeWidth ||
			shape.resizeHeight ||
			shape.rotation ||
			shape.isFlippedEW ||
			shape.isFlippedNS ||
			shape.reverseWinding
		) {
			return false;
		}

		const linkName = resolveComponentTargetName(shape.link, compositeContext);
		if (!linkName) return false;

		components.push({
			glyphName: linkName,
			dx: round(shape.translateX || 0),
			dy: round(shape.translateY || 0),
		});
	}

	return components;
}

/**
 * Resolves the exported glyph name a composite component should reference, and
 * ensures that target exists in the font (adding it as a flattened
 * building-block glyph when it isn't already part of the export).
 * @param {String} linkId - Component instance link id (glyph-/comp-/liga-)
 * @param {Object} compositeContext - Shared composite-export bookkeeping
 * @returns {String | false} - Target glyph name, or false if unresolvable
 */
function resolveComponentTargetName(linkId, compositeContext) {
	if (!linkId) return false;
	const { project, buildingBlocks, plannedCharacterNames } = compositeContext;
	const target = project.getItem(linkId);
	if (!target) return false;

	if (linkId.startsWith('glyph-')) {
		const codePoint = parseInt(linkId.substring(6));
		if (isNaN(codePoint)) return false;
		const name = getUniqueGlyphName(codePoint);
		// Already part of the export (encoded) - just reference it. Otherwise add
		// an unencoded, flattened copy so the composite has something to point at.
		if (!plannedCharacterNames.has(name)) {
			ensureBuildingBlock(name, target, buildingBlocks);
		}
		return name;
	}

	if (linkId.startsWith('comp-')) {
		const name = ('comp_' + linkId.substring(5)).replace(/[^A-Za-z0-9._]/g, '_');
		ensureBuildingBlock(name, target, buildingBlocks);
		return name;
	}

	if (linkId.startsWith('liga-')) {
		const name = generateLigatureExportName(target);
		ensureBuildingBlock(name, target, buildingBlocks);
		return name;
	}

	return false;
}

/**
 * Registers a flattened, unencoded building-block glyph that one or more
 * composite glyphs reference. Building blocks are always flattened (resolving
 * any nested links recursively) so the composite has concrete outlines to
 * reference by name.
 * @param {String} name - Unique glyph name
 * @param {Glyph | Object} item - Source item to flatten
 * @param {Map} buildingBlocks - name -> FontFlux glyph object
 */
function ensureBuildingBlock(name, item, buildingBlocks) {
	if (buildingBlocks.has(name)) return;
	buildingBlocks.set(name, {
		name: name,
		advanceWidth: item.advanceWidth,
		leftSideBearing: round(item.leftSideBearing),
		contours: glyphToContours(item),
	});
}

/**
 * Converts a Glyphr Studio Glyph directly to FontFlux contours format.
 * @param {Glyph | Object} item - Item to convert
 * @returns {Array<Array>} - Array of contours, each contour is an array of points
 */
function glyphToContours(item) {
	// Resolving component links rebuilds the whole glyph, which is expensive.
	// Only pay that cost for glyphs that actually contain component instances;
	// path-only glyphs (the vast majority in most fonts) can be read directly.
	const hasComponents =
		Array.isArray(item.shapes) &&
		item.shapes.some((shape) => shape.objType === 'ComponentInstance');
	const flatItem = hasComponents ? makeGlyphWithResolvedLinks(item) : item;
	const contours = [];

	flatItem.shapes.forEach((shape) => {
		if (shape.objType === 'Path') {
			const contour = pathToContour(shape);
			if (contour && contour.length > 0) {
				contours.push(contour);
			}
		}
	});

	return contours;
}

/**
 * Converts a Glyphr Studio Path into a FontFlux CFF contour (cubic Bézier format).
 * Uses 'M' (move), 'L' (line), and 'C' (cubic curve) commands.
 * Format: [{ type: 'M', x, y }, { type: 'L', x, y }, { type: 'C', x1, y1, x2, y2, x, y }, ...]
 * @param {Path} path - Path object to convert
 * @returns {Array} - Contour commands in CFF cubic format
 */
function pathToContour(path) {
	if (!path.pathPoints || path.pathPoints.length === 0) {
		return [];
	}

	const contour = [];
	const points = path.pathPoints;

	try {
		// Start with move command to first point
		contour.push({
			type: 'M',
			x: round(points[0].p.x),
			y: round(points[0].p.y),
		});

		// Add curve or line for each segment
		points.forEach((point, index) => {
			const nextIndex = (index + 1) % points.length;
			const nextPoint = points[nextIndex];

			// Check if this is a straight line (handles at the points)
			const isLine =
				round(point.h2.x) === round(point.p.x) &&
				round(point.h2.y) === round(point.p.y) &&
				round(nextPoint.h1.x) === round(nextPoint.p.x) &&
				round(nextPoint.h1.y) === round(nextPoint.p.y);

			if (isLine) {
				// Line command
				contour.push({
					type: 'L',
					x: round(nextPoint.p.x),
					y: round(nextPoint.p.y),
				});
			} else {
				// Cubic curve command
				// x1, y1 = first control point (from current point's h2)
				// x2, y2 = second control point (to next point's h1)
				// x, y = end point
				contour.push({
					type: 'C',
					x1: round(point.h2.x),
					y1: round(point.h2.y),
					x2: round(nextPoint.h1.x),
					y2: round(nextPoint.h1.y),
					x: round(nextPoint.p.x),
					y: round(nextPoint.p.y),
				});
			}
		});
	} catch (e) {
		console.warn(e);
	}

	return contour;
}
