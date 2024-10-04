/**
 * Data that describes all the settings
 */
export default {
	project: {
		name: {
			label: `Project name`,
			description: `Name for this project. Can be different than the Font or Font Family name. Also, this will be used as the name of the saved Glyphr Studio Project (.gs2) file.`,
		},
		latestVersion: {
			label: `Version`,
			description: `The latest app version that edited this project file.`,
			type: `Read only`,
		},
		initialVersion: {
			label: `Initial version`,
			description: `The app version this project file was first created with.`,
			type: `Read only`,
		},
		id: {
			label: `Project ID`,
			description: `A unique ID used to identify this project.`,
			type: `Read only`,
		},
	},
	font: {
		family: {
			label: `Font family`,
			description: `Base font family name, that will be shared across font styles. This will also be used as the base name for exported font files.`,
		},
		style: {
			label: `Font style`,
			description: `Describes this font within the overall font family. Usually a combination of how bold this font is and if it is italic.`,
			example: `Thin, ExtraLight, Light, <strong>Regular</strong>, Medium, SemiBold, <strong>Bold</strong>, ExtraBold, Black <br><br>Thin&nbsp;Italic, ExtraLight&nbsp;Italic, Light&nbsp;Italic, <strong>Italic</strong>, Medium&nbsp;Italic, SemiBold&nbsp;Italic, Bold&nbsp;Italic, ExtraBold&nbsp;Italic, Black&nbsp;Italic`,
		},
		version: {
			label: `Font version`,
			description: `If this font gets updates regularly, keep track of what version this iteration is. This is recommended to be in Semantic Versioning format, you can learn more at <a href="https://semver.org/" target="_blank">semver.org</a>.`,
			example: `Version 1.0`,
		},
		description: {
			label: `Font description`,
			description: `Open-ended text to describe your font.`,
		},
		panose: {
			label: `Panose-1`,
			description: `PANOSE is a system that uses ten digits to describe the font's visual style.  A good overview can be found on Monotype's GitHub page: <a href="https://monotype.github.io/panose/pan1.htm" target="_blank">monotype.github.io/panose/pan2.htm</a><br>Each digit of the ten digits is separated by a space, and has a special meaning based on its position.`,
			example: `<strong>0 0 0 0 0 0 0 0 0 0</strong><br>All zeros describe this font as 'any', which basically leaves it undefined. Use this as your default.
			<br><br>
			<strong>2 0 0 0 0 0 0 0 0 0</strong><br>The first digit determines the kind of font family this is, where digit 2 represents Latin typefaces.
			<br><br>
			Check out the interactive PANOSE builder to get more details on what each digit means.`,
		},
		upm: {
			label: `Units per Em (UPM)`,
			description: `UPM is the measure of the overall design space for a character in this font. Think of UPM like how many pixels of height you have to work with for each character.<br><br><b>Note!</b> Operating systems are picky about what UPM values they allow. In general, anything 1000 or below will work. Above 1000, many times only powers of 2 will work (like 1024, 2048, 4096, etc.).<br><br>Traditionally, UPM is either 1000 or 2048.`,
			example: `1000, 2048`,
			type: `Em`,
		},
		ascent: {
			label: `Ascent`,
			description: `Distance from the baseline to the top of square and tall lowercase letters (Like: b d h k l).`,
			type: `Em`,
		},
		descent: {
			label: `Descent`,
			description: `Distance from the baseline to the bottom of letters that have square descenders (Like: p q y depending on style). This is expressed as a negative number.`,
			type: `Em`,
		},
		capHeight: {
			label: `Capital letter height`,
			description: `Distance from the baseline to the top of square capital letters (Like: A B D E F H I K L M N P R T U V W X Y Z). Usually this is slightly smaller than the ascent.`,
			type: `Em`,
		},
		xHeight: {
			label: `X height`,
			description: `Distance from the baseline to the top of square lowercase letters (Like: v w x z).`,
			type: `Em`,
		},
		overshoot: {
			label: `Overshoot`,
			description: `Rounded characters are usually slightly larger than square characters to compensate for visual weight. For example, a lowercase 'o' will extend slightly above and below a lowercase 'x'. Overshoot is the measure of this distance.
			<br>Note: This is used internally by Glyphr Studio, it is not exported to fonts.`,
			type: `Em`,
		},
		lineGap: {
			label: `Line gap`,
			description: `When text wraps onto multiple lines, this is the distance between the bottom of one Em Square to the top of the next line's Em Square.`,
			type: `Em`,
		},
		weight: {
			label: `Font weight`,
			description: `How bold this font is - a number between 100 and 900:
				<br>100 : Thin
				<br>200 : Extra-Light
				<br>300 : Light
				<br>400 : Regular
				<br>500 : Medium
				<br>600 : Semi-Bold
				<br>700 : Bold
				<br>800 : Extra-Bold
				<br>900 : Black
			`,
			type: `Number`,
		},
		italicAngle: {
			label: `Italic angle`,
			description: `Most common degree of slant for glyphs in an italic font.`,
			type: `Degree`,
		},
		designer: { label: `Designer`, description: 'Person or team who created this font.' },
		designerURL: { label: `Designer's URL`, description: '' },
		manufacturer: { label: `Manufacturer`, description: 'Company who created this font.' },
		manufacturerURL: { label: `Manufacturer's URL`, description: '' },
		license: { label: `License`, description: 'License under which this font is released.' },
		licenseURL: { label: `License URL`, description: '' },
		copyright: { label: `Copyright`, description: '' },
		trademark: { label: `Trademark`, description: '' },
		variant: { label: `Font variant`, description: "Either 'normal' or 'small-caps'." },
		stretch: {
			label: `Font stretch`,
			description: `How condensed or expanded this font is.`,
			example: `normal, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded`,
		},
		stemv: {
			label: `Vertical stem`,
			description: `Most common width measurement of vertical stems in this font.`,
			type: `Em`,
		},
		stemh: {
			label: `Horizontal stem`,
			description: `Most common height measurement of horizontal stems in this font.`,
			type: `Em`,
		},
		slope: {
			label: `Slope`,
			description: `The angle, in degrees counterclockwise from the vertical, of the dominant vertical strokes of the font. The value is negative for fonts that slope to the right.`,
			type: `Degree`,
		},
		underlinePosition: {
			label: `Underline position`,
			description: `The ideal position of an underline with relation to the baseline (probably should be negative).`,
			type: `Em`,
		},
		underlineThickness: {
			label: `Underline thickness`,
			description: `The ideal height of an underline.`,
			type: `Em`,
		},
		strikethroughPosition: {
			label: `Strikethrough position`,
			description: `The ideal position of a strikethrough with relation to the baseline.`,
			type: `Em`,
		},
		strikethroughThickness: {
			label: `Strikethrough thickness`,
			description: `The ideal height of a strikethrough.`,
			type: `Em`,
		},
		overlinePosition: {
			label: `Overline position`,
			description: `The ideal position of an overline with relation to the baseline.`,
			type: `Em`,
		},
		overlineThickness: {
			label: `Overline thickness`,
			description: `The ideal height of an overline.`,
			type: `Em`,
		},
	},
	app: {
		stopPageNavigation: {
			label: `Warn about unsaved changes on window close`,
			description: `This will stop closing the window or tab with an "Are you sure?" message if you have unsaved changes.`,
			type: `Boolean`,
		},
		formatSaveFile: {
			label: `Format project file for reading`,
			description: `Glyphr Studio Project files (.gs2) are text files in JSON format. By default, this file is saved to optimize for smaller file size. Setting this option to true formats the file to be more easily read by a human, but could increase the file size by 2x or more.`,
			type: `Boolean`,
		},
		saveLivePreviews: {
			label: `Save live previews`,
			description: `Save the text blocks that you have defined for your Live Previews (both the page, and the 2nd window). These could be long, so you may want to turn them off for file size reasons.`,
			type: `Boolean`,
		},
		autoSave: {
			label: `Auto-save a copy of the project with each change`,
			description: `When enabled, this option will use your browser's local storage to keep backups. These backups can be restored from the Open Projects page. Your browser's local storage is confined to this browser on this computer. If you use Glyphr Studio from another browser or on another computer, those backups will be available from there.`,
			type: `Boolean`,
		},
		savePreferences: {
			label: `Save app preferences locally`,
			description: `App preferences can be saved locally to your computer, then loaded automatically when you come back to this project.`,
			type: `Boolean`,
		},
		unlinkComponentInstances: {
			label: `Unlink component instances when deleting their root`,
			description: `When selected, this option will unlink component instances and turn them into normal paths if their component root is deleted (the glyph will look the same, but some component instances will end up as stand-alone path objects).<br>If this option is unselected, component instances will be deleted when their component root is deleted (the glyph will look different because it will have less shapes).`,
			type: `Boolean`,
		},
		showNonCharPoints: {
			label: `Show non-graphic control characters`,
			description: `Show the Unicode code points represent things that aren't letters. In Unicode, the C0 and C1 control code or control character sets define control codes for use in text by computer systems that use ASCII and derivatives of ASCII.<br><br>This setting should probably stay turned off, control characters can probably be safely ignored.`,
			type: `Boolean`,
		},
		itemChooserPageSize: {
			label: `Number of items to show in the item chooser`,
			description: `For Characters, Ligatures, Components, and Kern Groups, this is how many items to show in the item chooser menu. For projects with large numbers of items, splitting the items apart into pages can help the UI perform better.`,
			type: `Number`,
		},
		previewText: {
			label: `Project preview text`,
			description: `What text to show when previewing a project or switching between projects. If left blank, the string 'Aa Bb Cc Xx Yy Zz' will be used.`,
		},
		exportLigatures: {
			label: `Export Ligatures to fonts (.otf and .svg)`,
			description: `Uncheck this option if don't want ligature data exported to fonts.`,
			type: `Boolean`,
		},
		exportKerning: {
			label: `Export Kern information to fonts (.svg only)`,
			description: `Uncheck this option if don't want kern data exported to fonts.`,
			type: `Boolean`,
		},
		exportUneditedItems: {
			label: `Export items that were created, but not edited`,
			description: `When you create a Ligature or Component, or navigate to a Character, an empty glyph item is created
			for you. It's possible to leave these items in an unedited state, essentially empty.<br><br>
			If this option is checked, these empty items will be exported to fonts. If this option is unchecked,
			these empty items will be filtered out, and not exported to fonts.<br><br>
			In the item chooser, these empty items' names are shown in a green color.`,
			type: `Boolean`,
		},
		moveShapesOnSVGDragDrop: {
			label: `Move shapes when drag+dropping an SVG file`,
			description: `When importing SVG by dragging and dropping a .svg file onto the canvas, move the imported shapes to the origin (x = 0, y = shapes height).`,
			type: `Boolean`,
		},
	},
};
