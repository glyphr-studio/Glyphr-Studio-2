import { describe, expect, it } from 'vitest';
import { XMLtoJSON } from '@mattlag/xmltojson';
import { ioSVG_importSVGfont } from '../svg_font_import.js';
import sampleFile from './ObleggExtendedTest.svg?raw';
import kernSampleFile from './SimpleProject_KernTest.svg?raw';

describe('SVG Font', () => {
	it('Import: Glyphs without a glyph-name attribute', async () => {
		const font = XMLtoJSON(`
			<svg xmlns="http://www.w3.org/2000/svg">
				<defs>
					<font id="UnnamedGlyphs" horiz-adv-x="1000">
						<font-face font-family="Unnamed Glyphs" />
						<glyph unicode="A" horiz-adv-x="500" d="M0 0 L100 0 L100 100 Z" />
					</font>
				</defs>
			</svg>
		`);
		const result = await ioSVG_importSVGfont(font, true);

		expect(result.glyphs['glyph-0x41'].advanceWidth).toBe(500);
	});

	it('Import: Oblegg Extended Test', async () => {
		const result = await ioSVG_importSVGfont(XMLtoJSON(sampleFile), true);
		expect(result).toBeTruthy();

		// Glyphs
		const capA = result.glyphs['glyph-0x41'];
		expect(capA).toBeTruthy();
		expect(capA.advanceWidth).toEqual(1252);
		expect(capA.shapes.length).toEqual(2);
		expect(capA.shapes[0].pathPoints.length).toEqual(32);

		// Kerns
		const kernOne = result.kerning['kern-1'];
		expect(kernOne.leftGroup[0]).toEqual('0x41');
		expect(kernOne.rightGroup[0]).toEqual('0x43');
		expect(kernOne.value).toEqual(38);

		// Metadata
		expect(result.settings.font.style).toEqual('ObleggExtendedTest');
	});

	it('Import: Kern hkern value parsing', async () => {
		const result = await ioSVG_importSVGfont(XMLtoJSON(kernSampleFile), true);
		expect(result).toBeTruthy();

		const kerns = Object.values(result.kerning);
		expect(kerns).toHaveLength(9);

		const kernValues = kerns.map((kern) => kern.value).sort((a, b) => a - b);
		expect(kernValues).toEqual([100, 100, 100, 200, 200, 200, 300, 300, 300]);
	});


});
