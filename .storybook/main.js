/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
	// stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	stories: ['../src/controls/**/*.stories.js'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@chromatic-com/storybook'],
	framework: {
		name: '@storybook/web-components-vite',
		options: {},
	},
};
export default config;
