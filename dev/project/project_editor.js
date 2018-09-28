import GlyphrStudioProject from './glyphr_studio_project.js';
import History from './history.js';
import {decToHex} from '../common/unicode.js';
import {round} from '../common/functions.js';

/**
 * Creates a new Glyphr Studio Project Editor.
 * An Editor is all the UI it takes to edit a project,
 * including Pages, Panels, History, Saved State,
 * Import/Export, etc.
 *
 * Many Project Editors can be run side-by-side,
 * editing many Glyphr Studio Projects. Could be
 * in tabs or separate windows, but the App has
 * access to all the Project Editors, enabling
 * cross-project features like glyph copy/paste.
 */
export default class ProjectEditor {
    /**
     * Initialize a project editor, with defaults
     * @param {object} newEditor - Glyphr Studio Project File JSON
     */
    constructor({
        project = {},
        selectedWorkItems = {},
        } = {}) {
        this.project = project;
        this.selectedWorkItems = selectedWorkItems;

        // Navigation
        this.nav = {
            page: 'openproject',
            panel: false,
            lastPanel: 'npChooser',
            hamburger: {
                state: 11,
                direction: -1,
                timeout: {},
            },
            projectSaved: true,
            stopPageNavigation: true,
        };

        // History
        this.history = {};
        this.history['glyph edit'] = new History('glyphs', this);
        this.history.components = new History('components', this);
        this.history.ligatures = new History('ligatures', this);
        this.history.kerning = new History('kerning', this);
    }


    // --------------------------------------------------------------
    // Project
    // --------------------------------------------------------------

    /**
     * Get the project for this editor
     * @returns {GlyphrStudioProject}
     */
    get project() {
        if (this._project && this._project !== {}) return this._project;
        else {
            this._project = new GlyphrStudioProject();
            return this._project;
        }
    }

    /**
     * Set the project for this editor
     * @param {GlyphrStudioProject} gsp - project to set
     * @returns {GlyphrStudioProject}
     */
    set project(gsp) {
        this._project = new GlyphrStudioProject(gsp);
        return this._project;
    }


    // --------------------------------------------------------------
    // Work Items
    // --------------------------------------------------------------

    /**
     * Get the selected work items
     * @returns {GlyphrStudioProject}
     */
    get selectedWorkItemIDs() {
        if (this._selectedWorkItemIDs && this._selectedWorkItemIDs !== {}) return this._selectedWorkItemIDs;
        else {
            this._selectedWorkItemIDs = {
                glyph: this.selectedGlyphID(),
                ligature: this.selectedLigatureID(),
                component: this.selectedComponentID(),
                kern: this.selectedKernID(),
            };
            return this._selectedWorkItemIDs;
        }
    }

    /**
     * Set the selected work items
     * @param {GlyphrStudioProject} swi - selectedWorkItemIDs to set
     * @returns {GlyphrStudioProject}
     */
    set selectedWorkItemIDs(swi) {
        this._selectedWorkItemIDs.glyph = swi.glyph || this.selectedGlyphID();
        this._selectedWorkItemIDs.ligature = swi.ligature || this.selectedLigatureID();
        this._selectedWorkItemIDs.component = swi.component || this.selectedComponentID();
        this._selectedWorkItemIDs.kern = swi.kern || this.selectedKernID();
        return this._selectedWorkItemIDs;
    }


    // --------------------------------------------------------------
    // Get Individual Selected Work Items
    // --------------------------------------------------------------

    /**
     * Returns the selected glyph
     * @returns {object}
     */
    get selectedGlyph() {
        let re = this.glyphs[this.selectedGlyphID];
        return re;
    }

    /**
     * Returns the selected glyph ID
     * @returns {string}
     */
    get selectedGlyphID() {
        return this._selectedWorkItems.glyph ||
            getFirstGlyphID() ||
            getFirstID(this.glyph) ||
            false;
    }

    /**
     * Returns the selected ligature
     * @returns {object}
     */
    get selectedLigature() {
        let re = this.ligatures[this.selectedLigatureID];
        return re;
    }

    /**
     * Returns the selected ligature ID
     * @returns {string}
     */
    get selectedLigatureID() {
        return this._selectedWorkItems.ligature ||
            getFirstID(this.ligature) ||
            false;
    }

    /**
     * Returns the selected kern
     * @returns {object}
     */
    get selectedKern() {
        let re = this.kerns[this.selectedKernID];
        return re;
    }

    /**
     * Returns the selected kern ID
     * @returns {string}
     */
    get selectedKernID() {
        return this._selectedWorkItems.kern ||
            getFirstID(this.kern) ||
            false;
    }

    /**
     * Returns the selected component
     * @returns {object}
     */
    get selectedComponent() {
        let re = this.components[this.selectedComponentID];
        return re;
    }

