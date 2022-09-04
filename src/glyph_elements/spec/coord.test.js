import { Coord } from '../coord.js';
import { pointsAreEqual } from './_helpers.js';

describe('Coord', () => {
	beforeAll(() =>  {
		//This makes the log visible again from the command line.
		spyOn(console, 'log').and.callThrough();
		console.log(`

			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			Hello! IN THE BEFOREALL FOR COORD

		`);
	});
	it('Constructor - x', () => {
		expect((new Coord({x: 101})).x).toBe(101);
	});

	it('Constructor - y', () => {
		expect((new Coord({x: 101})).y).toBe(0);
	});

	it('pointsAreEqual', () => {
		const c1 = new Coord({x: 100, y: 100});
		const c2 = new Coord({x: 99.1, y: 100.9});
		expect(pointsAreEqual(c1, c2)).toBeTruthy();
	});

	it('X Setter', () => {
		const co = new Coord({x: 101, y: 123});
		co.x = 789;
		expect(co.x).toBe(789);
	});

	it('Y Setter', () => {
		const co = new Coord({x: 101, y: 123});
		co.y = 789;
		expect(co.y).toBe(789);
	});
});
