import { describe, expect, it } from 'vitest';
import {
	GlyphrStudioProject,
	makeProjectID,
	merge,
	validateItemID,
} from '../glyphr_studio_project.js';

describe('GlyphrStudioProject Tests', () => {
	// Mock data for testing
	const mockProjectData = {
		settings: {
			project: {
				name: 'My Font',
				characterRanges: [],
			},
			app: {
				guides: {
					custom: [],
				},
				livePreviews: [],
			},
			font: {
				family: 'My Font',
			},
		},
		glyphs: {},
		ligatures: {},
		components: {},
		kerning: {},
	};

	// Test the constructor of GlyphrStudioProject class
	it('GlyphrStudioProject constructor should initialize a project with default values', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject();
		expect(project.settings.project.name).toBe('My Font');
		expect(project.settings.project.characterRanges).toEqual([]);
		expect(project.settings.app.guides.custom).toEqual([]);
		expect(project.settings.app.livePreviews).toEqual([]);
		expect(project.settings.font.family).toBe('My Font');
	});

	// Test the save method of GlyphrStudioProject class
	it('GlyphrStudioProject save method should return a JSON object with project data', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);
		const savedProject = project.save();
		expect(savedProject.settings.project.name).toBe('My Font');
		expect(savedProject.settings.project.characterRanges).toEqual([]);
		expect(savedProject.settings.app.guides.custom).toEqual([]);
		expect(savedProject.settings.app.livePreviews).toEqual([]);
		expect(savedProject.settings.font.family).toBe('My Font');
	});

	// Test the totalVertical getter of GlyphrStudioProject class
	it('GlyphrStudioProject totalVertical should return the vertical height in Em', ({ expect }) => {
		const project = new GlyphrStudioProject(mockProjectData);
		expect(project.totalVertical).toBe(1000);
	});

	// Test the defaultAdvanceWidth getter of GlyphrStudioProject class
	it('GlyphrStudioProject defaultAdvanceWidth should return the default advance width in Em', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);
		expect(project.defaultAdvanceWidth).toBe(500);
	});

	// Test the sortedLigatures getter of GlyphrStudioProject class
	it('GlyphrStudioProject sortedLigatures should return an array of ligatures sorted by length and characters', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding sample ligatures
		project.ligatures = {
			'liga-1': { chars: 'abc', gsub: 'lig1' },
			'liga-2': { chars: 'de', gsub: 'lig2' },
			'liga-3': { chars: 'food', gsub: 'lig3' },
			'liga-4': { chars: 'jkl', gsub: 'lig4' },
		};

		const sortedLigatures = project.sortedLigatures;
		expect(sortedLigatures).toHaveLength(4);
		expect(sortedLigatures[0].chars).toBe('food');
		expect(sortedLigatures[1].chars).toBe('abc');
		expect(sortedLigatures[2].chars).toBe('jkl');
		expect(sortedLigatures[3].chars).toBe('de');
	});

	// Test the getItem method of GlyphrStudioProject class
	it('GlyphrStudioProject getItem should return an item by its ID', () => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding a sample glyph
		const glyph = { id: 'glyph-0x61' };
		project.glyphs[glyph.id] = glyph;

		const retrievedGlyph = project.getItem(glyph.id);
		expect(retrievedGlyph).toEqual(glyph);
	});

	// Test the getItemID method of GlyphrStudioProject class
	it('GlyphrStudioProject getItemID should return the ID of an item based on its characters', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding a sample ligature
		const ligature = { chars: 'abc', gsub: 'abc' };
		project.ligatures['liga-abc'] = ligature;

		const itemID = project.getItemID('abc');
		expect(itemID).toBe('liga-abc');
	});

	// Test the getItemName method of GlyphrStudioProject class
	it('GlyphrStudioProject getItemName should return the name of an item based on its ID', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding a sample glyph
		const glyph = { id: 'glyph-0x61' };
		project.glyphs[glyph.id] = glyph;

		const itemName = project.getItemName(glyph.id);
		expect(itemName).toBe('a');
	});

	// Test the makeItemThumbnail method of GlyphrStudioProject class
	it('GlyphrStudioProject makeItemThumbnail should generate an SVG thumbnail for an item', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding a sample glyph
		const glyph = {
			svgPathData: 'M10 10 H20 V20 H10 V10',
			advanceWidth: 100,
		};
		project.glyphs['glyph-0x61'] = glyph;

		const thumbnail = project.makeItemThumbnail(glyph);
		expect(thumbnail).toContain('<svg');
		expect(thumbnail).toContain('M10 10 H20 V20 H10 V10');
	});

	// Test the hydrateProjectItems method of GlyphrStudioProject class
	it('GlyphrStudioProject hydrateProjectItems should initialize items from a source object', ({
		expect,
	}) => {
		const project = new GlyphrStudioProject(mockProjectData);

		// Adding a sample glyph to the source object
		const source = {
			'glyph-0x61': {
				id: 'glyph-0x61',
				name: 'Sample Glyph',
			},
		};

		project.hydrateProjectItems(Object, source, 'Glyph');

		const retrievedGlyph = project.glyphs['glyph-0x61'];
		expect(retrievedGlyph).toBeDefined();
		expect(retrievedGlyph.name).toBe('Sample Glyph');
	});

	// Test the merge function for merging objects with default values
	it('merge function should merge two objects with default values', () => {
		const template = {
			name: 'Default Name',
			description: 'Default Description',
		};

		const importing = {
			name: 'Custom Name',
		};

		const mergedObject = merge(template, importing);
		expect(mergedObject.name).toBe('Custom Name');
		expect(mergedObject.description).toBe('Default Description');
	});

	// Test the validateItemID function for validating item IDs
	it('validateItemID function should validate item IDs', () => {
		const validatedID = validateItemID('glyph-0x61', 'Glyph');
		expect(validatedID).toBe('glyph-0x61');

		const invalidID = validateItemID('invalid-id', 'Glyph');
		expect(invalidID).toBe('invalid-id');
	});

	// Test the makeProjectID function for generating a unique project ID
	it('makeProjectID function should generate a unique project ID', () => {
		const projectID = makeProjectID();
		expect(projectID.length > 10).toBeTruthy();
		expect(projectID.startsWith('g2_')).toBeTruthy();
	});
});
