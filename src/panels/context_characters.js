/**
		Panel > ContextCharacters
		Shows a list of all the paths in a Glyph.
**/
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeLivePreviewPopOutCard } from '../project_editor/pop_out_window.js';
import { makeDirectCheckbox, makeSingleInput, makeSingleLabel, rowPad } from './cards.js';
import { makeSystemGuidesCard } from './guides.js';

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
	let toggleCheckboxLabel = makeSingleLabel('Show&nbsp;context&nbsp;characters&nbsp;&nbsp;');
	let toggleCheckbox = makeDirectCheckbox(ccOptions, 'showCharacters', () => {
		getCurrentProjectEditor().autoFitView();
		refresh();
	});

	let charsInput = makeSingleInput(
		editor.selectedItem,
		'contextCharacters',
		'editCanvasView',
		'input',
		['input']
	);
	charsInput.addEventListener('input', () => getCurrentProjectEditor().autoFitView());

	let transparencyLabel = makeSingleLabel('Transparency');
	let transparencyInput = makeSingleInput(
		ccOptions,
		'characterTransparency',
		'editCanvasView',
		'input-number'
	);

	charsInput.classList.add('spanAll');
	addAsChildren(charsCard, [
		description,
		charsInput,
		rowPad(),
		toggleCheckboxLabel,
		toggleCheckbox,
		transparencyLabel,
		transparencyInput,
	]);

	// Options
	let optionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>Guides and labels</h3>
	`,
	});

	let guidesCheckboxLabel = makeSingleLabel('Show guides and labels');
	let guidesCheckbox = makeDirectCheckbox(ccOptions, 'showGuides', refresh);

	let guidesLabel = makeSingleLabel('Transparency');
	let guidesInput = makeSingleInput(
		ccOptions,
		'guidesTransparency',
		'editCanvasView',
		'input-number'
	);

	addAsChildren(optionsCard, [guidesCheckboxLabel, guidesCheckbox, guidesLabel, guidesInput]);

	// log(`makePanel_ContextCharacters`, 'end');
	return [charsCard, optionsCard, makeSystemGuidesCard(), makeLivePreviewPopOutCard(true)];
}

function refresh() {
	const editor = getCurrentProjectEditor();
	editor.editCanvas.redraw();
}

/*

export function makeContextCharactersControls() {
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
	ctxg += '<input type="text" id="contextglyphsinput" oninput="updateContextCharacterss();" ';
	ctxg += 'onblur="_UI.focusElement = false;" onmouseover="mouseoutcec();" ';
	ctxg += 'title="context glyphs\ndisplay glyphs before or after the currently-selected glyph" ';
	ctxg += 'value="' + getContextCharactersString() + '"/>';
	ctxg +=
		'<button id="contextglyphsoptionsbutton" onclick="showCtxGlyphsOptions();">&#x23F7;</button>';
	ctxg += '</div>';
}
*/
