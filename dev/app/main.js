import manifest from '../manifest.js';

window._DEV = {};

// Window stuff
// It would be great if we could conditionally load modules.

import * as colors from './colors.js';
window._DEV.colors = colors;

import * as functions from './functions.js';
window._DEV.functions = functions;

import * as xypoint from '../glyph_elements/xypoint.js';
window._DEV.xypoint = xypoint;

import * as coord from '../glyph_elements/coord.js';
window._DEV.coord = coord;

import * as maxes from '../glyph_elements/maxes.js';
window._DEV.maxes = maxes;

import * as controlpoint from '../glyph_elements/controlpoint.js';
window._DEV.controlpoint = controlpoint;

import * as pathpoint from '../glyph_elements/pathpoint.js';
window._DEV.pathpoint = pathpoint;

import * as segment from '../glyph_elements/segment.js';
window._DEV.segment = segment;

import * as path from '../glyph_elements/path.js';
window._DEV.path = path;

import * as polysegment from '../glyph_elements/polysegment.js';
window._DEV.polysegment = polysegment;

import * as shape from '../glyph_elements/shape.js';
window._DEV.shape = shape;

import * as componentinstance from '../glyph_elements/componentinstance.js';
window._DEV.componentinstance = componentinstance;

import * as glyph from '../glyph_elements/glyph.js';
window._DEV.glyph = glyph;

import * as hkern from '../glyph_elements/hkern.js';
import GlyphrStudioApp from './app.js';
window._DEV.hkern = hkern;


/**
 * MAIN
 * Some stuff to get up and running
 */
//  debug(`\n MAIN.js - START`);


/**
 * First function to run when the browser starts
 */
export default function glyphrStudioOnLoad() {
    assemble();
    window.GlyphrStudio = new GlyphrStudioApp();
    window.GlyphrStudio.start();
    console.log('%c\n       GG              GG\n       G               G\n GGGG  G GG   G  GGGG  GGGGG   GGGGG\nG    G G G    G G    G G    G G     G\nG    G G G    G G    G G    G G\n GGGGG G  GGGGG GGGGG  GG   G GG\nGG   G   GG   G G             STUDIO\n GGGG     GGGG  GG\n\nv' + window.GlyphrStudio.versionNum + '\n\n', 'color:rgb(0,170,225)');
}


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
