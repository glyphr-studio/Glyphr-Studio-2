import { getCurrentProject } from '../app/main.js';

/**
 * Glyph Sequence is a string of glyphs that has a concept
 * of type size and page width, with wrapping and
 * alignment and everything needed to display a large
 * amount of text
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

    // Internal
    this.project = getCurrentProject();

    // Computed
    this.maxes = oa.maxes;
    this.textblocks = this.glyphstring.split('\n');
    this.linebreakers = ['\u0020', '\u2002', '\u2003'];
    this.data = [];
    // log(this);
    // Initialize data
    this.generateData();
    // log('GlyphSequence', 'end');
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
    // log('\n GlyphSequence.setString - START');
    // log(`passed ${newstring}`);
    this._glyphString = newstring;
    this._textBlocks = this._glyphString.split('\n');
    // log(`this._glyphString ${this._glyphString}`);
    // log(`this._textBlocks ${this._textBlocks}`);
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
    // log('\n GlyphSequence.generateData - START');
    // log(`this.textblocks ${this.textblocks}`);
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
    // log(`Em unit currs ${currx}, ${curry}, ${this.scale}`);
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
        thisGlyph = this.project.getGlyph(
          charsToHexArray(currblock[tg]).join('')
        );
        thisWidth = thisGlyph
          ? thisGlyph.getAdvanceWidth()
          : this.project.projectSettings.upm / 2;
        thisKern = calculateKernOffset(currblock[tg], currblock[tg + 1]);
        aggregateWidth += thisWidth + thisKern;
        // Each glyph gets this data to draw it
        this.data[tb][tg] = {
          char: currblock[tg],
          glyph: thisGlyph,
          width: thisWidth,
          kern: thisKern,
          aggregate: aggregateWidth,
          islinebreaker: this.linebreakers.indexOf(currblock[tg]) > -1,
          isvisible: false,
          view: false,
          linenumber: false,
          lineaggregate: false,
        };
        currchar = this.data[tb][tg];
      }
    }
    // log('this.data');
    // log(this.data);
    /*
            ----------------------------------------
            Second loop to calculate line breaks
            within each block, and final possitions
            ----------------------------------------
        */
    // log('CALCUALTING DATA PER CHAR');
    for (tb = 0; tb < this.data.length; tb++) {
      currblock = this.data[tb];
      // log(`block ${tb}`);
      // char data units and width units are all in glyph em (not pixel) units
      for (tg = 0; tg < currblock.length; tg++) {
        currchar = currblock[tg];
        // log(`${currchar.char} num ${tg}`);
        if (currchar.view === false) {
          // pos for this currchar hasn't been calculated
          if (checkforbreak && this.maxwidth !== Infinity) {
            nlb = getNextLineBreaker(currblock, tg);
            wordagg = nlb.aggregate - currchar.aggregate;
            // log(`currx - area.x + wordagg > area.width`);
            // log(`${currx} - ${area.x} + ${wordagg} > ${area.width}`);
            // log(`${currx - area.x + wordagg} > ${area.width}`);
            if (currx - area.x + wordagg > area.width) {
              currline++;
              if (!canNextLineFit(curry, area, this.lineGap)) {
                // text takes up too much vertical space
                // returning early will leave unconputed chars.isvisible = false
                // log('GlyphSequence.generateData - Vertical Max Reached', 'end');
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
          currchar.view = clone({ dx: currx, dy: curry, dz: this.scale });
          currx += currchar.width + currchar.kern;
        }
        if (currchar.islinebreaker) checkforbreak = true;
        // log(`\twidth \t ${currchar.width}
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
        // log('GlyphSequence.generateData - Vertical Max Reached', 'end');
        return;
      }
      currx = area.x;
      curry = calcNewLineY(area.y, currline, this.lineGap);
    }
    // log('after view calc this.data');
    // log(this.data)
    // log('GlyphSequence.generateData', 'end');
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
    // log('\n GlyphSequence.draw - START');

    // Draw Page Extras
    if (this.drawPageExtras) {
      this.drawPageExtras(this.maxes, this.scale);
    }
    if (this.glyphstring === '') return;

    // Draw Line Extras
    let currline = -1;
    // log('DRAW LINE EXTRAS');
    if (this.drawLineExtras) {
      this.iterator(function (char, gs) {
        if (char.linenumber !== currline) {
          gs.drawLineExtras(char, gs);
          currline = char.linenumber;
        }
      });
    }

    // Draw Glyph Extras
    // log('DRAW GLYPH EXTRAS');
    if (this.drawGlyphExtras) {
      this.iterator(function (char, gs) {
        if (char.isvisible) gs.drawGlyphExtras(char);
      });
    }

    // Draw Glyphs
    // log('DRAW GLYPHS');
    if (this.drawGlyph) {
      this.iterator(function (char, gs) {
        if (char.isvisible) gs.drawGlyph(char);
      });
    }
    // log('GlyphSequence.draw', 'end');
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
  return (
    topPaddingY + lineNumber * (lineGap + this.project.projectSettings.upm)
  );
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
  let nextLineY = currentLineY + lineGap + this.project.projectSettings.upm;

  // log(`canNextLineFit - ${bottom} > ${nextLineY}`);
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
  // log('\n getNextLineBreaker - START');
  // log(`starting at pos ${start}`);

  for (let i = start; i < block.length; i++) {
    if (block[i].islinebreaker) {
      // log(`found ${i} returning *${block[i].char}* value ${block[i].aggregate}`);
      return block[i];
    }
  }

  // log(`NOTHING found, returning ${block[block.length-1].char} value ${block[block.length-1].aggregate}`);

  return block[block.length - 1];
}

/* eslint-disable no-unused-vars*/
/**
 * Quick logs the widths of a given sequence
 */
function debugWidths() {
  let seq = _UI.testDrive.glyphSequence;
  let re = '';

  re += seq.iterator(function (char, gs) {
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
  // log('\n calculateKernOffset - START');
  // log('passed: ' + c1 + ' and ' + c2);

  if (!c1 || !c2) return 0;

  c1 = parseUnicodeInput(c1).join('');
  c2 = parseUnicodeInput(c2).join('');
  // log('converted: ' + c1 + ' and ' + c2);

  let projectKerning = getCurrentProject().kerning;
  let leftGroupKern;
  let rightGroupKern;
  let result;

  for (let pair of Object.keys(projectKerning)) {
    if (projectKerning[pair]) {
      for (let l = 0; l < projectKerning[pair].leftgroup.length; l++) {
        leftGroupKern = projectKerning[pair].leftgroup[l];
        // log('checking leftgroup ' + leftGroupKern + ' against ' + c1);
        if (parseUnicodeInput(leftGroupKern)[0] === c1) {
          // log('LEFTGROUP MATCH! for ' + c1);
          for (let r = 0; r < projectKerning[pair].rightgroup.length; r++) {
            rightGroupKern = projectKerning[pair].rightgroup[r];
            if (parseUnicodeInput(rightGroupKern)[0] === c2) {
              result = projectKerning[pair].value * -1;
              // log('FOUND MATCH! returning ' + result);
              return result;
            }
          }
        }
      }
    }
  }

  // log('calculateKernOffset', 'end');
  return 0;
}

/**
 * Takes an array of glyphs as an argument, and looks for glyph sequences
 * that merge to ligatures.  Returns an array with merged results.
 * @param {array} charArray - characters to look through
 * @returns {array}
 */
function findAndMergeLigatures(charArray) {
  // log('\n findAndMergeLigatures - START');
  let ligs = sortLigatures();
  // log('sorted ligs: ');
  // log(ligs);

  let ligatureChars;
  let carrot;
  for (let c = 0; c < charArray.length; c++) {
    // for(var g=ligs.length-1; g>-1; g--){
    for (let g = 0; g < ligs.length; g++) {
      ligatureChars = hexToChars(ligs[g].id);
      // log('checking ' + ligatureChars);
      carrot = charArray.slice(c, c + ligatureChars.length).join('');
      // log('against ' + carrot);
      if (carrot === ligatureChars) {
        charArray.splice(c, ligatureChars.length, ligatureChars);
        // log('!Ligature Found! array['+c+'] is now ' + charArray[c]);
      }
    }
  }

  // log('findAndMergeLigatures', 'end');
  return charArray;
}
