/**
 * Panel > Live Preview
 * Options for the Live Preview page
 * Also floating dialog for 'torn out' live previews
 */

import { getCurrentProjectEditor } from '../app/main';
import { addAsChildren, makeElement } from '../common/dom';
import { caseCamelToKebab } from '../common/functions';
import { makeLivePreviewPopOutCard } from '../project_editor/pop_out_window';
import { makeDirectCheckbox, makeSingleLabel } from './cards';

export function makePanel_LivePreview() {
	// Options
	let optionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Options</h3>',
	});

	addAsChildren(optionsCard, makeLivePreviewOptions());

	// Show
	let showCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Show</h3>',
	});

	addAsChildren(showCard, makeShowOptions());

	// Pangrams
	let pangramCard = makeElement({
		tag: 'div',
		className: 'panel__card full-width',
		innerHTML: '<h3>Pangrams</h3>',
	});

	addAsChildren(pangramCard, [
		makeButton('the five boxing wizards jump quickly'),
		makeButton('pack my box with five dozen liquor jugs'),
		makeButton('the quick brown fox jumps over a lazy dog'),
		makeButton('amazingly few discotheques provide jukeboxes'),
		makeButton('quick enemy movement will<br>jeopardize six of the gunboats'),
	]);

	// Glyph sets
	let glyphSetsCard = makeElement({
		tag: 'div',
		className: 'panel__card full-width',
		innerHTML: '<h3>Glyph sets</h3>',
	});

	addAsChildren(glyphSetsCard, [
		makeButton('abcdefghijklmnopqrstuvwxyz'),
		makeButton('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
		makeButton('0123456789'),
		makeSymbolButton(),
		makeButton('All upper case letter permutations', makePermutations(true)),
		makeButton('All lower case letter permutations', makePermutations(false)),
	]);

	return [optionsCard, showCard, makeLivePreviewPopOutCard(), pangramCard, glyphSetsCard];
}

function makeButton(text, chars = false) {
	chars = chars || text.replace('<br>', ' ');
	let button = makeElement({
		tag: 'button',
		innerHTML: text,
	});

	button.addEventListener('click', () => {
		updateDisplayCanvasGlyphs(chars);
	});

	return button;
}

function updateDisplayCanvasGlyphs(text) {
	const glyphsInput = document.getElementById('livePreviewGlyphsInput');
	if (glyphsInput) {
		glyphsInput.innerHTML = text;
	}
	let displayCanvas = document.getElementsByTagName('display-canvas')[0];
	if (displayCanvas) {
		displayCanvas.setAttribute(caseCamelToKebab('text'), text);
	}
}

function makeSymbolButton() {
	let symbols = [
		'&#x21;',
		'&#x22;',
		'&#x23;',
		'&#x24;',
		'&#x25;',
		'&#x26;',
		'&#x27;',
		'&#x28;',
		'&#x29;',
		'&#x2A;',
		'&#x2B;',
		'&#x2C;',
		'&#x2D;',
		'&#x2E;',
		'&#x2F;',
		'&#x3A;',
		'&#x3B;',
		'&#x3C;',
		'&#x3D;',
		'&#x3E;',
		'&#x3F;',
		'&#x40;',
		'&#x5B;',
		'&#x5C;',
		'&#x5D;',
		'&#x5E;',
		'&#x5F;',
		'&#x60;',
		'&#x7B;',
		'&#x7C;',
		'&#x7D;',
		'&#x7E;',
	];

	let button = makeElement({
		tag: 'button',
		innerHTML: symbols.join(''),
	});

	button.addEventListener('click', clickSymbolButton);

	return button;
}

function clickSymbolButton() {
	let symbols = [
		0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x3a,
		0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60, 0x7b, 0x7c, 0x7d, 0x7e,
	];

	let glyphs = '';
	symbols.forEach((symbol) => (glyphs += String.fromCharCode(symbol)));

	updateDisplayCanvasGlyphs(glyphs);
}

function makePermutations(upper) {
	let members = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (!upper) members = members.toLowerCase();
	let result = '';

	for (let first = 0; first < members.length; first++) {
		for (let second = 0; second < members.length; second++) {
			result += members.charAt(first) + members.charAt(second) + ' ';
		}
		result += '\n';
	}
	result = result.substring(0, result.length - 1);
	return result;
}

