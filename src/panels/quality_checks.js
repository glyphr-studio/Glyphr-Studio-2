import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// Quality Checks panel
// --------------------------------------------------------------

export function makePanel_QualityChecks() {
	// log(`makePanel_QualityChecks`, 'start');
	let checkCard = makeElement({ className: 'panel__card' });
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	let selected = editor.selectedItem;
	let paths = selected.shapes;

	checkCard.appendChild(
		makeElement({
			content: `Here is a card`,
		})
	);

	// Overall, watch for changes:
	editor.subscribe({
		topic: ['currentPath', 'currentItem'],
		subscriberID: 'qualityChecksPanel',
		callback: () => {},
	});

	// log(`makePanel_QualityChecks`, 'end');
	return [checkCard];
}
