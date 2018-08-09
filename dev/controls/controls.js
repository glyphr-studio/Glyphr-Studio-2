/**
 * Export nothing by default
 */
export default function() {};

/**
 * Nicer centralized way of creating DOM elements
 * @param {string} tagName - HTML elment to create
 * @param {string} textContent - If this is a text node, what text to add
 * @param {string} className - class to add to the element
 * @param {array} attributes - collection of [attributeName, attributeValue]
 * @returns {HTMLElement}
 */
export function makeElement(tagName = 'span', textContent, className, attributes = []) {
    let newElement = document.createElement(tagName);

    if (textContent) newElement.innerHTML = textContent;

    if (className) newElement.setAttribute('class', className);

    for (let a=0; a<attributes.length; a++) {
        newElement.setAttribute(attributes[a][0], attributes[a][1]);
    }

    return newElement;
}
