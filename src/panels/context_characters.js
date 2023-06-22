/**
		Panel > ContextCharacters
		Shows a list of all the paths in a Glyph.
**/
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeDirectCheckbox, makeSingleInput, makeSingleLabel, rowPad } from './cards.js';

export function makePanel_ContextCharacters() {
	// log(`makePanel_ContextCharacters`, 'start');
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();

	let charsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>Characters</h3>`,
	});

	let description = makeElement({
		tag: 'p',
		className: 'spanAll',
		content: `Context characters are a small set of letters that are shown around
		the character you are currently editing.`,
	});

	const ccOptions = project.settings.app.contextCharacters;
	let toggleCheckbox = makeDirectCheckbox(ccOptions, 'showCharacters');
	let toggleCheckboxLabel = makeSingleLabel('Show&nbsp;context&nbsp;characters');
	let charsInput = makeSingleInput(
		editor.selectedItem,
		'contextCharacters',
		'currentItem',
		'input'
	);
	charsInput.classList.add('spanAll');
	addAsChildren(charsCard, [description, rowPad(), toggleCheckboxLabel, toggleCheckbox, charsInput]);

	// Options
	let optionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>Options</h3>
	`,
	});

	let transparencyLabel = makeSingleLabel('Character transparency');
	let transparencyInput = makeSingleInput(
		ccOptions,
		'characterTransparency',
		false,
		'input-number'
	);

	let guidesCheckboxLabel = makeSingleLabel('Show guides');
	let guidesCheckbox = makeDirectCheckbox(ccOptions, 'showGuides');

	let guidesLabel = makeSingleLabel('Guides transparency');
	let guidesInput = makeSingleInput(ccOptions, 'guidesTransparency', false, 'input-number');

	addAsChildren(optionsCard, [
		transparencyLabel,
		transparencyInput,
		guidesCheckboxLabel,
		guidesCheckbox,
		guidesLabel,
		guidesInput,
	]);

	// log(`makePanel_ContextCharacters`, 'end');
	return [charsCard, optionsCard];
}

/*

export function makeContextGlyphControls() {
	// Context Glyphs
	let ctxg = '<div class="contextglyphsarea">';
	ctxg += '<div id="contextglyphsoptions">';
	ctxg +=
		'<strong>Context Glyphs</strong> are letters you can display around the glyph you are currently editing.<br><br>';
	ctxg += checkUI(
		'getCurrentProject().projectSettings.contextGlyphs.showGuides',
		getCurrentProject().projectSettings.contextGlyphs.showGuides,
		true
	);
	ctxg +=
		'<label style="margin-left:10px; position:relative; top:-6px;" for="contextGlyphs.showGuides">show guides</label><br>';
	ctxg +=
		'glyph ' +
		sliderUI('contextGlyphTransparency', 'contextGlyphTransparency_dropdown', true, false);
	ctxg += '<br/>';
	ctxg +=
		'guide ' + sliderUI('systemGuideTransparency', 'systemGuideTransparency_dropdown', true, false);
	ctxg += '</div>';
	ctxg += '<input type="text" id="contextglyphsinput" oninput="updateContextGlyphs();" ';
	ctxg += 'onblur="_UI.focusElement = false;" onmouseover="mouseoutcec();" ';
	ctxg += 'title="context glyphs\ndisplay glyphs before or after the currently-selected glyph" ';
	ctxg += 'value="' + getContextGlyphString() + '"/>';
	ctxg +=
		'<button id="contextglyphsoptionsbutton" onclick="showCtxGlyphsOptions();">&#x23F7;</button>';
	ctxg += '</div>';
}
*/
