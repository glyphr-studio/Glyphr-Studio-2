/**
 * Export nothing by default
 */
export default function() {};

/**
 * Nicer centralized way of creating DOM elements
 * @param {string} tag - HTML elment to create
 * @param {string} className - class to add to the element
 * @param {string} id - id to add to the element
 * @param {string} content - If this is a text node, what text to add
 * @param {boolean} tabindex - make this elem a tab stop
 * @param {array} attributes - collection of [attributeName, attributeValue]
 * @returns {HTMLElement}
 */
export function makeElement({tag = 'span', className, id, content, elementRoot, tabindex = false, attributes = []} = {}) {
    let newElement = document.createElement(tag);

    if (className) newElement.setAttribute('class', className);

    if (id) newElement.setAttribute('id', id);
    else if (window.getUniqueControlID) newElement.setAttribute('id', document.getUniqueControlID());

    if (content) newElement.innerHTML = content;

    if (elementRoot) newElement.elementRoot - elementRoot;

    if (tabindex) newElement.setAttribute('tabindex', '0');

    for (let a=0; a<attributes.length; a++) {
        newElement.setAttribute(attributes[a][0], attributes[a][1]);
    }

    return newElement;
}
