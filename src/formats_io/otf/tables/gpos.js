import { decToHex } from '../../../common/character_ids.js';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project.js';
import { KernGroup } from '../../../project_data/kern_group.js';
import { getUniqueGlyphName } from '../font_export.js';
import { incrementItemCounter, updateFontImportProgressIndicator } from '../font_import.js';

// --------------------------------------------------------------
// Reading Kern information
// --------------------------------------------------------------

/**
 * Reads and prepares data from a kern (hopefully gpos) table
 * @param {Object} table - gpos table data
 * @returns {Object} - parsed data
 */
export function loadOneKernTable(table) {
	// log(`loadOneKernTable`, 'start');
	// log(table);
	const subtables = [];
	let kernPairCount = 0;
	if (table.lookupType === 2) {
		table?.subtables.forEach((subtable) => {
			if (subtable.posFormat === 1) {
				// log(`\n⮟subtable⮟`);
				// log(subtable);
				const pairSets = subtable?.pairSets || [];
				const glyphList = coverageTableToGlyphList(subtable?.coverage);
				// log(`\n⮟pairSets⮟`);
				// log(pairSets);
				// log(`\n⮟glyphList⮟`);
				// log(glyphList);
				pairSets.forEach((base) => (kernPairCount += base.length));
				subtables.push({ pairSets: pairSets, glyphList: glyphList });
			} else if (subtable.posFormat === 2) {
				// TODO support position format 2
				console.warn(
					`In a GPOS table: Lookup Type 2, found a subtable with Pair Position: Format 2. Can only import Format 1.`
				);
			}
		});
	} else {
		// TODO support other Lookup types
		console.warn(
			`Found a GPOS table: Lookup Type ${table.lookupType}. Only Lookup Type 2 is supported.`
		);
	}

	// log(`loadOneKernTable`, 'end');
	return { subtables, kernPairCount };
}

/**
 * Normalizes different coverage table data structures
 * to a simple array of font glyph IDs
 * @param {Object} coverage - glyph id data
 * @returns Array
 */
function coverageTableToGlyphList(coverage) {
	if (!coverage) return [];
	let result = [];
	const coverageFormat = coverage.format;
	if (coverageFormat === 1) {
		result = coverage?.glyphs || [];
	} else if (coverageFormat === 2) {
		const typeTwoCoverage = coverage?.ranges || [];
		for (let i = 0; i < typeTwoCoverage.length; i++) {
			const range = typeTwoCoverage[i];
			for (let j = range.startGlyphID; j <= range.endGlyphID; j++) {
				result.push(j);
			}
		}
	}
	return result;
}

/**
 * Resolves a FontFlux glyph name to a Glyphr Studio hex Unicode value using a
 * prebuilt name -> code point lookup. Returns false for glyph names with no
 * Unicode code point (e.g. ligatures, stylistic alternates, .notdef) since
 * those cannot be represented in a Kern Group.
 * @param {String} name - FontFlux glyph name
 * @param {Map<String, Number>} nameToUnicode - glyph name -> code point lookup
 * @returns {String | false}
 */
function glyphNameToHex(name, nameToUnicode) {
	const unicode = nameToUnicode.get(name);
	if (unicode === undefined || unicode === null) return false;
	return decToHex(unicode);
}

/**
 * Resolves one side of a FontFlux kerning-class pair into a list of Glyphr
 * Studio hex Unicode values. A reference of the form `@className` expands to
 * the members of that class; any other value is treated as a single glyph
 * name. Members without a Unicode code point are dropped.
 * @param {String} ref - `@className` or a single glyph name
 * @param {Object} classes - FontFlux class map { className: [glyphName...] }
 * @param {Map<String, Number>} nameToUnicode - glyph name -> code point lookup
 * @returns {Array<String>} - hex Unicode members
 */
function resolveKernClassRef(ref, classes, nameToUnicode) {
	const members =
		typeof ref === 'string' && ref.startsWith('@') ? classes[ref.slice(1)] || [] : [ref];
	const result = [];
	for (const name of members) {
		const hex = glyphNameToHex(name, nameToUnicode);
		if (hex) result.push(hex);
	}
	return result;
}

// --------------------------------------------------------------
// Extracting efficient Kern Groups from FontFlux's parsed kern data
// --------------------------------------------------------------

/**
 * Builds compact Kern Group descriptors from the kern data FontFlux has
 * already parsed. FontFlux 2.6.0 natively separates kerning into two shapes:
 *
 *   - `font.kerning` holds individual pairs (GPOS PairPos format 1 plus any
 *     legacy `kern` table), and
 *   - `font.data.kerningClasses` holds class-based kerning (GPOS PairPos
 *     format 2) as compact { leftClasses, rightClasses, pairs } entries.
 *
 * Reading the class structure directly avoids the huge cartesian explosion of
 * individual pairs that class-vs-class kerning would otherwise produce, and
 * lets a single class pair map straight onto one native Glyphr Studio Kern
 * Group. Glyph names are resolved back to Unicode code points; members without
 * a code point (which Glyphr Studio cannot kern) are dropped.
 * @param {Object} importedFont - FontFlux font object
 * @returns {Array} - Array of { leftGroup, rightGroup, value } descriptors
 *   where the groups are arrays of hex Unicode strings
 */
