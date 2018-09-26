import manifest from '../manifest.js';
import GlyphrStudioApp from './app.js';

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

        // main.test.js adds Glyph Element classes to the window._DEV object
        newElement = document.createElement('script');
        newElement.setAttribute('src', `app/main.test.js`);
        newElement.setAttribute('type', 'module');
        document.getElementsByTagName('head')[0].appendChild(newElement);
    }

    debug(` assemble - END\n\n`);
    window.setTimeout(callback, 500);
};
