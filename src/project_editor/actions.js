import { addCrossProjectCopyShapeOptionControls } from '../app/cross_project_actions/action_copy_shapes.js';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import {
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { eventHandlerData } from '../edit_canvas/events.js';
import { selectTool } from '../edit_canvas/tools/tools.js';
import { makeSingleLabel } from '../panels/cards.js';
import { makeAllItemTypeChooserContent } from '../panels/item_chooser.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import {
	addLinkToUsedIn,
	canAddComponentInstance,
	makeGlyphWithResolvedLinks,
} from './cross_item_actions.js';

// --------------------------------------------------------------
// Delete selected path / point
// --------------------------------------------------------------

export function deleteSelectedPaths() {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;

	let historyTitle;
	if (msShapes.length > 1) {
		historyTitle = `Deleted ${msShapes.length} paths`;
	} else {
		historyTitle = `Deleted path: ${msShapes.singleton.name}`;
	}

	msShapes.deleteShapes();
	editor.history.addState(historyTitle);
	editor.publish('currentItem', editor.multiSelect.shapes.virtualGlyph);
}

export function deleteSelectedPoints() {
	const editor = getCurrentProjectEditor();
	const msPoints = editor.multiSelect.points;

	let historyTitle;
	if (msPoints.length > 1) {
		historyTitle = `Deleted ${msPoints.length} path points`;
	} else {
		historyTitle = `Deleted path point: ${msPoints.singleton.pointNumber}`;
	}

	let minDeletedPoint = msPoints.deleteShapesPoints();
	editor.history.addState(historyTitle);
	let pathSingleton = editor.multiSelect.shapes.singleton;
	if (pathSingleton) {
		msPoints.select(
			pathSingleton.pathPoints[pathSingleton.getPreviousPointNumber(minDeletedPoint)]
		);
	} else {
		editor.publish('whichPathPointIsSelected', editor.multiSelect.shapes);
	}
}

// --------------------------------------------------------------
// Select path points
// --------------------------------------------------------------

export function selectNextPathPoint() {
	const editor = getCurrentProjectEditor();
	const msShapes = editor.multiSelect.shapes;
	if (msShapes.length === 0) {
		const selShape = currentItemFindSelectableShapeAt(0, true);
		if (selShape) msShapes.select(selShape);
		else return;
	}

	let selectedPoint;
	const msPoints = editor.multiSelect.points;
	if (msPoints.length === 0) {
		if (msShapes.members[0].objType === 'ComponentInstance') return;
		selectedPoint = msShapes.members[0].pathPoints[0];
		msPoints.select(selectedPoint);
	} else {
		let path = msPoints.members[0].parent;
		let thisIndex = msPoints.highestSelectedPointNumber;
		let nextIndex = path.getNextPointNumber(thisIndex);

		selectedPoint = path.pathPoints[nextIndex];
		if (eventHandlerData.isShiftDown) {
			msPoints.add(selectedPoint);
		} else {
			msPoints.select(selectedPoint);
		}
	}
	selectTool('pathEdit');
	editor.publish('whichPathPointIsSelected', selectedPoint);
}

export function selectPreviousPathPoint() {
	const editor = getCurrentProjectEditor();
	const msShapes = editor.multiSelect.shapes;
	if (msShapes.length === 0) {
		const selShape = currentItemFindSelectableShapeAt(-1, true);
		if (selShape) msShapes.select(selShape);
		else return;
	}

	let selectedPoint;
	const msPoints = editor.multiSelect.points;
	if (msPoints.length === 0) {
		if (msShapes.members[0].objType === 'ComponentInstance') return;
		let selectedPoint = msShapes.members[0].pathPoints[0];
		msPoints.select(selectedPoint);
	} else {
		let path = msPoints.members[0].parent;
		let thisIndex = msPoints.lowestSelectedPointNumber;
		let previousIndex = path.getPreviousPointNumber(thisIndex);

		selectedPoint = path.pathPoints[previousIndex];
		if (eventHandlerData.isShiftDown) {
			msPoints.add(selectedPoint);
		} else {
			msPoints.select(selectedPoint);
		}
	}
	selectTool('pathEdit');
	editor.publish('whichPathPointIsSelected', selectedPoint);
}