export function extractGposKernGroups(importedFont) {
	const glyphs = importedFont?.glyphs || [];

	// Build a glyph-name -> Unicode code point lookup once. Only glyphs that
	// carry a Unicode value can take part in a Glyphr Studio Kern Group.
	const nameToUnicode = new Map();
	for (const glyph of glyphs) {
		if (glyph && glyph.name && glyph.unicode !== undefined && glyph.unicode !== null) {
			nameToUnicode.set(glyph.name, glyph.unicode);
		}
	}

	const descriptors = [];

	// Individual pairs -> single-member Kern Groups.
	for (const pair of importedFont?.kerning || []) {
		if (!pair || !pair.value) continue;
		const leftHex = glyphNameToHex(pair.left, nameToUnicode);
		const rightHex = glyphNameToHex(pair.right, nameToUnicode);
		if (!leftHex || !rightHex) continue;
		descriptors.push({ leftGroup: [leftHex], rightGroup: [rightHex], value: pair.value });
	}

	// Class-based kerning -> multi-member Kern Groups (one per class pair).
	const kerningClasses = importedFont?.data?.kerningClasses;
	if (Array.isArray(kerningClasses)) {
		for (const entry of kerningClasses) {
			if (!entry || !Array.isArray(entry.pairs)) continue;
			const leftClasses = entry.leftClasses || {};
			const rightClasses = entry.rightClasses || {};
			for (const pair of entry.pairs) {
				if (!pair || !pair.value) continue;
				const leftGroup = resolveKernClassRef(pair.left, leftClasses, nameToUnicode);
				if (!leftGroup.length) continue;
				const rightGroup = resolveKernClassRef(pair.right, rightClasses, nameToUnicode);
				if (!rightGroup.length) continue;
				descriptors.push({ leftGroup, rightGroup, value: pair.value });
			}
		}
	}

	return descriptors;
}

// --------------------------------------------------------------
// Importing gpos table information
// --------------------------------------------------------------

/**
 * Builds Glyphr Studio Kern Groups from the compact group descriptors
 * produced by `extractGposKernGroups`. Each descriptor maps directly to one
 * native Kern Group, keeping the imported kern data small and efficient.
 * @param {Object} importedFont - FontFlux font object (unused, kept for symmetry)
 * @param {Array} descriptors - { leftGroup, rightGroup, value } descriptors
 * @returns {Promise<Object>} - imported kern groups
 */
export async function importGposKernGroups(importedFont, descriptors) {
	const finalKerns = {};
	if (!Array.isArray(descriptors)) return finalKerns;

	let counter = 0;
	for (const descriptor of descriptors) {
		await updateFontImportProgressIndicator('kern group');
		const importedKern = new KernGroup({
			leftGroup: descriptor.leftGroup,
			rightGroup: descriptor.rightGroup,
			value: descriptor.value,
		});
		const newKernID = `kern-${counter++}`;
		importedKern.id = newKernID;
		finalKerns[newKernID] = importedKern;
		incrementItemCounter();
	}

	return finalKerns;
}

// --------------------------------------------------------------
// GPOS Table Writing
// --------------------------------------------------------------

/**
 * Writes Glyphr Studio kern data to a FontFlux font object, preferring
 * FontFlux 2.6.0's native class-based kerning so multi-member Kern Groups are
 * stored compactly as GPOS PairPos format 2 subtables instead of being
 * exploded into individual pairs.
 *
 * Kern Groups are split by shape:
 *   - A group with exactly one left and one right member is a plain pair and is
 *     written via `addKerning` (GPOS PairPos format 1 / legacy `kern`).
 *   - Any group with a multi-member side is written through
 *     `font.data.kerningClasses` as one or more class entries, each of which
 *     FontFlux turns into a format 2 subtable.
 * @param {Object} exportingFont - FontFlux font object
 * @param {GlyphrStudioProject} project - current project
 * @returns
 */
