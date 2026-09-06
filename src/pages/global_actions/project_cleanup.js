import { getCurrentProjectEditor } from '../../app/main.js';
import { addAsChildren, makeElement } from '../../common/dom.js';
import { Glyph } from '../../project_data/glyph.js';
import { Path } from '../../project_data/path.js';
import { copyShapesFromTo } from '../../project_editor/actions.js';
import { removeLinkFromUsedIn, resolveItemLinks } from '../../project_editor/cross_item_actions.js';
import { glyphIterator } from './page.js';
import { makeOneSettingsRow } from '../settings.js';

// --------------------------------------------------------------
// Flatten Component Instances to Paths
// --------------------------------------------------------------
/**
 * Makes the content for the Flatten global action card.
 * @returns {Element}
 */
export function makeCard_Flatten() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(
		makeElement({ tag: 'h2', content: 'Convert all Component Instances into Paths' })
	);
	let description = makeElement({
		className: 'global-actions__description',
		content: `This will remove all links from Component Instances to their Components, and leave behind a stand-alone path that looks exactly like the Component Instance did.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Every shape in every Glyph, Component, and Ligature will have the "Turn Component Instance into a Path" command run on it.`,
	});
	card.appendChild(effect);

	let button = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Convert Component Instances to Paths',
	});
	button.addEventListener('click', () => {
		glyphIterator({
			title: 'Converting Component Instances to Paths',
			action: (workingItem) => {
				// log(`Global Action: Flatten`, 'start');
				// log(workingItem);
				const editor = getCurrentProjectEditor();
				let newShapes = new Glyph();
				workingItem.shapes.forEach((shape) => {
					if (shape.objType === 'ComponentInstance') {
						const rootItem = editor.project.getItem(shape.link);
						copyShapesFromTo(shape.transformedGlyph, newShapes);
						removeLinkFromUsedIn(rootItem, workingItem.id);
					} else {
						newShapes.addOneShape(new Path(shape));
					}
				});
				workingItem.shapes = [];
				newShapes.shapes.forEach((shape) => workingItem.addOneShape(shape));
				workingItem.changed();
				// log(`Global Action: Flatten`, 'end');
			},
		});
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Round
// --------------------------------------------------------------
/**
 * Makes the content for the Round global action card.
 * @returns {Element}
 */
export function makeCard_Round() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Round all point values' }));
	let description = makeElement({
		className: 'global-actions__description',
		content: `This will run the "round all" action on each glyph. This will ensure all path point values are rounded to their nearest whole number.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Every Character, Component, and Ligature will have the "Round all path point values" command run on it. Also, the Advance Width property will be rounded for Characters and Ligatures.`,
	});
	card.appendChild(effect);

	let button = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Round values',
	});
	button.addEventListener('click', () => {
		glyphIterator({
			title: 'Rounding point values',
			action: (workingItem) => {
				workingItem.roundAll();
				if (workingItem.advanceWidth)
					workingItem.advanceWidth = Math.round(workingItem.advanceWidth);
				workingItem.changed();
				// log(`Global Action: Flatten`, 'end');
			},
		});
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Remove Glyphs, Components, and Ligatures
// --------------------------------------------------------------
/**
 * Makes the content for the Remove Items global action card.
 * @returns {Element}
 */
export function makeCard_RemoveItems() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Remove items from your project' }));
	let description = makeElement({
		className: 'global-actions__description',
		content: `Need to downsize? This global action will remove Glyphs, Components, and Ligatures in selected ranges. This is the same as the 'Delete Glyph' action on individual items.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Project data will be deleted for the selected items.`,
	});
	card.appendChild(effect);

	const options = makeElement({ className: 'settings-table' });
	addAsChildren(options, makeOneSettingsRow('app', 'unlinkComponentInstances', undefined, true));
	options.style.marginTop = '10px';
	card.appendChild(options);

	let button = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Remove items',
	});
	button.style.marginTop = '0';

	button.addEventListener('click', () => {
		glyphIterator({
			title: 'Removing items',
			action: (workingItem) => {
				const project = workingItem.parent;
				if (project) {
					const unlinkComponentInstances = project.settings.app.unlinkComponentInstances;
					resolveItemLinks(workingItem, unlinkComponentInstances);
					if (workingItem.objType === 'Component') {
						delete project.components[workingItem.id];
					} else if (workingItem.objType === 'Ligature') {
						delete project.ligatures[workingItem.id];
					} else if (workingItem.objType === 'Glyph') {
						delete project.glyphs[workingItem.id];
					}
				}
			},
		});
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Unite paths
// --------------------------------------------------------------
/**
 * Makes the content for the Remove Items global action card.
 * @returns {Element}
 */
export function makeCard_UnitePaths() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Combine item paths' }));
	let description = makeElement({
		className: 'global-actions__description',
		content: `This will run the "Combine item paths: Unite" action on all selected items.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Paths will be merged on the selected items.`,
	});
	card.appendChild(effect);

	let button = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Combine paths',
	});
	button.style.marginTop = '0';

	button.addEventListener('click', () => {
		glyphIterator({
			title: 'Combining paths',
			action: (/** @type {Glyph} */ workingItem) => {
				const project = workingItem.parent;
				if (project) {
					// Merge paths
					workingItem.uniteAll();
				}
			},
		});
	});
	card.appendChild(button);

	return card;
}
