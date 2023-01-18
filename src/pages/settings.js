import { getCurrentProject } from '../app/main.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { decToHex, getUnicodeName, hexToChars } from '../common/unicode.js';
import { showModalDialog, showToast } from '../controls/dialogs.js';
import { unicodeBlocks } from '../lib/unicode_blocks.js';
import { makeDirectCheckbox } from '../panels/cards.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';

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

	const gridArea = makeElement({
		tag: 'div',
		className: 'settings-table',
	});

	addAsChildren(gridArea, [
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
				<br>
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
		onClick: () => {
			showModalDialog(
				textToNode(`
				<h1>Add custom glyph range</h1>
				`)
			);
		},
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
		makeCurrentRangesTable(),
	]);

	addAsChildren(tabContent, [gridArea, rangesArea]);

	return tabContent;
}

function makeCurrentRangesTable() {
	const rangeTable = makeElement({
		tag: 'div',
		className: 'glyph-range-table',
	});

	addAsChildren(rangeTable, [
		textToNode('<span class="header">Range name</span>'),
		textToNode('<span class="header">Start</span>'),
		textToNode('<span class="header">End</span>'),
		textToNode('<span class="header">&nbsp;</span>'),
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

function showUnicodeGlyphRangeDialog() {
	const content = makeElement({
		innerHTML: `
		<div class="glyph-range-chooser__wrapper">
			<h1>Add glyph ranges from Unicode</h1>
			<h3>Preview</h3>
			<h3>Blocks</h3>
			<div class="glyph-range-chooser__preview-area">
				<div class="glyph-range-chooser__preview">
					Select a glyph range from the right to preview it here.
				</div>
				<fancy-button>Save</fancy-button>
			</div>
			<div class="glyph-range-chooser__list-area">
				<div class="header">Range&nbsp;name</div>
				<div class="header">Begin</div>
				<div class="header">End</div>
				<div class="header">&nbsp;</div>
				<div class="header">&nbsp;</div>
			</div>
		</div>
	`,
	});

	const listArea = content.querySelector('.glyph-range-chooser__list-area');

	let previewLink;
	let addLink;
	unicodeBlocks.forEach((block) => {
		previewLink = makeElement({
			tag: 'a',
			innerHTML: 'Preview',
			onClick: () => {
				previewGlyphRange(block);
			},
		});

		addLink = makeElement({
			tag: 'a',
			innerHTML: 'Add',
			onClick: () => {
				addGlyphRange(block);
			},
		});

		addAsChildren(listArea, [
			textToNode(`<span>${block.name}</span>`),
			textToNode(`<code>${decToHex(block.begin)}</code>`),
			textToNode(`<code>${decToHex(block.end)}</code>`),
			previewLink,
			addLink,
		]);
	});

	showModalDialog(content);
}

function previewGlyphRange(range) {
	const previewArea = document.querySelector('.glyph-range-chooser__preview');
	previewArea.innerHTML = '';

	let hexString;
	let name;
	for (let g = range.begin; g <= range.end; g++) {
		hexString = decToHex(g);
		name = getUnicodeName(hexString);
		previewArea.appendChild(makeElement({
			className: 'glyph-range-chooser__preview-tile',
			title: `${hexString}\n${name}`,
			innerHTML: hexToChars(g)
		}));
	}
}

function addGlyphRange(range) {
	getCurrentProject().settings.project.glyphRanges.push(range);
	showToast(`Added ${range.name} to this project.`);
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
// Data for each setting
// --------------------------------------------------------------

const settingsMap = {
	project: {
		name: {
			label: `Project name`,
			description: `Name for this project. Can be different than the Font or Font Family name.`,
		},
		latestVersion: {
			label: 'Version',
			description: 'The latest app version that edited this project file.',
			type: 'Read only',
		},
		initialVersion: {
			label: 'Initial version',
			description: 'The app version this project file was first created with.',
			type: 'Read only',
		},
		id: {
			label: 'Project ID',
			description: 'A unique ID used to identify this project.',
			type: 'Read only',
		},
	},
	app: {
		savePreferences: {
			label: `Save app preferences locally`,
			description: `App preferences can be saved locally to your computer, then loaded automatically when you come back to this project.`,
			type: 'Boolean',
		},
		stopPageNavigation: {
			label: `Warn about unsaved changes on window close`,
			description: `This will stop closing the window or tab with an "Are you sure?" message if you have unsaved changes.`,
			type: 'Boolean',
		},
		showNonCharPoints: {
			label: `Show non-glyph characters`,
			description: `Show the Unicode code points represent things that aren't letters. These are characters that have no visible shapes and no advance width. They can probably be safely ignored.`,
			type: 'Boolean',
		},
		formatSaveFile: {
			label: `Format project file for reading`,
			description: `Glyphr Studio Project files (.gs2) are text files in JSON format. By default, this file is saved to optimize for smaller file size. Setting this option to true formats the file to be more easily read by a human, but could increase the file size by 2x or more.`,
			type: 'Boolean',
		},
		combinePathsOnExport: {
			label: `Combine paths on export`,
			description: `This will boolean-combine all paths before a font is exported. This may make the exported font perform better, but it will drastically increase export time.`,
			type: 'Boolean',
		},
		maxCombinePathsOnExport: {
			label: `Max paths to combine on export`,
			description: `Limit the total number of paths in a glyph to combine on export. This will only take effect if the "Combine paths on export" setting is true.`,
			type: 'Number',
		},
	},
	font: {
		family: {
			label: `Font family`,
			description: `Base font family name, that will be shared across font styles.`,
		},
		style: {
			label: `Font style`,
			description: `Describes this font within the overall font family. Usually a combination of how bold this font is and if it is italic.`,
			example: `Thin, ExtraLight, Light, <strong>Regular</strong>, Medium, SemiBold, <strong>Bold</strong>, ExtraBold, Black <br><br>Thin&nbsp;Italic, ExtraLight&nbsp;Italic, Light&nbsp;Italic, <strong>Italic</strong>, Medium&nbsp;Italic, SemiBold&nbsp;Italic, Bold&nbsp;Italic, ExtraBold&nbsp;Italic, Black&nbsp;Italic`,
		},
		version: {
			label: `Font version`,
			description: `If this font gets updates regularly, keep track of what version this iteration is. This is recommended to be in Semantic Versioning format, you can learn more at <a href="https://semver.org/">semver.org</a>.`,
			example: `Version 1.0.0`,
		},
		description: {
			label: `Font description`,
			description: `Open-ended text to describe your font.`,
		},
		panose: {
			label: `Panose-1`,
			description: `Uses ten digits to describe the font's visual style.  A good overview can be found on Monotype's GitHub page: <a href="https://monotype.github.io/panose/pan2.htm" target="_blank">monotype.github.io/panose/pan2.htm</a><br>Each digit of the ten digits is separated by a space, and has a special meaning based on its position.`,
			example: `<strong>0 0 0 0 0 0 0 0 0 0</strong><br>All zeros describe this font as 'any', which basically leaves it undefined.
			<br><br>
			<strong>2 0 0 0 0 0 0 0 0 0</strong><br>The first digit is the major designator, where digit 2 represents Latin typefaces.`,
		},
		// Key metrics
		upm: {
			label: `Units per Em (UPM)`,
			description: `UPM is the measure of the overall design space for a character in this font. Think of UPM like how many pixels of height you have to work with for each character. UPM can be any number, but traditionally it is either 1000 or 2048.`,
			example: `1000, 2048`,
			type: 'Em',
		},
		ascent: {
			label: `Ascent`,
			description: `Distance from the baseline to the top of square and tall lowercase letters (Like: b d h k l).`,
			type: 'Em',
		},
		descent: {
			label: `Descent`,
			description: `Distance from the baseline to the bottom of letters that have square descenders (Like: p q y depending on style). This is expressed as a negative number.`,
			type: 'Em',
		},
		capHeight: {
			label: `Capital letter height`,
			description: `Distance from the baseline to the top of square capital letters (Like: A B D E F H I K L M N P R T U V W X Y Z). Usually this is slightly smaller than the ascent.`,
			type: 'Em',
		},
		xHeight: {
			label: `X height`,
			description: `Distance from the baseline to the top of square lowercase letters (Like: v w x z).`,
			type: 'Em',
		},
		overshoot: {
			label: `Overshoot`,
			description: `Rounded characters are usually slightly larger than square characters to compensate for visual weight. For example, a lowercase 'o' will extend slightly above and below a lowercase 'x'. Overshoot is the measure of this distance.`,
			type: 'Em',
		},
		lineGap: {
			label: `Line gap`,
			description: `When text wraps onto multiple lines, this is the distance between the bottom of one Em Square to the top of the next line's Em Square.`,
			type: 'Em',
		},
		italicAngle: {
			label: `Italic angle`,
			description: `Most common degree of slant for glyphs in an italic font.`,
			type: 'Degree',
		},
		// Links
		designer: { label: `Designer`, description: `Person or team who created this font.` },
		designerURL: { label: `Designer's URL`, description: `` },
		manufacturer: { label: `Manufacturer`, description: `Company who created this font.` },
		manufacturerURL: { label: `Manufacturer's URL`, description: `` },
		license: { label: `License`, description: `License under which this font is released.` },
		licenseURL: { label: `License URL`, description: `` },
		copyright: { label: `Copyright`, description: `` },
		trademark: { label: `Trademark`, description: `` },
		// SVG Font properties
		variant: { label: `Font variant`, description: `Either 'normal' or 'small-caps'.` },
		weight: {
			label: `Font weight`,
			description: `How bold this font is. Can be 'normal', 'bold', or a number between 100 and 900.`,
		},
		stretch: {
			label: `Font stretch`,
			description: `How condensed or expanded this font is.`,
			example: `normal, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded`,
		},
		stemv: {
			label: `Vertical stem`,
			description: `Most common width measurement of vertical stems in this font.`,
			type: 'Em',
		},
		stemh: {
			label: `Horizontal stem`,
			description: `Most common height measurement of horizontal stems in this font.`,
			type: 'Em',
		},
		slope: {
			label: `Slope`,
			description: `The angle, in degrees counterclockwise from the vertical, of the dominant vertical strokes of the font. The value is negative for fonts that slope to the right.`,
			type: 'Degree',
		},
		underlinePosition: {
			label: `Underline position`,
			description: `The ideal position of an underline with relation to the baseline (probably should be negative).`,
			type: 'Em',
		},
		underlineThickness: {
			label: `Underline thickness`,
			description: `The ideal height of an underline.`,
			type: 'Em',
		},
		strikethroughPosition: {
			label: `Strikethrough position`,
			description: `The ideal position of a strikethrough with relation to the baseline.`,
			type: 'Em',
		},
		strikethroughThickness: {
			label: `Strikethrough thickness`,
			description: `The ideal height of a strikethrough.`,
			type: 'Em',
		},
		overlinePosition: {
			label: `Overline position`,
			description: `The ideal position of an overline with relation to the baseline.`,
			type: 'Em',
		},
		overlineThickness: {
			label: `Overline thickness`,
			description: `The ideal height of an overline.`,
			type: 'Em',
		},
	},
};
