/**
		Panel > Actions
		Usually this is attached to the bottom of the
		Glyph Attributes panel screen mode,
		the Attributes panel gets its own column.
**/

import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeActionButton, makeActionButtonIcon } from '../panels/action-buttons.js';
import { addAsChildren, makeElement } from '../common/dom.js';

export function makePanel_Actions() {

	let projectEditor = getCurrentProjectEditor();
	let selectedShapes = projectEditor.multiSelect.shapes.members;

	// TODO hook these up
	let clipBoardShape = false;
	let historyLength = 0;

	let panelSection = makeElement({
		tag: 'div',
		className: 'panel__section full-width',
		innerHTML: '<h3>actions</h3>'
	});

	if (!projectEditor.selectedWorkItem) {
	  return panelSection.appendChild(
			makeElement({
				tag: 'h2',
				innerHTML: `ERROR: No selected work item`
			})
		);
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

	// UNIVERSAL ACTIONS
	let allActions = [
		{
			iconName: 'paste',
			iconOptions: !clipBoardShape,
			title: `Paste\nAdds the previously-copied shape or shapes into this glyph.`,
			disabled: !clipBoardShape
		},
		{
			iconName: 'undo',
			iconOptions: !historyLength,
			title: `Undo\nStep backwards in time one action.`,
			disabled: !historyLength
		},
		{
			iconName: 'addShape',
			iconOptions: false,
			title: `Add Shape\nCreates a new default shape and adds it to this glyph.`,
		},
		{
			iconName: 'addShape',
			iconOptions: true,
			title: `Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph.`,
		},
		{
			iconName: 'pasteShapesFromAnotherGlyph',
			title: `Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one.`,
		},
	];

	if (projectEditor.nav.page === 'components') {
		allActions.push(
			{
				iconName: 'linkToGlyph',
				title: `Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance.`,
			}
		);
	}

	// GLYPH
	let glyphActions = [
		{
			iconName: 'combine',
			title: `Combine all shapes\nCombines the paths of all shapes with the same winding into as few shapes as possible.`,
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
			title: `Export glyph SVG File\nGenerate a SVG file that only includes the SVG outline for this glyph. This file can be dragged and dropped directly to another Glyphr Studio project edit canvas, allowing for copying glyph shapes between projects.`,
			iconName: 'exportGlyphSVG',
		},
	];

	// SHAPE
	let shapeActions = [
		{
			iconName: 'copy',
			title: 'Copy\nAdds a copy of the currently selected shape or shapes to the clipboard.',
		},
		{
			iconName: 'deleteShape',
			title: 'Delete\nRemoves the currently selected shape or shapes from this glyph.',
		},
		{
			iconName: 'reverseWinding',
			title: `Reverse winding\nToggles the clockwise or counterclockwise winding of the shape's path.`,
		},
	];

	if (selectedShapes.length === 1 && selectedShapes[0].objType === 'ComponentInstance') {
		shapeActions = shapeActions.concat([
			{
				iconName: 'switchShapeComponent',
				iconData: true,
				title: `Turn Component Instance into a Shape\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's shapes as regular Shapes to this glyph.`,
			},
		]);
	} else {
		shapeActions = shapeActions.concat([
			{
				iconName: 'switchShapeComponent',
				iconData: false,
				title: `Turn Shape into a Component Instance\nTakes the selected shape and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance.`,
			},
		]);
	}

	shapeActions = shapeActions.concat([
		{
			iconName: 'flipHorizontal',
			title: 'Flip Horizontal\nReflects the currently selected shape or shapes horizontally.',
		},
		{
			iconName: 'flipVertical',
			title: 'Flip Vertical\nReflects the currently selected shape or shapes vertically',
		},
		{
			iconName: 'round',
			title: `Round all point position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
		},
	]);

	// LAYERS
	let layerActions = [
		{
			iconName: 'moveLayerUp',
			title: `Move Shape Up\nMoves the shape up in the shape layer order.`,
		},
		{
			iconName: 'moveLayerDown',
			title: `Move Shape Down\nMoves the shape down in the shape layer order.`,
		},
	];

	// ALIGN
	let alignActions = [
		{
			title: `Align Left\nMoves all the selected shapes so they are left aligned with the leftmost shape.`,
			iconName: 'align',
			iconOptions: 'left',
		},
		{
			title: `Align Center\nMoves all the selected shapes so they are center aligned between the leftmost and rightmost shape.`,
			iconName: 'align',
			iconOptions: 'center',
		},
		{
			title: `Align Right\nMoves all the selected shapes so they are right aligned with the rightmost shape.`,
			iconName: 'align',
			iconOptions: 'right',
		},
		{
			title: `Align Top\nMoves all the selected shapes so they are top aligned with the topmost shape.`,
			iconName: 'align',
			iconOptions: 'top',
		},
		{
			title: `Align Middle\nMoves all the selected shapes so they are middle aligned between the topmost and bottommost shape.`,
			iconName: 'align',
			iconOptions: 'middle',
		},
		{
			title: `Align Bottom\nMoves all the selected shapes so they are bottom aligned with the bottommost shape.`,
			iconName: 'align',
			iconOptions: 'bottom',
		}
	];

	// COMBINE
	let boolActions = [
		{
			iconName: 'combine',
			title: `Combine\nSelect two shapes, and combine their paths into a single shape.`,
		},
		{
			iconName: 'subtractUsingTop',
			title: `Subtract Using Upper\nSelect two shapes, and the upper shape will be used to cut out an area from the lower shape.`,
		},
		{
			iconName: 'subtractUsingBottom',
			title: `Subtract Using Lower\nSelect two shapes, and the lower shape will be used to cut out an area from the upper shape.`,
		},
	];

	// PATH POINT
	let pointActions = [
		{
			iconName: 'insertPathPoint',
			title: `Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one.`,
		},
		{
			iconName: 'deletePathPoint',
			title: `Delete Path Point\nRemoves the currently selected point or points from the path.`,
			disabled: !!selectedShapes.length
		},
		{
			iconName: 'resetPathPoint',
			title: `Reset Handles\nMoves the handles of the currently selected point or points to default locations.`,
		},
	];

	// DEV
	let devActions = [];
	let dev = getGlyphrStudioApp().settings.dev;
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


	// --------------------------------------------------------------
	// Put it all together
	// --------------------------------------------------------------

	function addChildActions(actionsArray) {
		addAsChildren(actionsArea, actionsArray.map((iconData) => makeActionButton(iconData)));
	}
	let actionsArea = makeElement({tag: 'div', className: 'actionsArea'});
	let test = false;

	// Universal actions
	addChildActions(allActions);

	// Glyph actions
	if (selectedShapes.length === 0 || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'glyph'}));
		addChildActions(glyphActions);
	}

	// Shape actions
	if (selectedShapes.length > 0 || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'shapes'}));
		addChildActions(shapeActions);
	}

	// Boolean combine actions
	if (selectedShapes.length > 1 || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'shape combine'}));
		addChildActions(boolActions);
	}

	// Layer actions
	if (selectedShapes.length === 1 || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'shape layers'}));
		addChildActions(layerActions);
	}

	// Shape align actions
	if (selectedShapes.length > 1 || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'align shapes'}));
		addChildActions(alignActions);
	}

	// Point actions
	let isPointSelected = false;
	if (projectEditor.multiSelect.points.count() > 0) isPointSelected = true;
	// if (_UI.selectedTool !== 'pathEdit') isPointSelected = false;
	if (isPointSelected || test) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'path point'}));
		addChildActions(pointActions);
	}

	// Dev actions for testing
	if (dev.testActions.length) {
		actionsArea.appendChild(makeElement({tag:'h4', content:'test'}));
		addChildActions(devActions);
	}

	// append and return
	panelSection.appendChild(actionsArea);
	return panelSection;
}

// --------------------------------------------------------------
// Combine
// --------------------------------------------------------------

function combineSelectedShapes() {
	showToast('Combining selected shapes... ', 100);

	setTimeout(function () {
		_UI.multiSelect.shapes.combine();
		historyPut('combine selected shapes');
		redraw({ calledBy: 'actions panel' });
	}, 200);
}

function combineAllGlyphShapes() {
	showToast('Combining all glyph shapes... ', 100);

	setTimeout(function () {
		getSelectedWorkItem().combineAllShapes(true);
		historyPut('combine all glyph shapes');
		redraw({ calledBy: 'actions panel' });
	}, 200);
}

// --------------------------------------------------------------
// Copy Paste
// --------------------------------------------------------------
function copyShape() {
	let ssm = _UI.multiSelect.shapes.members;
	if (ssm.length) {
		_UI.clipboardShape = {
			s: clone(ssm),
			c: _UI.selectedGlyph,
			dx: 0,
			dy: 0,
		};
		// log("COPYShape() - new clipboard shape: " + _UI.clipboardShape._UI.multiSelect.shapes.name);
	}
	redraw({ calledBy: 'copyShape', redrawCanvas: false });
}

function pasteShape() {
	// log('pasteShape', 'start');
	let cbs = _UI.clipboardShape;
	// log(cbs);
	let selwi = getSelectedWorkItemID();

	if (cbs) {
		let newshapes = [];
		let sourceshapes = cbs.s;
		let ts, newname, newsuffix, n;
		let offsetShapes = cbs.c === selwi;

		for (let s = 0; s < sourceshapes.length; s++) {
			if (sourceshapes[s].objType === 'ComponentInstance') {
				ts = new ComponentInstance(sourceshapes[s]);
			} else {
				ts = new Shape(sourceshapes[s]);
			}

			// log('shape ' + s);
			// log('objType: ' + ts.objType);
			// log('checking for moved glyphs: ' + cbs.c + ' to ' + selwi);
			// log('offsetShapes: ' + offsetShapes);

			if (offsetShapes) {
				if (s === 0) {
					cbs.dx += 20;
					cbs.dy -= 20;
				}
				ts.updateShapePosition(cbs.dx, cbs.dy, true);
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
				getGlyph(ts.link).addToUsedIn(getSelectedWorkItemID);
				// _UI.selectedGlyph.addToUsedIn(ts.link);
				// log("PASTESHAPE - pasted a component, added " + _UI.selectedGlyph + " to usedIn array.");
			}

			newshapes.push(addShape(ts));
		}

		_UI.multiSelect.shapes.clear();
		_UI.multiSelect.points.clear();

		for (let t = 0; t < newshapes.length; t++)
			_UI.multiSelect.shapes.add(newshapes[t]);

		cbs.c = selwi;

		// log('pasteShapes', 'end');
	}
}

function showDialogGetShapes(msg) {
	let content = '<h1>Get Shapes</h1>';
	content +=
		'Clicking a glyph will copy all the shapes in that glyph, and paste them into this glyph.<br><br>';
	content += msg ? msg : '';
	content += initGetShapesDialogOptions();

	_UI.glyphChooser.dialog = {
		fname: 'pasteShapesFrom',
		choices: 'all',
		selected: 'glyphs',
	};

	openBigDialog(content);
}

function initGetShapesDialogOptions(type) {
	/*
				_UI.glyphChooser.getShapeOptions = {
						srcAutoWidth: false,
						srcWidth: false,
						srcLSB: false,
						srcRSB: false
				};
				*/
	type = type || 'shapes';
	let gso = _UI.glyphChooser.getShapeOptions;

	let content = '<br><br><br><br><h3>Copy options</h3>';

	if (type === 'shapes')
		content +=
			'When copying the shapes from the other glyph, also copy these attributes to this glyph:';
	else
		content +=
			'When inserting the Component Instance, also copy these attributes from the Root Component to this glyph:';

	content += '<table class="settingstable projectSettings">';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getShapeOptions.srcAutoWidth', gso.srcAutoWidth) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcAutoWidth">Auto-calculate Width</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getShapeOptions.srcWidth', gso.srcWidth) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcWidth">Glyph Width</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getShapeOptions.srcLSB', gso.srcLSB) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcLSB">Left Side Bearing</label><br><br></td></tr>';

	content +=
		'<tr><td style="text-align:right; vertical-align:top;">' +
		checkUI('_UI.glyphChooser.getShapeOptions.srcRSB', gso.srcRSB) +
		'</td>' +
		'<td style="vertical-align:top;"><label for="srcRSB">Right Side Bearing</label><br><br></td></tr>';

	content += '</table>';

	return content;
}

function pasteShapesFrom(sourceGlyphID) {
	let destinationGlyphID = getSelectedWorkItemID();
	let sourceGlyph = getGlyph(sourceGlyphID);

	if (sourceGlyphID !== destinationGlyphID && sourceGlyph) {
		sourceGlyph.copyShapesTo(
			destinationGlyphID,
			_UI.glyphChooser.getShapeOptions
		);

		// showToast('Copied ' + this.shapes.length + ' shapes');
		redraw({ calledBy: 'pasteShapesFrom' });
		historyPut(
			'Copied shapes from "' +
				getGlyphName(sourceGlyphID) +
				'" to  "' +
				getSelectedWorkItemName()
		);
		if (_UI.selectedTool === 'pathAddPoint') _UI.selectedTool = 'shapeEdit';
		closeDialog();
	} else {
		showDialogGetShapes(
			"Sorry, you can't paste shapes from the glyph you selected.<br>"
		);
	}
}

// --------------------------------------------------------------
// COMPONENT Actions
// --------------------------------------------------------------

function showDialogLinkComponentToGlyph(msg) {
	let sls = getSelectedWorkItem();
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
				getSelectedWorkItem().name +
				'" was successfully linked to Glyph "' +
				getGlyphName(id) +
				'".<br><br>'
		);
	}
}
