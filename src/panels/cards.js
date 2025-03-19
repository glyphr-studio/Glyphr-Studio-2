import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { round, transformOrigins } from '../common/functions.js';
import { makeTransformOriginIcon } from '../common/graphics.js';

// --------------------------------------------------------------
// Common attributes card stuff
// --------------------------------------------------------------

export function makeInputs_position(
	item,
	labelPrefix = '',
	additionalTopics = [],
	disabled = false
) {
	// log(`makeInputs_position`, 'start');
	// log(`x: ${round(x, 3)}`);
	// log(`y: ${round(y, 3)}`);
	let thisTopic = `current${item.objType}`;
	if (thisTopic === 'currentControlPoint') {
		thisTopic = `currentPathPoint.${item.type}`;
	}
	let topics = [thisTopic].concat(additionalTopics);

	if (labelPrefix) labelPrefix += ':&ensp;';

	// Label + inputs
	let label = makeElement({ tag: 'label', innerHTML: `${labelPrefix}x${dimSplit()}y` });
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let xInput = makeSingleInput(item, 'x', topics, 'input-number');
	let yInput = makeSingleInput(item, 'y', topics, 'input-number');

	if (disabled) {
		xInput.setAttribute('disabled', '');
		yInput.setAttribute('disabled', '');
	}

	// Put double input together
	doubleInput.appendChild(xInput);
	doubleInput.appendChild(dimSplitElement());
	doubleInput.appendChild(yInput);

	// log(`makeInputs_position`, 'end');
	return [label, doubleInput];
}

export function makeInputs_size(item, disabled = false) {
	// log(`makeInputs_size`, 'start');
	let returnControls = [];
	let thisTopic = `current${item.objType}`;

	// Width and Height
	let dimensionLabel = makeSingleLabel(`width${dimSplit()}height`);
	let dimensionInputs = makeElement({ tag: 'div', className: 'doubleInput' });
	let wInput = makeSingleInput(item, 'width', thisTopic, 'input-number');
	let hInput = makeSingleInput(item, 'height', thisTopic, 'input-number');
	if (disabled) {
		wInput.setAttribute('disabled', '');
		hInput.setAttribute('disabled', '');
	}
	dimensionInputs.appendChild(wInput);
	dimensionInputs.appendChild(dimSplitElement());
	dimensionInputs.appendChild(hInput);

	returnControls.push(dimensionLabel);
	returnControls.push(dimensionInputs);

	// Only show this stuff if not disabled.
	if (!disabled) {
		// Transform origin
		let displayOrigins = [
			'top-left',
			'baseline-left',
			'bottom-left',
			'top-right',
			'baseline-right',
			'bottom-right',
			'middle-center',
		];
		displayOrigins = transformOrigins;
		let transformLabel = makeSingleLabel(
			'transform origin',
			`With increases or decreases to width or height,
		the transform origin is the point that stays fixed.
		<br><br>
		This only takes effect when directly entering values
		into the width or height inputs.`
		);
		let transformInput = makeElement({
			tag: 'option-chooser',
			attributes: {
				'selected-id': item.transformOrigin,
				'selected-name': item.transformOrigin.replace('-', ' '),
			},
		});
		displayOrigins.forEach((origin) => {
			let option = makeElement({
				tag: 'option',
				attributes: { 'selection-id': origin },
				innerHTML: `${makeTransformOriginIcon(origin)}${origin.replace('-', ' ')}`,
			});
			option.addEventListener('click', () => {
				item.transformOrigin = origin;
				getCurrentProjectEditor().publish('editCanvasView', item);
			});
			transformInput.appendChild(option);
		});

		// Ratio lock checkbox
		let ratioLockLabel = makeSingleLabel(
			'lock aspect ratio',
			`
			When either the width or height is adjusted,
			the overall size will be kept proportional.
			<br><br>
			Maintaining aspect ratio will override value
			locks if need be.
		`
		);
		let ratioLockCheckbox = makeSingleCheckbox(item, 'ratioLock', thisTopic);

		returnControls.push(transformLabel);
		returnControls.push(transformInput);
		returnControls.push(ratioLockLabel);
		returnControls.push(ratioLockCheckbox);
	}
	// log(`makeInputs_size`, 'end');
	return returnControls;
}

