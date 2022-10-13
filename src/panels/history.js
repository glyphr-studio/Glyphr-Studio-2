/**
		Panel > History
		Shows a list of all the undo-able actions for
		the current page.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({ className: 'historyList' });

	let q = editor.history;
	// let q = { length: 0 };

	let undoButton = makeElement({
		tag: 'button',
		className: q.length > 0 ? 'button__call-to-action' : 'button__disabled',
		innerHTML: `undo ${q.length}`,
	});
	undoButton.addEventListener('click', () => {});

	historyArea.appendChild(undoButton);
	let currentItemID = false;

	editor.history.forEach(entry => {
		if (entry.itemID !== currentItemID) {
			historyArea.innerHTML += `
				<h3>${editor.getItemName(entry.itemID)}</h3>
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
		<span>${entry.timeStamp}</span>
	`;

	return historyArea;
}
