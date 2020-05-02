// import Glyph from './glyph.js';
// import {clone} from '../common/functions.js';
// import Shape from './shape.js';
const Glyph = require('./glyph');
const clone = require('../common/functions');
const Shape = require('./shape');

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


it('Glyph: save', () => {
  expect(sampleGlyph().save()).toBe(JSON.parse('{"id":"0x0000","shapes":[{"path":{"winding":-5,"pathPoints":[{"p":{"coord":{"x":326.65249430318556,"y":500},"use":true},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500},"use":true},"h2":{"coord":{"x":413.45994211401285,"y":500},"use":true}},{"p":{"coord":{"x":484,"y":343.4570087834163},"use":true},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709},"use":true},"h2":{"coord":{"x":484,"y":257.92406046386174},"use":true}},{"p":{"coord":{"x":326.65249430318556,"y":186},"use":true},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186},"use":true},"h2":{"coord":{"x":239.15010236167052,"y":186},"use":true}},{"p":{"coord":{"x":170,"y":343.4570087834163},"use":true},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707},"use":true},"h2":{"coord":{"x":170,"y":429.9040095221619},"use":true}}]}}]}'));
});

it('Glyph: print', () => {
  expect(sampleGlyph().print()).toBeTruthy();
});

it('Glyph: get/set id', () => {
  const g = sampleGlyph();
  g.id = '0x1234';
  expect(g.id).toBe('0x1234');
});

it('Glyph: get/set shapes', () => {
  const g = new Glyph();
  g.shapes = [{path: {pathPoints: clone(_TEST.globals.testPathPoints)}}];
  expect(g.shapes.length).toBe(1);
});

it('Glyph: get/set isAutoWide', () => {
  const g = sampleGlyph();
  g.isAutoWide = false;
  expect(g.isAutoWide).toBe(false);
});

it('Glyph: get/set glyphWidth', () => {
  const g = sampleGlyph();
  g.glyphWidth = 123;
  expect(g.glyphWidth).toBe(123);
});

it('Glyph: get/set leftSideBearing', () => {
  const g = sampleGlyph();
  g.leftSideBearing = 456;
  expect(g.leftSideBearing).toBe(456);
});

it('Glyph: get/set rightSideBearing', () => {
  const g = sampleGlyph();
  g.rightSideBearing = 456;
  expect(g.rightSideBearing).toBe(456);
});

it('Glyph: get/set ratioLock', () => {
  const g = sampleGlyph();
  g.ratioLock = true;
  expect(g.ratioLock).toBe(true);
});

it('Glyph: get/set usedIn', () => {
  const g = sampleGlyph();
  g.usedIn = ['0x1235', '0x1236'];
  expect(g.usedIn).toBe(['0x1235', '0x1236']);
});

it('Glyph: get/set contextGlyphs', () => {
  const g = sampleGlyph();
  g.contextGlyphs = 'asdf';
  expect(g.contextGlyphs).toBe('asdf');
});

it('Glyph: get/set x', () => {
  const g = sampleGlyph();
  g.x = 789;
  expect(g.x).toBe(789);
});

it('Glyph: get/set y', () => {
  const g = sampleGlyph();
  g.y = 789;
  expect(g.y).toBe(789);
});

it('Glyph: get/set width', () => {
  const g = sampleGlyph();
  g.width = 123;
  expect(g.width).toBe(123);
});

it('Glyph: get/set height', () => {
  const g = sampleGlyph();
  g.height = 123;
  expect(g.height).toBe(123);
});

it('Glyph: get/set maxes', () => {
  const g = sampleGlyph();
  g.maxes = {xMax: 123, xMin: 123, yMax: 435, yMin: 345};
  expect(g.maxes.save()).toBe({xMax: 123, xMin: 123, yMax: 435, yMin: 345});
});

it('Glyph: flipNS', () => {
  const g = multiTriangleGlyph();
  g.flipNS();
  expect(g.shapes[0].path.pathPoints[0].p.x).toBe(400);
});

it('Glyph: flipEW', () => {
  const g = multiTriangleGlyph();
  g.flipEW();
  expect(g.shapes[0].path.pathPoints[0].p.x).toBe(207.49999995426862);
});

it('Glyph: rotate', () => {
  const g = multiTriangleGlyph();
  g.rotate(2, {x: 123, y: 123});
  expect(g.shapes[0].path.pathPoints[0].p.x).toBe(62.555475375006786);
});

it('Glyph: reverseWinding', () => {
  const g = sampleGlyph();
  g.reverseWinding();
  expect(g.shapes[0].path.winding).toBe(5);
});

it('Glyph: alignShapes', () => {
  const g = multiTriangleGlyph();
  g.alignShapes('right');
  expect(g.shapes[2].maxes.xMax).toBe(800);
});

it('Glyph: isHere', () => {
  expect(sampleGlyph().isHere(300, 300)).toBeTruthy();
});

it('Glyph: isOverControlPoint', () => {
  expect(sampleGlyph().isOverControlPoint(484, 343.5).type).toBe('p');
});

it('Glyph: makeSVG', () => {
  // also tests makeSVGPathData
  expect(sampleGlyph().makeSVG()).toBe('<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" viewBox=\"0,0,990,990\"><g transform=\"translate(100,650) scale(0.8,-0.8)\"><path d=\"M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z\"/></g></svg>');
});

it('Glyph: makeOpenTypeJSPath', () => {
  expect(sampleGlyph().makeOpenTypeJSPath()).toBe(JSON.parse('{"commands":[{"type":"M","x":327,"y":500},{"type":"C","x1":413,"y1":500,"x2":484,"y2":429,"x":484,"y":343},{"type":"C","x1":484,"y1":258,"x2":414,"y2":186,"x":327,"y":186},{"type":"C","x1":239,"y1":186,"x2":170,"y2":257,"x":170,"y":343},{"type":"C","x1":170,"y1":430,"x2":240,"y2":500,"x":327,"y":500},{"type":"Z"}],"fill":"black","stroke":null,"strokeWidth":1}'));
});

it('Glyph: combineAllShapes', () => {
  const s1 = new Shape({path: {pathPoints: [
    {p: {coord: {x: 100, y: 200}}},
    {p: {coord: {x: 300, y: 600}}},
    {p: {coord: {x: 400, y: 500}}},
  ]}});
  const s2 = new Shape(s1);
  s2.y = 500;

  const g = new Glyph({shapes: [s1, s2]});

  const re = g.combineAllShapes(true, true);
  expect(re.shapes.length).toBe(1);
});

it('Glyph: hasShapes', () => {
  expect(sampleGlyph().hasShapes()).toBeTruthy();
});

it('Glyph: removeShapesWithZeroLengthPaths', () => {
  const g = sampleGlyph();
  g.shapes.push(new Shape());
  expect(g.removeShapesWithZeroLengthPaths().shapes.length).toBe(1);
});

it('Glyph: addToUsedIn / RemoveFromUsedIn', () => {
  const g = sampleGlyph();
  g.addToUsedIn('0x0012');
  g.addToUsedIn('0x0322');
  g.addToUsedIn('0x0004');
  g.removeFromUsedIn('0x0012');
  expect(g.usedIn[0]).toBe('0x0004');
});

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
