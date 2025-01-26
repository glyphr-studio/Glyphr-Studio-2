import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { decToHex, validateAsHex } from '../common/character_ids.js';
import { makeElement } from '../common/dom.js';
import { remove } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { getUnicodeBlockByName } from '../lib/unicode/unicode_blocks.js';
import {
	findMappedValue,
	unicodeDiacriticsMapAdvanced,
	unicodeDiacriticsMapSimple,
	unicodeLowercaseMap,
} from '../lib/unicode/unicode_mappings.js';
import { copyShapesFromTo } from '../panels/actions.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import {
	getComponentInstancesFromRoot,
	insertComponentInstance,
	removeLinkFromUsedIn,
} from '../project_editor/cross_item_actions.js';
import { glyphIterator } from './global_actions.js';
import { addCharacterRangeToCurrentProject } from './settings_project.js';

// --------------------------------------------------------------
// Move
// --------------------------------------------------------------
/**
 * Makes the content for the Move global action card.
 * @returns {Element}
 */
export function makeCard_Move() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Move all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a positive or negative X and/or Y value, all the glyphs in this font will have their position updated by the specified number of Em units.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will be moved.
		<br>
		<strong>Note:</strong> Component Instances that are linked to Items that are also moved will be skipped. If a Component Root and an Item that contains a Component Instance are both moved, the Component Instance would have been moved twice.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="moveX">X&nbsp;move:</label>
			<input-number id="moveX" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
			<label for="moveY">Y&nbsp;move:</label>
			<input-number id="moveY" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
		`,
	});
	card.appendChild(table);

	const button = makeElement({ tag: 'fancy-button', content: 'Move all glyphs' });
	button.addEventListener('click', () => {
		/**@type {HTMLInputElement} */
		const moveXInput = document.querySelector('#moveX');
		const moveX = parseFloat(moveXInput.value) || 0;
		/**@type {HTMLInputElement} */
		const moveYInput = document.querySelector('#moveY');
		const moveY = parseFloat(moveYInput.value) || 0;

		glyphIterator({
			title: 'Moving glyph',
			action: (glyph) => {
				if (!glyph.shapes || !glyph.shapes.length) return;
				glyph.shapes.forEach((shape) => {
					if (shape.objType !== 'ComponentInstance') {
						shape.updateShapePosition(moveX, moveY);
						glyph.changed();
					}
				});
			},
		});
	});

	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Scale Vertical
// --------------------------------------------------------------
/**
 * Makes the content for the Scale Vertical global action card.
 * @returns {Element}
 */
export function makeCard_ScaleVertical() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Vertically scale all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a multiplier, scale all the glyph shapes in the vertical direction. Entering <code>1</code> will result in no change, between zero and one will scale down the height, and above one will increase the height.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will have a new height calculated based on the overall height of the shapes in that glyph (not the ascender or descender values from the font). The new height will be applied, and the shapes will be moved to maintain a common baseline.
		<br>
		<strong>Note:</strong> Component Instances that are linked to Items that are also re-sized will be skipped. If a Component Root and an Item that contains a Component Instance are both re-sized, the Component Instance would have been re-sized twice.`,
	});
	card.appendChild(effect);

	const table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="scaleVertical">Scale&nbsp;value:</label>
			<input-number id="scaleVertical" type="number" value="1"></input-number>
			<pre title="Expected value type" class="value-type">Scale factor</pre>
		`,
	});
	card.appendChild(table);

	const button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', () => {
		/** @type {HTMLInputElement} */
		const scaleVerticalInput = document.querySelector('#scaleVertical');
		const scaleVertical = parseFloat(scaleVerticalInput.value) || 1;

		glyphIterator({
			title: 'Vertically scaling glyph',
			action: (glyph, otherScaledItems) => {
				if (!glyph.shapes || !glyph.shapes.length) return;
				const newHeight = (glyph.maxes.yMax - glyph.maxes.yMin) * scaleVertical;
				glyph.setGlyphSize({
					height: newHeight,
					transformOrigin: 'baseline-left',
					instanceIDsToSkip: otherScaledItems,
				});
			},
		});
	});

	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Scale Horizontal
// --------------------------------------------------------------
/**
 * Makes the content for the Scale Horizontal global action card.
 * @returns {Element}
 */
export function makeCard_ScaleHorizontal() {
	const card = makeElement({ className: 'global-actions__card' });
	card.appendChild(makeElement({ tag: 'h2', content: 'Horizontally scale all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a multiplier, scale all the glyph shapes in the horizontal direction. Entering <code>1</code> will result in no change, between zero and one will reduce the width, and above one will increase the width. Optionally scale the advance width of the glyph as well.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will have a new width calculated based on the overall width of the shapes in that glyph (not the advance width of the glyph). The new width will be applied.
		<br>
		<strong>Note:</strong> Component Instances that are linked to Items that are also re-sized will be skipped. If a Component Root and an Item that contains a Component Instance are both re-sized, the Component Instance would have been re-sized twice.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="scaleHorizontal">Scale&nbsp;value:</label>
			<input-number id="scaleHorizontal" type="number" value="1"></input-number>
			<pre title="Expected value type" class="value-type">Scale factor</pre>
		`,
	});
	card.appendChild(table);
	table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<span><input id="scaleHorizontalUpdateAdvanceWidth" type="checkbox" checked></span>
			<label for="scaleHorizontalUpdateAdvanceWidth">Scale the item's advance width property</label>
		`,
	});
	card.appendChild(table);

	const button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', () => {
		/** @type {HTMLInputElement} */
		const scaleHorizontalInput = document.querySelector('#scaleHorizontal');
		const scaleHorizontal = parseFloat(scaleHorizontalInput.value) || 1;

		/** @type {HTMLInputElement} */
		const updateAdvanceWidthBox = document.querySelector('#scaleHorizontalUpdateAdvanceWidth');
		const updateAdvanceWidth = updateAdvanceWidthBox.checked;

		glyphIterator({
			title: 'Horizontally scaling glyph',
			action: (glyph, otherScaledItems) => {
				if (!glyph.shapes || !glyph.shapes.length) return;
				let newWidth = (glyph.maxes.xMax - glyph.maxes.xMin) * scaleHorizontal;
				glyph.setGlyphSize({
					width: newWidth,
					transformOrigin: 'baseline-left',
					instanceIDsToSkip: otherScaledItems,
				});
				if (updateAdvanceWidth) glyph.advanceWidth = glyph.advanceWidth * scaleHorizontal;
			},
		});
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Resize
// --------------------------------------------------------------
/**
 * Makes the content for the Resize global action card.
 * @returns {Element}
 */
export function makeCard_Resize() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Re-size all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a positive or negative Width and/or Height value, all the glyphs in this font will have their size updated by the specified number of Em units.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will be re-sized.
		<br>
		<strong>Note:</strong> Component Instances that are linked to Items that are also re-sized will be skipped. If a Component Root and an Item that contains a Component Instance are both re-sized, the Component Instance would have been re-sized twice.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="resizeWidth">&#916;&nbsp;Width:</label>
			<input-number id="resizeWidth" type="number" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>

			<label for="resizeHeight">&#916;&nbsp;Height:</label>
			<input-number id="resizeHeight" type="number" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
		`,
	});
	card.appendChild(table);
	table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<span><input id="resizeUpdateAdvanceWidth" type="checkbox" checked></span>
			<label for="resizeUpdateAdvanceWidth">Update the item's advance width property</label>
			<span>&nbsp;</span>

			<span><input id="resizeMaintainAspectRatio" type="checkbox"></span>
			<label for="resizeMaintainAspectRatio">Maintain aspect ratio (<i>leave either &#916;&nbsp;Width or &#916;&nbsp;Height as zero</i>)</label>
			<span>&nbsp;</span>
		`,
	});
	card.appendChild(table);

	const button = makeElement({ tag: 'fancy-button', content: 'Re-size all glyphs' });
	button.addEventListener('click', () => {
		// log('updateAllGlyphSizesByEm', 'start');
		/** @type {HTMLInputElement} */
		const resizeWInput = document.querySelector('#resizeWidth');
		let resizeW = parseFloat(resizeWInput.value) || 0;

		/** @type {HTMLInputElement} */
		const resizeHInput = document.querySelector('#resizeHeight');
		const resizeH = parseFloat(resizeHInput.value) || 0;

		/** @type {HTMLInputElement} */
		const ratioBox = document.querySelector('#resizeMaintainAspectRatio');
		const ratio = ratioBox.checked;

		/** @type {HTMLInputElement} */
		const updateAdvanceWidthBox = document.querySelector('#resizeUpdateAdvanceWidth');
		const updateAdvanceWidth = updateAdvanceWidthBox.checked;

		if (ratio && !resizeH && !resizeW) {
			// For ratio lock to work, one delta value has to be zero
			// Let's just choose width so we can still do scaleH calculations
			resizeW = 0;
		}
		// log(`after sanitizing - resizeW: ${resizeW}, resizeH: ${resizeH}, ratio lock: ${ratio}`);

		glyphIterator({
			title: 'Re-sizing glyph',
			action: (glyph, otherResizedItems) => {
				if (!glyph.shapes || !glyph.shapes.length) return;
				glyph.updateGlyphSize({
					width: resizeW,
					height: resizeH,
					ratioLock: ratio,
					transformOrigin: 'baseline-left',
					instanceIDsToSkip: otherResizedItems,
				});
				if (updateAdvanceWidth) glyph.advanceWidth += resizeW;
			},
		});

		// log('updateAllGlyphSizesByEm', 'end');
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Flatten
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
// Side Bearings
// --------------------------------------------------------------
/**
 * Makes the content for the Side Bearings global action card.
 * @returns {Element}
 */
export function makeCard_SideBearings() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Side bearings' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Side Bearing is the empty space around a glyph's shapes. The Left Side Bearing is the space between x=0 to the leftmost side of the glyph shapes. The Right Side Bearing is the distance between the rightmost side of the glyph shapes and the advance width. Side Bearings will probably have to be adjusted for each glyph in order for it to work well... but this action could be useful if you want to re-set all Side Bearings to some common value.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Each ligature and glyph will have their shapes moved and/or their advance width updated to create the specified side bearing widths.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="sideBearingLeft">
				<input type="checkbox" style="position: relative; top: 5px;" id="sideBearingLeftCheckbox">
				&nbsp;Left&nbsp;Side&nbsp;Bearing:
			</label>
			<input-number id="sideBearingLeft" type="number" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
			<label for="sideBearingRight">
				<input type="checkbox" style="position: relative; top: 5px;" id="sideBearingRightCheckbox">
				&nbsp;Right&nbsp;Side&nbsp;Bearing:
			</label>
			<input-number id="sideBearingRight" type="number" value="0"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Update Side Bearings' });
	button.addEventListener('click', () => {
		// log('updateSideBearings', 'start');
		/** @type {HTMLInputElement} */
		const leftInput = document.querySelector('#sideBearingLeft');
		const left = parseFloat(leftInput.value);
		// log(`left input: ${left}`);

		/** @type {HTMLInputElement} */
		const leftCheckboxBox = document.querySelector('#sideBearingLeftCheckbox');
		let leftCheckbox = leftCheckboxBox.checked;

		/** @type {HTMLInputElement} */
		const rightInput = document.querySelector('#sideBearingRight');
		const right = parseFloat(rightInput.value);
		// log(`right input: ${right}`);

		/** @type {HTMLInputElement} */
		const rightCheckboxBox = document.querySelector('#sideBearingRightCheckbox');
		let rightCheckbox = rightCheckboxBox.checked;

		if (leftCheckbox || rightCheckbox) {
			if (isNaN(left) || isNaN(right)) {
				showToast('Side Bearing values must be numbers.');
			} else {
				glyphIterator({
					title: 'Updating Side Bearings',
					includeComponents: false,
					action: (glyph) => {
						if (glyph.shapes.length) {
							if (leftCheckbox && !isNaN(left)) {
								glyph.leftSideBearing = left;
								getComponentInstancesFromRoot(glyph).forEach((instance) => {
									instance.translateX -= left;
								});
							}
							if (rightCheckbox && !isNaN(right)) glyph.rightSideBearing = right;
						}
					},
				});
			}
		} else {
			showToast('Select a checkbox to enable Left and/or Right Side Bearings.');
		}

		// log('updateSideBearings', 'end');
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
// Monospace
// --------------------------------------------------------------
/**
 * Makes the content for the Monospace global action card.
 * @returns {Element}
 */
export function makeCard_Monospace() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Monospace font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Monospace fonts are fonts where each glyph has the same width. This is useful for coding fonts, and fonts used for textual output. The width value must be greater than zero.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Each ligature and glyph's advance width property will be set to the value provided.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="monospaceWidth">Glyph&nbsp;Width:</label>
			<input-number id="monospaceWidth" type="number" value="500"></input-number>
			<pre title="Expected value type" class="value-type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to Monospace' });
	button.addEventListener('click', () => {
		// log('convertProjectToMonospace', 'start');

		/** @type {HTMLInputElement} */
		const widthInput = document.querySelector('#monospaceWidth');
		const width = parseFloat(widthInput.value);
		// log(`width input: ${width}`);

		if (isNaN(width) || width === 0) {
			// log(`width is NaN or zero`);
			showToast('Monospace width must be<br>a number greater than zero');
		} else {
			glyphIterator({
				title: 'Converting to Monospace',
				includeComponents: false,
				action: (glyph) => {
					glyph.advanceWidth = width;
				},
			});
		}

		// log('convertProjectToMonospace', 'end');
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// All Caps
// --------------------------------------------------------------
/**
 * Makes the content for the All Caps global action card.
 * @returns {Element}
 */
export function makeCard_AllCaps() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'All-caps font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `All-caps fonts have no lowercase letters. To make things easy, the lowercase letters in these fonts contain duplicates of their uppercase form. Select the ranges where you would like to add uppercase Component Instances to lowercase letters.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content:
			'Capital letters will be added as Component Instances to their lowercase counterparts in the selected ranges. The lowercase letters will also have their Advance Width updated to match their uppercase counterparts.',
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<input type="checkbox" id="allCapsBasic" checked="true"/>
			<label for="allCapsBasic">Basic Latin</label>
			<span></span>
			<input type="checkbox" id="allCapsSupplement"/>
			<label for="allCapsSupplement">Latin Supplement</label>
			<span></span>
			<input type="checkbox" id="allCapsLatinA"/>
			<label for="allCapsLatinA">Latin Extended A</label>
			<span></span>
			<input type="checkbox" id="allCapsLatinB"/>
			<label for="allCapsLatinB">Latin Extended B</label>
			<span></span>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to All Caps' });
	button.addEventListener('click', async () => {
		// log('convertProjectToAllCaps', 'start');
		const project = getCurrentProject();

		async function convertRangeToAllCaps(range, callback) {
			// Make sure all glyphs exist
			for (let gid = range.begin; gid < range.end; gid++) {
				let itemID = `glyph-${decToHex(gid)}`;
				let item = project.getItem(itemID);
				if (!item) {
					project.addItemByType(new Glyph(), 'Glyph', itemID);
				}
			}

			glyphIterator({
				title: 'Converting ' + range.name + ' to All Caps',
				// filter: { begin: range.begin, end: range.end }, // TODO fix filtering
				action: (item) => {
					const hexID = Number(remove(item.id, 'glyph-'));
					if (range.isWithinRange(hexID)) {
						// log(`glyphIterator>ConvertToAllCaps>Action`, 'start');
						let destinationItemHex = findMappedValue(unicodeLowercaseMap, item.id.substring(6));
						// log(`destinationItemHex: ${destinationItemHex}`);
						destinationItemHex = decToHex(parseInt(destinationItemHex));
						// log(`destinationItemHex: ${destinationItemHex}`);
						if (destinationItemHex) {
							insertComponentInstance(item.id, `glyph-${destinationItemHex}`, true);
						}
						// log(`glyphIterator>ConvertToAllCaps>Action`, 'end');
					}
				},
				callback: callback,
			});
		}

		// Basic Latin range
		/** @type {HTMLInputElement} */
		const allCapsBasicBox = document.querySelector('#allCapsBasic');
		if (allCapsBasicBox.checked) {
			// log(`Converting range: allCapsBasic`);
			let range = getUnicodeBlockByName('Basic Latin');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin-1 Supplement range
		/** @type {HTMLInputElement} */
		const allCapsSupplementBox = document.querySelector('#allCapsSupplement');
		if (allCapsSupplementBox.checked) {
			// log(`Converting range: allCapsSupplement`);
			let range = getUnicodeBlockByName('Latin-1 Supplement');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		/** @type {HTMLInputElement} */
		const allCapsLatinABox = document.querySelector('#allCapsLatinA');
		if (allCapsLatinABox.checked) {
			// log(`Converting range: allCapsLatinA`);
			let range = getUnicodeBlockByName('Latin Extended-A');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		/** @type {HTMLInputElement} */
		const allCapsLatinBBox = document.querySelector('#allCapsLatinB');
		if (allCapsLatinBBox.checked) {
			// log(`Converting range: allCapsLatinB`);
			let range = getUnicodeBlockByName('Latin Extended-B');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// log('convertProjectToAllCaps', 'end');
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Diacritics
// --------------------------------------------------------------
/**
 * Makes the content for the Diacritics global action card.
 * @returns {Element}
 */
export function makeCard_Diacritics() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical glyph generator (basic)' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `The Latin Supplement character range is mostly made up of Latin-based diacritical (or accented) glyphs.  These are basically normal Latin glyphs, with accents.  Since most of the accents exist as stand-alone glyphs themselves in the Basic Latin range, diacritics in the Latin Supplement range are easy to create from merging two existing glyphs.<br><br><b>Please note</b> - The diacritical glyphs that are in the Basic Latin range are usually designed to be stand-alone. Simply combining them with base glyphs is a good start, but work will be needed to make the resulting character look nice. The "Advanced" Diacritical Glyph Generator below takes a little more work up front, but will probably yield better results.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `The Latin Supplement character range will be enabled, and diacritical glyphs will be assembled as Component Instances from their respective glyphs in the Basic Latin range.`,
	});
	card.appendChild(effect);

	let button = makeElement({ tag: 'fancy-button', content: 'Generate Diacritical Glyphs' });
	button.addEventListener('click', () => {
		let range = getUnicodeBlockByName('Latin-1 Supplement');
		let rangeBeginHex = '0x0';
		let currentItemDec = 0;
		if (range && range.begin) {
			rangeBeginHex = range.beginHex;
			currentItemDec = range.begin;
		}
		let currentItemHex = rangeBeginHex;
		let rangeEndDec = 0;
		if (range && range.end) rangeEndDec = Number(decToHex(range.end));
		let sourceArray;
		// const project = getCurrentProject();

		function processOneDiacriticItem() {
			// log(`processOneDiacriticItem - currentItemHex = ${currentItemHex}`);
			sourceArray = findMappedValue(unicodeDiacriticsMapSimple, '' + currentItemHex);
			let currentItemID = `glyph-${currentItemHex}`;

			if (sourceArray) {
				showToast(`Adding diacritical ${currentItemHex}`, 10000);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[0])}`, currentItemID, true);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[1])}`, currentItemID, false);
			}

			currentItemDec++;

			if (currentItemDec <= rangeEndDec) {
				currentItemDec = Number(currentItemHex);
				setTimeout(processOneDiacriticItem, 10);
			} else {
				showToast('Done!', 1000);
			}
		}

		showToast('Starting to assemble Diacritical Glyphs', 10000);

		addCharacterRangeToCurrentProject(range);

		setTimeout(processOneDiacriticItem, 500);
	});
	card.appendChild(button);

	return card;
}

// --------------------------------------------------------------
// Diacritics Advanced
// --------------------------------------------------------------
/**
 * Makes the content for the Diacritics Advanced global action card.
 * @returns {Element}
 */
export function makeCard_DiacriticsAdvanced() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical glyph generator (advanced)' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `The Latin Supplement and Latin Extended A character ranges are mostly made up of Latin-based diacritical glyphs.  There is also a character range called Combining Diacritical Marks <code>0x300</code> to <code>0x36F</code>. This range is designed to be used in combination with base glyphs from other ranges.  This action will combine glyphs from the Basic Latin range with their appropriate counterparts in the Combining Diacritical Marks range to yield the Latin Supplement and Latin Extended A ranges.<br><br><b>Before you begin</b> - Add the Combining Diacritical Marks range to your project, and design them.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `The Latin Supplement and Latin Extended A character ranges will be enabled, and diacritical glyphs will be assembled as Component Instances from their respective glyphs from Basic Latin and Combining Diacritical Marks ranges.`,
	});
	card.appendChild(effect);

	let button = makeElement({ tag: 'fancy-button', content: 'Generate Diacritical Glyphs' });
	button.addEventListener('click', () => {
		let project = getCurrentProject();
		let rangeSupplement = getUnicodeBlockByName('Latin-1 Supplement');
		addCharacterRangeToCurrentProject(rangeSupplement);
		let rangeExtendedA = getUnicodeBlockByName('Latin Extended-A');
		addCharacterRangeToCurrentProject(rangeExtendedA);
		let range = { begin: 0, end: 0 };
		if (rangeSupplement && rangeExtendedA)
			range = { begin: rangeSupplement.begin, end: rangeExtendedA.end };
		let currentItemDec = range.begin;
		/** @type {String} */
		let currentItemHex = decToHex(range.begin) || '0x0';
		let sourceArray;
		let targetCenter, currCenter;

		function processOneItem() {
			// log(`processOneItem - currentItemHex = ${currentItemHex}`);
			sourceArray = findMappedValue(unicodeDiacriticsMapAdvanced, currentItemHex);
			let currentItemID = `glyph-${currentItemHex}`;
			let sourceID1 = `glyph-${validateAsHex(sourceArray[0])}`;
			let sourceID2 = `glyph-${validateAsHex(sourceArray[1])}`;

			if (sourceArray) {
				showToast(`Adding diacritical ${currentItemHex}`, 10000);
				insertComponentInstance(sourceID1, currentItemID, true);
				insertComponentInstance(sourceID2, currentItemID, false);
				targetCenter = project.getItem(sourceID1).maxes.centerX;
				currCenter = project.getItem(sourceID2).maxes.centerX;
				project.getItem(currentItemID).shapes[1].updateShapePosition(targetCenter - currCenter, 0);
			}

			currentItemDec++;

			if (currentItemDec <= range.end) {
				currentItemHex = decToHex(currentItemDec) || '0x0';
				setTimeout(processOneItem, 10);
			} else {
				showToast('Done!', 1000);
			}
		}

		showToast('Starting to assemble Diacritical Glyphs', 10000);
		setTimeout(processOneItem, 500);
	});
	card.appendChild(button);

	return card;
}
