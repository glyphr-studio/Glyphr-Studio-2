import { Segment } from '../segment.js';
import {
	segmentsAreEqual,
	findSegmentIntersections,
	findOverlappingLineSegmentIntersections,
	findCrossingLineSegmentIntersections,
	findEndPointSegmentIntersections,
} from '../poly_segment.js';
import { round } from '../../common/functions.js';

// basically an upper-left quadrant quarter circle
// Test Segment at t=0.5 is {x: 62.5, y: 137.5}
const testSegment1 = { p1x: 0, p1y: 0, p2x: 0, p2y: 100, p3x: 100, p3y: 200, p4x: 200, p4y: 200 };

/**
 * easy segment for testing
 * @returns {Segment}
 */
function sampleSegment() {
	return new Segment(testSegment1);
}

describe('Segment', () => {
	it('save', () => {
		expect(sampleSegment().save()).toEqual({
			p1x: 0,
			p1y: 0,
			p2x: 0,
			p2y: 100,
			p3x: 100,
			p3y: 200,
			p4x: 200,
			p4y: 200,
		});
	});

	it('lineType getter', () => {
		// also tests determineLineType
		const seg = new Segment({ p1x: 0, p1y: 100, p4x: 100, p4y: 0 });
		expect(seg.lineType).toBe('diagonal');
	});

	it('length getter', () => {
		expect(sampleSegment().length).toBe(309.8050662153215);
	});

	it('baseLength', () => {
		//these also test getLineLength
		expect(sampleSegment().baseLength).toBe(282.842712474619);
	});

	it('topLength', () => {
		//these also test getLineLength
		expect(sampleSegment().topLength).toBe(341.4213562373095);
	});

	it('quickLength getter', () => {
		expect(sampleSegment().quickLength).toBe(341.4213562373095);
	});

	it('maxes getter', () => {
		expect(sampleSegment().maxes.xMax).toBe(200);
	});

	it('split', () => {
		expect(sampleSegment().split()[1].p1x).toBe(62.5);
	});

	it('splitAtPoint', () => {
		expect(sampleSegment().splitAtPoint({ x: 62.5, y: 137.5 })[1].p1x).toBe(62.42971272735194);
	});

	it('splitAtTime', () => {
		expect(sampleSegment().splitAtTime(0.5)[1].p1x).toBe(62.5);
	});

	it('splitAtManyPoints', () => {
		const points = [
			{ x: 29.0763, y: 95.4063 }, // t=0.33
			{ x: 101.9304, y: 169.2504 }, // t=0.66
		];

		const segs = sampleSegment().splitAtManyPoints(points);

		expect(round(segs[2].p1x)).toBe(102);
	});

	it('pointIsWithinMaxes', () => {
		expect(sampleSegment().pointIsWithinMaxes({ x: 100, y: 100 })).toBeTruthy();
	});

	it('convertToLine', () => {
		expect(sampleSegment().convertToLine().lineType).toBe('diagonal');
	});

	it('findXYPointFromSplit', () => {
		expect(sampleSegment().findXYPointFromSplit().y).toBe(137.5);
	});

	it('calculateLength', () => {
		expect(sampleSegment().calculateLength()).toBe(309.8050662153215);
	});

	it('getSplitFromXYPoint', () => {
		expect(round(sampleSegment().getSplitFromXYPoint({ x: 62.5, y: 137.5 }).split, 2)).toBe(0.5);
	});

	it('getReverse', () => {
		expect(sampleSegment().getReverse().p1x).toBe(200);
	});

	it('getXYPoint', () => {
		expect(sampleSegment().getXYPoint(4).x).toBe(200);
	});

	it('getFastMaxes', () => {
		expect(sampleSegment().getFastMaxes().xMax).toBe(200);
	});

	// recalculateMaxes

	it('isLineOverlappedByLine', () => {
		const seg = new Segment({ p1x: 50, p1y: 50, p4x: 150, p4y: 150 });
		expect(seg.isLineOverlappedByLine(sampleSegment().convertToLine())).toBeTruthy();
	});

	it('containsTerminalPoint start', () => {
		// also tests Segment.containsStartPoint
		expect(sampleSegment().containsTerminalPoint({ x: 0, y: 0 })).toBe('start');
	});

	it('containsTerminalPoint end', () => {
		// also tests Segment.containsEndPoint
		expect(sampleSegment().containsTerminalPoint({ x: 200, y: 200 })).toBe('end');
	});

	it('containsPointOnCurve', () => {
		expect(sampleSegment().containsPointOnCurve({ x: 29.0763, y: 95.4063 })).toBeTruthy();
	});

	it('containsPointOnLine', () => {
		expect(sampleSegment().convertToLine().containsPointOnLine({ x: 100, y: 100 })).toBeTruthy();
	});

	it('precedes', () => {
		const seg2 = new Segment({ p1x: 200, p1y: 200 });
		expect(sampleSegment().precedes(seg2)).toBeTruthy();
	});

	it('isLine', () => {
		expect(sampleSegment().convertToLine().lineType).toBeTruthy();
	});

	it('roundAll', () => {
		const seg = sampleSegment();
		seg.p2y = 123.4559;
		expect(seg.roundAll(3).p2y).toBe(123.456);
	});

	it('findSegmentIntersections', () => {
		// basically an upper-right quadrant quarter circle
		const seg2 = new Segment({
			p1x: 0,
			p1y: 200,
			p2x: 100,
			p2y: 200,
			p3x: 200,
			p3y: 100,
			p4x: 200,
			p4y: 0,
		});
		expect(findSegmentIntersections(sampleSegment(), seg2)[0]).toBe('100/168.004');
	});

	it('segmentsAreEqual', () => {
		expect(segmentsAreEqual(sampleSegment(), sampleSegment())).toBeTruthy();
	});

	it('findOverlappingLineSegmentIntersections', () => {
		const seg1 = new Segment({ p1x: 0, p1y: 0, p4x: 100, p4y: 0 });
		const seg2 = new Segment({ p1x: 50, p1y: 0, p4x: 200, p4y: 0 });
		expect(findOverlappingLineSegmentIntersections(seg1, seg2)[0]).toBe('50/0');
	});

	it('findCrossingLineSegmentIntersections', () => {
		const seg1 = new Segment({ p1x: 0, p1y: 0, p4x: 100, p4y: 100 });
		const seg2 = new Segment({ p1x: 0, p1y: 100, p4x: 100, p4y: 0 });
		expect(findCrossingLineSegmentIntersections(seg1, seg2)[0]).toBe('50/50');
	});

	it('findEndPointSegmentIntersections', () => {
		const seg1 = sampleSegment();
		const seg2 = new Segment({ p1x: 200, p1y: 200 });
		expect(findEndPointSegmentIntersections(seg1, seg2)[0]).toBe('200/200');
	});
});
