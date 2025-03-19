import { makeElement } from '../../common/dom.js';
import { OptionToggle } from './option_toggle.js';

customElements.define('option-toggle', OptionToggle);

export default {
	title: 'Controls/OptionToggle',
	component: 'option-toggle',
	render: (args) => {
		const wrapper = makeElement({ tag: 'div', style: 'width: 250px;' });
		const toggle = new OptionToggle();
		if (args.disabled) toggle.setAttribute('disabled', '');
		toggle.setAttribute('selected-value', args.selectedValue);
		toggle.setAttribute('selected-name', args.selectedName);
		const option1 = document.createElement('option');
		option1.setAttribute('value', 'first');
		option1.textContent = 'First thing';
		const option2 = document.createElement('option');
		option2.setAttribute('value', 'second');
		option2.textContent = 'Second thing';
		toggle.appendChild(option1);
		toggle.appendChild(option2);

		wrapper.appendChild(toggle);
		return wrapper;
	},
};

export const Primary = {
	args: {
		selectedValue: 'first',
		selectedName: 'First thing',
	},
};

export const Disabled = {
	args: {
		selectedValue: 'first',
		selectedName: 'First thing',
		disabled: true,
	},
};
