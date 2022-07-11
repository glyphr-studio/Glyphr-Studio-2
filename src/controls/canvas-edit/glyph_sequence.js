/**
    Framework > Glyph Sequence
    Drawing multiple lines of text.
**/

function GlyphSequence(oa) {
  // log('\n GlyphSequence - START');
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

  // log(this);

  // Initialize data
  this.generateData();

  // log('GlyphSequence', 'end');
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
  // log('\n GlyphSequence.setString - START');
  // log(`passed ${newstring}`);

  this.glyphstring = newstring;
  this.textblocks = this.glyphstring.split('\n');

  // log(`this.glyphstring ${this.glyphstring}`);
  // log(`this.textblocks ${this.textblocks}`);

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
  // log('\n GlyphSequence.generateData - START');
  // log(`this.textblocks ${this.textblocks}`);
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
};

function calcNewLineY(starty, linenum, lineGap) {
  let ps = getCurrentProject().projectSettings;
  return starty + linenum * (lineGap + ps.upm);
}

function canNextLineFit(curry, area, lineGap) {
  let bottom = area.y + area.height;
  let nextliney = curry + lineGap + getCurrentProject().projectSettings.upm;

  // log(`canNextLineFit - ${bottom} > ${nextliney}`);
  return bottom > nextliney;
}

function getNextLineBreaker(block, start) {
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
  // log('\n calculateKernOffset - START');
  // log('passed: ' + c1 + ' and ' + c2);

  if (!c1 || !c2) return 0;

  c1 = parseUnicodeInput(c1).join('');
  c2 = parseUnicodeInput(c2).join('');
  // log('converted: ' + c1 + ' and ' + c2);

  let kernPairs = getCurrentProject().kerning;
  let leftGroupChar;
  let rightGroupChar;
  let result;

  for (let p of Object.keys(kernPairs)) {
    for (let l = 0; l < kernPairs[p].leftgroup.length; l++) {
      leftGroupChar = kernPairs[p].leftgroup[l];
      // log('checking leftgroup ' + leftGroupChar + ' against ' + c1);
      if (parseUnicodeInput(leftGroupChar)[0] === c1) {
        // log('LEFTGROUP MATCH! for ' + c1);
        for (let r = 0; r < kernPairs[p].rightgroup.length; r++) {
          rightGroupChar = kernPairs[p].rightgroup[r];
          if (parseUnicodeInput(rightGroupChar)[0] === c2) {
            result = kernPairs[p].value * -1;
            // log('FOUND MATCH! returning ' + result);
            return result;
          }
        }
      }
    }
  }

  // log('calculateKernOffset', 'end');
  return 0;
}

/*
        findAndMergeLigatures
        Takes an array of glyphs as an argument, and looks for glyph sequences
        that merge to ligatures.  Returns an array with merged results.
    */
function findAndMergeLigatures(carr) {
  // log('\n findAndMergeLigatures - START');
  let ligs = sortLigatures();
  // log('sorted ligs: ');
  // log(ligs);

  let ligchars, carrot;
  for (let c = 0; c < carr.length; c++) {
    // for(var g=ligs.length-1; g>-1; g--){
    for (let g = 0; g < ligs.length; g++) {
      ligchars = hexToChars(ligs[g].id);
      // log('checking ' + ligchars);
      carrot = carr.slice(c, c + ligchars.length).join('');
      // log('against ' + carrot);
      if (carrot === ligchars) {
        carr.splice(c, ligchars.length, ligchars);
        // log('!Ligature Found! array['+c+'] is now ' + carr[c]);
      }
    }
  }

  // log('findAndMergeLigatures', 'end');
  return carr;
}
