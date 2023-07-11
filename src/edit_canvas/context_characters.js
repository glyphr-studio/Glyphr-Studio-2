import { getCurrentProject, getCurrentProjectEditor } from '../app/main';
import { charToHex, charsToHexArray } from '../common/character_ids';
import {
	accentColors,
	getColorFromRGBA,
	shiftColor,
	transparencyToAlpha,
	uiColors,
} from '../common/colors';
import { json, makeCrisp, round } from '../common/functions';
import {
	TextBlock,
	calculateKernOffset,
	findAndMergeLigatures,
} from '../display_canvas/text_block';
import { drawGlyph } from '../display_canvas/draw_paths';
import { Maxes } from '../project_data/maxes';
import { setCursor } from './cursors';
import { cXsX, drawEmVerticalLine, sXcX, sYcY } from './edit_canvas';

const contextCharacters = {
	ctx: false,
	chars: '',
	currentGlyphChar: '',
	canvasHotspots: [],
	leftBlock: false,
	rightBlock: false,
	labelColors: {
		link: 'rgb(214, 71, 0)',
		selected: 'rgb(128, 43, 0)',
	},
};

/**
 * Draw the selected item's context characters
 * @param {Object} ctx - Reference to the edit canvas
 */
export function drawContextCharacters(ctx) {
	// log('drawContextCharacters', 'start');
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	const ascent = project.settings.font.ascent;
	contextCharacters.ctx = ctx;
	contextCharacters.currentGlyphChar = editor.selectedItem.char;
	contextCharacters.chars = editor.selectedItem.contextCharacters;
	const view = editor.view;
	const split = splitContextCharacterString(contextCharacters.currentGlyphChar);

	// log(`split.left: ${split.left}`);
	// log(`split.right: ${split.right}`);

	// log(`view: ${json(view, true)}`);

	clearCanvasHotspots(ctx);

	// Draw left block
	if (split.left) {
		let leftDistance = getItemStringAdvanceWidth(split.left);
		// log(`leftDistance: ${leftDistance}`);

		leftDistance += calculateKernOffset(
			split.left.charAt(split.left.length - 1),
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
			characterString: split.left,
			fontSize: view.dz * project.totalVertical,
			canvasMaxes: leftMaxes,
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

		// contextCharacters.leftBlock.drawCanvasMaxes(contextCharacters.ctx);
	}

	// Draw right block
	if (split.right) {
		let rightDistance = editor.selectedItem.advanceWidth;
		rightDistance += calculateKernOffset(contextCharacters.currentGlyphChar, split.right.charAt(0));
		// log(`rightDistance: ${rightDistance}`);

		let rightMaxes = new Maxes({
			xMin: view.dx + rightDistance * view.dz,
			xMax: Number.MAX_SAFE_INTEGER,
			yMin: view.dy - ascent * view.dz,
			yMax: view.dy,
		});
		// log(`Right canvas Maxes`);
		// log(rightMaxes.print());

		// if (!contextCharacters.rightBlock) {
		contextCharacters.rightBlock = new TextBlock({
			characterString: split.right,
			fontSize: view.dz * project.totalVertical,
			canvasMaxes: rightMaxes,
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

		// contextCharacters.rightBlock.drawCanvasMaxes(contextCharacters.ctx);
	}

	// Draw label for selected item
	if (project.settings.app.contextCharacters.showGuides) {
		const item = editor.selectedItem;
		const alpha = transparencyToAlpha(project.settings.app.contextCharacters.guidesTransparency);
		const textColor = getColorFromRGBA(contextCharacters.labelColors.selected, alpha);
		drawCharacterNameExtra(
			item.name.replace(/latin /i, ''),
			view.dx,
			item.advanceWidth * view.dz,
			textColor,
			false
		);

		const lineColor = getColorFromRGBA(contextCharacters.labelColors.link, alpha);
		contextCharacters.ctx.fillStyle = lineColor;
		drawEmVerticalLine(contextCharacters.ctx, 0, editor.view, false);
		drawEmVerticalLine(contextCharacters.ctx, editor.selectedItem.advanceWidth, editor.view, false);
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
	const result = { left: false, right: false };

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
 * Finds the advance width of a Text Block string
 * @param {Object} textString - Text Block object
 * @returns {Number} width in Em units
 */
export function getItemStringAdvanceWidth(textString) {
	// log(`getItemStringAdvanceWidth`, 'start');
	// log(`textString: ${textString}`);

	let advanceWidth = 0;
	textString = findAndMergeLigatures(textString.split(''));
	// log(textString);
	const project = getCurrentProject();
	let item;
	let itemID;
	textString.forEach(function (v, i, a) {
		itemID = project.getItemID(v);
		// log(`itemID: ${itemID}`);
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
	});

	// log(`returning advanceWidth: ${advanceWidth}`);

	// log(`getItemStringAdvanceWidth`, 'end');
	return advanceWidth;
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the left half
 * @param {Object} char - Individual character from a text block
 * @param {TextBlock} block - text block to draw
 */
function drawContextCharacterLeftLineExtras(char, block) {
	// log(`drawContextCharacterLeftLineExtras`, 'start');
	// log(`char: ${char}`);
	// log(`block: ${block}`);

	const editor = getCurrentProjectEditor();
	// Draw baseline from first char to selected item
	if (editor.project.settings.app.contextCharacters.showGuides) {
		drawBaseline(
			contextCharacters.ctx,
			char.view.dx - 20,
			char.view.dy,
			editor.view.dx - char.view.dx + 20
		);
	}

	// Kern data
	// Draw kern data between rightmost char and the selected item
	let kern = calculateKernOffset(
		block.characterString.charAt(block.characterString.length - 1),
		editor.selectedItem.char
	);

	if (kern) {
		const v = getCurrentProjectEditor().view;
		kern *= -1;
		let rightX = kern;
		rightX = v.dx + rightX * v.dz;

		drawCharacterKernExtra(contextCharacters.ctx, -kern, rightX, v.dz);
	}
	// log(`drawContextCharacterLeftLineExtras`, 'end');
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the right half
 * @param {Object} char - Individual character from a text block
 */
function drawContextCharacterRightLineExtras(char, block) {
	// log(`drawContextCharacterRightLineExtras`, 'start');

	// Draw baseline from the first char to the end of the right-hand group
	// Draw baseline from first char to selected item
	const editor = getCurrentProjectEditor();
	const rightHandAdvanceWidth = getItemStringAdvanceWidth(
		contextCharacters.rightBlock.characterString
	);
	// log(`rightHandAdvanceWidth: ${rightHandAdvanceWidth}`);
	const underlineWidth = rightHandAdvanceWidth * editor.view.dz;
	// log(`underlineWidth: ${underlineWidth}`);

	if (editor.project.settings.app.contextCharacters.showGuides) {
		drawBaseline(contextCharacters.ctx, char.view.dx, char.view.dy, underlineWidth + 20);
	}

	// Kern data
	// Draw kern data between leftmost char and the selected item
	let kern = calculateKernOffset(editor.selectedItem.char, block.characterString.charAt(0));

	if (kern) {
		const v = getCurrentProjectEditor().view;
		// kern *= -1;
		let rightX = kern + editor.selectedItem.advanceWidth;
		rightX = v.dx + rightX * v.dz;

		drawCharacterKernExtra(contextCharacters.ctx, -kern, rightX, v.dz);
	}
	// log(`drawContextCharacterRightLineExtras`, 'end');
}

function drawBaseline(ctx, x, y, width) {
	ctx.fillStyle = accentColors.gray.l90;
	ctx.fillRect(x, Math.ceil(y), width, 1);
}

/**
 * Draws the Guide Lines and Labels ("Extras") for each text block character
 * @param {Object} char - Individual character from a text block
 */
function drawContextCharacterExtras(char, roundUp = 'none') {
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
		drawCharacterNameExtra(name, currentX, advanceWidth, color, linkID);

		// Draw vertical lines
		// log(`drawing vertical line`);
		contextCharacters.ctx.fillStyle = color;
		drawEmVerticalLine(contextCharacters.ctx, cXsX(rightX), editor.view, roundUp);
		drawEmVerticalLine(contextCharacters.ctx, cXsX(currentX), editor.view, roundUp);

		// Draw kern notation
		if (char.widths.kern) {
			// log(`drawing kern data`);
			drawCharacterKernExtra(contextCharacters.ctx, char.widths.kern, rightX, char.view.dz);
		}
	}

	// log('drawContextCharacterExtras', 'end');
}

/**
 * Draws the name label "extra" for this character
 * @param {String} text - Name to draw
 * @param {Number} currentX - x position in canvas units
 * @param {Number} advanceWidth - width of the character in canvas units
 * @param {String} color - what color to draw the name
 * @param {Boolean} registerHotspot - register a hotspot for this name?
 */
function drawCharacterNameExtra(text, currentX, advanceWidth, color, hotspotItemID = false) {
	// log('drawCharacterNameExtra', 'start');
	// log(`text: ${text}`);
	// log(`currentX: ${currentX}`);
	// log(`advanceWidth: ${advanceWidth}`);
	// log(`color: ${color}`);
	// log(`hotspotItemID: ${hotspotItemID}`);

	const ctx = contextCharacters.ctx;
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
	ctx.strokeStyle = uiColors.offWhite;
	ctx.lineWidth = 4;
	ctx.strokeText(text, textX, textY);
	ctx.fillStyle = color;
	ctx.fillText(text, textX, textY);

	// Register hotspot
	if (hotspotItemID) {
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
 * @param {Object} ctx - Canvas context
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
	const textX = rightX - (kern * -1 * scale - textWidth) / 2 - textWidth;

	// ctx.strokeStyle = color;
	// drawVerticalLine(rightX + kern * scale, ctx, color);

	ctx.strokeStyle = uiColors.offWhite;
	ctx.lineWidth = 4;
	ctx.miterLimit = 1;

	// ctx.strokeText(text, textX, (topY + (offset*4)));
	// ctx.fillText(text, textX, (topY + (offset*4)));

	ctx.strokeText(text, textX, topY + offset + barHeight + 15);
	ctx.fillText(text, textX, topY + offset + barHeight + 15);
}

/**
 * Draws a single character to the edit canvas
 * @param {Object} charData - Text Block character
 */
function drawSingleContextCharacter(charData) {
	// log('drawSingleContextCharacter', 'start');
	// log(charData);

	if (charData.isVisible && charData.item) {
		drawGlyph(
			charData.item,
			contextCharacters.ctx,
			charData.view,
			transparencyToAlpha(getCurrentProject().settings.app.contextCharacters.characterTransparency)
		);
	}
	// log('drawSingleContextCharacter', 'end');
}

// -------------------------------
//    CANVAS HOTSPOTS
// -------------------------------

function registerCanvasHotspot(hotspot) {
	// log(`registerCanvasHotspot`, 'start');
	contextCharacters.canvasHotspots.push(hotspot);
	// log(contextCharacters.canvasHotspots);
	// log(`registerCanvasHotspot`, 'end');
}

function clearCanvasHotspots() {
	contextCharacters.canvasHotspots = [];
}

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

export function findAndCallHotspot(cx, cy) {
	contextCharacters.canvasHotspots.forEach((spot) => {
		if (
			cx <= spot.target.xMax &&
			cx >= spot.target.xMin &&
			cy <= spot.target.yMax &&
			cy >= spot.target.yMin
		) {
			spot.onclick();
		}
	});
}

function hotspotNavigateToItem(id) {
	log('hotspotNavigateToItem', 'start');
	log('passed ' + id);

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
	log(`substring from ${p1} to ${p2} yields ${str}`);

	const delta = getItemStringAdvanceWidth(str);

	log(`advance width: ${delta} screen pixels: ${sXcX(delta)}`);
	// v.dx += sXcX(delta);
	const kern = calculateKernOffset(leftCharacter, rightCharacter);
	log(`kern offset ${leftCharacter} and ${rightCharacter} is ${kern}`);

	v.dx += v.dz * delta * flipper;
	v.dx += v.dz * kern * flipper;

	charItem.contextCharacters = contextCharacters.chars;

	editor.view = v;
	if (id.startsWith('liga-')) {
		editor.nav.page = 'Ligatures'
		editor.selectedItemID = id;
	} else {
		editor.nav.page = 'Characters'
		editor.selectedItemID = id;
	}
	editor.nav.navigate();

	log('hotspotNavigateToItem', 'end');
}

export function findAndUnderlineHotspot(cx, cy) {
	// log('findAndUnderlineHotspot', 'start');
	// log(`cx:${cx} \t cy:${cy}`);
	const hs = isHotspotHere(cx, cy);
	const ctx = contextCharacters.ctx;
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

function drawVerticalLine(x, ctx, color) {
	color = color || 'rgb(0,0,0)';

	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	x = makeCrisp(x);
	ctx.beginPath();
	ctx.moveTo(x, 0);
	ctx.lineTo(x, 99999);
	ctx.stroke();
	ctx.closePath();
}
