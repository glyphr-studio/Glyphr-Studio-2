import { getCurrentProject, getCurrentProjectEditor } from '../app/main';
import { charToHex, charsToHexArray } from '../common/character_ids';
import { accentColors, getColorFromRGBA, shiftColor, transparencyToAlpha } from '../common/colors';
import { json, makeCrisp, round } from '../common/functions';
import {
	CharacterSequence,
	calculateKernOffset,
	findAndMergeLigatures,
} from '../display_canvas/character_sequence';
import { drawGlyph } from '../display_canvas/draw_paths';
import { Maxes } from '../project_data/maxes';
import { setCursor } from './cursors';
import { sYcY } from './edit_canvas';

const contextCharacters = {
	ctx: false,
	chars: '',
	currentGlyphChar: '',
	canvasHotSpots: [],
	leftSequence: false,
	rightSequence: false,
};

/**
 * Draw the selected item's context characters
 * @param {Object} ctx - Reference to the edit canvas
 */
export function drawContextCharacters(ctx) {
	log('drawContextCharacters', 'start');
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	const ascent = project.settings.font.ascent;
	contextCharacters.ctx = ctx;
	contextCharacters.currentGlyphChar = editor.selectedItem.char;
	contextCharacters.chars = editor.selectedItem.contextCharacters;
	const v = editor.view;
	const split = splitContextCharacterString(contextCharacters.currentGlyphChar);

	log(`split.left: ${split.left}`);
	log(`split.right: ${split.right}`);

	log(`view: ${json(v, true)}`);

	clearCanvasHotspots(ctx);

	if (split.left) {
		let leftDistance = getCharacterSequenceAdvanceWidth(split.left);
		leftDistance += calculateKernOffset(
			split.left.charAt(split.left.length - 1),
			contextCharacters.currentGlyphChar
		);
		log(`leftDistance: ${leftDistance}`);

		let leftMaxes = new Maxes({
			xMin: v.dx - leftDistance * v.dz,
			xMax: v.dx,
			yMin: v.dy - ascent * v.dz,
			yMax: v.dy,
		});
		log(`Left canvas Maxes`);
		log(leftMaxes.print());

		contextCharacters.leftSequence = new CharacterSequence({
			characterString: split.left,
			fontSize: v.dz * project.totalVertical,
			canvasMaxes: leftMaxes,
			drawLineExtras: drawContextCharacterLeftLineExtras,
			drawCharacterExtras: drawContextCharacterExtras,
			drawCharacter: drawSingleContextCharacter,
		});
		log(contextCharacters.leftSequence);
		contextCharacters.leftSequence.draw({
			showPageExtras: false,
			showLineExtras: true,
			showCharacterExtras: true,
			showCharacter: true,
		});

		// contextCharacters.leftSequence.drawCanvasMaxes(contextCharacters.ctx);
	}

	if (split.right) {
		let rightDistance = editor.selectedItem.advanceWidth;
		rightDistance += calculateKernOffset(contextCharacters.currentGlyphChar, split.right.charAt(0));
		log(`rightDistance: ${rightDistance}`);

		let rightMaxes = new Maxes({
			xMin: v.dx + rightDistance * v.dz,
			xMax: Number.MAX_SAFE_INTEGER,
			yMin: v.dy - ascent * v.dz,
			yMax: v.dy,
		});
		log(`Right canvas Maxes`);
		log(rightMaxes.print());

		contextCharacters.rightSequence = new CharacterSequence({
			characterString: split.right,
			fontSize: v.dz * project.totalVertical,
			canvasMaxes: rightMaxes,
			drawLineExtras: drawContextCharacterRightLineExtras,
			drawCharacterExtras: drawContextCharacterExtras,
			drawCharacter: drawSingleContextCharacter,
		});
		log(contextCharacters.rightSequence);
		contextCharacters.rightSequence.draw({
			showPageExtras: false,
			showLineExtras: true,
			showCharacterExtras: true,
			showCharacter: true,
		});

		// contextCharacters.rightSequence.drawCanvasMaxes(contextCharacters.ctx);
	}

	log('drawContextCharacters', 'end');
}

/**
 * Splits the context characters into two arrays for left and right
 * @param {String} splitChar - The character from the current item
 * @returns {Object} - two arrays
 */
