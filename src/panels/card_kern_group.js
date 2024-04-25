import { addAsChildren, makeElement } from '../common/dom.js';
import { makeKernGroupCharChips } from '../pages/kerning.js';
import { addChildActions, getActionData, makeActionsArea_KernGroup } from './actions.js';
import { makeSingleInput, makeSingleLabel, rowPad } from './cards.js';

// --------------------------------------------------------------
// Kern Group Attributes Card
// --------------------------------------------------------------

export function makeCard_kernGroup(kernGroup) {
	// log(`makeCard_kernGroup`, 'start');
	// log(kernGroup);

	let kernGroupCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Kern Group</h3>',
	});

	let valueLabel = makeSingleLabel('Value');
	let valueInput = makeSingleInput(kernGroup, 'value', 'currentKernGroup', 'input-number');

	let leftLabel = makeSingleLabel('Left group');
	let leftInput = makeKernGroupCharChips(kernGroup.leftGroup);

	let rightLabel = makeSingleLabel('Right group');
	let rightInput = makeKernGroupCharChips(kernGroup.rightGroup);

	// Put it all together
	addAsChildren(kernGroupCard, [
		valueLabel,
		valueInput,
		leftLabel,
		leftInput,
		rightLabel,
		rightInput,
	]);

	addAsChildren(kernGroupCard, rowPad());
	addAsChildren(kernGroupCard, makeActionsArea_KernGroup());

	// log(`makeCard_kernGroup`, 'end');
	return kernGroupCard;
}

export function makeCard_otherKernGroupActions() {
	let actionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Other kern group actions</h3>',
	});

	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	addChildActions(actionsArea, getActionData('otherKernGroupActions'));
	actionsCard.appendChild(actionsArea);

	return actionsCard;
}