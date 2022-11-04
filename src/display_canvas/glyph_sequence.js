/**
	Glyph Sequence
	Drawing multiple lines of text.
**/

class GlyphSequence {
	constructor(oa) {
		// log('GlyphSequence', 'start');
		oa = oa || {};

		this.setMaxes(oa.maxes);

		this.scale = oa.scale || 1;
		this.glyphString = oa.glyphString || '';
		this.textBlocks = this.glyphString.split('\n');
		this.lineGap = oa.lineGap || round(getCurrentProject().projectSettings.upm / 4);

		this.drawPageExtras = oa.drawPageExtras || false;
		this.drawLineExtras = oa.drawLineExtras || false;
		this.drawGlyphExtras = oa.drawGlyphExtras || false;
		this.drawGlyph = oa.drawGlyph || false;

		this.lineBreakers = oa.lineBreakers || ['\u0020', '\u2002', '\u2003'];
		this.data = [];

		// log(this);
		// Initialize data
		this.generateData();

		// log('GlyphSequence', 'end');
	}

	setMaxes(maxes) {
		// Maxes are in Canvas Px units (not Project Em units)
		maxes = maxes || {};
		this.maxes = {
			xMin: maxes.xMin || 0,
			xMax: maxes.xMax || Infinity,
			yMin: maxes.yMin || 0,
			yMax: maxes.yMax || Infinity,
		};
	}

	setString(newString) {
		// log('GlyphSequence.setString', 'start');
		// log(`passed ${newString}`);
		this.glyphString = newString;
		this.textBlocks = this.glyphString.split('\n');

		// log(`this.glyphString ${this.glyphString}`);
		// log(`this.textBlocks ${this.textBlocks}`);
		// Lots of opportunities for optimization
		if (this.glyphString !== '') this.generateData();
	}

	setScale(ns) {
		this.scale = ns;
		this.generateData();
	}

	setLineGap(ns) {
		this.lineGap = ns;
		this.generateData();
	}

