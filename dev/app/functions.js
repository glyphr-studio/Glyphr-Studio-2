/* exported makePanelSuperTitle */

// -------------------
// Common Panel Title
// -------------------
/**
 * Panel Title
 * @return {string}
 */
function makePanelSuperTitle() {
    // debug('\n makePanelSuperTitle - START');
    let content = '';
    if (!_UI.popOut) {
        let selwi = getSelectedWorkItem();
        let name;
        // debug('\t selwi = ' + selwi.objtype);

        content += '<h1 class="panelsupertitle">'+_UI.currentPage.toUpperCase();
        if (_UI.currentPanel === 'npChooser' ||
            _UI.currentPanel === 'npGuides' ||
            _UI.currentPanel === 'npHistory') return content + '</h1>';

        if (selwi) {
            name = (selwi.getName() || selwi.glyphhtml || selwi.shape.name || '[no shape outline yet]');
            // debug('\t selwi name is ' + name);

            if (selwi.name) name = name.replace(/latin /i, '');
            content += makeSuperTitleSeperator();
            content += name;
        } else if (_UI.currentPage === 'kerning') {
            // debug('\t selwi = false, on kerning');
            name = getSelectedKern();
            content += name? makeSuperTitleSeperator() + name.getName() : '';
        }
        content += '</h1>';
    }
    // debug(' makePanelSuperTitle - returning\n' + content + '\n');
    return content;
}

/**
 * Panel Title Seperator
 * @return {string}
 */
function makeSuperTitleSeperator() {
    let re = '<span class="supertitleseperator">';
    re += makeIcon({name: 'button_more', color: _UI.colors.blue.l75, hovercolor: _UI.colors.blue.l75, size: 10});
    re += makeIcon({name: 'button_more', color: _UI.colors.blue.l75, hovercolor: _UI.colors.blue.l75, size: 10});
    re += '</span>';
    return re;
}


// -------------------
// Debug
// -------------------

function debug(message, force) {
    if (!_UI.devMode) return;

    if (_UI.debug || force) {
        if (typeof message === 'string') {
            message = message.replace(/&lt;/gi, '<');
            message = message.replace(/&gt;/gi, '>');

            if (message === 'group') {
                console.group();
                return;
            } else if (message === 'groupCollapsed') {
                console.groupCollapsed();
                return;
            } else if (_UI.debugAutoGroup && message.indexOf('- START') > 0) {
                console.group(message.substr(2).replace(' - START', ''));
                return;
            } else if (message === 'groupEnd'|| (_UI.debugAutoGroup && message.indexOf('- END') > 0)) {
                console.groupEnd(message);
                return;
            } else {
                console.log(message);
            }
        } else if (typeof message === 'object') {
            if (_UI.debugTableObjects) console.table(message);
            else console.log(message);
        }
    }
}

function json(obj, raw) {
    obj = clone(obj);
    if (raw) return JSON.stringify(obj);
    else {
        let j = JSON.stringify(obj, undefined, '\t');
        if (j) return j.replace(/\n/g, '\r\n');
        else return '';
    }
}


// --------------------------------------
// Dialog Box, Error Box, Notation
// --------------------------------------
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

function openBigDialog(content) {
    closeDialog();
    document.body.focus();
    document.getElementById('bigDialogLeftContent').innerHTML = content;
    document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(_UI.glyphChooser.dialog);

    document.getElementById('big_dialog_box').style.display='block';
    document.getElementById('dialog_bg').style.display='block';
}

function isBigDialogOpen() {
    return document.getElementById('big_dialog_box').style.display === 'block';
}

function openNotation(content, x, y) {
    getEditDocument().body.focus();
    let n = getEditDocument().getElementById('notation');
    n.innerHTML = content;
    n.style.top = (round(y)+'px');
    n.style.left = (round(x+50)+'px');
    n.style.display='block';
}

function closeNotation() {
    getEditDocument().getElementById('notation').style.display='none';
    getEditDocument().getElementById('notation').innerHTML = '&#x20E2;';
    getEditDocument().body.focus();
}

