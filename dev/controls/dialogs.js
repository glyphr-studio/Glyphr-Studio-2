// -----------------------------------------------------------------
// Dialog Box, Error Box, Notation, toasts
// -----------------------------------------------------------------
export {closeDialog, openDialog, openBigDialog, isBigDialogOpen,
openNotation, closeNotation, makeErrorMessageBox, showErrorMessageBox,
closeErrorMessageBox, toggleDialogExportOptions, showToast};

/**
 * Closes any type of dialog box that may be open
 */
function closeDialog() {
    if (!_UI.popOut && document.getElementById('npSave')) document.getElementById('npSave').style.backgroundColor = 'transparent';
    document.getElementById('dialog_bg').style.display='none';
    document.getElementById('big_dialog_box').style.display='none';
    document.getElementById('dialog_box').style.display='none';
    document.getElementById('saveFormatFlyout').style.display='none';

    document.getElementById('dialogRightContent').innerHTML = '<b>Error: unspecified dialog box content.</b>';
    document.getElementById('bigDialogLeftContent').innerHTML = '<b>Error: unspecified dialog box content.</b>';

    // document.body.focus();
}

/**
 * Creates and shows a standard dialog box
 * @param {string} content - HTML content of the dialog box
 */
function openDialog(content) {
    closeDialog();
    document.body.focus();
    let dc = document.getElementById('dialogRightContent');
    dc.innerHTML = content;

    if (dc.style.height > 800) dc.style.height = 800;
    else dc.style.width = 'auto';

    document.getElementById('dialog_box').style.display='block';
    document.getElementById('dialog_bg').style.display='block';
}

/**
 * Creates and shows a full height dialog box along the left
 * side of the screen
 * @param {string} content - HTML content of the dialog box
 */
function openBigDialog(content) {
    closeDialog();
    document.body.focus();
    document.getElementById('bigDialogLeftContent').innerHTML = content;
    document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(_UI.glyphChooser.dialog);

    document.getElementById('big_dialog_box').style.display='block';
    document.getElementById('dialog_bg').style.display='block';
}

/**
 * Returns true if the big dialog box is open
 * @return {boolean}
 */
function isBigDialogOpen() {
    return document.getElementById('big_dialog_box').style.display === 'block';
}

/**
 * Creates and shows a small dialog box at a certain
 * screen x,y possiiton
 * @param {string} content - HTML content of the dialog box
 * @param {number} x - screen x location
 * @param {number} y - screen y location
 */
function openNotation(content, x, y) {
    getEditDocument().body.focus();
    let n = getEditDocument().getElementById('notation');
    n.innerHTML = content;
    n.style.top = (round(y)+'px');
    n.style.left = (round(x+50)+'px');
    n.style.display='block';
}

/**
 * Closes any notation dialog boxes
 */
function closeNotation() {
    getEditDocument().getElementById('notation').style.display='none';
    getEditDocument().getElementById('notation').innerHTML = '&#x20E2;';
    getEditDocument().body.focus();
}

/**
 * Toggles open/closed the small flyout off the save button
 * asking which format to export
 */
function toggleDialogExportOptions() {
    let sff = document.getElementById('saveFormatFlyout');
    let nps = document.getElementById('npSave');

    if (sff.style.display === 'block') {
        closeDialog();
    } else {
        nps.style.backgroundColor = _UI.colors.blue.l45;
        sff.style.display = 'block';
    }
}

/**
 * Creates (but does not show) a small error message box
 * @return {string} - HTML content
 */
function makeErrorMessageBox() {
    let con ='<div id="errormessagebox" style="display:none;">' +
    '<table cellpadding=0 cellspacing=0 border=0><tr>' +
    '<td class="errormessageleftbar">'+
    '<button class="errormessageclosebutton" onclick="closeErrorMessageBox();">&times;</button></td>' +
    '<td id="errormessagecontent"></td>' +
    '</tr></table></div>';

    return con;
}

