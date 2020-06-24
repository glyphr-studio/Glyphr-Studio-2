import { makeElement } from '../controls/controls.js';
import { makeGlyphrStudioLogo } from '../common/graphics.js';
import { makeErrorMessageBox } from '../controls/dialogs.js';
import GlyphrStudioProject from '../project/glyphr_studio_project.js';
import { projects } from '../samples/samples.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 * HTML and associated functions for this page.
 */
export default class PageOpenProject {
  /**
   * Initialize this page
   */
  constructor() {}

  /**
   * Load the Open Project page
   * @returns {object} HTML Element + callback function
   */
  pageLoader() {
    debug(`\n PageOpenProject.pageLoader - START`);

    const recent = 1000 * 60 * 60 * 24 * 7; // seven days in milliseconds
    let recentMessage = '';
    const app = window.GlyphrStudio;
    if (Date.now() - app.versionDate < recent) {
      recentMessage = ` - <a href="http://help.glyphrstudio.com/overview_updates.html" target="_blank">recently updated!</a>`;
    }

    const content = makeElement({
      tag: 'div',
      id: 'app__page',
      innerHTML: `
      <table style="height:100%; width:100%;"><tr>
      <td id="open-project__left-area" vertical-align="middle">
      <div id="open-project__logo"></div>

        <span class="open-project__version-name">${app.versionName}</span>

        <span class="open-project__version-number">${
          app.versionNumber.split('.')[2]
        }${recentMessage}</span>

        <div class="open-project__blurb">
          For more information visit <a href="http://www.glyphrstudio.com" target="_blank">www.glyphrstudio.com</a><br>
          Glyphr Studio is licensed under a <a href="https://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License</a>,
          which is a free / open source "copyleft" license. You are free to use, distribute, and modify Glyphr Studio as long as
          this license and its freeness stays intact.
        </div>
        <input style="display:none;" type="file" id="openProjectFileChooser"/>
      </td>
      <td id="open-project__right-area" vertical-align="middle">${this.makeTabs()}</td>
      </tr></table>
      <input type="file" style="display:none" id="openProjectFileChooser"></input>`,
    });

    // Tab click
    content
      .querySelector('#newTab')
      .addEventListener('click', () => this.changeTab('new'));
    content
      .querySelector('#loadTab')
      .addEventListener('click', () => this.changeTab('load'));
    content
      .querySelector('#examplesTab')
      .addEventListener('click', () => this.changeTab('examples'));

    // Dragging and dropping to load
    const tableRight = content.querySelector('#open-project__right-area');
    tableRight.addEventListener('dragover', this.handleDragOver);
    tableRight.addEventListener('drop', this.handleDrop);
    tableRight.addEventListener('dragleave', this.handleDragLeave);

    const tableLeft = content.querySelector('#open-project__left-area');
    tableLeft.addEventListener('dragover', this.handleDragOver);
    tableLeft.addEventListener('drop', this.handleDrop);
    tableLeft.addEventListener('dragleave', this.handleDragLeave);

    content
      .querySelector('#openProjectFileChooser')
      .addEventListener('change', this.handleDrop);

    // Sample Projects click
    content
      .querySelector('#loadModegg')
      .addEventListener('click', () => this.handleLoadSample('modegg'));
    content
      .querySelector('#loadCaliforniaGothic')
      .addEventListener('click', () =>
        this.handleLoadSample('californiaGothic')
      );
    content
      .querySelector('#loadMerriweatherSans')
      .addEventListener('click', () =>
        this.handleLoadSample('merriweatherSans')
      );

    // Starting a project
    content
      .querySelector('#openProjectCreateNewProject')
      .addEventListener('click', this.handleNewProject);

    const callback = function (page) {
      debug(`\n PageOpenProject.pageLoader.callback - START`);

      // For Electron app
      window.addEventListener('message', page.handleMessage, false);
      if (window.opener) window.opener.postMessage('ready', '*');

      // Finish up populating UI
      page.changeTab();
      document.getElementById(
        'open-project__logo'
      ).innerHTML = makeGlyphrStudioLogo({ fill: '#BAD9E9', width: 400 });

      setTimeout(window.GlyphrStudio.fadeOutLoadScreen, 2000);

      debug(` PageOpenProject.pageLoader.callback - END\n\n`);
    };

    const re = { content: content, callback: callback };
    // debug(re);
    debug(` PageOpenProject.pageLoader - END\n\n`);

    return re;
  }

