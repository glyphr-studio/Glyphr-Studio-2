import { describe, expect, it, vi } from 'vitest';
import { ProjectEditor } from '../../project_editor/project_editor.js';
import { makeProjectHash, parseAppHash } from '../routing.js';

function makeEditor(page = 'Overview', glyphID = 'glyph-0x41') {
	return {
		project: { settings: { project: { id: 'g2_test project' } } },
		nav: { page },
		selectedGlyphID: glyphID,
	};
}

function makeAlternateEditor() {
	return {
		project: { settings: { project: { id: 'g2_test project' } } },
		nav: { page: 'Variable sets' },
		variableSetsView: 'alternate',
		selectedStylisticSetID: 'sset-1',
		selectedAlternateID: 'alt-ss01-1',
	};
}

describe('App hash routing', () => {
	it('initializes a new editor without crashing before navigation is ready', () => {
		expect(() => new ProjectEditor()).not.toThrow();
	});

	it('maps the homepage to #/', () => {
		expect(parseAppHash('#/')).toEqual({ type: 'home' });
	});

	it('maps open-project library pages to their hashes', () => {
		expect(parseAppHash('#/favorites')).toEqual({ type: 'library', page: 'favorites' });
		expect(parseAppHash('#/examples')).toEqual({ type: 'library', page: 'examples' });
		expect(parseAppHash('#/archived')).toEqual({ type: 'library', page: 'archived' });
		expect(parseAppHash('#/settings')).toEqual({ type: 'library', page: 'settings' });
	});

	it('makes a project overview hash', () => {
		expect(makeProjectHash(makeEditor())).toBe('#/project/g2_test%20project');
	});

	it('makes and parses a project page hash', () => {
		const hash = makeProjectHash(makeEditor('Settings'));
		expect(hash).toBe('#/project/g2_test%20project/settings');
		expect(parseAppHash(hash)).toEqual({
			type: 'project',
			projectID: 'g2_test project',
			page: 'Settings',
		});
	});

	it('makes and parses a character editing hash', () => {
		const hash = makeProjectHash(makeEditor('Characters', 'glyph-0x31'));
		expect(hash).toBe('#/project/g2_test%20project/characters/edit/1');
		expect(parseAppHash(hash)).toEqual({
			type: 'project',
			projectID: 'g2_test project',
			page: 'Characters',
			glyphID: 'glyph-0x31',
		});
	});

	it('supports encoded characters in edit hashes', () => {
		const hash = makeProjectHash(makeEditor('Characters', 'glyph-0x2F'));
		expect(hash).toBe('#/project/g2_test%20project/characters/edit/%2F');
		expect(parseAppHash(hash).glyphID).toBe('glyph-0x2F');
	});

	it('makes and parses stylistic alternate editing hashes', () => {
		const hash = makeProjectHash(makeAlternateEditor());
		expect(hash).toBe('#/project/g2_test%20project/variable-sets/sset-1/alternate/alt-ss01-1');
		expect(parseAppHash(hash)).toEqual({
			type: 'project',
			projectID: 'g2_test project',
			page: 'Variable sets',
			stylisticSetID: 'sset-1',
			alternateID: 'alt-ss01-1',
		});
	});

	it('makes and parses ligature and component editing hashes', () => {
		const ligatureEditor = makeEditor('Ligatures');
		ligatureEditor.ligatureView = 'edit';
		ligatureEditor.selectedLigatureID = 'liga-f-i';
		const componentEditor = makeEditor('Components');
		componentEditor.componentView = 'edit';
		componentEditor.selectedComponentID = 'comp-3';

		expect(parseAppHash(makeProjectHash(ligatureEditor))).toEqual({
			type: 'project',
			projectID: 'g2_test project',
			page: 'Ligatures',
			ligatureID: 'liga-f-i',
		});
		expect(parseAppHash(makeProjectHash(componentEditor))).toEqual({
			type: 'project',
			projectID: 'g2_test project',
			page: 'Components',
			componentID: 'comp-3',
		});
	});

	it('keeps the routed character instead of resetting to A', () => {
		const editor = new ProjectEditor();
		editor.project = {
			settings: {
				project: {
					characterRanges: [{ begin: 0x20, end: 0x7f, enabled: true, name: 'Basic Latin' }],
				},
			},
			glyphs: {
				'glyph-0x6B': { id: 'glyph-0x6B' },
			},
		};
		editor.selectedGlyphID = 'glyph-0x6B';
		expect(editor.selectedGlyphID).toBe('glyph-0x6B');
		expect(parseAppHash('#/project/g2_OBLEGG2/characters/edit/k')).toEqual({
			type: 'project',
			projectID: 'g2_OBLEGG2',
			page: 'Characters',
			glyphID: 'glyph-0x6B',
		});
	});

	it('refreshes the character page immediately when the selected glyph changes', () => {
		const editor = new ProjectEditor();
		editor.nav.page = 'Characters';
		editor.project = {
			settings: {
				project: {
					characterRanges: [{ begin: 0x20, end: 0x7f, enabled: true, name: 'Basic Latin' }],
				},
			},
			glyphs: {
				'glyph-0x41': { id: 'glyph-0x41' },
				'glyph-0x6B': { id: 'glyph-0x6B' },
			},
		};
		const navigateSpy = vi.spyOn(editor, 'navigate').mockImplementation(() => {});
		editor.selectedGlyphID = 'glyph-0x6B';
		expect(navigateSpy).toHaveBeenCalledTimes(1);
	});

	it('falls back to home for invalid routes', () => {
		expect(parseAppHash('#/unknown')).toEqual({ type: 'home' });
		expect(parseAppHash('#/project/example/not-a-page')).toEqual({ type: 'home' });
	});
});
