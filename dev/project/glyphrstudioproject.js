import Guide from '../edit_canvas/guide.js';
import {clone} from '../app/functions.js';
import {makeProjectID} from './project_functions.js';

/* eslint-disable camelcase*/

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
            version: _UI.thisGlyphrStudioVersion,
            versionnum: _UI.thisGlyphrStudioVersionNum,
            initialversionnum: _UI.thisGlyphrStudioVersionNum,
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
            defaultlsb: 20,
            defaultrsb: 20,
            glyphrange: {
                basiclatin: true,
                latinsupplement: false,
                latinextendeda: false,
                latinextendedb: false,
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
        },

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
        newProject.projectSettings.guies = newProject.projectSettings.guides || {};
        newProject.projectSettings.glyphrange = newProject.projectSettings.glyphrange || {};

        // Guides can be custom, so save a copy before merging with templates
        let dataguides = clone(newProject.projectSettings.guides || {});

        // Merge with templates
        if (newProject.projectSettings) {
            this.projectSettings = merge(this.projectSettings, newProject.projectSettings);
            this.projectSettings.glyphrange.custom = newProject.projectSettings.glyphrange.custom || [];
        }
        this.projectSettings.projectid = this.projectSettings.projectid || makeProjectID();
        this.projectSettings.descent = -1 * Math.abs(this.projectSettings.descent);
        // debug('\t finished merging projectSettings');
        // debug(this.projectSettings);


        // Guides
        hydrateGlyphrObjectList(Guide, dataguides, this.projectSettings.guides);
        // debug('\t finished hydrating guides');

        // Metadata
        if (newProject.metadata) this.metadata = merge(this.metadata, newProject.metadata, true);
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
}


/**
 * Takes a template object of expected keys and default values
 * and an object to import:
 *   Overwites template values if they exist in the imported object
 *   Ignores extra values in the imported object that aren't in the template
 * @param {Object} template - default values
 * @param {Object} importing - custom values
 * @param {Boolean} trim - remove spaces from strings
 * @returns {Object}
 */
function merge(template, importing, trim) {
    for (let a in template) {
        if (template.hasOwnProperty(a)) {
            if (typeof template[a] === 'object') {
                if (importing.hasOwnProperty(a)) template[a] = merge(template[a], importing[a]);
            } else {
                if (importing.hasOwnProperty(a)) {
                    if (typeof importing[a] === 'string' && trim) template[a] = removeEmptyStringInputs(importing[a]);
                    else template[a] = importing[a];
                }
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
function hydrateGlyphrObjectList(GlyphrStudioItem, source, destination) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            destination[key] = new GlyphrStudioItem(source[key]);
        }
    }
}
