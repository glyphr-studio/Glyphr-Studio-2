import { getCurrentProject, getCurrentProjectEditor } from '../app/main';
import { charsToHexArray } from '../common/character_ids';
import { accentColors, getColorFromRGBA, transparencyToAlpha } from '../common/colors';
import { makeCrisp } from '../common/functions';
import { drawGlyph } from '../display_canvas/draw_paths';
import {
	TextBlock,
	calculateKernOffset,
	findAndMergeLigatures,
} from '../display_canvas/text_block';
import { Maxes } from '../project_data/maxes';
import { guideColorDark } from '../project_editor/guide';
import { setCursor } from './cursors';
import { cXsX, drawEmVerticalLine, sYcY } from './edit_canvas';

const contextCharacters = {
	chars: '',
	currentGlyphChar: '',
	canvasHotspots: [],
	/** @type {TextBlock | false} */
	leftBlock: false,
	/** @type {TextBlock | false} */
	rightBlock: false,
	labelColors: {
		link: 'rgb(214, 71, 0)',
		selected: 'rgb(128, 43, 0)',
	},
};

/**
 * Draw the selected item's context characters
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawContextCharacters(ctx) {
	// log('drawContextCharacters', 'start');
	const editor = getCurrentProjectEditor();
	if (!shouldDrawContextCharacters()) {
		// log(`0 or 1 context character`);
		// log('drawContextCharacters', 'end');
		return;
	}

	const project = getCurrentProject();
	const ascent = project.settings.font.ascent;
	contextCharacters.currentGlyphChar = editor.selectedItem.char;
	contextCharacters.chars = editor.selectedItem.contextCharacters;
	const view = editor.view;
	const split = splitContextCharacterString(contextCharacters.currentGlyphChar);

	// log(`split.left: ${split.left}`);
	// log(`split.right: ${split.right}`);

	// log(`view: ${json(view, true)}`);

	clearCanvasHotspots();

	// Draw left block
	if (split.left) {
		let leftDistance = getItemStringAdvanceWidth(split.left);
		// log(`leftDistance: ${leftDistance}`);

		leftDistance += calculateKernOffset(
			[...split.left].at(-1),
			contextCharacters.currentGlyphChar
		);
		// log(`leftDistance: ${leftDistance}`);

		let leftMaxes = new Maxes({
			xMin: view.dx - leftDistance * view.dz,
			xMax: view.dx,
			yMin: view.dy - ascent * view.dz,
			yMax: view.dy,
		});
		// log(`Left canvas Maxes`);
		// log(leftMaxes.print());

		// if (!contextCharacters.leftBlock) {
		contextCharacters.leftBlock = new TextBlock({
			options: {
				text: split.left,
				fontSize: view.dz * project.totalVertical,
			},
			canvasMaxes: leftMaxes,
			ctx: ctx,
			rounding: false,
			drawLineExtras: drawContextCharacterLeftLineExtras,
			drawCharacterExtras: drawContextCharacterExtras,
			drawCharacter: drawSingleContextCharacter,
		});
		// log(contextCharacters.leftBlock);
		// }

		contextCharacters.leftBlock.draw({
			showPageExtras: false,
			showLineExtras: true,
			showCharacterExtras: true,
			showCharacter: true,
		});

		// contextCharacters.leftBlock.drawCanvasMaxes(ctx);
	}

	// Draw right block
	if (split.right) {
		let rightDistance = editor.selectedItem.advanceWidth;
		rightDistance += calculateKernOffset(contextCharacters.currentGlyphChar, [...split.right][0]);
		// log(`rightDistance: ${rightDistance}`);

		let rightMaxes = new Maxes({
			xMin: view.dx + rightDistance * view.dz,
			xMax: Infinity,
			yMin: view.dy - ascent * view.dz,
			yMax: view.dy,
		});
		// log(`Right canvas Maxes`);
		// log(rightMaxes.print());

		// if (!contextCharacters.rightBlock) {
		contextCharacters.rightBlock = new TextBlock({
			options: {
				text: split.right,
				fontSize: view.dz * project.totalVertical,
			},
			canvasMaxes: rightMaxes,
			ctx: ctx,
			rounding: true,
			drawLineExtras: drawContextCharacterRightLineExtras,
			drawCharacterExtras: drawContextCharacterExtras,
			drawCharacter: drawSingleContextCharacter,
		});
		// log(contextCharacters.rightBlock);
		// }

		contextCharacters.rightBlock.draw({
			showPageExtras: false,
			showLineExtras: true,
			showCharacterExtras: true,
			showCharacter: true,
		});

		// contextCharacters.rightBlock.drawCanvasMaxes(ctx);
	}

	// Draw label for selected item
	if (project.settings.app.contextCharacters.showGuides) {
		const item = editor.selectedItem;
		const alpha = transparencyToAlpha(project.settings.app.contextCharacters.guidesTransparency);
		const textColor = getColorFromRGBA(contextCharacters.labelColors.selected, alpha);
		drawCharacterNameExtra(
			ctx,
			item.name.replace(/latin /i, ''),
			view.dx,
			item.advanceWidth * view.dz,
			textColor,
			false
		);

		const lineColor = getColorFromRGBA(contextCharacters.labelColors.link, alpha);
		ctx.fillStyle = lineColor;
		drawEmVerticalLine(ctx, 0, editor.view);
		drawEmVerticalLine(ctx, editor.selectedItem.advanceWidth, editor.view);
	}

	// log('drawContextCharacters', 'end');
}

/**
 * Splits the context characters into two arrays for left and right
 * @param {String} splitChar - The character from the current item
 * @returns {Object} - two arrays
 */