  /**
   * Create the tabs for the load project page
   * @returns {string} html content
   */
  makeTabs() {
    // TABS
    let con = `
    <div class="open-project__tabs">
      <button id="newTab">new</button><button id="loadTab">load</button><button id="examplesTab">examples</button>
    </div>`;

    // LOAD
    con += `
    <div class="open-project__tab-content" id="openProjectLoadContent" style="display: none;">
      <h2>Load a file</h2>
      <fancy-button secondary onclick="document.getElementById('openProjectFileChooser').click();">
        Browse for a File
      </fancy-button>&ensp; or Drag and Drop:
      <div id="open-project__drop-target">
        Glyphr Studio Project &ensp;(.txt)<br>
        Open Type or True Type Font &ensp;(.otf or .ttf)<br>
        SVG Font &ensp;(.svg)
      </div>
      <div style="width:335px;">${makeErrorMessageBox()}</div>
    </div>`;

    // NEW
    con += `
    <div class="open-project__tab-content" id="openProjectNewContent" style="display: none;">
      <h2>Start a new Glyphr Studio Project</h2>
      Project name: &nbsp; <input id="open-project__project-name" type="text" value="My Font" autofocus/><br>
      <fancy-button id="openProjectCreateNewProject">Start a new font from scratch</fancy-button>
    </div>`;

    // EXAMPLES
    con += `
    <div class="open-project__tab-content" id="openProjectExampleProjects" style="display: none;">
      <h2>Load an Example project</h2>

      Modegg is a project that utilizes Glyphr Studio features, like Components:<br>
      <fancy-button secondary id="loadModegg">Modegg</fancy-button><br><br>

      California Gothic is an all-caps display font:<br>
      <fancy-button secondary id="loadCaliforniaGothic">California Gothic</fancy-button><br><br>

      Merriweather Sans is an open-source font imported from an Open Type file:<br>
      <fancy-button secondary id="loadMerriweatherSans">Merriweather Sans</fancy-button><br><br>
    </div>`;

    return '<div class="open-project__tab-wrapper">' + con + '</div>';
  }

  /**
   * Handle tab changes
   * @param {string} tab - which tab to select
   */
  changeTab(tab) {
    const contentNew = document.getElementById('openProjectNewContent');
    const contentLoad = document.getElementById('openProjectLoadContent');
    const contentExamples = document.getElementById(
      'openProjectExampleProjects'
    );
    // var contentRecent = document.getElementById('recent_content');

    const tabNew = document.getElementById('newTab');
    const tabLoad = document.getElementById('loadTab');
    const tabExamples = document.getElementById('examplesTab');
    // var tabRecent = document.getElementById('recent_tab');

    contentNew.style.display = 'none';
    contentLoad.style.display = 'none';
    contentExamples.style.display = 'none';
    // contentRecent.style.display = 'none';

    tabNew.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
    tabLoad.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
    tabExamples.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
    // tabRecent.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';

    if (tab === 'load') {
      contentLoad.style.display = 'block';
      tabLoad.style.borderBottomColor = '#2EB5FA';
    } else if (tab === 'examples') {
      contentExamples.style.display = 'block';
      tabExamples.style.borderBottomColor = '#2EB5FA';
    } else {
      // default to new
      contentNew.style.display = 'block';
      tabNew.style.borderBottomColor = '#2EB5FA';
    }
  }

