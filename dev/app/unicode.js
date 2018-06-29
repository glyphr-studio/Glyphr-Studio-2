export {
    decToHex, decToHTML, glyphToHex, charsToHexArray, hexToChars, hexToHTML,
    hexToUnicodeHex, parseUnicodeInput, isInputUnicode, isInputHex, validateHex,
    unicodeInputHelp, addCustomGlyphRange, getCustomRange, updateCustomRangeTable,
    removeCustomGlyphRange, getUnicodeName, getUnicodeShortName,
};

/**
    Framework > Unicode
    Anything having to do with / working with
    Unicode values.  Also working with Unicode
    ranges, like basic latin.
**/


//    --------------------
//    Conversion Functions
//    --------------------

/**
 * Convert decimal to hexadecimal
 * @param {number} d - decimal
 * @returns {string} - hexadecimal
 */
function decToHex(d) {
    let dr = Number(d).toString(16);

    while (dr.length < 4) {
        dr = '0'+dr;
    }

    return '0x'+dr.toUpperCase();
}

/**
 * Convert decimal to HTML
 * @param {number} d - decimal
 * @returns {string} - HTML
 */
function decToHTML(d) {
    return hexToHTML(decToHex(d));
}

/**
 * Convert Unicode glyph to hexadecimal
 * @param {string} s - unicode
 * @returns {string} - hexadecimal
 */
function glyphToHex(s) {
    let result = '';
    for (let i=0; i<s.length; i++) result += decToHex(String(s).charCodeAt(i));
    return result;
}

/**
 * Convert string to an array of hexadecimal
 * @param {number} s - string
 * @returns {array} - hexadecimal
 */
function charsToHexArray(s) {
    let result = [];
    for (let i=0; i<s.length; i++) result.push(decToHex(String(s).charCodeAt(i)));
    return result;
}


/**
 * Convert hexadecimal to string
 * @param {string} u - hexadecimal
 * @returns {string} - string
 */
function hexToChars(u) {
    if (String(u).charAt(1) !== 'x') u = String(decToHex(u));
    // debug('\n hexToChars - START');
    // debug('\t passed ' + u + ' which is a ' + typeof u);

    u = u.split('0x');
    let result = '';

    for (let i=0; i<u.length; i++) {
        if (u[i] !== '') {
            u[i] = String.fromCharCode('0x'+u[i]);
            // debug('\t added ' + u[i]);
            if (u[i]) result += u[i];
        }
    }

    // debug(' hexToHTML - END\n');
    return result;
}

/**
 * Convert hexadecimal to HTML
 * @param {string} h - hexadecimal
 * @returns {string} - HTML
 */
function hexToHTML(h) {
    // debug('\n hexToHTML - START');
    // debug('\t passed ' + h);
    if (!h || h.indexOf('0x') < 0) return false;

    h = String(h).split('0x');
    let result = '';

    for (let i=0; i<h.length; i++) {
        if (h[i] !== '') {
            h[i] = ('0x'+h[i]);
            h[i] = parseInt(h[i], 16);
            if (h[i]) result += ('&#'+h[i]+';');
        }
    }
    return result;
}

/**
 * Convert hexidecimal to Unicode format
 * @param {number} h - hexidecimal
 * @returns {string} - Unicode
 */
function hexToUnicodeHex(h) {
    return (h.replace(/0x/, '&#x') + ';');
}

/**
 * Take user input and try to get Unicode out
 * @param {string} str - input string
 * @returns {string} - sanitized string
 */
function parseUnicodeInput(str) {
    // takes any kind or number of input
    // Unicode, Hex, or glyph
    // and returns an array of padded hex values

    // debug('\n parseUnicodeInput - START');
    // debug('\t passed ' + str);

    if (!str) return false;

    let entries = [];
    let results = [];

    if (isInputUnicode(str)) {
        str = str.replace(/u\+/g, 'U+');
        entries = str.split('U+');
    } else if (isInputHex(str)) {
        str = str.replace(/0X/g, '0x');
        entries = str.split('0x');
    } else {
        return charsToHexArray(str);
    }

    let te;
    for (let e=0; e<entries.length; e++) {
        te = entries[e];
        te = te.replace(/;/g, '');
        if (te !== '') {
            while (te.length < 4) te = '0'+te;
            te = ('0x'+te.toUpperCase());
            // debug('\t parsed ' + e + ' as ' + te);
            results.push(te);
        }
    }

    // debug('\t returning ' + JSON.stringify(results));
    // debug('parseUnicodeInput - END\n');
    return results;
}

/**
 * Detects if this string is has Unicode chars in it
 * @param {string} str - input Unicode
 * @returns {number} - count of chars
 */