function toggleDialog_ExportOptions() {
    let sff = document.getElementById('saveFormatFlyout');
    let nps = document.getElementById('npSave');

    if (sff.style.display === 'block') {
        closeDialog();
    } else {
        nps.style.backgroundColor = _UI.colors.blue.l45;
        sff.style.display = 'block';
    }
}

function makeErrorMessageBox() {
    let con ='<div id="errormessagebox" style="display:none;">' +
    '<table cellpadding=0 cellspacing=0 border=0><tr>' +
    '<td class="errormessageleftbar">'+
    '<button class="errormessageclosebutton" onclick="closeErrorMessageBox();">&times;</button></td>' +
    '<td id="errormessagecontent"></td>' +
    '</tr></table></div>';

    return con;
}

function showErrorMessageBox(msg) {
    let msgcon = document.getElementById('errormessagecontent');
    let msgbox = document.getElementById('errormessagebox');
    msgcon.innerHTML = msg;
    msgbox.style.display = 'block';
    console.warn(msg);
}

function closeErrorMessageBox() {
    document.getElementById('errormessagecontent').innerHTML = '';
    document.getElementById('errormessagebox').style.display = 'none';
}

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

    function appearFinish() {
        // debug('\t appearFinish');
        currtop = finaltop;
        curropacity = finalopacity;
        step = stepmax;

        msgdiv.style.marginTop = (finaltop + 'px');
        msgdiv.style.opacity = finalopacity;

        setToastTimeout(disappearStep, durration);
    }

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

    setToastTimeout(appearStep, 1);
    // debug(' showToast - END\n');
}

function setToastTimeout(fn, dur) {
    if (_UI.toastTimeout) clearTimeout(_UI.toastTimeout);
    _UI.toastTimeout = setTimeout(fn, dur);
}


// -------------------
// Saved Sate
// -------------------
function setProjectAsSaved() {
    _UI.projectSaved = true;

    if (_UI.devMode) {
        document.title = '░▒▓█ GSDEVMODE █▓▒░';
    } else if (_UI.popOut) {
        document.title = 'Glyphr Studio - Tools';
        _UI.popOut.document.title = 'Glyphr Studio - Canvas';
    } else {
        document.title = 'Glyphr Studio';
    }

    updateSaveIcon();
}

function setProjectAsUnsaved() {
    _UI.projectSaved = false;

    if (_UI.devMode) {
        document.title = '░▒▓█ GSDEVM❖DE █▓▒░';
    } else if (_UI.popOut) {
        document.title = ' ❖ Glyphr Studio - Tools';
        _UI.popOut.document.title = ' ❖ Glyphr Studio - Canvas';
    } else {
        document.title = ' ❖ Glyphr Studio';
    }

    updateSaveIcon();
}

function updateSaveIcon() {
    if (_UI.currentPanel === 'npNav') return;

    let savecolor = _UI.colors.gray.l90;
    if (!_UI.projectSaved) savecolor = 'white';

    document.getElementById('npSave').innerHTML = '<table class="saveButtonTable">' +
    '<tr><td style="border-right:1px solid rgb(204, 209, 214);">' +
        '<button class="primarynavbutton" style="height:32px; width:38px; padding:4px 0px 0px 7px;" title="Save Glyphr Project File" onclick="showToast(\'Saving Glyphr Studio Project file...\'); setTimeout(saveGlyphrProjectFile, 500);">' +
            makeIcon({'name': 'button_npSave', 'size': 24, 'color': savecolor, 'hovercolor': 'white'}) +
        '</button></td><td>' +
        '<button class="primarynavbutton" style="height:36px; width:21px; text-align:left; padding:0px 0px 0px 4px;" title="Save File Format Options" onclick="toggleDialog_ExportOptions();">' +
            makeIcon({'name': 'button_more', 'height': 10, 'width': 10, 'size': 10, 'color': savecolor, 'hovercolor': 'white'}) +
        '</button></td></tr>'+
    '</table>';
}


// -------------------
// File Savr
// -------------------

