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
				<number-input id="offsetPath_input" />
				<fancy-button secondary id="offsetPath_applyButton">Apply</fancy-button>
				`,
	});

	let offsetPathApplyButton = offsetPathCard.querySelector('#offsetPath_applyButton');
	editor.subscribe({
		topic: 'currentItem',
		subscriberID: `transformsPanel.offsetPathApplyButton`,
		callback: () => {
			if (editor.multiSelect.shapes.count() > 0) {
				offsetPathApplyButton.removeAttribute('disabled');
			} else {
				offsetPathApplyButton.setAttribute('disabled', 'disabled');
			}
		}
	})
		;
	offsetPathApplyButton.addEventListener('click', () => {
		const editor = getCurrentProjectEditor();
		const newPolySegment = editor.selectedItem.shapes[0]
			.makePolySegment()
			.makeOffsetPolySegment(-100);
		editor.selectedItem.addOneShape(newPolySegment.path);
		editor.history.addState(`Transformed the first shape in this glyph`);
		editor.publish('currentItem', editor.selectedItem);
	});

	// Add numeric input control (not hooked up yet)
	let offsetValueInput = makeElement({
		tag: 'input-number',
	});
	offsetPathCard.appendChild(offsetValueInput);

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
