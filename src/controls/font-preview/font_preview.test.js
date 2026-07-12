import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFontFaceSource } from './font_preview.js';

describe('createFontFaceSource', () => {
	it('creates a blob URL source for font bytes and revokes it on cleanup', () => {
		const createObjectURL = vi.fn(() => 'blob:test-font');
		const revokeObjectURL = vi.fn();
		const targetDocument = {
			defaultView: {
				URL: {
					createObjectURL,
					revokeObjectURL,
				},
			},
		};
		const bytes = new Uint8Array([0, 1, 2, 3]);

		const { source, cleanup } = createFontFaceSource(bytes, 'otf', targetDocument);

		expect(createObjectURL).toHaveBeenCalledTimes(1);
		expect(source).toContain('blob:test-font');
		expect(source).toContain('format("opentype")');

		cleanup();
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-font');
	});
});
