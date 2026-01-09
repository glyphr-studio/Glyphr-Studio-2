import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { makeIcon } from '../common/graphics.js';
import { makeActionsArea_Glyph, makeActionsArea_Universal } from './actions.js';
import {
	dimSplit,
	dimSplitElement,
	makeInputs_position,
	makeInputs_size,
	makeLinkReferenceRow,
	makeSingleInput,
	makeSingleLabel,
	rowPad,
} from './cards.js';

// --------------------------------------------------------------
// Glyph Attributes Card
// --------------------------------------------------------------

export function makeCard_glyphAttributes(glyph) {
	// log(`makeCard_glyphAttributes`, 'start');
	// log(`glyph.id: ${glyph.id}`);

	// `ident` is a unique ID per object for debugging
	let glyphCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${glyph.displayType} ${glyph.ident || ''}</h3>`,
	});

	let advanceWidthLabel = makeSingleLabel('advance width');
	let halfSizeAdvanceWidthInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let advanceWidthInput = makeSingleInput(glyph, 'advanceWidth', 'currentItem', 'input-number');
	let autoFitAdvanceWidth = makeElement({
		tag: 'button',
		className: 'panel-card__action-button',
		title:
			'Auto-fit advance width\nThe advance width will be set to the x-max of the paths in this glyph.',
		innerHTML: makeIcon({ name: 'command_autoFit' }),
		onClick: () => {
			let editor = getCurrentProjectEditor();
			editor.selectedItem.advanceWidth = editor.selectedItem.maxes.xMax;
			editor.publish('currentItem', editor.selectedItem);
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
				of shapes in a glyph. The open space between
				characters is very important for legibility.
				<br><br>
				These are calculated values based on shape positions and the
				Advance Width. They are not properties that are saved with the
				glyph, but it's helpful to think about them as if they were.
				<br>
				<h2>Left side bearing</h2>
				Distance from x=0 to the leftmost side of shapes in the glyph.
				Editing this will move all the shapes in the glyph, and update
				the Advance Width.
				<br>
				<h2>Right side bearing</h2>
				Distance from the rightmost side of shapes in the glyph to the
				Advance Width.
			</info-bubble>
		`,
	});
	let doubleBearingInput = makeElement({ tag: 'div', className: 'doubleInput' });
	let lsbInput = makeSingleInput(glyph, 'leftSideBearing', 'currentItem', 'input-number');
	let rsbInput = makeSingleInput(glyph, 'rightSideBearing', 'currentItem', 'input-number');
	doubleBearingInput.appendChild(lsbInput);
	doubleBearingInput.appendChild(dimSplitElement());
	doubleBearingInput.appendChild(rsbInput);

	// Put it all together
	if (glyph.displayType !== 'Component') {
		addAsChildren(glyphCard, [advanceWidthLabel, halfSizeAdvanceWidthInput]);
		if (glyph?.shapes?.length) {
			addAsChildren(glyphCard, [bearingLabel, doubleBearingInput]);
		}
	} else {
		addAsChildren(glyphCard, [
			makeSingleLabel('name'),
			makeSingleInput(glyph, 'name', 'currentItem', 'input'),
		]);
	}
	if (glyph?.shapes?.length) {
		const showAsDisabled = !!getCurrentProjectEditor().multiSelect.shapes.length;
		addAsChildren(glyphCard, rowPad());
		addAsChildren(
			glyphCard,
			makeElement({ tag: 'h4', content: showAsDisabled ? 'Overall paths' : 'Bulk-edit paths' })
		);
		addAsChildren(glyphCard, makeInputs_position(glyph, '', [], showAsDisabled));
		addAsChildren(glyphCard, makeInputs_size(glyph, showAsDisabled));
	}
	addAsChildren(glyphCard, rowPad());
	addAsChildren(glyphCard, makeActionsArea_Universal());
	addAsChildren(glyphCard, makeActionsArea_Glyph());
	// log(`returning:`);
	// log(glyphCard);
	// log(`makeCard_glyphAttributes`, 'end');
	return glyphCard;
}