	generateData() {
		// log('GlyphSequence.generateData', 'start');
		// log(`this.textBlocks ${this.textBlocks}`);

		let aggregateWidth = 0;
		let thisWidth;
		let thisKern;
		let thisGlyph;

		let currentBlock;
		let currentChar;
		let tb, tg;
		let nlb, wordAggregate;
		let currentLine = 0;
		let checkForBreak = false;

		// Maxes are in px, Area is in Em
		let currentX = this.maxes.xMin / this.scale;
		let currentY = this.maxes.yMin / this.scale;
		let area = {
			x: this.maxes.xMin / this.scale,
			y: this.maxes.yMin / this.scale,
			width: (this.maxes.xMax - this.maxes.xMin) / this.scale,
			height: (this.maxes.yMax - this.maxes.yMin) / this.scale,
		};

		// log(`Em unit current ${currentX}, ${currentY}, ${this.scale}`);
		/*
			----------------------------------------
			Initial loop to calculate widths
			----------------------------------------
		*/
		this.data = [];
		let ps = getCurrentProject().projectSettings;

		for (tb = 0; tb < this.textBlocks.length; tb++) {
			currentBlock = findAndMergeLigatures(this.textBlocks[tb].split(''));
			this.data[tb] = [];

			for (tg = 0; tg < currentBlock.length; tg++) {
				thisGlyph = getGlyph(charsToHexArray(currentBlock[tg]).join(''));
				if (thisGlyph) {
					thisWidth = thisGlyph.advanceWidth;
				} else {
					thisWidth = ps.upm / 2;
				}
				thisKern = calculateKernOffset(currentBlock[tg], currentBlock[tg + 1]);
				aggregateWidth += thisWidth + thisKern;

				// Each glyph gets this data to draw it
				this.data[tb][tg] = {
					char: currentBlock[tg],
					glyph: thisGlyph,
					width: thisWidth,
					kern: thisKern,
					aggregate: aggregateWidth,
					isLineBreaker: this.lineBreakers.indexOf(currentBlock[tg]) > -1,
					isVisible: false,
					view: false,
					lineNumber: false,
				};

				currentChar = this.data[tb][tg];
			}
		}

		// log('this.data');
		// log(this.data);
		/*
			----------------------------------------
			Second loop to calculate line breaks
			within each block, and final positions
			----------------------------------------
		*/
		// log('CALCULATING DATA PER CHAR');
		for (tb = 0; tb < this.data.length; tb++) {
			currentBlock = this.data[tb];
			// log(`block ${tb}`);
			// char data units and width units are all in glyph em (not pixel) units
			for (tg = 0; tg < currentBlock.length; tg++) {
				currentChar = currentBlock[tg];
				// log(`${currentChar.char} num ${tg}`);
				if (currentChar.view === false) {
					// pos for this currentChar hasn't been calculated
					if (checkForBreak && this.maxwidth !== Infinity) {
						nlb = getNextLineBreaker(currentBlock, tg);
						wordAggregate = nlb.aggregate - currentChar.aggregate;

						// log(`currentX - area.x + wordAggregate > area.width`);
						// log(`${currentX} - ${area.x} + ${wordAggregate} > ${area.width}`);
						// log(`${currentX - area.x + wordAggregate} > ${area.width}`);
						if (currentX - area.x + wordAggregate > area.width) {
							currentLine++;

							if (!canNextLineFit(currentY, area, this.lineGap)) {
								// text takes up too much vertical space
								// returning early will leave non-computed chars.isVisible = false
								// log('GlyphSequence.generateData - Vertical Max Reached', 'end');
								return;
							} else {
								currentX = area.x;
								currentY = calcNewLineY(area.y, currentLine, this.lineGap);
							}
						}

						checkForBreak = false;
					}

					currentChar.isVisible = true;
					currentChar.lineNumber = currentLine;
					currentChar.view = clone({ dx: currentX, dy: currentY, dz: this.scale });
					currentX += currentChar.width + currentChar.kern;
				}

				if (currentChar.isLineBreaker) checkForBreak = true;

				// log(`\twidth \t ${currentChar.width}
				// agg \t ${currentChar.aggregate}
				// isBR \t ${currentChar.isLineBreaker}
				// view \t ${json(currentChar.view, true)}
				// line \t ${currentChar.lineNumber}
				// \n`);
			}

			// End of one block
			currentLine++;

			if (!canNextLineFit(currentY, area, this.lineGap)) {
				// text takes up too much vertical space
				// returning early will leave non-computed chars.isVisible = false
				// log('GlyphSequence.generateData - Vertical Max Reached', 'end');
				return;
			}

			currentX = area.x;
			currentY = calcNewLineY(area.y, currentLine, this.lineGap);
		}

		// log('after view calc this.data');
		// log(this.data)
		// log('GlyphSequence.generateData', 'end');
	}

	iterator(fn) {
		let re = '';
		for (let tb = 0; tb < this.data.length; tb++) {
			for (let tg = 0; tg < this.data[tb].length; tg++) {
				re += fn(this.data[tb][tg], this);
			}
		}
		return re;
	}

	draw() {
		// log('GlyphSequence.draw', 'start');
		// Draw Page Extras
		if (this.drawPageExtras) {
			this.drawPageExtras(this.maxes, this.scale);
		}

		if (this.glyphString === '') return;

		// Draw Line Extras
		let currentLine = -1;
		// log('DRAW LINE EXTRAS');
		if (this.drawLineExtras) {
			this.iterator(function (char, gs) {
				if (char.lineNumber !== currentLine) {
					gs.drawLineExtras(char, gs);
					currentLine = char.lineNumber;
				}
			});
		}

		// Draw Glyph Extras
		// log('DRAW GLYPH EXTRAS');
		if (this.drawGlyphExtras) {
			this.iterator(function (char, gs) {
				if (char.isVisible) gs.drawGlyphExtras(char);
			});
		}

		// Draw Glyphs
		// log('DRAW GLYPHS');
		if (this.drawGlyph) {
			this.iterator(function (char, gs) {
				if (char.isVisible) gs.drawGlyph(char);
			});
		}

		// log('GlyphSequence.draw', 'end');
	}
}

