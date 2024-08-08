import { getCurrentProjectEditor } from '../app/main';
import { makeElement } from '../common/dom';
import { countItems } from '../common/functions';
import { showAddEditKernGroupDialog } from '../pages/kerning';
import { makeCard_kernGroup, makeCard_otherKernGroupActions } from './card_kern_group';

// --------------------------------------------------------------
// Kern page attributes panel
// --------------------------------------------------------------

export function makePanel_KernGroupAttributes() {
	// log('makePanel_KernGroupAttributes', 'start');
	const editor = getCurrentProjectEditor();
	// log('makePanel_KernGroupAttributes', 'end');
	if (countItems(editor.project.kerning) <= 0) return [];

	const createButton = makeElement({
		tag: 'fancy-button',
		content: 'Create a new kern group',
		attributes: { secondary: '' },
		onClick: () => showAddEditKernGroupDialog(false),
	});
	
	return [
		makeCard_kernGroup(editor.selectedKernGroup),
		makeCard_otherKernGroupActions(),
		createButton
	];
}
