import { describe, expect, it } from 'vitest';
import { EDITOR_LOCALES, getEditorStrings } from '../editor_i18n.js';

describe('Editor translations', () => {
	it('provides a complete, directly translated editor catalog for every locale', () => {
		const english = getEditorStrings('en');
		const englishKeys = Object.keys(english).sort();
		EDITOR_LOCALES.forEach((locale) => {
			const strings = getEditorStrings(locale);
			expect(Object.keys(strings).sort()).toEqual(englishKeys);
			if (locale !== 'en') {
				expect(
					Object.values(strings).every((value) => typeof value === 'string' && value.length > 0)
				).toBe(true);
			}
		});
	});

	it('uses regional Spanish settings terminology', () => {
		expect(getEditorStrings('es-ES').settings).toBe('Ajustes');
		expect(getEditorStrings('es-US').settings).toBe('Configuración');
		expect(getEditorStrings('es-MX').settings).toBe('Configuración');
	});

	it('uses regional Spanish add terminology', () => {
		expect(getEditorStrings('es-ES').penTool).toBe('Añadir puntos al trazado');
		expect(getEditorStrings('es-US').penTool).toBe('Agregar puntos al trazado');
		expect(getEditorStrings('es-MX').penTool).toBe('Agregar puntos al trazado');
		expect(getEditorStrings('es-ES').addAxis).toBe('Añadir eje');
		expect(getEditorStrings('es-US').addAxis).toBe('Agregar eje');
		expect(getEditorStrings('es-MX').addAlternate).toBe('Agregar variante');
	});
});
