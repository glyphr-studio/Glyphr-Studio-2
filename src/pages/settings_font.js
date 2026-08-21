import { getCurrentProject } from '../app/main';
import { addAsChildren, makeElement, textToNode } from '../common/dom';
import { closeEveryTypeOfDialog, showModalDialog } from '../controls/dialogs/dialogs';
import { panoseData } from '../lib/panose';
import { makeOneSettingsRow } from './settings';
import { settingsText } from './settings_i18n.js';

let workingPanoseValue;
/**
 * Makes the content for the Settings > Font tab
 * @returns {Element}
 */
export function makeSettingsTabContentFont() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content settings-table',
		id: 'tab-content__font',
		innerHTML: `
			<h1>${settingsText('chrome.fontMetadataTitle')}</h1>
			<p>${settingsText('chrome.fontMetadataBody')}</p>
		`,
	});

	addAsChildren(tabContent, [
		makeOneSettingsRow('font', 'family'),
		makeOneSettingsRow('font', 'style'),
		makeOneSettingsRow('font', 'version'),
		makeOneSettingsRow('font', 'description'),
		makeOneSettingsRow('font', 'panose'),
		makePanoseLauncherRow(),
		textToNode(`<h2>${settingsText('chrome.fontMetricsTitle')}</h2>`),
		textToNode(`<h3>${settingsText('chrome.keyMetricsTitle')}</h3>`),
		makeOneSettingsRow('font', 'upm'),
		makeOneSettingsRow('font', 'ascent'),
		makeOneSettingsRow('font', 'descent'),
		makeOneSettingsRow('font', 'capHeight'),
		makeOneSettingsRow('font', 'xHeight'),
		textToNode(`<h3>${settingsText('chrome.otherMetricsTitle')}</h3>`),
		makeOneSettingsRow('font', 'overshoot'),
		makeOneSettingsRow('font', 'lineGap'),
		makeOneSettingsRow('font', 'weight'),
		makeOneSettingsRow('font', 'stretch'),
		makeOneSettingsRow('font', 'italicAngle'),
		makeOneSettingsRow('font', 'underlinePosition'),
		makeOneSettingsRow('font', 'underlineThickness'),
		textToNode(`<h2>${settingsText('chrome.linksTitle')}</h2>`),
		makeOneSettingsRow('font', 'designer'),
		makeOneSettingsRow('font', 'designerURL'),
		makeOneSettingsRow('font', 'manufacturer'),
		makeOneSettingsRow('font', 'manufacturerURL'),
		makeOneSettingsRow('font', 'license'),
		makeOneSettingsRow('font', 'licenseURL'),
		makeOneSettingsRow('font', 'copyright'),
		makeOneSettingsRow('font', 'trademark'),
		textToNode(`<h2>${settingsText('chrome.svgPropertiesTitle')}</h2>`),
		makeOneSettingsRow('font', 'variant'),
		makeOneSettingsRow('font', 'stemv'),
		makeOneSettingsRow('font', 'stemh'),
		makeOneSettingsRow('font', 'slope'),
		makeOneSettingsRow('font', 'strikethroughPosition'),
		makeOneSettingsRow('font', 'strikethroughThickness'),
		makeOneSettingsRow('font', 'overlinePosition'),
		makeOneSettingsRow('font', 'overlineThickness'),
	]);

	return tabContent;
}

/**
 * Special settings row for the PANOSE launcher
 * @returns {Array}
 */
function makePanoseLauncherRow() {
	const button = makeElement({ tag: 'a', content: settingsText('chrome.launchPanoseBuilder') });
	button.addEventListener('click', showPanoseBuilderDialog);
	return [
		textToNode('<span></span>'),
		textToNode('<span></span>'),
		button,
		textToNode('<span></span>'),
	];
}

/**
 * Makes and shows the PANOSE builder dialog
 */
