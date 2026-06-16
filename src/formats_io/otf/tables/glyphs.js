import { decToHex } from '../../../common/character_ids';
import { isControlChar } from '../../../lib/unicode/unicode_blocks';
import { Glyph } from '../../../project_data/glyph';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project';
import { addLinkToUsedIn } from '../../../project_editor/cross_item_actions';
import {
	decrementItemTotal,
	incrementItemCounter,
	makeGlyphrStudioGlyphObject,
	updateFontImportProgressIndicator,
} from '../font_import';

/**
 * Imports glyph data from FontFlux
 * @param {Array} fontGlyphs - FontFlux glyph array
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} importedFont - FontFlux font object (used to decompose composites)
 * @returns {Promise<Object>} - imported glyphs
 */
export async function importGlyphs(fontGlyphs, project, importedFont) {
	const finalGlyphs = {};
	// Tracks, per glyph slot, how the current occupant was assigned so a more
	// authoritative mapping can replace a weaker one (see importOneGlyph).
	const glyphSlotMeta = {};
	// Caches the Glyphr Studio Component Root (`comp-N`) created for each base
	// glyph (keyed by its index in the imported font) so every composite that
	// references the same base re-uses the same Component instead of making a
	// duplicate. This is what makes accented characters share one root.
	const componentRootCache = new Map();

	for (const glyph of fontGlyphs) {
		await updateFontImportProgressIndicator('character');
		importOneGlyph(glyph, project, finalGlyphs, glyphSlotMeta, importedFont, componentRootCache);
	}

	return finalGlyphs;
}

/**
 * Imports one FontFlux Glyph object and adds it
 * to the current project
 * @param {Object} glyph - FontFlux Glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} finalGlyphs - imported glyphs
 * @param {Object} glyphSlotMeta - per-slot assignment metadata
 * @param {Object =} importedFont - FontFlux font object (used to decompose composites)
 * @param {Map =} componentRootCache - font glyph index -> Component id, for re-use
 * @returns nothing
 */
function importOneGlyph(
	glyph,
	project,
	finalGlyphs,
	glyphSlotMeta = {},
	importedFont = false,
	componentRootCache = new Map()
) {
	// log('importOneGlyph', 'start');

	// Get the appropriate unicode decimal for this glyph
	// log(`glyph.unicode: ${glyph.unicode}`);
	// log(`glyph.name: ${glyph.name}`);
	// log(`glyph.advanceWidth: ${glyph.advanceWidth}`);
	// log(glyph);

	const unicode = glyph.unicode;
	const unicodes = glyph.unicodes || (unicode !== undefined ? [unicode] : []);

	if (unicode === undefined || isNaN(unicode)) {
		// Skip glyphs without unicode, except for special cases
		if (glyph.name !== '.notdef') {
			// log(`!!! Skipping ${glyph.name} NO UNICODE !!!`);
			decrementItemTotal();
			// log('importOneGlyph', 'end');
			return;
		}
	}

	// log(`primaryUnicodeHex: ${primaryUnicodeHex}`);
	// If this is a pure-position composite (and the setting allows it), build
	// the glyph out of re-usable Component Instances instead of flattening it.
	let importedGlyph = false;
	if (shouldImportAsComponents(glyph, project, importedFont)) {
		importedGlyph = makeComponentBasedGlyph(glyph, project, importedFont, componentRootCache);
	}
	if (!importedGlyph) {
		importedGlyph = makeGlyphrStudioGlyphObject(glyph, importedFont);
	}

	if (!importedGlyph) {
		console.warn(`Something went wrong with importing this glyph.`);
		decrementItemTotal();
		// log('importOneGlyph', 'end');
		return;
	}

	const newGlyphIsEmpty = !importedGlyph.shapes || importedGlyph.shapes.length === 0;

	for (let i = 0; i < unicodes.length; i++) {
		const unicodeVal = unicodes[i];
		// A glyph's primary `.unicode` is the authoritative (Unicode cmap)
		// mapping. Additional entries in `.unicodes` can include secondary /
		// legacy mappings (for example Mac Roman byte values surfaced by
		// font-flux-js) which must never override a real primary mapping -
		// even when the primary glyph is an (as yet undecomposed) empty
		// composite and the secondary glyph happens to carry outlines.
		const viaPrimary = unicodeVal === unicode;
		const unicodeHex = decToHex(unicodeVal || 0);
		const glyphID = `glyph-${unicodeHex}`;

		// Rank a slot claim so the strongest mapping wins. Primary mappings
		// dominate secondary ones; within the same kind, a glyph with outlines
		// beats an empty placeholder. Equal ranks keep the first claimant.
		const rankOf = (isPrimary, isEmpty) => (isPrimary ? 2 : 0) + (isEmpty ? 0 : 1);
		const newRank = rankOf(viaPrimary, newGlyphIsEmpty);

		const existingMeta = glyphSlotMeta[glyphID];
		let shouldAssign = false;
		if (!existingMeta) {
			shouldAssign = true;
		} else if (newRank > rankOf(existingMeta.viaPrimary, existingMeta.empty)) {
			shouldAssign = true;
		}

		if (shouldAssign) {
			const isNewSlot = !finalGlyphs[glyphID];
			const newGlyph = new Glyph(importedGlyph.save());
			newGlyph.id = glyphID;
			// Wire the glyph to its project so any Component Instances it
			// contains can resolve their linked Component Roots (getCrossLinkedItem
			// walks instance -> glyph -> project).
			newGlyph.parent = project;
			finalGlyphs[glyphID] = newGlyph;
			glyphSlotMeta[glyphID] = { viaPrimary, empty: newGlyphIsEmpty };

			// Record this glyph in each linked Component Root's `usedIn` so the
			// Components panel knows where the root is referenced from.
			for (const shape of newGlyph.shapes) {
				if (shape.link) {
					const rootItem = project.getItem(shape.link);
					if (rootItem && !rootItem.usedIn.includes(glyphID)) {
						addLinkToUsedIn(rootItem, glyphID);
					}
				}
			}

			if (isNewSlot) {
				if (isControlChar(unicodeHex) && unicodeHex !== '0x0') {
					project.settings.app.showNonCharPoints = true;
				}

				if (!isNaN(Number(unicodeHex))) project.incrementRangeCountFor(Number(unicodeHex));
			}
		}
	}

	// Successful loop, advance importItemCounter
	incrementItemCounter();
	// log(importedGlyph);
	// log('importOneGlyph', 'end');
}

