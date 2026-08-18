import { describe, expect, it } from 'vitest';
import { getOpenProjectStrings, OPEN_PROJECT_LOCALES } from '../open_project_i18n.js';

describe('Open project translations', () => {
	it('provides all supported locales with the complete key set', () => {
		const englishKeys = Object.keys(getOpenProjectStrings('en')).sort();
		for (const [locale] of OPEN_PROJECT_LOCALES) {
			expect(Object.keys(getOpenProjectStrings(locale)).sort()).toEqual(englishKeys);
		}
	});

	it('uses the requested regional Spanish settings and add terms', () => {
		expect(getOpenProjectStrings('es-ES').settings).toBe('Ajustes');
		expect(getOpenProjectStrings('es-ES').add).toBe('Añadir');
		expect(getOpenProjectStrings('es-US').settings).toBe('Configuración');
		expect(getOpenProjectStrings('es-US').add).toBe('Agregar');
		expect(getOpenProjectStrings('es-MX').settings).toBe('Configuración');
		expect(getOpenProjectStrings('es-MX').add).toBe('Agregar');
	});
});
