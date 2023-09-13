/**
		Panel > ContextCharacters
		Shows a list of all the paths in a Glyph.
**/
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeFancySlider } from '../controls/fancy-slider/fancy_slider.js';
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
	let transparencyInput = makeFancySlider(ccOptions.characterTransparency, (newValue) => {
		ccOptions.characterTransparency = newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});
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
	let guidesInput = makeFancySlider(ccOptions.guidesTransparency, (newValue) => {
		ccOptions.guidesTransparency = newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});

	addAsChildren(optionsCard, [guidesCheckboxLabel, guidesCheckbox, guidesLabel, guidesInput]);

	// log(`makePanel_ContextCharacters`, 'end');
	return [charsCard, optionsCard, makeLivePreviewPopOutCard(true)];
}

function refresh() {
	const editor = getCurrentProjectEditor();
	editor.editCanvas.redraw();
}