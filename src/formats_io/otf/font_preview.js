import { FontFlux } from 'font-flux-js';
import { charToHex, parseCharsInputAsHex } from '../../common/character_ids.js';
import { round } from '../../common/functions.js';
import { findAndMergeLigatures } from '../../display_canvas/text_block.js';
import { createOptionsObject, getUniqueGlyphName, glyphToContours } from './font_export.js';
import { writeGposKernDataToFont } from './tables/gpos.js';

const DEFAULT_FLAVOR = 'otf';
const FLAVOR_TO_FONTFLUX_FORMAT = {
	otf: 'sfnt',
	ttf: 'ttf',
	woff: 'woff',
	woff2: 'woff2',
};
const FLAVOR_TO_CSS_FORMAT = {
	otf: 'opentype',
	ttf: 'truetype',
	woff: 'woff',
	woff2: 'woff2',
};

export class FontPreviewBuilder {
	constructor(project, options = {}) {
		this.project = project;
		this.flavor = options.flavor || DEFAULT_FLAVOR;
		this.familyNameOverride = options.familyName;
		this.styleNameOverride = options.styleName;
		this.includeKerning = options.includeKerning ?? true;
		this.includeLigatures = options.includeLigatures ?? true;
	}

	buildFontFlux(text = '') {
		const project = this.project;
		if (!project) throw new Error('FontPreviewBuilder requires a project');

		const options = createOptionsObject(project);
		if (this.familyNameOverride) options.familyName = this.familyNameOverride;
		if (this.styleNameOverride) options.styleName = this.styleNameOverride;

		const { glyphMap, ligatures } = collectPreviewItems(project, text, this.includeLigatures);
		const font = FontFlux.create({
			family: options.familyName,
			unitsPerEm: options.unitsPerEm,
			ascender: options.ascender,
			descender: options.descender,
		});

		font.info.styleName = options.styleName;
		font.info.copyright = options.copyright;
		font.info.version = options.version;
		font.info.weight = options.weightClass;
		font.info.italicAngle = options.italicAngle;
		font.info.ascender = options.ascender;
		font.info.descender = options.descender;
		font.info.lineGap = options.lineGap;
		font.info.capHeight = options.capHeight;
		font.info.xHeight = options.xHeight;
		font.info.description = options.description;
		font.info.designer = options.designer;
		font.info.designerURL = options.designerURL;
		font.info.manufacturer = options.manufacturer;
		font.info.vendorURL = options.manufacturerURL;
		font.info.license = options.license;
		font.info.licenseURL = options.licenseURL;
		font.info.trademark = options.trademark;

		const previewGlyphs = buildPreviewGlyphObjects(project, glyphMap, ligatures);
		previewGlyphs.forEach((glyph) => font.addGlyph(glyph));

		if (this.includeKerning && project.settings.app.exportKerning) {
			writeGposKernDataToFont(font, project);
		}

		if (this.includeLigatures && ligatures.length > 0) {
			ligatures.forEach((lig) => {
				font.addSubstitution({
					type: 'ligature',
					feature: 'liga',
					substitution: {
						components: lig.gsub.map((unicode) => getUniqueGlyphName(unicode)),
						ligature: generateLigatureExportName(lig),
					},
				});
			});
		}

		return font;
	}

	buildFontBuffer(text = '') {
		const font = this.buildFontFlux(text);
		const format =
			FLAVOR_TO_FONTFLUX_FORMAT[this.flavor] || FLAVOR_TO_FONTFLUX_FORMAT[DEFAULT_FLAVOR];
		return font.export({ format });
	}

	makeFontFaceCSS(
		buffer,
		fontFamily = this.familyNameOverride || this.project.settings.font.family || 'PreviewFont'
	) {
		const format = this.flavor || DEFAULT_FLAVOR;
		const cssFormat = FLAVOR_TO_CSS_FORMAT[format] || FLAVOR_TO_CSS_FORMAT[DEFAULT_FLAVOR];
		return (
			`@font-face {\n` +
			`  font-family: "${fontFamily}";\n` +
			`  src: url("${fontBufferToDataURI(buffer, format)}") format("${cssFormat}");\n` +
			`  font-weight: 400;\n` +
			`  font-style: normal;\n` +
			`}`
		);
	}
}

