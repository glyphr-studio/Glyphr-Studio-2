import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { getFilesFromFilePicker } from '../app/open_project.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { showError, showToast } from '../controls/dialogs/dialogs.js';
import { importSVGtoCurrentItem } from '../edit_canvas/events_drag_drop_paste.js';
import { rectPathFromMaxes } from '../edit_canvas/tools/new_basic_path.js';
import { addComponent } from '../pages/components.js';
import {
	showAddEditKernGroupDialog,
	showDeleteSingleLetterPairDialog,
	showFindSingleLetterPairDialog,
} from '../pages/kerning.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import {
	clipboardClear,
	clipboardCopy,
	clipboardPaste,
	combineSelectedPaths,
	combineUniteAllGlyphPaths,
	copyShapesFromTo,
	deleteSelectedPaths,
	deleteSelectedPoints,
	makeActionButtonClearClipboardTooltip,
	makeActionButtonPasteTooltip,
	moveLayer,
	selectNextPathPoint,
	selectPreviousPathPoint,
	showDialogChooseItemFromOtherProject,
	showDialogChooseOtherItem,
} from '../project_editor/actions.js';
import {
	addLinkToUsedIn,
	makeGlyphSVGforExport,
	removeLinkFromUsedIn,
} from '../project_editor/cross_item_actions.js';
import { saveTextFile } from '../project_editor/file_io.js';
import { makeActionButton } from './action_buttons.js';
import { refreshPanel } from './panels.js';

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
	// log(`getActionData`, 'start');
	// log(`name: ${name}`);
	const editor = getCurrentProjectEditor();
	let selectedPaths = editor.multiSelect.shapes.members;
	let selectedPoints = editor.multiSelect.points.members;
	let actionData = {};
	let clipBoardShapes = editor.clipboard.shapes;
	let clipBoardPathCount = clipBoardShapes ? clipBoardShapes.length : 0;
	let historyLength = editor.history.queue.length;

	// UNIVERSAL ACTIONS
	if (name === 'allActions') {
		actionData = [
			{
				iconName: 'copy',
				iconOptions: !clipBoardShapes,
				title: `Copy\nAdds the selected shape(s) to the clipboard.`,
				disabled: !editor.multiSelect.shapes.length,
				id: 'actionButtonCopy',
				onClick: clipboardCopy,
			},
			{
				iconName: 'paste',
				iconOptions: !clipBoardShapes,
				title: makeActionButtonPasteTooltip(clipBoardPathCount),
				disabled: !clipBoardShapes,
				id: 'actionButtonPaste',
				onClick: clipboardPaste,
			},
			{
				iconName: 'clearClipboard',
				iconOptions: !clipBoardShapes,
				title: makeActionButtonClearClipboardTooltip(clipBoardPathCount),
				disabled: !clipBoardShapes,
				id: 'actionButtonClearClipboard',
				onClick: clipboardClear,
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

		if (editor.nav.page === 'Components') {
			actionData.push({
				iconName: 'linkToGlyph',
				title: `Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance.`,
				onClick: () => {
					showDialogChooseOtherItem('linkAsComponent');
				},
			});
		}
	}

	// ADDING PATH STUFF
	if (name === 'addShapeActions') {
		actionData = [
			{
				iconName: 'addShape',
				iconOptions: false,
				title: `Add Path\nCreates a new default path and adds it to this glyph.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let newPath = editor.selectedItem.addOneShape(rectPathFromMaxes());
					editor.history.addState(`Added a default rectangle path`);
					editor.multiSelect.shapes.select(newPath);
					editor.publish('whichShapeIsSelected', newPath);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'addShape',
				iconOptions: true,
				title: `Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph.`,
				onClick: () => {
					showDialogChooseOtherItem('addAsComponentInstance');
				},
			},
			{
				iconName: 'pastePathsFromAnotherGlyph',
				title: `Get Paths\nChoose another Glyph, and copy all the paths from that glyph to this one.`,
				onClick: () => {
					showDialogChooseOtherItem('copyPaths');
				},
			},
			{
				iconName: 'pastePathsFromAnotherProject',
				title: `Get Paths From Another Project\nChoose another Glyph from the other open project, and copy all the paths from that glyph to this one.`,
				onClick: () => {
					showDialogChooseItemFromOtherProject();
				},
				disabled: getGlyphrStudioApp().projectEditors.length === 1,
			},
		];
	}

	// GLYPH
	if (name === 'glyphActions') {
		actionData = [
			{
				iconName: 'flipHorizontal',
				title: `Flip Vertical\nReflects the glyph vertically.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.flipEW();
					editor.history.addState(`Flipped all shapes in this glyph vertically`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipVertical',
				title: `Flip Horizontal\nReflects the glyph horizontally.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.flipNS();
					editor.history.addState(`Flipped all shapes in this glyph horizontally`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'transforms',
				title: 'Transform\nScale, rotate, or skew the currently selected shape(s).',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const newPolySegment = editor.selectedItem.shapes[0].makePolySegment().makeOffsetPolySegment(-100);
					editor.selectedItem.addOneShape(newPolySegment.path);
					editor.history.addState(`Transformed the first shape in this glyph`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: `Round all path point and handle position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.roundAll();
					editor.history.addState(
						`Rounded all the path point and handle position values in this glyph`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for all path points in this glyph.');
				},
			},
			{
				iconName: 'combine_unite',
				title: `Combine all paths: Unite\nMerges all paths in this glyph into as few paths as possible.`,
				disabled: editor.selectedItem?.shapes?.length < 2,
				onClick: combineUniteAllGlyphPaths,
			},
			{
				iconName: 'deleteGlyph',
				title: `Delete Glyph\nRemove this Glyph from the project. \nDon't worry, you can undo this action.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const name = editor.selectedItem.name;
					editor.deleteSelectedItemFromProject();
					editor.history.addState(`Automatically navigated to ${editor.selectedItem.name}`);
					// log(`New item id: ${editor.selectedItemID}`);
					editor.publish('whichGlyphIsSelected', editor.selectedItemID);
					showToast(`
						Deleted ${name}.<br>
						(Don't worry, this action can be undone)<br>
						Navigated to ${editor.selectedItem.name}
					`);
				},
			},
			{
				iconName: 'exportGlyphSVG',
				title: `Export glyph SVG File\nGenerate a SVG file that only includes the SVG outline for this glyph. This file can be dragged and dropped directly to another Glyphr Studio project edit canvas, allowing for copying glyph paths between projects.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let content = makeGlyphSVGforExport(editor.selectedItem);
					let name = editor.selectedItem.name;
					saveTextFile(name + '.svg', content);
				},
			},
			{
				iconName: 'importGlyphSVG',
				title: `Import paths from a SVG File\nUsing the file picker dialog, select a SVG file. Outlines will be imported and added to this glyph.\nYou can also just drag and drop a SVG file onto the edit canvas to import it.`,
				onClick: async () => {
					getFilesFromFilePicker(
						async (files) => {
							// log(`ACTION importGlyphSVG`, 'start');
							// log(files);
							let file;
							if (files[0]) {
								let fileInput = files[0];
								// log(fileInput);
								if (fileInput.getFile) file = await fileInput.getFile();
								else if (fileInput.getAsFile) file = await fileInput.getAsFile();
								else file = fileInput;
							} else {
								showError(`No files were found that could be imported.`);
							}
							// log(file);
							let fileSuffix = file.name.split('.');
							fileSuffix = fileSuffix[fileSuffix.length - 1].toLowerCase();
							// log('\t fileSuffix = ' + fileSuffix);

							const reader = new FileReader();

							if (fileSuffix === 'svg') {
								reader.onload = function () {
									importSVGtoCurrentItem(
										reader.result.toString(),
										'<br>from the imported SVG file'
									);
								};

								reader.readAsText(file);
							} else {
								showToast('Only SVG files can be imported to a glyph.');
							}
						},
						{
							types: [
								{
									description: 'SVG Files',
									accept: {
										'image/svg+xml': ['.svg'],
									},
								},
							],
							excludeAcceptAllOption: true,
							multiple: false,
						}
					);
					// log(`ACTION importGlyphSVG`, 'end');
				},
			},
		];
	}

	// PATH
	if (name === 'shapeActions') {
		actionData = [
			{
				iconName: 'copy',
				iconOptions: !clipBoardShapes,
				title: `Copy\nAdds the selected shape(s) to the clipboard.`,
				id: 'actionButtonCopyPath',
				onClick: clipboardCopy,
			},
			{
				iconName: 'deleteShape',
				title: 'Delete\nRemoves the currently selected shape(s) from this glyph.',
				onClick: deleteSelectedPaths,
			},
			{
				iconName: 'switchPathComponent',
				iconOptions: false,
				title: `Turn Path into a Component Instance\nTakes the selected path and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.history.addWholeProjectChangePreState('Turned a path into a component instance');
					const newComponent = new Glyph({
						objType: 'Component',
						name: `Component ${countItems(editor.project.components)}`,
					});
					editor.multiSelect.shapes.members.forEach((shape) => {
						if (shape.objType === 'Path') {
							newComponent.addOneShape(new Path(shape));
						} else if (shape.objType === 'ComponentInstance') {
							newComponent.addOneShape(new ComponentInstance(shape));
						}
						name += ' ' + shape.name;
					});
					const addedComponent = addComponent(newComponent);
					if (editor.selectedItemID) addLinkToUsedIn(addedComponent, editor.selectedItemID);
					const newShape = editor.selectedItem.addOneShape(
						new ComponentInstance({
							link: addedComponent.id,
						})
					);
					editor.multiSelect.shapes.deleteShapes();
					editor.history.addWholeProjectChangePostState();
					editor.multiSelect.shapes.select(newShape);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipHorizontal',
				title: 'Flip Horizontal\nReflects the currently selected shape(s) horizontally.',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.flipEW();
					editor.history.addState(`Flipped shape ${shape.name} horizontally`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipVertical',
				title: 'Flip Vertical\nReflects the currently selected shape(s) vertically',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.flipNS();
					editor.history.addState(`Flipped shape ${shape.name} vertically`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'transforms',
				title: 'Transform\nScale, rotate, or skew the currently selected shape(s).',
				onClick: () => {
					// const editor = getCurrentProjectEditor();
					// let shape = editor.multiSelect.shapes.virtualGlyph;
					// shape.flipNS();
					// editor.history.addState(`Flipped shape ${shape.name} vertically`);
					// editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: `Round all path point and handle position values\nIf a x or y value for any point or a handle in the path has decimals, it will be rounded to the nearest whole number.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.roundAll();
					editor.history.addState(
						`Rounded all the path point and handle position values in this shape`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for all the path points in the selected paths.');
				},
			},
		];
	}

	// COMPONENT INSTANCE
	if (name === 'componentInstanceActions') {
		actionData = [
			{
				iconName: 'switchPathComponent',
				iconOptions: true,
				title: `Turn Component Instance into a Path\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's paths as regular Paths to this glyph.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.history.addWholeProjectChangePreState('Turned a component instance into a path');
					let newShapes = [];
					editor.multiSelect.shapes.members.forEach((shape) => {
						if (shape.objType === 'ComponentInstance') {
							const sourceItem = editor.project.getItem(shape.link);
							// log(`\n⮟sourceItem⮟`);
							// log(sourceItem);
							const transformedGlyph = shape.transformedGlyph;
							// log(`\n⮟transformedGlyph⮟`);
							// log(transformedGlyph);
							newShapes = newShapes.concat(copyShapesFromTo(transformedGlyph, editor.selectedItem));
							if (editor.selectedItemID) removeLinkFromUsedIn(sourceItem, editor.selectedItemID);
						}
					});
					// log(`\n⮟editor.selectedItem⮟`);
					// log(editor.selectedItem);
					editor.multiSelect.shapes.deleteShapes();
					newShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));
					editor.history.addWholeProjectChangePostState();
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'deleteShape',
				iconOptions: true,
				title: 'Delete\nRemoves the currently selected component instance from this glyph.',
				onClick: deleteSelectedPaths,
			},
		];
	}

	// KERN GROUP
	if (name === 'kernGroupActions') {
		actionData = [
			{
				iconName: 'edit',
				title: 'Edit this kern group',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					showAddEditKernGroupDialog(editor.selectedKernGroup);
				},
			},
			{
				iconName: 'delete',
				title: 'Delete this kern group',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const name = editor.selectedKernGroupID;
					editor.deleteSelectedItemFromProject();
					editor.history.addState(`Automatically navigated to ${editor.selectedItemID}`);
					editor.publish('whichKernGroupIsSelected', editor.selectedItemID);
					showToast(`
						Deleted ${name}.<br>
						(Don't worry, this action can be undone)<br>
						Navigated to ${editor.selectedItem.name}
					`);
				},
			},
		];
	}

	// OTHER KERN GROUP STUFF (GLOBAL)
	if (name === 'otherKernGroupActions') {
		actionData = [
			{
				iconName: 'findSingleLetterPair',
				title: 'Find instances of a single letter pair across all kern groups',
				onClick: showFindSingleLetterPairDialog,
			},
			{
				iconName: 'deleteSingleLetterPair',
				title: 'Find and delete a single letter pair from all kern groups',
				onClick: showDeleteSingleLetterPairDialog,
			},
		];
	}

	// LAYERS
	if (name === 'layerActions') {
		actionData = [
			{
				iconName: 'moveLayerUp',
				title: `Move Shapes Up\nMoves shapes up in the layer order.`,
				onClick: () => {
					moveLayer('up');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layers up`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'moveLayerTop',
				title: `Move Shapes to the Top\nMoves shapes to the top of the layer order.`,
				onClick: () => {
					moveLayer('top');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layers to the top`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'moveLayerDown',
				title: `Move Shapes Down\nMoves shapes down in the layer order.`,
				onClick: () => {
					moveLayer('down');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layers down`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'moveLayerBottom',
				title: `Move Shapes to the Bottom\nMoves shapes to the bottom of the layer order.`,
				onClick: () => {
					moveLayer('bottom');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layers to the bottom`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
		];
	}

	// ALIGN SHAPES
	if (name === 'alignShapeActions') {
		actionData = [
			{
				title: `Align Shapes: Left\nMoves all the selected shape so they are left aligned with the leftmost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'left',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('left');
					editor.history.addState(`Left aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Shapes: Center\nMoves all the selected shapes so they are center aligned between the leftmost and rightmost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'center',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('center');
					editor.history.addState(`Center aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Shapes: Right\nMoves all the selected shapes so they are right aligned with the rightmost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'right',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('right');
					editor.history.addState(`Right aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Shapes: Top\nMoves all the selected shapes so they are top aligned with the topmost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'top',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('top');
					editor.history.addState(`Top aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Shapes: Middle\nMoves all the selected shapes so they are middle aligned between the topmost and bottommost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'middle',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('middle');
					editor.history.addState(`Middle aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Shapes: Bottom\nMoves all the selected shapes so they are bottom aligned with the bottommost shape.`,
				iconName: 'align_shapes',
				iconOptions: 'bottom',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('bottom');
					editor.history.addState(`Bottom aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
		];
	}

	// ALIGN PATH POINTS
	if (name === 'alignPointActions') {
		actionData = [
			{
				iconName: 'align_points',
				iconOptions: 'left',
				title: `Align Path Points: Left\nMoves all the selected points so they are left aligned with the leftmost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('left');
					editor.history.addState(`Left aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
			{
				iconName: 'align_points',
				iconOptions: 'center',
				title: `Align Path Points: Center\nMoves all the selected points so they are center aligned between the leftmost and rightmost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('center');
					editor.history.addState(`Center aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
			{
				iconName: 'align_points',
				iconOptions: 'right',
				title: `Align Path Points: Right\nMoves all the selected points so they are right aligned with the rightmost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('right');
					editor.history.addState(`Right aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
			{
				iconName: 'align_points',
				iconOptions: 'top',
				title: `Align Path Points: Top\nMoves all the selected points so they are top aligned with the topmost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('top');
					editor.history.addState(`Top aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
			{
				iconName: 'align_points',
				iconOptions: 'middle',
				title: `Align Path Points: Middle\nMoves all the selected points so they are middle aligned between the topmost and bottommost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('middle');
					editor.history.addState(`Middle aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
			{
				iconName: 'align_points',
				iconOptions: 'bottom',
				title: `Align Path Points: Bottom\nMoves all the selected points so they are bottom aligned with the bottommost point.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vShape = editor.multiSelect.points;
					vShape.align('bottom');
					editor.history.addState(`Bottom aligned ${editor.multiSelect.points.length} points`);
					editor.publish('currentItem', vShape);
				},
			},
		];
	}

	// COMBINE
	if (name === 'boolActions') {
		actionData = [
			{
				iconName: 'combine_unite',
				title: `Combine Shapes: Unite\nMerges selected paths into as few paths as possible.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('unite'),
			},
			{
				iconName: 'combine_divide',
				title: `Combine Shapes: Divide\nUses the outlines of all overlapping shapes to slice and divide.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('divide'),
			},
			{
				iconName: 'combine_subtract',
				title: `Combine Shapes: Subtract\nUses the topmost shape in the stack to cut away all shapes below it.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('subtract'),
			},
			{
				iconName: 'combine_exclude',
				title: `Combine Shapes: Exclude\nOnly keeps the portions of shapes that are not overlapping.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('exclude'),
			},
			{
				iconName: 'combine_intersect',
				title: `Combine Shapes: Intersect\nOnly keeps the portion of shapes that overlap.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('intersect'),
			},
		];
	}

	// PATH POINT
	if (name === 'pointActions') {
		actionData = [
			{
				iconName: 'insertPathPoint',
				title: `Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one.`,
				disabled: selectedPoints.length !== 1,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let newPoint = editor.multiSelect.shapes.singleton.insertPathPoint(
						selectedPoints[0].pointNumber
					);
					editor.history.addState(`Inserted a new path point at position ${newPoint.pointNumber}`);
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
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.multiSelect.points.resetHandles();
					editor.history.addState(
						`Reset the handles for ${editor.multiSelect.points.length} path point(s)`
					);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: `Round path point and handle position values\nIf a x or y value for the point or a handle has decimals, it will be rounded to the nearest whole number.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.multiSelect.points.roundAll(0);
					editor.history.addState(
						`Rounded path point and handle position values for ${editor.multiSelect.points.length} path point(s)`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for the selected path points.');
				},
			},
			{
				iconName: 'mergePathPoints',
				title: `Merge Path Points\nMerges selected path points into a single path point.`,
				disabled: !getCurrentProjectEditor().multiSelect.points.canMergeSelectedPathPoints(),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.multiSelect.points.mergePathPoints();
					editor.history.addState(`Merged path points`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'selectPreviousPathPoint',
				disabled: editor.multiSelect.points.hasMultipleParents,
				title: `Select pervious Path Point\nSelect the path point that comes before the currently selected path point.\nHold [Ctrl] to add the previous path point to the selection.`,
				onClick: selectPreviousPathPoint,
			},
			{
				iconName: 'selectNextPathPoint',
				disabled: editor.multiSelect.points.hasMultipleParents,
				title: `Select next Path Point\nSelect the path point that comes after the currently selected path point.\nHold [Ctrl] to add the next path point to the selection.`,
				onClick: selectNextPathPoint,
			},
		];
	}

	// log(`\n⮟actionData⮟`);
	// log(actionData);
	// log(`getActionData`, 'end');
	return actionData;
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
	addChildActions(actionsArea, getActionData('addShapeActions'));

	// Dev actions for testing

	let dev = getGlyphrStudioApp().settings.dev;
	if (dev.testActions.length) {
		// DEV
		let devActions = [];
		if (dev.mode) {
			for (let a = 0; a < dev.testActions.length; a++) {
				devActions.push({
					iconName: 'test',
					title: dev.testActions[a].name,
					onClick: dev.testActions[a].onClick,
				});
			}
		}
		// actionsArea.appendChild(makeElement({tag:'h4', content:'test'}));
		addChildActions(actionsArea, devActions);
	}

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
	let multiActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let selectedPaths = getCurrentProjectEditor().multiSelect.shapes.members;

	if (selectedPaths.length > 0 || test) {
		addChildActions(actionsArea, getActionData('shapeActions'));
	}

	// Boolean combine actions
	if (selectedPaths.length > 1 || test) {
		addChildActions(multiActions, getActionData('boolActions'));
	}

	// Layer actions
	if (selectedPaths.length || test) {
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		addChildActions(multiActions, getActionData('alignShapeActions'));
	}

	return selectedPaths.length > 1 ? [actionsArea, multiActions] : actionsArea;
}

export function makeActionsArea_ComponentInstance(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let alignShapeActions = false;
	let selectedPaths = getCurrentProjectEditor().multiSelect.shapes.members;

	if (selectedPaths.length > 0 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'paths'}));
		addChildActions(actionsArea, getActionData('componentInstanceActions'));
	}

	// Layer actions
	if (selectedPaths.length || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path layers'}));
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'align paths'}));
		// @ts-expect-error 'property does exist'
		alignShapeActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
		addChildActions(alignShapeActions, getActionData('alignShapeActions'));
	}

	return alignShapeActions ? [actionsArea, alignShapeActions] : actionsArea;
}

// Point actions
export function makeActionsArea_PathPoint(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let selectedPoints = getCurrentProjectEditor().multiSelect.points;
	let isPointSelected = false;
	let alignPointActions = false;
	if (selectedPoints.length > 0) isPointSelected = true;
	// if (_UI.selectedTool !== 'pathEdit') isPointSelected = false;

	if (isPointSelected || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path point'}));
		addChildActions(actionsArea, getActionData('pointActions'));
	}

	if (selectedPoints.length > 1 || test) {
		// @ts-expect-error 'property does exist'
		alignPointActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
		addChildActions(alignPointActions, getActionData('alignPointActions'));
	}

	return alignPointActions ? [actionsArea, alignPointActions] : actionsArea;
}

// Kern Group actions
export function makeActionsArea_KernGroup() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	addChildActions(actionsArea, getActionData('kernGroupActions'));
	return actionsArea;
}
