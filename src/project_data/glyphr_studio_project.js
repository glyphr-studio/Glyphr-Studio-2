import { clone, json, remove, round, trim } from '../common/functions.js';
import { Glyph } from '../project_data/glyph.js';
import { KernGroup } from './kern_group.js';
import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';
import { charsToHexArray, decToHex, validateAsHex } from '../common/character_ids.js';
import { CharacterRange } from './character_range.js';

/**
 * Creates a new Glyphr Studio Project
 */
export class GlyphrStudioProject {
	/**
	 * Initialize a project, with defaults
	 * @param {Object} newProject - Glyphr Studio Project File JSON
	 */
	constructor(newProject = {}) {
		// log('GlyphrStudioProject.constructor', 'start');
		// log(newProject);
		// Set up all internal default values first
		this.settings = {
			project: {
				name: 'My Font',
				latestVersion: '2.0.0-beta.1.0',
				initialVersion: '2.0.0-beta.1.0',
				id: false,
				characterRanges: [],
			},
			app: {
				savePreferences: false,
				stopPageNavigation: true,
				showNonCharPoints: false,
				formatSaveFile: false,
				moveShapesOnSVGDragDrop: false,
				guides: {
					system: {
						transparency: 10,
						showBaseline: true,
						showLeftSide: true,
						showRightSide: true,
					},
				},
				contextCharacters: {
					showCharacters: false,
					characterTransparency: 20,
					showGuides: true,
					guidesTransparency: 70,
				},
			},
			font: {
				family: 'My Font',
				style: 'Regular',
				version: '1.0',
				description: '',
				panose: '0 0 0 0 0 0 0 0 0 0',
				upm: 1000,
				ascent: 700,
				descent: -300,
				capHeight: 675,
				xHeight: 400,
				overshoot: 10,
				lineGap: 250,
				italicAngle: 0,
				designer: '',
				designerURL: '',
				manufacturer: '',
				manufacturerURL: '',
				license: '',
				licenseURL: '',
				copyright: '',
				trademark: '',
				// SVG Font properties
				variant: 'normal',
				weight: 400,
				stretch: 'normal',
				stemv: 0,
				stemh: 0,
				slope: 0,
				underlinePosition: -50,
				underlineThickness: 10,
				strikethroughPosition: 300,
				strikethroughThickness: 10,
				overlinePosition: 750,
				overlineThickness: 10,
			},
		};

		this.glyphs = {};
		this.ligatures = {};
		this.kerning = {};
		this.components = {};

		// ---------------------------------------------------------------
		// Handle passed object
		// ---------------------------------------------------------------
		// log('\npassed: ');
		// log(newProject);

		// Glyph Ranges
		if (newProject?.settings?.project?.characterRanges) {
			newProject.settings.project.characterRanges.forEach((range) => {
				this.settings.project.characterRanges.push(new CharacterRange(range));
			});
		}
		// log('finished importing Glyph Ranges');
		// log(this.settings.project.characterRanges);

		// Settings
		if (newProject.settings) {
			// log('merging settings from newProject');
			this.settings = merge(this.settings, newProject.settings);
		}
		this.settings.project.id = this.settings.project.id || makeProjectID();
		this.settings.font.descent = -1 * Math.abs(this.settings.font.descent);
		// log('finished merging settings - result:');
		// log(this.settings);

		// Components
		// log(`\nStarting components - passed:`);
		// log(newProject.components);
		this.hydrateProjectItems(Glyph, newProject.components, 'Component');
		// log('finished hydrating components - result:');
		// log(this.components);

		// Glyphs
		// log(`\nStarting glyphs - passed:`);
		// log(newProject.glyphs);
		this.hydrateProjectItems(Glyph, newProject.glyphs, 'Glyph');
		// log('finished hydrating glyphs - result:');
		// log(this.glyphs);

		// Ligatures
		// log(`\nStarting ligatures - passed:`);
		// log(newProject.ligatures);
		this.hydrateProjectItems(Glyph, newProject.ligatures, 'Ligature');
		// log('finished hydrating ligatures - result:');
		// log(this.ligatures);

		// Kerning
		// log(`\nStarting kerning - passed:`);
		// log(newProject.kerning);
		this.hydrateProjectItems(KernGroup, newProject.kerning, 'KernGroup');
		// log('finished hydrating kern pairs - result:');
		// log(this.kerning);

		// log('\n\nfinished EVERYTHING - result:');
		// log(this);
		// log('GlyphrStudioProject.constructor', 'end');
	}

