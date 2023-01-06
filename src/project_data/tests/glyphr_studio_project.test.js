import { GlyphrStudioProject } from '../glyphr_studio_project.js';

describe('GlyphrStudioProject', () => {
	it('New project: UPM', () => {
		// Stick this here for other tests to use
		const newProject = new GlyphrStudioProject();

		expect(newProject.metadata.font.upm).toBe(1000);
	});

	// it('New project: Dark Guideline', () => {
	// 	const newProject = new GlyphrStudioProject();
	// 	expect(newProject.metadata.colors.guide_dark).toBe('rgb(204,81,0)');
	// });

	// it('Partial New project: Dark Guideline', () => {
	// 	const projectPartial = new GlyphrStudioProject({
	// 		metadata: { colors: { guide_light: 'it-works' } },
	// 	});

	// 	expect(
	// 		projectPartial.metadata.colors.guide_light === 'it-works' &&
	// 			projectPartial.metadata.colors.guide_dark === 'rgb(204,81,0)'
	// 	).toBeTruthy();
	// });

	it('New project: Font Variant', () => {
		const newProject = new GlyphrStudioProject();
		expect(newProject.metadata.variant).toBe('normal');
	});
});
