/**
 * MANIFEST
 * Object describing Glyphr Studio's project file structure.
 * This is used to:
 *  Assemble the Development environment, maintaining individual files
 *  Concat / Minimize to a single file for Distribution
 */
// debug(`\n MANIFEST.js - START`);

const manifest = [
  {
    path: 'glyph_elements',
    files: [
      'xy_point.js',
      'coord.js',
      'control_point.js',
      'path_point.js',
      'maxes.js',
      'path.js',
      'segment.js',
      'poly_segment.js',
      'shape.js',
      'component_instance.js',
      'glyph.js',
      'h_kern.js',

      'xy_point.test.js',
      'coord.test.js',
      'control_point.test.js',
      'path_point.test.js',
      'maxes.test.js',
      'path.test.js',
      'segment.test.js',
      'poly_segment.test.js',
      'shape.test.js',
      'component_instance.test.js',
      'glyph.test.js',
      'h_kern.test.js',
    ],
  },

  {
    path: 'app',
    files: [
      'resets.css',
      'fonts.css',
      'app.js',
      'app.css',

      // 'test.js,
      // 'test.test.js',
    ],
  },

  {
    path: 'common',
    files: [
      'functions.js',
      'unicode.js',
      'colors.js',
      'colors.css',

      'colors.test.js',
    ],
  },
  /*
  {
    path: 'project',
    files: [
      'glyphr_studio_project.js',
      'project_editor.js',
      'import.js',
      'migrate.js',
      'history.js',

      'glyphr_studio_project.test.js',
    ],
  },
*/

  {
    path: 'controls',
    files: [
      'controls.js',
      'dialogs.js',
      'button-toggle/button-toggle.js',
      'canvas-display/canvas-display.js',
      'canvas-edit/canvas-edit.js',
      'fancy-button/fancy-button.js',
      'panel-area/panel-area.js',
      'glyph-tile/glyph-tile.js',
      'info-bubble/info-bubble.js',
      'input-number/input-number.js',
      'input-number-lockable/input-number-lockable.js',
    ],
  },

  /*
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
*/

  {
    path: 'pages',
    files: [
      'open_project.js',
      'open-project.css',
      'glyph_edit.js',
      'glyph-edit.css',
      // 'components.js',
      // 'ligatures.js',
      // 'kerning.js',
      // 'test_drive.js',
      // 'global_actions.js',
      // 'settings_font.js',
      // 'settings_project.js',
      // 'import_svg.js',
      // 'export_font.js',
      // 'about.js',
    ],
  },
  /*
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
  */

  {
    path: 'lib',
    files: [
      // 'satChooser.js',
      'unicode_names.js',
      'xml_to_json.js',
      'opentypejs_0-9-0.js',
    ],
  },

  {
    path: 'samples',
    files: ['samples.js'],
  },
];

export default manifest;
