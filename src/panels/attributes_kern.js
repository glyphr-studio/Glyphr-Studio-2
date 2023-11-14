import { getCurrentProjectEditor } from '../app/main';
import { makeCard_kernGroup, makeCard_otherKernGroupActions } from './card_kern_group';

// --------------------------------------------------------------
// Kern page attributes panel
// --------------------------------------------------------------

export function makePanel_KernGroupAttributes() {
	// log('makePanel_KernGroupAttributes', 'start');
	const editor = getCurrentProjectEditor();
	// log('makePanel_KernGroupAttributes', 'end');
	return [
		makeCard_kernGroup(editor.selectedKernGroup),
		makeCard_otherKernGroupActions(),
	];
}
