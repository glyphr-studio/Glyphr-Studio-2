/**
 * Nicer centralized way of creating DOM elements
 * @param {Object} args
 * @param {String=} args.tag - HTML element to create
 * @param {String=} args.className - class to add to the element
 * @param {String=} args.id - id to add to the element
 * @param {String=} args.content - If this is a text node, what text to add
 * @param {String=} args.title - title attribute for hover tooltips
 * @param {Boolean=} args.tabIndex - make this elem a tab stop
 * @param {Object=} args.attributes - key/value pairs for attr/values
 * @param {Object=} args.style - key/value pairs of CSS
 * @param {String=} args.innerHTML - text HTML to add as the content of this element
 * @param {Function=} args.onClick - click handler
 * @param {Document=} args.doc - which document this control is in
 * @returns {HTMLElement}
 */
export function makeElement({
	tag = 'span',
	className = '',
	id = '',
	content = '',
	title = '',
	tabIndex = false,
	attributes = {},
	style = false,
	innerHTML = '',
	onClick,
	doc,
} = {}) {
	// log(`makeElement - ${tag}`, 'start');
	// log(`tag: ${tag}`);

	if (!doc) doc = document;
	if (!doc.createElement) {
		console.warn('no document or createElement');
		console.warn(doc);
		// log(`makeElement - ${tag}`, 'end');
		return new HTMLElement();
	}

	const newElement = doc.createElement(tag);
	// log(`\n⮟newElement⮟`);
	// log(newElement);

	if (className) newElement.setAttribute('class', className);

	if (id) newElement.setAttribute('id', id);

	if (content) newElement.innerHTML = content;

	if (title) newElement.setAttribute('title', title);

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

	if (onClick && typeof onClick === 'function') {
		// @ts-expect-error 'property does exist'
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
 * @param {HTMLElement | Element} parentNode - wrapper to add children to
 * @param {HTMLElement | Element | Array} childNodes - child nodes to recursively add to the wrapper
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
 * @returns {Element | null}
 */
export function textToNode(textHTML = '') {
	let result = makeElement();
	result.innerHTML = textHTML;
	return result.firstElementChild;
}

/**
 * Inserts an HTML node after a given node
 * Kind of like the opposite of Node.insertBefore
 * @param {HTMLElement} baseNode - current node
 * @param {HTMLElement} newNode - node to add after current node
 */
export function insertAfter(baseNode, newNode) {
	if (baseNode?.parentNode && newNode) {
		baseNode.parentNode.insertBefore(newNode, baseNode.nextSibling);
	}
}