/**
 * Decides whether a FontFlux composite glyph should be imported as a set of
 * Glyphr Studio Component Instances (preserving its structure) instead of being
 * flattened into plain outlines. Only pure-position composites qualify: every
 * component must place its base glyph with a simple x/y offset
 * (`flags.argsAreXYValues`) and carry no scale / rotation / 2x2 `transform`.
 * @param {Object} glyph - FontFlux glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} importedFont - FontFlux font object
 * @returns {Boolean} - true if the glyph should become Component Instances
 */
function shouldImportAsComponents(glyph, project, importedFont) {
	if (project?.settings?.project?.importComponentsFromComposites === false) return false;
	if (!glyph || !glyph.components || glyph.components.length === 0) return false;
	if (!importedFont || !Array.isArray(importedFont.glyphs)) return false;

	return glyph.components.every(
		(component) =>
			component &&
			component.flags &&
			component.flags.argsAreXYValues === true &&
			!component.transform &&
			!!importedFont.glyphs[component.glyphIndex]
	);
}

/**
 * Ensures a Glyphr Studio Component Root exists for a base glyph (identified by
 * its index in the imported font), creating it once from the base glyph's
 * flattened outline and caching the resulting `comp-N` id. Every composite that
 * references the same base glyph then re-uses (links to) this same Component.
 * @param {Number} glyphIndex - index of the base glyph in importedFont.glyphs
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} importedFont - FontFlux font object
 * @param {Map} componentRootCache - font glyph index -> Component id
 * @returns {String | false} - the Component id (comp-N), or false on failure
 */
function ensureComponentRoot(glyphIndex, project, importedFont, componentRootCache) {
	if (componentRootCache.has(glyphIndex)) return componentRootCache.get(glyphIndex);

	const baseFontGlyph = importedFont.glyphs[glyphIndex];
	if (!baseFontGlyph) return false;

	const rootGlyph = makeGlyphrStudioGlyphObject(baseFontGlyph, importedFont);
	if (!rootGlyph) return false;

	rootGlyph.name = baseFontGlyph.name || `Component ${glyphIndex}`;
	// Generate the Component id against the import target project directly.
	// makeComponentID() (used by addItemByType's default) keys off the global
	// "current" project, which isn't this import target yet - so relying on it
	// would hand every root the same id and overwrite previous roots.
	const newID = makeComponentIDForProject(project);
	const addedRoot = project.addItemByType(rootGlyph, 'Component', newID);
	componentRootCache.set(glyphIndex, addedRoot.id);

	return addedRoot.id;
}

/**
 * Generates a Component id (`comp-N`) that doesn't collide with any Component
 * already in the given project. Used during import because the project being
 * imported into is not yet the global "current" project.
 * @param {GlyphrStudioProject} project - the import target project
 * @returns {String} - a unique Component id
 */
function makeComponentIDForProject(project) {
	const components = project.components || {};
	let counter = Object.keys(components).length;
	while (components[`comp-${counter}`]) counter++;
	return `comp-${counter}`;
}

/**
 * Builds a Glyphr Studio Glyph made of Component Instances for a pure-position
 * composite glyph. Each component becomes an instance linked to a shared
 * Component Root, with the composite's x/y offset mapped to the instance's
 * translate values. Returns false (so the caller falls back to flattening) if
 * any referenced base glyph can't be turned into a Component Root.
 * @param {Object} glyph - FontFlux composite glyph object
 * @param {GlyphrStudioProject} project - current project
 * @param {Object} importedFont - FontFlux font object
 * @param {Map} componentRootCache - font glyph index -> Component id
 * @returns {Glyph | false} - the new Glyph, or false to fall back to flattening
 */
function makeComponentBasedGlyph(glyph, project, importedFont, componentRootCache) {
	const shapes = [];

	for (const component of glyph.components) {
		const rootID = ensureComponentRoot(
			component.glyphIndex,
			project,
			importedFont,
			componentRootCache
		);
		if (!rootID) return false;

		shapes.push({
			link: rootID,
			translateX: component.argument1 || 0,
			translateY: component.argument2 || 0,
		});
	}

	return new Glyph({ advanceWidth: glyph.advanceWidth, shapes });
}
