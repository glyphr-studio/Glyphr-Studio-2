import { getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { ioSVG_convertSVGTagsToGlyph } from '../io/svg_outline_import.js';
import { copyPathsFromTo } from '../panels/actions.js';
import { cancelDefaultEventActions } from './events.js';

export function importSVGtoCurrentWorkItem(svgData) {
	// log(`importSVGtoCurrentWorkItem`, 'start');

	const tempGlyph = ioSVG_convertSVGTagsToGlyph(svgData);

	if (tempGlyph) {
		// Flip
		tempGlyph.flipNS();
		tempGlyph.reverseWinding();

		// Add new Glyph Shapes
		const editor = getCurrentProjectEditor();
		copyPathsFromTo(tempGlyph, editor.selectedItemID);
		// log('tempGlyph');
		// log(tempGlyph);

		// log(`updated item glyph`);
		// log(editor.selectedItem);

		editor.publish('currentGlyph', editor.selectedItem);
		editor.history.addState('Pasted SVG to glyph ' + editor.selectedItem.name);
		showToast('Pasted ' + tempGlyph.paths.length + ' paths from SVG');
	} else {
		// showToast('Could not import pasted SVG code.');
	}
	// log(`importSVGtoCurrentWorkItem`, 'end');
}

export function handlePasteSVGonEditCanvas(event) {
	// log(event);
	// Stop data actually being pasted into div
	cancelDefaultEventActions(event);

	// Get pasted data via clipboard API
	const clipboardData = event.clipboardData || window.Clipboard;
	if (!clipboardData) {
		// log(`\t No clipboardData`);
		return;
	}

	const pasteData = clipboardData.getData('Text');
	// log(pasteData);
	importSVGtoCurrentWorkItem(pasteData);
}

export function handleDropSVGonEditCanvas(event) {
	// log(`handleDropSVGonEditCanvas`, 'start');

	cancelDefaultEventActions(event);

	let f = event.dataTransfer;
	f = f.files[0] || '';
	// log('\t filename: ' + f.name);
	let fname = f.name.split('.');
	fname = fname[fname.length - 1].toLowerCase();
	// log('\t fname = ' + fname);

	const reader = new FileReader();

	if (fname === 'svg') {
		reader.onload = function () {
			importSVGtoCurrentWorkItem(reader.result);
		};

		reader.readAsText(f);
	} else {
		showToast('Only SVG files can be dropped on the canvas');
	}
	// log(`handleDropSVGonEditCanvas`, 'end');
}
