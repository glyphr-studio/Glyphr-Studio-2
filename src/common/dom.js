/**
 * Nicer centralized way of creating DOM elements
 * @param {String} tag - HTML element to create
 * @param {String} className - class to add to the element
 * @param {String} id - id to add to the element
 * @param {String} content - If this is a text node, what text to add
 * @param {Boolean} tabIndex - make this elem a tab stop
 * @param {Object} attributes - key/value pairs for attr/values
 * @param {String} innerHTML - text HTML to add as the content of this element
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
	style = false,
	innerHTML = false,
	onClick = false,
	doc = document,
} = {}) {
	// log(`makeElement - ${tag}`, 'start');
	// log(`tag: ${tag}`);
	if (!doc || !doc.createElement) {
		console.warn('no document or createElement');
		console.warn(doc);
		// log(`makeElement - ${tag}`, 'end');
		return '';
	}

	const newElement = doc.createElement(tag);
	// log(`\n⮟newElement⮟`);
	// log(newElement);

	if (className) newElement.setAttribute('class', className);

	if (id) newElement.setAttribute('id', id);
	else if (window.getUniqueControlID) newElement.setAttribute('id', document.getUniqueControlID());

	if (content) newElement.innerHTML = content;

	if (title) newElement.setAttribute('title', title);

	if (elementRoot) newElement.elementRoot = elementRoot;

	if (tabIndex === true) newElement.setAttribute('tabIndex', '0');
	else if (tabIndex !== false) newElement.setAttribute('tabIndex', tabIndex);

	Object.keys(attributes).forEach((key) => newElement.setAttribute(key, attributes[key]));

	if (style) {
		newElement.setAttribute('style', style);
	}

	if (innerHTML) {
		const template = document.createElement('template');
		template.innerHTML = innerHTML;
		newElement.appendChild(template.content);

		// log(`makeElement - newElement:`);
		// log(newElement);
	}

	if (onClick) {
		newElement.addEventListener('click', onClick);
	}

	// log(`makeElement - ${tag}`, 'end');
	return newElement;
}

/**
 * HTML elements cannot exist without a wrapper or parent element,
 * but sometimes when we generate UI, we just want to create the children
 * without regard for who the parent will be.
 * This function takes a parent and recursively adds collections of
 * children that are contained in arrays.
 * @param {HTML node} parentNode - wrapper to add children to
 * @param {HTML node,
 * 				Array of HTML nodes,
 * 				or mixed Array of HTML nodes and arrays} childNodes -
 * 						child nodes to recursively add to the wrapper
 */
export function addAsChildren(parentNode, childNodes = []) {
	// log(`addAsChildren`, 'start');
	// log(parentNode);
	// log(childNodes);

	if (Array.isArray(childNodes)) {
		childNodes.forEach((child) => {
			if (Array.isArray(child)) addAsChildren(parentNode, child);
			else parentNode.appendChild(child);
		});
	} else {
		parentNode.appendChild(childNodes);
	}
	// log(`addAsChildren`, 'end');
}

/**
 * Takes a string and reads it as an HTML Node
 * @param {String} textHTML - string representation of HTML
 * @returns {HTMLElement}
 */
export function textToNode(textHTML) {
	let result = makeElement({ innerHTML: textHTML });
	return result.firstElementChild;
}

/**
 * Inserts an HTML node after a given node
 * Kind of like the opposite of Node.insertBefore
 * @param {HTMLElement} baseNode - current node
 * @param {HTMLElement} newNode - node to add after current node
 */
export function insertAfter(baseNode, newNode) {
	baseNode.parentNode.insertBefore(newNode, baseNode.nextSibling);
}
