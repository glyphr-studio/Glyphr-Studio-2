

export {importGlyphrProjectFromText, newProjectHandler};


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
        fcontent = JSON.parse(window.GlyphrStudio.temp.droppedFileContent);
    } catch (e) {
        fcontent = {};
    }

    let tempVersion = false;
    let v = false;
    let ps = fcontent.projectSettings;
    if (ps) {
        tempVersion = ps.versionNum;
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
        ps.initialVersionNum = '0.3.0';
    }
    if (!ps.initialVersionNum) ps.initialVersionNum = tempVersion;

    let projectVersion = parseVersionNum(tempVersion);
    let currentAppVersion = parseVersionNum(window.GlyphrStudio.versionNum);
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
    ps.versionNum = window.GlyphrStudio.versionNum;
    ps.version = window.GlyphrStudio.version;


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
 * Creates a new Glyphr Studio Project object from scratch
 * @returns {GlyphrStudioProject}
 */
function newProjectHandler() {
    let fn;
    if (document.getElementById('newprojectname') && document.getElementById('newprojectname').value) {
        fn = document.getElementById('newprojectname').value;
    } else {
        fn = 'My Font';
    }

    let project = new GlyphrStudioProject();

    project.projectSettings.name = fn;
    project.metadata.font_family = fn.substr(0, 31);

    project.projectSettings.version = window.GlyphrStudio.version;
    project.projectSettings.versionNum = window.GlyphrStudio.versionNum;
    project.projectSettings.projectID = makeProjectID();

    project.getGlyph('0x0020', true).isAutoWide = false;
    project.getGlyph('0x0020', true).glyphWidth = round(project.projectSettings.upm/3);
    project.getGlyph('0x0041', true);

    finalizeUI();

    return project;
}

/**
 * Updates various UI and Glyphr Project settings based on
 * a new Glyphr Studio Project
 */
function finalizeUI() {
    // debug("finalizeUI \t START");

    _UI.guides.leftGroupXMax = new Guide(_UI.guides.leftGroupXMax);
    _UI.guides.rightGroupXMin = new Guide(_UI.guides.rightGroupXMin);

    let ps = getCurrentProject().projectSettings;

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
    _UI.selectedLigature = _UI.selectedLigature || getFirstID(getCurrentProject().ligatures);
    _UI.selectedComponent = _UI.selectedComponent || getFirstID(getCurrentProject().components);
    _UI.selectedKern = _UI.selectedKern || getFirstID(getCurrentProject().kerning);

    let sp = getGlyph('0x0020', true);
    if (!sp.isAutoWide && sp.glyphWidth === 0) sp.glyphWidth = round(getCurrentProject().projectSettings.upm/3);

    calculateDefaultView();
    resetThumbView();

    editor.nav.page = 'glyph edit';

    // debug("finalizeUI \t END\n");
}
