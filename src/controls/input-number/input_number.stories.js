import { makeElement } from '../../common/dom.js';
import { InputNumber } from './input_number.js';

customElements.define('input-number', InputNumber);

export default {
	title: 'Controls/InputNumber',
	component: 'input-number',
	render: (args) => {
		const wrapper = makeElement({ tag: 'div', style: 'width: 250px;' });
		const input = new InputNumber();
		if (args.locked) input.setAttribute('is-locked', 'false');
		if (args.disabled) input.setAttribute('disabled', '');
		if (args.step) input.setAttribute('step', args.step);
		wrapper.appendChild(input);
		return wrapper;
	},
};

export const Primary = {};

export const SmallStep = {
	args: {
		step: 0.1,
	},
};

export const Lockable = {
	args: {
		locked: true,
	},
};

export const Disabled = {
	args: {
		disabled: true,
	},
};
