import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { round } from '../common/functions.js';

// --------------------------------------------------------------
// Common attributes stuff
// --------------------------------------------------------------

export function makeInputs_position(workItem, labelPrefix = '', lockable = false) {
	// TODO transform origin
	// log(`makeInputs_position`, 'start');
	let x = workItem.x;
	let y = workItem.y;
	// log(`x: ${round(x, 3)}`);
	// log(`y: ${round(y, 3)}`);
	let thisTopic = `current${workItem.objType}`;
	if (workItem.type) thisTopic += `.${workItem.type}`;

	if (labelPrefix) labelPrefix += ':&ensp;';
	// Label + inputs
	let label = makeElement({ tag: 'label', innerHTML: `${labelPrefix}x${dimSplit()}y` });
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let xInput = makeSingleInput(
		workItem,
		'x',
		thisTopic,
		`input-number${lockable ? '-lockable' : ''}`
	);
	let yInput = makeSingleInput(
		workItem,
		'y',
		thisTopic,
		`input-number${lockable ? '-lockable' : ''}`
	);

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
	// log(`workItem.type: ${workItem.type}`);
	// log(`property: ${property}`);
	// log(`thisTopic: ${thisTopic}`);
	// log(`tagName: ${tagName}`);

	let newInput = makeElement({ tag: tagName, className: `singleInput-${property}` });
	let value = tagName === 'input' ? workItem[property] : round(workItem[property], 3);
	newInput.setAttribute('value', value);

	newInput.addEventListener('change', (event) => {
		let newValue = event.target.value;
		let editor = getCurrentProjectEditor();
		if (!workItem.isLocked(property)) {
			// Update the view so that the glyph stays put
			// and the LSB moves to the left or right
			if (property === 'leftSideBearing') {
				let view = editor.view;
				editor.view.dx -= (newValue - workItem.leftSideBearing) * view.dz;
				editor.publish('view', workItem);
			}

			// Code Smell
			if (
				(workItem.objType === 'Glyph') &&
				(property === 'width' || property === 'height') &&
				workItem.ratioLock
			) {
				if (property === 'width') workItem.setGlyphSize(newValue, false, true);
				if (property === 'height') workItem.setGlyphSize(false, newValue, true);
			} else if (
				(workItem.objType === 'Path') &&
				(property === 'width' || property === 'height') &&
				workItem.ratioLock
			) {
				if (property === 'width') workItem.setPathSize(newValue, false, true);
				if (property === 'height') workItem.setPathSize(false, newValue, true);
			} else {
				workItem[property] = newValue;
			}

			editor.publish(thisTopic, workItem);
		}
	});

	if (tagName.includes('-lockable')) {
		addAttributeListener(newInput, 'disabled', (element) => {
			let disabled = element.getAttribute('disabled');
			if (disabled === null) workItem.unlock(property);
			else workItem.lock(property);
		});
	}

	getCurrentProjectEditor().subscribe({
		topic: thisTopic,
		subscriberID: `attributesPanel.${thisTopic}.${property}`,
		callback: (changedItem) => {
			// log(`SINGLE INPUT CALLBACK`, 'start');
			// log(`attributesPanel.${thisTopic}.${property}`);
			// log(changedItem);
			// log(`property: ${property}`);
			// log(`changedItem[property]: ${changedItem[property]}`);

			if (changedItem[property]) {
				let newValue =
					tagName === 'input' ? changedItem[property] : round(changedItem[property], 3);
				newInput.value = newValue;
				// log(`new value: ${newValue}`);
			}
			// log(`SINGLE INPUT CALLBACK`, 'end');
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
		getCurrentProjectEditor().publish(thisTopic, workItem);
		if (property === 'use') {
			toggleHandleInputs(workItem.type, !!newValue);
			workItem.parent.reconcileHandle(workItem.type);
		}
	});

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

	return newCheckbox;
}

function toggleHandleInputs(handle, show) {
	let group = document.getElementById(`${handle}InputGroup`);
	group.style.display = show ? 'grid' : 'none';
}

export function makeSingleLabel(text, info = false) {
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
