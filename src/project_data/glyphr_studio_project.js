import { Glyph } from '../project_data/glyph.js';
import { HKern } from '../project_data/h_kern.js';
import { clone, round, trim } from '../common/functions.js';
import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';
import { decToHex, hexToHTML, basicLatinOrder, normalizeHex } from '../common/unicode.js';
import { Maxes, getOverallMaxes } from '../project_data/maxes.js';

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
		this.projectSettings = {
			// Internal Stuff
			versionName: 'Version 2 Alpha',
			version: '2.0.0',
			initialVersion: '2.0.0',
			projectID: false,

			// Font Metrics
			name: 'My Font',
			upm: 1000,
			ascent: 700,
			descent: -300,
			capHeight: 675,
			xHeight: 400,
			lineGap: 250,
			italicAngle: 0,
			overshoot: 10,
			glyphRanges: [{ begin: 0x0000, end: 0x007f, name: 'Basic Latin' }],
			filterNonCharPoints: true,

			// UI stuff
			combinePathsOnExport: false,
			maxCombinePathsOnExport: 30,
			stopPageNavigation: true,
			formatSaveFile: true,
			guides: {
				system: {
					showBaseline: true,
					showLeftSide: true,
					showRightSide: true
				}
			},
			showContextGlyphGuides: true,
		};

		this.metadata = {
			// Shared Properties
			shared: '{{sectionbreak}}',
			font_family: 'My Font',
			font_style: 'normal',
			panose_1: '2 0 0 0 0 0 0 0 0 0',

			// OTF Properties
			otf: '{{sectionbreak}}',
			designer: '',
			designerURL: '',
			manufacturer: '',
			manufacturerURL: '',
			license: '',
			licenseURL: '',
			version: '',
			description: '',
			copyright: '',
			trademark: '',

			// SVG Properties
			svg: '{{sectionbreak}}',
			// 'units_per_em': 0,
			// 'accent_height': 0,
			// 'ascent': 0,
			// 'cap_height': 0,
			// 'x_height': 0,
			// 'descent': 0,
			// 'bbox': 0,
			// 'unicode_range': 0,
			font_variant: 'normal',
			font_weight: 400,
			font_stretch: 'normal',
			stemv: 0,
			stemh: 0,
			slope: 0,
			// 'font_size': 'all',
			// 'widths': 0,
			// 'ideographic': 0,
			// 'alphabetic': 0,
			// 'mathematical': 0,
			// 'hanging': 0,
			// 'v_ideographic': 0,
			// 'v_alphabetic': 0,
			// 'v_mathematical': 0,
			// 'v_hanging': 0,
			underline_position: -50,
			underline_thickness: 10,
			strikethrough_position: 300,
			strikethrough_thickness: 10,
			overline_position: 750,
			overline_thickness: 10,
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

		// Project Settings
		newProject.projectSettings = newProject.projectSettings || {};
		newProject.projectSettings.guides = newProject.projectSettings.guides || {};
		newProject.projectSettings.glyphRanges = newProject.projectSettings.glyphRanges || [];

		// Guides can be custom, so save a copy before merging with templates
		// let dataGuides = clone(newProject.projectSettings.guides || {});

		// Merge with templates
		if (newProject.projectSettings) {
			// log('merging projectSettings from newProject');
			this.projectSettings = merge(this.projectSettings, newProject.projectSettings);
			this.projectSettings.glyphRanges = newProject.projectSettings.glyphRanges || [];
		}
		this.projectSettings.projectID = this.projectSettings.projectID || makeProjectID();
		this.projectSettings.descent = -1 * Math.abs(this.projectSettings.descent);
		// log('finished merging projectSettings');
		// log(this.projectSettings);

		// Guides
		// hydrateGlyphrObjectList(Guide, dataGuides, this.projectSettings.guides);
		// log('finished hydrating guides');

		// Metadata
		if (newProject.metadata) {
			// log('merging metadata from newProject');
			this.metadata = merge(this.metadata, newProject.metadata, true);
		}
		// log('finished merging metadata');
		// log(this.metadata);

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
			projectSettings: clone(this.projectSettings),
			metadata: clone(this.metadata),
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
	getGlyph(id, create = false) {
		// log('GlyphrStudioProject.getGlyph', 'start');
		// log('passed: ' + id + ' create: ' + create);

		// --------------------------------------------------------------
		// No ID
		// --------------------------------------------------------------
		if (!id) {
			// log('Not passed an ID, returning false');
			// log('GlyphrStudioProject.getGlyph', 'end');
			return false;
		}

		id = '' + id;
		let result;

		if (this.ligatures && id.indexOf('0x', 2) > -1) {
			// --------------------------------------------------------------
			// Ligature
			// --------------------------------------------------------------
			result = this.ligatures[id];
			if (result) {
				// log(`Returning found Ligature`);
				// log('GlyphrStudioProject.getGlyph', 'end');
				return result;
			} else if (create) {
				this.ligatures[id] = new Glyph({ id: id });
				// log('Create was true, returning a new Ligature.');
				// log('GlyphrStudioProject.getGlyph', 'end');
				return this.ligatures[id];
			}
		} else if (this.glyphs && id.indexOf('0x') > -1) {
			// --------------------------------------------------------------
			// Glyph
			// --------------------------------------------------------------
			let normalHex = '' + normalizeHex(id);
			result = this.glyphs[normalHex];
			if (result) {
				// log('Returning found Glyph');
				// log('GlyphrStudioProject.getGlyph', 'end');
				return result;
			} else if (create) {
				this.glyphs[id] = new Glyph({ id: id });
				// log('Create was true, returning a new Glyph.');
				// log('GlyphrStudioProject.getGlyph', 'end');
				return this.glyphs[id];
			}
		} else if (this.components && this.components[id]) {
			// --------------------------------------------------------------
			// Component
			// --------------------------------------------------------------
			result = this.components[id];
			// log('Returning whatever component[id] happend to be');
			// log('GlyphrStudioProject.getGlyph', 'end');
			return this.components[id] || false;
		}

		// --------------------------------------------------------------
		// No Result
		// --------------------------------------------------------------
		// log('NO RESULT FOUND');
		// log('GlyphrStudioProject.getGlyph', 'end');
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

		const cobj = this.getGlyph(id);
		if (id.indexOf('0x', 2) > -1) {
			// ligature
			// log('ligature - returning ' + hexToHTML(id));
			return cobj.name || hexToHTML(id);
		} else {
			// Component
			// log('getGlyphName - inexplicably fails, returning [name not found]\n');
			return cobj.name || '[name not found]';
		}

		// log('getGlyphName - returning nothing', 'end');
	}

	/**
	 * Calculate the overall bounds given every glyph in this font
	 * @returns {object} - font maxes
	 */
	calcFontMaxes() {
		const fm = {
			numberOfGlyphs: 0,
			maxGlyph: 0x20,
			maxes: new Maxes(),
		};

		let thisGlyph;
		const cr = this.projectSettings.glyphRanges;

		// if (cr.basicLatin) {
		//   for (let i = 0; i < basicLatinOrder.length; i++) {
		//     thisGlyph = this.getGlyph(basicLatinOrder[i]);
		//     fm.numberOfGlyphs++;
		//     fm.maxGlyph = Math.max(fm.maxGlyph, basicLatinOrder[i]);
		//     fm.maxes = getOverallMaxes(fm.maxes, thisGlyph.maxes);
		//   }
		// }

		if (cr.length) {
			for (let c = 0; c < cr.length; c++) {
				for (let char = cr[c].begin; char < cr[c].end; char++) {
					thisGlyph = this.getGlyph(decToHex(char));
					fm.numberOfGlyphs++;
					fm.maxGlyph = Math.max(fm.maxGlyph, basicLatinOrder[basicLatinOrder.length]);
					fm.maxes = getOverallMaxes(fm.maxes, thisGlyph.maxes);
					// count++;
				}
			}
		}

		// Ligatures!

		return fm;
	}
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
