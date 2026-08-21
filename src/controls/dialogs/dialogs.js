import { applyEditorTheme } from '../../app/glass_theme.js';
import { getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { addAsChildren, getComponentDOM, makeElement, textToNode } from '../../common/dom.js';
import { round } from '../../common/functions.js';
import { makeIcon } from '../../common/graphics.js';
import { sXcX, sYcY } from '../../edit_canvas/edit_canvas.js';
import { closeAllNavMenus } from '../../project_editor/navigator.js';

let modalInstance = 0;

// --------------------------------------------------------------
// Generic dialog stuff
// --------------------------------------------------------------

/**
 * Mounts every global component shell before the UI is used.
 */
export function initializeComponentDOM() {
	const componentDOM = getComponentDOM();
	const shells = [
		['toast', 'div'],
		['error', 'div'],
		['notation', 'div'],
		['context-menu', 'dialog'],
		['bubble', 'div'],
	];
	shells.forEach(([id, tag]) => {
		let shell = document.getElementById(id);
		if (!shell) shell = makeElement({ id, tag });
		componentDOM.appendChild(shell);
		hideMountedComponent(shell);
	});

	let modal = document.querySelector('.modal-dialog');
	if (!modal) modal = makeModalDialog(makeElement());
	componentDOM.appendChild(modal);
	hideMountedComponent(modal);

	['modal', 'dropdowns', 'editor', 'tooltips', 'help', 'menus', 'notifications'].forEach((name) => {
		if (componentDOM.querySelector(`[data-component="${name}"]`)) return;
		const slot = makeElement({
			className: `app-component app-component--${name}`,
			attributes: { 'data-component': name },
		});
		componentDOM.appendChild(slot);
		hideMountedComponent(slot);
	});
}

/**
 * Closes all dialogs
 */
export function closeEveryTypeOfDialog() {
	// log(`closeEveryTypeOfDialog`, 'start');
	closeAllNavMenus();
	closeAllModalDialogs();
	closeAllGlassModals();
	closeAllOptionChoosers();
	closeAllGlassDropdowns();
	closeAllErrors();
	closeAllToasts();
	closeAllNotations();
	closeAllInfoBubbles();
	// log(`closeEveryTypeOfDialog`, 'end');
}

/**
 * Closes all Modal Dialog style dialogs
 */
export function closeAllModalDialogs() {
	// log(`closeAllModalDialogs`, 'start');
	animateRemoveAll('dialog');
	// log(`closeAllModalDialogs`, 'end');
}

/**
 * Closes all glass-dropdown flyouts (see makeGlassDropdown below).
 */
export function closeAllGlassDropdowns() {
	document
		.querySelectorAll('.glass-dropdown-menu')
		.forEach((menu) => hideMountedComponent(/** @type {HTMLElement} */ (menu)));
	document
		.querySelectorAll('.glass-dropdown[aria-expanded="true"]')
		.forEach((control) => control.setAttribute('aria-expanded', 'false'));
}

/**
 * A themed dropdown trigger + flyout menu - same visual language and
 * interaction model as the language / theme dropdowns on the Open Project
 * page (`makeCustomDropdown` in app/open_project.js), but built on the
 * general `liquid-glass` tokens so it also works inside the project editor.
 * Returns a plain {element, value, setValue} object, meant for dropping
 * into forms and modals built with makeElement() - unlike <option-chooser>,
 * it isn't a custom element.
 * @param {{options: Array<{value: string, label: string}>, value: string, label: string, name?: string, onChange?: (value: string) => void}} config
 * @returns {{element: HTMLElement, value: string, setValue: Function}}
 */
export function makeGlassDropdown({ options, value, label, name = '', onChange = () => {} }) {
	const wrapper = makeElement({ className: 'glass-dropdown' });
	wrapper.setAttribute('aria-expanded', 'false');
	const button = /** @type {HTMLButtonElement} */ (
		makeElement({ tag: 'button', className: 'glass-dropdown__trigger' })
	);
	button.type = 'button';
	button.setAttribute('aria-label', label);
	button.innerHTML = `<span></span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><polygon points="14.5 8.5 5.5 8.5 10 13 14.5 8.5"/></svg>`;
	const hiddenInput = /** @type {HTMLInputElement} */ (makeElement({ tag: 'input' }));
	hiddenInput.type = 'hidden';
	if (name) hiddenInput.name = name;
	let selectedValue = value;

	function updateSelection(nextValue, notify = true) {
		const option = options.find((candidate) => candidate.value === nextValue) || options[0];
		selectedValue = option?.value;
		hiddenInput.value = selectedValue || '';
		button.querySelector('span').textContent = option?.label || '';
		if (notify) onChange(selectedValue);
	}

	const menu = makeElement({ className: 'glass-dropdown-menu liquid-glass' });
	menu.setAttribute('role', 'listbox');
	options.forEach((option) => {
		const optionButton = makeElement({ tag: 'button', content: option.label });
		optionButton.setAttribute('type', 'button');
		optionButton.setAttribute('role', 'option');
		optionButton.addEventListener('click', (optionEvent) => {
			optionEvent.stopPropagation();
			updateSelection(option.value);
			closeAllGlassDropdowns();
		});
		menu.appendChild(optionButton);
	});
	getComponentDOM().appendChild(menu);
	hideMountedComponent(menu);

	button.addEventListener('click', (event) => {
		event.stopPropagation();
		const wasOpen = wrapper.getAttribute('aria-expanded') === 'true';
		closeAllGlassDropdowns();
		if (wasOpen) return;
		wrapper.setAttribute('aria-expanded', 'true');
		menu.querySelectorAll('[role="option"]').forEach((optionButton, index) => {
			optionButton.setAttribute('aria-selected', String(options[index].value === selectedValue));
		});
		showMountedComponent(menu, 'grid');
		const rect = button.getBoundingClientRect();
		const menuWidth = Math.max(rect.width, 190);
		menu.style.width = `${menuWidth}px`;
		menu.style.left = `${Math.min(rect.left, window.innerWidth - menuWidth - 12)}px`;
		menu.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - menu.offsetHeight - 12)}px`;
		window.setTimeout(
			() => document.addEventListener('click', closeAllGlassDropdowns, { once: true }),
			0
		);
	});

	wrapper.append(button, hiddenInput);
	updateSelection(value, false);
	return {
		element: wrapper,
		get value() {
			return selectedValue;
		},
		setValue(nextValue) {
			updateSelection(nextValue, false);
		},
	};
}

/**
 * Closes all Option Chooser style dialogs
 */
export function closeAllOptionChoosers() {
	// log(`closeAllOptionChoosers`, 'start');
	closeAllContextMenus();
	let elements = document.querySelectorAll('option-chooser');
	elements.forEach((elem) => elem.removeAttribute('deployed'));
	const editor = getCurrentProjectEditor();
	if (editor.popOutWindow) {
		// @ts-expect-error 'property does exist'
		elements = editor.popOutWindow.document.querySelectorAll('option-chooser');
		elements.forEach((elem) => elem.removeAttribute('deployed'));
	}
	// log(`closeAllOptionChoosers`, 'end');
}

/**
 * Closes all Context Menu style dialogs
 */
export function closeAllContextMenus() {
	// log(`closeAllContextMenus`, 'start');
	animateRemoveAll('#context-menu');
	// log(`closeAllContextMenus`, 'end');
}

/**
 * Closes all Toast style dialogs
 */
export function closeAllToasts() {
	// log(`closeAllToasts`, 'start');
	animateRemoveAll('#toast');
	// log(`closeAllToasts`, 'end');
}

/**
 * Closes all Error style dialogs
 */
export function closeAllErrors() {
	// log(`closeAllErrors`, 'start');
	animateRemoveAll('#error');
	// log(`closeAllErrors`, 'end');
}

/**
 * Closes all Info Bubble style dialogs
 */
export function closeAllInfoBubbles() {
	// log(`closeAllInfoBubbles`, 'start');
	let bubbles = document.querySelectorAll('#bubble');
	bubbles.forEach((/** @type {HTMLElement} */ elem) => {
		if (elem.hidden) return;
		elem.querySelector('.content')?.dispatchEvent(new Event('mouseleave'));
		elem.blur();
	});
	const editor = getCurrentProjectEditor();
	if (editor.popOutWindow) {
		// @ts-expect-error 'property does exist'
		bubbles = editor.popOutWindow.document.querySelectorAll('#bubble');
		bubbles.forEach((/** @type {HTMLElement} */ elem) => {
			if (elem.hidden) return;
			elem.querySelector('.content')?.dispatchEvent(new Event('mouseleave'));
			elem.blur();
		});
	}
	// log(`closeAllInfoBubbles`, 'end');
}

/**
 * Closes all Notation style dialogs
 */
export function closeAllNotations() {
	animateRemoveAll('#notation');
}

/**
 * Query the current document for all types of elements,
 * then remove them with an animated fade out
 * @param {String} query - querySelector argument
 */
export function animateRemoveAll(query = '') {
	/** @type {NodeListOf<HTMLElement>} */
	let elements = document.querySelectorAll(query);
	elements.forEach((elem) => animateRemove(elem));
	const editor = getCurrentProjectEditor();
	if (editor.popOutWindow) {
		// @ts-expect-error 'property does exist'
		elements = editor.popOutWindow.document.querySelectorAll(query);
		elements.forEach((elem) => animateRemove(elem));
	}
}

/**
 * Handle the animation and removal of one element
 * @param {HTMLElement} element - what element to remove
 * @param {Number =} animationLength - how long in milliseconds
 * @param {Number =} scale - how much to shrink
 * @param {String =} translateY - CSS value for how much to move vertically
 */
export function animateRemove(element, animationLength = 120, scale = 0.98, translateY = '-5px') {
	if (!element) return;
	const hideVersion = Number(element.dataset.hideVersion || 0) + 1;
	element.dataset.hideVersion = `${hideVersion}`;
	element.animate?.(
		{ opacity: 0, transform: `scale(${scale}) translateY(${translateY})` },
		{ duration: animationLength }
	);
	// This works for the main window, or the pop-out window
	element.ownerDocument.defaultView.setTimeout(() => {
		if (Number(element.dataset.hideVersion) !== hideVersion) return;
		element.style.display = 'none';
		element.hidden = true;
		element.inert = true;
		element.setAttribute('aria-hidden', 'true');
	}, animationLength - 10);
}

/**
 * Reveals a component that remains mounted while it is closed.
 * @param {HTMLElement} element - component to reveal
 * @param {String} display - display mode used while visible
 */
export function showMountedComponent(element, display = 'block') {
	element.dataset.hideVersion = `${Number(element.dataset.hideVersion || 0) + 1}`;
	element.hidden = false;
	element.inert = false;
	element.removeAttribute('aria-hidden');
	element.style.display = display;
}

/**
 * Hides a component without detaching it from its component DOM.
 * @param {HTMLElement} element - component to hide
 */
export function hideMountedComponent(element) {
	if (!element) return;
	element.dataset.hideVersion = `${Number(element.dataset.hideVersion || 0) + 1}`;
	element.style.display = 'none';
	element.hidden = true;
	element.inert = true;
	element.setAttribute('aria-hidden', 'true');
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
export function showToast(message = '0_o', duration = 3000, fancy = false) {
	// log(`showToast`, 'start');
	// log(`message: ${message}`);
	// log(`duration: ${duration}`);scaleItems
	/** @type {HTMLElement} */
	let element = document.querySelector('#toast');

	// remove any current context menu, or create one if it doesn't exist
	if (element) {
		// log(`Element detected!!!!!`);
		// animateRemove(element);
		// element.style.display = 'none';
		// element.innerHTML = '';
	} else {
		element = makeElement({
			tag: 'div',
			id: 'toast',
			attributes: { tabindex: '-1' },
			style: 'display: none;',
		});
		if (fancy) element.setAttribute('fancy', '');
		getComponentDOM().appendChild(element);
	}

	element.innerHTML = message;
	element.toggleAttribute('fancy', fancy);
	showMountedComponent(element);
	window.setTimeout(() => {
		// log(`showToast - timeout animateRemove`);
		animateRemove(element);
	}, duration);
	// log(`showToast`, 'end');
}

// --------------------------------------------------------------
// Notation
// --------------------------------------------------------------

/**
 * Show a small dialog note
 * @param {String} content - HTML content to show in the note
 * @param {Number} x - screen x location
 * @param {Number} y - screen y location
 */
export function showNotation(content, x, y) {
	// document.body.focus();
	/** @type {HTMLElement} */
	let notation = document.querySelector('#notation');
	if (!notation) {
		notation = makeElement({
			id: 'notation',
			attributes: { tabindex: '-1' },
			style: 'display: none;',
		});
		getComponentDOM().appendChild(notation);
	}
	notation.innerHTML = content;
	notation.style.top = y - 10 + 'px';
	notation.style.right = `calc(100% - ${x + 515}px)`;
	showMountedComponent(notation);
}

/**
 * Shows a special case notation for the Path Add Point tool
 * @param {Object} emPoint - x/y point for where to show it
 */
export function makeAndShowPathAddPointNotation(emPoint) {
	let x = round(emPoint.x, 3);
	let y = round(emPoint.y, 3);
	let splitX = ('' + x).split('.');
	let preX = splitX[0] || '0';
	let postX = splitX[1] || '';
	let splitY = ('' + y).split('.');
	let preY = splitY[0] || '0';
	let postY = splitY[1] || '';

	let content = `
	<div class="notation__path-add-point">
		<label>x</label>
		<span style="text-align: right;">${preX}</span>
		<span>${postX.length ? '.' : ''}${postX}</span>
		<label>y</label>
		<span style="text-align: right;">${preY}</span>
		<span>${postY.length ? '.' : ''}${postY}</span>
	</div>`;
	showNotation(content, sXcX(emPoint.x), sYcY(emPoint.y));
}

// --------------------------------------------------------------
// Context Menu
// --------------------------------------------------------------

/**
 * Creates a small menu - can be used for:
 *   * Top app File menus
 *   * Right-click menus
 *   * Drop-down menus
 * @param {Array} rows - collection of objects representing each row
 * @param {Number} x - X position for the menu
 * @param {Number} y - Y position for the menu
 * @param {Number =} width - width for the menu (defaults to auto-width)
 * @param {Number =} height - height for the menu (defaults to auto-width)
 * @param {Boolean =} isDropdown - triggers slight style adjustments for dropdown control
 * @returns {HTMLElement}
 */
export function makeContextMenu(rows = [], x, y, width, height, isDropdown = false) {
	// log(`makeContextMenu`, 'start');
	// log(`x: ${x}`);
	// log(`y: ${y}`);
	// log(`width: ${width}`);
	// log(`isDropdown: ${isDropdown}`);

	const className = isDropdown ? 'context-menu__dropdown' : 'context-menu__top-menu';
	let element = document.querySelector('#context-menu');
	if (!element) {
		element = makeElement({
			tag: 'dialog',
			id: 'context-menu',
			attributes: { tabindex: '-1' },
		});
	}
	element.className = className;
	element.replaceChildren();
	element.removeAttribute('style');

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
		showMountedComponent(element, 'grid');
		if (isDropdown) {
			element.style.borderRadius = '0px 0px 12px 12px';
			element.style.borderTopWidth = '0px';
		} else {
			element.style.borderRadius = '0px 12px 12px 12px';
			element.style.borderTopWidth = '1px';
		}
		if (width) {
			element.style.width = `${width}px`;
		}
		if (height) {
			if (isDropdown) element.style.maxHeight = `${height}px`;
			else element.style.height = `${height}px`;
		}
		element.focus();
	} else {
		console.warn(`Context menu not supplied with a screen position.`);
	}

	// log(`makeContextMenu`, 'end');
	return element;
}

/**
 * Make one row for a context menu, based on options
 * @param {Object} data - options for this row
 * @returns {Element}
 */
function makeOneContextMenuRow(data = {}) {
	// log(`makeOneContextMenuRow`, 'start');
	// log(data);
	let isDisabled = data.disabled || false;

	let row = makeElement({
		tag: 'div',
		className: data?.className || 'context-menu-row',
		attributes: { tabindex: '0' },
	});
	if (isDisabled) row.setAttribute('disabled', '');

	if (data.child) {
		row.appendChild(data.child);
		if (!isDisabled) {
			row.addEventListener('click', () => {
				closeAllOptionChoosers();
				if (data.onClick) data.onClick();
			});
		}
		return row;
	}

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
					color: accentColors.royal.l55,
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
	let element = document.querySelector('#error');
	if (!element) element = makeElement({ tag: 'div', id: 'error' });
	element.replaceChildren();
	let header = makeElement({ className: 'error__header', innerHTML: '<h3>Error</h3>' });
	let close = makeElement({ tag: 'button', innerHTML: '&times;' });
	close.addEventListener('click', closeEveryTypeOfDialog);
	header.appendChild(close);
	let body = makeElement({ className: 'error__body', innerHTML: message });
	addAsChildren(element, [header, body]);

	closeEveryTypeOfDialog();
	getComponentDOM().appendChild(element);
	showMountedComponent(element, 'grid');
}

// --------------------------------------------------------------
// Glass modal
// --------------------------------------------------------------

/**
 * Closes any open glass modal layers.
 */
export function closeAllGlassModals() {
	document
		.querySelectorAll('.glass-modal-layer')
		.forEach((/** @type {HTMLElement} */ layer) => hideMountedComponent(layer));
}

/**
 * Makes a pill-shaped button in the liquid-glass style.
 * @param {String} label - button text
 * @param {Function =} onClick - click handler
 * @param {Boolean =} primary - use the filled accent treatment
 * @returns {HTMLElement}
 */
export function makeGlassButton(label, onClick, primary = false) {
	const button = /** @type {HTMLElement} */ (
		makeElement({
			tag: 'button',
			className: `glass-button${primary ? ' glass-button--primary' : ''}`,
			innerHTML: label,
		})
	);
	button.setAttribute('type', 'button');
	if (onClick) button.addEventListener('click', onClick);
	return button;
}

/**
 * Shows a modal in the liquid-glass style. This is the generalized
 * version of the Open Project page's modal layer, usable from anywhere.
 * @param {Object} options - modal configuration
 * @param {String =} options.title - heading text
 * @param {String =} options.description - sub-heading text
 * @param {Element | Array =} options.bodyNode - main content
 * @param {Array =} options.tabs - [{label, content}] where content is a Node or a function returning one
 * @param {Array =} options.actions - array of buttons/elements for the footer
 * @param {Number =} options.maxWidth - max width in pixels
 * @param {String =} options.componentName - semantic identity for this modal instance
 * @param {String =} options.closeLabel - accessible label for the close button
 * @returns {HTMLElement} - the modal layer
 */
export function showGlassModal({
	title = '',
	description = '',
	bodyNode = false,
	tabs = [],
	actions = [],
	maxWidth = 560,
	componentName = 'glass-modal',
	closeLabel = 'Close',
} = {}) {
	modalInstance += 1;
	const layer = /** @type {HTMLElement} */ (makeElement({ className: 'glass-modal-layer' }));
	layer.id = `glass-modal-${modalInstance}`;
	layer.dataset.component = componentName;
	layer.dataset.modalInstance = `${modalInstance}`;
	layer.style.zIndex = `${1000 + modalInstance}`;
	getComponentDOM().appendChild(layer);
	applyEditorTheme(layer);

	const modal = /** @type {HTMLElement} */ (
		makeElement({ tag: 'section', className: 'glass-modal liquid-glass' })
	);
	modal.setAttribute('role', 'dialog');
	modal.setAttribute('aria-modal', 'true');
	modal.style.maxWidth = `${maxWidth}px`;

	const close = /** @type {HTMLElement} */ (
		makeElement({
			tag: 'button',
			className: 'glass-modal__close',
			innerHTML:
				'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>',
		})
	);
	close.setAttribute('type', 'button');
	close.setAttribute('aria-label', closeLabel);
	close.setAttribute('title', closeLabel);
	close.addEventListener('click', () => hideMountedComponent(layer));
	modal.appendChild(close);

	if (title || description) {
		const heading = makeElement({ className: 'glass-modal__heading' });
		if (title) heading.appendChild(makeElement({ tag: 'h2', innerHTML: title }));
		if (description) heading.appendChild(makeElement({ tag: 'p', innerHTML: description }));
		modal.appendChild(heading);
	}

	if (tabs.length) {
		const tabBar = makeElement({ className: 'glass-modal__tabs' });
		tabBar.setAttribute('role', 'tablist');
		const tabBody = makeElement({ className: 'glass-modal__tab-body' });

		const showTab = (index) => {
			tabBar.querySelectorAll('button').forEach((button, buttonIndex) => {
				button.setAttribute('aria-selected', String(buttonIndex === index));
			});
			tabBody.replaceChildren();
			const content = tabs[index].content;
			addAsChildren(tabBody, typeof content === 'function' ? content() : content);
		};

		tabs.forEach((tab, index) => {
			const tabButton = makeElement({ tag: 'button', innerHTML: tab.label });
			tabButton.setAttribute('type', 'button');
			tabButton.setAttribute('role', 'tab');
			tabButton.addEventListener('click', () => showTab(index));
			tabBar.appendChild(tabButton);
		});

		modal.append(tabBar, tabBody);
		showTab(0);
	}

	if (bodyNode) addAsChildren(modal, bodyNode);

	if (actions.length) {
		const actionArea = makeElement({ className: 'glass-modal__actions' });
		addAsChildren(actionArea, actions);
		modal.appendChild(actionArea);
	}

	layer.appendChild(modal);
	layer.addEventListener('click', (event) => {
		if (event.target === layer) hideMountedComponent(layer);
	});

	showMountedComponent(layer, 'flex');
	modal.animate?.(
		[
			{ opacity: 0, transform: 'translateY(16px) scale(.98)' },
			{ opacity: 1, transform: 'none' },
		],
		{ duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }
	);

	return layer;
}

/**
 * Shows a two-button confirmation in the liquid-glass style.
 * @param {Object} options - dialog configuration
 * @param {String} options.title - heading text
 * @param {String} options.message - body text
 * @param {String =} options.confirmLabel - text for the confirm button
 * @param {String =} options.cancelLabel - text for the cancel button
 * @param {Function} options.onConfirm - called when the user confirms
 * @returns {HTMLElement}
 */
export function showGlassConfirm({
	title = 'Are you sure?',
	message = '',
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	onConfirm = () => {},
}) {
	const layer = showGlassModal({
		title: title,
		description: message,
		componentName: 'glass-confirm',
		maxWidth: 460,
		actions: [
			makeGlassButton(cancelLabel, () => hideMountedComponent(layer)),
			makeGlassButton(
				confirmLabel,
				() => {
					hideMountedComponent(layer);
					onConfirm();
				},
				true
			),
		],
	});
	return layer;
}

// --------------------------------------------------------------
// Modal dialog
// --------------------------------------------------------------

/**
 * Shows a big dialog that blurs the UI behind it.
 * @param {Element} contentNode - HTML to show in the dialog
 * @param {Number =} maxWidth - limit the dialog width
 * @param {Boolean =} noPadding - turn on or off padding
 */
export function showModalDialog(contentNode, maxWidth, noPadding) {
	let modal = makeModalDialog(contentNode, maxWidth, noPadding);
	getComponentDOM().appendChild(modal);
	applyEditorTheme(modal);
	showMountedComponent(modal, 'flex');
}

/**
 * Makes a modal dialog and returns it
 * @param {Element} contentNode - Main content area for the dialog
 * @param {Number =} maxWidth - limit the width of the dialog
 * @param {Boolean} openProjectDialog - is this the Open Project dialog?
 * @returns {Element}
 */
export function makeModalDialog(contentNode, maxWidth, openProjectDialog = false) {
	// log(`makeModalDialog`, 'start');
	// log(`\n⮟contentNode⮟`);
	// log(contentNode);
	// log(`maxWidth: ${maxWidth}`);
	modalInstance += 1;
	let modal = makeElement({
		tag: 'dialog',
		id: `modal-dialog-${modalInstance}`,
		className: 'modal-dialog',
		innerHTML: `
		<div class="modal-dialog__content">
			<div class="modal-dialog__header">
				<span></span>
				<button class="modal-dialog__close-button" aria-label="Close" title="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>
			</div>
			<div class="modal-dialog__body"></div>
		</div>
		`,
	});
	modal.style.zIndex = `${1000 + modalInstance}`;
	modal.setAttribute('aria-modal', 'true');

	modal
		.querySelector('.modal-dialog__close-button')
		.addEventListener('click', () => hideMountedComponent(modal));
	modal.addEventListener('click', (event) => {
		if (event.target === modal) hideMountedComponent(modal);
	});

	const contentArea = modal.querySelector('.modal-dialog__content');
	contentArea.classList.toggle('modal-dialog__open-new-project', openProjectDialog);
	contentArea.style.removeProperty('max-width');
	modal.querySelector('.modal-dialog__body').replaceChildren();

	if (openProjectDialog) {
		contentArea.classList.add('modal-dialog__open-new-project');
	}

	addAsChildren(modal.querySelector('.modal-dialog__body'), contentNode);
	if (maxWidth) {
		/** @type {HTMLElement} */
		const content = modal.querySelector('.modal-dialog__content');
		content.style.maxWidth = `${maxWidth}px`;
	}

	// log(`\n⮟modal⮟`);
	// log(modal);
	// log(`makeModalDialog`, 'end');
	return modal;
}
