import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		clearMocks: false,
		environment: 'jsdom',
		setupFiles: ['vi-canvas-mock', './vitest-setup.js'],
		exclude: [...configDefaults.exclude, 'src/lib/unicode/unicode_definitions/tests/**'],
	},
});
