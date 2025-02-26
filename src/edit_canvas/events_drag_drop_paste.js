import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outlines/svg_outline_import.js';
import { copyShapesFromTo } from '../project_editor/actions.js';
import { cancelDefaultEventActions } from './events.js';

/**
 * Given some SVG code, parse it into Glyphr Studio shapes, and
 * add it to the currently selected item.
 * @param {String} svgData - code imported from dropped file
 * @param {String} sourceText - title for the stuff that was imported
 */
export function importSVGtoCurrentItem(svgData, sourceText = 'SVG') {
	// log(`importSVGtoCurrentItem`, 'start');

	const tempGlyph = ioSVG_convertSVGTagsToGlyph(svgData);

	if (tempGlyph && tempGlyph.shapes.length) {
		// Flip
		tempGlyph.flipNS();
		tempGlyph.reverseWinding();

		// Add new Glyph Shapes
		const editor = getCurrentProjectEditor();
		const newShapes = copyShapesFromTo(tempGlyph, editor.selectedItem);
		// log('tempGlyph');
		// log(tempGlyph);

		// log(`updated item glyph`);
		// log(editor.selectedItem);

		editor.history.addState('Imported SVG to glyph ' + editor.selectedItem.name);
		const msShapes = editor.multiSelect.shapes;
		msShapes.clear();
		newShapes.forEach((shape) => msShapes.add(shape));

		const appSettings = getCurrentProject().settings.app;
		if (appSettings.autoSideBearingsOnSVGDragDrop > -1) {
			const sbValue = appSettings.autoSideBearingsOnSVGDragDrop;
			msShapes.setShapePosition(sbValue);
			editor.selectedItem.advanceWidth = msShapes.maxes.width + sbValue * 2;
		} else if (getCurrentProject().settings.app.moveShapesOnSVGDragDrop) {
			msShapes.setShapePosition(0, msShapes.maxes.height);
		}

		editor.publish('currentItem', editor.selectedItem);
		showToast(`Imported ${tempGlyph.shapes.length} shapes from ${sourceText}`);
	} else {
		// showToast('Could not import pasted SVG code.');
	}
	// log(`importSVGtoCurrentItem`, 'end');
}

/**
 * Handle copy + pasted SVG code on the Edit Canvas
 * @param {KeyboardEvent} event - paste key event
 * @returns nothing
 */
export async function handlePasteSVGonEditCanvas(event) {
	// log(`handlePasteSVGonEditCanvas`, 'start');
	// log(event);
	// Stop data actually being pasted into div
	// cancelDefaultEventActions(event);

	// log(`\n⮟event.clipboardData⮟`);
	// log(event.clipboardData);
	// log(`\n⮟window.clipboardData⮟`);
	// log(window.clipboardData);
	// log(`\n⮟navigator.clipboard⮟`);
	// log(navigator.clipboard);

	// @ts-ignore
	const clipboardData = event.clipboardData || window.clipboardData;
	if (clipboardData) {
		// log(clipboardData);
		let text = clipboardData.getData('Text');
		// log(`clipboardData text: |${text}|`);
		if (text) {
			importSVGtoCurrentItem(text, '<br>the operating system clipboard');
		}
	} else if (navigator?.clipboard?.readText) {
		navigator.clipboard.readText().then((text) => {
			// log(`navigator text: |${text}|`);
			if (text) {
				importSVGtoCurrentItem(text, '<br>the operating system clipboard');
			}
		});
	} else {
		// log(`fallthrough`);
	}

	// log(`handlePasteSVGonEditCanvas`, 'end');
}

/**
 * Handles dragging + dropping a SVG file on the edit canvas.
 * @param {DragEvent} event - drag + drop event
 */
export function handleDropSVGonEditCanvas(event) {
	// log(`handleDropSVGonEditCanvas`, 'start');

	cancelDefaultEventActions(event);

	const filesInput = event.dataTransfer;
	const file = filesInput.files[0];
	// log('\t filename: ' + f.name);

	if (file?.name) {
		const fileNameParts = file.name.split('.');
		const fileSuffix = fileNameParts[fileNameParts.length - 1].toLowerCase();
		// log('\t fileSuffix = ' + fileSuffix);

		const reader = new FileReader();

		if (fileSuffix === 'svg') {
			reader.onload = function () {
				importSVGtoCurrentItem(reader.result.toString(), '<br>from the dropped SVG file');
			};

			reader.readAsText(file);
		} else {
			showToast('Only SVG files can be dropped on the canvas');
		}
	} else {
		showToast('Error reading file.');
	}
	// log(`handleDropSVGonEditCanvas`, 'end');
}