export function currentItemFindSelectableShapeAt(index = 0, onlyPaths = false) {
	log(`currentItemFindSelectableShapeAt`, 'start');
	const editor = getCurrentProjectEditor();
	const selectedItem = editor.selectedItem;
	let foundShape;

	if (index === 0) {
		for (let i = 0; i < selectedItem.shapes.length; i++) {
			if (onlyPaths) {
				if (selectedItem.shapes[i].objType === 'Path') {
					foundShape = selectedItem.shapes[i];
					break;
				}
			} else {
				foundShape = selectedItem.shapes[i];
				break;
			}
		}
	} else if (index === -1) {
		for (let i = selectedItem.shapes.length - 1; i >= 0; i--) {
			if (onlyPaths) {
				if (selectedItem.shapes[i].objType === 'Path') {
					foundShape = selectedItem.shapes[i];
					break;
				}
			} else {
				foundShape = selectedItem.shapes[i];
				break;
			}
		}
	}

	log(`\n⮟foundShape⮟`);
	log(foundShape);
	log(`currentItemFindSelectableShapeAt`, 'end');
	return foundShape || false;
}

// --------------------------------------------------------------
// Layers
// --------------------------------------------------------------

export function moveLayer(direction = 'up') {
	// log(`moveLayer`, 'start');
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes.members;
	const itemShapes = editor.selectedItem.shapes;
	let tempShape, selectedShape, currentIndex;
	// log(`direction: ${direction}`);

	if (msShapes.length === 0) return;
	else if (msShapes.length > 1) {
		if (direction === 'up' || direction === 'down') {
			msShapes = msShapes.sort((a, b) => itemShapes.indexOf(b) - itemShapes.indexOf(a));
		} else {
			msShapes = msShapes.sort((a, b) => itemShapes.indexOf(a) - itemShapes.indexOf(b));
		}
	}

	if (direction === 'up' || direction === 'top') {
		for (let i = 0; i < msShapes.length; i++) {
			// log(`iq: ${i}`);
			selectedShape = msShapes[i];
			currentIndex = itemShapes.indexOf(selectedShape);
			if (currentIndex >= 0) moveOneShapeLayer(direction, currentIndex);
			else log(`Could not find ${i} for ${direction}`);
		}
	} else {
		for (let i = msShapes.length - 1; i >= 0; i--) {
			// log(`iq: ${i}`);
			selectedShape = msShapes[i];
			currentIndex = itemShapes.indexOf(selectedShape);
			if (currentIndex >= 0) moveOneShapeLayer(direction, currentIndex);
			else log(`Could not find ${i} for ${direction}`);
		}
	}

	function moveOneShapeLayer(direction, index) {
		if (direction === 'down') {
			if (index > 0 && index < itemShapes.length) {
				tempShape = itemShapes[index - 1];
				itemShapes[index - 1] = itemShapes[index];
				itemShapes[index] = tempShape;
			}
		} else if (direction === 'bottom') {
			if (index > 0) {
				tempShape = itemShapes[index];
				itemShapes.splice(index, 1);
				itemShapes.unshift(tempShape);
			}
		} else if (direction === 'up') {
			if (index < itemShapes.length - 1) {
				tempShape = itemShapes[index + 1];
				itemShapes[index + 1] = itemShapes[index];
				itemShapes[index] = tempShape;
			}
		} else if (direction === 'top') {
			if (index !== itemShapes.length - 1) {
				tempShape = itemShapes[index];
				itemShapes.splice(index, 1);
				itemShapes.push(tempShape);
			}
		}
	}
	// log(`moveLayer`, 'end');
}

// --------------------------------------------------------------
// Combine
// --------------------------------------------------------------

export function combineSelectedPaths(operation = 'unite') {
	showToast(`Combine: ${operation} - selected shapes... `, 10000);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		let successful = editor.multiSelect.shapes.combine(operation);
		if (successful) editor.history.addState(`Combine: ${operation} - all selected paths`);
	}, 200);
}

export function combineUniteAllGlyphPaths() {
	showToast('Uniting all glyph shapes... ', 10000);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		editor.multiSelect.shapes.selectAll();
		let successful = editor.multiSelect.shapes.combine('unite');
		if (successful) editor.history.addState('Combine: unite - all glyph paths');
	}, 200);
}

