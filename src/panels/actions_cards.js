/**
		Panel > Actions
		Usually this is attached to the bottom of the
		Glyph Attributes panel screen mode,
		the Attributes panel gets its own column.
**/

import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeActionButton, makeActionButtonIcon } from './action-buttons.js';
import { addAsChildren, makeElement } from '../common/dom.js';

export function makeCard_projectActions() {
	let projectEditor = getCurrentProjectEditor();

	let panelSection = makeElement({
		tag: 'div',
		className: 'panel__card full-width',
		innerHTML: '<h3>Project actions</h3>'
	});

	if (!projectEditor.selectedItem) {
	  return panelSection.appendChild(
			makeElement({
				tag: 'h2',
				innerHTML: `ERROR: No selected work item`
			})
		);
	}

	addAsChildren(panelSection, makeActionsArea_Universal());

	return panelSection;
}



// --------------------------------------------------------------
// Define action button data
// --------------------------------------------------------------

/**
 * Data format for creating action buttons:
 * ----------------------------------------
 * iconName = 'default',
 * iconOptions = false,
 * title = '',
 * disabled = false,
 * onClick = false
 */

function getActionData(name){
	let projectEditor = getCurrentProjectEditor();
	let selectedPaths = projectEditor.multiSelect.paths.members;
	let data = {};

	// TODO hook these up
	let clipBoardPath = false;
	let historyLength = 0;


	// UNIVERSAL ACTIONS
	data.allActions = [
		{
			iconName: 'paste',
			iconOptions: !clipBoardPath,
			title: `Paste\nAdds the previously-copied path or paths into this glyph.`,
			disabled: !clipBoardPath
		},
		{
			iconName: 'undo',
			iconOptions: !historyLength,
			title: `Undo\nStep backwards in time one action.`,
			disabled: !historyLength
		},
		{
			iconName: 'addPath',
			iconOptions: false,
			title: `Add Path\nCreates a new default path and adds it to this glyph.`,
		},
		{
			iconName: 'addPath',
			iconOptions: true,
			title: `Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph.`,
		},
		{
			iconName: 'pastePathsFromAnotherGlyph',
			title: `Get Paths\nChoose another Glyph, and copy all the paths from that glyph to this one.`,
		},
	];

	if (projectEditor.nav.page === 'components') {
		data.allActions.push(
			{
				iconName: 'linkToGlyph',
				title: `Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance.`,
			}
		);
	}

	// GLYPH
	data.glyphActions = [
		{
			iconName: 'combine',
			title: `Combine all paths\nCombines the paths of all paths with the same winding into as few paths as possible.`,
		},
		{
			iconName: 'flipHorizontal',
			title: `Flip Vertical\nReflects the glyph vertically.`,
		},
		{
			iconName: 'flipVertical',
			title: `Flip Horizontal\nReflects the glyph horizontally.`,
		},
		{
			iconName: 'round',
			title: `Round all point position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
		},
		{
			title: `Delete Glyph\nRemove this Glyph from the project. Don\'t worry, you can undo this action.`,
			iconName: 'deleteGlyph',
		},
		{
			title: `Export glyph SVG File\nGenerate a SVG file that only includes the SVG outline for this glyph. This file can be dragged and dropped directly to another Glyphr Studio project edit canvas, allowing for copying glyph paths between projects.`,
			iconName: 'exportGlyphSVG',
		},
	];

	// SHAPE
	data.pathActions = [
		{
			iconName: 'copy',
			title: 'Copy\nAdds a copy of the currently selected path or paths to the clipboard.',
		},
		{
			iconName: 'deletePath',
			title: 'Delete\nRemoves the currently selected path or paths from this glyph.',
		},
		{
			iconName: 'reverseWinding',
			title: `Reverse winding\nToggles the clockwise or counterclockwise winding of the path's path.`,
		},
	];

	if (selectedPaths.length === 1 && selectedPaths[0].objType === 'ComponentInstance') {
		data.pathActions = data.pathActions.concat([
			{
				iconName: 'switchPathComponent',
				iconData: true,
				title: `Turn Component Instance into a Path\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's paths as regular Paths to this glyph.`,
			},
		]);
	} else {
		data.pathActions = data.pathActions.concat([
			{
				iconName: 'switchPathComponent',
				iconData: false,
				title: `Turn Path into a Component Instance\nTakes the selected path and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance.`,
			},
		]);
	}

	data.pathActions = data.pathActions.concat([
		{
			iconName: 'flipHorizontal',
			title: 'Flip Horizontal\nReflects the currently selected path or paths horizontally.',
		},
		{
			iconName: 'flipVertical',
			title: 'Flip Vertical\nReflects the currently selected path or paths vertically',
		},
		{
			iconName: 'round',
			title: `Round all point position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
		},
	]);

	// LAYERS
	data.layerActions = [
		{
			iconName: 'moveLayerUp',
			title: `Move Path Up\nMoves the path up in the path layer order.`,
		},
		{
			iconName: 'moveLayerDown',
			title: `Move Path Down\nMoves the path down in the path layer order.`,
		},
	];

	// ALIGN
	data.alignActions = [
		{
			title: `Align Left\nMoves all the selected paths so they are left aligned with the leftmost path.`,
			iconName: 'align',
			iconOptions: 'left',
		},
		{
			title: `Align Center\nMoves all the selected paths so they are center aligned between the leftmost and rightmost path.`,
			iconName: 'align',
			iconOptions: 'center',
		},
		{
			title: `Align Right\nMoves all the selected paths so they are right aligned with the rightmost path.`,
			iconName: 'align',
			iconOptions: 'right',
		},
		{
			title: `Align Top\nMoves all the selected paths so they are top aligned with the topmost path.`,
			iconName: 'align',
			iconOptions: 'top',
		},
		{
			title: `Align Middle\nMoves all the selected paths so they are middle aligned between the topmost and bottommost path.`,
			iconName: 'align',
			iconOptions: 'middle',
		},
		{
			title: `Align Bottom\nMoves all the selected paths so they are bottom aligned with the bottommost path.`,
			iconName: 'align',
			iconOptions: 'bottom',
		}
	];

	// COMBINE
	data.boolActions = [
		{
			iconName: 'combine',
			title: `Combine\nSelect two paths, and combine their paths into a single path.`,
		},
		{
			iconName: 'subtractUsingTop',
			title: `Subtract Using Upper\nSelect two paths, and the upper path will be used to cut out an area from the lower path.`,
		},
		{
			iconName: 'subtractUsingBottom',
			title: `Subtract Using Lower\nSelect two paths, and the lower path will be used to cut out an area from the upper path.`,
		},
	];

	// PATH POINT
	data.pointActions = [
		{
			iconName: 'insertPathPoint',
			title: `Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one.`,
		},
		{
			iconName: 'deletePathPoint',
			title: `Delete Path Point\nRemoves the currently selected point or points from the path.`,
			disabled: !!selectedPaths.length
		},
		{
			iconName: 'resetPathPoint',
			title: `Reset Handles\nMoves the handles of the currently selected point or points to default locations.`,
		},
	];


	return data[name];
}



// --------------------------------------------------------------
// Individual actions areas
// --------------------------------------------------------------

// Universal actions
export function makeActionsArea_Universal(test = false){
	let actionsArea = makeElement({tag: 'div', className: 'panel__actions-area'});

	addChildActions(actionsArea, getActionData('allActions'));

	// Dev actions for testing
	let dev = getGlyphrStudioApp().settings.dev;
	if (dev.testActions.length) {
		// DEV
		let devActions = [];
		if (dev.mode) {
			for (let a = 0; a < dev.testActions.length; a++) {
				devActions.push(
					{
						iconName: 'test',
						title: dev.testActions[a].name,
						onClick: dev.testActions[a].onclick
					}
				);
			}
		}
		// actionsArea.appendChild(makeElement({tag:'h4', content:'test'}));
		addChildActions(actionsArea, getActionData('devActions'));
	}

	return actionsArea;
}

// Glyph actions
export function makeActionsArea_Glyph(test = false){
	let actionsArea = makeElement({tag: 'div', className: 'panel__actions-area'});
	addChildActions(actionsArea, getActionData('glyphActions'));
	return actionsArea;
}

// Path actions
export function makeActionsArea_Path(test = false){
	let actionsArea = makeElement({tag: 'div', className: 'panel__actions-area'});
	let selectedPaths = getCurrentProjectEditor().multiSelect.paths.members;

	if (selectedPaths.length > 0 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'paths'}));
		addChildActions(actionsArea, getActionData('pathActions'));
	}

	// Boolean combine actions
	if (selectedPaths.length > 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path combine'}));
		addChildActions(actionsArea, getActionData('boolActions'));
	}

	// Layer actions
	if (selectedPaths.length === 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path layers'}));
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'align paths'}));
		addChildActions(actionsArea, getActionData('alignActions'));
	}

	return actionsArea;
}

// Point actions
export function makeActionsArea_Point(test = false){
	let actionsArea = makeElement({tag: 'div', className: 'panel__actions-area'});
	let selectedPoints = getCurrentProjectEditor().multiSelect.points;
	let isPointSelected = false;
	if (selectedPoints.length > 0) isPointSelected = true;
	// if (_UI.selectedTool !== 'pathEdit') isPointSelected = false;
	if (isPointSelected || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path point'}));
		addChildActions(actionsArea, getActionData('pointActions'));
	}

	return actionsArea;
}

function addChildActions(parent, actionsArray) {
	addAsChildren(parent, actionsArray.map((iconData) => makeActionButton(iconData)));
	return parent;
}























// --------------------------------------------------------------
// Combine
// --------------------------------------------------------------

function combineSelectedPaths() {
	showToast('Combining selected paths... ', 100);

	setTimeout(function () {
		_UI.multiSelect.paths.combine();
		historyPut('combine selected paths');
		redraw({ calledBy: 'actions panel' });
	}, 200);
}

function combineAllGlyphPaths() {
	showToast('Combining all glyph paths... ', 100);

	setTimeout(function () {
		getSelectedItem().combineAllPaths(true);
		historyPut('combine all glyph paths');
		redraw({ calledBy: 'actions panel' });
	}, 200);
}

// --------------------------------------------------------------
// Copy Paste
// --------------------------------------------------------------
function copyPath() {
	let ssm = _UI.multiSelect.paths.members;
	if (ssm.length) {
		_UI.clipboardPath = {
			s: clone(ssm),
			c: _UI.selectedGlyph,
			dx: 0,
			dy: 0,
		};
		// log("COPYPath() - new clipboard path: " + _UI.clipboardPath._UI.multiSelect.paths.name);
	}
	redraw({ calledBy: 'copyPath', redrawCanvas: false });
}

function pastePath() {
	// log('pastePath', 'start');
	let cbs = _UI.clipboardPath;
	// log(cbs);
	let selwi = getSelectedItemID();

	if (cbs) {
		let newPaths = [];
		let sourcepaths = cbs.s;
		let ts, newname, newsuffix, n;
		let offsetPaths = cbs.c === selwi;

		for (let s = 0; s < sourcepaths.length; s++) {
			if (sourcepaths[s].objType === 'ComponentInstance') {
				ts = new ComponentInstance(sourcepaths[s]);
			} else {
				ts = new Path(sourcepaths[s]);
			}

			// log('path ' + s);
			// log('objType: ' + ts.objType);
			// log('checking for moved glyphs: ' + cbs.c + ' to ' + selwi);
			// log('offsetPaths: ' + offsetPaths);

			if (offsetPaths) {
				if (s === 0) {
					cbs.dx += 20;
					cbs.dy -= 20;
				}
				ts.updatePathPosition(cbs.dx, cbs.dy, true);
			} else {
				cbs.dx = 0;
				cbs.dy = 0;
			}

			newname = ts.name;
			newsuffix = ' (copy)';
			n = ts.name.lastIndexOf('(copy');

			if (n > 0) {
				let suffix = newname.substring(n + 5);
				newname = newname.substring(0, n);
				if (suffix === ')') {
					newsuffix = '(copy 2)';
				} else {
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(1);
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(0, suffix.length - 1);
					// log("\t - suffix " + suffix);
					newsuffix = '(copy ' + (parseInt(suffix) + 1) + ')';
					// log("\t - newsuffix " + newsuffix);
				}
			}
			ts.name = newname + newsuffix;

			if (ts.objType === 'ComponentInstance') {
				getGlyph(ts.link).addToUsedIn(getSelectedItemID);
				// _UI.selectedGlyph.addToUsedIn(ts.link);
				// log("PASTESHAPE - pasted a component, added " + _UI.selectedGlyph + " to usedIn array.");
			}

			newPaths.push(addPath(ts));
		}

		_UI.multiSelect.paths.clear();
		_UI.multiSelect.points.clear();

		for (let t = 0; t < newPaths.length; t++)
			_UI.multiSelect.paths.add(newPaths[t]);

		cbs.c = selwi;

		// log('pastePaths', 'end');
	}
}

function showDialogGetPaths(msg) {
	let content = '<h1>Get Paths</h1>';
	content +=
		'Clicking a glyph will copy all the paths in that glyph, and paste them into this glyph.<br><br>';
	content += msg ? msg : '';
	content += initGetPathsDialogOptions();

	_UI.glyphChooser.dialog = {
		fname: 'pastePathsFrom',
		choices: 'all',
		selected: 'glyphs',
	};

	openBigDialog(content);
}

function initGetPathsDialogOptions(type) {
	/*
				_UI.glyphChooser.getPathOptions = {
						srcAutoWidth: false,
						srcWidth: false,
						srcLSB: false,
						srcRSB: false
				};
				*/
	type = type || 'paths';
	let gso = _UI.glyphChooser.getPathOptions;

	let content = '<br><br><br><br><h3>Copy options</h3>';

	if (type === 'paths')
		content +=
			'When copying the paths from the other glyph, also copy these attributes to this glyph:';
	else
		content +=
			'When inserting the Component Instance, also copy these attributes from the Root Component to this glyph:';

	content += '<table class="settingstable projectSettings">';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getPathOptions.srcAutoWidth', gso.srcAutoWidth) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcAutoWidth">Auto-calculate Width</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getPathOptions.srcWidth', gso.srcWidth) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcWidth">Glyph Width</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getPathOptions.srcLSB', gso.srcLSB) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcLSB">Left Side Bearing</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getPathOptions.srcRSB', gso.srcRSB) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcRSB">Right Side Bearing</label><br><br></td></tr>';

	content += '</table>';

	return content;
}

function pastePathsFrom(sourceGlyphID) {
	let destinationGlyphID = getSelectedItemID();
	let sourceGlyph = getGlyph(sourceGlyphID);
	// TODO hook up options
	let options = false;

	if (sourceGlyphID !== destinationGlyphID && sourceGlyph) {
		copyPathsFromTo(sourceGlyph, destinationGlyphID, options);

		// showToast('Copied ' + this.paths.length + ' paths');
		redraw({ calledBy: 'pastePathsFrom' });
		historyPut(
			'Copied paths from "' +
				getGlyphName(sourceGlyphID) +
				'" to  "' +
				getSelectedItemName()
		);
		if (_UI.selectedTool === 'pathAddPoint') _UI.selectedTool = 'pathEdit';
		closeDialog();
	} else {
		showDialogGetPaths(
			"Sorry, you can't paste paths from the glyph you selected.<br>"
		);
	}
}

/**
 * Copy paths (and attributes) from one glyph to another
 * @param {string} destinationID - where to copy paths to
 * @param {object} copyGlyphAttributes - which attributes to copy in addition to paths
 */
export function copyPathsFromTo(
	sourceGlyph,
	destinationID,
	copyGlyphAttributes = {
		srcAutoWidth: false,
		srcWidth: false,
		srcLSB: false,
		srcRSB: false,
	}
	) {
	// log('copyPathsFromTo', 'start');
	const destinationGlyph = getCurrentProject().getGlyph(destinationID, true);
	let tc;
	for (let c = 0; c < sourceGlyph.paths.length; c++) {
		tc = sourceGlyph.paths[c];
		if (tc.objType === 'ComponentInstance') {
			getCurrentProject().getGlyph(tc.link).addToUsedIn(destinationID);
			tc = new ComponentInstance(clone(tc));
		} else if (tc.objType === 'Path') {
			tc = new Path(clone(tc));
		}
		destinationGlyph.paths.push(tc);
	}
	if (copyGlyphAttributes.srcAutoWidth){
		destinationGlyph.isAutoWide = sourceGlyph.isAutoWide;
	}
	if (copyGlyphAttributes.srcWidth){
		destinationGlyph.glyphWidth = sourceGlyph.glyphWidth;
	}
	if (copyGlyphAttributes.srcLSB){
		destinationGlyph.leftSideBearing = sourceGlyph.leftSideBearing;
	}
	if (copyGlyphAttributes.srcRSB){
		destinationGlyph.rightSideBearing = sourceGlyph.rightSideBearing;
		glyphChanged(destinationGlyph);
	}
	// log('new paths');
	// log(destinationGlyph.paths);
	// log('copyPathsFromTo', 'end');
}


// --------------------------------------------------------------
// COMPONENT Actions
// --------------------------------------------------------------

function showDialogLinkComponentToGlyph(msg) {
	let sls = getSelectedItem();
	let content = '<h1>Link to Glyph</h1>';
	content += 'Select a Glyph you would like to link to this Component.<br><br>';
	content += msg
		? msg
		: 'There are currently ' +
			sls.usedIn.length +
			' instances of "' +
			sls.name +
			'" being used in various Glyphs.<br><br>';

	_UI.glyphChooser.dialog = {
		fname: 'linkComponentToGlyph',
		choices: 'all',
		selected: 'glyphs',
	};

	openBigDialog(content);
}

function linkComponentToGlyph(id) {
	if (insertComponentInstance(_UI.selectedComponent, id)) {
		showDialogLinkComponentToGlyph(
			'The Component "' +
				getSelectedItem().name +
				'" was successfully linked to Glyph "' +
				getGlyphName(id) +
				'".<br><br>'
		);
	}
}
