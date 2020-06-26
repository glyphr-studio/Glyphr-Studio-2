import Glyph from '../glyph_elements/glyph.js';
import HKern from '../glyph_elements/h_kern.js';
import { debug, clone, round, trim } from '../common/functions.js';
import { unicodeNames, shortUnicodeNames } from '../lib/unicode_names.js';
import { decToHex, hexToHTML, basicLatinOrder } from '../common/unicode.js';
import Maxes, { getOverallMaxes } from '../glyph_elements/maxes.js';
import { getCurrentProject } from '../app/main.js';

/**
 * Creates a new Glyphr Studio Project
 */
export default class GlyphrStudioProject {
  /**
   * Initialize a project, with defaults
   * @param {object} newProject - Glyphr Studio Project File JSON
   */
  constructor(newProject = {}) {
    // Set up all default values first
    this.projectSettings = {
      // Internal Stuff
      versionName: 'Version 2 Alpha',
      version: '2.0.0',
      initialVersion: '2.0.0',
      projectid: false,

      // Font Metrics
      name: 'My Font',
      upm: 1000,
      ascent: 700,
      descent: -300,
      capheight: 675,
      xheight: 400,
      lineGap: 250,
      italicangle: 0,
      griddivisions: 10,
      overshoot: 10,
      defaultLSB: 20,
      defaultRSB: 20,
      glyphrange: {
        basicLatin: true,
        latinSupplement: false,
        latinExtendedA: false,
        latinExtendedB: false,
        custom: [],
        filternoncharpoints: true,
      },

      // UI stuff
      pointsize: 7,
      spinnervaluechange: 1,
      renderpointssnappedtogrid: true,
      combineshapesonexport: false,
      maxcombineshapesonexport: 30,
      svgprecision: 3,
      showkeyboardtipsicon: true,
      stopPageNavigation: true,
      formatsavefile: true,
      showoutline: false,
      showfill: true,
      guides: {},
      snaptogrid: false,
      snaptoguides: false,
      showcontextglyphguides: true,
      colors: {
        glyphfill: 'rgb(0,0,0)',
        glyphoutline: 'rgb(0,0,0)',
        gridtransparency: 85,
        systemguidetransparency: 75,
        customguidetransparency: 50,
        contextglyphtransparency: 40,
        guide_dark: 'rgb(204,81,0)',
        guide_med: 'rgb(255,132,51)',
        guide_light: 'rgb(255,193,153)',
      },
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
    // debug("\t passed: ");
    // debug(newProject);

    // Project Settings
    newProject.projectSettings = newProject.projectSettings || {};
    newProject.projectSettings.guides = newProject.projectSettings.guides || {};
    newProject.projectSettings.glyphrange =
      newProject.projectSettings.glyphrange || {};

    // Guides can be custom, so save a copy before merging with templates
    // let dataGuides = clone(newProject.projectSettings.guides || {});

    // Merge with templates
    if (newProject.projectSettings) {
      this.projectSettings = merge(
        this.projectSettings,
        newProject.projectSettings
      );
      this.projectSettings.glyphrange.custom =
        newProject.projectSettings.glyphrange.custom || [];
    }
    this.projectSettings.projectid =
      this.projectSettings.projectid || makeProjectID();
    this.projectSettings.descent = -1 * Math.abs(this.projectSettings.descent);
    // debug('\t finished merging projectSettings');
    // debug(this.projectSettings);

    // Guides
    // hydrateGlyphrObjectList(Guide, dataGuides, this.projectSettings.guides);
    // debug('\t finished hydrating guides');

    // Metadata
    if (newProject.metadata)
      this.metadata = merge(this.metadata, newProject.metadata, true);
    // debug('\t finished merging metadata');

    // Components
    hydrateGlyphrObjectList(Glyph, newProject.components, this.components);
    // debug('\t finished hydrating components');

    // Glyphs
    hydrateGlyphrObjectList(Glyph, newProject.glyphs, this.glyphs);
    // debug('\t finished hydrating glyphs');

    // Ligatures
    hydrateGlyphrObjectList(Glyph, newProject.ligatures, this.ligatures);
    // debug('\t finished hydrating ligatures');

    // Kerning
    hydrateGlyphrObjectList(HKern, newProject.kerning, this.kerning);
    // debug('\t finished hydrating kern pairs');
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
    // debug('\n getGlyph - START');
    // debug('\t passed: ' + id + ' create: ' + create);

    if (!id) {
      // debug('\t Not passed an ID, returning false');
      return false;
    }

    id = '' + id;
    let rechar;

    if (this.ligatures && id.indexOf('0x', 2) > -1) {
      rechar = this.ligatures[id];
      // debug('\t retrieved ' + rechar + ' from ligatures.');
      if (rechar) {
        return rechar;
      } else if (create) {
        // debug('\t create was true, returning a new ligature.');
        this.ligatures[id] = new Glyph({ glyphhex: id });
        return this.ligatures[id];
      }
    } else if (this.glyphs && id.indexOf('0x') > -1) {
      rechar = this.glyphs[id];
      // debug('\t retrieved ' + rechar + ' from glyphs.');
      if (rechar) {
        return rechar;
      } else if (create) {
        debug('\t create was true, returning a new char.');
        this.glyphs[id] = new Glyph({ glyphhex: id });
        return this.glyphs[id];
      }
    } else if (this.components) {
      // debug('\t component, retrieved');
      // debug(this.components[id]);
      return this.components[id] || false;
    } else {
      // debug('getGlyph - returning FALSE\n');
      return false;
    }
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
    // debug('\n getGlyphName');
    // debug('\t passed ' + id);

    // not passed an id
    if (!id) {
      // debug('\t not passed an ID, returning false');
      return false;
    }

    // known unicode names
    const un = forceLongName ? unicodeNames[id] : shortUnicodeNames[id];
    if (un) {
      // debug('\t got unicode name: ' + un);
      return un;
    }

    const cobj = getCurrentProject().getGlyph(id);
    if (id.indexOf('0x', 2) > -1) {
      // ligature
      // debug('\t ligature - returning ' + hexToHTML(id));
      return cobj.name || hexToHTML(id);
    } else {
      // Component
      // debug('getGlyphName - inexplicably fails, returning [name not found]\n');
      return cobj.name || '[name not found]';
    }

    // debug(' getGlyphName - returning nothing - END\n');
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
    const cr = this.projectSettings.glyphrange;

    if (cr.basicLatin) {
      for (let i = 0; i < basicLatinOrder.length; i++) {
        thisGlyph = this.getGlyph(basicLatinOrder[i]);
        fm.numberOfGlyphs++;
        fm.maxGlyph = Math.max(fm.maxGlyph, basicLatinOrder[i]);
        fm.maxes = getOverallMaxes(fm.maxes, thisGlyph.maxes);
      }
    }

    if (cr.custom.length) {
      for (let c = 0; c < cr.custom.length; c++) {
        for (let char = cr.custom[c].begin; char < cr.custom[c].end; char++) {
          thisGlyph = this.getGlyph(decToHex(char));
          fm.numberOfGlyphs++;
          fm.maxGlyph = Math.max(
            fm.maxGlyph,
            basicLatinOrder[basicLatinOrder.length]
          );
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
  debug(template);

  for (const a of Object.keys(template)) {
    if (typeof template[a] === 'object') {
      if (importing[a]) template[a] = merge(template[a], importing[a]);
    } else {
      if (importing[a]) {
        if (typeof importing[a] === 'string' && trimStrings)
          template[a] = trim(importing[a]);
        else template[a] = importing[a];
      }
    }
  }

  return template;
}

/**
 * Takes generic Objects, and initializes them as Glyphr Studio objects
 * @param {Object} GlyphrStudioItem - Glyph, Guide, or HKern
 * @param {Object} source - collection of temporary objects to hydrate
 * @param {Object} destination - project object for final items
 */
function hydrateGlyphrObjectList(GlyphrStudioItem, source = {}, destination) {
  for (const key of Object.keys(source)) {
    if (source[key]) {
      destination[key] = new GlyphrStudioItem(source[key]);
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
