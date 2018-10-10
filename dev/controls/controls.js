/**
 * Export nothing by default
 */
export default function() {};

/**
 * Nicer centralized way of creating DOM elements
 * @param {string} tag - HTML element to create
 * @param {string} className - class to add to the element
 * @param {string} id - id to add to the element
 * @param {string} content - If this is a text node, what text to add
 * @param {boolean} tabIndex - make this elem a tab stop
 * @param {array} attributes - collection of [attributeName, attributeValue]
 * @returns {HTMLElement}
 */
export function makeElement({tag = 'span', className, id, content, elementRoot, tabIndex = false, attributes = {}, innerHTML = false} = {}) {
    let newElement = document.createElement(tag);

    if (className) newElement.setAttribute('class', className);

    if (id) newElement.setAttribute('id', id);
    else if (window.getUniqueControlID) newElement.setAttribute('id', document.getUniqueControlID());

    if (content) newElement.innerHTML = content;

    if (elementRoot) newElement.elementRoot = elementRoot;

    if (tabIndex === true) newElement.setAttribute('tabIndex', '0');
    else if (tabIndex !== false) newElement.setAttribute('tabIndex', tabIndex);

    Object.keys(attributes).forEach((key) => newElement.setAttribute(key, attributes[key]));

    if (innerHTML) {
        let template = document.createElement('template');
        template.innerHTML = innerHTML;
        newElement.appendChild(template.content);

        // debug(`\t makeElement - newElement:`);
        // debug(newElement);
    }

    return newElement;
}

/**
 * Nicer centralized way of adding events to DOM elements
 * @param {string} elementID - ID of the element to which we are adding an event
 * @param {string} eventType - type of event
 * @param {function} eventFunction - what to do
 */
export function addEventHandler(elementID, eventType = 'click', eventFunction = function() {}) {
    let elem = document.getElementById(elementID);
    if (elem) {
        elem.addEventListener(eventType, eventFunction, false);
    }
}
