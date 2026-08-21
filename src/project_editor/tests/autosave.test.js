import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGlyphrStudioApp, setCurrentProjectEditor } from '../../app/main.js';
import { makeOneSettingsRow } from '../../pages/settings.js';
import { ProjectEditor } from '../project_editor.js';

describe('Editor autosave lifecycle', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('autosaves history changes even while the app is in development mode', () => {
		const editor = new ProjectEditor();
		setCurrentProjectEditor(editor);
		editor.project.settings.app.autoSave = true;
		const app = getGlyphrStudioApp();
		app.settings.dev.mode = true;
		const autoSave = vi.spyOn(app, 'addAutoSaveState').mockResolvedValue();

		editor.history.updateAfterSaveState();

		expect(autoSave).toHaveBeenCalledWith(editor.project);
	});

	it('autosaves direct settings changes', () => {
		const editor = new ProjectEditor();
		setCurrentProjectEditor(editor);
		editor.project.settings.app.autoSave = true;
		const autoSave = vi.spyOn(getGlyphrStudioApp(), 'addAutoSaveState').mockResolvedValue();
		const [row] = makeOneSettingsRow('project', 'name');
		const input = row.querySelector('input');
		input.value = 'Autosave Test';

		input.dispatchEvent(new Event('change', { bubbles: true }));

		expect(editor.project.settings.project.name).toBe('Autosave Test');
		expect(autoSave).toHaveBeenCalledWith(editor.project);
	});
});
