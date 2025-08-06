import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { makePanel_GlyphAttributes } from './attributes_glyph_edit.js';
import { makePanel_KernGroupAttributes } from './attributes_kern.js';
import { makePanel_CharacterInfo } from './character_info.js';
import { makePanel_ContextCharacters } from './context_characters.js';
import { makePanel_Guides } from './guides.js';
import { makePanel_History } from './history.js';
import { makePanel_Layers } from './layers.js';
import { handlePanelsKeyPress, handlePanelsKeyUp } from './panel_events.js';
import { makePanel_QualityChecks } from './quality_checks.js';
import { makePanel_Transforms } from './transforms.js';

/**
 * Assembles the correct panel based on the current
 * project editor and page.
 */
export function makePanel() {
	// log(`makePanel`, 'start');

	const editor = getCurrentProjectEditor();
	// log(editor.nav);
	let content = makeElement();
	let panel = editor.nav.panel;
	// log(`panel: ${panel}`);

	if (panel !== 'Layers') {
		document.removeEventListener('keydown', handlePanelsKeyPress, false);
		document.removeEventListener('keyup', handlePanelsKeyUp, false);
	}

	if (editor.nav.page === 'Components' && countItems(editor.project.components) <= 0) {
		return content;
	}

	if (editor.nav.page === 'Ligatures' && countItems(editor.project.ligatures) <= 0) {
		return content;
	}

	if (editor.nav.page === 'Kerning' && countItems(editor.project.kerning) <= 0) {
		return content;
	}

	if (panel === 'Attributes') {
		unsubscribeExcept('attributesPanel');
		if (editor.nav.page === 'Kerning') addAsChildren(content, makePanel_KernGroupAttributes());
		else addAsChildren(content, makePanel_GlyphAttributes());
	} else if (panel === 'Transforms') {
		unsubscribeExcept('transformsPanel');
		addAsChildren(content, makePanel_Transforms());
	} else if (panel === 'Layers') {
		unsubscribeExcept('layersPanel');
		addAsChildren(content, makePanel_Layers());
		document.addEventListener('keydown', handlePanelsKeyPress, false);
		document.addEventListener('keyup', handlePanelsKeyUp, false);
	} else if (panel === 'Context characters') {
		unsubscribeExcept('contextCharactersPanel');
		addAsChildren(content, makePanel_ContextCharacters());
	} else if (panel === 'History') {
		unsubscribeExcept('historyPanel');
		addAsChildren(content, makePanel_History());
	} else if (panel === 'Guides') {
		unsubscribeExcept('guidesPanel');
		addAsChildren(content, makePanel_Guides());
	} else if (panel === 'Character info') {
		unsubscribeExcept('characterInfoPanel');
		addAsChildren(content, makePanel_CharacterInfo());
	} else if (panel === 'Quality checks') {
		unsubscribeExcept('qualityChecksPanel');
		addAsChildren(content, makePanel_QualityChecks());
	}

	// log(`makePanel`, 'end');
	return content;
}

function unsubscribeExcept(panelName = '') {
	const editor = getCurrentProjectEditor();
	if (panelName !== 'attributesPanel') editor.unsubscribe({ idToRemove: 'attributesPanel' });
	if (panelName !== 'layersPanel') editor.unsubscribe({ idToRemove: 'layersPanel' });
	if (panelName !== 'contextCharactersPanel')
		editor.unsubscribe({ idToRemove: 'contextCharactersPanel' });
	if (panelName !== 'historyPanel') editor.unsubscribe({ idToRemove: 'historyPanel' });
	if (panelName !== 'guidesPanel') editor.unsubscribe({ idToRemove: 'guidesPanel' });
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
