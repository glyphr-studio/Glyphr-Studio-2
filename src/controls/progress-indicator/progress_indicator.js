import { addAsChildren, makeElement } from '../../common/dom.js';
import { pause } from '../../common/functions.js';

// Animation
let degrees = 0;

/**
 * Updates the currently displayed progress indicator
 * @param {String} message - what text to show for this progress step
 */
export async function updateProgressIndicator(message) {
	const container = document.querySelector('#progress-indicator__message');
	if (container) {
		/** @type {HTMLElement} */
		const bar = document.querySelector('#progress-indicator__bar');
		if (bar) {
			degrees = (degrees + 0.95) % 100;
			bar.style.backgroundPosition = `${degrees}%`;
			if (message) container.innerHTML = message;
		}
		await pause();
	}
}

/**
 * Makes a progress indicator control
 * @returns {Element}
 */
export function makeProgressIndicator() {
	// log('makeProgressIndicator', 'start');

	let wrapper = makeElement({ id: 'progress-indicator__wrapper' });
	let message = makeElement({
		id: 'progress-indicator__message',
		innerHTML: 'Working...',
	});
	let bar = makeElement({
		tag: 'div',
		id: 'progress-indicator__bar',
	});

	addAsChildren(wrapper, [message, bar]);

	// log('makeProgressIndicator', 'end');
	return wrapper;
}
