import Glyph from './glyph.js';
import {clone} from '../app/functions.js';

/**
 * Create a sample Glyph
 * @returns {Glyph}
 */
function sampleGlyph() {
    return new Glyph({shapes: [{path: {pathPoints: clone(_TEST.globals.testPathPoints)}}]});
}

/**
 * Create a multi-shape Glyph
 * @returns {Glyph}
 */
function multiTriangleGlyph() {
    return new Glyph({shapes: [
        {path: {pathPoints: [
            {p: {coord: {x: 100, y: 200}}},
            {p: {coord: {x: 300, y: 600}}},
            {p: {coord: {x: 400, y: 500}}},
        ]}},
        {path: {pathPoints: [
            {p: {coord: {x: 500, y: 600}}},
            {p: {coord: {x: 700, y: 950}}},
            {p: {coord: {x: 800, y: 900}}},
        ]}},
        {path: {pathPoints: [
            {p: {coord: {x: 10, y: 20}}},
            {p: {coord: {x: 30, y: 60}}},
            {p: {coord: {x: 40, y: 50}}},
        ]}},
    ]});
}

_TEST.testList.push(

    {
        category: 'Glyph',
        name: 'get/set hex',
        assertion: function() {
            let g = sampleGlyph();
            g.hex = '0x1234';
            return _TEST.is(g.hex).equalTo('0x1234');
        },
    },
    {
        category: 'Glyph',
        name: 'get/set shapes',
        assertion: function() {
            let g = new Glyph();
            g.shapes = [{path: {pathPoints: clone(_TEST.globals.testPathPoints)}}];
            return _TEST.is(g.shapes.length).equalTo(1);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set isAutoWide',
        assertion: function() {
            let g = sampleGlyph();
            g.isAutoWide = false;
            return _TEST.is(g.isAutoWide).equalTo(false);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set glyphWidth',
        assertion: function() {
            let g = sampleGlyph();
            g.glyphWidth = 123;
            return _TEST.is(g.glyphWidth).equalTo(123);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set leftSideBearing',
        assertion: function() {
            let g = sampleGlyph();
            g.leftSideBearing = 456;
            return _TEST.is(g.leftSideBearing).equalTo(456);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set rightSideBearing',
        assertion: function() {
            let g = sampleGlyph();
            g.rightSideBearing = 456;
            return _TEST.is(g.rightSideBearing).equalTo(456);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set ratioLock',
        assertion: function() {
            let g = sampleGlyph();
            g.ratioLock = true;
            return _TEST.is(g.ratioLock).equalTo(true);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set usedIn',
        assertion: function() {
            let g = sampleGlyph();
            g.usedIn = ['0x1235', '0x1236'];
            return _TEST.is(g.usedIn).equalTo(['0x1235', '0x1236']);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set contextGlyphs',
        assertion: function() {
            let g = sampleGlyph();
            g.contextGlyphs = 'asdf';
            return _TEST.is(g.contextGlyphs).equalTo('asdf');
        },
    },
    {
        category: 'Glyph',
        name: 'get/set x',
        assertion: function() {
            let g = sampleGlyph();
            g.x = 789;
            return _TEST.is(g.x).equalTo(789);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set y',
        assertion: function() {
            let g = sampleGlyph();
            g.y = 789;
            return _TEST.is(g.y).equalTo(789);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set width',
        assertion: function() {
            let g = sampleGlyph();
            g.width = 123;
            return _TEST.is(g.width).equalTo(123);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set height',
        assertion: function() {
            let g = sampleGlyph();
            g.height = 123;
            return _TEST.is(g.height).equalTo(123);
        },
    },
    {
        category: 'Glyph',
        name: 'get/set maxes',
        assertion: function() {
            let g = sampleGlyph();
            g.maxes = {xMax: 123, xMin: 123, yMax: 435, yMin: 345};
            return _TEST.is(g.maxes.save()).equalTo({xMax: 123, xMin: 123, yMax: 435, yMin: 345});
        },
    },
    {
        category: 'Glyph',
        name: 'flipNS',
        assertion: function() {
            let g = multiTriangleGlyph();
            g.flipNS();
            return _TEST.is(g.shapes[0].path.pathPoints[0].p.x).equalTo(400);
        },
    },
    {
        category: 'Glyph',
        name: 'flipEW',
        assertion: function() {
            let g = multiTriangleGlyph();
            g.flipEW();
            return _TEST.is(g.shapes[0].path.pathPoints[0].p.x).equalTo(207.49999995426862);
        },
    },
    {
        category: 'Glyph',
        name: 'rotate',
        assertion: function() {
            let g = multiTriangleGlyph();
            g.rotate(2, {x: 123, y: 123});
            return _TEST.is(g.shapes[0].path.pathPoints[0].p.x).equalTo(62.555475375006786);
        },
    },
    {
        category: 'Glyph',
        name: 'reverseWinding',
        assertion: function() {
            let g = sampleGlyph();
            g.reverseWinding();
            return _TEST.is(g.shapes[0].path.winding).equalTo(5);
        },
    },
    {
        category: 'Glyph',
        name: 'alignShapes',
        assertion: function() {
            let g = multiTriangleGlyph();
            g.alignShapes('right');
            return _TEST.is(g.shapes[2].maxes.xMax).equalTo(800);
        },
    }
);

/*

flipNS(mid)
flipEW(mid)
rotate(angle, about)
reverseWinding()
alignShapes(edge)

containsComponents()
canAddComponent(cid)
collectAllDownstreamLinks(re = [], excludePeers = false)
collectAllUpstreamLinks(re = [])
deleteLinks(thisID)
drawGlyph(ctx, view =x: 0, y: 0, z: 1}, alpha = 1, addLSB = false, fill = '#000')
drawMultiSelectAffordances(color = '#000')
isHere(x, y)
isOverControlPoint(x, y, targetSize, noHandles)
makeSVG(size = 50, gutter = 5)
makeSVGPathData()
makeOpenTypeJsPath(otPath)
flattenGlyph()
combineAllShapes(dontToast = false, dontResolveOverlaps = false)
resolveOverlapsForAllShapes()
copyShapesTo(destinationID, copyGlyphAttributes =
hasShapes()
removeShapesWithZeroLengthPaths()
addToUsedIn(linkID)
removeFromUsedIn(linkID)
*/
