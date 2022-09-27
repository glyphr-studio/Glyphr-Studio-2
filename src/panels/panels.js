import { getCurrentProjectEditor } from "../app/main.js";
import { addAsChildren, makeElement } from "../common/dom.js";
import { makeCard_projectActions } from "./actions_cards.js";
import { makePanel_GlyphAttributes } from "./attributes_panel_glyph.js";
import { makePanel_Layers } from "./layers.js";
import { makePanel_History } from "./history.js";
import { makePanel_Guides } from "./guides.js";

/**
 * Assembles the correct panel based on the current
 * project editor and page.
 */
export function makePanel() {
	// log(`makePanel`, 'start');

	const editor = getCurrentProjectEditor();
	// log(editor.nav);
	let panel = editor.nav.panel;
	// log(`panel: ${panel}`);

	let content = makeElement();

	if(panel === 'Attributes') {
		editor.unsubscribe({idToRemove: 'layersPanel'});
		editor.unsubscribe({idToRemove: 'historyPanel'});
		editor.unsubscribe({idToRemove: 'guidesPanel'});
		addAsChildren(content, makePanel_GlyphAttributes());

	} else if (panel === 'Layers') {
		editor.unsubscribe({idToRemove: 'attributesPanel'});
		editor.unsubscribe({idToRemove: 'historyPanel'});
		editor.unsubscribe({idToRemove: 'guidesPanel'});
		addAsChildren(content, makePanel_Layers());

	} else if (panel === 'History') {
		editor.unsubscribe({idToRemove: 'attributesPanel'});
		editor.unsubscribe({idToRemove: 'layersPanel'});
		editor.unsubscribe({idToRemove: 'guidesPanel'});
		addAsChildren(content, makePanel_History());

	} else if (panel === 'Guides') {
		editor.unsubscribe({idToRemove: 'attributesPanel'});
		editor.unsubscribe({idToRemove: 'layersPanel'});
		editor.unsubscribe({idToRemove: 'historyPanel'});
		addAsChildren(content, makePanel_Guides());
	}

	// log(`makePanel`, 'end');
	return content;
}

/**
 * Refreshes the panel area in the current document
 */
export function refreshPanel() {
	// log(`refreshPanel`, 'start');
	let panelArea = document.querySelector('.left-area__panel');
	// panelArea.style.opacity = '0';
	let newContent = makePanel();
	// log(newContent);
	panelArea.innerHTML = '';
	panelArea.appendChild(newContent);
	// window.setTimeout(() => {
	// 	panelArea.style.opacity = '1';
	// }, 50);
	// log(`refreshPanel`, 'end');
}