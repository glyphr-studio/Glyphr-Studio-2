
/**
    Page > Kerning
    HTML and associated functions for this page.
**/


    function loadPage_kerning() {
        // debug("LOADING PAGE >> loadPage_kerning");
        getEditDocument().getElementById('mainwrapper').innerHTML = editPage_Content();

        setupKerningEditCanvas();

        initEventHandlers();

        _UI.selectedTool = 'kern';

        redraw({calledBy: 'loadPage_kerning'});
    }

    function setupKerningEditCanvas() {
        _UI.glyphEditCanvas = getEditDocument().getElementById('glyphEditCanvas');
        _UI.glyphEditCanvas.height = _UI.glyphEditCanvasSize;
        _UI.glyphEditCanvas.width = _UI.glyphEditCanvasSize;
        _UI.glyphEditCTX = _UI.glyphEditCanvas.getContext('2d');
        _UI.glyphEditCanvas.onselectstart = function() {
 return false;
}; // for Chrome, disable text select while dragging
        _UI.glyphEditCanvas.onmouseout = mouseoutcec;
        _UI.glyphEditCanvas.customguidetransparency = mouseovercec;
    }


// -------------------
// REDRAW
// -------------------
    function redraw_Kerning() {
        // debug('\n redraw_Kerning - START');
        // debug('\t kerning: ');
        // debug(_GP.kerning);
        _UI.redrawing = true;

        drawGrid();

        let selkern = getSelectedKern();
        // debug('\t selkern: ' + json(selkern));
        if (selkern) {
            drawGuides();
            let ch;
            let ctx = _UI.glyphEditCTX;
            let v = getView('redraw_Kerning');
            // debug('\t Kern Pair ' + selkern.leftgroup[0] + ' | ' + selkern.rightgroup[0]);

            // drawGlyphKernExtra(kern, rightx, texty, scale)
            drawGlyphKernExtra(selkern.value, v.dx, sy_cy(_GP.projectsettings.descent-60), v.dz);

            // DRAW ALL RIGHT HAND GROUP
            let ra = Math.max(0.25, (1 / selkern.rightgroup.length));
            for (let i=0; i<selkern.rightgroup.length; i++) {
                ch = getGlyph(selkern.rightgroup[i], true);
                // debug('\t got rightgroup char ' + ch.name);
                ch.drawGlyph(ctx, v, ra);
            }

            // DRAW ALL LEFT HAND GROUP
            let la = Math.max(0.25, (1 / selkern.leftgroup.length));
            for (let j=0; j<selkern.leftgroup.length; j++) {
                v = getView('redraw_Kerning');
                ch = getGlyph(selkern.leftgroup[j], true);
                // debug('\t got leftgroup char ' + ch.name);
                v.dx -= (ch.getAdvanceWidth()*v.dz);
                v.dx += (selkern.value*v.dz);
                ch.drawGlyph(ctx, v, la);
            }
        }

        _UI.redrawing = false;
        // debug(' redraw_Kerning - END\n');
    }