function saveFile(fname, buffer, ftype) {
ftype = ftype || 'text/plain;charset=utf-8';
let fblob = new Blob([buffer], {'type': ftype, 'endings': 'native'});

try {
    // IE
    window.navigator.msSaveBlob(fblob, fname);
    return;
} catch (err) {
    // Others
    let link = document.createElement('a');
    window.URL = window.URL || window.webkitURL;
    link.href = window.URL.createObjectURL(fblob);
    // link.onclick = ("alert("+window.URL.createObjectURL(fblob)+");");
    link.download = fname;

    let event = document.createEvent('MouseEvents');
    event.initEvent('click', true, false);
    link.dispatchEvent(event);
    return;
}
}


// -------------------
// Common Functions
// -------------------
// returns a full new copy of any object
// 'parentpath' is a PathPoint property that is a pointer to it's parent Path
// causes infinite loops when cloning objects.  Kind of a hack.
function clone(cobj) {
    let newObj = (cobj instanceof Array) ? [] : {};
    for (let i in cobj) {
        if (cobj[i] && typeof cobj[i] === 'object' && i !== 'parentpath' && i !== 'cache') {
            newObj[i] = clone(cobj[i]);
        } else newObj[i] = cobj[i];
    }
    return newObj;
}

// rounds a number to include a .5 so it draws nicely on canvas
// true = +0.5, false = -0.5
Number.prototype.makeCrisp = function(dir) {
    let mul = dir? 1 : -1;
    return round(this) + (0.5 * mul);
};

// better rounding than Math.round
function round(num, dec) {
    if (!num) return 0;
    dec = dec || 0;
    return Number(Math.round(num+'e'+dec)+'e-'+dec) || 0;
}

// floating point numbers make me mad
function numSan(num) {
    num = parseFloat(num);
    let strnum = ''+num;

    if (strnum.indexOf('0000') > -1 || strnum.indexOf('9999') > -1) {
        num = round(num, 6);
    }

    if (num < 0.0000 && num > 0) num = 0;

    return num;
}

