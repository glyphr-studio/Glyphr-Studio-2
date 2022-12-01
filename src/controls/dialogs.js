// -----------------------------------------------------------------
// Dialog Box, Error Box, Notation, toasts
// -----------------------------------------------------------------

import { makeElement } from "../common/dom";

/**
 * Closes any type of dialog box that may be open
 */
export function closeDialog() {
	if (!_UI.popOut && document.getElementById('npSave'))
		document.getElementById('npSave').style.backgroundColor = 'transparent';
	document.getElementById('dialog_bg').style.display = 'none';
	document.getElementById('big_dialog_box').style.display = 'none';
	document.getElementById('dialog_box').style.display = 'none';
	document.getElementById('saveFormatFlyout').style.display = 'none';

	document.getElementById('dialogRightContent').innerHTML =
		'<b>Error: unspecified dialog box content.</b>';
	document.getElementById('bigDialogLeftContent').innerHTML =
		'<b>Error: unspecified dialog box content.</b>';

	// document.body.focus();
}

/**
 * Creates and shows a standard dialog box
 * @param {string} content - HTML content of the dialog box
 */
export function openDialog(content) {
	closeDialog();
	document.body.focus();
	const dc = document.getElementById('dialogRightContent');
	dc.innerHTML = content;

	if (dc.style.height > 800) dc.style.height = 800;
	else dc.style.width = 'auto';

	document.getElementById('dialog_box').style.display = 'block';
	document.getElementById('dialog_bg').style.display = 'block';
}

/**
 * Creates and shows a full height dialog box along the left
 * side of the screen
 * @param {string} content - HTML content of the dialog box
 */
export function openBigDialog(content) {
	closeDialog();
	document.body.focus();
	document.getElementById('bigDialogLeftContent').innerHTML = content;
	document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(
		_UI.glyphChooser.dialog
	);

	document.getElementById('big_dialog_box').style.display = 'block';
	document.getElementById('dialog_bg').style.display = 'block';
}

/**
 * Returns true if the big dialog box is open
 * @returns {boolean}
 */
export function isBigDialogOpen() {
	return document.getElementById('big_dialog_box').style.display === 'block';
}

/**
 * Creates and shows a small dialog box at a certain
 * screen x,y position
 * @param {string} content - HTML content of the dialog box
 * @param {number} x - screen x location
 * @param {number} y - screen y location
 */
export function openNotation(content, x, y) {
	document.body.focus();
	const n = document.getElementById('notation');
	n.innerHTML = content;
	n.style.top = round(y) + 'px';
	n.style.left = round(x + 50) + 'px';
	n.style.display = 'block';
}

/**
 * Closes any notation dialog boxes
 */
export function closeNotation() {
	document.getElementById('notation').style.display = 'none';
	document.getElementById('notation').innerHTML = '&#x20E2;';
	document.body.focus();
}

/**
 * Toggles open/closed the small flyout off the save button
 * asking which format to export
 */
export function toggleDialogExportOptions() {
	const sff = document.getElementById('saveFormatFlyout');
	const nps = document.getElementById('npSave');

	if (sff.style.display === 'block') {
		closeDialog();
	} else {
		nps.style.backgroundColor = _UI.colors.blue.l45;
		sff.style.display = 'block';
	}
}

/**
 * Creates (but does not show) a small error message box
 * @returns {string} - HTML content
 */
export function makeErrorMessageBox() {
	const con =
		'<div id="errormessagebox" style="display:none;">' +
		'<table cellpadding=0 cellspacing=0 border=0><tr>' +
		'<td class="errormessageleftbar">' +
		'<button class="errormessageclosebutton" onclick="closeErrorMessageBox();">&times;</button></td>' +
		'<td id="errormessagecontent"></td>' +
		'</tr></table></div>';

	return con;
}

/**
 * Shows the error message box
 * @param {string} msg - HTML content of the dialog box
 */
export function showErrorMessageBox(msg) {
	const msgcon = document.getElementById('errormessagecontent');
	const msgbox = document.getElementById('errormessagebox');
	msgcon.innerHTML = msg;
	msgbox.style.display = 'block';
	console.warn(msg);
}

/**
 * Closes the error message box
 */
export function closeErrorMessageBox() {
	document.getElementById('errormessagecontent').innerHTML = '';
	document.getElementById('errormessagebox').style.display = 'none';
}

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
		innerHTML: (msg || 'Howdy!')
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
