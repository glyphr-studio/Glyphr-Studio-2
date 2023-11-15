import { describe, expect, it } from 'vitest';
import { CharacterRange, basicLatinOrder } from '../character_range.js';

// --------------------------------------------------------------
// CHECKLIST
// --------------------------------------------------------------
/*
	begin
	end
	save
	isValid
	beginHex
	endHex
	note
	id
	array
*/

describe('CharacterRange', () => {
	// Test the constructor
	it('constructor', () => {
		const range = new CharacterRange({ begin: 65, end: 90, name: 'Basic Latin' });
		expect(range.begin).toBe(65);
		expect(range.end).toBe(90);
		expect(range.name).toBe('Basic Latin');
		expect(range.showNonCharPoints).toBe(false);
		expect(range.cachedArray).toBe(false);
	});

	// Test the generator method
	it('generator', () => {
		const range = new CharacterRange({ begin: 65, end: 68, name: 'Basic Latin' });
		const generator = range.generator();
		const expectedCharacters = basicLatinOrder.slice(0, 4);

		for (const expected of expectedCharacters) {
			const result = generator.next();
			expect(result.value).toBe(expected);
			expect(result.done).toBe(false);
		}

		const finalResult = generator.next();
		expect(finalResult.done).toBe(true);
	});

	// Test the isValid property
	it('isValid', () => {
		const validRange = new CharacterRange({ begin: 65, end: 90, name: 'Valid Range' });
		const invalidRange = new CharacterRange({ begin: 0, end: 0, name: '' });

		expect(validRange.isValid).toBe(true);
		expect(invalidRange.isValid).toBe(false);
	});

	// Test the save method
	it('save', () => {
		const range = new CharacterRange({ begin: 65, end: 90, name: 'Basic Latin' });
		const savedData = range.save();

		expect(savedData.name).toBe('Basic Latin');
		expect(savedData.begin).toBe('0x41'); // Assuming 'A' corresponds to 0x41
		expect(savedData.end).toBe('0x5A'); // Assuming 'Z' corresponds to 0x5A
	});

	// Test the beginHex and endHex properties
	it('beginHex and endHex', () => {
		const range = new CharacterRange({ begin: 65, end: 68, name: 'Basic Latin' });

		expect(range.beginHex).toBe('0x41');
		expect(range.endHex).toBe('0x44');
	});

	// Test the note property
	it('note', () => {
		const range = new CharacterRange({ begin: 65, end: 68, name: 'Basic Latin' });

		expect(range.note).toBe('["0x41", "0x44"]');
	});

	// Test the id property
	it('id', () => {
		const range = new CharacterRange({ begin: 65, end: 68, name: 'Basic Latin' });

		expect(range.id).toBe('Basic Latin ["0x41", "0x44"]');
	});

	// Test the getMembers property
	it('getMembers', () => {
		const range = new CharacterRange({ begin: 65, end: 68, name: 'Basic Latin' });
		const characterArray = range.getMembers();
		const expectedCharacters = basicLatinOrder.slice(0, 4);

		expect(characterArray).toEqual(expectedCharacters);
	});
});
