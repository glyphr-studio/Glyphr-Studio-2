import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { decToHex, validateAsHex } from '../common/character_ids.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { showError, showToast } from '../controls/dialogs/dialogs.js';
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
	glyphChanged,
	insertComponentInstance,
	removeLinkFromUsedIn,
} from '../project_editor/cross_item_actions.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { addCharacterRangeToCurrentProject } from './settings_project.js';

/**
 * Page > Global Actions
 * Various actions that can be applied to all glyphs
 */

export function makePage_GlobalActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Global actions' })}
				</div>
				<div id="content-page__panel">
					<span class="panel__card full-width">
						Global Actions are actions that affect many glyphs at once.
						Actions taken here will not carry forward to glyphs that haven't been created yet.
						<br><br>
						Have an idea for a new global action?  They are easy for us to add - email us your idea!
						<a href="mailto:mail@glyphrstudio.com">mail@glyphrstudio.com</a>
					</span>
				</div>
			</div>
			<div class="content-page__right-area">
			</div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const rightArea = content.querySelector('.content-page__right-area');
	rightArea.innerHTML += ``;

	addAsChildren(rightArea, [
		makeElement({ tag: 'h1', content: 'Move and resize' }),
		makeCard_Move(),
		makeCard_ScaleHorizontal(),
		makeCard_ScaleVertical(),
		makeCard_Resize(),
		makeCard_Flatten(),
		makeCard_SideBearings(),
		makeCard_Round(),
		makeElement({ tag: 'h1', content: 'Font types' }),
		makeCard_Monospace(),
		makeCard_AllCaps(),
		makeElement({ tag: 'h1', content: 'Diacritics' }),
		makeCard_Diacritics(),
		makeCard_DiacriticsAdvanced(),
	]);

	return content;
}

//	------------------
//	Glyph Iterator
//	------------------

function glyphIterator(oa) {
	// log(`glyphIterator`, 'start');
	// log(oa);

	const project = getCurrentProject();
	let listOfItemIDs = [];
	let itemNumber = 0;
	let title = oa.title || 'Iterating on Glyph';
	let filter = () => {
		return true;
	};
	let callback = oa.callback || false;
	let currentItem, currentItemID;

	// Translate range notation to filter function
	if (oa.filter) {
		if (oa.filter.begin && oa.filter.end) {
			let begin = parseInt(oa.filter.begin);
			let end = parseInt(oa.filter.end);
			let itemIntegerID;

			filter = (itemID) => {
				if (itemID.startsWith('glyph-')) {
					itemIntegerID = parseInt(itemID.substring(6), 16);
					return itemIntegerID >= begin && itemIntegerID <= end;
				} else {
					return false;
				}
			};
		} else {
			filter = oa.filter;
		}
	}

	// Functions

	function processOneItem() {
		// log(`glyphIterator>processOneItem`, 'start');
		let failures = [];
		// log(`itemNumber: ${itemNumber}`);
		currentItemID = listOfItemIDs[itemNumber];
		currentItem = project.getItem(currentItemID, true);
		// log(`Got glyph: ${currentItem.name}`);

		showToast(title + '<br>' + currentItem.name, 10000);

		try {
			oa.action(currentItem, currentItemID);
			glyphChanged(currentItem);
		} catch (error) {
			failures.push({
				itemID: currentItemID,
				item: currentItem,
				error: error.message,
			});
		}

		if (itemNumber < listOfItemIDs.length - 1) {
			itemNumber++;
			setTimeout(processOneItem, 10);
		} else {
			showToast(title + '<br>Done!', 1000);
			if (failures.length) {
				showError(`Some items were skipped due to errors. Check the browser console for more information.`);
				console.warn(`\n⮟Global Action failures⮟`);
				console.warn(failures);
			}
			getCurrentProjectEditor().history.addWholeProjectChangePreState(
				`Global action: ${title.replace('ing', 'ed')} (${listOfItemIDs.length} items)`
			);
			if (callback) callback();
		}
		// log(`glyphIterator>processOneItem`, 'end');
	}

	function makeItemList() {
		// Components
		Object.keys(project.components).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// Ligatures
		Object.keys(project.ligatures).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// Glyphs
		Object.keys(project.glyphs).forEach((id) => {
			if (filter(id)) listOfItemIDs.push(id);
		});

		// log('item list');
		// log(listOfItemIDs);
		getCurrentProjectEditor().history.addWholeProjectChangePostState();
		// Kick off the process
		setTimeout(processOneItem, 10);
	}

	// Do Stuff

	showToast(title + '<br>Starting...', 10000);
	setTimeout(makeItemList, 500);
	// log(`glyphIterator`, 'end');
}

