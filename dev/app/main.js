import manifest from '../manifest.js';

window._UI = {};
window._GP = {};
window._DEV = {};

// Window stuff
// It would be great if we could conditionally load modules.

import * as colors from './colors.js';
window._DEV.colors = colors;

import * as functions from './functions.js';
window._DEV.functions = functions;

import * as coord from '../glyph_elements/coord.js';
window._DEV.coord = coord;

import * as maxes from '../glyph_elements/maxes.js';
window._DEV.maxes = maxes;

import * as handle from '../glyph_elements/handle.js';
window._DEV.handle = handle;

import * as pathpoint from '../glyph_elements/pathpoint.js';
window._DEV.pathpoint = pathpoint;

import * as segment from '../glyph_elements/segment.js';
window._DEV.segment = segment;

import * as path from '../glyph_elements/path.js';
window._DEV.path = path;
/*
import * as polysegment from '../glyph_elements/polysegment.js';
window._DEV.polysegment = polysegment;
*/


/**
 * MAIN
 * Some stuff to get up and running
 */
//  debug(`\n MAIN.js - START`);


/**
 * First function to run when the browser starts
 */
export default function glyphrStudioOnLoad() {
    // console.clear();
    console.log('%c\n       GG              GG\n       G               G\n GGGG  G GG   G  GGGG  GGGGG   GGGGG\nG    G G G    G G    G G    G G     G\nG    G G G    G G    G G    G G\n GGGGG G  GGGGG GGGGG  GG   G GG\nGG   G   GG   G G             STUDIO\n GGGG     GGGG  GG\n\nv' + _UI.thisGlyphrStudioVersionNum + '\n\n', 'color:rgb(0,170,225)');
    // debug('\n MAIN SETUP - START');

    // Initialize Stuff
    assemble();
    insertGlobalDOMElements();
    setupGhostCanvas();
    document.title = 'Glyphr Studio';

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
};

/**
 * Global DOM elements that other UI relies on
 */
function insertGlobalDOMElements() {
    document.body.innerHTML = `<div id="primaryScreenLayout"></div>

        <canvas id="isHereGhostCanvas" height=10 width=10 ></canvas>

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
};

/**
 * Assemble adds .js and .css file references to the current HTML doc
 * @param {boolean} loadTests - optionally load test files
 * @param {function} callback - function to run after assembly
 *  manifest.js is found in the root of the dev directory
 */
export function assemble(loadTests = false, callback = new function() {}) {
    debug(`\n assemble - START`);

    let tests = [];
    let newElement;
    let nonModules = 'opentypejs';

    // debug(manifest);

    manifest.forEach((directory) => {
        directory.files.forEach((file) => {
            let suffix = file.split('.')[1];

            // console.log(`loading file ${file} with suffix ${suffix}`);

            if (suffix === 'js' || suffix === 'map') {
                newElement = document.createElement('script');
                newElement.setAttribute('src', `${directory.path}/${file}`);
                if (file.indexOf(nonModules) === -1) newElement.setAttribute('type', 'module');
                document.getElementsByTagName('head')[0].appendChild(newElement);
            } else if (suffix === 'css') {
                newElement = document.createElement('link');
                newElement.setAttribute('rel', 'stylesheet');
                newElement.setAttribute('type', 'text/css');
                newElement.setAttribute('href', `${directory.path}/${file}`);
                document.getElementsByTagName('head')[0].appendChild(newElement);
            } else if (suffix === 'test') {
                if (loadTests) {
                    tests.push(`${directory.path}/${file}`);
                }
            } else {
                console.warn(`Assemble - unhandled file type ${suffix}`);
            }

            // debug(`\t added ${file}`);
        });
    });

    if (loadTests) {
        tests.forEach((element) => {
            newElement = document.createElement('script');
            newElement.setAttribute('src', element);
            newElement.setAttribute('type', 'module');
            document.getElementsByTagName('head')[0].appendChild(newElement);

            // debug(`\t added test ${element}`);
        });
    }

    debug(` assemble - END\n\n`);
    window.setTimeout(callback, 500);
};
