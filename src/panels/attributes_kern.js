import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { showAddEditKernGroupDialog } from '../pages/kerning.js';
import { makeCard_itemNavigation } from './card_glyph.js';
import { makeCard_kernGroup, makeCard_otherKernGroupActions } from './card_kern_group.js';

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
		makeCard_itemNavigation(editor.selectedItem),
		createButton,
	];
}
