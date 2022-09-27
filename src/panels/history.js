/**
		Panel > History
		Shows a list of all the undo-able actions for
		the current page.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

export function makePanel_History() {
	const editor = getCurrentProjectEditor();
	let historyArea = makeElement({className: 'panel__card'});

	// TODO history
	// let q = editor.history[editor.nav.page].queue;
	let q = {length: 0};

	let undoButton = makeElement({
		tag: 'button',
		className: (q.length > 0 ? 'button__call-to-action' : 'button__disabled'),
		innerHTML: `undo ${q.length}`
	});
	undoButton.addEventListener('click', () => {});

	historyArea.appendChild(undoButton);

	/*
	let te;
	let currname = '';
	for (let e = q.length - 1; e >= 0; e--) {
		te = q[e];

		if (te.name !== currname) {
			content +=
				'<tr><td colspan=2 ><div class="history_char">' +
				te.name +
				'</div></td></tr>';
			currname = te.name;
		}

		content +=
			'<tr>' +
			'<td class="history_action">' +
			te.description +
			'</td>' +
			'<td class="history_date">' +
			new Date(te.date).toLocaleString() +
			'</td>' +
			'</tr>';
	}

	content +=
		'<tr><td colspan=2  style="border-bottom:1px solid rgb(204,209,214);"></td></tr><tr>' +
		'<td class="history_char">Initial State</td>' +
		'<td class="history_date">' +
		new Date(editor.history[editor.nav.page].initialDate).toLocaleString() +
		'</td>' +
		'</tr>';

	content += '</table>';
	content += '</div>';
	*/

	return historyArea;
}