function isInputUnicode(str) {
    str = str.replace(/u\+/g, 'U+');
    let count = 0;
    let pos = str.indexOf('U+');
    while (pos !== -1) {
        count ++;
        pos = str.indexOf('U+', pos+2);
    }
    return count;
}

/**
 * Detects if this string has Hex chars in it
 * @param {string} str - input Hex
 * @returns {number} - count of chars
 */
function isInputHex(str) {
    str = str.replace(/0X/g, '0x');
    let count = 0;
    let pos = str.indexOf('0x');
    while (pos !== -1) {
        count ++;
        pos = str.indexOf('0x', pos+2);
    }
    return count;
}

/**
 * Checks to see if a string is valid Hex Char
 * @param {string} str - input Hex
 * @returns {boolean}
 */
function validateHex(str) {
    let green = '0123456789ABCDEF';
    str = str.toString();
    str = str.toUpperCase();
    if (str.startsWith('0x')) str = str.substring(2);

    if (str.length > 4) return false;

    for (let c=0; c<str.length; c++) {
        if (green.indexOf(str.charAt(c)) === -1) return false;
    }

    return true;
}

/**
 * help content for inputting Unicode
 * @returns {string}
 */
function unicodeInputHelp() {
    let re = '<h1>Using Unicode Values</h1>'+
        'Unicode is a format used by fonts that assigns an ID number to every glyph.<br>'+
        'Glyphr Studio uses this format for importing fonts, and for identifying glyphs,<br>kern pairs, and ligatures.<br><br>'+
        'Glyphr Studio accepts three flavors of this ID number:<br>'+
        '<ul>'+
            '<li><b>Decimal Numbers</b> - for example, the number 78 corresponds to capital N.</li>'+
            '<li><b>Hexadecimal Numbers</b> - a base-16 number with a 0x prefix. For example,<br>0x4E corresponds to capital N.</li>'+
            '<li><b>Unicode Numbers</b> - a base-16 number with a U+ prefix. For example,<br>U+4E corresponds to capital N.</li>'+
        '</ul>'+
        'When you input any of these numbers, Glyphr Studio will validate the number,<br>and convert it to a four digit hex format (like 0x004E).<br><br>'+
        'Note: Glyphr Studio is limited to the Basic Multilingual Plane,<br>Unicode U+0000 through U+FFFF.  Unicode range notation is not supported.'+
        '';
    return re;
}


//    --------------------
//    Range functions
//    --------------------

/**
 * Adds a custom glyph range to the project
 */
function addCustomGlyphRange() {
    let newrange = getCustomRange(true);
    if (newrange) {
        _GP.projectSettings.glyphrange.custom.unshift(newrange);
        updateCustomRangeTable();
    }
}

/**
 * Gets user input on a new custom range, makes sure it's a valid custom range
 * @param {boolean} filterbasicrange - removes Unicode Latin ranges if true
 * @returns {object} - Range object
 */
function getCustomRange(filterbasicrange) {
    let newrange = {'begin': 0, 'end': 0};
    newrange.begin = parseUnicodeInput(document.getElementById('customrangebegin').value)[0];
    newrange.end = parseUnicodeInput(document.getElementById('customrangeend').value)[0];
    document.getElementById('customrangebegin').value = '';
    document.getElementById('customrangeend').value = '';

    if (isNaN(newrange.begin) || isNaN(newrange.end)) {
        document.getElementById('customrangeerror').style.display = 'block';
        setTimeout(function() {
            document.getElementById('customrangeerror').style.display = 'none';
        }, 2500);
        return false;
    } else {
        // flip
        if (newrange.begin > newrange.end) {
            let tempbegin = newrange.begin;
            newrange.begin = newrange.end;
            newrange.end = tempbegin;
        }

        // maxes
        if (filterbasicrange) {
            newrange.begin = Math.max(newrange.begin, (_UI.glyphrange.latinextendedb.end+1));
            newrange.end = Math.max(newrange.end, (_UI.glyphrange.latinextendedb.end+2));
        }
        newrange.begin = Math.min(newrange.begin, 0xFFFE);
        newrange.end = Math.min(newrange.end, 0xFFFF);

        // format
        newrange.begin = decToHex(newrange.begin);
        newrange.end = decToHex(newrange.end);

        return newrange;
    }
}

/**
 * Updates the custom range output section
 */
