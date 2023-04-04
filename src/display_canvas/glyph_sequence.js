import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { charToHex, charsToHexArray, hexesToChars, parseCharsInputAsHex } from '../common/character_ids';
import { Maxes } from '../project_data/maxes.js';

/**
	Glyph Sequence
	Drawing multiple lines of text.
	Given a string of text and other
	display metrics, this calculates
	how to display words on each line
	of the given page (canvas) area.
**/

export class GlyphSequence {
	constructor(oa = {}) {
		// log('GlyphSequence', 'start');

		// Internal properties
		this.textBlocks = [];
		this.lineBreakers = oa.lineBreakers || ['\u0020', '\u2002', '\u2003'];
		this.data = [];

		// External properties
		this.fontSize = oa.fontSize;
		this.lineGap = oa.lineGap;
		this.glyphString = oa.glyphString;
		this.areaMaxes = oa.areaMaxes;

		// log(this);
		// Initialize data
		this.generateData();

		// log('GlyphSequence', 'end');
	}

	// --------------------------------------------------------------
	// Getters / Setters
	// --------------------------------------------------------------

	get areaMaxes() {
		return this._areaMaxes;
	}

	set areaMaxes(newMaxes = {}) {
		this._areaMaxes = new Maxes({
			xMin: newMaxes.xMin || 0,
			xMax: newMaxes.xMax || Infinity,
			yMin: newMaxes.yMin || 0,
			yMax: newMaxes.yMax || Infinity,
		});
		// log(`SET areaMaxes\n ${this.areaMaxes.print()}`);
	}

	get fontSize() {
		return this._fontSize;
	}

	set fontSize(newSize = false) {
		if (Number.isFinite(newSize)) this._fontSize = newSize;
		else this._fontSize = 48;
	}

	get lineGap() {
		return this._lineGap;
	}

	set lineGap(newGap = false) {
		if (Number.isFinite(newGap)) this._lineGap = newGap;
		else this._lineGap = 0;
	}

	get glyphString() {
		return this._glyphString;
	}

	set glyphString(newString = false) {
		if (typeof newString === 'string') this._glyphString = newString;
		else this._glyphString = '';

		// log(`this.glyphString ${this.glyphString}`);
	}

