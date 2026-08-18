import { beforeEach, describe, expect, it } from 'vitest';
import { GlyphrStudioApp } from '../app.js';

describe('Google telemetry preference', () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.querySelector('#glyphr-studio-google-telemetry')?.remove();
		delete window.dataLayer;
		delete window['ga-disable-G-L8S3D8WCC9'];
	});

	it('is off by default', () => {
		const app = new GlyphrStudioApp();
		expect(app.settings.telemetry).toBe(false);
		expect(document.querySelector('#glyphr-studio-google-telemetry')).toBeNull();
	});

	it('injects the Google script when enabled in dev mode', () => {
		const app = new GlyphrStudioApp();
		app.settings.dev.mode = true;

		app.setGoogleTelemetry(true);

		const script = document.querySelector('#glyphr-studio-google-telemetry');
		expect(script?.getAttribute('src')).toBe(
			'https://www.googletagmanager.com/gtag/js?id=G-L8S3D8WCC9'
		);
		expect(JSON.parse(window.localStorage.getItem('GlyphrStudio')).googleTelemetry).toBe(true);
	});

	it('removes and disables telemetry when turned off', () => {
		const app = new GlyphrStudioApp();
		app.setGoogleTelemetry(true);
		app.setGoogleTelemetry(false);

		expect(document.querySelector('#glyphr-studio-google-telemetry')).toBeNull();
		expect(window['ga-disable-G-L8S3D8WCC9']).toBe(true);
		expect(JSON.parse(window.localStorage.getItem('GlyphrStudio')).googleTelemetry).toBe(false);
	});
});
