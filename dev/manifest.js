/* exported manifest */

/**
 * Object describing Glyphr Studio's project file structure.
 * This is used to:
 *  Assemble the Development environment, maintaining individual files
 *  Concat / Minimize to a single file for Distribution
 */

const manifest = [
    {
        path: 'app',
        files: [
            'settings.js',
            'functions.js',
        ],
    },

    {
        path: 'glyph_classes',
        files: [
            'pathpoint.js',
            'path.js',
            'segment.js',
            'polysegment.js',
            'componentinstance.js',
            'shape.js',
            'glyph.js',
            'hkern.js',
        ],
    },

    {
        path: 'edit_canvas',
        files: [
            'edit_canvas.js',
            'edit_canvas.css',
            'events_mouse.js',
            'events_keyboard.js',
            'guide.js',
            'multiselect.js',
        ],
    },

    {
        path: 'framework',
        files: [
            'nav.js',
            'history.js',
            'glyph_sequence.js',
            'unicode.js',
            'glyphrproject.js',
            'glyphr_studio_project_import.js',
        ],
    },

    {
        path: 'controls',
        files: [
            'controls.js',
            'controls.css',
        ],
    },

    {
        path: 'io',
        files: [
            'svg_outline_import.js',
            'svg_font_import.js',
            'svg_font_export.js',
            'otf_import.js',
            'otf_export.js',
        ],
    },

    {
        path: 'pages',
        files: [
            'pages.css',
            'glyphedit.js',
            'components.js',
            'ligatures.js',
            'kerning.js',
            'testdrive.js',
            'globalactions.js',
            'fontsettings.js',
            'projectsettings.js',
            'openproject.js',
            'importSVG.js',
            'exportfont.js',
            'about.js',
        ],
    },

    {
        path: 'panels',
        files: [
            'panels.css',
            'attributes_glyph.js',
            'attributes_component.js',
            'attributes_kern.js',
            'chooser.js',
            'layers.js',
            'guides.js',
            'history.js',
            'actions.js',
        ],
    },

    {
        path: 'lib',
        files: [
            'satchooser.js',
            'opentypejs_0-8-0.js',
            'samples.js',
            'unicode_names.js',
            'xml_to_json.js',
        ],
    },
];
