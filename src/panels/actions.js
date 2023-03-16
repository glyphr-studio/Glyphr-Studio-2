import { getCurrentProjectEditor, log } from '../app/main.js';
import { makeActionButton } from './action_buttons.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { saveFile } from '../project_editor/saving.js';
import { rectPathFromMaxes } from '../edit_canvas/tools/new_basic_path.js';
import { Path } from '../project_data/path.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { closeEveryTypeOfDialog, showModalDialog, showToast } from '../controls/dialogs/dialogs.js';
import { makeGlyphChooserContent } from './glyph_chooser.js';

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

export function getActionData(name) {
	const editor = getCurrentProjectEditor();
	let selectedPaths = editor.multiSelect.paths.members;
	let selectedPoints = editor.multiSelect.points.members;
	let data = {};
	let clipBoardPaths = editor.clipboard.paths;
	let clipBoardPathCount = clipBoardPaths ? clipBoardPaths.length : 0;
	let historyLength = editor.history.queue.length;

	// UNIVERSAL ACTIONS
	data.allActions = [
		{
			iconName: 'copy',
			iconOptions: !clipBoardPaths,
			title: `Copy\nAdds the selected path or paths to the clipboard.`,
			disabled: !editor.multiSelect.paths.length,
			id: 'actionButtonCopy',
			onClick: clipboardCopy,
		},
		{
			iconName: 'paste',
			iconOptions: !clipBoardPaths,
			title: makeActionButtonPasteTooltip(clipBoardPathCount),
			disabled: !clipBoardPaths,
			id: 'actionButtonPaste',
			onClick: clipboardPaste,
		},
		{
			iconName: 'undo',
			iconOptions: !historyLength,
			title: `Undo\nStep backwards in time one action.`,
			disabled: !historyLength,
			id: 'actionButtonUndo',
			onClick: () => {
				editor.history.restoreState();
			},
		},
	];

	if (editor.nav.page === 'components') {
		data.allActions.push({
			iconName: 'linkToGlyph',
			title: `Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance.`,
		});
	}

	// ADDING PATH STUFF
	data.addPathActions = [
		{
			iconName: 'addPath',
			iconOptions: false,
			title: `Add Path\nCreates a new default path and adds it to this glyph.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let newPath = editor.selectedItem.addOnePath(rectPathFromMaxes());
				editor.multiSelect.paths.select(newPath);
				editor.publish('whichPathIsSelected', newPath);
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'addPath',
			iconOptions: true,
			title: `Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph.`,
			disabled: true,
		},
		{
			iconName: 'pastePathsFromAnotherGlyph',
			title: `Get Paths\nChoose another Glyph, and copy all the paths from that glyph to this one.`,
			onClick: () => {
				showDialogChooseOtherGlyph('copyPaths');
			},
		},
	];

	// GLYPH
	data.glyphActions = [
		{
			iconName: 'flipHorizontal',
			title: `Flip Vertical\nReflects the glyph vertically.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.selectedItem.flipEW();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'flipVertical',
			title: `Flip Horizontal\nReflects the glyph horizontally.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.selectedItem.flipNS();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'round',
			title: `Round all point position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.selectedItem.roundAll();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'combine',
			title: `Combine all paths\nCombines the paths of all paths with the same winding into as few paths as possible.`,
			disabled: true,
		},
		{
			iconName: 'deleteGlyph',
			title: `Delete Glyph\nRemove this Glyph from the project. Don't worry, you can undo this action.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const name = editor.selectedItem.name;
				editor.deleteSelectedItemFromProject();
				log(`New item id: ${editor.selectedItemID}`);
				editor.publish('whichGlyphIsSelected', editor.selectedItemID);
				editor.history.addState(`Navigated to ${name}`);
				showToast(`Deleted ${name}.<br>(Don't worry, this action can be undone)`);
			},
		},
		{
			iconName: 'exportGlyphSVG',
			title: `Export glyph SVG File\nGenerate a SVG file that only includes the SVG outline for this glyph. This file can be dragged and dropped directly to another Glyphr Studio project edit canvas, allowing for copying glyph paths between projects.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let content = editor.selectedItem.makeSVG();
				let name = editor.selectedItem.name;
				saveFile(name + '.svg', content);
			},
		},
	];

	// PATH
	data.pathActions = [
		{
			iconName: 'copy',
			iconOptions: !clipBoardPaths,
			title: `Copy\nAdds the selected path or paths to the clipboard.`,
			id: 'actionButtonCopyPath',
			onClick: clipboardCopy,
		},
		{
			iconName: 'deletePath',
			title: 'Delete\nRemoves the currently selected path or paths from this glyph.',
			onClick: deleteSelectedPaths,
		},
		{
			iconName: 'switchPathComponent',
			iconOptions: false,
			title: `Turn Path into a Component Instance\nTakes the selected path and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance.`,
			onClick: () => {
				// TODO components
			}
		},
		{
			iconName: 'flipHorizontal',
			title: 'Flip Horizontal\nReflects the currently selected path or paths horizontally.',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let path = editor.multiSelect.paths.virtualGlyph;
				path.flipEW();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'flipVertical',
			title: 'Flip Vertical\nReflects the currently selected path or paths vertically',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let path = editor.multiSelect.paths.virtualGlyph;
				path.flipNS();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'round',
			title: `Round all point position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let path = editor.multiSelect.paths.virtualGlyph;
				path.roundAll();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
	];

	// COMPONENT INSTANCE
	data.componentInstanceActions = [
		{
			iconName: 'switchPathComponent',
			iconOptions: true,
			title: `Turn Component Instance into a Path\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's paths as regular Paths to this glyph.`,
			onClick: () => {
				// TODO components
			}
		},
	];

	// LAYERS
	data.layerActions = [
		{
			iconName: 'moveLayerUp',
			title: `Move Path Up\nMoves the path up in the path layer order.`,
			disabled: selectedPaths.length !== 1,
			onClick: () => {
				moveLayer('up');
				const editor = getCurrentProjectEditor();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
		{
			iconName: 'moveLayerDown',
			title: `Move Path Down\nMoves the path down in the path layer order.`,
			disabled: selectedPaths.length !== 1,
			onClick: () => {
				moveLayer('down');
				const editor = getCurrentProjectEditor();
				editor.publish('currentItem', editor.selectedItem);
			},
		},
	];

	// ALIGN
	data.alignActions = [
		{
			title: `Align Left\nMoves all the selected paths so they are left aligned with the leftmost path.`,
			iconName: 'align',
			iconOptions: 'left',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('left');
				editor.publish('currentItem', vGlyph);
			},
		},
		{
			title: `Align Center\nMoves all the selected paths so they are center aligned between the leftmost and rightmost path.`,
			iconName: 'align',
			iconOptions: 'center',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('center');
				editor.publish('currentItem', vGlyph);
			},
		},
		{
			title: `Align Right\nMoves all the selected paths so they are right aligned with the rightmost path.`,
			iconName: 'align',
			iconOptions: 'right',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('right');
				editor.publish('currentItem', vGlyph);
			},
		},
		{
			title: `Align Top\nMoves all the selected paths so they are top aligned with the topmost path.`,
			iconName: 'align',
			iconOptions: 'top',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('top');
				editor.publish('currentItem', vGlyph);
			},
		},
		{
			title: `Align Middle\nMoves all the selected paths so they are middle aligned between the topmost and bottommost path.`,
			iconName: 'align',
			iconOptions: 'middle',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('middle');
				editor.publish('currentItem', vGlyph);
			},
		},
		{
			title: `Align Bottom\nMoves all the selected paths so they are bottom aligned with the bottommost path.`,
			iconName: 'align',
			iconOptions: 'bottom',
			onClick: () => {
				const editor = getCurrentProjectEditor();
				const vGlyph = editor.multiSelect.paths;
				vGlyph.align('bottom');
				editor.publish('currentItem', vGlyph);
			},
		},
	];

	// COMBINE
	data.boolActions = [
		{
			iconName: 'combine',
			disabled: true,
			title: `Combine\nSelect two paths, and combine their paths into a single path.`,
		},
		{
			iconName: 'subtractUsingTop',
			disabled: true,
			title: `Subtract Using Upper\nSelect two paths, and the upper path will be used to cut out an area from the lower path.`,
		},
		{
			iconName: 'subtractUsingBottom',
			disabled: true,
			title: `Subtract Using Lower\nSelect two paths, and the lower path will be used to cut out an area from the upper path.`,
		},
	];

	// PATH POINT
	data.pointActions = [
		{
			iconName: 'insertPathPoint',
			title: `Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one.`,
			disabled: selectedPoints.length !== 1,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let newPoint = editor.multiSelect.paths.singleton.insertPathPoint(
					selectedPoints[0].pointNumber
				);
				editor.multiSelect.points.select(newPoint);
				// editor.publish('currentPathPoint', editor.multiSelect.points.singleton);
			},
		},
		{
			iconName: 'deletePathPoint',
			title: `Delete Path Point\nRemoves the currently selected point or points from the path.`,
			disabled: selectedPaths.length === 0,
			onClick: deleteSelectedPoints,
		},
		{
			iconName: 'resetPathPoint',
			title: `Reset Handles\nMoves the handles of the currently selected point or points to default locations.`,
			disabled: selectedPoints.length !== 1,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.multiSelect.points.resetHandles();
				editor.publish('currentPathPoint', editor.multiSelect.points.singleton);
			},
		},
		{
			iconName: 'round',
			title: `Round point position values\nIf a x or y value for the point or a handle has decimals, it will be rounded to the nearest whole number.`,
			disabled: selectedPoints.length !== 1,
			onClick: () => {
				const editor = getCurrentProjectEditor();
				let point = editor.multiSelect.points.singleton;
				point.roundAll(0);
				editor.publish('currentControlPoint.p', point.p);
			},
		},
	];

	return data[name];
}

