export {
    getProject,
    getGlyph, getGlyphType, getGlyphName, getFirstGlyphID,
    getSelectedGlyphLeftSideBearing, getSelectedGlyphRightSideBearing,
    updateCurrentGlyphWidth,
    getSelectedKern, getSelectedKernID,
};

export default {};

/**
 * Get the current Glyphr Studio Project
 * @returns {GlyphrStudioProject}
 */
function getProject() {
    if (_GP) return _GP;
    else return {};
}

// --------------------------------------------------------------
// GLYPH FUNCTIONS
// --------------------------------------------------------------

/**
 * Get a glyph by ID, create it if need be
 * @param {string} id - which Glyph to return
 * @param {boolean} create - create if it doesn't exist yet
 * @returns {Glyph}
 */
function getGlyph(id, create) {
    // debug('\n getGlyph - START');
    // debug('\t passed: ' + id + ' create: ' + create);

    if (!id) {
        // debug('\t Not passed an ID, returning false');
        return false;
    }

    if (_GP === {}) {
        // debug('\t _GP is uninitialized, returning false');
        return false;
    }

    id = ''+id;
    let rechar;

    if (id.indexOf('0x', 2) > -1) {
        rechar = _GP.ligatures[id];
        // debug('\t retrieved ' + rechar + ' from ligatures.');
        if (rechar) {
            return rechar;
        } else if (create) {
            // debug('\t create was true, returning a new ligature.');
            _GP.ligatures[id] = new Glyph({'glyphhex': id});
            return _GP.ligatures[id];
        }
    } else if (id.indexOf('0x') > -1) {
        rechar = _GP.glyphs[id];
        // debug('\t retrieved ' + rechar + ' from glyphs.');
        if (rechar) {
            return rechar;
        } else if (create) {
            // debug('\t create was true, returning a new char.');
            _GP.glyphs[id] = new Glyph({'glyphhex': id});
            return _GP.glyphs[id];
        }
    } else {
        // debug('\t component, retrieved');
        // debug(_GP.components[id]);
        return _GP.components[id] || false;
    }

    // debug('getGlyph - returning FALSE\n');
    return false;
}

/**
 * Get the type of glyph based on it's ID
 * @param {string} id - Glyph ID
 * @returns {string}
 */
function getGlyphType(id) {
    if (id.indexOf('0x', 2) > -1) return 'Ligature';
    else if (id.indexOf('0x') > -1) return 'Glyph';
    else return 'Component';
}

/**
 * Get a glyph's name based on it's ID
 * @param {string} id - Glyph ID
 * @returns {string}
 */
function getGlyphName(id) {
    id = ''+id;
    // debug('\n getGlyphName');
    // debug('\t passed ' + id);

    // not passed an id
    if (!id) {
        // debug('\t not passed an ID, returning false');
        return false;
    }

    // known unicode names
    let un = getUnicodeName(id);
    if (un && un !== '[name not found]') {
        // debug('\t got unicode name: ' + un);
        return un;
    }

    let cobj = getGlyph(id);
    if (id.indexOf('0x', 2) > -1) {
        // ligature
        // debug('\t ligature - returning ' + hexToHTML(id));
        return cobj.name || hexToHTML(id);
    } else {
        // Component
        // debug('getGlyphName - inexplicably fails, returning [name not found]\n');
        return cobj.name || '[name not found]';
    }

    // debug(' getGlyphName - returning nothing - END\n');
}

/**
 * Just return the first Glyph that exists
 * @returns {Glyph}
 */
function getFirstGlyphID() {
    if (_GP.glyphs['0x0041']) return '0x0041';
    else return getFirstID(_GP.glyphs);
}

/**
 * Get the selected glyph's left side bearing
 * @returns {number}
 */
function getSelectedGlyphLeftSideBearing() {
    // debug('getSelectedGlyphLeftSideBearing');
    let sc = getSelectedWorkItem();
    if (!sc) return 0;
    if (sc.objType === 'component') return 0;
    if (!sc.isAutoWide) return 0;
    return sc.leftSideBearing || _GP.projectSettings.defaultLSB;
}

/**
 * Get the selected glyph's right side bearing
 * @returns {number}
 */
function getSelectedGlyphRightSideBearing() {
    // debug('getSelectedGlyphLeftSideBearing');
    let sc = getSelectedWorkItem();
    if (!sc) return 0;
    if (sc.objType === 'component') return 0;
    if (!sc.isAutoWide) return 0;
    return sc.rightSideBearing || _GP.projectSettings.defaultRSB;
}

/**
 * Updates the selected glyphs width
 */
function updateCurrentGlyphWidth() {
    let sc = getSelectedWorkItem();
    if (!sc) return;
    if (_UI.currentPage === 'glyph edit') {
        sc.changed();
    } else if (_UI.currentPage === 'components' && sc) {
        let lsarr = sc.usedIn;
        if (lsarr) for (let c=0; c<lsarr.length; c++) getGlyph(lsarr[c]).changed();
    }
}


// --------------------------------------------------------------
// Kern
// --------------------------------------------------------------

/**
 * Get the selected kern object
 * @returns {HKern}
 */
function getSelectedKern() {
    let re = _GP.kerning[_UI.selectedKern];
    return re || _GP.kerning[getFirstID(_GP.kerning)] || false;
}

/**
 * Get the selected kern ID
 * @returns {string}
 */
function getSelectedKernID() {
    _UI.selectedKern = _UI.selectedKern || getFirstID(_GP.kerning);
    return _UI.selectedKern;
}