    /**
     * Returns the selected component ID
     * @returns {string}
     */
    get selectedComponentID() {
        return this._selectedWorkItems.component ||
            getFirstID(this.component) ||
            false;
    }


    // --------------------------------------------------------------
    // Set Selected Work Items
    // --------------------------------------------------------------

    /**
     * Sets the selected glyph
     * @param {string} id - ID to select
     */
    set selectedGlyph(id) {
        // Validate ID!
        this._selectedWorkItems.glyph = id;
    }

    /**
     * Sets the selected ligature
     * @param {string} id - ID to select
     */
    set selectedLigature(id) {
        // Validate ID!
        this._selectedWorkItems.ligature = id;
    }

    /**
     * Sets the selected kern
     * @param {string} id - ID to select
     */
    set selectedKern(id) {
        // Validate ID!
        this._selectedWorkItems.kern = id;
    }

    /**
     * Sets the selected component
     * @param {string} id - ID to select
     */
    set selectedComponent(id) {
        // Validate ID!
        this._selectedWorkItems.component = id;
    }


    // --------------------------------------------------------------
    // Selected Work Item Helper Functions
    // --------------------------------------------------------------

    /**
     * Get the selected glyph's left side bearing
     * @returns {number}
     */
    getSelectedGlyphLeftSideBearing() {
        // debug('getSelectedGlyphLeftSideBearing');
        let sc = getSelectedWorkItem();
        if (!sc) return 0;
        if (sc.objType === 'component') return 0;
        if (!sc.isAutoWide) return 0;
        return sc.leftSideBearing || this.project.projectSettings.defaultLSB;
    }

    /**
     * Get the selected glyph's right side bearing
     * @returns {number}
     */
    getSelectedGlyphRightSideBearing() {
        // debug('getSelectedGlyphLeftSideBearing');
        let sc = getSelectedWorkItem();
        if (!sc) return 0;
        if (sc.objType === 'component') return 0;
        if (!sc.isAutoWide) return 0;
        return sc.rightSideBearing || this.project.projectSettings.defaultRSB;
    }

    /**
     * Updates the selected glyphs width
     */
    updateCurrentGlyphWidth() {
        let sc = getSelectedWorkItem();
        if (!sc) return;
        if (editor.nav.page === 'glyph edit') {
            sc.changed();
        } else if (editor.nav.page === 'components' && sc) {
            let lsarr = sc.usedIn;
            if (lsarr) for (let c=0; c<lsarr.length; c++) getGlyph(lsarr[c]).changed();
        }
    }


    // --------------------------------------------------------------
    // History
    // --------------------------------------------------------------

    /**
     * Adds to the history queue
     * @param {string} description
     */
    historyPut(description) {
        if (this.onCanvasEditPage()) {
            let queue = this.nav.page === 'import svg'? 'glyph edit' : this.nav.page;
            this.history[queue].put(description);
        }
    }

    /**
     * Moves backwards in time in the history queue
     */
    historyPull() {
        if (this.onCanvasEditPage()) {
            this.closeDialog();
            this.closeNotation();
            this.history[this.nav.page].pull();
        }
    }

    /**
     * Get the length of the current history queue
     * @returns {number}
     */
    historyLength() {
        if (this.onCanvasEditPage()) {
            return this.history[this.nav.page].queue.length || 0;
        }

        return 0;
    }


    // --------------------------------------------------------------
    // Navigation
    // --------------------------------------------------------------

    navigate(oa){
        document.body.innerHTML = '<h1 style="color: white;">hello, world!</h1>';
    }


    // --------------------------------------------------------------
    // Navigation identifyer functions
    // --------------------------------------------------------------

    /**
     * Returns True if the current page has a glyph chooser panel
     * @returns {boolean}
     */
    onChooserPanelPage() {
        let nh = this.nav.page;
        return ( nh==='glyph edit' ||
                    nh==='components' ||
                    nh==='kerning' ||
                    nh==='import svg' ||
                    nh==='ligatures');
    }

    /**
     * Returns true if the current page has an Edit Canvas
     * @returns {boolean}
     */
    onCanvasEditPage() {
        let nh = this.nav.page;
        return ( nh==='glyph edit' ||
                    nh==='components' ||
                    nh==='kerning' ||
                    nh==='ligatures');
    }

    /**
     * Returns true if the current page has no panels
     * @returns {boolean}
     */
    onNoNavPage() {
        let nh = this.nav.page;
        return ( nh==='font settings' ||
                    nh==='project settings' ||
                    nh==='global actions' ||
                    nh==='export font' ||
                    nh==='help' ||
                    nh==='about');
    }


    // --------------------------------------------------------------
    // Project Saving
    // --------------------------------------------------------------

