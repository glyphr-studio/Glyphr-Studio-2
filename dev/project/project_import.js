
import {getGlyph} from '../app/globalgetters.js';
export {importGlyphrProjectFromText, newGlyphrStudioProject};

/**
 * IO > Import > Glyphr Studio Project
 * Handling backwards compatibility for old Glyphr
 * Studio projects via rolling upgrades.  Once
 * a project has the current format, they are
 * 'hydrated' from simple text / JSON to full
 * Glyphr Studio Objects, and saved to the _GP
 * global variable.
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


// -------------------------------
// IMPORT FUNCTIONS
// -------------------------------

/**
 * Event handler for dropped project text files
 */
function importGlyphrProjectFromText() {
    // debug('\n importGlyphrProjectFromText - START');

    // -----------------------------
    // START IMPORT
    // -----------------------------

    let fcontent;
    try {
        fcontent = JSON.parse(_UI.droppedFileContent);
    } catch (e) {
        fcontent = {};
    }

    let tempVersion = false;
    let v = false;
    let ps = fcontent.projectSettings;
    if (ps) {
        tempVersion = ps.versionnum;
        v = ps.version;
    }
    // debug(fcontent);

    // Check for non Glyphr Project Files
    if (!v) {
        errorNoVersionFound();
        return;
    }

    // Give pre-Beta-3 accurate version
    if (!tempVersion) {
        tempVersion = '0.3.0';
        ps.initialversionnum = '0.3.0';
    }
    if (!ps.initialversionnum) ps.initialversionnum = tempVersion;

    let projectVersion = parseVersionNum(tempVersion);
    let currentAppVersion = parseVersionNum(_UI.thisGlyphrStudioVersionNum);
    // debug("\t versionnum found " + tempVersion);


    // Check for future versions
    if (projectVersion.major > currentAppVersion.major) {
        errorTimeTraveller();
        return;
    }

    // Roll upgrades through Beta to V1
    if (projectVersion.major === 0) {
        fcontent = migrateBetasToV1(fcontent, projectVersion.minor);
        projectVersion.major = 1;
        projectVersion.minor = 0;
    }
    // debug('\t done with beta updates');

    // Roll upgrades through V1 to V2
    if (projectVersion.major === 1) {
        // Check for future versions
        if (projectVersion.minor > currentAppVersion.minor) {
            errorTimeTraveller(); return;
        }

        // Roll through minor versions
        // The only change for v < 1.10 is correcting the spelling of 'suppliment'
        if (projectVersion.minor < 10) {
            fcontent.projectSettings.glyphrange.latinsupplement = fcontent.projectSettings.glyphrange.latinsuppliment;
            delete fcontent.projectSettings.glyphrange.latinsuppliment;
        }

        fcontent = migrateV1toV2(fcontent, projectVersion.minor);
        projectVersion.major = 2;
        projectVersion.minor = 0;
    }
    // debug('\t done with v1 minor updates');

    // Roll upgrades through V2
    if (projectVersion.major === 2) {
        // So far no updates among minor V2 versions
    }
    // debug(`\t done with v2 minor updates`);


    // Update the version
    ps.versionnum = _UI.thisGlyphrStudioVersionNum;
    ps.version = _UI.thisGlyphrStudioVersion;


    // Hydrate after all updates
    loadGlyphrStudioProject(fcontent);
    // debug(' importGlyphrProjectFromText - END\n');


    // -----------------------------
    // HELPER FUNCTIONS
    // -----------------------------

    /**
     * Parse text version number to variables
     * @param {string} vn - version number
     * @returns {object}
     */
    function parseVersionNum(vn) {
        vn = vn.split('.');
        return {
            'major': (vn[0]*1),
            'minor': (vn[1]*1),
            'patch': (vn[2]*1),
        };
    }

    /**
     * Error if no version information is found
     */
    function errorNoVersionFound() {
        let msg = 'No version information was found.  Either the file is not a Glyphr Studio Project, or the file has non-valid JSON data.  Please try a different file...';
        console.warn(msg);
        alert(msg);
    }

    /**
     * Error if a version number is found that is later than
     * the current app version number (which should be the latest)
     */
    function errorTimeTraveller() {
        let msg = 'Your Glyphr Project was created with a later version of Glyphr Studio.  This version of Glyphr Studio cannot open project files created in the future O_o (whoa).  Please go to glyphrstudio.com to get the latest release.';
        console.warn(msg);
        alert(msg);
    }


    // ------------------------
    // MIGRATE FUNCTIONS
    // ------------------------

    /**
     * Migrate V1 to V2
     * This is mostly camelCaseIng project variables
     * @param {GlyphrStudioProject} project
     * @param {number} minor - minor version
     * @returns {GlyphrStudioProject}
     */
    function migrateV1toV2(project, minor) {
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
    function migrateBetasToV1(project, minor) {
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
    function migrate05to10(project) {
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
    function charToGlyph(glyph) {
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
    function migrate04to05(project) {
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
     *
     * @param {Object} fc - project
     * @returns {GlyphrStudioProject}
     */
    function migrate03to04(fc) {
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
        let hex;
        for (let i=0; i<fc.fontchars.length; i++) {
            tc = fc.fontchars[i];
            // debug("migrate03to04 - fontchars " + i + " is " + tc);
            if (tc) {
                hex = '0x00'+tc.cmapcode.substr(2).toUpperCase();
                fc.fontchars[hex] = tc;
                fc.fontchars[hex].charhtml = hexToHTML(hex);
                // debug("migrate03to04 - fc.fontchars[" + hex + "] is " + json(fc.fontchars[hex]));
            }
        }
        // debug(fc);
        // debug(' migrate03to04 - END\n');
        return fc;
    }
}


/**
 * Load a new project into the global _GP variable, and do some
 * finalizing for the UI
 * @param {GlyphrStudioProject} newProject - project to hydrate
 * @param {Function} callback - What function to call when done
 */
function loadGlyphrStudioProject(newProject, callback) {
    _GP = new GlyphrStudioProject(newProject);
    if (callback) callback();
    finalizeUI();
}


/**
 * Creates a new Glyphr Studio Project object from scratch,
 * and assigns it to the global _GP variable
 */
function newGlyphrStudioProject() {
    let fn;
    if (document.getElementById('newprojectname') && document.getElementById('newprojectname').value) {
        fn = document.getElementById('newprojectname').value;
    } else {
        fn = 'My Font';
    }

    _GP = new GlyphrStudioProject();

    _GP.projectSettings.name = fn;
    _GP.metadata.font_family = fn.substr(0, 31);

    _GP.projectSettings.version = _UI.thisGlyphrStudioVersion;
    _GP.projectSettings.versionnum = _UI.thisGlyphrStudioVersionNum;
    _GP.projectSettings.projectid = makeProjectID();

    getGlyph('0x0020', true).isAutoWide = false;
    getGlyph('0x0020', true).glyphWidth = round(_GP.projectSettings.upm/3);
    getGlyph('0x0041', true);

    finalizeUI();
    // navigate();
}

/**
 * Updates various UI and Glyphr Project settings based on
 * a new Glyphr Studio Project
 */
function finalizeUI() {
    // debug("finalizeUI \t START");

    // UI Defaults
    _UI.history['glyph edit'] = new History('glyphs');
    _UI.history.components = new History('components');
    _UI.history.ligatures = new History('ligatures');
    _UI.history.kerning = new History('kerning');

    _UI.guides.leftGroupXMax = new Guide(_UI.guides.leftGroupXMax);
    _UI.guides.rightGroupXMin = new Guide(_UI.guides.rightGroupXMin);

    let ps = _GP.projectSettings;

    ps.guides.ascent = ps.guides.ascent || new Guide({name: 'ascent', type: 'horizontal', location: ps.ascent, editable: false, color: ps.colors.guide_med});
    ps.guides.capheight = ps.guides.capheight || new Guide({name: 'capheight', type: 'horizontal', location: ps.capheight, editable: false, color: ps.colors.guide_light});
    ps.guides.xheight = ps.guides.xheight || new Guide({name: 'xheight', type: 'horizontal', location: ps.xheight, editable: false, color: ps.colors.guide_light});
    ps.guides.baseline = ps.guides.baseline || new Guide({name: 'baseline', type: 'horizontal', location: 0, editable: false, color: ps.colors.guide_dark});
    ps.guides.descent = ps.guides.descent || new Guide({name: 'descent', type: 'horizontal', location: ( ps.ascent- ps.upm), editable: false, color: ps.colors.guide_med});
    ps.guides.leftside = ps.guides.leftside || new Guide({name: 'leftside', type: 'vertical', location: ps.defaultLSB*-1, editable: false, color: ps.colors.guide_dark});
    ps.guides.rightside = ps.guides.rightside || new Guide({name: 'rightside', type: 'vertical', location: ps.upm, editable: false, color: ps.colors.guide_dark});
    ps.guides.zero = ps.guides.zero || new Guide({name: 'zero', type: 'vertical', showname: false, location: 0, editable: false, color: ps.colors.guide_med});
    ps.guides.min = ps.guides.min || new Guide({name: 'min', type: 'vertical', showname: false, location: ps.upm, editable: false, color: ps.colors.guide_light});
    ps.guides.max = ps.guides.max || new Guide({name: 'max', type: 'vertical', showname: false, location: ps.upm, editable: false, color: ps.colors.guide_light});

    _UI.selectedGlyph = _UI.selectedGlyph || getFirstGlyphID();
    _UI.selectedLigature = _UI.selectedLigature || getFirstID(_GP.ligatures);
    _UI.selectedComponent = _UI.selectedComponent || getFirstID(_GP.components);
    _UI.selectedKern = _UI.selectedKern || getFirstID(_GP.kerning);

    let sp = getGlyph('0x0020', true);
    if (!sp.isAutoWide && sp.glyphWidth === 0) sp.glyphWidth = round(_GP.projectSettings.upm/3);

    calculateDefaultView();
    resetThumbView();

    _UI.currentPage = 'glyph edit';

    // debug("finalizeUI \t END\n");
}
