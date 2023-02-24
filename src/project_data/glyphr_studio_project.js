import { Glyph } from '../project_data/glyph.js';
import { HKern } from '../project_data/h_kern.js';
import { clone, round, trim } from '../common/functions.js';
import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';
import { decToHex, hexToHTML, normalizeHex } from '../common/unicode.js';
import { Maxes, getOverallMaxes } from '../project_data/maxes.js';
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
		// log('passed newProject:');
		// log(newProject);

		// Set up all internal default values first
		this.settings = {
			project: {
				name: 'My Font',
				latestVersion: '2.0.0-alpha.2',
				initialVersion: '2.0.0-alpha.1',
				id: false,
				glyphRanges: [{ begin: 0x0021, end: 0x007f, name: 'Basic Latin' }],
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
		// log("\t passed: ");
		// log(newProject);

		// Keep glyph ranges of passed project
		if (newProject?.settings?.project?.glyphRanges) {
			this.settings.project.glyphRanges = newProject.settings.project.glyphRanges;
		}

		// Merge with templates
		if (newProject.settings) {
			// log('merging settings from newProject');
			this.settings = merge(this.settings, newProject.settings);
		}
		this.settings.project.id = this.settings.project.id || makeProjectID();
		this.settings.font.descent = -1 * Math.abs(this.settings.font.descent);
		// log('finished merging settings');
		// log(this.settings);

		// Components
		hydrateGlyphrObjectList(Glyph, newProject.components, this.components);
		// log('finished hydrating components');

		// Glyphs
		hydrateGlyphrObjectList(Glyph, newProject.glyphs, this.glyphs);
		// log('finished hydrating glyphs');
		// log(this.glyphs);

		// Ligatures
		hydrateGlyphrObjectList(Glyph, newProject.ligatures, this.ligatures);
		// log('finished hydrating ligatures');

		// Kerning
		hydrateGlyphrObjectList(HKern, newProject.kerning, this.kerning);
		// log('finished hydrating kern pairs');

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
	getItem(id, create = false) {
		// log('GlyphrStudioProject.getItem', 'start');
		// log('passed: ' + id + ' create: ' + create);

		// --------------------------------------------------------------
		// No ID
		// --------------------------------------------------------------
		if (!id) {
			// log('Not passed an ID, returning false');
			// log('GlyphrStudioProject.getItem', 'end');
			return false;
		}

		id = '' + id;
		let result;

		if (this.ligatures && id.indexOf('liga') > -1) {
			// --------------------------------------------------------------
			// Ligature
			// --------------------------------------------------------------
			// log(`detected LIGATURE`);

			result = this.ligatures[id];
			if (result) {
				// log(`Returning found Ligature`);
				// log('GlyphrStudioProject.getItem', 'end');
				return result;
			} else if (create) {
				this.ligatures[id] = new Glyph({ id: id });
				// log('Create was true, returning a new Ligature.');
				// log('GlyphrStudioProject.getItem', 'end');
				return this.ligatures[id];
			}
		} else if (this.glyphs && id.indexOf('0x') > -1) {
			// --------------------------------------------------------------
			// Glyph
			// --------------------------------------------------------------
			// log(`detected GLYPH`);

			let normalHex = '' + normalizeHex(id);
			// log(`normalHex: ${normalHex}`);

			result = this.glyphs[normalHex];
			if (result) {
				// log('Returning found Glyph');
				// log('GlyphrStudioProject.getItem', 'end');
				return result;
			} else if (create) {
				this.glyphs[id] = new Glyph({ id: id });
				// log('Create was true, returning a new Glyph.');
				// log('GlyphrStudioProject.getItem', 'end');
				return this.glyphs[id];
			}
		} else if (this.components && this.components[id]) {
			// --------------------------------------------------------------
			// Component
			// --------------------------------------------------------------
			// log(`detected COMPONENT`);

			result = this.components[id];
			// log('Returning whatever component[id] happened to be');
			// log('GlyphrStudioProject.getItem', 'end');
			return this.components[id] || false;
		}

		// --------------------------------------------------------------
		// No Result
		// --------------------------------------------------------------
		// log('NO RESULT FOUND');
		// log('GlyphrStudioProject.getItem', 'end');
		return false;
	}

	/**
	 * Get the type of glyph based on it's ID
	 * @param {string} id - Glyph ID
	 * @returns {string}
	 */
	getGlyphType(id) {
		if (id.indexOf('0x', 2) > -1) return 'Ligature';
		else if (id.indexOf('0x') > -1) return 'Glyph';
		else return 'Component';
	}

	/**
	 * Get a glyph's name based on it's ID
	 * @param {string} id - Glyph ID
	 * @param {boolean} forceLongName - don't use the short Unicode name by default
	 * @returns {string}
	 */
	getGlyphName(id, forceLongName = false) {
		id = '' + id;
		// log('GlyphrStudioProject.getGlyphName', 'start');
		// log('passed ' + id);

		// not passed an id
		if (!id) {
			// log('not passed an ID, returning false');
			return false;
		}

		// known unicode names
		const un = forceLongName ? unicodeNames[id] : shortUnicodeNames[id];
		if (un) {
			// log('got unicode name: ' + un);
			return un;
		}

		const item = this.getItem(id);
		if (id.indexOf('0x', 2) > -1) {
			// ligature
			// log('ligature - returning ' + hexToHTML(id));
			return item.name || hexToHTML(id);
		} else {
			// Component
			// log('getGlyphName - inexplicably fails, returning [name not found]\n');
			return item.name || '[name not found]';
		}

		// log('getGlyphName - returning nothing', 'end');
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

		// TODO Ligatures!

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

		result.sort(function (a, b) {
			if (a.chars.length === b.chars.length) return a.chars.localeCompare(b.chars);
			else return a.chars.length - b.chars.length;
		});

		// log(result);
		// log(`GlyphrStudioProject GET sortedLigatures`, 'end');
		return result;
	}
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
 * @param {Object} destination - project object for final items
 */
function hydrateGlyphrObjectList(GlyphrStudioItem, source, destination) {
	source = source || {};
	for (const key of Object.keys(source)) {
		if (source[key]) {
			destination[normalizeHex(key)] = new GlyphrStudioItem(source[key]);
		}
	}
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