function splitContextCharacterString(splitChar) {
	// log(`splitContextCharacterString`, 'start');
	const cChars = contextCharacters.chars;
	// log(`cChars: ${cChars}`);
	// log(`splitChar: ${splitChar}`);
	const result = {};
	/** @type {String | false} */
	result.left = false;
	/** @type {String | false} */
	result.right = false;

	if (cChars) {
		const pos = cChars.indexOf(splitChar);
		// log(`pos: ${pos}`);
		if (pos === -1) {
			result.left = cChars;
			result.right = '';
		} else {
			result.left = cChars.substring(0, pos);
			result.right = cChars.substring(pos + splitChar.length);
		}
	}

	// log(result);
	// log(`splitContextCharacterString`, 'end');
	return result;
}

/**
 * Centralized way to ask if context character stuff should be drawn
 * @returns {Boolean}
 */
export function shouldDrawContextCharacters() {
	const editor = getCurrentProjectEditor();
	const item = editor.selectedItem;
	if (!item) return false;
	if (!item.contextCharacters) return false;
	if (item.contextCharacters === item.char) return false;
	if (!editor.project.settings.app.contextCharacters.showCharacters) return false;
	return true;
}

/**
 * Finds the advance width of a Text Block string
 * @param {Object} textString - Text Block object
 * @returns {Number} width in Em units
 */
export function getItemStringAdvanceWidth(textString) {
	// log(`getItemStringAdvanceWidth`, 'start');
	// log(`textString: ${textString}`);

	let advanceWidth = 0;
	textString = findAndMergeLigatures([...textString]);
	// log(textString);
	const project = getCurrentProject();
	let item;
	let itemID;
	textString.forEach(function (v, i, a) {
		itemID = project.getItemID(v);
		// log(`itemID: ${itemID}`);
		if (itemID) {
			item = project.getItem(itemID);
			// log(item);
			if (item) {
				advanceWidth += item.advanceWidth;
				// log(`just item advanceWidth: ${advanceWidth}`);

				if (a[i + 1]) {
					// log(`Next item found:`);
					// log(a[i + 1]);
					advanceWidth += calculateKernOffset(v, a[i + 1]);
					// log(`+= kern for next advanceWidth: ${advanceWidth}`);
				}
			} else {
				advanceWidth += getCurrentProject().defaultAdvanceWidth;
			}
		}
	});

	// log(`returning advanceWidth: ${advanceWidth}`);

	// log(`getItemStringAdvanceWidth`, 'end');
	return advanceWidth;
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the left half
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} char - Individual character from a text block
 * @param {TextBlock} block - text block to draw
 */
function drawContextCharacterLeftLineExtras(ctx, char, block) {
	// log(`drawContextCharacterLeftLineExtras`, 'start');
	// log(`char: ${char}`);
	// log(`block: ${block}`);

	const editor = getCurrentProjectEditor();
	// Draw baseline from first char to selected item
	if (editor.project.settings.app.contextCharacters.showGuides) {
		drawBaseline(ctx, char.view.dx - 20, char.view.dy, editor.view.dx - char.view.dx + 20);
	}

	// Kern data
	// Draw kern data between rightmost char and the selected item
	let kern = calculateKernOffset(
		[...block.options.text].at(-1),
		editor.selectedItem.char
	);

	if (kern) {
		const v = getCurrentProjectEditor().view;
		let rightX = kern * -1;
		rightX = v.dx + rightX * v.dz;

		drawCharacterKernExtra(ctx, kern, rightX, v.dz);
	}
	// log(`drawContextCharacterLeftLineExtras`, 'end');
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the right half
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} char - Individual character from a text block
 * @param {TextBlock} block
 */
