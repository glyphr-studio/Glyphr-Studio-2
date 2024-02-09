/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: '../dist/',
		manifest: false,
		emptyOutDir: true,
		chunkSizeWarningLimit: 3000,
		rollupOptions: {
			treeshake: 'recommended',
		},
	}
});
