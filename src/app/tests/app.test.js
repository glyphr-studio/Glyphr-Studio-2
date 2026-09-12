import { SpyModule } from 'vitest/internal/browser';
import { getGlyphrStudioApp } from '../main.js';

describe('config storage', () => {
	it('ensure single write', async () => {
		let app = getGlyphrStudioApp();
		const saveSpy = SpyModule.spyOn(app, 'saveAppSettings');

		for (let i = 0; i < 5; i++) {
			app.settings.app[`testProp${i}`] = true;
		}

		// Wait past the 1s debounce + small buffer
		await new Promise((resolve) => setTimeout(resolve, app.settings.settingsDebounceTime));

		expect(saveSpy).toHaveBeenCalledTimes(1);
	});

	it('ensure debounced', async () => {
		let app = getGlyphrStudioApp();
		const before = localStorage.getItem('GlyphrStudio');
		app.settings.app.testBool = true;

		// The debounce timer is still pending — no save yet
		await new Promise((resolve) => setTimeout(resolve, app.settings.settingsDebounceTime / 2));
		expect(localStorage.getItem('GlyphrStudio')).toEqual(before);

		// After the full length it should have fired
		await new Promise((resolve) => setTimeout(resolve, app.settings.settingsDebounceTime / 2 + 10));
		expect(JSON.parse(localStorage.getItem('GlyphrStudio'))?.appSettings.testBool).toBe(true);
	});
});
