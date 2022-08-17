import { getCurrentProjectEditor } from "../app/main.js";
import { log } from "../common/functions.js";
import { makeElement } from "../common/dom.js";
import makePanel_GlyphAttributes from "./attributes_glyph.js";

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
		content.appendChild(makePanel_GlyphAttributes());
	} else if (panel === 'Layers') {
		content.innerHTML = `<h1>Layers</h1>`;
	} else if (panel === 'History') {
		content.innerHTML = `<h1>History</h1>`;
	} else if (panel === 'Guides') {
		content.innerHTML = `<h1>Guides</h1>`;
	}

	log(`makePanel`, 'end');
	return content;
}