export function makeSingleInput(item, property, thisTopic, tagName, additionalListeners = []) {
	// log(`makeSingleInput`, 'start');
	// log(`item.objType: ${item.objType}`);
	// log(`property: ${property}`);
	// log(`thisTopic: ${thisTopic}`);
	// log(`tagName: ${tagName}`);

	let topics = Array.isArray(thisTopic) ? thisTopic : [thisTopic];

	let newInput = makeElement({
		tag: tagName,
		className: `singleInput-${property}`,
		attributes: { 'pubsub-topic': topics[0] },
	});

	let value = tagName === 'input' ? item[property] : round(item[property], 3);
	newInput.setAttribute('value', value);

	if (item.isLockable) {
		newInput.setAttribute('is-locked', item.isLocked(property));
		newInput.addEventListener('lock', (event) => {
			// log(`makeSingleInput LOCK event`, 'start');
			// log(event);
			// @ts-expect-error 'property does exist'
			if (event.detail.isLocked) {
				item.lock(property);
			} else {
				item.unlock(property);
			}
			const editor = getCurrentProjectEditor();
			topics.forEach((topic) => editor.publish(topic, item));
			// log(`makeSingleInput LOCK event`, 'end');
		});
	}

	function changeHappened(event) {
		// log(`makeSingleInput.changeHappened event`, 'start');
		// log(event);

		if (item.isLockable && item.isLocked(property)) return;
		// let newValue = event.target.getAttribute('value');
		let newValue = event.target.value;
		// log(`\n⮟item⮟`);
		// log(item);
		// log(`property: ${property}`);
		// log(`newValue: ${newValue}`);
		// log(`thisTopic: ${thisTopic}`);

		const editor = getCurrentProjectEditor();
		// Update the view so that the glyph stays put
		// and the LSB moves to the left or right
		if (property === 'leftSideBearing') {
			let view = editor.view;
			editor.view.dx -= (newValue - item.leftSideBearing) * view.dz;
			editor.publish('editCanvasView', item);
		}

		// Special Case Glyph and Path: width and height properties
		if (
			(item.objType === 'Glyph' || item.objType === 'VirtualGlyph' || item.objType === 'Path') &&
			(property === 'width' || property === 'height')
		) {
			// log(`width or height, for constructor Glyph or Path`);
			let options = { width: false, height: false };
			options.ratioLock = item.ratioLock;
			options.transformOrigin = item.transformOrigin;
			if (property === 'width') options.width = newValue;
			if (property === 'height') options.height = newValue;

			// log(`\n⮟options⮟`);
			// log(options);
			if (item.objType === 'Path') item.setShapeSize(options);
			else item.setGlyphSize(options);
		} else {
			item[property] = newValue;
			// log(`MAKE SINGLE INPUT EVENT ${property} set to ${newValue}`);
			// log(`item[property]: ${item[property]}`);
		}

		// log(`topics: ${topics}`);
		if (item.objType === 'VirtualGlyph') {
			topics.forEach((topic) => editor.publish(topic, editor.selectedItem));
		} else if (item.objType === 'VirtualShape') {
			topics.forEach((topic) => editor.publish(topic, editor.selectedItem));
		} else {
			topics.forEach((topic) => editor.publish(topic, item));
		}
		// log(`makeSingleInput.changeHappened event`, 'end');
	}

	newInput.addEventListener('change', changeHappened);
	if (additionalListeners) {
		additionalListeners.forEach((listenerName) => {
			newInput.addEventListener(listenerName, changeHappened);
		});
	}

	getCurrentProjectEditor().subscribe({
		topic: topics,
		subscriberID: `attributesPanel.${topics[0]}.${property}`,
		callback: (changedItem) => {
			// log(`SINGLE INPUT SUBSCRIPTION CALLBACK`, 'start');
			// log(`property: ${property}`);
			// log(`topics[0]: ${topics[0]}`);
			// log(`attributesPanel.${topics[0]}.${property}`);
			// log(changedItem);
			if (changedItem) {
				// log(`changedItem.property: ${changedItem[property]}`);

				if (changedItem[property] || changedItem[property] === 0) {
					// log(`value OLD: ${newInput.value}`);
					let newValue;
					if (tagName === 'input') newValue = changedItem[property];
					else newValue = round(changedItem[property], 3);
					// log(`newValue: ${newValue}`);
					// @ts-expect-error 'property does exist'
					newInput.value = newValue;
					newInput.setAttribute('value', newValue);
					// log(`value NEW: ${newInput.value}`);
				}
			}
			// log(`SINGLE INPUT SUBSCRIPTION CALLBACK`, 'end');
		},
	});

	// log(`makeSingleInput`, 'end');
	return newInput;
}

/**
 * Centralized way to add a listener attribute
 * @param {HTMLElement} element - what to add the listener to
 * @param {Array | String} listenFor - collection of event names to listen for
 * @param {Function} callback - what to do
 */
export function addAttributeListener(element, listenFor = [], callback) {
	listenFor = typeof listenFor === 'string' ? [listenFor] : listenFor;

	const mutationCallback = function () {
		if (callback) callback(element);
	};
	const observer = new MutationObserver(mutationCallback);
	// observer.node = element;
	observer.observe(element, { attributeFilter: listenFor });
	// observer.observe(element, { attributes: true, subtree: true });
}

