import { getCurrentProjectEditor } from "../app/main.js";
import { addAsChildren, makeElement } from "../common/dom.js";
import { makePanel_Actions } from "./actions.js";
import { makePanel_GlyphAttributes } from "./attributes_glyph.js";
import { makePanel_Layers } from "./layers.js";
import { makePanel_History } from "./history.js";
import { makePanel_Guides } from "./guides.js";

/**
 * Assembles the correct panel based on the current
 * project editor and page.
 */
export function makePanel() {
	log(`makePanel`, 'start');

	let editor = getCurrentProjectEditor();
	let panel = editor.nav.panel;
	log(`panel: ${panel}`);

	let content = makeElement();

	if(panel === 'Attributes') {
		addAsChildren(content, makePanel_GlyphAttributes());
		content.appendChild(makePanel_Actions());
	} else if (panel === 'Layers') {
		content.appendChild(makePanel_Layers());
	} else if (panel === 'History') {
		content.appendChild(makePanel_History());
	} else if (panel === 'Guides') {
		content.appendChild(makePanel_Guides());
	}

	log(`makePanel`, 'end');
	return content;
}

/**
 * Refreshes the panel area in the current document
 */
export function refreshPanel() {
	let panelArea = document.getElementById('left-area__panel');
	panelArea.innerHTML = '';
	panelArea.appendChild(makePanel());
}