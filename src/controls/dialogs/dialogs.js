import { getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { addAsChildren, makeElement, textToNode } from '../../common/dom.js';
import { makeIcon } from '../../common/graphics.js';
import { closeAllNavMenus } from '../../project_editor/navigator.js';

// --------------------------------------------------------------
// Generic dialog stuff
// --------------------------------------------------------------
export function closeEveryTypeOfDialog() {
	// log(`closeEveryTypeOfDialog`, 'start');
	closeAllNavMenus();
	closeAllModalDialogs();
	closeAllOptionChoosers();
	closeAllErrors();
	closeAllToasts();
	closeAllInfoBubbles();
	// log(`closeEveryTypeOfDialog`, 'end');
}

export function closeAllModalDialogs() {
	// log(`closeAllModalDialogs`, 'start');
	let dialogs = document.querySelectorAll('dialog');
	dialogs.forEach((elem) => animateRemove(elem));
	const editor = getCurrentProjectEditor();
	if (editor.popOutWindow) {
		dialogs = editor.popOutWindow.document.querySelectorAll('dialog');
		dialogs.forEach((elem) => animateRemove(elem));
	}
	// log(`closeAllModalDialogs`, 'end');
}

export function closeAllOptionChoosers() {
	// log(`closeAllOptionChoosers`, 'start');
	closeAllContextMenus();
	let optionChoosers = document.querySelectorAll('option-chooser');
	optionChoosers.forEach((elem) => elem.removeAttribute('deployed'));
	// log(`closeAllOptionChoosers`, 'end');
}

export function closeAllContextMenus() {
	// log(`closeAllContextMenus`, 'start');
	let menus = document.querySelectorAll('#context-menu');
	menus.forEach((elem) => animateRemove(elem));
	// log(`closeAllContextMenus`, 'end');
}

export function closeAllToasts() {
	// log(`closeAllToasts`, 'start');
	let toasts = document.querySelectorAll('#toast');
	toasts.forEach((elem) => animateRemove(elem));
	// log(`closeAllToasts`, 'end');
}

export function closeAllErrors() {
	// log(`closeAllErrors`, 'start');
	let errors = document.querySelectorAll('#error');
	errors.forEach((elem) => animateRemove(elem));
	// log(`closeAllErrors`, 'end');
}

export function closeAllInfoBubbles() {
	// log(`closeAllInfoBubbles`, 'start');
	let bubbles = document.querySelectorAll('#bubble');
	bubbles.forEach((elem) => {
		elem.querySelector('.content').dispatchEvent(new Event('mouseleave'));
		elem.blur();
	});
	// log(`closeAllInfoBubbles`, 'end');
}

export function animateRemove(element, animationLength = 120, scale = 0.98, translateY = '-5px') {
	element.animate(
		{ opacity: 0, transform: `scale(${scale}) translateY(${translateY})` },
		{ duration: animationLength }
	);
	// This works for the main window, or the pop-out window
	element.ownerDocument.defaultView.setTimeout(() => {
		element.style.display = 'none';
		element.remove();
	}, animationLength - 10);
}

// -----------------------------------------------------------------
// Toast
// -----------------------------------------------------------------

/**
 * Creates and shows a little message at the top/center
 * of the screen, which disappears after a set time
 * @param {String} message - message to show
 * @param {Number} duration - how long to show the message (milliseconds)
 */
export function showToast(message = '0_o', duration = 3000) {
	// log(`showToast`, 'start');

	let element = document.getElementById('toast');

	// remove any current context menu, or create one if it doesn't exist
	if (element) {
		element.style.display = 'none';
		element.innerHTML = '';
	} else {
		element = makeElement({
			tag: 'div',
			id: 'toast',
			attributes: { tabindex: '-1' },
			style: 'display: none;',
		});
		document.body.appendChild(element);
	}

	element.innerHTML = message;
	element.style.display = 'block';
	window.setTimeout(() => animateRemove(element), duration);
	// log(`showToast`, 'end');
}

// --------------------------------------------------------------
// Context Menu
// --------------------------------------------------------------

/**
 * Creates a small menu - can be used for:
 *   * Top app File menus
 *   * Right-click menus
 *   * Drop-down menus
 * @param {Array} data - collection of objects representing each row
 * @param {Number} x - X position for the menu
 * @param {Number} y - Y position for the menu
 * @param {Number} width - width for the menu (defaults to auto-width)
 * @param {Boolean} isDropdown - triggers slight style adjustments for dropdown control
 * @returns {HTMLElement}
 */
export function makeContextMenu(
	rows = [],
	x = false,
	y = false,
	width = false,
	isDropdown = false
) {
	// log(`makeContextMenu`, 'start');
	// log(`x: ${x}`);
	// log(`y: ${y}`);
	// log(`width: ${width}`);
	// log(`isDropdown: ${isDropdown}`);

	// let element = document.getElementById('context-menu');

	// remove any current context menu, or create one if it doesn't exist
	// if (element) {
	// 	element.style.display = 'none';
	// 	element.innerHTML = '';
	// } else {
	let element = makeElement({
		tag: 'dialog',
		id: 'context-menu',
		attributes: { tabindex: '-1' },
	});
	// document.body.appendChild(element);
	// }

	// Create and add each row
	rows.forEach((item) => {
		// log(`item.name: ${item.name}`);
		element.appendChild(makeOneContextMenuRow(item));
	});

	// Move it and show it
	if (isFinite(x) && isFinite(y)) {
		element.style.position = 'absolute';
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
		element.style.display = 'grid';
		if (isDropdown) {
			element.style.borderRadius = '0px 0px 4px 4px';
			element.style.borderTopWidth = '0px';
		} else {
			element.style.borderRadius = '0px 4px 4px 4px';
			element.style.borderTopWidth = '1px';
		}
		if (width) {
			element.style.minWidth = `${width}px`;
		}
		element.addEventListener('mouseleave', closeAllOptionChoosers);
		element.focus();
	} else {
		console.warn(`Context menu not supplied with a screen position.`);
	}

	// log(`makeContextMenu`, 'end');
	return element;
}

function makeOneContextMenuRow(data = {}) {
	// log(`makeOneContextMenuRow`, 'start');
	// log(data);
	let row = makeElement({
		tag: 'div',
		className: 'context-menu-row',
		attributes: { tabindex: '0' },
	});

	if (data.name === 'hr') {
		row.appendChild(makeElement({ tag: 'hr' }));
		return row;
	}

	// Icon
	if (data.icon) {
		let svgWrapper = makeElement({ className: 'row-icon' });
		svgWrapper.appendChild(
			textToNode(
				makeIcon({
					name: data.icon,
					color: accentColors.blue.l55,
					hoverColor: 'blue',
				})
			)
		);
		row.appendChild(svgWrapper);
	} else {
		row.appendChild(makeElement({ innerHTML: '[?]' }));
	}

	// Command name
	data.name = data.name || 'NAME';
	row.appendChild(makeElement({ className: 'row-name', innerHTML: data.name }));

	// Note / Keyboard Shortcut
	let noteWrapper = makeElement({ className: 'row-notes' });
	// log(`data.note: ${data.note}`);

	if (data.note) {
		if (typeof data.note === 'string' && data.note.charAt(0) === '[') {
			JSON.parse(data.note).forEach((key) =>
				noteWrapper.appendChild(makeElement({ tag: 'code', innerHTML: key }))
			);
		} else if (Array.isArray(data.note)) {
			data.note.forEach((key) =>
				noteWrapper.appendChild(makeElement({ tag: 'code', innerHTML: key }))
			);
		} else {
			noteWrapper.appendChild(textToNode(`<span>${data.note}</span>`));
		}
	} else {
		noteWrapper.appendChild(textToNode(`<span></span>`));
	}
	row.appendChild(noteWrapper);

	// Click function
	row.addEventListener('click', () => {
		closeAllOptionChoosers();
		if (data.onClick) data.onClick();
	});

	// log(`makeOneContextMenuRow`, 'end');
	return row;
}

// --------------------------------------------------------------
// Error
// --------------------------------------------------------------

/**
 * Shows the error message box
 * @param {String} message - HTML content of the dialog box
 */
export function showError(message) {
	let element = makeElement({ tag: 'div', id: 'error' });
	let header = makeElement({ className: 'error__header', innerHTML: '<h3>Error</h3>' });
	let close = makeElement({ tag: 'button', innerHTML: '&times;' });
	close.addEventListener('click', closeEveryTypeOfDialog);
	header.appendChild(close);
	let body = makeElement({ className: 'error__body', innerHTML: message });
	addAsChildren(element, [header, body]);

	closeEveryTypeOfDialog(true);
	document.body.appendChild(element);
}

// --------------------------------------------------------------
// Modal dialog
// --------------------------------------------------------------

/**
 * Shows a big dialog that blurs the UI behind it.
 * @param {DOM Node} contentNode - HTML to show in the dialog
 */
export function showModalDialog(contentNode, maxWidth) {
	let modal = makeModalDialog(contentNode, maxWidth);
	closeEveryTypeOfDialog();
	document.body.appendChild(modal);
}

export function makeModalDialog(contentNode, maxWidth) {
	// log(`makeModalDialog`, 'start');
	// log(`\n⮟contentNode⮟`);
	// log(contentNode);
	// log(`maxWidth: ${maxWidth}`);
	let modal = makeElement({
		tag: 'dialog',
		id: 'modal-dialog',
		innerHTML: `
		<div class="modal-dialog__content">
		<div class="modal-dialog__header">
			<span></span>
			<button class="modal-dialog__close-button">&times;</button>
			</div>
			<div class="modal-dialog__body"></div>
		</div>
				`,
	});

	modal
		.querySelector('.modal-dialog__close-button')
		.addEventListener('click', closeEveryTypeOfDialog);

	addAsChildren(modal.querySelector('.modal-dialog__body'), contentNode);
	if (maxWidth) {
		modal.querySelector('.modal-dialog__content').style.maxWidth = `${maxWidth}px`;
	}

	// log(`\n⮟modal⮟`);
	// log(modal);
	// log(`makeModalDialog`, 'end');
	return modal;
}