// --------------------------------------------------------------
// Copy Paste
// --------------------------------------------------------------
export function clipboardCopy() {
	// log(`clipboardCopy`, 'start');

	const editor = getCurrentProjectEditor();
	let selPaths = [];
	editor.multiSelect.shapes.members.forEach((shape) => {
		selPaths.push(shape.save(true));
	});

	if (selPaths.length) {
		editor.clipboard = {
			shapes: selPaths,
			sourceID: editor.selectedItemID,
			dx: 0,
			dy: 0,
		};
	} else {
		editor.clipboard = false;
	}

	updateClipboardActionIcons(selPaths.length);
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

	if (clipboard && clipboard?.shapes?.length) {
		let newShapes = [];

		let newShape, newName, newSuffix, caret, suffix;
		clipboard.shapes.forEach((shape) => {
			if (shape.objType === 'ComponentInstance') {
				newShape = new ComponentInstance(shape);
			} else {
				newShape = new Path(shape);
			}

			if (offsetPaths) {
				newShape.updateShapePosition(clipboard.dx, clipboard.dy);
			}

			newName = newShape.name;
			newSuffix = ' (copy)';
			caret = newShape.name.lastIndexOf('(copy');

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
			newShape.name = newName + newSuffix;

			if (newShape.objType === 'ComponentInstance' && newShape?.link && editor.selectedItemID) {
				let newShapeLink = '' + newShape.link;
				addLinkToUsedIn(editor.project.getItem(newShapeLink), editor.selectedItemID);
			}

			newShapes.push(newShape);
		});

		// log(`New paths that have been copied`);
		// log(newShapes);

		editor.multiSelect.shapes.clear();
		editor.multiSelect.points.clear();

		const addedShapes = [];
		newShapes.forEach((shape) => {
			addedShapes.push(editor.selectedItem.addOneShape(shape));
		});

		addedShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));

		clipboard.sourceID = editor.selectedItemID;

		let len = newShapes.length;
		editor.history.addState(len === 1 ? 'Pasted Path' : `Pasted ${len} Paths`);
		showToast(
			len === 1
				? 'Pasted Path<br>from the Glyphr Studio clipboard'
				: `Pasted ${len} Paths<br>from the Glyphr Studio clipboard`
		);
		editor.publish('currentItem', editor.selectedItem);
		return true;
	}
	return false;
	// log('clipboardPaste', 'end');
}

export function clipboardClear() {
	const editor = getCurrentProjectEditor();
	editor.clipboard = false;
	updateClipboardActionIcons(0);
}

export function updateClipboardActionIcons(numberOfClipboardItems = 0) {
	const editor = getCurrentProjectEditor();
	let pasteButton = document.querySelector('#actionButtonPaste');
	let clearButton = document.querySelector('#actionButtonClearClipboard');

	if (pasteButton && clearButton) {
		if (editor.clipboard) {
			pasteButton.removeAttribute('disabled');
			clearButton.removeAttribute('disabled');
		} else {
			pasteButton.setAttribute('disabled', 'disabled');
			clearButton.setAttribute('disabled', 'disabled');
		}

		pasteButton.setAttribute('title', makeActionButtonPasteTooltip(numberOfClipboardItems));
		clearButton.setAttribute(
			'title',
			makeActionButtonClearClipboardTooltip(numberOfClipboardItems)
		);
	}
}

export function makeActionButtonPasteTooltip(clipBoardPathCount) {
	let re = `Paste\nAdds the previously-copied shape(s) into this glyph.\n\n`;
	re += `Currently ${clipBoardPathCount} Path${
		clipBoardPathCount === 1 ? '' : 's'
	} on the clipboard.`;
	return re;
}

export function makeActionButtonClearClipboardTooltip(clipBoardPathCount) {
	let re = `Clear Glyphr Studio Clipboard\n`;
	re += `In order to use your Operating System clipboard for copy / paste, the Glyphr Studio clipboard must be empty.\n\n`;
	re += `Currently ${clipBoardPathCount} Path${
		clipBoardPathCount === 1 ? '' : 's'
	} on the clipboard.`;
	return re;
}

