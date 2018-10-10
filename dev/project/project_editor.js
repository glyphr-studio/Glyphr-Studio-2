import GlyphrStudioProject from './glyphr_studio_project.js';
import History from './history.js';
import {saveFile, makeDateStampSuffix} from '../common/functions.js';
import PageOpenProject from '../pages/openproject.js';
import {makeElement} from '../controls/controls.js';

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
            page: 'open project',
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

        this.content = makeElement({className: 'editorWrapper'});

        this.pages = {};

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

    /**
     * Changes the page of this Project Editor
     * @param {string} pageName - where to go
     */
    navigate(pageName) {
        if (pageName) this.nav.page = pageName;
        window.GlyphrStudio.navigate();
    }

    /**
     * Returns the currently selected page
     * @returns {object}
     */
    getCurrentPage() {
        debug(`\n ProjectEditor.getCurrentPage - START`);
        debug(this.pages);
        debug(` ProjectEditor.getCurrentPage - END\n\n`);
        return this.pages[this.nav.page];
    }

    /**
     * Sets the current view to the appropriate Page
     * @returns {object} Page Loader object - {string} content and {function} callback
     */
    pageLoader() {
        debug(`\n ProjectEditor.pageLoader - START`);
        let editorContent = makeElement({tag: 'div', id: 'editorWrapper'});
        let currentPageLoader = {
            content: makeElement({tag: 'h1', innerHTML: 'Uninitialized page content'}),
            callback: false,
        };

        // Collect the Page Loader for the current page
        if (this.nav.page === 'open project') {
            debug(`\t page detected as open project`);
            if (!this.pages['open project']) this.pages['open project'] = new PageOpenProject();
            currentPageLoader = this.pages['open project'].pageLoader();
        } else if (this.nav.page === 'glyph edit') {
            debug(`\t page detected as glyph edit`);
            if (!this.pages['glyph edit']) this.pages['glyph edit'] = new PageGlyphEdit();
            currentPageLoader = this.pages['glyph edit'].pageLoader();
        }

        // Append results
        editorContent.appendChild(currentPageLoader.content);

        debug(`\t this.pages`);
        debug(this.pages);

        debug(` ProjectEditor.pageLoader - END\n\n`);

        return {content: editorContent, callback: currentPageLoader.callback};
    }

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
    // Save
    // --------------------------------------------------------------

    /**
     * Save a Glyphr Project Text File
     * @param {boolean} overwrite - for Electron app, overwrite current working file
     */
    saveGlyphrProjectFile(overwrite) {
        // debug('SAVEGLYPHRPROJECTVILE');
        // debug('\t ' + this.project.projectSettings.formatsavefile);

        // desktop overwrite / save as logic
        if (window && window.process && window.process.type) {
            if (overwrite) {
                window.saveFileOverwrite = true;
            } else {
                window.saveFileOverwrite = false;
            }
        }

        let saveData = this.project.save();

        if (this.project.projectSettings.formatsavefile) saveData = json(saveData);
        else saveData = JSON.stringify(saveData);

        // debug('saveGlyphrProjectFile - \n'+saveData);
        let fileName = this.project.projectSettings.name + ' - Glyphr Project - ' + makeDateStampSuffix() + '.txt';

        saveFile(fileName, saveData);

        this.closeDialog();
        this.setProjectAsSaved();
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


/*
// ---------------------------------------------------------------------
//    Global Get Selected Glyph and Shape
// ---------------------------------------------------------------------
    /**
     * Get the selected glyph's left side bearing
     * @returns {number}
     *
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
     *
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
     *
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

function existingWorkItem() {
    let len = 0;
    let nph = _UI.currentPanel;

    if (editor.nav.page === 'ligatures') {
        len = countObjectKeys(getCurrentProject().ligatures);
        if (!len) {
            _UI.selectedLigature = false;
            if (nph !== 'npNav') nph = 'npChooser';
            return false;
        }
    } else if (editor.nav.page === 'components') {
        len = countObjectKeys(getCurrentProject().components);
        if (!len) {
            _UI.selectedComponent = false;
            if (nph !== 'npNav') nph = 'npChooser';
            return false;
        }
    } else if (editor.nav.page === 'kerning') {
        len = countObjectKeys(getCurrentProject().kerning);
        if (!len) {
            _UI.selectedKern = false;
            if (nph !== 'npNav') nph = 'npAttributes';
            return false;
        }
    }

    return true;
}

function getSelectedWorkItem() {
    // debug('\n getSelectedWorkItem - START');
    // debug('\t currentPage: ' + editor.nav.page);
    let re;

    switch (editor.nav.page) {
        case 'glyph edit':
            if (!_UI.selectedGlyph) _UI.selectedGlyph = '0x0041';
            re = getGlyph(_UI.selectedGlyph, true);
            // debug('\t case glyph edit, returning ' + re.name);
            return re;
        case 'import svg':
            if (!_UI.selectedSVGImportTarget) _UI.selectedSVGImportTarget = '0x0041';
            re = getGlyph(_UI.selectedSVGImportTarget, true);
            // debug('\t case import svg, returning ' + re.name);
            return re;
        case 'ligatures':
            re = getGlyph(_UI.selectedLigature, true);
            // debug('\t case glyph edit, returning ' + re.name);
            return re;
        case 'components':
            re = getGlyph(_UI.selectedComponent, false);
            // debug('\t case components, returning ' + re.name);
            return re;
        case 'kerning':
            // debug('\t case KERN - selkern = ' + _UI.selectedKern);
            if (!_UI.selectedKern) _UI.selectedKern = getFirstID(getCurrentProject().kerning);
            re = getCurrentProject().kerning[_UI.selectedKern] || false;
            // debug('\t case kerning, returning ' + re);
            return re;
    }

    return false;
}

function getSelectedWorkItemID() {
    switch (editor.nav.page) {
        case 'glyph edit': return _UI.selectedGlyph;
        case 'import svg': return _UI.selectedSVGImportTarget;
        case 'ligatures': return _UI.selectedLigature;
        case 'components': return _UI.selectedComponent;
        case 'kerning': return _UI.selectedKern;
    }

    return false;
}

function getSelectedWorkItemChar() {
    let swiid = getSelectedWorkItemID();
    return hexToChars(swiid);
}

function getSelectedWorkItemName() {
    // debug('\n getSelectedWorkItemName - START');
    let wi = getSelectedWorkItem();
    // debug('\t wi = '+wi);
    return wi.name || wi.getName() || '[name not found]';
}

function getSelectedWorkItemShapes() {
    // debug('GETSELECTEDGLYPHSHAPES');
    let rechar = getSelectedWorkItem();
    return rechar? rechar.shapes : [];
}

function markSelectedWorkItemAsChanged() {
    // debug('\n markSelectedWorkItemAsChanged - START');
    let wi = getSelectedWorkItem();

    if (wi && wi.changed) {
        // debug('\t marking as changed');
        wi.changed(true, true);
    }

    // debug(' markSelectedWorkItemAsChanged - END\n');
}

function selectGlyph(c, dontnavigate) {
    // debug('\n selectGlyph - START');
    // debug('\t selecting ' + getGlyph(c, true).name + ' from value ' + c);

    _UI.selectedGlyph = c;
    clickEmptySpace();
    markSelectedWorkItemAsChanged();

    if (!dontnavigate) {
        // debug('\t selecting ' + getCurrentProject().glyphs[c].glyphhtml + ' and navigating.');
        navigate({panel: 'npAttributes'});
    }

    // debug(' selectGlyph - END\n');
}

function selectComponent(c, dontnavigate) {
    // debug('SELECTCOMPONENT - selecting ' + getGlyph(c, true).name + ' from value ' + c);

    _UI.selectedComponent = c;
    clickEmptySpace();
    markSelectedWorkItemAsChanged();

    if (!dontnavigate) {
        // debug('SELECTCOMPONENT: selecting ' + getCurrentProject().components[c].name + ' and navigating.');
        navigate({panel: 'npAttributes'});
    }
}

function selectLigature(c, dontnavigate) {
    // debug('SELECTLIGATURE - selecting ' + getGlyph(c, true).name + ' from value ' + c);

    _UI.selectedLigature = c;
    clickEmptySpace();
    markSelectedWorkItemAsChanged();

    if (!dontnavigate) {
        // debug('SELECTLIGATURE: selecting ' + getCurrentProject().ligatures[c].glyphhtml + ' and navigating.');
        navigate({panel: 'npAttributes'});
    }
}

function selectSVGImportTarget(c, dontnavigate) {
    // debug('SELECTSVGIMPORTTARGET - selecting ' + getGlyph(c, true).name + ' from value ' + c);

    _UI.selectedSVGImportTarget = c;

    if (!dontnavigate) {
        // debug('SELECTSVGIMPORTTARGET: selecting ' + c + ' and navigating.');
        navigate({panel: 'npAttributes'});
    }
}
*/
