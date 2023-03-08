/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
	base: '/v2/app/',
	build: {
		outDir: '../dist/',
		manifest: false,
		emptyOutDir: true,
		chunkSizeWarningLimit: 2000,
	},
	test: {
		include: [
			'./project_data/tests/*.test.js'
		],
	}
});