	/**
	 * This is the large / expensive function that goes through
	 * the glyphString char by char and calculates all the data
	 * it needs to display lines of words within a fixed area.
	 * @returns nothing
	 */
	generateData() {
		// log('GlyphSequence.generateData', 'start');
		const project = getCurrentProject();

		/*
		 *
		 *
		 *	----------------------------------------
		 *	Initial loop to calculate widths.
		 *		All the char data calculated here will
		 *		be in Em units, except the final view
		 *		which will calculate the size and
		 *		position relative to the areaMaxes
		 *	----------------------------------------
		 *
		 *
		 */

		let currentBlock;
		let currentChar;
		let textBlockNumber;
		let charNumber;
		let aggregateWidth = 0;
		let thisWidth;
		let thisKern;
		let thisGlyph;

		this.data = [];
		this.textBlocks = this.glyphString.split('\n');

		// log('========================== LOOP 1: CALCULATING WIDTHS');
		// log(`this.textBlocks.length: ${this.textBlocks.length}`);

		for (textBlockNumber = 0; textBlockNumber < this.textBlocks.length; textBlockNumber++) {
			// log(`================ START textBlockNumber: ${textBlockNumber}`);

			currentBlock = findAndMergeLigatures(this.textBlocks[textBlockNumber].split(''));
			this.data[textBlockNumber] = [];

			for (charNumber = 0; charNumber < currentBlock.length; charNumber++) {
				currentChar = currentBlock[charNumber];
				// log(`==== char: ${charNumber} ${currentChar}`);
				if (currentChar.startsWith('liga-')) {
					thisGlyph = project.ligatures[currentChar];
					currentChar = thisGlyph.chars;
				} else {
					thisGlyph = project.getItem(`glyph-${charToHex(currentChar)}`);
				}

				// Calculate width
				thisWidth = thisGlyph ? thisGlyph.advanceWidth : project.defaultAdvanceWidth;

				// Kern distance
				thisKern = calculateKernOffset(currentChar, currentBlock[charNumber + 1]);
				aggregateWidth += thisWidth + thisKern;

				// Each char gets this data to draw it
				this.data[textBlockNumber][charNumber] = {
					char: currentChar,
					glyph: thisGlyph,
					view: false,
					widths: {
						advance: thisWidth,
						kern: thisKern,
						aggregate: aggregateWidth,
					},
					isLineBreaker: this.lineBreakers.indexOf(currentChar) > -1,
					isVisible: false,
					lineNumber: false,
				};
			}
			// log(`================ END textBlockNumber ${textBlockNumber}`);
		}

		/*
		 *
		 *
		 *	----------------------------------------
		 *	Second loop to calculate line breaks
		 *	within each block, and final positions
		 *	----------------------------------------
		 *
		 *
		 */
		let charData;
		let nextLineBreak;
		let wordAggregate;
		let currentLine = 0;
		let currentX = 0;
		let currentY = 0;
		let checkForBreak = false;

		const scale = this.fontSize / project.totalVertical;
		// log(`scale: ${scale}`);

		const ascent = project.settings.font.ascent;
		// log(`ascent: ${ascent}`);

		//Convert area properties to project / UPM scales
		const singleLineHeight = project.totalVertical + this.lineGap / scale;
		// log(`singleLineHeight: ${singleLineHeight}`);

		const scaleAreaWidth = this.areaMaxes.width / scale;
		// log(`scaleAreaWidth: ${scaleAreaWidth}`);

		const scaleAreaYMax = this.areaMaxes.yMax / scale;

		// log('========================== LOOP 2: CALCULATING DATA PER CHAR');
		for (textBlockNumber = 0; textBlockNumber < this.data.length; textBlockNumber++) {
			currentBlock = this.data[textBlockNumber];
			// log(`================ START textBlockNumber: ${textBlockNumber}`);

			for (charNumber = 0; charNumber < currentBlock.length; charNumber++) {
				charData = currentBlock[charNumber];
				// log(`charNumber: ${charNumber} - |${charData.char}|`);
				// log(charData);

				if (charData.view === false) {
					// position for this charData hasn't been calculated
					if (checkForBreak && Number.isFinite(scaleAreaWidth)) {
						nextLineBreak = getNextLineBreaker(currentBlock, charNumber);
						wordAggregate =
							nextLineBreak.widths.aggregate +
							nextLineBreak.widths.advance -
							charData.widths.aggregate;

						// log(`Checking for word length and right side of area`);
						// log(`currentX: ${currentX}`);
						// log(`wordAggregate: ${wordAggregate}`);
						// log(`... is it larger than ...`);
						// log(`scaleAreaWidth: ${scaleAreaWidth}`);

						if (currentX + wordAggregate > scaleAreaWidth) {
							// word takes up too much horizontal space
							// increment the line, and do a vertical space check
							// log(`word does not fit on the current line...`);

							currentLine++;

							// log(`Checking for next line height against height of area`);
							// log(`currentY: ${currentY}`);
							// log(`singleLineHeight: ${singleLineHeight}`);
							// log(`... is larger than...`);
							// log(`scaleAreaYMax: ${scaleAreaYMax}`);

							if (currentY + singleLineHeight > scaleAreaYMax) {
								// text takes up too much vertical space
								// returning early will leave non-computed chars.isVisible = false
								// log('Vertical Max Reached');
								// log('GlyphSequence.generateData', 'end');
								return;
							} else {
								// more vertical space exists for the next line
								// log(`more vertical space for next line`);
								currentX = 0;
								currentY = currentLine * singleLineHeight;
								// log(`currentY: ${currentY}`);
							}
						}

						checkForBreak = false;
					}

					charData.isVisible = true;
					charData.lineNumber = currentLine;
					charData.view = {
						dx: currentX * scale,
						dy: (currentY + ascent) * scale,
						dz: scale,
					};
					currentX += charData.widths.advance + charData.widths.kern;
				}

				if (charData.isLineBreaker) checkForBreak = true;
			}

			// End of one block
			currentLine++;

			// log(`== Checking at end of block to see if there is room for the next line`);

			// log(`currentY: ${currentY}`);
			// log(`singleLineHeight: ${singleLineHeight}`);
			// log(`scaleAreaYMax: ${scaleAreaYMax}`);

			if (currentY + singleLineHeight > scaleAreaYMax) {
				// text takes up too much vertical space
				// returning early will leave non-computed chars.isVisible = false
				// log(`Vertical Max Reached @ End Of Block ${textBlockNumber}`);
				// log('GlyphSequence.generateData', 'end');
				return;
			}

			currentX = 0;
			currentY = currentLine * singleLineHeight;
			// log(`================ END textBlockNumber: ${textBlockNumber}`);
		}

		// log('after view calc this.data');
		// log(this.data);
		// log('GlyphSequence.generateData', 'end');
	}
}