// --------------------------------------------------------------
// Individual actions areas
// --------------------------------------------------------------

export function addChildActions(parent, actionsArray) {
	addAsChildren(
		parent,
		actionsArray.map((iconData) => makeActionButton(iconData))
	);
	return parent;
}

// Universal actions
export function makeActionsArea_Universal() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });

	addChildActions(actionsArea, getActionData('allActions'));
	addChildActions(actionsArea, getActionData('addPathActions'));

	// Dev actions for testing
	/*
	let dev = getGlyphrStudioApp().settings.dev;
	if (dev.testActions.length) {
		// DEV
		let devActions = [];
		if (dev.mode) {
			for (let a = 0; a < dev.testActions.length; a++) {
				devActions.push({
					iconName: 'test',
					title: dev.testActions[a].name,
					onClick: dev.testActions[a].onclick,
				});
			}
		}
		// actionsArea.appendChild(makeElement({tag:'h4', content:'test'}));
		addChildActions(actionsArea, getActionData('devActions'));
	}
	*/
	return actionsArea;
}

// Glyph actions
export function makeActionsArea_Glyph() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	addChildActions(actionsArea, getActionData('glyphActions'));
	return actionsArea;
}

// Path actions
export function makeActionsArea_Path(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let alignActions = false;
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
		alignActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
		addChildActions(alignActions, getActionData('alignActions'));
	}

	return alignActions ? [actionsArea, alignActions] : actionsArea;
}

