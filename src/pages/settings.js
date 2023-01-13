import { getCurrentProject } from '../app/main.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
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
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content',
		id: 'tab-content__font',
		innerHTML: '<h1>Font metadata</h1>',
	});

	addAsChildren(tabContent, [
		textToNode(`
		<p>
			These settings will be exported with any font you save, and will be used around Glyphr Studio while you are making edits.
		</p>`),
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
		className: 'settings-page__tab-content',
		id: 'tab-content__app',
		innerHTML: '<h1>App preferences</h1>',
	});

	addAsChildren(tabContent, [
		textToNode(`<p>These settings adjust how the Glyphr Studio App behaves.</p>`),
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
		innerHTML: '<h1>Project settings</h1>',
	});

	addAsChildren(tabContent, [
		textToNode(`<p>These settings affect how this Glyphr Studio Project behaves.</p>`),
		makeOneSettingsRow('project', 'name'),
		makeOneSettingsRow('project', 'latestVersion'),
		makeOneSettingsRow('project', 'initialVersion'),
		makeOneSettingsRow('project', 'id'),
		textToNode('<h2>Glyph ranges</h2>'),
		textToNode(`<p>This is where you can add or remove Unicode glyph ranges to this project. This list affects what glyph ranges are visible on edit pages, and what glyphs get exported to fonts.<br><br>Removing a glyph range <strong>will not</strong> delete individual glyphs from the project.</p>`),
	]);
	return tabContent;
}

// --------------------------------------------------------------
// Individual settings
// --------------------------------------------------------------
function makeOneSettingsRow(groupName, propertyName) {
	const settings = getCurrentProject().settings;
	const setting = settingsMap[groupName][propertyName];

	const label = makeElement({
		className: 'settings__label',
		innerHTML: `${setting.label.replaceAll(' ', '&nbsp;')}: `,
	});

	let input;
	if (setting?.type === 'Degree' || setting?.type === 'Em' || setting?.type === 'Number') {
		input = makeElement({
			tag: 'input-number',
			attributes: { value: settings[groupName][propertyName] },
		});
	} else if (setting?.type === 'Boolean') {
		input = makeElement({
			tag: 'input',
			attributes: { type: 'checkbox' },
		});
		if (settings[groupName][propertyName]) input.setAttribute('checked', '');
	} else if (setting?.type === 'Read only') {
		input = makeElement({
			innerHTML: settings[groupName][propertyName],
		});
	} else {
		input = makeElement({
			tag: 'input',
			attributes: { type: 'text', value: settings[groupName][propertyName] },
		});
	}

	let type = textToNode('<span></span>');
	if (setting?.type !== 'Boolean') {
		type = makeElement({
			tag: 'pre',
			innerHTML: setting?.type || 'Text',
			title: `Expected value type`,
		});
	}

	let info = textToNode('<span></span>');
	if (setting?.description) {
		info = makeElement({
			tag: 'info-bubble',
			innerHTML: setting?.description || `${groupName}.${propertyName}`,
		});

		if (setting?.example) {
			info.innerHTML += `
				<h4>Example</h4>
				${setting.example}
			`;
		}
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
