import { getCurrentProject } from '../app/main';
import { addAsChildren, makeElement } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator';

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
	// log('glyphIterator', 'start');
	// log('passed:\n ' + json(oa));

	const project = getCurrentProject();
	let listOfItemIDs = [];
	let itemNumber = 0;
	let title = oa.title || 'Iterating on Glyph';
	let filter =
		oa.filter ||
		(() => {
			return true;
		});
	let callback = oa.callback || false;
	let currentItem, currentItemID;

	// Translate range notation to filter function
	if (oa.filter && oa.filter.begin && oa.filter.end) {
		let begin = parseInt(oa.filter.begin);
		let end = parseInt(oa.filter.end);
		let itemIntegerID;

		filter = (itemID) => {
			if (itemID.startsWith('glyph-')) {
				itemIntegerID = parseInt(itemID, 16);
				return itemIntegerID >= begin && itemIntegerID <= end;
			} else {
				return false;
			}
		};
	}

	// Functions

	function processOneItem() {
		// log(`itemNumber: ${itemNumber}`);
		currentItemID = listOfItemIDs[itemNumber];
		currentItem = project.getItem(currentItemID, true);
		// log(`Got glyph: ${currentItem.name}`);

		showToast(title + '<br>' + currentItem.name, 10000);

		oa.action(currentItem, currentItemID);

		if (itemNumber < listOfItemIDs.length - 1) {
			itemNumber++;
			setTimeout(processOneItem, 10);
		} else {
			showToast(title + '<br>Done!', 1000);
			if (callback) callback();
		}
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

		// Kick off the process
		setTimeout(processOneItem, 10);
	}

	// Do Stuff

	showToast(title + '<br>Starting...', 10000);
	setTimeout(makeItemList, 500);
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

	let table = makeElement({ className: 'settings-table' });
	table.innerHTML += `
		<label for="moveX">X&nbsp;move:</label>
		<input-number id="moveX" value="0"></input-number>
		<pre title="Expected value type">Em</pre>
	`;
	table.innerHTML += `
		<label for="moveY">Y&nbsp;move:</label>
		<input-number id="moveY" value="0"></input-number>
		<pre title="Expected value type">Em</pre>
	`;
	card.appendChild(table);

	let button = makeElement({ tag: 'fancy-button', content: 'Move all glyphs' });
	button.addEventListener('click', updateAllGlyphPositions);
	card.appendChild(button);

	return card;
}

function updateAllGlyphPositions() {
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
		content: `Individual Glyphs, Ligatures, and Components will have
		a new height calculated based on the overall height of the shapes
		in that glyph (not the ascender or descender values from the font).
		The new height will be applied, and the shapes will be moved to
		maintain a common baseline.`,
	});
	card.appendChild(effect);

	let table = makeElement({ className: 'settings-table' });
	card.appendChild(table);
	`<label>Scale value: </label><input id="scaleh" type="number" value="1">`;

	let button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', scaleAllGlyphsVertically);
	card.appendChild(button);

	return card;
}

function scaleAllGlyphsVertically() {
	let scaleh = document.getElementById('scaleh').value;
	scaleh = parseFloat(scaleh) || 1;

	glyphIterator({
		title: 'Vertical scaling glyph',
		action: function (glyph) {
			if (!glyph.shapes || !glyph.shapes.length) return;
			let newHeight = (glyph.maxes.ymax - glyph.maxes.ymin) * scaleh;
			let newY = glyph.maxes.ymax * scaleh;
			glyph.setGlyphSize(false, newHeight, false);
			glyph.setGlyphPosition(false, newY, true);
		},
	});
}

// --------------------------------------------------------------
// Scale Horizontal
// --------------------------------------------------------------