/**
 * Shows the error message box
 * @param {string} msg - HTML content of the dialog box
 */
function showErrorMessageBox(msg) {
    let msgcon = document.getElementById('errormessagecontent');
    let msgbox = document.getElementById('errormessagebox');
    msgcon.innerHTML = msg;
    msgbox.style.display = 'block';
    console.warn(msg);
}

/**
 * Closes the error message box
 */
function closeErrorMessageBox() {
    document.getElementById('errormessagecontent').innerHTML = '';
    document.getElementById('errormessagebox').style.display = 'none';
}

/**
 * Creates and shows a little message at the top/center
 * of the screen, which dissapears after a set time
 * @param {string} msg - message to show
 * @param {number} dur - how long to show the message (milliseconds)
 * @param {function} fn - function to call after message is shown
 */
function showToast(msg, dur, fn) {
    // debug('\n showToast - START');
    let step = -1;
    let stepmax = 20;
    let timestep = 10;
    let divisor = 5;
    let msgdiv = getEditDocument().getElementById('toast');
    let durration = dur || 3000;
    msgdiv.innerHTML = msg || 'Howdy!';

    // debug('\t Typeof fn: ' + typeof fn);
    // console.log(fn);

    if (fn && typeof fn === 'function') {
        // debug('\t CALLING FUNCTION NOW');
        setTimeout(fn, 100);
    }

    if (_UI.toastTimeout) {
        msgdiv.innerHTML = msg;
        appearFinish();
        return;
    }

    let currtop = -50;
    let finaltop = 15;
    let curropacity = 0;
    let finalopacity = 1;

    /** start to dissapear */
    function appearFinish() {
        // debug('\t appearFinish');
        currtop = finaltop;
        curropacity = finalopacity;
        step = stepmax;

        msgdiv.style.marginTop = (finaltop + 'px');
        msgdiv.style.opacity = finalopacity;

        setToastTimeout(disappearStep, durration);
    }

    /** animate appearance */
    function appearStep() {
        // debug('\t appearStep ' + step);

        if (step < 0) {
            msgdiv.style.display = 'block';
            msgdiv.style.marginTop = '-50px;';
            msgdiv.style.opacity = '0.0';
            msgdiv.style.borderBottomWidth = '0px';

            step++;

            setToastTimeout(appearStep, timestep);
        } else if (step < stepmax) {
            step++;
            currtop = currtop + ((finaltop - currtop) / divisor);
            curropacity = curropacity + ((finalopacity - curropacity) / divisor);

            msgdiv.style.marginTop = (currtop + 'px');
            msgdiv.style.opacity = curropacity;

            setToastTimeout(appearStep, timestep);
        } else {
            appearFinish();
        }
    }

    /** animate dissapearance */
    function disappearStep() {
        // debug('\t appearStep ' + step);
        if (step < 0) {
            msgdiv.style.display = 'none';
            msgdiv.style.marginTop = '-50px;';
            msgdiv.style.opacity = '0.0';
            msgdiv.innerHTML = '0_o';
            if (_UI.toastTimeout) {
                clearTimeout(_UI.toastTimeout);
                _UI.toastTimeout = false;
            }
        } else {
            step--;
            currtop = currtop - (currtop / divisor);
            curropacity = curropacity - (curropacity / divisor);

            msgdiv.style.marginTop = (currtop + 'px');
            msgdiv.style.opacity = curropacity;

            setToastTimeout(disappearStep, timestep);
        }
    }

    /**
     * Common function for appear and dissapear to
     * call while looping through animations.
     * @param {function} fn - function to call
     * @param {number} dur - durration (milliseconds)
     */
    function setToastTimeout(fn, dur) {
        if (_UI.toastTimeout) clearTimeout(_UI.toastTimeout);
        _UI.toastTimeout = setTimeout(fn, dur);
    }

    setToastTimeout(appearStep, 1);
    // debug(' showToast - END\n');
}
