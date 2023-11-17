import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// History panel
// --------------------------------------------------------------

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'panel__card history-list' });

	let length = editor.history.length;

	let undoButton = makeElement({
		tag: 'button',
		className: length > 0 ? 'button__call-to-action number' : 'number',
		innerHTML: `undo ${length}`,
		style: 'max-width: 30%; grid-column: 1 / -1;',
	});
	historyArea.appendChild(undoButton);

	if (length > 0) {
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
				innerHTML: editor.project.getItemName(editor.selectedItemID, true),
			})
		);
	}

	let currentItemID = 'initial';

	editor.history.queue.forEach((entry) => {
		if (entry.title !== '_whole_project_change_post_state_') {
			if (entry.itemID && entry.itemID !== currentItemID) {
				// Section title
				historyArea.appendChild(
					makeElement({
						tag: 'h3',
						innerHTML: editor.project.getItemName(entry.itemID, true),
					})
				);
				currentItemID = entry.itemID;
			}

			// Individual change title
			let title = entry.title;
			if (entry.wholeProjectSave) title = `<strong>${entry.title}</strong>`;
			historyArea.appendChild(
				makeElement({ className: 'history-list__title', innerHTML: title })
			);

			// Time stamp
			historyArea.appendChild(
				makeElement({
					className: 'history-list__date number',
					innerHTML: new Date(entry.timeStamp).toLocaleTimeString(),
					title: new Date(entry.timeStamp).toLocaleString(),
				})
			);
		}
	});

	// historyArea.appendChild(makeElement({ tag: 'hr' }));

	historyArea.appendChild(
		makeElement({
			className: 'history-list__title history-list__initial-entry',
			innerHTML: 'Initial state',
		})
	);

	historyArea.appendChild(
		makeElement({
			className: 'history-list__date number history-list__initial-entry',
			innerHTML: new Date(editor.history.initialTimeStamp).toLocaleTimeString(),
		})
	);

	// History object calls to refresh the panel - no subscribers here

	return historyArea;
}
