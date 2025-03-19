import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeRandomSaturatedColor, parseColorString, rgbToHex } from '../common/colors.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeIcon } from '../common/graphics.js';
import { makeFancySlider } from '../controls/fancy-slider/fancy_slider.js';
import {
	Guide,
	guideColorDark,
	guideColorLight,
	guideColorMedium,
} from '../project_editor/guide.js';
import { makeActionButton } from './action_buttons.js';
import { makeDirectCheckbox, makeSingleInput, makeSingleLabel, rowPad } from './cards.js';
import { refreshPanel } from './panels.js';

// --------------------------------------------------------------
// Guides panel
// --------------------------------------------------------------

export function makePanel_Guides() {
	let viewOptionsCard = makeElement({
		className: 'panel__card guides-card__view-options',
		innerHTML: '<h3>View options</h3>',
	});
	const guides = getCurrentProject().settings.app.guides;
	const showSystem = guides.systemShowGuides;
	const showCustom = guides.customShowGuides;
	addAsChildren(viewOptionsCard, [
		makeDirectCheckbox(guides, 'drawGuidesOnTop', refreshGuideChange),
		makeElement({
			tag: 'label',
			style: 'grid-column: 2 / -1;',
			content: 'Draw guides over shapes',
		}),
	]);

	const systemShowGuidesCheckbox = makeDirectCheckbox(guides, 'systemShowGuides');
	systemShowGuidesCheckbox.addEventListener('change', () => {
		getCurrentProjectEditor().navigate();
	});
	addAsChildren(viewOptionsCard, [
		systemShowGuidesCheckbox,
		makeElement({ tag: 'h4', content: 'Key metrics guides' }),
	]);
	if (showSystem) {
		addAsChildren(viewOptionsCard, [
			makeElement(),
			makeSingleLabel('Transparency'),
			makeFancySlider(guides.systemTransparency, (newValue) => {
				guides.systemTransparency = newValue;
				getCurrentProjectEditor().editCanvas.redraw('guides system transparency');
			}),
			makeElement(),
			makeSingleLabel('Show labels'),
			makeDirectCheckbox(guides, 'systemShowLabels', refreshGuideChange),
			rowPad(),
		]);
	}

	const customShowGuidesCheckbox = makeDirectCheckbox(guides, 'customShowGuides');
	customShowGuidesCheckbox.addEventListener('change', () => {
		getCurrentProjectEditor().navigate();
	});
	addAsChildren(viewOptionsCard, [
		customShowGuidesCheckbox,
		makeElement({ tag: 'h4', content: 'Custom guides' }),
	]);
	if (showCustom) {
		addAsChildren(viewOptionsCard, [
			makeElement(),
			makeSingleLabel('Transparency'),
			makeFancySlider(guides.customTransparency, (newValue) => {
				guides.customTransparency = newValue;
				getCurrentProjectEditor().editCanvas.redraw('guides custom transparency');
			}),
			makeElement(),
			makeSingleLabel('Show labels'),
			makeDirectCheckbox(guides, 'customShowLabels', refreshGuideChange),
		]);
	}

	let result = [viewOptionsCard];
	if (showSystem) result.push(makeSystemGuidesCard());
	if (showCustom) result.push(makeCustomGuidesCard());
	return result;
}

function refreshGuideChange() {
	refreshPanel();
	getCurrentProjectEditor().editCanvas.redraw('guides refresh');
}

export function makeSystemGuidesCard() {
	let systemCard = makeElement({
		className: 'panel__card guides-card__system',
		innerHTML: '<h3>Key metrics guides</h3>',
	});

	const metrics = getCurrentProject().settings.font;
	const advanceWidth = getCurrentProjectEditor().selectedItem.advanceWidth;
	addAsChildren(systemCard, [
		makeSystemGuideRow('ascent', 'Ascent', metrics.ascent, guideColorMedium),
		makeSystemGuideRow('capHeight', 'Cap height', metrics.capHeight, guideColorLight),
		makeSystemGuideRow('xHeight', 'X height', metrics.xHeight, guideColorLight),
		makeSystemGuideRow('baseline', 'Baseline', '0', guideColorDark),
		makeSystemGuideRow('descent', 'Descent', metrics.descent, guideColorMedium),
		makeSystemGuideRow('leftSide', 'Left side', '0', guideColorDark),
		makeSystemGuideRow('rightSide', 'Right side', advanceWidth, guideColorDark),
	]);
	return systemCard;
}

