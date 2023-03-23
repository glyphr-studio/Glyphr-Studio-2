import { clone, json, remove, round, trim } from '../common/functions.js';
import { Glyph } from '../project_data/glyph.js';
import { HKern } from '../project_data/h_kern.js';
import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';
import { decToHex, validateAsHex } from '../common/character_ids.js';
import { Maxes, getOverallMaxes } from '../project_data/maxes.js';
// import { log } from '../app/main.js';
import { GlyphRange } from './glyph_range.js';
import { log } from '../app/main.js';

/**
 * Creates a new Glyphr Studio Project
 */
export class GlyphrStudioProject {
	/**
	 * Initialize a project, with defaults
	 * @param {object} newProject - Glyphr Studio Project File JSON
	 */
	constructor(newProject = {}) {
		// log('GlyphrStudioProject.constructor', 'start');

		// Set up all internal default values first
		this.settings = {
			project: {
				name: 'My Font',
				latestVersion: '2.0.0-alpha.2',
				initialVersion: '2.0.0-alpha.1',
				id: false,
				glyphRanges: [],
			},
			app: {
				savePreferences: false,
				stopPageNavigation: true,
				showNonCharPoints: false,
				formatSaveFile: false,
				combinePathsOnExport: false,
				maxCombinePathsOnExport: 30,
				guides: {
					system: {
						transparency: 90,
						showBaseline: true,
						showLeftSide: true,
						showRightSide: true,
					},
				},
				contextGlyphs: {
					showGuides: true,
					transparency: 90,
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
		if (newProject?.settings?.project?.glyphRanges) {
			newProject.settings.project.glyphRanges.forEach((range) => {
				this.settings.project.glyphRanges.push(new GlyphRange(range));
			});
		}
		// log('finished importing Glyph Ranges');
		// log(this.settings.project.glyphRanges);

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
		hydrateProjectItems(Glyph, newProject.components, 'Component', this.components, this);
		// log('finished hydrating components - result:');
		// log(this.components);

		// Glyphs
		// log(`\nStarting glyphs - passed:`);
		// log(newProject.glyphs);
		hydrateProjectItems(Glyph, newProject.glyphs, 'Glyph', this.glyphs, this);
		// log('finished hydrating glyphs - result:');
		// log(this.glyphs);

		// Ligatures
		// log(`\nStarting ligatures - passed:`);
		// log(newProject.ligatures);
		hydrateProjectItems(Glyph, newProject.ligatures, 'Ligature', this.ligatures, this);
		// log('finished hydrating ligatures - result:');
		// log(this.ligatures);

		// Kerning
		// log(`\nStarting kerning - passed:`);
		// log(newProject.kerning);
		hydrateProjectItems(HKern, newProject.kerning, 'HKern', this.kerning, this);
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
	 * @param {boolean} verbose - include extra properties for better readability
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

		/**
		 * Generic iterator for glyphs, ligatures, components, and kerning
		 * @param {object} group - which group to do
		 * @param {string} name - name of the group
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
	// GLYPH GETTERS
	// --------------------------------------------------------------

	/**
	 * Get a glyph by ID, create it if need be
	 * @param {string} id - which Glyph to return
	 * @param {boolean} create - create if it doesn't exist yet
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
		} else {
			// log('NO RESULT FOUND');
		}

		// log(`returning result:`);
		// log(result);
		// log('GlyphrStudioProject.getItem', 'end');
		return result;
	}

	/**
	 * Get a glyph's name based on it's ID
	 * @param {string} id - Glyph ID
	 * @param {boolean} forceLongName - don't use the short Unicode name by default
	 * @returns {string}
	 */
	getItemName(id, forceLongName = false) {
		id = '' + id;
		log('GlyphrStudioProject.getItemName', 'start');
		log('passed ' + id);

		// not passed an id
		if (!id) {
			log('not passed an ID, returning false');
			log('GlyphrStudioProject.getItemName', 'end');
			return false;
		}

		if (id.startsWith('glyph-')) {
			// known unicode names
			const un = forceLongName ? unicodeNames[remove(id, 'glyph-')] : shortUnicodeNames[remove(id, 'glyph-')];
			if (un) {
				log('got unicode name: ' + un);
				log('GlyphrStudioProject.getItemName', 'end');
				return un;
			}
		}

		const item = this.getItem(id);
		const result = item.name || '[name not found]';
		log(`Returning: ${result}`);
		log('GlyphrStudioProject.getItemName', 'end');
		return result;
	}

	/**
	 *
	 * @returns
	 */
	makeItemThumbnail(item) {
		// log('GlyphrStudioProject.makeItemThumbnail', 'start');
		const size = 50;
		const padding = 5;
		const scale = (size - padding * 2) / this.totalVertical;
		const itemHeight = this.totalVertical;
		const itemWidth = item?.advanceWidth || item?.parent?.advanceWidth || this.defaultAdvanceWidth;
		const translateX = (size - itemWidth * scale) / 2;
		const translateY = itemHeight * scale - padding;
		const svg = item.svgPathData;
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
	 * Calculate the overall bounds given every glyph in this font
	 * @returns {object} - font maxes
	 */
	calcFontMaxes() {
		// log(`GSProject.calcFontMaxes`, 'start');

		const fm = {
			maxGlyph: 0x20,
			maxes: new Maxes(),
		};

		// log(`fm starts as`);
		// log(fm);

		let thisGlyph;
		const ranges = this.settings.project.glyphRanges;
		// log(`ranges`);
		// log(ranges);

		ranges.forEach((range) => {
			for (let char = range.begin; char < range.end; char++) {
				thisGlyph = this.getItem(decToHex(char));
				if (thisGlyph) fm.maxes = getOverallMaxes([fm.maxes, thisGlyph.maxes]);
			}
			fm.maxGlyph = Math.max(fm.maxGlyph, range.end);
		});

		for (const lig of Object.keys(this.ligatures)) {
			fm.maxes = getOverallMaxes([fm.maxes, this.ligatures[lig]]);
		}

		// log(`returning fm`);
		// log(fm);
		// log(`GSProject.calcFontMaxes`, 'end');
		return fm;
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
}

export function sortLigatures(a, b) {
	if (a.chars.length === b.chars.length) return a.chars.localeCompare(b.chars);
	else return a.chars.length - b.chars.length;
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

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

/**
 * Takes generic Objects, and initializes them as Glyphr Studio objects
 * @param {Object} GlyphrStudioItem - Glyph, Guide, or HKern
 * @param {Object} source - collection of temporary objects to hydrate
 * @param {String} objType - type of object this is
 * @param {Object} destination - project object for final items
 * @param {GlyphrStudioProject} destinationProject - parent project
 */
function hydrateProjectItems(GlyphrStudioItem, source, objType, destination, destinationProject) {
	log(`hydrateProjectItems`, 'start');
	log(`objType: ${objType}`);
	log(`SOURCE:`);
	log(source);
	source = source || {};
	for (const key of Object.keys(source)) {
		let validatedKey = validateItemID(key, objType);
		log(`\n STARTING key: ${key}`);
		log(`validatedKey: ${validatedKey}`);

		if (source[key]) {
			destination[validatedKey] = new GlyphrStudioItem(source[key]);
			destination[validatedKey].id = validatedKey;
			destination[validatedKey].objType = objType;
			destination[validatedKey].parent = destinationProject;
			log(`DONE WITH ONE ITEM:`);
			log(destination[validatedKey]);
		}
	}
	log(`hydrateProjectItems`, 'end');
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
 * @returns {string} - ID
 */
function makeProjectID() {
	const j = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let re = 'g2_';

	for (let i = 0; i < 10; i++) {
		re += j.charAt(Math.floor(round(Math.random() * j.length)));
	}

	return re;
}