export function makeSingleCheckbox(item, property, thisTopic) {
	// log(`makeSingleCheckbox`, 'start');
	// log(`item.type: ${item.type}`);
	// log(`property: ${property}`);
	// log(`thisTopic: ${thisTopic}`);

	let newCheckbox = makeElement({
		tag: 'input',
		attributes: {
			type: 'checkbox',
		},
	});
	// @ts-expect-error 'property does exist'
	if (item[property]) newCheckbox.checked = true;

	newCheckbox.addEventListener('change', (event) => {
		// log(`makeSingleCheckbox CHANGE event listener`, 'start');
		// @ts-expect-error 'property does exist'
		let newValue = event.target.checked;
		item[property] = !!newValue;
		if (thisTopic) {
			getCurrentProjectEditor().publish(thisTopic, item);
			if (property === 'use') {
				toggleHandleInputs(item.type, !!newValue);
				item.parent.reconcileHandle(item.type);
			}
		}
		// log(`makeSingleCheckbox CHANGE event listener`, 'end');
	});

	if (thisTopic) {
		getCurrentProjectEditor().subscribe({
			topic: thisTopic,
			subscriberID: `attributesPanel.${thisTopic}.${property}`,
			callback: (changedItem) => {
				// log(`makeSingleCheckbox SUBSCRIBER callback`, 'start');
				if (changedItem[property]) {
					// @ts-expect-error 'property does exist'
					newCheckbox.checked = true;
					if (property === 'use') toggleHandleInputs(item.type, true);
				} else {
					// @ts-expect-error 'property does exist'
					newCheckbox.checked = false;
					if (property === 'use') toggleHandleInputs(item.type, false);
				}
				// log(`makeSingleCheckbox SUBSCRIBER callback`, 'end');
			},
		});
	}

	// log(`makeSingleCheckbox`, 'end');
	return newCheckbox;
}

function toggleHandleInputs(handle, show) {
	// log(`toggleHandleInputs`, 'start');
	// log(`handle: ${handle}`);
	// log(`show: ${show}`);
	let group = document.getElementById(`${handle}InputGroup`);
	// log(group);
	if (group) group.style.display = show ? 'grid' : 'none';
	// log(`toggleHandleInputs`, 'end');
}

/**
 * Creates a label, with options
 * @param {String} text - text to show
 * @param {String | false} infoContent - if a string, show an info bubble with the text
 * @param {String | false} forID - 'for' attribute value
 * @param {String | false} className - 'class' attribute value
 * @returns {HTMLElement}
 */
export function makeSingleLabel(text, infoContent = false, forID = false, className = false) {
	let newText = makeElement({ content: text });
	let newLabel = makeElement({
		tag: 'label',
	});
	if (forID) newLabel.setAttribute('for', forID);
	newLabel.appendChild(newText);
	if (infoContent) {
		let newInfo = makeElement({
			tag: 'info-bubble',
			content: infoContent,
		});
		newLabel.appendChild(newInfo);
		newLabel.classList.add('info');
	}
	if (className) newLabel.setAttribute('class', className);
	return newLabel;
}

export function rowPad() {
	return makeElement({ tag: 'div', className: 'rowPad' });
}

export function dimSplit() {
	return `<span class="dimSplit">&#x2044;</span>`;
}

export function dimSplitElement() {
	return makeElement({
		className: 'dimSplit',
		innerHTML: '&#x2044;',
	});
}

// --------------------------------------------------------------
// 'direct' controls that don't use pub/sub
// --------------------------------------------------------------

export function makeDirectCheckbox(item, property, callback, id = false) {
	let newCheckbox = makeElement({
		tag: 'input',
		attributes: { type: 'checkbox' },
	});
	// @ts-expect-error 'property does exist'
	if (item[property]) newCheckbox.checked = true;
	if (typeof id === 'string') newCheckbox.setAttribute('id', id);

	newCheckbox.addEventListener('change', (event) => {
		// @ts-expect-error 'property does exist'
		let newValue = event.target.checked;
		item[property] = !!newValue;
		if (callback) callback(newValue);
	});

	return newCheckbox;
}

export function makeLinkReferenceRow(itemID) {
	// log(`makeLinkReferenceRow`, 'start');
	// log(`itemID: ${itemID}`);

	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	const targetItem = editor.project.getItem(itemID);
	// log(targetItem);

	let row = makeElement({ className: 'item-link__row', attributes: { 'target-item-id': itemID } });
	row.addEventListener('click', () => {
		if (targetItem.displayType === 'Glyph') editor.nav.page = 'Characters';
		if (targetItem.displayType === 'Component') editor.nav.page = 'Components';
		if (targetItem.displayType === 'Ligature') editor.nav.page = 'Ligatures';
		editor.selectedItemID = itemID;
		editor.navigate();
	});

	row.appendChild(
		makeElement({
			className: 'item-link__thumbnail',
			attributes: { 'target-item-id': itemID },
			innerHTML: project.makeItemThumbnail(targetItem),
		})
	);

	row.appendChild(
		makeElement({
			className: 'item-link__title',
			innerHTML: `${targetItem?.name || 'ERROR'}`,
		})
	);

	row.appendChild(
		makeElement({
			className: 'item-link__subtitle',
			innerHTML: `${targetItem?.displayType || 'ERROR'}&ensp;|&ensp;${itemID}`,
		})
	);

	// log(`makeLinkReferenceRow`, 'end');
	return row;
}