function makeCard_ScaleHorizontal() {
	const card = makeElement({ className: 'global-actions__card' });
	card.appendChild(makeElement({ tag: 'h2', content: 'Horizontally scale all glyphs' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Given a multiplier, scale all the glyph shapes in the horizontal direction. Entering 1 will result in no change, between zero and one will reduce the width, and above one will increase the width. Optionally scale the advance width of the glyph as well.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Individual Glyphs, Ligatures, and Components will have a new width calculated based on the overall width of the shapes in that glyph (not the advance width of the glyph). The new width will be applied.`,
	});
	card.appendChild(effect);

	let table = makeElement({ className: 'settings-table' });
	card.appendChild(table);
	`<label>Scale value: </label><input id="scalew" type="number" value="1">`;
	`<input id="scaleupdatewidth" type="checkbox" checked><label>Update the glyph width property (when auto-calculate glyph width equals false)</label>`;

	let button = makeElement({ tag: 'fancy-button', content: 'Scale all glyphs' });
	button.addEventListener('click', scaleAllGlyphsHorizontally);
	card.appendChild(button);

	return card;
}

function scaleAllGlyphsHorizontally() {
	let scalew = document.getElementById('scalew').value;
	scalew = parseFloat(scalew) || 1;
	let scaleupdatew = document.getElementById('scaleupdatewidth').checked;

	glyphIterator({
		title: 'Horizontal scaling glyph',
		action: function (glyph) {
			if (!glyph.shapes || !glyph.shapes.length) return;
			let newWidth = (glyph.maxes.xmax - glyph.maxes.xmin) * scalew;
			let newX = glyph.maxes.xmin * scalew;
			glyph.setGlyphSize(newWidth, false, false);
			glyph.setGlyphPosition(newX, false, true);
			if (scaleupdatew) glyph.advanceWidth = glyph.advanceWidth * scalew;
		},
	});
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

	let table = makeElement({ className: 'settings-table' });
	card.appendChild(table);
	`&#916; Width: &nbsp;</td><td><input id="sizew" type="number" value="0"></td><td><span class="unit">(em units)</span>`;
	`&#916; Height: &nbsp;</td><td><input id="sizeh" type="number" value="0"></td><td><span class="unit">(em units)</span>`;
	`<tr><td class="uicolumn" style="width:20px;"><input id="updateglyphwidthproperty" type="checkbox" checked></td><td colspan="2" style="vertical-align:top;">Update the glyph width property (when auto-calculate glyph width equals false)`;
	`<tr><td class="uicolumn" style="width:20px;"><input id="maintainaspectratio" type="checkbox"></td><td colspan="2" style="vertical-align:top;">Maintain aspect ratio`;
	`<tr><td colspan="3">If checked, the width vs. height ratio of the re-sized glyphs will remain the same.<br>`;
	`<b>Leave either &#916; Width or &#916; Height as zero</b>`;

	let button = makeElement({ tag: 'fancy-button', content: 'Re-size all glyphs' });
	button.addEventListener('click', updateAllGlyphSizesByEm);
	card.appendChild(button);

	return card;
}

function updateAllGlyphSizesByEm() {
	// log('updateAllGlyphSizesByEm', 'start');

	let sizew = document.getElementById('sizew').value;
	let sizeh = document.getElementById('sizeh').value;
	let ratio = document.getElementById('maintainaspectratio').checked;
	let updatewidthprop = document.getElementById('updateglyphwidthproperty').checked;

	sizew = parseFloat(sizew) || 0;
	sizeh = parseFloat(sizeh) || 0;

	if (ratio && !sizeh && !sizew) {
		// For ratio lock to work, one delta value has to be zero
		// Let's just choose width for some reason
		sizew = 0;
	}

	// log(`after sanitizing - sizew: ${sizew}, sizeh: ${sizeh}, ratio lock: ${ratio}`);

	glyphIterator({
		title: 'Re-sizing glyph',
		action: function (glyph) {
			if (!glyph.shapes || !glyph.shapes.length) return;
			glyph.updateGlyphSize(sizew, sizeh, ratio, true);
			if (updatewidthprop) glyph.advanceWidth = glyph.advanceWidth * 1 + sizew * 1;
		},
	});

	// log('updateAllGlyphSizesByEm', 'end');
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
		content: 'Convert Component Instances to Shapes',
	});
	button.addEventListener('click', flattenAllWorkItems);
	card.appendChild(button);

	return card;
}

function flattenAllWorkItems() {
	glyphIterator({
		title: 'Converting Component Instances to Shapes',
		action: function (glyph) {
			glyph.flattenGlyph();
		},
	});
}

// --------------------------------------------------------------
// Monospace
// --------------------------------------------------------------

function makeCard_Monospace() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Monospace Font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `Monospace fonts are fonts where each glyph has the same width.  This is useful for coding fonts, and fonts used for textual output. The width value must be greater than zero.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `Each ligature and glyph's Auto Width property will be set to false, and it's width property will be set to the number provided.`,
	});
	card.appendChild(effect);

	let table = makeElement({ className: 'settings-table' });
	card.appendChild(table);
	`Glyph Width: &nbsp; <input id="monospacewidth" type="number" value="500"></td><td><span class="unit">(em units)</span>`;

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to Monospace' });
	button.addEventListener('click', convertProjectToMonospace);
	card.appendChild(button);

	return card;
}

function convertProjectToMonospace() {
	// log('convertProjectToMonospace', 'start');
	let gwidth = document.getElementById('monospacewidth').value * 1;
	// log(`gwidth input: ${gwidth}`);

	if (isNaN(gwidth) || gwidth === 0) {
		// log(`gwidth is NaN or zero`);
		showToast('Monospace width must be<br>a number greater than zero');
	} else {
		glyphIterator({
			title: 'Converting to Monospace',
			filter: function (itemID) {
				return itemID.startsWith('glyph') || itemID.startsWith('liga-');
			},
			action: function (glyph) {
				glyph.advanceWidth = gwidth;
			},
		});
	}

	// log('convertProjectToMonospace', 'end');
}

// --------------------------------------------------------------
// All Caps
// --------------------------------------------------------------

function makeCard_AllCaps() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'All Caps Font' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `All Caps fonts have no lowercase letters.  To make things easy, the lowercase letters in these fonts contain duplicates of their uppercase form.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content:
			'Capital letters will be added as Component Instances to their lowercase counterparts.',
	});
	card.appendChild(effect);

	let table = makeElement({ className: 'settings-table' });
	card.appendChild(table);
	`<input type="checkbox" id="allcapsbasic" checked="true"/></td><td><label for="allcapsbasic">Basic Latin</label>`;
	`<input type="checkbox" id="allcapssupplement"/></td><td><label for="allcapssupplement">Latin Supplement</label>`;
	`<input type="checkbox" id="allcapsa"/></td><td><label for="allcapsa">Latin Extended A</label>`;
	`<input type="checkbox" id="allcapsb"/></td><td><label for="allcapsb">Latin Extended B</label>`;

	let button = makeElement({ tag: 'fancy-button', content: 'Convert project to All Caps' });
	button.addEventListener('click', convertProjectToAllCaps);
	card.appendChild(button);

	return card;
}

