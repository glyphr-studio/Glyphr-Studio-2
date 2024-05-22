import { describe, expect, it } from 'vitest';
import { clone } from '../../common/functions.js';
import { samples } from '../../samples/samples.js';
import { Glyph } from '../glyph.js';

/**
 * Create a sample Glyph
 * @returns {Glyph}
 */
function sampleGlyph() {
	// console.log('SAMPLE PATH POINTS');
	// console.log(samples.pathPoints);
	let re = new Glyph({ id: 'glyph-0x41' });
	re.shapes = [{ pathPoints: clone(samples.pathPoints) }];

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
		id: 'glyph-0x41',
		shapes: [
			{
				name: 'Path One',
				pathPoints: [
					{ p: { coord: { x: 100, y: 200 } } },
					{ p: { coord: { x: 300, y: 600 } } },
					{ p: { coord: { x: 400, y: 500 } } },
				],
			},
			{
				name: 'Path Two',
				pathPoints: [
					{ p: { coord: { x: 500, y: 600 } } },
					{ p: { coord: { x: 700, y: 950 } } },
					{ p: { coord: { x: 800, y: 900 } } },
				],
			},
			{
				name: 'Path Three',
				pathPoints: [
					{ p: { coord: { x: 10, y: 20 } } },
					{ p: { coord: { x: 30, y: 60 } } },
					{ p: { coord: { x: 40, y: 50 } } },
				],
			},
		],
	});

	// re.recalculateMaxes();
	// console.log(re);
	return re;
}

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	save
	print
	get/set id
	get/set shapes - also tests addOneShape
	get/set advanceWidth
	get/set ratioLock
	get/set usedIn
	get/set gsub
	get/set contextCharacters
	get/set x
	get/set y
	get/set width
	get/set height
	get/set leftSideBearing
	get/set rightSideBearing
	get/set name
	get char
	get contentType
	setGlyphPosition
	updateGlyphPosition
	setGlyphSize
	updateGlyphSize
	flipNS
	flipEW
	roundAll
	rotate
	reverseWinding
	get svgPathData
	get maxes - also tests recalculateMaxes
*/
describe('Glyph - Getters and Setters', () => {
	it('get/set id', () => {
		const g = sampleGlyph();
		g.id = '0x1234';
		expect(g.id).toBe('0x1234');
	});

	it('get/set paths', () => {
		const g = new Glyph();
		g.shapes = [{ path: { pathPoints: clone(samples.pathPoints) } }];
		expect(g.shapes.length).toBe(1);
	});

	it('get/set advanceWidth', () => {
		const g = sampleGlyph();
		g.advanceWidth = 123;
		expect(g.advanceWidth).toBe(123);
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

	it('get/set name', () => {
		const g = sampleGlyph();
		g.name = 'Sample Test Glyph';
		expect(g.name).toBe('Sample Test Glyph');
	});

	it('get char and chars', () => {
		const g = sampleGlyph();
		expect(g.chars).toBe('A');
	});

	it('get contentType', () => {
		const g = sampleGlyph();
		expect(g.contentType).toBe('paths');
	});

	it('get/set transformOrigin', () => {
		const g = sampleGlyph();
		g.transformOrigin = 'top-left';
		expect(g.transformOrigin).toBe('top-left');
		g.transformOrigin = 'error';
		expect(g.transformOrigin).toBe('baseline-left');
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

	it('get/set gsub', () => {
		const g = sampleGlyph();
		g.gsub = ['0x1235', '0x1236'];
		expect(g.gsub).toEqual(['0x1235', '0x1236']);
	});

	it('get/set contextCharacters', () => {
		const g = sampleGlyph();
		g.contextCharacters = 'abcdef';
		expect(g.contextCharacters).toEqual('abcdef');
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

	it('get maxes', () => {
		const g = sampleGlyph();

		expect(g.maxes.save()).toEqual({ xMax: 484, xMin: 170, yMax: 500, yMin: 186 });
	});

	it('get maxes', () => {
		const g = multiTriangleGlyph();
		expect(g.maxes.yMax).toBe(950);
	});
});

describe('Glyph - outputs', () => {
	it('save', () => {
		expect(sampleGlyph().save().shapes[0].winding).toEqual(-5);
	});

	it('print', () => {
		expect(sampleGlyph().print()).toBeTruthy();
	});

	it('makeSVG', () => {
		// also tests makeSVGPathData
		expect(
			sampleGlyph().svgPathData.startsWith(
				'M0,0M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.457'
			)
		).toBeTruthy();
	});
});

describe('Glyph - updating', () => {
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
		g.setGlyphSize({ width: 10 });
		expect(g.width).toBe(10);
	});

	it('updateGlyphSize', () => {
		const g = sampleGlyph();
		g.updateGlyphSize({ width: 500 });
		expect(g.width).toBe(814);
	});

	it('flipNS', () => {
		const g = multiTriangleGlyph();
		g.flipNS();
		expect(g.shapes[0].pathPoints[0].p.coord.x).toBe(400);
	});

	it('flipEW', () => {
		const g = multiTriangleGlyph();
		g.flipEW();
		expect(g.shapes[0].pathPoints[0].p.coord.x).toBe(410);
	});

	it('roundAll', () => {
		const g = multiTriangleGlyph();
		g.shapes[0].pathPoints[0].p.coord.x = 410.123;
		g.roundAll();
		expect(g.shapes[0].pathPoints[0].p.coord.x).toBe(410);
	});

	it('rotate', () => {
		const g = multiTriangleGlyph();
		g.rotate(2, { x: 123, y: 123 });
		expect(g.shapes[0].pathPoints[0].p.coord.x).toBe(62.555475375006786);
	});

	it('reverseWinding', () => {
		const g = sampleGlyph();
		g.reverseWinding();
		expect(g.shapes[0].winding).toBeGreaterThan(0);
	});
});
