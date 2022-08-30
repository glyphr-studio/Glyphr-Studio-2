import { log } from './functions.js';

/**
 * Export nothing by default
 */
export default function () {}

/**
 * Nicer centralized way of creating DOM elements
 * @param {string} tag - HTML element to create
 * @param {string} className - class to add to the element
 * @param {string} id - id to add to the element
 * @param {string} content - If this is a text node, what text to add
 * @param {boolean} tabIndex - make this elem a tab stop
 * @param {object} attributes - key/value pairs for attr/values
 * @param {string} innerHTML - text HTML to add as the content of this element
 * @returns {HTMLElement}
 */
export function makeElement({
	tag = 'span',
	className,
	id,
	content,
	title,
	elementRoot,
	tabIndex = false,
	attributes = {},
	innerHTML = false,
} = {}) {

	if(!document || !document.createElement){
		console.warn('no document or createElement');
		console.warn(document);
		return '';
	}

	const newElement = document.createElement(tag);

	if (className) newElement.setAttribute('class', className);

	if (id) newElement.setAttribute('id', id);
	else if (window.getUniqueControlID)
		newElement.setAttribute('id', document.getUniqueControlID());

	if (content) newElement.innerHTML = content;

	if (title) newElement.setAttribute('title', title);

	if (elementRoot) newElement.elementRoot = elementRoot;

	if (tabIndex === true) newElement.setAttribute('tabIndex', '0');
	else if (tabIndex !== false) newElement.setAttribute('tabIndex', tabIndex);

	Object.keys(attributes).forEach((key) =>
		newElement.setAttribute(key, attributes[key])
	);

	if (innerHTML) {
		const template = document.createElement('template');
		template.innerHTML = innerHTML;
		newElement.appendChild(template.content);

		// log(`makeElement - newElement:`);
		// log(newElement);
	}

	return newElement;
}

export function addAsChildren(parentNode, childNodes = []) {
	if(Array.isArray(childNodes)) {
		childNodes.forEach((element) => {
			parentNode.appendChild(element);
		});
	} else {
		parentNode.appendChild(childNodes);
	}
}