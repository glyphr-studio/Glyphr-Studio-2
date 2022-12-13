import { getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeActionsArea_PathPoint } from './actions.js';
import {
	dimSplit,
	makeInputs_position,
	makeInputs_size,
	makeSingleCheckbox,
	makeSingleInput,
	makeSingleLabel,
} from './cards.js';

// --------------------------------------------------------------
// Path Point attributes
// --------------------------------------------------------------

export function makeCard_pathPointAttributes(selectedPoint) {
	// log(`makeCard_pathPointAttributes`, 'start');
	const editor = getCurrentProjectEditor();
	// POINT
	let pathPointCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Path point</h3>',
	});

	// let pointNumLabel = makeSingleLabel('Selected path point');
	// let pointNumInput = makeSingleInput(selectedPath, 'selectedPathPoint', 'whichPathPointIsSelected', 'input-number');

	// -- Point -- //
	// Point x/y
	let pointPosition = makeInputs_position(selectedPoint.p, 'point', true);
	let pointTypeLabel = makeSingleLabel('point type');
	let pointTypeWrapper = makeElement();

	addAsChildren(pointTypeWrapper, [
		makePointTypeButton('symmetric', selectedPoint.type === 'symmetric', () => {
			selectedPoint.type = 'symmetric';
			editor.publish('currentPathPoint', selectedPoint);
			editor.publish('currentControlPoint.p', selectedPoint.p);
		}),
		makePointTypeButton('flat', selectedPoint.type === 'flat', () => {
			selectedPoint.type = 'flat';
			editor.publish('currentPathPoint', selectedPoint);
			editor.publish('currentControlPoint.p', selectedPoint.p);
		}),
		makePointTypeButton('corner', selectedPoint.type === 'corner', () => {
			selectedPoint.type = 'corner';
			editor.publish('currentPathPoint', selectedPoint);
			editor.publish('currentControlPoint.p', selectedPoint.p);
		}),
	]);
	editor.subscribe({
		topic: 'currentPathPoint',
		subscriberID: 'pointTypeButtons',
		callback: (changedItem) => {
			// log(`pointTypeButton subscriber callback`, 'start');
			// log(changedItem);
			if (document.getElementById(`pointTypeButton-${changedItem.type}`)) {
				document.getElementById(`pointTypeButton-symmetric`).removeAttribute('selected');
				document.getElementById(`pointTypeButton-flat`).removeAttribute('selected');
				document.getElementById(`pointTypeButton-corner`).removeAttribute('selected');
				document.getElementById(`pointTypeButton-${changedItem.type}`).setAttribute('selected', '');
			}
			// log(`pointTypeButton subscriber callback`, 'end');
		},
	});

	// -- Handle 1 -- //
	// disable checkbox if not corner
	let useH1Checkbox = makeSingleCheckbox(selectedPoint.h1, 'use', 'currentControlPoint.h1');
	let useH1Label = makeElement({ className: 'pre-checkbox' });
	addAsChildren(useH1Label, [useH1Checkbox, makeElement({ tag: 'h4', content: 'Use handle 1' })]);

	let h1Group = makeElement({
		id: 'h1InputGroup',
		style: `display: ${selectedPoint.h1.use ? 'grid' : 'none'}`,
	});
	let h1Position = makeInputs_position(selectedPoint.h1, 'h1', true);
	addAsChildren(h1Group, h1Position);

	// -- Handle 2 -- //
	// disable checkbox if not corner
	let useH2Checkbox = makeSingleCheckbox(selectedPoint.h2, 'use', 'currentControlPoint.h2');
	let useH2Label = makeElement({ className: 'pre-checkbox' });
	addAsChildren(useH2Label, [useH2Checkbox, makeElement({ tag: 'h4', content: 'Use handle 2' })]);

	let h2Group = makeElement({
		id: 'h2InputGroup',
		style: `display: ${selectedPoint.h2.use ? 'grid' : 'none'}`,
	});
	let h2Position = makeInputs_position(selectedPoint.h2, 'h2', true);
	addAsChildren(h2Group, h2Position);

	// Put it all together
	addAsChildren(pathPointCard, pointPosition);
	addAsChildren(pathPointCard, [pointTypeLabel, pointTypeWrapper]);
	addAsChildren(pathPointCard, [useH1Label, h1Group, useH2Label, h2Group]);
	addAsChildren(pathPointCard, makeElement({ tag: 'div', className: 'rowPad' }));
	addAsChildren(pathPointCard, makeActionsArea_PathPoint());

	// log(`makeCard_pathPointAttributes`, 'end');
	return pathPointCard;
}

export function makeCard_multiSelectPathPointAttributes(path) {
	let multiPathPointCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${path.pathPoints.length} selected path points</h3>`,
	});
	addAsChildren(multiPathPointCard, makeInputs_position(path));
	addAsChildren(multiPathPointCard, makeInputs_size(path));
	addAsChildren(multiPathPointCard, makeActionsArea_PathPoint());

	return multiPathPointCard;
}

// --------------------------------------------------------------
// Drawing stuff
// --------------------------------------------------------------

export function makePointTypeButton(type, selected, clickHandler) {
	let color = accentColors.gray.l40;

	let button = makeElement({
		tag: 'button',
		className: 'pointTypeButton',
		id: `pointTypeButton-${type}`,
		attributes: {
			title: `point type: ${type}`,
		},
	});

	button.addEventListener('click', clickHandler);

	if (selected) {
		button.setAttribute('selected', '');
	}

	let svg = `
	<svg version="1.1"
		xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0" y="0" width="20" height="20" viewBox="0 0 20 20" enable-background="new 0 0 20 20">
		<g fill="${color}">
		<rect x="8" y="8" width="1" height="4"/>
		<rect x="11" y="8" width="1" height="4"/>
		<rect x="8" y="8" width="4" height="1"/>
		<rect x="8" y="11" width="4" height="1"/>
		<rect x="4" y="4" width="1" height="1"/>
		<rect x="5" y="5" width="1" height="1"/>
		<rect x="6" y="6" width="1" height="1"/>
		<rect x="7" y="7" width="1" height="1"/>
		<circle cx="3" cy="3" r="1.5"/>
	`;

	switch (type) {
		case 'corner':
			svg += `
			<rect x="7" y="12" width="1" height="1"/>
			<rect x="6" y="13" width="1" height="1"/>
			<rect x="5" y="14" width="1" height="1"/>
			<rect x="4" y="15" width="1" height="1"/>
			<circle cx="3" cy="17" r="1.5"/>
			`;
			break;

		case 'symmetric':
			svg += `
			<rect x="12" y="12" width="1" height="1"/>
			<rect x="13" y="13" width="1" height="1"/>
			<rect x="14" y="14" width="1" height="1"/>
			<rect x="15" y="15" width="1" height="1"/>
			<circle cx="17" cy="17" r="1.5"/>
			`;
			break;

		case 'flat':
			svg += `
			<rect x="12" y="12" width="1" height="1"/>
			<rect x="13" y="13" width="1" height="1"/>
			<circle cx="15" cy="15" r="1.5"/>
			`;
			break;
	}

	svg += `</g></svg>`;

	button.innerHTML = svg;

	return button;
}
