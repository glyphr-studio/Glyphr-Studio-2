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
		className: q.length > 0 ? 'button__call-to-action number' : 'number',
		innerHTML: `undo ${q.length}`,
		style: 'max-width: 30%; grid-column: 1 / -1;'
	});
	historyArea.appendChild(undoButton);

	if (q.length > 0) {
		undoButton.addEventListener('click', () => {
			// log(`History Panel: Undo Button`, 'start');
			editor.history.restoreState();
			// log(`History Panel: Undo Button`, 'end');
		});
	} else {
		undoButton.setAttribute('disabled', '');
		historyArea.appendChild(
			makeElement({
				tag: 'h3',
				innerHTML: editor.project.getGlyphName(editor.selectedItemID, true),
			})
		);
	}

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


	historyArea.appendChild(makeElement({ tag: 'hr' }));

	historyArea.appendChild(makeElement({
		className: 'history-list__title history-list__initial-entry',
		innerHTML: '<i>Initial state</i>',
	}));

	historyArea.appendChild(makeElement({
		className: 'history-list__date number history-list__initial-entry',
		innerHTML: new Date(editor.history.initialTimeStamp).toLocaleString(),
	}));

	// History object calls to refresh the panel - no subscribers here

	return historyArea;
}