function convertProjectToAllCaps() {
	// log('convertProjectToAllCaps', 'start');
	/*
	let copyGlyphAttributes = {
		srcAutoWidth: true,
		srcWidth: true,
		srcLSB: true,
		srcRSB: true,
	};
	let range = _UI.glyphrange;

	function convertRangeToAllCaps(begin, end, name, callback) {
		// Make sure all glyphs exist
		for (let gid = begin; gid < end; gid++) {
			getGlyph(decToHex(gid), true);
		}

		glyphIterator({
			title: 'Converting ' + name + ' to All Caps',
			filter: { begin: begin, end: end },
			action: function (glyph, itemID) {
				let destinationitemID = _UI.unicodeLowercaseMap[itemID];
				if (destinationitemID) {
					insertComponentInstance(itemID, destinationitemID, copyGlyphAttributes);
				}
			},
			callback: callback,
		});
	}

	// Basic Latin range
	function convertBasicLatinToAllCaps() {
		// log(`allcaps BASIC`);
		if (document.getElementById('allcapsbasic').checked) {
			project.projectsettings.glyphrange.basiclatin = true;
			convertRangeToAllCaps(
				range.basiclatin.begin,
				range.basiclatin.end,
				'Basic Latin',
				convertLatinSupplementToAllCaps
			);
		} else {
			convertLatinSupplementToAllCaps();
		}
	}

	// Basic Latin range
	function convertLatinSupplementToAllCaps() {
		// log(`allcaps SUPPLEMENT`);
		if (document.getElementById('allcapssupplement').checked) {
			project.projectsettings.glyphrange.latinsupplement = true;
			convertRangeToAllCaps(
				range.latinsupplement.begin,
				range.latinsupplement.end,
				'Latin Supplement',
				convertLatinextEndedAToAllCaps
			);
		} else {
			convertLatinextEndedAToAllCaps();
		}
	}

	// Basic Latin range
	function convertLatinextEndedAToAllCaps() {
		// log(`allcaps A`);
		if (document.getElementById('allcapsa').checked) {
			project.projectsettings.glyphrange.latinextendeda = true;
			convertRangeToAllCaps(
				range.latinextendeda.begin,
				range.latinextendeda.end,
				'Latin Extended A',
				convertLatinExtendedBToAllCaps
			);
		} else {
			convertLatinExtendedBToAllCaps();
		}
	}

	// Basic Latin range
	function convertLatinExtendedBToAllCaps() {
		// log(`allcaps B`);
		if (document.getElementById('allcapsb').checked) {
			project.projectsettings.glyphrange.latinextendedb = true;
			convertRangeToAllCaps(
				range.latinextendedb.begin,
				range.latinextendedb.end,
				'Latin Extended B'
			);
		}
	}

	// Start the roll through
	convertBasicLatinToAllCaps();

	_UI.history['glyph edit'].put('Convert project to All Caps');
	// log('convertProjectToAllCaps', 'end');
	*/
}

// --------------------------------------------------------------
// Diacritics
// --------------------------------------------------------------

function makeCard_Diacritics() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical Glyph Generator (basic)' }));

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
	button.addEventListener('click', generateDiacriticsSimple);
	card.appendChild(button);

	return card;
}