    /**
     * Save a Glyphr Project Text File
     * @param {boolean} overwrite - for Electron app, overwrite current working file
     */
    saveGlyphrProjectFile(overwrite) {
        // debug('SAVEGLYPHRPROJECTVILE');
        // debug('\t ' + getCurrentProject().projectSettings.formatsavefile);

        // desktop overwrite / save as logic
        if (window && window.process && window.process.type) {
            if (overwrite) {
                window.saveFileOverwrite = true;
            } else {
                window.saveFileOverwrite = false;
            }
        }

        let savedata = this.project.save();

        if (getCurrentProject().projectSettings.formatsavefile) savedata = json(savedata);
        else savedata = JSON.stringify(savedata);

        // debug('saveGlyphrProjectFile - \n'+savedata);
        let fname = getCurrentProject().projectSettings.name + ' - Glyphr Project - ' + makeDateStampSuffix() + '.txt';

        saveFile(fname, savedata);

        closeDialog();
        setProjectAsSaved();
    }

    /**
     * Generates a date suffix for file saves
     * @returns {string}
     */
    makeDateStampSuffix() {
        let d = new Date();
        let yr = d.getFullYear();
        let mo = d.getMonth()+1;
        let day = d.getDate();
        let hr = d.getHours();
        let min = (d.getMinutes()<10? '0' : '') + d.getMinutes();
        let sec = (d.getSeconds()<10? '0' : '') + d.getSeconds();

        return (''+yr+'.'+mo+'.'+day+'-'+hr+'.'+min+'.'+sec);
    }

    /**
     * Iterates through each glyph calling a function
     * collecting results if they are provided
     * @param {function} fname - function to call on each glyph
     * @returns {*}
     */
    glyphRangeIterator(fname) {
        let cr = getCurrentProject().projectSettings.glyphrange;
        let ccon = '';
        // var count = 0;

        if (cr.basiclatin) {
            for (let i=0; i<_UI.basiclatinorder.length; i++) {
                ccon += fname(_UI.basiclatinorder[i]);
                // count++;
            }
        }

        if (cr.latinsupplement) {
            for (let s=_UI.glyphrange.latinsupplement.begin; s<=_UI.glyphrange.latinsupplement.end; s++) {
                ccon += fname(decToHex(s));
                // count++;
            }
        }

        if (cr.latinextendeda) {
            for (let a=_UI.glyphrange.latinextendeda.begin; a<=_UI.glyphrange.latinextendeda.end; a++) {
                ccon += fname(decToHex(a));
                // count++;
            }
        }

        if (cr.latinextendedb) {
            for (let b=_UI.glyphrange.latinextendedb.begin; b<=_UI.glyphrange.latinextendedb.end; b++) {
                ccon += fname(decToHex(b));
                // count++;
            }
        }

        if (cr.custom.length) {
            for (let c=0; c<cr.custom.length; c++) {
                for (let range=cr.custom[c].begin; range<cr.custom[c].end; range++) {
                    ccon += fname(decToHex(range));
                    // count++;
                }
            }
        }

        // debug('GLYPHRangeITERATOR - count returned ' + count);

        return ccon;
    }

    /**
     * Calculate the overall bounds given every glyph in this font
     */
    calcFontMaxes() {
        let fm = _UI.fontMetrics;
        fm.numberOfGlyphs = 0;
        fm.maxGlyph = 0x20;

        glyphRangeIterator(function(hexID) {
            fm.numberOfGlyphs++;
            fm.maxGlyph = Math.max(fm.maxGlyph, hexID);
            let cm = getCurrentProject().glyphs[hexID];
            if (cm) {
                cm = cm.maxes;
                fm.maxes.xMax = Math.max(cm.xMax, fm.maxes.xMax);
                fm.maxes.xMin = Math.min(cm.xMin, fm.maxes.xMin);
                fm.maxes.yMax = Math.max(cm.yMax, fm.maxes.yMax);
                fm.maxes.yMin = Math.min(cm.yMin, fm.maxes.yMin);
            }
        });

        // var proportion = (fm.yMax / (fm.yMax-fm.yMin));
        // var total = fm.yMax + Math.abs(fm.yMin) + getCurrentProject().projectSettings.lineGap;
        // fm.hhea_ascent = round(total*proportion);
        // fm.hhea_descent = (fm.hhea_ascent - total);

        // debug('CALCFONTMAXES - numberOfGlyphs ' + _UI.fontMetrics.numberOfGlyphs);
    }
}

