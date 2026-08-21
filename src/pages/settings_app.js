import { updateWindowUnloadEvent } from '../app/app';
import { getGlyphrStudioApp } from '../app/main';
import { addAsChildren, makeElement, textToNode } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { makeOneSettingsRow } from './settings';
import { settingsText } from './settings_i18n.js';

/**
 * Makes the content for the Settings > App tab
 * @returns {Element}
 */
export function makeSettingsTabContentApp() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content settings-table',
		id: 'tab-content__app',
		innerHTML: `
			<h1>${settingsText('chrome.appPreferencesTitle')}</h1>
			<p>${settingsText('chrome.appPreferencesBody')}</p>
		`,
	});

	addAsChildren(tabContent, [
		textToNode(`<h3>${settingsText('chrome.savingTitle')}</h3>`),
		makeOneSettingsRow('app', 'stopPageNavigation', updateWindowUnloadEvent),
		makeOneSettingsRow('app', 'formatSaveFile'),
		makeOneSettingsRow('app', 'saveLivePreviews'),
		makeOneSettingsRow('app', 'autoSave'),
		textToNode(
			`<label class="settings__label">${settingsText('chrome.deleteAutoSavedLabel')}</label>`
		),
		makeElement({
			tag: 'info-bubble',
			content: settingsText('chrome.deleteAutoSavedInfo'),
		}),
		makeElement({
			tag: 'fancy-button',
			attributes: { danger: '', style: 'height: 24px;' },
			innerHTML: settingsText('chrome.deleteButton'),
			onClick: async () => {
				await getGlyphrStudioApp().clearAutoSaves();
				showToast(settingsText('chrome.autoSavedDeletedToast'));
			},
		}),
		textToNode('<span></span>'),
		textToNode('<br>'),
		textToNode(`<h3>${settingsText('chrome.behaviorTitle')}</h3>`),
		makeOneSettingsRow('app', 'unlinkComponentInstances'),
		makeOneSettingsRow('app', 'directlyDragCurves'),
		textToNode('<br>'),
		textToNode(`<h3>${settingsText('chrome.visibilityTitle')}</h3>`),
		makeOneSettingsRow('app', 'canvasDisplayModeFilled'),
		makeOneSettingsRow('app', 'showNonCharPoints'),
		makeOneSettingsRow('app', 'itemChooserPageSize'),
		makeOneSettingsRow('app', 'previewText'),
		textToNode('<br>'),
		textToNode(`<h3>${settingsText('chrome.importExportTitle')}</h3>`),
		makeOneSettingsRow('app', 'exportLigatures'),
		makeOneSettingsRow('app', 'exportKerning'),
		makeOneSettingsRow('app', 'exportUneditedItems'),
		makeOneSettingsRow('app', 'moveShapesOnSVGDragDrop'),
		makeOneSettingsRow('app', 'autoSideBearingsOnSVGDragDrop'),
		makeOneSettingsRow('app', 'autoRightBearingOnFirstShape'),
		textToNode('<br>'),
		textToNode(`<h3>${settingsText('chrome.qualityChecksTitle')}</h3>`),
		makeOneSettingsRow('app', 'highlightPointsNearPoints'),
		makeOneSettingsRow('app', 'highlightPointsNearHandles'),
		makeOneSettingsRow('app', 'highlightPointsNearXZero'),
		makeOneSettingsRow('app', 'highlightPointsNearYZero'),
		textToNode('<br>'),
		textToNode(`<h3>${settingsText('chrome.privacyTitle')}</h3>`),
		...makeGoogleTelemetryRow(),
	]);

	return tabContent;
}

/**
 * Makes the optional browser-level Google telemetry setting.
 * @returns {Element[]}
 */
function makeGoogleTelemetryRow() {
	const app = getGlyphrStudioApp();
	const input = /** @type {HTMLInputElement} */ (
		makeElement({
			tag: 'input',
			id: 'settings-page-input__app-googleTelemetry',
			attributes: {
				type: 'checkbox',
				'aria-describedby': 'settings-page-info__app-googleTelemetry',
			},
		})
	);
	input.checked = app.settings.telemetry;
	input.addEventListener('change', (event) => {
		const target = /** @type {HTMLInputElement} */ (event.target);
		app.setGoogleTelemetry(target.checked);
	});

	return [
		makeElement({
			tag: 'label',
			className: 'settings__label',
			attributes: { for: 'settings-page-input__app-googleTelemetry' },
			innerHTML: `${settingsText('chrome.googleTelemetryLabel').replace(/ /g, '&nbsp;')}&emsp;`,
		}),
		makeElement({
			tag: 'info-bubble',
			id: 'settings-page-info__app-googleTelemetry',
			content: settingsText('chrome.googleTelemetryInfo'),
		}),
		input,
		textToNode('<span></span>'),
	];
}
