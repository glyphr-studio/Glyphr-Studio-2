import Glyph from './glyph.js';
import {clone} from '../app/functions.js';
import Shape from './shape.js';

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
        name: 'save',
        assertion: function() {
            return _TEST.is(sampleGlyph().save()).equalTo(JSON.parse('{"hex":"0x0000","shapes":[{"path":{"winding":-5,"pathPoints":[{"p":{"coord":{"x":326.65249430318556,"y":500},"use":true},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500},"use":true},"h2":{"coord":{"x":413.45994211401285,"y":500},"use":true}},{"p":{"coord":{"x":484,"y":343.4570087834163},"use":true},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709},"use":true},"h2":{"coord":{"x":484,"y":257.92406046386174},"use":true}},{"p":{"coord":{"x":326.65249430318556,"y":186},"use":true},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186},"use":true},"h2":{"coord":{"x":239.15010236167052,"y":186},"use":true}},{"p":{"coord":{"x":170,"y":343.4570087834163},"use":true},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707},"use":true},"h2":{"coord":{"x":170,"y":429.9040095221619},"use":true}}]}}]}'));
        },
    },
    {
        category: 'Glyph',
        name: 'print',
        assertion: function() {
            return _TEST.expression(sampleGlyph().print());
        },
    },
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
    },
    {
        category: 'Glyph',
        name: 'isHere',
        assertion: function() {
            return _TEST.expression(sampleGlyph().isHere(300, 300));
        },
    },
    {
        category: 'Glyph',
        name: 'isOverControlPoint',
        assertion: function() {
            return _TEST.is(sampleGlyph().isOverControlPoint(484, 343.5).type).equalTo('p');
        },
    },
    {
        category: 'Glyph',
        name: 'makeSVG',
        assertion: function() {
            // also tests makeSVGPathData
            return _TEST.is(sampleGlyph().makeSVG()).equalTo('<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" viewBox=\"0,0,990,990\"><g transform=\"translate(100,650) scale(0.8,-0.8)\"><path d=\"M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z\"/></g></svg>');
        },
    },
    {
        category: 'Glyph',
        name: 'makeOpenTypeJSPath',
        assertion: function() {
            return _TEST.is(sampleGlyph().makeOpenTypeJSPath()).equalTo(JSON.parse('{"commands":[{"type":"M","x":327,"y":500},{"type":"C","x1":413,"y1":500,"x2":484,"y2":429,"x":484,"y":343},{"type":"C","x1":484,"y1":258,"x2":414,"y2":186,"x":327,"y":186},{"type":"C","x1":239,"y1":186,"x2":170,"y2":257,"x":170,"y":343},{"type":"C","x1":170,"y1":430,"x2":240,"y2":500,"x":327,"y":500},{"type":"Z"}],"fill":"black","stroke":null,"strokeWidth":1}'));
        },
    },
    {
        category: 'Glyph',
        name: 'combineAllShapes',
        assertion: function() {
            let s1 = new Shape({path: {pathPoints: [
                {p: {coord: {x: 100, y: 200}}},
                {p: {coord: {x: 300, y: 600}}},
                {p: {coord: {x: 400, y: 500}}},
            ]}});
            let s2 = new Shape(s1);
            s2.y = 500;

            let g = new Glyph({shapes: [s1, s2]});

            let re = g.combineAllShapes(true, true);
            return _TEST.is(re.shapes.length).equalTo(1);
        },
    },
    {
        category: 'Glyph',
        name: 'resolveOverlapsForAllShapes',
        assertion: function() {
            let g = sampleGlyph();
            // Pull the top coord down below the original bottom coord
            g.shapes[0].path.pathPoints[0].p.y = 100;

            debug(`\n TEST Glyph.resolveOverlapsForAllShapes - START`);
            debug(`\t BEFORE SPLIT`);
            debug(g.print());

            g.resolveOverlapsForAllShapes();

            debug(`\t AFTER SPLIT`);
            debug(g.print());

            return _TEST.is(g.shapes.length).equalTo(3);
        },
    },
    {
        category: 'Glyph',
        name: 'hasShapes',
        assertion: function() {
            return _TEST.expression(sampleGlyph().hasShapes());
        },
    },
    {
        category: 'Glyph',
        name: 'removeShapesWithZeroLengthPaths',
        assertion: function() {
            let g = sampleGlyph();
            g.shapes.push(new Shape());
            return _TEST.is(g.removeShapesWithZeroLengthPaths().shapes.length).equalTo(1);
        },
    },
    {
        category: 'Glyph',
        name: 'addToUsedIn / RemoveFromUsedIn',
        assertion: function() {
            let g = sampleGlyph();
            g.addToUsedIn('0x0012');
            g.addToUsedIn('0x0322');
            g.addToUsedIn('0x0004');
            g.removeFromUsedIn('0x0012');
            return _TEST.is(g.usedIn[0]).equalTo('0x0004');
        },
    }
);

/*
CROSS GLYPH METHODS
canAddComponent(cid)
collectAllDownstreamLinks(re = [], excludePeers = false)
collectAllUpstreamLinks(re = [])
deleteLinks(thisID)
flattenGlyph()
copyShapesTo(destinationID, copyGlyphAttributes =

DRAW METHODS
drawGlyph(ctx, view =x: 0, y: 0, z: 1}, alpha = 1, addLSB = false, fill = '#000')
drawMultiSelectAffordances(color = '#000')

*/