function drawContextCharacterRightLineExtras(ctx, char, block) {
	// log(`drawContextCharacterRightLineExtras`, 'start');

	// Draw baseline from the first char to the end of the right-hand group
	// Draw baseline from first char to selected item
	const editor = getCurrentProjectEditor();
	let rightHandAdvanceWidth = 0;
	if (contextCharacters.rightBlock) {
		rightHandAdvanceWidth = getItemStringAdvanceWidth(contextCharacters.rightBlock.options.text);
	}
	// log(`rightHandAdvanceWidth: ${rightHandAdvanceWidth}`);
	const underlineWidth = rightHandAdvanceWidth * editor.view.dz;
	// log(`underlineWidth: ${underlineWidth}`);

	if (editor.project.settings.app.contextCharacters.showGuides) {
		drawBaseline(ctx, char.view.dx, char.view.dy, underlineWidth + 20);
	}

	// Kern data
	// Draw kern data between leftmost char and the selected item
	let kern = calculateKernOffset(editor.selectedItem.char, [...block.options.text][0]);

	if (kern) {
		const v = getCurrentProjectEditor().view;
		let rightX = editor.selectedItem.advanceWidth;
		rightX = v.dx + rightX * v.dz;

		drawCharacterKernExtra(ctx, kern, rightX, v.dz);
	}
	// log(`drawContextCharacterRightLineExtras`, 'end');
}

/**
 * Draws a baseline at a given location and width
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x - x location
 * @param {Number} y - y location
 * @param {Number} width
 */
function drawBaseline(ctx, x, y, width) {
	// ctx.fillStyle = accentColors.gray.l90;
	const transparency = getCurrentProject().settings.app.contextCharacters.guidesTransparency;
	const alpha = transparencyToAlpha(transparency);
	ctx.fillStyle = getColorFromRGBA(guideColorDark, alpha);
	ctx.fillRect(x, Math.ceil(y), width, 1);
}

/**
 * Draws the Guide Lines and Labels ("Extras") for each text block character
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} char - Individual character from a text block
 */
function drawContextCharacterExtras(ctx, char) {
	// log('drawContextCharacterExtras', 'start');
	// log(char);

	const appSettings = getCurrentProject().settings.app;

	if (appSettings.contextCharacters.showGuides) {
		const alpha = transparencyToAlpha(appSettings.contextCharacters.guidesTransparency);
		const editor = getCurrentProjectEditor();
		const advanceWidth = char.widths.advance * char.view.dz;
		const currentX = char.view.dx; // * view.dz;
		const rightX = currentX + advanceWidth;
		let color = getColorFromRGBA(contextCharacters.labelColors.link, alpha);
		let linkID = char.item.id;
		if (editor.selectedItemID === char.item.id) {
			color = getColorFromRGBA(contextCharacters.labelColors.selected, alpha);
			linkID = false;
		}

		// Draw the glyph name
		// log(`drawing name`);
		let name;
		if (char.item) name = char.item.name;
		else name = editor.project.getItemName(`glyph-${charsToHexArray(char.char)}`, true);
		name = name.replace(/latin /i, '');
		// log(`name: ${name}`);
		drawCharacterNameExtra(ctx, name, currentX, advanceWidth, color, linkID);

		// Draw vertical lines
		// log(`drawing vertical line`);
		ctx.fillStyle = color;
		drawEmVerticalLine(ctx, cXsX(rightX), editor.view);
		drawEmVerticalLine(ctx, cXsX(currentX), editor.view);

		// Draw kern notation
		if (char.widths.kern) {
			// log(`drawing kern data`);
			drawCharacterKernExtra(ctx, char.widths.kern, rightX, char.view.dz);
		}
	}

	// log('drawContextCharacterExtras', 'end');
}

/**
 * Draws the name label "extra" for this character
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} text - Name to draw
 * @param {Number} currentX - x position in canvas units
 * @param {Number} advanceWidth - width of the character in canvas units
 * @param {String} color - what color to draw the name
 * @param {Boolean} hotspotItemID - register a hotspot for this name?
 */