	// --------------------------------------------------------------
	// Save
	// --------------------------------------------------------------

	/**
	 * Saves Glyph Element, Settings, and Metadata hierarchy
	 * that describes a Glyphr Studio Project
	 * @param {Boolean} verbose - include extra properties for better readability
	 * @returns {GlyphrStudioProject}
	 */
	save(verbose = false) {
		const savedProject = {
			settings: clone(this.settings),
			glyphs: {},
			ligatures: {},
			components: {},
			kerning: {},
		};

		savedProject.settings.project.characterRanges = [];
		this.settings.project.characterRanges.forEach((range) => {
			savedProject.settings.project.characterRanges.push(range.save());
		});

		/**
		 * Generic iterator for glyphs, ligatures, components, and kerning
		 * @param {Object} group - which group to do
		 * @param {String} name - name of the group
		 */
		function iterator(group, name) {
			for (const key of Object.keys(group)) {
				if (group[key].save) {
					savedProject[name][key] = group[key].save(verbose);
				}
			}
		}

		iterator(this.glyphs, 'glyphs');
		iterator(this.ligatures, 'ligatures');
		iterator(this.components, 'components');
		iterator(this.kerning, 'kerning');

		return savedProject;
	}

	// --------------------------------------------------------------
	// Getting / Setting Items
	// --------------------------------------------------------------

	/**
	 * Get a glyph, ligature, or component by ID
	 * @param {String} id - which Glyph to return
	 * @returns {Glyph}
	 */
	getItem(id) {
		// log('GlyphrStudioProject.getItem', 'start');
		// log(`id: ${id}`);

		if (!id) {
			// log('Not passed an ID, returning false');
			// log('GlyphrStudioProject.getItem', 'end');
			return false;
		}

		id = '' + id;
		let result;

		if (this.ligatures && id.startsWith('liga-')) {
			// log(`detected LIGATURE`);
			result = this.ligatures[id] || false;
		} else if (this.glyphs && id.startsWith('glyph-')) {
			// log(`detected GLYPH`);
			result = this.glyphs[id] || false;
		} else if (this.components && id.startsWith('comp-')) {
			// log(`detected COMPONENT`);
			result = this.components[id] || false;
		} else if (this.kerning && id.startsWith('kern-')) {
			// log(`detected KERN`);
			result = this.kerning[id] || false;
		} else {
			// log('NO RESULT FOUND');
		}

		// log(`returning result:`);
		// log(result);
		// log('GlyphrStudioProject.getItem', 'end');
		return result;
	}

	/**
	 * Given a single character or a string of characters, find the
	 * Glyphr Studio item ID that corresponds to it.
	 * @param {String} chars - single character or gsub for ligatures
	 * @returns {String} - item ID
	 */
	getItemID(chars) {
		if (chars.length === 1) {
			return `glyph-${charsToHexArray(chars)[0]}`;
		} else {
			for (let id of Object.keys(this.ligatures)) {
				let lig = this.ligatures[id];
				if (lig.gsub === chars) return id;
			}
		}
		return false;
	}

	/**
	 * Sets an item based on an ID
	 * @param {String} id - item ID to set
	 * @param {Glyph} newItem - new thing to set
	 * @returns nothing
	 */
	setItem(id, newItem) {
		// log('GlyphrStudioProject.setItem', 'start');
		// log(`id: ${id}`);

		if (!id) {
			// log('Not passed an ID, returning false');
			// log('GlyphrStudioProject.setItem', 'end');
			return false;
		}

		id = '' + id;

		if (this.ligatures && id.startsWith('liga-')) {
			// log(`detected LIGATURE`);
			this.ligatures[id] = newItem;
		} else if (this.glyphs && id.startsWith('glyph-')) {
			// log(`detected GLYPH`);
			this.glyphs[id] = newItem;
		} else if (this.components && id.startsWith('comp-')) {
			// log(`detected COMPONENT`);
			this.components[id] = newItem;
		} else if (this.kerning && id.startsWith('kern-')) {
			// log(`detected KERN`);
			this.kerning[id] = newItem;
		} else {
			// log('NO RESULT FOUND');
		}

		// log('GlyphrStudioProject.setItem', 'end');
	}