export function makeCard_glyphLinks(item) {
	// log(`makeCard_glyphLinks`, 'start');
	// log(`item.id: ${item.id}`);

	// log(item.usedIn);
	if (!item?.usedIn?.length) {
		// log(`makeCard_glyphLinks`, 'end');
		return '';
	}
	let linksCard = makeElement({
		tag: 'div',
		className: 'panel__card full-width item-links__rows-area',
		innerHTML: `
		<h3>Links</h3>
		This ${item.displayType} is linked to the following items.
		It is used as a component root and will show up in these items as a component instance.
		`,
	});

	item.usedIn.forEach((itemID) => {
		// log(`appending card for ${itemID}`);
		linksCard.appendChild(makeLinkReferenceRow(itemID));
	});

	getCurrentProjectEditor().subscribe({
		topic: 'currentItem',
		subscriberID: 'ItemLinkRow',
		callback: () => {
			// log(`ItemLinkRow SUBSCRIBER CALLBACK`, 'start');
			const editor = getCurrentProjectEditor();
			const project = getCurrentProject();
			const thumbs = document.querySelectorAll('.item-link__thumbnail');
			thumbs.forEach((thumb) => {
				const targetID = thumb.getAttribute('target-item-id');
				// log(`targetID: ${targetID}`);
				const targetItem = editor.project.getItem(targetID);
				thumb.innerHTML = project.makeItemThumbnail(targetItem);
			});
			// log(`ItemLinkRow SUBSCRIBER CALLBACK`, 'end');
		},
	});

	// log(`makeCard_glyphLinks`, 'end');
	return linksCard;
}

export function makeCard_itemNavigation(item) {
	const project = getCurrentProject();
	const editor = getCurrentProjectEditor();
	const isKern = item?.id?.startsWith('kern');

	let wrapper = makeElement({
		tag: 'div',
		className: 'panel__card no-card',
		style: 'grid-template-columns: max-content 1fr max-content;',
	});

	// previous Item
	let previousItem = getAdjacentItem(item, -1);
	let previousItemName = editor.project.getItemName(previousItem.id, true);
	let previousButton = makeElement({
		tag: 'fancy-button',
		className: 'thumbnail-button button-left',
		attributes: { minimal: '' },
		title: `Navigate to:\n${previousItemName}\n${previousItem.id}`,
	});

	if (isKern) previousButton.innerHTML += '<div>&#x2b60;</div>';
	else previousButton.innerHTML += project.makeItemThumbnail(previousItem, 24);
	previousButton.innerHTML += '<span>Previous&nbsp;item</span>';
	previousButton.addEventListener('click', () => {
		editor.selectedItemID = previousItem.id;
		editor.history.addState(`Navigated to ${previousItemName}`);
	});

	// next Item
	let nextItem = getAdjacentItem(item, 1);
	let nextItemName = editor.project.getItemName(nextItem.id, true);
	let nextButton = makeElement({
		tag: 'fancy-button',
		className: 'thumbnail-button button-right',
		attributes: { minimal: '' },
		title: `Navigate to:\n${nextItemName}\n${nextItem.id}`,
	});

	nextButton.innerHTML += '<span>Next&nbsp;item</span>';
	if (isKern) nextButton.innerHTML += '<div>&#x2b62;</div>';
	else nextButton.innerHTML += project.makeItemThumbnail(nextItem, 24);
	nextButton.addEventListener('click', () => {
		editor.selectedItemID = nextItem.id;
		editor.history.addState(`Navigated to ${nextItemName}`);
	});

	addAsChildren(wrapper, [previousButton, textToNode('<span></span>'), nextButton]);

	return wrapper;
}

export function getAdjacentItem(item, delta) {
	const project = getCurrentProject();
	const thisID = item.id;

	let collection = {};
	if (item?.id?.startsWith('glyph-')) collection = project.glyphs;
	else if (item?.id?.startsWith('liga-')) collection = project.ligatures;
	else if (item?.id?.startsWith('comp-')) collection = project.components;
	else if (item?.id?.startsWith('kern-')) collection = project.kerning;

	let allIDs = Object.keys(collection);
	allIDs.sort();
	if (item?.id?.startsWith('glyph-')) allIDs = allIDs.filter(isInEnabledRange);
	// log(`\n⮟allIDs⮟`);
	// log(allIDs);

	const thisIndex = allIDs.indexOf(thisID);
	const newID = allIDs.at((thisIndex + delta) % allIDs.length);

	return project.getItem(newID);
}

export function isInEnabledRange(itemID) {
	// log(`isInEnabledRange`, 'start');
	const project = getCurrentProject();
  const hex = Number(itemID.substring(6));
	let result = false;
	let enabledRanges = project.settings.project.characterRanges.filter((range) => range.enabled);

	for (let r = 0; r < enabledRanges.length; r++) {
		let range = enabledRanges[r];
    if (hex >= range.begin && hex <= range.end) {
			result = true;
			break;
		}
	}

	// log(`isInEnabledRange: ${itemID} : ${result}`);
	// log(`isInEnabledRange`, 'end');
	return result;
}
