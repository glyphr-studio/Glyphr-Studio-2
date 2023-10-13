import { getCurrentProjectEditor } from '../app/main';
import { addAsChildren, makeElement } from '../common/dom';
import { redrawLivePreviewPageDisplayCanvas } from '../pages/live_preview';
import { makeLivePreviewPopOutCard, openPopOutWindow, updatePopOutWindowContent } from '../project_editor/pop_out_window';
import { makeDirectCheckbox, makeSingleLabel } from './cards';

// --------------------------------------------------------------
// Live Preview page attributes panel
// --------------------------------------------------------------

export function makePanel_LivePreview(textBlockOptions, showPopOutCard = true) {
	// Options
	let basicOptionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Options</h3>',
	});

	addAsChildren(basicOptionsCard, makeTextBlockOptions_basicOptions(textBlockOptions));

	// Show
	let pageOptionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Show</h3>',
	});

	addAsChildren(pageOptionsCard, makeTextBlockOptions_pageOptions(textBlockOptions));

	let sampleTextHeader = makeElement({
		className: 'panel__card no-card',
		innerHTML: '<h3>Sample text</h3>',
	});

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
		makeButton('quick enemy movement will jeopardize six of the gunboats'),
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

	let result = [basicOptionsCard, pageOptionsCard, sampleTextHeader, pangramCard, glyphSetsCard];
	if (showPopOutCard) result.splice(2, 0, makeLivePreviewPopOutCard());
	return result;
}

function makeButton(text, chars = false) {
	chars = chars || text.replace('<br>', ' ');
	let button = makeElement({
		tag: 'button',
		innerHTML: text,
	});

	button.addEventListener('click', (event) => {
		updateLivePreviewTextInputText(event, chars);
	});

	return button;
}

function updateLivePreviewTextInputText(event, text) {
	// log(`updateLivePreviewTextInputText`, 'start');
	// log(event);
	// log(`text: ${text}`);

	// This works for the main window or the pop-out window
	let doc = event.srcElement.ownerDocument;
	const textInput = doc.getElementById('textBlockTextInput');

	if (textInput) {
		textInput.innerHTML = text;
		textInput.value = text;
		textInput.dispatchEvent(new Event('keyup'));
	}
	// log(`updateLivePreviewTextInputText`, 'end');
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

function clickSymbolButton(event) {
	let symbols = [
		0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x3a,
		0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60, 0x7b, 0x7c, 0x7d, 0x7e,
	];

	let text = '';
	symbols.forEach((symbol) => (text += String.fromCharCode(symbol)));

	updateLivePreviewTextInputText(event, text);
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

function makeTextBlockOptions_basicOptions(textBlockOptions) {
	// Text
	let textLabel = makeSingleLabel('Text:');
	let textInput = makeElement({
		tag: 'textarea',
		id: 'textBlockTextInput',
		innerHTML: textBlockOptions.text,
	});
	textInput.addEventListener('keyup', (event) => {
		textBlockOptions.text = event.target.value;
		event.target.innerHTML = event.target.value;
		redrawAllLivePreviews();
	});

	// Font size
	let fontSizeLabel = makeSingleLabel('Font size:');
	let fontSizeInput = makeElement({
		tag: 'input-number',
		attributes: { value: textBlockOptions.fontSize },
	});
	fontSizeInput.addEventListener('change', (event) => {
		textBlockOptions.fontSize = event.target.value;
		redrawAllLivePreviews();
	});

	// Line gap
	let lineGapLabel = makeSingleLabel('Line gap:');
	let lineGapInput = makeElement({
		tag: 'input-number',
		attributes: { value: textBlockOptions.lineGap },
	});
	lineGapInput.addEventListener('change', (event) => {
		textBlockOptions.lineGap = event.target.value;
		redrawAllLivePreviews();
	});

	return [textLabel, textInput, fontSizeLabel, fontSizeInput, lineGapLabel, lineGapInput];
}

function makeTextBlockOptions_pageOptions(textBlockOptions) {
	let glyphOutlineLabel = makeSingleLabel('Glyph bounding box:');
	let glyphOutlineToggle = makeDirectCheckbox(
		textBlockOptions,
		'showCharacterExtras',
		(newValue) => {
			textBlockOptions.showCharacterExtras = newValue;
			redrawAllLivePreviews();
		}
	);

	let baselineLabel = makeSingleLabel('Baselines:');
	let baselineToggle = makeDirectCheckbox(textBlockOptions, 'showLineExtras', (newValue) => {
		textBlockOptions.showLineExtras = newValue;
		redrawAllLivePreviews();
	});

	let pageOutlineLabel = makeSingleLabel('Page outline:');
	let pageOutlineToggle = makeDirectCheckbox(textBlockOptions, 'showPageExtras', (newValue) => {
		textBlockOptions.showPageExtras = newValue;
		redrawAllLivePreviews();
	});

	return [
		glyphOutlineLabel,
		glyphOutlineToggle,
		baselineLabel,
		baselineToggle,
		pageOutlineLabel,
		pageOutlineToggle,
	];
}

function redrawAllLivePreviews() {
	redrawLivePreviewPageDisplayCanvas();
	if (getCurrentProjectEditor().popOutWindow) updatePopOutWindowContent();
}
