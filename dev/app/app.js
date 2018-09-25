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
    }

    /**
     * Starts up the app
     */
    start() {
        // Navigate
        if (_UI.devMode) {
            // debug('\t >>> DEV NAV - to ' + _UI.dev_currentPage);
            document.title = '░▒▓█ GSDEVMODE █▓▒░';

            if (_UI.dev_sampleProject) {
                // debug('\t >>> Using sample project');
                _UI.droppedFileContent = JSON.stringify(_UI.sampleproject[_UI.dev_sampleProject]);
                importGlyphrProjectFromText();
                _UI.dev_sampleProject = false;
            } else {
                newGlyphrStudioProject();
            }

            if (_UI.dev_currentPage === 'import svg') {
                _UI.importSVG.scale = false;
                _UI.importSVG.move = false;
            }

            navigate({page: (_UI.dev_currentPage || 'openproject'), panel: _UI.dev_currentPanel});
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

        if (!_UI.devMode && _UI.telemetry) {
            try {
                setupga(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
                ga('create', 'UA-71021902-1', 'auto');
                ga('send', 'pageview');
            } catch (err) {
                console.warn('Google Analytics did not load.');
            }
        }

        navigate();

        if (_UI.devMode) _UI.testOnLoad();

        // debug(' MAIN SETUP - END\n');
    }

    /**
     * Global DOM elements that other UI relies on
     */
    insertGlobalDOMElements() {
        document.body.innerHTML = `<div id="primaryScreenLayout"></div>

            <div id="npSave"></div>

            <div id="saveFormatFlyout" style="display:none;">
                <div class="closeFormatFlyout" onclick="closeDialog();">&times</div>

                <button onclick="closeDialog(); showToast('Saving Glyphr Studio Project file...'); setTimeout(saveGlyphrProjectFile, 500);">
                    ${makeIcon({'name': 'button_npNav', 'width': 32, 'height': 32, 'size': 50, 'color': _UI.colors.blue.l95, 'hovercolor': false})}
                    <span>Glyphr Studio Project File</span>
                </button>

                <button onclick="closeDialog(); showToast('Exporting OTF font file...'); setTimeout(ioOTF_exportOTFfont, 500);">
                    ${makeIcon({'name': 'nav_exportotf', 'width': 32, 'height': 32, 'size': 50, 'color': _UI.colors.blue.l95, 'hovercolor': false})}
                    <span>OTF Font</span>
                </button>

                <button onclick="closeDialog(); showToast('Exporting SVG font file...'); setTimeout(ioSVG_exportSVGfont, 500);">
                    ${makeIcon({'name': 'nav_exportsvg', 'width': 32, 'height': 32, 'size': 50, 'color': _UI.colors.blue.l95, 'hovercolor': false})}
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
            popIn();
            if (_GP && _GP.projectSettings.stopPageNavigation && _UI.stopPageNavigation && !_UI.devMode) {
                return '\n\nOh Noes!\nUnless you specifically saved your Glyphr Project, all your progress will be lost.\n\n';
            } else {
                return;
            }
        };
    }
}
