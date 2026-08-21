import { FontFlux } from 'font-flux-js';
import { describe, expect, it } from 'vitest';
import { setCurrentProjectEditor } from '../../../app/main.js';
import { Glyph } from '../../../project_data/glyph.js';
import { GlyphrStudioProject } from '../../../project_data/glyphr_studio_project.js';
import { StylisticSet } from '../../../project_data/stylistic_set.js';
import { VariableAxis } from '../../../project_data/variable_axis.js';
import { ProjectEditor } from '../../../project_editor/project_editor.js';
import { ioFont_exportFont } from '../font_export.js';
import { ioFont_importFont } from '../font_import.js';

describe('Variable axes and stylistic-set font IO', () => {
	it('exports fvar axes and alternate GSUB glyphs', async () => {
		const project = new GlyphrStudioProject({});
		project.glyphs['glyph-0x41'] = new Glyph({
			id: 'glyph-0x41',
			parent: project,
			advanceWidth: 600,
			shapes: [],
		});
		project.variableAxes['axis-wght'] = new VariableAxis({
			tag: 'wght',
			name: 'Weight',
			min: 100,
			defaultValue: 400,
			max: 900,
			value: 650,
		});
		project.alternates['alt-ss01-1'] = new Glyph({
			id: 'alt-ss01-1',
			parent: project,
			objType: 'Alternate',
			name: 'A alt 1',
			advanceWidth: 600,
			shapes: [],
		});
		project.stylisticSets['sset-1'] = new StylisticSet({
			name: 'A alternates',
			baseItemID: 'glyph-0x41',
			alternates: ['alt-ss01-1'],
			feature: 'ss01',
		});
		setCurrentProjectEditor(new ProjectEditor({ project }));

		const buffer = await ioFont_exportFont('otf', true);
		const exported = FontFlux.open(buffer);

		expect(exported.listAxes()).toEqual([
			expect.objectContaining({
				tag: 'wght',
				name: 'Weight',
				min: 100,
				default: 400,
				max: 900,
			}),
		]);
		expect(exported.getGlyph('uni0041.ss01.1')).toBeTruthy();
		expect(exported.listSubstitutions({ feature: 'ss01' })).toEqual([
			expect.objectContaining({
				type: 'alternate',
				from: 'uni0041',
				alternates: ['uni0041.ss01.1'],
			}),
		]);
	});

	it('imports fvar axes into editable project axes', async () => {
		const font = FontFlux.create({
			family: 'Variable Import',
			unitsPerEm: 1000,
			ascender: 800,
			descender: -200,
		});
		font.addGlyph({ name: '.notdef', unicode: 0, advanceWidth: 500, contours: [] });
		font.addGlyph({ name: 'uni0041', unicode: 65, advanceWidth: 600, contours: [] });
		font.addAxis({ tag: 'wdth', name: 'Width', min: 50, default: 100, max: 200 });

		const importedFont = FontFlux.open(font.export({ format: 'sfnt' }));
		const project = await ioFont_importFont(importedFont, true);
		const axis = Object.values(project.variableAxes)[0];

		expect(axis).toEqual(
			expect.objectContaining({
				tag: 'wdth',
				name: 'Width',
				min: 50,
				defaultValue: 100,
				max: 200,
				value: 100,
			})
		);
	});
});
