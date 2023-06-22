import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeActionsArea_ComponentInstance, makeActionsArea_Path } from './actions.js';
import {
	dimSplit,
	dimSplitElement,
	makeLinkReferenceRow,
	makeSingleCheckbox,
	makeSingleInput,
	makeSingleLabel,
	rowPad,
} from './cards.js';

// --------------------------------------------------------------
// Component Instance attributes
// --------------------------------------------------------------

export function makeCard_componentInstanceAttributes(componentInstance) {
	// log(`makeCard_componentInstanceAttributes`, 'start');
	// log(componentInstance);

	let componentInstanceCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Component instance</h3>',
	});

	// name
	let nameLabel = makeSingleLabel('name');
	let nameInput = makeSingleInput(componentInstance, 'name', 'currentComponentInstance', 'input');

	/*
	// translateX
	let translateXLabel = makeSingleLabel('Δ x');
	let translateXInput = makeSingleInput(componentInstance, 'translateX', 'currentComponentInstance', 'input');

	// translateY
	let translateYLabel = makeSingleLabel('Δ y');
	let translateYInput = makeSingleInput(componentInstance, 'translateY', 'currentComponentInstance', 'input');

	// resizeWidth
	let scaleWLabel = makeSingleLabel('Δ width');
	let scaleWInput = makeSingleInput(componentInstance, 'resizeWidth', 'currentComponentInstance', 'input');

	// resizeHeight
	let scaleHLabel = makeSingleLabel('Δ height');
	let scaleHInput = makeSingleInput(componentInstance, 'resizeHeight', 'currentComponentInstance', 'input');
*/
	let translateInputs = makeComponentInstanceInputs_translate(componentInstance);
	let scaleInputs = makeComponentInstanceInputs_size(componentInstance);

	// isFlippedNS
	let isFlippedNSLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>flip vertical</span>
			<info-bubble>
				Flip top to bottom,
				as compared to the root Glyph or Component
				that this Component Instance is linked to.
			</info-bubble>
		`,
	});
	let isFlippedNSInput = makeSingleCheckbox(
		componentInstance,
		'isFlippedNS',
		'currentComponentInstance'
	);

	// isFlippedEW
	let isFlippedEWLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>flip horizontal</span>
			<info-bubble>
				Flip left to right,
				as compared to the root Glyph or Component
				that this Component Instance is linked to.
			</info-bubble>
		`,
	});
	let isFlippedEWInput = makeSingleCheckbox(
		componentInstance,
		'isFlippedEW',
		'currentComponentInstance'
	);

	// reverseWinding
	let reverseWindingLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>reverse winding</span>
			<info-bubble>
				Reverse all the windings,
				as compared to the root Glyph or Component
				that this Component Instance is linked to.
			</info-bubble>
		`,
	});
	let reverseWindingInput = makeSingleCheckbox(
		componentInstance,
		'reverseWinding',
		'currentComponentInstance'
	);

	/*
	// TODO rotation
	// rotation
	let rotationLabel = makeSingleLabel('rotate');
	let rotationInput = makeSingleInput(
		componentInstance,
		'rotation',
		'currentComponentInstance',
		'input'
	);

	// rotateFirst
	let rotateFirstLabel = makeSingleLabel('rotateFirst');
	let rotateFirstInput = makeSingleCheckbox(
		componentInstance,
		'rotateFirst',
		'currentComponentInstance'
	);
	*/

	let linkLabel = makeElement({ tag: 'h3', innerHTML: 'Component root' });
	let linkRow = makeLinkReferenceRow(componentInstance.link);

	// Put it all together
	addAsChildren(componentInstanceCard, [
		nameLabel,
		nameInput,
		translateInputs,
		scaleInputs,
		isFlippedNSLabel,
		isFlippedNSInput,
		isFlippedEWLabel,
		isFlippedEWInput,
		reverseWindingLabel,
		reverseWindingInput,
		// rotationLabel,
		// rotationInput,
		// rotateFirstLabel,
		// rotateFirstInput,
		rowPad(),
		linkLabel,
		linkRow,
	]);
	addAsChildren(componentInstanceCard, rowPad());
	addAsChildren(componentInstanceCard, makeActionsArea_ComponentInstance());

	// log(`makeCard_componentInstanceAttributes`, 'end');
	return componentInstanceCard;
}

function makeComponentInstanceInputs_translate(item) {
	// TODO transform origin
	// log(`makeInputs_translate`, 'start');

	// Label + inputs
	let label = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>Δ x${dimSplit()}Δ y</span>
			<info-bubble>
				The difference in x or y position,
				as compared to the root Glyph or Component
				that this Component Instance is linked to.
			</info-bubble>
		`,
	});
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let xInput = makeSingleInput(item, 'translateX', 'currentComponentInstance', 'input-number');
	let yInput = makeSingleInput(item, 'translateY', 'currentComponentInstance', 'input-number');

	// Put double input together
	doubleInput.appendChild(xInput);
	doubleInput.appendChild(dimSplitElement());
	doubleInput.appendChild(yInput);

	// log(`makeInputs_translate`, 'end');
	return [label, doubleInput];
}

function makeComponentInstanceInputs_size(item) {
	// TODO transform origin
	// log(`makeComponentInstanceInputs_size`, 'start');

	// Label + Inputs
	let inputLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>Δ width${dimSplit()}Δ height</span>
			<info-bubble>
				The difference in width or height,
				as compared to the root Glyph or Component
				that this Component Instance is linked to.
			</info-bubble>
		`,
	});
	let doubleInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let wInput = makeSingleInput(item, 'resizeWidth', 'currentComponentInstance', 'input-number');
	let hInput = makeSingleInput(
		item,
		'resizeHeight',
		'currentComponentInstance',
		'input-number'
	);

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

	let ratioLockCheckbox = makeSingleCheckbox(item, 'ratioLock', 'currentComponentInstance');

	// log(`makeComponentInstanceInputs_size`, 'end');
	return [inputLabel, doubleInput, ratioLockLabel, ratioLockCheckbox];
}
