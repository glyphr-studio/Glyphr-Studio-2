/**
    Framework > Glyph Sequence
    Drawing multiple lines of text.
**/

function GlyphSequence(oa) {
  // debug('\n GlyphSequence - START');
  oa = oa || {};

  this.setMaxes(oa.maxes);

  this.scale = oa.scale || 1;
  this.glyphstring = oa.glyphstring || '';
  this.textblocks = this.glyphstring.split('\n');
  this.lineGap =
    oa.lineGap || round(getCurrentProject().projectSettings.upm / 4);

  this.drawPageExtras = oa.drawPageExtras || false;
  this.drawLineExtras = oa.drawLineExtras || false;
  this.drawGlyphExtras = oa.drawGlyphExtras || false;
  this.drawGlyph = oa.drawGlyph || false;

  this.linebreakers = oa.linebreakers || ['\u0020', '\u2002', '\u2003'];
  this.data = [];

  // debug(this);

  // Initialize data
  this.generateData();

  // debug(' GlyphSequence - END\n');
}

GlyphSequence.prototype.setMaxes = function (maxes) {
  // Maxes are in Canvas Px units (not Project Em units)
  maxes = maxes || {};
  this.maxes = {
    xMin: maxes.xMin || 0,
    xMax: maxes.xMax || Infinity,
    yMin: maxes.yMin || 0,
    yMax: maxes.yMax || Infinity,
  };
};

GlyphSequence.prototype.setString = function (newstring) {
  // debug('\n GlyphSequence.setString - START');
  // debug(`\t passed ${newstring}`);

  this.glyphstring = newstring;
  this.textblocks = this.glyphstring.split('\n');

  // debug(`\t this.glyphstring ${this.glyphstring}`);
  // debug(`\t this.textblocks ${this.textblocks}`);

  // Lots of opportunities for optimization

  if (this.glyphstring !== '') this.generateData();
};

GlyphSequence.prototype.setScale = function (ns) {
  this.scale = ns;
  this.generateData();
};

GlyphSequence.prototype.setLineGap = function (ns) {
  this.lineGap = ns;
  this.generateData();
};

GlyphSequence.prototype.generateData = function () {
  // debug('\n GlyphSequence.generateData - START');
  // debug(`\t this.textblocks ${this.textblocks}`);
  let ps = getCurrentProject().projectSettings;

  let aggregateWidth = 0;
  let thisWidth;
  let thisKern;
  let thisGlyph;

  let currblock;
  let currchar;
  let tb, tg;
  let nlb, wordagg, newy;
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
      thisWidth = thisGlyph
        ? thisGlyph.getAdvanceWidth()
        : getCurrentProject().projectSettings.upm / 2;
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
        if (checkforbreak && this.maxwidth !== Infinity) {
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
        currchar.view = clone({ dx: currx, dy: curry, dz: this.scale });
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
};

GlyphSequence.prototype.iterator = function (fn) {
  let re = '';
  for (let tb = 0; tb < this.data.length; tb++) {
    for (let tg = 0; tg < this.data[tb].length; tg++) {
      re += fn(this.data[tb][tg], this);
    }
  }
  return re;
};

GlyphSequence.prototype.draw = function () {
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
    this.iterator(function (char, gs) {
      if (char.linenumber !== currline) {
        gs.drawLineExtras(char, gs);
        currline = char.linenumber;
      }
    });
  }

  // Draw Glyph Extras
  // debug('\t DRAW GLYPH EXTRAS');
  if (this.drawGlyphExtras) {
    this.iterator(function (char, gs) {
      if (char.isvisible) gs.drawGlyphExtras(char);
    });
  }

  // Draw Glyphs
  // debug('\t DRAW GLYPHS');
  if (this.drawGlyph) {
    this.iterator(function (char, gs) {
      if (char.isvisible) gs.drawGlyph(char);
    });
  }

  // debug(' GlyphSequence.draw - END\n');
};

