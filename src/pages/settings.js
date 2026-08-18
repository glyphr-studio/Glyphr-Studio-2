import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { editorText } from '../app/editor_i18n.js';
import { makeElement, textToNode } from '../common/dom.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { makeDirectCheckbox } from '../panels/cards.js';
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
	const content = makeElement({ tag: 'div', id: 'app__page', className: 'settings-workspace' });
	content.innerHTML = `
		<header class="editor-content-header">
			<div><span>${editorText('settings')}</span><h1>${editorText('settings')}</h1></div>
		</header>
		<div class="settings-workspace__layout">
			<nav class="settings-workspace__tabs liquid-glass" aria-label="${editorText('settings')}"></nav>
			<section class="settings-workspace__content liquid-glass"></section>
		</div>`;

	const tabArea = content.querySelector('.settings-workspace__tabs');
	const panelArea = content.querySelector('.settings-workspace__content');
	const tabs = [
		{
			key: 'project',
			label: editorText('projectSettings'),
			makeContent: makeSettingsTabContentProject,
		},
		{ key: 'font', label: editorText('fontSettings'), makeContent: makeSettingsTabContentFont },
		{ key: 'app', label: editorText('appSettings'), makeContent: makeSettingsTabContentApp },
	];

	const selectTab = (selectedKey) => {
		tabArea.querySelectorAll('button').forEach((button) => {
			const selected = button.dataset.settingsTab === selectedKey;
			button.classList.toggle('settings-workspace__tab--selected', selected);
			button.setAttribute('aria-selected', String(selected));
		});
		const selectedTab = tabs.find((tab) => tab.key === selectedKey) || tabs[0];
		panelArea.replaceChildren(selectedTab.makeContent());
	};

	tabs.forEach((tab) => {
		const button = makeElement({ tag: 'button', content: tab.label });
		button.dataset.settingsTab = tab.key;
		button.setAttribute('type', 'button');
		button.setAttribute('role', 'tab');
		button.addEventListener('click', () => selectTab(tab.key));
		tabArea.appendChild(button);
	});
	selectTab('project');
	if (getCurrentProjectEditor().showPageTransitions) content.classList.add('app__page-animation');
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
 * @param {Boolean =} inputFirst - switch the order of the label / input
 * @returns {Array}
 */
export function makeOneSettingsRow(groupName, propertyName, callback, inputFirst = false) {
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
	displayLabel = `${displayLabel}${inputFirst ? '' : ':&emsp;'}`;

	const label = makeElement({
		tag: 'label',
		className: 'settings__label',
		innerHTML: displayLabel,
	});

	let type = textToNode('<span></span>');
	let input;
	const saveChange = () => {
		const editor = getCurrentProjectEditor();
		editor.setProjectAsUnsaved();
		if (settings.app.autoSave || propertyName === 'autoSave') {
			void getGlyphrStudioApp().addAutoSaveState(editor.project);
		}
	};

	if (settingType === 'Degree' || settingType === 'Em' || settingType === 'Number') {
		input = makeElement({
			tag: 'input-number',
			attributes: { value: parseInt(settingValue) },
		});

		input.addEventListener('change', (event) => {
			// @ts-expect-error 'property does exist'
			let newValue = parseInt(event.target.value);
			if (isNaN(newValue)) {
				showToast(`Could not save value - needs to be a number.`);
			} else {
				settings[groupName][propertyName] = newValue;
				saveChange();
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
			// @ts-expect-error 'property does exist'
			let newValue = sanitizeValueWithJSON(event.target.value);
			settings[groupName][propertyName] = newValue;
			saveChange();
			if (callback) callback();
		});
	}

	if (settingType === 'Boolean') {
		input = makeDirectCheckbox(settings[groupName], propertyName, (newValue) => {
			if (callback) callback(newValue);
			saveChange();
		});
		if (propertyName === 'showNonCharPoints') {
			input.addEventListener('change', () => {
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
			className: 'value-type',
		});
	}

	if (settingType === 'Read only') {
		input = makeElement({
			innerHTML: settingValue,
			className: 'settings_read-only-value',
		});
	}

	input.setAttribute('id', `settings-page-input__${groupName}-${propertyName}`);
	label.setAttribute('for', `settings-page-input__${groupName}-${propertyName}`);

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

	const row = makeElement({ tag: 'div', className: 'settings-row' });
	if (inputFirst) row.classList.add('settings-row--input-first');
	const copy = makeElement({ tag: 'div', className: 'settings-row__copy' });
	copy.append(label, info);
	const control = makeElement({ tag: 'div', className: 'settings-row__control' });
	control.append(input, type);
	row.append(copy, control);

	// log(`makeOneSettingsRow`, 'end');
	return [row];
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
