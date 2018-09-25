
/**
 * Migrate Glyphr Studio Projects
 * Handling backwards compatibility for old Glyphr
 * Studio projects via rolling upgrades.
 *
 * !!! DANGER !!!
 * Because this file contains "old" variables that
 * have since been corrected, there are probably a
 * lot of "wrong" stuff here.  If someone is doing
 * global find/replace-s, please exclude this file.
 * ESLint may also have a lot of problems with this
 * file, I'll try to include all the applicable
 * disables.
 */

/* eslint-disable camel-case */

/**
 * Migrate V1 to V2
 * This is mostly camelCaseIng project variables
 * @param {GlyphrStudioProject} project
 * @param {number} minor - minor version
 * @returns {GlyphrStudioProject}
 */
export function migrateV1toV2(project, minor) {
    // CamelCase the project variables
    return project;
}


/**
 * Wrapper function to do rolling upgrades to
 * migrate all Beta versions to V1
 * @param {GlyphrStudioProject} project - project object
 * @param {number} minor - minor version
 * @returns {GlyphrStudioProject} - project JSON
 */
export function migrateBetasToV1(project, minor) {
    // debug('\n migrateBetasToV1 - START');
    // debug(project);
    // Start rolling upgrades

    switch (minor) {
        case 3:
            // debug("\t Minor Version === 3");
            project = migrate03to04(project);
            minor = 4;
            // debug('\t migrated to 0.4');
        case 4:
            // debug("\t Minor Version === 4");
            project = migrate04to05(project);
            minor = 5;
            // debug('\t migrated to 0.5');
        case 5:
            // debug("\t Minor Version === 5");
            project = migrate05to10(project);

            // debug('\t migrated to 1.0');
    }

    // debug(' migrateBetasToV1 - END\n');
    return project;
}

/**
 * Migrate 0.5 to 1.0
 * @param {GlyphrStudioProject} project - project object
 * @returns {GlyphrStudioProject}
 */
export function migrate05to10(project) {
    // debug('\n migrate05to10 - START');

    // Update new top level objects
    project.glyphs = clone(project.fontchars);
    project.components = clone(project.linkedshapes);
    project.projectSettings.glyphrange = clone(project.projectSettings.charrange);
    delete project.fontchars;
    delete project.linkedshapes;
    delete project.projectSettings.charrange;
    // debug('\t DONE tlo');


    // Upgrade Linked Shapes to full Glyphs
    let com;
    let sh;
    let ui;
    let gn;
    for (let c in project.components) {
    if (project.components.hasOwnProperty(c)) {
        com = project.components[c];
            if (com.shape) {
                sh = [com.shape];
                gn = com.shape.name || 'Shape';
            } else {
                sh = [];
                gn = 'Shape';
            }
            ui = com.usedIn? com.usedIn : [];
            project.components[c] = new Glyph({'shapes': sh, 'usedIn': ui, 'name': gn, 'glyphhtml': ''});
        }
    }
    // debug('\t DONE ls > glyph');


    // Switch from Char to Glyph
    // Switch from Ligature to Glyph
    // Update Glyphs to use Components not Linked Shapes
    for (let g in project.glyphs) {
        if (project.glyphs.hasOwnProperty(g)) {
            project.glyphs[g] = charToGlyph(project.glyphs[g]);
        }
    }

    for (let l in project.ligatures) {
        if (project.ligatures.hasOwnProperty(l)) {
                project.ligatures[l] = charToGlyph(project.ligatures[l]);
            }
        }

    // debug(project);
    // debug(' migrate05to10 - END\n');
    return project;
}

/**
 * Convert old Char object to new Glyph format
 * @param {Glyph} glyph - old Char
 * @returns {Glyph}
 */
export function charToGlyph(glyph) {
    let gshapes;
    let dx;
    let dy;
    glyph.shapes = glyph.charshapes || [];
    glyph.name = glyph.charname || false;
    glyph.glyphhtml = glyph.charhtml || false;
    glyph.glyphWidth = glyph.charwidth || false;
    delete glyph.charshapes;
    delete glyph.charname;
    delete glyph.charhtml;
    delete glyph.charwidth;

    gshapes = glyph.shapes;
    // debug('\t Glyph ' + glyph.charname);
    for (let s=0; s<gshapes.length; s++) {
        sh = gshapes[s];
        if (sh.objType === 'linkedshapeinstance') {
            dx = sh.uselinkedshapexy? 0 : sh.xpos;
            dy = sh.uselinkedshapexy? 0 : sh.ypos;
            gshapes[s] = new ComponentInstance({'name': sh.name, 'link': sh.link, 'translateX': dx, 'translateY': dy, 'xLock': sh.xLock, 'yLock': sh.yLock});
        }


        if (isVal(gshapes[s].uselinkedshapexy)) {
            // debug('\t\t shape ' + gshapes[s].name + ' uselsxy: ' + typeof gshapes[s].uselinkedshapexy + ' ' + gshapes[s].uselinkedshapexy);
            gshapes[s].usecomponentxy = gshapes[s].uselinkedshapexy;
            delete gshapes[s].uselinkedshapexy;
            // debug('\t\t now usecomxy: ' + gshapes[s].usecomponentxy);
        }
    }

    return glyph;
}

/**
 * Migrate beta 4 to beta 5
 * @param {GlyphrStudioProject} project - Char objects
 * @returns {GlyphrStudioProject}
 */
export function migrate04to05(project) {
    // debug('\n migrate04to05 - START');
    let tc;

    for (let i in project.fontchars) {
        if (project.fontchars.hasOwnProperty(i)) {
                tc = project.fontchars[i];
                // debug("migrate03to04 - fontchars " + i + " is " + tc);
                tc.charwidth = tc.advancewidth || project.projectSettings.upm || 1000;
            }
        }
    // debug(project);
    // debug(' migrate04to05 - END\n');
    return project;
}

/**
 * Migrate beta 3 to beta 4
 * @param {Object} fc - project
 * @returns {GlyphrStudioProject}
 */
export function migrate03to04(fc) {
    // debug('\n migrate03to04 - START');
    newgp = new GlyphrStudioProject();

    let tls;
    for (let l in fc.linkedshapes) {
        if (fc.linkedshapes.hasOwnProperty(l)) {
            tls = fc.linkedshapes[l];
            // debug("migrate03to04 - usedIn before " + tls.usedIn);
            if (tls.usedIn) {
                for (let u=0; u<tls.usedIn.length; u++) {
                    tls.usedIn[u] = decToHex(tls.usedIn[u]);
                }
                // debug("migrate03to04 - usedIn after " + tls.usedIn);
            }
        }
    }

    let newps = newgp.projectSettings;
    for (let e in fc.projectSettings) {
        if (newps.hasOwnProperty(e)) {
            newps[e] = fc.projectSettings[e];
        }
    }
    fc.projectSettings = newps;

    let tc;
    let hexID;
    for (let i=0; i<fc.fontchars.length; i++) {
        tc = fc.fontchars[i];
        // debug("migrate03to04 - fontchars " + i + " is " + tc);
        if (tc) {
            hexID = '0x00'+tc.cmapcode.substr(2).toUpperCase();
            fc.fontchars[hexID] = tc;
            fc.fontchars[hexID].charhtml = hexToHTML(hexID);
            // debug("migrate03to04 - fc.fontchars[" + hexID + "] is " + json(fc.fontchars[hexID]));
        }
    }
    // debug(fc);
    // debug(' migrate03to04 - END\n');
    return fc;
}
