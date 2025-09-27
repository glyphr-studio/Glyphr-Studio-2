import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { Path } from '../project_data/path.js';

// --------------------------------------------------------------
// Transforms panel
// --------------------------------------------------------------

export function makePanel_Transforms() {
	// log(`makePanel_Transforms`, 'start');

	let skewCard = makeSkewCard();
	let offsetPathCard = makeOffsetCard();
	let dimensionCard = makeWidthHeightCard();
	let rotationCard = makeRotationCard();

	// log(`makePanel_Transforms`, 'end');
	return [skewCard, offsetPathCard, dimensionCard, rotationCard];
}

// --------------------------------------------------------------
// Skew
// --------------------------------------------------------------

function makeSkewCard() {
	const editor = getCurrentProjectEditor();
	// Skew
	let skewCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Skew</h3>
				<label class="info">
					<span>Skew angle:</span>
					<info-bubble>
						Select shapes, then provide a skew angle to apply. <br><br>
						A positive value will skew the path in one direction, and a negative value will
						skew the path in the other direction.
					</info-bubble>
				</label>
				<div class="doubleInput">
					<input-number id="skew_input"></input-number>
					<span>°</span>
					<fancy-button
						secondary
						${editor.multiSelect.shapes.length > 0 ? '' : 'disabled'}
						id="skew_applyButton"
						style="margin-top: -2px;"
					>
					Apply</fancy-button>
				</div>
				`,
	});

	const skewApplyButton = skewCard.querySelector('#skew_applyButton');
	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: `transformsPanel.skewApplyButton`,
		callback: updateApplySkewButton,
	});

	const skewInput = skewCard.querySelector('#skew_input');
	skewInput.addEventListener('change', updateApplySkewButton);

	skewApplyButton.addEventListener('click', () => {
		const editor = getCurrentProjectEditor();
		const skewAngle = Number(skewInput.getAttribute('value'));
		let selShapes = editor.multiSelect.shapes.members;
		let newShapes = [];
		selShapes.forEach((shape) => {
			if (shape.objType === 'Path') {
				let newPath = new Path(shape);
				newPath.skew(skewAngle);
				newShapes.push(newPath);
			}
		});

		editor.multiSelect.shapes.deleteShapes();

		editor.multiSelect.shapes.clear();

		newShapes.forEach((shape) => {
			editor.selectedItem.addOneShape(shape);
			editor.multiSelect.shapes.add(shape);
		});

		// Placeholder for now - just log the action
		editor.history.addState(`Skew ${selShapes.length} shape(s) by ${skewAngle}°`);
		editor.publish('currentItem', editor.selectedItem);
	});

	function updateApplySkewButton() {
		const editor = getCurrentProjectEditor();
		const skewInput = skewCard.querySelector('#skew_input');
		const skewApplyButton = skewCard.querySelector('#skew_applyButton');
		const inputValue = skewInput.getAttribute('value');
		const hasShapes = editor.multiSelect.shapes.length > 0;
		const hasValidInput = inputValue && inputValue !== '0';

		if (hasShapes && hasValidInput) {
			skewApplyButton.removeAttribute('disabled');
		} else {
			skewApplyButton.setAttribute('disabled', '');
		}
	}

	return skewCard;
}

// --------------------------------------------------------------
// Offset path
// --------------------------------------------------------------

function makeOffsetCard() {
	const editor = getCurrentProjectEditor();
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

	function updateApplyOffsetButton() {
		const offsetPathApplyButton = document.querySelector('#offsetPath_applyButton');
		if (!offsetPathApplyButton) return;

		const editor = getCurrentProjectEditor();
		let selectedShapes = editor.multiSelect.shapes.length > 0;
		let offsetValue = document.querySelector('#offsetPath_input').getAttribute('value');
		let offsetNumber = parseFloat(offsetValue);
		let hasValue = !isNaN(offsetNumber) && offsetNumber !== 0;

		if (selectedShapes && hasValue) {
			offsetPathApplyButton.removeAttribute('disabled');
		} else {
			offsetPathApplyButton.setAttribute('disabled', '');
		}
	}

	return offsetPathCard;
}

// --------------------------------------------------------------
// Width and height
// --------------------------------------------------------------

function makeWidthHeightCard() {
	const editor = getCurrentProjectEditor();
	// Width and height
	let widthHeightCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Width and height</h3>
				<label class="info">
					<span>Dimensions:</span>
					<info-bubble>
						Select shapes, then provide new width and height values. <br><br>
						Leave a field empty to maintain the current dimension, or use the
						ratio lock to maintain proportions when changing one dimension.
					</info-bubble>
				</label>
				<div class="doubleInput">
					<div style="display: flex; gap: 8px; align-items: center;">
						<input-number id="width_input" placeholder="Width"></input-number>
						<span>×</span>
						<input-number id="height_input" placeholder="Height"></input-number>
						<option-toggle id="ratioLock_toggle" title="Lock aspect ratio">
							<svg width="16" height="16" viewBox="0 0 16 16">
								<path d="M2 2h12v12H2z" fill="none" stroke="currentColor" stroke-width="1"/>
								<path d="M6 6h4v4H6z" fill="none" stroke="currentColor" stroke-width="1"/>
							</svg>
						</option-toggle>
					</div>
					<fancy-button
						secondary
						${editor.multiSelect.shapes.length > 0 ? '' : 'disabled'}
						id="widthHeight_applyButton"
						style="margin-top: 8px;"
					>
					Apply</fancy-button>
				</div>
				`,
	});

	const widthHeightApplyButton = widthHeightCard.querySelector('#widthHeight_applyButton');
	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: `transformsPanel.widthHeightApplyButton`,
		callback: updateApplyWidthHeightButton,
	});

	const widthInput = widthHeightCard.querySelector('#width_input');
	const heightInput = widthHeightCard.querySelector('#height_input');
	widthInput.addEventListener('change', updateApplyWidthHeightButton);
	heightInput.addEventListener('change', updateApplyWidthHeightButton);

	widthHeightApplyButton.addEventListener('click', () => {
		const editor = getCurrentProjectEditor();
		const widthValue = widthInput.getAttribute('value');
		const heightValue = heightInput.getAttribute('value');
		const ratioLocked = widthHeightCard.querySelector('#ratioLock_toggle').hasAttribute('selected');
		let selShapes = editor.multiSelect.shapes.members;

		// TODO: Implement actual width/height transformation
		console.log(
			`Resizing ${selShapes.length} shape(s) to width: ${widthValue || 'unchanged'}, height: ${
				heightValue || 'unchanged'
			}, ratio lock: ${ratioLocked}`
		);

		// Placeholder for now - just log the action
		const changes = [];
		if (widthValue) changes.push(`width: ${widthValue}`);
		if (heightValue) changes.push(`height: ${heightValue}`);
		const changeText = changes.length > 0 ? changes.join(', ') : 'dimensions';

		editor.history.addState(`Resize ${selShapes.length} shape(s) - ${changeText}`);
		editor.publish('currentItem', editor.selectedItem);
	});

	function updateApplyWidthHeightButton() {
		const editor = getCurrentProjectEditor();
		const widthInput = widthHeightCard.querySelector('#width_input');
		const heightInput = widthHeightCard.querySelector('#height_input');
		const widthHeightApplyButton = widthHeightCard.querySelector('#widthHeight_applyButton');
		const widthValue = widthInput.getAttribute('value');
		const heightValue = heightInput.getAttribute('value');
		const hasShapes = editor.multiSelect.shapes.length > 0;
		const hasValidInput =
			(widthValue && widthValue !== '0') || (heightValue && heightValue !== '0');

		if (hasShapes && hasValidInput) {
			widthHeightApplyButton.removeAttribute('disabled');
		} else {
			widthHeightApplyButton.setAttribute('disabled', '');
		}
	}

	return widthHeightCard;
}