function splitContextCharacterString(splitChar) {
	let l = '';
	let r = '';

	const pos = contextCharacters.chars.indexOf(splitChar);

	if (pos === -1) {
		l = contextCharacters.chars;
		r = '';
	} else {
		l = contextCharacters.chars.substring(0, pos);
		r = contextCharacters.chars.substring(pos + splitChar.length);
	}

	return { left: l, right: r };
}

/**
 * Finds the advance width of a Character Sequence string
 * @param {Object} sequence - Character Sequence object
 * @returns {Number} width in Em units
 */
function getCharacterSequenceAdvanceWidth(sequence) {
	let advanceWidth = 0;
	sequence = findAndMergeLigatures(sequence.split(''));
	const project = getCurrentProject();
	let glyph;
	let itemID;
	sequence.forEach(function (v, i, a) {
		itemID = project.getItemID(v);
		glyph = project.getItem(itemID);
		if (glyph) {
			advanceWidth += glyph.advanceWidth;
			if (a[i + 1]) advanceWidth += calculateKernOffset(v, a[i + 1]);
		} else {
			advanceWidth += getCurrentProject().defaultAdvanceWidth;
		}
	});

	return advanceWidth;
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the left half
 * @param {Object} ctx - Edit canvas context
 * @param {Object} char - Individual character from a sequence
 * @param {CharacterSequence} seq - sequence to draw
 */
function drawContextCharacterLeftLineExtras(char, seq) {
	log(`drawContextCharacterLeftLineExtras`, 'start');
	log(`char: ${char}`);
	log(`seq: ${seq}`);

	const selectedItem = getCurrentProjectEditor().selectedItem;
	const alpha = transparencyToAlpha(getCurrentProject().settings.app.guides.system.transparency);
	const color = getColorFromRGBA('rgb(204,81,0)', alpha);
	drawVerticalLine(char.view.dx * char.view.dz, contextCharacters.ctx, color);

	let kern = calculateKernOffset(
		seq.characterString.charAt(seq.characterString.length - 1),
		selectedItem.char
	);

	if (kern) {
		const v = getCurrentProjectEditor().view;
		kern *= -1;
		let rightX = kern;
		rightX = v.dx + rightX * v.dz;
		const textY = sYcY(getCurrentProject().settings.font.descent - 60);

		drawCharacterKernExtra(contextCharacters.ctx, -kern, rightX, textY, v.dz);
	}
	log(`drawContextCharacterLeftLineExtras`, 'end');
}

/**
 * Draws the Guide Lines and Labels ("Extras") for the right half
 * @param {Object} ctx - Edit canvas context
 * @param {Object} char - Individual character from a sequence
 */
function drawContextCharacterRightLineExtras(char) {
	const selectedItem = getCurrentProjectEditor().selectedItem;
	const kern = calculateKernOffset(selectedItem.char, char.char);

	if (kern) {
		const v = getCurrentProjectEditor().view;
		let rightX = selectedItem.advanceWidth;
		rightX = v.dx + rightX * v.dz;
		const textY = sYcY(getCurrentProject().settings.font.descent - 60);

		drawCharacterKernExtra(contextCharacters.ctx, kern, rightX, textY, v.dz);
	}
}
/**
 * Draws the Guide Lines and Labels ("Extras") for the center character
 * @param {Object} ctx - Edit canvas context
 * @param {Object} char - Individual character from a sequence
 */
function drawContextCharacterExtras(char) {
	// log('drawContextCharacterExtras', 'start');

	// log(`${char.char}
	//  width \t ${char.width}
	//  aggregate \t ${char.aggregate}
	//  isLineBreaker \t ${char.isLineBreaker}
	//  view \t ${json(char.view, true)}
	//  line \t ${char.lineNumber}
	// \n`);
	// log(char.glyph);

	const ps = getCurrentProject().settings.app;
	const alpha = transparencyToAlpha(ps.guides.system.transparency);

	if (ps.contextCharacters.showGuides && alpha) {
		const editor = getCurrentProjectEditor();
		const view = editor.view;
		const advanceWidth = char.width * view.dz;
		const currentX = char.view.dx * view.dz;
		const rightX = currentX + advanceWidth;
		const color = getColorFromRGBA('rgb(204,81,0)', alpha);
		const textY = sYcY(getCurrentProject().settings.font.descent - 60);

		// Draw the glyph name
		let name = char.glyph ? char.glyph.name : editor.getItemName(charsToHexArray(char.char));
		name = name.replace(/latin /i, '');
		drawCharacterNameExtra(name, currentX, textY, advanceWidth, color, char.char);

		// Draw vertical lines
		drawVerticalLine(rightX, contextCharacters.ctx, color);

		// Draw kern notation
		if (char.kern) drawCharacterKernExtra(contextCharacters.ctx, char.kern, rightX, textY, view.dz);
	}

	// log('drawContextCharacterExtras', 'end');
}

/**
 * Draws the name label "extra" for this character
 * @param {Object} ctx - Canvas context
 * @param {String} text - Name to draw
 * @param {Number} currentX - x position in canvas units
 * @param {Number} topY - y position in canvas units
 * @param {Number} advanceWidth - width of the character in canvas units
 * @param {String} color - what color to draw the name
 * @param {Boolean} registerHotspot - register a hotspot for this name?
 */
function drawCharacterNameExtra(text, currentX, topY, advanceWidth, color, registerHotspot) {
	// log('drawCharacterNameExtra', 'start');
	// log(`${text} passed registerHotspot ${registerHotspot}`);
	const ctx = contextCharacters.ctx;
	const textWidth = ctx.measureText(text).width;
	const textX = currentX + (advanceWidth - textWidth) / 2; // center the glyph name
	const textY = topY + 22;

	ctx.font = '12px Tahoma, Verdana, sans-serif';

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 10;
	ctx.strokeText(text, textX, textY);

	ctx.fillStyle = color;
	ctx.fillText(text, textX, textY);

	// Register hotspot
	if (registerHotspot) {
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
				hotspotNavigateToItem(charToHex(registerHotspot));
			},
		});
	}
}

