import { InputNumber } from './input_number.js';

customElements.define('input-number', InputNumber);

export default {
	title: 'Controls/InputNumber',
	component: 'input-number',
	render: (args) => {
		const input = new InputNumber();
		if (args.disabled) input.setAttribute('disabled', '');
		return input;
	},
};

export const Primary = {};
export const Disabled = {
	args: {
		disabled: true,
	},
};
