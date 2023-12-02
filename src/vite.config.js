/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/v2/app/',
	build: {
		outDir: '../dist/',
		manifest: false,
		emptyOutDir: true,
		chunkSizeWarningLimit: 3000,
	},
});