function drawCharacterNameExtra(ctx, text, currentX, advanceWidth, color, hotspotItemID) {
	// log('drawCharacterNameExtra', 'start');
	// log(`text: ${text}`);
	// log(`currentX: ${currentX}`);
	// log(`advanceWidth: ${advanceWidth}`);
	// log(`color: ${color}`);
	// log(`hotspotItemID: ${hotspotItemID}`);

	const textWidth = ctx.measureText(text).width;
	const topY = sYcY(getCurrentProject().settings.font.descent - 60);
	const textX = currentX + (advanceWidth - textWidth) / 2; // center the glyph name
	const textY = topY + 22;
	// log(`topY: ${topY}`);
	// log(`textX: ${textX}`);
	// log(`textY: ${textY}`);
	// log(`textWidth: ${textWidth}`);

	// Item label
	ctx.font = '12px Tahoma, Verdana, sans-serif';
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 4;
	ctx.strokeText(text, textX, textY);
	ctx.fillStyle = color;
	ctx.fillText(text, textX, textY);

	// Register hotspot
	if (typeof hotspotItemID === 'string') {
		registerCanvasHotspot({
			target: {
				xMin: currentX,
				xMax: currentX + advanceWidth,
				yMin: textY - 20,
				yMax: textY + 20,
			},
			underline: {
				xMin: textX - 1,
				xMax: textX + textWidth + 1,
				y: textY + 6,
			},
			onclick: function () {
				hotspotNavigateToItem(hotspotItemID);
			},
		});
	}
	// log('drawCharacterNameExtra', 'end');
}

/**
 * Draws the kern label "extra" for this character
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} kern - Kern value
 * @param {Number} rightX - x position in canvas units
 * @param {Number} scale - view.dz
 */
export function drawCharacterKernExtra(ctx, kern, rightX, scale) {
	const topY = sYcY(getCurrentProject().settings.font.descent);
	const color = accentColors.purple.l70;
	const barHeight = Math.max(scale * 10, 1);
	// const offset = barHeight * -1;
	const offset = 0;

	ctx.font = '12px Tahoma, Verdana, sans-serif';
	ctx.fillStyle = color;
	ctx.fillRect(Math.floor(rightX), topY + offset, Math.ceil(kern * scale), barHeight);

	const text = 'kern: ' + kern;
	const textWidth = ctx.measureText(text).width;
	const textX = rightX - (-1 * kern * scale - textWidth) / 2 - textWidth;

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 4;
	ctx.miterLimit = 1;
	let textOffset = 25;
	ctx.strokeText(text, textX, topY + offset + barHeight + textOffset);
	ctx.fillText(text, textX, topY + offset + barHeight + textOffset);
}

/**
 * Draws a single character to the edit canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} charData - Text Block character
 */
function drawSingleContextCharacter(ctx, charData) {
	// log('drawSingleContextCharacter', 'start');
	// log(charData);

	if (charData.isVisible && charData.item) {
		drawGlyph(
			charData.item,
			ctx,
			charData.view,
			transparencyToAlpha(getCurrentProject().settings.app.contextCharacters.characterTransparency)
		);
	}
	// log('drawSingleContextCharacter', 'end');
}

// -------------------------------
//    CANVAS HOTSPOTS
// -------------------------------

/**
 *
 * @param {Object} hotspot - in this format:
 * 		target: {
 *			xMin: Number
 *			xMax: Number
 *			yMin: Number
 *			yMax: Number
 *		},
 *		underline: {
 *			xMin: Number
 *			xMax: Number
 *			y: Number
 *		},
 *		onclick: Function
 */
function registerCanvasHotspot(hotspot) {
	// log(`registerCanvasHotspot`, 'start');
	contextCharacters.canvasHotspots.push(hotspot);
	// log(contextCharacters.canvasHotspots);
	// log(`registerCanvasHotspot`, 'end');
}

/**
 * Clears all hotspots
 */
function clearCanvasHotspots() {
	contextCharacters.canvasHotspots = [];
}

/**
 * Determines if a hotspot is at a location
 * @param {Number} cx - x value
 * @param {Number} cy - y value
 * @returns {Object | false} - returns the hotspot if true
 */