export function makeActionsArea_ComponentInstance(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let alignActions = false;
	let selectedPaths = getCurrentProjectEditor().multiSelect.paths.members;

	if (selectedPaths.length > 0 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'paths'}));
		addChildActions(actionsArea, getActionData('componentInstanceActions'));
	}

	// Layer actions
	if (selectedPaths.length === 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path layers'}));
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'align paths'}));
		alignActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
		addChildActions(alignActions, getActionData('alignActions'));
	}

	return alignActions ? [actionsArea, alignActions] : actionsArea;
}

// Point actions
export function makeActionsArea_PathPoint(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
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


// --------------------------------------------------------------
// Delete selected path / point
// --------------------------------------------------------------

export function deleteSelectedPaths() {
	const editor = getCurrentProjectEditor();
	let msPaths = editor.multiSelect.paths;

	let historyTitle;
	if (msPaths.length > 1) {
		historyTitle = `Deleted ${msPaths.length} paths`;
	} else {
		historyTitle = `Deleted path: ${msPaths.singleton.name}`;
	}

	msPaths.deletePaths();
	editor.history.addState(historyTitle);
	editor.publish('currentItem', editor.multiSelect.paths.virtualGlyph);
}

export function deleteSelectedPoints() {
	const editor = getCurrentProjectEditor();
	let msPoints = editor.multiSelect.points;

	let historyTitle;
	if (msPoints.length > 1) {
		historyTitle = `Deleted ${msPoints.length} path points`;
	} else {
		historyTitle = `Deleted path point: ${msPoints.singleton.pointNumber}`;
	}

	let minDeletedPoint = msPoints.deletePathPoints();
	editor.history.addState(historyTitle);
	let pathSingleton = editor.multiSelect.paths.singleton;
	if (pathSingleton) {
		msPoints.select(pathSingleton.pathPoints[pathSingleton.getPreviousPointNum(minDeletedPoint)]);
	} else {
		editor.publish('whichPathPointIsSelected', editor.multiSelect.paths);
	}
}

// --------------------------------------------------------------
// Layers
// --------------------------------------------------------------

function moveLayer(direction = 'up') {
	const editor = getCurrentProjectEditor();
	const selectedPath = editor.multiSelect.paths.singleton;
	const itemPaths = editor.selectedItem.paths;
	const currentIndex = itemPaths.indexOf(selectedPath);
	let tempPath;

	if (direction === 'down') {
		if (currentIndex > 0 && currentIndex < itemPaths.length) {
			tempPath = itemPaths[currentIndex - 1];
			itemPaths[currentIndex - 1] = itemPaths[currentIndex];
			itemPaths[currentIndex] = tempPath;
		}
	} else {
		if (currentIndex > -1 && currentIndex < itemPaths.length - 1) {
			tempPath = itemPaths[currentIndex + 1];
			itemPaths[currentIndex + 1] = itemPaths[currentIndex];
			itemPaths[currentIndex] = tempPath;
		}
	}
}

// --------------------------------------------------------------
// Combine
// --------------------------------------------------------------
// TODO boolean combine
/*
function combineSelectedPaths() {
	showToast('Combining selected paths... ', 100);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		editor.multiSelect.paths.combine();
		editor.history.addState('combine selected paths');
		// redraw({ calledBy: 'actions panel' });
	}, 200);
}

function combineAllGlyphPaths() {
	showToast('Combining all glyph paths... ', 100);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		editor.selectedItem.combineAllPaths(true);
		editor.history.addState('combine all glyph paths');
		// redraw({ calledBy: 'actions panel' });
	}, 200);
}
*/

// --------------------------------------------------------------
// Copy Paste
// --------------------------------------------------------------
export function clipboardCopy() {
	// log(`clipboardCopy`, 'start');

	const editor = getCurrentProjectEditor();
	let selPaths = [];
	let button = document.getElementById('actionButtonPaste');

	editor.multiSelect.paths.members.forEach((path) => {
		selPaths.push(path.save(true));
	});

	if (selPaths.length) {
		editor.clipboard = {
			paths: selPaths,
			sourceID: editor.selectedItemID,
			dx: 0,
			dy: 0,
		};
		button.removeAttribute('disabled');
	} else {
		editor.clipboard = false;
		button.setAttribute('disabled', 'disabled');
	}

	button.setAttribute('title', makeActionButtonPasteTooltip(selPaths.length));
	// log(editor.clipboard);
	// log(`clipboardCopy`, 'end');
}

export function clipboardPaste() {
	// log('clipboardPaste', 'start');
	const editor = getCurrentProjectEditor();
	let clipboard = editor.clipboard;
	let offsetPaths = clipboard.sourceID === editor.selectedItemID;

	if (clipboard && offsetPaths) {
		clipboard.dx += 20;
		clipboard.dy -= 20;
	}

	if (clipboard && clipboard.paths.length) {
		let newPaths = [];

		let newPath, newName, newSuffix, caret, suffix;
		clipboard.paths.forEach((path) => {
			if (path.objType === 'ComponentInstance') {
				newPath = new ComponentInstance(path);
			} else {
				newPath = new Path(path);
			}

			if (offsetPaths) {
				newPath.updatePathPosition(clipboard.dx, clipboard.dy, true);
			}

			newName = newPath.name;
			newSuffix = ' (copy)';
			caret = newPath.name.lastIndexOf('(copy');

			if (caret > 0) {
				suffix = newName.substring(caret + 5);
				newName = newName.substring(0, caret);
				if (suffix === ')') {
					newSuffix = '(copy 2)';
				} else {
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(1);
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(0, suffix.length - 1);
					// log("\t - suffix " + suffix);
					newSuffix = '(copy ' + (parseInt(suffix) + 1) + ')';
					// log("\t - newSuffix " + newSuffix);
				}
			}
			newPath.name = newName + newSuffix;

			if (newPath.objType === 'ComponentInstance') {
				editor.project.getItem(newPath.link).addToUsedIn(editor.project.selectedItemID);
				// TODO add to used in
			}

			newPaths.push(newPath);
		});

		// log(`New paths that have been copied`);
		// log(newPaths);

		editor.multiSelect.paths.clear();
		editor.multiSelect.points.clear();

		editor.selectedItem.paths = editor.selectedItem.paths.concat(newPaths);
		newPaths.forEach((path) => editor.multiSelect.paths.add(path));

		clipboard.sourceID = editor.selectedItemID;

		let len = newPaths.length;
		editor.history.addState(len === 1 ? 'Pasted Path' : `Pasted ${len} Paths`);
		editor.publish('currentItem', editor.selectedItem);
	}
	// log('clipboardPaste', 'end');
}

export function makeActionButtonPasteTooltip(clipBoardPathCount) {
	let re = `Paste\nAdds the previously-copied path or paths into this glyph.\n\n`;
	re += `Currently ${clipBoardPathCount} Path${
		clipBoardPathCount === 1 ? '' : 's'
	} on the clipboard.`;
	return re;
}

function showDialogChooseOtherGlyph(type) {
	let content = makeElement({
		innerHTML: '<h2>Choose another glyph</h2>',
	});
	let onClick = false;

	if (type === 'copyPaths') {
		content.innerHTML += `
			All the paths from the glyph you select will be copied and pasted into this glyph.<br><br>`;
		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			const otherItem = editor.project.getItem(itemID);
			const thisItem = editor.selectedItem;
			copyPathsFromTo(otherItem, thisItem, false);
			editor.history.addState(`
				Paths were copied from ${otherItem.name}.`);
			closeEveryTypeOfDialog();
			showToast(`${otherItem.paths.length} paths copied from<br>${otherItem.name}`);
		};
	}
	const scrollArea = makeElement({
		tag: 'div',
		className: 'modal-dialog__glyph-chooser-scroll-area',
	});
	const chooserArea = makeGlyphChooserContent(onClick, false, true);
	scrollArea.appendChild(chooserArea);
	content.appendChild(scrollArea);
	showModalDialog(content);
}

