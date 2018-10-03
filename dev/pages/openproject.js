import {makeElement, addEventHandler} from './../controls/controls.js';
import {makeGlyphrStudioLogo} from './../common/graphics.js';
import {makeErrorMessageBox} from './../controls/dialogs.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 * HTML and associated functions for this page.
 */
export default class PageOpenProject {
    /**
     * Initialize this page
     */
    constructor() {

    }

    /**
     * Load the Open Project page
     * @returns {object} HTML Element + callback function
     */
    pageLoader() {
        debug(`\n PageOpenProject.pageLoader - START`);

        let recent = 1000*60*60*24*7; // seven days in milliseconds
        let recentMessage = '';
        let app = window.GlyphrStudio;
        if ((Date.now() - app.versionDate) < recent) {
            recentMessage = ` - <a href="http://help.glyphrstudio.com/overview_updates.html" target="_blank">recently updated!</a>`;
        }

        let content = makeElement({tag: 'div', id: 'pageWrapper', innerHTML: `
            <table style="height:100%; width:100%;"><tr>
            <td id="openProjectTableLeft" vertical-align="middle">
            <div id="splashScreenLogo"></div>

                <span class="splashVerName">${app.version}</span>

                <span class="splashVerNum">${app.versionNum.split('.')[2]}${recentMessage}</span>

                <div class="splashBlurb">
                    For more informaiton visit <a href="http://www.glyphrstudio.com" target="_blank">www.glyphrstudio.com</a><br>
                    Glyphr Studio is licensed under a <a href="https://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License</a>,
                    which is a free / open source "copyleft" license. You are free to use, distribute, and modify Glyphr Studio as long as
                    this license and its freeness stays intact.
                </div>
                <input style="display:none;" type="file" id="openProjectFileChooser"/>
            </td>
            <td id="openProjectTableRight" vertical-align="middle">${this.makeTabs()}</td>
            </tr></table>
            <input type="file" style="display:none" id="openProjectFileChooser"></input>`,
        });

        let callback = function(page) {
            debug(`\n PageOpenProject.pageLoader.callback - START`);

            // Overall page drag + drop handlers
            addEventHandler('openProjectTableRight', 'dragover', page.handleDragOver);
            addEventHandler('openProjectTableRight', 'drop', page.handleDrop);
            addEventHandler('openProjectTableRight', 'dragleave', page.handleDragLeave);
            addEventHandler('openProjectTableLeft', 'dragover', page.handleDragOver);
            addEventHandler('openProjectTableLeft', 'drop', page.handleDrop);
            addEventHandler('openProjectTableLeft', 'dragleave', page.handleDragLeave);
            addEventHandler('openProjectFileChooser', 'change', page.handleDrop);


            // Tab click
            addEventHandler('newTab', 'click',
                function() {
                    page.changeTab('new');
                }
            );

            addEventHandler('loadTab', 'click',
                function() {
                    page.changeTab('load');
                }
            );

            addEventHandler('examplesTab', 'click',
                function() {
                    page.changeTab('examples');
                }
            );


            // Starting a project
            addEventHandler('openProjectCreateNewProject', 'click', page.handleNewProject);


            // For Electron app
            window.addEventListener('message', page.handleMessage, false);
            if (window.opener) window.opener.postMessage('ready', '*');


            // Finish up populating UI
            page.changeTab();
            document.getElementById('splashScreenLogo').innerHTML = makeGlyphrStudioLogo({'fill': '#BAD9E9', 'width': 400});

            debug(` PageOpenProject.pageLoader.callback - END\n\n`);
        };

        let re = {content: content, callback: callback};
        debug(re);
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
        <div class="openProjectTabs">
            <button id="newTab">new</button><button id="loadTab">load</button><button id="examplesTab">examples</button>
        </div>`;

        // LOAD
        con += `
        <div class="openProjectTabContent" id="openProjectLoadContent" style="display: none;">
            <h2>Load a file</h2>
            <fancy-button secondary onclick="document.getElementById('openProjectFileChooser').click();">
                Browse for a File
            </fancy-button>&ensp; or Drag and Drop:
            <div id="dropTarget">
                Glyphr Studio Project &ensp;(.txt)<br>
                Open Type or True Type Font &ensp;(.otf or .ttf)<br>
                SVG Font &ensp;(.svg)
            </div>
            <div style="width:335px;">${makeErrorMessageBox()}</div>
        </div>`;

        // NEW
        con += `
        <div class="openProjectTabContent" id="openProjectNewContent" style="display: none;">
            <h2>Start a new Glyphr Studio Project</h2>
            Project name: &nbsp; <input id="newProjectName" type="text" value="My Font" autofocus/><br>
            <fancy-button id="openProjectCreateNewProject">Start a new font from scratch</fancy-button>
        </div>`;

        // EXAMPLES
        con += `
        <div class="openProjectTabContent" id="openProjectExampleProjects" style="display: none;">
            <h2>Load an Example project</h2>

            Modegg is a project that utilizes Glyphr Studio features, like Components:<br>
            <fancy-button secondary onclick="handleLoadSample('modegg');">Modegg</fancy-button><br><br>

            California Gothic is an all-caps display font:<br>
            <fancy-button secondary onclick="handleLoadSample('californiagothic');">California Gothic</fancy-button><br><br>

            Merriweather Sans is an open-source font imported from an Open Type file:<br>
            <fancy-button secondary onclick="handleLoadSample('merriweathersans');">Merriweather Sans</fancy-button><br><br>
        </div>`;

        return '<div class="openProjectTabWrapper">' + con + '</div>';
    }

    /**
     * Handle tab changes
     * @param {string} tab - which tab to select
     */
    changeTab(tab) {
        let contentnew = document.getElementById('openProjectNewContent');
        let contentload = document.getElementById('openProjectLoadContent');
        let contentexamples = document.getElementById('openProjectExampleProjects');
        // var contentrecent = document.getElementById('recent_content');

        let tabnew = document.getElementById('newTab');
        let tabload = document.getElementById('loadTab');
        let tabexamples = document.getElementById('examplesTab');
        // var tabrecent = document.getElementById('recent_tab');

        contentnew.style.display = 'none';
        contentload.style.display = 'none';
        contentexamples.style.display = 'none';
        // contentrecent.style.display = 'none';

        tabnew.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
        tabload.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
        tabexamples.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';
        // tabrecent.style.borderBottomColor = 'rgba(127, 127, 127, 0.5)';


        if (tab === 'load') {
            contentload.style.display = 'block';
            tabload.style.borderBottomColor = '#2EB5FA';
        } else if (tab === 'examples') {
            contentexamples.style.display = 'block';
            tabexamples.style.borderBottomColor = '#2EB5FA';
        } else {
            // default to new
            contentnew.style.display = 'block';
            tabnew.style.borderBottomColor = '#2EB5FA';
        }
    }

    /**
     * Handle file drop
     * @param {object} evt - drop event
     */
    handleDrop(evt) {
        // debug('\n handleDrop - START');
        document.getElementById('openProjectTableRight').innerHTML = 'Loading File...';
        document.getElementById('openProjectTableRight').style.backgroundColor = _UI.colors.gray.offwhite;

        evt.stopPropagation();
        evt.preventDefault();

        let f = evt.dataTransfer || document.getElementById('openProjectFileChooser');
        f = f.files[0];
        // debug('\t filename: ' + f.name);
        let fname = f.name.split('.');
        fname = fname[fname.length-1].toLowerCase();
        // debug('\t fname = ' + fname);

        let reader = new FileReader();

        if (fname === 'otf' || fname === 'ttf') {
            reader.onload = function() {
                // debug('\n reader.onload::OTF or TTF - START');
                window.GlyphrStudio.temp.droppedFileContent = reader.result;
                ioOTF_importOTFfont();
                // debug(' reader.onload:: OTF or TTF - END\n');
            };

            reader.readAsArrayBuffer(f);
        } else if (fname === 'svg' || fname === 'txt') {
            reader.onload = function() {
                // debug('\n reader.onload::SVG or TXT - START');
                window.GlyphrStudio.temp.droppedFileContent = reader.result;
                if (fname === 'svg') {
                    // debug('\t File = .svg');
                    ioSVG_importSVGfont();
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
            con += 'Glyphr Studio can\'t import .' + fname + ' files.<br>';
            con += 'Try loading another file.';
            document.getElementById('openProjectTableRight').innerHTML = makeTabs();
            changeTab('load');
            showErrorMessageBox(con);
            document.getElementById('openProjectTableRight').style.backgroundColor = _UI.colors.gray.offwhite;
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

        if ( typeof evt.data === 'string' ) {
            ioSVG_importSVGfont(false);

        // assume array buffers are otf fonts
        } else if ( evt.data instanceof ArrayBuffer ) {
            ioOTF_importOTFfont(false);
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

        let frtr = document.getElementById('openProjectTableRight');
        frtr.style.backgroundColor = _UI.colors.blue.l95;
        frtr.innerHTML = 'Drop it!';
    }

    /**
     * Handle DragLeave event
     * @param {object} evt - event
     */
    handleDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        let frtr = document.getElementById('openProjectTableRight');
        frtr.style.backgroundColor = _UI.colors.gray.offwhite;
        frtr.innerHTML = makeTabs();
        changeTab('load');
    }

    /**
     * Create a new project from scratch
     */
    handleNewProject() {
        setTimeout(function() {
            loadGlyphrStudioProject();
            window.GlyphrStudio.navigate();
        }, 5);
    }

    /**
     * Load a project sample
     * @param {string} name - which sample to load
     */
    handleLoadSample(name) {
        document.getElementById('openProjectExampleProjects').innerHTML = '<h2>Load an Example project</h2>Loading example project...';

        setTimeout(function() {
            // loadGlyphrStudioProject(_UI.sampleproject[name]);
            window.GlyphrStudio.getCurrentProjectEditor().project =
            window.GlyphrStudio.getCurrentProjectEditor().nav.page = 'glyph edit';
            window.GlyphrStudio.navigate();
        }, 5);
    }
}
