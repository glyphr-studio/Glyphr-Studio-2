import { makeElement } from '../../common/dom.js';
import { OptionChooser } from './option_chooser.js';

customElements.define('option-chooser', OptionChooser);

export default {
	title: 'Controls/OptionChooser',
	component: 'option-chooser',
	render: (args) => {
		const wrapper = makeElement({ tag: 'div', style: 'height: 500px; width: 250px;' });
		const chooser = new OptionChooser();
		if (args.disabled) chooser.setAttribute('disabled', '');
		chooser.setAttribute('selected-prefix', 'Category:');
		chooser.setAttribute('selected-id', 'First thing[123, 456]');
		chooser.setAttribute('selected-name', 'First thing');

		// option1
		const option1 = document.createElement('option');
		option1.setAttribute('value', 'first');
		option1.textContent = 'First thing';
		option1.setAttribute('note', '[123, 456]');
		chooser.appendChild(option1);

		// option2
		const option2 = document.createElement('option');
		option2.setAttribute('value', 'second');
		option2.textContent = 'Second thing';
		option2.setAttribute('note', '[123, 456]');
		chooser.appendChild(option2);

		// option3
		const option3 = document.createElement('option');
		option3.setAttribute('value', '3rd');
		option3.textContent = '3rd thing';
		option3.setAttribute('note', '[123, 456]');
		chooser.appendChild(option3);

		wrapper.appendChild(chooser);

		return wrapper;
	},
};

export const Primary = {};

export const Disabled = {
	args: {
		disabled: true,
	},
};