// removes illegal file name chars
function strSan(val) {
    return val.replace(/[<>'"\\]/g, '');
}

// removes begining and trailing whitespace, and any breaking or tab chars
function trim(text) {
    try {
        text = text.replace(/^\s+|\s+$/g, '');
        return text.replace(/(\r\n|\n|\r|\t)/gm, '');
    } catch (e) {
return '';
}
}

// returns true for 0 and false
function isval(val) {
    if (val === 0) return true;
    else if (val === false) return true;
    else if (val === null || val === undefined) return false;
    else if ( typeof val === 'object' && Object.keys(val).length === 0 ) return false;
    else return !!val;
}

function getOverallMaxes(maxarr) {
    // debug('\n getOverallMaxes - START');
    // debug('\t start');
    // debug(maxarr);

    let re = clone(_UI.mins);
    let tm;

    for (let m=0; m<maxarr.length; m++) {
        // debug('\t pass ' + m);
        tm = maxarr[m];
        // debug([tm]);

        // sanitize
        if (!isval(tm.xmax)) tm.xmax = clone(_UI.mins.xmax);
        if (!isval(tm.xmin)) tm.xmin = clone(_UI.mins.xmin);
        if (!isval(tm.ymax)) tm.ymax = clone(_UI.mins.ymax);
        if (!isval(tm.ymin)) tm.ymin = clone(_UI.mins.ymin);
        // debug([tm]);

        // find
        re.xmax = Math.max(re.xmax, tm.xmax);
        re.xmin = Math.min(re.xmin, tm.xmin);
        re.ymax = Math.max(re.ymax, tm.ymax);
        re.ymin = Math.min(re.ymin, tm.ymin);
        // debug([re]);
    }

    // debug(' getOverallMaxes - END\n');

    return re;
}

function reqAniFrame(fun) {
    if (_UI.popOut) {
        if (_UI.popOut.requestAnimationFrame) _UI.popOut.requestAnimationFrame(fun);
        else {
            console.warn('no requestAnimationFrame');
            fun();
        }
    } else {
        if (window.requestAnimationFrame) window.requestAnimationFrame(fun);
        else {
            console.warn('no requestAnimationFrame');
            fun();
        }
    }
}

// --------------------------
// Angle and Rotation Stuff
// --------------------------

/**
    Use JavaScript angle system by default:
    Radians, top is positive bottom is negative
    3 o'clock is zero, 9 o'clock is pi

    Glyphr Studio angle system:
    360 Degrees, 12 o'clock is zero, clockwise = positve
**/

function calculateAngleX(angle, y) {
    x = Math.tan(angle*y);
    return x;
}

function calculateAngleY(angle, x) {
    y = Math.tan(angle*x);
    return y;
}

function calculateAngle(h, p) {
    p = p || {x: 0, y: 0};
    let result = Math.atan2(h.y - p.y, h.x - p.x);

    if (isNaN(result)) {
        console.warn('calculateAngle returned NaN\n' + json(h) + '\n' + json(p));
        result = 0;
    }

    return result;
}

function calculateLength(h, p) {
    let adj = p.x - h.x;
    let opp = p.y - h.y;
    let result = Math.sqrt( (adj*adj) + (opp*opp) );
    return result;
}

function rotate(coord, angle, about) {
    // debug('\n rotate - START');
    // debug('\t coord ' + json(coord, true));
    // debug('\t Math angle:\t' + angle);
    // debug('\t about ' + json(about, true));

    if (!angle || !coord) return;
    about = about || {x: 0, y: 0};

    coord.x -= about.x;
    coord.y -= about.y;

    let newx = (coord.x * Math.cos(angle)) - (coord.y * Math.sin(angle));
    let newy = (coord.x * Math.sin(angle)) + (coord.y * Math.cos(angle));

    coord.x = newx + about.x;
    coord.y = newy + about.y;

    // debug('\t new coord x/y: ' + coord.x + '/' + coord.y);
    // debug(' rotate - END\n');
}

// convert between degrees and radians
function rad(deg) {
return (deg * Math.PI / 180) % Math.PI;
}
function deg(rad) {
 return (rad * 180 / Math.PI) % 360;
}

// Shows the Glyphr Studio angle as opposed to the JavaScript angle
function calculateNiceAngle(angle) {
    angle = deg(angle);
    angle = 360 - angle;
    angle -= 270;
    angle = angle % 360;
    if (angle < 0) angle += 360;

    return angle;
}

function niceAngleToAngle(angle) {
    angle += 90;
    angle = angle % 360;
    if (angle < 180) angle = 360 - angle;
    else angle *=-1;

    angle = rad(angle);

    return angle;
}

function async(fn, callback) {
    setTimeout(function() {
        fn();
        callback && callback(fn() || undefined);
    }, 0);
}


// -------------------
// Object ID Stuff
// -------------------
// Returns the first ID from an object
function getFirstID(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return key;
        }
    }

    return false;
}

// Generate a new ID for an object
function generateNewID(obj, base) {
    let number = 1;
    base = base || 'id';
    let id = ('' + base + number);
    while (obj.hasOwnProperty(id)) id = ('' + base + (++number));

    return id;
}

function getMyID(obj) {
    for (let g in _GP.glyphs) {
if (_GP.glyphs.hasOwnProperty(g)) {
        if (obj === _GP.glyphs[g]) return g;
    }
}

    for (let c in _GP.components) {
if (_GP.components.hasOwnProperty(c)) {
        if (obj === _GP.components[c]) return c;
    }
}

    for (let l in _GP.ligatures) {
if (_GP.ligatures.hasOwnProperty(l)) {
        if (obj === _GP.ligatures[l]) return l;
    }
}

    return false;
}

// returns the length of an associative array
function getLength(obj) {
    let len = 0;
    for (let key in obj) {
if ( obj.hasOwnProperty(key)) len++;
}
    return len;
}


// -------------------
// BUG EMAIL
// -------------------

function genEmailContent() {
    let con = 'Have a feature idea or ran into an issue%3F We%27d be happy to help!';
    con += '%0A%0A%0A%0A___________________________________________%0A';
    con += 'version %09Glyphr Studio ' + _UI.thisGlyphrStudioVersionNum + '%0A';
    // con += 'appCodeName %09' + navigator.appCodeName + '%0A';
    con += 'app name %09' + navigator.appName + '%0A';
    // con += 'appVersion %09' + navigator.appVersion + '%0A';
    con += 'language %09' + navigator.language + '%0A';
    con += 'platform %09' + navigator.platform + '%0A';
    // con += 'systemLanguage %09' + navigator.systemLanguage + '%0A';
    // con += 'userLanguage %09' + navigator.userLanguage + '%0A';
    con += 'user agent %09' + encodeURIComponent(navigator.userAgent) + '%0A';

    // debug(con);

    return con;
}