/**
 * Draws the kern label "extra" for this character
 * @param {Object} ctx - Canvas context
 * @param {Number} kern - Kern value
 * @param {Number} rightX - x position in canvas units
 * @param {Number} topY - y position in canvas units
 * @param {Number} scale - view.dz
 */
export function drawCharacterKernExtra(ctx, kern, rightX, topY, scale) {
	// const color = getColorFromRGBA(
	// 	'rgb(255,0,255)',
	// 	transparencyToAlpha(getCurrentProject().settings.app.guides.system.transparency)
	// );
	const color = accentColors.purple.l70;
	const barHeight = Math.max(scale * 10, 1);
	const offset = barHeight * -1;

	ctx.font = '12px Tahoma, Verdana, sans-serif';
	ctx.fillStyle = color;
	ctx.fillRect(Math.floor(rightX), topY + offset, Math.ceil(kern * scale), barHeight);

	const text = 'kern: ' + kern;
	const textWidth = ctx.measureText(text).width;
	const textX = rightX - (kern * -1 * scale - textWidth) / 2 - textWidth;

	// ctx.strokeStyle = color;
	// drawVerticalLine(rightX + kern * scale, ctx, color);

	// ctx.strokeStyle = 'white';
	// ctx.lineWidth = 10;
	// ctx.miterLimit = 1;

	// ctx.strokeText(text, textX, (topY + (offset*4)));
	// ctx.fillText(text, textX, (topY + (offset*4)));

	// ctx.strokeText(text, textX, topY + offset + barHeight + 22);
	ctx.fillText(text, textX, topY + offset + barHeight + 22);
}

/**
 * Draws a single character to the edit canvas
 * @param {Object} charData - Character Sequence character
 */
function drawSingleContextCharacter(charData) {
	log('drawSingleContextCharacter', 'start');
	log(charData);

	if (charData.isVisible && charData.glyph) {
		drawGlyph(
			charData.glyph,
			contextCharacters.ctx,
			charData.view,
			transparencyToAlpha(getCurrentProject().settings.app.contextGlyphTransparency)
		);
	}
	log('drawSingleContextCharacter', 'end');
}

// -------------------------------
//    CANVAS HOTSPOTS
// -------------------------------

function registerCanvasHotspot(hotspot) {
	contextCharacters.canvasHotSpots.push(hotspot);
}