function makeLivePreviewOptions() {
	const livePreviewOptions = getCurrentProjectEditor().livePreviewPageOptions;

	// Text
	let glyphsLabel = makeSingleLabel('Text:');
	let glyphsInput = makeElement({
		tag: 'textarea',
		id: 'livePreviewGlyphsInput',
		innerHTML: livePreviewOptions.text,
	});
	glyphsInput.addEventListener('keyup', (event) => {
		let displayCanvas = document.getElementsByTagName('display-canvas')[0];
		let newValue = event.target.value;
		livePreviewOptions.text = newValue;
		displayCanvas.setAttribute(caseCamelToKebab('text'), newValue);
	});

	// Font size
	let fontSizeLabel = makeSingleLabel('Font size:');
	let fontSizeInput = makeElement({
		tag: 'input-number',
		attributes: { value: livePreviewOptions.fontSize },
	});
	fontSizeInput.addEventListener('change', (event) => {
		let displayCanvas = document.getElementsByTagName('display-canvas')[0];
		let newValue = event.target.value;
		livePreviewOptions.fontSize = newValue;
		displayCanvas.setAttribute(caseCamelToKebab('fontSize'), newValue);
	});

	// Line gap
	let lineGapLabel = makeSingleLabel('Line gap:');
	let lineGapInput = makeElement({
		tag: 'input-number',
		attributes: { value: livePreviewOptions.lineGap },
	});
	lineGapInput.addEventListener('change', (event) => {
		let displayCanvas = document.getElementsByTagName('display-canvas')[0];
		let newValue = event.target.value;
		livePreviewOptions.lineGap = newValue;
		displayCanvas.setAttribute(caseCamelToKebab('lineGap'), newValue);
	});

	return [glyphsLabel, glyphsInput, fontSizeLabel, fontSizeInput, lineGapLabel, lineGapInput];
}

function makeShowOptions() {
	const livePreviewOptions = getCurrentProjectEditor().livePreviewPageOptions;
	let glyphOutlineLabel = makeSingleLabel('Glyph bounding box:');
	let glyphOutlineToggle = makeDirectCheckbox(
		livePreviewOptions,
		'showCharacterExtras',
		(newValue) => {
			let displayCanvas = document.getElementsByTagName('display-canvas')[0];
			displayCanvas.setAttribute(caseCamelToKebab('showCharacterExtras'), newValue);
			// livePreviewOptions.showCharacterExtras = newValue;
			// displayCanvas.redraw();
		}
	);

	let baselineLabel = makeSingleLabel('Baselines:');
	let baselineToggle = makeDirectCheckbox(livePreviewOptions, 'showLineExtras', (newValue) => {
		let displayCanvas = document.getElementsByTagName('display-canvas')[0];
		displayCanvas.setAttribute(caseCamelToKebab('showLineExtras'), newValue);
		// livePreviewOptions.showLineExtras = newValue;
		// displayCanvas.redraw();
	});

	let pageOutlineLabel = makeSingleLabel('Page outline:');
	let pageOutlineToggle = makeDirectCheckbox(livePreviewOptions, 'showPageExtras', (newValue) => {
		let displayCanvas = document.getElementsByTagName('display-canvas')[0];
		displayCanvas.setAttribute(caseCamelToKebab('showPageExtras'), newValue);
		// livePreviewOptions.showPageExtras = newValue;
		// displayCanvas.redraw();
	});

	return [
		glyphOutlineLabel,
		glyphOutlineToggle,
		baselineLabel,
		baselineToggle,
		pageOutlineLabel,
		pageOutlineToggle,
	];

	/*
	const fontSettings = getCurrentProject().settings.font;
	const lineGap = fontSettings.lineGap;
	let padSize = 20;
	let showCharacterExtras = false;
	let showLineExtras = false;
	let showPageExtras = false;
	let combineGlyphShapes = false;


	let content = '<table class="detail">';
	content +=
		'<tr><td> font size <span class="unit">(px)</span> </td><td><input type="number" value="' +
		fontsize +
		'" onchange="changeFontScale(this.value); redraw_TestDrive();"></td></tr>';
	content +=
		'<tr><td> 96dpi font size <span class="unit">(pt)</span> </td><td><input type="number" disabled="disabled" id="roughPointSize" valu="75"/></td></tr>';
	content +=
		'<tr><td> line gap <span class="unit">(em units)</span> </td><td><input type="number" value="' +
		lineGap +
		'" onchange="changeLineGap(this.value); redraw_TestDrive();"></td></tr>';
	// content += '<tr><td> glyph spacing <span class="unit">(em units)</span> </td><td><input type="number" value="'+padSize+'" onchange="padSize=this.value*1; redraw_TestDrive();"></td></tr>';
	content +=
		'<tr><td> <label for="showCharacterExtras">show glyph boxes</label> </td><td>' +
		checkUI('showCharacterExtras', showCharacterExtras, true) +
		'</td></tr>';
	content +=
		'<tr><td> <label for="showLineExtras">show baseline</label> </td><td>' +
		checkUI('showLineExtras', showLineExtras, true) +
		'</td></tr>';
	content +=
		'<tr><td> <label for="showPageExtras">show page borders</label> </td><td>' +
		checkUI('showPageExtras', showPageExtras, true) +
		'</td></tr>';

	content +=
		'<tr><td> <label for="combineGlyphShapes">preview combine glyph shapes</label>' +
		helpUI(combineMessage) +
		' </td><td>' +
		checkUI('combineGlyphShapes', combineGlyphShapes, false) +
		'</td></tr>';

	content +=
		'<tr><td colspan=2><button onclick="createImage();">generate png file</button></td></tr>';
	content += '</table>';
	return content;
	*/
}
