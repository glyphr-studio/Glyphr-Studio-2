
import GlyphrStudioProject from './glyphrstudioproject.js';

_TEST.testList.push(
    {
        category: 'GlyphrStudioProject',
        name: 'New project: UPM',
        assertion: function() {
            // Stick this here for other tests to use
            _TEST.globals.newProject = new GlyphrStudioProject();

            return _TEST.is(_TEST.globals.newProject.projectSettings.upm).equalTo(1000);
        },
    },
    {
        category: 'GlyphrStudioProject',
        name: 'New project: Dark Guideline',
        assertion: function() {
            return _TEST.is(_TEST.globals.newProject.projectSettings.colors.guide_dark).equalTo('rgb(204,81,0)');
        },
    },
    {
        category: 'GlyphrStudioProject',
        name: 'Partial New project: Dark Guideline',
        assertion: function() {
            let projectPartial = new GlyphrStudioProject({projectSettings: {colors: {guide_light: 'it-works'}}});

            return _TEST.expression(projectPartial.projectSettings.colors.guide_light === 'it-works' &&
                projectPartial.projectSettings.colors.guide_dark === 'rgb(204,81,0)');
        },
    },
    {
        category: 'GlyphrStudioProject',
        name: 'New project: Font Variant',
        assertion: function() {
            return _TEST.is(_TEST.globals.newProject.metadata.font_variant).equalTo('normal');
        },
    }
);
