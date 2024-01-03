import { getCurrentProjectEditor } from '../app/main';
import { countItems } from '../common/functions';
import { makeCard_kernGroup, makeCard_otherKernGroupActions } from './card_kern_group';

// --------------------------------------------------------------
// Kern page attributes panel
// --------------------------------------------------------------

export function makePanel_KernGroupAttributes() {
	// log('makePanel_KernGroupAttributes', 'start');
	const editor = getCurrentProjectEditor();
	// log('makePanel_KernGroupAttributes', 'end');
	if (countItems(editor.project.kerning) <= 0) return [];
	return [
		makeCard_kernGroup(editor.selectedKernGroup),
		makeCard_otherKernGroupActions(),
	];
}
