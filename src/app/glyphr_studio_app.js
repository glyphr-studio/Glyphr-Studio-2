import ProjectEditor from '../project/project_editor.js';
import { importGlyphrProjectFromText } from '../project/import.js';
import { projects } from '../samples/samples.js';
import { debug } from '../common/functions.js';

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
    this.version = '2.0.0';
    this.versionDate = 0;

    this.projectEditors = [];
    this.selectedProjectEditor = 0;

    this.settings = {
      dev: {
        // Internal Dev Stuff
        mode: true, // global switch for all the stuff below
        sampleProject: false, // if sampleProject is present, load it and skip open project experience
        currentPage: false, // navigate straight to a page
        currentPanel: false, // navigate straight to a panel
        selectedShape: false, // automatically select a shape
        debugAutoGroup: false, // try to console.group based on text strings
        debugTableObjects: false, // Show objects in tables in the console
        testActions: [],
        testOnLoad: function () {},
        testOnRedraw: function () {},
      },
      telemetry: true, // Load google analytics
    };

    this.temp = {};
  }

  /**
   * Starts up the app
   */
  setUp() {
    debug(`\n App.setUp - START`);

    // Dev mode stuff
    if (this.settings.dev.mode) {
      debug('\t >>> DEV NAV - to ' + this.settings.dev.currentPage);
      document.title = '⡄⡆⡇ ⃨G⃨S⃨2⃨D⃨E⃨V⃨M⃨O⃨D⃨E⃨ ⡇⡆⡄';

      // Project
      if (this.settings.dev.sampleProject) {
        debug('\t >>> Using sample project');
        this.temp.droppedFileContent = JSON.stringify(
          projects[this.settings.dev.sampleProject]
        );
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
        setUpGoogleAnalytics(
          window,
          document,
          'script',
          '//www.google-analytics.com/analytics.js',
          'ga'
        );
        window.ga('create', 'UA-71021902-1', 'auto');
        window.ga('send', 'pageview');
      } catch (err) {
        console.warn('Google Analytics did not load.');
      }
    }

    this.navigate();

    debug(` App.setUp - END\n\n`);
  }

  /**
   * Draws the current Project Editor to the document
   * @param {string} pageName - what page to navigate to
   */
  navigate(pageName) {
    debug(`\n App.navigate - START`);
    this.getCurrentProjectEditor().navigate(pageName);
    debug(` App.navigate - END\n\n`);
  }

  /**
   * Fades out the initial load screen to show the App
   * @param {number} delay - override default fadeout time
   */
  fadeOutLoadScreen(delay = 700) {
    const loadScreen = document.getElementById('loadScreen');
    if (loadScreen) {
      loadScreen.style.opacity = 0;

      setTimeout(function () {
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
}