export function writeGposKernDataToFont(exportingFont, project) {
	const kerning = project.kerning || {};
	const keys = Object.keys(kerning);
	if (keys.length === 0) return;

	const flatPairs = []; // single x single -> GPOS PairPos format 1
	const classGroups = []; // multi-member side -> GPOS PairPos format 2

	for (const key of keys) {
		const group = kerning[key];
		if (!group || !Array.isArray(group.leftGroup) || !Array.isArray(group.rightGroup)) continue;
		if (typeof group.value !== 'number' || !group.value) continue;

		// Hex code points -> uniXXXX export glyph names (matching addGlyph).
		const left = group.leftGroup.map((hex) => getUniqueGlyphName(hex));
		const right = group.rightGroup.map((hex) => getUniqueGlyphName(hex));
		if (!left.length || !right.length) continue;

		if (left.length === 1 && right.length === 1) {
			flatPairs.push({ left: left[0], right: right[0], value: group.value });
		} else {
			classGroups.push({ left, right, value: group.value });
		}
	}

	try {
		// Class-based Kern Groups -> compact GPOS PairPos format 2 subtables.
		if (classGroups.length > 0) {
			exportingFont.data.kerningClasses = buildKerningClassEntries(classGroups);
		}

		// Individual pairs -> GPOS PairPos format 1 (and/or legacy `kern`).
		if (flatPairs.length > 0 && typeof exportingFont.addKerning === 'function') {
			for (const pair of flatPairs) {
				try {
					exportingFont.addKerning(pair);
				} catch (pairError) {
					console.warn(
						`Warning: Failed to add kerning pair ${pair.left}-${pair.right}: ${pairError.message}`
					);
				}
			}
		}
	} catch (error) {
		// Log the error but don't fail the entire export
		// Kerning export is optional and shouldn't block font export
		console.warn(
			`Warning: Kerning export failed (font will export without kerning): ${error.message}`
		);
	}
}

/**
 * Bundles class-based Kern Groups into FontFlux `kerningClasses` entries. Each
 * entry maps to one GPOS PairPos format 2 subtable, which requires a clean
 * class partition: every glyph may belong to at most one class per side within
 * a subtable. Two groups can therefore share an entry only when each of their
 * left member sets - and each of their right member sets - is either identical
 * to or fully disjoint from the sets already in that entry. Groups that came
 * from the same original subtable satisfy this naturally, so this greedy
 * packing reconstructs compact subtables instead of emitting one per group.
 * @param {Array} classGroups - { left: [names], right: [names], value } groups
 * @returns {Array} - FontFlux kerningClasses entries
 */
function buildKerningClassEntries(classGroups) {
	const bins = [];

	for (const group of classGroups) {
		const leftSig = group.left.slice().sort().join('\u0000');
		const rightSig = group.right.slice().sort().join('\u0000');

		let bin = null;
		for (const candidate of bins) {
			if (
				isClassCompatible(candidate.leftSets, candidate.leftGlyphs, leftSig, group.left) &&
				isClassCompatible(candidate.rightSets, candidate.rightGlyphs, rightSig, group.right)
			) {
				bin = candidate;
				break;
			}
		}

		if (!bin) {
			bin = {
				leftSets: new Map(), // signature -> { name, members }
				rightSets: new Map(),
				leftGlyphs: new Set(), // every glyph used on the left in this entry
				rightGlyphs: new Set(),
				pairs: [],
			};
			bins.push(bin);
		}

		const leftRef = assignKernClass(bin.leftSets, bin.leftGlyphs, leftSig, group.left, 'L');
		const rightRef = assignKernClass(bin.rightSets, bin.rightGlyphs, rightSig, group.right, 'R');
		bin.pairs.push({ left: leftRef, right: rightRef, value: group.value });
	}

	return bins.map((bin) => {
		const leftClasses = {};
		for (const { name, members } of bin.leftSets.values()) leftClasses[name] = members;
		const rightClasses = {};
		for (const { name, members } of bin.rightSets.values()) rightClasses[name] = members;
		return { leftClasses, rightClasses, pairs: bin.pairs };
	});
}

/**
 * Tests whether a member set can be added to one side of a kerning-class entry
 * without breaking its class partition. The set is allowed when it exactly
 * matches an existing class (it will reuse that class) or when none of its
 * glyphs are already assigned to a class in this entry (it becomes a new,
 * disjoint class). A partial overlap is rejected.
 * @param {Map} sets - signature -> class for this side of the entry
 * @param {Set} glyphs - every glyph already used on this side of the entry
 * @param {String} sig - signature of the incoming member set
 * @param {Array} members - incoming member glyph names
 * @returns {Boolean}
 */
function isClassCompatible(sets, glyphs, sig, members) {
	if (sets.has(sig)) return true; // identical existing class -> reuse
	for (const glyph of members) if (glyphs.has(glyph)) return false; // partial overlap
	return true; // fully disjoint -> new class
}

/**
 * Returns the `@class` reference for a member set within a kerning-class entry,
 * creating the class (and registering its glyphs) the first time the set is
 * seen.
 * @param {Map} sets - signature -> class for this side of the entry
 * @param {Set} glyphs - every glyph already used on this side of the entry
 * @param {String} sig - signature of the member set
 * @param {Array} members - member glyph names
 * @param {String} prefix - class-name prefix ('L' or 'R')
 * @returns {String} - `@className`
 */
function assignKernClass(sets, glyphs, sig, members, prefix) {
	let entry = sets.get(sig);
	if (!entry) {
		entry = { name: `${prefix}${sets.size}`, members: members.slice() };
		sets.set(sig, entry);
		for (const glyph of members) glyphs.add(glyph);
	}
	return '@' + entry.name;
}
