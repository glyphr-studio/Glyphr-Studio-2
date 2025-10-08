/// <reference types="vitest" />
import { createLogger, defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Create custom logger to filter out Node.js externalization warnings from ttx-wasm
const logger = createLogger();
const loggerWarn = logger.warn;
logger.warn = (msg, options) => {
	// Suppress Node.js module externalization warnings from ttx-wasm
	if (msg.includes('externalized for browser compatibility') && msg.includes('ttx-wasm')) {
		return;
	}
	loggerWarn(msg, options);
};

export default defineConfig({
	customLogger: logger,
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: '../node_modules/ttx-wasm/dist/pyodide/*',
					dest: 'pyodide',
				},
			],
		}),
	],
	build: {
		outDir: '../dist/',
		manifest: false,
		emptyOutDir: true,
		chunkSizeWarningLimit: 3000,
		rollupOptions: {
			treeshake: 'recommended',
		},
	},
});