function collectPreviewItems(project, text, includeLigatures) {
	const glyphMap = new Map();
	const ligatureMap = new Map();
	const lines = String(text || '').split('\n');

	for (const line of lines) {
		const tokens = findAndMergeLigatures([...line], project);
		for (const token of tokens) {
			if (token?.startsWith('liga-')) {
				if (!includeLigatures) continue;
				const ligature = project.getItem(token);
				if (!ligature) continue;
				ligature.gsub.forEach((unicode) => {
					const hex = parseCharsInputAsHex(unicode.toString());
					if (hex.length) addGlyphKey(hex[0], project, glyphMap);
				});
				ligatureMap.set(token, ligature);
			} else if (token) {
				const hex = charToHex(token);
				if (hex) addGlyphKey(hex, project, glyphMap);
			}
		}
	}

	return { glyphMap, ligatures: Array.from(ligatureMap.values()) };
}

function addGlyphKey(hex, project, glyphMap) {
	if (!hex || hex === '0x0') return;
	if (glyphMap.has(hex)) return;
	const item = project.getItem(`glyph-${hex}`) || null;
	glyphMap.set(hex, item);
}

function buildPreviewGlyphObjects(project, glyphMap, ligatures) {
	const glyphObjects = [];
	const notdefGlyph = buildNotdefGlyph(project);
	glyphObjects.push(notdefGlyph);

	const sortedHexes = Array.from(glyphMap.keys()).sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
	for (const hex of sortedHexes) {
		const unicode = parseInt(hex, 16);
		if (!Number.isFinite(unicode) || unicode === 0) continue;
		const sourceGlyph = glyphMap.get(hex);
		const glyphObject = {
			name: getUniqueGlyphName(unicode),
			unicode,
			advanceWidth: sourceGlyph?.advanceWidth || project.defaultAdvanceWidth,
			leftSideBearing: round(sourceGlyph?.leftSideBearing || 0),
			contours: sourceGlyph ? glyphToContours(sourceGlyph) : [],
		};
		glyphObjects.push(glyphObject);
	}

	ligatures.forEach((ligature) => {
		if (!ligature) return;
		glyphObjects.push({
			name: generateLigatureExportName(ligature),
			advanceWidth: ligature.advanceWidth,
			leftSideBearing: round(ligature.leftSideBearing || 0),
			contours: glyphToContours(ligature),
		});
	});

	return glyphObjects;
}

function buildNotdefGlyph(project) {
	const notdef = project.getItem('glyph-0x0');
	if (notdef) {
		return {
			name: '.notdef',
			unicode: 0,
			advanceWidth: notdef.advanceWidth,
			leftSideBearing: round(notdef.leftSideBearing || 0),
			contours: glyphToContours(notdef),
		};
	}

	const capHeight = project.settings.font.capHeight;
	const notDefGlyphPaths = [
		{
			name: 'Outer Phi Rectangle',
			pathPoints: [
				{ p: { coord: { x: 0, y: 700 } } },
				{ p: { coord: { x: 432, y: 700 } } },
				{ p: { coord: { x: 432, y: 0 } } },
				{ p: { coord: { x: 0, y: 0 } } },
			],
		},
		{
			name: 'Inner Phi Rectangle',
			pathPoints: [
				{ p: { coord: { x: 50, y: 50 } } },
				{ p: { coord: { x: 382, y: 50 } } },
				{ p: { coord: { x: 382, y: 650 } } },
				{ p: { coord: { x: 50, y: 650 } } },
			],
		},
	];
	const glyph = {
		advanceWidth: 432,
		leftSideBearing: 0,
		shapes: notDefGlyphPaths,
	};

	if (capHeight !== 700) {
		const delta = capHeight - 700;
		glyph.shapes = notDefGlyphPaths.map((shape) => ({
			name: shape.name,
			translateY: delta,
			pathPoints: shape.pathPoints,
		}));
	}

	return {
		name: '.notdef',
		unicode: 0,
		advanceWidth: glyph.advanceWidth,
		leftSideBearing: round(glyph.leftSideBearing || 0),
		contours: glyphToContours(glyph),
	};
}

function generateLigatureExportName(ligature) {
	let result = 'lig';
	ligature.gsub.forEach((char) => {
		result += '.' + getUniqueGlyphName(char).replace(/^uni?/, '');
	});
	return result;
}

function fontBufferToDataURI(buffer, flavor = DEFAULT_FLAVOR) {
	const base64 = arrayBufferToBase64(buffer);
	const mime = flavor === 'ttf' ? 'font/truetype' : 'font/opentype';
	return `data:${mime};base64,${base64}`;
}

function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	if (typeof btoa === 'function') {
		let binary = '';
		const chunkSize = 0x8000;
		for (let i = 0; i < bytes.length; i += chunkSize) {
			binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
		}
		return btoa(binary);
	}
	return Buffer.from(bytes).toString('base64');
}
