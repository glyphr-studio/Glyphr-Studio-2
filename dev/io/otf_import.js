
/**
    IO > Import > OpenType
    Using OpenType.js to read in a font file
    and convert it to a Glyphr Studio Project.
**/


    function ioOTF_importOTFfont(filter) {
        // debug('\n ioOTF_importOTFfont - START');

        // Spinner Animation
        document.getElementById('openprojecttableright').innerHTML = make_LoadingAnimation(false);
        let fis = document.getElementById('fontimportstatus');
        let sweep = document.getElementById('sweep');
        let degrees = 0;

        function importStatus(msg) {
            degrees = ((degrees + 2) % 360);
            sweep.style.transform = ('rotate('+degrees+'deg)');
            if (msg) fis.innerHTML = msg;
        }


        // Font Stuff
        let font = false;
        let importglyphs = [];

        setTimeout(setupFontImport, 10);

        function setupFontImport() {
            importStatus('Reading font data...');
            _GP = new GlyphrStudioProject();

            try {
                // Get Font
                font = opentype.parse(_UI.droppedFileContent);
            } catch (err) {
                loadPage_openproject();
                openproject_changeTab('load');
                showErrorMessageBox('Something went wrong with opening the font file:<br><br>' + err);
                return;
            }

            if (font && font.glyphs && font.glyphs.length) {
                // test for range
                if ((font.glyphs.length < _UI.overflowCount) || filter) {
                    importStatus('Importing Glyph 1 of ' + font.glyphs.length);
                    setTimeout(startFontImport, 1);
                } else {
                    document.getElementById('openprojecttableright').innerHTML = make_ImportFilter(font.glyphs.length, 0, 'ioOTF_importOTFfont');
                }

                Object.keys(font.glyphs.glyphs).forEach(function(key) {
                    importglyphs.push(font.glyphs.glyphs[key]);
                });
            } else {
                loadPage_openproject();
                openproject_changeTab('load');
                showErrorMessageBox('Something went wrong with opening the font file:<br><br>' + err);
                return;
            }

            // debug('\t SetupFontImport - END\n');
        }

        function startFontImport() {
            // debug('\n startFontImport - START');
            // debug(font);
            setTimeout(importOneGlyph, 4);
            // debug(' startFontImport - END\n');
        }


        /*
        *
        *    GLYPH IMPORT
        *
        */
        let tglyph, data, uni, np, cname, chtml, adv, isautowide;
        let maxGlyph = 0;
        let minchar = 0xffff;
        let customglyphrange = [];
        let shapecounter = 0;
        let newshapes = [];
        let fc = {};
        let fl = {};

        let c=0;
        function importOneGlyph() {
            // debug('\n\n=============================\n');
            // debug('\n importOneGlyph - START');
            importStatus('Importing Glyph ' + c + ' of ' + importglyphs.length);

            if (c >= importglyphs.length) {
                // setTimeout(importOneKern, 1);
                startFinalizeFontImport();
                return;
            }

            // One Glyph in the font
            tglyph = importglyphs[c];

            // Get the appropriate unicode decimal for this glyph
            // debug('\t starting  unicode \t' + tglyph.unicode + ' \t ' + tglyph.name);
            // debug(tglyph);

            uni = decToHex(tglyph.unicode || 0);

            if (uni === false || uni === '0x0000') {
                // Check for .notdef
                // debug('\t !!! Skipping '+tglyph.name+' NO UNICODE !!!');
                importglyphs.splice(c, 1);
            } else if (filter && isOutOfBounds([uni])) {
                // debug('\t !!! Skipping '+tglyph.name+' OUT OF BOUNDS !!!');
                importglyphs.splice(c, 1);
            } else {
                // debug('\t GLYPH ' + c + '/'+importglyphs.length+'\t"'+tglyph.name + '" unicode: ' + uni);
                /*
                *
                *    GLYPH IMPORT
                *
                */
                newshapes = [];
                shapecounter = 0;

                // Import Path Data
                data = flattenDataArray(tglyph.path.commands);
                // debug('\t Glyph has path data \n' + data);

                if (data && data !== 'z') {
                    data = cleanAndFormatPathPointData(data);

                    // debug('\t split data into ' + data.length + ' Glyphr Studio shapes.');
                    // debug(data);

                    for (let d=0; d<data.length; d++) {
                        if (data[d].length) {
                            // debug('\t starting convertPathTag');
                            np = ioSVG_convertPathTag(data[d]);
                            // debug('\t created shape from PathTag');
                            // debug(np);
                            if (np.pathpoints.length) {
                                shapecounter++;
                                newshapes.push(new Shape({'path': np, 'name': ('Shape ' + shapecounter)}));
                            } else {
                                // debug('\t !!!!!!!!!!!!!!!!!!\n\t data resulted in no path points: ' + data[d]);
                            }
                        }
                    }
                }

                // Get Advance Width
                isautowide = true;
                adv = parseInt(tglyph.advanceWidth);
                if (adv) {
                    if (!isNaN(adv) && adv > 0) {
                        isautowide = false;
                    }
                } else adv = false;


                // Get some range data
                // uni = uni[0];
                minchar = Math.min(minchar, uni);
                maxGlyph = Math.max(maxGlyph, uni);
                if (1*uni > _UI.glyphrange.latinextendedb.end) customglyphrange.push(uni);

                fc[uni] = new Glyph({'shapes': newshapes, 'glyphhex': uni, 'glyphwidth': adv, 'isautowide': isautowide});
                if (getUnicodeName(uni) === '[name not found]') _GP.projectsettings.glyphrange.filternoncharpoints = false;


                // Successfull loop, advance c
                c++;
            }

            // finish loop
            setTimeout(importOneGlyph, 1);

            // debug(' importOneGlyph - END\n');
        }

        function flattenDataArray(da) {
            // debug('\n flattenDataArray - START');
            // debug(json(da, true));

            let re = '';
            let tc;
            for (let i=0; i<da.length; i++) {
                tc = da[i];

                re += tc.type;

                if (isval(tc.x1) && isval(tc.y1)) {
 re += tc.x1 + ',' + tc.y1 + ',';
                    if (isval(tc.x2) && isval(tc.y2)) {
 re += tc.x2 + ',' + tc.y2 + ',';
                }
}

                if (isval(tc.x) && isval(tc.y)) re += tc.x + ',' + tc.y + ',';
            }

            // debug(re);
            // debug(' flattenDataArray - END\n');

            return re;
        }

        /*
        *
        *    IMPORT LIGATURES?
        *
        */
        fl = {};

        /*
        *
        *    IMPORT KERNS?
        *
        */
        fk = {};


        /*
        *
        *    FINALIZE
        *
        */
        function startFinalizeFontImport() {
            importStatus('Finalizing the imported font...');
            setTimeout(finalizeFontImport, 20);
        }

        function finalizeFontImport() {
            // debug('\n finalizeFontImport - START');
            _GP.glyphs = fc;
            _GP.ligatures = fl;
            _GP.kerning = fk;

            let rstart, rend;
            for (let r in _UI.glyphrange) {
 if (_UI.glyphrange.hasOwnProperty(r)) {
                rstart = 1*_UI.glyphrange[r].begin;
                rend = 1*_UI.glyphrange[r].end+1;
                for (let t=rstart; t<rend; t++) {
                    if (getGlyph(''+decToHex(t))) {
                        _GP.projectsettings.glyphrange[r] = true;
                        break;
                    }
                }
            }
}

            // Make a custom ranges for the rest, with logical separations
            // debug('\t customglyphrange.length ' + customglyphrange.length);

            if (customglyphrange.length) {
                let ranges = _GP.projectsettings.glyphrange.custom;
                let maxvalley = 50;
                let maxrange = 100;
                customglyphrange = customglyphrange.sort();
                let rangestart = customglyphrange[0];
                let rangeend = customglyphrange[0];
                let current;
                let fencepost = true;

                for (let c=0; c<customglyphrange.length; c++) {
                    current = customglyphrange[c];
                    // debug('\t ' + current + ' \t ' + rangestart + ' \t ' + rangeend);

                    if (((current - rangestart) > maxrange) || ((current - rangeend) > maxvalley)) {
                        ranges.push({'begin': rangestart, 'end': rangeend});
                        rangestart = current;
                        rangeend = current;
                        fencepost = false;
                        // debug('\t new glyphrange ' + json(ranges));
                    } else {
                        rangeend = current;
                        fencepost = true;
                        // debug('\t incrementing...');
                    }
                }

                if (fencepost) ranges.push({'begin': rangestart, 'end': rangeend});
                // debug('\t new glyphrange ' + json(ranges));
            }

            // Import Font Settings
            // Check to make sure certain stuff is there
            // space has horiz-adv-x
            // debug('\t Custom range stuff done');
            let ps = _GP.projectsettings;
            let md = _GP.metadata;
            let fname = font.familyName || 'My Font';

            ps.name = fname;
            ps.upm = 1*font.unitsPerEm || 1000;
            ps.ascent = 1*font.ascender || 700;
            ps.descent = -1*Math.abs(font.descender) || 300;
            ps.capheight = 1*getTableValue(font.tables.os2.sCapHeight) || 675;
            ps.xheight = 1*getTableValue(font.tables.os2.sxHeight) || 400;
            ps.overshoot = round(ps.upm / 100);

            md.font_family = fname.substr(0, 31);
            md.panose_1 = getTableValue(font.tables.os2.panose) || '0 0 0 0 0 0 0 0 0 0';
            md.version = getTableValue(font.tables.head.fontRevision) || getTableValue(font.version) || getTableValue('Version 0.001');

            // These can be read in but not saved using OpenType.js
            md.font_style = getTableValue(font.tables.name.fontSubfamily) || 'Regular';
            md.copyright = getTableValue(font.tables.name.copyright) || '';
            md.trademark = getTableValue(font.tables.name.trademark) || '';
            md.designer = getTableValue(font.tables.name.designer) || '';
            md.designerURL = getTableValue(font.tables.name.designerURL) || '';
            md.manufacturer = getTableValue(font.tables.name.manufacturer) || '';
            md.manufacturerURL = getTableValue(font.tables.name.manufacturerURL) || '';
            md.license = getTableValue(font.tables.name.license) || '';
            md.licenseURL = getTableValue(font.tables.name.licenseURL) || '';
            md.description = getTableValue(font.tables.name.description) || '';

            // md.font_weight = 1*font.fontweight || 400;
            // md.font_stretch = font.fontstretch || 'normal';
            // md.underline_position = 1*font.underlineposition || -50;
            // md.underline_thickness = 1*font.underlinethickness || 10;
            // md.strikethrough_position = 1*font.strikethroughposition || 300;
            // md.strikethrough_thickness = 1*font.strikethroughthickness || 10;
            // md.overline_position = 1*font.overlineposition || 750;
            // md.overline_thickness = 1*font.overlinethickness || 10;

            // Finish Up
            // debug('\t calling finalizeUI');
            finalizeUI();
            closeDialog();
            // debug(' finalizeFontImport - END\n');
            navigate();
        }

        // debug(' ioOTF_importOTFfont - END\n');
    }

 function getTableValue(val) {
     try {
         // fixes #238 .ttf import from Google Fonts
         if (typeof val === 'object' && typeof val.en === 'string') {
             return val.en;
         }

         if (Object.prototype.toString.call(val) === '[object Array]') {
             return val.join(' ');
         }
     } catch (err) {
         return 0;
     }
 }
