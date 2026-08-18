import { settingsText } from './settings_i18n.js';

/**
 * Data that describes all the settings.
 * `label` and `description` are localized getters (see settings_i18n.js) so
 * they stay current if the UI language changes. `type` and `example` are
 * logic-relevant/technical values and are not localized.
 */
export default {
	project: {
		name: {
			get label() {
				return settingsText('project.name.label');
			},
			get description() {
				return settingsText('project.name.description');
			},
		},
		latestVersion: {
			get label() {
				return settingsText('project.latestVersion.label');
			},
			get description() {
				return settingsText('project.latestVersion.description');
			},
			type: `Read only`,
		},
		initialVersion: {
			get label() {
				return settingsText('project.initialVersion.label');
			},
			get description() {
				return settingsText('project.initialVersion.description');
			},
			type: `Read only`,
		},
		id: {
			get label() {
				return settingsText('project.id.label');
			},
			get description() {
				return settingsText('project.id.description');
			},
			type: `Read only`,
		},
		exportComponentsAsComposites: {
			get label() {
				return settingsText('project.exportComponentsAsComposites.label');
			},
			get description() {
				return settingsText('project.exportComponentsAsComposites.description');
			},
			type: `Boolean`,
		},
		autoKerning: {
			get label() {
				return settingsText('project.autoKerning.label');
			},
			get description() {
				return settingsText('project.autoKerning.description');
			},
			type: `Boolean`,
		},
		autoCorrectWavyLines: {
			get label() {
				return settingsText('project.autoCorrectWavyLines.label');
			},
			get description() {
				return settingsText('project.autoCorrectWavyLines.description');
			},
			type: `Boolean`,
		},
		importComponentsFromComposites: {
			get label() {
				return settingsText('project.importComponentsFromComposites.label');
			},
			get description() {
				return settingsText('project.importComponentsFromComposites.description');
			},
			type: `Boolean`,
		},
	},
	font: {
		family: {
			get label() {
				return settingsText('font.family.label');
			},
			get description() {
				return settingsText('font.family.description');
			},
		},
		style: {
			get label() {
				return settingsText('font.style.label');
			},
			get description() {
				return settingsText('font.style.description');
			},
			example: `Thin, ExtraLight, Light, <strong>Regular</strong>, Medium, SemiBold, <strong>Bold</strong>, ExtraBold, Black <br><br>Thin&nbsp;Italic, ExtraLight&nbsp;Italic, Light&nbsp;Italic, <strong>Italic</strong>, Medium&nbsp;Italic, SemiBold&nbsp;Italic, Bold&nbsp;Italic, ExtraBold&nbsp;Italic, Black&nbsp;Italic`,
		},
		version: {
			get label() {
				return settingsText('font.version.label');
			},
			get description() {
				return settingsText('font.version.description');
			},
			example: `Version 1.0`,
		},
		description: {
			get label() {
				return settingsText('font.description.label');
			},
			get description() {
				return settingsText('font.description.description');
			},
		},
		panose: {
			get label() {
				return settingsText('font.panose.label');
			},
			get description() {
				return settingsText('font.panose.description');
			},
			example: `<strong>0 0 0 0 0 0 0 0 0 0</strong><br>All zeros describe this font as 'any', which basically leaves it undefined. Use this as your default.
			<br><br>
			<strong>2 0 0 0 0 0 0 0 0 0</strong><br>The first digit determines the kind of font family this is, where digit 2 represents Latin typefaces.
			<br><br>
			Check out the interactive PANOSE builder to get more details on what each digit means.`,
		},
		upm: {
			get label() {
				return settingsText('font.upm.label');
			},
			get description() {
				return settingsText('font.upm.description');
			},
			example: `1000, 2048`,
			type: `Em`,
		},
		ascent: {
			get label() {
				return settingsText('font.ascent.label');
			},
			get description() {
				return settingsText('font.ascent.description');
			},
			type: `Em`,
		},
		descent: {
			get label() {
				return settingsText('font.descent.label');
			},
			get description() {
				return settingsText('font.descent.description');
			},
			type: `Em`,
		},
		capHeight: {
			get label() {
				return settingsText('font.capHeight.label');
			},
			get description() {
				return settingsText('font.capHeight.description');
			},
			type: `Em`,
		},
		xHeight: {
			get label() {
				return settingsText('font.xHeight.label');
			},
			get description() {
				return settingsText('font.xHeight.description');
			},
			type: `Em`,
		},
		overshoot: {
			get label() {
				return settingsText('font.overshoot.label');
			},
			get description() {
				return settingsText('font.overshoot.description');
			},
			type: `Em`,
		},
		lineGap: {
			get label() {
				return settingsText('font.lineGap.label');
			},
			get description() {
				return settingsText('font.lineGap.description');
			},
			type: `Em`,
		},
		weight: {
			get label() {
				return settingsText('font.weight.label');
			},
			get description() {
				return settingsText('font.weight.description');
			},
			type: `Number`,
		},
		italicAngle: {
			get label() {
				return settingsText('font.italicAngle.label');
			},
			get description() {
				return settingsText('font.italicAngle.description');
			},
			type: `Degree`,
		},
		designer: {
			get label() {
				return settingsText('font.designer.label');
			},
			get description() {
				return settingsText('font.designer.description');
			},
		},
		designerURL: {
			get label() {
				return settingsText('font.designerURL.label');
			},
			get description() {
				return settingsText('font.designerURL.description');
			},
		},
		manufacturer: {
			get label() {
				return settingsText('font.manufacturer.label');
			},
			get description() {
				return settingsText('font.manufacturer.description');
			},
		},
		manufacturerURL: {
			get label() {
				return settingsText('font.manufacturerURL.label');
			},
			get description() {
				return settingsText('font.manufacturerURL.description');
			},
		},
		license: {
			get label() {
				return settingsText('font.license.label');
			},
			get description() {
				return settingsText('font.license.description');
			},
		},
		licenseURL: {
			get label() {
				return settingsText('font.licenseURL.label');
			},
			get description() {
				return settingsText('font.licenseURL.description');
			},
		},
		copyright: {
			get label() {
				return settingsText('font.copyright.label');
			},
			get description() {
				return settingsText('font.copyright.description');
			},
		},
		trademark: {
			get label() {
				return settingsText('font.trademark.label');
			},
			get description() {
				return settingsText('font.trademark.description');
			},
		},
		variant: {
			get label() {
				return settingsText('font.variant.label');
			},
			get description() {
				return settingsText('font.variant.description');
			},
		},
		stretch: {
			get label() {
				return settingsText('font.stretch.label');
			},
			get description() {
				return settingsText('font.stretch.description');
			},
			example: `normal, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded`,
		},
		stemv: {
			get label() {
				return settingsText('font.stemv.label');
			},
			get description() {
				return settingsText('font.stemv.description');
			},
			type: `Em`,
		},
		stemh: {
			get label() {
				return settingsText('font.stemh.label');
			},
			get description() {
				return settingsText('font.stemh.description');
			},
			type: `Em`,
		},
		slope: {
			get label() {
				return settingsText('font.slope.label');
			},
			get description() {
				return settingsText('font.slope.description');
			},
			type: `Degree`,
		},
		underlinePosition: {
			get label() {
				return settingsText('font.underlinePosition.label');
			},
			get description() {
				return settingsText('font.underlinePosition.description');
			},
			type: `Em`,
		},
		underlineThickness: {
			get label() {
				return settingsText('font.underlineThickness.label');
			},
			get description() {
				return settingsText('font.underlineThickness.description');
			},
			type: `Em`,
		},
		strikethroughPosition: {
			get label() {
				return settingsText('font.strikethroughPosition.label');
			},
			get description() {
				return settingsText('font.strikethroughPosition.description');
			},
			type: `Em`,
		},
		strikethroughThickness: {
			get label() {
				return settingsText('font.strikethroughThickness.label');
			},
			get description() {
				return settingsText('font.strikethroughThickness.description');
			},
			type: `Em`,
		},
		overlinePosition: {
			get label() {
				return settingsText('font.overlinePosition.label');
			},
			get description() {
				return settingsText('font.overlinePosition.description');
			},
			type: `Em`,
		},
		overlineThickness: {
			get label() {
				return settingsText('font.overlineThickness.label');
			},
			get description() {
				return settingsText('font.overlineThickness.description');
			},
			type: `Em`,
		},
	},
	app: {
		stopPageNavigation: {
			get label() {
				return settingsText('app.stopPageNavigation.label');
			},
			get description() {
				return settingsText('app.stopPageNavigation.description');
			},
			type: `Boolean`,
		},
		formatSaveFile: {
			get label() {
				return settingsText('app.formatSaveFile.label');
			},
			get description() {
				return settingsText('app.formatSaveFile.description');
			},
			type: `Boolean`,
		},
		saveLivePreviews: {
			get label() {
				return settingsText('app.saveLivePreviews.label');
			},
			get description() {
				return settingsText('app.saveLivePreviews.description');
			},
			type: `Boolean`,
		},
		autoSave: {
			get label() {
				return settingsText('app.autoSave.label');
			},
			get description() {
				return settingsText('app.autoSave.description');
			},
			type: `Boolean`,
		},
		savePreferences: {
			get label() {
				return settingsText('app.savePreferences.label');
			},
			get description() {
				return settingsText('app.savePreferences.description');
			},
			type: `Boolean`,
		},
		unlinkComponentInstances: {
			get label() {
				return settingsText('app.unlinkComponentInstances.label');
			},
			get description() {
				return settingsText('app.unlinkComponentInstances.description');
			},
			type: `Boolean`,
		},
		canvasDisplayModeFilled: {
			get label() {
				return settingsText('app.canvasDisplayModeFilled.label');
			},
			get description() {
				return settingsText('app.canvasDisplayModeFilled.description');
			},
			type: 'Boolean',
		},
		directlyDragCurves: {
			get label() {
				return settingsText('app.directlyDragCurves.label');
			},
			get description() {
				return settingsText('app.directlyDragCurves.description');
			},
			type: 'Boolean',
		},
		showNonCharPoints: {
			get label() {
				return settingsText('app.showNonCharPoints.label');
			},
			get description() {
				return settingsText('app.showNonCharPoints.description');
			},
			type: `Boolean`,
		},
		itemChooserPageSize: {
			get label() {
				return settingsText('app.itemChooserPageSize.label');
			},
			get description() {
				return settingsText('app.itemChooserPageSize.description');
			},
			type: `Number`,
		},
		previewText: {
			get label() {
				return settingsText('app.previewText.label');
			},
			get description() {
				return settingsText('app.previewText.description');
			},
		},
		exportLigatures: {
			get label() {
				return settingsText('app.exportLigatures.label');
			},
			get description() {
				return settingsText('app.exportLigatures.description');
			},
			type: `Boolean`,
		},
		exportKerning: {
			get label() {
				return settingsText('app.exportKerning.label');
			},
			get description() {
				return settingsText('app.exportKerning.description');
			},
			type: `Boolean`,
		},
		exportUneditedItems: {
			get label() {
				return settingsText('app.exportUneditedItems.label');
			},
			get description() {
				return settingsText('app.exportUneditedItems.description');
			},
			type: `Boolean`,
		},
		moveShapesOnSVGDragDrop: {
			get label() {
				return settingsText('app.moveShapesOnSVGDragDrop.label');
			},
			get description() {
				return settingsText('app.moveShapesOnSVGDragDrop.description');
			},
			type: `Boolean`,
		},
		autoSideBearingsOnSVGDragDrop: {
			get label() {
				return settingsText('app.autoSideBearingsOnSVGDragDrop.label');
			},
			get description() {
				return settingsText('app.autoSideBearingsOnSVGDragDrop.description');
			},
			type: `Em`,
		},
		autoRightBearingOnFirstShape: {
			get label() {
				return settingsText('app.autoRightBearingOnFirstShape.label');
			},
			get description() {
				return settingsText('app.autoRightBearingOnFirstShape.description');
			},
			type: `Em`,
		},
		highlightPointsNearPoints: {
			get label() {
				return settingsText('app.highlightPointsNearPoints.label');
			},
			get description() {
				return settingsText('app.highlightPointsNearPoints.description');
			},
			type: `Em`,
		},
		highlightPointsNearHandles: {
			get label() {
				return settingsText('app.highlightPointsNearHandles.label');
			},
			get description() {
				return settingsText('app.highlightPointsNearHandles.description');
			},
			type: `Em`,
		},
		highlightPointsNearXZero: {
			get label() {
				return settingsText('app.highlightPointsNearXZero.label');
			},
			get description() {
				return settingsText('app.highlightPointsNearXZero.description');
			},
			type: `Em`,
		},
		highlightPointsNearYZero: {
			get label() {
				return settingsText('app.highlightPointsNearYZero.label');
			},
			get description() {
				return settingsText('app.highlightPointsNearYZero.description');
			},
			type: `Em`,
		},
	},
};