function generateDiacriticsSimple() {
	/*
	// log(`generateDiacriticsSimple', 'start');
	let copyGlyphAttributes = {
		srcAutoWidth: true,
		srcWidth: true,
		srcLSB: true,
		srcRSB: true,
	};
	let currentItemID = decToHex(_UI.glyphrange.latinsupplement.begin);
	let sourceArray;

	function processOneDiacriticItem() {
		// log(`processOneDiacriticItem - currentItemID = ${currentItemID}`);
		sourceArray = _UI.unicodeDiacriticsMapSimple[currentItemID];

		if (sourceArray) {
			showToast('Adding diacritical ' + currentItemID + '<br>' + getGlyphName(currentItemID), 10000);
			insertComponentInstance(sourceArray[0], currentItemID, copyGlyphAttributes);
			insertComponentInstance(sourceArray[1], currentItemID, false);
		}

		currentItemID++;

		if (currentItemID <= _UI.glyphrange.latinsupplement.end) {
			currentItemID = decToHex(currentItemID);
			setTimeout(processOneDiacriticItem, 10);
		} else {
			showToast('Done!', 1000);
			_UI.history['glyph edit'].put('Generate Diacritical glyphs');
		}
	}

	showToast('Starting to assemble Diacritical Glyphs', 10000);

	project.projectsettings.glyphrange.latinsupplement = true;

	setTimeout(processOneDiacriticItem, 500);
	*/
}

// --------------------------------------------------------------
// Diacritics Advanced
// --------------------------------------------------------------

function makeCard_DiacriticsAdvanced() {
	const card = makeElement({ className: 'global-actions__card' });

	card.appendChild(makeElement({ tag: 'h2', content: 'Diacritical Glyph Generator (advanced)' }));

	let description = makeElement({
		className: 'global-actions__description',
		content: `The Latin Supplement and Latin Extended A character ranges are mostly made up of Latin-based diacritical glyphs.  There is also a character range called Combining Diacritical Marks <code>0x0300</code> to <code>0x036F</code>. This range is designed to be used in combination with base glyphs from other ranges.  This action will combine glyphs from the Basic Latin range with their appropriate counterparts in the Combining Diacritical Marks range to yield the Latin Supplement and Latin Extended A ranges.<br><br><b>Before you begin</b> - <span class="textaction" onclick="showGlyphRangeChooser();">Add the Combining Diacritical Marks range to your project</span>, and design them.`,
	});
	card.appendChild(description);

	let effect = makeElement({
		className: 'global-actions__effect-description',
		content: `The Latin Supplement and Latin Extended A character ranges will be enabled, and diacritical glyphs will be assembled as Component Instances from their respective glyphs from Basic Latin and Combining Diacritical Marks ranges.`,
	});
	card.appendChild(effect);

	let button = makeElement({ tag: 'fancy-button', content: 'Generate Diacritical Glyphs' });
	button.addEventListener('click', generateDiacriticsAdvanced);
	card.appendChild(button);

	return card;
}

function generateDiacriticsAdvanced() {
	/*
	// log(`generateDiacriticsAdvanced', 'start');
	let copyGlyphAttributes = {
		srcAutoWidth: true,
		srcWidth: true,
		srcLSB: true,
		srcRSB: true,
	};
	let currentItemID = decToHex(_UI.glyphrange.latinsupplement.begin);
	let sourceArray;
	let targetCenter, currCenter;

	function processOneItem() {
		// log(`processOneItem - currentItemID = ${currentItemID}`);
		sourceArray = _UI.unicodeDiacriticsMapAdvanced[currentItemID];

		if (sourceArray) {
			showToast('Adding diacritical ' + currentItemID + '<br>' + getGlyphName(currentItemID), 10000);
			insertComponentInstance(sourceArray[0], currentItemID, copyGlyphAttributes);
			insertComponentInstance(sourceArray[1], currentItemID, false);

			targetCenter = getGlyph(sourceArray[0]).getCenter().x;
			currCenter = getGlyph(sourceArray[1]).getCenter().x;
			getGlyph(currentItemID).shapes[1].updateShapePosition(targetCenter - currCenter, 0);
		}

		currentItemID++;

		if (currentItemID === _UI.glyphrange.latinsupplement.end) {
			currentItemID = _UI.glyphrange.latinextendeda.begin;
		}

		if (currentItemID <= _UI.glyphrange.latinextendeda.end) {
			currentItemID = decToHex(currentItemID);
			setTimeout(processOneItem, 10);
		} else {
			showToast('Done!', 1000);
			_UI.history['glyph edit'].put('Generate Diacritical glyphs');
		}
	}

	showToast('Starting to assemble Diacritical Glyphs', 10000);

	project.projectsettings.glyphrange.latinsupplement = true;
	project.projectsettings.glyphrange.latinextendeda = true;

	setTimeout(processOneItem, 500);
	*/
}
