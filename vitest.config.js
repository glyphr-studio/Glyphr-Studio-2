import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		clearMocks: false,
		environment: 'jsdom',
		setupFiles: ['vi-canvas-mock', './vitest-setup.js'],
	},
});
