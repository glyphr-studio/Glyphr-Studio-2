
/**
    Page > Test Drive
    HTML and associated functions for this page.
**/


    /*
        loadPage_testdrive
        This function is called by the overall Navigate function, and populates
        page-level HTML.
    */
    function loadPage_testdrive() {
        // debug("LOADING PAGE >> loadPage_testdrive");

        update_NavPanels();

        let content = '<h1 class="pagetitle">Test Drive</h1><div class="pagecontent">' +
            '<textarea id="tdtextarea" onkeyup="_UI.testdrive.sampleText=this.value; redraw_TestDrive()">'+_UI.testdrive.sampleText+'</textarea><br>' +
            '<canvas id="tdcanvas"></canvas><br>' +
            '<div id="genimg" style="display:none;"></div>'+
            '<canvas id="glyphEditCanvas" style="display:none;"></canvas>'+
            '</div>';

        getEditDocument().getElementById('mainwrapper').innerHTML = content;
        document.getElementById('tdtextarea').focus();

        let td = _UI.testdrive;
        td.canvas = document.getElementById('tdcanvas');
        td.canvas.width = 800;
        td.canvas.height = 700;
        td.ctx = td.canvas.getContext('2d');

        td.glyphSequence = new GlyphSequence({
            glyphstring: td.sampleText,
            lineGap: td.lineGap,
            maxes: {
                xMin: 10,
                xMax: 790,
                yMin: 10 + (getCurrentProject().projectSettings.ascent * td.fontScale),
                yMax: false,
            },
            scale: td.fontScale,
            drawPageExtras: drawTestDrivePageExtras,
            drawLineExtras: drawTestDriveLineExtras,
            drawGlyphExtras: drawTestDriveGlyphExtras,
            drawGlyph: drawTestDriveGlyph,
        });

        td.cache = {};

        redraw_TestDrive();
    }

    /*
        makePanel_TestDriveAttributes
        This function is called by the overall Redraw function, and it loads content to
        the left panel - usually options for the Edit Canvas.
    */
    function makePanel_TestDriveAttributes() {
        if (_UI.currentPanel !== 'npAttributes') return;

        let content = '<div class="navarea_header">';
        content += '<h1 class="panelsupertitle">TEST DRIVE</h1>';
        content += '<h1 class="paneltitle">controls</h1>';

        content += '</div><div class="panel_section">';
        content += '<h2>options</h2><div>' + drawTDOptions() + '</div>';
        content += '</div><div class="panel_section">';
        content += '<h2>sample text</h2><div>' + drawSampletextButtons() + '</div>';
        content += '</td></tr></table></div>';

        return content;
    }


    /*
        readraw_TestDrive
        This function is called by the overall Redraw to update the canvas, or whatever
        content is in the main Content Area
    */
    function redraw_TestDrive() {
        // debug("\n redraw_TestDrive - START");
        _UI.redrawing = true;

        let td = _UI.testdrive;
        let ps = getCurrentProject().projectSettings;

        if (_UI.currentPanel === 'npAttributes') changefontscale(td.fontSize);
        document.getElementById('tdtextarea').value = td.sampleText;

        td.glyphSequence.setString(td.sampleText);
        let scale = td.fontScale;
        let pagepadding = 20 / scale;

        td.ctx.clearRect(0, 0, 5000, 5000);
        td.glyphSequence.draw();

        _UI.redrawing = false;
    }

    function drawTestDrivePageExtras(maxes, scale) {
        // debug('\n drawTestDrivePageExtras - START');
        let tdc = _UI.testdrive.canvas;

        // var top = (maxes.yMin - (getCurrentProject().projectSettings.ascent * scale)) || 0;
        let top = maxes.yMin || 0;
        let bottom = (maxes.yMax === Infinity)? tdc.height : (maxes.yMax || tdc.height);
        let left = maxes.xMin || 0;
        let right = (maxes.xMax === Infinity)? tdc.width : (maxes.xMax || tdc.width);
        let width = right - left;
        let height = bottom - top;
        let ctx = _UI.testdrive.ctx;

        // debug(`\t new t/b/l/r: ${top} / ${bottom} / ${left} / ${right}`);

        if (_UI.testdrive.showPageExtras) {
            ctx.fillStyle = 'transparent';
            ctx.strokeStyle = _UI.colors.green.l85;
            ctx.lineWidth = 1;

            ctx.strokeRect(
                makeCrisp(left),
                makeCrisp(top),
                round(width),
                round(height)
            );
        }

        // debug(' drawTestDrivePageExtras - END\n');
    }

    function drawTestDriveLineExtras(chardata) {
        // debug('\n drawTestDriveLineExtras - START');
        // debug('\t at ' + (chardata.view.dy * chardata.view.dz));
        if (_UI.testdrive.showLineExtras) {
            drawHorizontalLine(chardata.view.dy*chardata.view.dz, _UI.testdrive.ctx, _UI.colors.green.l85);
        }
        // debug(' drawTestDriveLineExtras - END\n');
    }

    function drawTestDriveGlyphExtras(chardata) {
        // debug('\n drawTestDriveGlyphExtras - START');
        if (_UI.testdrive.showGlyphExtras) {
            let ctx = _UI.testdrive.ctx;
            let drawwidth = chardata.width * chardata.view.dz;
            let drawheight = getCurrentProject().projectSettings.upm * chardata.view.dz;
            let drawy = (chardata.view.dy - getCurrentProject().projectSettings.ascent) * chardata.view.dz;
            let drawx = chardata.view.dx * chardata.view.dz;
            let drawk = chardata.kern * chardata.view.dz * -1;

            // debug(`\t drawing ${chardata.char}`);
            // debug(`\t scaled view \t ${json(scaledview, true)}`);

            if (chardata.kern) {
                ctx.fillStyle = 'orange';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(
                    drawx + drawwidth - drawk,
                    drawy,
                    drawk,
                    drawheight
                );
                ctx.globalAlpha = 1;
            }

            ctx.fillStyle = 'transparent';
            ctx.strokeStyle = _UI.colors.blue.l85;
            ctx.lineWidth = 1;

            ctx.strokeRect(
                makeCrisp(drawx),
                makeCrisp(drawy),
                round(drawwidth),
                round(drawheight)
            );
        }

        // debug(' drawTestDriveGlyphExtras - END\n');
    }

    function drawTestDriveGlyph(chardata) {
        // debug('\n drawTestDriveGlyph - START');

        let td = _UI.testdrive;
        let glyph = chardata.glyph;
        let showLineExtras = td.showLineExtras || false;
        let flattenGlyphs = td.flattenGlyphs || false;
        let ctx = _UI.testdrive.ctx;
        let view = clone(chardata.view);
        view.dx *= view.dz;
        view.dy *= view.dz;

        // debug(`\t drawing ${chardata.char}`);
        // debug(`\t view \t ${json(view, true)}`);

        setTimeout(function() {
            if (glyph) {
                if (flattenGlyphs) {
                        if (!_UI.testdrive.cache.hasOwnProperty(chardata.char)) {
                            _UI.testdrive.cache[chardata.char] = (new Glyph(clone(glyph))).combineAllShapes(true);
                        }

                        _UI.testdrive.cache[chardata.char].drawGlyph(ctx, view, 1, true);
                } else {
                    glyph.drawGlyph(ctx, view, 1, true);
                }
            }
        }, 10);

        // debug(' drawTestDriveGlyph - END\n');
    }

    function drawSampletextButtons() {
        let content = '<h3>pangrams</h3>';
        content += makeTDButton('the five boxing wizards jump quickly');
        content += makeTDButton('pack my box with five dozen liquor jugs');
        content += makeTDButton('the quick brown fox jumps over a lazy dog');
        content += makeTDButton('amazingly few discotheques provide jukeboxes');
        content += makeTDButton('quick enemy movement will<br>jeopardize six of the gunboats');
        content += '<br><h3>glyph sets</h3>';
        content += makeTDButton('abcdefghijklmnopqrstuvwxyz');
        content += makeTDButton('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        content += makeTDButton('0123456789');
        content += makeTDSymbolButton();

        return content;
    }

    function makeTDButton(text) {
        let val = text.replace('<br>', ' ');
        return '<button class="sampleText" onclick="_UI.testdrive.sampleText=\''+val+'\';redraw_TestDrive();">'+text+'</button><br>';
    }

    function makeTDSymbolButton() {
        let sym = ['&#x21;', '&#x22;', '&#x23;', '&#x24;', '&#x25;', '&#x26;', '&#x27;', '&#x28;', '&#x29;', '&#x2A;', '&#x2B;', '&#x2C;', '&#x2D;', '&#x2E;', '&#x2F;', '&#x3A;', '&#x3B;', '&#x3C;', '&#x3D;', '&#x3E;', '&#x3F;', '&#x40;', '&#x5B;', '&#x5C;', '&#x5D;', '&#x5E;', '&#x5F;', '&#x60;', '&#x7B;', '&#x7C;', '&#x7D;', '&#x7E;'];

        let re = '<button class="sampleText" onclick="clickTDSymbolButton();">';
        re += sym.join('');
        re += '</button><br>';

        return re;
    }

    function clickTDSymbolButton() {
        let sym = [0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F, 0x60, 0x7B, 0x7C, 0x7D, 0x7E];

        let con = '';
        for (let s=0; s<sym.length; s++) con += String.fromCharCode(sym[s]);

        _UI.testdrive.sampleText = con;

        redraw_TestDrive();
    }

    function drawTDOptions() {
        if (!_UI.testdrive.lineGap) _UI.testdrive.lineGap = getCurrentProject().projectSettings.lineGap;
        if (!isVal(_UI.testdrive.padSize)) _UI.testdrive.padSize = getCurrentProject().projectSettings.defaultLSB;

        let flattenmessage = '<h1>Combine Glyphs Shapes</h1>'+
            'In <a href=# onclick=navToProjectSettings()>Project Settings &rsaquo; Export Options</a> you have the option to combine all glyph shapes.<br>'+
            'Having glyphs with many overlapping paths in a font can sometimes cause issues.<br>'+
            'So, this setting will flatten each glyph as it&prime;s exported to your font.<br><br>'+
            'Selecting this option in Test Drive here will <i>preview</i> how your glyph shapes will be <br>'+
            'combined. This preview will not change your designs in Glyphr Studio. There is a<br>'+
            'Combine Shapes action in Glyph Edit if you wish to permanently combine shapes.<br><br>'+
            'As a warning, this process is time intensive, so the first time you type a letter<br>'+
            'it may take a few seconds to render.';

        let content = '<table class="detail">';
        content += '<tr><td> font size <span class="unit">(px)</span> </td><td><input type="number" value="'+_UI.testdrive.fontSize+'" onchange="changefontscale(this.value); redraw_TestDrive();"></td></tr>';
        content += '<tr><td> 96dpi font size <span class="unit">(pt)</span> </td><td><input type="number" disabled="disabled" id="roughptsize" valu="75"/></td></tr>';
        content += '<tr><td> line gap <span class="unit">(em units)</span> </td><td><input type="number" value="'+_UI.testdrive.lineGap+'" onchange="changelinegap(this.value); redraw_TestDrive();"></td></tr>';
        // content += '<tr><td> glyph spacing <span class="unit">(em units)</span> </td><td><input type="number" value="'+_UI.testdrive.padSize+'" onchange="_UI.testdrive.padSize=this.value*1; redraw_TestDrive();"></td></tr>';
        content += '<tr><td> <label for="showGlyphExtras">show glyph boxes</label> </td><td>' + checkUI('_UI.testdrive.showGlyphExtras', _UI.testdrive.showGlyphExtras, true) + '</td></tr>';
        content += '<tr><td> <label for="showLineExtras">show baseline</label> </td><td>' + checkUI('_UI.testdrive.showLineExtras', _UI.testdrive.showLineExtras, true) + '</td></tr>';
        content += '<tr><td> <label for="showPageExtras">show page borders</label> </td><td>' + checkUI('_UI.testdrive.showPageExtras', _UI.testdrive.showPageExtras, true) + '</td></tr>';

        content += '<tr><td> <label for="flattenGlyphs">preview combine glyph shapes</label>' + helpUI(flattenmessage) + ' </td><td>' + checkUI('_UI.testdrive.flattenGlyphs', _UI.testdrive.flattenGlyphs, false) + '</td></tr>';

        content += '<tr><td colspan=2><button onclick="createimg();">generate png file</button></td></tr>';
        content += '</table>';
        return content;
    }

    function navToProjectSettings() {
        _UI.currentPage = 'project settings';
        navigate();
    }

    function changefontscale(newval) {
        let td = _UI.testdrive;

        td.fontSize = newval*1;
        td.fontScale = (newval/getCurrentProject().projectSettings.upm);
        td.glyphSequence.setScale(td.fontScale);
        td.glyphSequence.setMaxes({
            xMin: 10,
            xMax: 790,
            yMin: 10 + (getCurrentProject().projectSettings.ascent * td.fontScale),
            yMax: false,
        });
        document.getElementById('roughptsize').value = (newval*0.75);
        document.getElementById('tdtextarea').style.fontSize = ((newval*0.75) + 'pt');
    }

    function changelinegap(newval) {
        let td = _UI.testdrive;

        td.lineGap = newval * 1;
        td.glyphSequence.setLineGap(td.lineGap);
    }

    function createimg() {
        let imgd = document.getElementById('tdcanvas').toDataURL();

        let win = window.open(document.location.href, 'Glyphr Test Drive');

        win.document.write('<!DOCTYPE html><html>'+
        '<head><title>Glyphr - Test Drive Image</title></head>'+
        '<body style="padding:40px; text-align:center;">'+
        '<img src="' + imgd + '" title="Glyphr Test Drive" style="border:1px solid #f6f6f6;">'+
        '</html>');
    }
