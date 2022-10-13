import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

/**
		Panel > History
		Shows a list of all the undo-able actions.
**/

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'historyList' });

	let q = editor.history.queue;

	let undoButton = makeElement({
		tag: 'button',
		className: q.length > 0 ? 'button__call-to-action' : 'button__disabled',
		innerHTML: `undo ${q.length}`,
	});
	undoButton.addEventListener('click', () => {});

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
			<span>${entry.title}</span>
			<span>${entry.timeStamp}</span>
		`;
	});

	historyArea.innerHTML += `
		<hr>
		<span><i>Initial state</i></span>
		<span>${editor.history.baseTimeStamp}</span>
	`;

	return historyArea;
}