/*
function initGetPathsDialogOptions(type) {

		_UI.glyphChooser.getPathOptions = {
				srcAutoWidth: false,
				srcWidth: false,
		};
	type = type || 'paths';
	let gso = _UI.glyphChooser.getPathOptions;

	let content = '<br><br><br><br><h3>Copy options</h3>';

	if (type === 'paths')
		content +=
			'When copying the paths from the other glyph, also copy these attributes to this glyph:';
	else
		content +=
			'When inserting the Component Instance, also copy these attributes from the Root Component to this glyph:';

	content += '<table class="settingstable">';

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

	content += '</table>';

	return content;
}

function pastePathsFrom(sourceGlyphID) {
	const editor = getCurrentProjectEditor();
	let destinationGlyphID = editor.selectedItemID;
	let destinationGlyph = editor.selectedItem;
	let sourceGlyph = editor.project.getItem(sourceGlyphID);
	// TODO hook up options
	let options = false;

	if (sourceGlyphID !== destinationGlyphID && sourceGlyph) {
		copyPathsFromTo(sourceGlyph, destinationGlyph, options);

		showToast('Copied ' + this.paths.length + ' paths');
		redraw({ calledBy: 'pastePathsFrom' });
		editor.history.addState(
			'Copied paths from "' + getGlyphName(sourceGlyphID) + '" to  "' + getSelectedItemName()
		);
		if (_UI.selectedTool === 'pathAddPoint') _UI.selectedTool = 'pathEdit';
		closeDialog();
	} else {
		showDialogGetPaths("Sorry, you can't paste paths from the glyph you selected.<br>");
	}
}
*/

