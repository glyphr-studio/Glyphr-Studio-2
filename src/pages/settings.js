import { getCurrentProject } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
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

	selectTab(content, 'Font');

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
	const md = getCurrentProject().metadata;

	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__font',
		innerHTML: '<h1>Font metadata</h1>',
	});

	const description = makeElement({
		tag: 'p',
		innerHTML: `These properties will be exported with any font you save, and will be used around Glyphr Studio while you are making edits.`,
	});

	const headerKeyMetrics = makeElement({
		tag: 'h2',
		innerHTML: 'Key metrics',
	});

	const headerOtherLinks = makeElement({
		tag: 'h2',
		innerHTML: 'Other links',
	});

	const headerSVG = makeElement({
		tag: 'h2',
		innerHTML: 'Properties for SVG Fonts',
	});

	addAsChildren(tabContent, [
		description,
		makeOneSettingsRow('font', 'family'),
		makeOneSettingsRow('font', 'style'),
		makeOneSettingsRow('font', 'version'),
		makeOneSettingsRow('font', 'description'),
		makeOneSettingsRow('font', 'panose'),
		headerKeyMetrics,
		makeOneSettingsRow('font', 'upm'),
		makeOneSettingsRow('font', 'ascent'),
		makeOneSettingsRow('font', 'descent'),
		makeOneSettingsRow('font', 'capHeight'),
		makeOneSettingsRow('font', 'xHeight'),
		makeOneSettingsRow('font', 'overshoot'),
		makeOneSettingsRow('font', 'lineGap'),
		makeOneSettingsRow('font', 'italicAngle'),
		headerOtherLinks,
		makeOneSettingsRow('font', 'designer'),
		makeOneSettingsRow('font', 'designerURL'),
		makeOneSettingsRow('font', 'manufacturer'),
		makeOneSettingsRow('font', 'manufacturerURL'),
		makeOneSettingsRow('font', 'license'),
		makeOneSettingsRow('font', 'licenseURL'),
		makeOneSettingsRow('font', 'copyright'),
		makeOneSettingsRow('font', 'trademark'),
		headerSVG,
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

function makeSettingsTabContentProject() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__project',
		innerHTML: '<h1>Project settings</h1>',
	});

	const description = makeElement({
		tag: 'p',
		innerHTML: `These settings affect how this Glyphr Studio Project behaves.`,
	});

	addAsChildren(tabContent, [description]);
	return tabContent;
}

function makeSettingsTabContentApp() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__app',
		innerHTML: '<h1>App preferences</h1>',
	});

	const description = makeElement({
		tag: 'p',
		innerHTML: `These settings adjust how the Glyphr Studio App behaves.`,
	});

	addAsChildren(tabContent, [description]);
	return tabContent;
}

// --------------------------------------------------------------
// Individual settings
// --------------------------------------------------------------
function makeOneSettingsRow(groupName, propertyName) {
	const md = getCurrentProject().metadata;
	const setting = settingsMap[groupName][propertyName];

	const label = makeElement({
		className: 'settings__label',
		innerHTML: `${setting.label.replaceAll(' ', '&nbsp;')}: `,
	});

	let input;
	if (setting?.unit === 'Degree' || setting?.unit === 'Em') {
		input = makeElement({
			tag: 'input-number',
			attributes: { value: md[groupName][propertyName] },
		});
	} else {
		input = makeElement({
			tag: 'input',
			attributes: { type: 'text', value: md[groupName][propertyName] },
		});
	}


	const unit = makeElement({
		tag: 'pre',
		innerHTML: setting?.unit || 'Text',
	});

	const info = makeElement({
		tag: 'info-bubble',
		innerHTML: setting?.description || `${groupName}.${propertyName}`,
	});

	return [label, info, input, unit,];
}

// --------------------------------------------------------------
// Data for each setting
// --------------------------------------------------------------

