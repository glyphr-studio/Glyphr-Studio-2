import { CharacterRange } from '../character_range.js';
import { assert, describe, expect, it } from 'vitest';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	// begin
	// end
	// save
	// isValid
	// beginHex
	// endHex
	// note
	// id
	// array
*/

describe('Character Range', () => {
	it('Constructor - begin', () => {
		expect(new CharacterRange({ begin: 101 }).begin).toBe(101);
	});
});