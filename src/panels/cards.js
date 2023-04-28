import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { round } from '../common/functions.js';

// --------------------------------------------------------------
// Common attributes stuff
// --------------------------------------------------------------

export function makeInputs_position(workItem, labelPrefix = '') {
	// TODO transform origin
	// log(`makeInputs_position`, 'start');
	// log(`x: ${round(x, 3)}`);
	// log(`y: ${round(y, 3)}`);
	let thisTopic = `current${workItem.objType}`;
	if (workItem.type) thisTopic += `.${workItem.type}`;

	if (labelPrefix) labelPrefix += ':&ensp;';
	// Label + inputs
	let label = makeElement({ tag: 'label', innerHTML: `${labelPrefix}x${dimSplit()}y` });
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let xInput = makeSingleInput(workItem, 'x', thisTopic, 'input-number');
	let yInput = makeSingleInput(workItem, 'y', thisTopic, 'input-number');

	// Put double input together
	doubleInput.appendChild(xInput);
	doubleInput.appendChild(dimSplitElement());
	doubleInput.appendChild(yInput);

	// log(`makeInputs_position`, 'end');
	return [label, doubleInput];
}

export function makeInputs_size(workItem) {
	// TODO transform origin
	// log(`makeInputs_size`, 'start');
	let thisTopic = `current${workItem.objType}`;

	// Label + Inputs
	let inputLabel = makeElement({ tag: 'label', innerHTML: `width${dimSplit()}height` });
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let wInput = makeSingleInput(workItem, 'width', thisTopic, 'input-number');
	let hInput = makeSingleInput(workItem, 'height', thisTopic, 'input-number');

	// Put double input together
	doubleInput.appendChild(wInput);
	doubleInput.appendChild(dimSplitElement());
	doubleInput.appendChild(hInput);

	// Ratio lock checkbox
	let ratioLockLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
		<span>lock aspect ratio</span>
		<info-bubble>
			When either the width or height is adjusted,
			the overall size will be kept proportional.
			<br><br>
			Maintaining aspect ratio will override value
			locks if need be.
		</info-bubble>
		`,
	});

	let ratioLockCheckbox = makeSingleCheckbox(workItem, 'ratioLock', thisTopic);

	// log(`makeInputs_size`, 'end');
	return [inputLabel, doubleInput, ratioLockLabel, ratioLockCheckbox];
}

export function makeSingleInput(workItem, property, thisTopic, tagName) {
	// log(`makeSingleInput`, 'start');
	// log(`workItem.objType: ${workItem.objType}`);
	// log(`property: ${property}`);
	// log(`thisTopic: ${thisTopic}`);
	// log(`tagName: ${tagName}`);

	let newInput = makeElement({ tag: tagName, className: `singleInput-${property}` });
	let value = tagName === 'input' ? workItem[property] : round(workItem[property], 3);
	newInput.setAttribute('value', value);

	if (workItem.isLockable) {
		newInput.setAttribute('is-locked', workItem.isLocked(property));
		newInput.addEventListener('lock', (event) => {
			// log(`makeSingleInput LOCK event`, 'start');
			// log(event);
			if (event.detail.isLocked) {
				workItem.lock(property);
			} else {
				workItem.unlock(property);
			}
			const editor = getCurrentProjectEditor();
			editor.publish(thisTopic, workItem);
			// log(`makeSingleInput LOCK event`, 'end');
		});
	}

	newInput.addEventListener('change', (event) => {
		// log(`makeSingleInput CHANGE event`, 'start');
		// log(event);

		if (workItem.isLocked(property)) return;
		// let newValue = event.target.getAttribute('value');
		let newValue = event.target.value;
		// log(`property: ${property}`);
		// log(`newValue: ${newValue}`);

		const editor = getCurrentProjectEditor();
		// Update the view so that the glyph stays put
		// and the LSB moves to the left or right
		if (property === 'leftSideBearing') {
			let view = editor.view;
			editor.view.dx -= (newValue - workItem.leftSideBearing) * view.dz;
			editor.publish('view', workItem);
		}

		// Code Smell
		if (
			workItem.constructor.name === 'Glyph' &&
			(property === 'width' || property === 'height') &&
			workItem.ratioLock
		) {
			if (property === 'width') workItem.setGlyphSize(newValue, false, true);
			if (property === 'height') workItem.setGlyphSize(false, newValue, true);
		} else if (
			workItem.objType === 'Path' &&
			(property === 'width' || property === 'height') &&
			workItem.ratioLock
		) {
			if (property === 'width') workItem.setShapeSize(newValue, false, true);
			if (property === 'height') workItem.setShapeSize(false, newValue, true);
		} else {
			// log(`MAKE SINGLE INPUT CHANGE EVENT ${property} is set to ${newValue}`);
			workItem[property] = newValue;
			// log(`workItem[property]: ${workItem[property]}`);
		}

		editor.publish(thisTopic, workItem);
		// log(`makeSingleInput CHANGE event`, 'end');
	});

	getCurrentProjectEditor().subscribe({
		topic: thisTopic,
		subscriberID: `attributesPanel.${thisTopic}.${property}`,
		callback: (changedItem) => {
			// log(`SINGLE INPUT SUBSCRIPTION CALLBACK`, 'start');
			// log(`attributesPanel.${thisTopic}.${property}`);
			// log(changedItem);
			// log(`property: ${property}`);
			// log(`changedItem.property: ${changedItem[property]}`);

			if (changedItem[property] || changedItem[property] === 0) {
				// log(`value OLD: ${newInput.value}`);
				let newValue;
				if (tagName === 'input') newValue = changedItem[property];
				else newValue = round(changedItem[property], 3);
				newInput.value = newValue;
				newInput.setAttribute('value', newValue);
				// log(`value NEW: ${newInput.value}`);
			}
			// log(`SINGLE INPUT SUBSCRIPTION CALLBACK`, 'end');
		},
	});

	// log(`makeSingleInput`, 'end');
	return newInput;
}

export function addAttributeListener(element, listenFor = [], callback = false) {
	listenFor = typeof listenFor === 'string' ? [listenFor] : listenFor;

	const mutationCallback = function (mutationsList, observer) {
		if (callback) callback(element);
	};
	const observer = new MutationObserver(mutationCallback);
	// observer.node = element;
	observer.observe(element, { attributeFilter: listenFor });
	// observer.observe(element, { attributes: true, subtree: true });
}

export function makeSingleCheckbox(workItem, property, thisTopic) {
	let newCheckbox = makeElement({
		tag: 'input',
		attributes: {
			type: 'checkbox',
		},
	});
	if (workItem[property]) newCheckbox.setAttribute('checked', '');

	newCheckbox.addEventListener('change', (event) => {
		let newValue = event.target.checked;
		workItem[property] = !!newValue;
		if (thisTopic) {
			getCurrentProjectEditor().publish(thisTopic, workItem);
			if (property === 'use') {
				toggleHandleInputs(workItem.type, !!newValue);
				workItem.parent.reconcileHandle(workItem.type);
			}
		}
	});

	if (thisTopic) {
		getCurrentProjectEditor().subscribe({
			topic: thisTopic,
			subscriberID: `attributesPanel.${thisTopic}.${property}`,
			callback: (changedItem) => {
				if (!!changedItem[property]) {
					newCheckbox.setAttribute('checked', '');
					if (property === 'use') toggleHandleInputs(workItem.type, true);
				} else {
					newCheckbox.removeAttribute('checked');
					if (property === 'use') toggleHandleInputs(workItem.type, false);
				}
			},
		});
	}

	return newCheckbox;
}

function toggleHandleInputs(handle, show) {
	let group = document.getElementById(`${handle}InputGroup`);
	if (group) group.style.display = show ? 'grid' : 'none';
}

export function makeSingleLabel(text) {
	let newLabel = makeElement({
		tag: 'label',
		innerHTML: text,
	});

	return newLabel;
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

export function makeDirectCheckbox(workItem, property, callback) {
	let newCheckbox = makeElement({
		tag: 'input',
		attributes: { type: 'checkbox' },
	});
	if (workItem[property]) newCheckbox.setAttribute('checked', '');

	newCheckbox.addEventListener('change', (event) => {
		let newValue = event.target.checked;
		workItem[property] = !!newValue;
		if (callback) callback(newValue);
	});

	return newCheckbox;
}

export function makeLinkReferenceRow(itemID) {
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	const targetItem = editor.project.getItem(itemID);

	let row = makeElement({ className: 'item-link__row', attributes: { 'target-item-id': itemID } });
	row.addEventListener('click', () => {
		if (targetItem.displayType === 'Glyph') editor.nav.page = 'Glyph edit';
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
			innerHTML: `${targetItem.name}`,
		})
	);

	row.appendChild(
		makeElement({
			className: 'item-link__subtitle',
			innerHTML: `${targetItem.displayType}&ensp;|&ensp;${itemID}`,
		})
	);

	return row;
}
