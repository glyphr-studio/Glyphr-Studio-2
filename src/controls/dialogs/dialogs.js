import { accentColors, uiColors } from '../../common/colors.js';
import { addAsChildren, makeElement, textToNode } from '../../common/dom.js';
import { makeIcon } from '../../common/graphics.js';

// --------------------------------------------------------------
// Generic dialog stuff
// --------------------------------------------------------------
export function closeAllDialogs(hideToasts = false) {
	// log(`closeAllDialogs`, 'start');
	// log(`hideToasts: ${hideToasts}`);

	let dialogs = document.querySelectorAll('dialog');
	dialogs.forEach((elem) => animateRemove(elem));

	let optionChoosers = document.querySelectorAll('option-chooser');
	optionChoosers.forEach((elem) => elem.removeAttribute('deployed'));

	if (hideToasts) {
		let toasts = document.querySelectorAll('#toast');
		toasts.forEach((elem) => animateRemove(elem));
	}

	// log(`closeAllDialogs`, 'end');
}

export function animateRemove(element) {
	let animationLength = 120;
	element.animate(
		{ opacity: 0, transform: 'scale(0.98) translateY(-5px)' },
		{ duration: animationLength }
	);
	window.setTimeout(() => {
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
 * @param {string} message - message to show
 * @param {number} duration - how long to show the message (milliseconds)
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
 *   * (Possibly) as a better Options dropdown for forms
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
		setDialogHideListeners(element);
		element.focus();
	} else {
		console.warn(`Context menu not supplied with a screen position.`);
	}

	// log(`makeContextMenu`, 'end');
	return element;
}

function makeOneContextMenuRow(data = {}) {
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
		let svgWrapper = makeElement({className: 'row-icon'});
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

	// Keyboard Shortcut
	let shortcutWrapper = makeElement({ className: 'row-shortcuts' });
	if (data.shortcut) {
		data.shortcut.forEach((key) =>
			shortcutWrapper.appendChild(makeElement({ tag: 'code', innerHTML: key }))
		);
	} else {
		shortcutWrapper.appendChild(makeElement());
		shortcutWrapper.appendChild(makeElement());
	}
	row.appendChild(shortcutWrapper);

	// Click function
	if (data.onClick) row.addEventListener('click', data.onClick);

	return row;
}

export function setDialogHideListeners(element) {
	element.addEventListener('mouseleave', () => {
		closeAllDialogs();
	});
}

// --------------------------------------------------------------
// Error
// --------------------------------------------------------------

/**
 * Shows the error message box
 * @param {string} message - HTML content of the dialog box
 */
export function showError(message) {
	let element = makeElement({ tag: 'dialog', id: 'error' });
	let header = makeElement({ className: 'error__header', innerHTML: '<h3>Error</h3>' });
	let close = makeElement({ tag: 'button', innerHTML: '&times;' });
	close.addEventListener('click', closeAllDialogs);
	header.appendChild(close);
	let body = makeElement({ className: 'error__body', innerHTML: message });
	addAsChildren(element, [header, body]);

	closeAllDialogs(true);
	document.body.appendChild(element);
}

// --------------------------------------------------------------
// Big dialog
// --------------------------------------------------------------

/**
 * Shows a big dialog that blurs the UI behind it.
 * @param {DOM Node} contentNode - HTML to show in the dialog
 */
export function showModalDialog(contentNode, maxWidth) {
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

	modal.querySelector('.modal-dialog__close-button').addEventListener('click', closeAllDialogs);

	addAsChildren(modal.querySelector('.modal-dialog__body'), contentNode);
	if (maxWidth) {
		modal.querySelector('.modal-dialog__content').style.maxWidth = `${maxWidth}px`;
	}

	closeAllDialogs(true);
	document.body.appendChild(modal);
}

// --------------------------------------------------------------
// OLD STUFF
// --------------------------------------------------------------

// /**
//  * Creates and shows a standard dialog box
//  * @param {string} content - HTML content of the dialog box
//  */
// export function openDialog(content) {
// 	closeDialog();
// 	document.body.focus();
// 	const dc = document.getElementById('dialogRightContent');
// 	dc.innerHTML = content;

// 	if (dc.style.height > 800) dc.style.height = 800;
// 	else dc.style.width = 'auto';

// 	document.getElementById('dialog_box').style.display = 'block';
// 	document.getElementById('dialog_bg').style.display = 'block';
// }

// /**
//  * Creates and shows a full height dialog box along the left
//  * side of the screen
//  * @param {string} content - HTML content of the dialog box
//  */
// export function openBigDialog(content) {
// 	closeDialog();
// 	document.body.focus();
// 	document.getElementById('bigDialogLeftContent').innerHTML = content;
// 	document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(
// 		_UI.glyphChooser.dialog
// 	);

// 	document.getElementById('big_dialog_box').style.display = 'block';
// 	document.getElementById('dialog_bg').style.display = 'block';
// }

// /**
//  * Returns true if the big dialog box is open
//  * @returns {boolean}
//  */
// export function isBigDialogOpen() {
// 	return document.getElementById('big_dialog_box').style.display === 'block';
// }

// /**
//  * Creates and shows a small dialog box at a certain
//  * screen x,y position
//  * @param {string} content - HTML content of the dialog box
//  * @param {number} x - screen x location
//  * @param {number} y - screen y location
//  */
// export function openNotation(content, x, y) {
// 	document.body.focus();
// 	const n = document.getElementById('notation');
// 	n.innerHTML = content;
// 	n.style.top = round(y) + 'px';
// 	n.style.left = round(x + 50) + 'px';
// 	n.style.display = 'block';
// }

// /**
//  * Closes any notation dialog boxes
//  */
// export function closeNotation() {
// 	document.getElementById('notation').style.display = 'none';
// 	document.getElementById('notation').innerHTML = '&#x20E2;';
// 	document.body.focus();
// }

// /**
//  * Toggles open/closed the small flyout off the save button
//  * asking which format to export
//  */
// export function toggleDialogExportOptions() {
// 	const sff = document.getElementById('saveFormatFlyout');
// 	const nps = document.getElementById('npSave');

// 	if (sff.style.display === 'block') {
// 		closeDialog();
// 	} else {
// 		nps.style.backgroundColor = _UI.colors.blue.l45;
// 		sff.style.display = 'block';
// 	}
// }
