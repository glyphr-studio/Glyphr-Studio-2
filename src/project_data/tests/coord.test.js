import { describe, expect, it } from 'vitest';
import { xyPointsAreClose } from '../../common/functions.js';
import { Coord } from '../coord.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	save
	print
	x
	y
*/
describe('Coord', () => {
	it('Constructor - x', () => {
		expect(new Coord({ x: 101 }).x).toBe(101);
	});

	it('Constructor - y', () => {
		expect(new Coord({ x: 101 }).y).toBe(0);
	});

	it('save', () => {
		const coord = new Coord({ x: 10, y: 20 });
		const savedData = coord.save();

		expect(savedData.x).toBe(10);
		expect(savedData.y).toBe(20);
	});

	it('print', () => {
		const coord = new Coord({ x: 10, y: 20 });
		const formattedString = coord.print();

		expect(formattedString).toBe('{x: 10  y: 20}');
	});

	it('xyPointsAreClose', () => {
		const c1 = new Coord({ x: 100, y: 100 });
		const c2 = new Coord({ x: 99.1, y: 100.9 });
		expect(xyPointsAreClose(c1, c2)).toBeTruthy();
	});

	it('X Setter', () => {
		const co = new Coord({ x: 101, y: 123 });
		co.x = 789;
		expect(co.x).toBe(789);
	});

	it('Y Setter', () => {
		const co = new Coord({ x: 101, y: 123 });
		co.y = 789;
		expect(co.y).toBe(789);
	});
});