function showPanoseBuilderDialog() {
	workingPanoseValue = getCurrentProject().settings.font.panose.split(' ');
	let dialogWrapper = makeElement({
		innerHTML: `
			<h1>${settingsText('chrome.panoseBuilderTitle')}</h1>
			<p>${settingsText('chrome.panoseBuilderBody')}</p>
			<div class="settings-page__panose-builder-table">
				<div class="list__column-header">${settingsText('chrome.panoseValueCol')}</div>
				<div class="list__column-header">${settingsText('chrome.panoseNameCol')}</div>
				<div class="list__column-header">${settingsText('chrome.panoseOptionsCol')}</div>

				<div id="panose-0-value" class="panose-value">#</div>
				<div id="panose-0-name" class="panose-name">${settingsText('chrome.familyKind')}</div>
				<option-chooser id="panose-0-chooser"></option-chooser>

				<div id="panose-1-value" class="panose-value">#</div>
				<div id="panose-1-name" class="panose-name"></div>
				<option-chooser id="panose-1-chooser"></option-chooser>

				<div id="panose-2-value" class="panose-value">#</div>
				<div id="panose-2-name" class="panose-name"></div>
				<option-chooser id="panose-2-chooser"></option-chooser>

				<div id="panose-3-value" class="panose-value">#</div>
				<div id="panose-3-name" class="panose-name"></div>
				<option-chooser id="panose-3-chooser"></option-chooser>

				<div id="panose-4-value" class="panose-value">#</div>
				<div id="panose-4-name" class="panose-name"></div>
				<option-chooser id="panose-4-chooser"></option-chooser>

				<div id="panose-5-value" class="panose-value">#</div>
				<div id="panose-5-name" class="panose-name"></div>
				<option-chooser id="panose-5-chooser"></option-chooser>

				<div id="panose-6-value" class="panose-value">#</div>
				<div id="panose-6-name" class="panose-name"></div>
				<option-chooser id="panose-6-chooser"></option-chooser>

				<div id="panose-7-value" class="panose-value">#</div>
				<div id="panose-7-name" class="panose-name"></div>
				<option-chooser id="panose-7-chooser"></option-chooser>

				<div id="panose-8-value" class="panose-value">#</div>
				<div id="panose-8-name" class="panose-name"></div>
				<option-chooser id="panose-8-chooser"></option-chooser>

				<div id="panose-9-value" class="panose-value">#</div>
				<div id="panose-9-name" class="panose-name"></div>
				<option-chooser id="panose-9-chooser"></option-chooser>
			</div>
			<br><br>
			<fancy-button id="panose-builder__save-button">${settingsText('chrome.save')}</fancy-button>
			<fancy-button id="panose-builder__cancel-button" secondary>${settingsText(
				'cancel'
			)}</fancy-button>
	`,
	});

	dialogWrapper.querySelector('#panose-builder__save-button').addEventListener('click', () => {
		// log(`panose builder Save button`, 'start');
		let result = workingPanoseValue.join(' ');
		// log(`result: ${result}`);
		getCurrentProject().settings.font.panose = result;
		/** @type {HTMLInputElement} */
		const setting = document.querySelector('#settings-page-input__font-panose');
		setting.value = result;
		closeEveryTypeOfDialog();
		// log(`panose builder Save button`, 'end');
	});
	dialogWrapper
		.querySelector('#panose-builder__cancel-button')
		.addEventListener('click', closeEveryTypeOfDialog);

	showModalDialog(dialogWrapper, 600);
	refreshPanoseBuilderTable();
}

/**
 * Refreshes the PANOSE builder table
 */
function refreshPanoseBuilderTable() {
	// log(`refreshPanoseBuilderTable`, 'start');
	// log(workingPanoseValue);
	while (workingPanoseValue.length < 10) workingPanoseValue.push('0');
	// log(workingPanoseValue);
	let familyData = panoseData[workingPanoseValue[0]];
	let rowValue, rowName, chooser, rowSelectedValue;

	// Update Rows
	for (let row = 0; row < 10; row++) {
		// log(`row: ${row}`);
		// log(`workingPanoseValue[row]: ${workingPanoseValue[row]}`);
		rowValue = document.getElementById(`panose-${row}-value`);
		rowValue.innerHTML = workingPanoseValue[row];
		if (row === 0) {
			document.getElementById(`panose-0-name`).innerHTML = settingsText('chrome.familyKind');
			chooser = document.getElementById(`panose-0-chooser`);
			chooser.innerHTML = '';
			addAsChildren(chooser, makePanoseOptions(panoseData.map((value) => value.name)));
			rowSelectedValue = panoseData[workingPanoseValue[0]].name;
			chooser.setAttribute('selected-name', rowSelectedValue);
			chooser.setAttribute('selected-id', `${rowSelectedValue} ${workingPanoseValue[0]}`);
		} else {
			chooser = document.getElementById(`panose-${row}-chooser`);
			chooser.innerHTML = '';
			rowName = '';
			rowSelectedValue = '';
			if (familyData?.values?.at(row - 1)) {
				chooser.removeAttribute('disabled');
				rowName = familyData.values[row - 1].name;
				addAsChildren(chooser, makePanoseOptions(familyData.values[row - 1].values, row));
				rowSelectedValue = familyData.values[row - 1].values[workingPanoseValue[row]];
				if (rowSelectedValue === 'No Fit') {
					rowValue.innerHTML = '1';
					workingPanoseValue[row] = 1;
				}
				chooser.setAttribute('selected-name', rowSelectedValue);
				chooser.setAttribute('selected-id', `${rowSelectedValue} ${workingPanoseValue[row]}`);

				if (familyData.values[row - 1].values.length === 1) {
					chooser.setAttribute('disabled', '');
				}
			} else {
				chooser.setAttribute('disabled', '');
				chooser.setAttribute('selected-name', '');
				chooser.setAttribute('selected-id', '');
			}
			document.getElementById(`panose-${row}-name`).innerHTML = rowName;
		}
	}

	function makePanoseOptions(options, position = 0) {
		// log(`makePanoseOptions`, 'start');
		// log(`\n⮟options⮟`);
		// log(options);
		let result = [];
		options.forEach((value, index) => {
			value = value || value.name;
			// log(`value: ${value}`);
			// log(`index: ${index}`);
			let option = makeElement({
				tag: 'option',
				innerHTML: value,
				attributes: { note: value === 'No Fit' ? 1 : index },
			});
			option.addEventListener('click', () => {
				if (position === 0) {
					if (index === 0) {
						workingPanoseValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					} else if (index === 1) {
						// log(`Setting to all 1s`);
						workingPanoseValue = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
					} else {
						workingPanoseValue = [index, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					}
				} else {
					workingPanoseValue[position] = index;
				}
				refreshPanoseBuilderTable();
			});
			result.push(option);
		});

		// log(`makePanoseOptions`, 'end');
		return result;
	}
	// log(`refreshPanoseBuilderTable`, 'end');
}
