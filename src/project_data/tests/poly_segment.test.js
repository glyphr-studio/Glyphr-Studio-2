import { describe, expect, it } from 'vitest';
import { PolySegment } from '../poly_segment.js';
import { Segment } from '../segment.js';

/*
	constructor
	save
	print
	get/set segments
	get valuesAsArray
	get path
	containsSegment
	roundAll
	findIntersections
	splitSegmentsAtIntersections
	stitchSegmentsTogether
	removeZeroLengthSegments
	removeRedundantLineSegments
	removeNonConnectingSegments
*/
const samplePolySegments = [
	{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
	{ p1x: 300, p1y: 300, p2x: 400, p2y: 300, p3x: 600, p3y: 200, p4x: 600, p4y: 0 },
];

/**
 * Create a sample PolySegment
 * @returns {PolySegment}
 */
function samplePolySegment() {
	return new PolySegment({ segments: samplePolySegments });
}

describe('PolySegment', () => {
	it('save', () => {
		expect(samplePolySegment().save()).toEqual({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
				{ p1x: 300, p1y: 300, p2x: 400, p2y: 300, p3x: 600, p3y: 200, p4x: 600, p4y: 0 },
			],
		});
	});

	it('print', () => {
		expect(samplePolySegment().print()).toEqual(`{PolySegment
  segments: [
    {Segment
        line: false
        p1: 0/0
        p2: 0/100
        p3: 200/300
        p4: 300/300
        maxes:       {xMin:0 xMax:300 yMin:0 yMax:300}
    }
    {Segment
        line: false
        p1: 300/300
        p2: 400/300
        p3: 600/200
        p4: 600/0
        maxes:       {xMin:300 xMax:600 yMin:0 yMax:300}
    }
  ]
}`);
	});

	it('get segments', () => {
		expect(samplePolySegment().segments[0].p3x).toBe(200);
	});

	it('get valuesAsArray', () => {
		expect(samplePolySegment().valuesAsArray).toEqual([
			[0, 0, 0, 100, 200, 300, 300, 300],
			[300, 300, 400, 300, 600, 200, 600, 0],
		]);
	});

	it('get path', () => {
		const p = samplePolySegment().path;
		expect(p.pathPoints.length).toBe(3);
	});

	it('containsSegment', () => {
		expect(
			samplePolySegment().containsSegment(
				new Segment({
					p1x: 0,
					p1y: 0,
					p2x: 0,
					p2y: 100,
					p3x: 200,
					p3y: 300,
					p4x: 300,
					p4y: 300,
				})
			)
		).toBeTruthy();
	});

	it('roundAll', () => {
		const ps = samplePolySegment();
		ps.segments[0].p1x = 123.4557;
		expect(ps.roundAll().segments[0].p1x).toBe(123.456);
	});

	it('findIntersections', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200 },
				{ p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0 },
			],
		});
		expect(ps.findIntersections()[0]).toBe('100/168.004');
	});

	it('splitSegmentsAtIntersections', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200 },
				{ p1x: 0, p1y: 200, p2x: 100, p2y: 200, p3x: 200, p3y: 100, p4x: 200, p4y: 0 },
			],
		});
		expect(ps.splitSegmentsAtIntersections().segments.length).toBe(4);
	});

	it('stitchSegmentsTogether', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p4x: 300, p4y: 300 },
				{ p1x: 600, p1y: 600, p4x: 0, p4y: 0 },
				{ p1x: 300, p1y: 300, p4x: 600, p4y: 600 },
			],
		});
		expect(ps.stitchSegmentsTogether()[0].segments.length).toBe(3);
	});

	it('removeZeroLengthSegments', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
				{ p1x: 300, p1y: 300, p4x: 300, p4y: 300 },
			],
		});
		expect(ps.removeZeroLengthSegments().segments.length).toBe(1);
	});

	it('removeRedundantLineSegments', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 300, p1y: 300, p4x: 700, p4y: 700 },
				{ p1x: 600, p1y: 600, p4x: 500, p4y: 500 },
			],
		});
		ps.removeRedundantLineSegments();
		expect(ps.segments[0].p4x).toBe(700);
		expect(ps.segments.length).toBe(1);

		const ps2 = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
				{ p1x: 300, p1y: 300, p4x: 600, p4y: 600 },
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
			],
		});
		expect(ps2.removeRedundantLineSegments().segments.length).toBe(2);
	});

	it('removeNonConnectingSegments', () => {
		const ps = new PolySegment({
			segments: [
				{ p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 300, p4y: 300 },
				{ p1x: 300, p1y: 300, p4x: 600, p4y: 600 },
				{ p1x: 600, p1y: 600, p4x: 0, p4y: 0 },
				{ p1x: 700, p1y: 700, p2x: 0, p2y: 100, p3x: 200, p3y: 300, p4x: 800, p4y: 800 },
			],
		});
		expect(ps.removeNonConnectingSegments().segments.length).toBe(3);
	});
});
