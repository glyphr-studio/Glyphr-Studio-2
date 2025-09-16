import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// Transforms panel
// --------------------------------------------------------------

export function makePanel_Transforms() {
	// log(`makePanel_Transforms`, 'start');
	const editor = getCurrentProjectEditor();
	// let selected = editor.selectedItem;

	// Skew
	let skewCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Skew</h3>
				`,
	});

	// Offset path
	let offsetPathCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Offset path</h3>
				<label class="info">
					<span>Offset distance:</span>
					<info-bubble>
						Select shapes, then provide an offset distance to apply. <br><br>
						A positive value will expand the path, and a negative value will
						contract the path. 
					</info-bubble>
				</label>
				<div class="doubleInput">
					<input-number id="offsetPath_input"></input-number>
					<span></span>
					<fancy-button
						secondary
						${editor.multiSelect.shapes.length > 0 ? '' : 'disabled'}
						id="offsetPath_applyButton"
						style="margin-top: -2px;"
					>
					Apply</fancy-button>
				</div>
				`,
	});

	const offsetPathApplyButton = offsetPathCard.querySelector('#offsetPath_applyButton');
	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: `transformsPanel.offsetPathApplyButton`,
		callback: updateApplyOffsetButton,
	});

	const offsetPathInput = offsetPathCard.querySelector('#offsetPath_input');
	offsetPathInput.addEventListener('change', updateApplyOffsetButton);

	offsetPathApplyButton.addEventListener('click', () => {
		const editor = getCurrentProjectEditor();
		const offsetDistance = offsetPathInput.getAttribute('value');
		let selShapes = editor.multiSelect.shapes.members;
		let newShapes = [];
		selShapes.forEach((shape) => {
			const newPolySegment = shape.makePolySegment().makeOffsetPolySegment(offsetDistance);
			newShapes.push(newPolySegment.path);
		});

		editor.multiSelect.shapes.deleteShapes();

		editor.multiSelect.shapes.clear();

		newShapes.forEach((shape) => {
			editor.selectedItem.addOneShape(shape);
			editor.multiSelect.shapes.add(shape);
		});

		editor.history.addState(`Offset path for ${selShapes.length} shape(s)`);
		editor.publish('currentItem', editor.selectedItem);
	});

	// Width and height
	let dimensionCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Width and height</h3>
				`,
	});

	// Rotation
	let rotationCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Rotation</h3>
				`,
	});

	// log(`makePanel_Transforms`, 'end');
	return [skewCard, offsetPathCard, dimensionCard, rotationCard];
}

function updateApplyOffsetButton() {
	const editor = getCurrentProjectEditor();
	let selectedShapes = editor.multiSelect.shapes.length > 0;
	let offsetValue = document.querySelector('#offsetPath_input').getAttribute('value');
	let offsetNumber = parseFloat(offsetValue);
	let hasValue = !isNaN(offsetNumber) && offsetNumber !== 0;

	const offsetPathApplyButton = document.querySelector('#offsetPath_applyButton');
	if (selectedShapes && hasValue) {
		offsetPathApplyButton.removeAttribute('disabled');
	} else {
		offsetPathApplyButton.setAttribute('disabled', '');
	}
}