function updateCustomRangeTable() {
    let cr = _GP.projectSettings.glyphrange.custom;
    // debug('UPDATECUSTOMRANGETABLE - \n\t custom is ' + JSON.stringify(cr));
    let content = '';
    if (cr.length) {
        content += 'Existing custom glyph ranges:<br><table style="margin-top:8px;">';
        for (let c=0; c<cr.length; c++) {
            content += '<tr><td class="customrangeline">';
            content += cr[c].begin + '&nbsp;&nbsp;through&nbsp;&nbsp;' + cr[c].end + '&nbsp;&nbsp;';
            content += '</td><td>';
            content += '<button onclick="removeCustomGlyphRange('+c+');">remove</button>';
            content += '</td></tr>';
        }
        content += '</table><br>';
        content += 'Note, removing a custom range will not delete glyph data from your Glyphr Project.  ';
        content += 'Custom ranges only determine what is shown in the UI, and what is exported to fonts.';
    }
    document.getElementById('customrangetable').innerHTML = content;
}

/**
 * Removes a custom range
 * @param {number} i - which range to remove
 */
function removeCustomGlyphRange(i) {
    let cr = _GP.projectSettings.glyphrange.custom;
    // debug('REMOVECUSTOMGLYPHRANGE - called on index ' + i + '\n\t custom is ' + JSON.stringify(cr));
    cr.splice(i, 1);
    updateCustomRangeTable();
    // debug('REMOVECUSTOMGLYPHRANGE - \n\t custom is ' + JSON.stringify(cr));
}


//    -----------------
//    Glyph Name Wrapper
//    -----------------

/**
 * Gets the name of a Unicode character
 * @param {number} ch - Unicode code point
 * @returns {string} - name
 */
function getUnicodeName(ch) {
    // debug('\n getUnicodeName - START');
    // debug('\t passed ' + ch);
    ch = ''+ch;
    let re;
    let chn = ch*1;

    if (chn >= 0x4E00 && chn < 0xA000) {
        return 'CJK Unified Ideograph ' + ch.substr(2);
    } else if (_UI && _UI.unicodenames) {
        re = _UI.unicodenames[ch] || '[name not found]';
    }

    // debug(' getUnicodeName - END - returning ' + re + '\n');
    return re;
}

/**
 * Gets a short name for a Unicode character, and if not,
 * returns the regular long name
 * @param {number} ch - Unicode code point
 * @returns {string} - name
 */
function getUnicodeShortName(ch) {
    // debug('\n getUnicodeShortName - START');
    // debug('\t passed ' + ch);
    ch = ''+ch;
    let name = _UI.shortunicodenames[ch];
    if (!name) {
        name = getUnicodeName(ch);
        if (name) name = name.replace(/latin /gi, '').replace(/ /g, '').substr(0, 20);
        else name = 'none';
    }

    // debug(' getUnicodeShortName - returning ' + name + ' - END\n');
    return name;
}


//    -----------------
//    Global Vars
//    -----------------

_UI.basiclatinorder = ['0x0041', '0x0042', '0x0043', '0x0044', '0x0045', '0x0046', '0x0047', '0x0048', '0x0049', '0x004A', '0x004B', '0x004C', '0x004D', '0x004E', '0x004F', '0x0050', '0x0051', '0x0052', '0x0053', '0x0054', '0x0055', '0x0056', '0x0057', '0x0058', '0x0059', '0x005A', '0x0061', '0x0062', '0x0063', '0x0064', '0x0065', '0x0066', '0x0067', '0x0068', '0x0069', '0x006A', '0x006B', '0x006C', '0x006D', '0x006E', '0x006F', '0x0070', '0x0071', '0x0072', '0x0073', '0x0074', '0x0075', '0x0076', '0x0077', '0x0078', '0x0079', '0x007A', '0x0030', '0x0031', '0x0032', '0x0033', '0x0034', '0x0035', '0x0036', '0x0037', '0x0038', '0x0039', '0x0021', '0x0022', '0x0023', '0x0024', '0x0025', '0x0026', '0x0027', '0x0028', '0x0029', '0x002A', '0x002B', '0x002C', '0x002D', '0x002E', '0x002F', '0x003A', '0x003B', '0x003C', '0x003D', '0x003E', '0x003F', '0x0040', '0x005B', '0x005C', '0x005D', '0x005E', '0x005F', '0x0060', '0x007B', '0x007C', '0x007D', '0x007E', '0x0020'];

_UI.glyphrange = {
    'basiclatin': {'begin': 0x0020, 'end': 0x007E},
    'latinsupplimentcontrols': {'begin': 0x0080, 'end': 0x009F},
    'latinsupplement': {'begin': 0x00A0, 'end': 0x00FF},
    'latinextendeda': {'begin': 0x0100, 'end': 0x017F},
    'latinextendedb': {'begin': 0x0180, 'end': 0x024F},
};

// https://en.wikipedia.org/wiki/Typographic_ligature
_UI.ligaturetounicode = {
    'ff': '0xFB00',
    'fi': '0xFB01',
    'fl': '0xFB02',
    'ft': '0xFB05',
    'ffi': '0xFB03',
    'ffl': '0xFB04',
};
