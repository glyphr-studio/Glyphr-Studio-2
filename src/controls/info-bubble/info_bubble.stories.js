import { makeOneSettingsRow } from '../../pages/settings.js';
import { makeSingleLabel } from '../../panels/cards.js';
import { InfoBubble } from './info_bubble.js';

customElements.define('info-bubble', InfoBubble);

export default {
	title: 'Controls/InfoBubble',
	component: 'info-bubble',
	render: (args) => {
		let example = `
		<div style="width: 200px; display: grid; grid-template-columns: 100px 24px;">
			<label>${args.name}:</label>
			<info-bubble>${args.content}</info-bubble>
		</div>
		`;

		return example;
	},
};

export const Primary = {
	args: {
		name: 'Some label',
		content: 'This is the content of the InfoBubble',
	},
};

export const LongContent = {
	args: {
		name: 'Some label',
		content: `A computer is a machine that can be programmed to automatically carry out sequences of arithmetic or logical operations (computation). Modern digital electronic computers can perform generic sets of operations known as programs. These programs enable computers to perform a wide range of tasks. The term computer system may refer to a nominally complete computer that includes the hardware, operating system, software, and peripheral equipment needed and used for full operation; or to a group of computers that are linked and function together, such as a computer network or computer cluster.`,
	},
};

export const StyledContent = {
	args: {
		name: 'Some label',
		content: `This is the content of the InfoBubble.<br><br>
		<strong>Some bold text</strong><br>
		Here is some note about this, with <i>some italic</i> text.<br><br>
		<a href="https://www.glyphrstudio.com">Glyphr Studio</a><br>`,
	},
};
