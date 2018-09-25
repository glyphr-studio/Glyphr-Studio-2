import {getGlyph} from '../app/globalgetters.js';

/**
 * Glyph Sequence is a string of glyphs that has a concept
 * of type size and page width, with wrapping and
 * alignment and everything needed to display a large
 * ammount of text
 */
export default class GlyphSequence {
    /**
     * Create a GlyphSequence
     * @param {number} scale -
     * @param {string} glyphstring -
     * @param {number} lineGap -
     * @param {boolean} drawPageExtras -
     * @param {boolean} drawLineExtras -
     * @param {boolean} drawGlyphExtras -
     * @param {boolean} drawGlyph -
     */
    constructor({
        scale = 1,
        glyphstring = '',
        lineGap = 250,
        drawPageExtras = false,
        drawLineExtras = false,
        drawGlyphExtras = false,
        drawGlyph = false,
        } = {}) {
        this.scale = oa.scale;
        this.glyphstring = oa.glyphstring;
        this.lineGap = oa.lineGap;
        this.drawPageExtras = oa.drawPageExtras;
        this.drawLineExtras = oa.drawLineExtras;
        this.drawGlyphExtras = oa.drawGlyphExtras;
        this.drawGlyph = oa.drawGlyph;

        // Computed
        this.maxes = oa.maxes;
        this.textblocks = this.glyphstring.split('\n');
        this.linebreakers = ['\u0020', '\u2002', '\u2003'];
        this.data = [];
        // debug(this);
        // Initialize data
        this.generateData();
        // debug(' GlyphSequence - END\n');
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------
    /**
     * gets maxes
     * @returns {object}
     */
    get maxes() {
        return this._maxes;
    }

    /**
     * gets glyphString
     * @returns {string}
     */
    get glyphString() {
        return this._glyphString;
    }

    /**
     * gets scale
     * @returns {number}
     */
    get scale() {
        return this._scale;
    }

    /**
     * gets lineGap
     * @returns {number}
     */
    get lineGap() {
        return this._lineGap;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------


    /**
     * sets a new maxes
     * @param {object} maxes - bounding box
     */
    set maxes(maxes) {
        // Maxes are in Canvas Px units (not Project Em units)
        maxes = maxes || {};
        this.maxes = {
            xMin: maxes.xMin || 0,
            xMax: maxes.xMax || Infinity,
            yMin: maxes.yMin || 0,
            yMax: maxes.yMax || Infinity,
        };
    }

    /**
     * sets a new glyphString
     * @param {number} newstring - new set of glyphs to show
     */
    set glyphString(newstring) {
        // debug('\n GlyphSequence.setString - START');
        // debug(`\t passed ${newstring}`);
        this._glyphString = newstring;
        this._textBlocks = this._glyphString.split('\n');
        // debug(`\t this._glyphString ${this._glyphString}`);
        // debug(`\t this._textBlocks ${this._textBlocks}`);
        // Lots of opportunities for optimization
        if (this._glyphString !== '') this.generateData();
    }

    /**
     * sets a new scale
     * @param {number} scale - new scale
     */
    set scale(scale) {
        this._scale = scale;
        this.generateData();
    }

    /**
     * sets a new lineGap
     * @param {number} gap - new line gap
     */
    set lineGap(gap) {
        this._lineGap = gap;
        this.generateData();
    }

    /**
     * Do a pass over all the glyphs and generate
     * the data needed to display them.
     */
    generateData() {
        // debug('\n GlyphSequence.generateData - START');
        // debug(`\t this.textblocks ${this.textblocks}`);
        let aggregateWidth = 0;
        let thisWidth;
        let thisKern;
        let thisGlyph;
        let currblock;
        let currchar;
        let tb;
        let tg;
        let nlb;
        let wordagg;
        let currline = 0;
        let checkforbreak = false;
        // Maxes are in px, Area is in Em
        let currx = this.maxes.xMin / this.scale;
        let curry = this.maxes.yMin / this.scale;
        let area = {
            x: this.maxes.xMin / this.scale,
            y: this.maxes.yMin / this.scale,
            width: (this.maxes.xMax - this.maxes.xMin) / this.scale,
            height: (this.maxes.yMax - this.maxes.yMin) / this.scale,
        };
        // debug(`\t Em unit currs ${currx}, ${curry}, ${this.scale}`);
        /*
            ----------------------------------------
            Initial loop to calculate widths
            ----------------------------------------
        */
        this.data = [];
        for (tb = 0; tb < this.textblocks.length; tb++) {
            currblock = findAndMergeLigatures(this.textblocks[tb].split(''));
            this.data[tb] = [];
            for (tg = 0; tg < currblock.length; tg++) {
                thisGlyph = getGlyph(charsToHexArray(currblock[tg]).join(''));
                thisWidth = thisGlyph ? thisGlyph.getAdvanceWidth() : (_GP.projectSettings.upm / 2);
                thisKern = calculateKernOffset(currblock[tg], currblock[tg + 1]);
                aggregateWidth += thisWidth + thisKern;
                // Each glyph gets this data to draw it
                this.data[tb][tg] = {
                    char: currblock[tg],
                    glyph: thisGlyph,
                    width: thisWidth,
                    kern: thisKern,
                    aggregate: aggregateWidth,
                    islinebreaker: (this.linebreakers.indexOf(currblock[tg]) > -1),
                    isvisible: false,
                    view: false,
                    linenumber: false,
                    lineaggregate: false,
                };
                currchar = this.data[tb][tg];
            }
        }
        // debug('this.data');
        // debug(this.data);
        /*
            ----------------------------------------
            Second loop to calculate line breaks
            within each block, and final possitions
            ----------------------------------------
        */
        // debug('\t CALCUALTING DATA PER CHAR');
        for (tb = 0; tb < this.data.length; tb++) {
            currblock = this.data[tb];
            // debug(`block ${tb}`);
            // char data units and width units are all in glyph em (not pixel) units
            for (tg = 0; tg < currblock.length; tg++) {
                currchar = currblock[tg];
                // debug(`${currchar.char} num ${tg}`);
                if (currchar.view === false) {
                    // pos for this currchar hasn't been calculated
                    if (checkforbreak && (this.maxwidth !== Infinity)) {
                        nlb = getNextLineBreaker(currblock, tg);
                        wordagg = nlb.aggregate - currchar.aggregate;
                        // debug(`\t currx - area.x + wordagg > area.width`);
                        // debug(`\t ${currx} - ${area.x} + ${wordagg} > ${area.width}`);
                        // debug(`\t ${currx - area.x + wordagg} > ${area.width}`);
                        if (currx - area.x + wordagg > area.width) {
                            currline++;
                            if (!canNextLineFit(curry, area, this.lineGap)) {
                                // text takes up too much vertical space
                                // returning early will leave unconputed chars.isvisible = false
                                // debug(' GlyphSequence.generateData - Vertical Max Reached - END\n');
                                return;
                            } else {
                                currx = area.x;
                                curry = calcNewLineY(area.y, currline, this.lineGap);
                            }
                        }
                        checkforbreak = false;
                    }
                    currchar.isvisible = true;
                    currchar.linenumber = currline;
                    currchar.view = clone({dx: currx, dy: curry, dz: this.scale});
                    currx += currchar.width + currchar.kern;
                }
                if (currchar.islinebreaker) checkforbreak = true;
                // debug(`\twidth \t ${currchar.width}
                // aggr \t ${currchar.aggregate}
                // lnbr \t ${currchar.islinebreaker}
                // view \t ${json(currchar.view, true)}
                // line \t ${currchar.linenumber}
                // \n`);
            }
            // End of one block
            currline++;
            if (!canNextLineFit(curry, area, this.lineGap)) {
                // text takes up too much vertical space
                // returning early will leave unconputed chars.isvisible = false
                // debug(' GlyphSequence.generateData - Vertical Max Reached - END\n');
                return;
            }
            currx = area.x;
            curry = calcNewLineY(area.y, currline, this.lineGap);
        }
        // debug('\t after view calc this.data');
        // debug(this.data)
        // debug(' GlyphSequence.generateData - END\n');
    }

    /**
     * Generic iterator to run a funciton on each glyph
     * @param {function} fn - function to run on each
     * @returns {string} - if the funciton wants, a concat of results
     */
    iterator(fn) {
        let re = '';
        for (let tb = 0; tb < this.data.length; tb++) {
            for (let tg = 0; tg < this.data[tb].length; tg++) {
                re += fn(this.data[tb][tg], this);
            }
        }
        return re;
    }

    /**
     * Draw the glyphs to the canvas
     */
    draw() {
        // debug('\n GlyphSequence.draw - START');

        // Draw Page Extras
        if (this.drawPageExtras) {
            this.drawPageExtras(this.maxes, this.scale);
        }
        if (this.glyphstring === '') return;

        // Draw Line Extras
        let currline = -1;
        // debug('\t DRAW LINE EXTRAS');
        if (this.drawLineExtras) {
            this.iterator(function(char, gs) {
                if (char.linenumber !== currline) {
                    gs.drawLineExtras(char, gs);
                    currline = char.linenumber;
                }
            });
        }

        // Draw Glyph Extras
        // debug('\t DRAW GLYPH EXTRAS');
        if (this.drawGlyphExtras) {
            this.iterator(function(char, gs) {
                if (char.isvisible) gs.drawGlyphExtras(char);
            });
        }

        // Draw Glyphs
        // debug('\t DRAW GLYPHS');
        if (this.drawGlyph) {
            this.iterator(function(char, gs) {
                if (char.isvisible) gs.drawGlyph(char);
            });
        }
        // debug(' GlyphSequence.draw - END\n');
    }
}

    /**
     * Calculate the vertical offset for a given line
     * @param {number} topPaddingY - top padding
     * @param {number} lineNumber - what line to calculate
     * @param {number} lineGap - gap between lines
     * @returns {number}
     */
    function calcNewLineY(topPaddingY = 0, lineNumber = 1, lineGap = 0) {
        let ps = _GP.projectSettings;
        return topPaddingY + (lineNumber*((lineGap + ps.upm)));
    }

    /**
     * Checks to see if the next line will fit vertically
     * @param {number} currentLineY - current Y value
     * @param {object} area - text area object
     * @param {number} lineGap - gap between lines
     * @returns {boolean}
     */
    function canNextLineFit(currentLineY, area, lineGap) {
        let bottom = area.y + area.height;
        let nextLineY = currentLineY + lineGap + _GP.projectSettings.upm;

        // debug(`\t canNextLineFit - ${bottom} > ${nextLineY}`);
        return bottom > nextLineY;
    }

    /**
     * Looks down an array of characters and returns the next
     * line break character
     * @param {array} block - array of characters
     * @param {number} start - index to start
     * @returns {object}
     */
    function getNextLineBreaker(block, start = 0) {
        // debug('\n getNextLineBreaker - START');
        // debug(`\t starting at pos ${start}`);

        for (let i=start; i<block.length; i++) {
            if (block[i].islinebreaker) {
                // debug(`\t found ${i} returning *${block[i].char}* value ${block[i].aggregate}`);
                return block[i];
            }
        }

        // debug(`\t NOTHING found, returning ${block[block.length-1].char} value ${block[block.length-1].aggregate}`);

        return block[block.length-1];
    }

    /* eslint-disable no-unused-vars*/
    /**
     * Quick logs the widths of a given sequence
     */
    function debugWidths() {
        let seq = _UI.testDrive.glyphSequence;
        let re = '';

        re += seq.iterator(function(char, gs) {
            return `${char.width}, ${char.kern}, ${char.aggregate}\n`;
        });

        console.log(re);
    }
    /* eslint-enable no-unused-vars*/


    /**
     * Takes two glyphs as arguments, and determines the number of Em units of
     * offset between them.  First checks to see if there are custom kern values
     * for the pair, and if not, returns 0. Left Side Bearing and Right Side Bearing
     * are not returned, only kern values.
     * @param {string} c1 - first char
     * @param {string} c2 - second char
     * @returns {number} - kern offset in Em Units
     */
    function calculateKernOffset(c1, c2) {
        // debug('\n calculateKernOffset - START');
        // debug('\t passed: ' + c1 + ' and ' + c2);

        if (!c1 || !c2) return 0;

        c1 = parseUnicodeInput(c1).join('');
        c2 = parseUnicodeInput(c2).join('');
        // debug('\t converted: ' + c1 + ' and ' + c2);

        let k = _GP.kerning;
        let tlc;
        let trc;
        let re;

        for (let p in k) {
            if (k.hasOwnProperty(p)) {
                for (let l=0; l<k[p].leftgroup.length; l++) {
                    tlc = k[p].leftgroup[l];
                    // debug('\t checking leftgroup ' + tlc + ' against ' + c1);
                    if (parseUnicodeInput(tlc)[0] === c1) {
                        // debug('\t LEFTGROUP MATCH! for ' + c1);
                        for (let r=0; r<k[p].rightgroup.length; r++) {
                            trc = k[p].rightgroup[r];
                            if (parseUnicodeInput(trc)[0] === c2) {
                                re = (k[p].value*-1);
                                // debug('\t FOUND MATCH! returning ' + re);
                                return re;
                            }
                        }
                    }
                }
            }
        }

        // debug(' calculateKernOffset - END\n');
        return 0;
    }

    /**
     * Takes an array of glyphs as an argument, and looks for glyph sequences
     * that merge to ligatures.  Returns an array with merged results.
     * @param {array} charArray - characters to look through
     * @returns {array}
     */
    function findAndMergeLigatures(charArray) {
        // debug('\n findAndMergeLigatures - START');
        let ligs = sortLigatures();
        // debug('\t sorted ligs: ');
        // debug(ligs);

        let ligatureChars;
        let carrot;
        for (let c=0; c<charArray.length; c++) {
            // for(var g=ligs.length-1; g>-1; g--){
            for (let g=0; g<ligs.length; g++) {
                ligatureChars = hexToChars(ligs[g].id);
                // debug('\t checking ' + ligatureChars);
                carrot = charArray.slice(c, (c+ligatureChars.length)).join('');
                // debug('\t against ' + carrot);
                if (carrot === ligatureChars) {
                    charArray.splice(c, ligatureChars.length, ligatureChars);
                    // debug('\t !Ligature Found! array['+c+'] is now ' + charArray[c]);
                }
            }
        }

        // debug(' findAndMergeLigatures - END\n');
        return charArray;
    }
