import { accentColors, uiColors } from '../common/colors.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { makeIcon } from '../common/graphics.js';

// --------------------------------------------------------------
// Generic dialog stuff
// --------------------------------------------------------------
export function closeAllDialogs(hideToasts = false) {
	let dialogs = document.querySelectorAll('dialog');
	dialogs.forEach((elem) => animateRemove(elem));

	if (hideToasts) {
		let toasts = document.querySelectorAll('#toast');
		toasts.forEach((elem) => animateRemove(elem));
	}

}

function animateRemove(element) {
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
	log(`showToast`, 'start');

	let element = document.getElementById('toast');

	// remove any current context menu, or create one if it doesn't exist
	if (element) {
		element.style.display = 'none';
		element.innerHTML = '';
	} else {
		element = makeElement({
			tag: 'dialog',
			id: 'toast',
			attributes: { tabindex: '-1' },
		});
		element.style.display = 'none';
		document.body.appendChild(element);
	}

	element.innerHTML = message;
	element.style.display = 'block';
	window.setTimeout(() => animateRemove(element), duration);
	log(`showToast`, 'end');
}

// --------------------------------------------------------------
// Context Menu
// --------------------------------------------------------------

/**
 * Creates and shows a small menu - can be used for:
 *   * Top app File menus
 *   * Right-click menus
 *   * (Possibly) as a better Options dropdown for forms
 * @param {Array} data - collection of objects representing each row
 * @param {Number} x - X position for the menu
 * @param {Number} y - Y position for the menu
 */
export function showContextMenu(rows = [], x = false, y = false) {
	log(`showContextMenu`, 'start');

	let element = document.getElementById('context-menu');

	// remove any current context menu, or create one if it doesn't exist
	if (element) {
		element.style.display = 'none';
		element.innerHTML = '';
	} else {
		element = makeElement({
			tag: 'dialog',
			id: 'context-menu',
			attributes: { tabindex: '-1' },
		});
		element.style.display = 'none';
		document.body.appendChild(element);
	}

	// Create and add each row
	rows.forEach((item) => {
		log(`item.name: ${item.name}`);
		element.appendChild(makeOneContextMenuRow(item));
	});

	// Move it and show it
	if (isFinite(x) && isFinite(y)) {
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
		element.style.display = 'grid';
		setDialogHideListeners(element);
		element.focus();
	} else {
		console.warn(`Context menu not supplied with a screen position.`);
	}

	log(`showContextMenu`, 'end');
}

function makeOneContextMenuRow(data = {}) {
	let row = makeElement({
		tag: 'div',
		className: data.name === 'hr' ? 'context-menu-hr' : 'context-menu-row',
		attributes: { tabindex: '0' },
	});

	if (data.name === 'hr') {
		row.appendChild(makeElement({ tag: 'hr' }));
		return row;
	}

	// Icon
	if (data.icon) {
		row.appendChild(
			textToNode(
				makeIcon({
					name: data.icon,
					color: accentColors.blue.l55,
					hoverColor: 'blue',
				})
			)
		);
	} else {
		row.appendChild(makeElement({ innerHTML: '[?]' }));
	}

	// Command name
	data.name = data.name || 'NAME';
	row.appendChild(makeElement({ innerHTML: data.name }));

	// Keyboard Shortcut
	if (data.shortcut) {
		let shortcutWrapper = makeElement({ tag: 'div', className: 'shortcut-wrapper' });
		data.shortcut.forEach((key) =>
			shortcutWrapper.appendChild(makeElement({ tag: 'code', innerHTML: key }))
		);
		row.appendChild(shortcutWrapper);
	}

	// Click function
	if (data.onClick) row.addEventListener('click', data.onClick);

	return row;
}

export function setDialogHideListeners(element) {
	element.addEventListener('mouseleave', closeAllDialogs);
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
	close.addEventListener('click', () => {
		animateRemove(element);
	});
	header.appendChild(close);
	let body = makeElement({ className: 'error__body', innerHTML: message });
	addAsChildren(element, [header, body]);

	closeAllDialogs(true);
	document.body.appendChild(element);
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