function calcNewLineY(starty, linenum, lineGap) {
  let ps = getCurrentProject().projectSettings;
  return starty + linenum * (lineGap + ps.upm);
}

function canNextLineFit(curry, area, lineGap) {
  let bottom = area.y + area.height;
  let nextliney = curry + lineGap + getCurrentProject().projectSettings.upm;

  // debug(`\t canNextLineFit - ${bottom} > ${nextliney}`);
  return bottom > nextliney;
}

function getNextLineBreaker(block, start) {
  // debug('\n getNextLineBreaker - START');
  // debug(`\t starting at pos ${start}`);

  for (let i = start; i < block.length; i++) {
    if (block[i].islinebreaker) {
      // debug(`\t found ${i} returning *${block[i].char}* value ${block[i].aggregate}`);
      return block[i];
    }
  }

  // debug(`\t NOTHING found, returning ${block[block.length-1].char} value ${block[block.length-1].aggregate}`);

  return block[block.length - 1];
}

function debugWidths() {
  let seq = _UI.testDrive.glyphSequence;
  let re = '';

  re += seq.iterator(function (char, gs) {
    return `${char.width}, ${char.kern}, ${char.aggregate}\n`;
  });

  console.log(re);
}

/*
        calculateKernOffset
        Takes two glyphs as arguments, and determines the number of Em units of
        offset between them.  First checks to see if there are custom kern values
        for the pair, and if not, returns 0. Left Side Bearing and Right Side Bearing
        are not returned, only kern values.
    */
function calculateKernOffset(c1, c2) {
  // debug('\n calculateKernOffset - START');
  // debug('\t passed: ' + c1 + ' and ' + c2);

  if (!c1 || !c2) return 0;

  c1 = parseUnicodeInput(c1).join('');
  c2 = parseUnicodeInput(c2).join('');
  // debug('\t converted: ' + c1 + ' and ' + c2);

  let kernPairs = getCurrentProject().kerning;
  let leftGroupChar;
  let rightGroupChar;
  let result;

  for (let p of Object.keys(kernPairs)) {
    for (let l = 0; l < kernPairs[p].leftgroup.length; l++) {
      leftGroupChar = kernPairs[p].leftgroup[l];
      // debug('\t checking leftgroup ' + leftGroupChar + ' against ' + c1);
      if (parseUnicodeInput(leftGroupChar)[0] === c1) {
        // debug('\t LEFTGROUP MATCH! for ' + c1);
        for (let r = 0; r < kernPairs[p].rightgroup.length; r++) {
          rightGroupChar = kernPairs[p].rightgroup[r];
          if (parseUnicodeInput(rightGroupChar)[0] === c2) {
            result = kernPairs[p].value * -1;
            // debug('\t FOUND MATCH! returning ' + result);
            return result;
          }
        }
      }
    }
  }

  // debug(' calculateKernOffset - END\n');
  return 0;
}

/*
        findAndMergeLigatures
        Takes an array of glyphs as an argument, and looks for glyph sequences
        that merge to ligatures.  Returns an array with merged results.
    */
function findAndMergeLigatures(carr) {
  // debug('\n findAndMergeLigatures - START');
  let ligs = sortLigatures();
  // debug('\t sorted ligs: ');
  // debug(ligs);

  let ligchars, carrot;
  for (let c = 0; c < carr.length; c++) {
    // for(var g=ligs.length-1; g>-1; g--){
    for (let g = 0; g < ligs.length; g++) {
      ligchars = hexToChars(ligs[g].id);
      // debug('\t checking ' + ligchars);
      carrot = carr.slice(c, c + ligchars.length).join('');
      // debug('\t against ' + carrot);
      if (carrot === ligchars) {
        carr.splice(c, ligchars.length, ligchars);
        // debug('\t !Ligature Found! array['+c+'] is now ' + carr[c]);
      }
    }
  }

  // debug(' findAndMergeLigatures - END\n');
  return carr;
}