/**
 * Looks ahead through a block to return the next line break character
 * @param {Array} block - collection of chars to check
 * @param {Number} start - what index to start at
 * @returns - line break charData
 */
function getNextLineBreaker(block, start) {
	// log('getNextLineBreaker', 'start');
	// log(`starting at pos ${start}`);

	for (let i = start; i < block.length; i++) {
		if (block[i].isLineBreaker) {
			// log(`found ${i} returning |${block[i].char}| value ${block[i].widths.aggregate}`);
			// log('getNextLineBreaker', 'end');
			return block[i];
		}
	}

	const lastData = block[block.length - 1];
	// log(`NOTHING found, returning ${lastData.char} value ${lastData.widths.aggregate}`);
	// log('getNextLineBreaker', 'end');
	return lastData;
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

	c1 = parseCharsInputAsHex(c1).join('');
	c2 = parseCharsInputAsHex(c2).join('');
	// log('converted: ' + c1 + ' and ' + c2);

	let kernPairs = getCurrentProject().kerning;
	let leftGroupChar;
	let rightGroupChar;
	let result;

	for (let p of Object.keys(kernPairs)) {
		for (let l = 0; l < kernPairs[p].leftGroup.length; l++) {
			leftGroupChar = kernPairs[p].leftGroup[l];
			// log('checking leftGroup ' + leftGroupChar + ' against ' + c1);
			if (parseCharsInputAsHex(leftGroupChar)[0] === c1) {
				// log('LEFT GROUP MATCH! for ' + c1);
				for (let r = 0; r < kernPairs[p].rightGroup.length; r++) {
					rightGroupChar = kernPairs[p].rightGroup[r];
					if (parseCharsInputAsHex(rightGroupChar)[0] === c2) {
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
	const editor = getCurrentProjectEditor();
	const ligatures = editor.project.sortedLigatures;
	// log('sorted ligatures: ');
	// log(ligatures);

	let ligatureCharacters, carrot;
	for (let c = 0; c < glyphCollection.length; c++) {
		// for(let g=ligatures.length-1; g>-1; g--){
		for (let g = 0; g < ligatures.length; g++) {
			ligatureCharacters = ligatures[g].chars;
			// log('checking ' + ligatureCharacters);
			carrot = glyphCollection.slice(c, c + ligatureCharacters.length).join('');
			// log('against ' + carrot);
			if (carrot === ligatureCharacters) {
				glyphCollection.splice(c, ligatureCharacters.length, ligatures[g].id);
				// log('!Ligature Found! array['+c+'] is now ' + glyphCollection[c]);
			}
		}
	}

	// log(glyphCollection);
	// log('findAndMergeLigatures', 'end');
	return glyphCollection;
}
