
/**
    IO > Export > OpenType
    Using OpenType.js to convert a Glyphr Studio
    Project into OpenType.js format for saving.
**/


    function ioOTF_exportOTFfont() {
        // debug('\n ioOTF_exportOTFfont - START');
        // debug('\t combineshapesonexport = ' + getCurrentProject().projectSettings.combineshapesonexport);

        function firstExportStep() {
            // debug('\n firstExportStep - START');

            // Add metadata
            let md = getCurrentProject().metadata;
            let ps = getCurrentProject().projectSettings;

            options.unitsPerEm = ps.upm || 1000;
            options.ascender = ps.ascent || 0.00001;
            options.descender = (-1 * Math.abs(ps.descent)) || -0.00001;
            options.familyName = (md.font_family) || ' ';
            options.styleName = (md.font_style) || ' ';
            options.designer = (md.designer) || ' ';
            options.designerURL = (md.designerURL) || ' ';
            options.manufacturer = (md.manufacturer) || ' ';
            options.manufacturerURL = (md.manufacturerURL) || ' ';
            options.license = (md.license) || ' ';
            options.licenseURL = (md.licenseURL) || ' ';
            options.version = (md.version) || 'Version 0.001';
            options.description = (md.description) || ' ';
            options.copyright = (md.copyright) || ' ';
            options.trademark = (md.trademark) || ' ';
            options.glyphs = [];

            // debug('\t NEW options ARG BEFORE GLYPHS');
            // debug(options);
            // debug('\t options.version ' + options.version);

            // Add Notdef
            let notdef = new Glyph({'name': 'notdef', 'shapes': JSON.parse(_UI.notDefGlyphShapes)});
            if (getCurrentProject().upm !== 1000) {
                let delta = getCurrentProject().upm / 1000;
                notdef.updateGlyphSize(delta, delta, true);
            }

            let ndpath = notdef.makeOpenTypeJSPath();

            options.glyphs.push(new opentype.Glyph({
                name: '.notdef',
                unicode: 0,
                index: 0,
                advanceWidth: round(notdef.getAdvanceWidth()),
                xMin: round(notdef.maxes.xMin),
                xMax: round(notdef.maxes.xMax),
                yMin: round(notdef.maxes.yMin),
                yMax: round(notdef.maxes.yMax),
                path: ndpath,
            }));

            // debug(' firstExportStep - END\n');
        }

        function populateExportList() {
            // debug('\n populateExportList - START');

            // Add Glyphs and Ligatures
            for (let c in getCurrentProject().glyphs) {
 if (getCurrentProject().glyphs.hasOwnProperty(c)) {
                if (parseInt(c)) {
                    tg = new Glyph(clone(getCurrentProject().glyphs[c]));
                    exportarr.push({xg: tg, xc: c});
                } else {
                    console.warn('Skipped exporting Glyph ' + c + ' - non-numeric key value.');
                }
            }
}

            exportarr.sort(function(a, b) {
 return a.xc - b.xc;
});
            // debug(' populateExportList - END\n');
        }

        function generateOneGlyph() {
            // debug('\n generateOneGlyph - START');
            // export this glyph
            let glyph = currexportglyph.xg;
            let num = currexportglyph.xc;
            let comb = getCurrentProject().projectSettings.combineshapesonexport;
            let maxes = glyph.maxes;

            // debug('\t ' + glyph.name);

            showToast('Exporting<br>'+glyph.name, 999999);

            if (comb && glyph.shapes.length <= getCurrentProject().projectSettings.maxcombineshapesonexport) glyph.combineAllShapes(true);

            if (glyph.isAutoWide) glyph.updateGlyphPosition(glyph.lsb, 0);

            let tgpath = glyph.makeOpenTypeJSPath(new opentype.Path());

            let otglyph = new opentype.Glyph({
                name: getUnicodeShortName(''+decToHex(num)),
                unicode: parseInt(num),
                index: parseInt(num),
                advanceWidth: round(glyph.getAdvanceWidth() || 1), // has to be non-zero
                xMin: round(maxes.xMin),
                xMax: round(maxes.xMax),
                yMin: round(maxes.yMin),
                yMax: round(maxes.yMax),
                path: tgpath,
            });

            // debug(otglyph);

            // Add this finshed glyph
            options.glyphs.push(otglyph);


            // start the next one
            currexportnum++;

            if (currexportnum < exportarr.length) {
                currexportglyph = exportarr[currexportnum];
                setTimeout(generateOneGlyph, 10);
            } else {
                showToast('Finalizing...', 10);
                setTimeout(lastExportStep, 10);
            }

            // debug(' generateOneGlyph - END\n');
        }

        function lastExportStep() {
            // debug('\n lastExportStep - START');
            options.glyphs.sort(function(a, b) {
 return a.unicode - b.unicode;
});

            // Create Font
            // debug('\t NEW options ARG TO FONT');
            // debug(options);
            let font = new opentype.Font(options);

            // debug('\t Font object:');
            // debug(font.toTables());

            // Export
            _UI.stopPageNavigation = false;
            font.download();
            setTimeout(function() {
_UI.stopPageNavigation = true;
}, 2000);
            // debug(' lastExportStep - END\n');
        }


        /*
            MAIN EXPORT LOOP
        */
        var options = {};
        var exportarr = [];
        var currexportnum = 0;
        var currexportglyph ={};

        firstExportStep();
        populateExportList();
        currexportglyph = exportarr[0];
        generateOneGlyph();


        // debug(' ioOTF_exportOTFfont - END\n');
    }