function clearCanvasHotspots() {
	contextCharacters.canvasHotSpots = [];
}

export function isHotspotHere(cx, cy) {
	const chs = contextCharacters.canvasHotSpots;
	let v;

	for (let i = 0; i < chs.length; i++) {
		v = chs[i];
		// log(`isHotspotHere - checking ${v.target.xMin} - ${v.target.xMax} - ${v.target.yMin} - ${v.target.yMax}`);
		// log(`results ${(cx <= v.target.xMax)} - ${(cx >= v.target.xMin)} - ${(cy <= v.target.yMax)} - ${(cy >= v.target.yMin)}`);
		if (cx <= v.target.xMax && cx >= v.target.xMin && cy <= v.target.yMax && cy >= v.target.yMin) {
			return v;
		}
	}

	return false;
}

export function findAndCallHotspot(cx, cy) {
	contextCharacters.canvasHotSpots.forEach((v) => {
		if (cx <= v.target.xMax && cx >= v.target.xMin && cy <= v.target.yMax && cy >= v.target.yMin) {
			v.onclick();
		}
	});
}

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

	const delta = getCharacterSequenceAdvanceWidth(str);

	// log(`advance width: ${delta} screen pixels: ${sXcX(delta)}`);
	// v.dx += sXcX(delta);
	const kern = calculateKernOffset(leftCharacter, rightCharacter);
	// log(`kern offset ${leftCharacter} and ${rightCharacter} is ${kern}`);

	v.dx += v.dz * delta * flipper;
	v.dx += v.dz * kern * flipper;

	charItem.contextCharacters = contextCharacters.chars;
	editor.selectedItem = id;
	editor.view = v;

	// log('hotspotNavigateToItem', 'end');
}

export function findAndUnderlineHotspot(cx, cy) {
	// log('findAndUnderlineHotspot', 'start');
	// log(`cx:${cx} \t cy:${cy}`);
	const hs = isHotspotHere(cx, cy);
	const ctx = contextCharacters.ctx;
	// log(`${hs}`);
	if (hs) {
		const t = getCurrentProject().settings.app.guides.system.transparency;
		// var t2 = (((100 - t) / 2) + t);
		const alpha = transparencyToAlpha(t);
		const rgb = getColorFromRGBA('rgb(204,81,0)', alpha);

		ctx.strokeStyle = rgb;
		ctx.beginPath();
		ctx.moveTo(hs.underline.xMin, makeCrisp(hs.underline.y));
		ctx.lineTo(hs.underline.xMax, makeCrisp(hs.underline.y));
		ctx.stroke();
		setCursor('arrow');
	}

	return hs.target.xMin;
	// log('findAndUnderlineHotspot', 'end');
}

// function fitViewToContextCharacters(doNotZoom) {
// 	// log('fitViewToContextCharacters', 'start');
// 	const ps = getCurrentProject().settings.font;
// 	const editor = getCurrentProjectEditor();

// 	// const xPadding = 80;
// 	const yPadding = 80; // Height of the UI across the top
// 	const canvasWidth = window.innerWidth - 470; // 470 is the width of the left panel area
// 	const canvasHeight = window.innerHeight - yPadding;
// 	// log(`CAN \t ${canvasWidth} \t ${canvasHeight}`);

// 	const stringWidth = contextCharacters.advanceWidth;
// 	const stringHeight = ps.ascent - ps.descent;
// 	// log(`STR \t ${stringWidth} \t ${stringHeight}`);

// 	let zw;
// 	let zh;
// 	let nz;

// 	if (doNotZoom) {
// 		nz = editor.view.dz;
// 		// log(`VZ \t ${nz}`);
// 	} else {
// 		zw = round(canvasWidth / (stringWidth * 1.4), 3);
// 		zh = round(canvasHeight / (stringHeight * 1.4), 3);
// 		// log(`NZ \t ${zw} \t ${zh}`);
// 	}

// 	nz = Math.min(zh, zw);
// 	const nx = round((canvasWidth - nz * stringWidth) / 2);
// 	const ny = round((canvasHeight - nz * stringHeight) / 2 + ps.ascent * nz);
// 	// log(`VIEW \t ${nx} \t ${ny} \t ${nz}`);

// 	editor.view = { dx: nx, dy: ny, dz: nz };
// }

