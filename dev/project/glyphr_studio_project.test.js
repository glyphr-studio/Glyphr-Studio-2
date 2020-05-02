
import GlyphrStudioProject from './glyphr_studio_project.js';
// jest.moc('./glyphr_studio_project.js');


it('GlyphrStudioProject: New project: UPM', () => {
  // Stick this here for other tests to use
  _TEST.globals.newProject = new GlyphrStudioProject();

  expect(_TEST.globals.newProject.projectSettings.upm).toBe(1000);
});

it('GlyphrStudioProject: New project: Dark Guideline', () => {
  expect(_TEST.globals.newProject.projectSettings.colors.guide_dark).toBe('rgb(204,81,0)');
});

it('GlyphrStudioProject: Partial New project: Dark Guideline', () => {
  const projectPartial = new GlyphrStudioProject({projectSettings: {colors: {guide_light: 'it-works'}}});

  expect(projectPartial.projectSettings.colors.guide_light === 'it-works' &&
    projectPartial.projectSettings.colors.guide_dark === 'rgb(204,81,0)').toBeTruthy();
});

it('GlyphrStudioProject: New project: Font Variant', () => {
  expect(_TEST.globals.newProject.metadata.font_variant).toBe('normal');
});
