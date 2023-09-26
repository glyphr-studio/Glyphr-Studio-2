import { getCurrentProjectEditor } from '../app/main.js';
import { accentColors } from '../common/colors.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeActionsArea_PathPoint } from './actions.js';
import { makeInputs_position, makeSingleCheckbox, makeSingleLabel, rowPad } from './cards.js';

// --------------------------------------------------------------
// Path Point attributes
// --------------------------------------------------------------

export function makeCard_pathPointAttributes(selectedPoint) {
	// log(`makeCard_pathPointAttributes`, 'start');
	const editor = getCurrentProjectEditor();

	// `ident` is a unique ID per object for debugging
	let pathPointCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>Path point ${selectedPoint.pointNumber + 1} ${selectedPoint.ident}</h3>`,
	});

	// let pointNumLabel = makeSingleLabel('Selected path point');
	// let pointNumInput = makeSingleInput(selectedPath, 'selectedPathPoint', 'whichPathPointIsSelected', 'input-number');

	// -- Point -- //
	// Point x/y
	let pointPosition = makeInputs_position(selectedPoint.p, 'point');
	let pointTypeLabel = makeSingleLabel('point type');
	let pointTypeWrapper = makeElement();

	addAsChildren(pointTypeWrapper, [
		makePointTypeButton('symmetric', selectedPoint.type === 'symmetric', () => {
			selectedPoint.type = 'symmetric';
			selectedPoint.makeSymmetric();
			editor.publish('currentPathPoint', selectedPoint);
		}),
		makePointTypeButton('flat', selectedPoint.type === 'flat', () => {
			selectedPoint.type = 'flat';
			selectedPoint.makeFlat();
			editor.publish('currentPathPoint', selectedPoint);
		}),
		makePointTypeButton('corner', selectedPoint.type === 'corner', () => {
			selectedPoint.type = 'corner';
			editor.publish('currentPathPoint', selectedPoint);
		}),
	]);

	editor.subscribe({
		topic: 'currentPathPoint',
		subscriberID: 'pointTypeButtons',
		callback: (changedPathPoint) => {
			// log(`pointTypeButton CALLBACK`, 'start');
			// log(`\n⮟changedPathPoint⮟`);
			// log(changedPathPoint);

			// Update Point Type
			if (document.getElementById(`pointTypeButton-${changedPathPoint.type}`)) {
				document.getElementById(`pointTypeButton-symmetric`).removeAttribute('selected');
				document.getElementById(`pointTypeButton-flat`).removeAttribute('selected');
				document.getElementById(`pointTypeButton-corner`).removeAttribute('selected');
				document
					.getElementById(`pointTypeButton-${changedPathPoint.type}`)
					.setAttribute('selected', '');
			}

			updateHandleGroup('h1', changedPathPoint);
			updateHandleGroup('h2', changedPathPoint);

			// log(`pointTypeButton CALLBACK`, 'end');
		},
	});

	let h1Group = makeElement({ id: `h1Group`, className: 'span-all-columns' });
	addAsChildren(h1Group, makeHandleGroup('h1', selectedPoint));
	let h2Group = makeElement({ id: `h2Group`, className: 'span-all-columns' });
	addAsChildren(h2Group, makeHandleGroup('h2', selectedPoint));

	// Put it all together
	addAsChildren(pathPointCard, pointPosition);
	addAsChildren(pathPointCard, [pointTypeLabel, pointTypeWrapper]);
	addAsChildren(pathPointCard, [h1Group, h2Group]);
	addAsChildren(pathPointCard, rowPad());
	addAsChildren(pathPointCard, makeActionsArea_PathPoint());

	// log(`makeCard_pathPointAttributes`, 'end');
	return pathPointCard;
}

function makeHandleGroup(h = 'h1', selectedPoint) {
	// Checkbox and title
	let useHandleLabel = makeElement({ className: 'pre-checkbox' });
	let useHandleCheckbox = makeSingleCheckbox(selectedPoint[h], 'use', `currentPathPoint`);
	if (selectedPoint.type !== 'corner') useHandleCheckbox.setAttribute('disabled', '');
	addAsChildren(useHandleLabel, [
		useHandleCheckbox,
		makeElement({ tag: 'h4', content: `Use handle ${h.charAt(1)}` }),
	]);

	// Inputs
	let handleInputGroup = makeElement({
		id: `${h}InputGroup`,
		style: `display: ${selectedPoint[h].use ? 'grid' : 'none'}`,
	});
	let hPosition = makeInputs_position(selectedPoint[h], h);
	addAsChildren(handleInputGroup, hPosition);

	getCurrentProjectEditor().subscribe({
		topic: `currentPathPoint`,
		subscriberID: `controlPointInputGroup.${h}`,
		callback: (changedPathPoint) => {
			// log(`controlPointInputGroup ${h} CALLBACK`, 'start');
			// log(`\n⮟changedPathPoint⮟`);
			// log(changedPathPoint);
			if (changedPathPoint.type === 'symmetric') changedPathPoint.makeSymmetric(h);
			if (changedPathPoint.type === 'flat') changedPathPoint.makeFlat(h);
			updateHandleGroup('h1', changedPathPoint);
			updateHandleGroup('h2', changedPathPoint);
			// log(`controlPointInputGroup ${h} CALLBACK`, 'end');
		},
	});

	// Put it all together
	return [useHandleLabel, handleInputGroup];
}

function updateHandleGroup(h = 'h1', changedItem) {
	// log(`updateHandleGroup`, 'start');
	// log(`h: ${h}`);
	// log(`\n⮟changedItem⮟`);
	// log(changedItem);
	let changedPathPoint = changedItem;
	if (changedItem.objType === 'ControlPoint') {
		changedPathPoint = changedItem.parent;
	}

	let handleGroup = document.getElementById(`${h}Group`);
	if (handleGroup) {
		let handleUse = changedPathPoint[h].use;
		// log(`handleUse: ${handleUse}`);
		let handleCheckbox = handleGroup.querySelector('input');
		handleCheckbox.removeAttribute('checked');
		handleCheckbox.removeAttribute('disabled');
		if (handleUse) {
			handleCheckbox.setAttribute('checked', '');
			if (changedPathPoint.type !== 'corner') handleCheckbox.setAttribute('disabled', '');
			let handleInputGroup = document.getElementById(`${h}InputGroup`);
			handleInputGroup.style.display = 'grid';
			let handleInputGroupX = handleInputGroup.querySelectorAll('input-number')[0];
			handleInputGroupX.setAttribute('value', changedPathPoint[h].x);
			let handleInputGroupY = handleInputGroup.querySelectorAll('input-number')[1];
			handleInputGroupY.setAttribute('value', changedPathPoint[h].y);
		}
	}
	// log(`updateHandleGroup`, 'end');
}
export function makeCard_multiSelectPathPointAttributes(virtualShape) {
	// log(`makeCard_multiSelectPathPointAttributes`, 'start');
	// log(virtualShape);
	let multiPathPointCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${virtualShape.pathPoints.length} selected path points</h3>`,
	});

	addAsChildren(multiPathPointCard, makeActionsArea_PathPoint());

	// log(`makeCard_multiSelectPathPointAttributes`, 'end');
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