const settingsMap = {
	name: {
		label: `Project name`,
		description: `Name for this project. Can be different than the Font or Font Family name.`,
	},
	preferences: {
		savePreferences: {
			label: `Save app preferences`,
			description: `App preferences can be saved locally to your computer, then loaded automatically when you come back to this project.`,
		},
		showNonCharPoints: {
			label: `Show non-glyph characters`,
			description: `Hide the Unicode code points represent things that aren't letters.`,
		},
		combinePathsOnExport: {
			label: `Combine paths on export`,
			description: `This will boolean-combine all paths before a font is exported. This may make the exported font perform better, but it will drastically increase export time.`,
		},
		maxCombinePathsOnExport: {
			label: `Max paths to combine on export`,
			description: `Limit the total number of paths in a glyph to combine on export.`,
		},
		stopPageNavigation: {
			label: `Warn about unsaved changes on window close`,
			description: `This will stop closing the window or tab with an "Are you sure?" message if you have unsaved changes.`,
		},
		formatSaveFile: {
			label: `Format project file for reading`,
			description: `Glyphr Studio Project files (.gs2) are text files in JSON format. By default, this file is saved to optimize for smaller file size. This option formats the file to be more easily read by a human, but could increase the file size by 2x or more.`,
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
			examples: `Thin, ExtraLight, Light, <b>Regular</b>, Medium, SemiBold, <b>Bold</b>, ExtraBold, Black, Thin&nbsp;Italic, ExtraLight&nbsp;Italic, Light&nbsp;Italic, <b>Italic</b>, Medium&nbsp;Italic, SemiBold&nbsp;Italic, Bold&nbsp;Italic, ExtraBold&nbsp;Italic, Black&nbsp;Italic`,
		},
		version: {
			label: `Font version`,
			description: `If this font gets updates regularly, keep track of what version this iteration is.`,
			example: `Version 1.0`,
			unit: 'semantic version',
		},
		description: {
			label: `Font description`,
			description: `Open-ended text to describe your font.`,
		},
		panose: {
			label: `Panose-1`,
			description: `Uses ten digits to describe the font's visual style.  A good overview can be found on Monotype's GitHub page: <a href="https://monotype.github.io/panose/pan2.htm" target="_blank">monotype.github.io/panose/pan2.htm</a>`,
		},
		// Key metrics
		upm: {
			label: `Units per Em (UPM)`,
			description: `UPM is the measure of the overall design space for a character in this font. Think of UPM like how many pixels of height you have to work with for each character. UPM can be any number, but traditionally it is either 1000 or 2048.`,
			example: `1000, 2048`,
			unit: 'Em',
		},
		ascent: {
			label: `Ascent`,
			description: `Distance from the baseline to the top of square and tall lowercase letters (Like: b d h k l).`,
			unit: 'Em',
		},
		descent: {
			label: `Descent`,
			description: `Distance from the baseline to the bottom of letters that have square descenders (Like: p q y depending on style). This is expressed as a negative number.`,
			unit: 'Em',
		},
		capHeight: {
			label: `Capital letter height`,
			description: `Distance from the baseline to the top of square capital letters (Like: A B D E F H I K L M N P R T U V W X Y Z). Usually this is slightly smaller than the ascent.`,
			unit: 'Em',
		},
		xHeight: {
			label: `X height`,
			description: `Distance from the baseline to the top of square lowercase letters (Like: v w x z).`,
			unit: 'Em',
		},
		overshoot: {
			label: `Overshoot`,
			description: `Rounded characters are usually slightly larger than square characters to compensate for visual weight. For example, a lowercase 'o' will extend slightly above and below a lowercase 'x'. Overshoot is the measure of this distance.`,
			unit: 'Em',
		},
		lineGap: {
			label: `Line gap`,
			description: `When text wraps onto multiple lines, this is the distance between the bottom of one Em Square to the top of the next line's Em Square.`,
			unit: 'Em',
		},
		italicAngle: {
			label: `Italic angle`,
			description: `Most common degree of slant for glyphs in an italic font.`,
			unit: 'Degree',
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
			unit: 'Em',
		},
		stemh: {
			label: `Horizontal stem`,
			description: `Most common height measurement of horizontal stems in this font.`,
			unit: 'Em',
		},
		slope: {
			label: `Slope`,
			description: `The angle, in degrees counterclockwise from the vertical, of the dominant vertical strokes of the font. The value is negative for fonts that slope to the right.`,
			unit: 'Degree',
		},
		underlinePosition: {
			label: `Underline position`,
			description: `The ideal position of an underline with relation to the baseline (probably should be negative).`,
			unit: 'Em',
		},
		underlineThickness: {
			label: `Underline thickness`,
			description: `The ideal height of an underline.`,
			unit: 'Em',
		},
		strikethroughPosition: {
			label: `Strikethrough position`,
			description: `The ideal position of a strikethrough with relation to the baseline.`,
			unit: 'Em',
		},
		strikethroughThickness: {
			label: `Strikethrough thickness`,
			description: `The ideal height of a strikethrough.`,
			unit: 'Em',
		},
		overlinePosition: {
			label: `Overline position`,
			description: `The ideal position of an overline with relation to the baseline.`,
			unit: 'Em',
		},
		overlineThickness: {
			label: `Overline thickness`,
			description: `The ideal height of an overline.`,
			unit: 'Em',
		},
	},
};