	/**
	 * Get a glyph's name based on it's ID
	 * @param {String} id - Glyph ID
	 * @param {Boolean} forceLongName - don't use the short Unicode name by default
	 * @returns {String}
	 */
	getItemName(id, forceLongName = false) {
		id = '' + id;
		// log('GlyphrStudioProject.getItemName', 'start');
		// log('passed ' + id);

		// not passed an id
		if (!id) {
			// log('not passed an ID, returning false');
			// log('GlyphrStudioProject.getItemName', 'end');
			return false;
		}

		if (id.startsWith('glyph-')) {
			// known unicode names
			let unicodeName;
			if (forceLongName) {
				unicodeName = unicodeNames[remove(id, 'glyph-')];
			} else {
				unicodeName = shortUnicodeNames[remove(id, 'glyph-')];
			}

			if (unicodeName) {
				// log('got unicode name: ' + un);
				// log('GlyphrStudioProject.getItemName', 'end');
				return unicodeName;
			}
		}

		const item = this.getItem(id);
		const result = item.name || '[name not found]';
		// log(`Returning: ${result}`);
		// log('GlyphrStudioProject.getItemName', 'end');
		return result;
	}

	/**
	 * Makes an SVG Thumbnail
	 * @param {Glyph, Path, or ComponentInstance} item - thing to make the thumbnail of
	 * @returns {String} - SVG icon
	 */
	makeItemThumbnail(item) {
		// log('GlyphrStudioProject.makeItemThumbnail', 'start');
		// log(item);
		const size = 50;
		const padding = 5;
		const scale = (size - padding * 2) / this.totalVertical;
		const itemHeight = this.totalVertical;
		const itemWidth = item?.advanceWidth || item?.parent?.advanceWidth || this.defaultAdvanceWidth;
		const translateX = (size - itemWidth * scale) / 2;
		const translateY = itemHeight * scale - padding;
		const svg = item?.svgPathData || 'H100 V100 H-100 V-100';
		// log(`itemWidth: ${itemWidth}`);
		// log(svg);

		let re = `
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px">
			<path
				transform="translate(${translateX},${translateY}) scale(${scale}, -${scale})"
				d="${svg}"
			/>
		</svg>`;

		// log(re);
		// log('GlyphrStudioProject.makeItemThumbnail', 'end');
		return re;
	}

	/**
	 * Synthetic property.
	 * Ascent + Descent doesn't always have to equal UPM.
	 * So, for calculating the space (mostly for edit-canvas and display-canvas)
	 * it's better to use Ascent + Descent instead of UPM.
	 * @returns {Number} - vertical height in Em
	 */
	get totalVertical() {
		let desc = Math.abs(parseInt(this.settings.font.descent));
		let asc = parseInt(this.settings.font.ascent);
		return desc + asc;
	}

	/**
	 * Synthetic property
	 * For calculating views, it's good to start with an advance width
	 * that makes some sort of sense.
	 * @returns {Number} - width in Em
	 */
	get defaultAdvanceWidth() {
		return parseInt(this.settings.font.upm) / 2;
	}

	/**
	 * For detecting ligatures in sequences of text,
	 * it is necessary to first sort the sequence by length,
	 * then alphabetically.
	 */
	get sortedLigatures() {
		// log(`GlyphrStudioProject GET sortedLigatures`, 'start');

		let result = [];

		Object.keys(this.ligatures).forEach((key) => {
			result.push(this.ligatures[key]);
		});

		result.sort(sortLigatures);

		// log(result);
		// log(`GlyphrStudioProject GET sortedLigatures`, 'end');
		return result;
	}

