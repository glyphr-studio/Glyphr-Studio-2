import {parseColorString, shiftColor, getColorFromRGBA, transparencyToAlpha} from './colors.js';
// jest.moc('./colors.js');


it('Colors: parseColorString', () => {
  expect(parseColorString('rgb(123,45,67')).toBe({r: 123, g: 45, b: 67, a: 1});
});

it('Colors: shiftColor', () => {
  expect(shiftColor('rgb(123,45,67)', 0.5, true)).toBe('rgb(189,150,161)');
});

it('Colors: getColorFromRGBA', () => {
/* eslint-disable new-cap */
  expect(getColorFromRGBA('rgb(123,45,67)', 0.2)).toBe('rgb(229,213,217)');
});

it('Colors: transparencyToAlpha', () => {
  expect(transparencyToAlpha(45)).toBe(0.55);
});