/*

window._UI = {


    icons: {},
    cursors: {},

    // Shared edit pages
    popOut: false,
    multiSelect: {
        shapes: false, // Selected Shapes
        points: false, // Selected Points
    },
    glyphChooser: {
        dropdown: false,
        panel: {
            fname: 'selectGlyph',
            selected: 'basiclatin',
            choices: 'glyphs',
        },
        dialog: {
            fname: 'selectGlyph',
            selected: 'basiclatin',
            choices: 'glyphs',
        },
        getShapeOptions: {
            srcAutoWidth: false,
            srcWidth: false,
            srcLSB: false,
            srcRSB: false,
        },
        cache: false,
    },
    canvasHotSpots: [],
    canvasHotSpotHovering: false,
    multiSelectThickness: 2,
    rotateHandleHeight: 40,
    selectedTool: 'pathedit', // pathedit, pathaddpoint, slice, shaperesize, pan, newrect, newoval, newpath
    focusElement: false,
    redrawing: false,
    redraw: {
        redrawCanvas: true,
        redrawTools: true,
        redrawPanels: true,
        calledBy: '',
    },
    thumbSize: 50,
    thumbGutter: 5,
    showGrid: true, // display the grid
    showGuides: true, // display guides
    showGuidesLabels: true, // display guide labels
    showOvershoots: true, // display overshoot guides
    clipboardShape: false,
    glyphEditCanvas: false,
    glyphEditCanvasSize: 2000, // How big the viewport canvas is
    glyphEditCTX: false,
    defaultView: {
        dx: 200, // X offset for the canvas origin
        dy: 500, // Y offset for the canvas origin
        dz: 0.5, // Zoom or scale of the canvas
    },
    views: {}, // Holds the unique views per char & component
    thumbView: {},
    mins: {
        xMax: -999999,
        xMin: 999999,
        yMax: -999999,
        yMin: 999999,
    },
    maxes: {
        xMax: 999999,
        xMin: -999999,
        yMax: 999999,
        yMin: -999999,
    },
    contextGlyphs: {
        string: '',
        advancewidth: false,
        leftseq: false,
        rightseq: false,
    },
    timeout: false,
    toastTimeout: false,
    history: {},

    // page: glyphedit
    selectedGlyph: false, // f is 0x0066

    // page: ligatures
    selectedLigature: false,

    // page: components
    selectedComponent: false,

    // page: kerning
    selectedKern: false,
    defaultKernView: {
        dx: 500, // X offset for the canvas origin
        dy: 500, // Y offset for the canvas origin
        dz: 0.5, // Zoom or scale of the canvas
    },
    guides: {
        leftGroupXMax: {type: 'vertical', location: 0, name: 'left group', color: 'rgb(255,0,255)'},
        rightGroupXMin: {type: 'vertical', location: 0, name: 'right group', color: 'rgb(255,0,255)'},
    },

    // page: test drive
    testDrive: {
        glyphSequence: {},
        ctx: false,
        canvas: false,
        sampleText: '',
        fontScale: 100,
        fontSize: 48,
        lineGap: false,
        padSize: 0,
        showGlyphExtras: false,
        showLineExtras: false,
        showPageExtras: false,
        flattenGlyphs: false,
        cache: {},
    },

    // page: import svg
    selectedSVGImportTarget: false,
    importSVG: {
        scale: true,
        move: true,
        ascender: false,
        capheight: false,
        descender: false,
        overshootTop: false,
        overshootBottom: false,
        svgCode: false,
    },

    // page: openproject
    overflowCount: 326,
    spinning: true,
    importRange: {
        begin: 0x0020,
        end: 0x024F,
    },

    // page: export font
    fontMetrics: {
        numberOfGlyphs: 0,
        maxGlyph: 0x20,
        maxes: {
            xMax: -999999,
            xMin: 999999,
            yMax: -999999,
            yMin: 999999,
        },
    },
    notDefGlyphShapes: '[]',

    // page: font settings
    metadataHelp: {
        font_family: '',
        font_style: 'regular, italic, oblique',
        font_variant: 'normal, small-caps',
        font_weight: 'normal, bold, or a number 100-900',
        font_stretch: 'normal, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded',
        panose_1: 'Uses ten digits to describe the font\'s visual style.  A good overview can be found here (archived): <a href="https://web.archive.org/web/20140913211804/http://www.monotype.com/services/pan2" target="_blank">monotype.com/services/pan2</a>.',
        stemv: 'Average measurement of vertical stems.',
        stemh: 'Average measurement of horizontal stems.',
        slope: 'If italic, this is the slant angle, measured counterclockwise from vertical. Or zero for non-italic fonts.',
        underline_position: '',
        underline_thickness: '',
        strikethrough_position: '',
        strikethrough_thickness: '',
        overline_position: '',
        overline_thickness: '',
        designer: '',
        designerURL: '',
        manufacturer: '',
        manufacturerURL: '',
        license: '',
        licenseURL: '',
        version: 'Like: Version 0.1',
        description: '',
        copyright: '',
        trademark: '',
    },
};
*/
