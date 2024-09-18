import { describe, expect, it } from 'vitest';
import { SVGColorGlyph } from '../svg_color_glyph.js';

const svgCode = `
<?xml version='1.0' encoding='utf8'?>
<svg transform="" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" id="glyph36">
	<g transform="translate(0,-1638.4) scale(10.24)">
		<title>_</title>
		<path d="M96.59 118.35L73.24 72.37l-23.36 45.98h46.71z" fill="none" />
		<path d="M28.88 144.15a12.9 12.9 0 0 1 0-25.8h21l23.35-46-11.5-22.63a12.88 12.88 0 0 1-.06-11.57l-57 112.13a12.9 12.9 0 1 0 23 11.68l9-17.81h-7.9zM73.58 31h.85-.85zM77.54 31.73l.72.27zM76.23 31.34l.77.22zM74.9 31.1c.29 0 .57.08.86.14-.29-.06-.57-.11-.86-.14zM71.44 31.11h.23zM72.75 31zM80.34 33.11l-.23-.11.14.09zM81.33 33.83l-.22-.17zM70.13 31.37l.33-.09zM62.48 36.77a13 13 0 0 0-.75 1.23c.13-.26.29-.49.43-.73s.2-.33.32-.5zM83.76 36.42l.24.37zM83.06 35.52l.19.24zM82.24 34.63zM84.38 37.39l.23.42zM66.68 32.78l.51-.29zM63.9 35l.33-.33zM65.69 33.43l.47-.32zM64.76 34.16l.41-.34zM68.81 31.78l.49-.18zM67.94 32.12l.18-.12zM62.78 36.34c.21-.29.42-.57.65-.84-.22.28-.43.56-.65.84z" fill="#2584c5" />
		<path d="M84.8 38.15a12.88 12.88 0 0 1-.06 11.57l-11.5 22.65 23.35 46h21a12.9 12.9 0 1 1 0 25.8h-7.89l9 17.81a12.9 12.9 0 1 0 23-11.68zM79.34 32.52l.42.23zM81.46 33.93l-.13-.1-.17-.13zM80.63 33.31l-.29-.2-.09-.06zM62.57 36.63l-.09.14c-.11.17-.21.36-.31.54.13-.23.25-.47.4-.68zM72.91 31h-.16c-.36 0-.72 0-1.08.08h-.23c-.32 0-.65.1-1 .17l-.33.09c-.28.07-.56.14-.84.23l-.49.18c-.19.07-.38.13-.57.21a13 13 0 0 1 4.7-.96z" fill="#72bf44" />
		<path d="M61.73 49.72l11.5 22.65 11.5-22.65a12.88 12.88 0 0 0 .06-11.57l-.05-.15-.13-.23-.23-.42c-.12-.2-.24-.4-.37-.6l-.25-.37c-.16-.23-.33-.45-.51-.67l-.19-.24c-.23-.27-.47-.53-.72-.78-.25-.24-.51-.47-.77-.69l-.3-.23-.47-.35-.38-.25-.31-.17-.36-.22-.42-.23-.26-.14-.49-.23-.32-.18-.72-.28-.54-.16-.81-.22-.47-.1c-.28-.06-.57-.1-.86-.14l-.43-.1h-1.52a13 13 0 0 0-4.67 1h-.11l-.18.08-.55.26-.21.12-.51.29-.52.32-.47.32-.52.4-.41.34c-.18.16-.35.32-.52.49l-.34.38-.1.1-.06.06-.05.06-.16.21c-.23.27-.44.55-.65.84-.07.1-.15.18-.21.28s-.27.45-.4.68-.3.48-.43.73l-.06.12a12.88 12.88 0 0 0-.05 11.64z" fill="#107c47" />
		<path d="M49.88 118.35l-13.1 25.8h72.92l-13.11-25.8H49.88z" fill="#ed125f" />
		<path d="M16 131.25a12.9 12.9 0 0 0 12.9 12.9h7.9l13.11-25.8h-21A12.9 12.9 0 0 0 16 131.25z" fill="#5f3267" />
		<path d="M130.51 131.25a12.9 12.9 0 0 0-12.9-12.9h-21l13.11 25.8h7.91a12.9 12.9 0 0 0 12.88-12.9z" fill="#853135" />
	</g>
</svg>
`;

const expectedResult = svgCode.replace('<svg transform=""', '<svg');

describe('SVGColorGlyph', () => {
	it('constructor sets untransformedCode and imports SVG code', () => {
		const glyph = new SVGColorGlyph(svgCode);
		expect(glyph.untransformedCode).toBe(expectedResult);
		expect(glyph.cache).toBeDefined();
	});

	it('svgCode getter returns cached SVG code', () => {
		const glyph = new SVGColorGlyph(svgCode);
		expect(glyph.svgCode).toBe(expectedResult);
	});

	it('makeImgElement generates an HTML Image object', () => {
		const glyph = new SVGColorGlyph(svgCode);
		const img = glyph.makeImgElement();
		expect(img).toBeInstanceOf(HTMLImageElement);
	});

	it('img getter returns the cached Image object', () => {
		const glyph = new SVGColorGlyph(svgCode);
		const img = glyph.makeImgElement();
		glyph.cache.img = img;
		expect(glyph.img).toBe(img);
	});

	it('translateX returns the horizontal translation value', () => {
		const glyph = new SVGColorGlyph(svgCode);
		glyph.translateX = 10;
		expect(glyph.translateX).toBe(10);
	});

	it('translateY returns the vertical translation value', () => {
		const glyph = new SVGColorGlyph(svgCode);
		glyph.translateY = 20;
		expect(glyph.translateY).toBe(20);
	});

	it('scaleX returns the horizontal scale factor', () => {
		const glyph = new SVGColorGlyph(svgCode);
		glyph.scaleX = 2;
		expect(glyph.scaleX).toBe(2);
	});

	it('scaleY returns the vertical scale factor', () => {
		const glyph = new SVGColorGlyph(svgCode);
		glyph.scaleY = 3;
		expect(glyph.scaleY).toBe(3);
	});

	it('viewPad returns the viewBox padding', () => {
		const glyph = new SVGColorGlyph(svgCode);
		expect(glyph.viewPad).toBe(8000);
	});
});
