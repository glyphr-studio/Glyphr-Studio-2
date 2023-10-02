import { assert, describe, expect, it } from 'vitest';
import { XYPoint } from '../xy_point.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	(no methods besides constructor)
*/
describe('XYPoint', () => {
	it('Constructor - x', () => {
		expect(new XYPoint(101, 123).x).toBe(101);
	});

	it('Constructor - y', () => {
		expect(new XYPoint(101, 123).y).toBe(123);
	});

	it('X Setter', () => {
		const xyp = new XYPoint(101, 123);
		xyp.x = 789;
		expect(xyp.x).toBe(789);
	});

	it('Y Setter', () => {
		const xyp = new XYPoint(101, 123);
		xyp.y = 789;
		expect(xyp.y).toBe(789);
	});

	it('NaN Detection', () => {
		const nanTest = new XYPoint('a', 'b');
		expect(nanTest.x === 0);
		expect(nanTest.y === 0);
	});
});
