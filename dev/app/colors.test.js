import {parseColorString, shiftColor, RGBAtoRGB, transparencyToAlpha} from './colors.js';

_TEST.testList.push(
    {
        category: 'Colors',
        name: 'parseColorString',
        assertion: function() {
            return _TEST.is(parseColorString('rgb(123,45,67')).equalTo({r: 123, g: 45, b: 67, a: 1});
        },
    },
    {
        category: 'Colors',
        name: 'shiftColor',
        assertion: function() {
            return _TEST.is(shiftColor('rgb(123,45,67)', 0.5, true)).equalTo('rgb(189,150,161)');
        },
    },
    {
        category: 'Colors',
        name: 'RGBAtoRGB',
        assertion: function() {
            /* eslint-disable new-cap */
            return _TEST.is(RGBAtoRGB('rgb(123,45,67)', 0.2)).equalTo('rgb(229,213,217)');
        },
    },
    {
        category: 'Colors',
        name: 'transparencyToAlpha',
        assertion: function() {
            return _TEST.is(transparencyToAlpha(45)).equalTo(0.55);
        },
    }
);
