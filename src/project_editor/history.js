import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { refreshPanel } from '../panels/panels.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { KernGroup } from '../project_data/kern_group.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/
export class History {
	constructor() {
		this.queue = [];
		this.initialTimeStamp = false;
		this.initialProject = false;
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * 	- For normal changes, call addState after change is made
	 * 	- For deleting items, call addState before deletion, and mark as itemWasDeleted
	 * @param {String} changeTitle - What to call this change in the History panel
	 * @param {Object} itemWasDeleted - flag so the item can be added back to the project
	 */
	addState(title = '', itemWasDeleted = false) {
		// log(`History.addState`, 'start');
		const editor = getCurrentProjectEditor();
		const changedItem = editor.selectedItem;
		title = title || `Change to ${changedItem.name}`;
		const entry = makeHistoryEntry({
			itemID: editor.selectedItemID,
			title: title,
			page: editor.nav.page,
			changedItem: changedItem,
			itemWasDeleted: itemWasDeleted,
		});

		// log(`New entry:`);
		// log(entry);
		this.queue.unshift(entry);

		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		const undoButton = document.getElementById('actionButtonUndo');
		if (undoButton) undoButton.removeAttribute('disabled');
		// log(this);
		// log(`History.addState`, 'end');
	}

	/**
	 * Get the latest change, and restore it to the currently selected item.
	 * The current state is at queue index 0, so to undo we need to take two
	 * steps back and restore queue index 1.
	 */
	restoreState() {
		// log(`History.restoreState`, 'start');
		const editor = getCurrentProjectEditor();

		let q = this.queue;

		// --------------------------------------------------------------
		// Check for empty queue
		// --------------------------------------------------------------

		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
			showToast(`No more undo`);
			// log(`Queue is 0, returning`);
			// log(`History.restoreState`, 'end');
			return;
		}

		// --------------------------------------------------------------
		// Check if next item is different than current item
		// --------------------------------------------------------------

		if (q.length > 1 && q[0].itemID !== q[1].itemID) {
			// Assumes navigate adds an entry to the queue
			editor.nav.page = q[1].page;
			editor.selectedItemID = q[1].itemID;
			q.shift();
			editor.navigate();

			if (q[0]?.itemWasDeleted) {
				showToast(`Restored deleted item<br>${q[0].itemState.name}`);
			} else {
				showToast('Navigated without undo-ing');
				// log(`Need to navigate to next changed item`);
				// log(`History.restoreState`, 'end');
				return;
			}
		}

		// --------------------------------------------------------------
		// get the next item
		// --------------------------------------------------------------

		let nextEntry;
		if (q.length === 1) {
			// With only one change in the queue, undo falls back to the initial project state
			// log(this.initialProject);
			let baseItemState;
			let baseItem;
			if (editor.nav.page === 'Characters') {
				// log(`editor.selectedGlyphID : ${editor.selectedGlyphID}`);
				baseItem = this.initialProject.glyphs[editor.selectedGlyphID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Ligatures') {
				// log(`editor.selectedLigatureID : ${editor.selectedLigatureID}`);
				baseItem = this.initialProject.ligatures[editor.selectedLigatureID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Components') {
				// log(`editor.selectedComponentID : ${editor.selectedComponentID}`);
				baseItem = this.initialProject.components[editor.selectedComponentID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Kerning') {
				// log(`editor.selectedKernGroupID : ${editor.selectedKernGroupID}`);
				baseItem = this.initialProject.kerning[editor.selectedKernGroupID];
				// log(baseItem);
				baseItemState = baseItem.save();
			}
			nextEntry = {
				itemState: baseItemState,
				itemID: editor.selectedItemID,
				title: 'Initial state',
			};
			// log(`Queue length was 1, setting 'nextEntry' to base project`);
			// log(nextEntry);
		} else {
			nextEntry = q[1];
		}

		// --------------------------------------------------------------
		// proceed with the undo
		// --------------------------------------------------------------

		// log(`Undoing to: ${nextEntry.title}`);
		// log(`nextEntry:`);
		// log(nextEntry);

		// Clear selections
		editor.multiSelect.points.clear();
		editor.multiSelect.shapes.clear();

		// Overwrite the current item with the redo state
		// log(editor.selectedItem.print());
		// log(`overwriting ${editor.selectedItem.name}`);
		editor.selectedItem = nextEntry.itemState;
		// log(editor.selectedItem.print());

		// Index 0 is the previous current state, so remove it
		q.shift();

		editor.publish('currentItem', editor.selectedItem);

		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
		}
		// log(q);
		// log(`History.restoreState`, 'end');
	}
}

function makeHistoryEntry({ itemID, title = '', changedItem, page = '', itemWasDeleted = false }) {
	let item;
	if (page === 'Kerning') {
		item = new KernGroup(changedItem.save());
	} else {
		item = new Glyph(changedItem.save());
	}

	let newEntry = {
		timeStamp: new Date().getTime(),
		itemID: itemID,
		title: title,
		page: page,
		itemState: item,
		itemWasDeleted: itemWasDeleted,
	};

	return newEntry;
}
