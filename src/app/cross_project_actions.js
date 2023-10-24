import { makeElement } from '../common/dom';
import { getCurrentProjectEditor } from './main';

export function makePage_CrossProjectActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="cross-project-actions__page">
				<fancy-button id="cross-project-actions__close-button">close</fancy-button>
				<h1>yo</h1>
			</div>
		`,
	});

	const closeButton = content.querySelector('#cross-project-actions__close-button');
	closeButton.addEventListener('click', () => {
		getCurrentProjectEditor().navigate();
	});

	return content;
}
