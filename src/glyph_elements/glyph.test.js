import Glyph from './glyph.js';
import {clone} from '../common/functions.js';
import Shape from './shape.js';
import {samples} from '../samples/samples.js';

/**
 * Create a sample Glyph
 * @returns {Glyph}
 */
function sampleGlyph() {
	return new Glyph({shapes: [{path: {pathPoints: clone(samples.pathPoints)}}]});
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


describe('Glyph', () => {
	it('save', () => {
		expect(sampleGlyph().save()).toEqual(JSON.parse('{"id":"0x0000","shapes":[{"path":{"winding":-5,"pathPoints":[{"p":{"coord":{"x":326.65249430318556,"y":500}},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500}},"h2":{"coord":{"x":413.45994211401285,"y":500}}},{"p":{"coord":{"x":484,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709}},"h2":{"coord":{"x":484,"y":257.92406046386174}}},{"p":{"coord":{"x":326.65249430318556,"y":186}},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186}},"h2":{"coord":{"x":239.15010236167052,"y":186}}},{"p":{"coord":{"x":170,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707}},"h2":{"coord":{"x":170,"y":429.9040095221619}}}]}}]}'));
	});

	it('print', () => {
		expect(sampleGlyph().print()).toBeTruthy();
	});

	it('get/set id', () => {
		const g = sampleGlyph();
		g.id = '0x1234';
		expect(g.id).toBe('0x1234');
	});

	it('get/set shapes', () => {
		const g = new Glyph();
		g.shapes = [{path: {pathPoints: clone(samples.pathPoints)}}];
		expect(g.shapes.length).toBe(1);
	});

	it('get/set isAutoWide', () => {
		const g = sampleGlyph();
		g.isAutoWide = false;
		expect(g.isAutoWide).toBe(false);
	});

	it('get/set glyphWidth', () => {
		const g = sampleGlyph();
		g.glyphWidth = 123;
		expect(g.glyphWidth).toBe(123);
	});

	it('get/set leftSideBearing', () => {
		const g = sampleGlyph();
		g.leftSideBearing = 456;
		expect(g.leftSideBearing).toBe(456);
	});

	it('get/set rightSideBearing', () => {
		const g = sampleGlyph();
		g.rightSideBearing = 456;
		expect(g.rightSideBearing).toBe(456);
	});

	it('get/set ratioLock', () => {
		const g = sampleGlyph();
		g.ratioLock = true;
		expect(g.ratioLock).toBe(true);
	});

	it('get/set usedIn', () => {
		const g = sampleGlyph();
		g.usedIn = ['0x1235', '0x1236'];
		expect(g.usedIn).toEqual(['0x1235', '0x1236']);
	});

	it('get/set x', () => {
		const g = sampleGlyph();
		g.x = 789;
		expect(g.x).toBe(789);
	});

	it('get/set y', () => {
		const g = sampleGlyph();
		g.y = 789;
		expect(g.y).toBe(789);
	});

	it('get/set width', () => {
		const g = sampleGlyph();
		g.width = 123;
		expect(g.width).toBe(123);
	});

	it('get/set height', () => {
		const g = sampleGlyph();
		g.height = 123;
		expect(g.height).toBe(123);
	});

	it('get/set maxes', () => {
		const g = sampleGlyph();
		g.maxes = {xMax: 123, xMin: 123, yMax: 435, yMin: 345};
		expect(g.maxes.save()).toEqual({xMax: 123, xMin: 123, yMax: 435, yMin: 345});
	});

	it('flipNS', () => {
		const g = multiTriangleGlyph();
		g.flipNS();
		expect(g.shapes[0].path.pathPoints[0].p.x).toBe(400);
	});

	it('flipEW', () => {
		const g = multiTriangleGlyph();
		g.flipEW();
		expect(g.shapes[0].path.pathPoints[0].p.x).toBe(207.49999995426862);
	});

	it('rotate', () => {
		const g = multiTriangleGlyph();
		g.rotate(2, {x: 123, y: 123});
		expect(g.shapes[0].path.pathPoints[0].p.x).toBe(62.555475375006786);
	});

	it('reverseWinding', () => {
		const g = sampleGlyph();
		g.reverseWinding();
		expect(g.shapes[0].path.winding).toBe(5);
	});

	it('alignShapes', () => {
		const g = multiTriangleGlyph();
		g.alignShapes('right');
		expect(g.shapes[2].maxes.xMax).toBe(800);
	});

	it('isOverControlPoint', () => {
		expect(sampleGlyph().isOverControlPoint(484, 343.5).type).toBe('p');
	});

	it('makeSVG', () => {
		// also tests makeSVGPathData
		expect(sampleGlyph().makeSVG()).toBe('<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" viewBox=\"0,0,990,990\"><g transform=\"translate(100,650) scale(0.8,-0.8)\"><path d=\"M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z\"/></g></svg>');
	});

	// it('combineAllShapes', () => {
	//   const s1 = new Shape({path: {pathPoints: [
	//     {p: {coord: {x: 100, y: 200}}},
	//     {p: {coord: {x: 300, y: 600}}},
	//     {p: {coord: {x: 400, y: 500}}},
	//   ]}});
	//   const s2 = new Shape(s1);
	//   s2.y = 500;

	//   const g = new Glyph({shapes: [s1, s2]});

	//   const re = g.combineAllShapes(true, true);
	//   expect(re.shapes.length).toBe(1);
	// });

	it('hasShapes', () => {
		expect(sampleGlyph().hasShapes()).toBeTruthy();
	});

	it('removeShapesWithZeroLengthPaths', () => {
		const g = sampleGlyph();
		g.shapes.push(new Shape());
		expect(g.removeShapesWithZeroLengthPaths().shapes.length).toBe(1);
	});

	it('addToUsedIn / RemoveFromUsedIn', () => {
		const g = sampleGlyph();
		g.addToUsedIn('0x0012');
		g.addToUsedIn('0x0322');
		g.addToUsedIn('0x0004');
		g.removeFromUsedIn('0x0012');
		expect(g.usedIn[0]).toBe('0x0004');
	});
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

*/
