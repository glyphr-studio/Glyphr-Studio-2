import { describe, expect, it } from 'vitest';
import {
	getColorFromRGBA,
	makeRandomSaturatedColor,
	parseColorString,
	rgbToHex,
	shiftColor,
	transparencyToAlpha,
} from '../colors.js';

describe('Colors', () => {
	it('parseColorString', () => {
		expect(parseColorString('rgb(123,45,67')).toEqual({ r: 123, g: 45, b: 67, a: 1 });
	});
	it('rgbToHex', () => {
		expect(rgbToHex('rgb(123,45,67')).toEqual('#7B2D43');
	});

	it('shiftColor', () => {
		expect(shiftColor('rgb(123,45,67)', 0.5, true)).toBe('rgb(189,150,161)');
	});

	it('getColorFromRGBA', () => {
		expect(getColorFromRGBA('rgb(123,45,67)', 0.2)).toBe('rgb(229,213,217)');
	});

	it('transparencyToAlpha', () => {
		expect(transparencyToAlpha(45)).toBe(0.55);
	});

	it('makeRandomSaturatedColor', () => {
		let rsc = makeRandomSaturatedColor();
		expect(rsc.startsWith('rgb(')).toBeTruthy();
		expect(rsc.indexOf('255') > -1).toBeTruthy();
		expect(rsc.indexOf('0') > -1).toBeTruthy();
	});
});