export function showDialogChooseOtherItem(actionName = '') {
	// log(`showDialogChooseOtherItem`, 'start');
	// log(`actionName: ${actionName}`);
	let content;
	let onClick;
	let itemChooserType = 'Characters';

	if (actionName === 'copyPaths') {
		content = makeElement({
			innerHTML: `<h2>Copy paths from another glyph</h2>`,
		});
		content.innerHTML += `All the paths from the glyph you select will be copied and pasted into this glyph.<br><br>`;
		addCopyActionsForChooseOtherItem(content);
		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			const otherItem = editor.project.getItem(itemID);
			if (!otherItem || otherItem.shapes.length === 0) {
				showToast(`Item doesn't exist, or has no shapes.`);
				return;
			}
			const thisItem = editor.selectedItem;
			const oldRSB = thisItem.rightSideBearing;
			const newShapes = copyShapesFromTo(otherItem, thisItem, false);
			editor.multiSelect.shapes.clear();
			newShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));
			/** @ts-ignore */
			if (document.querySelector('#checkbox-maintain-rsb').checked) {
				thisItem.rightSideBearing = oldRSB;
			}
			editor.publish('currentItem', thisItem);
			editor.history.addState(`Paths were copied from ${otherItem.name}.`);
			closeEveryTypeOfDialog();
			showToast(`${otherItem.shapes.length} paths copied from<br>${otherItem.name}`);
		};
	}

	if (actionName === 'addAsComponentInstance') {
		// log(`Dialog addAsComponentInstance`, 'start');
		itemChooserType = 'Components';
		content = makeElement({
			innerHTML: `<h2>Add another glyph as a component instance</h2>`,
		});
		content.innerHTML += `The glyph you select will be treated as a root component, and added to this glyph as a component instance.<br><br>`;
		addCopyActionsForChooseOtherItem(content);

		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			let otherItem = editor.project.getItem(itemID);
			if (!otherItem) {
				editor.project.addItemByType(new Glyph({}), 'Glyph', itemID);
				otherItem = editor.project.getItem(itemID);
			}
			const thisItem = editor.selectedItem;
			const oldRSB = thisItem.rightSideBearing;

			editor.history.addWholeProjectChangePreState(
				`Component instance was linked from ${otherItem.name}.`
			);
			const newInstance = linkComponentFromTo(otherItem, thisItem);
			if (newInstance) {
				editor.publish('currentItem', thisItem);
				editor.multiSelect.shapes.add(newInstance);
				/** @ts-ignore */
				if (document.querySelector('#checkbox-maintain-rsb').checked) {
					thisItem.rightSideBearing = oldRSB;
				}
				editor.history.addWholeProjectChangePostState();
				closeEveryTypeOfDialog();
				showToast(`Component instance linked from<br>${otherItem.name}`);
			} else {
				editor.history.queue.shift();
				closeEveryTypeOfDialog();
				showError(`
				Cannot add ${thisItem.name} to ${otherItem.name} as a component instance.
				<br>
				This is usually because adding the link would create a circular reference.
				`);
			}
		};
		// log(`Dialog addAsComponentInstance`, 'end');
	}

	if (actionName === 'linkAsComponent') {
		content = makeElement({
			innerHTML: `<h2>Link this component to another glyph</h2>`,
		});
		content.innerHTML += `This component will be linked to the glyph you select as a component instance.<br><br>`;
		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			let destinationItem = editor.project.getItem(itemID);
			if (!destinationItem) {
				editor.project.addItemByType(new Glyph({}), 'Glyph', itemID);
				destinationItem = editor.project.getItem(itemID);
			}
			editor.history.addWholeProjectChangePreState(
				`Component was linked to ${destinationItem.name}.`
			);
			const thisItem = editor.selectedItem;
			const newInstance = linkComponentFromTo(thisItem, destinationItem);
			if (newInstance) {
				editor.publish('currentItem', thisItem);
				editor.history.addWholeProjectChangePostState();
				closeEveryTypeOfDialog();
				showToast(`Component was linked to<br>${destinationItem.name}`);
			} else {
				editor.history.queue.shift();
				closeEveryTypeOfDialog();
				showError(`
				Cannot add ${thisItem.name} to ${destinationItem.name} as a component instance.
					<br>
					This is usually because adding the link would create a circular reference.
					`);
			}
		};
	}

	const chooserArea = makeAllItemTypeChooserContent(onClick, itemChooserType);
	content.appendChild(chooserArea);
	showModalDialog(content);
	// log(`showDialogChooseOtherItem`, 'end');
}

export function addCopyActionsForChooseOtherItem(parent) {
	parent.appendChild(
		makeElement({
			tag: 'strong',
			content: 'Copy options:',
			style: 'display: inline-block; margin-bottom: 10px;',
		})
	);
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(
		makeElement({
			tag: 'input',
			attributes: { type: 'checkbox' },
			className: 'copy-shapes-options__checkbox',
			id: 'checkbox-maintain-rsb',
		})
	);
	parent.appendChild(
		makeSingleLabel(
			`Maintain right side bearing, accounting for the width of the added items.`,
			false,
			'checkbox-maintain-rsb',
			'copy-shapes-options__label'
		)
	);
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(makeElement({ tag: 'br' }));
}

