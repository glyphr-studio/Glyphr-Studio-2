import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeIcon } from '../common/graphics.js';
import { makeActionsArea_Glyph, makeActionsArea_Universal } from './actions.js';
import {
	dimSplit,
	dimSplitElement,
	makeInputs_position,
	makeInputs_size,
	makeSingleCheckbox,
	makeSingleInput,
	makeSingleLabel,
} from './cards.js';

// --------------------------------------------------------------
// Glyph attributes
// --------------------------------------------------------------

export function makeCard_glyphAttributes(glyph) {
	let glyphCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: '<h3>Glyph</h3>',
	});

	let advanceWidthLabel = makeSingleLabel('advance width');
	let halfSizeAdvanceWidthInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let advanceWidthInput = makeSingleInput(glyph, 'advanceWidth', 'currentGlyph', 'input-number');
	let autoFitAdvanceWidth = makeElement({
		tag: 'button',
		className: 'panel-card__action-button',
		title: 'Auto-fit advance width\nThe advance width will be set to the x-max of the paths in this glyph.',
		innerHTML: makeIcon({ name: 'command_autoFit' }),
		onClick: () => {
			let editor = getCurrentProjectEditor();
			editor.selectedItem.advanceWidth = editor.selectedItem.maxes.xMax;
			editor.publish('currentGlyph', editor.selectedItem);
		},
	});
	addAsChildren(halfSizeAdvanceWidthInput, [advanceWidthInput, makeElement(), autoFitAdvanceWidth]);

	// Side bearings
	let bearingLabel = makeElement({
		tag: 'label',
		className: 'info',
		innerHTML: `
			<span>bearings: left${dimSplit()}right</span>
			<info-bubble>
				<h1>Side Bearings</h1>
				Side bearings are the blank space to the left and right
				of paths in a glyph. The open space between
				characters is very important for legibility.
				<br><br>
				These are calculated values based on path positions and the
				Advance Width. They are not properties that are saved with the
				glyph, but it's helpful to think about them as if they were.
				<br>
				<h2>Left side bearing</h2>
				Distance from x=0 and the leftmost side of paths in the glyph.
				Editing this will move all the shapes in the glyph, and update
				the Advance Width.
				<br>
				<h2>Right side bearing</h2>
				Distance from the rightmost side of paths in the glyph to the
				Advance Width.
			</info-bubble>
		`,
	});
	let doubleBearingInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let lsbInput = makeSingleInput(glyph, 'leftSideBearing', 'currentGlyph', 'input-number');
	let rsbInput = makeSingleInput(glyph, 'rightSideBearing', 'currentGlyph', 'input-number');
	doubleBearingInput.appendChild(lsbInput);
	doubleBearingInput.appendChild(dimSplitElement());
	doubleBearingInput.appendChild(rsbInput);

	// Put it all together
	addAsChildren(glyphCard, [advanceWidthLabel, halfSizeAdvanceWidthInput]);
	addAsChildren(glyphCard, [bearingLabel, doubleBearingInput]);
	addAsChildren(glyphCard, makeElement({ tag: 'div', className: 'rowPad' }));
	addAsChildren(glyphCard, makeElement({ tag: 'h4', content: 'Bulk-edit paths' }));
	addAsChildren(glyphCard, makeInputs_position(glyph));
	addAsChildren(glyphCard, makeInputs_size(glyph));
	addAsChildren(glyphCard, makeElement({ tag: 'div', className: 'rowPad' }));
	addAsChildren(glyphCard, makeActionsArea_Glyph());
	addAsChildren(glyphCard, makeActionsArea_Universal());

	return glyphCard;
}