export function isHotspotHere(cx, cy) {
	// log(`isHotspotHere`, 'start');
	// log(`cx: ${cx}`);
	// log(`cy: ${cy}`);

	const spots = contextCharacters.canvasHotspots;
	let spot;

	for (let i = 0; i < spots.length; i++) {
		spot = spots[i];
		// log(`${spot.target.xMin} - ${spot.target.xMax} - ${spot.target.yMin} - ${spot.target.yMax}`);
		// log(`x results ${cx <= spot.target.xMax} - ${cx >= spot.target.xMin}`);
		// log(`y results ${cy <= spot.target.yMax} - ${cy >= spot.target.yMin}`);

		if (
			cx <= spot.target.xMax &&
			cx >= spot.target.xMin &&
			cy <= spot.target.yMax &&
			cy >= spot.target.yMin
		) {
			// log(`Hit!`);
			// log(spot);
			// log(`isHotspotHere`, 'end');
			return spot;
		}
	}

	// log(`None found`);
	// log(`isHotspotHere`, 'end');
	return false;
}

/**
 * If a hotspot is at the clicked location, call the function
 * @param {Number} cx - x value
 * @param {Number} cy - y value
 * @returns {Boolean} - returns true if a hotspot was clicked
 */
export function findAndCallHotspot(cx, cy) {
	contextCharacters.canvasHotspots.forEach((spot) => {
		if (
			cx <= spot.target.xMax &&
			cx >= spot.target.xMin &&
			cy <= spot.target.yMax &&
			cy >= spot.target.yMin
		) {
			spot.onclick();
			return true;
		}
	});

	return false;
}

/**
 * Handle navigating to another item
 * @param {String} id - Item ID
 */
function hotspotNavigateToItem(id) {
	// log('hotspotNavigateToItem', 'start');
	// log('passed ' + id);

	const editor = getCurrentProjectEditor();
	const v = editor.view;
	const currentCharacter = contextCharacters.currentGlyphChar;
	const charItem = editor.project.getItem(id);
	const newCharacter = charItem.char;
	const p1 = contextCharacters.chars.indexOf(currentCharacter);
	const p2 = contextCharacters.chars.indexOf(newCharacter);
	let flipper;
	let leftCharacter;
	let rightCharacter;

	if (p1 < p2) {
		flipper = 1;
		leftCharacter = currentCharacter;
		rightCharacter = newCharacter;
	} else {
		flipper = -1;
		leftCharacter = newCharacter;
		rightCharacter = currentCharacter;
	}

	const str = contextCharacters.chars.substring(p1, p2);
	// log(`substring from ${p1} to ${p2} yields ${str}`);

	const delta = getItemStringAdvanceWidth(str);

	// log(`advance width: ${delta} screen pixels: ${sXcX(delta)}`);
	// v.dx += sXcX(delta);
	const kern = calculateKernOffset(leftCharacter, rightCharacter);
	// log(`kern offset ${leftCharacter} and ${rightCharacter} is ${kern}`);

	v.dx += v.dz * delta * flipper;
	v.dx += v.dz * kern * flipper;

	charItem.contextCharacters = contextCharacters.chars;

	editor.view = v;
	if (id.startsWith('liga-')) {
		editor.nav.page = 'Ligatures';
		editor.selectedItemID = id;
	} else {
		editor.nav.page = 'Characters';
		editor.selectedItemID = id;
	}
	editor.nav.navigate();

	// log('hotspotNavigateToItem', 'end');
}

/**
 *
 * @param {Number} cx - x value
 * @param {Number} cy - y value
 * @returns {Number} - xMin value of the hotspot
 */
export function findAndUnderlineHotspot(cx, cy) {
	// log('findAndUnderlineHotspot', 'start');
	// log(`cx:${cx} \t cy:${cy}`);
	const hs = isHotspotHere(cx, cy);
	const ctx = getCurrentProjectEditor().editCanvas.ctx;
	// log(`${hs}`);
	if (hs) {
		const t = getCurrentProject().settings.app.contextCharacters.guidesTransparency;
		// var t2 = (((100 - t) / 2) + t);
		const alpha = transparencyToAlpha(t);
		const rgb = getColorFromRGBA('rgb(204,81,0)', alpha);

		ctx.strokeStyle = rgb;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(hs.underline.xMin, makeCrisp(hs.underline.y));
		ctx.lineTo(hs.underline.xMax, makeCrisp(hs.underline.y));
		ctx.stroke();
		setCursor('arrow');
	}

	// log('findAndUnderlineHotspot', 'end');
	return hs.target.xMin;
}
