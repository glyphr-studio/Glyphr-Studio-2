import {colors} from './colors.js';
import GlyphrStudioProject from '../project/glyphr_studio_project.js';
import ProjectEditor from '../project/project_editor.js';

/**
 * Creates a new Glyphr Studio Application
 */
export default class GlyphrStudioApp {
    /**
     * Initialize the Glyphr Studio App, with defaults
     */
    constructor() {
        // Version
        this.version = 'Version 2 alpha';
        this.versionNum = '2.0.0';
        this.versionDate = 0;

        this.projectEditors = [];
        this.selectedProjectEditor = 0;

        this.settings = {};
    }

    /**
     * Starts up the app
     */
    start() {
        // Navigate
        if (this.settings.devMode) {
            // debug('\t >>> DEV NAV - to ' + this.settings.dev_currentPage);
            document.title = '░▒▓█ GSDEVMODE █▓▒░';

            if (this.settings.dev_sampleProject) {
                // debug('\t >>> Using sample project');
                this.settings.droppedFileContent = JSON.stringify(this.settings.sampleproject[this.settings.dev_sampleProject]);
                importGlyphrProjectFromText();
                this.settings.dev_sampleProject = false;
            } else {
                newGlyphrStudioProject();
            }

            if (this.settings.dev_currentPage === 'import svg') {
                this.settings.importSVG.scale = false;
                this.settings.importSVG.move = false;
            }

            navigate({page: (this.settings.dev_currentPage || 'openproject'), panel: this.settings.dev_currentPanel});
        } else {
            _DEV = {};
        }

        /* eslint-disable */
        function setupga(i, s, o, g, r, a, m) {
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

        if (!this.settings.devMode && this.settings.telemetry) {
            try {
                setupga(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
                ga('create', 'UA-71021902-1', 'auto');
                ga('send', 'pageview');
            } catch (err) {
                console.warn('Google Analytics did not load.');
            }
        }

        navigate();

        if (this.settings.devMode) this.settings.testOnLoad();

        // debug(' MAIN SETUP - END\n');
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
                    ${makeIcon({'name': 'button_npNav', 'width': 32, 'height': 32, 'size': 50, 'color': colors.blue.l95, 'hovercolor': false})}
                    <span>Glyphr Studio Project File</span>
                </button>

                <button onclick="closeDialog(); showToast('Exporting OTF font file...'); setTimeout(ioOTF_exportOTFfont, 500);">
                    ${makeIcon({'name': 'nav_exportotf', 'width': 32, 'height': 32, 'size': 50, 'color': colors.blue.l95, 'hovercolor': false})}
                    <span>OTF Font</span>
                </button>

                <button onclick="closeDialog(); showToast('Exporting SVG font file...'); setTimeout(ioSVG_exportSVGfont, 500);">
                    ${makeIcon({'name': 'nav_exportsvg', 'width': 32, 'height': 32, 'size': 50, 'color': colors.blue.l95, 'hovercolor': false})}
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
                !this.settings.devMode) {
                return '\n\nOh Noes!\nUnless you specifically saved your Glyphr Project, all your progress will be lost.\n\n';
            } else {
                return;
            }
        };
    }
}
