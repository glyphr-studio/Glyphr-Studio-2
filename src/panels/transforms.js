import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// Transforms panel
// --------------------------------------------------------------

export function makePanel_Transforms() {
	// log(`makePanel_Transforms`, 'start');
	// const editor = getCurrentProjectEditor();
	// const project = getCurrentProject();
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
				`,
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
