import { updateWindowUnloadEvent } from '../app/app';
import { getGlyphrStudioApp } from '../app/main';
import { addAsChildren, makeElement, textToNode } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { makeOneSettingsRow } from './settings';

export function makeSettingsTabContentApp() {
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
		textToNode('<h3>Saving</h3>'),
		makeOneSettingsRow('app', 'stopPageNavigation', updateWindowUnloadEvent),
		makeOneSettingsRow('app', 'formatSaveFile'),
		makeOneSettingsRow('app', 'autoSave'),
		textToNode('<span class="settings__label">Delete all auto-saved backups:</span>'),
		makeElement({ tag: 'info-bubble', content: `Glyphr Studio uses your browser's local storage to keep auto-saved backups. If you use Glyphr Studio from a different browser, or on a different computer, you'll have to go there to restore or delete backups.` }),
		makeElement({
			tag: 'fancy-button', attributes: { 'danger': '', style: 'height: 24px;' }, innerHTML: 'Delete', onClick: () => {
				getGlyphrStudioApp().setLocalStorage('autoSaves', {});
				showToast('Auto-saved backups were deleted for this browser.');
		}}),
		textToNode('<span></span>'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Visibility</h3>'),
		makeOneSettingsRow('app', 'showNonCharPoints'),
		makeOneSettingsRow('app', 'previewText'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode('<h3>Importing</h3>'),
		makeOneSettingsRow('app', 'moveShapesOnSVGDragDrop'),
	]);

	return tabContent;
}