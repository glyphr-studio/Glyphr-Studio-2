import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { charToHex, parseCharsInputAsHex } from '../common/character_ids.js';
import { Maxes } from '../project_data/maxes.js';
import { TextBlockOptions } from './text_block_options.js';

/**
	Text Block
	Drawing multiple lines of text.
	Given a string of text and other
	display metrics, this calculates
	how to display words on each line
	of the given page (canvas) area.
**/

export class TextBlock {
	constructor(oa = {}) {
		// log('TextBlock', 'start');

		// Internal properties
		this.textBlocks = [];
		this.lineBreakers = oa.lineBreakers || ['\u0020', '\u2002', '\u2003'];
		this.data = [];
		this.pixelHeight = 0;
		this.canvasMaxes = oa.canvasMaxes;

		// External properties
		this.options = new TextBlockOptions(oa.options);

		// Drawing functions
		this.drawPageExtras = oa.drawPageExtras || false;
		this.drawLineExtras = oa.drawLineExtras || false;
		this.drawCharacterExtras = oa.drawCharacterExtras || false;
		this.drawCharacter = oa.drawCharacter || false;
		this.roundUp = oa.roundUp || false;

		// log(this);
		// Initialize data
		this.generateData();

		// log('TextBlock', 'end');
	}

	// --------------------------------------------------------------
	// Getters / Setters
	// --------------------------------------------------------------

	get canvasMaxes() {
		return this._canvasMaxes;
	}

	set canvasMaxes(newMaxes = {}) {
		this._canvasMaxes = new Maxes({
			xMin: newMaxes.xMin || 0,
			xMax: newMaxes.xMax || Infinity,
			yMin: newMaxes.yMin || 0,
			yMax: newMaxes.yMax || Infinity,
		});
		// log(`SET canvasMaxes\n ${this.canvasMaxes.print()}`);
	}

	draw({
		showPageExtras = false,
		showLineExtras = false,
		showCharacterExtras = false,
		showCharacter = false,
	} = {}) {
		// log(`TextBlock.draw`, 'start');
		// log(`showPageExtras: ${showPageExtras}`);
		// log(`showLineExtras: ${showLineExtras}`);
		// log(`showCharacterExtras: ${showCharacterExtras}`);
		// log(`showCharacter: ${showCharacter}`);

		if (this.drawPageExtras && showPageExtras) {
			// log(`DRAW PAGE EXTRAS`);
			this.drawPageExtras();
		}

		if (this.options.text === '') {
			// log(`No character string, early return`);
			// log(`TextBlock.draw`, 'end');
			return;
		}

		let currentLine = -1;
		if (this.drawLineExtras && showLineExtras) {
			// log('DRAW LINE EXTRAS');
			this.iterator((charData) => {
				if (charData.lineNumber !== currentLine) {
					this.drawLineExtras(charData, this);
					currentLine = charData.lineNumber;
				}
			});
		}

		if (this.drawCharacterExtras && showCharacterExtras) {
			// log('DRAW CHARACTER EXTRAS');
			this.iterator((charData) => {
				this.drawCharacterExtras(charData, this.roundUp);
			});
		}

		if (this.drawCharacter && showCharacter) {
			// log('DRAW CHARACTER');
			this.iterator((charData) => {
				this.drawCharacter(charData);
			});
		}
		// log(`TextBlock.draw`, 'end');
	}

	iterator(drawFunction) {
		for (let block = 0; block < this.data.length; block++) {
			for (let char = 0; char < this.data[block].length; char++) {
				drawFunction(this.data[block][char], this);
			}
		}
	}

	drawCanvasMaxes(ctx) {
		// log(`TextBlock.drawCanvasMaxes`, 'start');
		// log(this.canvasMaxes);
		ctx.fillStyle = 'transparent';
		ctx.strokeStyle = 'lime';
		ctx.lineWidth = 1;
		ctx.strokeRect(
			this.canvasMaxes.xMin,
			this.canvasMaxes.yMin,
			this.canvasMaxes.width,
			this.canvasMaxes.height
		);
		// log(`TextBlock.drawCanvasMaxes`, 'end');
	}

