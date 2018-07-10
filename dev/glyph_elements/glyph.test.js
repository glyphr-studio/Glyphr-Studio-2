import Glyph from './glyph.js';

/**
 * Create a sample Glyph
 * @returns {Glyph}
 */
function sampleGlyph() {
    return new Glyph();
}

_TEST.testList.push(

    {
        category: 'Glyph',
        name: 'hex',
        assertion: function() {
            let g = sampleGlyph();
            g.hex = '0x1234';
            return _TEST.is(g.hex).equalTo('0x1234');
        },
    },
    {
        category: 'Glyph',
        name: 'shapes',
        assertion: function() {
            let g = sampleGlyph();
            g.shapes = [false];
            return _TEST.is(g.shapes).equalTo([]);
        },
    },
    {
        category: 'Glyph',
        name: 'isAutoWide',
        assertion: function() {
            let g = sampleGlyph();
            g.isAutoWide = false;
            return _TEST.is(g.isAutoWide).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'glyphWidth',
        assertion: function() {
            let g = sampleGlyph();
            g.glyphWidth = 123;
            return _TEST.is(g.glyphWidth).equalTo(123);
        },
    },
    {
        category: 'Glyph',
        name: 'leftSideBearing',
        assertion: function() {
            let g = sampleGlyph();
            g.leftSideBearing = 456;
            return _TEST.is(g.leftSideBearing).equalTo(456);
        },
    },
    {
        category: 'Glyph',
        name: 'rightSideBearing',
        assertion: function() {
            let g = sampleGlyph();
            g.rightSideBearing = 456;
            return _TEST.is(g.rightSideBearing).equalTo(456);
        },
    },
    {
        category: 'Glyph',
        name: 'ratioLock',
        assertion: function() {
            let g = sampleGlyph();
            g.ratioLock = true;
            return _TEST.is(g.ratioLock).equalTo(true);
        },
    },
    {
        category: 'Glyph',
        name: 'usedIn',
        assertion: function() {
            let g = sampleGlyph();
            g.usedIn = ['0x1235', '0x1236'];
            return _TEST.is(g.usedIn).equalTo(['0x1235', '0x1236']);
        },
    },
    {
        category: 'Glyph',
        name: 'contextGlyphs',
        assertion: function() {
            let g = sampleGlyph();
            g.contextGlyphs = 'asdf';
            return _TEST.is(g.contextGlyphs).equalTo('asdf');
        },
    }
    /*
    {
        category: 'Glyph',
        name: 'x',
        assertion: function() {
            let g = sampleGlyph();
            g.x = false;
            return _TEST.is(g.x).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'y',
        assertion: function() {
            let g = sampleGlyph();
            g.y = false;
            return _TEST.is(g.y).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'width',
        assertion: function() {
            let g = sampleGlyph();
            g.width = false;
            return _TEST.is(g.width).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'height',
        assertion: function() {
            let g = sampleGlyph();
            g.height = false;
            return _TEST.is(g.height).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'maxes',
        assertion: function() {
            let g = sampleGlyph();
            g.maxes = false;
            return _TEST.is(g.maxes).equalTo(false);
        },
    },
    */
);

/*

hex(hex) {
isAutoWide(isAutoWide) {
glyphWidth(glyphWidth) {
leftSideBearing(leftSideBearing) {
rightSideBearing(rightSideBearing) {
ratioLock(ratioLock) {
shapes(shapes) {
usedIn(usedIn) {
contextGlyphs(contextGlyphs) {
x(x) {
y(y) {
width(w) {
height(h) {
maxes(maxes) {

*/