/**
 * Calculates the Y value of the next line
 * @param {Number} startY - measurement of the current line's Y value
 * @param {Number} lineNumber - current line number
 * @param {Number} lineGap - gap between lines
 * @returns Number - next lines Y value
 */
function calcNewLineY(startY, lineNumber, lineGap) {
	let ps = getCurrentProject().projectSettings;
	return startY + lineNumber * (lineGap + ps.upm);
}

/**
 * Checks to see if another line will fit within the overall
 * height of the preview area
 * @param {Number} currentY - y value for the current line
 * @param {Object} area - data describing the preview area
 * @param {Number} lineGap - line gap measurement
 * @returns Boolean
 */
function canNextLineFit(currentY, area, lineGap) {
	let bottom = area.y + area.height;
	let nextLineY = currentY + lineGap + getCurrentProject().projectSettings.upm;

	// log(`canNextLineFit - ${bottom} > ${nextLineY}`);
	return bottom > nextLineY;
}

/**
 * Looks ahead through a block to return the next line break character
 * @param {Array} block - collection of chars to check
 * @param {Number} start - what index to start at
 * @returns - line break character
 */
function getNextLineBreaker(block, start) {
	// log('getNextLineBreaker', 'start');
	// log(`starting at pos ${start}`);

	for (let i = start; i < block.length; i++) {
		if (block[i].isLineBreaker) {
			// log(`found ${i} returning *${block[i].char}* value ${block[i].aggregate}`);
			return block[i];
		}
	}

	// log(`NOTHING found, returning ${block[block.length-1].char} value ${block[block.length-1].aggregate}`);

	return block[block.length - 1];
}

/**
 * Takes two glyphs as arguments, and determines the number of Em units of
 * offset between them.  First checks to see if there are custom kern values
 * for the pair, and if not, returns 0.
 * @param {Glyph} c1 - first glyph to check
 * @param {Glyph} c2 - second glyph to check
 * @returns
 */
function calculateKernOffset(c1, c2) {
	// log('calculateKernOffset', 'start');
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
		for (let l = 0; l < kernPairs[p].leftGroup.length; l++) {
			leftGroupChar = kernPairs[p].leftGroup[l];
			// log('checking leftGroup ' + leftGroupChar + ' against ' + c1);
			if (parseUnicodeInput(leftGroupChar)[0] === c1) {
				// log('LEFT GROUP MATCH! for ' + c1);
				for (let r = 0; r < kernPairs[p].rightGroup.length; r++) {
					rightGroupChar = kernPairs[p].rightGroup[r];
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

/**
 * Takes an array of glyphs as an argument, and looks for glyph
 * sequences that merge to ligatures.
 * @param {Array} glyphCollection - Array of Glyph objects
 * @returns - Array with merged results
 */
function findAndMergeLigatures(glyphCollection) {
	// log('findAndMergeLigatures', 'start');
	let ligatures = sortLigatures();
	// log('sorted ligatures: ');
	// log(ligatures);

	let ligatureCharacters, carrot;
	for (let c = 0; c < glyphCollection.length; c++) {
		// for(var g=ligatures.length-1; g>-1; g--){
		for (let g = 0; g < ligatures.length; g++) {
			ligatureCharacters = hexToChars(ligatures[g].id);
			// log('checking ' + ligatureCharacters);
			carrot = glyphCollection.slice(c, c + ligatureCharacters.length).join('');
			// log('against ' + carrot);
			if (carrot === ligatureCharacters) {
				glyphCollection.splice(c, ligatureCharacters.length, ligatureCharacters);
				// log('!Ligature Found! array['+c+'] is now ' + glyphCollection[c]);
			}
		}
	}

	// log('findAndMergeLigatures', 'end');
	return glyphCollection;
}
