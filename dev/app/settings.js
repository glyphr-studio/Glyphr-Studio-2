/**
 * UI Settings
 * This is the global variable that stores all the stuff
 * the UI needs to operate.
 */

let _UI = {

    // Version
    thisGlyphrStudioVersion: 'Version 2 alpha',
    thisGlyphrStudioVersionNum: '2.0.0',
    thisGlyphrStudioVersionDate: 0,

    // Internal Dev Stuff
    devMode: false, // global switch for all the stuff below
    dev_sampleProject: false, // if sampleproject is present, load it and skip open project experience
    dev_currentPage: false, // navigate straight to a page
    dev_currentPanel: false, // navigate straight to a panel
    dev_selectedShape: false, // automatically select a shape
    debug: true, // show messages sent to the browser console
    debugAutoGroup: false, // try to console.group based on text strings
    debugTableObjects: false, // Show objects in tables in the console
    telemetry: true, // Load google analytics
    testActions: [],
    testOnLoad: function() {},
    testOnRedraw: function() {},

    // all pages
    currentPage: 'openproject',
    currentPanel: false,
    lastPanel: 'npChooser',
    hamburger: {
        state: 11,
        direction: -1,
        timeout: {},
    },
    projectSaved: true,
    stopPageNavigation: true,
    icons: {},
    cursors: {},
    colors: {

        // ACCENT BLUE
        blue: {
            l95: 'rgb(225,245,255)',
            l85: 'rgb(155,221,255)',
            l75: 'rgb(80,196,255)',
            l65: 'rgb(0,170,255)', // Primary Accent
            l55: 'rgb(0,140,210)',
            l45: 'rgb(0,113,170)',
            l35: 'rgb(0,90,135)',
            l25: 'rgb(0,63,95)',
            l15: 'rgb(0,43,65)',
            l05: 'rgb(0,20,30)',
        },

        // ACCENT GREEN
        green: {
            l95: 'rgb(185,255,226)',
            l85: 'rgb(0,245,144)',
            l75: 'rgb(0,210,123)',
            l65: 'rgb(0,180,105)',
            l55: 'rgb(0,150,88)',
            l45: 'rgb(0,125,73)',
            l35: 'rgb(0,95,55)',
            l25: 'rgb(0,70,41)',
            l15: 'rgb(0,45,26)',
            l05: 'rgb(0,20,11)',
        },

        // COOL GRAYSCALE
        gray: {
            offwhite: 'rgb250,252,255)', // Off White
            l90: 'rgb(229,234,239)', // LIGHTER
            l80: 'rgb(204,209,214)',
            l70: 'rgb(178,183,188)',
            l60: 'rgb(153,158,163)',
            l65: 'rgb(153,158,163)', // Fake for outline color
            l50: 'rgb(127,134,137)',
            l40: 'rgb(102,107,112)',
            l30: 'rgb(76,81,86)',
            l20: 'rgb(51,56,61)',
            l10: 'rgb(25,30,35)', // DARKER
        },

        // RED FOR ERROR
        error: {
            light: 'rgb(240,210,215)', // os red warning color light
            medium: 'rgb(240,15,54)', // os red warning color
            dark: 'rgb(105,45,55)', // os red warning color dark
        },
    },

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
    isHereGhostCanvas: false,
    isHereGhostCTX: false,
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
    droppedFileContent: false,
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

export default _UI;
