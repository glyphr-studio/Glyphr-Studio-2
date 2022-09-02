import { getCurrentProjectEditor } from '../app/main.js';
import { log } from '../common/functions.js';

export function makePanel_OverviewAttributes() {
	log(`makePanel_OverviewAttributes`, 'start');

	let projectEditor = getCurrentProjectEditor();
	let content = `
		<div class="panel__section full-width">
			<h3>${projectEditor.project.projectSettings.name}</h3>
			<span>More settings can be found on the Settings page</span>
		</div>
	`;

	log(`makePanel_OverviewAttributes`, 'end');
	return content;
}