import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { refreshPanel } from './panels.js';

/**
		Panel > History
		Shows a list of all the undo-able actions.
**/

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'history-list' });

	let q = editor.history.queue;

	let undoButton = makeElement({
		tag: 'button',
		className: q.length > 0 ? 'button__call-to-action number' : 'button__disabled number',
		innerHTML: `undo ${q.length}`,
	});
	undoButton.addEventListener('click', () => { });
	undoButton.style = 'max-width: 30%; grid-column: 1 / -1;';

	historyArea.appendChild(undoButton);
	let currentItemID = false;

	q.forEach((entry) => {
		if (entry.itemID !== currentItemID) {
			historyArea.innerHTML += `
				<h3>${editor.project.getGlyphName(entry.itemID, true)}</h3>
			`;
			currentItemID = entry.itemID;
		}
		historyArea.innerHTML += `
			<span class="history-list__title">
				${entry.title}
			</span>
			<span class="history-list__date number">
				${new Date(entry.timeStamp).toLocaleString()}
			</span>
		`;
	});

	historyArea.innerHTML += `
		<hr>
		<span class="history-list__title">
			<i>Initial state</i>
		</span>
		<span class="history-list__date number">
			${new Date(editor.history.baseTimeStamp).toLocaleString()}
		</span>
	`;

	// History object calls to refresh the panel - no subscribers here

	return historyArea;
}