// --------------------------------------------------------------
// Rotation
// --------------------------------------------------------------

function makeRotationCard() {
	const editor = getCurrentProjectEditor();
	// Rotation
	let rotationCard = makeElement({
		className: 'panel__card',
		innerHTML: `
				<h3>Rotation</h3>
				<label class="info">
					<span>Rotation angle:</span>
					<info-bubble>
						Select shapes, then provide a rotation angle to apply. <br><br>
						A positive value will rotate the path clockwise, and a negative value will
						rotate the path counterclockwise. Rotation is applied around the shape's center.
					</info-bubble>
				</label>
				<div class="doubleInput">
					<input-number id="rotation_input"></input-number>
					<span>°</span>
					<fancy-button
						secondary
						${editor.multiSelect.shapes.length > 0 ? '' : 'disabled'}
						id="rotation_applyButton"
						style="margin-top: -2px;"
					>
					Apply</fancy-button>
				</div>
				`,
	});

	const rotationApplyButton = rotationCard.querySelector('#rotation_applyButton');
	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: `transformsPanel.rotationApplyButton`,
		callback: updateApplyRotationButton,
	});

	const rotationInput = rotationCard.querySelector('#rotation_input');
	rotationInput.addEventListener('change', updateApplyRotationButton);

	rotationApplyButton.addEventListener('click', () => {
		const editor = getCurrentProjectEditor();
		const rotationAngle = rotationInput.getAttribute('value');
		let selShapes = editor.multiSelect.shapes.members;

		// TODO: Implement actual rotation transformation
		console.log(`Rotating ${selShapes.length} shape(s) by ${rotationAngle} degrees`);

		// Placeholder for now - just log the action
		editor.history.addState(`Rotate ${selShapes.length} shape(s) by ${rotationAngle}°`);
		editor.publish('currentItem', editor.selectedItem);
	});

	function updateApplyRotationButton() {
		const editor = getCurrentProjectEditor();
		const rotationInput = rotationCard.querySelector('#rotation_input');
		const rotationApplyButton = rotationCard.querySelector('#rotation_applyButton');
		const inputValue = rotationInput.getAttribute('value');
		const hasShapes = editor.multiSelect.shapes.length > 0;
		const hasValidInput = inputValue && inputValue !== '0';

		if (hasShapes && hasValidInput) {
			rotationApplyButton.removeAttribute('disabled');
		} else {
			rotationApplyButton.setAttribute('disabled', '');
		}
	}

	return rotationCard;
}