function makeSystemGuideRow(property, title, value = '0000', color) {
	const systemGuides = getCurrentProjectEditor().systemGuides;

	// Checkbox
	const viewCheckbox = makeDirectCheckbox(systemGuides, property, (newValue) => {
		const editor = getCurrentProjectEditor();
		let shownGuides = editor.project.settings.app.guides.systemGuides;
		if (newValue) {
			if (!shownGuides.includes(property)) {
				shownGuides.push(property);
			}
		} else {
			if (shownGuides.includes(property)) {
				shownGuides = shownGuides.filter((g) => g !== property);
			}
		}
		editor.editCanvas.redraw('guides system view toggle');
	});
	viewCheckbox.setAttribute('title', 'Show / hide guide');
	viewCheckbox.setAttribute('style', `accent-color: ${color};`);

	// Angle icon
	let angleDisplay = makeElement({
		className: 'guide-system-angle',
		innerHTML: makeIcon({
			name: 'command_horizontalBar',
			color: color,
		}),
	});
	angleDisplay.setAttribute('title', 'Horizontal guideline');
	if (property === 'leftSide' || property === 'rightSide') {
		angleDisplay.innerHTML = makeIcon({
			name: 'command_verticalBar',
			color: color,
		});
		angleDisplay.setAttribute('title', 'Vertical guideline');
	}

	// Value
	const valueDisplay = makeElement({ className: 'guide-system-value', content: value });
	valueDisplay.setAttribute(
		'title',
		`Guide line position\nThese are based on this font's key metrics,\nwhich you can edit on the Font Settings page.`
	);

	return [viewCheckbox, makeSingleLabel(title), angleDisplay, valueDisplay];
}

function makeCustomGuidesCard() {
	let customCard = makeElement({
		className: 'panel__card guides-card__custom',
		innerHTML: '<h3>Custom guides</h3>',
	});

	const guides = getCurrentProject().settings.app.guides.custom;

	if (guides.length) {
		guides.forEach((guide, number) => {
			addAsChildren(customCard, makeCustomGuideRow(guide, number));
		});

		customCard.appendChild(rowPad());
	}

	const addGuideButton = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		innerHTML: 'Add a custom guide',
	});
	addGuideButton.addEventListener('click', () => {
		getCurrentProject().settings.app.guides.custom.push(
			new Guide({ visible: true, color: makeRandomSaturatedColor() })
		);
		refreshGuideChange();
	});

	customCard.appendChild(addGuideButton);
	return customCard;
}

function makeCustomGuideRow(guide, number) {
	// Checkbox
	const viewCheckbox = makeDirectCheckbox(guide, 'visible', () => {
		const editor = getCurrentProjectEditor();
		editor.editCanvas.redraw('guides custom view toggle');
	});
	viewCheckbox.setAttribute('style', `accent-color: ${guide.color}`);
	viewCheckbox.setAttribute('title', 'Show / hide guide');

	// Name
	const nameInput = makeSingleInput(guide, 'name', 'editCanvasView', 'input');

	// Delete
	const deleteButton = makeActionButton({ iconName: 'delete', title: 'Delete guide' });
	deleteButton.setAttribute('class', 'guide-delete-button');
	deleteButton.addEventListener('click', () => {
		const guides = getCurrentProject().settings.app.guides.custom;
		guides.splice(number, 1);
		refreshGuideChange();
	});

	const colorButton = makeElement({
		tag: 'input',
		className: 'guide-color-button',
		title: 'Change guide color',
		attributes: {
			type: 'color',
			style: `background-color: ${guide.color};`,
			value: rgbToHex(guide.color),
		},
	});
	colorButton.addEventListener('input', (event) => {
		// Get new color
		// @ts-expect-error 'property does exist'
		let rgb = parseColorString(event.target.value);
		let rgbString = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

		// Row accents
		colorButton.setAttribute('value', rgbToHex(rgbString));
		colorButton.style.backgroundColor = rgbString;
		viewCheckbox.style.accentColor = rgbString;
		angleButton.querySelector('g').setAttribute('fill', rgbString);

		// Update guide
		const guide = getCurrentProject().settings.app.guides.custom[number];
		guide.color = rgbString;
		getCurrentProjectEditor().editCanvas.redraw('guides custom color change');
	});

	// Angle button
	const angleButton = makeElement({
		tag: 'button',
		title: 'Toggle vertical / horizontal',
		className: 'guide-angle-button',
		innerHTML: makeIcon({
			name: 'command_verticalBar',
			color: guide.color,
		}),
	});
	if (guide.angle === 90) {
		angleButton.innerHTML = makeIcon({
			name: 'command_horizontalBar',
			color: guide.color,
		});
	}
	angleButton.addEventListener('click', () => {
		const guide = getCurrentProject().settings.app.guides.custom[number];
		if (guide.angle === 90) {
			guide.angle = 0;
			guide.name = guide.name.replace('Horizontal', 'Vertical');
		} else {
			guide.angle = 90;
			guide.name = guide.name.replace('Vertical', 'Horizontal');
		}
		refreshGuideChange();
	});

	// Value
	const valueInput = makeSingleInput(guide, 'location', 'editCanvasView', 'input-number');
	valueInput.setAttribute('title', 'Guide line position');

	return [viewCheckbox, nameInput, deleteButton, colorButton, angleButton, valueInput];
}
