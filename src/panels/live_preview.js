import { getCurrentProjectEditor } from '../app/main';
import { addAsChildren, makeElement } from '../common/dom';
import { redrawLivePreviewPageDisplayCanvas } from '../pages/live_preview';
import {
	makeLivePreviewPopOutCard,
	updatePopOutWindowContent,
} from '../project_editor/pop_out_window';
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

	// Show
	let pageOptionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Show</h3>',
	});

	addAsChildren(pageOptionsCard, makeTextBlockOptions_pageOptions(textBlockOptions));

	// Basic options include the render flavor chooser, which can toggle the
	// visibility of the Text option and the entire Show card.
	const basicOptions = makeTextBlockOptions_basicOptions(textBlockOptions, updateFlavorVisibility);
	addAsChildren(basicOptionsCard, basicOptions.elements);

	/**
	 * Shows or hides flavor-dependent controls. The Glyphr Studio renderer
	 * supports the Text input and the Show card (bounding boxes, baselines,
	 * page outline); the native OTF / TTF renderers render live text directly,
	 * so those controls do not apply.
	 */
	function updateFlavorVisibility() {
		const isNative =
			textBlockOptions.previewFlavor === 'otf' || textBlockOptions.previewFlavor === 'ttf';
		basicOptions.textOptionElements.forEach((element) => {
			element.style.display = isNative ? 'none' : '';
		});
		pageOptionsCard.style.display = isNative ? 'none' : '';
	}
	updateFlavorVisibility();

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

function makeButton(text, chars) {
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
	symbols.forEach((symbol) => (text += String.fromCodePoint(symbol)));

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

function makeTextBlockOptions_basicOptions(textBlockOptions, onFlavorChange) {
	// Render flavor
	let flavorLabel = makeSingleLabel(
		'Render flavor:',
		`Choose how the live preview is rendered:
		<br><br>
		<b>Glyphr Studio</b> &ndash; draws your glyph outlines directly to a
		canvas, exactly as you've designed them. Best for inspecting your work
		with bounding boxes, baselines, and other guides.
		<br><br>
		<b>OTF</b> &ndash; generates a temporary OpenType (PostScript / cubic
		outlines) font from your project and renders it as live, editable text,
		showing how your font behaves once exported.
		<br><br>
		<b>TTF</b> &ndash; generates a temporary TrueType (quadratic outlines)
		font and renders it as live, editable text, showing how your font behaves
		once exported.`
	);
	let flavorChooser = makeRenderFlavorChooser(textBlockOptions, onFlavorChange);

	// Text
	let textLabel = makeSingleLabel('Text:');
	let textInput = makeElement({
		tag: 'textarea',
		id: 'textBlockTextInput',
		innerHTML: textBlockOptions.text,
	});
	textInput.addEventListener('keyup', (event) => {
		// @ts-expect-error 'property does exist'
		textBlockOptions.text = event.target.value;
		// @ts-expect-error 'property does exist'
		event.target.innerHTML = event.target.value;
		redrawAllLivePreviews();
	});

	// Font size
	let fontSizeLabel = makeSingleLabel('Font size:');
	let fontSizeInput = makeElement({
		tag: 'input-number',
		id: 'fontSizeInput',
		attributes: { value: textBlockOptions.fontSize },
	});
	fontSizeInput.addEventListener('change', (event) => {
		// @ts-expect-error 'property does exist'
		if (event.target.value <= 0) {
			// @ts-expect-error 'property does exist'
			event.target.value = 1;
			document.getElementById('fontSizeInput').setAttribute('value', '1');
		}
		// @ts-expect-error 'property does exist'
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
		// @ts-expect-error 'property does exist'
		textBlockOptions.lineGap = event.target.value;
		redrawAllLivePreviews();
	});

	// Preview kerning
	let kerningLabel = makeSingleLabel('Preview kerning:');
	let kerningToggle = makeDirectCheckbox(textBlockOptions, 'enableKerning', () => {
		redrawAllLivePreviews();
	});

	// Preview ligatures
	let ligatureLabel = makeSingleLabel('Preview ligatures:');
	let ligatureToggle = makeDirectCheckbox(textBlockOptions, 'enableLigatures', () => {
		redrawAllLivePreviews();
	});

	return {
		elements: [
			flavorLabel,
			flavorChooser,
			textLabel,
			textInput,
			fontSizeLabel,
			fontSizeInput,
			lineGapLabel,
			lineGapInput,
			kerningLabel,
			kerningToggle,
			ligatureLabel,
			ligatureToggle,
		],
		// Elements hidden when a native (OTF / TTF) render flavor is selected
		textOptionElements: [textLabel, textInput],
	};
}

// Render flavor IDs map to the previewFlavor stored in TextBlockOptions.
// 'gs' uses the display-canvas renderer; 'otf' / 'ttf' use the native
// font-preview renderer (FontFlux-generated font binary).
const RENDER_FLAVOR_NAMES = { gs: 'Glyphr Studio', otf: 'OTF', ttf: 'TTF' };

function makeRenderFlavorChooser(textBlockOptions, onFlavorChange) {
	const currentFlavor = textBlockOptions.previewFlavor || 'gs';
	let wrapper = makeElement({ className: 'renderFlavorButtonWrapper' });

	Object.keys(RENDER_FLAVOR_NAMES).forEach((flavorID) => {
		let button = makeElement({
			tag: 'button',
			className: 'renderFlavorButton',
			innerHTML: RENDER_FLAVOR_NAMES[flavorID],
			attributes: { title: `Render flavor: ${RENDER_FLAVOR_NAMES[flavorID]}` },
		});
		if (flavorID === currentFlavor) button.setAttribute('selected', '');

		button.addEventListener('click', () => {
			textBlockOptions.previewFlavor = flavorID;
			wrapper.querySelectorAll('.renderFlavorButton').forEach((otherButton) => {
				otherButton.removeAttribute('selected');
			});
			button.setAttribute('selected', '');
			if (onFlavorChange) onFlavorChange();
			redrawAllLivePreviews();
		});

		wrapper.appendChild(button);
	});

	return wrapper;
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
