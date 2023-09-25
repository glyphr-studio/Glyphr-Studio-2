import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makePanel_GlyphAttributes } from './attributes_glyph_edit.js';
import { makePanel_Layers } from './layers.js';
import { makePanel_History } from './history.js';
import { makePanel_Guides } from './guides.js';
import { makePanel_KernGroupAttributes } from './attributes_kern.js';
import { makePanel_ContextCharacters } from './context_characters.js';

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
	if (panel === 'Attributes') {
		editor.unsubscribe({ idToRemove: 'layersPanel' });
		editor.unsubscribe({ idToRemove: 'historyPanel' });
		editor.unsubscribe({ idToRemove: 'guidesPanel' });
		editor.unsubscribe({ idToRemove: 'contextCharactersPanel' });
		if (editor.nav.page === 'Kerning') addAsChildren(content, makePanel_KernGroupAttributes());
		else addAsChildren(content, makePanel_GlyphAttributes());
	} else if (panel === 'Layers') {
		editor.unsubscribe({ idToRemove: 'attributesPanel' });
		editor.unsubscribe({ idToRemove: 'historyPanel' });
		editor.unsubscribe({ idToRemove: 'guidesPanel' });
		editor.unsubscribe({ idToRemove: 'contextCharactersPanel' });
		addAsChildren(content, makePanel_Layers());
	} else if (panel === 'Context characters') {
		editor.unsubscribe({ idToRemove: 'attributesPanel' });
		editor.unsubscribe({ idToRemove: 'layersPanel' });
		editor.unsubscribe({ idToRemove: 'historyPanel' });
		editor.unsubscribe({ idToRemove: 'guidesPanel' });
		addAsChildren(content, makePanel_ContextCharacters());
	} else if (panel === 'History') {
		editor.unsubscribe({ idToRemove: 'attributesPanel' });
		editor.unsubscribe({ idToRemove: 'layersPanel' });
		editor.unsubscribe({ idToRemove: 'guidesPanel' });
		editor.unsubscribe({ idToRemove: 'contextCharactersPanel' });
		addAsChildren(content, makePanel_History());
	} else if (panel === 'Guides') {
		editor.unsubscribe({ idToRemove: 'attributesPanel' });
		editor.unsubscribe({ idToRemove: 'layersPanel' });
		editor.unsubscribe({ idToRemove: 'historyPanel' });
		editor.unsubscribe({ idToRemove: 'contextCharactersPanel' });
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
	let panelArea = document.querySelector('#editor-page__panel');
	if (panelArea) {
		let newContent = makePanel();
		// log(newContent);
		panelArea.innerHTML = '';
		panelArea.appendChild(newContent);
	}
	// log(`refreshPanel`, 'end');
}