/**
 * Copy paths (and attributes) from one glyph to another
 * @param {Glyph} sourceGlyph - source to copy paths from
 * @param {Glyph} destinationGlyph - where to copy paths to
 * @param {object} updateWidth - should advance width copy as well
 */
export function copyPathsFromTo(sourceGlyph, destinationGlyph, updateWidth = false) {
	log('copyPathsFromTo', 'start');
	log(`Source Glyph`);
	log(sourceGlyph);
	log(`Destination Glyph`);
	log(destinationGlyph);

	const editor = getCurrentProjectEditor();
	const msPaths = editor.multiSelect.paths;
	let tc;
	for (let c = 0; c < sourceGlyph.paths.length; c++) {
		tc = sourceGlyph.paths[c];
		if (tc.objType === 'ComponentInstance') {
			editor.project.getItem(tc.link).addToUsedIn(destinationGlyph.id);
			tc = new ComponentInstance(tc);
		} else if (tc.objType === 'Path') {
			tc = new Path(tc);
		}

		msPaths.add(tc);
		destinationGlyph.paths = destinationGlyph.paths.concat(tc);
	}

	if (updateWidth) {
		destinationGlyph.advanceWidth = sourceGlyph.advanceWidth;
	}

	log('Result for destination glyph:');
	log(destinationGlyph);
	log('copyPathsFromTo', 'end');
}

// --------------------------------------------------------------
// COMPONENT Actions
// --------------------------------------------------------------
// TODO components
/*
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
*/