export function showDialogChooseItemFromOtherProject() {
	let content = makeElement({
		innerHTML: `
			<h2>Copy shapes from a glyph in the other open project</h2>
			All the paths from the glyph you select will be copied and pasted into this glyph.
			<br><br>
			<strong style="display: inline-block; margin-bottom:10px;">Copy options:</strong>
			<br>`,
	});

	const thisEditor = getCurrentProjectEditor();
	const otherEditor = getGlyphrStudioApp().otherProjectEditor;
	addCrossProjectCopyShapeOptionControls(content, otherEditor, thisEditor);

	let onClick = (itemID) => {
		const sourceItem = otherEditor.project.getItem(itemID);
		const resolvedGlyph = makeGlyphWithResolvedLinks(sourceItem);
		const thisItem = thisEditor.selectedItem;
		const emRatio = thisEditor.project.settings.font.upm / otherEditor.project.settings.font.upm;
		// log(`emRatio: ${emRatio}`);

		/**@type {HTMLInputElement} */
		const updateAdvanceWidthBox = document.querySelector('#checkbox-advance-width');
		const updateAdvanceWidth = updateAdvanceWidthBox.checked;
		// log(`updateAdvanceWidth: ${updateAdvanceWidth}`);

		/**@type {HTMLInputElement} */
		const scaleItemsBox = document.querySelector('#checkbox-scale');
		let scaleItems = false;
		if (scaleItemsBox) scaleItems = scaleItemsBox?.checked;
		// log(`scaleItems: ${scaleItems}`);

		/**@type {HTMLInputElement} */
		const reverseWindingsBox = document.querySelector('#checkbox-reverse-windings');
		const reverseWindings = reverseWindingsBox.checked;
		// log(`reverseWindings: ${reverseWindings}`);

		const oldRSB = thisItem.rightSideBearing;
		const newShapes = copyShapesFromTo(resolvedGlyph, thisItem, false);
		const msShapes = thisEditor.multiSelect.shapes;
		msShapes.clear();
		newShapes.forEach((shape) => msShapes.add(shape));

		if (scaleItems) {
			let deltaWidth = resolvedGlyph.advanceWidth * emRatio - resolvedGlyph.advanceWidth;
			// log(`deltaWidth: ${deltaWidth}`);
			msShapes.virtualGlyph.updateGlyphSize({
				width: deltaWidth,
				ratioLock: true,
				transformOrigin: 'baseline-left',
			});
		}

		if (reverseWindings) msShapes.virtualGlyph.reverseWinding();
		if (updateAdvanceWidth) thisItem.rightSideBearing = oldRSB;

		thisEditor.publish('currentItem', thisItem);
		let title = `
			${resolvedGlyph.shapes.length} paths were copied<br>
			from ${otherEditor.project.settings.project.name} : ${resolvedGlyph.name}`;
		thisEditor.history.addState(title);
		closeEveryTypeOfDialog();
		showToast(title);
	};

	const chooserArea = makeAllItemTypeChooserContent(
		onClick,
		'Characters',
		getGlyphrStudioApp().otherProjectEditor
	);
	content.appendChild(chooserArea);
	showModalDialog(content);
}

/**
 * Create a component instance given another item.
 * @param {Glyph} sourceItem - new component root
 * @param {Glyph} destinationItem - where to put the component instance
 */
export function linkComponentFromTo(sourceItem, destinationItem) {
	if (!canAddComponentInstance(destinationItem, sourceItem.id)) return false;
	const newInstance = new ComponentInstance({ link: sourceItem.id });
	destinationItem.addOneShape(newInstance);
	addLinkToUsedIn(sourceItem, destinationItem.id);
	return newInstance;
}

/**
 * Copy paths (and attributes) from one glyph to another
 * @param {Glyph} sourceItem - source to copy paths from
 * @param {Glyph} destinationItem - where to copy paths to
 * @param {Object} updateWidth - should advance width copy as well
 */
export function copyShapesFromTo(sourceItem, destinationItem, updateWidth = false) {
	// log('copyShapesFromTo', 'start');
	// log(`Source item`);
	// log(sourceItem);
	// log(`Destination item`);
	// log(destinationItem);

	const editor = getCurrentProjectEditor();
	let item;
	let newShape;
	let newShapes = [];
	for (let c = 0; c < sourceItem.shapes.length; c++) {
		item = sourceItem.shapes[c];
		if (item.objType === 'ComponentInstance') {
			addLinkToUsedIn(editor.project.getItem(item.link), destinationItem.id);
			item = new ComponentInstance(item);
		} else if (item.objType === 'Path') {
			item = new Path(item);
		}

		newShape = destinationItem.addOneShape(item);
		newShapes.push(newShape);
	}

	if (updateWidth) {
		destinationItem.advanceWidth = sourceItem.advanceWidth;
	}

	// log('Result for destination item:');
	// log(destinationItem);
	// log(`Returning newShapes`);
	// log(newShapes);
	// log('copyShapesFromTo', 'end');
	return newShapes;
}
