

export {cloneAndFlattenGlyph, showDialogAddComponent, addComponent,
    insertComponentInstance, turnComponentIntoShapes};

// --------------------------------------------------------------
// Component Instance
// --------------------------------------------------------------

/**
 * Clones a Glyph, and "flattens" any Component Instances in
 * that glyph (renders transforms and removes links)
 * @param {string} gid - glyph ID
 * @returns {Glyph}
 */
function cloneAndFlattenGlyph(gid) {
    // debug('\n cloneAndFlattenGlyph - START');
    // debug('\t gid: ' + gid);

    let og = getGlyph(gid, true);
    if (og) og = new Glyph(clone(og));

    let newshapes = [];
    let tempglyph;

    for (let s=0; s<og.shapes.length; s++) {
        if (og.shapes[s].objType === 'ComponentInstance') {
            tempglyph = og.shapes[s].transformedGlyph;
            newshapes = newshapes.concat(tempglyph.shapes);
        } else {
            newshapes.push(og.shapes[s]);
        }
    }

    og.shapes = newshapes;

    // debug(og);
    return og;
}


// --------------------------------------------------------------
// Component Instance UI functions
// --------------------------------------------------------------

/**
 * Shows the Add Component dialog
 */
function showDialogAddComponent() {
    let show = countObjectKeys(getCurrentProject().components)? 'components' : 'glyphs';
    _UI.glyphChooser.dialog = {
        'fname': 'addComponent',
        'choices': 'all',
        'selected': show,
    };

    let content = '<h1>Add Component</h1>';
    content += 'Components are groups of shapes that can be re-used across many Glyphs.  Component Instances can be transformed while the Root Component remains unchanged.<br><br>';
    content += 'You can define and link to stand-alone Components, but you can also use Glyphs and Ligatures as if they were Root Components.<br><br>';
    content += 'Choose a Glyph to insert as a Component Instance in this Glyph.<br><br>';
    content += initGetShapesDialogOptions('component');
    openBigDialog(content);
}

/**
 * Adds a component
 * @param {string} sourceComponentID
 */
function addComponent(sourceComponentID) {
    insertComponentInstance(sourceComponentID, false, _UI.glyphChooser.getShapeOptions);
}

/**
 * Checks to see if a component instance can be added to a Glyph
 * (can't add if it introduces circular references)
 * @param {string} sourceComponentID - source ID
 * @param {string} destinationGlyphID - destination ID
 * @param {object} copyGlyphAttributes - attributes
 * @returns {boolean} - success
 */
function insertComponentInstance(sourceComponentID, destinationGlyphID, copyGlyphAttributes) {
    // debug('\n insertComponentInstance - START');
    // debug('\t sourceComponentID: ' + sourceComponentID + ' destinationGlyphID: ' + destinationGlyphID);

    let select = !destinationGlyphID;
    destinationGlyphID = destinationGlyphID || getSelectedWorkItemID();
    copyGlyphAttributes = copyGlyphAttributes || {srcAutoWidth: false, srcWidth: false, srcLSB: false, srcRSB: false};
    let destinationGlyph = getGlyph(destinationGlyphID, true);

    if (destinationGlyph.canAddComponent(sourceComponentID)) {
        let name = 'Instance of ' + getGlyphName(sourceComponentID);
        let nci = new ComponentInstance({'link': sourceComponentID, 'name': name});
        let sourceComponentGlyph = getGlyph(sourceComponentID);

        // debug('INSERT COMPONENT - JSON: \t' + JSON.stringify(nci));
        destinationGlyph.shapes.push(nci);
        destinationGlyph.changed();
        if (select) {
            _UI.multiSelect.shapes.select(nci);
            _UI.selectedTool = 'shaperesize';
        }

        sourceComponentGlyph.addToUsedIn(destinationGlyphID);

        if (copyGlyphAttributes.srcAutoWidth) destinationGlyph.isAutoWide = sourceComponentGlyph.isAutoWide;
        if (copyGlyphAttributes.srcWidth) destinationGlyph.glyphWidth = sourceComponentGlyph.glyphWidth;
        if (copyGlyphAttributes.srcLSB) destinationGlyph.leftSideBearing = sourceComponentGlyph.leftSideBearing;
        if (copyGlyphAttributes.srcRSB) destinationGlyph.rightSideBearing = sourceComponentGlyph.rightSideBearing;

        closeDialog();
        historyPut('insert component from glyphedit');
        redraw({calledBy: 'insertComponent'});
        return true;
    } else {
        openDialog('<h1>Whoops</h1><div class="dialoglargetext">A circular link was found, components can\'t include links to themselves.<br>They can\'t handle the philosophical conundrum it poses.</div><br><br><button class="buttonsel" onclick="closeDialog();">Fine, I guess.</button>');
        return false;
    }
}

/**
 * Takes a selected Component Instance, transforms it's shapes,
 * and addes them as regular shapes to the selected Glyph
 */
function turnComponentIntoShapes() {
    let selshape = _UI.multiSelect.shapes.getSingleton();
    let shapes = selshape.transformedGlyph.shapes;

    _UI.multiSelect.shapes.deleteShapes();

    for (let s=0; s<shapes.length; s++) {
        addShape(shapes[s]);
    }

    // debug('turnComponentIntoShapes - newshape \n'+json(newshape));
    redraw({calledBy: 'turnComponentIntoShapes'});
}
