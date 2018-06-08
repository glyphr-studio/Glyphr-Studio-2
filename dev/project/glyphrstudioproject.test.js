_TEST.testList.push(
    {
        category: 'Project',
        name: 'New project: UPM',
        assertion: function() {
            // Stick this here for other tests to use
            _TEST.globals.newProject = new GlyphrStudioProject();

            return _TEST.globals.newProject.projectsettings.upm === 1000;
        },
    },
    {
        category: 'Project',
        name: 'New project: Dark Guideline',
        assertion: function() {
            return _TEST.globals.newProject.projectsettings.colors.guide_dark === 'rgb(204,81,0)';
        },
    },
    {
        category: 'Project',
        name: 'Partial New project: Dark Guideline',
        assertion: function() {
            let projectPartial = new GlyphrStudioProject({projectsettings: {colors: {guide_light: 'it-works'}}});

            return (projectPartial.projectsettings.colors.guide_light === 'it-works' &&
                projectPartial.projectsettings.colors.guide_dark === 'rgb(204,81,0)');
        },
    },
    {
        category: 'Project',
        name: 'New project: Font Variant',
        assertion: function() {
            return _TEST.globals.newProject.metadata.font_variant === 'normal';
        },
    }
);
