import { getCurrentProject } from '../app/main.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { decToHex, getUnicodeName, hexToChars } from '../common/unicode.js';
import { closeAllDialogs, showModalDialog, showToast } from '../controls/dialogs.js';
import { unicodeBlocks } from '../lib/unicode_blocks.js';
import { makeDirectCheckbox } from '../panels/cards.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import settingsMap from './settings_data.js';

/**
 * Page > Settings
 * Settings for fonts, UI, and Glyphr Studio projects
 */
export function makePage_Settings() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Settings' })}
				</div>
				<div id="content-page__panel">
				</div>
			</div>
			<div class="content-page__right-area">
			</div>
		</div>
		`,
	});

	let panelArea = content.querySelector('#content-page__panel');
	let rightArea = content.querySelector('.content-page__right-area');

	addAsChildren(panelArea, makeSettingsTabs());

	addAsChildren(rightArea, [
		makeSettingsTabContentFont(),
		makeSettingsTabContentProject(),
		makeSettingsTabContentApp(),
	]);

	selectTab(content, 'Project');

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	return content;
}

function selectTab(parent, tabName = 'Font') {
	const tabContentFont = parent.querySelector('#tab-content__font');
	const tabContentProject = parent.querySelector('#tab-content__project');
	const tabContentApp = parent.querySelector('#tab-content__app');
	const tabFont = parent.querySelector('#tab__font');
	const tabProject = parent.querySelector('#tab__project');
	const tabApp = parent.querySelector('#tab__app');

	tabContentFont.style.display = 'none';
	tabContentProject.style.display = 'none';
	tabContentApp.style.display = 'none';
	tabFont.removeAttribute('selected');
	tabProject.removeAttribute('selected');
	tabApp.removeAttribute('selected');

	if (tabName === 'Font') {
		tabContentFont.style.display = 'grid';
		tabFont.setAttribute('selected', '');
	}

	if (tabName === 'Project') {
		tabContentProject.style.display = 'grid';
		tabProject.setAttribute('selected', '');
	}

	if (tabName === 'App') {
		tabContentApp.style.display = 'grid';
		tabApp.setAttribute('selected', '');
	}
}

function makeSettingsTabs() {
	const tabContainer = makeElement({
		tag: 'div',
		className: 'settings-page__tab-container',
	});

	const tabFont = makeElement({
		className: 'settings-page__tab',
		id: 'tab__font',
		innerHTML: 'Font metadata',
		attributes: { tabindex: 1 },
		onClick: () => {
			selectTab(document, 'Font');
		},
	});

	const tabProject = makeElement({
		className: 'settings-page__tab',
		id: 'tab__project',
		innerHTML: 'Project settings',
		attributes: { tabindex: 1 },
		onClick: () => {
			selectTab(document, 'Project');
		},
	});

	const tabApp = makeElement({
		className: 'settings-page__tab',
		id: 'tab__app',
		innerHTML: 'App preferences',
		attributes: { tabindex: 1 },
		onClick: () => {
			selectTab(document, 'App');
		},
	});

	addAsChildren(tabContainer, [tabFont, tabProject, tabApp]);

	return tabContainer;
}

function makeSettingsTabContentFont() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content settings-table',
		id: 'tab-content__font',
		innerHTML: `
			<h1>Font metadata</h1>
			<p>
				These settings will be exported with any font you save,
				and will be used around Glyphr Studio while you are making edits.
			</p>
		`,
	});

	addAsChildren(tabContent, [
		makeOneSettingsRow('font', 'family'),
		makeOneSettingsRow('font', 'style'),
		makeOneSettingsRow('font', 'version'),
		makeOneSettingsRow('font', 'description'),
		makeOneSettingsRow('font', 'panose'),
		textToNode('<h2>Font metrics</h2>'),
		textToNode('<h3>Key metrics</h3>'),
		makeOneSettingsRow('font', 'upm'),
		makeOneSettingsRow('font', 'ascent'),
		makeOneSettingsRow('font', 'descent'),
		makeOneSettingsRow('font', 'capHeight'),
		makeOneSettingsRow('font', 'xHeight'),
		textToNode('<h3>Other metrics</h3>'),
		makeOneSettingsRow('font', 'overshoot'),
		makeOneSettingsRow('font', 'lineGap'),
		makeOneSettingsRow('font', 'italicAngle'),
		textToNode('<h2>Links</h2>'),
		makeOneSettingsRow('font', 'designer'),
		makeOneSettingsRow('font', 'designerURL'),
		makeOneSettingsRow('font', 'manufacturer'),
		makeOneSettingsRow('font', 'manufacturerURL'),
		makeOneSettingsRow('font', 'license'),
		makeOneSettingsRow('font', 'licenseURL'),
		makeOneSettingsRow('font', 'copyright'),
		makeOneSettingsRow('font', 'trademark'),
		textToNode('<h2>Properties for SVG Fonts</h2>'),
		makeOneSettingsRow('font', 'variant'),
		makeOneSettingsRow('font', 'weight'),
		makeOneSettingsRow('font', 'stretch'),
		makeOneSettingsRow('font', 'stemv'),
		makeOneSettingsRow('font', 'stemh'),
		makeOneSettingsRow('font', 'slope'),
		makeOneSettingsRow('font', 'underlinePosition'),
		makeOneSettingsRow('font', 'underlineThickness'),
		makeOneSettingsRow('font', 'strikethroughPosition'),
		makeOneSettingsRow('font', 'strikethroughThickness'),
		makeOneSettingsRow('font', 'overlinePosition'),
		makeOneSettingsRow('font', 'overlineThickness'),
	]);

	return tabContent;
}

function makeSettingsTabContentApp() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content settings-table',
		id: 'tab-content__app',
		innerHTML: `
			<h1>App preferences</h1>
			<p>These settings adjust how the Glyphr Studio App behaves.</p>
		`,
	});

	addAsChildren(tabContent, [
		makeOneSettingsRow('app', 'savePreferences'),
		makeOneSettingsRow('app', 'stopPageNavigation'),
		makeOneSettingsRow('app', 'showNonCharPoints'),
		textToNode('<h2>Exporting</h2>'),
		makeOneSettingsRow('app', 'formatSaveFile'),
		makeOneSettingsRow('app', 'combinePathsOnExport'),
		makeOneSettingsRow('app', 'maxCombinePathsOnExport'),
	]);

	return tabContent;
}

function makeSettingsTabContentProject() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__project',
		innerHTML: `
			<h1>Project settings</h1>
			<p>These settings affect how this Glyphr Studio Project behaves.</p>
		`,
	});

	const settingsArea = makeElement({
		tag: 'div',
		className: 'settings-table',
	});

	addAsChildren(settingsArea, [
		makeOneSettingsRow('project', 'name'),
		makeOneSettingsRow('project', 'latestVersion'),
		makeOneSettingsRow('project', 'initialVersion'),
		makeOneSettingsRow('project', 'id'),
		textToNode('<br>'),
	]);

	const rangesArea = makeElement({
		tag: 'div',
		innerHTML: `
			<h2>Glyph ranges</h2>
			<p>
				Glyph ranges are based on the <a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">Unicode Standard</a>,
				which assigns a <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">hexadecimal number</a>
				to all possible glyphs in a font.
				<a href="https://en.wikipedia.org/wiki/Unicode_block" target="_blank">Wikipedia's Unicode Block page</a>
				is a good place to get familiar with all the different glyphs it's possible to have in a font.
				<br><br>
				The glyph ranges below will be visible on the Glyph Edit page, and they will be exported to fonts.
				<br><br>
				Removing a glyph range <strong>will not</strong> delete individual glyphs from the project.
			</p>
		`,
	});

	const addStandardRangeButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Add glyph ranges from standard Unicode blocks',
		onClick: showUnicodeGlyphRangeDialog,
	});
	// Have to add attribute after the button is created
	addStandardRangeButton.setAttribute('secondary', '');

	const addCustomRangeButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Add a custom glyph range',
		onClick: showCustomGlyphRangeDialog,
	});
	// Have to add attribute after the button is created
	addCustomRangeButton.setAttribute('secondary', '');

	addAsChildren(rangesArea, [
		addStandardRangeButton,
		textToNode('<span>&emsp;</span>'),
		addCustomRangeButton,
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Current ranges</h3>'),
		textToNode('<div class="glyph-range-table__wrapper"></div>'),
	]);

	addAsChildren(rangesArea.querySelector('.glyph-range-table__wrapper'), makeCurrentRangesTable());

	addAsChildren(tabContent, [settingsArea, rangesArea]);

	return tabContent;
}

// --------------------------------------------------------------
// Individual settings
// --------------------------------------------------------------
function makeOneSettingsRow(groupName, propertyName) {
	const settings = getCurrentProject().settings;
	const thisSetting = settingsMap[groupName][propertyName];
	const settingType = thisSetting?.type;
	const settingValue = settings[groupName][propertyName];

	const label = makeElement({
		className: 'settings__label',
		innerHTML: `${thisSetting.label.replaceAll(' ', '&nbsp;')}: `,
	});

	let type = textToNode('<span></span>');
	let input;

	if (settingType === 'Degree' || settingType === 'Em' || settingType === 'Number') {
		input = makeElement({
			tag: 'input-number',
			attributes: { value: parseInt(settingValue) },
		});

		input.addEventListener('change', (event) => {
			let newValue = parseInt(event.target.value);
			if (isNaN(newValue)) {
				showToast(`Could not save value - needs to be a number.`);
			} else {
				settings[groupName][propertyName] = newValue;
			}
		});
	}

	if (!settingType) {
		input = makeElement({
			tag: 'input',
			attributes: { type: 'text', value: JSON.parse(JSON.stringify(settingValue)) },
		});

		input.addEventListener('change', (event) => {
			let newValue = JSON.parse(JSON.stringify(event.target.value));
			settings[groupName][propertyName] = newValue;
		});
	}

	if (settingType === 'Boolean') {
		input = makeDirectCheckbox(settings[groupName], propertyName);
	} else {
		type = makeElement({
			tag: 'pre',
			innerHTML: settingType || 'Text',
			title: `Expected value type`,
		});
	}

	if (settingType === 'Read only') {
		input = makeElement({
			innerHTML: settingValue,
		});
	}

	let info;
	if (thisSetting?.description) {
		info = makeElement({
			tag: 'info-bubble',
			innerHTML: thisSetting?.description || `${groupName}.${propertyName}`,
		});

		if (thisSetting?.example) {
			info.innerHTML += `
			<h4>Example</h4>
			${thisSetting.example}
			`;
		}
	} else {
		info = textToNode('<span></span>');
	}

	return [label, info, input, type];
}

// --------------------------------------------------------------
// Current Ranges
// --------------------------------------------------------------

function makeCurrentRangesTable() {
	const rangeTable = makeElement({
		tag: 'div',
		className: 'glyph-range-table__list-area',
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
		textToNode('<span class="list__column-header">&nbsp;</span>'),
	]);

	getCurrentProject().settings.project.glyphRanges.forEach((range) => {
		addAsChildren(rangeTable, [
			textToNode(`<span>${range.name}</span>`),
			textToNode(`<code>${decToHex(range.begin)}</code>`),
			textToNode(`<code>${decToHex(range.end)}</code>`),
			textToNode(`<a>Edit</a>`),
		]);
	});

	return rangeTable;
}

function updateCurrentRangesTable() {
	const wrapper = document.querySelector('.glyph-range-table__wrapper');
	wrapper.innerHTML = '';
	addAsChildren(wrapper, makeCurrentRangesTable());
}

// --------------------------------------------------------------
// Edit Range or Add Custom Range
// --------------------------------------------------------------
function showCustomGlyphRangeDialog(rangeIndex) {
	rangeIndex = parseInt(rangeIndex);
	const isNew = isNaN(rangeIndex);

	const content = makeElement({
		className: 'glyph-range-editor__wrapper',
		innerHTML: `<h1>${isNew ? 'Add' : 'Edit'} glyph range</h1>`,
	});

	const inputName = makeElement({ tag: 'input', attributes: { type: 'text' } });
	const inputBegin = makeElement({ tag: 'input', attributes: { type: 'text' } });
	const inputEnd = makeElement({ tag: 'input', attributes: { type: 'text' } });

	if (!isNew) {
		let range = getCurrentProject().settings.project.glyphRanges[rangeIndex];
		inputName.value = range.name;
		inputBegin.value = '' + decToHex(range.begin);
		inputEnd.value = '' + decToHex(range.end);
	}

	const buttonBar = makeElement({ className: 'glyph-range-editor__footer' });

	const buttonSave = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Save',
	});

	const buttonCancel = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		innerHTML: 'Cancel',
		onClick: closeAllDialogs,
	});

	const buttonRemove = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '', danger: '' },
		innerHTML: 'Remove range',
	});

	addAsChildren(buttonBar, [buttonSave, buttonCancel, textToNode('<span></span>'), buttonRemove]);

	addAsChildren(content, [
		textToNode('<label>Range name</label>'),
		inputName,
		textToNode('<label>Start</label>'),
		inputBegin,
		textToNode('<label>End</label>'),
		inputEnd,
		buttonBar,
	]);

	showModalDialog(content, 500);
}

// --------------------------------------------------------------
// Range Chooser
// --------------------------------------------------------------

function showUnicodeGlyphRangeDialog() {
	const content = makeElement({
		className: 'glyph-range-chooser__wrapper',
		innerHTML: `
			<h1>Add glyph ranges from Unicode</h1>
			<h3>Preview</h3>
			<h3>Blocks</h3>
			<div class="glyph-range-chooser__preview-area">
				<div class="glyph-range-chooser__preview">
					Select a glyph range from the right to preview it here.
				</div>
				<h4 id="glyph-range-chooser__preview-selected"></h4>
				<fancy-button id="glyph-range-chooser__add-button">Add range to project</fancy-button>
			</div>
			<div class="glyph-range-chooser__list-area"></div>
		`,
	});

	const listArea = content.querySelector('.glyph-range-chooser__list-area');

	addAsChildren(listArea, [
		textToNode('<span class="list__column-header">Range name</span>'),
		textToNode('<span class="list__column-header">Start</span>'),
		textToNode('<span class="list__column-header">End</span>'),
	]);

	let rowWrapper;
	unicodeBlocks.forEach((block) => {
		rowWrapper = makeElement({
			className: 'list__row-wrapper',
			onClick: () => {
				previewGlyphRange(block);
			},
		});

		addAsChildren(rowWrapper, [
			textToNode(`<span>${block.name}</span>`),
			textToNode(`<code>${decToHex(block.begin)}</code>`),
			textToNode(`<code>${decToHex(block.end)}</code>`),
		]);

		addAsChildren(listArea, rowWrapper);
	});

	showModalDialog(content);
}

function previewGlyphRange(range) {
	const previewArea = document.querySelector('.glyph-range-chooser__preview');
	document.querySelector('#glyph-range-chooser__preview-selected').innerHTML = range.name;
	document.querySelector('#glyph-range-chooser__add-button').addEventListener('click', () => {
		addGlyphRange(range);
	});
	previewArea.innerHTML = '';

	let hexString;
	let name;
	for (let g = range.begin; g <= range.end; g++) {
		hexString = decToHex(g);
		name = getUnicodeName(hexString);
		previewArea.appendChild(
			makeElement({
				className: 'glyph-range-chooser__preview-tile',
				title: `${hexString}\n${name}`,
				innerHTML: hexToChars(g),
			})
		);
	}
}

function addGlyphRange(range) {
	if (isGlyphRangeUnique(range)) {
		getCurrentProject().settings.project.glyphRanges.push(range);
		updateCurrentRangesTable();
		showToast(`Added ${range.name} to your project.`);
	} else {
		showToast(`Glyph range is already added to your project.`);
	}
}

function isGlyphRangeUnique(range) {
	const ranges = getCurrentProject().settings.project.glyphRanges;

	for (let r = 0; r < ranges.length; r++) {
		if (ranges[r].begin === range.begin && ranges[r].end === range.end) return false;
	}

	return true;
}
