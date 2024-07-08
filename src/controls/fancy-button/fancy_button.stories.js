import { FancyButton } from './fancy_button.js';

customElements.define('fancy-button', FancyButton);

export default {
	title: 'Controls/FancyButton',
	component: 'fancy-button',
	render: (args) => {
		const button = new FancyButton(args);
		button.innerHTML = 'Button text';
		return button;
	},
};

export const Primary = {
	args: {
		title: 'Primary',
	},
};

export const PrimaryDisabled = {
	args: {
		title: 'Primary Disabled',
		disabled: '',
	},
};

export const Secondary = {
	args: {
		title: 'Secondary',
		secondary: '',
	},
};

export const SecondaryDisabled = {
	args: {
		title: 'Secondary Disabled',
		secondary: '',
		disabled: '',
	},
};

export const Danger = {
	args: {
		title: 'Danger',
		danger: '',
	},
};

export const DangerDisabled = {
	args: {
		title: 'Danger Disabled',
		danger: '',
		disabled: '',
	},
};

export const Minimal = {
	args: {
		title: 'Minimal',
		minimal: '',
	},
};

export const MinimalDisabled = {
	args: {
		title: 'Minimal Disabled',
		minimal: '',
		disabled: '',
	},
};
