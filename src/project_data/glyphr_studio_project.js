import { getGlyphrStudioApp } from '../app/main.js';
import { charsToHexArray, validateAsHex } from '../common/character_ids.js';
import { clone, remove, round, trim } from '../common/functions.js';
import { TextBlockOptions } from '../display_canvas/text_block_options.js';
import { getParentRange } from '../lib/unicode/unicode_blocks.js';
import { getUnicodeName, getUnicodeShortName } from '../lib/unicode/unicode_names.js';
import { unicodeNonCharPointNames } from '../lib/unicode/unicode_names_0_bmp.js';
import { makeComponentID } from '../pages/components.js';
import { makeKernGroupID } from '../pages/kerning.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { Glyph } from '../project_data/glyph.js';
import { Guide } from '../project_editor/guide.js';
import { CharacterRange } from './character_range.js';
import { KernGroup } from './kern_group.js';

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
		// log(`\n⮟newProject⮟`);
		// log(newProject);
		// Set up all internal default values first
		this.settings = {
			project: {
				name: 'My Font',
				latestVersion: false,
				initialVersion: false,
				id: false,
				characterRanges: [],
			},
			app: {
				savePreferences: false,
				stopPageNavigation: true,
				autoSave: true,
				showNonCharPoints: false,
				itemChooserPageSize: 256,
				formatSaveFile: false,
				moveShapesOnSVGDragDrop: false,
				guides: {
					drawGuidesOnTop: false,
					systemShowGuides: true,
					systemShowLabels: false,
					systemTransparency: 70,
					systemGuides: ['baseline', 'leftSide', 'rightSide'],
					customShowGuides: true,
					customShowLabels: false,
					customTransparency: 70,
					custom: [],
				},
				contextCharacters: {
					showCharacters: false,
					characterTransparency: 20,
					showGuides: true,
					guidesTransparency: 70,
				},
				saveLivePreviews: true,
				livePreviews: [],
				previewText: false,
			},
			font: {
				family: 'My Font',
				style: 'Regular',
				version: '1.0',
				description: '',
				panose: '0 0 0 0 0 0 0 0 0 0',
				upm: 2048,
				ascent: 1550,
				descent: -440,
				capHeight: 1480,
				xHeight: 1100,
				overshoot: 30,
				lineGap: 58,
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

		// Settings
		if (newProject.settings) {
			// log('merging settings from newProject');
			this.settings = merge(this.settings, newProject.settings);
		}

		// Project version
		const app = getGlyphrStudioApp();
		this.settings.project.latestVersion = app.version;
		this.settings.project.initialVersion = app.version;

		// Project ID
		this.settings.project.id = this.settings.project.id || makeProjectID();

		// Guides
		const newGuides = newProject?.settings?.app?.guides;
		if (newGuides?.systemGuides) {
			this.settings.app.guides.systemGuides = clone(newGuides.systemGuides);
		}
		if (newGuides?.custom) {
			this.settings.app.guides.custom = [];
			newGuides.custom.forEach((guide) => this.settings.app.guides.custom.push(new Guide(guide)));
		}

		// Glyph Ranges
		let newRanges = newProject?.settings?.project?.characterRanges;
		if (newRanges) {
			this.settings.project.characterRanges = [];
			newRanges.forEach((range) => {
				this.settings.project.characterRanges.push(new CharacterRange(range));
			});
			if (this.settings.project.characterRanges.length <= 0) this.enableRangeThatContains('0x41');
		}
		// log('finished importing Glyph Ranges');
		// log(this.settings.project.characterRanges);

		// Validate descent
		this.settings.font.descent = -1 * Math.abs(this.settings.font.descent);

		// Live Previews
		const newPreviews = newProject?.settings?.app?.livePreviews;
		if (newPreviews) {
			this.settings.app.livePreviews = [];
			this.settings.app.livePreviews = newPreviews.map((option) => new TextBlockOptions(option));
		}

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

		// log(`\n⮟this⮟`);
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

		// Overwriting characterRanges with .save() version
		savedProject.settings.project.characterRanges = [];
		this.settings.project.characterRanges.forEach((range) => {
			savedProject.settings.project.characterRanges.push(range.save());
		});

		// Overwriting livePreviews with .save() version
		savedProject.settings.app.livePreviews = [];
		this.settings.app.livePreviews.forEach((preview) => {
			savedProject.settings.app.livePreviews.push(preview.save());
		});

		// Overwriting guides with .save() version
		savedProject.settings.app.guides.custom = [];
		this.settings.app.guides.custom.forEach((guide) => {
			savedProject.settings.app.guides.custom.push(guide.save());
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
	getItem(id, forceCreateItem = false) {
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
			if (!result && forceCreateItem) {
				// log(`forceCreateItem with id ${id}`);
				this.addItemByType(new Glyph({ id: id }), 'Ligature', id);
				result = this.ligatures[id];
			}
		} else if (this.glyphs && id.startsWith('glyph-')) {
			// log(`detected GLYPH`);
			id = `glyph-${validateAsHex(id.substring(6))}`;
			result = this.glyphs[id] || false;
			if (!result && forceCreateItem) {
				// log(`forceCreateItem with id ${id}`);
				this.addItemByType(new Glyph({ id: id }), 'Glyph', id);
				result = this.glyphs[id];
			}
		} else if (this.components && id.startsWith('comp-')) {
			// log(`detected COMPONENT`);
			result = this.components[id] || false;
			if (!result && forceCreateItem) {
				// log(`forceCreateItem with id ${id}`);
				this.addItemByType(new Glyph({ id: id }), 'Component', id);
				result = this.components[id];
			}
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
	 * Takes a Glyphr Studio Glyph Element, and adds it to the appropriate
	 * place in this project, based on the objType value.
	 * @param {Object} newItem - Glyphr Studio Glyph Element
	 * @param {String} objType Glyph, Ligature, Component, or KernGroup
	 * @param {String} newID - Required for Glyph, optional for others
	 * @returns Created object
	 */
	addItemByType(newItem, objType, newID = false) {
		let destination;
		if (objType === 'Glyph') {
			destination = this.glyphs;
		}
		if (objType === 'Ligature') {
			destination = this.ligatures;
			if (!newID) newID = makeLigatureID(newItem.chars);
		}
		if (objType === 'Component') {
			destination = this.components;
			if (!newID) newID = makeComponentID();
		}
		if (objType === 'KernGroup') {
			destination = this.kerning;
			if (!newID) newID = makeKernGroupID(this.kerning);
		}

		newItem.id = newID;
		newItem.objType = objType;
		newItem.parent = this;
		destination[newID] = newItem;

		return destination[newID];
	}

	/**
	 * Finds the appropriate Unicode Range and enables it,
	 * given a single character.
	 * @param {Number} hex - Unicode Hex ID number
	 */
	enableRangeThatContains(hex) {
		// log(`GlyphrStudioProject.enableRangeThatContains`, 'start');
		// log(`hex: ${hex}`);
		const parentRange = new CharacterRange(getParentRange(hex));
		const projectRanges = this.settings.project.characterRanges;
		// log(`\n⮟parentRange⮟`);
		// log(parentRange);
		if (!projectRanges.find((range) => range.name === parentRange.name)) {
			projectRanges.push(parentRange);

			if (unicodeNonCharPointNames[hex]) this.settings.app.showNonCharPoints = true;
		}
		// log(`\n⮟projectRanges⮟`);
		// log(projectRanges);
		// log(`GlyphrStudioProject.enableRangeThatContains`, 'end');
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
				unicodeName = getUnicodeName(remove(id, 'glyph-'));
			} else {
				unicodeName = getUnicodeShortName(remove(id, 'glyph-'));
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

	/**
	 * Returns an array that sorts components by ID
	 */
	get sortedComponents() {
		// log(`GlyphrStudioProject GET sortedComponents`, 'start');

		let result = [];

		Object.keys(this.components).forEach((key) => {
			result.push(this.components[key]);
		});

		result.sort((a, b) => a.name - b.name);

		// log(result);
		// log(`GlyphrStudioProject GET sortedComponents`, 'end');
		return result;
	}

	/**
	 * Returns an array that sorts kern groups by ID
	 */
	get sortedKernGroups() {
		// log(`GlyphrStudioProject GET sortedKernGroups`, 'start');

		let result = [];

		Object.keys(this.kerning).forEach((key) => {
			this.kerning[key].suffix = parseInt(key.substring(5));
			result.push(this.kerning[key]);
		});

		result.sort((a, b) => a.suffix - b.suffix);

		// log(result);
		// log(`GlyphrStudioProject GET sortedKernGroups`, 'end');
		return result;
	}

	forEachItem(fun) {
		// log(`GlyphrStudioProject.forEachItem`, 'start');
		// console.time('forEachItem');
		let aggregate = [];
		// let counter = 0;
		let result;

		// Glyphs
		for (const id of Object.keys(this.glyphs)) {
			result = fun(this.glyphs[id]);
			aggregate = aggregate.concat(result);
			// counter++;
		}

		// Components
		for (const id of Object.keys(this.components)) {
			result = fun(this.components[id]);
			aggregate = aggregate.concat(result);
			// counter++;
		}

		// Ligatures
		for (const id of Object.keys(this.ligatures)) {
			result = fun(this.ligatures[id]);
			aggregate = aggregate.concat(result);
			// counter++;
		}

		// log(`counter: ${counter}`);
		// log(`aggregate:`);
		// log(aggregate);
		// console.timeEnd('forEachItem');
		// log(`GlyphrStudioProject.forEachItem`, 'end');
		return aggregate;
	}

	// --------------------------------------------------------------
	// Adding Items
	// --------------------------------------------------------------

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
		// let destination;
		// if (objType === 'Glyph') destination = this.glyphs;
		// if (objType === 'Ligature') destination = this.ligatures;
		// if (objType === 'Component') destination = this.components;
		// if (objType === 'KernGroup') destination = this.kerning;

		for (const key of Object.keys(source)) {
			let validatedKey = validateItemID(key, objType);
			// log(`\n STARTING key: ${key}`);
			// log(`validatedKey: ${validatedKey}`);
			if (source[key]) {
				this.addItemByType(new GlyphrStudioItem(source[key]), objType, validatedKey);
				// destination[validatedKey] = new GlyphrStudioItem(source[key]);
				// destination[validatedKey].id = validatedKey;
				// destination[validatedKey].objType = objType;
				// destination[validatedKey].parent = this;
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

/**
 * Special logic to sort an array of Ligatures
 * @param {Glyph} a - Ligature
 * @param {Glyph} b - Ligature
 * @returns {Number} - sort order
 */
export function sortLigatures(a, b) {
	// log(`sortLigatures`, 'start');
	// log(`a: ${a.chars}`);
	// log(`b: ${b.chars}`);

	if (a.chars.length === b.chars.length) {
		// log(`same length`);

		// log(`sortLigatures`, 'end');
		return a.chars.localeCompare(b.chars);
	} else {
		// log(`sortLigatures`, 'end');
		return b.chars.length - a.chars.length;
	}
}

/**
 * Taking old format IDs and updating them
 * @param {String} oldID - old hex-only format for glyph ID
 * @param {String} objType - making sure objType === 'Glyph'
 * @returns {String} - validated ID
 */
export function validateItemID(oldID, objType) {
	if (objType === 'Glyph') {
		let suffix = remove(oldID, 'glyph-');
		suffix = validateAsHex(suffix);
		if (suffix) return `glyph-${suffix}`;
	}
	return oldID;
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
export function merge(template = {}, importing = {}, trimStrings = false) {
	// log('glyphr_studio_project - merge', 'start');
	// log(`\n⮟importing⮟`);
	// log(importing);
	// log(`\n⮟template⮟`);
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

/**
 * Generate a unique Project ID so we can recognize a
 * project through file name and project name re-naming
 * @returns {String} - ID
 */
export function makeProjectID() {
	const j = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let re = 'g2_';

	for (let i = 0; i < 10; i++) {
		re += j.charAt(Math.floor(round(Math.random() * j.length)));
	}

	return re;
}