	/**
	 * This is the large / expensive function that goes through
	 * the options.text char by char and calculates all the data
	 * it needs to display lines of words within a fixed area.
	 * @returns nothing
	 */
	generateData() {
		// log('TextBlock.generateData', 'start');
		const project = getCurrentProject();

		/*
		 *
		 *
		 *	----------------------------------------
		 *	Initial loop to calculate widths.
		 *		All the char data calculated here will
		 *		be in Em units, except the final view
		 *		which will calculate the size and
		 *		position relative to the canvasMaxes
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
		let thisItem;

		this.data = [];
		this.textBlocks = this.options.text.split('\n');

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
					thisItem = project.ligatures[currentChar];
					currentChar = thisItem.chars;
				} else {
					thisItem = project.getItem(`glyph-${charToHex(currentChar)}`);
				}

				// Calculate width
				thisWidth = thisItem ? thisItem.advanceWidth : project.defaultAdvanceWidth;

				// Kern distance
				thisKern = calculateKernOffset(currentChar, currentBlock[charNumber + 1]);
				aggregateWidth += thisWidth + thisKern;

				// Each char gets this data to draw it
				this.data[textBlockNumber][charNumber] = {
					char: currentChar,
					item: thisItem,
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
		let currentBaselineY = 0;
		let checkForBreak = false;

		const scale = this.options.fontSize / project.totalVertical;
		// log(`scale: ${scale}`);

		const ascent = project.settings.font.ascent;
		// log(`ascent: ${ascent}`);

		//Convert area properties to project / UPM scales
		const upmMaxes = {
			lineHeight: project.totalVertical + this.options.lineGap / scale,
			width: this.canvasMaxes.width / scale,
			yMax: this.canvasMaxes.yMax / scale,
			yMin: this.canvasMaxes.yMin / scale,
			xMin: this.canvasMaxes.xMin / scale,
		};

		if (this.options.pageHeight === 'auto') upmMaxes.yMax = Number.Infinity;

		// log(`upmMaxes`);
		// log(upmMaxes);

		// log('========================== LOOP 2: CALCULATING DATA PER CHAR');
		currentX = upmMaxes.xMin;
		currentBaselineY = upmMaxes.yMin + ascent;
		for (textBlockNumber = 0; textBlockNumber < this.data.length; textBlockNumber++) {
			currentBlock = this.data[textBlockNumber];
			// log(`================ START textBlockNumber: ${textBlockNumber}`);

			for (charNumber = 0; charNumber < currentBlock.length; charNumber++) {
				charData = currentBlock[charNumber];
				// log(`charNumber: ${charNumber} - |${charData.char}|`);
				// log(charData);

				if (charData.view === false) {
					// position for this charData hasn't been calculated
					if (checkForBreak && Number.isFinite(upmMaxes.width)) {
						nextLineBreak = getNextLineBreaker(currentBlock, charNumber);
						wordAggregate =
							nextLineBreak.widths.aggregate +
							nextLineBreak.widths.advance -
							charData.widths.aggregate;

						// log(`Checking for word length and right side of area`);
						// log(`currentX: ${currentX}`);
						// log(`wordAggregate: ${wordAggregate}`);
						// log(`... is it larger than ...`);
						// log(`upmMaxes.width: ${upmMaxes.width}`);

						if (currentX + wordAggregate > upmMaxes.width) {
							// word takes up too much horizontal space
							// increment the line, and do a vertical space check
							// log(`word does not fit on the current line...`);

							currentLine++;

							// log(`Checking for next line height against height of area`);
							// log(`currentBaselineY: ${currentBaselineY}`);
							// log(`upmMaxes.lineHeight: ${upmMaxes.lineHeight}`);
							// log(`... is larger than...`);
							// log(`upmMaxes.yMax: ${upmMaxes.yMax}`);

							if (currentBaselineY + upmMaxes.lineHeight > upmMaxes.yMax) {
								// text takes up too much vertical space
								// returning early will leave non-computed chars.isVisible = false
								// log('Vertical Max Reached');
								// log('TextBlock.generateData', 'end');
								return;
							} else {
								// more vertical space exists for the next line
								// log(`more vertical space for next line`);
								currentX = upmMaxes.xMin;
								// currentX = 0;
								currentBaselineY = upmMaxes.yMin + ascent + currentLine * upmMaxes.lineHeight;
								// log(`currentBaselineY: ${currentBaselineY}`);
							}
						}

						checkForBreak = false;
					}

					charData.isVisible = true;
					charData.lineNumber = currentLine;
					charData.view = {
						dx: currentX * scale,
						dy: currentBaselineY * scale,
						dz: scale,
					};
					currentX += charData.widths.advance + charData.widths.kern;
				}

				if (charData.isLineBreaker) checkForBreak = true;
			}

			// End of one block
			currentLine++;

			// log(`== Checking at end of block to see if there is room for the next line`);

			// log(`currentBaselineY: ${currentBaselineY}`);
			// log(`upmMaxes.lineHeight: ${upmMaxes.lineHeight}`);
			// log(`upmMaxes.yMax: ${upmMaxes.yMax}`);

			if (currentBaselineY + upmMaxes.lineHeight > upmMaxes.yMax) {
				// text takes up too much vertical space
				// returning early will leave non-computed chars.isVisible = false
				// log(`Vertical Max Reached @ End Of Block ${textBlockNumber}`);
				// log('TextBlock.generateData', 'end');
				return;
			}

			currentX = upmMaxes.xMin;
			// currentX = 0;
			currentBaselineY = upmMaxes.yMin + ascent + currentLine * upmMaxes.lineHeight;
			this.pixelHeight = currentLine * upmMaxes.lineHeight * scale;
			// log(`================ END textBlockNumber: ${textBlockNumber}`);
		}

		// log('after view calc this.data');
		// log(this.data);
		// log('TextBlock.generateData', 'end');
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
 * @param {String} c1 - first character to check
 * @param {String} c2 - second character to check
 * @returns {Number} - Kern value in Em units
 */
export function calculateKernOffset(c1, c2) {
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
						// log('calculateKernOffset', 'end');
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
export function findAndMergeLigatures(glyphCollection) {
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
