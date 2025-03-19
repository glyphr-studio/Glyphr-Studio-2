import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import settingsData from '../pages/settings_data.js';
import { enabledQualityChecks, runQualityChecksForItem } from '../project_editor/quality_checks.js';
import { refreshPanel } from './panels.js';

// --------------------------------------------------------------
// Quality Checks panel
// --------------------------------------------------------------

export function makePanel_QualityChecks() {
	// log(`makePanel_QualityChecks`, 'start');

	// log(`makePanel_QualityChecks`, 'end');
	return [makeCard_PointsAndHandles()];
}

function makeCard_PointsAndHandles() {
	// log(`makeCard_PointsAndHandles`, 'start');
	// log(`\n⮟enabledQualityChecks⮟`);
	// log(enabledQualityChecks);

	const editor = getCurrentProjectEditor();
	let card = makeElement({
		className: 'panel__card quality-check__points-and-handles',
		content: `
			<h3>Points and handles</h3>
			<p class="spanAll" style="margin-bottom: 10px;">
				These quality checks help identify small data errors that may be a result of importing from SVG.
			</p>
			`,
	});

	const checks = [
		'highlightPointsNearPoints',
		'highlightPointsNearHandles',
		'highlightPointsNearXZero',
		'highlightPointsNearYZero',
	];

	checks.forEach((checkName) => {
		const checkbox = makeElement({
			tag: 'input',
			attributes: {
				type: 'checkbox',
			},
			id: `checkbox-for-${checkName}`,
		});

		checkbox.addEventListener('change', (e) => {
			// @ts-expect-error 'property does exist'
			enabledQualityChecks[checkName] = e.target.checked;
			editor.publish('qualityChecks', 'update');
		});

		const label = makeElement({
			tag: 'label',
			attributes: {
				for: `checkbox-for-${checkName}`,
			},
			content: settingsData.app[checkName].label,
		});

		const input = makeElement({
			tag: 'input-number',
			attributes: {
				value: editor.project.settings.app[checkName],
			},
		});

		input.addEventListener('change', (event) => {
			// @ts-expect-error 'property does exist'
			editor.project.settings.app[checkName] = parseInt(event.target.value);
			runQualityChecksForItem(editor.selectedItem);
			editor.publish('qualityChecks', 'update');
		});

		if (enabledQualityChecks[checkName]) {
			checkbox.setAttribute('checked', '');
		} else {
			input.setAttribute('disabled', '');
			label.setAttribute('disabled', '');
		}

		addAsChildren(card, [checkbox, label, input]);
	});

	// Overall, watch for changes:
	editor.subscribe({
		topic: ['currentPath', 'currentItem', 'qualityChecks'],
		subscriberID: 'qualityChecksPanel',
		callback: () => {
			refreshPanel();
		},
	});

	// log(`makeCard_PointsAndHandles`, 'end');
	return card;
}
