import { FancyButton } from './fancy_button.js';

customElements.define('fancy-button', FancyButton);

export default {
	title: 'Controls/FancyButton',
	component: 'fancy-button',
	render: (args) => {
		const button = new FancyButton(args);
		button.innerHTML = args.text;
		return button;
	},
};

export const Primary = {
	args: {
		text: 'Primary',
	},
};

export const PrimaryDisabled = {
	args: {
		text: 'Primary Disabled',
		disabled: '',
	},
};

export const Secondary = {
	args: {
		text: 'Secondary',
		secondary: '',
	},
};

export const SecondaryDisabled = {
	args: {
		text: 'Secondary Disabled',
		secondary: '',
		disabled: '',
	},
};

export const Danger = {
	args: {
		text: 'Danger',
		danger: '',
	},
};

export const DangerDisabled = {
	args: {
		text: 'Danger Disabled',
		danger: '',
		disabled: '',
	},
};

export const Minimal = {
	args: {
		text: 'Minimal',
		minimal: '',
	},
};

export const MinimalDisabled = {
	args: {
		text: 'Minimal Disabled',
		minimal: '',
		disabled: '',
	},
};