// --------------------------------------------------------------
// Move
// --------------------------------------------------------------

function makeCard_Move() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Move all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a positive or negative X and/or Y value, all the glyphs in this font will have their position updated by the specified number of Em units.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will be moved. To avoid double-moving Component Instances (since they inherit their position from Components) this algorithm will look into each Glyph or Ligature or Component and move each shape the specified amount as long as that shape is not a Component Instance.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="moveX">X&nbsp;move:</label>
			<input-number id="moveX" value="0"></input-number>
			<pre title="Expected value type">Em</pre>
			<label for="moveY">Y&nbsp;move:</label>
			<input-number id="moveY" value="0"></input-number>
			<pre title="Expected value type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Move all glyphs' });
	button.addEventListener('click', () => {
		let moveX = document.getElementById('moveX').value;
		let moveY = document.getElementById('moveY').value;

		moveX = parseFloat(moveX) || 0;
		moveY = parseFloat(moveY) || 0;

		glyphIterator({
			title: 'Moving glyph',
			action: function (glyph) {
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

function makeCard_ScaleVertical() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Vertically scale all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a multiplier, scale all the glyph shapes in the vertical direction. Entering <code>1</code> will result in no change, between zero and one will scale down the height, and above one will increase the height.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will have a new height calculated based on the overall height of the shapes in that glyph (not the ascender or descender values from the font). The new height will be applied, and the shapes will be moved to maintain a common baseline.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="scaleVertical">Scale&nbsp;value:</label>
			<input-number id="scaleVertical" type="number" value="1"></input-number>
			<pre title="Expected value type">Scale factor</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', () => {
		let scaleVertical = document.getElementById('scaleVertical').value;
		scaleVertical = parseFloat(scaleVertical) || 1;

		glyphIterator({
			title: 'Vertically scaling glyph',
			action: function (glyph) {
				if (!glyph.shapes || !glyph.shapes.length) return;
				let newHeight = (glyph.maxes.yMax - glyph.maxes.yMin) * scaleVertical;
				glyph.setGlyphSize({
					height: newHeight,
					updateComponentInstances: false,
					transformOrigin: 'baseline-left',
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

function makeCard_ScaleHorizontal() {
	const card = makeElement({ className: 'global-actions__card' });
	card.appendChild(makeElement({ tag: 'h2', content: 'Horizontally scale all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a multiplier, scale all the glyph shapes in the horizontal direction. Entering <code>1</code> will result in no change, between zero and one will reduce the width, and above one will increase the width. Optionally scale the advance width of the glyph as well.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will have a new width calculated based on the overall width of the shapes in that glyph (not the advance width of the glyph). The new width will be applied.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="scaleHorizontal">Scale&nbsp;value:</label>
			<input-number id="scaleHorizontal" type="number" value="1"></input-number>
			<pre title="Expected value type">Scale factor</pre>
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

	let button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', () => {
		let scaleHorizontal = document.getElementById('scaleHorizontal').value;
		scaleHorizontal = parseFloat(scaleHorizontal) || 1;
		let updateAdvanceWidth = document.getElementById('scaleHorizontalUpdateAdvanceWidth').checked;

		glyphIterator({
			title: 'Horizontally scaling glyph',
			action: function (glyph) {
				if (!glyph.shapes || !glyph.shapes.length) return;
				let newWidth = (glyph.maxes.xMax - glyph.maxes.xMin) * scaleHorizontal;
				glyph.setGlyphSize({
					width: newWidth,
					updateComponentInstances: false,
					transformOrigin: 'baseline-left',
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

function makeCard_Resize() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Re-size all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a positive or negative Width and/or Height value, all the glyphs in this font will have their size updated by the specified number of Em units.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will be re-sized. To avoid double-re-sizing Component Instances (since they inherit their size from Components) this algorithm will look into each Glyph or Ligature or Component and re-size each shape as long as that shape is not a Component Instance.<br><br><b>WARNING</b>: Re-sizing component instances will almost always <b>not</b> turn out the way you want. Due to the nature of Components and Component Instances, and their aspect ratios vs. their parent glyphs, it is impossible to "do the right thing" in all cases.`,
	});
	card.appendChild(effect);

	let table = makeElement({
		className: 'settings-table',
		innerHTML: `
			<label for="resizeWidth">&#916;&nbsp;Width:</label>
			<input-number id="resizeWidth" type="number" value="0"></input-number>
			<pre title="Expected value type">Em</pre>

			<label for="resizeHeight">&#916;&nbsp;Height:</label>
			<input-number id="resizeHeight" type="number" value="0"></input-number>
			<pre title="Expected value type">Em</pre>
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

	let button = makeElement({ tag: 'fancy-button', content: 'Re-size all glyphs' });
	button.addEventListener('click', () => {
		// log('updateAllGlyphSizesByEm', 'start');
		let resizeW = document.getElementById('resizeWidth').value;
		let resizeH = document.getElementById('resizeHeight').value;
		let ratio = document.getElementById('resizeMaintainAspectRatio').checked;
		let updateAdvanceWidth = document.getElementById('resizeUpdateAdvanceWidth').checked;

		resizeW = parseFloat(resizeW) || 0;
		resizeH = parseFloat(resizeH) || 0;

		if (ratio && !resizeH && !resizeW) {
			// For ratio lock to work, one delta value has to be zero
			// Let's just choose width so we can still do scaleH calculations
			resizeW = 0;
		}
		// log(`after sanitizing - resizeW: ${resizeW}, resizeH: ${resizeH}, ratio lock: ${ratio}`);

		glyphIterator({
			title: 'Re-sizing glyph',
			action: function (glyph) {
				if (!glyph.shapes || !glyph.shapes.length) return;
				glyph.updateGlyphSize({
					width: resizeW,
					height: resizeH,
					ratioLock: ratio,
					transformOrigin: 'baseline-left',
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

function makeCard_Flatten() {
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
			action: function (workingItem) {
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

function makeCard_SideBearings() {
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
			<pre title="Expected value type">Em</pre>
			<label for="sideBearingRight">
				<input type="checkbox" style="position: relative; top: 5px;" id="sideBearingRightCheckbox">
				&nbsp;Right&nbsp;Side&nbsp;Bearing:
			</label>
			<input-number id="sideBearingRight" type="number" value="0"></input-number>
			<pre title="Expected value type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Update Side Bearings' });
	button.addEventListener('click', () => {
		// log('updateSideBearings', 'start');
		let left = document.getElementById('sideBearingLeft').getAttribute('value');
		let leftCheckbox = document.getElementById('sideBearingLeftCheckbox').checked;
		left = parseFloat(left);
		// log(`left input: ${left}`);
		let right = document.getElementById('sideBearingRight').getAttribute('value');
		let rightCheckbox = document.getElementById('sideBearingRightCheckbox').checked;
		right = parseFloat(right);
		// log(`right input: ${right}`);

		if (leftCheckbox || rightCheckbox) {
			if (isNaN(left) || isNaN(right)) {
				showToast('Side Bearing values must be numbers.');
			} else {
				glyphIterator({
					title: 'Updating Side Bearings',
					filter: function (itemID) {
						return itemID.startsWith('glyph-') || itemID.startsWith('liga-');
					},
					action: function (glyph) {
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

function makeCard_Round() {
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
			action: function (workingItem) {
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

function makeCard_Monospace() {
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
			<pre title="Expected value type">Em</pre>
		`,
	});
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to Monospace' });
	button.addEventListener('click', () => {
		// log('convertProjectToMonospace', 'start');
		let width = document.getElementById('monospaceWidth').getAttribute('value');
		width = parseFloat(width);
		// log(`width input: ${width}`);

		if (isNaN(width) || width === 0) {
			// log(`width is NaN or zero`);
			showToast('Monospace width must be<br>a number greater than zero');
		} else {
			glyphIterator({
				title: 'Converting to Monospace',
				filter: function (itemID) {
					return itemID.startsWith('glyph-') || itemID.startsWith('liga-');
				},
				action: function (glyph) {
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

function makeCard_AllCaps() {
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
			'Capital letters will be added as Component Instances to their lowercase counterparts in the selected ranges.',
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
				filter: { begin: range.begin, end: range.end },
				action: function (item, itemID) {
					// log(`glyphIterator>ConvertToAllCaps>Action`, 'start');
					let destinationItemHex = findMappedValue(unicodeLowercaseMap, itemID.substring(6));
					// log(`destinationItemHex: ${destinationItemHex}`);
					destinationItemHex = decToHex(parseInt(destinationItemHex));
					// log(`destinationItemHex: ${destinationItemHex}`);
					if (destinationItemHex) {
						insertComponentInstance(itemID, `glyph-${destinationItemHex}`, false);
					}
					// log(`glyphIterator>ConvertToAllCaps>Action`, 'end');
				},
				callback: callback,
			});
		}

		// Basic Latin range
		if (document.getElementById('allCapsBasic').checked) {
			// log(`Converting range: allCapsBasic`);
			let range = getUnicodeBlockByName('Basic Latin');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin-1 Supplement range
		if (document.getElementById('allCapsSupplement').checked) {
			// log(`Converting range: allCapsSupplement`);
			let range = getUnicodeBlockByName('Latin-1 Supplement');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		if (document.getElementById('allCapsLatinA').checked) {
			// log(`Converting range: allCapsLatinA`);
			let range = getUnicodeBlockByName('Latin Extended-A');
			addCharacterRangeToCurrentProject(range);
			await convertRangeToAllCaps(range);
		}

		// Latin Extended-A range
		if (document.getElementById('allCapsLatinB').checked) {
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

function makeCard_Diacritics() {
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
		let currentItemHex = decToHex(range.begin);
		let sourceArray;
		// const project = getCurrentProject();

		function processOneDiacriticItem() {
			// log(`processOneDiacriticItem - currentItemHex = ${currentItemHex}`);
			sourceArray = findMappedValue(unicodeDiacriticsMapSimple, currentItemHex);
			let currentItemID = `glyph-${currentItemHex}`;

			if (sourceArray) {
				showToast(`Adding diacritical ${currentItemHex}`, 10000);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[0])}`, currentItemID, true);
				insertComponentInstance(`glyph-${validateAsHex(sourceArray[1])}`, currentItemID, false);
			}

			currentItemHex++;

			if (currentItemHex <= range.end) {
				currentItemHex = decToHex(currentItemHex);
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

function makeCard_DiacriticsAdvanced() {
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
		let range = { begin: rangeSupplement.begin, end: rangeExtendedA.end };
		let currentItemHex = decToHex(range.begin);
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

			currentItemHex++;

			if (currentItemHex <= range.end) {
				currentItemHex = decToHex(currentItemHex);
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