// -------------------
// COLORS
// -------------------

function parseColorString(c) {
    let val = {r: 0, g: 0, b: 0, a: 1};

    if (typeof c !== 'string') return val;

    if (c.charAt(0)==='#') {
        c = c.substring(1, 7);
        val.r = parseInt(c.substring(0, 2), 16);
        val.g = parseInt(c.substring(2, 4), 16);
        val.b = parseInt(c.substring(4, 6), 16);
    } else if (c.substring(0, 4) === 'rgb(') {
        c = c.split('(')[1].split(')')[0].split(',');
        val.r = parseInt(c[0], 10);
        val.g = parseInt(c[1], 10);
        val.b = parseInt(c[2], 10);
        val.a = parseInt(c[3], 10) || 1;
    }

    return val;
}

function shiftColor(c, percent, lighter) {
    percent = Math.max(0, Math.min(percent, 1));
    let val = parseColorString(c);

    val.r = Math.max(0, Math.min(val.r, 255));
    val.g = Math.max(0, Math.min(val.g, 255));
    val.b = Math.max(0, Math.min(val.b, 255));

    if (lighter) {
        val.r = round(((255-val.r)*percent)+val.r);
        val.g = round(((255-val.g)*percent)+val.g);
        val.b = round(((255-val.b)*percent)+val.b);
    } else {
        val.r = round(val.r-(val.r*percent));
        val.g = round(val.g-(val.g*percent));
        val.b = round(val.b-(val.b*percent));
    }

    return 'rgb('+val.r+','+val.g+','+val.b+')';
}

function RGBAtoRGB(rgb, alpha) {
    let val = parseColorString(rgb);

    let dr = round((255-val.r) * (1-alpha));
    let dg = round((255-val.g) * (1-alpha));
    let db = round((255-val.b) * (1-alpha));

    let r = val.r + dr;
    let g = val.g + dg;
    let b = val.b + db;

    return `rgb(${r},${g},${b})`;
}

function transparencyToAlpha(transparency) {
    let t = parseInt(transparency);
    if (!t || isNaN(t)) return 1;

    if (t > 100) return 0;
    if (t < 0) return 1;

    return ((100 - transparency) / 100);
}


// -------------------
// COMBINATORICS
// -------------------

/**
 * K-combinations
 *
 * Get k-sized combinations of elements in a set.
 *
 * Usage:
 *   k_combinations(set, k)
 *
 * Parameters:
 *   set: Array of objects of any type. They are treated as unique.
 *   k: size of combinations to search for.
 *
 * Return:
 *   Array of found combinations, size of a combination is k.
 *
 * Examples:
 *
 *   k_combinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 *
 *   k_combinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 *
 *   k_combinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 *
 *   k_combinations([1, 2, 3], 4)
 *   -> []
 *
 *   k_combinations([1, 2, 3], 0)
 *   -> []
 *
 *   k_combinations([1, 2, 3], -1)
 *   -> []
 *
 *   k_combinations([], 0)
 *   -> []
 *
 * @param {number} set -
 * @param {number} k -
 * @return {array}
 */
function k_combinations(set, k) {
    let i;
    let j;
    let combs;
    let head;
    let tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    // Assert {1 < k < set.length}

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i+1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

k_permutations = function(set, maxLen, excludeTwins) {
    // Copy initial values as arrays
    let perm = set.map(function(val) {
        return [val];
    });

    // Our permutation generator
    let generate = function(perm, maxLen, currLen) {
        // Reached desired length
        if (currLen === maxLen) {
            return perm;
        }
        // For each existing permutation
        for (let i = 0, len = perm.length; i < len; i++) {
            let currPerm = perm.shift();
            // Create new permutation
            for (let k = 0; k < set.length; k++) {
                if (!(excludeTwins && currPerm[0] === set[k])) perm.push(currPerm.concat(set[k]));
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
};
