import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { refreshPanel } from './panels.js';

/**
		Panel > History
		Shows a list of all the undo-able actions.
**/

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'panel__card history-list' });

	let q = editor.history.queue;

	let undoButton = makeElement({
		tag: 'button',
		className: q.length > 0 ? 'button__call-to-action number' : 'button__disabled number',
		innerHTML: `undo ${q.length}`,
	});
	undoButton.addEventListener('click', () => {
		log(`History Panel: Undo Button`, 'start');
		editor.history.restoreState();
		log(`History Panel: Undo Button`, 'end');
	});
	undoButton.style = 'max-width: 30%; grid-column: 1 / -1;';

	historyArea.appendChild(undoButton);
	let currentItemID = 'initial';

	q.forEach((entry) => {
		if (entry.itemID !== currentItemID) {
			historyArea.appendChild(makeElement({
				tag: 'h3',
				innerHTML: editor.project.getGlyphName(entry.itemID, true),
			}));
			currentItemID = entry.itemID;
		}
		historyArea.appendChild(makeElement({
			className: 'history-list__title',
			innerHTML: entry.title,
		}));

		historyArea.appendChild(makeElement({
			className: 'history-list__date number',
			innerHTML: new Date(entry.timeStamp).toLocaleString(),
		}));
	});

	/*
	historyArea.appendChild(makeElement({
		className: 'history-list__title',
		innerHTML: '<i>Initial state</i>',
	}));

	historyArea.appendChild(makeElement({
		className: 'history-list__date number',
		innerHTML: new Date(editor.history.baseTimeStamp).toLocaleString(),
	}));
*/
	// History object calls to refresh the panel - no subscribers here

	return historyArea;
}
