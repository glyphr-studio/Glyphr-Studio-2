/* exported manifest */

/**
 * Object describing Glyphr Studio's project file structure.
 * This is used to:
 *  Assemble the Development environment, maintaining individual files
 *  Concat / Minimize to a single file for Distribution
 */

const manifest = [
    {
        path: 'glyph_classes',
        files: [
            'coord.js',
            'handle.js',
            'pathpoint.js',
            'path.js',
            'segment.js',
            'polysegment.js',
            'componentinstance.js',
            'shape.js',
            'glyph.js',
            'hkern.js',

            'coord.test.js',
            'handle.test.js',
            'pathpoint.test.js',
        ],
    },

    {
        path: 'app',
        files: [
            'settings.js',
            'functions.js',
            'colors.js',
            'nav.js',
            'history.js',
            'unicode.js',

            'global.css',
            'colors.css',

            'colors.test.js',
            'test.test.js',
        ],
    },

    {
        path: 'project',
        files: [
            'glyphrstudioproject.js',
            'project_functions.js',
            'project_import.js',

            'glyphrstudioproject.test.js',
        ],
    },

    {
        path: 'edit_canvas',
        files: [
            'edit_canvas.js',
            'events_mouse.js',
            'events_keyboard.js',
            'guide.js',
            'multiselect.js',
            'glyph_sequence.js',

            'edit_canvas.css',
        ],
    },

    {
        path: 'controls',
        files: [
            'controls.js',
            'controls.css',
            'dialogs.js',
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
            'glyphedit.js',
            'components.js',
            'ligatures.js',
            'kerning.js',
            'testdrive.js',
            'globalactions.js',
            'fontsettings.js',
            'projectSettings.js',
            'openproject.js',
            'importSVG.js',
            'exportfont.js',
            'about.js',

            'pages.css',
        ],
    },

    {
        path: 'panels',
        files: [
            'attributes_glyph.js',
            'attributes_component.js',
            'attributes_kern.js',
            'chooser.js',
            'layers.js',
            'guides.js',
            'history.js',
            'actions.js',

            'panels.css',
        ],
    },

    {
        path: 'lib',
        files: [
            'satchooser.js',
            'samples.js',
            'unicode_names.js',
            'xml_to_json.js',
            'opentypejs_0-8-0.js',
        ],
    },
];
