import { insertAfter, makeElement } from '../../common/dom';
import {
	closeEveryTypeOfDialog,
	makeContextMenu,
	showError,
	showModalDialog,
	showNotation,
	showToast,
} from './dialogs';

export default {
	title: 'Controls/Dialogs',
	render: (args) => {
		if (args.render) {
			closeEveryTypeOfDialog();
			return args.render();
		}
	},
};

export const Toast = {
	args: {
		render: () => {
			const button = document.createElement('button');
			button.innerHTML = 'Show Toast';
			button.addEventListener('click', () => {
				showToast('Hello, World!', 3000);
			});

			return button;
		},
	},
};

export const Error = {
	args: {
		render: () => {
			const button = document.createElement('button');
			button.innerHTML = 'Show Error';
			button.addEventListener('click', () => {
				showError('Look out, World!');
			});

			return button;
		},
	},
};

export const Modal = {
	args: {
		render: () => {
			const button = document.createElement('button');
			button.innerHTML = 'Show Modal';
			const dialogContent = `
			<h1>Hello, World!</h1>
			<p>This is a modal dialog, with stuff in it!</p>
			<br><br>
			<fancy-button>Do something!</fancy-button>
			`;
			const dialogNode = makeElement({ tag: 'div', innerHTML: dialogContent });
			button.addEventListener('click', () => {
				showModalDialog(dialogNode, 500);
			});

			return button;
		},
	},
};

export const ContextMenu = {
	args: {
		render: () => {
			const wrapper = makeElement({ tag: 'div', style: 'height: 400px;' });
			const button = document.createElement('button');
			button.innerHTML = 'Show Context Menu';

			const fileMenuData = [
				{
					name: 'Export OTF file',
					icon: 'command_export',
					note: ['Ctrl', 'e'],
				},
				{ name: 'hr' },
				{
					name: 'Export SVG font file',
					icon: 'command_export',
					note: ['Ctrl', 'g'],
				},
			];

			button.addEventListener('click', () => {
				insertAfter(button, makeContextMenu(fileMenuData, 160, 12, 400, 110, false));
			});

			wrapper.appendChild(button);

			return wrapper;
		},
	},
};

export const Notation = {
	args: {
		render: () => {
			const target = makeElement({
				tag: 'div',
				style: 'height: 600px; width: 800px; background-color: #f0f0f0;',
				innerHTML: 'Mouse-over for notation',
			});

			target.addEventListener('mousemove', (e) => {
				let content = `
					<div class="notation__path-add-point">
						<label>x</label>
						<span style="text-align: right;">${e.offsetX}</span>
						<span></span>
						<label>y</label>
						<span style="text-align: right;">${e.offsetY}</span>
						<span></span>
					</div>`;
				showNotation(content, e.offsetX - 530, e.offsetY - 55 );
				// console.log(e);
			});

			return target;
		},
	},
};