  /**
   * Handle file drop
   * @param {object} evt - drop event
   */
  handleDrop(evt) {
    // debug('\n handleDrop - START');
    document.getElementById('open-project__right-area').innerHTML =
      'Loading File...';
    document.getElementById('open-project__right-area').style.backgroundColor =
      _UI.colors.gray.offWhite;

    evt.stopPropagation();
    evt.preventDefault();

    let f =
      evt.dataTransfer || document.getElementById('openProjectFileChooser');
    f = f.files[0];
    // debug('\t filename: ' + f.name);
    let fname = f.name.split('.');
    fname = fname[fname.length - 1].toLowerCase();
    // debug('\t fname = ' + fname);

    const reader = new FileReader();

    if (fname === 'otf' || fname === 'ttf') {
      reader.onload = function () {
        // debug('\n reader.onload::OTF or TTF - START');
        window.GlyphrStudio.temp.droppedFileContent = reader.result;
        importOTFFont();
        // debug(' reader.onload:: OTF or TTF - END\n');
      };

      reader.readAsArrayBuffer(f);
    } else if (fname === 'svg' || fname === 'txt') {
      reader.onload = function () {
        // debug('\n reader.onload::SVG or TXT - START');
        window.GlyphrStudio.temp.droppedFileContent = reader.result;
        if (fname === 'svg') {
          // debug('\t File = .svg');
          ioSVG_importSVGFont();
        } else if (fname === 'txt') {
          // debug('\t File = .txt');
          importGlyphrProjectFromText();
          navigate();
        }
        // debug(' reader.onload::SVG OR TXT - END\n');
      };

      reader.readAsText(f);
    } else {
      let con = '<h3>Unsupported file type</h3>';
      con += "Glyphr Studio can't import ." + fname + ' files.<br>';
      con += 'Try loading another file.';
      document.getElementById(
        'open-project__right-area'
      ).innerHTML = makeTabs();
      changeTab('load');
      showErrorMessageBox(con);
      document.getElementById(
        'open-project__right-area'
      ).style.backgroundColor = _UI.colors.gray.offWhite;
    }

    // debug(' handleDrop - END\n');
  }

  /**
   * Handle Message event
   * @param {object} evt - event
   */
  handleMessage(evt) {
    // assume strings are SVG fonts
    window.GlyphrStudio.temp.droppedFileContent = evt.data;

    if (typeof evt.data === 'string') {
      ioSVG_importSVGFont(false);

      // assume array buffers are otf fonts
    } else if (evt.data instanceof ArrayBuffer) {
      importOTFFont(false);
    }
  }

  /**
   * Handle DragOver event
   * @param {object} evt - event
   */
  handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';

    const dropZone = document.getElementById('open-project__right-area');
    dropZone.style.backgroundColor = _UI.colors.blue.l95;
    dropZone.innerHTML = 'Drop it!';
  }

  /**
   * Handle DragLeave event
   * @param {object} evt - event
   */
  handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const dropZone = document.getElementById('open-project__right-area');
    dropZone.style.backgroundColor = _UI.colors.gray.offWhite;
    dropZone.innerHTML = makeTabs();
    changeTab('load');
  }

  /**
   * Create a new project from scratch
   */
  handleNewProject() {
    setTimeout(function () {
      const projectEditor = window.GlyphrStudio.getCurrentProjectEditor();
      projectEditor.project = new GlyphrStudioProject();
      window.GlyphrStudio.navigate('glyph edit');
    }, 5);
  }

  /**
   * Load a project sample
   * @param {string} name - which sample to load
   */
  handleLoadSample(name) {
    document.getElementById('openProjectExampleProjects').innerHTML =
      '<h2>Load an Example project</h2>Loading example project...';

    setTimeout(function () {
      window.GlyphrStudio.getCurrentProjectEditor().project = new GlyphrStudioProject(
        projects[name]
      );
      window.GlyphrStudio.navigate('glyph edit');
    }, 5);
  }
}
