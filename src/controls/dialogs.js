import { accentColors, uiColors } from '../common/colors.js';
import { makeElement, textToNode } from '../common/dom.js';
import { makeIcon } from '../common/graphics.js';

// -----------------------------------------------------------------
// Toast
// -----------------------------------------------------------------

/**
 * Creates and shows a little message at the top/center
 * of the screen, which disappears after a set time
 * @param {string} msg - message to show
 * @param {number} dur - how long to show the message (milliseconds)
 * @param {function} fn - function to call after message is shown
 */
export function showToast(msg, dur, fn) {
	log('showToast', 'start');
	let toastTimeout = false;
	let step = -1;
	const stepMax = 20;
	const stepTime = 10;
	const divisor = 5;
	const duration = dur || 3000;
	const messageContainer = makeElement({
		tag: 'dialog',
		id: 'toast',
		innerHTML: msg || 'Howdy!',
	});
	document.body.appendChild(messageContainer);

	log('Typeof fn: ' + typeof fn);

	if (fn && typeof fn === 'function') {
		log('CALLING FUNCTION NOW');
		setTimeout(fn, 100);
	}

	if (toastTimeout) {
		messageContainer.innerHTML = msg;
		appearFinish();
		return;
	}

	let currentTop = -50;
	const finalTop = 5;
	let currentOpacity = 0;
	const finalOpacity = 1;

	/** start to disappear */
	function appearFinish() {
		log('appearFinish');
		currentTop = finalTop;
		currentOpacity = finalOpacity;
		step = stepMax;

		messageContainer.style.marginTop = finalTop + 'px';
		messageContainer.style.opacity = finalOpacity;

		setToastTimeout(disappearStep, duration);
	}

	/** animate appearance */
	function appearStep() {
		log('appearStep ' + step);

		if (step < 0) {
			messageContainer.style.display = 'block';
			messageContainer.style.marginTop = '-50px;';
			messageContainer.style.opacity = '0.0';
			// messageContainer.style.borderBottomWidth = '0px';

			step++;

			setToastTimeout(appearStep, stepTime);
		} else if (step < stepMax) {
			step++;
			currentTop = currentTop + (finalTop - currentTop) / divisor;
			currentOpacity = currentOpacity + (finalOpacity - currentOpacity) / divisor;

			messageContainer.style.marginTop = currentTop + 'px';
			messageContainer.style.opacity = currentOpacity;

			setToastTimeout(appearStep, stepTime);
		} else {
			appearFinish();
		}
	}

	/** animate disappearance */
	function disappearStep() {
		log('appearStep ' + step);
		if (step < 0) {
			messageContainer.style.display = 'none';
			messageContainer.style.marginTop = '-50px;';
			messageContainer.style.opacity = '0.0';
			messageContainer.innerHTML = '0_o';
			if (toastTimeout) {
				clearTimeout(toastTimeout);
				toastTimeout = false;
			}
		} else {
			step--;
			currentTop = currentTop - currentTop / divisor;
			currentOpacity = currentOpacity - currentOpacity / divisor;

			messageContainer.style.marginTop = currentTop + 'px';
			messageContainer.style.opacity = currentOpacity;

			setToastTimeout(disappearStep, stepTime);
		}
	}

	/**
	 * Common function for appear and disappear to
	 * call while looping through animations.
	 * @param {function} fn - function to call
	 * @param {number} dur - duration (milliseconds)
	 */
	function setToastTimeout(fn, dur) {
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(fn, dur);
	}

	setToastTimeout(appearStep, 1);
	log('showToast', 'end');
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
}

function makeOneContextMenuRow(data = {}) {
	let row = makeElement({
		tag: 'div',
		className: 'context-menu-row',
		attributes: { tabindex: '0' },
	});

	let size = 30;
	if (data.icon.indexOf('page_') === 0) size = 50;

	// Icon
	if (data.icon) {
		row.appendChild(
			textToNode(
				makeIcon({
					name: data.icon,
					size: size,
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

	// Click function
	if (data.onClick) row.addEventListener('click', data.onClick);

	return row;
}

export function setDialogHideListeners(element) {
	element.addEventListener('mouseleave', closeAllDialogs);
}

// --------------------------------------------------------------
// Error Message Box
// --------------------------------------------------------------
/**
 * Creates (but does not show) a small error message box
 * @returns {string} - HTML content
 */
export function makeErrorMessageBox() {
	let element = makeElement({ tag: 'dialog', id: 'errorMessageBox' });
	element.innerHTML = `
		<table border=0><tr>
		<td class="errorMessageLeftBar">
		<button class="errorMessageCloseButton" onclick="closeErrorMessageBox();">&times;</button></td>
		<td id="errorMessageContent"></td>
		</tr></table>
	`;

	return element;
}

/**
 * Shows the error message box
 * @param {string} msg - HTML content of the dialog box
 */
export function showErrorMessageBox(msg) {
	const content = document.getElementById('errorMessageContent');
	const element = document.getElementById('errorMessageBox');
	content.innerHTML = msg;
	element.style.display = 'block';
	console.warn(msg);
}

/**
 * Closes the error message box
 */
export function closeErrorMessageBox() {
	document.getElementById('errorMessageContent').innerHTML = '';
	document.getElementById('errorMessageBox').style.display = 'none';
}

// --------------------------------------------------------------
// OLD STUFF
// --------------------------------------------------------------

// /**
//  * Closes any type of dialog box that may be open
//  */
// export function closeDialog() {
// 	if (!_UI.popOut && document.getElementById('npSave'))
// 		document.getElementById('npSave').style.backgroundColor = 'transparent';
// 	document.getElementById('dialog_bg').style.display = 'none';
// 	document.getElementById('big_dialog_box').style.display = 'none';
// 	document.getElementById('dialog_box').style.display = 'none';
// 	document.getElementById('saveFormatFlyout').style.display = 'none';

// 	document.getElementById('dialogRightContent').innerHTML =
// 		'<b>Error: unspecified dialog box content.</b>';
// 	document.getElementById('bigDialogLeftContent').innerHTML =
// 		'<b>Error: unspecified dialog box content.</b>';

// 	// document.body.focus();
// }

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