// -------------------
// Drawing Grid
// -------------------

// function drawHorizontalLine(y, ctx, color) {
// 	ctx = ctx || contextCharacters.ctx;
// 	color = color || 'rgb(0,0,0)';

// 	ctx.strokeStyle = color;
// 	ctx.lineWidth = 1;
// 	y = makeCrisp(y);
// 	ctx.beginPath();
// 	ctx.moveTo(0, y);
// 	ctx.lineTo(contextCharacters.glyphEditCanvasSize, y);
// 	ctx.stroke();
// 	ctx.closePath();
// }

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

// function drawGuides() {
// 	// log('drawGuides', 'start');
// 	const editor = getCurrentProjectEditor();

// 	if (editor.selectedItemID) return;

// 	const ps = getCurrentProject().projectSettings;
// 	const onKernPage = editor.nav.page === 'kerning';
// 	// log('ps.guides: ');
// 	// log(ps.guides);

// 	if (contextCharacters.showGuides) {
// 		if (onKernPage) {
// 			contextCharacters.guides.leftGroupXMax.location = editor.selectedKernGroup.value;
// 			contextCharacters.guides.leftGroupXMax.draw();
// 			contextCharacters.guides.rightGroupXMin.draw();
// 			ps.guides.baseline.draw();
// 			return;
// 		}

// 		// Update custom guides
// 		let g;
// 		for (const c of Object.keys(ps.guides)) {
// 			g = ps.guides[c];
// 			if (g.editable) {
// 				g.draw();
// 			}
// 		}

// 		const selectedItem = editor.selectedItem;
// 		if (selectedItem) {
// 			const t = contextCharacters.eventHandlers.tempNewBasicShape;
// 			const rl = t ? Math.max(selectedItem.glyphWidth, t.xMax) : selectedItem.glyphWidth;
// 			const ll = Math.min(selectedItem.maxes.xMin, 0);

// 			// Update system guides
// 			ps.guides.xHeight.location = ps.xHeight;
// 			ps.guides.capHeight.location = ps.capHeight;
// 			ps.guides.ascent.location = ps.ascent;
// 			ps.guides.baseline.location = 0;
// 			ps.guides.descent.location = ps.descent;
// 			ps.guides.min.location = ll;
// 			ps.guides.max.location = rl;
// 			ps.guides.leftside.location = editor.selectedItem * -1;
// 			ps.guides.rightside.location = selectedItem.advanceWidth + rl;

// 			// Minor Guidelines - Overshoots
// 			if (contextCharacters.showOvershoots) {
// 				const os = ps.overshoot;
// 				ps.guides.xHeight.draw(-1 * os);
// 				ps.guides.ascent.draw(-1 * os);
// 				ps.guides.baseline.draw(os);
// 				ps.guides.descent.draw(os);
// 			}

// 			// Verticals
// 			ps.guides.zero.draw(0);
// 			if (editor.isOnEditPage()) {
// 				ps.guides.min.draw(0);
// 				ps.guides.leftside.draw();
// 				if (selectedItem.shapes.length) {
// 					ps.guides.max.draw(0);
// 					ps.guides.rightside.draw();
// 				}
// 			}

// 			// Horizontals
// 			ps.guides.xHeight.draw();
// 			ps.guides.capHeight.draw();
// 			ps.guides.ascent.draw();
// 			ps.guides.descent.draw();
// 			ps.guides.baseline.draw();

// 			// Out of bounds triangle
// 			if (ps.guides.baseline.visible || ps.guides.leftside.visible) {
// 				const ctx = contextCharacters.ctx;
// 				const v = getCurrentProjectEditor().view;
// 				ctx.fillStyle = shiftColor(
// 					ps.guides.baseline.color,
// 					ps.colors.systemGuideTransparency / 100,
// 					true
// 				);
// 				ctx.beginPath();
// 				ctx.moveTo(v.dx - 1, v.dy);
// 				ctx.lineTo(v.dx - 1, v.dy + ps.pointSize * 2);
// 				ctx.lineTo(v.dx - 1 - ps.pointSize * 2, v.dy);
// 				ctx.closePath();
// 				ctx.fill();
// 			}
// 		}
// 	}
// 	// log('drawGuides', 'end');
// }
