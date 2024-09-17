import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { TabControl } from '../controls/tabs/tab_control.js';
import { makeDirectCheckbox } from '../panels/cards.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { makeSettingsTabContentApp } from './settings_app.js';
import settingsMap from './settings_data.js';
import { makeSettingsTabContentFont } from './settings_font.js';
import { makeSettingsTabContentProject } from './settings_project.js';

/**
 * Page > Settings
 * One place to edit all the settings for Glyphr Studio.
 * @returns {Element} - page content
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

	const tabControl = new TabControl(rightArea);

	tabControl.registerTab('Project', makeSettingsTabContentProject);
	tabControl.registerTab('Font', makeSettingsTabContentFont);
	tabControl.registerTab('App', makeSettingsTabContentApp);

	addAsChildren(panelArea, tabControl.makeTabs());
	tabControl.selectTab('Project');

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	return content;
}

// --------------------------------------------------------------
// Individual settings
// --------------------------------------------------------------
/**
 * Centralized way to make one row in a settings table.
 * @param {String} groupName - section
 * @param {String} propertyName - property
 * @param {Function =} callback - called after a change
 * @returns {Array}
 */
export function makeOneSettingsRow(groupName, propertyName, callback) {
	// log(`makeOneSettingsRow`, 'start');
	// log(`groupName: ${groupName}`);
	// log(`propertyName: ${propertyName}`);
	const settings = getCurrentProject().settings;
	const thisSetting = settingsMap[groupName][propertyName];
	const settingType = thisSetting?.type;
	const settingValue = settings[groupName][propertyName];
	// log(`thisSetting: ${thisSetting}`);
	// log(`settingValue: ${settingValue}`);

	let displayLabel = thisSetting.label;
	displayLabel = displayLabel.replaceAll(' ', '&nbsp;');
	displayLabel = displayLabel.replaceAll('-', '&#8209;');
	displayLabel = `${displayLabel}:&emsp;`;

	const label = makeElement({
		className: 'settings__label',
		innerHTML: displayLabel,
	});

	let type = textToNode('<span></span>');
	let input;

	if (settingType === 'Degree' || settingType === 'Em' || settingType === 'Number') {
		input = makeElement({
			tag: 'input-number',
			attributes: { value: parseInt(settingValue) },
		});

		input.addEventListener('change', (event) => {
			// @ts-ignore
			let newValue = parseInt(event.target.value);
			if (isNaN(newValue)) {
				showToast(`Could not save value - needs to be a number.`);
			} else {
				settings[groupName][propertyName] = newValue;
			}
			if (callback) callback();
		});
	}

	if (!settingType) {
		input = makeElement({
			tag: 'input',
			attributes: { type: 'text', value: sanitizeValueWithJSON(settingValue) },
		});

		input.addEventListener('change', (event) => {
			// @ts-ignore
			let newValue = sanitizeValueWithJSON(event.target.value);
			settings[groupName][propertyName] = newValue;
			if (callback) callback();
		});
	}

	if (settingType === 'Boolean') {
		input = makeDirectCheckbox(settings[groupName], propertyName, callback);
		if (propertyName === 'showNonCharPoints') {
			input.addEventListener('change', (event) => {
				const project = getCurrentProject();
				// log(`Clearing all Character Range Caches`);
				// log(`\n⮟project.settings.project.characterRanges⮟`);
				// log(project.settings.project.characterRanges);
				project.settings.project.characterRanges.forEach((range) => {
					range.cachedArray = false;
				});
				getCurrentProjectEditor().selectedCharacterRange.cachedArray = false;
			});
		}
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
			className: 'settings_read-only-value',
		});
	}

	input.setAttribute('id', `settings-page-input__${groupName}-${propertyName}`);

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

	// log(`makeOneSettingsRow`, 'end');
	return [label, info, input, type];
}

/**
 * Use JSON stringify / parse to sanitize input.
 * @param {String} input - input from a form field
 * @returns {String}
 */
function sanitizeValueWithJSON(input) {
	let j = JSON.stringify(input);

	if (j) {
		let p = JSON.parse(j);
		return p || '';
	}

	return '';
}
