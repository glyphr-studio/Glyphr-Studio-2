import { describe, expect, it } from 'vitest';
import { getColorFromRGBA, parseColorString, shiftColor, transparencyToAlpha } from './colors.js';

describe('Colors', () => {
	it('parseColorString', () => {
		expect(parseColorString('rgb(123,45,67')).toEqual({ r: 123, g: 45, b: 67, a: 1 });
	});

	it('shiftColor', () => {
		expect(shiftColor('rgb(123,45,67)', 0.5, true)).toBe('rgb(189,150,161)');
	});

	it('getColorFromRGBA', () => {
		/* eslint-disable new-cap */
		expect(getColorFromRGBA('rgb(123,45,67)', 0.2)).toBe('rgb(229,213,217)');
	});

	it('transparencyToAlpha', () => {
		expect(transparencyToAlpha(45)).toBe(0.55);
	});
});