	forEachItem(fun) {
		// log(`GlyphrStudioProject.forEachItem`, 'start');
		console.time('forEachItem');
		let aggregate = [];
		let counter = 0;
		let result;

		// Glyphs
		for (const id of Object.keys(this.glyphs)) {
			result = fun(this.glyphs[id]);
			aggregate = aggregate.concat(result);
			counter++;
		}

		// Components
		for (const id of Object.keys(this.components)) {
			result = fun(this.components[id]);
			aggregate = aggregate.concat(result);
			counter++;
		}

		// Ligatures
		for (const id of Object.keys(this.ligatures)) {
			result = fun(this.ligatures[id]);
			aggregate = aggregate.concat(result);
			counter++;
		}

		// log(`counter: ${counter}`);
		// log(`aggregate:`);
		// log(aggregate);
		console.timeEnd('forEachItem');
		// log(`GlyphrStudioProject.forEachItem`, 'end');
		return aggregate;
	}

	// --------------------------------------------------------------
	// Adding Items
	// --------------------------------------------------------------

	addNewItem(newItem, objType, newID) {
		let destination;
		if (objType === 'Glyph') {
			destination = this.glyphs;
		}
		if (objType === 'Ligature') {
			destination = this.ligatures;
		}
		if (objType === 'Component') {
			destination = this.components;
		}
		if (objType === 'KernGroup') {
			destination = this.kerning;
		}

		newItem.parent = this;
		newItem.id = newID;
		newItem.objType = objType;
		destination[newID] = newItem;
	}

	/**
	 * Takes generic Objects, and initializes them as Glyphr Studio objects
	 * @param {Object} GlyphrStudioItem - Glyph, Guide, or KernGroup
	 * @param {Object} source - collection of temporary objects to hydrate
	 * @param {String} objType - type of object this is
	 * @param {GlyphrStudioProject} destinationProject - parent project
	 */
	hydrateProjectItems(GlyphrStudioItem, source, objType) {
		// log(`hydrateProjectItems`, 'start');
		// log(`objType: ${objType}`);
		// log(`SOURCE:`);
		// log(source);
		source = source || {};
		let destination;
		if (objType === 'Glyph') destination = this.glyphs;
		if (objType === 'Ligature') destination = this.ligatures;
		if (objType === 'Component') destination = this.components;
		if (objType === 'KernGroup') destination = this.kerning;

		for (const key of Object.keys(source)) {
			let validatedKey = validateItemID(key, objType);
			// log(`\n STARTING key: ${key}`);
			// log(`validatedKey: ${validatedKey}`);

			if (source[key]) {
				destination[validatedKey] = new GlyphrStudioItem(source[key]);
				destination[validatedKey].id = validatedKey;
				destination[validatedKey].objType = objType;
				destination[validatedKey].parent = this;
				// log(`DONE WITH ONE ITEM:`);
				// log(destination[validatedKey]);
			}
		}
		// log(`hydrateProjectItems`, 'end');
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------
export function sortLigatures(a, b) {
	if (a.chars.length === b.chars.length) return a.chars.localeCompare(b.chars);
	else return a.chars.length - b.chars.length;
}

/**
 * Takes a template object of expected keys and default values
 * and an object to import:
 *   Overwrites template values if they exist in the imported object
 *   Ignores extra values in the imported object that aren't in the template
 * @param {Object} template - default values
 * @param {Object} importing - custom values
 * @param {Boolean} trimStrings - remove spaces from strings
 * @returns {Object}
 */
function merge(template = {}, importing = {}, trimStrings = false) {
	// log('glyphr_studio_project - merge', 'start');
	// log(template);

	for (const a of Object.keys(template)) {
		if (typeof template[a] === 'object') {
			if (importing[a]) template[a] = merge(template[a], importing[a]);
		} else {
			if (importing[a]) {
				if (typeof importing[a] === 'string' && trimStrings) template[a] = trim(importing[a]);
				else template[a] = importing[a];
			}
		}
	}
	// log('glyphr_studio_project - merge', 'end');
	return template;
}

function validateItemID(oldID, objType) {
	if (objType === 'Glyph') {
		let suffix = remove(oldID, 'glyph-');
		suffix = validateAsHex(suffix);
		if (suffix) return `glyph-${suffix}`;
	}
	return oldID;
}

/**
 * Generate a unique Project ID so we can recognize a
 * project through file name and project name re-naming
 * @returns {String} - ID
 */
function makeProjectID() {
	const j = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let re = 'g2_';

	for (let i = 0; i < 10; i++) {
		re += j.charAt(Math.floor(round(Math.random() * j.length)));
	}

	return re;
}
