import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
		environment: 'jsdom',
		deps: {
			optimizer: {
				web: {
					include: ['vitest-canvas-mock'],
				},
			},
		},
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		environmentOptions: {
			jsdom: {
				resources: 'usable',
			},
		},
	},
});
