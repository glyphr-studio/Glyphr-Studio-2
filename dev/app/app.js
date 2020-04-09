import {accentColors} from '../common/colors.js';
import ProjectEditor from '../project/project_editor.js';
import {importGlyphrProjectFromText} from '../project/import.js';
import {sampleProjects} from '../samples/samples.js';

/**
 * Creates a new Glyphr Studio Application
 */
export default class GlyphrStudioApp {
  /**
   * Initialize the Glyphr Studio App, with defaults
   */
  constructor() {
    // Version
    this.versionName = 'Version 2 alpha';
    this.versionNumber = '2.0.0';
    this.versionDate = 0;

    this.projectEditors = [];
    this.selectedProjectEditor = 0;

    this.settings = {
      dev: {
        // Internal Dev Stuff
        mode: true, // global switch for all the stuff below
        sampleProject: false, // if sampleProject is present, load it and skip open project experience
        currentPage: 'glyph edit', // navigate straight to a page
        currentPanel: false, // navigate straight to a panel
        selectedShape: false, // automatically select a shape
        debugAutoGroup: false, // try to console.group based on text strings
        debugTableObjects: false, // Show objects in tables in the console
        testActions: [],
        testOnLoad: function() {},
        testOnRedraw: function() {},
      },
      telemetry: true, // Load google analytics
    };

    this.temp = {};
  }

  /**
   * Starts up the app
   */
  setUp() {
    // Dev mode stuff
    if (this.settings.dev.mode) {
      // debug('\t >>> DEV NAV - to ' + this.settings.dev.currentPage);
      document.title = '░▒▓█ GSDEVMODE █▓▒░';

      // Project
      if (this.settings.dev.sampleProject) {
        // debug('\t >>> Using sample project');
        this.temp.droppedFileContent = JSON.stringify(sampleProjects[this.settings.dev.sampleProject]);
        importGlyphrProjectFromText();
        this.settings.dev.sampleProject = false;
      } else {
        this.projectEditors[0] = new ProjectEditor();
      }

      // Page Navigate
      if (this.settings.dev.currentPage) {
        this.getCurrentProjectEditor().nav.page = this.settings.dev.currentPage;
        this.fadeOutLoadScreen(100);
      }

      // Test Function
      if (this.settings.dev.testOnLoad) this.settings.dev.testOnLoad();
    }

    // Telemetry
    /* eslint-disable */
    function setUpGoogleAnalytics(i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
      };
      i[r].l = 1*new Date();
      a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    }
    /* eslint-enable */

    if (!this.settings.dev.mode && this.settings.telemetry) {
      try {
        setUpGoogleAnalytics(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-71021902-1', 'auto');
        ga('send', 'pageview');
      } catch (err) {
        console.warn('Google Analytics did not load.');
      }
    }

    this.navigate();

    // debug(' MAIN SETUP - END\n');
  }

  /**
   * Draws the current Project Editor to the document
   */
  navigate() {
    debug(`\n App.navigate - START`);

    let wrapper = document.getElementById('appWrapper');
    let loader = this.getCurrentProjectEditor().pageLoader();
    wrapper.innerHTML = '';
    wrapper.appendChild(loader.content);
    if (loader.callback) loader.callback(this.getCurrentProjectEditor().getCurrentPage());

    debug(` App.navigate - END\n\n`);
  }

  /**
   * Fades out the initial load screen to show the App
   * @param {number} delay - override default fadeout time
   */
  fadeOutLoadScreen(delay = 700) {
    let loadScreen = document.getElementById('loadScreen');
    if (loadScreen) {
      loadScreen.style.opacity = 0;

      setTimeout(function() {
        // loadScreen.style.visibility = 'hidden';
        // loadScreen.style.display = 'none';
        document.body.removeChild(loadScreen);
      }, delay);
    }
  }

  /**
   * Returns the project that is currently being edited
   * @returns {GlyphrStudioProject}
   */
  getCurrentProject() {
    return this.getCurrentProjectEditor().project;
  }

  /**
   * Returns the current Project Editor
   * @returns {ProjectEditor}
   */
  getCurrentProjectEditor() {
    if (!this.projectEditors[this.selectedProjectEditor]) {
      this.projectEditors[this.selectedProjectEditor] = new ProjectEditor();
    }

    return this.projectEditors[this.selectedProjectEditor];
  }


  // --------------------------------------------------------------
  // OTHER STUFF
  // --------------------------------------------------------------

  /**
   * Global DOM elements that other UI relies on
   */
  insertGlobalDOMElements() {
    document.body.innerHTML = `<div id="primaryScreenLayout"></div>

      <div id="npSave"></div>

      <div id="saveFormatFlyout" style="display:none;">
        <div class="closeFormatFlyout" onclick="closeDialog();">&times</div>

        <button onclick="closeDialog(); showToast('Saving Glyphr Studio Project file...'); setTimeout(saveGlyphrProjectFile, 500);">
          ${makeIcon({'name': 'button_npNav', 'width': 32, 'height': 32, 'size': 50, 'color': accentColors.blue.l95, 'hovercolor': false})}
          <span>Glyphr Studio Project File</span>
        </button>

        <button onclick="closeDialog(); showToast('Exporting OTF font file...'); setTimeout(ioOTF_exportOTFfont, 500);">
          ${makeIcon({'name': 'nav_exportotf', 'width': 32, 'height': 32, 'size': 50, 'color': accentColors.blue.l95, 'hovercolor': false})}
          <span>OTF Font</span>
        </button>

        <button onclick="closeDialog(); showToast('Exporting SVG font file...'); setTimeout(ioSVG_exportSVGfont, 500);">
          ${makeIcon({'name': 'nav_exportsvg', 'width': 32, 'height': 32, 'size': 50, 'color': accentColors.blue.l95, 'hovercolor': false})}
          <span>SVG Font</span>
        </button>

      </div>

      <span id="toast"></span>

      <div id="dialog_bg" onclick="closeDialog();"></div>

      <div id="dialog_box">
        <table cellpadding=0 cellspacing=0 border=0><tr>
        <td id="dialogLeftBar"><button class="dialogCloseButton" onclick="closeDialog();">&times;</button></td>
        <td id="dialogRightContent"></td>
        </tr></table>
      </div>

      <table id="big_dialog_box" cellpadding=0 cellspacing=0 border=0><tr>
      <td id="dialogLeftBar"><button class="dialogCloseButton" onclick="closeDialog();">&times;</button></td>
      <td id="bigDialogLeftContent"></td>
      <td style="height:9999px;"><div id="bigDialogScrollContent"></div></td>
      </tr></table>
    `;

    window.onBeforeUnload = function() {
      let project = getCurrentProjectEditor();
      popIn();
      if (project &&
        project.projectSettings.stopPageNavigation &&
        this.settings.stopPageNavigation &&
        !this.settings.dev.mode) {
        return '\n\nOh Noes!\nUnless you specifically saved your Glyphr Project, all your progress will be lost.\n\n';
      } else {
        return;
      }
    };
  }
}
