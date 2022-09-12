import { Glyph } from '../glyph.js';
import { clone, numSan } from '../../common/functions.js';
import { samples } from '../../samples/samples.js';
import { Path } from '../path.js';

/**
 * Create a sample Glyph
 * @returns {Glyph}
 */
function sampleGlyph() {
	// console.log('SAMPLE PATH POINTS');
	// console.log(samples.pathPoints);
	let re = new Glyph();
	re.paths = [{pathPoints: clone(samples.pathPoints)}];

	// re.recalculateMaxes();
	// console.log('SAMPLE GLYPH');
	// console.log(re);
	return re;
}

/**
 * Create a multi-path Glyph
 * @returns {Glyph}
 */
function multiTriangleGlyph() {
	let re = new Glyph({
		paths: [
			{
				name: 'Path One',
				pathPoints: [
					{p: {coord: {x: 100, y: 200}}},
					{p: {coord: {x: 300, y: 600}}},
					{p: {coord: {x: 400, y: 500}}},
				]
			},
			{
				name: 'Path Two',
				pathPoints: [
					{p: {coord: {x: 500, y: 600}}},
					{p: {coord: {x: 700, y: 950}}},
					{p: {coord: {x: 800, y: 900}}},
				]
			},
			{
				name: 'Path Three',
				pathPoints: [
					{p: {coord: {x: 10, y: 20}}},
					{p: {coord: {x: 30, y: 60}}},
					{p: {coord: {x: 40, y: 50}}},
				]
			},
		]
	});

	// re.recalculateMaxes();
	// console.log(re);
	return re;
}


describe('Glyph', () => {
	beforeAll(() => {
		spyOn(console, 'log').and.callThrough();
	});

	it('save', () => {
		expect(sampleGlyph().save()).toEqual(JSON.parse(`
			{
				"id":"0x0000",
				"paths":[
					{
						"name": "Path",
						"winding":-5,
						"pathPoints":[
							{"p":{"coord":{"x":326.65249430318556,"y":500}},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500}},"h2":{"coord":{"x":413.45994211401285,"y":500}}},
							{"p":{"coord":{"x":484,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709}},"h2":{"coord":{"x":484,"y":257.92406046386174}}},
							{"p":{"coord":{"x":326.65249430318556,"y":186}},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186}},"h2":{"coord":{"x":239.15010236167052,"y":186}}},
							{"p":{"coord":{"x":170,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707}},"h2":{"coord":{"x":170,"y":429.9040095221619}}}
						]
					}
				]
			}
		`));
	});

	it('print', () => {
		expect(sampleGlyph().print()).toBeTruthy();
	});

	it('get/set id', () => {
		const g = sampleGlyph();
		g.id = '0x1234';
		expect(g.id).toBe('0x1234');
	});

	it('get/set paths', () => {
		const g = new Glyph();
		g.paths = [{'path': {pathPoints: clone(samples.pathPoints)}}];
		expect(g.paths.length).toBe(1);
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

	it('get maxes', () => {
		const g = multiTriangleGlyph();
		expect(g.maxes.xMin).toEqual(10);
	});


	it('get/set maxes', () => {
		const g = sampleGlyph();
		g.maxes = {xMax: 123, xMin: 123, yMax: 435, yMin: 345};
		expect(g.maxes.save()).toEqual({xMax: 123, xMin: 123, yMax: 435, yMin: 345});
	});

	it('setGlyphPosition', () => {
		const g = sampleGlyph();
		g.setGlyphPosition(1000);
		expect(g.maxes.xMin).toBe(1000);
	});

	it('updateGlyphPosition', () => {
		const g = sampleGlyph();
		g.updateGlyphPosition(0, 100);
		expect(g.maxes.yMax).toBe(600);
	});

	it('setGlyphSize', () => {
		const g = sampleGlyph();
		g.setGlyphSize(10);
		expect(g.width).toBe(10);
	});

	it('updateGlyphSize', () => {
		const g = sampleGlyph();
		g.updateGlyphSize(500);
		expect(g.width).toBe(814);
	});

	it('flipNS', () => {
		const g = multiTriangleGlyph();
		g.flipNS();
		expect(g.paths[0].pathPoints[0].p.coord.x).toBe(400);
	});

	it('flipEW', () => {
		const g = multiTriangleGlyph();
		g.flipEW();
		expect(g.paths[0].pathPoints[0].p.coord.x).toBe(207.5);
	});

	it('rotate', () => {
		const g = multiTriangleGlyph();
		g.rotate(2, {x: 123, y: 123});
		expect(g.paths[0].pathPoints[0].p.coord.x).toBe(62.555475375006786);
	});

	it('reverseWinding', () => {
		const g = sampleGlyph();
		g.reverseWinding();
		expect(g.paths[0].winding).toBeGreaterThan(0);
	});

	it('alignPaths', () => {
		const g = multiTriangleGlyph();
		g.alignPaths('right');
		expect(g.paths[2].maxes.xMax).toBe(800);
	});

	it('makeSVG', () => {
		// also tests makeSVGPathData
		expect(sampleGlyph().makeSVG()).toBe('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0,0,990,990"><g transform="translate(100,650) scale(0.8, -0.8)"><path d="M0,500 C0,500,0,428.9899571,0,343.45700878 C0,257.92406046,0,186,0,186 C0,186,0,257.01000804,0,343.45700878 C0,429.90400952,0,500,0,500Z"/></g></svg>');
	});

	// TODO Boolean Combine write tests
	// flattenGlyph

	// it('combineAllPaths', () => {
	// 	const s1 = new Path({
	// 		name: 's1',
	// 		pathPoints: [
	// 			{p: {coord: {x: 100, y: 200}}},
	// 			{p: {coord: {x: 300, y: 600}}},
	// 			{p: {coord: {x: 400, y: 500}}},
	// 		]
	// 	});

	// 	console.log(s1);
	// 	const s2 = new Path(s1);
	// 	s2.name = 's2';
	// 	s2.y = 500;
	// 	console.log(s2);

	// 	const g = new Glyph({paths: [s1, s2]});
	// 	const re = g.combineAllPaths(true, true);
	// 	console.log(re.paths);
	// 	expect(re.paths.length).toBe(1);
	// });

	it('hasPaths', () => {
		expect(sampleGlyph().hasPaths()).toBeTruthy();
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
