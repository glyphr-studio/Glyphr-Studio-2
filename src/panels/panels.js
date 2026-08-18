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
 * The sections of the consolidated properties panel, in display order.
 * `panel` matches the names makeOnePanel() understands.
 */
const PANEL_SECTIONS = [
	{ panel: 'Attributes', label: 'Properties', open: true },
	{ panel: 'Layers', label: 'Layers', open: true },
	{ panel: 'Transforms', label: 'Transforms' },
	{ panel: 'Context characters', label: 'Context characters' },
	{ panel: 'Character info', label: 'Character info' },
	{ panel: 'Guides', label: 'Guides' },
	{ panel: 'Quality checks', label: 'Quality checks' },
	{ panel: 'History', label: 'History' },
];

/**
 * Which sections make sense on which page.
 */
const SECTIONS_PER_PAGE = {
	Characters: [
		'Attributes',
		'Layers',
		'Transforms',
		'Context characters',
		'Character info',
		'Guides',
		'Quality checks',
		'History',
	],
	Ligatures: ['Attributes', 'Layers', 'Transforms', 'Guides', 'Quality checks', 'History'],
	Components: ['Attributes', 'Layers', 'Transforms', 'Guides', 'Quality checks', 'History'],
	'Variable sets': ['Attributes', 'Layers', 'Transforms', 'Guides', 'Quality checks', 'History'],
	Kerning: ['Attributes', 'History'],
};

/**
 * Which sections the user has expanded. Kept outside the render so the
 * panel doesn't collapse every time it refreshes.
 * @type {Set<String>}
 */
const openSections = new Set(
	PANEL_SECTIONS.filter((section) => section.open).map((section) => section.panel)
);

/**
 * Builds the consolidated properties panel: one glass surface with the
 * former panel-chooser destinations as collapsible sections. Each
 * section still comes from its original panel maker.
 * @returns {Element}
 */
export function makePanel() {
	const editor = getCurrentProjectEditor();
	const wrapper = makeElement({ className: 'editor-panel__stack' });

	// Every section re-registers its own subscriptions while rendering
	[
		'attributesPanel',
		'layersPanel',
		'contextCharactersPanel',
		'historyPanel',
		'guidesPanel',
		'qualityChecksPanel',
	].forEach((idToRemove) => editor.unsubscribe({ idToRemove }));

	if (editor.nav.page === 'Components' && countItems(editor.project.components) <= 0)
		return wrapper;
	if (editor.nav.page === 'Ligatures' && countItems(editor.project.ligatures) <= 0) return wrapper;
	if (editor.nav.page === 'Kerning' && countItems(editor.project.kerning) <= 0) return wrapper;

	const allowed = SECTIONS_PER_PAGE[editor.nav.page] || ['Attributes', 'History'];

	// The Layers panel owns some document-level key handling
	document.removeEventListener('keydown', handlePanelsKeyPress, false);
	document.removeEventListener('keyup', handlePanelsKeyUp, false);
	if (allowed.includes('Layers')) {
		document.addEventListener('keydown', handlePanelsKeyPress, false);
		document.addEventListener('keyup', handlePanelsKeyUp, false);
	}

	PANEL_SECTIONS.filter((section) => allowed.includes(section.panel)).forEach((section) => {
		const details = makeElement({
			tag: 'details',
			className: 'editor-panel__section liquid-glass',
		});
		if (openSections.has(section.panel)) details.setAttribute('open', '');
		const summary = makeElement({ tag: 'summary', content: section.label });
		details.appendChild(summary);
		details.addEventListener('toggle', () => {
			// @ts-expect-error 'property does exist on HTMLDetailsElement'
			if (details.open) openSections.add(section.panel);
			else openSections.delete(section.panel);
		});

		const body = makeElement({ className: 'editor-panel__section-body' });
		addAsChildren(body, makeOnePanel(section.panel));
		details.appendChild(body);

		wrapper.appendChild(details);
	});

	return wrapper;
}

/**
 * Builds the content for one named panel.
 * @param {String} panel - panel name
 * @returns {Element}
 */
export function makeOnePanel(panel) {
	const editor = getCurrentProjectEditor();
	let content = makeElement();

	// Panels are all rendered together now, so subscriptions are cleared
	// once per rebuild in makePanel() rather than per panel.
	if (panel === 'Attributes') {
		if (editor.nav.page === 'Kerning') addAsChildren(content, makePanel_KernGroupAttributes());
		else addAsChildren(content, makePanel_GlyphAttributes());
	} else if (panel === 'Transforms') {
		addAsChildren(content, makePanel_Transforms());
	} else if (panel === 'Layers') {
		addAsChildren(content, makePanel_Layers());
	} else if (panel === 'Context characters') {
		addAsChildren(content, makePanel_ContextCharacters());
	} else if (panel === 'History') {
		addAsChildren(content, makePanel_History());
	} else if (panel === 'Guides') {
		addAsChildren(content, makePanel_Guides());
	} else if (panel === 'Character info') {
		addAsChildren(content, makePanel_CharacterInfo());
	} else if (panel === 'Quality checks') {
		addAsChildren(content, makePanel_QualityChecks());
	}

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
