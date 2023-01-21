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
	app: {
		savePreferences: {
			label: `Save app preferences locally`,
			description: `App preferences can be saved locally to your computer, then loaded automatically when you come back to this project.`,
			type: `Boolean`,
		},
		stopPageNavigation: {
			label: `Warn about unsaved changes on window close`,
			description: `This will stop closing the window or tab with an "Are you sure?" message if you have unsaved changes.`,
			type: `Boolean`,
		},
		showNonCharPoints: {
			label: `Show non-graphic control characters`,
			description: `Show the Unicode code points represent things that aren't letters. In Unicode, the C0 and C1 control code or control character sets define control codes for use in text by computer systems that use ASCII and derivatives of ASCII.<br><br>This setting should probably stay turned off, control characters can probably be safely ignored.`,
			type: `Boolean`,
		},
		formatSaveFile: {
			label: `Format project file for reading`,
			description: `Glyphr Studio Project files (.gs2) are text files in JSON format. By default, this file is saved to optimize for smaller file size. Setting this option to true formats the file to be more easily read by a human, but could increase the file size by 2x or more.`,
			type: `Boolean`,
		},
		combinePathsOnExport: {
			label: `Combine paths on export`,
			description: `This will boolean-combine all paths before a font is exported. This may make the exported font perform better, but it will drastically increase export time.`,
			type: `Boolean`,
		},
		maxCombinePathsOnExport: {
			label: `Max paths to combine on export`,
			description: `Limit the total number of paths in a glyph to combine on export. This will only take effect if the "Combine paths on export" setting is true.`,
			type: `Number`,
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
			example: `Version 1.0.0`,
		},
		description: {
			label: `Font description`,
			description: `Open-ended text to describe your font.`,
		},
		panose: {
			label: `Panose-1`,
			description: `Uses ten digits to describe the font's visual style.  A good overview can be found on Monotype's GitHub page: <a href="https://monotype.github.io/panose/pan2.htm" target="_blank">monotype.github.io/panose/pan2.htm</a><br>Each digit of the ten digits is separated by a space, and has a special meaning based on its position.`,
			example: `<strong>0 0 0 0 0 0 0 0 0 0</strong><br>All zeros describe this font as 'any', which basically leaves it undefined.
			<br><br>
			<strong>2 0 0 0 0 0 0 0 0 0</strong><br>The first digit is the major designator, where digit 2 represents Latin typefaces.`,
		},
		upm: {
			label: `Units per Em (UPM)`,
			description: `UPM is the measure of the overall design space for a character in this font. Think of UPM like how many pixels of height you have to work with for each character. UPM can be any number, but traditionally it is either 1000 or 2048.`,
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
			description: `Rounded characters are usually slightly larger than square characters to compensate for visual weight. For example, a lowercase 'o' will extend slightly above and below a lowercase 'x'. Overshoot is the measure of this distance.`,
			type: `Em`,
		},
		lineGap: {
			label: `Line gap`,
			description: `When text wraps onto multiple lines, this is the distance between the bottom of one Em Square to the top of the next line's Em Square.`,
			type: `Em`,
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
		weight: {
			label: `Font weight`,
			description: `How bold this font is. Can be 'normal', 'bold', or a number between 100 and 900.`,
		},
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
};
