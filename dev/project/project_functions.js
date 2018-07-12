import {decToHex} from '../app/unicode.js';
import {round} from '../app/functions.js';

export {saveGlyphrProjectFile, cloneForSaveData, makeProjectID,
    makeDateStampSuffix, glyphRangeIterator, calcFontMaxes};

/**
 * Save a Glyphr Project Text File
 * @param {boolean} overwrite - for Electron app, overwrite current working file
 */
function saveGlyphrProjectFile(overwrite) {
    // debug('SAVEGLYPHRPROJECTVILE');
    // debug('\t ' + _GP.projectSettings.formatsavefile);

    // desktop overwrite / save as logic
    if (window && window.process && window.process.type) {
        if (overwrite) {
            window.saveFileOverwrite = true;
        } else {
            window.saveFileOverwrite = false;
        }
    }

    let savedata = cloneForSaveData(_GP);

    if (_GP.projectSettings.formatsavefile) savedata = json(savedata);
    else savedata = JSON.stringify(savedata);

    // debug('saveGlyphrProjectFile - \n'+savedata);
    let fname = _GP.projectSettings.name + ' - Glyphr Project - ' + makeDateStampSuffix() + '.txt';

    saveFile(fname, savedata);

    closeDialog();
    setProjectAsSaved();
}

/**
 * Clone the _GP object with some special omissions
 * @param {object} cobj - _GP to clone
 * @returns {object}
 */
function cloneForSaveData(cobj) {
    let newObj = (cobj instanceof Array) ? [] : {};
    for (let i in cobj) {
        if (i !== 'parent' && i !== 'cache') {
            if (cobj[i] && typeof cobj[i] === 'object') {
                newObj[i] = cloneForSaveData(cobj[i]);
            } else newObj[i] = cobj[i];
        }
    }
    return newObj;
}

/**
 * Generate a unique Project ID so we can recognize a
 * project through file name and project name re-naming
 * @returns {string} - ID
 */
function makeProjectID() {
    let j = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let re = 'g_';

    for (let i=0; i<10; i++) {
        re += j.charAt(Math.floor(round(Math.random()*j.length)));
    }

    return re;
}

/**
 * Generates a date suffix for file saves
 * @returns {string}
 */
function makeDateStampSuffix() {
    let d = new Date();
    let yr = d.getFullYear();
    let mo = d.getMonth()+1;
    let day = d.getDate();
    let hr = d.getHours();
    let min = (d.getMinutes()<10? '0' : '') + d.getMinutes();
    let sec = (d.getSeconds()<10? '0' : '') + d.getSeconds();

    return (''+yr+'.'+mo+'.'+day+'-'+hr+'.'+min+'.'+sec);
}

/**
 * Iterates through each glyph calling a function
 * collecting results if they are provided
 * @param {function} fname - function to call on each glyph
 * @returns {*}
 */
function glyphRangeIterator(fname) {
    let cr = _GP.projectSettings.glyphrange;
    let ccon = '';
    // var count = 0;

    if (cr.basiclatin) {
        for (let i=0; i<_UI.basiclatinorder.length; i++) {
            ccon += fname(_UI.basiclatinorder[i]);
            // count++;
        }
    }

    if (cr.latinsupplement) {
        for (let s=_UI.glyphrange.latinsupplement.begin; s<=_UI.glyphrange.latinsupplement.end; s++) {
            ccon += fname(decToHex(s));
            // count++;
        }
    }

    if (cr.latinextendeda) {
        for (let a=_UI.glyphrange.latinextendeda.begin; a<=_UI.glyphrange.latinextendeda.end; a++) {
            ccon += fname(decToHex(a));
            // count++;
        }
    }

    if (cr.latinextendedb) {
        for (let b=_UI.glyphrange.latinextendedb.begin; b<=_UI.glyphrange.latinextendedb.end; b++) {
            ccon += fname(decToHex(b));
            // count++;
        }
    }

    if (cr.custom.length) {
        for (let c=0; c<cr.custom.length; c++) {
            for (let range=cr.custom[c].begin; range<cr.custom[c].end; range++) {
                ccon += fname(decToHex(range));
                // count++;
            }
        }
    }

    // debug('GLYPHRangeITERATOR - count returned ' + count);

    return ccon;
}

/**
 * Calculate the overall bounds given every glyph in this font
 */
function calcFontMaxes() {
    let fm = _UI.fontMetrics;
    fm.numberOfGlyphs = 0;
    fm.maxGlyph = 0x20;

    glyphRangeIterator(function(hex) {
        fm.numberOfGlyphs++;
        fm.maxGlyph = Math.max(fm.maxGlyph, hex);
        let cm = _GP.glyphs[hex];
        if (cm) {
            cm = cm.maxes;
            fm.maxes.xMax = Math.max(cm.xMax, fm.maxes.xMax);
            fm.maxes.xMin = Math.min(cm.xMin, fm.maxes.xMin);
            fm.maxes.yMax = Math.max(cm.yMax, fm.maxes.yMax);
            fm.maxes.yMin = Math.min(cm.yMin, fm.maxes.yMin);
        }
    });

    // var proportion = (fm.yMax / (fm.yMax-fm.yMin));
    // var total = fm.yMax + Math.abs(fm.yMin) + _GP.projectSettings.lineGap;
    // fm.hhea_ascent = round(total*proportion);
    // fm.hhea_descent = (fm.hhea_ascent - total);

    // debug('CALCFONTMAXES - numberOfGlyphs ' + _UI.fontMetrics.numberOfGlyphs);
}
