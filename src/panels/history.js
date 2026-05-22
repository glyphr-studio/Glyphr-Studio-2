import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// History panel
// --------------------------------------------------------------

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'panel__card history-list' });

	let length = editor.history.length;
	let redoLength = editor.history.redoQueue.length;

	let buttonRow = makeElement({
		className: 'history-list__button-row',
	});
	historyArea.appendChild(buttonRow);

	let undoButton = makeElement({
		tag: 'button',
		className: length > 0 ? 'button__call-to-action number' : 'number',
		innerHTML: `undo ${length}`,
	});
	buttonRow.appendChild(undoButton);

	let redoButton = makeElement({
		tag: 'button',
		className: redoLength > 0 ? 'button__call-to-action number' : 'number',
		innerHTML: `redo ${redoLength}`,
	});
	buttonRow.appendChild(redoButton);

	if (length > 0) {
		undoButton.addEventListener('click', () => {
			// log(`History Panel: Undo Button`, 'start');
			editor.history.restoreState();
			// log(`History Panel: Undo Button`, 'end');
		});
	} else {
		undoButton.setAttribute('disabled', '');
	}

	if (redoLength > 0) {
		redoButton.addEventListener('click', () => {
			editor.history.redoState();
		});
	} else {
		redoButton.setAttribute('disabled', '');
	}

	if (length === 0) {
		historyArea.appendChild(
			makeElement({
				tag: 'h3',
				innerHTML: editor.project.getItemName(editor.selectedItemID || '', true) || '',
			})
		);
	}

	let currentItemID = 'initial';
	let visibleIndex = 0;

	editor.history.queue.forEach((entry) => {
		if (entry.title !== '_whole_project_change_post_state_') {
			if (entry.itemID && entry.itemID !== currentItemID) {
				// Section title
				historyArea.appendChild(
					makeElement({
						tag: 'h3',
						innerHTML: editor.project.getItemName(entry.itemID, true) || '',
					})
				);
				currentItemID = entry.itemID;
			}

			// Individual change title
			let title = entry.title;
			if (entry.wholeProjectSave) title = `<strong>${entry.title}</strong>`;

			const stepsToUndo = visibleIndex;
			const isCurrent = visibleIndex === 0;
			const titleEl = makeElement({
				className:
					'history-list__title' +
					(isCurrent ? ' history-list__title--current' : ' history-list__title--clickable'),
				innerHTML: isCurrent ? `${title} <span class="history-list__current-tag">current</span>` : title,
				attributes: isCurrent
					? {}
					: { title: `Click to revert to this point (undo ${stepsToUndo} step${stepsToUndo > 1 ? 's' : ''})` },
			});
			if (!isCurrent) {
				titleEl.addEventListener('click', () => {
					editor.history.jumpToState(stepsToUndo);
				});
			}
			historyArea.appendChild(titleEl);

			// Time stamp
			historyArea.appendChild(
				makeElement({
					className: 'history-list__date number',
					innerHTML: new Date(entry.timeStamp).toLocaleTimeString(),
					title: new Date(entry.timeStamp).toLocaleString(),
				})
			);

			visibleIndex++;
		}
	});

	// historyArea.appendChild(makeElement({ tag: 'hr' }));

	const initialIsClickable = editor.history.queue.length > 0;
	const initialTitleEl = makeElement({
		className:
			'history-list__title history-list__initial-entry' +
			(initialIsClickable ? ' history-list__title--clickable' : ''),
		innerHTML: 'Initial state',
		attributes: initialIsClickable ? { title: 'Click to revert to the initial project state' } : {},
	});
	if (initialIsClickable) {
		initialTitleEl.addEventListener('click', () => {
			editor.history.jumpToState(editor.history.queue.length);
		});
	}
	historyArea.appendChild(initialTitleEl);

	historyArea.appendChild(
		makeElement({
			className: 'history-list__date number history-list__initial-entry',
			innerHTML: new Date(editor.history.initialTimeStamp).toLocaleTimeString(),
		})
	);

	// History object calls to refresh the panel - no subscribers here

	return historyArea;
}
